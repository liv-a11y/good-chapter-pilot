import { createFileRoute, Link } from "@tanstack/react-router";

import { EditorialArticle, inlineLink } from "@/components/site/editorial-article";
import armchair from "@/assets/04-armchair-and-bowl.png.asset.json";

const TITLE = "How to show up without being weird";
const DESC =
  '"Let me know if you need anything" hands the work back. Here is how to show up with something specific instead.';

export const Route = createFileRoute("/journal/how-to-show-up-without-being-weird")({
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
  component: ShowUpPage,
});

function ShowUpPage() {
  return (
    <EditorialArticle
      eyebrow="Essay · Showing up"
      headline={<>Skip the "let me know."</>}
      subtitle={
        <>
          A text that says "anything you need" hands the work back to the person with the least
          left.
        </>
      }
      art={{
        src: armchair.url,
        alt: "Illustration. A person in a deep armchair holding a mug, while a friend sets a bowl on the side table.",
      }}
      sections={[
        {
          n: "I",
          heading: "The text everyone sends",
          body: [
            '"Let me know if you need anything." You mean it. Everyone means it.',
            "And it lands as homework. Now the person has to work out what they need, decide if it is too much, and find the words. On their hardest day. The offer is kind. The burden is theirs.",
          ],
        },
        {
          n: "II",
          heading: "Be specific",
          body: [
            'Pick one thing. Say it as a plan, not a question. "I\'m dropping off dinner Thursday. Leave the porch light on."',
            '"What do you need?" asks for a list. "Here is what I\'m bringing" asks for nothing. Small and concrete beats big and vague. A pan. A casserole. An hour of carrying boxes.',
          ],
        },
        {
          n: "III",
          heading: "Don't make them perform",
          body: [
            "Show up without a speech. You don't need the right words. You don't need to ask how they are really doing.",
            "Don't ask for a thank-you. Don't ask for a reply. Say \"no need to answer\" and mean it. If they want to talk, they will. If they want to eat soup and watch television, bring the soup.",
          ],
        },
        {
          n: "IV",
          heading: "Let a friend start it",
          body: [
            "Some things are too big for one casserole. That is what a Good Chapter is for.",
            "A friend starts a short list. The person approves it, privately. Guests claim one thing so nobody doubles up. Nobody asks.",
            "You don't have to wait to be told. You already know one or two things. That is enough to start.",
            <>
              Companion essay:{" "}
              <Link to="/journal/vulnerability-tax" className={inlineLink}>
                The vulnerability tax
              </Link>
              .
            </>,
          ],
        },
      ]}
      pullQuote="Don't ask what they need. Bring the thing."
      signoff="Liv, founder"
    />
  );
}
