import type { Metadata } from "next";
import localFont from "next/font/local";
import { Nunito, Nunito_Sans } from "next/font/google";
import { BackToTop } from "@/components/back-to-top";
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
  title: "Foody Fam - One meal, whole family",
  description:
    "AI recipes that turn one cooking process into baby-friendly, kid-friendly, and adult-ready meals."
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
        <BackToTop />
      </body>
    </html>
  );
}
