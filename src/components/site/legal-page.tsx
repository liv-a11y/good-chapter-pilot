import { SiteShell } from "@/components/site/site-shell";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
  after?: string[];
};

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <SiteShell pilot>
      <article className="site-container py-14 sm:py-20">
        <div className="mx-auto max-w-[42rem]">
          <p className="eyebrow text-emphasis">Legal</p>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] sm:text-[60px]">{title}</h1>
          <p className="mt-5 eyebrow text-muted-foreground">Last updated: October 1, 2026</p>
          <p className="mt-8 text-[19px] leading-[1.65]">{intro}</p>
          {sections.map((s) => (
            <section key={s.heading} className="mt-12 border-t-2 border-foreground pt-6">
              <h2 className="font-display text-[28px] leading-[1.15]">{s.heading}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p} className="mt-4 text-[18px] leading-[1.65]">
                  {p}
                </p>
              ))}
              {s.items && (
                <ul className="mt-4 list-disc space-y-3 pl-6 text-[18px] leading-[1.65]">
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              )}
              {s.after?.map((p) => (
                <p key={p} className="mt-4 text-[18px] leading-[1.65]">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}
