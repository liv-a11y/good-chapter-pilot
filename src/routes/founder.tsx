import { createFileRoute, Link } from "@tanstack/react-router";

import { EditorialArticle, inlineLink } from "@/components/site/editorial-article";
import table from "@/assets/05-carrying-the-table.png.asset.json";

const TITLE = "Why I built an anti-registry";
const DESC =
  "Liv Coffman on a twenty-five dollar skillet, a house with one name on the deed, and why asking is the expensive part.";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FounderPage,
});

function FounderPage() {
  return (
    <EditorialArticle
      eyebrow="Essay · Founder note"
      headline="Nobody threw a shower for any of it."
      subtitle="Why a friend starts it, and nobody asks."
      art={{
        src: table.url,
        alt: "Illustration. Two friends carrying a long table toward an open door, with a single line looping through the scene.",
      }}
      sections={[
        {
          n: "I",
          heading: "The skillet",
          body: [
            "I broke a skillet once. A twenty-five dollar nonstick. I hid it.",
            <>
              Not because it was a crisis. Because telling anyone felt like a confession.
              Twenty-five dollars is nothing. The asking was everything. I call that the{" "}
              <Link to="/journal/vulnerability-tax" className={inlineLink}>
                vulnerability tax
              </Link>
              .
            </>,
          ],
        },
        {
          n: "II",
          heading: "The house",
          body: [
            "I bought a house by myself. I went through a divorce. Everyone said I seemed fine, and mostly I was.",
            "Nobody threw a shower for any of it. There is no shower for a divorce. There is no list for a first house with one name on the deed.",
          ],
        },
        {
          n: "III",
          heading: "The folding chairs",
          body: [
            "Our culture has two parties: a wedding and a baby shower. Everything else, you do on a folding chair in a half-empty apartment, eating with a takeout fork.",
            'The people who love you are not stingy. They are stuck. They text, "Let me know if you need anything." And you never do, because you would have to ask.',
          ],
        },
        {
          n: "IV",
          heading: "So we flipped it",
          body: [
            "Good Chapter is the list I wanted. A friend starts it. The person approves it, privately, and decides everything. Nobody asks.",
            <>
              I'm building it with a small group first.{" "}
              <Link to="/founding" className={inlineLink}>
                Founding partners
              </Link>
              , people and organizations, who tell me what a good list looks like and what I got
              wrong.
            </>,
            "If someone you love just started a new chapter, you already know one or two things they need. Start there.",
          ],
        },
      ]}
      pullQuote="The pan was never the point. Being noticed was."
      signoff="Liv, founder"
    />
  );
}
