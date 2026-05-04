import React from "react";
import { Link } from "wouter";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { formatCategoryDisplayName, getCategoryPath } from "@shared/catalog";

const HOME_PRODUCTS_PER_CATEGORY = 2;
const HOME_CATEGORY_LIMIT = 4;
const HOME_PRODUCT_LIMIT = HOME_PRODUCTS_PER_CATEGORY * HOME_CATEGORY_LIMIT;

export function HomeCatalogSection() {
  const { data: allProducts = [], isLoading: isLoadingAll } = useProducts({
    limit: HOME_PRODUCT_LIMIT,
  });

  const categorySections = React.useMemo(() => {
    const sections = new Map<string, typeof allProducts>();

    for (const product of allProducts) {
      const category = product.category || "General";
      const existing = sections.get(category) || [];
      existing.push(product);
      sections.set(category, existing);
    }

    return Array.from(sections.entries())
      .map(([category, products]) => ({
        category,
        label: formatCategoryDisplayName(category),
        href: getCategoryPath(category),
        products: products.slice(0, HOME_PRODUCTS_PER_CATEGORY),
      }))
      .slice(0, HOME_CATEGORY_LIMIT);
  }, [allProducts]);

  return (
    <section className="relative z-20 mb-40 flex flex-col gap-10 pt-10 lg:flex-row xl:gap-8">
      <aside className="h-fit shrink-0 lg:sticky lg:top-32 lg:w-[280px] xl:w-[300px]">
        <CategorySidebar variant="link" enabled />
      </aside>

      <main className="flex-1 w-full overflow-hidden">
        <div id="catalogo" className="mb-12 flex items-center gap-6 opacity-60">
          <div className="h-[1px] flex-1 bg-foreground" />
          <h2 className="whitespace-nowrap text-sm font-black uppercase tracking-[0.5em] text-foreground">
            Catalogo de Arreglos Florales
          </h2>
          <div className="h-[1px] flex-1 bg-foreground" />
        </div>

        <div id="product-list" className="space-y-20 scroll-mt-32">
          {isLoadingAll ? (
            Array(6)
              .fill(0)
              .map((_, i) => <div key={i} className="product-skeleton" />)
          ) : categorySections.length > 0 ? (
            categorySections.map((section) => (
              <section key={section.category} className="space-y-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2
                      className="text-3xl font-black leading-tight text-[#4B1F6F] md:text-5xl"
                      style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
                    >
                      {section.label}
                    </h2>
                    <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#4B1F6F]/75 md:text-lg">
                      Seleccion destacada de {section.label.toLowerCase()} con entrega en Guayaquil.
                    </p>
                  </div>
                  <Link href={section.href}>
                    <button type="button" className="ui-btn-secondary">
                      Ver categoria
                    </button>
                  </Link>
                </div>

                <div className="product-grid">
                  {section.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="empty-state col-span-full">
              <p className="empty-state-title">No se encontraron productos en esta categoria.</p>
            </div>
          )}
        </div>

        <div className="mt-24 text-center">
          <Link href="/shop">
            <button type="button" className="ui-btn-secondary px-12">
              Ver Coleccion Completa
            </button>
          </Link>
        </div>
      </main>
    </section>
  );
}
