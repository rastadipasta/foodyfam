"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "coral" }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold transition duration-200 focus:outline-none focus:ring-4 focus:ring-[#78bea8]/25 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-[#78bea8] text-white shadow-[0_12px_30px_rgba(120,190,168,0.34)] hover:-translate-y-0.5 hover:bg-[#68ad98]",
        variant === "coral" && "bg-[#f59b78] text-white shadow-[0_12px_30px_rgba(245,155,120,0.28)] hover:-translate-y-0.5 hover:bg-[#ed8965]",
        variant === "secondary" && "border border-[#78bea8]/45 bg-white text-[#5c4a42] hover:-translate-y-0.5 hover:border-[#78bea8]",
        variant === "ghost" && "bg-transparent text-[#5c4a42] hover:bg-[#f7efe9]",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("soft-card rounded-[24px] p-5", className)} {...props} />;
}

export function Pill({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#5c4a42] shadow-sm", className)}
      {...props}
    />
  );
}

export function Field({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-2xl border border-[#e9c7b7] bg-white px-4 text-sm font-semibold text-[#1f1d1c] outline-none transition focus:border-[#78bea8] focus:ring-4 focus:ring-[#78bea8]/15",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 w-full rounded-2xl border border-[#e9c7b7] bg-white px-4 text-sm font-semibold text-[#1f1d1c] outline-none transition focus:border-[#78bea8] focus:ring-4 focus:ring-[#78bea8]/15",
        className
      )}
      {...props}
    />
  );
}

export function TextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-none rounded-2xl border border-[#e9c7b7] bg-white px-4 py-3 text-sm font-semibold text-[#1f1d1c] outline-none transition focus:border-[#78bea8] focus:ring-4 focus:ring-[#78bea8]/15",
        className
      )}
      {...props}
    />
  );
}
