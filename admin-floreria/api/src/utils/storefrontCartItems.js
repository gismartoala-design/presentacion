function parseStorefrontMoney(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const normalized = String(value ?? "")
    .trim()
    .replace(/[^0-9,.-]+/g, "")
    .replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

function normalizeStorefrontItems(rawItems, fallbackItem = {}) {
  const incomingItems = Array.isArray(rawItems) ? rawItems : [];
  const fallbackItems = incomingItems.length > 0
    ? incomingItems
    : [fallbackItem].filter(Boolean);

  return fallbackItems
    .map((item) => {
      const source = item && typeof item === "object" ? item : {};
      const productSource =
        source.product && typeof source.product === "object" ? source.product : {};

      const quantity = Number(source.quantity ?? 1);
      const productId = String(
        source.productId || productSource.id || ""
      ).trim();
      const productName = String(
        source.productName || source.name || productSource.name || ""
      ).trim();
      const productImage = String(
        source.productImage || source.image || productSource.image || ""
      ).trim();
      const variantName = String(
        source.variantName || productSource.variantName || ""
      ).trim();
      const price = parseStorefrontMoney(
        source.price ?? productSource.price ?? fallbackItem.productPrice
      );

      if (!productName || !Number.isFinite(quantity) || quantity <= 0) {
        return null;
      }

      return {
        productId: productId || null,
        productName,
        productImage: productImage || null,
        variantName: variantName || null,
        quantity,
        price,
      };
    })
    .filter(Boolean);
}

async function hydrateStorefrontItems(prisma, items) {
  return Promise.all(
    (Array.isArray(items) ? items : []).map(async (item) => {
      if (item.productId) {
        const product = await prisma.product.findFirst({
          where: {
            id: String(item.productId),
            isActive: true,
          },
          select: { id: true, image: true, name: true },
        });

        if (product) {
          return {
            ...item,
            productId: product.id,
            productImage: item.productImage || product.image || null,
            productName: item.productName || product.name || "Producto DIFIORI",
          };
        }
      }

      if (!item.productName) {
        return {
          ...item,
          productId: null,
        };
      }

      const product = await prisma.product.findFirst({
        where: {
          name: { contains: String(item.productName), mode: "insensitive" },
          isActive: true,
        },
        select: { id: true, image: true, name: true },
      });

      return {
        ...item,
        productId: product?.id || null,
        productImage: item.productImage || product?.image || null,
        productName: item.productName || product?.name || "Producto DIFIORI",
      };
    })
  );
}

module.exports = {
  parseStorefrontMoney,
  normalizeStorefrontItems,
  hydrateStorefrontItems,
};
