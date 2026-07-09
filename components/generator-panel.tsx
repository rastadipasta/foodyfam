"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Baby,
  Check,
  Clock,
  Copy,
  Printer,
  Save,
  Share2,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Utensils,
  UtensilsCrossed,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button, Card, Field, GlassActionDock, KitchenLedger, LiquidGlassPanel, Pill, RecipeTicket, Select } from "./ui";
import { cn } from "@/lib/utils";
import { buildGeneratorPreflight } from "@/lib/family-recipe-intelligence";
import { normalizeRecipeFlow } from "@/lib/recipe-flow";
import type { GeneratorPreflight, Recipe } from "@/lib/types";
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
const resultTabs = ["Overview", "Shopping", "Safety"] as const;
const fallbackRecipeImage = "/brand/generated/hero-family-meal.png";
const maxPersistedImageLength = 750_000;
const smartChips = [
  { label: "Use profile pantry", icon: ShoppingBasket, values: { ingredients: "Eggs, milk, rice, olive oil", pantryItems: "Eggs, milk, rice, olive oil" } },
  { label: "Iron-rich dinner", icon: Utensils, values: { ingredients: "Beef, lentils, spinach, tomato", mealType: "Dinner", goal: "Build an iron-rich family dinner with a baby-safe portion." } },
  { label: "BLW-friendly", icon: Baby, values: { feedingStyle: "BLW", babyTexture: "Finger foods", ingredients: "Salmon, potato, zucchini, avocado" } },
  { label: "Puree-friendly", icon: ShieldCheck, values: { feedingStyle: "Puree", babyTexture: "Smooth puree", ingredients: "Carrot, lentils, rice, olive oil" } },
  { label: "Under 30 min", icon: Clock, values: { cookingTime: "25 min or less", skillLevel: "Easy" } },
  { label: "Use leftovers", icon: Sparkles, values: { goal: "Cook once for baby and adults with leftovers for lunch.", mealType: "Dinner" } }
] as const;

export function GeneratorPanel({
  onResult,
  showLatestResult = false,
  variant = "default"
}: {
  onResult?: (recipe: Recipe) => void;
  showLatestResult?: boolean;
  variant?: "default" | "homepage";
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof resultTabs)[number]>("Overview");
  const [saved, setSaved] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shoppingMessage, setShoppingMessage] = useState("");
  const [shouldScrollToResult, setShouldScrollToResult] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const upsertRecipe = useAppStore((state) => state.upsertRecipe);
  const addGeneratedRecipe = useAppStore((state) => state.addGeneratedRecipe);
  const addRecipeToShoppingList = useAppStore((state) => state.addRecipeToShoppingList);
  const generatedRecipes = useAppStore((state) => state.generatedRecipes);
  const babyProfiles = useAppStore((state) => state.babyProfiles);
  const preferences = useAppStore((state) => state.familyPreferences);
  const subscriptionStatus = useAppStore((state) => state.settingsPreferences.subscriptionStatus);
  const primaryBaby = babyProfiles[0];
  const defaultValues = buildDefaultGeneratorValues(primaryBaby, preferences);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors }
  } = useForm<GeneratorForm>({
    resolver: zodResolver(generatorSchema),
    defaultValues
  });
  const [ingredientsValue, setIngredientsValue] = useState(defaultValues.ingredients);
  const ingredientsRegister = register("ingredients");
  const watchedValues = useWatch({ control });
  const visiblePreflightInput = { ...watchedValues, avoidIngredients: "" };
  const preflight = buildGeneratorPreflight(visiblePreflightInput);

  useEffect(() => {
    const latestBaby = babyProfiles[0];
    if (latestBaby) {
      setValue("babyProfile", latestBaby.name);
      setValue("babyAge", latestBaby.age);
      setValue("feedingStyle", latestBaby.style);
      setValue("babyTexture", latestBaby.style === "Puree" ? "Smooth puree" : latestBaby.style === "BLW" ? "Finger foods" : "Soft mashed");
    }
    setValue("allergies", preferences.allergies.length ? `${preferences.allergies.join(", ")} allergy` : latestBaby?.allergies.join(", ") || "");
    setValue("cuisine", preferences.favoriteCuisines[0] || "Any");
    setValue("diet", preferences.dietPreferences[0] || "None");
    setValue("appliances", preferences.appliances[0] || "Any");
    setValue("goal", preferences.cookingGoals[0] || "Cook once for baby and adults with leftovers for lunch.");
  }, [babyProfiles, preferences, setValue]);

  const rawCurrentResult = result ?? (showLatestResult ? generatedRecipes[0] ?? null : null);
  const currentResult = rawCurrentResult ? normalizeRecipeFlow(rawCurrentResult) : null;

  async function submit(values: GeneratorForm) {
    setLoading(true);
    setSaved(false);
    try {
      const response = await fetch("/api/ai/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, subscriptionStatus })
      });
      const data = (await response.json()) as { recipe: Recipe; preflight?: GeneratorPreflight };
      const normalizedRecipe = normalizeRecipeFlow(data.recipe);
      setResult(normalizedRecipe);
      setShouldScrollToResult(true);
      addGeneratedRecipe(createPersistableRecipe(normalizedRecipe));
      setActiveTab("Overview");
      setShoppingMessage("");
      onResult?.(normalizedRecipe);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!shouldScrollToResult || loading || !currentResult) return;
    const timeout = window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setShouldScrollToResult(false);
    }, 120);
    return () => window.clearTimeout(timeout);
  }, [currentResult, loading, shouldScrollToResult]);

  function clearIngredients() {
    setValue("ingredients", "", { shouldDirty: true, shouldValidate: true });
    setIngredientsValue("");
  }

  function addChip(chip: string) {
    const current = getValues("ingredients");
    if (!current.toLowerCase().includes(chip.toLowerCase())) {
      const next = current ? `${current}, ${chip}` : chip;
      setValue("ingredients", next, { shouldDirty: true, shouldValidate: true });
      setIngredientsValue(next);
    }
  }

  function applySmartChip(values: Partial<GeneratorForm>) {
    for (const [key, value] of Object.entries(values) as [keyof GeneratorForm, string][]) {
      setValue(key, value, { shouldDirty: true, shouldValidate: true });
      if (key === "ingredients") setIngredientsValue(value);
    }
  }

  function saveResult() {
    if (!currentResult) return;
    upsertRecipe(createPersistableRecipe(currentResult), true);
    setSaved(true);
  }

  function addResultToShoppingList() {
    if (!currentResult) return;
    addRecipeToShoppingList(currentResult);
    setShoppingMessage("Shopping list updated");
  }

  async function shareResult() {
    if (!currentResult) return;
    const shareText = `${currentResult.title}\n\n${currentResult.description || currentResult.familyPitch || "Foody Fam recipe"}`;
    if (navigator.share) {
      await navigator.share({ title: currentResult.title, text: shareText }).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(shareText).catch(() => undefined);
  }

  const controlClassName = "min-h-14 rounded-[14px] border-[#eaded5] bg-white px-4 text-sm font-extrabold text-[#2f2926] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_10px_24px_rgba(92,74,66,0.045)] focus:border-[#78bea8] focus:ring-[#78bea8]/18";

  return (
    <Card
      className={cn(
        "generator-shell grid gap-6 overflow-hidden border-[#eaded5] !bg-white/94 !p-5 shadow-[0_26px_70px_rgba(92,74,66,0.12)] sm:!p-8 lg:!p-10",
        variant === "homepage"
          ? "!rounded-[34px] lg:!rounded-[40px]"
          : "!rounded-[34px] lg:!rounded-[40px]"
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#7bbca8]">AI Recipe Generator</span>
          <h2 className="mt-3 [font-family:Georgia,serif] text-4xl font-normal leading-[1.02] tracking-[-0.035em] text-[#2b2826] sm:text-5xl">What do you have today?</h2>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#5c4a42]">
            Build one family recipe with a baby-safe portion, adult finish, shopping list, storage notes, and allergy-aware guidance.
          </p>
        </div>
        <Pill className="w-fit border-[#dce9e3] bg-[#edf6f2] px-4 py-2 text-sm shadow-[0_10px_26px_rgba(92,74,66,0.06)]">
          <ShieldCheck size={14} className="mr-1 text-[#78bea8]" />
          One meal, whole family
        </Pill>
      </div>

      <form className="grid gap-5 sm:gap-6" onSubmit={handleSubmit(submit)}>
        <div className="grid gap-4">
          <div>
            <label className="sr-only">Ingredients</label>
            <div className="relative">
              <Field
                aria-label="Ingredients"
                placeholder="Add an ingredient (e.g., chicken, rice, spinach...)"
                className="min-h-16 rounded-[18px] border-[#eaded5] bg-white px-5 pr-12 text-base font-semibold text-[#2f2926] shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_16px_40px_rgba(92,74,66,0.06)] placeholder:text-[#5c4a42]/42 focus:border-[#78bea8] focus:ring-[#78bea8]/15"
                {...ingredientsRegister}
                onChange={(event) => {
                  void ingredientsRegister.onChange(event);
                  setIngredientsValue(event.target.value);
                }}
              />
              {ingredientsValue && (
                <button
                  type="button"
                  aria-label="Clear ingredients"
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-[#eaded5] bg-[#fffaf6] text-[#5c4a42] shadow-sm transition hover:bg-[#ffccb2] active:scale-95"
                  onClick={clearIngredients}
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {chips.map((chip) => (
                <button key={chip} type="button" onClick={() => addChip(chip)}>
                  <Pill className="border-[#eaded5] bg-white px-4 py-2 text-sm shadow-[0_8px_18px_rgba(92,74,66,0.06)] transition hover:-translate-y-0.5 hover:bg-[#ffccb2]">{chip}</Pill>
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {smartChips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <button key={chip.label} type="button" onClick={() => applySmartChip(chip.values)}>
                    <Pill className="gap-2 border-[#e9e2dc] bg-[#f8f6f2] px-4 py-2 text-sm shadow-none transition hover:-translate-y-0.5 hover:bg-[#e8f4ef]">
                      <Icon size={15} className="text-[#6f8b80]" />
                      {chip.label}
                    </Pill>
                  </button>
                );
              })}
            </div>
            {errors.ingredients && <p className="mt-2 text-xs font-bold text-[#d85f4c]">{errors.ingredients.message}</p>}
          </div>
        </div>

        <div className="hidden">
          <input type="hidden" {...register("pantryItems")} />
          <input type="hidden" {...register("babyTexture")} />
          <input type="hidden" {...register("feedingStyle")} />
          <input type="hidden" {...register("cookingTime")} />
          <input type="hidden" {...register("diet")} />
          <input type="hidden" {...register("appliances")} />
          <input type="hidden" {...register("skillLevel")} />
          <input type="hidden" {...register("avoidIngredients")} />
          <input type="hidden" {...register("goal")} />
          <input type="hidden" {...register("mealType")} />
          <input type="hidden" {...register("cuisine")} />
        </div>

        <div className="overflow-hidden rounded-[22px] border border-[#eaded5] bg-[linear-gradient(180deg,#fbfaf6_0%,#fff_100%)] shadow-[0_18px_44px_rgba(92,74,66,0.07)]">
          <SafetyWarnings preflight={preflight} />
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3 lg:p-6">
          <FormBoxLabel label="Baby profile">
            <Select aria-label="Baby profile" className={controlClassName} {...register("babyProfile")}>
              <option>Any</option>
              {babyProfiles.map((profile) => <option key={profile.id}>{profile.name}</option>)}
              <option>New baby</option>
            </Select>
          </FormBoxLabel>
          <FormBoxLabel label="Baby age">
            <Select aria-label="Baby age" className={controlClassName} {...register("babyAge")}>
              <option>Any</option>
              <option>Select age</option>
              <option>6–8 months</option>
              <option>6-8 months</option>
              <option>8–10 months</option>
              <option>10–12 months</option>
              <option>9-12 months</option>
              <option>12-18 months</option>
              <option>2+ years</option>
            </Select>
          </FormBoxLabel>
          <FormBoxLabel label="Servings">
            <Select aria-label="Servings" className={controlClassName} {...register("servings")}>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
            </Select>
          </FormBoxLabel>
          <FormBoxLabel label="Allergies" className="sm:col-span-2 lg:col-span-3">
            <Field aria-label="Allergies" placeholder="No known allergies" className={controlClassName} {...register("allergies")} />
          </FormBoxLabel>
          </div>
        </div>

        <GlassActionDock className="generator-action-dock border-[#eaded5] bg-white p-4 shadow-[0_16px_38px_rgba(92,74,66,0.06)]">
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full min-w-[242px] gap-2 bg-[linear-gradient(90deg,#405f46_0%,#78bea8_100%)] px-7 py-0 text-sm text-white shadow-[0_12px_28px_rgba(64,95,70,0.24),inset_0_1px_0_rgba(255,255,255,0.28)] hover:bg-[linear-gradient(90deg,#314b37_0%,#69ad98_100%)] hover:shadow-[0_17px_34px_rgba(64,95,70,0.3)] lg:w-fit"
          >
            <UtensilsCrossed size={18} strokeWidth={1.8} />
            {loading ? "Cooking..." : "Generate family recipe"}
          </Button>
        </GlassActionDock>
      </form>

      {loading && <SmartGeneratorLoader />}
      {currentResult && !loading && (
        <div ref={resultRef} className="scroll-mt-24">
          <RecipeResult
            recipe={currentResult}
            showImage={subscriptionStatus !== "Free"}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            saved={saved}
            onSave={saveResult}
            onAddToShoppingList={addResultToShoppingList}
            onShare={() => void shareResult()}
            historyOpen={historyOpen}
            onToggleHistory={() => setHistoryOpen((open) => !open)}
            generatedRecipes={generatedRecipes}
            onSelectHistory={(recipe) => {
              setResult(normalizeRecipeFlow(recipe));
              setActiveTab("Overview");
              setSaved(false);
              setShoppingMessage("");
              setHistoryOpen(false);
            }}
            shoppingMessage={shoppingMessage}
          />
        </div>
      )}
    </Card>
  );
}

function FormBoxLabel({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("grid gap-3", className)}>
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#6d5950]">{label}</span>
      {children}
    </label>
  );
}

function buildDefaultGeneratorValues(
  primaryBaby: { name: string; age: string; style: "Puree" | "BLW" | "Mixed"; allergies: string[] } | undefined,
  preferences: {
    allergies: string[];
    dietPreferences: string[];
    favoriteCuisines: string[];
    appliances: string[];
    cookingGoals: string[];
  }
): GeneratorForm {
  return {
    ingredients: "Chicken, broccoli, rice, carrots",
    pantryItems: "Eggs, milk, rice, olive oil",
    babyProfile: primaryBaby?.name || "Any",
    babyAge: primaryBaby?.age || "6-8 months",
    babyTexture: primaryBaby?.style === "Puree" ? "Smooth puree" : primaryBaby?.style === "BLW" ? "Finger foods" : "Soft mashed",
    feedingStyle: primaryBaby?.style || "Mixed",
    allergies: preferences.allergies.length ? `${preferences.allergies.join(", ")} allergy` : primaryBaby?.allergies.join(", ") || "",
    avoidIngredients: "Honey, whole nuts, added salt",
    servings: "4",
    mealType: "Dinner",
    cuisine: preferences.favoriteCuisines[0] || "Italian",
    cookingTime: "25 min or less",
    diet: preferences.dietPreferences[0] || "None",
    appliances: preferences.appliances[0] || "Stovetop",
    skillLevel: "Easy",
    goal: preferences.cookingGoals[0] || "Cook once for baby and adults with leftovers for lunch."
  };
}

function SafetyWarnings({ preflight }: { preflight: GeneratorPreflight }) {
  if (!preflight.safetyFlags.length) {
    return (
      <div className="flex items-center gap-3 border-b border-[#eaded5] bg-[#f4f8f3] px-4 py-3 text-sm font-extrabold text-[#437967] sm:px-6">
        <ShieldCheck size={18} className="shrink-0" />
        <p>Baby safety check: no risky ingredient detected yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2 border-b border-[#eaded5] bg-[#fff1e8] px-4 py-3 sm:px-6" aria-live="polite">
      {preflight.safetyFlags.slice(0, 3).map((flag) => (
        <div key={flag.label} className="flex gap-3 text-sm font-bold leading-5 text-[#5c4a42]">
          <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#f59b78]" />
          <p>
          <span className="font-black text-[#1f1d1c]">{flag.label}:</span> {flag.reason} The generator will keep this out of the baby portion or prepare it safely.
          </p>
        </div>
      ))}
    </div>
  );
}

function SmartGeneratorLoader() {
  return (
    <div className="cooking-loader-backdrop" role="status" aria-live="polite" aria-label="Cooking recipe">
      <div className="cooking-loader cooking-loader-window rounded-[30px] border border-[#eaded5] bg-[#fffaf6] p-7 text-center shadow-[0_28px_80px_rgba(92,74,66,0.2)]">
        <div className="mx-auto grid place-items-center">
        <div className="cooking-pot" aria-hidden="true">
          <span className="steam steam-one" />
          <span className="steam steam-two" />
          <span className="steam steam-three" />
          <span className="pot-lid" />
          <span className="pot-body">
            <span className="bubble bubble-one" />
            <span className="bubble bubble-two" />
            <span className="bubble bubble-three" />
          </span>
        </div>
        <p className="mt-5 [font-family:Georgia,serif] text-3xl font-normal tracking-[-0.03em] text-[#243929]">Cooking...</p>
      </div>
    </div>
    </div>
  );
}

function RecipeResult({
  recipe,
  showImage,
  activeTab,
  setActiveTab,
  saved,
  onSave,
  onAddToShoppingList,
  onShare,
  historyOpen,
  onToggleHistory,
  generatedRecipes,
  onSelectHistory,
  shoppingMessage
}: {
  recipe: Recipe;
  showImage: boolean;
  activeTab: (typeof resultTabs)[number];
  setActiveTab: (tab: (typeof resultTabs)[number]) => void;
  saved: boolean;
  onSave: () => void;
  onAddToShoppingList: () => void;
  onShare: () => void;
  historyOpen: boolean;
  onToggleHistory: () => void;
  generatedRecipes: Recipe[];
  onSelectHistory: (recipe: Recipe) => void;
  shoppingMessage: string;
}) {
  const cookingSteps = recipe.cookingSteps?.length ? recipe.cookingSteps : recipe.steps;
  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <KitchenLedger className="grid gap-5 rounded-[34px] bg-white p-5 shadow-[0_18px_45px_rgba(92,74,66,0.08)] sm:p-6">
      <div className={cn("grid gap-5 lg:items-center", showImage ? "lg:grid-cols-[0.78fr_1.22fr]" : "lg:grid-cols-1")}>
        {showImage && <RecipeImageFrame recipe={recipe} />}
        <div>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
          <h3 className="mt-4 font-display text-4xl font-black leading-tight">{recipe.title}</h3>
          <p className="mt-3 max-w-4xl text-base font-bold leading-7 text-[#5c4a42]">
            {recipe.description || recipe.familyPitch || "A family recipe adapted for baby and adults."}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <IngredientCard recipe={recipe} />
        <StepCard title="Cooking steps" items={cookingSteps} />
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[#5c4a42]/10 pt-5">
        {resultTabs.filter((tab) => tab !== "Overview").map((tab) => (
          <Button key={tab} type="button" variant={activeTab === tab ? "primary" : "secondary"} onClick={() => setActiveTab(tab)}>
            {tab}
          </Button>
        ))}
      </div>

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

      <div className="grid gap-5 border-t border-[#5c4a42]/10 pt-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="font-display text-xl font-black">Recipe details</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <ResultMetric icon={<Clock size={17} />} label="Time" value={recipe.time} />
            <ResultMetric icon={<Utensils size={17} />} label="Difficulty" value={recipe.difficulty} />
            <ResultMetric icon={<Baby size={17} />} label="Texture" value={recipe.babyTexture || "Baby-safe"} />
            <ResultMetric icon={<ShoppingBasket size={17} />} label="Servings" value={`${recipe.servings}`} />
          </div>
          {recipe.databaseMatch && <DatabaseMatchPanel recipe={recipe} />}
        </div>
        <LiquidGlassPanel className="rounded-[24px] bg-[#f7efe9]/60 p-5">
          <p className="font-display text-xl font-black">Why this works for your family</p>
          <ul className="mt-4 grid gap-3 text-sm font-bold leading-6 text-[#5c4a42]">
            {(recipe.whyItWorks?.length ? recipe.whyItWorks : [recipe.familyPitch || "One cooking base splits into baby and adult plates."]).map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 shrink-0 text-[#78bea8]" size={17} />
                {item}
              </li>
            ))}
          </ul>
        </LiquidGlassPanel>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-[#5c4a42]/10 pt-5">
        <Button type="button" onClick={onSave}>
          {saved ? <Check size={17} /> : <Save size={17} />}
          {saved ? "Saved" : "Save recipe"}
        </Button>
        <Button type="button" variant="secondary" onClick={onAddToShoppingList}>
          <ShoppingBasket size={17} />
          Add to shopping list
        </Button>
        <Button type="button" variant="secondary" onClick={onToggleHistory}>
          <Clock size={17} />
          View history
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
      {shoppingMessage && <p className="text-sm font-extrabold text-[#78bea8]">{shoppingMessage}</p>}
      {historyOpen && (
        <div className="rounded-[24px] border border-[#e9c7b7]/60 bg-[#fffaf6] p-4">
          <p className="font-display text-xl font-black">Generated recipe history</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(generatedRecipes.length ? generatedRecipes : [recipe]).map((historyRecipe) => (
              <button
                key={historyRecipe.id}
                type="button"
                className="rounded-[20px] bg-white p-4 text-left shadow-sm transition"
                onClick={() => onSelectHistory(historyRecipe)}
              >
                <p className="font-black">{historyRecipe.title}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-[#5c4a42]/72">
                  {historyRecipe.time} / {historyRecipe.difficulty} / {historyRecipe.servings} servings
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </KitchenLedger>
  );
}

function RecipeImageFrame({ recipe }: { recipe: Recipe }) {
  const image = isValidRecipeImage(recipe.image) ? recipe.image : fallbackRecipeImage;
  return (
    <div className="relative aspect-square overflow-hidden rounded-[28px] border border-white/72 bg-[#f7efe9] shadow-[0_18px_44px_rgba(92,74,66,0.12)]">
      <Image
        src={image}
        alt={`${recipe.title} recipe image`}
        fill
        sizes="(max-width: 1024px) 100vw, 360px"
        className="object-cover"
        unoptimized={image.startsWith("data:")}
      />
    </div>
  );
}

function DatabaseMatchPanel({ recipe }: { recipe: Recipe }) {
  const match = recipe.databaseMatch;
  if (!match) return null;
  return (
    <div className="liquid-glass mt-4 rounded-[22px] border border-[#78bea8]/35 bg-[#e8f4ef]/62 p-4">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#437967]">
        <ShieldCheck size={15} />
        Based on Foody Fam verified recipe
      </p>
      <div className="mt-3 grid gap-3 text-sm font-bold text-[#5c4a42] md:grid-cols-2">
        <p><span className="font-black text-[#1f1d1c]">Base:</span> {match.baseRecipeTitle}</p>
        <p><span className="font-black text-[#1f1d1c]">Pantry match:</span> {match.pantryMatch}%</p>
        <p><span className="font-black text-[#1f1d1c]">Age path:</span> {match.ageAdaptation}</p>
        <p><span className="font-black text-[#1f1d1c]">Allergy flags:</span> {match.allergyFlags.length ? match.allergyFlags.join(", ") : "Clear"}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {match.aiChanges.map((item) => (
          <Pill key={item} className="bg-white">{item}</Pill>
        ))}
      </div>
    </div>
  );
}

function ResultMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="liquid-glass rounded-[18px] bg-[#f7efe9]/62 p-3">
      <div className="text-[#78bea8]">{icon}</div>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#5c4a42]">{label}</p>
      <p className="mt-1 break-words text-sm font-black leading-5">{value}</p>
    </div>
  );
}

function IngredientCard({ recipe }: { recipe: Recipe }) {
  const items = recipe.ingredientDetails?.length
    ? recipe.ingredientDetails.map((item) => `${formatQuantity(item.quantity)} ${item.unit} ${item.name}${item.note ? ` - ${item.note}` : ""}`)
    : recipe.ingredients;
  return (
    <RecipeTicket className="rounded-[24px] bg-[#f7efe9]/62 p-5">
      <p className="font-display text-xl font-black">Ingredients</p>
      <ul className="mt-4 grid gap-3 text-sm font-bold leading-6 text-[#5c4a42]">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-[#78bea8]">
              <ShoppingBasket size={13} />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </RecipeTicket>
  );
}

function StepCard({ title, items, accent }: { title: string; items: string[]; accent?: "mint" | "coral" }) {
  return (
    <RecipeTicket className={`rounded-[24px] p-5 ${accent === "coral" ? "bg-[#ffccb2]/58" : accent === "mint" ? "bg-[#e8f4ef]/72" : "bg-[#f7efe9]/62"}`}>
      <p className="font-display text-xl font-black">{title}</p>
      <ol className="mt-4 grid gap-3 text-sm font-bold leading-6 text-[#5c4a42]">
        {items.map((item, index) => (
          <li key={`${title}-${item}`} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-[#78bea8]">{index + 1}</span>
            <span className={stepClassName(item)}>{item}</span>
          </li>
        ))}
      </ol>
    </RecipeTicket>
  );
}

function stepClassName(item: string) {
  const lower = item.toLowerCase();
  if (lower.includes("baby portion")) return "rounded-xl bg-[#e8f4ef] px-2 py-1 text-[#315f52]";
  if (lower.includes("adult finish")) return "rounded-xl bg-[#ffccb2]/70 px-2 py-1 text-[#5c4a42]";
  return "";
}

function formatQuantity(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function isValidRecipeImage(image: string | undefined) {
  return Boolean(image && (image.startsWith("/") || image.startsWith("data:image/")));
}

function createPersistableRecipe(recipe: Recipe): Recipe {
  if (!recipe.image?.startsWith("data:image/") || recipe.image.length <= maxPersistedImageLength) {
    return recipe;
  }
  return { ...recipe, image: fallbackRecipeImage };
}
