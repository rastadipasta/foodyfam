"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bot, CalendarDays, ChefHat, Home, LayoutDashboard, ListChecks, Settings, ShoppingBag, Users } from "lucide-react";
import { Button, Card, Pill } from "./ui";
import { GeneratorPanel } from "./generator-panel";
import { RecipeCard } from "./recipe-card";
import { RecipeShowcase } from "./recipe-showcase";
import { demoRecipes } from "@/lib/data";
import { pagePhotos } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { AssistantPage, NutritionPage, PantryPage, PlannerPage, ProfilesPage, ShoppingPage } from "./product-pages";
import { FloatingPhoto, MetricCard } from "./motion";

const dashboardNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/generator", label: "AI Generator", icon: ChefHat },
  { href: "/dashboard/recipes", label: "Saved Recipes", icon: Home },
  { href: "/dashboard/planner", label: "Weekly Planner", icon: CalendarDays },
  { href: "/dashboard/shopping", label: "Shopping Lists", icon: ShoppingBag },
  { href: "/dashboard/pantry", label: "Pantry", icon: ListChecks },
  { href: "/dashboard/profiles", label: "Profiles", icon: Users },
  { href: "/dashboard/nutrition", label: "Nutrition", icon: BarChart3 },
  { href: "/dashboard/assistant", label: "AI Assistant", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function DashboardPage({ section = "overview" }: { section?: string }) {
  if (section === "generator") return <DashboardChrome><GeneratorInner /></DashboardChrome>;
  if (section === "planner") return <DashboardChrome embedded="planner"><PlannerInner /></DashboardChrome>;
  if (section === "shopping") return <DashboardChrome embedded="shopping"><ShoppingInner /></DashboardChrome>;
  if (section === "pantry") return <DashboardChrome embedded="pantry"><PantryInner /></DashboardChrome>;
  if (section === "recipes") return <DashboardChrome><RecipesInner /></DashboardChrome>;
  if (section === "nutrition") return <DashboardChrome embedded="nutrition"><NutritionInner /></DashboardChrome>;
  if (section === "profiles") return <DashboardChrome embedded="profiles"><ProfilesInner /></DashboardChrome>;
  if (section === "assistant") return <DashboardChrome embedded="assistant"><AssistantInner /></DashboardChrome>;
  if (section === "settings") return <DashboardChrome><SettingsInner /></DashboardChrome>;
  return <DashboardChrome><Overview /></DashboardChrome>;
}

function DashboardChrome({ children, embedded }: { children: React.ReactNode; embedded?: string }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#fffaf6]">
      <div className="grid lg:grid-cols-[290px_1fr]">
        <aside className="border-b border-[#5c4a42]/10 bg-[#f7efe9] p-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <Link href="/" className="font-display text-3xl font-black">Foody Fam</Link>
          <nav className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {dashboardNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition",
                  pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
                    ? "bg-white text-[#f59b78] shadow-sm"
                    : "text-[#5c4a42] hover:bg-white/70"
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          {embedded ? children : children}
        </main>
      </div>
    </div>
  );
}

function Overview() {
  const planner = useAppStore((state) => state.planner);
  const shopping = useAppStore((state) => state.shopping);
  const pantry = useAppStore((state) => state.pantry);
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Dashboard</p>
          <h1 className="font-display text-5xl font-black">Welcome back.</h1>
        </div>
        <Link href="/dashboard/generator"><Button>Generate today’s meal</Button></Link>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <RecipeShowcase recipe={demoRecipes[0]} />
        <div className="grid gap-5">
          <Card>
            <h2 className="font-display text-2xl font-black">Weekly plan</h2>
            <div className="mt-4 grid gap-2">{planner.slice(0, 4).map((item) => <Pill key={item.day} className="w-fit">{item.day}: {item.meal}</Pill>)}</div>
          </Card>
          <Card>
            <h2 className="font-display text-2xl font-black">Kitchen status</h2>
            <div className="mt-4 grid gap-2 text-sm font-bold text-[#5c4a42]">
              <p>{shopping.filter((item) => !item.checked).length} shopping items left</p>
              <p>{pantry.length} pantry items ready</p>
              <p>2 baby profiles active</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function GeneratorInner() {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <FloatingPhoto src={pagePhotos.generator} title="Cook once from what you have" caption="The dashboard generator turns pantry ingredients into one shared family recipe." />
        <div className="grid gap-5 sm:grid-cols-2">
          <MetricCard label="Profile-aware" value="2 kids" body="Baby ages, texture styles, and allergies are kept close to the recipe request." />
          <MetricCard label="Dinner speed" value="25m" body="The default flow favors weeknight meals with one cooking path." />
        </div>
      </div>
      <GeneratorPanel />
    </div>
  );
}

function RecipesInner() {
  const savedIds = useAppStore((state) => state.savedRecipeIds);
  const recipes = demoRecipes.filter((recipe) => savedIds.includes(recipe.id));
  return (
    <div>
      <h1 className="font-display text-4xl font-black">Saved recipes</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {(recipes.length ? recipes : demoRecipes).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
      </div>
    </div>
  );
}

function PlannerInner() {
  return <div className="-m-4 sm:-m-6 lg:-m-8"><PlannerPage /></div>;
}

function ShoppingInner() {
  return <div className="-m-4 sm:-m-6 lg:-m-8"><ShoppingPage /></div>;
}

function PantryInner() {
  return <div className="-m-4 sm:-m-6 lg:-m-8"><PantryPage /></div>;
}

function NutritionInner() {
  return <div className="-m-4 sm:-m-6 lg:-m-8"><NutritionPage /></div>;
}

function ProfilesInner() {
  return <div className="-m-4 sm:-m-6 lg:-m-8"><ProfilesPage /></div>;
}

function AssistantInner() {
  return <div className="-m-4 sm:-m-6 lg:-m-8"><AssistantPage /></div>;
}

function SettingsInner() {
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-4xl font-black">Account & billing</h1>
      <Card>
        <h2 className="font-display text-2xl font-black">Integration status</h2>
        <div className="mt-4 grid gap-3 text-sm font-bold text-[#5c4a42]">
          <p>OpenAI: ready for a fresh server-side key in .env.local</p>
          <p>Supabase: prepared for auth and database credentials</p>
          <p>Stripe: prepared for billing credentials</p>
          <p>Resend and PostHog: prepared for email and analytics credentials</p>
        </div>
      </Card>
    </div>
  );
}
