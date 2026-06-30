"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <button
      aria-label="Back to top"
      className="fixed bottom-4 right-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-[#e9c7b7] bg-[#5c4a42] text-white shadow-[0_14px_35px_rgba(92,74,66,0.28)] transition hover:-translate-y-1 hover:bg-[#f59b78] focus:outline-none focus:ring-4 focus:ring-[#f59b78]/25 sm:bottom-6 sm:right-6"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp size={20} />
    </button>
  );
}
