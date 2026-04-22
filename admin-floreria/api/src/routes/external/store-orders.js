const express = require("express");
const crypto = require("crypto");
const { Prisma } = require("@prisma/client");
const { db: prisma } = require("../../lib/prisma");
const cloudinary = require("../../lib/cloudinary");
const emailService = require("../../services/emailService");
const { buildStorefrontOrderDetails } = require("../../utils/storefrontOrderDetails");

const router = express.Router();

function parseMoney(value) {
  const normalized = String(value ?? "")
    .trim()
    .replace(/[^0-9,.-]+/g, "")
    .replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

/**
 * POST /api/external/store-orders
 * Crear una orden desde la tienda publica.
 */
router.post("/", async (req, res) => {
  try {
    const {
      productId,
      productName,
      productPrice,
      quantity = 1,
      receiverName,
      receiverPhone,
      senderName,
      senderEmail,
      senderPhone,
      phone,
      deliveryDateTime,
      exactAddress,
      sector,
      shippingCost,
      cardMessage,
      observations,
      paymentMethod,
      total,
      couponCode,
    } = req.body;

    if (!receiverName || !senderName || !phone || !total) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios: nombre del receptor, emisor, telefono y total.",
      });
    }

    let couponDiscountAmount = 0;
    let couponId = null;
    let appliedCouponCode = null;

    if (couponCode) {
      const now = new Date();
      const coupon = await prisma.coupons.findFirst({
        where: {
          code: String(couponCode).toUpperCase(),
          isActive: true,
          validFrom: { lte: now },
          validUntil: { gte: now },
        },
      });

      if (coupon) {
        const subtotalBeforeCoupon = parseMoney(total) - parseMoney(shippingCost);
        if (coupon.minAmount && subtotalBeforeCoupon < coupon.minAmount) {
          return res.status(400).json({
            status: "error",
            message: `El cupon requiere una compra minima de $${coupon.minAmount}`,
          });
        }

        couponDiscountAmount =
          coupon.type === "PERCENTAGE"
            ? subtotalBeforeCoupon * (coupon.value / 100)
            : coupon.value;

        couponId = coupon.id;
        appliedCouponCode = coupon.code;
      }
    }

    const orderNumber = `DIFIORI-${Date.now()}`;
    const storefrontDetails = buildStorefrontOrderDetails({
      senderName,
      senderEmail,
      senderPhone,
      receiverName,
      receiverPhone,
      phone,
      deliveryDateTime,
      exactAddress,
      sector,
      cardMessage,
      observations,
      paymentMethod,
    });

    let resolvedProductId = null;
    if (productId) {
      const product = await prisma.product.findFirst({
        where: { id: String(productId), isActive: true },
        select: { id: true },
      });
      resolvedProductId = product?.id || null;
    }

    if (!resolvedProductId && productName) {
      const product = await prisma.product.findFirst({
        where: {
          name: { contains: productName, mode: "insensitive" },
          isActive: true,
        },
        select: { id: true },
      });
      resolvedProductId = product?.id || null;
    }

    const order = await prisma.$transaction(async (tx) => {
      const subtotalValue = parseMoney(total) - parseMoney(shippingCost) - couponDiscountAmount;
      const totalValue = parseMoney(total) - couponDiscountAmount;
      const orderNotesValue = `${storefrontDetails.orderNotes}${
        appliedCouponCode
          ? ` | Cupon: ${appliedCouponCode} (-$${couponDiscountAmount.toFixed(2)})`
          : ""
      }`;
      const orderId = crypto.randomUUID().replace(/-/g, "");

      const insertedOrders = await tx.$queryRaw(
        Prisma.sql`
          INSERT INTO "public"."orders" (
            "id",
            "orderNumber",
            "customerName",
            "customerLastName",
            "billingPrincipalAddress",
            "billingSecondAddress",
            "customerReference",
            "subtotal",
            "tax",
            "shipping",
            "total",
            "paymentStatus",
            "status",
            "deliveryNotes",
            "createdAt",
            "source",
            "verifiedWebhook",
            "Courier",
            "billingContactName",
            "customerEmail",
            "orderNotes",
            "customerPhone",
            "total_discount_amount",
            "product_discounted_amount",
            "code_discounted_amount",
            "coupon_discounted_amount",
            "discount_coupon_percent",
            "discount_code_percent",
            "discount_coupon_id",
            "cashOnDelivery",
            "couponDiscountCode"
          )
          VALUES (
            ${orderId},
            ${orderNumber},
            ${senderName.split(" ")[0] || senderName},
            ${senderName.split(" ").slice(1).join(" ") || ""},
            ${storefrontDetails.exactAddress || "No especificado"},
            ${null},
            ${storefrontDetails.observations},
            ${subtotalValue},
            ${0},
            ${parseMoney(shippingCost)},
            ${totalValue},
            ${"PENDING"},
            CAST(${`PENDING`} AS "public"."OrderStatus"),
            ${storefrontDetails.cardMessage},
            ${new Date()},
            ${"TIENDA_WEB"},
            ${false},
            CAST(${`Servientrega`} AS "public"."Courier"),
            ${receiverName},
            ${storefrontDetails.senderEmail},
            ${orderNotesValue},
            ${storefrontDetails.senderPhone},
            ${couponDiscountAmount},
            ${0},
            ${0},
            ${couponDiscountAmount},
            ${null},
            ${null},
            ${couponId},
            ${false},
            ${appliedCouponCode}
          )
          RETURNING "id", "orderNumber", "createdAt"
        `
      );

      const newOrder = insertedOrders[0];

      if (couponId) {
        await tx.coupons.update({
          where: { id: couponId },
          data: { usesTotal: { increment: 1 } },
        });
      }

      if (resolvedProductId) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: resolvedProductId,
            quantity: Number(quantity || 1),
            price: parseMoney(productPrice),
          },
        });
      }

      return newOrder;
    });

    if (storefrontDetails.senderEmail) {
      try {
        const activeCompany = await prisma.company.findFirst({
          where: { isActive: true },
          select: { name: true, email: true, phone: true },
        });

        const customerName =
          [senderName, receiverName].find((value) => value && String(value).trim()) ||
          "Cliente DIFIORI";

        const emailData = {
          orderNumber: order.orderNumber,
          customerName,
          customerEmail: storefrontDetails.senderEmail,
          customerPhone: storefrontDetails.senderPhone,
          billingContactName: receiverName || senderName || customerName,
          billingPrincipalAddress: storefrontDetails.exactAddress || "No especificado",
          billingCity: sector || "",
          subtotal: parseMoney(total) - parseMoney(shippingCost),
          tax: 0,
          shipping: parseMoney(shippingCost),
          total: parseMoney(total),
          createdAt: new Date(order.createdAt).toLocaleDateString("es-EC", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          companyName: activeCompany?.name || process.env.COMPANY_NAME || "DIFIORI",
          companyEmail:
            activeCompany?.email || process.env.COMPANY_EMAIL || process.env.EMAIL_USER,
          companyPhone: activeCompany?.phone || process.env.COMPANY_PHONE || "",
          items: [
            {
              productName: productName || "Producto DIFIORI",
              variantName: null,
              quantity: Number(quantity || 1),
              price: parseMoney(productPrice),
              productImage: null,
            },
          ],
        };

        await emailService.sendOrderConfirmation(emailData);
      } catch (emailError) {
        console.error("Store order confirmation email error:", emailError);
      }
    }

    return res.status(201).json({
      status: "success",
      message: "Orden creada exitosamente",
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error("Store order error:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al crear la orden",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

router.post("/:orderNumber/payment-proof", async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { dataUrl, fileName } = req.body || {};

    if (!orderNumber) {
      return res.status(400).json({
        status: "error",
        message: "El numero de orden es obligatorio.",
      });
    }

    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
      return res.status(400).json({
        status: "error",
        message: "Debes enviar una imagen valida del comprobante.",
      });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        id: true,
        orderNumber: true,
        paymentStatus: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Orden no encontrada.",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(dataUrl, {
      folder: "difiori/payment-proofs",
      resource_type: "image",
      public_id: `${order.orderNumber}-${Date.now()}`,
      overwrite: true,
    });

    // Compatibilidad: si la base no tiene columnas de comprobante, no rompemos la subida.
    let updatedOrder;
    try {
      updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentProofImageUrl: uploadResult.secure_url,
          paymentProofFileName: String(fileName || "comprobante"),
          paymentProofStatus: "UPLOADED",
          paymentProofUploadedAt: new Date(),
          paymentVerificationNotes: null,
        },
        select: {
          id: true,
          orderNumber: true,
          paymentProofImageUrl: true,
          paymentProofStatus: true,
          paymentProofUploadedAt: true,
        },
      });
    } catch (updateError) {
      console.error("Payment proof DB compatibility warning:", updateError);
      updatedOrder = {
        id: order.id,
        orderNumber: order.orderNumber,
        paymentProofImageUrl: uploadResult.secure_url,
        paymentProofStatus: "UPLOADED",
        paymentProofUploadedAt: new Date(),
      };
    }

    return res.status(200).json({
      status: "success",
      message: "Comprobante subido correctamente.",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Payment proof upload error:", error);
    return res.status(500).json({
      status: "error",
      message: "No se pudo subir el comprobante.",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
