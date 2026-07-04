"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CalendarDays, Carrot, CheckCircle2, MessageCircle, ShoppingBag, Sparkles, Star } from "lucide-react";
import { SiteShell } from "./layout";
import { Button, Card, FeatureTile, IngredientRail, PageHero, PaperPanel, SectionShell, TrustBadge } from "./ui";
import { GeneratorPanel } from "./generator-panel";
import { RecipeShowcase } from "./recipe-showcase";
import { demoRecipes, testimonials } from "@/lib/data";
import { MetricCard, MomentStrip, Reveal } from "./motion";

const features = [
  ["Meal planner", CalendarDays, "Plan your week in just a few clicks."],
  ["Shopping list", ShoppingBag, "One list for the whole family."],
  ["Nutrition insights", Carrot, "Healthy choices made simple."],
  ["AI Assistant", MessageCircle, "Ask about swaps, allergies, and freezing."],
  ["Baby profiles", Bot, "Texture and allergy-aware meals."],
  ["Cook once", CheckCircle2, "One process, everyone fed."]
];

export function HomePage() {
  const router = useRouter();

  return (
    <SiteShell>
      <main>
        <SectionShell className="relative overflow-hidden pb-10 pt-6 sm:pt-8">
          <div className="pointer-events-none absolute right-[-10rem] top-24 hidden h-[28rem] w-[28rem] rounded-full bg-[#f59b78]/30 blur-3xl sm:block" />
          <PageHero
            eyebrow="AI recipes for busy families"
            title="One meal, whole family."
            body="Foody Fam turns ingredients you already have into one shared cooking path: baby portion first, adult finish last, and a shopping list that stays calm."
            className="glass-tool"
          >
            <motion.div className="relative z-0" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <div className="relative min-h-[320px] overflow-hidden rounded-[32px] border border-white/70 bg-[#ffccb2]/40 shadow-[0_24px_70px_rgba(92,74,66,0.17)]">
                <div className="brand-gradient pointer-events-none absolute bottom-0 right-[-2rem] h-[62%] w-[82%] rounded-tl-[48%] opacity-80" />
                <Image
                  src="/brand/generated/hero-family-meal.png"
                  alt="Warm bowl of family pasta adapted for baby and adult plates"
                  fill
                  sizes="(max-width: 768px) 100vw, 620px"
                  className="relative z-10 object-cover object-top"
                  priority
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <TrustBadge><Sparkles size={14} /> Baby portion before seasoning</TrustBadge>
                <TrustBadge><CheckCircle2 size={14} /> Planner and shopping ready</TrustBadge>
              </div>
            </motion.div>
          </PageHero>
          <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <Link href="/generator"><Button><Sparkles size={18} /> Generate today&apos;s meal</Button></Link>
              <Link href="#how"><Button variant="secondary">See how it works <ArrowRight size={17} /></Button></Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm font-extrabold text-[#5c4a42]">
              <span className="flex text-[#f8bd2e]">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}</span>
              <span>15,000+ family meals generated</span>
            </div>
          </div>
        </SectionShell>

        <SectionShell className="py-8">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <PaperPanel className="rounded-[28px]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">What Foody Fam does</p>
              <h2 className="mt-2 font-display text-4xl font-black">One shared recipe base, separate baby and adult finishes.</h2>
              <IngredientRail className="mt-5" items={["cook once", "remove baby portion", "adult finish", "one list"]} />
            </PaperPanel>
            <Card className="grid gap-3">
              {[
                "Foody Fam creates one gentle cooking base for the whole family.",
                "The baby portion is removed before salt, strong spices, honey, crunchy toppings, or adult finishes.",
                "Adults get flavor at the end with herbs, acidity, cheese, salt, pepper, or spice.",
                "The same recipe can become a weekly planner meal and one family shopping list."
              ].map((item) => (
                <p key={item} className="flex gap-2 text-sm font-bold leading-6 text-[#5c4a42]">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#78bea8]" size={17} />
                  {item}
                </p>
              ))}
            </Card>
          </div>
        </SectionShell>

        <SectionShell id="how" className="bg-white/48">
            <h2 className="text-center font-display text-4xl font-black">How <span className="text-[#f59b78]">Foody Fam</span> works</h2>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {["Tell us about your family", "AI creates one recipe", "Cook together, eat together"].map((title, index) => (
                <Reveal key={title} delay={index * 0.08}>
                <Card className="gentle-lift text-center">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#78bea8] font-display text-xl font-black text-white">{index + 1}</span>
                  <h3 className="mt-5 font-display text-xl font-black">{title}</h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#5c4a42]">
                    {index === 0 && "Add ages, preferences, allergies, and ingredients you have."}
                    {index === 1 && "Get one recipe with baby-friendly and adult-friendly instructions."}
                    {index === 2 && "Use one grocery list, one cooking process, and shared family plates."}
                  </p>
                </Card>
                </Reveal>
              ))}
            </div>
        </SectionShell>

        <SectionShell className="py-10">
            <GeneratorPanel onResult={() => router.push("/dashboard/generator")} />
        </SectionShell>

        <SectionShell className="py-8">
            <Reveal>
              <RecipeShowcase recipe={demoRecipes[0]} />
            </Reveal>
        </SectionShell>

        <SectionShell>
            <div className="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Family moments</p>
                <h2 className="font-display text-4xl font-black">From pantry to plates, beautifully connected</h2>
              </div>
              <p className="max-w-md text-sm font-bold leading-6 text-[#5c4a42]">The product keeps the entire meal journey visible: what you own, what you cook, what baby eats, and what adults finish.</p>
            </div>
            <MomentStrip />
        </SectionShell>

        <SectionShell>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, Icon, body]) => (
              <FeatureTile key={title as string} icon={<Icon size={24} />} title={title as string} body={body as string} />
            ))}
          </div>
        </SectionShell>

        <SectionShell>
          <div className="grid gap-5 lg:grid-cols-3">
            <MetricCard label="Meals generated" value="15k+" body="Demo-ready generation flow with OpenAI integration prepared server-side." />
            <MetricCard label="Cooking saved" value="2x" body="One process feeds baby, kids, and adults without rebuilding dinner." />
            <MetricCard label="Family trust" value="4.9" body={testimonials[1]} />
          </div>
        </SectionShell>
      </main>
    </SiteShell>
  );
}
