"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const consentKey = "foodyfam-cookie-consent";
const consentVersion = 1;

type ConsentChoice = "accepted" | "declined";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    const timer = window.setTimeout(() => setOpen(!saved), 450);
    const reopen = () => setOpen(true);
    window.addEventListener("foodyfam:open-cookie-settings", reopen);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("foodyfam:open-cookie-settings", reopen);
    };
  }, []);

  function choose(choice: ConsentChoice) {
    window.localStorage.setItem(
      consentKey,
      JSON.stringify({ choice, version: consentVersion, updatedAt: new Date().toISOString() })
    );
    window.dispatchEvent(new CustomEvent("foodyfam:cookie-consent-changed", { detail: { choice } }));
    setOpen(false);
  }

  if (!open) return null;

  return (
    <aside
      aria-labelledby="cookie-consent-title"
      className="fixed bottom-4 left-4 right-4 z-[80] max-w-[410px] rounded-[24px] border border-[#e9c7b7] bg-[#f7ead2] p-5 text-[#243929] shadow-[0_24px_70px_rgba(36,57,41,0.2)] sm:bottom-6 sm:left-auto sm:right-6"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fffaf6] text-[#405f46] shadow-sm">
          <Cookie size={19} />
        </span>
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h2 id="cookie-consent-title" className="text-base font-black">Your privacy, your choice</h2>
            <button type="button" aria-label="Close cookie notice" className="rounded-full p-1 text-[#5c4a42] hover:bg-white/70" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#5c4a42]">
            We use essential storage to keep Foody Fam secure and optional cookies to improve your experience. You can accept or decline optional cookies.
            {" "}
            <Link href="/cookies" className="font-black text-[#243929] underline underline-offset-3">Learn more</Link>
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        <button type="button" className="min-h-12 rounded-xl bg-[#243929] px-5 font-black text-[#fffaf6] shadow-sm transition active:scale-[0.98]" onClick={() => choose("accepted")}>
          Allow cookies
        </button>
        <button type="button" className="min-h-12 rounded-xl border border-[#5c4a42]/45 bg-transparent px-5 font-black text-[#243929] transition hover:bg-white/45 active:scale-[0.98]" onClick={() => choose("declined")}>
          Decline
        </button>
      </div>
    </aside>
  );
}

function readConsent(): ConsentChoice | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(consentKey) || "null") as {
      choice?: ConsentChoice;
      version?: number;
    } | null;
    return parsed?.version === consentVersion && (parsed.choice === "accepted" || parsed.choice === "declined")
      ? parsed.choice
      : null;
  } catch {
    return null;
  }
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="rounded-full py-1 text-left text-sm font-extrabold text-[#5c4a42] transition hover:text-[#f59b78]"
      onClick={() => window.dispatchEvent(new Event("foodyfam:open-cookie-settings"))}
    >
      Cookie settings
    </button>
  );
}
