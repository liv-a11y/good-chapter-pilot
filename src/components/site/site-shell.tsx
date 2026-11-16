import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

const links = [
  { label: "How it works", to: "/story", hash: "how" },
  { label: "Chapters", to: "/story", hash: "chapters" },
  { label: "Read", to: "/read" },
  { label: "Partners", to: "/partners" },
  { label: "Investors", to: "/investors" },
] as const;

export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="relative mt-2 block w-[124px] sm:w-[148px]">
      <img
        src={inverse ? "/brand/wordmark-paper.png" : "/brand/wordmark-burgundy.png"}
        alt="good chapter co."
        width={1554}
        height={630}
        className="block h-auto w-full"
      />
      <img
        src={inverse ? "/brand/tag-paper.png" : "/brand/tag-clay.png"}
        alt=""
        aria-hidden="true"
        width={965}
        height={1188}
        className="absolute left-[75%] top-[-20%] h-auto w-[24%] [transform:rotate(-9deg)_scaleX(-1)]"
      />
    </span>
  );
}

export function SiteShell({ children, pilot = false }: { children: ReactNode; pilot?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b-[1.5px] border-foreground bg-background">
        <div className="site-container flex min-h-20 items-center gap-2 py-3 sm:gap-4">
          <Link
            to="/"
            className="shrink-0 font-display text-xl sm:text-2xl"
            aria-label="Good Chapter Co. home"
          >
            <BrandMark />
          </Link>
          {pilot ? (
            <>
              <span className="eyebrow ml-auto hidden sm:inline">Private pilot</span>
              <Button
                asChild
                size="sm"
                className="ml-auto px-4 text-[13px] sm:ml-5 sm:h-11 sm:px-5 sm:text-sm"
              >
                <Link to="/" hash="invite">
                  Request an invitation
                </Link>
              </Button>
            </>
          ) : (
            <>
              <nav
                className="ml-auto hidden items-center gap-7 lg:flex"
                aria-label="Main navigation"
              >
                {links.map((link) =>
                  "hash" in link ? (
                    <Link
                      key={link.label}
                      to={link.to}
                      hash={link.hash}
                      className="text-[15px] font-medium transition-colors duration-175 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="text-[15px] font-medium transition-colors duration-175 hover:text-primary"
                      activeProps={{ className: "text-primary" }}
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </nav>
              <Button
                asChild
                size="sm"
                className="ml-auto px-3 text-[12px] sm:h-11 sm:px-5 sm:text-sm lg:ml-5"
              >
                <Link to="/" hash="invite">
                  <span className="sm:hidden">Start one</span>
                  <span className="hidden sm:inline">Start one for a friend</span>
                </Link>
              </Button>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex size-11 shrink-0 items-center justify-center rounded-sm border-2 border-foreground lg:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </>
          )}
        </div>
        {!pilot && open && (
          <nav
            className="border-t-2 border-foreground bg-background px-5 py-2 lg:hidden"
            aria-label="Mobile navigation"
          >
            {links.map((link) =>
              "hash" in link ? (
                <Link
                  key={link.label}
                  to={link.to}
                  hash={link.hash}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border py-4 text-lg font-medium last:border-b-0"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border py-4 text-lg font-medium last:border-b-0"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        )}
      </header>
      <main>{children}</main>
      {pilot ? (
        <footer className="border-t-2 border-foreground bg-foreground text-background">
          <div className="site-container flex flex-wrap items-center justify-between gap-5 py-7 text-[14px]">
            <p>Good people. Different rules.</p>
            <Link to="/read" className="underline underline-offset-4 hover:text-highlight">
              Our why ↗
            </Link>
            <a
              href="mailto:liv@goodchaptercollective.com"
              className="underline underline-offset-4 hover:text-highlight"
            >
              liv@goodchaptercollective.com
            </a>
            <nav className="flex gap-4" aria-label="Legal">
              <Link to="/privacy" className="underline underline-offset-4 hover:text-highlight">
                Privacy
              </Link>
              <Link to="/terms" className="underline underline-offset-4 hover:text-highlight">
                Terms
              </Link>
              <a
                href="mailto:liv@goodchaptercollective.com"
                className="underline underline-offset-4 hover:text-highlight"
              >
                Contact
              </a>
            </nav>
            <p className="w-full text-background/70">
              © 2026 Good Chapter, Co. All rights reserved.
            </p>
          </div>
        </footer>
      ) : (
        <SiteFooter />
      )}
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t-2 border-foreground bg-foreground text-background">
      <div className="site-container grid gap-12 py-14 md:grid-cols-[1.2fr_.8fr] md:py-16">
        <div>
          <Link to="/" className="font-display text-3xl">
            <BrandMark inverse />
          </Link>
          <p className="mt-5 max-w-md text-lg leading-[1.5] text-background/80">
            Not a wedding. Not a baby. Still worth celebrating on purpose.
          </p>
          <a
            href="mailto:liv@goodchaptercollective.com"
            className="mt-7 inline-block text-[15px] font-semibold underline underline-offset-4"
          >
            liv@goodchaptercollective.com
          </a>
        </div>
        <nav
          className="grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] md:justify-self-end"
          aria-label="Footer navigation"
        >
          <Link to="/">Home</Link>
          <Link to="/catalog">Catalog</Link>
          <Link to="/read">Read</Link>
          <Link to="/journal/vulnerability-tax">The vulnerability tax</Link>
          <Link to="/journal/how-to-show-up-without-being-weird">How to show up</Link>
          <Link to="/history">History</Link>
          <Link to="/founder">Founder note</Link>
          <Link to="/founding">Founding partners</Link>
          <Link to="/partners">Partners</Link>
          <Link to="/partners/employers">Employers</Link>
          <Link to="/partners/real-estate">Real estate</Link>
          <Link to="/giving">Giving back</Link>
          <Link to="/partners/brands">Brands</Link>
          <Link to="/investors">Investors</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <a href="mailto:liv@goodchaptercollective.com">Contact</a>
        </nav>
        <p className="text-[14px] text-background/70 md:col-span-2">
          © 2026 Good Chapter, Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
