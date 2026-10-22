import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IntroSplash from "@/components/home/IntroSplash";

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
      <body className="min-h-full flex flex-col">
        {/* The brand reveal lives at the root so it can cover a route
            change. Mounted in the page it would unmount the instant
            the destination rendered, which is exactly the moment the
            overlay has to still be there. */}
        <IntroSplash />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
