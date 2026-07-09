"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarPlus, Check, Clock, Download, Heart, Mail, Plus, Search, Send, ShoppingBasket, Sparkles, Trash2, X } from "lucide-react";
import { SiteShell } from "./layout";
import {
  Button,
  Card,
  GlassActionDock,
  PageHero,
  Pill,
  PlannerEventCard,
  Field,
  Select,
  TextArea
} from "./ui";
import { GeneratorPanel } from "./generator-panel";
import { RecipeCard } from "./recipe-card";
import { RecipeShowcase } from "./recipe-showcase";
import { demoRecipes, pagePhotos } from "@/lib/data";
import { databaseRecipes, databaseRecipeToRecipe } from "@/lib/recipe-database";
import { seoGuides } from "@/lib/seo-content";
import type { BabyProfile, FamilyMember, FamilyPreferences, MealPlanDay, MealSlotType, Recipe, RecipeDatabaseMatch } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { FloatingPhoto, MetricCard, Reveal } from "./motion";

const nutritionData = [
  { day: "Mon", protein: 72, iron: 64, fiber: 58 },
  { day: "Tue", protein: 82, iron: 70, fiber: 66 },
  { day: "Wed", protein: 78, iron: 88, fiber: 74 },
  { day: "Thu", protein: 92, iron: 76, fiber: 82 },
  { day: "Fri", protein: 74, iron: 68, fiber: 62 }
];

const pieData = [
  { name: "Protein", value: 34, color: "#78bea8" },
  { name: "Carbs", value: 39, color: "#f59b78" },
  { name: "Fats", value: 27, color: "#ffccb2" }
];

export function SimpleMarketingPage({ type }: { type: "pricing" | "blog" | "about" | "contact" }) {
  return (
    <SiteShell>
      <main className="app-page">
        <div className="editorial-page-main">
        {type === "pricing" && <Pricing />}
        {type === "blog" && <Blog />}
        {type === "about" && <About />}
        {type === "contact" && <Contact />}
        <PublicCtaBand className="mt-10" />
        </div>
      </main>
    </SiteShell>
  );
}

export function GeneratorPage() {
  const router = useRouter();

  return (
    <SiteShell>
      <main className="app-page">
        <div className="editorial-page-main grid gap-8">
        <div className="grid gap-5">
          <PageHero
            eyebrow="AI Recipe Generator"
            title="Build one family meal"
            body="Start with ingredients, then let Foody Fam split the same cooking flow into a baby portion and an adult finish."
          />
          <GeneratorPanel onResult={() => router.push("/dashboard/generator")} />
          <SeoCopySection
            title="AI recipe generation for one family meal"
            body="Foody Fam is built for parents who want one meal for babies and adults. The generator starts with ingredients, family profiles, baby age, allergy notes, and a verified recipe base, then returns ingredient quantities and steps that show exactly when to remove the baby portion and when to finish the adult plate."
            links={[
              ["Baby-safe recipe library", "/recipes"],
              ["How to cook one meal for baby and adults", "/blog/how-to-cook-one-meal-for-baby-and-adults"]
            ]}
          />
        </div>
        <PublicCtaBand />
        </div>
      </main>
    </SiteShell>
  );
}

export function RecipesPage() {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [mealType, setMealType] = useState("All");
  const [age, setAge] = useState("All");
  const [allergen, setAllergen] = useState("All");
  const [feature, setFeature] = useState("All");
  const [protein, setProtein] = useState("All");
  const [appliance, setAppliance] = useState("All");
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  const recipes = databaseRecipes
    .filter((recipe) => {
      const text = [recipe.title, recipe.description, recipe.mealType, recipe.cuisine, recipe.proteinType, ...recipe.ingredients, ...recipe.tags, ...recipe.aiTags].join(" ").toLowerCase();
      if (query && !text.includes(query.toLowerCase())) return false;
      if (mealType !== "All" && recipe.mealType !== mealType) return false;
      if (allergen !== "All" && recipe.allergens.includes(allergen.toLowerCase())) return false;
      if (feature === "BLW" && recipe.blwStatus !== "BLW-friendly") return false;
      if (feature === "Freezer friendly" && !recipe.freezerFriendly) return false;
      if (feature === "30-minute" && recipe.prepTime + recipe.cookTime > 30) return false;
      if (protein !== "All" && recipe.proteinType !== protein) return false;
      if (appliance !== "All" && !recipe.appliances.includes(appliance)) return false;
      return true;
    })
    .map((recipe) =>
      databaseRecipeToRecipe(recipe, {
        source: "foody-fam-database",
        baseRecipeSlug: recipe.slug,
        baseRecipeTitle: recipe.title,
        score: 100,
        pantryMatch: 100,
        allergyFlags: [],
        ageAdaptation: age === "All" ? "6-8" : (age as RecipeDatabaseMatch["ageAdaptation"]),
        matchReasons: ["Verified database recipe", `${recipe.mealType} collection`, `${recipe.cuisine} profile`],
        aiChanges: ["Ready for AI adaptation", "Baby portion before adult finishing"]
      })
    );
  return (
    <SiteShell>
      <main className="app-page">
        <div className="editorial-page-main">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <PageTitle eyebrow="Recipe library" title="Saved for every age" />
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-4 top-3.5 text-[#5c4a42]" size={18} />
            <Field ref={searchRef} className="pl-11 pr-11" placeholder="Search recipes or tags" value={query} onChange={(event) => setQuery(event.target.value)} />
            {query && (
              <button
                type="button"
                aria-label="Clear recipe search"
                className="absolute right-3 top-2.5 rounded-full bg-[#f7efe9] p-2 text-[#5c4a42] transition hover:bg-[#ffccb2]"
                onClick={() => {
                  setQuery("");
                  window.requestAnimationFrame(() => searchRef.current?.focus());
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <Card className="mt-8 !rounded-[30px] !bg-white">
          <div className="mb-5">
            <h2 className="[font-family:Georgia,serif] text-3xl font-normal tracking-[-0.03em] text-[#243929]">100 verified base recipes</h2>
            <p className="mt-2 max-w-3xl font-bold leading-7 text-[#5c4a42]">AI now starts from structured Foody Fam recipes instead of a blank prompt.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            <FilterField label="Meal type">
              <Select aria-label="Meal type filter" value={mealType} onChange={(event) => setMealType(event.target.value)}>
                {["All", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"].map((item) => <option key={item}>{item}</option>)}
              </Select>
            </FilterField>
            <FilterField label="Baby age">
              <Select aria-label="Age adaptation filter" value={age} onChange={(event) => setAge(event.target.value)}>
                {["All", "6-8", "8-10", "10-12", "toddler"].map((item) => <option key={item}>{item}</option>)}
              </Select>
            </FilterField>
            <FilterField label="Exclude allergen">
              <Select aria-label="Allergen filter" value={allergen} onChange={(event) => setAllergen(event.target.value)}>
                {["All", "Egg", "Dairy", "Gluten", "Fish", "Sesame"].map((item) => <option key={item}>{item}</option>)}
              </Select>
            </FilterField>
            <FilterField label="Feature">
              <Select aria-label="Feature filter" value={feature} onChange={(event) => setFeature(event.target.value)}>
                {["All", "BLW", "Freezer friendly", "30-minute"].map((item) => <option key={item}>{item}</option>)}
              </Select>
            </FilterField>
            <FilterField label="Protein">
              <Select aria-label="Protein filter" value={protein} onChange={(event) => setProtein(event.target.value)}>
                {["All", "Chicken", "Turkey", "Beef", "Fish", "Vegetarian", "Egg", "Dairy"].map((item) => <option key={item}>{item}</option>)}
              </Select>
            </FilterField>
            <FilterField label="Appliance">
              <Select aria-label="Appliance filter" value={appliance} onChange={(event) => setAppliance(event.target.value)}>
                {["All", "Stovetop", "Oven", "Air fryer", "Slow cooker", "Pan", "No cook"].map((item) => <option key={item}>{item}</option>)}
              </Select>
            </FilterField>
          </div>
          <p className="mt-3 text-sm font-extrabold text-[#5c4a42]">{recipes.length} matching verified recipes</p>
        </Card>
        <SeoCopySection
          className="mt-8"
          title="Verified base recipes for baby-safe AI adaptation"
          body="The recipe library gives Foody Fam a trusted starting point before AI adapts a meal. Each base recipe includes meal type, cuisine, difficulty, ingredients, baby age adaptations, adult finishing, allergens, BLW status, freezer-friendly tags, and shopping list data."
          links={databaseRecipes.slice(0, 6).map((recipe) => [recipe.title, `/recipes/${recipe.slug}`])}
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(recipes.length ? recipes : demoRecipes).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} textOnly onOpen={setOpenRecipe} />)}
        </div>
        {openRecipe && <RecipeCloud recipe={openRecipe} onClose={() => setOpenRecipe(null)} />}
        <PublicCtaBand className="mt-10" />
        </div>
      </main>
    </SiteShell>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#5c4a42]">{label}</span>
      {children}
    </label>
  );
}

export function RecipeCloud({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const planner = useAppStore((state) => state.planner);
  const saveRecipe = useAppStore((state) => state.saveRecipe);
  const savedRecipeIds = useAppStore((state) => state.savedRecipeIds);
  const addRecipeToPlanner = useAppStore((state) => state.addRecipeToPlanner);
  const removeRecipeFromPlanner = useAppStore((state) => state.removeRecipeFromPlanner);
  const addRecipeToShoppingList = useAppStore((state) => state.addRecipeToShoppingList);
  const [selectedDay, setSelectedDay] = useState(planner[0]?.day || "Monday");
  const [plannerMessage, setPlannerMessage] = useState("");
  const [shoppingMessage, setShoppingMessage] = useState("");
  const saved = savedRecipeIds.includes(recipe.id);
  const plannedDays = planner
    .filter((day) => plannerSlots(day).some((slot) => slot.recipeId === recipe.id))
    .map((day) => day.day);
  const isPlanned = plannedDays.length > 0;

  function addToPlanner() {
    addRecipeToPlanner(selectedDay, recipe);
    setPlannerMessage(`Added to ${selectedDay}`);
  }

  function removeFromPlanner() {
    removeRecipeFromPlanner(recipe.id);
    setPlannerMessage("Removed from planner");
  }

  function addToShoppingList() {
    addRecipeToShoppingList(recipe);
    setShoppingMessage("Ingredients added to shopping list");
  }

  return (
        <div className="fixed inset-0 z-50 grid place-items-end bg-[#5c4a42]/30 px-0 py-0 backdrop-blur-sm sm:place-items-center sm:px-4 sm:py-6" role="dialog" aria-modal="true">
      <div className="flex max-h-[96dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[30px] border border-[#eaded5] bg-[#fffaf6] shadow-[0_30px_90px_rgba(92,74,66,0.22)] sm:max-h-[94vh] sm:rounded-[36px]">
        <div className="relative z-10 shrink-0 border-b border-white/48 bg-white/54 p-4 backdrop-blur-xl sm:p-5">
          <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#78bea8]">Recipe cloud</p>
            <h2 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">{recipe.title}</h2>
            <p className="mt-3 max-w-2xl font-bold leading-7 text-[#5c4a42]">{recipe.description || recipe.familyPitch}</p>
          </div>
          <button className="rounded-full bg-white p-3 text-[#5c4a42] shadow-sm transition active:scale-95" aria-label="Close recipe" onClick={onClose}>
            <X size={20} />
          </button>
          </div>
        </div>
        <div className="scrollbar-soft relative z-10 min-h-0 flex-1 overflow-y-auto p-4 pb-28 [scrollbar-color:#f59b78_#f7efe9] [scrollbar-width:thin] sm:p-5 sm:pb-32">

        <div className="mt-5 flex flex-wrap gap-2">
          {recipe.tags.slice(0, 8).map((tag) => <Pill key={tag}>{tag}</Pill>)}
        </div>

        <GlassActionDock className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
          <FilterField label="Add to meal planner">
            <Select aria-label="Planner day" value={selectedDay} onChange={(event) => setSelectedDay(event.target.value)}>
              {planner.map((day) => <option key={day.day}>{day.day}</option>)}
            </Select>
          </FilterField>
          <Button variant="secondary" onClick={() => saveRecipe(recipe.id)}>
            <Heart size={17} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </Button>
          {isPlanned ? (
            <Button variant="coral" onClick={removeFromPlanner}>
              <X size={17} />
              Remove from planner
            </Button>
          ) : (
            <Button onClick={addToPlanner}>
              <CalendarPlus size={17} />
              Add to planner
            </Button>
          )}
          <Button variant="secondary" onClick={addToShoppingList}>
            <ShoppingBasket size={17} />
            Add to shopping list
          </Button>
          {(plannerMessage || shoppingMessage) && (
            <p className="text-sm font-extrabold text-[#78bea8] md:col-span-4">
              {[plannerMessage, shoppingMessage].filter(Boolean).join(" / ")}
            </p>
          )}
          {isPlanned && !plannerMessage && !shoppingMessage && <p className="text-sm font-extrabold text-[#5c4a42] md:col-span-4">Planned for {plannedDays.join(", ")}</p>}
        </GlassActionDock>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <MiniFact icon={<Clock size={16} />} label="Time" value={recipe.time} />
          <MiniFact label="Difficulty" value={recipe.difficulty} />
          <MiniFact label="Servings" value={`${recipe.servings}`} />
          <MiniFact label="Calories" value={`${recipe.nutrition.calories}`} />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <CloudSection title="Ingredients" items={ingredientLines(recipe)} />
          <CloudSection title="Cooking steps" items={recipe.cookingSteps?.length ? recipe.cookingSteps : recipe.steps} ordered />
          <CloudSection title="Baby version" items={recipe.babyVersion?.length ? recipe.babyVersion : recipe.baby} />
          <CloudSection title="Adult finish" items={recipe.adultVersion?.length ? recipe.adultVersion : recipe.adults} />
          <CloudSection title="Shopping list" items={shoppingLines(recipe)} icon={<ShoppingBasket size={15} />} />
          <CloudSection title="Safety notes" items={recipe.safetyNotes || recipe.allergyWarnings || ["Review allergens and texture before serving."]} />
        </div>
          <div className="h-2" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function MiniFact({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[#eaded5] bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#78bea8]">{icon}{label}</p>
      <p className="mt-2 font-display text-xl font-black">{value}</p>
    </div>
  );
}

function CloudSection({ title, items, ordered = false, icon }: { title: string; items: string[]; ordered?: boolean; icon?: React.ReactNode }) {
  const List = ordered ? "ol" : "ul";
  return (
    <div className="rounded-[24px] border border-[#eaded5] bg-white p-5 shadow-sm">
      <h3 className="font-display text-2xl font-black">{title}</h3>
      <List className="mt-4 grid gap-3 text-sm font-bold leading-6 text-[#5c4a42]">
        {items.map((item, index) => (
          <li key={`${title}-${item}`} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f4ef] text-xs font-black text-[#78bea8]">
              {icon || (ordered ? index + 1 : <Check size={13} />)}
            </span>
            <span className={item.toLowerCase().includes("baby portion") ? "rounded-xl bg-[#e8f4ef] px-2 py-1 text-[#315f52]" : item.toLowerCase().includes("adult finish") ? "rounded-xl bg-[#ffccb2]/70 px-2 py-1 text-[#5c4a42]" : ""}>{item}</span>
          </li>
        ))}
      </List>
    </div>
  );
}

function ingredientLines(recipe: Recipe) {
  if (recipe.ingredientDetails?.length) {
    return recipe.ingredientDetails.map((item) => `${formatQuantity(item.quantity)} ${item.unit} ${item.name}${item.note ? ` - ${item.note}` : ""}`);
  }
  return recipe.ingredients;
}

function shoppingLines(recipe: Recipe) {
  const lines = (recipe.shoppingList || []).flatMap((group) => group.items.map((item) => `${group.category}: ${item}`));
  return lines.length ? lines : ingredientLines(recipe);
}

function formatQuantity(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

export function RecipeDetailPage() {
  const [tab, setTab] = useState("Overview");
  const recipe = demoRecipes[0];
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <RecipeShowcase recipe={recipe} />
        <div className="mt-6 flex flex-wrap gap-2">
          {["Overview", "Instructions", "Nutrition", "Reviews"].map((item) => (
            <Button key={item} variant={tab === item ? "primary" : "secondary"} onClick={() => setTab(item)}>{item}</Button>
          ))}
        </div>
        <Card className="mt-5">
          {tab === "Overview" && <p className="text-lg font-bold leading-8 text-[#5c4a42]">A creamy one-pot dinner that separates cleanly into a salt-free baby portion and a bright, parmesan-finished adult plate.</p>}
          {tab === "Instructions" && <ol className="grid gap-3">{recipe.steps.map((step, index) => <li key={step} className="font-bold"><span className="text-[#78bea8]">{index + 1}.</span> {step}</li>)}</ol>}
          {tab === "Nutrition" && <NutritionCharts />}
          {tab === "Reviews" && <p className="font-bold text-[#5c4a42]">&ldquo;Healthy, easy and so much less stress at dinner time.&rdquo; - Emily, Mom of 3</p>}
        </Card>
      </main>
    </SiteShell>
  );
}

export function PlannerPage() {
  const planner = useAppStore((state) => state.planner);
  const recipes = useAppStore((state) => state.recipes);
  const setPlannerSlot = useAppStore((state) => state.setPlannerSlot);
  const clearPlannerSlot = useAppStore((state) => state.clearPlannerSlot);
  const [openDay, setOpenDay] = useState<MealPlanDay | null>(null);
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  const plannerRecipes = recipes.length ? recipes : demoRecipes;
  const weekRange = "This week";
  return (
    <SiteShell>
      <main className="app-page">
        <div className="editorial-page-main">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <PageTitle eyebrow="Weekly meal planner" title="One week, one calmer kitchen" />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">Week</Button>
            <Button variant="ghost">Month</Button>
            <Button variant="secondary">Today</Button>
          </div>
        </div>
        <section className="kitchen-ledger mt-8 overflow-hidden rounded-[34px] bg-white p-4 text-[#5c4a42] sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#78bea8]">{weekRange}</p>
              <h2 className="font-display text-3xl font-black">Family meal calendar</h2>
            </div>
            <Pill className="w-fit bg-white/80">Breakfast / Lunch / Dinner</Pill>
          </div>
          <div className="relative z-10 grid grid-cols-[64px_1fr] overflow-x-auto rounded-[22px] border border-[#eaded5] bg-[#fffaf6]">
            <div className="grid grid-rows-[44px_repeat(3,150px)] border-r border-[#eaded5] bg-white text-xs font-bold text-[#5c4a42]/62">
              <div />
              {["8 AM", "Noon", "6 PM"].map((time) => <div key={time} className="border-t border-[#5c4a42]/12 p-3">{time}</div>)}
            </div>
            <div className="grid min-w-[860px] grid-cols-7">
              {planner.map((day) => (
                <button
                  key={day.day}
                  type="button"
                  className="border-r border-[#eaded5] text-left transition hover:bg-white last:border-r-0"
                  onClick={() => setOpenDay(day)}
                >
                  <div className="h-11 border-b border-[#eaded5] px-3 py-2">
                    <p className="text-xs font-black text-[#5c4a42]/76">{day.day}</p>
                  </div>
                  {plannerSlots(day).map((slot) => {
                    const recipe = plannerRecipes.find((item) => item.id === slot.recipeId);
                    return (
                      <div key={`${day.day}-${slot.mealType}`} className="relative h-[150px] border-b border-[#eaded5]/70 p-3 last:border-b-0">
                        <PlannerEventCard mealType={slot.mealType} title={slot.meal} className={`h-full border-[#eaded5] shadow-[0_10px_24px_rgba(92,74,66,0.08)] ${slotColor(slot.mealType)}`}>
                          {recipe && (
                            <ul className="mt-2 grid gap-1 text-[11px] font-bold">
                              {(recipe.ingredientDetails?.map((item) => item.name) || recipe.ingredients).slice(0, 3).map((item) => <li key={item}>- {item}</li>)}
                            </ul>
                          )}
                        </PlannerEventCard>
                      </div>
                    );
                  })}
                </button>
              ))}
            </div>
          </div>
        </section>
        {openDay && (
          <PlannerDrawer
            day={openDay}
            recipes={plannerRecipes}
            onClose={() => setOpenDay(null)}
            onChoose={(mealType, recipeId) => setPlannerSlot(openDay.day, mealType, recipeId)}
            onClear={(mealType) => clearPlannerSlot(openDay.day, mealType)}
            onOpenRecipe={(recipe) => setOpenRecipe(recipe)}
          />
        )}
        {openRecipe && <RecipeCloud recipe={openRecipe} onClose={() => setOpenRecipe(null)} />}
        <SeoCopySection
          className="mt-8"
          title="Weekly meal planning for parents"
          body="Foody Fam organizes breakfast, lunch, and dinner into a one-week family meal calendar. Parents can plan around baby texture needs, adult dinners, leftovers, and the shopping list instead of rebuilding dinner decisions every day."
          links={[
            ["Weekly meal planning guide", "/blog/weekly-meal-planning-for-parents"],
            ["Browse recipe library", "/recipes"]
          ]}
        />
        <PublicCtaBand className="mt-10" />
        </div>
      </main>
    </SiteShell>
  );
}

function PlannerDrawer({
  day,
  recipes,
  onClose,
  onChoose,
  onClear,
  onOpenRecipe
}: {
  day: MealPlanDay;
  recipes: Recipe[];
  onClose: () => void;
  onChoose: (mealType: MealSlotType, recipeId: string) => void;
  onClear: (mealType: MealSlotType) => void;
  onOpenRecipe: (recipe: Recipe) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[#5c4a42]/28 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button className="absolute inset-0 cursor-default" aria-label="Close planner drawer" onClick={onClose} />
      <aside className="absolute bottom-0 right-0 grid max-h-[86vh] w-full gap-4 overflow-auto rounded-t-[28px] border border-[#eaded5] bg-[#fffaf6] p-5 shadow-[0_30px_90px_rgba(92,74,66,0.22)] lg:bottom-auto lg:top-0 lg:h-full lg:max-h-none lg:w-[440px] lg:rounded-l-[28px] lg:rounded-tr-none">
        <div className="sticky top-0 z-10 -mx-5 -mt-5 flex items-start justify-between gap-3 border-b border-[#eaded5] bg-[#fffaf6] p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#78bea8]">Plan day</p>
            <h2 className="font-display text-3xl font-black">{day.day}</h2>
          </div>
          <button className="rounded-full bg-white p-3 text-[#5c4a42] shadow-sm" aria-label="Close drawer" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {plannerSlots(day).map((slot) => {
          const recipe = recipes.find((item) => item.id === slot.recipeId);
          return (
            <div key={`${day.day}-${slot.mealType}`} className="rounded-[22px] border border-[#eaded5] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f59b78]">{slot.mealType}</p>
                  <p className="font-black">{slot.meal}</p>
                </div>
                {slot.recipeId && (
                  <button className="rounded-full p-2 text-[#f59b78] hover:bg-[#fff0eb]" aria-label={`Clear ${slot.mealType}`} onClick={() => onClear(slot.mealType)}>
                    <X size={16} />
                  </button>
                )}
              </div>
              <Select aria-label={`Choose ${slot.mealType} for ${day.day}`} value={slot.recipeId} onChange={(event) => onChoose(slot.mealType, event.target.value)}>
                <option value="">Choose a meal</option>
                {recipes.map((recipeOption) => <option key={recipeOption.id} value={recipeOption.id}>{recipeOption.title}</option>)}
              </Select>
              {recipe && (
                <Button className="mt-3 w-full" variant="secondary" onClick={() => onOpenRecipe(recipe)}>
                  Open recipe
                </Button>
              )}
            </div>
          );
        })}
      </aside>
    </div>
  );
}

function slotColor(mealType: MealSlotType) {
  if (mealType === "Breakfast") return "bg-[#ffccb2]/82";
  if (mealType === "Lunch") return "bg-[#f59b78]/78";
  return "bg-[#e8f4ef]/88";
}

export function ShoppingPage() {
  const [label, setLabel] = useState("");
  const shopping = useAppStore((state) => state.shopping);
  const toggleShoppingItem = useAppStore((state) => state.toggleShoppingItem);
  const addShoppingItem = useAppStore((state) => state.addShoppingItem);
  const removeShoppingItem = useAppStore((state) => state.removeShoppingItem);
  const checkedCount = shopping.filter((item) => item.checked).length;

  function submitItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addShoppingItem({ label, category: "Shopping list" });
    setLabel("");
  }

  return (
    <SiteShell>
      <main className="app-page">
        <div className="editorial-page-main">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <PageTitle eyebrow="Smart shopping list" title="One list for everyone" />
          <Button variant="secondary"><Download size={17} /> Export PDF</Button>
        </div>
        <Card className="mt-8 overflow-hidden !border-[#eaded5] !bg-white !p-0 !shadow-[0_24px_64px_rgba(92,74,66,0.1)]">
          <div className="grid gap-5 border-b border-[#5c4a42]/10 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Pill className="mb-4 bg-[#e8f4ef]">
                <ShoppingBasket size={14} className="mr-1 text-[#78bea8]" />
                Market-ready
              </Pill>
              <h2 className="font-display text-3xl font-black">Family grocery list</h2>
              <p className="mt-2 max-w-2xl font-bold leading-7 text-[#5c4a42]">
                Add ingredients as you plan meals, remove what you do not need, and mark items as bought while shopping.
              </p>
            </div>
            <div className="grid gap-2 rounded-[22px] border border-[#eaded5] bg-[#fffaf6] p-4 text-sm font-extrabold text-[#5c4a42] shadow-sm sm:min-w-56">
              <span>{checkedCount} bought</span>
              <span>{shopping.length - checkedCount} still needed</span>
            </div>
          </div>

          <form className="grid gap-3 border-b border-[#5c4a42]/10 p-5 sm:grid-cols-[1fr_auto] sm:p-6" onSubmit={submitItem}>
            <Field aria-label="Shopping item" placeholder="Add ingredient, e.g. Greek yogurt" value={label} onChange={(event) => setLabel(event.target.value)} />
            <Button type="submit">
              <Plus size={17} />
              Add item
            </Button>
          </form>

          <div className="grid gap-3 p-5 sm:p-6">
            {shopping.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[18px] border border-[#eaded5] bg-[#fffaf6] p-3 shadow-[0_10px_24px_rgba(92,74,66,0.045)]">
                <label className="flex min-w-0 cursor-pointer items-center gap-3 text-left font-bold">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleShoppingItem(item.id)}
                    className="h-5 w-5 shrink-0 accent-[#78bea8]"
                  />
                  <span className={`min-w-0 ${item.checked ? "text-[#5c4a42]/55 line-through" : "text-[#3d3632]"}`}>{item.label}</span>
                </label>
                <button
                  type="button"
                  aria-label={`Remove ${item.label}`}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#5c4a42] shadow-sm transition hover:text-[#f59b78]"
                  onClick={() => removeShoppingItem(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {!shopping.length && (
              <div className="rounded-[24px] border border-dashed border-[#e9c7b7] bg-white/64 p-6 text-center font-bold text-[#5c4a42]">
                Your shopping list is empty. Add your first ingredient above.
              </div>
            )}
          </div>
        </Card>
        <SeoCopySection
          className="mt-8"
          title="One shopping list for baby and adult meals"
          body="Foody Fam turns planned recipes into one grocery list for the whole family. The list supports baby-safe portions, adult finishes, pantry reuse, and checkbox shopping without splitting dinner into separate workflows."
          links={[
            ["Plan meals first", "/planner"],
            ["Generate a recipe", "/generator"]
          ]}
        />
        <PublicCtaBand className="mt-10" />
        </div>
      </main>
    </SiteShell>
  );
}

export function PantryPage() {
  const [item, setItem] = useState("");
  const pantry = useAppStore((state) => state.pantry);
  const addPantryItem = useAppStore((state) => state.addPantryItem);
  const removePantryItem = useAppStore((state) => state.removePantryItem);
  const owned = Math.min(92, 52 + pantry.length * 7);
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle eyebrow="Pantry" title={`You already own ${owned}% of ingredients`} />
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <FloatingPhoto src={pagePhotos.pantry} title="Use what is already home" caption="Pantry matching reduces waste and makes AI suggestions feel immediately practical." />
          <MetricCard label="Pantry match" value={`${owned}%`} body="Foody Fam prioritizes meals that reuse ingredients already in your kitchen." />
        </div>
        <Card className="mt-8">
          <form className="flex gap-3" onSubmit={(event) => { event.preventDefault(); addPantryItem(item); setItem(""); }}>
            <Field placeholder="Add an ingredient" value={item} onChange={(event) => setItem(event.target.value)} />
            <Button type="submit"><Plus size={17} /> Add</Button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2">
            {pantry.map((pantryItem) => (
              <button key={pantryItem} onClick={() => removePantryItem(pantryItem)}>
                <Pill className="gap-2 bg-[#e8f4ef]">{pantryItem}<Trash2 size={13} /></Pill>
              </button>
            ))}
          </div>
        </Card>
      </main>
    </SiteShell>
  );
}

export function NutritionPage() {
  return (
    <SiteShell>
      <main className="app-page">
        <div className="editorial-page-main">
        <PageTitle eyebrow="Nutrition" title="Tiny details, clear choices" />
        <p className="mt-4 max-w-3xl text-lg font-bold leading-8 text-[#5c4a42]">Protein, iron, fiber, and vitamin signals are shown in plain family language.</p>
        <div className="mt-8"><NutritionCharts /></div>
        <SeoCopySection
          className="mt-8"
          title="Family nutrition signals without medical claims"
          body="Foody Fam summarizes practical nutrition signals like protein, iron, vitamin C, fiber, texture, and baby/adult portions. It helps parents plan balanced meals while keeping allergy and feeding concerns cautious and professional."
          links={[
            ["Baby-safe dinners by age", "/blog/baby-safe-dinners-by-age"],
            ["Allergy-aware planning", "/blog/baby-food-allergens-and-meal-planning"]
          ]}
        />
        <PublicCtaBand className="mt-10" />
        </div>
      </main>
    </SiteShell>
  );
}

export function AssistantPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const chat = useAppStore((state) => state.chat);
  const addChatMessage = useAppStore((state) => state.addChatMessage);

  async function send() {
    if (!text.trim()) return;
    const userText = text.trim();
    setText("");
    addChatMessage({ id: crypto.randomUUID(), role: "user", content: userText });
    setLoading(true);
    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      const data = (await response.json()) as { message: string };
      addChatMessage({ id: crypto.randomUUID(), role: "assistant", content: data.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <main className="app-page">
        <div className="editorial-page-main grid max-w-5xl gap-5">
        <PageTitle eyebrow="AI cooking assistant" title="Ask before dinner gets loud" />
        <Card className="grid max-h-[620px] gap-4 overflow-hidden">
          <div className="scrollbar-soft grid max-h-[420px] gap-3 overflow-auto pr-2">
            {chat.map((message) => (
              <div key={message.id} className={`max-w-[82%] rounded-[22px] p-4 text-sm font-bold leading-6 ${message.role === "user" ? "ml-auto bg-[#78bea8] text-white" : "bg-white text-[#5c4a42]"}`}>
                {message.content}
              </div>
            ))}
            {loading && <div className="max-w-[82%] rounded-[22px] bg-white p-4 text-sm font-bold text-[#5c4a42]">Thinking through a family-safe answer...</div>}
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <Field
              placeholder="Can I replace broccoli? Can I freeze this?"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void send();
              }}
            />
            <Button className="w-full sm:w-auto" disabled={loading || !text.trim()} onClick={() => void send()}>
              <Send size={17} />
              Ask assistant
            </Button>
          </div>
        </Card>
        <PublicCtaBand />
        </div>
      </main>
    </SiteShell>
  );
}

export function ProfilesPage() {
  const authUser = useAppStore((state) => state.authUser);
  const authProvider = useAppStore((state) => state.authProvider);
  const lastLoginAt = useAppStore((state) => state.lastLoginAt);
  const babyProfiles = useAppStore((state) => state.babyProfiles);
  const familyMembers = useAppStore((state) => state.familyMembers);
  const preferences = useAppStore((state) => state.familyPreferences);
  const updateAuthUser = useAppStore((state) => state.updateAuthUser);
  const addFamilyMember = useAppStore((state) => state.addFamilyMember);
  const updateFamilyMember = useAppStore((state) => state.updateFamilyMember);
  const removeFamilyMember = useAppStore((state) => state.removeFamilyMember);
  const addBabyProfile = useAppStore((state) => state.addBabyProfile);
  const updateBabyProfile = useAppStore((state) => state.updateBabyProfile);
  const removeBabyProfile = useAppStore((state) => state.removeBabyProfile);
  const updateFamilyPreferences = useAppStore((state) => state.updateFamilyPreferences);
  const [accountDraft, setAccountDraft] = useState({
    displayName: "",
    email: "",
    avatarUrl: ""
  });
  const [familyDraft, setFamilyDraft] = useState<FamilyMember>({ id: "", name: "", role: "Parent", preferences: [] });
  const [babyDraft, setBabyDraft] = useState<BabyProfile>({ id: "", name: "", age: "", style: "Mixed", allergies: [] });
  const [preferenceDraft, setPreferenceDraft] = useState<FamilyPreferences | null>(null);
  const providerLabel = authProvider || authUser?.provider || "password";
  const accountValues = {
    displayName: accountDraft.displayName || authUser?.displayName || "Demo Parent",
    email: accountDraft.email || authUser?.email || "parent@foodyfam.demo",
    avatarUrl: accountDraft.avatarUrl || authUser?.avatarUrl || ""
  };
  const preferenceValues = preferenceDraft || preferences;

  function resetFamilyDraft() {
    setFamilyDraft({ id: "", name: "", role: "Parent", preferences: [] });
  }

  function resetBabyDraft() {
    setBabyDraft({ id: "", name: "", age: "", style: "Mixed", allergies: [] });
  }

  function saveFamilyMember() {
    const member = {
      ...familyDraft,
      id: familyDraft.id || createLocalId("family"),
      name: familyDraft.name.trim() || "Family member",
      role: familyDraft.role.trim() || "Family",
      preferences: familyDraft.preferences.filter(Boolean)
    };
    if (familyDraft.id) updateFamilyMember(familyDraft.id, member);
    else addFamilyMember(member);
    resetFamilyDraft();
  }

  function saveBabyProfile() {
    const profile = {
      ...babyDraft,
      id: babyDraft.id || createLocalId("baby"),
      name: babyDraft.name.trim() || "Baby",
      age: babyDraft.age.trim() || "8 months",
      allergies: babyDraft.allergies.filter(Boolean)
    };
    if (babyDraft.id) updateBabyProfile(babyDraft.id, profile);
    else addBabyProfile(profile);
    resetBabyDraft();
  }

  return (
    <SiteShell>
      <main className="app-page">
        <div className="editorial-page-main">
        <PageTitle eyebrow="Profiles" title="Foody Fam remembers everyone" />
        <div className="mt-8 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="grid content-start gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#78bea8]">Account</p>
              <h2 className="font-display text-2xl font-black">Parent profile</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field aria-label="Display name" value={accountValues.displayName} onChange={(event) => setAccountDraft((draft) => ({ ...draft, displayName: event.target.value }))} />
              <Field aria-label="Email" type="email" value={accountValues.email} onChange={(event) => setAccountDraft((draft) => ({ ...draft, email: event.target.value }))} />
              <Field aria-label="Avatar URL" className="sm:col-span-2" placeholder="Avatar URL" value={accountValues.avatarUrl} onChange={(event) => setAccountDraft((draft) => ({ ...draft, avatarUrl: event.target.value }))} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill className="bg-[#e8f4ef] capitalize">{providerLabel} account</Pill>
              <Pill>{authUser?.emailVerified ? "Email verified" : "Demo email"}</Pill>
              <Pill>{lastLoginAt ? `Last login ${new Date(lastLoginAt).toLocaleDateString()}` : "Not logged in"}</Pill>
            </div>
            <Button
              className="w-fit"
              onClick={() =>
                updateAuthUser({
                  displayName: accountValues.displayName,
                  email: accountValues.email,
                  avatarUrl: accountValues.avatarUrl || undefined
                })
              }
            >
              Save account
            </Button>
          </Card>

          <Card className="grid content-start gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#78bea8]">Family</p>
                <h2 className="font-display text-2xl font-black">Family members</h2>
              </div>
              <Pill>{familyMembers.length} active</Pill>
            </div>
            <ProfileRows
              empty="Add the people Foody Fam should plan portions for."
              rows={familyMembers.map((member) => ({
                id: member.id,
                title: member.name,
                meta: `${member.role} / ${member.preferences.join(", ") || "No preferences yet"}`,
                onEdit: () => setFamilyDraft(member),
                onRemove: () => removeFamilyMember(member.id)
              }))}
            />
            <div className="grid gap-3 rounded-[22px] bg-white/76 p-4">
              <p className="font-black">{familyDraft.id ? "Edit family member" : "Add family member"}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field aria-label="Family member name" placeholder="Name" value={familyDraft.name} onChange={(event) => setFamilyDraft((draft) => ({ ...draft, name: event.target.value }))} />
                <Field aria-label="Family member role" placeholder="Role" value={familyDraft.role} onChange={(event) => setFamilyDraft((draft) => ({ ...draft, role: event.target.value }))} />
              </div>
              <Field aria-label="Family member preferences" placeholder="Preferences, comma separated" value={familyDraft.preferences.join(", ")} onChange={(event) => setFamilyDraft((draft) => ({ ...draft, preferences: splitList(event.target.value) }))} />
              <div className="flex flex-wrap gap-2">
                <Button onClick={saveFamilyMember}>{familyDraft.id ? "Save member" : "Add member"}</Button>
                {familyDraft.id && <Button variant="secondary" onClick={resetFamilyDraft}>Cancel</Button>}
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="grid content-start gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#78bea8]">Children</p>
                <h2 className="font-display text-2xl font-black">Baby profiles</h2>
              </div>
              <Pill>{babyProfiles.length} profiles</Pill>
            </div>
            <ProfileRows
              empty="Add a baby or toddler profile to guide texture and allergy decisions."
              rows={babyProfiles.map((profile) => ({
                id: profile.id,
                title: profile.name,
                meta: `${profile.age} / ${profile.style} / ${profile.allergies.join(", ") || "No allergies"}`,
                onEdit: () => setBabyDraft(profile),
                onRemove: () => removeBabyProfile(profile.id)
              }))}
            />
            <div className="grid gap-3 rounded-[22px] bg-white/76 p-4">
              <p className="font-black">{babyDraft.id ? "Edit baby profile" : "Add baby profile"}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field aria-label="Baby name" placeholder="Name" value={babyDraft.name} onChange={(event) => setBabyDraft((draft) => ({ ...draft, name: event.target.value }))} />
                <Field aria-label="Baby age" placeholder="Age" value={babyDraft.age} onChange={(event) => setBabyDraft((draft) => ({ ...draft, age: event.target.value }))} />
                <Select aria-label="Baby feeding style" value={babyDraft.style} onChange={(event) => setBabyDraft((draft) => ({ ...draft, style: event.target.value as BabyProfile["style"] }))}>
                  <option>Puree</option>
                  <option>BLW</option>
                  <option>Mixed</option>
                </Select>
              </div>
              <Field aria-label="Baby allergies" placeholder="Allergies, comma separated" value={babyDraft.allergies.join(", ")} onChange={(event) => setBabyDraft((draft) => ({ ...draft, allergies: splitList(event.target.value) }))} />
              <div className="flex flex-wrap gap-2">
                <Button onClick={saveBabyProfile}>{babyDraft.id ? "Save baby profile" : "Add baby profile"}</Button>
                {babyDraft.id && <Button variant="secondary" onClick={resetBabyDraft}>Cancel</Button>}
              </div>
            </div>
          </Card>

          <Card className="grid content-start gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#78bea8]">Preferences</p>
              <h2 className="font-display text-2xl font-black">Family food rules</h2>
            </div>
            <PreferenceEditor label="Allergies" value={preferenceValues.allergies} onChange={(items) => setPreferenceDraft({ ...preferenceValues, allergies: items })} />
            <PreferenceEditor label="Diet preferences" value={preferenceValues.dietPreferences} onChange={(items) => setPreferenceDraft({ ...preferenceValues, dietPreferences: items })} />
            <PreferenceEditor label="Favorite cuisines" value={preferenceValues.favoriteCuisines} onChange={(items) => setPreferenceDraft({ ...preferenceValues, favoriteCuisines: items })} />
            <PreferenceEditor label="Kitchen appliances" value={preferenceValues.appliances} onChange={(items) => setPreferenceDraft({ ...preferenceValues, appliances: items })} />
            <PreferenceEditor label="Cooking goals" value={preferenceValues.cookingGoals} onChange={(items) => setPreferenceDraft({ ...preferenceValues, cookingGoals: items })} />
            <Button className="w-fit" onClick={() => updateFamilyPreferences(preferenceValues)}>Save preferences</Button>
          </Card>
        </div>
        </div>
      </main>
    </SiteShell>
  );
}

function ProfileRows({
  rows,
  empty
}: {
  rows: { id: string; title: string; meta: string; onEdit: () => void; onRemove: () => void }[];
  empty: string;
}) {
  if (!rows.length) {
    return <p className="rounded-[20px] bg-white/76 p-4 text-sm font-bold leading-6 text-[#5c4a42]">{empty}</p>;
  }
  return (
    <div className="grid gap-3">
      {rows.map((row) => (
        <div key={row.id} className="grid gap-3 rounded-[20px] bg-white/82 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="font-black">{row.title}</p>
            <p className="text-sm font-bold leading-6 text-[#5c4a42]/75">{row.meta}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={row.onEdit}>Edit</Button>
            <Button variant="ghost" onClick={row.onRemove}><Trash2 size={16} /> Remove</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PreferenceEditor({ label, value, onChange }: { label: string; value: string[]; onChange: (items: string[]) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-[#5c4a42]">{label}</span>
      <Field value={value.join(", ")} onChange={(event) => onChange(splitList(event.target.value))} />
    </label>
  );
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function OnboardingPage() {
  const step = useAppStore((state) => state.onboardingStep);
  const draft = useAppStore((state) => state.onboardingDraft);
  const setStep = useAppStore((state) => state.setOnboardingStep);
  const updateDraft = useAppStore((state) => state.updateOnboardingDraft);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const steps = ["Family", "Baby profile", "Allergies", "Food style", "Kitchen", "Goals", "Ready"];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  function toggleList(key: "allergies" | "dietPreferences" | "favoriteCuisines" | "appliances" | "cookingGoals", value: string) {
    const current = draft[key];
    updateDraft({ [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] });
  }

  function finish() {
    completeOnboarding({
      id: "onboarding-baby",
      name: draft.babyName || "Baby",
      age: draft.babyAge || "8 months",
      style: draft.babyStyle,
      allergies: draft.allergies
    });
  }

  return (
    <SiteShell>
      <main className="app-page">
        <div className="editorial-page-main grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <Card className="grid min-h-[420px] content-between gap-6 !rounded-[36px]">
          <div>
            <Pill className="bg-[#e8f4ef]">Set the table once</Pill>
            <h1 className="mt-5 [font-family:Georgia,serif] text-5xl font-normal leading-[0.95] tracking-[-0.045em] text-[#243929]">Teach Foody Fam your family rhythm.</h1>
            <p className="mt-5 text-base font-bold leading-7 text-[#5c4a42]">Seven quick steps teach Foody Fam who eats, what to avoid, and what tools are in the kitchen.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {steps.slice(0, 6).map((item) => <Pill key={item} className="bg-white">{item}</Pill>)}
          </div>
        </Card>
        <Card className="grid gap-6 !rounded-[36px] !bg-white">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Onboarding</p>
          <div>
            <div className="flex items-center justify-between gap-3">
              <h1 className="font-display text-4xl font-black">{steps[step]}</h1>
              <Pill>{progress}%</Pill>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f7efe9]">
              <div className="h-full rounded-full bg-[#78bea8] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="grid gap-4">
            {step === 0 && (
              <>
                <Field aria-label="Family members" value={draft.familyCount} onChange={(event) => updateDraft({ familyCount: event.target.value })} placeholder="How many family members?" />
                <p className="font-bold leading-7 text-[#5c4a42]">This helps Foody Fam size portions, shopping lists, and weekly plans.</p>
              </>
            )}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field aria-label="Baby name" value={draft.babyName} onChange={(event) => updateDraft({ babyName: event.target.value })} placeholder="Baby or toddler name" />
                <Field aria-label="Baby age" value={draft.babyAge} onChange={(event) => updateDraft({ babyAge: event.target.value })} placeholder="Age, for example 8 months" />
                <div className="sm:col-span-2 flex flex-wrap gap-2">
                  {(["Puree", "BLW", "Mixed"] as const).map((style) => (
                    <button key={style} type="button" onClick={() => updateDraft({ babyStyle: style })}>
                      <Pill className={draft.babyStyle === style ? "bg-[#78bea8] text-white" : ""}>{style}</Pill>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <ChipGroup
                values={["Egg", "Dairy", "Gluten", "Peanut", "Soy", "Fish", "No known allergies"]}
                active={draft.allergies}
                onToggle={(value) => toggleList("allergies", value)}
              />
            )}
            {step === 3 && (
              <div className="grid gap-4">
                <ChipGroup values={["Balanced", "Vegetarian", "High iron", "Low sugar", "Freezer friendly"]} active={draft.dietPreferences} onToggle={(value) => toggleList("dietPreferences", value)} />
                <ChipGroup values={["Italian", "Mediterranean", "Asian-inspired", "Mexican", "Comfort food", "Breakfast"]} active={draft.favoriteCuisines} onToggle={(value) => toggleList("favoriteCuisines", value)} />
              </div>
            )}
            {step === 4 && (
              <ChipGroup values={["Stovetop", "Oven", "Air fryer", "Slow cooker", "Blender", "Pressure cooker"]} active={draft.appliances} onToggle={(value) => toggleList("appliances", value)} />
            )}
            {step === 5 && (
              <ChipGroup values={["20-minute dinners", "Less food waste", "Batch cooking", "More vegetables", "Baby-safe textures", "One shopping list"]} active={draft.cookingGoals} onToggle={(value) => toggleList("cookingGoals", value)} />
            )}
            {step === 6 && (
              <div className="grid gap-4">
                <p className="text-lg font-bold leading-8 text-[#5c4a42]">
                  Your baby profile, starter pantry, first weekly plan, and dashboard welcome state are ready.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[draft.babyName, draft.babyAge, draft.babyStyle, ...draft.cookingGoals.slice(0, 2)].filter(Boolean).map((item) => <Pill key={item}>{item}</Pill>)}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
            {step < 6 ? (
              <Button onClick={() => setStep(step + 1)}>Continue</Button>
            ) : (
              <Link href="/dashboard">
                <Button onClick={finish}>Open dashboard</Button>
              </Link>
            )}
          </div>
        </Card>
        </div>
      </main>
    </SiteShell>
  );
}

function ChipGroup({ values, active, onToggle }: { values: string[]; active: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <button key={value} type="button" onClick={() => onToggle(value)}>
          <Pill className={active.includes(value) ? "bg-[#78bea8] text-white" : ""}>{value}</Pill>
        </button>
      ))}
    </div>
  );
}

function NutritionCharts() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="min-h-[320px]">
        <h2 className="font-display text-2xl font-black">Weekly nutrient rhythm</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={nutritionData}>
              <CartesianGrid stroke="#ead8ce" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area dataKey="protein" stroke="#78bea8" fill="#78bea8" fillOpacity={0.24} />
              <Area dataKey="iron" stroke="#f59b78" fill="#f59b78" fillOpacity={0.18} />
              <Area dataKey="fiber" stroke="#5c4a42" fill="#5c4a42" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="min-h-[320px]">
        <h2 className="font-display text-2xl font-black">Today’s plate</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92}>
                {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const plans = [
    {
      name: "Free",
      monthlyPrice: "€0",
      yearlyPrice: "€0",
      cadence: "Forever",
      body: "Try the Foody Fam workflow with a small, useful starter plan.",
      cta: "Start free",
      variant: "secondary" as const,
      featured: false,
      points: ["3 meal generations", "Basic AI meal result", "Baby/adult split instructions", "Local demo profile setup"],
      limits: ["Limited generation history"]
    },
    {
      name: "Premium",
      monthlyPrice: "€12",
      yearlyPrice: "€8",
      cadence: "/ month",
      yearlyNote: "Billed €96 yearly",
      body: "For families who want planning and AI help, without the full recipe library or shopping list.",
      cta: "Upgrade to Premium",
      variant: "secondary" as const,
      featured: true,
      points: ["14 meal generations per week", "Meal planner access", "Nutrition insights", "AI assistant"],
      limits: ["No recipe library access", "No shopping list"]
    },
    {
      name: "Unlimited",
      monthlyPrice: "€20",
      yearlyPrice: "€13",
      cadence: "/ month",
      yearlyNote: "Billed €156 yearly",
      body: "Everything: generator, verified recipes, planner, pantry, shopping list, nutrition, assistant, saving and sharing.",
      cta: "Go Unlimited",
      variant: "secondary" as const,
      featured: false,
      points: [
        "Unlimited meal generations",
        "Full verified recipe library",
        "Shopping list and pantry matching",
        "Meal planner and saved recipes",
        "PDF, print, and share tools",
        "Priority AI assistant"
      ],
      limits: []
    }
  ];

  return (
    <div className="-m-4 bg-[#fffaf6] px-4 pb-12 pt-2 sm:-m-6 sm:px-6 lg:-m-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <Pill className="border-[#e9c7b7] bg-white px-5 py-2 text-[11px] uppercase tracking-[0.16em]">
              <Sparkles size={13} className="mr-2 text-[#5c4a42]" />
              Pricing
            </Pill>
            <h1 className="mt-6 max-w-3xl [font-family:Georgia,serif] text-[clamp(3.2rem,8vw,6.4rem)] font-normal leading-[0.92] tracking-[-0.045em] text-[#243929]">
              Choose your kitchen operating system.
            </h1>
          </div>
          <p className="max-w-xl text-lg font-semibold leading-8 text-[#5c4a42] lg:justify-self-end">
            Choose how much of Foody Fam you want unlocked. Start simple, plan smarter, or open the full family food system.
          </p>
        </div>

        <section className="rounded-[42px] border border-[#eaded5] bg-white/88 p-4 shadow-[0_28px_80px_rgba(92,74,66,0.1)] sm:p-6 lg:p-8">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5c4a42]/66">Choose your plan</p>
            <div className="inline-flex w-fit rounded-full border border-[#eaded5] bg-[#fffaf6] p-1 shadow-[0_8px_20px_rgba(92,74,66,0.1)]">
              {(["monthly", "yearly"] as const).map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setBillingCycle(cycle)}
                  className={`rounded-full px-5 py-2 text-sm font-black capitalize transition active:scale-[0.98] ${
                    billingCycle === cycle ? "bg-[#405f46] text-white shadow-sm" : "text-[#5c4a42] hover:bg-white"
                  }`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex min-h-[620px] flex-col rounded-[28px] border p-7 ${
                  plan.featured
                    ? "border-[#405f46] bg-[#405f46] text-white shadow-[0_28px_70px_rgba(64,95,70,0.28)]"
                    : "border-[#eaded5] bg-white text-[#243929] shadow-[0_18px_45px_rgba(92,74,66,0.08)]"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-4 right-5 rotate-[12deg] rounded-full border border-[#405f46]/15 bg-[#fffaf6] px-4 py-2 text-xs font-black italic text-[#405f46] shadow-[0_10px_22px_rgba(92,74,66,0.16)]">
                    Most popular
                  </span>
                )}
                <div>
                  <h2 className={`font-display text-3xl font-black ${plan.featured ? "text-white" : "text-[#243929]"}`}>{plan.name}</h2>
                  <div className="mt-8 flex items-end gap-2">
                    <p className={`text-5xl font-black tracking-[-0.04em] ${plan.featured ? "text-white" : "text-[#243929]"}`}>
                      {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    </p>
                    <span className={`pb-2 text-sm font-black ${plan.featured ? "text-white/72" : "text-[#5c4a42]/70"}`}>{plan.cadence}</span>
                  </div>
                  {billingCycle === "yearly" && plan.yearlyNote && (
                    <p className={`mt-2 text-sm font-extrabold ${plan.featured ? "text-white/72" : "text-[#78bea8]"}`}>{plan.yearlyNote}</p>
                  )}
                  <p className={`mt-8 min-h-28 text-base font-extrabold leading-8 ${plan.featured ? "text-white/80" : "text-[#5c4a42]"}`}>{plan.body}</p>
                </div>
                <ul className="mt-7 grid gap-4">
                  {plan.points.map((point) => (
                    <li key={point} className={`flex gap-3 text-base font-bold leading-7 ${plan.featured ? "text-white/90" : "text-[#3d3632]"}`}>
                      <Check className={`mt-1 shrink-0 ${plan.featured ? "text-[#ffccb2]" : "text-[#78bea8]"}`} size={18} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {plan.limits.length > 0 && (
                  <div className={`mt-7 rounded-[20px] p-5 ${plan.featured ? "bg-white/10" : "bg-[#f7efe9]/86"}`}>
                    <p className={`text-xs font-black uppercase tracking-[0.14em] ${plan.featured ? "text-white/68" : "text-[#5c4a42]/70"}`}>Not included</p>
                    <div className="mt-3 grid gap-2.5">
                      {plan.limits.map((limit) => (
                        <p key={limit} className={`flex gap-2 text-sm font-extrabold ${plan.featured ? "text-white/82" : "text-[#5c4a42]"}`}>
                          <X className={`mt-0.5 shrink-0 ${plan.featured ? "text-[#ffccb2]" : "text-[#f59b78]"}`} size={16} />
                          {limit}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                <Link href="/register" className="mt-auto block pt-8">
                  <Button className={`min-h-14 w-full translate-y-0 text-base ${plan.featured ? "border-white/20 bg-white text-[#243929] hover:bg-[#fffaf6]" : "bg-[#fffaf6] text-[#243929]"}`} variant={plan.variant}>
                    {plan.cta}
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[32px] bg-[#405f46] p-6 text-white shadow-[0_26px_60px_rgba(64,95,70,0.24)] sm:p-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/62">Foody Fam plans</p>
            <h2 className="mt-3 [font-family:Georgia,serif] text-3xl font-normal tracking-[-0.03em]">Healthy babies. Happy families. Less stress.</h2>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-white/76">
              Free is for trying the generator, Premium is for weekly AI planning support, and Unlimited unlocks the complete Foody Fam system.
            </p>
          </div>
          <Link href="/register" className="mt-6 block lg:mt-0">
            <Button variant="secondary" className="min-h-14 w-full bg-white px-8 text-[#243929] lg:w-auto">
              Get started
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
function Blog() {
  return (
    <div>
      <PageTitle eyebrow="Guides" title="Baby-safe meal planning answers" />
      <p className="mt-4 max-w-3xl text-lg font-bold leading-8 text-[#5c4a42]">
        Practical Foody Fam guides for AI meal planning, baby-safe dinners, BLW, puree-friendly recipes, allergens, no-sugar desserts, and weekly planning.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {seoGuides.map((guide, index) => (
          <Reveal key={guide.slug} delay={(index % 3) * 0.06}>
            <Link href={`/blog/${guide.slug}`}>
              <Card className="h-full">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78bea8]">Foody Fam guide</p>
                <h2 className="mt-3 [font-family:Georgia,serif] text-2xl font-normal tracking-[-0.025em] text-[#243929]">{guide.title}</h2>
                <p className="mt-3 text-sm font-bold leading-6 text-[#5c4a42]">{guide.description}</p>
              </Card>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="grid gap-6">
      <PageTitle eyebrow="About" title="Built for the dinner rush" />
      <Card className="max-w-4xl">
        <Pill className="mb-5 bg-[#e8f4ef]">Designed around real families</Pill>
        <p className="text-lg font-bold leading-8 text-[#5c4a42]">Foody Fam turns one shared cooking process into safe, age-aware plates for babies, kids, and adults. The product is intentionally centered on reducing duplicate cooking, duplicate planning, and duplicate grocery lists.</p>
      </Card>
    </div>
  );
}

function Contact() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-start">
      <PageTitle eyebrow="Contact" title="Tell us what dinner needs" />
      <Card className="grid gap-4 lg:col-start-2 lg:row-span-2">
        <Pill className="w-fit bg-[#e8f4ef]">Talk to the kitchen team</Pill>
        <Field placeholder="Name" />
        <Field placeholder="Email" />
        <TextArea placeholder="How can we help?" />
        <Button><Mail size={17} /> Send message</Button>
      </Card>
    </div>
  );
}

function PageTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <Pill className="border-[#e9c7b7] bg-white px-5 py-2 text-[11px] uppercase tracking-[0.16em]">{eyebrow}</Pill>
      <h1 className="mt-5 [font-family:Georgia,serif] text-balance text-5xl font-normal leading-[0.95] tracking-[-0.045em] text-[#243929] sm:text-6xl">{title}</h1>
    </div>
  );
}

function SeoCopySection({
  title,
  body,
  links,
  className = ""
}: {
  title: string;
  body: string;
  links: [string, string][];
  className?: string;
}) {
  return (
    <section className={`paper-panel rounded-[30px] p-5 sm:p-6 ${className}`}>
      <div className="relative z-10">
      <h2 className="[font-family:Georgia,serif] text-3xl font-normal tracking-[-0.03em] text-[#243929]">{title}</h2>
      <p className="mt-3 max-w-4xl text-sm font-bold leading-7 text-[#5c4a42]">{body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map(([label, href]) => (
          <Link key={href} href={href}>
            <Pill className="bg-[#e8f4ef] transition hover:bg-[#ffccb2]">{label}</Pill>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
}

function PublicCtaBand({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;
  return (
    <section className={`rounded-[30px] bg-[#405f46] px-6 py-7 text-white shadow-[0_28px_70px_rgba(64,95,70,0.24)] sm:px-9 lg:flex lg:items-center lg:justify-between ${className}`}>
      <div>
        <h2 className="[font-family:Georgia,serif] text-2xl font-normal tracking-[-0.02em] sm:text-3xl">Healthy babies. Happy families. Less stress.</h2>
        <p className="mt-2 text-sm font-bold text-white/78">Foody Fam brings everyone to the table.</p>
      </div>
      <Link href="/register" className="mt-6 block lg:mt-0">
        <Button variant="secondary" className="min-h-14 w-full bg-white px-8 text-[#243929] lg:w-auto">
          Get started - it&apos;s free
        </Button>
      </Link>
    </section>
  );
}

function plannerSlots(day: MealPlanDay) {
  if (day.slots?.length) return day.slots;
  return (["Breakfast", "Lunch", "Dinner"] as MealSlotType[]).map((mealType) => ({
    mealType,
    meal: mealType === "Dinner" ? day.meal : "Choose a meal",
    recipeId: mealType === "Dinner" ? day.recipeId : ""
  }));
}

