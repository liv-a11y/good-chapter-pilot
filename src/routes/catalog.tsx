import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/site-shell";
import { tiers } from "@/lib/catalog";
import { sampleProducts } from "@/lib/sample-products";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Sample gifts. Good Chapter Co." },
      {
        name: "description",
        content:
          "Eight sample gift ideas, each paired with its own product photo and an honest reason.",
      },
      { property: "og:title", content: "Sample gifts. Good Chapter Co." },
      {
        property: "og:description",
        content: "A sample chapter with eight thoughtful gifts and illustrative prices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const items = sampleProducts;

  return (
    <SiteShell>
      <section className="site-container py-16 md:py-24">
        <p className="font-medium text-[14px]">Sample chapter · {items.length} items</p>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(44px,6vw,80px)] leading-[1.03] tracking-[-0.01em]">
          Fewer things. Better reasons.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-[1.5]">
          Eight sample ideas. Prices are illustrative. Checkout opens with the pilot. Good Chapter
          keeps the group from doubling up.
        </p>
      </section>

      {tiers.map((t) => {
        const list = items.filter((i) => i.tier === t.id);
        if (!list.length) return null;
        return (
          <section key={t.id} className="site-container pb-20">
            <div className="flex items-baseline justify-between border-b-2 border-foreground pb-3">
              <h2 className="font-display text-[clamp(28px,3vw,40px)] leading-[1.05]">{t.name}</h2>
              <span className="font-medium text-[14px]">
                {t.range} · {list.length}
              </span>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((i) => (
                <article
                  key={i.id}
                  className="rounded-[4px] border-2 border-foreground bg-background transition-transform duration-150 ease-linear hover:-translate-y-1"
                >
                  <img
                    src={i.photo}
                    alt={i.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full border-b-2 border-foreground object-cover"
                  />
                  <div className="p-4">
                    <p className="font-medium text-[14px]">{i.brand}</p>
                    <h3 className="mt-1 text-lg font-semibold">{i.name}</h3>
                    <p className="mt-1 font-medium text-[15px]">${i.price}</p>
                    <p className="mt-3 text-[15px] leading-[1.5]">{i.reason}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </SiteShell>
  );
}
