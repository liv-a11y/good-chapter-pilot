import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/site-shell";
import { CAN_SEE, FIELD_LABEL, ROLES, TRANSITIONS, type Field, type Role } from "@/lib/roles";

const title = "Who sees what. Good Chapter, Co.";
const description =
  "Seven roles, one rule: the person holds the final say, and nobody who funds a chapter sees their address or their choices.";

export const Route = createFileRoute("/partners/roles")({
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
  component: RolesPage,
});

const roles = Object.keys(ROLES) as Role[];
const fields = Object.keys(FIELD_LABEL) as Field[];

function RolesPage() {
  return (
    <SiteShell>
      <section className="site-container py-12 lg:py-16">
        <p className="font-medium text-[13px] text-emphasis">Prototype · Roles</p>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Who sees what.</h1>
        <p className="mt-4 max-w-xl">
          Seven roles. The person holds the final say. Whoever pays sees counts, not lives.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <div
              key={r}
              className={`rounded-sm border-2 border-foreground p-4 ${r === "recipient" ? "bg-highlight" : ""}`}
            >
              <p className="font-medium text-[13px]">{ROLES[r].label}</p>
              <p className="mt-2 text-sm">{ROLES[r].who}</p>
              <p className="mt-2 text-sm opacity-80">{ROLES[r].access}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl">What each role can see</h2>
        <div className="mt-4 overflow-x-auto rounded-sm border-2 border-foreground">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b-2 border-foreground">
                <th className="p-3 text-left font-medium text-[13px]">Information</th>
                {roles.map((r) => (
                  <th key={r} className="p-3 font-medium text-[13px]">
                    {ROLES[r].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f} className="border-b border-foreground/30 last:border-0">
                  <td className="p-3">{FIELD_LABEL[f]}</td>
                  {roles.map((r) => {
                    const yes = CAN_SEE[r].includes(f);
                    return (
                      <td key={r} className="p-3 text-center font-medium">
                        <span aria-hidden="true">{yes ? "●" : "·"}</span>
                        <span className="sr-only">{yes ? "Yes" : "No"}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-14 font-display text-2xl">How a chapter moves</h2>
        <ol className="mt-4 grid gap-3">
          {TRANSITIONS.map((t) => (
            <li key={t.from + t.to} className="rounded-sm border-2 border-foreground p-3 text-sm">
              <span className="font-medium text-[13px]">
                {t.from.replace(/_/g, " ")} to {t.to.replace(/_/g, " ")}
              </span>
              <span className="ml-3">
                Only {ROLES[t.by].label.toLowerCase().startsWith("the ") ? "" : "the "}
                {ROLES[t.by].label.toLowerCase()}.
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-xl text-sm">
          Pool money is drawn only when the person approves. A quiet close returns it to the pool.
        </p>
      </section>
    </SiteShell>
  );
}
