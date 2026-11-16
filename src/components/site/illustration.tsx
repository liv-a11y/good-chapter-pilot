import toasterCouple from "@/assets/06-toaster-and-couple.png.asset.json";
import movingOut from "@/assets/07-moving-out.png.asset.json";

type Props = {
  src: string;
  alt: string;
  eager?: boolean | undefined;
  multiply?: boolean;
  className?: string;
};

/** Site illustration: natural 3:2, 2px ink border, 4px corners. No visible caption; alt only. */
export function Illustration({ src, alt, eager, multiply, className = "" }: Props) {
  return (
    <div
      className={`w-full overflow-hidden rounded-[4px] border-2 border-foreground bg-background ${className}`}
    >
      <img
        src={src}
        alt={alt}
        width={1536}
        height={1024}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        {...(eager ? { fetchPriority: "high" as const } : {})}
        className="block aspect-[3/2] h-auto w-full object-cover"
        style={multiply ? { mixBlendMode: "multiply" } : undefined}
      />
    </div>
  );
}

/** The masked toaster line. Visible mask is aria-hidden; screen readers get the full word. */
export function ToasterLine({
  as: Tag = "p",
  className = "",
  id,
}: {
  as?: "p" | "h1" | "h2";
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={`font-display font-normal text-left ${className}`}>
      You shouldn’t have to get married to get a{" "}
      <span aria-hidden="true" className="bg-highlight px-1.5 text-foreground">
        f$%#ng
      </span>
      <span className="sr-only">fucking</span> toaster.
    </Tag>
  );
}

/** Toaster illustration always paired with its live-text line beneath. */
export function ToasterIllustration({
  eager,
  className = "",
}: {
  eager?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Illustration
        src={toasterCouple.url}
        eager={eager}
        multiply
        alt="A very large toaster with two slices of yellow toast. A small bride and groom stand beside it looking up."
      />
      <ToasterLine className="mt-5 text-[clamp(28px,3.2vw,40px)] leading-[1.08]" />
    </div>
  );
}

/** Moving-out illustration always paired with its live-text line beneath. */
export function MovingOutIllustration({
  eager,
  className = "",
}: {
  eager?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Illustration
        src={movingOut.url}
        eager={eager}
        alt="One person stands in a furnished home while another carries a bag into an empty home."
      />
      <p className="mt-5 text-left font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.08]">
        You shouldn’t have to stay married just to have a furnished living room.
      </p>
    </div>
  );
}
