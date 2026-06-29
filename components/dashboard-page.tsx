"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Bot, CalendarDays, ChefHat, Home, LayoutDashboard, ListChecks, LogOut, Settings, ShoppingBag, Sparkles, Target, Users, Utensils } from "lucide-react";
import { Button, Card, Pill } from "./ui";
import { GeneratorPanel } from "./generator-panel";
import { RecipeCard } from "./recipe-card";
import { RecipeShowcase } from "./recipe-showcase";
import { demoRecipes } from "@/lib/data";
import { pagePhotos } from "@/lib/data";
import { databaseRecipes } from "@/lib/recipe-database";
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
  return <DashboardChrome><DashboardOverview /></DashboardChrome>;
}

function DashboardChrome({ children, embedded }: { children: React.ReactNode; embedded?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const authUser = useAppStore((state) => state.authUser);
  const authProvider = useAppStore((state) => state.authProvider);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const logout = useAppStore((state) => state.logout);
  return (
    <div className="min-h-screen bg-[#fffaf6]">
      <div className="grid lg:grid-cols-[290px_1fr]">
        <aside className="border-b border-[#5c4a42]/10 bg-[#f7efe9] p-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
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
          <div className="mt-6 grid gap-3 rounded-[22px] border border-[#e9c7b7] bg-white p-4 lg:mt-auto">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[#ffccb2] font-black text-[#5c4a42]">
                {(authUser?.displayName || "P").slice(0, 1)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{authUser?.displayName || "Demo Parent"}</p>
                <p className="text-xs font-bold capitalize text-[#5c4a42]/65">{authProvider || "demo"} account</p>
              </div>
            </div>
            <Pill className={onboardingCompleted ? "w-fit bg-[#e8f4ef]" : "w-fit bg-[#fff0eb]"}>
              {onboardingCompleted ? "Profile complete" : "Onboarding open"}
            </Pill>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              <LogOut size={17} /> Log out
            </Button>
          </div>
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          {embedded ? children : children}
        </main>
      </div>
    </div>
  );
}

function DashboardOverview() {
  const planner = useAppStore((state) => state.planner);
  const shopping = useAppStore((state) => state.shopping);
  const pantry = useAppStore((state) => state.pantry);
  const recipes = useAppStore((state) => state.recipes);
  const savedIds = useAppStore((state) => state.savedRecipeIds);
  const babyProfiles = useAppStore((state) => state.babyProfiles);
  const familyMembers = useAppStore((state) => state.familyMembers);
  const authUser = useAppStore((state) => state.authUser);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const draft = useAppStore((state) => state.onboardingDraft);
  const unchecked = shopping.filter((item) => !item.checked).length;
  const checked = shopping.length - unchecked;
  const shoppingProgress = shopping.length ? Math.round((checked / shopping.length) * 100) : 0;
  const pantryMatch = Math.min(96, 48 + pantry.length * 7);
  const todayRecipe = recipes[0] || demoRecipes[0];
  const savedRecipes = recipes.filter((recipe) => savedIds.includes(recipe.id)).slice(0, 3);
  const profileCompleteness = onboardingCompleted ? 100 : 62;
  const recommendedBaseRecipes = databaseRecipes
    .filter((recipe) => recipe.cuisine === (draft.favoriteCuisines[0] || "Italian") || draft.appliances.some((item) => recipe.appliances.includes(item)))
    .slice(0, 3);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Dashboard</p>
          <h1 className="font-display text-5xl font-black">Welcome back, {authUser?.displayName?.split(" ")[0] || "Parent"}.</h1>
          <p className="mt-2 max-w-2xl font-bold leading-7 text-[#5c4a42]">
            {familyMembers.length} family members, {babyProfiles.length} baby profiles, and a {draft.favoriteCuisines[0] || "family"} dinner rhythm ready for today.
          </p>
        </div>
        <Link href="/dashboard/generator"><Button><Sparkles size={17} /> Generate meal</Button></Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Profile" value={`${profileCompleteness}%`} body={onboardingCompleted ? "Family setup complete and ready for AI recipes." : "Finish onboarding to unlock stronger personalization."} />
        <MetricCard label="Shopping" value={`${shoppingProgress}%`} body={`${unchecked} items left before the weekly shop is done.`} />
        <MetricCard label="Pantry match" value={`${pantryMatch}%`} body="Generator will prioritize ingredients already at home." />
        <MetricCard label="Recipe DB" value={`${databaseRecipes.length}`} body="Verified local base recipes ready for AI matching." />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden p-0">
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Today&apos;s meal</p>
                <h2 className="font-display text-3xl font-black">{todayRecipe.title}</h2>
              </div>
              <Pill>{todayRecipe.time}</Pill>
            </div>
          </div>
          <RecipeShowcase recipe={todayRecipe} />
        </Card>
        <div className="grid gap-5">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-black">Weekly planner</h2>
              <Link href="/dashboard/planner" className="text-sm font-extrabold text-[#78bea8]">Open</Link>
            </div>
            <div className="mt-4 grid gap-2">{planner.slice(0, 5).map((item) => <Pill key={item.day} className="w-fit">{item.day}: {item.meal}</Pill>)}</div>
          </Card>
          <Card>
            <h2 className="font-display text-2xl font-black">Quick actions</h2>
            <div className="mt-4 grid gap-2">
              <QuickAction href="/dashboard/generator" label="Generate meal" icon={Utensils} />
              <QuickAction href="/dashboard/pantry" label="Add pantry item" icon={ListChecks} />
              <QuickAction href="/dashboard/planner" label="Create weekly plan" icon={CalendarDays} />
              <QuickAction href="/dashboard/profiles" label="Add baby profile" icon={Users} />
              <QuickAction href="/dashboard/shopping" label="Open shopping list" icon={ShoppingBag} />
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <h2 className="font-display text-2xl font-black">Recent recipes</h2>
          <div className="mt-4 grid gap-3">
            {(savedRecipes.length ? savedRecipes : recipes.slice(0, 3)).map((recipe) => (
              <div key={recipe.id} className="rounded-2xl bg-white p-3">
                <p className="font-black">{recipe.title}</p>
                <p className="text-xs font-bold text-[#5c4a42]/65">{recipe.tags.slice(0, 3).join(" · ")}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-2xl font-black">Assistant prompts</h2>
          <div className="mt-4 grid gap-2">
            {["Make this egg-free", "Turn leftovers into lunch", "Check texture for 8 months"].map((prompt) => (
              <Link key={prompt} href="/dashboard/assistant"><Pill className="w-fit bg-[#e8f4ef]">{prompt}</Pill></Link>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-2xl font-black">Recommended bases</h2>
          <div className="mt-4 grid gap-3">
            {recommendedBaseRecipes.map((recipe) => (
              <div key={recipe.slug} className="rounded-2xl bg-white p-3">
                <p className="font-black">{recipe.title}</p>
                <p className="text-xs font-bold text-[#5c4a42]/65">{recipe.mealType} · {recipe.proteinType} · {recipe.appliances[0]}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-2xl font-black">Nutrition highlights</h2>
          <div className="mt-4 grid gap-3 text-sm font-bold text-[#5c4a42]">
            <p className="flex gap-2"><Target className="text-[#78bea8]" size={17} /> Iron-rich meal target is on track.</p>
            <p className="flex gap-2"><Target className="text-[#f59b78]" size={17} /> Add fruit with vitamin C at lunch.</p>
            <p className="flex gap-2"><Target className="text-[#5c4a42]" size={17} /> Fiber variety improved this week.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Utensils }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-[#5c4a42] shadow-sm transition hover:-translate-y-0.5">
      <span className="flex items-center gap-2"><Icon size={17} />{label}</span>
      <span>{">"}</span>
    </Link>
  );
}

export function Overview() {
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
  const authUser = useAppStore((state) => state.authUser);
  const authMode = useAppStore((state) => state.authMode);
  const authProvider = useAppStore((state) => state.authProvider);
  const lastLoginAt = useAppStore((state) => state.lastLoginAt);
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-4xl font-black">Account & billing</h1>
      <Card>
        <h2 className="font-display text-2xl font-black">Account status</h2>
        <div className="mt-4 grid gap-3 text-sm font-bold text-[#5c4a42]">
          <p>User: {authUser?.displayName || "Demo Parent"} ({authUser?.email || "parent@foodyfam.demo"})</p>
          <p>Mode: {authMode}</p>
          <p>Provider: {authProvider || "demo"}</p>
          <p>Last login: {lastLoginAt ? new Date(lastLoginAt).toLocaleString() : "Not recorded yet"}</p>
        </div>
      </Card>
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
