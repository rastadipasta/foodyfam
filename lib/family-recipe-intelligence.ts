import type { DatabaseRecipe, RecipeMatchInput } from "./types";
import { getBabyNutritionGuidance, resolveBabyAgeBand } from "./baby-nutrition";

type RecipePattern = {
  id: string;
  match: RegExp;
  formula: string;
  babyMethod: string;
  adultFinish: string;
  bestFor: string;
};

const patterns: RecipePattern[] = [
  {
    id: "soft-grain-bowl",
    match: /rice|risotto|quinoa|couscous|barley|grain|bowl/i,
    formula: "soft grain + protein/legume + 2 vegetables + mild cooking liquid",
    babyMethod: "cook until grains and vegetables are very soft; puree, mash, or chop by age",
    adultFinish: "finish with salt, pepper, lemon, herbs, parmesan, chili, or toasted seeds after baby portion is removed",
    bestFor: "lunch, dinner, batch cooking, freezer portions"
  },
  {
    id: "sauce-and-pasta",
    match: /pasta|noodle|macaroni|spaghetti|lentil|tomato/i,
    formula: "soft sauce base + small pasta or noodles + vegetable + protein/legume",
    babyMethod: "serve sauce smooth or lumpy; cut pasta short and keep it moist",
    adultFinish: "finish adult pan with cheese, herbs, black pepper, chili, or acidity",
    bestFor: "family dinner, toddlers, leftovers"
  },
  {
    id: "soup-stew",
    match: /soup|stew|curry|dal|lentil|bean|chickpea|broth/i,
    formula: "soft aromatics + vegetable + legume/protein + low-sodium liquid",
    babyMethod: "thicken and cool baby portion; blend smooth for early eaters or mash for older babies",
    adultFinish: "finish adults with salt, spice paste, yogurt, herbs, chili oil, or crunchy toppings",
    bestFor: "purees, iron-rich meals, freezer meals"
  },
  {
    id: "breakfast-soft",
    match: /oat|porridge|pancake|banana|yogurt|egg|breakfast/i,
    formula: "iron-rich cereal or egg/yogurt base + fruit/vegetable + gentle fat",
    babyMethod: "keep soft and moist; cut pancakes or egg into strips only if developmentally ready",
    adultFinish: "finish adults with nuts, honey, maple, crunchy granola, or extra spice only after baby serving is separate",
    bestFor: "breakfast, snacks, finger-food practice"
  },
  {
    id: "tray-bake",
    match: /chicken|fish|salmon|turkey|beef|potato|carrot|zucchini|broccoli|tray|bake|roast/i,
    formula: "soft roasted protein + soft vegetables + starch + mild oil",
    babyMethod: "reserve soft unsalted pieces; shred/flass protein and mash vegetables with liquid if needed",
    adultFinish: "finish adults with salt, pepper, spice rub, sauce, lemon, herbs, or crispy toppings",
    bestFor: "adult-friendly dinners with baby-safe separated portions"
  }
];

export const FAMILY_RECIPE_RESEARCH_PACK = [
  "Recipe intelligence pack:",
  "Use a cook-once structure: mild base first, baby portion out, adult finish last.",
  "Prefer iron/zinc foods across the week: meat, poultry, fish, eggs if tolerated, beans, lentils, tofu, iron-fortified cereals, leafy greens with vitamin C foods.",
  "Use energy-dense gentle fats where appropriate: olive oil, avocado, full-fat yogurt or cheese if tolerated.",
  "Texture progression: 6-8 smooth puree/very soft mash; 8-10 thicker mash/soft lumps/soft finger foods if ready; 10-12 soft minced/chopped/shredded/finger foods; toddler small safe family pieces.",
  "Family recipe formulas should be practical: grain bowl, pasta sauce, soup/stew, breakfast soft base, tray bake, fritter/pancake strip, or freezer portion.",
  "Do not make baby food bland for adults: adult flavor comes after baby split with salt, herbs, acidity, cheese, chili, crunchy toppings, or sauces.",
  "Keep instructions short, concrete, and operational."
].join(" ");

export function buildCompactRecipeContext(input: RecipeMatchInput & { babyTexture?: string; feedingStyle?: string; skillLevel?: string; goal?: string }, base?: DatabaseRecipe) {
  const guidance = getBabyNutritionGuidance(input);
  const ingredients = compactList(input.ingredients || input.pantryItems || base?.ingredients.join(", ") || "family pantry", 10);
  const pattern = choosePattern(`${ingredients.join(", ")} ${input.mealType || ""} ${input.cuisine || ""} ${base?.title || ""}`);
  const ageBand = resolveBabyAgeBand(input.babyAge);
  const baseLine = base
    ? `BASE=${base.title}; ${base.mealType}; ${base.cuisine}; ${base.prepTime + base.cookTime}min; core=${base.ingredients.slice(0, 8).join(", ")}; steps=${base.steps.slice(0, 3).join(" -> ")}.`
    : "BASE=No verified recipe selected; use closest Foody Fam formula.";

  return [
    baseLine,
    `REQUEST=age ${ageBand}; meal ${input.mealType || "flexible"}; cuisine ${input.cuisine || "flexible"}; time ${input.cookingTime || "flexible"}; skill ${input.skillLevel || "easy"}; ingredients ${ingredients.join(", ")}.`,
    `PATTERN=${pattern.id}; formula=${pattern.formula}; baby=${pattern.babyMethod}; adult=${pattern.adultFinish}; best=${pattern.bestFor}.`,
    `SAFETY=${guidance.flags.map((flag) => `${flag.label}: ${flag.rule}`).join(" | ") || "standard baby-safe split; no unsafe ingredient flagged"}.`,
    `AGE_RULE=${guidance.promptRules.slice(0, 5).join(" | ")}.`,
    "OUTPUT_BUDGET=Prioritize ingredientDetails, cookingSteps, baby split, adult finish. Keep secondary notes concise."
  ].join("\n");
}

function choosePattern(text: string) {
  return patterns.find((pattern) => pattern.match.test(text)) || patterns[0];
}

function compactList(value: string, max: number) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, max);
}
