"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
} from "react";
import ProfileMenu from "@/components/layout/ProfileMenu";
import {
  getNavIntroRequest,
  introAlreadySeen,
  reducedMotion,
  requestNavIntro,
} from "@/lib/intro";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Industries", href: "/industries" },
  { label: "Our Work", href: "/our-work" },
  { label: "Insights", href: "/insights" },
];

type DropdownItem = {
  label: string;
  description: string;
  href: string;
  tagList?: string[];
};

type NavigationDropdownProps = {
  label: string;
  items: DropdownItem[];
  active: boolean;
  mobile?: boolean;
  footerLink?: { label: string; href: string };
  onNavigate: (href: string) => (event: MouseEvent<HTMLAnchorElement>) => void;
};

function NavigationDropdown({
  label,
  items,
  active,
  mobile = false,
  footerLink,
  onNavigate,
}: NavigationDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = `nav-${label.toLowerCase()}-${mobile ? "mobile" : "desktop"}-menu`;

  useEffect(() => {
    if (!open || mobile) return;

    const onPointerDown = (event: PointerEvent) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        triggerRef.current?.focus();
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobile, open]);

  const closeWhenFocusLeaves = (
    event: FocusEvent<HTMLLIElement>,
  ) => {
    if (
      !(event.relatedTarget instanceof Node) ||
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      setOpen(false);
    }
  };

  const openAndFocusFirst = () => {
    setOpen(true);
    requestAnimationFrame(() => {
      wrapRef.current?.querySelector<HTMLAnchorElement>(
        `#${menuId} a`,
      )?.focus();
    });
  };

  return (
    <li
      ref={wrapRef}
      className={`relative ${mobile ? "w-full" : ""}`}
      onMouseEnter={() => {
        if (!mobile) setOpen(true);
      }}
      onMouseLeave={(event) => {
        if (
          !mobile &&
          !event.currentTarget.querySelector(":focus-visible")
        ) {
          setOpen(false);
        }
      }}
      onBlur={closeWhenFocusLeaves}
      onKeyDown={(event) => {
        if (!mobile && event.key === "ArrowDown" && event.target === triggerRef.current) {
          event.preventDefault();
          openAndFocusFirst();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        aria-current={active ? "page" : undefined}
        onFocus={() => {
          if (!mobile) setOpen(true);
        }}
        onClick={() => {
          if (!mobile) {
            setOpen(true);
          } else {
            setOpen((currentlyOpen) => !currentlyOpen);
          }
        }}
        className={`${
          mobile
            ? `flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep ${
                active || open
                  ? "text-brand-blue-deep"
                  : "text-grey-700 hover:bg-brand-blue-soft hover:text-brand-blue-deep"
              }`
            : `group relative inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-md px-2 text-[13px] font-semibold tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep xl:px-2.5 xl:text-sm ${
                active || open
                  ? "text-brand-blue-deep"
                  : "text-grey-600 hover:text-brand-blue-deep"
              }`
        }`}
      >
        {label}
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
        {!mobile && (
          <span
            aria-hidden="true"
            className={`absolute inset-x-2 bottom-1 h-0.5 origin-left rounded-full bg-brand-orange transition-transform duration-200 xl:inset-x-2.5 ${
              active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            }`}
          />
        )}
      </button>

      <div
        id={menuId}
        aria-label={`${label} links`}
        aria-hidden={!open}
        inert={!open}
        className={`navbar-panel ${
          mobile
            ? `grid overflow-hidden rounded-lg transition-[grid-template-rows,opacity] duration-200 ${
                open
                  ? "mt-1 grid-rows-[1fr] opacity-100"
                  : "pointer-events-none grid-rows-[0fr] opacity-0"
              }`
            : `absolute left-0 top-full z-50 w-[min(22rem,calc(100vw-2rem))] origin-top-left overflow-hidden rounded-xl border border-line shadow-xl shadow-[#09283f]/15 transition-[visibility,transform,opacity] duration-200 ${
                open
                  ? "visible scale-100 opacity-100"
                  : "invisible pointer-events-none scale-[0.98] opacity-0"
              }`
        }`}
      >
        <ul
          className={`min-h-0 ${
            mobile
              ? "overflow-hidden rounded-lg border-l-2 border-brand-orange/70"
              : "p-2"
          }`}
        >
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={(event) => {
                  setOpen(false);
                  onNavigate(item.href)(event);
                }}
                className={`block min-h-11 rounded-lg px-3 py-2.5 transition-colors hover:bg-brand-blue-soft focus-visible:bg-brand-blue-soft focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-blue-deep ${
                  mobile ? "pl-5" : ""
                }`}
              >
                <span className="block text-sm font-semibold text-grey-800">
                  {item.label}
                </span>
                {item.tagList ? (
                  <div className="mt-0.5 flex flex-wrap gap-1">
                    {item.tagList.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-blue-deep"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="mt-0.5 block text-xs leading-5 text-grey-600">
                    {item.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
          {footerLink && (
            <li className={mobile ? "px-2 pt-1" : "border-t border-line pt-1"}>
              <Link
                href={footerLink.href}
                onClick={(event) => {
                  setOpen(false);
                  onNavigate(footerLink.href)(event);
                }}
                className={`flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-bold text-brand-blue-deep transition-colors hover:bg-brand-blue-soft focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-blue-deep ${
                  mobile ? "pl-5" : ""
                }`}
              >
                {footerLink.label}
                <span aria-hidden="true" className="text-brand-orange">
                  →
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </li>
  );
}

export default function Navbar({
  serviceItems,
}: {
  serviceItems: DropdownItem[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileState, setMobileState] = useState({
    pathname,
    open: false,
  });
  const mobileOpen = mobileState.pathname === pathname && mobileState.open;
  const setMobileOpen = useCallback(
    (open: boolean) => setMobileState({ pathname, open }),
    [pathname],
  );
  const mobileMenuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        mobileMenuButton.current?.focus();
      }
    };
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const onDesktopResize = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktopQuery.addEventListener("change", onDesktopResize);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktopQuery.removeEventListener("change", onDesktopResize);
    };
  }, [mobileOpen, setMobileOpen]);

  const revealThenGo =
    (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      // The intro splash plays once per browser session (on the initial
      // visit). Once it has been seen, internal navigation must not replay
      // it or artificially delay the click — let Next.js navigate normally.
      if (introAlreadySeen()) return;
      if (getNavIntroRequest()) {
        event.preventDefault();
        return;
      }
      if (reducedMotion()) return;

      event.preventDefault();
      requestNavIntro(href);
    };

  const mobileRevealThenGo =
    (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      setMobileOpen(false);
      revealThenGo(href)(event);
    };

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const navLinkClass = (active: boolean) =>
    `group relative inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-2 text-[13px] font-semibold tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep xl:px-2.5 xl:text-sm ${
      active
        ? "text-brand-blue-deep"
        : "text-grey-600 hover:text-brand-blue-deep"
    }`;

  const navLinks = (mobile = false) =>
    links.map((link) => {
      const active = isActive(link.href);
      return (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={
              mobile
                ? mobileRevealThenGo(link.href)
                : revealThenGo(link.href)
            }
            aria-current={active ? "page" : undefined}
            className={
              mobile
                ? `flex min-h-11 items-center rounded-lg px-3 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep ${
                    active
                      ? "bg-brand-blue-soft text-brand-blue-deep"
                      : "text-grey-700 hover:bg-brand-blue-soft hover:text-brand-blue-deep"
                  }`
                : navLinkClass(active)
            }
          >
            {link.label}
            {!mobile && (
              <span
                aria-hidden="true"
                className={`absolute inset-x-2 bottom-1 h-0.5 origin-left rounded-full bg-brand-orange transition-transform duration-200 xl:inset-x-2.5 ${
                  active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            )}
          </Link>
        </li>
      );
    });
  const renderedLinks = navLinks();
  const renderedMobileLinks = navLinks(true);

  return (
    <header
      className={`sticky inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-glass navbar-glass-solid" : "navbar-glass"
      }`}
    >
      <nav
        className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          aria-label="WebEaz Technologies home"
          className="inline-flex min-h-11 shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue-deep"
        >
          <Image
            src="/webeaz-logo.png"
            alt="WebEaz"
            width={1746}
            height={483}
            priority
            unoptimized
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        <div className="hidden min-w-0 items-center gap-2 lg:flex xl:gap-3">
          <ul className="flex min-w-0 items-center gap-0.5 xl:gap-1">
            {renderedLinks.slice(0, 1)}
            {renderedLinks.slice(1, 2)}
            <NavigationDropdown
              label="Services"
              items={serviceItems}
              active={isActive("/services")}
              footerLink={{ label: "View all services", href: "/services" }}
              onNavigate={revealThenGo}
            />
            {renderedLinks.slice(2)}
            <li>
              <ProfileMenu key={pathname} />
            </li>
          </ul>
          <Link
            href="/contact"
            onClick={revealThenGo("/contact")}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-brand-orange px-4 text-sm font-bold text-ink shadow-[0_8px_20px_-8px_rgba(247,149,34,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep xl:px-5"
          >
            Let&apos;s Talk
          </Link>
        </div>

        <button
          ref={mobileMenuButton}
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-brand-blue-deep transition-colors hover:bg-brand-blue-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep lg:hidden"
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        className={`navbar-panel overflow-y-auto overscroll-contain border-t border-brand-blue/15 transition-[max-height,opacity] duration-300 lg:hidden ${
          mobileOpen
            ? "max-h-[calc(100dvh-4.75rem)] opacity-100 shadow-lg shadow-[#09283f]/10"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="flex min-h-14 items-center justify-between border-b border-line px-5">
          <span className="text-sm font-bold text-ink">Menu</span>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              mobileMenuButton.current?.focus();
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-grey-700 transition-colors hover:bg-brand-blue-soft hover:text-brand-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            Close menu
          </button>
        </div>

        <ul className="flex flex-col gap-1 px-4 py-3 sm:px-6">
          {renderedMobileLinks.slice(0, 1)}
          {renderedMobileLinks.slice(1, 2)}
          <NavigationDropdown
            label="Services"
            items={serviceItems}
            active={isActive("/services")}
            footerLink={{ label: "View all services", href: "/services" }}
            mobile
            onNavigate={mobileRevealThenGo}
          />
          {renderedMobileLinks.slice(2)}
          <li className="border-t border-line pt-2">
            <ProfileMenu key={`mobile-${pathname}`} mobile />
          </li>
          <li className="pt-2">
            <Link
              href="/contact"
              onClick={mobileRevealThenGo("/contact")}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-orange px-6 text-[15px] font-bold text-ink shadow-[0_8px_20px_-8px_rgba(247,149,34,0.65)] transition-colors hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep"
            >
              Let&apos;s Talk
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
