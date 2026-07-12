"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Star,
  Timer,
  Utensils
} from "lucide-react";
import { SiteShell } from "./layout";
import { Button, Pill, SectionShell } from "./ui";
import { GeneratorPanel } from "./generator-panel";
import { testimonials } from "@/lib/data";
import { Reveal } from "./motion";

const heroBenefits = [
  { icon: Baby, label: "Baby-safe", detail: "from 6+ months" },
  { icon: Sparkles, label: "AI-powered", detail: "adaptations" },
  { icon: Timer, label: "Save time,", detail: "eat together" },
  { icon: Heart, label: "Loved by", detail: "10k+ families" }
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

const euro = "\u20ac";

const yearlyPricingPreview = [
  {
    name: "Free",
    price: `${euro}0`,
    detail: "",
    body: "Try the Foody Fam workflow with a small, useful starter plan.",
    features: ["3 meal generations", "Basic AI meal result", "Baby/adult split instructions"],
    cta: "Start free"
  },
  {
    name: "Premium",
    price: `${euro}8`,
    detail: "/ month",
    body: "For families who want planning and AI help, without the full recipe library or shopping list.",
    features: ["14 meal generations per week", "Meal planner access", "Nutrition insights", "AI assistant"],
    cta: "Upgrade to Premium"
  },
  {
    name: "Unlimited",
    price: `${euro}13`,
    detail: "/ month",
    body: "Everything: generator, verified recipes, planner, pantry, shopping list, nutrition, assistant, saving and sharing.",
    features: ["Unlimited meal generations", "Full verified recipe library", "Shopping list and pantry matching", "Priority AI assistant"],
    cta: "Go Unlimited"
  }
];

const monthlyPricingPreview = [
  {
    name: "Free",
    price: `${euro}0`,
    detail: "",
    body: "Try the Foody Fam workflow with a small, useful starter plan.",
    features: ["3 meal generations", "Basic AI meal result", "Baby/adult split instructions"],
    cta: "Start free"
  },
  {
    name: "Premium",
    price: `${euro}12`,
    detail: "/ month",
    body: "For families who want planning and AI help, without the full recipe library or shopping list.",
    features: ["14 meal generations per week", "Meal planner access", "Nutrition insights", "AI assistant"],
    cta: "Upgrade to Premium"
  },
  {
    name: "Unlimited",
    price: `${euro}20`,
    detail: "/ month",
    body: "Everything: generator, verified recipes, planner, pantry, shopping list, nutrition, assistant, saving and sharing.",
    features: ["Unlimited meal generations", "Full verified recipe library", "Shopping list and pantry matching", "Priority AI assistant"],
    cta: "Go Unlimited"
  }
];
const trustLogos = ["babycenter", "Good Housekeeping", "Parents", "yahoo!", "Forbes", "TODAY"];

export function HomePage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const visiblePricing = billingCycle === "monthly" ? monthlyPricingPreview : yearlyPricingPreview;

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
                AI meal planner for real families
              </Pill>
              <h1
                className="mt-8 max-w-3xl text-[clamp(3.75rem,14vw,6.875rem)] font-normal leading-[0.86] tracking-[-0.045em] text-[#243929]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                One meal,<br /><span className="whitespace-nowrap">whole family.</span>
              </h1>
              <p className="mt-7 max-w-lg text-lg font-semibold leading-8 text-[#5c4a42]">
                Foody Fam turns the ingredients you have into one shared meal with baby-safe adaptation and adult finishing.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/generator">
                  <Button className="min-h-14 bg-[#405f46] px-7 text-white shadow-[0_18px_38px_rgba(64,95,70,0.24)] hover:bg-[#314b37]">
                    <Sparkles size={18} />
                    Generate today&apos;s meal
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

              <div className="absolute bottom-5 left-4 right-4 z-10 grid grid-cols-2 gap-3 rounded-[28px] border border-white/82 bg-white/82 p-4 shadow-[0_20px_48px_rgba(92,74,66,0.14)] backdrop-blur-md sm:grid-cols-4 sm:rounded-full sm:px-5 lg:bottom-7 lg:left-6 lg:right-6 lg:flex lg:items-center lg:justify-between lg:gap-6 lg:px-6">
                {heroBenefits.map(({ icon: Icon, label, detail }) => (
                  <div key={label} className="flex min-w-0 items-center gap-3 text-[#5c4a42] lg:flex-1">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#eaded5] bg-[#fffaf6] sm:h-11 sm:w-11">
                      <Icon size={17} />
                    </span>
                    <span className="break-normal text-xs font-extrabold leading-5 [overflow-wrap:normal]">
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
          <GeneratorPanel variant="homepage" onResult={() => router.push("/dashboard/generator")} />
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
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#78bea8]">Loved by families</p>
              <h2 className="mt-3 [font-family:Georgia,serif] text-4xl font-normal tracking-[-0.03em] text-[#243929] sm:text-5xl">Real families, real results</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {testimonials.slice(0, 3).map((quote, index) => (
                  <article key={quote} className="rounded-[22px] border border-[#eaded5] bg-white p-5 shadow-[0_16px_38px_rgba(92,74,66,0.07)]">
                    <div className="flex gap-1 text-[#f8bd2e]">
                      {Array.from({ length: 5 }).map((_, star) => <Star key={star} size={14} fill="currentColor" />)}
                    </div>
                    <p className="mt-4 text-sm font-bold leading-6 text-[#5c4a42]">&quot;{quote}&quot;</p>
                    <div className="mt-5 flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#ffccb2] text-sm font-black text-[#5c4a42]">
                        {["S", "J", "P"][index]}
                      </span>
                      <div>
                        <p className="text-sm font-black text-[#243929]">{["Sarah K.", "James T.", "Priya M."][index]}</p>
                        <p className="text-xs font-bold text-[#5c4a42]/66">{["Mom of 1", "Dad of 2", "Mom of 2"][index]}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <p className="mt-8 text-sm font-bold text-[#5c4a42]/72">Trusted by 10,000+ families worldwide</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-black text-[#5c4a42]/62">
                {trustLogos.map((logo) => <span key={logo}>{logo}</span>)}
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
                  const featured = billingCycle === "monthly" ? plan.name === "Premium" : plan.name === "Unlimited";

                  return (
                  <article
                    key={plan.name}
                    className={`relative flex h-full min-h-[390px] flex-col rounded-[22px] border p-5 ${featured ? "border-[#405f46] bg-[#405f46] text-white shadow-[0_22px_58px_rgba(64,95,70,0.28)]" : "border-[#eaded5] bg-white"}`}
                  >
                    {featured && <span className="absolute -top-3 right-4 rounded-full bg-[#fffaf6] px-3 py-1 text-[10px] font-black text-[#405f46] shadow-sm">Most popular</span>}
                    <h3 className={`text-lg font-black ${featured ? "text-white" : "text-[#243929]"}`}>{plan.name}</h3>
                    <div className="mt-4 flex items-end gap-1">
                      <span className={`text-4xl font-black ${featured ? "text-white" : "text-[#243929]"}`}>{plan.price}</span>
                      <span className={`pb-1 text-xs font-bold ${featured ? "text-white/72" : "text-[#5c4a42]/66"}`}>{plan.detail}</span>
                    </div>
                    <p className={`mt-3 min-h-10 text-sm font-bold leading-5 ${featured ? "text-white/78" : "text-[#5c4a42]/76"}`}>{plan.body}</p>
                    <ul className="mt-5 grid gap-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className={`flex items-center gap-2 text-sm font-bold ${featured ? "text-white/88" : "text-[#5c4a42]"}`}>
                          <Check size={15} className={featured ? "text-[#ffccb2]" : "text-[#78bea8]"} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {featured && <p className="mt-4 text-center text-xs font-bold text-white/66">7-day free trial</p>}
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
