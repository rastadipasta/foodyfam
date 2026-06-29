"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Baby,
  Check,
  Clock,
  Copy,
  Loader2,
  Printer,
  Save,
  Share2,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Utensils
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Card, Field, Pill, Select } from "./ui";
import type { Recipe } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

const generatorSchema = z.object({
  ingredients: z.string().min(2, "Add at least one ingredient"),
  pantryItems: z.string().optional(),
  babyProfile: z.string().min(1),
  babyAge: z.string().min(1),
  babyTexture: z.string().min(1),
  feedingStyle: z.string().min(1),
  allergies: z.string().optional(),
  avoidIngredients: z.string().optional(),
  servings: z.string().min(1),
  mealType: z.string().min(1),
  cuisine: z.string().min(1),
  cookingTime: z.string().min(1),
  diet: z.string().min(1),
  appliances: z.string().min(1),
  skillLevel: z.string().min(1),
  goal: z.string().optional()
});

type GeneratorForm = z.infer<typeof generatorSchema>;

const chips = ["Chicken", "Rice", "Eggs", "Spinach", "Pasta", "Broccoli", "Carrots", "Lentils"];
const loadingStages = ["Checking allergies", "Splitting baby portion", "Building shopping list", "Writing family instructions"];
const resultTabs = ["Overview", "Baby", "Adults", "Shopping", "Safety"] as const;

export function GeneratorPanel({ onResult }: { onResult?: (recipe: Recipe) => void }) {
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof resultTabs)[number]>("Overview");
  const [saved, setSaved] = useState(false);
  const upsertRecipe = useAppStore((state) => state.upsertRecipe);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<GeneratorForm>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      ingredients: "Chicken, broccoli, rice, carrots",
      pantryItems: "Eggs, milk, rice, olive oil",
      babyProfile: "Emma",
      babyAge: "6-8 months",
      babyTexture: "Soft mashed",
      feedingStyle: "Mixed",
      allergies: "Egg allergy",
      avoidIngredients: "Honey, whole nuts, added salt",
      servings: "4",
      mealType: "Dinner",
      cuisine: "Italian",
      cookingTime: "25 min or less",
      diet: "No egg",
      appliances: "Stovetop",
      skillLevel: "Easy",
      goal: "Cook once for baby and adults with leftovers for lunch."
    }
  });

  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(() => {
      setStage((value) => (value + 1) % loadingStages.length);
    }, 850);
    return () => window.clearInterval(timer);
  }, [loading]);

  async function submit(values: GeneratorForm) {
    setLoading(true);
    setStage(0);
    setSaved(false);
    try {
      const response = await fetch("/api/ai/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = (await response.json()) as { recipe: Recipe };
      setResult(data.recipe);
      setActiveTab("Overview");
      onResult?.(data.recipe);
    } finally {
      setLoading(false);
    }
  }

  function addChip(chip: string) {
    const current = getValues("ingredients");
    if (!current.toLowerCase().includes(chip.toLowerCase())) {
      setValue("ingredients", current ? `${current}, ${chip}` : chip);
    }
  }

  function saveResult() {
    if (!result) return;
    upsertRecipe(result, true);
    setSaved(true);
  }

  async function shareResult() {
    if (!result) return;
    const shareText = `${result.title}\n\n${result.description || result.familyPitch || "Foody Fam recipe"}`;
    if (navigator.share) {
      await navigator.share({ title: result.title, text: shareText }).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(shareText).catch(() => undefined);
  }

  return (
    <Card className="grid gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#78bea8]">AI Recipe Generator</p>
          <h2 className="font-display text-3xl font-black text-[#1f1d1c]">What do you have today?</h2>
          <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-[#5c4a42]">
            Build one family recipe with a baby-safe portion, adult finish, shopping list, storage notes, and allergy-aware guidance.
          </p>
        </div>
        <Pill className="w-fit bg-[#e8f4ef]">
          <ShieldCheck size={14} className="mr-1 text-[#78bea8]" />
          One meal, whole family
        </Pill>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit(submit)}>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#5c4a42]">Ingredients</label>
            <Field aria-label="Ingredients" {...register("ingredients")} />
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button key={chip} type="button" onClick={() => addChip(chip)}>
                  <Pill className="transition hover:bg-[#ffccb2]">{chip}</Pill>
                </button>
              ))}
            </div>
            {errors.ingredients && <p className="mt-2 text-xs font-bold text-[#d85f4c]">{errors.ingredients.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#5c4a42]">Pantry items</label>
            <Field aria-label="Pantry items" {...register("pantryItems")} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select aria-label="Baby profile" {...register("babyProfile")}>
            <option>Emma</option>
            <option>Noah</option>
            <option>New baby</option>
          </Select>
          <Select aria-label="Baby age" {...register("babyAge")}>
            <option>6-8 months</option>
            <option>9-12 months</option>
            <option>12-18 months</option>
            <option>2+ years</option>
          </Select>
          <Select aria-label="Baby texture" {...register("babyTexture")}>
            <option>Soft mashed</option>
            <option>Smooth puree</option>
            <option>Finger-food strips</option>
            <option>Toddler bites</option>
          </Select>
          <Select aria-label="Feeding style" {...register("feedingStyle")}>
            <option>Mixed</option>
            <option>Puree</option>
            <option>BLW</option>
          </Select>
          <Select aria-label="Servings" {...register("servings")}>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </Select>
          <Select aria-label="Meal type" {...register("mealType")}>
            <option>Dinner</option>
            <option>Lunch</option>
            <option>Breakfast</option>
            <option>Batch prep</option>
          </Select>
          <Select aria-label="Cuisine" {...register("cuisine")}>
            <option>Italian</option>
            <option>Mediterranean</option>
            <option>Asian inspired</option>
            <option>Vegetarian</option>
          </Select>
          <Select aria-label="Cooking time" {...register("cookingTime")}>
            <option>25 min or less</option>
            <option>35 min or less</option>
            <option>Batch cooking</option>
          </Select>
          <Select aria-label="Diet" {...register("diet")}>
            <option>No egg</option>
            <option>Vegetarian</option>
            <option>Dairy free</option>
            <option>Gluten free</option>
            <option>No restrictions</option>
          </Select>
          <Select aria-label="Appliances" {...register("appliances")}>
            <option>Stovetop</option>
            <option>Oven</option>
            <option>Air fryer</option>
            <option>Instant Pot</option>
            <option>Thermomix</option>
          </Select>
          <Select aria-label="Skill level" {...register("skillLevel")}>
            <option>Easy</option>
            <option>Confident home cook</option>
            <option>Minimal prep</option>
          </Select>
          <Field aria-label="Allergies" placeholder="Allergies" {...register("allergies")} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field aria-label="Avoid ingredients" placeholder="Avoid ingredients" {...register("avoidIngredients")} />
          <Field aria-label="Recipe goal" placeholder="Recipe goal" {...register("goal")} />
        </div>

        <Button type="submit" disabled={loading} className="w-full lg:w-fit">
          {loading ? <Loader2 className="animate-spin" size={17} /> : <Sparkles size={17} />}
          {loading ? loadingStages[stage] : "Generate family recipe"}
        </Button>
      </form>

      {loading && <PremiumLoader stage={stage} />}
      {result && !loading && (
        <RecipeResult
          recipe={result}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          saved={saved}
          onSave={saveResult}
          onShare={() => void shareResult()}
        />
      )}
    </Card>
  );
}

function PremiumLoader({ stage }: { stage: number }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e9c7b7] bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#78bea8]/15 text-[#78bea8]">
          <Loader2 className="animate-spin" size={22} />
        </span>
        <div>
          <p className="font-display text-xl font-black text-[#1f1d1c]">{loadingStages[stage]}...</p>
          <p className="text-sm font-bold text-[#5c4a42]">Foody Fam is building one cooking path with safe baby and adult finishes.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-4">
        {loadingStages.map((item, index) => (
          <div key={item} className="rounded-full bg-[#f7efe9] p-1">
            <div className={`h-2 rounded-full transition-all ${index <= stage ? "bg-[#78bea8]" : "bg-transparent"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecipeResult({
  recipe,
  activeTab,
  setActiveTab,
  saved,
  onSave,
  onShare
}: {
  recipe: Recipe;
  activeTab: (typeof resultTabs)[number];
  setActiveTab: (tab: (typeof resultTabs)[number]) => void;
  saved: boolean;
  onSave: () => void;
  onShare: () => void;
}) {
  const babyItems = recipe.babyVersion?.length ? recipe.babyVersion : recipe.baby;
  const adultItems = recipe.adultVersion?.length ? recipe.adultVersion : recipe.adults;
  const cookingSteps = recipe.cookingSteps?.length ? recipe.cookingSteps : recipe.steps;
  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <div className="grid gap-5 rounded-[26px] bg-white p-5 shadow-[0_18px_45px_rgba(92,74,66,0.08)]">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
          <h3 className="mt-4 font-display text-4xl font-black leading-tight">{recipe.title}</h3>
          <p className="mt-3 text-base font-bold leading-7 text-[#5c4a42]">
            {recipe.description || recipe.familyPitch || "A family recipe adapted for baby and adults."}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <ResultMetric icon={<Clock size={17} />} label="Time" value={recipe.time} />
            <ResultMetric icon={<Utensils size={17} />} label="Difficulty" value={recipe.difficulty} />
            <ResultMetric icon={<Baby size={17} />} label="Texture" value={recipe.babyTexture || "Baby-safe"} />
            <ResultMetric icon={<ShoppingBasket size={17} />} label="Servings" value={`${recipe.servings}`} />
          </div>
        </div>
        <div className="rounded-[24px] bg-[#f7efe9] p-5">
          <p className="font-display text-xl font-black">Why this works for your family</p>
          <ul className="mt-4 grid gap-3 text-sm font-bold leading-6 text-[#5c4a42]">
            {(recipe.whyItWorks?.length ? recipe.whyItWorks : [recipe.familyPitch || "One cooking base splits into baby and adult plates."]).map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 shrink-0 text-[#78bea8]" size={17} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {resultTabs.map((tab) => (
          <Button key={tab} type="button" variant={activeTab === tab ? "primary" : "secondary"} onClick={() => setActiveTab(tab)}>
            {tab}
          </Button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <StepCard title="Prep steps" items={recipe.prepSteps?.length ? recipe.prepSteps : recipe.steps.slice(0, 2)} />
          <StepCard title="Cooking steps" items={cookingSteps} />
          <StepCard title="Storage" items={recipe.storage || ["Cool quickly and refrigerate leftovers."]} />
          <StepCard title="Leftovers" items={recipe.leftovers || ["Use leftovers for lunch bowls."]} />
        </div>
      )}

      {activeTab === "Baby" && <StepCard title="Baby version" items={babyItems} accent="mint" />}
      {activeTab === "Adults" && <StepCard title="Adult version" items={adultItems} accent="coral" />}
      {activeTab === "Shopping" && (
        <div className="grid gap-4 md:grid-cols-3">
          {(recipe.shoppingList || [{ category: "Ingredients", items: recipe.ingredients }]).map((group) => (
            <div key={group.category} className="rounded-[22px] bg-[#f7efe9] p-4">
              <p className="font-display text-lg font-black">{group.category}</p>
              <ul className="mt-3 grid gap-2 text-sm font-bold text-[#5c4a42]">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2"><ShoppingBasket size={15} className="text-[#78bea8]" />{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {activeTab === "Safety" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <StepCard title="Safety notes" items={recipe.safetyNotes || ["Check texture and temperature before serving."]} />
          <StepCard title="Allergy warnings" items={recipe.allergyWarnings || ["Review family allergies before serving."]} accent="coral" />
          <StepCard title="Nutrition summary" items={recipe.nutritionSummary || [`Protein ${recipe.nutrition.protein}%`, `Iron ${recipe.nutrition.iron}`]} />
        </div>
      )}

      <div className="flex flex-wrap gap-3 border-t border-[#5c4a42]/10 pt-5">
        <Button type="button" onClick={onSave}>
          {saved ? <Check size={17} /> : <Save size={17} />}
          {saved ? "Saved" : "Save recipe"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.print()}>
          <Printer size={17} />
          Print
        </Button>
        <Button type="button" variant="secondary" onClick={onShare}>
          {canNativeShare ? <Share2 size={17} /> : <Copy size={17} />}
          Share
        </Button>
      </div>
    </div>
  );
}

function ResultMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[#f7efe9] p-3">
      <div className="text-[#78bea8]">{icon}</div>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#5c4a42]">{label}</p>
      <p className="mt-1 font-display text-lg font-black">{value}</p>
    </div>
  );
}

function StepCard({ title, items, accent }: { title: string; items: string[]; accent?: "mint" | "coral" }) {
  return (
    <div className={`rounded-[22px] p-5 ${accent === "coral" ? "bg-[#ffccb2]/65" : accent === "mint" ? "bg-[#e8f4ef]" : "bg-[#f7efe9]"}`}>
      <p className="font-display text-xl font-black">{title}</p>
      <ol className="mt-4 grid gap-3 text-sm font-bold leading-6 text-[#5c4a42]">
        {items.map((item, index) => (
          <li key={`${title}-${item}`} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-[#78bea8]">{index + 1}</span>
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}
