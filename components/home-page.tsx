"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const pricingPreview = [
  { name: "Free", price: "$0", detail: "Forever", body: "Try the generator", features: ["3 meals per week", "Basic recipes", "Baby-safe versions"], cta: "Get started" },
  { name: "Family", price: "$7.99", detail: "/month", body: "For growing families", features: ["Unlimited meals", "Weekly meal planner", "Smart grocery lists", "Favorites & history"], cta: "Start free trial", featured: true },
  { name: "Premium", price: "$12.99", detail: "/month", body: "For power planners", features: ["AI Pantry features", "Advanced filters", "Nutrition insights", "Priority support"], cta: "Start free trial" }
];

const trustLogos = ["babycenter", "Good Housekeeping", "Parents", "yahoo!", "Forbes", "TODAY"];

export function HomePage() {
  const router = useRouter();

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
                className="mt-8 max-w-3xl text-[clamp(4.2rem,10vw,8.4rem)] font-normal leading-[0.82] tracking-[-0.055em] text-[#243929]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                One meal,<br />whole family.
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
                <Link href="/generator">
                  <Button variant="secondary" className="min-h-14 border-[#eaded5] bg-white px-7 text-[#243929]">
                    Open generator
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
              <div className="mt-9 grid grid-cols-2 gap-5 sm:grid-cols-4">
                {heroBenefits.map(({ icon: Icon, label, detail }) => (
                  <div key={label} className="flex items-center gap-3 text-[#5c4a42]">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#eaded5] bg-white">
                      <Icon size={18} />
                    </span>
                    <span className="text-xs font-extrabold leading-4">
                      {label}<br />
                      <span className="font-bold text-[#5c4a42]/70">{detail}</span>
                    </span>
                  </div>
                ))}
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

              <div className="absolute right-5 top-8 rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-[0_18px_44px_rgba(92,74,66,0.16)] backdrop-blur-md sm:right-14 sm:top-14">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["S", "J", "P"].map((avatar) => (
                      <span key={avatar} className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#ffccb2] text-xs font-black text-[#5c4a42]">
                        {avatar}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#5c4a42]/60">Trusted by</p>
                    <p className="text-sm font-black text-[#243929]">10,000+ families</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-1 text-[#f8bd2e]">
                  {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={15} fill="currentColor" />)}
                </div>
              </div>

              <div className="absolute bottom-7 right-4 grid h-36 w-36 place-items-center rounded-full border border-[#d8c9bd] bg-white/92 p-4 text-center shadow-[0_22px_52px_rgba(92,74,66,0.18)] backdrop-blur sm:bottom-12 sm:right-16 sm:h-44 sm:w-44">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#5c4a42]/60">AI meal planner</p>
                  <p className="mt-3 [font-family:Georgia,serif] text-xl leading-6 text-[#243929] sm:text-2xl">For babies,<br />kids & adults</p>
                  <Leaf className="mx-auto mt-2 text-[#78bea8]" size={22} />
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
                <div className="flex items-center gap-3 text-xs font-black text-[#5c4a42]">
                  Monthly
                  <span className="relative h-6 w-11 rounded-full bg-[#405f46]">
                    <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
                  </span>
                  Yearly
                  <Pill className="border-0 bg-[#e8f4ef] text-[#3f6f5d]">Save 20%</Pill>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {pricingPreview.map((plan) => (
                  <article
                    key={plan.name}
                    className={`relative rounded-[22px] border bg-white p-5 ${plan.featured ? "border-[#f59b78] shadow-[0_18px_48px_rgba(245,155,120,0.16)]" : "border-[#eaded5]"}`}
                  >
                    {plan.featured && <span className="absolute -top-3 right-4 rounded-full bg-[#f59b78] px-3 py-1 text-[10px] font-black text-white">Most popular</span>}
                    <h3 className="text-lg font-black text-[#243929]">{plan.name}</h3>
                    <div className="mt-4 flex items-end gap-1">
                      <span className="text-4xl font-black text-[#243929]">{plan.price}</span>
                      <span className="pb-1 text-xs font-bold text-[#5c4a42]/66">{plan.detail}</span>
                    </div>
                    <p className="mt-3 min-h-10 text-sm font-bold leading-5 text-[#5c4a42]/76">{plan.body}</p>
                    <ul className="mt-5 grid gap-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm font-bold text-[#5c4a42]">
                          <Check size={15} className="text-[#78bea8]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing" className="mt-6 block">
                      <Button variant={plan.featured ? "primary" : "secondary"} className={`w-full ${plan.featured ? "bg-[#405f46] hover:bg-[#314b37]" : "border-[#eaded5] bg-[#fffaf6]"}`}>
                        {plan.cta}
                      </Button>
                    </Link>
                    {plan.featured && <p className="mt-3 text-center text-xs font-bold text-[#5c4a42]/60">7-day free trial</p>}
                  </article>
                ))}
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
                Get started — it&apos;s free
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </main>
    </SiteShell>
  );
}
