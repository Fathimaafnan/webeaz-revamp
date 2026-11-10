import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.webeaz.com"),
  title: {
    default:
      "WebEaz Technologies | Technology, Digital Growth, Automation & AI",
    template: "%s | WebEaz Technologies",
  },
  description:
    "WebEaz helps businesses build, transform, automate and grow through technology, digital growth, automation and AI.",
  alternates: { canonical: "/" },
  icons: {
    // Apple Touch Icon (180x180) served from /public. The favicon is
    // provided by the app/favicon.ico file convention — declared here
    // only once to avoid duplicate icon links.
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "WebEaz Technologies | Technology, Digital Growth, Automation & AI",
    description:
      "WebEaz helps businesses build, transform, automate and grow through technology, digital growth, automation and AI.",
    url: "https://www.webeaz.com",
    siteName: "WebEaz Technologies Pvt. Ltd.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

// Next.js 14+/16: theme color belongs in the viewport export (not
// metadata) and renders <meta name="theme-color" content="#1769D2">.
export const viewport: Viewport = {
  themeColor: "#1769D2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
