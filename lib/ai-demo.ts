import { demoRecipes } from "./data";
import type { Recipe } from "./types";

export function createDemoRecipe(input?: {
  ingredients?: string;
  babyAge?: string;
  cuisine?: string;
  cookingTime?: string;
  diet?: string;
  servings?: number | string;
  babyProfile?: string;
  allergies?: string;
  pantryItems?: string;
  babyTexture?: string;
  feedingStyle?: string;
  appliances?: string;
  skillLevel?: string;
  avoidIngredients?: string;
  mealType?: string;
  goal?: string;
}): Recipe {
  const base = demoRecipes[0];
  const ingredients = input?.ingredients
    ? input.ingredients.split(",").map((item) => item.trim()).filter(Boolean)
    : base.ingredients;
  const cuisine = input?.cuisine || "Italian";

  return {
    ...base,
    id: `generated-${Date.now()}`,
    title: `${ingredients[0] || "Family"} & ${ingredients[1] || "Veggie"} ${cuisine} Bowl`,
    slug: "generated-family-meal",
    description:
      "A one-pan family meal that starts as a soft, gentle base and splits into a baby-safe portion plus a brighter adult finish.",
    familyPitch:
      "Cook once, remove the baby's portion before salt or heat, then finish the adult plates with herbs, texture, and seasoning.",
    whyItWorks: [
      "The base ingredients cook until soft, so baby texture is easy to control.",
      "Seasoning happens after the baby portion is removed.",
      "The shopping list stays short because pantry ingredients are reused."
    ],
    safetyNotes: [
      "Check texture and temperature before serving baby's portion.",
      "Avoid added salt for babies and follow your pediatric guidance for allergens.",
      "Cut round or firm foods into age-appropriate shapes."
    ],
    babyTexture: input?.babyTexture || input?.feedingStyle || "Soft mashed texture",
    shoppingList: [
      { category: "Protein", items: [ingredients[0] || "Chicken"] },
      { category: "Vegetables", items: ingredients.slice(1, 4).length ? ingredients.slice(1, 4) : ["Broccoli", "Carrots"] },
      { category: "Pantry", items: ["Rice", "Olive oil", "Low-sodium stock"] }
    ],
    prepSteps: [
      "Wash and chop vegetables into baby-safe sizes.",
      "Set aside salt, chili, and strong seasoning until after the baby portion is removed.",
      "Prepare a small container for the baby portion."
    ],
    cookingSteps: [
      `Cook ${ingredients.slice(0, 3).join(", ") || "the ingredients"} gently until soft.`,
      "Add liquid as needed so the base stays tender and easy to mash.",
      "Remove the baby portion before final seasoning.",
      "Finish the adult pan with herbs, acid, and optional cheese."
    ],
    babyVersion: [
      `Adapt for ${input?.babyAge || "6-8 months"} using ${input?.babyTexture || "a soft mashed texture"}.`,
      "No added salt, honey, or spicy heat.",
      "Mash, blend, or cut to match the baby's feeding stage."
    ],
    adultVersion: [
      "Season with salt and pepper after baby's portion is removed.",
      "Add parmesan, lemon, herbs, or chili flakes.",
      "Serve hot with a crisp side salad if desired."
    ],
    storage: [
      "Cool leftovers quickly and refrigerate in airtight containers.",
      "Use refrigerated portions within 2 days.",
      "Reheat until steaming, then cool baby's portion before serving."
    ],
    leftovers: [
      "Turn leftovers into small risotto cakes or lunch bowls.",
      "Add fresh herbs or yogurt sauce for adult plates.",
      "Freeze baby portions in small labeled cubes."
    ],
    nutritionSummary: [
      "Balanced protein and carbohydrate base for family dinner.",
      "Vegetables add fiber and vitamin C.",
      "Iron support depends on the selected protein and vegetables."
    ],
    allergyWarnings: [
      input?.allergies || input?.diet || "Review family allergies before serving.",
      input?.avoidIngredients ? `Avoid requested ingredients: ${input.avoidIngredients}.` : "Use clean utensils when preparing allergy-sensitive portions."
    ],
    ingredients: ingredients.length ? ingredients : base.ingredients,
    time: input?.cookingTime?.replace(" or less", "") || base.time,
    tags: [cuisine, input?.diet || "Family-safe", input?.babyAge || "Baby adapted"],
    steps: [
      `Prep ${ingredients.slice(0, 3).join(", ") || "the ingredients"} into soft, baby-safe pieces.`,
      "Cook everything until tender before adding salt or spicy seasoning.",
      "Remove the baby portion and adjust texture by blending, mashing, or cutting.",
      "Finish the adult portion with herbs, acid, and seasoning.",
      "Serve warm from one shared cooking process."
    ],
    servings: Number(input?.servings) || base.servings,
    baby: [
      `Adapted for ${input?.babyAge || "6-8 months"}`,
      "No added salt",
      "Soft texture checked before serving",
      "Allergy note reviewed"
    ],
    adults: ["Season after baby's portion is removed", "Add herbs or parmesan", "Serve hot", "Pack leftovers for lunch"]
  };
}

export function createDemoAssistantMessage(message?: string) {
  const lower = message?.toLowerCase() || "";
  if (lower.includes("freeze")) {
    return "Yes. Cool the baby portion quickly, freeze it in small labeled portions, and reheat until steaming before cooling to a safe serving temperature.";
  }
  if (lower.includes("replace") || lower.includes("swap")) {
    return "You can swap broccoli with zucchini, peas, spinach, or carrots. Keep the baby portion soft and remove any tough skins or large pieces.";
  }
  if (lower.includes("allerg")) {
    return "Use the profile allergy list as the rule. Skip the allergen entirely, avoid shared utensils, and choose a tested safe protein or vegetable instead.";
  }
  return "For one-meal family cooking, prepare the base without salt or heat, remove the baby portion, adjust texture, then finish the adult plates with seasoning.";
}
