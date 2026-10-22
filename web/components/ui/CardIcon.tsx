type IconName =
  | "technology"
  | "digital-growth"
  | "automation"
  | "ai"
  | "industry"
  | "insight"
  | "work"
  | "outcome";

/**
 * Small line-icon set used by the Home page cards. Deliberately
 * abstract and technology-flavoured — these are decorative
 * accents for content that already exists, never new content.
 * Icons inherit `currentColor` and are aria-hidden.
 */
export default function CardIcon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "technology":
      return (
        <svg {...common}>
          <rect x="2.5" y="4" width="19" height="13" rx="2" />
          <path d="M8 21h8M12 17v4" />
          <path d="M2.5 8.5h19" />
        </svg>
      );
    case "digital-growth":
      return (
        <svg {...common}>
          <path d="M3 17.5 9 11l4 4 8-8.5" />
          <path d="M15.5 6.5H21V12" />
          <path d="M3 21h18" />
        </svg>
      );
    case "automation":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
        </svg>
      );
    case "ai":
      return (
        <svg {...common}>
          <rect x="6.5" y="6.5" width="11" height="11" rx="3" />
          <circle cx="10" cy="11" r="1" fill="currentColor" stroke="none" />
          <circle cx="14" cy="11" r="1" fill="currentColor" stroke="none" />
          <path d="M9.5 14.5h5M12 3v3.5M12 17.5V21" />
        </svg>
      );
    case "industry":
      return (
        <svg {...common}>
          <path d="M3 20.5h18" />
          <path d="M4.5 20.5V11l5 3.2V11l5 3.2V6.5h4.5v14" />
        </svg>
      );
    case "insight":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.4-4.4" />
        </svg>
      );
    case "work":
      return (
        <svg {...common}>
          <rect x="2.5" y="6.5" width="19" height="13" rx="2.5" />
          <path d="M8.5 6.5V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
          <path d="M2.5 12.5h19" />
        </svg>
      );
    case "outcome":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}