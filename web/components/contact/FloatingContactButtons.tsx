"use client";

/**
 * Sticky floating contact buttons — WhatsApp and Call — mounted in the
 * root layout so they are available on every page.
 *
 * WhatsApp renders only when NEXT_PUBLIC_WHATSAPP_NUMBER is configured
 * (minimum 7 digits, stripped to digits) and opens a click-to-chat
 * (wa.me) link. When no number is configured the button is hidden —
 * never rendered as a placeholder — and no number is ever invented.
 *
 * The Call button links to the official phone number from
 * NEXT_PUBLIC_PHONE_NUMBER when configured; otherwise it is rendered
 * as a non-functional placeholder. No numbers are invented or hardcoded.
 */

const BTN_BASE =
  "floating-contact-button w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95";

export default function FloatingContactButtons() {
  const phoneRaw = process.env.NEXT_PUBLIC_PHONE_NUMBER
    ?.replace(/[^\d+]/g, "")
    || null;
  const telUrl = phoneRaw ? `tel:${phoneRaw}` : null;

  const whatsAppRaw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    ?.replace(/[^\d]/g, "")
    || "";
  const whatsAppUrl =
    whatsAppRaw.length >= 7
      ? `https://wa.me/${whatsAppRaw}`
      : null;

  const hasAnyAction = Boolean(telUrl || whatsAppUrl);

  if (!hasAnyAction) {
    // No numbers configured: render nothing rather than a dead button.
    return null;
  }

  return (
    <div
      className="fixed z-40 bottom-8 right-6 flex flex-col gap-3 sm:gap-4 pointer-events-auto"
      aria-label="Contact options"
    >
      {/* WhatsApp — real click-to-chat only when a number is configured;
          otherwise hidden (never rendered as a dead placeholder). */}
      {whatsAppUrl ? (
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className={`${BTN_BASE} border border-[#0b5b2a] bg-[#25D366] text-ink shadow-[#25D366]/35`}
        >
        {/* Official WhatsApp brand mark — speech bubble with telephone
            handset (official 24x24 WhatsApp artwork). Uses the official
            brand path, filled in the button's current brand-ink colour. */}
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
      ) : null}

      {/* Call — functional tel: link when number is configured, otherwise placeholder */}
      {telUrl ? (
        <a
          href={telUrl}
          aria-label="Call WebEaz"
          className={`${BTN_BASE} bg-brand-blue text-white shadow-brand-blue/30`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="sr-only">Call WebEaz</span>
        </a>
      ) : (
        <button
          type="button"
          aria-label="Call WebEaz – coming soon"
          className={`${BTN_BASE} bg-brand-blue text-white shadow-brand-blue/30`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="sr-only">Call WebEaz – coming soon</span>
        </button>
      )}
    </div>
  );
}
