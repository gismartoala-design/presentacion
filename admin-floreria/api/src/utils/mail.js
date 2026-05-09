const nodemailer = require("nodemailer");
const { existsSync } = require("fs");
const path = require("path");
const { getDefaultFrom, getSmtpConfig } = require("./smtpConfig");

const transporter = nodemailer.createTransport(getSmtpConfig());

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}

function resolveImageUrl(imagePath, storeUrl) {
  const rawValue = String(imagePath || "").trim();
  if (!rawValue) return "";
  if (/^https?:\/\//i.test(rawValue)) return rawValue;

  const baseUrl = String(storeUrl || process.env.STORE_URL || process.env.CLIENT_URL || "").trim();
  if (!baseUrl) return "";

  try {
    return new URL(rawValue.startsWith("/") ? rawValue : `/${rawValue}`, baseUrl).toString();
  } catch {
    return "";
  }
}

function sanitizeCidFragment(value, fallback = "item") {
  const normalized = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return normalized || fallback;
}

function resolveLocalPublicImagePath(imagePath) {
  const value = String(imagePath || "").trim();
  if (!value || value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:image/")) {
    return "";
  }

  const normalizedPath = decodeURIComponent(value.startsWith("/") ? value.slice(1) : value);
  const candidatePath = path.resolve(__dirname, "../../../client/public", normalizedPath);
  return existsSync(candidatePath) ? candidatePath : "";
}

function buildEmailImageSource(imagePath, attachments, cidPrefix, storeUrl) {
  const localPath = resolveLocalPublicImagePath(imagePath);
  if (localPath) {
    const cid = `${cidPrefix}-${sanitizeCidFragment(path.basename(localPath), "image")}@difiori`;
    attachments.push({
      filename: path.basename(localPath),
      path: localPath,
      cid,
    });
    return `cid:${cid}`;
  }

  return resolveImageUrl(imagePath, storeUrl);
}

async function sendAbandonedCartEmail({
  customerName,
  phone,
  items,
  total,
  recipientEmail,
  ownerName,
  senderName,
  senderEmail,
  senderPhone,
  receiverName,
  receiverPhone,
  exactAddress,
  sector,
  paymentMethod,
  deliveryDateTime,
  cardMessage,
  observations,
  couponCode,
  abandonedAt,
  source,
  storeUrl,
}) {
  const adminEmail = recipientEmail || process.env.COMPANY_EMAIL || process.env.ADMIN_EMAIL || "ventas@difiori.com.ec";
  const safeTotal = Number(total) || 0;
  const attachments = [];

  const normalizedItems = (Array.isArray(items) ? items : []).map((item, index) => {
    const imageUrl = buildEmailImageSource(
      item.productImage || item.image,
      attachments,
      `abandoned-item-${index + 1}`,
      storeUrl
    );
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    const lineTotal = price * quantity;

    return {
      name: item.name || "Producto DIFIORI",
      quantity,
      price,
      imageUrl,
      variantName: item.variantName || "",
      lineTotal,
    };
  });

  const itemsHtml = normalizedItems.length
    ? normalizedItems
        .map((item) => `
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #f0e7f6;vertical-align:top;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  ${
                    item.imageUrl
                      ? `<td width="92" style="padding-right:14px;vertical-align:top;">
                          <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" width="78" height="78" style="display:block;width:78px;height:78px;object-fit:cover;border-radius:14px;border:1px solid #eadcf4;" />
                        </td>`
                      : ""
                  }
                  <td style="vertical-align:top;">
                    <div style="font-size:15px;font-weight:700;color:#3d2852;">${escapeHtml(item.name)}</div>
                    ${
                      item.variantName
                        ? `<div style="margin-top:4px;font-size:12px;color:#7c6a8d;">${escapeHtml(item.variantName)}</div>`
                        : ""
                    }
                    <div style="margin-top:6px;font-size:13px;color:#5e4b70;">Cantidad: ${item.quantity}</div>
                    <div style="margin-top:2px;font-size:13px;color:#5e4b70;">Precio: $${formatMoney(item.price)}</div>
                  </td>
                  <td style="vertical-align:top;text-align:right;font-size:14px;font-weight:700;color:#3d2852;">
                    $${formatMoney(item.lineTotal)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `)
        .join("")
    : `<tr><td style="padding:12px 0;color:#5e4b70;">Sin productos detallados</td></tr>`;

  const waLink = `https://wa.me/${String(phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hola ${customerName}, vimos que te interesaste en nuestros productos en DIFIORI. Podemos ayudarte con tu pedido?`
  )}`;

  const formattedAbandonedAt = abandonedAt
    ? new Date(abandonedAt).toLocaleString("es-EC", { hour12: false })
    : new Date().toLocaleString("es-EC", { hour12: false });

  const details = [
    ["Cliente", customerName],
    ["Telefono", phone],
    ["Quien envia", senderName],
    ["Correo de quien envia", senderEmail],
    ["Telefono de quien envia", senderPhone],
    ["Quien recibe", receiverName],
    ["Telefono de quien recibe", receiverPhone],
    ["Direccion", exactAddress],
    ["Sector", sector],
    ["Metodo de pago", paymentMethod],
    ["Fecha de entrega", deliveryDateTime],
    ["Mensaje de tarjeta", cardMessage],
    ["Observaciones", observations],
    ["Cupon", couponCode],
    ["Origen", source],
    ["Fecha de abandono", formattedAbandonedAt],
  ].filter(([, value]) => value && String(value).trim() !== "");

  const detailsHtml = details
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:7px 0;color:#7c6a8d;font-size:13px;font-weight:700;width:180px;">${escapeHtml(label)}</td>
          <td style="padding:7px 0;color:#2f2438;font-size:14px;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");

  const detailsText = details.map(([label, value]) => `${label}: ${value}`).join("\n");

  const mailOptions = {
    from: process.env.EMAIL_FROM || getDefaultFrom(),
    to: adminEmail,
    subject: `Carrito Abandonado - ${customerName}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:720px;margin:0 auto;border:1px solid #eee;padding:24px;border-radius:18px;background:#fff;">
        <h2 style="margin:0 0 10px;color:#5A3F73;">Carrito abandonado detectado</h2>
        <p style="margin:0 0 18px;color:#5e4b70;">Alguien comenzó el proceso de compra pero no lo finalizó.</p>
        <div style="margin-bottom:18px;padding:14px 16px;border-radius:14px;background:#faf5ff;border:1px solid #eadcf4;">
          <strong style="color:#3d2852;">Responsable:</strong>
          <span style="color:#5e4b70;"> ${escapeHtml(ownerName || "Equipo comercial")}</span>
        </div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:18px;">
          ${detailsHtml}
        </table>
        <div style="margin:18px 0;padding:16px;border-radius:16px;background:#fff8fb;border:1px solid #f3d7e7;">
          <div style="font-size:13px;font-weight:700;color:#7c6a8d;text-transform:uppercase;letter-spacing:.08em;">Total estimado</div>
          <div style="margin-top:6px;font-size:28px;font-weight:800;color:#3d2852;">$${formatMoney(safeTotal)}</div>
        </div>
        <h3 style="margin:22px 0 10px;color:#3d2852;">Productos del carrito</h3>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${itemsHtml}</table>
        <div style="margin-top:30px;text-align:center;">
          <a href="${waLink}" style="background-color:#25D366;color:white;padding:15px 25px;text-decoration:none;border-radius:999px;font-weight:bold;display:inline-block;">
            Contactar por WhatsApp ahora
          </a>
        </div>
        <p style="margin-top:30px;font-size:12px;color:#777;">
          Este es un aviso automático del sistema de recuperación de carritos de DIFIORI.
        </p>
      </div>
    `,
    attachments,
    text: `Carrito abandonado detectado\n\nResponsable: ${ownerName || "Equipo comercial"}\n${detailsText}\n\nTotal estimado: $${formatMoney(safeTotal)}\n\nProductos:\n${normalizedItems.map((item) => `- ${item.name}${item.variantName ? ` (${item.variantName})` : ""} | Cant: ${item.quantity} | Precio: $${formatMoney(item.price)} | Total: $${formatMoney(item.lineTotal)}`).join("\n")}\n\nWhatsApp: ${waLink}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error enviando email:", error);
    return false;
  }
}

module.exports = {
  sendAbandonedCartEmail,
};
