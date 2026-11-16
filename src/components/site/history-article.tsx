import { Illustration, ToasterLine } from "@/components/site/illustration";
import { inlineLink } from "@/components/site/editorial-article";
import toaster from "@/assets/06-toaster-and-couple.png.asset.json";

const sections = [
  {
    n: "I",
    heading: "The list",
    body: [
      "In 1924, Marshall Field's, a department store, built the first modern bridal registry. A bride named the china, the silver, the crystal. Her guests bought from the list. Nobody doubled up on gravy boats.",
      "It was practical. It was also a gate. The list was for the woman starting a household, and only that woman.",
    ],
  },
  {
    n: "II",
    heading: "The permission slip",
    body: [
      "For a hundred years, a ring was the only permission slip. Engaged, you could say what your home needed. Not engaged, you got a card and, if you were lucky, a candle.",
      "Nobody wrote the rule down. Everybody followed it.",
    ],
  },
  {
    n: "III",
    heading: "One house to the next",
    body: [
      "The registry assumed one story: a woman stepping out of a father's house into a husband's. The store furnished the handoff.",
      "Marshall Field's never said it that way. We do, because it is what the list was built to do.",
    ],
  },
  {
    n: "IV",
    heading: "Everyone else",
    body: [
      "Women kept buying houses alone. People kept leaving marriages, starting over in half-empty rooms, moving to places where they knew no one. They still needed a pan.",
      "The care never stopped. The ritual just never came. Good Chapter is the ritual for the rest of it. A friend starts it. The person approves it. Nobody asks.",
    ],
  },
];

/** The 1924 history editorial, shared by /history and the homepage. No SiteShell wrapper. */
export function HistoryArticleBody({ eager = false }: { eager?: boolean }) {
  return (
    <article className="site-container pb-[112px] pt-14 md:pt-20">
      <header className="mx-auto max-w-[42rem]">
        <p className="font-medium text-[14px] text-emphasis">History · 1924</p>
        <h2 className="mt-5 font-display text-[clamp(40px,6vw,76px)] font-normal leading-[1.03] tracking-[-0.01em]">
          A hundred years of toasters, for brides only.
        </h2>
        <p className="mt-6 text-[20px] font-medium leading-[1.5] text-muted-foreground">
          In 1924 a department store gave one kind of life a gift list. Everyone else got a card.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-[920px]">
        <Illustration
          src={toaster.url}
          alt="Illustration. A very large toaster with two slices of yellow toast, and a tiny bride and groom standing beside it."
          eager={eager}
          multiply
        />
        <ToasterLine className="mt-6 text-[clamp(30px,4vw,48px)] leading-[1.08]" />
      </div>

      <div className="mx-auto mt-14 max-w-[42rem]">
        {sections.map((s) => (
          <section key={s.n} className="[&+section]:mt-14">
            <h3 className="font-medium text-[14px] text-emphasis">
              <span className="mr-3">{s.n}.</span>
              {s.heading}
            </h3>
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
          Domestic life shouldn't require an engagement ring.
        </blockquote>

        <aside className="mt-16 rounded-[4px] border-2 border-foreground p-6 md:p-8">
          <h3 className="font-medium text-[14px]">Sources</h3>
          <ul className="mt-5 space-y-4 text-[17px] leading-[1.55]">
            <li>
              <a
                className={inlineLink}
                href="https://images.chicagohistory.org/asset/23427/"
                target="_blank"
                rel="noreferrer"
              >
                Marshall Field's bridal-services archive, Chicago History Museum.
              </a>
            </li>
            <li>
              <a
                className={inlineLink}
                href="https://www.wttw.com/chicago-stories/marshall-fields/how-marshall-fields-transformed-shopping-from-errand-to-experience"
                target="_blank"
                rel="noreferrer"
              >
                WTTW, Chicago Stories: how Marshall Field's changed shopping from an errand into an
                experience.
              </a>
            </li>
            <li>
              Interpretation note: the line about a woman stepping out of a father's house into a
              husband's is Good Chapter's modern reading of the 1924 social contract. It is not
              store copy.
            </li>
          </ul>
        </aside>
      </div>
    </article>
  );
}
