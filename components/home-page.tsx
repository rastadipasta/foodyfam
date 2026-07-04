"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CalendarDays, Carrot, CheckCircle2, MessageCircle, ShoppingBag, Sparkles, Star } from "lucide-react";
import { SiteShell } from "./layout";
import { Button, DashboardCommandPanel, EditorialHero, FeatureTile, KitchenLedger, MotionBand, RecipeTicket, SectionShell, SplitProofSection, TrustBadge } from "./ui";
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
          <EditorialHero
            eyebrow="Editorial Kitchen OS / AI family meals"
            title="One meal, whole family."
            body="Foody Fam turns the food you have into a premium kitchen workflow: one gentle base, a baby portion removed before seasoning, adult finishing at the end, and a planner that keeps the week together."
            actions={
              <>
                <Link href="/generator"><Button><Sparkles size={18} /> Generate today&apos;s meal</Button></Link>
                <Link href="#how"><Button variant="secondary">Explore the workflow <ArrowRight size={17} /></Button></Link>
              </>
            }
            meta={
              <div className="flex flex-wrap items-center gap-3 text-sm font-extrabold text-[#5c4a42]">
                <span className="flex text-[#f8bd2e]">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}</span>
                <span>15,000+ family meals generated</span>
                <span className="hidden h-1 w-1 rounded-full bg-[#5c4a42]/40 sm:block" />
                <span>One process, many plates</span>
              </div>
            }
          >
            <motion.div
              className="relative min-h-[480px]"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute left-0 top-6 z-20 hidden w-52 rotate-[-5deg] rounded-[22px] bg-white/88 p-4 shadow-[0_18px_48px_rgba(92,74,66,0.16)] backdrop-blur sm:block">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#78bea8]">Baby ticket</p>
                <p className="mt-2 text-sm font-bold leading-5 text-[#5c4a42]">Remove portion before salt, spice, honey, or crunchy toppings.</p>
              </div>
              <div className="absolute bottom-8 right-0 z-20 hidden w-60 rotate-[4deg] rounded-[22px] bg-[#5c4a42] p-4 text-white shadow-[0_22px_58px_rgba(92,74,66,0.24)] sm:block">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffccb2]">Adult finish</p>
                <p className="mt-2 text-sm font-bold leading-5">Add herbs, acid, parmesan, pepper, or chili at the end.</p>
              </div>
              <div className="relative mx-auto h-[360px] max-w-[680px] overflow-hidden rounded-[42px] border border-white/70 bg-[#ffccb2]/40 shadow-[0_34px_95px_rgba(92,74,66,0.2)] sm:h-[500px]">
                <div className="brand-gradient pointer-events-none absolute bottom-0 right-[-3rem] h-[58%] w-[92%] rounded-tl-[48%] opacity-85" />
                <Image
                  src="/brand/generated/hero-family-meal.png"
                  alt="Warm family meal preview with baby and adult portions"
                  fill
                  sizes="(max-width: 768px) 100vw, 680px"
                  className="relative z-10 object-cover object-top"
                  priority
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <TrustBadge><Sparkles size={14} /> Baby portion before seasoning</TrustBadge>
                <TrustBadge><CheckCircle2 size={14} /> Planner and shopping ready</TrustBadge>
              </div>
            </motion.div>
          </EditorialHero>
        </SectionShell>

        <SectionShell className="py-8">
          <SplitProofSection
            eyebrow="What Foody Fam does"
            title="A shared recipe base with a clear baby split and adult finish."
            points={[
              "Foody Fam creates one gentle cooking base for the whole family.",
              "The baby portion is removed before salt, strong spices, honey, crunchy toppings, or adult finishes.",
              "Adults get flavor at the end with herbs, acidity, cheese, salt, pepper, or spice.",
              "The same recipe can become a weekly planner meal and one family shopping list."
            ]}
          />
        </SectionShell>

        <MotionBand id="how" className="bg-white/38">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="editorial-kicker">Kitchen workflow</span>
                <h2 className="mt-4 font-display text-5xl font-black">How <span className="text-[#f59b78]">Foody Fam</span> works</h2>
              </div>
              <p className="max-w-md text-sm font-bold leading-6 text-[#5c4a42]">A simple operational rail for the dinner rush: profile, generate, split, plan, shop.</p>
            </div>
            <KitchenLedger className="grid gap-4 lg:grid-cols-3">
              {["Tell us about your family", "AI creates one recipe", "Cook together, eat together"].map((title, index) => (
                <Reveal key={title} delay={index * 0.08}>
                <RecipeTicket className="h-full">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5c4a42] font-display text-xl font-black text-white">0{index + 1}</span>
                  <h3 className="mt-5 font-display text-2xl font-black">{title}</h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#5c4a42]">
                    {index === 0 && "Add ages, preferences, allergies, and ingredients you have."}
                    {index === 1 && "Get one recipe with baby-friendly and adult-friendly instructions."}
                    {index === 2 && "Use one grocery list, one cooking process, and shared family plates."}
                  </p>
                </RecipeTicket>
                </Reveal>
              ))}
            </KitchenLedger>
        </MotionBand>

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
          <DashboardCommandPanel className="grid gap-5 lg:grid-cols-3">
            <MetricCard label="Meals generated" value="15k+" body="Demo-ready generation flow with OpenAI integration prepared server-side." />
            <MetricCard label="Cooking saved" value="2x" body="One process feeds baby, kids, and adults without rebuilding dinner." />
            <MetricCard label="Family trust" value="4.9" body={testimonials[1]} />
          </DashboardCommandPanel>
        </SectionShell>
      </main>
    </SiteShell>
  );
}
