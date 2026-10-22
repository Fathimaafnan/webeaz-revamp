type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  onDark?: boolean;
  /** Large display treatment for page-level section openers. */
  size?: "default" | "lg";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onDark = false,
  size = "default",
}: Props) {
  const centered = align === "center";
  return (
    <div
      className={`max-w-3xl ${centered ? "mx-auto text-center" : ""} ${
        onDark ? "text-white" : "text-ink"
      }`}
    >
      {eyebrow ? (
        <p
          className={`inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${
            onDark ? "text-brand-orange-light" : "text-brand-orange-strong"
          }`}
        >
          {/* short accent rule — a small brand signature on every opener */}
          <span
            aria-hidden="true"
            className={`h-px w-8 ${
              onDark
                ? "bg-gradient-to-r from-brand-orange to-transparent"
                : "bg-gradient-to-r from-brand-orange to-brand-blue"
            }`}
          />
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={`${size === "lg" ? "text-h1" : "text-h2"} text-balance font-bold ${
          eyebrow ? "mt-5" : ""
        }`}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={`mt-5 max-w-2xl text-lead ${
            centered ? "mx-auto" : ""
          } ${onDark ? "text-white/70" : "text-muted"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}