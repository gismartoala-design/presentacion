const { resolvePublicMediaUrl } = require("./publicMediaUrl");

function normalizeProductName(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[|,.;:()\-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildProductNameCandidates(value = "") {
  const normalized = normalizeProductName(value);
  if (!normalized) return [];

  const candidates = new Set([normalized]);
  const parts = normalized.split(" ").filter(Boolean);

  if (parts.length >= 4) {
    candidates.add(parts.slice(0, 6).join(" "));
    candidates.add(parts.slice(0, 5).join(" "));
    candidates.add(parts.slice(0, 4).join(" "));
  }

  const withoutCommonWords = parts.filter(
    (part) => !["para", "con", "de", "del", "la", "el", "en", "y"].includes(part)
  );
  if (withoutCommonWords.length >= 3) {
    candidates.add(withoutCommonWords.slice(0, 5).join(" "));
    candidates.add(withoutCommonWords.slice(0, 4).join(" "));
  }

  return Array.from(candidates).filter(Boolean);
}

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
        productImage: resolvePublicMediaUrl(productImage) || productImage || null,
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
            productImage: resolvePublicMediaUrl(item.productImage || product.image) || null,
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

      const candidates = buildProductNameCandidates(item.productName);
      let product = null;

      for (const candidate of candidates) {
        const products = await prisma.product.findMany({
          where: {
            isActive: true,
            name: { contains: candidate, mode: "insensitive" },
          },
          select: { id: true, image: true, name: true },
          take: 10,
        });

        const candidateNormalized = normalizeProductName(candidate);
        product =
          products.find((entry) => normalizeProductName(entry.name) === normalizeProductName(item.productName)) ||
          products.find((entry) => normalizeProductName(entry.name).includes(candidateNormalized)) ||
          products.find((entry) => candidateNormalized.includes(normalizeProductName(entry.name))) ||
          products[0] ||
          null;

        if (product) break;
      }

      return {
        ...item,
        productId: product?.id || null,
        productImage: resolvePublicMediaUrl(item.productImage || product?.image) || null,
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
