import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site/legal-page";

const description =
  "How Good Chapter, Co. collects, uses, and protects information during the private pilot.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy. Good Chapter, Co." },
      { name: "description", content: description },
      { property: "og:title", content: "Privacy Policy. Good Chapter, Co." },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      intro={`Good Chapter, Co. ("Good Chapter," "we," "us") is an Indiana corporation. This policy explains what we collect on goodchaptercollective.com while we run our private pilot, how we use it, and the choices you have.`}
      sections={[
        {
          heading: "What we collect",
          paragraphs: [
            "What you give us: your email address, the role you choose when you request an invitation, and anything you write in the optional comments box.",
            "What we receive automatically: your IP address, browser and device type, pages viewed, and referring page, through our hosting provider. We do not run analytics.",
            "We do not ask for payment information, government IDs, or other sensitive details. Please do not include health information, or information about other people, in the comments box. If you do, we will delete it on request.",
          ],
        },
        {
          heading: "How we use it",
          items: [
            "To review invitation requests and contact you about the pilot.",
            "To understand who is interested, so we can decide which partners and communities to approach first.",
            "To keep the site secure and working.",
            "To meet legal obligations.",
          ],
          after: [
            "We do not sell your personal information. We do not share it for cross-context behavioral advertising.",
          ],
        },
        {
          heading: "Who we share it with",
          paragraphs: [
            "We share information only with service providers who help us run the site and send email, under terms that limit their use of it. Current providers: Lovable, which hosts the site, stores the waitlist, and sends our notification email. We use no analytics tools and no advertising networks. We may also disclose information if the law requires it, or in a merger or sale of the company, in which case we will tell you if your information is affected.",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: [
            "We keep waitlist information until the pilot ends or you ask us to delete it, plus a reasonable period afterward for records and legal needs. We keep it no longer than 24 months after your last contact with us.",
          ],
        },
        {
          heading: "Your choices and rights",
          items: [
            "Unsubscribe from any email using the link in it, or by writing to us.",
            "Ask to see, correct, or delete your information by emailing info@goodchaptercollective.com. We will respond within 45 days, or sooner where the law requires.",
            "Residents of some states have additional rights, including to opt out of targeted advertising and the sale or sharing of personal data, and to appeal a denied request. We honor these rights for everyone who contacts us, and we treat browser Global Privacy Control signals as an opt-out of sharing where required.",
          ],
        },
        {
          heading: "Cookies and analytics",
          paragraphs: [
            "We do not use advertising cookies, analytics tools, tracking pixels, or session replay. We do not store information about you in your browser.",
          ],
        },
        {
          heading: "Children",
          paragraphs: [
            "The site is not for anyone under 18. We do not knowingly collect information from children. If you believe a child has given us information, contact us and we will delete it.",
          ],
        },
        {
          heading: "Security",
          paragraphs: [
            "We use reasonable safeguards, but no system is perfectly secure. If a breach affects your information, we will notify you as the law requires.",
          ],
        },
        {
          heading: "Changes",
          paragraphs: [
            "If we make material changes, we will update the date above and, where we have your email, tell you.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "Good Chapter, Co., 358 Terrace Ave, Indianapolis, IN 46225. Email: info@goodchaptercollective.com.",
          ],
        },
      ]}
    />
  ),
});
