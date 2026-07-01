"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarPlus, Check, Clock, Download, Heart, Mail, Plus, Search, Send, ShoppingBasket, Sparkles, Trash2, X } from "lucide-react";
import { SiteShell } from "./layout";
import { Button, Card, Field, Pill, Select, TextArea } from "./ui";
import { GeneratorPanel } from "./generator-panel";
import { RecipeCard } from "./recipe-card";
import { RecipeShowcase } from "./recipe-showcase";
import { babyProfiles as demoBabyProfiles, blogPosts, demoRecipes, pagePhotos } from "@/lib/data";
import { databaseRecipes, databaseRecipeToRecipe } from "@/lib/recipe-database";
import type { BabyProfile, FamilyMember, FamilyPreferences, MealPlanDay, MealSlotType, Recipe, RecipeDatabaseMatch } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { FloatingPhoto, MetricCard, MomentStrip, Reveal } from "./motion";

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
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {type === "pricing" && <Pricing />}
        {type === "blog" && <Blog />}
        {type === "about" && <About />}
        {type === "contact" && <Contact />}
      </main>
    </SiteShell>
  );
}

export function GeneratorPage() {
  return (
    <SiteShell>
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <Card className="h-fit">
          <h1 className="font-display text-3xl font-black">Family setup</h1>
          <div className="mt-5 grid gap-4">
            <Select aria-label="Baby profile">{demoBabyProfiles.map((profile) => <option key={profile.id}>{profile.name} / {profile.age}</option>)}</Select>
            <Select aria-label="Difficulty"><option>Easy</option><option>Medium</option><option>Any</option></Select>
            <Select aria-label="Appliance"><option>Stovetop</option><option>Oven</option><option>Air fryer</option><option>Thermomix</option></Select>
            <Pill className="w-fit bg-[#e8f4ef]">Allergy-aware mode on</Pill>
          </div>
        </Card>
        <div className="grid gap-5">
          <FloatingPhoto src={pagePhotos.generator} title="Ingredient-first dinner ideas" caption="Start with what is already in the kitchen, then let Foody Fam split the meal safely." />
          <GeneratorPanel />
        </div>
      </main>
    </SiteShell>
  );
}

export function RecipesPage() {
  const [query, setQuery] = useState("");
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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Recipe library</p>
            <h1 className="font-display text-5xl font-black">Saved for every age</h1>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-4 top-3.5 text-[#5c4a42]" size={18} />
            <Field className="pl-11" placeholder="Search recipes or tags" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.7fr]">
          <FloatingPhoto src={pagePhotos.recipes} title="Recipe cards with a purpose" caption="Every meal includes the shared base, the baby version, and the adult finish." />
          <Card className="grid content-center gap-4">
            <h2 className="font-display text-3xl font-black">100 verified base recipes</h2>
            <p className="font-bold leading-7 text-[#5c4a42]">AI now starts from structured Foody Fam recipes instead of a blank prompt.</p>
            <div className="flex flex-wrap gap-2">
              {["Breakfast", "Dinner", "BLW", "Freezer friendly", "Chicken", "Vegetarian", "Air fryer"].map((item) => <Pill key={item}>{item}</Pill>)}
            </div>
          </Card>
        </div>
        <Card className="mt-8">
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
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(recipes.length ? recipes : demoRecipes).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} textOnly onOpen={setOpenRecipe} />)}
        </div>
        {openRecipe && <RecipeCloud recipe={openRecipe} onClose={() => setOpenRecipe(null)} />}
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
      <div className="max-h-[94vh] w-full max-w-4xl overflow-hidden rounded-t-[28px] border border-[#e9c7b7] bg-[linear-gradient(145deg,#fffaf6_0%,#f7efe9_55%,#ffccb2_150%)] shadow-[0_30px_90px_rgba(92,74,66,0.28)] sm:rounded-[32px]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-[#e9c7b7]/70 bg-[#fffaf6]/92 p-4 backdrop-blur sm:p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#78bea8]">Recipe cloud</p>
            <h2 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">{recipe.title}</h2>
            <p className="mt-3 max-w-2xl font-bold leading-7 text-[#5c4a42]">{recipe.description || recipe.familyPitch}</p>
          </div>
          <button className="rounded-full bg-white p-3 text-[#5c4a42] shadow-sm transition hover:scale-105" aria-label="Close recipe" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[calc(94vh-132px)] overflow-y-auto p-4 [scrollbar-color:#f59b78_#f7efe9] [scrollbar-width:thin] sm:p-5">

        <div className="mt-5 flex flex-wrap gap-2">
          {recipe.tags.slice(0, 8).map((tag) => <Pill key={tag}>{tag}</Pill>)}
        </div>

        <div className="mt-5 grid gap-3 rounded-[22px] bg-white/78 p-4 shadow-sm md:grid-cols-[1fr_auto_auto_auto] md:items-end">
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
        </div>

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
        </div>
      </div>
    </div>
  );
}

function MiniFact({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[#e9c7b7]/60 bg-white/82 p-4 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#78bea8]">{icon}{label}</p>
      <p className="mt-2 font-display text-xl font-black">{value}</p>
    </div>
  );
}

function CloudSection({ title, items, ordered = false, icon }: { title: string; items: string[]; ordered?: boolean; icon?: React.ReactNode }) {
  const List = ordered ? "ol" : "ul";
  return (
    <div className="rounded-[24px] border border-[#e9c7b7]/50 bg-white/82 p-5 shadow-sm">
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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <PageTitle eyebrow="Weekly meal planner" title="One week, one calmer kitchen" />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">Week</Button>
            <Button variant="ghost">Month</Button>
            <Button variant="secondary">Today</Button>
          </div>
        </div>
        <section className="mt-8 overflow-hidden rounded-[28px] bg-[#242321] p-4 text-white shadow-[0_30px_90px_rgba(31,29,28,0.24)] sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ffccb2]">{weekRange}</p>
              <h2 className="font-display text-3xl font-black">Family meal calendar</h2>
            </div>
            <Pill className="w-fit bg-white/12 text-white">Breakfast / Lunch / Dinner</Pill>
          </div>
          <div className="grid grid-cols-[64px_1fr] overflow-x-auto rounded-[20px] border border-white/10">
            <div className="grid grid-rows-[44px_repeat(3,150px)] border-r border-white/10 bg-black/16 text-xs font-bold text-white/52">
              <div />
              {["8 AM", "Noon", "6 PM"].map((time) => <div key={time} className="border-t border-white/10 p-3">{time}</div>)}
            </div>
            <div className="grid min-w-[860px] grid-cols-7">
              {planner.map((day) => (
                <button
                  key={day.day}
                  type="button"
                  className="border-r border-white/10 text-left last:border-r-0"
                  onClick={() => setOpenDay(day)}
                >
                  <div className="h-11 border-b border-white/10 px-3 py-2">
                    <p className="text-xs font-black text-white/70">{day.day}</p>
                  </div>
                  {plannerSlots(day).map((slot) => {
                    const recipe = plannerRecipes.find((item) => item.id === slot.recipeId);
                    return (
                      <div key={`${day.day}-${slot.mealType}`} className="relative h-[150px] border-b border-white/10 p-3 last:border-b-0">
                        <div className={`h-full rounded-sm p-3 text-left text-[#1f1d1c] shadow-sm ${slotColor(slot.mealType)}`}>
                          <p className="text-xs font-black uppercase tracking-[0.08em]">{slot.mealType}</p>
                          <p className="mt-2 text-sm font-black leading-5">{slot.meal}</p>
                          {recipe && (
                            <ul className="mt-2 grid gap-1 text-[11px] font-bold">
                              {(recipe.ingredientDetails?.map((item) => item.name) || recipe.ingredients).slice(0, 3).map((item) => <li key={item}>• {item}</li>)}
                            </ul>
                          )}
                        </div>
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
      <aside className="absolute bottom-0 right-0 grid max-h-[86vh] w-full gap-4 overflow-auto rounded-t-[28px] border border-[#e9c7b7] bg-[#fffaf6] p-5 shadow-[0_30px_90px_rgba(92,74,66,0.24)] lg:bottom-auto lg:top-0 lg:h-full lg:max-h-none lg:w-[440px] lg:rounded-l-[28px] lg:rounded-tr-none">
        <div className="sticky top-0 z-10 -mx-5 -mt-5 flex items-start justify-between gap-3 border-b border-[#e9c7b7]/70 bg-[#fffaf6]/95 p-5 backdrop-blur">
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
            <div key={`${day.day}-${slot.mealType}`} className="rounded-[22px] border border-[#e9c7b7]/70 bg-white/80 p-4">
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
  if (mealType === "Breakfast") return "bg-[#f6b7e8]";
  if (mealType === "Lunch") return "bg-[#ffc76f]";
  return "bg-[#75c0ef]";
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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <PageTitle eyebrow="Smart shopping list" title="One list for everyone" />
          <Button variant="secondary"><Download size={17} /> Export PDF</Button>
        </div>
        <Card className="mt-8 overflow-hidden !border-[#e9c7b7]/70 !bg-[linear-gradient(145deg,rgba(255,250,246,0.92)_0%,rgba(247,239,233,0.9)_45%,rgba(255,204,178,0.46)_128%)] !p-0 !shadow-[0_28px_80px_rgba(92,74,66,0.14)] backdrop-blur">
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
            <div className="grid gap-2 rounded-[22px] bg-white/72 p-4 text-sm font-extrabold text-[#5c4a42] shadow-sm sm:min-w-56">
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
              <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[18px] border border-white/72 bg-white/72 p-3 shadow-[0_12px_30px_rgba(92,74,66,0.06)]">
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
                  className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#5c4a42] shadow-sm transition hover:-translate-y-0.5 hover:text-[#f59b78]"
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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle eyebrow="Nutrition" title="Tiny details, clear choices" />
        <div className="mt-8"><FloatingPhoto src={pagePhotos.nutrition} title="Nutrition without spreadsheet energy" caption="Protein, iron, fiber, and vitamin signals are shown in plain family language." /></div>
        <div className="mt-8"><NutritionCharts /></div>
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
      <main className="mx-auto grid max-w-5xl gap-5 px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle eyebrow="AI cooking assistant" title="Ask before dinner gets loud" />
        <FloatingPhoto src={pagePhotos.assistant} title="A calm helper in the kitchen" caption="Ingredient swaps, texture checks, leftovers, and allergy-aware answers stay one tap away." />
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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle eyebrow="Profiles" title="Foody Fam remembers everyone" />
        <div className="mt-8"><MomentStrip /></div>
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
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <FloatingPhoto src={pagePhotos.onboarding} title="Set the table once" caption="Seven quick steps teach Foody Fam who eats, what to avoid, and what tools are in the kitchen." />
        <Card className="grid gap-6">
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
  const plans = [
    {
      name: "Free",
      price: "$0",
      body: "Try the Foody Fam workflow with a small, useful starter plan.",
      badge: "Starter",
      cta: "Start free",
      variant: "primary" as const,
      featured: false,
      points: ["3 meal generations", "Basic AI meal result", "Baby/adult split instructions", "Local demo profile setup"],
      limits: ["Limited generation history"]
    },
    {
      name: "Premium",
      price: "$12 / month",
      body: "For families who want planning and AI help, without the full recipe library or shopping list.",
      badge: "Planning",
      cta: "Upgrade to Premium",
      variant: "coral" as const,
      featured: false,
      points: ["14 meal generations per week", "Meal planner access", "Nutrition insights", "AI assistant"],
      limits: ["No recipe library access", "No shopping list"]
    },
    {
      name: "Unlimited",
      price: "$20 / month",
      body: "Everything: generator, verified recipes, planner, pantry, shopping list, nutrition, assistant, saving and sharing.",
      badge: "Everything included",
      cta: "Go Unlimited",
      variant: "coral" as const,
      featured: true,
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
    <div>
      <PageTitle eyebrow="Pricing" title="Simple, fair pricing" />
      <p className="mt-4 max-w-2xl text-lg font-bold leading-8 text-[#5c4a42]">
        Choose how much of Foody Fam you want unlocked. Start simple, plan smarter, or open the full family food system.
      </p>
      <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.featured
                ? "relative flex h-full flex-col overflow-hidden !border-[#f59b78]/75 !bg-[linear-gradient(145deg,#fffaf6_0%,#f7efe9_36%,#ffccb2_102%)] !p-6 !shadow-[0_30px_80px_rgba(245,155,120,0.28)] ring-2 ring-[#f59b78]/22 lg:min-h-[650px] xl:min-h-[680px]"
                : "relative flex h-full flex-col overflow-hidden !bg-white/88 !p-6 !shadow-[0_18px_45px_rgba(92,74,66,0.08)] lg:min-h-[650px] xl:min-h-[680px]"
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Pill className={plan.featured ? "mb-4 bg-[#5c4a42] text-white" : "mb-4 bg-[#e8f4ef]"}>
                  {plan.badge}
                </Pill>
                <h2 className="font-display text-3xl font-black">{plan.name}</h2>
              </div>
              {plan.featured && <Sparkles className="text-[#f59b78]" size={28} />}
            </div>
            <p className={`mt-3 text-3xl font-black ${plan.featured ? "text-[#5c4a42]" : "text-[#f59b78]"}`}>{plan.price}</p>
            <p className="mt-3 min-h-24 text-sm font-extrabold leading-7 text-[#5c4a42]">{plan.body}</p>
            <ul className="mt-6 grid gap-4">
              {plan.points.map((point) => (
                <li key={point} className="flex gap-2 font-bold text-[#3d3632]">
                  <Check className="mt-0.5 shrink-0 text-[#78bea8]" size={18} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            {plan.limits.length > 0 && (
              <div className="mt-7 rounded-[20px] bg-[#f7efe9]/86 p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5c4a42]/70">Not included</p>
                <div className="mt-3 grid gap-2.5">
                  {plan.limits.map((limit) => (
                    <p key={limit} className="flex gap-2 text-sm font-extrabold text-[#5c4a42]">
                      <X className="mt-0.5 shrink-0 text-[#f59b78]" size={16} />
                      {limit}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <Button className={`mt-auto w-full translate-y-0 ${plan.featured ? "min-h-12 shadow-[0_16px_34px_rgba(245,155,120,0.34)]" : "min-h-12"}`} variant={plan.variant}>
              {plan.cta}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Blog() {
  return (
    <div>
      <PageTitle eyebrow="Blog" title="Tiny kitchens, big wins" />
      <div className="mt-8 grid gap-5 md:grid-cols-3">{blogPosts.map((post, index) => <Reveal key={post} delay={index * 0.07}><Card className="overflow-hidden p-0"><Image src={[pagePhotos.blog, pagePhotos.pantry, pagePhotos.planner][index]} alt={post} width={700} height={420} className="h-48 w-full object-cover" /><div className="p-5"><h2 className="font-display text-2xl font-black">{post}</h2><p className="mt-3 text-sm font-bold leading-6 text-[#5c4a42]">Practical guidance for families who want dinner to feel easier, safer, and more repeatable.</p></div></Card></Reveal>)}</div>
    </div>
  );
}

function About() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <PageTitle eyebrow="About" title="Built for the dinner rush" />
      <FloatingPhoto src={pagePhotos.about} title="Designed around real families" caption="The product treats dinner as a workflow, not a recipe archive." />
      <Card className="lg:col-span-2"><p className="text-lg font-bold leading-8 text-[#5c4a42]">Foody Fam turns one shared cooking process into safe, age-aware plates for babies, kids, and adults. The product is intentionally centered on reducing duplicate cooking, duplicate planning, and duplicate grocery lists.</p></Card>
    </div>
  );
}

function Contact() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr]">
      <PageTitle eyebrow="Contact" title="Tell us what dinner needs" />
      <FloatingPhoto src={pagePhotos.contact} title="Talk to the kitchen team" caption="Send feedback, feature ideas, or family meal challenges." />
      <Card className="grid gap-4">
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
    <div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">{eyebrow}</p>
      <h1 className="mt-2 font-display text-balance text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
    </div>
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
