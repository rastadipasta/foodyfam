"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CalendarDays, Carrot, CheckCircle2, MessageCircle, ShoppingBag, Sparkles, Star } from "lucide-react";
import { SiteShell } from "./layout";
import { Button, Card, Pill } from "./ui";
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
  return (
    <SiteShell>
      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="absolute right-[-8rem] top-28 h-96 w-96 rounded-full bg-[#f59b78]/55 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <Pill className="mb-5 bg-[#e8f4ef] text-[#5c4a42]">
                <Sparkles size={14} className="mr-1 text-[#f59b78]" />
                AI recipes for busy families
              </Pill>
              <h1 className="font-display max-w-2xl text-balance text-5xl font-black leading-[0.96] text-[#1f1d1c] sm:text-6xl lg:text-7xl">
                One meal, <span className="text-[#78bea8]">whole family.</span>
              </h1>
              <p className="mt-6 max-w-xl text-xl font-bold leading-8 text-[#3d3632]">
                AI recipes adapted for babies and adults. No more cooking twice, no more separate grocery lists.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/generator">
                  <Button>
                    <Sparkles size={18} />
                    Generate today&apos;s meal
                  </Button>
                </Link>
                <Link href="#how">
                  <Button variant="secondary">
                    Watch demo
                    <ArrowRight size={17} />
                  </Button>
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-4 text-sm font-extrabold text-[#5c4a42]">
                <div className="flex text-[#f8bd2e]">
                  {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}
                </div>
                <span>15,000+ family meals generated</span>
                <span>95% parents cook only once</span>
              </div>
            </motion.div>
            <motion.div initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <div className="relative min-h-[470px]">
                <div className="brand-gradient absolute bottom-2 right-0 h-[72%] w-[86%] rounded-tl-[50%] rounded-tr-[20%] rounded-br-[10%] rounded-bl-[34%]" />
                <Image
                  src="/brand/generated/hero-family-meal.png"
                  alt="Foody Fam meal preview"
                  width={720}
                  height={820}
                  className="relative z-10 ml-auto h-[520px] w-full max-w-[680px] rounded-[32px] object-cover object-top shadow-[0_26px_70px_rgba(92,74,66,0.18)]"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="how" className="bg-white/72 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center font-display text-4xl font-black">How <span className="text-[#f59b78]">Foody Fam</span> works</h2>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {["Tell us about your family", "AI creates one recipe", "Cook together, eat together"].map((title, index) => (
                <Reveal key={title} delay={index * 0.08}>
                <Card className="text-center transition duration-300 hover:-translate-y-1">
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
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <GeneratorPanel />
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <RecipeShowcase recipe={demoRecipes[0]} />
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Family moments</p>
                <h2 className="font-display text-4xl font-black">From pantry to plates, beautifully connected</h2>
              </div>
              <p className="max-w-md text-sm font-bold leading-6 text-[#5c4a42]">The product keeps the entire meal journey visible: what you own, what you cook, what baby eats, and what adults finish.</p>
            </div>
            <MomentStrip />
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, Icon, body]) => (
              <Card key={title as string} className="flex items-start gap-4 transition duration-300 hover:-translate-y-1">
                <span className="rounded-2xl bg-[#e8f4ef] p-3 text-[#78bea8]"><Icon size={24} /></span>
                <div>
                  <h3 className="font-display text-xl font-black">{title as string}</h3>
                  <p className="mt-1 text-sm font-bold leading-6 text-[#5c4a42]">{body as string}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
            <MetricCard label="Meals generated" value="15k+" body="Demo-ready generation flow with OpenAI integration prepared server-side." />
            <MetricCard label="Cooking saved" value="2x" body="One process feeds baby, kids, and adults without rebuilding dinner." />
            <MetricCard label="Family trust" value="4.9" body={testimonials[1]} />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
