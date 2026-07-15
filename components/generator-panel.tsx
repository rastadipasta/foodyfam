"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
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
import { getPlanLimit } from "@/lib/plan-gating";
import { trackEvent } from "@/lib/tracking";
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

const chips = [
  "Chicken",
  "Rice",
  "Lentils",
  "Carrots",
  "Broccoli",
  "Sweet potato",
  "Avocado",
  "Banana",
  "Oats",
  "Peas",
  "Zucchini",
  "Apple",
  "Salmon",
  "Turkey",
  "Greek yogurt",
  "Pasta"
];
const resultTabs = ["Overview", "Shopping", "Safety"] as const;
const fallbackRecipeImage = "/brand/generated/hero-family-meal.png";
const maxPersistedImageLength = 1_500_000;
const minCookingLoaderMs = 2200;

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
  const [limitMessage, setLimitMessage] = useState("");
  const [shouldScrollToResult, setShouldScrollToResult] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const upsertRecipe = useAppStore((state) => state.upsertRecipe);
  const addGeneratedRecipe = useAppStore((state) => state.addGeneratedRecipe);
  const addRecipeToShoppingList = useAppStore((state) => state.addRecipeToShoppingList);
  const generatedRecipes = useAppStore((state) => state.generatedRecipes);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
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
    if (!canGenerateNow(isAuthenticated, subscriptionStatus, generatedRecipes.length)) {
      setLimitMessage(isAuthenticated ? `Your Free plan includes ${getPlanLimit("Free")}. Upgrade when you are ready to keep generating.` : "You can generate one full recipe before creating a free profile.");
      return;
    }
    setLoading(true);
    setSaved(false);
    setLimitMessage("");
    trackEvent("generator_started", { plan: subscriptionStatus, anonymous: !isAuthenticated });
    const minimumLoader = new Promise((resolve) => window.setTimeout(resolve, minCookingLoaderMs));
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
      incrementLocalGenerationCount(isAuthenticated);
      trackEvent("recipe_generated", { plan: subscriptionStatus, source: data.recipe.databaseMatch ? "database" : "generated" });
      setActiveTab("Overview");
      setShoppingMessage("");
      onResult?.(normalizedRecipe);
    } finally {
      await minimumLoader;
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

  function saveResult() {
    if (!currentResult) return;
    if (!isAuthenticated) {
      setLimitMessage("Create a free profile to save recipes, keep history, and plan the rest of the week.");
      return;
    }
    upsertRecipe(createPersistableRecipe(currentResult), true);
    trackEvent("recipe_saved", { recipeId: currentResult.id, title: currentResult.title });
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
              <option>6-8 months</option>
              <option>8-10 months</option>
              <option>10-12 months</option>
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
        {limitMessage && <AccountCta message={limitMessage} />}
      </form>

      {loading && <SmartGeneratorLoader />}
      {currentResult && !loading && (
        <div ref={resultRef} className="scroll-mt-24">
          <RecipeResult
            recipe={currentResult}
            showImage={subscriptionStatus !== "Free" && isGeneratedRecipeImage(currentResult.image)}
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
            isAuthenticated={isAuthenticated}
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
  shoppingMessage,
  isAuthenticated
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
  isAuthenticated: boolean;
}) {
  const cookingSteps = recipe.cookingSteps?.length ? recipe.cookingSteps : recipe.steps;
  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <KitchenLedger className="grid gap-6 rounded-[34px] bg-white p-5 shadow-[0_18px_45px_rgba(92,74,66,0.08)] sm:p-6">
      <div className={cn("grid gap-5 lg:items-center", showImage ? "lg:grid-cols-[0.72fr_1.28fr]" : "lg:grid-cols-1")}>
        {showImage && <RecipeImageFrame recipe={recipe} />}
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
          <h3 className="mt-4 font-display text-4xl font-black leading-tight">{recipe.title}</h3>
          <p className="mt-3 max-w-4xl text-base font-bold leading-7 text-[#5c4a42]">
            {recipe.description || recipe.familyPitch || "A family recipe adapted for baby and adults."}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="button" onClick={onSave}>
              {saved ? <Check size={17} /> : <Save size={17} />}
              {saved ? "Saved" : "Save recipe"}
            </Button>
            <Button type="button" variant="secondary" onClick={onAddToShoppingList}>
              <ShoppingBasket size={17} />
              Add to shopping list
            </Button>
            <Button type="button" variant="secondary" onClick={onShare}>
              {canNativeShare ? <Share2 size={17} /> : <Copy size={17} />}
              Share
            </Button>
          </div>
          {shoppingMessage && <p className="text-sm font-extrabold text-[#78bea8]">{shoppingMessage}</p>}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <IngredientCard recipe={recipe} />
        <StepCard title="Cooking steps" items={cookingSteps.slice(0, 5)} compact />
      </div>
      <SafetyDisclaimer />

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

      {!isAuthenticated && (
        <AccountCta message="Want to save this recipe, build a profile, or plan the rest of the week? Create a free profile after your first recipe." />
      )}
      <RecipeFeedback recipe={recipe} />

      <div className="flex flex-wrap gap-3 border-t border-[#5c4a42]/10 pt-5">
        <Button type="button" variant="secondary" onClick={onToggleHistory}>
          <Clock size={17} />
          View history
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.print()}>
          <Printer size={17} />
          Print
        </Button>
      </div>
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
  const image = recipe.image;
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

function AccountCta({ message }: { message: string }) {
  return (
    <div className="rounded-[24px] border border-[#eaded5] bg-[#fffaf6] p-4 shadow-[0_16px_34px_rgba(92,74,66,0.06)] sm:flex sm:items-center sm:justify-between sm:gap-4">
      <p className="text-sm font-extrabold leading-6 text-[#5c4a42]">{message}</p>
      <div className="mt-3 flex flex-col gap-2 sm:mt-0 sm:flex-row">
        <Link href="/register"><Button type="button" className="w-full sm:w-auto">Create a free profile</Button></Link>
        <Link href="/pricing"><Button type="button" variant="secondary" className="w-full sm:w-auto">Plan the week</Button></Link>
      </div>
    </div>
  );
}

function RecipeFeedback({ recipe }: { recipe: Recipe }) {
  const [submitted, setSubmitted] = useState(false);
  const [confusion, setConfusion] = useState("");
  const [willingness, setWillingness] = useState("€8");
  const [cooked, setCooked] = useState<boolean | null>(null);
  const [babyAte, setBabyAte] = useState<boolean | null>(null);

  async function submitFeedback() {
    await fetch("/api/beta-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        cooked,
        babyAte,
        confusion,
        willingnessToPay: willingness,
        consent: true
      })
    }).catch(() => undefined);
    trackEvent("feedback_submitted", { recipeId: recipe.id, cooked, babyAte, willingness });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[24px] border border-[#dce9e3] bg-[#e8f4ef] p-5 text-sm font-extrabold text-[#315f52]">
        Thank you. This helps shape Foody Fam around real beta family dinners.
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[#eaded5] bg-white p-5">
      <p className="font-display text-xl font-black">Cooked this recipe?</p>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <FeedbackToggle label="Did you cook it?" value={cooked} onChange={setCooked} />
        <FeedbackToggle label="Did baby eat it?" value={babyAte} onChange={setBabyAte} />
        <label className="grid gap-2 md:col-span-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#5c4a42]">Would you pay?</span>
          <Select value={willingness} onChange={(event) => setWillingness(event.target.value)}>
            <option>€7</option>
            <option>€10</option>
            <option>€13</option>
            <option>Not yet</option>
          </Select>
        </label>
      </div>
      <Field className="mt-3" value={confusion} onChange={(event) => setConfusion(event.target.value)} placeholder="Was anything confusing?" />
      <Button type="button" className="mt-3" variant="secondary" onClick={() => void submitFeedback()}>
        Send feedback
      </Button>
    </div>
  );
}

function SafetyDisclaimer() {
  return (
    <div className="rounded-[24px] border border-[#eaded5] bg-[#fffaf6] p-5 text-sm font-bold leading-6 text-[#5c4a42]">
      <p className="font-black text-[#243929]">Age-aware guidance, not medical advice.</p>
      <p className="mt-2">
        Parents should confirm allergies and individual readiness. Avoid honey under 12 months, keep baby portions without added salt, prepare round or firm foods to reduce choking risk, and check texture and temperature before serving.
      </p>
    </div>
  );
}

function FeedbackToggle({ label, value, onChange }: { label: string; value: boolean | null; onChange: (value: boolean) => void }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5c4a42]">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" className={cn("rounded-full px-3 py-2 text-sm font-black", value === true ? "bg-[#405f46] text-white" : "bg-[#f7efe9] text-[#5c4a42]")} onClick={() => onChange(true)}>Yes</button>
        <button type="button" className={cn("rounded-full px-3 py-2 text-sm font-black", value === false ? "bg-[#405f46] text-white" : "bg-[#f7efe9] text-[#5c4a42]")} onClick={() => onChange(false)}>No</button>
      </div>
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

function StepCard({
  title,
  items,
  accent,
  compact = false
}: {
  title: string;
  items: string[];
  accent?: "mint" | "coral";
  compact?: boolean;
}) {
  return (
    <RecipeTicket className={`rounded-[24px] p-5 ${accent === "coral" ? "bg-[#ffccb2]/58" : accent === "mint" ? "bg-[#e8f4ef]/72" : "bg-[#f7efe9]/62"}`}>
      <p className="font-display text-xl font-black">{title}</p>
      <ol className={cn("mt-4 grid font-bold text-[#5c4a42]", compact ? "gap-4 text-[15px] leading-7" : "gap-3 text-sm leading-6")}>
        {items.map((item, index) => {
          const step = splitStepLabel(item);
          return (
            <li key={`${title}-${item}`} className="flex gap-3">
              <span className={cn("flex shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-[#78bea8]", compact ? "h-7 w-7" : "h-6 w-6")}>
                {index + 1}
              </span>
              <span className={cn("min-w-0", step.kind === "baby" && "text-[#315f52]", step.kind === "adult" && "text-[#5c4a42]")}>
                {step.label && (
                  <span
                    className={cn(
                      "mr-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.08em]",
                      step.kind === "baby" ? "bg-[#e8f4ef] text-[#315f52]" : "bg-[#ffccb2]/72 text-[#5c4a42]"
                    )}
                  >
                    {step.label}
                  </span>
                )}
                {step.body}
              </span>
            </li>
          );
        })}
      </ol>
    </RecipeTicket>
  );
}

function splitStepLabel(item: string) {
  const baby = item.match(/^Baby portion:\s*(.*)$/i);
  if (baby) return { label: "Baby portion", body: baby[1], kind: "baby" as const };
  const adult = item.match(/^Adult finish:\s*(.*)$/i);
  if (adult) return { label: "Adult finish", body: adult[1], kind: "adult" as const };
  return { label: "", body: item, kind: "base" as const };
}

function formatQuantity(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function isGeneratedRecipeImage(image: string | undefined) {
  return Boolean(image?.startsWith("data:image/"));
}

function createPersistableRecipe(recipe: Recipe): Recipe {
  if (!recipe.image?.startsWith("data:image/") || recipe.image.length <= maxPersistedImageLength) {
    return recipe;
  }
  return { ...recipe, image: fallbackRecipeImage };
}

function canGenerateNow(isAuthenticated: boolean, plan: string, generatedCount: number) {
  if (plan === "Unlimited") return true;
  if (plan === "Family" || plan === "Premium") return generatedCount < 14;
  if (isAuthenticated) return generatedCount < 5;
  if (typeof window === "undefined") return true;
  return Number(window.localStorage.getItem("foodyfam-anon-generations") || "0") < 1;
}

function incrementLocalGenerationCount(isAuthenticated: boolean) {
  if (isAuthenticated || typeof window === "undefined") return;
  const current = Number(window.localStorage.getItem("foodyfam-anon-generations") || "0");
  window.localStorage.setItem("foodyfam-anon-generations", String(current + 1));
}
