import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/defaults";
import {
  DEFAULT_FOOTER_LINKS,
  DEFAULT_FOOTER_SETTINGS,
  type FooterLinkData,
} from "@/lib/fallback-content";
import styles from "./Footer.module.css";

/**
 * Footer — markup, classes and styling are unchanged. All link rows,
 * social icons and settings strings now arrive from the CMS, with the
 * exact previous content supplied as fallbacks.
 */

/** Official brand marks remain presentation code, selected by iconKey. */
const SOCIAL_ICONS: Record<string, string> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
};

/** Official brand colours for the single-colour social marks. */
const SOCIAL_ICON_COLORS: Record<string, string> = {
  linkedin: "#0A66C2",
  facebook: "#1877F2",
  youtube: "#FF0000",
};

/** Instagram's original multi-stop gradient (yellow → orange → pink → purple). */
const INSTAGRAM_GRADIENT_ID = "webeaz-instagram-gradient";

const COLUMN_GROUPS = ["PRODUCTS", "COMPANY", "SUPPORT", "LEGAL"] as const;
const COLUMN_HEADINGS: Record<string, string> = {
  PRODUCTS: "Products", COMPANY: "Company", SUPPORT: "Support", LEGAL: "Legal",
};

type FooterProps = {
  links?: FooterLinkData[];
  socials?: FooterLinkData[];
  settings?: SiteSettings;
  logoUrl?: string;
};

export default function Footer({
  links = DEFAULT_FOOTER_LINKS,
  socials = [],
  settings = {
    siteName: DEFAULT_FOOTER_SETTINGS.siteName,
    siteDescription: DEFAULT_FOOTER_SETTINGS.siteDescription,
    footerTagline: DEFAULT_FOOTER_SETTINGS.footerTagline,
    footerBlurb: DEFAULT_FOOTER_SETTINGS.footerBlurb,
    footerNote: DEFAULT_FOOTER_SETTINGS.footerNote,
  } as SiteSettings,
  logoUrl = DEFAULT_FOOTER_SETTINGS.footerLogoUrl,
}: FooterProps) {
  // When no CMS social rows are supplied, fall back to the four previous links.
  const socialLinks = socials.length > 0
    ? socials
    : DEFAULT_FOOTER_LINKS.filter((l) => l.group === "SOCIAL");

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Brand column */}
          <div className={styles.brand}>
            <Image
              src={logoUrl}
              alt="WebEaz"
              width={1746}
              height={483}
              unoptimized
              className={styles.logo}
            />
            <p className={styles.tagline}>{settings.footerBlurb}</p>
            <div className={styles.social}>
              {socialLinks.map((s) => {
                const key = s.iconKey ?? s.label.toLowerCase();
                const isInstagram = key === "instagram";
                const iconFill = isInstagram
                  ? `url(#${INSTAGRAM_GRADIENT_ID})`
                  : (SOCIAL_ICON_COLORS[key] ?? "currentColor");
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow WebEaz on ${s.label}`}
                    className={styles.socialLink}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={iconFill}
                      aria-hidden="true"
                      focusable="false"
                    >
                      {isInstagram ? (
                        <defs>
                          <linearGradient
                            id={INSTAGRAM_GRADIENT_ID}
                            x1="0%"
                            y1="100%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#FEDA75" />
                            <stop offset="33%" stopColor="#FA7E1E" />
                            <stop offset="66%" stopColor="#D62976" />
                            <stop offset="100%" stopColor="#962FBF" />
                          </linearGradient>
                        </defs>
                      ) : null}
                      <path d={SOCIAL_ICONS[key] ?? ""} />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className={styles.links}>
            {COLUMN_GROUPS.map((group) => (
              <div key={group} className={styles.column}>
                <h4>{COLUMN_HEADINGS[group]}</h4>
                <ul className={group === "PRODUCTS" ? styles.productGrid : undefined}>
                  {links
                    .filter((l) => l.group === group)
                    .map((l) =>
                      /^https?:\/\//.test(l.href) ? (
                        <li key={l.label}>
                          <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                        </li>
                      ) : (
                        <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
                      ),
                    )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer bottom */}
        <div className={styles.bottom}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} {settings.siteName} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
