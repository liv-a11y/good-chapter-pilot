import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteShell } from "./site-shell";

export function PlaceholderPage({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <SiteShell>
      <section className="site-section">
        <div className="site-container grid min-h-[58vh] content-center gap-10 md:grid-cols-[1.2fr_.8fr] md:items-end">
          <div>
            <p className="eyebrow text-emphasis">{eyebrow}</p>
            <h1 className="site-h1 mt-5 max-w-4xl">{title}</h1>
          </div>
          <div className="border-t-2 border-foreground pt-6">
            <p className="site-body text-muted-foreground">{copy}</p>
            <Button asChild className="mt-7">
              <a href="mailto:liv@goodchaptercollective.com">
                Talk with Liv <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-emphasis text-emphasis-foreground">
        <div className="site-container py-16 md:py-20">
          <h2 className="site-h2 max-w-3xl">We’re building the thoughtful way to show up.</h2>
          <Link
            to="/preview"
            className="mt-7 inline-block text-[15px] font-semibold underline underline-offset-4"
          >
            See Good Chapter
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
