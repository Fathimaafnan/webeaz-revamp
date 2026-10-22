import type { ServiceIconName } from "@/lib/services";

/**
 * Line-icon set for the Services system. Abstract and
 * technology-flavoured, matching the Home page card language.
 * All icons inherit `currentColor` and are aria-hidden — they
 * decorate existing content and never replace it.
 */
export default function ServiceIcon({
  name,
  className = "h-6 w-6",
}: {
  name: ServiceIconName;
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
    case "website":
      return (
        <svg {...common}>
          <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
          <path d="M2.5 8.5h19M6 6.3h.01M8.5 6.3h.01" />
          <path d="M6 12.5h6M6 16h9" />
        </svg>
      );
    case "mobile":
      return (
        <svg {...common}>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
          <path d="M10.5 18.5h3" />
          <path d="M6.5 7.5h11" />
        </svg>
      );
    case "ecommerce":
      return (
        <svg {...common}>
          <path d="M4 6h16l-1.4 10.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 6z" />
          <path d="M9 6V5a3 3 0 0 1 6 0v1" />
        </svg>
      );
    case "software":
      return (
        <svg {...common}>
          <path d="M8.5 8.5 4.5 12l4 3.5M15.5 8.5l4 3.5-4 3.5M13.5 5l-3 14" />
        </svg>
      );
    case "product":
      return (
        <svg {...common}>
          <path d="M12 2.8 20.5 7v10L12 21.2 3.5 17V7L12 2.8z" />
          <path d="M3.5 7 12 11.4 20.5 7M12 11.4v9.8" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path d="M7 18.5A4 4 0 0 1 7.3 10.6a5.2 5.2 0 0 1 9.9-.6A3.8 3.8 0 0 1 17.5 18.5H7z" />
        </svg>
      );
    case "marketing":
      return (
        <svg {...common}>
          <path d="M4 10.5v3a1.5 1.5 0 0 0 1.5 1.5H7l5 4V6.5L7 10.5H5.5A1.5 1.5 0 0 0 4 12" />
          <path d="M16 9.2a4 4 0 0 1 0 5.6M18.8 6.5a7.6 7.6 0 0 1 0 11" />
        </svg>
      );
    case "seo":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M20 20l-4.6-4.6" />
          <path d="M8 12.5l2-3 2 2 1.5-2.5" />
        </svg>
      );
    case "ads":
      return (
        <svg {...common}>
          <path d="M3.5 10.5v3a1.5 1.5 0 0 0 1.5 1.5H7l5 4v-15l-5 4H5a1.5 1.5 0 0 0-1.5 1.5z" />
          <path d="M16.5 9.5h4.5M18.8 7.2l3 3M18.8 11.8l3-3" />
        </svg>
      );
    case "meta":
      return (
        <svg {...common}>
          <path d="M3 19V7.5l5.5 3.2V19" />
          <path d="M8.5 10.7 14 7.5V19" />
          <ellipse cx="17" cy="13.6" rx="4" ry="5.4" />
        </svg>
      );
    case "social":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="17" cy="7" r="2.5" />
          <path d="M2.8 19.5c.5-3.2 2.6-5 5.2-5s4.7 1.8 5.2 5" />
          <path d="M15 13.6c2.6-.7 5 .7 5.8 4" />
        </svg>
      );
    case "funnel":
      return (
        <svg {...common}>
          <path d="M3.5 5h17l-6.5 7.6V20l-4-2.2v-5.2L3.5 5z" />
          <path d="M9 8.5h6" />
        </svg>
      );
    case "content":
      return (
        <svg {...common}>
          <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
          <path d="M7 9h10M7 13h10M7 17h6" />
        </svg>
      );
    case "crm":
      return (
        <svg {...common}>
          <circle cx="9" cy="8.5" r="3" />
          <path d="M3 19.5c.4-3.1 2.6-4.8 6-4.8s5.6 1.7 6 4.8" />
          <circle cx="17" cy="9.5" r="2.3" />
          <path d="M16.2 14.6c2.6-.4 4.4 1 4.8 3.9" />
        </svg>
      );
    case "marketing-automation":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21" />
          <path d="M5.6 5.6 8 8M16 16l2.4 2.4M18.4 5.6 16 8M8 16l-2.4 2.4" />
        </svg>
      );
    case "sales-automation":
      return (
        <svg {...common}>
          <path d="M3.5 17.5 9 11l3.5 3.5L20.5 6.5" />
          <path d="M15.5 6.5h5v5" />
          <path d="M3.5 20.5h17" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.4-4.4A8.4 8.4 0 1 1 20.5 11.7z" />
          <path d="M9 9.2c0 3 2.3 5.3 5.3 5.3.5 0 .9-.4.9-.9v-.8l-1.9-.7-.9 1a5 5 0 0 1-1.9-1.9l1-.9-.7-1.9h-.8c-.5 0-.9.4-.9.9z" />
        </svg>
      );
    case "workflow":
      return (
        <svg {...common}>
          <rect x="2.8" y="4" width="6.4" height="5" rx="1.4" />
          <rect x="14.8" y="4" width="6.4" height="5" rx="1.4" />
          <rect x="8.8" y="15" width="6.4" height="5" rx="1.4" />
          <path d="M6 9v3h12V9M12 12v3" />
        </svg>
      );
    case "process":
      return (
        <svg {...common}>
          <circle cx="5.5" cy="6" r="2.5" />
          <circle cx="18.5" cy="12" r="2.5" />
          <circle cx="5.5" cy="18" r="2.5" />
          <path d="M8 6h4.5a3 3 0 0 1 3 3v.5M8 18h4.5a3 3 0 0 0 3-3v-.5" />
        </svg>
      );
    case "ai-consulting":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.6" />
          <path d="M12 3.2v3M12 17.8v3M3.2 12h3M17.8 12h3" />
          <path d="M5.8 5.8 7.8 7.8M16.2 16.2l2 2M18.2 5.8l-2 2M7.8 16.2l-2 2" />
        </svg>
      );
    case "ai-integration":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="7" height="10" rx="2" />
          <rect x="14" y="7" width="7" height="10" rx="2" />
          <path d="M10 12h4M12 10v4" />
        </svg>
      );
    case "ai-automation":
      return (
        <svg {...common}>
          <rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" />
          <path d="M8.5 20.5h7M12 16.5v4" />
          <path d="M6.5 10.5l3 3 3-6 3 6 2-3" />
        </svg>
      );
    case "ai-agents":
      return (
        <svg {...common}>
          <rect x="4" y="7" width="16" height="12" rx="3.5" />
          <path d="M12 7V4M9.5 13h.01M14.5 13h.01M9.8 16.2h4.4" />
        </svg>
      );
    case "ai-apps":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
        </svg>
      );
  }
}