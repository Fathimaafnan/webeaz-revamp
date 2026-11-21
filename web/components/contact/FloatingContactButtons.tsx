"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./FloatingContactButtons.module.css";

/**
 * Sticky floating contact buttons — mounted in the site layout so they
 * are available on every page.
 *
 * WhatsApp renders only when NEXT_PUBLIC_WHATSAPP_NUMBER is configured
 * (minimum 7 digits, stripped to digits) and opens a click-to-chat
 * (wa.me) link. When no number is configured the button is hidden —
 * never rendered as a placeholder — and no number is ever invented.
 *
 * On the homepage the WhatsApp button is hidden while the Hero section
 * is in view, then fades in once the visitor scrolls past it. Its visual
 * design, link and behaviour are otherwise unchanged.
 *
 * The button carries the official WhatsApp brand mark: the speech
 * bubble with the telephone handset, filled in white so it reads as
 * the logo against the brand green.
 */

const BTN_BASE =
  "floating-contact-button w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95";

export default function FloatingContactButtons() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [hiddenInHero, setHiddenInHero] = useState(isHome);

  useEffect(() => {
    if (!isHome) {
      setHiddenInHero(false);
      return;
    }

    let frame = 0;
    const check = () => {
      frame = 0;
      const hero = document.querySelector<HTMLElement>(".hero-base");
      // Once the Hero's bottom edge passes the top of the viewport, the
      // button is revealed; scrolling back into the Hero hides it again.
      const hide = hero ? hero.getBoundingClientRect().bottom > 0 : false;
      setHiddenInHero(hide);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [isHome]);

  const whatsAppRaw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    ?.replace(/[^\d]/g, "")
    || "";
  const whatsAppUrl =
    whatsAppRaw.length >= 7
      ? `https://wa.me/${whatsAppRaw}`
      : null;

  if (!whatsAppUrl) {
    // No number configured: render nothing rather than a dead button.
    return null;
  }

  return (
    <div
      className={`fixed z-[100] bottom-[92px] sm:bottom-[96px] right-6 flex flex-col gap-3 sm:gap-4 ${styles.container} ${
        hiddenInHero ? styles.hiddenInHero : ""
      }`}
      aria-label="Contact options"
    >
      {/* WhatsApp — real click-to-chat only when a number is configured;
          otherwise hidden (never rendered as a dead placeholder). */}
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`${BTN_BASE} ${styles.pulse} border border-[#0b5b2a] bg-[#25D366] text-white shadow-[#25D366]/35`}
      >
        {/* Official WhatsApp brand mark — speech bubble with telephone
            handset (official 24x24 WhatsApp artwork). Filled in white so
            the mark reads as the logo against the brand green. */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
