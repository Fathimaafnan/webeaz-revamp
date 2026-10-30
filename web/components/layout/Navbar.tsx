"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import ProfileMenu from "@/components/layout/ProfileMenu";
import {
  getNavIntroRequest,
  reducedMotion,
  requestNavIntro,
} from "@/lib/intro";

const links = [
  { label: "Solutions", href: "/solutions" },
  { label: "Digital", href: "/digital" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Our Work", href: "/our-work" },
  { label: "Company", href: "/company" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
];

/**
 * Light premium navbar — a translucent cool-white glass that
 * separates from the blue Hero above it and stays defined against
 * the light sections below it. Navigation items are deep navy and
 * transition to the brand blue on hover with an animated orange
 * underline; the active page carries that underline at rest.
 * Scrolling raises the bar toward opaque so page content passing
 * under it never competes with the links.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * The main navigation actions hand their navigation to the brand
   * reveal.
   *
   * The link's own click is prevented — Next's Link calls the
   * consumer's onClick first and then returns early if the event was
   * prevented — so the reveal can play first and perform the push
   * itself once the logo has resolved.
   *
   * This is deliberately scoped. Only the eight main navigation
   * actions use it. Every card, service link, product card, article
   * card, footer link, profile-menu item and content button on the
   * site navigates exactly as it did before, with no reveal and no
   * interception anywhere near it.
   */
  const revealThenGo = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    // A reveal is already playing — swallow the click rather than
    // let a second navigation race it.
    if (getNavIntroRequest()) {
      event.preventDefault();
      return;
    }
    // Reduced motion: no reveal, straight to the destination.
    if (reducedMotion()) return;

    event.preventDefault();
    requestNavIntro(href);
  };

  /** The same, for the links inside the mobile panel. */
  const mobileRevealThenGo = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    revealThenGo(href)(event);
  };

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? // Once there is page content under the bar it stops being a
            // window onto the Hero and becomes its own surface, so it
            // goes near-opaque: the links and the logo then never have to
            // compete with whatever is scrolling past beneath them. At the
            // top of the page it keeps a few percent of translucency so the
            // Hero's own field reads faintly through it.
            "navbar-glass navbar-glass-solid"
          : "navbar-glass"
      }`}
    >
      <nav
        className="mx-auto flex h-[4.75rem] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          aria-label="WebEaz Technologies home"
          className="shrink-0"
        >
          {/* The official WebEaz logo, used exactly the way webeaz.com
              uses it on a light navigation bar:
              `/assets/logos/webeaz-color-logo.png`, byte-identical to
              the file served from
              https://www.webeaz.com/_assets/images/logos/webeaz-color-logo.png
              (SHA256 587b7747…, 6,945 bytes).

              WebEaz ships two official lockups of the same mark and
              they are built for opposite grounds. Both are 185px wide,
              both keep "Web" in the brand blue and "Eaz" in the brand
              orange, both carry the "Makes Your Business Easier"
              tagline inside the same file — but the tagline is drawn
              for the bar it belongs to:

                webeaz-logo-brand.png   tagline #ffffff   1.00:1 on white
                this file              tagline #7f8181   3.92:1 on white

              The file this navbar was pointing at is the dark-bar
              variant, so on a light surface its white tagline measured
              exactly 1.00:1 — mathematically invisible, and no amount
              of opacity on the bar can fix that because it is the
              asset, not the ground, that is white.

              This one is the light-bar variant. Nothing is done to the
              image: no plate, box, badge, border, shadow, mask,
              filter, crop or recolour. It sits directly on the shared
              bar surface, and its intrinsic 185:54 aspect is preserved
              because only the height is set.

              Measured against the bar as rendered — 4.25:1 to 4.67:1
              for the "Web" blue and 3.43:1 to 3.77:1 for the tagline,
              depending on what is behind the glass. The orange "Eaz"
              is the one genuinely soft spot at about 1.98:1, but that
              is the brand orange on a light ground and it is how the
              official site renders the same file; changing it would
              mean recolouring the logo, which is out of bounds.

              The file is served unoptimised on purpose. The image
              optimiser re-encodes it to a lossy WebP, and on a mark
              this small that flattens the artwork from twelve
              distinct colours to four: the brand blue and orange
              posterise and the hairline tagline goes soft. The
              original PNG is 6,945 bytes, so the lossless file is
              the cheaper one to ship as well as the truer one. */}
          <Image
            src="/assets/logos/webeaz-color-logo.png"
            alt="WebEaz"
            width={185}
            height={54}
            priority
            unoptimized
            className="h-12 w-auto"
          />
        </Link>

        <ul className="hidden min-w-0 items-center gap-2 lg:flex lg:gap-4">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={revealThenGo(l.href)}
                  aria-current={active ? "page" : undefined}
                  className={`group relative whitespace-nowrap rounded-md px-1 py-1.5 text-sm font-semibold tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep ${
                    active
                      ? "text-brand-blue-deep"
                      : "text-grey-600 hover:text-brand-blue-deep"
                  }`}
                >
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-1 h-0.5 w-[calc(100%_-_0.5rem)] origin-left rounded-full bg-brand-orange transition-transform duration-300 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden md:block">
            <Link
              href="/contact"
              onClick={revealThenGo("/contact")}
              className="shrink-0 rounded-full bg-brand-orange px-3.5 py-2.5 text-sm font-bold text-ink shadow-[0_8px_20px_-8px_rgba(247,149,34,0.7)] transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep lg:px-5"
            >
              Let&apos;s Talk
            </Link>
          </div>
          <ProfileMenu />
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-brand-blue-deep"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </nav>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open
            ? "navbar-panel max-h-96 border-t border-brand-blue/15 shadow-lg shadow-[#09283f]/10"
            : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-5 py-4">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={mobileRevealThenGo(l.href)}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-md px-3 py-3 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${
                    active
                      ? "text-brand-blue-deep"
                      : "text-grey-600 hover:bg-brand-blue-soft hover:text-brand-blue-deep"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li className="pt-2">
            <Link
              href="/contact"
              onClick={mobileRevealThenGo("/contact")}
              className="inline-flex w-full justify-center rounded-full bg-brand-orange px-6 py-3 text-[15px] font-bold text-ink shadow-[0_8px_20px_-8px_rgba(247,149,34,0.7)]"
            >
              Let&apos;s Talk
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2.5 text-sm font-medium text-grey-600 transition-colors duration-300 hover:bg-brand-blue-soft hover:text-brand-blue-deep"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2.5 text-sm font-medium text-grey-600 transition-colors duration-300 hover:bg-brand-blue-soft hover:text-brand-blue-deep"
            >
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
