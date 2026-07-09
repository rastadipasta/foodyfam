"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Facebook, Instagram, LogOut, Mail, Menu, ShieldCheck, Settings, Sparkles, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui";
import { CookieSettingsButton } from "./cookie-consent";
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
  const isAdmin = authUser?.role === "admin";

  async function handleLogout() {
    await signOutActiveAuth();
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#eaded5] bg-[#fffaf6]/92 shadow-[0_8px_24px_rgba(92,74,66,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="Foody Fam" width={132} height={66} className="h-12 w-auto object-contain" priority />
        </Link>
        <nav className="hidden items-center gap-9 text-sm font-extrabold text-[#1f1d1c] lg:flex">
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
            {isAdmin && (
              <Link href="/admin">
                <Button variant="secondary"><ShieldCheck size={16} /> Admin</Button>
              </Link>
            )}
            <Link href="/dashboard/profiles" className="flex items-center gap-2 rounded-full border border-[#eaded5] bg-white px-3 py-2 text-sm font-extrabold text-[#5c4a42] shadow-sm transition hover:bg-[#fffaf6]">
              <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-[#ffccb2] text-xs font-black">
                {authUser.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={authUser.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  authUser.displayName.slice(0, 1)
                )}
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
              <Button variant="ghost" className="text-[#1f1d1c]">Log in</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#405f46] px-6 text-white hover:bg-[#314b37]">Get started</Button>
            </Link>
          </div>
        )}
        <button
          aria-label="Open menu"
          className="tap-target rounded-full border border-[#e9c7b7] bg-white p-3 shadow-sm lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#eaded5] bg-[#fffaf6] px-4 pb-4 shadow-[0_20px_50px_rgba(92,74,66,0.08)] lg:hidden">
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
                  <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-[#ffccb2] font-black text-[#5c4a42]">
                    {authUser.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={authUser.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      authUser.displayName.slice(0, 1)
                    )}
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
                {isAdmin && (
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full"><ShieldCheck size={16} /> Admin</Button>
                  </Link>
                )}
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
        ["Privacy Policy", "/privacy"],
        ["Cookie Policy", "/cookies"],
        ["Terms of Service", "/contact"],
        ["Allergy Safety", "/nutrition"]
      ]
    }
  ];

  return (
    <footer className="mt-16 overflow-hidden bg-[#fffaf6] px-4 pb-7 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 rounded-[32px] border border-[#eaded5] bg-white/86 p-5 shadow-[0_22px_60px_rgba(92,74,66,0.08)] sm:p-7 lg:grid-cols-[1.05fr_1.7fr_1.15fr] lg:gap-10">
          <div>
            <Image src="/brand/logo.png" alt="Foody Fam" width={142} height={70} className="mb-4 h-16 w-auto object-contain" />
            <p className="[font-family:Georgia,serif] max-w-xs text-3xl font-normal leading-none tracking-[-0.03em] text-[#243929]">One meal, whole family.</p>
            <p className="mt-4 max-w-sm text-sm font-semibold leading-6 text-[#5c4a42]">
              AI meals that keep baby portions, adult finishes, and shopping lists in one calm flow.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/contact" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full border border-[#eaded5] bg-[#fffaf6] text-[#5c4a42] shadow-sm transition hover:bg-[#ffccb2]/70 hover:text-[#243929]">
                <Instagram size={18} />
              </Link>
              <Link href="/contact" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full border border-[#eaded5] bg-[#fffaf6] text-[#5c4a42] shadow-sm transition hover:bg-[#ffccb2]/70 hover:text-[#243929]">
                <Facebook size={18} />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="rounded-[24px] border border-[#eaded5]/80 bg-[#fffaf6]/72 p-4 sm:border-0 sm:bg-transparent sm:p-0">
                <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#78bea8]">{column.title}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3">
                  {column.links.map(([label, href]) => (
                    <Link key={label} href={href} className="rounded-full px-0 py-1 text-sm font-extrabold text-[#5c4a42] transition hover:text-[#f59b78]">
                      {label}
                    </Link>
                  ))}
                  {column.title === "Support" && <CookieSettingsButton />}
                </div>
              </div>
            ))}
          </div>

          <form className="grid content-start gap-3 rounded-[26px] border border-[#eaded5] bg-[#fffaf6] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.84)]" onSubmit={(event) => event.preventDefault()}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e8f4ef] text-[#437967]">
              <Mail size={18} />
            </span>
            <p className="text-base font-black text-[#243929]">Stay in the loop</p>
            <p className="text-sm font-semibold leading-6 text-[#5c4a42]">Weekly baby-safe meal ideas, swaps, and pantry tips.</p>
            <div className="grid gap-2 rounded-[18px] border border-[#eaded5] bg-white p-2 shadow-sm">
              <input aria-label="Email address" placeholder="Your email address" className="min-h-11 min-w-0 rounded-full bg-transparent px-3 text-sm font-bold text-[#243929] outline-none placeholder:text-[#5c4a42]/45" />
              <Button className="min-h-11 bg-[#405f46] px-4 text-white hover:bg-[#314b37]">Subscribe</Button>
            </div>
            <p className="text-xs font-bold text-[#5c4a42]/64">No spam. Just calmer dinners.</p>
          </form>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-[#eaded5] px-1 pt-5 text-xs font-bold text-[#5c4a42]/70 sm:mt-5 sm:flex-row">
          <span>Copyright 2026 Foody Fam</span>
          <span>Built for one meal, many plates.</span>
        </div>
      </div>
    </footer>
  );
}
