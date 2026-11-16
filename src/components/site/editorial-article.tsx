import type { ReactNode } from "react";

import { SiteShell } from "@/components/site/site-shell";
import { Illustration } from "@/components/site/illustration";

export type ArticleSection = { n: string; heading: string; body: ReactNode[] };

type Props = {
  eyebrow: string;
  headline: ReactNode;
  subtitle: ReactNode;
  art: { src: string; alt: string };
  afterArt?: ReactNode;
  sections: ArticleSection[];
  pullQuote: string;
  signoff?: string;
  afterQuote?: ReactNode;
};

/** Shared editorial article layout. No captions. Body in a 42rem column. */
export function EditorialArticle({
  eyebrow,
  headline,
  subtitle,
  art,
  afterArt,
  sections,
  pullQuote,
  signoff,
  afterQuote,
}: Props) {
  return (
    <SiteShell>
      <article className="site-container pb-[112px] pt-14 md:pt-20">
        <header className="mx-auto max-w-[42rem]">
          <p className="font-medium text-[14px] text-emphasis">{eyebrow}</p>
          <h1 className="mt-5 font-display text-[clamp(40px,6vw,76px)] font-normal leading-[1.03] tracking-[-0.01em]">
            {headline}
          </h1>
          <p className="mt-6 text-[20px] font-medium leading-[1.5] text-muted-foreground">
            {subtitle}
          </p>
        </header>

        <div className="mx-auto mt-12 max-w-[920px]">
          <Illustration src={art.src} alt={art.alt} eager multiply />
          {afterArt}
        </div>

        <div className="mx-auto mt-14 max-w-[42rem]">
          {sections.map((s) => (
            <section key={s.n} className="[&+section]:mt-14">
              <h2 className="font-medium text-[14px] text-emphasis">
                <span className="mr-3">{s.n}.</span>
                {s.heading}
              </h2>
              <div className="mt-5 space-y-6">
                {s.body.map((p, i) => (
                  <p key={i} className="text-[19px] leading-[1.65] md:text-[20px]">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <blockquote className="mt-16 border-t-2 border-foreground pt-10 font-display text-[clamp(30px,4vw,48px)] font-normal leading-[1.08]">
            {pullQuote}
          </blockquote>
          {signoff && (
            <p className="mt-6 font-medium text-[14px] text-muted-foreground">{signoff}</p>
          )}
          {afterQuote}
        </div>
      </article>
    </SiteShell>
  );
}

export const inlineLink =
  "underline underline-offset-4 decoration-2 hover:bg-foreground hover:text-background";
