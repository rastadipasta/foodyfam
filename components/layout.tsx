"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Facebook, Instagram, LogOut, Menu, Settings, Sparkles, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui";
import { cn } from "@/lib/utils";
import { ScrollProgressGlow } from "./motion";
import { signOutActiveAuth } from "@/lib/auth-adapter";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { loadSupabaseSnapshot } from "@/lib/supabase/profile-sync";
import { useAppStore } from "@/store/useAppStore";

const nav = [
  { href: "/#how", label: "How it works" },
  { href: "/recipes", label: "Recipes" },
  { href: "/planner", label: "Meal Planner" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About us" }
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dashboardEmbedded = pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen overflow-hidden">
      <SupabaseSessionBridge />
      <ScrollProgressGlow />
      {!dashboardEmbedded && <Header />}
      {children}
      {!dashboardEmbedded && <Footer />}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const authUser = useAppStore((state) => state.authUser);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const logout = useAppStore((state) => state.logout);
  const loggedIn = isAuthenticated && authUser;

  async function handleLogout() {
    await signOutActiveAuth();
    logout();
    setOpen(false);
    router.push("/");
  }

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
        {loggedIn ? (
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/dashboard">
              <Button variant="secondary">Dashboard</Button>
            </Link>
            <Link href="/dashboard/profiles" className="flex items-center gap-2 rounded-full border border-[#e9c7b7] bg-white px-3 py-2 text-sm font-extrabold text-[#5c4a42] shadow-sm transition hover:-translate-y-0.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffccb2] text-xs font-black">
                {authUser.displayName.slice(0, 1)}
              </span>
              {authUser.displayName.split(" ")[0]}
            </Link>
            <button
              type="button"
              aria-label="Log out"
              className="grid h-11 w-11 place-items-center rounded-full border border-[#e9c7b7] bg-white text-[#5c4a42] shadow-sm transition hover:bg-[#f7efe9]"
              onClick={() => void handleLogout()}
            >
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/login">
              <Button variant="secondary">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        )}
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
            {loggedIn ? (
              <div className="grid gap-2 rounded-[22px] border border-[#e9c7b7] bg-white p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#ffccb2] font-black text-[#5c4a42]">
                    {authUser.displayName.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-black text-[#3c332f]">{authUser.displayName}</p>
                    <p className="truncate text-xs font-bold text-[#5c4a42]/70">{authUser.email}</p>
                  </div>
                </div>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full"><UserRound size={16} /> Dashboard</Button>
                </Link>
                <Link href="/dashboard/settings" onClick={() => setOpen(false)}>
                  <Button variant="secondary" className="w-full"><Settings size={16} /> Settings</Button>
                </Link>
                <Button variant="ghost" className="w-full" onClick={() => void handleLogout()}>
                  <LogOut size={16} />
                  Log out
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-2 pt-2">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full">
                      <Sparkles size={16} />
                      Sign up
                    </Button>
                  </Link>
                </div>
                <Link href="/onboarding" onClick={() => setOpen(false)}>
                  <Button className="w-full">
                    <Sparkles size={16} />
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function SupabaseSessionBridge() {
  const hydrateFromSupabaseSnapshot = useAppStore((state) => state.hydrateFromSupabaseSnapshot);
  const logout = useAppStore((state) => state.logout);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const client = supabase;
    let mounted = true;

    async function hydrateCurrentUser() {
      const { data } = await client.auth.getUser();
      if (!mounted || !data.user) return;
      const snapshot = await loadSupabaseSnapshot(data.user);
      if (mounted) hydrateFromSupabaseSnapshot(snapshot);
    }

    void hydrateCurrentUser();
    const { data } = client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        logout();
        return;
      }
      if (session?.user) {
        void loadSupabaseSnapshot(session.user).then((snapshot) => {
          if (mounted) hydrateFromSupabaseSnapshot(snapshot);
        });
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [hydrateFromSupabaseSnapshot, logout]);

  return null;
}

export function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        ["Recipes", "/recipes"],
        ["Meal Planner", "/planner"],
        ["How it works", "/#how"],
        ["Pricing", "/pricing"]
      ]
    },
    {
      title: "Company",
      links: [
        ["About us", "/about"],
        ["Blog", "/blog"],
        ["Contact", "/contact"],
        ["Generator", "/generator"]
      ]
    },
    {
      title: "Support",
      links: [
        ["Help Center", "/contact"],
        ["Privacy Policy", "/contact"],
        ["Terms of Service", "/contact"],
        ["Allergy Safety", "/nutrition"]
      ]
    }
  ];

  return (
    <footer className="mt-16 bg-[linear-gradient(180deg,#e8f4ef_0%,#f7efe9_100%)] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 rounded-[28px] border border-white/70 bg-white/46 p-4 shadow-[0_24px_70px_rgba(92,74,66,0.10)] backdrop-blur sm:gap-10 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none lg:grid-cols-[1.2fr_2fr_1.2fr]">
        <div className="rounded-[22px] border border-[#e9c7b7]/70 bg-[#fffaf6]/88 p-4 sm:border-0 sm:bg-transparent sm:p-0">
          <Image src="/brand/logo.png" alt="Foody Fam" width={142} height={70} className="mx-auto mb-3 h-16 w-auto object-contain sm:mx-0" />
          <p className="font-display mx-auto max-w-xs text-center text-3xl font-black leading-none text-[#5c4a42] sm:mx-0 sm:text-left sm:text-2xl">One meal, whole family.</p>
          <p className="mx-auto mt-3 max-w-xs text-center text-sm font-bold leading-6 text-[#5c4a42] sm:mx-0 sm:text-left">
            AI meals that keep baby portions, adult finishes, and shopping lists in one calm flow.
          </p>
          <div className="mt-4 flex justify-center gap-3 sm:justify-start">
            <Link href="/contact" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#5c4a42] shadow-sm transition hover:-translate-y-0.5 hover:text-[#f59b78]">
              <Instagram size={18} />
            </Link>
            <Link href="/contact" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#5c4a42] shadow-sm transition hover:-translate-y-0.5 hover:text-[#f59b78]">
              <Facebook size={18} />
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-8">
          {columns.map((column) => (
            <div key={column.title} className="rounded-[20px] bg-white/66 p-4 sm:bg-transparent sm:p-0">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#78bea8]">{column.title}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3">
                {column.links.map(([label, href]) => (
                  <Link key={label} href={href} className="rounded-full bg-[#f7efe9]/80 px-3 py-2 text-sm font-extrabold text-[#5c4a42] transition hover:bg-[#ffccb2]/80 hover:text-[#1f1d1c] sm:bg-transparent sm:px-0 sm:py-0 sm:font-bold sm:hover:bg-transparent sm:hover:text-[#f59b78]">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <form className="grid content-start gap-3 rounded-[22px] border border-[#e9c7b7]/70 bg-[#fffaf6]/88 p-4 sm:border-0 sm:bg-transparent sm:p-0" onSubmit={(event) => event.preventDefault()}>
          <p className="text-center text-sm font-extrabold text-[#5c4a42] sm:text-left">Stay in the loop</p>
          <p className="text-center text-sm font-bold leading-6 text-[#5c4a42] sm:text-left">Weekly baby-safe meal ideas, swaps, and pantry tips.</p>
          <div className="grid gap-2 rounded-[22px] bg-white p-2 shadow-sm sm:flex sm:rounded-full sm:p-1">
            <input aria-label="Email address" placeholder="Your email address" className="min-h-11 min-w-0 flex-1 rounded-full bg-[#f7efe9]/70 px-4 text-sm font-bold outline-none sm:bg-transparent" />
            <Button className="min-h-11 px-4">Subscribe</Button>
          </div>
          <p className="text-center text-xs font-bold text-[#5c4a42]/70 sm:text-left">No spam. Just calmer dinners.</p>
        </form>
      </div>
      <div className="mx-auto mt-5 flex max-w-7xl flex-col items-center justify-between gap-2 text-xs font-bold text-[#5c4a42]/70 sm:mt-8 sm:flex-row">
        <span>Copyright 2026 Foody Fam</span>
        <span>Built for one meal, many plates.</span>
      </div>
    </footer>
  );
}
