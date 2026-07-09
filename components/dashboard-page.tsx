"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, BookOpen, Bot, CalendarDays, ChefHat, Home, LayoutDashboard, LogOut, Menu, Settings, ShoppingBag, Sparkles, Target, Users, Utensils, X } from "lucide-react";
import { Button, Card, DashboardCommandPanel, GlassActionDock, KitchenLedger, LiquidMetric, Pill, RecipeTicket } from "./ui";
import { GeneratorPanel } from "./generator-panel";
import { RecipeCard } from "./recipe-card";
import { demoRecipes } from "@/lib/data";
import { databaseRecipes } from "@/lib/recipe-database";
import type { MealPlanDay, MealSlotType, Recipe } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { AssistantPage, NutritionPage, PlannerPage, ProfilesPage, RecipeCloud, ShoppingPage } from "./product-pages";
import { signOutActiveAuth } from "@/lib/auth-adapter";
import { SupabaseSessionBridge } from "./layout";
import { FeatureGate } from "./feature-lock";
import type { PlanFeature } from "@/lib/plan-gating";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { removeProfileAvatar, uploadProfileAvatar } from "@/lib/supabase/profile-sync";

const dashboardNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/generator", label: "AI Generator", icon: ChefHat },
  { href: "/dashboard/recipes", label: "Saved Recipes", icon: Home },
  { href: "/recipes", label: "Recipe Library", icon: BookOpen },
  { href: "/dashboard/planner", label: "Weekly Planner", icon: CalendarDays },
  { href: "/dashboard/shopping", label: "Shopping Lists", icon: ShoppingBag },
  { href: "/dashboard/profiles", label: "Profiles", icon: Users },
  { href: "/dashboard/nutrition", label: "Nutrition", icon: BarChart3 },
  { href: "/dashboard/assistant", label: "AI Assistant", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function DashboardPage({ section = "overview" }: { section?: string }) {
  const plan = useAppStore((state) => state.settingsPreferences.subscriptionStatus);
  if (section === "generator") return <DashboardChrome><GeneratorInner /></DashboardChrome>;
  if (section === "planner") return <DashboardChrome embedded="planner"><GatedDashboardSection plan={plan} feature="planner"><PlannerInner /></GatedDashboardSection></DashboardChrome>;
  if (section === "shopping") return <DashboardChrome embedded="shopping"><GatedDashboardSection plan={plan} feature="shoppingList"><ShoppingInner /></GatedDashboardSection></DashboardChrome>;
  if (section === "recipes") return <DashboardChrome><GatedDashboardSection plan={plan} feature="savedRecipes"><RecipesInner /></GatedDashboardSection></DashboardChrome>;
  if (section === "nutrition") return <DashboardChrome embedded="nutrition"><GatedDashboardSection plan={plan} feature="nutrition"><NutritionInner /></GatedDashboardSection></DashboardChrome>;
  if (section === "profiles") return <DashboardChrome embedded="profiles"><ProfilesInner /></DashboardChrome>;
  if (section === "assistant") return <DashboardChrome embedded="assistant"><GatedDashboardSection plan={plan} feature="assistant"><AssistantInner /></GatedDashboardSection></DashboardChrome>;
  if (section === "settings") return <DashboardChrome><SettingsInner /></DashboardChrome>;
  return <DashboardChrome><DashboardOverview /></DashboardChrome>;
}

function GatedDashboardSection({
  plan,
  feature,
  children
}: {
  plan: "Free" | "Premium" | "Unlimited";
  feature: PlanFeature;
  children: React.ReactNode;
}) {
  return <FeatureGate plan={plan} feature={feature}>{children}</FeatureGate>;
}

function DashboardChrome({ children, embedded }: { children: React.ReactNode; embedded?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const authUser = useAppStore((state) => state.authUser);
  const authProvider = useAppStore((state) => state.authProvider);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const logout = useAppStore((state) => state.logout);
  const activeNav = dashboardNav.find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));

  async function handleLogout() {
    await signOutActiveAuth();
    logout();
    setMenuOpen(false);
    router.push("/login");
  }

  return (
    <div className="dashboard-shell min-h-screen bg-[#fffaf6]">
      <SupabaseSessionBridge />
      <header className="sticky top-0 z-40 border-b border-[#eaded5] bg-[#fffaf6]/94 px-4 py-3 shadow-[0_8px_24px_rgba(92,74,66,0.04)] backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Link href="/" className="font-display text-2xl font-black">Foody Fam</Link>
            <p className="truncate text-xs font-extrabold text-[#5c4a42]/68">{activeNav?.label || "Dashboard"}</p>
          </div>
          <button
            type="button"
            aria-label={menuOpen ? "Close dashboard menu" : "Open dashboard menu"}
            aria-expanded={menuOpen}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#e9c7b7] bg-white text-[#5c4a42] shadow-sm transition active:scale-95"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close dashboard menu"
            className="absolute inset-0 bg-[#5c4a42]/28 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute bottom-0 left-0 right-0 max-h-[88dvh] overflow-y-auto rounded-t-[30px] border border-[#eaded5] bg-[#fffaf6] p-4 shadow-[0_24px_70px_rgba(92,74,66,0.22)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-3xl font-black">Foody Fam</p>
                <p className="text-sm font-bold text-[#5c4a42]/70">Dashboard menu</p>
              </div>
              <button
                type="button"
                aria-label="Close dashboard menu"
                className="rounded-full bg-white p-3 text-[#5c4a42] shadow-sm transition active:scale-95"
                onClick={() => setMenuOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <DashboardNavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
            <DashboardAccountBlock
              authUser={authUser}
              authProvider={authProvider}
              onboardingCompleted={onboardingCompleted}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}
      <div className="grid lg:grid-cols-[290px_1fr]">
        <aside className="relative z-20 hidden border-b border-[#eaded5] bg-[#fffaf6] p-4 shadow-[12px_0_46px_rgba(92,74,66,0.05)] lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
          <Link href="/" className="font-display text-3xl font-black">Foody Fam</Link>
          <DashboardNavLinks pathname={pathname} />
          <DashboardAccountBlock
            authUser={authUser}
            authProvider={authProvider}
            onboardingCompleted={onboardingCompleted}
            onLogout={handleLogout}
          />
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          {embedded ? children : children}
        </main>
      </div>
    </div>
  );
}

function DashboardNavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="relative z-10 mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
      {dashboardNav.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition active:scale-[0.99]",
              active
                ? "bg-[#405f46] text-[#fffaf6] shadow-[0_12px_28px_rgba(64,95,70,0.22)] ring-1 ring-[#405f46]/12"
                : "text-[#5c4a42] hover:bg-white hover:shadow-sm"
            )}
          >
            <Icon size={18} className={active ? "text-[#fffaf6]" : "text-current"} />
            <span className={active ? "text-[#fffaf6]" : "text-current"}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function DashboardAccountBlock({
  authUser,
  authProvider,
  onboardingCompleted,
  onLogout
}: {
  authUser: { displayName: string } | null;
  authProvider: string | null;
  onboardingCompleted: boolean;
  onLogout: () => void;
}) {
  return (
      <div className="mt-5 grid gap-2 rounded-[18px] border border-[#eaded5] bg-white p-3 shadow-sm lg:mt-auto">
      <div className="flex items-center gap-2.5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ffccb2] text-sm font-black text-[#5c4a42]">
          {(authUser?.displayName || "P").slice(0, 1)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{authUser?.displayName || "Demo Parent"}</p>
          <p className="truncate text-[11px] font-bold capitalize text-[#5c4a42]/65">
            {onboardingCompleted ? "Profile complete" : "Onboarding open"} / {authProvider || "demo"}
          </p>
        </div>
        <button
          type="button"
          className="ml-auto rounded-full bg-[#f7efe9] p-2 text-[#5c4a42] transition hover:bg-[#ffccb2]"
          aria-label="Log out"
          onClick={onLogout}
        >
          <LogOut size={15} />
        </button>
      </div>
    </div>
  );
}

function DashboardOverview() {
  const planner = useAppStore((state) => state.planner);
  const shopping = useAppStore((state) => state.shopping);
  const recipes = useAppStore((state) => state.recipes);
  const savedIds = useAppStore((state) => state.savedRecipeIds);
  const addRecipeToPlanner = useAppStore((state) => state.addRecipeToPlanner);
  const addRecipeToShoppingList = useAppStore((state) => state.addRecipeToShoppingList);
  const babyProfiles = useAppStore((state) => state.babyProfiles);
  const familyMembers = useAppStore((state) => state.familyMembers);
  const authUser = useAppStore((state) => state.authUser);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const preferences = useAppStore((state) => state.familyPreferences);
  const unchecked = shopping.filter((item) => !item.checked).length;
  const checked = shopping.length - unchecked;
  const shoppingProgress = shopping.length ? Math.round((checked / shopping.length) * 100) : 0;
  const todayRecipe = recipes[0] || demoRecipes[0];
  const savedRecipes = recipes.filter((recipe) => savedIds.includes(recipe.id)).slice(0, 3);
  const profileCompleteness = onboardingCompleted ? 100 : 62;
  const plannedSlots = planner.flatMap((day) => plannerSlots(day).filter((slot) => slot.recipeId));
  const [openToday, setOpenToday] = useState(false);
  const [todayMessage, setTodayMessage] = useState("");
  const recommendedBaseRecipes = databaseRecipes
    .filter((recipe) => recipe.cuisine === (preferences.favoriteCuisines[0] || "Italian") || preferences.appliances.some((item) => recipe.appliances.includes(item)))
    .slice(0, 3);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Dashboard</p>
          <h1 className="[font-family:Georgia,serif] text-5xl font-normal tracking-[-0.045em] text-[#243929]">Welcome back, {authUser?.displayName?.split(" ")[0] || "Parent"}.</h1>
          <p className="mt-2 max-w-2xl font-bold leading-7 text-[#5c4a42]">
            {familyMembers.length} family members, {babyProfiles.length} baby profiles, and a {preferences.favoriteCuisines[0] || "family"} dinner rhythm ready for today.
          </p>
        </div>
        <Link href="/dashboard/generator"><Button><Sparkles size={17} /> Generate meal</Button></Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <LiquidMetric label="Profile" value={`${profileCompleteness}%`} body={onboardingCompleted ? "Family setup complete and ready for AI recipes." : "Finish onboarding to unlock stronger personalization."} />
        <LiquidMetric label="Shopping" value={`${shoppingProgress}%`} body={`${unchecked} items left before the weekly shop is done.`} />
        <LiquidMetric label="Planner" value={`${plannedSlots.length}/21`} body="Breakfast, lunch, and dinner slots planned this week." />
        <LiquidMetric label="Recipe DB" value={`${databaseRecipes.length}`} body="Verified local base recipes ready for AI matching." />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardCommandPanel className="grid content-between gap-6">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Pill className="bg-[#e8f4ef]">Today&apos;s meal</Pill>
              <Pill>{todayRecipe.time}</Pill>
              <Pill>{todayRecipe.difficulty}</Pill>
              <Pill>{todayRecipe.servings} servings</Pill>
            </div>
            <h2 className="[font-family:Georgia,serif] text-4xl font-normal leading-tight tracking-[-0.035em] text-[#243929] md:text-5xl">{todayRecipe.title}</h2>
            <p className="mt-4 max-w-3xl text-lg font-bold leading-8 text-[#5c4a42]">
              {todayRecipe.description || todayRecipe.familyPitch || "One shared base, one baby-safe portion, and one adult finish for a calmer dinner."}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <RecipeTicket className="rounded-[22px] bg-white/78 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78bea8]">Baby version</p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#5c4a42]">{(todayRecipe.babyVersion || todayRecipe.baby).slice(0, 2).join(" / ")}</p>
              </RecipeTicket>
              <RecipeTicket className="rounded-[22px] bg-white/78 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f59b78]">Adult finish</p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#5c4a42]">{(todayRecipe.adultVersion || todayRecipe.adults).slice(0, 2).join(" / ")}</p>
              </RecipeTicket>
            </div>
          </div>
          <GlassActionDock className="bg-white/34">
            <Button onClick={() => setOpenToday(true)}>Open recipe</Button>
            <Button
              variant="secondary"
              onClick={() => {
                addRecipeToPlanner(currentPlannerDay(), todayRecipe);
                setTodayMessage(`Added to ${currentPlannerDay()} dinner`);
              }}
            >
              <CalendarDays size={17} /> Add to planner
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                addRecipeToShoppingList(todayRecipe);
                setTodayMessage("Shopping list updated");
              }}
            >
              <ShoppingBag size={17} /> Add to shopping list
            </Button>
            {todayMessage && <p className="w-full text-sm font-extrabold text-[#78bea8]">{todayMessage}</p>}
          </GlassActionDock>
        </DashboardCommandPanel>
        <div className="grid gap-5">
          <KitchenLedger className="rounded-[24px] bg-white">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-black">Weekly planner</h2>
              <Link href="/dashboard/planner" className="text-sm font-extrabold text-[#78bea8]">Open</Link>
            </div>
            <div className="mt-4 grid gap-2">
              {planner.slice(0, 5).map((item) => <Pill key={item.day} className="w-fit">{item.day}: {primaryPlannerMeal(item)}</Pill>)}
            </div>
          </KitchenLedger>
          <KitchenLedger className="rounded-[24px] bg-white">
            <h2 className="font-display text-2xl font-black">Quick actions</h2>
            <div className="mt-4 grid gap-2">
              <QuickAction href="/dashboard/generator" label="Generate meal" icon={Utensils} />
              <QuickAction href="/dashboard/planner" label="Create weekly plan" icon={CalendarDays} />
              <QuickAction href="/dashboard/profiles" label="Add baby profile" icon={Users} />
              <QuickAction href="/dashboard/shopping" label="Open shopping list" icon={ShoppingBag} />
            </div>
          </KitchenLedger>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <h2 className="font-display text-2xl font-black">Recent recipes</h2>
          <div className="mt-4 grid gap-3">
            {(savedRecipes.length ? savedRecipes : recipes.slice(0, 3)).map((recipe) => (
              <div key={recipe.id} className="recipe-note rounded-2xl bg-white/88 p-3">
                <p className="font-black">{recipe.title}</p>
                <p className="text-xs font-bold text-[#5c4a42]/65">{recipe.tags.slice(0, 3).join(" / ")}</p>
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
              <div key={recipe.slug} className="recipe-note rounded-2xl bg-white/88 p-3">
                <p className="font-black">{recipe.title}</p>
                <p className="text-xs font-bold text-[#5c4a42]/65">{recipe.mealType} / {recipe.proteinType} / {recipe.appliances[0]}</p>
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
      {openToday && <RecipeCloud recipe={todayRecipe} onClose={() => setOpenToday(false)} />}
    </div>
  );
}

function QuickAction({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Utensils }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-[#5c4a42] shadow-sm transition hover:bg-[#fffaf6] active:scale-[0.99]">
      <span className="flex items-center gap-2"><Icon size={17} />{label}</span>
      <span>{">"}</span>
    </Link>
  );
}

export function Overview() {
  const planner = useAppStore((state) => state.planner);
  const shopping = useAppStore((state) => state.shopping);
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
        <Card>
          <h2 className="font-display text-3xl font-black">{demoRecipes[0].title}</h2>
          <p className="mt-3 font-bold leading-7 text-[#5c4a42]">One shared family meal with baby and adult instructions.</p>
        </Card>
        <div className="grid gap-5">
          <Card>
            <h2 className="font-display text-2xl font-black">Weekly plan</h2>
            <div className="mt-4 grid gap-2">{planner.slice(0, 4).map((item) => <Pill key={item.day} className="w-fit">{item.day}: {primaryPlannerMeal(item)}</Pill>)}</div>
          </Card>
          <Card>
            <h2 className="font-display text-2xl font-black">Kitchen status</h2>
            <div className="mt-4 grid gap-2 text-sm font-bold text-[#5c4a42]">
              <p>{shopping.filter((item) => !item.checked).length} shopping items left</p>
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
      <div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">AI Generator</p>
          <h1 className="mt-2 font-display text-4xl font-black">Generate a family recipe</h1>
          <p className="mt-2 max-w-2xl font-bold leading-7 text-[#5c4a42]">
            Build one cooking flow with ingredients, baby portion timing, and adult finishing steps.
          </p>
        </div>
      </div>
      <GeneratorPanel showLatestResult />
    </div>
  );
}

function RecipesInner() {
  const savedIds = useAppStore((state) => state.savedRecipeIds);
  const recipes = useAppStore((state) => state.recipes);
  const generatedRecipes = useAppStore((state) => state.generatedRecipes);
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  const savedRecipes = recipes.filter((recipe) => savedIds.includes(recipe.id));
  return (
    <div className="grid gap-8">
      <h1 className="font-display text-4xl font-black">Saved recipes</h1>
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-black">Saved</h2>
          <Pill>{savedRecipes.length || demoRecipes.length} recipes</Pill>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(savedRecipes.length ? savedRecipes : demoRecipes).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} textOnly onOpen={setOpenRecipe} />)}
        </div>
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-black">Generated history</h2>
          <Pill>{generatedRecipes.length} generated</Pill>
        </div>
        {generatedRecipes.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {generatedRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} textOnly onOpen={setOpenRecipe} />)}
          </div>
        ) : (
          <Card>
            <p className="font-bold leading-7 text-[#5c4a42]">Generate your first family recipe and it will appear here automatically.</p>
            <Link href="/dashboard/generator" className="mt-4 inline-flex"><Button><Sparkles size={17} /> Generate recipe</Button></Link>
          </Card>
        )}
      </div>
      {openRecipe && <RecipeCloud recipe={openRecipe} onClose={() => setOpenRecipe(null)} />}
    </div>
  );
}

function PlannerInner() {
  return <div className="-m-4 sm:-m-6 lg:-m-8"><PlannerPage /></div>;
}

function ShoppingInner() {
  return <div className="-m-4 sm:-m-6 lg:-m-8"><ShoppingPage /></div>;
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
  const router = useRouter();
  const authUser = useAppStore((state) => state.authUser);
  const authProvider = useAppStore((state) => state.authProvider);
  const lastLoginAt = useAppStore((state) => state.lastLoginAt);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const babyProfiles = useAppStore((state) => state.babyProfiles);
  const familyMembers = useAppStore((state) => state.familyMembers);
  const preferences = useAppStore((state) => state.familyPreferences);
  const settingsPreferences = useAppStore((state) => state.settingsPreferences);
  const updateSettingsPreferences = useAppStore((state) => state.updateSettingsPreferences);
  const updateAuthUser = useAppStore((state) => state.updateAuthUser);
  const logout = useAppStore((state) => state.logout);
  const [avatarStatus, setAvatarStatus] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);

  async function handleAvatarChange(file: File | undefined) {
    if (!file) return;
    setAvatarBusy(true);
    setAvatarStatus("");
    try {
      const avatarUrl = isSupabaseConfigured() ? await uploadProfileAvatar(file) : await fileToDataUrl(file);
      updateAuthUser({ avatarUrl });
      setAvatarStatus(isSupabaseConfigured() ? "Profile photo updated." : "Demo profile photo preview updated.");
    } catch {
      setAvatarStatus("Could not update profile photo. Try a JPG, PNG, or WebP under 5 MB.");
    } finally {
      setAvatarBusy(false);
    }
  }

  async function handleAvatarRemove() {
    setAvatarBusy(true);
    try {
      if (isSupabaseConfigured()) await removeProfileAvatar();
      updateAuthUser({ avatarUrl: undefined });
      setAvatarStatus("Profile photo removed.");
    } finally {
      setAvatarBusy(false);
    }
  }

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-4xl font-black">Account & billing</h1>
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <h2 className="font-display text-2xl font-black">Account overview</h2>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#405f46] text-2xl font-black text-[#fffaf6] shadow-[0_16px_38px_rgba(64,95,70,0.18)]">
              {authUser?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={authUser.avatarUrl} alt={`${authUser.displayName} profile`} className="h-full w-full object-cover" />
              ) : (
                authUser?.displayName?.slice(0, 1).toUpperCase() || "F"
              )}
            </div>
            <div className="grid gap-3">
              <div className="flex flex-wrap gap-3">
                <label className="tap-target inline-flex cursor-pointer items-center justify-center rounded-full bg-[#405f46] px-5 py-2.5 text-sm font-extrabold text-[#fffaf6] shadow-sm transition active:scale-[0.98]">
                  {avatarBusy ? "Uploading..." : "Upload profile photo"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    disabled={avatarBusy}
                    onChange={(event) => void handleAvatarChange(event.target.files?.[0])}
                  />
                </label>
                <Button type="button" variant="secondary" disabled={avatarBusy || !authUser?.avatarUrl} onClick={() => void handleAvatarRemove()}>
                  Remove photo
                </Button>
              </div>
              <p className="text-xs font-bold leading-5 text-[#5c4a42]/72">JPG, PNG, or WebP.</p>
              {avatarStatus && <p className="text-sm font-extrabold text-[#437967]">{avatarStatus}</p>}
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-sm font-bold text-[#5c4a42]">
            <p>User: {authUser?.displayName || "Demo Parent"} ({authUser?.email || "parent@foodyfam.demo"})</p>
            <p>Login method: {authProvider || authUser?.provider || "password"}</p>
            <p>Role: {authUser?.role || "user"}</p>
            <p>Account: {authUser?.accountStatus || "active"}</p>
            <p>Email: {authUser?.emailVerified ? "verified" : "demo/unverified"}</p>
            <p>Last login: {lastLoginAt ? new Date(lastLoginAt).toLocaleString() : "Not recorded yet"}</p>
            <p>Onboarding: {onboardingCompleted ? "complete" : "open"}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/dashboard/profiles"><Button>Edit profiles</Button></Link>
            <Button
              variant="secondary"
              onClick={() => {
                void signOutActiveAuth();
                logout();
                router.push("/login");
              }}
            >
              <LogOut size={17} /> Log out
            </Button>
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-2xl font-black">Profile coverage</h2>
          <div className="mt-4 grid gap-3">
            <Pill className="w-fit">{familyMembers.length} family members</Pill>
            <Pill className="w-fit">{babyProfiles.length} baby profiles</Pill>
            <Pill className="w-fit">{preferences.allergies.length ? preferences.allergies.join(", ") : "No allergy rules"}</Pill>
            <Pill className="w-fit">{preferences.favoriteCuisines.join(", ") || "Any cuisine"}</Pill>
          </div>
        </Card>
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-[#e9c7b7] bg-[#fffaf6]">
          <h2 className="font-display text-2xl font-black">Measurement units</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-[#5c4a42]">Used for recipe amounts, generated recipe display, and shopping list labels.</p>
          <div className="mt-5 grid gap-4">
            <SettingToggle
              label="Measurement system"
              value={settingsPreferences.measurementSystem}
              options={[
                ["metric", "Metric"],
                ["us", "US"]
              ]}
              onChange={(value) => updateSettingsPreferences({ measurementSystem: value as "metric" | "us" })}
            />
            <SettingToggle
              label="Temperature"
              value={settingsPreferences.temperatureUnit}
              options={[
                ["celsius", "Celsius"],
                ["fahrenheit", "Fahrenheit"]
              ]}
              onChange={(value) => updateSettingsPreferences({ temperatureUnit: value as "celsius" | "fahrenheit" })}
            />
          </div>
        </Card>
        <Card className="flex min-h-28 flex-col justify-center border-[#e9c7b7] bg-[#fffaf6] sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-black text-[#243929]">Subscription status</h2>
          <Pill className="mt-3 w-fit border border-[#78bea8]/35 bg-[#e8f4ef] px-5 py-2 text-[#5c4a42] shadow-sm sm:mt-0">
            {settingsPreferences.subscriptionStatus}
          </Pill>
        </Card>
      </div>
    </div>
  );
}

function SettingToggle({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#5c4a42]">{label}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map(([optionValue, optionLabel]) => (
          <button
            key={optionValue}
            type="button"
            className={`rounded-full px-4 py-3 text-sm font-extrabold transition active:scale-[0.98] ${
              value === optionValue
                ? "bg-[#405f46] text-[#fffaf6] shadow-[0_10px_24px_rgba(64,95,70,0.18)] focus-visible:ring-[#78bea8]"
                : "border border-[#e9c7b7] bg-[#f7efe9] text-[#5c4a42] hover:bg-[#ffccb2]/35 focus-visible:ring-[#78bea8]"
            }`}
            onClick={() => onChange(optionValue)}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function plannerSlots(day: MealPlanDay) {
  if (day.slots?.length) return day.slots;
  return (["Breakfast", "Lunch", "Dinner"] as MealSlotType[]).map((mealType) => ({
    mealType,
    meal: mealType === "Dinner" ? day.meal : "Choose a meal",
    recipeId: mealType === "Dinner" ? day.recipeId : ""
  }));
}

function primaryPlannerMeal(day: MealPlanDay) {
  const dinner = plannerSlots(day).find((slot) => slot.mealType === "Dinner" && slot.recipeId);
  return dinner?.meal || day.meal || "Choose a meal";
}

function currentPlannerDay() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
}
