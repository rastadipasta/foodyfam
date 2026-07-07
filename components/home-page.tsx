"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, CalendarDays, Carrot, CheckCircle2, MessageCircle, ShoppingBag, Sparkles, Star, type LucideIcon } from "lucide-react";
import { SiteShell } from "./layout";
import {
  AuroraSection,
  Button,
  DashboardCommandPanel,
  EditorialHero,
  FeatureTile,
  GlassActionDock,
  GlassHeroFrame,
  LiquidMetric,
  SectionShell
} from "./ui";
import { GeneratorPanel } from "./generator-panel";
import { RecipeShowcase } from "./recipe-showcase";
import { demoRecipes, testimonials } from "@/lib/data";
import { MomentStrip, Reveal } from "./motion";

type FeatureTone = "mint" | "peach" | "coral" | "cream";

type LandingFeature = {
  title: string;
  icon: LucideIcon;
  body: string;
  tone: FeatureTone;
  className?: string;
};

const features: LandingFeature[] = [
  { title: "Meal planner", icon: CalendarDays, body: "Plan your week in just a few clicks.", tone: "mint", className: "lg:col-span-2" },
  { title: "Shopping list", icon: ShoppingBag, body: "One list for the whole family.", tone: "peach" },
  { title: "Nutrition insights", icon: Carrot, body: "Healthy choices made simple.", tone: "cream" },
  { title: "AI Assistant", icon: MessageCircle, body: "Ask about swaps, allergies, and freezing.", tone: "coral" },
  { title: "Baby profiles", icon: Bot, body: "Texture and allergy-aware meals.", tone: "mint" },
  { title: "Cook once", icon: CheckCircle2, body: "One process, everyone fed.", tone: "peach", className: "lg:col-span-2" }
];

const proofMetrics = [
  { label: "Meals generated", value: "15k+", body: "Demo-ready generation flow with OpenAI integration prepared server-side." },
  { label: "Cooking saved", value: "2x", body: "One process feeds baby, kids, and adults without rebuilding dinner." },
  { label: "Family trust", value: "4.9", body: testimonials[1] }
];

export function HomePage() {
  const router = useRouter();

  return (
    <SiteShell>
      <main>
        <AuroraSection className="relative overflow-hidden pb-10 pt-6 sm:pt-8">
          <EditorialHero
            className="fable-stage liquid-glass"
            eyebrow="Editorial Kitchen OS / AI family meals"
            title="One meal, whole family."
            body="Foody Fam turns the food you have into a premium kitchen workflow: one gentle base, a baby portion removed before seasoning, adult finishing at the end, and a planner that keeps the week together."
            actions={
              <GlassActionDock>
                <Link href="/generator"><Button><Sparkles size={18} /> Generate today&apos;s meal</Button></Link>
                <Link href="/generator"><Button variant="secondary">Open generator</Button></Link>
              </GlassActionDock>
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
              className="fable-stage relative min-h-[480px]"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassHeroFrame className="fable-float-card mx-auto max-w-[680px]">
              <div className="relative h-[360px] overflow-hidden rounded-[32px] bg-[#ffccb2]/40 sm:h-[500px]">
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
              </GlassHeroFrame>
            </motion.div>
          </EditorialHero>
        </AuroraSection>

        <SectionShell className="py-10">
            <GeneratorPanel onResult={() => router.push("/dashboard/generator")} />
        </SectionShell>

        <SectionShell className="py-8">
            <Reveal>
              <RecipeShowcase recipe={demoRecipes[0]} />
            </Reveal>
        </SectionShell>

        <SectionShell className="pt-6">
            <div className="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Family moments</p>
                <h2 className="font-display text-4xl font-black">From pantry to plates, beautifully connected</h2>
              </div>
              <p className="max-w-md text-sm font-bold leading-6 text-[#5c4a42]">The product keeps the entire meal journey visible: what you own, what you cook, what baby eats, and what adults finish.</p>
            </div>
            <MomentStrip />
        </SectionShell>

        <SectionShell className="pt-4">
          <div className="home-bento-grid">
            {features.map(({ title, icon: Icon, body, tone, className }) => (
              <FeatureTile
                key={title}
                className={className}
                icon={<Icon size={24} />}
                title={title}
                body={body}
                tone={tone}
              />
            ))}
          </div>
        </SectionShell>

        <SectionShell className="pt-4">
          <DashboardCommandPanel className="proof-metric-grid fable-stage">
            {proofMetrics.map((metric) => (
              <LiquidMetric key={metric.label} {...metric} />
            ))}
          </DashboardCommandPanel>
        </SectionShell>
      </main>
    </SiteShell>
  );
}
