import type { Metadata } from "next";
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
