import { createFileRoute } from "@tanstack/react-router";

import table from "@/assets/05-carrying-the-table.png.asset.json";
import { EditorialArticle, inlineLink } from "@/components/site/editorial-article";

const TITLE = "Founding partners · Good Chapter";
const DESC =
  "Help build a better ritual for first homes, fresh starts, and the chapters old traditions left out.";

export const Route = createFileRoute("/founding")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FoundingPage,
});

function FoundingPage() {
  return (
    <EditorialArticle
      eyebrow="Founding partners · Edition 01"
      headline="Help us build the ritual the old rules forgot."
      subtitle="A small founding group is shaping how friends show up for the chapters that never came with a list."
      art={{
        src: table.url,
        alt: "Illustration. Two friends carry a long table toward an open door while one line loops through the scene.",
      }}
      sections={[
        {
          n: "I",
          heading: "The premise",
          body: [
            "People already want to help. The old system only made that help easy for weddings and babies.",
            "Good Chapter gives the rest of life a simple ritual. A friend starts it. The person approves it. Nobody asks.",
          ],
        },
        {
          n: "II",
          heading: "The founding group",
          body: [
            "We are inviting a small group of people and organizations who believe care should not depend on following one life script.",
            "Founding partners test the language, the privacy rules, and the handoffs. They tell us what feels useful and what still feels awkward.",
          ],
        },
        {
          n: "III",
          heading: "What we protect",
          body: [
            "The person stays in control. Their edits stay private. Guests see useful choices, not pressure, totals, or a public performance of care.",
            "Good Chapter coordinates claims so gifts are not duplicated. Guests will check out on Good Chapter when the pilot opens. Nothing is for sale here yet.",
          ],
        },
        {
          n: "IV",
          heading: "Join the first edition",
          body: [
            "If this belongs inside your work, your community, or the way you care for people, we would like to hear what you see.",
            <a
              key="email"
              href="mailto:liv@goodchaptercollective.com?subject=Founding%20partner"
              className={inlineLink}
            >
              Write to Liv about becoming a founding partner.
            </a>,
          ],
        },
      ]}
      pullQuote="The ritual gets better when the people who need it help write it."
      signoff="Liv, founder"
    />
  );
}
