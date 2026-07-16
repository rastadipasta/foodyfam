"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Baby,
  Check,
  Heart,
  Leaf,
  Salad,
  Sparkles,
  Timer,
  Utensils
} from "lucide-react";
import { SiteShell } from "./layout";
import { Button, Pill, SectionShell } from "./ui";
import { GeneratorPanel } from "./generator-panel";
import { Reveal } from "./motion";
import { formatPlanPrice, pricingPlans, yearlyBillingNote } from "@/lib/pricing";

const heroBenefits = [
  { icon: Baby, label: "Age-aware", detail: "from 6+ months" },
  { icon: Sparkles, label: "Guided", detail: "adaptations" },
  { icon: Timer, label: "Save time,", detail: "eat together" },
  { icon: Heart, label: "Built for", detail: "beta families" }
];

const workflowSteps = [
  {
    icon: Utensils,
    title: "Add what you have",
    body: "Tell us your ingredients, baby's age, and preferences.",
    tone: "bg-[#e8f4ef]",
    number: "1"
  },
  {
    icon: Sparkles,
    title: "AI builds one shared meal",
    body: "We create a baby-safe version and an adult finishing touch.",
    tone: "bg-[#ffccb2]",
    number: "2"
  },
  {
    icon: Salad,
    title: "Cook once, everyone eats",
    body: "One meal. Less stress. More family time.",
    tone: "bg-[#ffe1b6]",
    number: "3"
  }
];

const betaInsights = [
  "Parents want one dinner flow, not separate baby cooking.",
  "Baby portion timing matters more than fancy recipe copy.",
  "Shopping and leftovers become valuable after the first recipe."
];

export function HomePage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const visiblePricing = pricingPlans;

  return (
    <SiteShell>
      <main className="bg-[#fffaf6]">
        <section className="relative overflow-hidden border-b border-[#eaded5] bg-[linear-gradient(90deg,#fffaf6_0%,#fffaf6_42%,#f7efe9_100%)] px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              <Pill className="border-[#e9c7b7] bg-white px-5 py-2 text-[11px] uppercase tracking-[0.16em]">
                <Sparkles size={13} className="mr-2 text-[#5c4a42]" />
                Family meal planner for early beta families
              </Pill>
              <h1
                className="mt-8 max-w-3xl text-[clamp(3.75rem,14vw,6.875rem)] font-normal leading-[0.86] tracking-[-0.045em] text-[#243929]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                One meal.<br /><span className="whitespace-nowrap">Two age-aware plates.</span>
              </h1>
              <p className="mt-7 max-w-lg text-lg font-semibold leading-8 text-[#5c4a42]">
                Enter ingredients you already have. Foody Fam proposes one shared dinner, when to remove the baby portion, and how to finish the adult plate.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/generator">
                  <Button className="min-h-14 bg-[#405f46] px-7 text-white shadow-[0_18px_38px_rgba(64,95,70,0.24)] hover:bg-[#314b37]">
                    <Sparkles size={18} />
                    Generate tonight&apos;s family meal free
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="secondary" className="min-h-14 border-[#eaded5] bg-white px-7 text-[#243929]">
                    View our plans
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-[390px] sm:min-h-[520px] lg:min-h-[640px]"
            >
              <div className="absolute inset-0 overflow-hidden rounded-[34px] lg:rounded-none">
                <Image
                  src="/brand/generated/hero-family-meal.png"
                  alt="Family meal bowl with baby-safe side portion"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-cover object-center lg:object-[58%_50%]"
                />
                <div className="absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-[#fffaf6] to-transparent lg:block" />
              </div>

              <div className="absolute bottom-5 left-4 right-4 z-10 flex max-w-full items-center gap-3 overflow-x-auto rounded-[28px] border border-white/82 bg-white/88 p-3 shadow-[0_20px_48px_rgba(92,74,66,0.14)] backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:rounded-full sm:px-4 lg:bottom-7 lg:left-6 lg:right-6 lg:justify-between lg:gap-5 lg:overflow-visible lg:px-6">
                {heroBenefits.map(({ icon: Icon, label, detail }) => (
                  <div key={label} className="flex min-w-[145px] shrink-0 items-center gap-3 text-left text-[#5c4a42] sm:min-w-[164px] lg:min-w-0 lg:flex-1 lg:shrink">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#eaded5] bg-[#fffaf6] sm:h-11 sm:w-11">
                      <Icon size={17} />
                    </span>
                    <span className="whitespace-nowrap text-xs font-extrabold leading-5">
                      {label}<br />
                      <span className="font-bold text-[#5c4a42]/68">{detail}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="absolute right-4 top-4 z-20 grid h-32 w-32 place-items-center rounded-full border border-[#d8c9bd] bg-white/92 p-4 text-center shadow-[0_22px_52px_rgba(92,74,66,0.18)] backdrop-blur sm:right-7 sm:top-7 sm:h-40 sm:w-40 lg:right-10 lg:top-10 lg:h-44 lg:w-44">
                <div>
                  <p className="whitespace-nowrap text-[7px] font-black uppercase tracking-[0.18em] text-[#5c4a42]/60 sm:text-[9px]">AI meal planner</p>
                  <p className="mt-2 whitespace-nowrap [font-family:Georgia,serif] text-[1.12rem] leading-[1.02] tracking-[-0.035em] text-[#243929] sm:mt-3 sm:text-[1.65rem]">For babies,<br />kids & adults</p>
                  <Leaf className="mx-auto mt-2 text-[#78bea8]" size={20} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <SectionShell className="-mt-2 pb-8 pt-8 sm:-mt-4">
          <GeneratorPanel variant="homepage" />
        </SectionShell>

        <SectionShell id="how" className="py-12">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#78bea8]">Simple. Smart. Family-first</p>
            <h2 className="mt-3 [font-family:Georgia,serif] text-4xl font-normal tracking-[-0.03em] text-[#243929] sm:text-5xl">How Foody Fam works</h2>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
            {workflowSteps.map(({ icon: Icon, title, body, tone, number }, index) => (
              <Reveal key={title} delay={index * 0.08}>
                <div className="relative grid gap-5 text-center sm:grid-cols-[110px_1fr] sm:text-left lg:block lg:text-center">
                  <div className={`relative mx-auto grid h-28 w-28 place-items-center rounded-full ${tone} text-[#243929] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]`}>
                    <Icon size={40} strokeWidth={1.7} />
                    <span className="absolute -right-1 top-2 grid h-8 w-8 place-items-center rounded-full bg-[#78bea8] text-xs font-black text-white">
                      {number}
                    </span>
                  </div>
                  <div className="mt-0 lg:mt-5">
                    <h3 className="text-lg font-black text-[#243929]">{title}</h3>
                    <p className="mt-2 text-sm font-bold leading-6 text-[#5c4a42]">{body}</p>
                  </div>
                </div>
              </Reveal>
            )).flatMap((node, index) => index < workflowSteps.length - 1 ? [node, <div key={`line-${index}`} className="hidden h-px w-24 border-t border-dashed border-[#e9c7b7] lg:block" />] : [node])}
          </div>
        </SectionShell>

        <SectionShell className="py-12">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <section>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#78bea8]">Early beta notes</p>
              <h2 className="mt-3 [font-family:Georgia,serif] text-4xl font-normal tracking-[-0.03em] text-[#243929] sm:text-5xl">Built around real dinner friction</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {betaInsights.map((quote, index) => (
                  <article key={quote} className="rounded-[22px] border border-[#eaded5] bg-white p-5 shadow-[0_16px_38px_rgba(92,74,66,0.07)]">
                    <div className="flex gap-1 text-[#78bea8]">
                      <Check size={16} />
                    </div>
                    <p className="mt-4 text-sm font-bold leading-6 text-[#5c4a42]">{quote}</p>
                    <div className="mt-5 flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#ffccb2] text-sm font-black text-[#5c4a42]">
                        {["S", "J", "P"][index]}
                      </span>
                      <div>
                        <p className="text-sm font-black text-[#243929]">{["Beta need", "Safety cue", "Planning signal"][index]}</p>
                        <p className="text-xs font-bold text-[#5c4a42]/66">Product research</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <p className="mt-8 text-sm font-bold text-[#5c4a42]/72">Built for early beta families who want less duplicate cooking.</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-black text-[#5c4a42]/70">
                {["Age-aware guidance", "Parent confirms allergies", "Baby portion first", "Adult finish last"].map((item) => <Pill key={item} className="bg-white">{item}</Pill>)}
              </div>
            </section>

            <section className="rounded-[30px] border border-[#eaded5] bg-white/82 p-5 shadow-[0_24px_70px_rgba(92,74,66,0.1)]">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5c4a42]/66">Choose your plan</p>
                <div className="flex items-center gap-2 rounded-full border border-[#eaded5] bg-[#fffaf6] p-1 text-xs font-black text-[#5c4a42] shadow-sm">
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 transition ${billingCycle === "monthly" ? "bg-[#405f46] text-white shadow-sm" : "hover:bg-white"}`}
                    onClick={() => setBillingCycle("monthly")}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 transition ${billingCycle === "yearly" ? "bg-[#405f46] text-white shadow-sm" : "hover:bg-white"}`}
                    onClick={() => setBillingCycle("yearly")}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {visiblePricing.map((plan) => {
                  const featured = billingCycle === "monthly" ? plan.name === "Family" : plan.name === "Unlimited";

                  return (
                  <article
                    key={plan.name}
                    className={`relative flex h-full min-h-[390px] flex-col rounded-[22px] border p-5 ${featured ? "border-[#405f46] bg-[#405f46] text-white shadow-[0_22px_58px_rgba(64,95,70,0.28)]" : "border-[#eaded5] bg-white"}`}
                  >
                    {featured && <span className="absolute -top-3 right-4 rounded-full bg-[#fffaf6] px-3 py-1 text-[10px] font-black text-[#405f46] shadow-sm">Most popular</span>}
                    <h3 className={`text-lg font-black ${featured ? "text-white" : "text-[#243929]"}`}>{plan.name}</h3>
                    <div className="mt-4 flex items-end gap-1">
                      <span className={`text-4xl font-black ${featured ? "text-white" : "text-[#243929]"}`}>{formatPlanPrice(plan.name, billingCycle)}</span>
                      <span className={`pb-1 text-xs font-bold ${featured ? "text-white/72" : "text-[#5c4a42]/66"}`}>{plan.cadence}</span>
                    </div>
                    {billingCycle === "yearly" && yearlyBillingNote(plan.name) && <p className={`mt-2 text-xs font-black ${featured ? "text-white/72" : "text-[#78bea8]"}`}>{yearlyBillingNote(plan.name)}</p>}
                    <p className={`mt-3 min-h-10 text-sm font-bold leading-5 ${featured ? "text-white/78" : "text-[#5c4a42]/76"}`}>{plan.body}</p>
                    <ul className="mt-5 grid gap-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className={`flex items-center gap-2 text-sm font-bold ${featured ? "text-white/88" : "text-[#5c4a42]"}`}>
                          <Check size={15} className={featured ? "text-[#ffccb2]" : "text-[#78bea8]"} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing" className="mt-auto block pt-6">
                      <Button variant="secondary" className={`min-h-12 w-full whitespace-nowrap px-3 text-sm ${featured ? "border-white/20 bg-white text-[#243929] hover:bg-[#fffaf6]" : "border-[#eaded5] bg-[#fffaf6]"}`}>
                        {plan.cta}
                      </Button>
                    </Link>
                  </article>
                  );
                })}
              </div>
            </section>
          </div>
        </SectionShell>

        <SectionShell className="pb-4 pt-8">
          <div className="rounded-[30px] bg-[#405f46] px-6 py-7 text-white shadow-[0_28px_70px_rgba(64,95,70,0.24)] sm:px-9 lg:flex lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-[24px] border border-white/18">
                <Leaf size={44} strokeWidth={1.4} />
              </span>
              <div>
                <h2 className="[font-family:Georgia,serif] text-2xl font-normal sm:text-3xl">Healthy babies. Happy families. Less stress.</h2>
                <p className="mt-2 text-sm font-bold text-white/78">Foody Fam brings everyone to the table.</p>
              </div>
            </div>
            <Link href="/register" className="mt-6 block lg:mt-0">
              <Button variant="secondary" className="min-h-14 w-full bg-white px-8 text-[#243929] lg:w-auto">
                Get started - it&apos;s free
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </main>
    </SiteShell>
  );
}
