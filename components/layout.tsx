"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui";
import { cn } from "@/lib/utils";
import { ScrollProgressGlow } from "./motion";

const nav = [
  { href: "/#how", label: "How it works" },
  { href: "/recipes", label: "Recipes" },
  { href: "/planner", label: "Meal Planner" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About us" }
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden">
      <ScrollProgressGlow />
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#5c4a42]/10 bg-[#fffaf6]/86 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="Foody Fam" width={132} height={66} className="h-14 w-auto object-contain" priority />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-extrabold text-[#3c332f] lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#78bea8]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login">
            <Button variant="secondary">Log in</Button>
          </Link>
          <Link href="/onboarding">
            <Button>Sign up</Button>
          </Link>
        </div>
        <button
          aria-label="Open menu"
          className="rounded-full border border-[#e9c7b7] bg-white p-3 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#5c4a42]/10 bg-[#fffaf6] px-4 pb-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm font-extrabold",
                  pathname === item.href ? "bg-[#f7efe9] text-[#f59b78]" : "text-[#5c4a42]"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/onboarding" onClick={() => setOpen(false)}>
              <Button className="w-full">
                <Sparkles size={16} />
                Get started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const columns = [
    ["Recipes", "Meal Planner", "How it works", "Pricing"],
    ["About us", "Blog", "Contact", "Careers"],
    ["Help Center", "Privacy Policy", "Terms of Service", "Allergy Safety"]
  ];

  return (
    <footer className="mt-16 bg-[#e8f4ef] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_2fr_1.2fr]">
        <div>
          <Image src="/brand/logo.png" alt="Foody Fam" width={142} height={70} className="mb-3 h-16 w-auto object-contain" />
          <p className="max-w-xs text-sm font-bold text-[#5c4a42]">One meal, whole family.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column, index) => (
            <div key={index} className="grid content-start gap-3">
              {column.map((item) => (
                <Link key={item} href="#" className="text-sm font-bold text-[#5c4a42] hover:text-[#f59b78]">
                  {item}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <form className="grid content-start gap-3" onSubmit={(event) => event.preventDefault()}>
          <p className="text-sm font-extrabold text-[#5c4a42]">Stay in the loop</p>
          <div className="flex rounded-full bg-white p-1 shadow-sm">
            <input aria-label="Email address" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" />
            <Button className="min-h-10 px-4">Subscribe</Button>
          </div>
        </form>
      </div>
    </footer>
  );
}
