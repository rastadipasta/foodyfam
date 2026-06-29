"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarPlus, Check, Clock, Download, Heart, Mail, Plus, Search, Send, ShoppingBasket, Trash2, X } from "lucide-react";
import { SiteShell } from "./layout";
import { Button, Card, Field, Pill, Select, TextArea } from "./ui";
import { GeneratorPanel } from "./generator-panel";
import { RecipeCard } from "./recipe-card";
import { RecipeShowcase } from "./recipe-showcase";
import { babyProfiles, blogPosts, demoRecipes, familyMembers, pagePhotos } from "@/lib/data";
import { databaseRecipes, databaseRecipeToRecipe } from "@/lib/recipe-database";
import type { Recipe, RecipeDatabaseMatch } from "@/lib/types";
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
            <Select aria-label="Baby profile">{babyProfiles.map((profile) => <option key={profile.id}>{profile.name} · {profile.age}</option>)}</Select>
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

function RecipeCloud({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const planner = useAppStore((state) => state.planner);
  const saveRecipe = useAppStore((state) => state.saveRecipe);
  const savedRecipeIds = useAppStore((state) => state.savedRecipeIds);
  const addRecipeToPlanner = useAppStore((state) => state.addRecipeToPlanner);
  const [selectedDay, setSelectedDay] = useState(planner[0]?.day || "Monday");
  const [plannerMessage, setPlannerMessage] = useState("");
  const saved = savedRecipeIds.includes(recipe.id);

  function addToPlanner() {
    addRecipeToPlanner(selectedDay, recipe);
    setPlannerMessage(`Added to ${selectedDay}`);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#5c4a42]/30 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[32px] border border-[#e9c7b7] bg-[linear-gradient(145deg,#fffaf6_0%,#f7efe9_55%,#ffccb2_150%)] p-5 shadow-[0_30px_90px_rgba(92,74,66,0.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#78bea8]">Recipe cloud</p>
            <h2 className="mt-2 font-display text-4xl font-black leading-tight">{recipe.title}</h2>
            <p className="mt-3 max-w-2xl font-bold leading-7 text-[#5c4a42]">{recipe.description || recipe.familyPitch}</p>
          </div>
          <button className="rounded-full bg-white p-3 text-[#5c4a42] shadow-sm transition hover:scale-105" aria-label="Close recipe" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {recipe.tags.slice(0, 8).map((tag) => <Pill key={tag}>{tag}</Pill>)}
        </div>

        <div className="mt-5 grid gap-3 rounded-[24px] bg-white/78 p-4 shadow-sm md:grid-cols-[1fr_auto_auto] md:items-end">
          <FilterField label="Add to meal planner">
            <Select aria-label="Planner day" value={selectedDay} onChange={(event) => setSelectedDay(event.target.value)}>
              {planner.map((day) => <option key={day.day}>{day.day}</option>)}
            </Select>
          </FilterField>
          <Button variant="secondary" onClick={() => saveRecipe(recipe.id)}>
            <Heart size={17} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button onClick={addToPlanner}>
            <CalendarPlus size={17} />
            Add to planner
          </Button>
          {plannerMessage && <p className="text-sm font-extrabold text-[#78bea8] md:col-span-3">{plannerMessage}</p>}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <MiniFact icon={<Clock size={16} />} label="Time" value={recipe.time} />
          <MiniFact label="Difficulty" value={recipe.difficulty} />
          <MiniFact label="Servings" value={`${recipe.servings}`} />
          <MiniFact label="Calories" value={`${recipe.nutrition.calories}`} />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <CloudSection title="Ingredients" items={recipe.ingredients} />
          <CloudSection title="Cooking steps" items={recipe.cookingSteps?.length ? recipe.cookingSteps : recipe.steps} ordered />
          <CloudSection title="Baby version" items={recipe.babyVersion?.length ? recipe.babyVersion : recipe.baby} />
          <CloudSection title="Adult finish" items={recipe.adultVersion?.length ? recipe.adultVersion : recipe.adults} />
          <CloudSection title="Shopping list" items={(recipe.shoppingList || []).flatMap((group) => group.items.map((item) => `${group.category}: ${item}`))} icon={<ShoppingBasket size={15} />} />
          <CloudSection title="Safety notes" items={recipe.safetyNotes || recipe.allergyWarnings || ["Review allergens and texture before serving."]} />
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
            {item}
          </li>
        ))}
      </List>
    </div>
  );
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
  const setPlannerMeal = useAppStore((state) => state.setPlannerMeal);
  const plannerRecipes = recipes.length ? recipes : demoRecipes;
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle eyebrow="Weekly meal planner" title="One week, one calmer kitchen" />
        <div className="mt-8"><FloatingPhoto src={pagePhotos.planner} title="Drag the week into shape" caption="Swap meals by day and keep the family grocery list aligned automatically." /></div>
        <div className="mt-8 grid gap-4 lg:grid-cols-7">
          {planner.map((day) => (
            <Card key={day.day} className="grid content-between gap-4">
              <div>
                <p className="font-display text-xl font-black">{day.day}</p>
                <p className="mt-2 text-sm font-bold text-[#5c4a42]">{day.meal}</p>
              </div>
              <Select aria-label={`Choose meal for ${day.day}`} value={day.recipeId} onChange={(event) => setPlannerMeal(day.day, event.target.value)}>
                {plannerRecipes.map((recipe) => <option key={recipe.id} value={recipe.id}>{recipe.title}</option>)}
              </Select>
            </Card>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}

export function ShoppingPage() {
  const shopping = useAppStore((state) => state.shopping);
  const toggleShoppingItem = useAppStore((state) => state.toggleShoppingItem);
  const categories = Array.from(new Set(shopping.map((item) => item.category)));
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <PageTitle eyebrow="Smart shopping list" title="One list for everyone" />
          <Button variant="secondary"><Download size={17} /> Export PDF</Button>
        </div>
        <div className="mt-8"><FloatingPhoto src={pagePhotos.shopping} title="Market-ready family list" caption="Categories stay clear so the weekly shop is fast, calm, and easy to share." /></div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Card key={category}>
              <h2 className="font-display text-2xl font-black">{category}</h2>
              <div className="mt-4 grid gap-3">
                {shopping.filter((item) => item.category === category).map((item) => (
                  <button key={item.id} className="flex items-center gap-3 text-left font-bold" onClick={() => toggleShoppingItem(item.id)}>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${item.checked ? "border-[#78bea8] bg-[#78bea8] text-white" : "border-[#e9c7b7]"}`}>
                      {item.checked && <Check size={14} />}
                    </span>
                    <span className={item.checked ? "text-[#5c4a42]/55 line-through" : ""}>{item.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          ))}
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
          <div className="flex gap-3">
            <Field placeholder="Can I replace broccoli? Can I freeze this?" value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void send(); }} />
            <Button onClick={() => void send()}><Send size={17} /> Send</Button>
          </div>
        </Card>
      </main>
    </SiteShell>
  );
}

export function ProfilesPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle eyebrow="Profiles" title="Foody Fam remembers everyone" />
        <div className="mt-8"><MomentStrip /></div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card>
            <h2 className="font-display text-2xl font-black">Baby profiles</h2>
            <div className="mt-4 grid gap-3">{babyProfiles.map((profile) => <Pill key={profile.id} className="w-fit">{profile.name} · {profile.age} · {profile.style} · {profile.allergies.join(", ") || "No allergies"}</Pill>)}</div>
          </Card>
          <Card>
            <h2 className="font-display text-2xl font-black">Family profiles</h2>
            <div className="mt-4 grid gap-3">{familyMembers.map((member) => <Pill key={member.id} className="w-fit">{member.name} · {member.role} · {member.preferences.join(", ")}</Pill>)}</div>
          </Card>
        </div>
      </main>
    </SiteShell>
  );
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
  return (
    <div>
      <PageTitle eyebrow="Pricing" title="Simple, fair pricing" />
      <div className="mt-8"><FloatingPhoto src={pagePhotos.pricing} title="Start small, grow into premium" caption="The free plan proves the one-meal workflow before families unlock weekly automation." /></div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {[
          ["Free", "$0", ["5 recipes per week", "Basic recipes", "Shopping lists", "Nutrition info"]],
          ["Premium", "$6.99 / month", ["Unlimited recipes", "Meal planner", "PDF export", "Priority support"]]
        ].map(([name, price, points]) => (
          <Card key={name as string}>
            <h2 className="font-display text-3xl font-black">{name as string}</h2>
            <p className="mt-2 text-2xl font-black text-[#f59b78]">{price as string}</p>
            <ul className="mt-5 grid gap-3">{(points as string[]).map((point) => <li key={point} className="flex gap-2 font-bold"><Check className="text-[#78bea8]" size={18} />{point}</li>)}</ul>
            <Button className="mt-6 w-full" variant={name === "Premium" ? "coral" : "primary"}>{name === "Premium" ? "Start free trial" : "Get started"}</Button>
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
