"use client";

import { forwardRef } from "react";
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
        "tap-target inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold transition duration-200 ease-[var(--ease-soft)] active:translate-y-0.5 active:scale-[0.98] active:shadow-none focus:outline-none focus:ring-4 focus:ring-[#78bea8]/25 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-[#78bea8] text-white shadow-[var(--shadow-mint)] hover:-translate-y-0.5 hover:bg-[#68ad98]",
        variant === "coral" && "bg-[#f59b78] text-white shadow-[0_14px_32px_rgba(245,155,120,0.28)] hover:-translate-y-0.5 hover:bg-[#ed8965]",
        variant === "secondary" && "border border-[#78bea8]/45 bg-white/84 text-[#5c4a42] shadow-sm backdrop-blur hover:-translate-y-0.5 hover:border-[#78bea8] hover:bg-[#fffaf6]",
        variant === "ghost" && "bg-transparent text-[#5c4a42] hover:bg-[#f7efe9]",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("soft-card rounded-[var(--radius-card)] p-5", className)} {...props} />;
}

export function Pill({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border border-white/80 bg-white/78 px-3 py-1 text-xs font-extrabold text-[#5c4a42] shadow-sm backdrop-blur", className)}
      {...props}
    />
  );
}

export const Field = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Field({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "tap-target w-full rounded-2xl border border-[#e9c7b7] bg-white/86 px-4 text-sm font-semibold text-[#1f1d1c] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition focus:border-[#78bea8] focus:ring-4 focus:ring-[#78bea8]/15",
        className
      )}
      {...props}
    />
  );
});

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "tap-target w-full rounded-2xl border border-[#e9c7b7] bg-white/86 px-4 text-sm font-semibold text-[#1f1d1c] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition focus:border-[#78bea8] focus:ring-4 focus:ring-[#78bea8]/15",
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
        "min-h-28 w-full resize-none rounded-2xl border border-[#e9c7b7] bg-white/86 px-4 py-3 text-sm font-semibold text-[#1f1d1c] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition focus:border-[#78bea8] focus:ring-4 focus:ring-[#78bea8]/15",
        className
      )}
      {...props}
    />
  );
}

export function SectionShell({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("px-4 py-[var(--section-space)] sm:px-6 lg:px-8", className)} {...props}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function PaperPanel({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("paper-panel rounded-[var(--radius-panel)] p-5 sm:p-7", className)} {...props}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function FeatureTile({
  icon,
  title,
  body,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { icon?: React.ReactNode; title: string; body: string }) {
  return (
    <div className={cn("recipe-note gentle-lift rounded-[24px] p-5", className)} {...props}>
      {icon && <span className="mb-4 inline-flex rounded-2xl bg-[#e8f4ef] p-3 text-[#78bea8]">{icon}</span>}
      <h3 className="font-display text-xl font-black text-[#1f1d1c]">{title}</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-[#5c4a42]">{body}</p>
    </div>
  );
}

export function TrustBadge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 rounded-full border border-[#78bea8]/28 bg-[#e8f4ef]/86 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#437967] shadow-sm backdrop-blur", className)}
      {...props}
    />
  );
}

export function IngredientRail({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item, index) => (
        <span
          key={item}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-black text-[#5c4a42] shadow-sm",
            index % 3 === 0 && "bg-[#ffccb2]/80",
            index % 3 === 1 && "bg-[#e8f4ef]",
            index % 3 === 2 && "bg-white/86"
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function ActionBar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-wrap items-center gap-3 rounded-[22px] border border-[#e9c7b7]/70 bg-white/62 p-3 shadow-sm backdrop-blur", className)} {...props} />;
}

export function EmptyState({
  title,
  body,
  action,
  className
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("paper-panel rounded-[26px] p-6 text-center", className)}>
      <div className="relative z-10">
        <p className="font-display text-2xl font-black">{title}</p>
        <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-[#5c4a42]">{body}</p>
        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  children,
  className
}: {
  eyebrow: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("paper-panel overflow-hidden rounded-[36px] p-6 sm:p-8 lg:p-10", className)}>
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#78bea8]">{eyebrow}</p>
          <h1 className="mt-3 font-display text-balance text-5xl font-black leading-[0.95] text-[#1f1d1c] sm:text-6xl lg:text-7xl">{title}</h1>
          {body && <p className="mt-5 max-w-2xl text-base font-bold leading-7 text-[#5c4a42] sm:text-lg">{body}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

export function EditorialHero({
  eyebrow,
  title,
  body,
  children,
  actions,
  meta,
  className
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("editorial-hero rounded-[var(--radius-editorial)] p-5 sm:p-8 lg:p-10", className)}>
      <div className="relative z-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <span className="editorial-kicker">{eyebrow}</span>
          <h1 className="mt-5 font-display text-balance text-[4.6rem] font-black leading-[0.82] text-[#1f1d1c] sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-[#4f4039] sm:text-xl">{body}</p>
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          {meta && <div className="mt-7">{meta}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}

export function KitchenLedger({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("kitchen-ledger rounded-[32px] p-5 sm:p-6", className)} {...props} />;
}

export function RecipeTicket({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("recipe-ticket gentle-lift rounded-[24px] p-5", className)} {...props} />;
}

export function MotionBand({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("motion-band px-4 py-[var(--section-space)] sm:px-6 lg:px-8", className)} {...props}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SplitProofSection({
  eyebrow,
  title,
  points,
  className
}: {
  eyebrow: string;
  title: string;
  points: string[];
  className?: string;
}) {
  return (
    <KitchenLedger className={cn("grid gap-5 lg:grid-cols-[0.8fr_1.2fr]", className)}>
      <div>
        <span className="editorial-kicker">{eyebrow}</span>
        <h2 className="mt-4 font-display text-4xl font-black leading-tight">{title}</h2>
      </div>
      <div className="grid gap-3">
        {points.map((point, index) => (
          <RecipeTicket key={point} className="flex items-start gap-4 bg-white/80">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#5c4a42] text-xs font-black text-white">0{index + 1}</span>
            <p className="text-sm font-bold leading-6 text-[#5c4a42]">{point}</p>
          </RecipeTicket>
        ))}
      </div>
    </KitchenLedger>
  );
}

export function PlannerEventCard({
  mealType,
  title,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { mealType: string; title: string }) {
  return (
    <div className={cn("recipe-ticket rounded-[18px] p-3 text-left", className)} {...props}>
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#5c4a42]/70">{mealType}</p>
      <p className="mt-1 text-sm font-black leading-5 text-[#1f1d1c]">{title}</p>
    </div>
  );
}

export function DashboardCommandPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("command-panel rounded-[34px] p-5 sm:p-7", className)} {...props} />;
}

export function LiquidGlassPanel({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("liquid-glass rounded-[34px] p-5 sm:p-7", className)} {...props}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function AuroraSection({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("aurora-section px-4 py-[var(--section-space)] sm:px-6 lg:px-8", className)} {...props}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function GlassHeroFrame({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass-hero-frame rounded-[38px] p-3 sm:p-4", className)} {...props}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function GlassActionDock({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass-action-dock flex flex-wrap items-center gap-3 rounded-[24px] p-3", className)} {...props} />;
}

export function LiquidMetric({
  label,
  value,
  body,
  className
}: {
  label: string;
  value: string;
  body: string;
  className?: string;
}) {
  return (
    <LiquidGlassPanel className={cn("rounded-[28px] p-5", className)}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#78bea8]">{label}</p>
      <p className="mt-2 font-display text-4xl font-black text-[#1f1d1c]">{value}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#5c4a42]">{body}</p>
    </LiquidGlassPanel>
  );
}

export function FloatingGlassChip({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("floating-glass-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#5c4a42]", className)}
      {...props}
    />
  );
}
