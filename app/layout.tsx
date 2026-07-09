import type { Metadata } from "next";
import localFont from "next/font/local";
import { Nunito, Nunito_Sans } from "next/font/google";
import { BackToTop } from "@/components/back-to-top";
import { CookieConsent } from "@/components/cookie-consent";
import { absoluteUrl, defaultOgImage, getSiteUrl, siteName } from "@/lib/seo";
import "./globals.css";

const display = Nunito({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"]
});

const body = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700", "800"]
});

const dacherry = localFont({
  src: "../resources/Dacherry/Dacherry.ttf",
  variable: "--font-dacherry",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: siteName,
  title: {
    default: "Foody Fam - AI Meal Planner for One Family Meal",
    template: `%s | ${siteName}`
  },
  description:
    "Foody Fam turns one cooking process into baby-safe portions, adult finishes, shopping lists, and weekly meal plans.",
  keywords: [
    "AI meal planner",
    "baby-safe recipes",
    "family meal planner",
    "BLW recipes",
    "puree recipes",
    "one meal whole family",
    "weekly meal planner"
  ],
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: "Foody Fam - One meal, whole family",
    description:
      "AI recipes that turn one cooking process into baby-friendly, kid-friendly, and adult-ready meals.",
    url: getSiteUrl(),
    siteName,
    type: "website",
    images: [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630, alt: "Foody Fam family meal preview" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Foody Fam - One meal, whole family",
    description:
      "AI recipes that turn one cooking process into baby-friendly, kid-friendly, and adult-ready meals.",
    images: [absoluteUrl(defaultOgImage)]
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${dacherry.variable}`}>
        {children}
        <CookieConsent />
        <BackToTop />
      </body>
    </html>
  );
}
