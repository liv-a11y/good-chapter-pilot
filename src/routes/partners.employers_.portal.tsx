import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/site-shell";
import { CareCockpit } from "@/components/site/care-cockpit";

const title = "Employer portal prototype. Good Chapter, Co.";
const description =
  "Walk one sample chapter from the manager, teammates, the employee's phone, and People Ops. Counts only, nothing personal.";

export const Route = createFileRoute("/partners/employers_/portal")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortalPage,
});

function PortalPage() {
  return (
    <SiteShell>
      <section className="site-container py-10 lg:py-14">
        <p className="eyebrow text-emphasis">Prototype · Sample data only</p>
        <CareCockpit anchor={200} />
        <div className="mt-10 flex flex-wrap gap-6">
          <Link
            to="/partners/employers/dashboard"
            className="eyebrow underline hover:bg-foreground hover:text-background"
          >
            See the dashboard
          </Link>
          <Link
            to="/partners/employers"
            className="eyebrow underline hover:bg-foreground hover:text-background"
          >
            Back to employers
          </Link>
        </div>
        <p className="eyebrow mt-6">Nothing here is saved, charged, or sent.</p>
      </section>
    </SiteShell>
  );
}
