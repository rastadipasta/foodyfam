import recipeDatabase from "@/data/recipe-database.json";
import type { DatabaseRecipe, Recipe, RecipeDatabaseMatch, RecipeMatchInput } from "@/lib/types";

export const databaseRecipes = recipeDatabase as DatabaseRecipe[];

const ageKeys = ["6-8", "8-10", "10-12", "toddler"] as const;
const stopwords = new Set(["allergy", "allergies", "known", "avoid", "avoiding", "added", "whole", "and", "or", "no"]);

function tokens(value?: string) {
  return (value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((item) => item.trim())
    .filter((item) => item && !stopwords.has(item));
}

function includesAny(haystack: string[], needles: string[]) {
  return needles.some((needle) => haystack.some((item) => item.includes(needle) || needle.includes(item)));
}

function parseMaxMinutes(value?: string) {
  const match = value?.match(/\d+/);
  return match ? Number(match[0]) : null;
}

export function resolveAgeAdaptation(age?: string): RecipeDatabaseMatch["ageAdaptation"] {
  const text = (age || "").toLowerCase();
  if (/toddler|2\+|18|24|3 years/.test(text)) return "toddler";
  if (/10|11|12/.test(text)) return "10-12";
  if (/8-10|9|10/.test(text)) return "8-10";
  return "6-8";
}

export function findBestRecipeMatch(input: RecipeMatchInput) {
  const ingredientTokens = tokens(`${input.ingredients || ""} ${input.pantryItems || ""}`);
  const allergyTokens = tokens(input.allergies);
  const avoidTokens = tokens(input.avoidIngredients);
  const mealTokens = tokens(input.mealType);
  const cuisineTokens = tokens(input.cuisine);
  const applianceTokens = tokens(input.appliances);
  const dietTokens = tokens(input.diet);
  const feedingTokens = tokens(input.feedingStyle);
  const maxMinutes = parseMaxMinutes(input.cookingTime);
  const ageAdaptation = resolveAgeAdaptation(input.babyAge);

  const ranked = databaseRecipes
    .map((recipe) => {
      const searchable = [
        recipe.title,
        recipe.description,
        recipe.mealType,
        recipe.cuisine,
        recipe.proteinType,
        ...recipe.ingredients,
        ...recipe.tags,
        ...recipe.aiTags,
        ...recipe.appliances
      ].map((item) => item.toLowerCase());
      const recipeAllergens = recipe.allergens.map((item) => item.toLowerCase());
      const requestedAllergens = allergyTokens.filter((token) => recipeAllergens.includes(token));
      const avoidedMatches = avoidTokens.filter((token) => includesAny(searchable, [token]));
      const unsafePenalty = (requestedAllergens.length + avoidedMatches.length) * 1000;
      const pantryHits = ingredientTokens.filter((token) => includesAny(searchable, [token]));
      const pantryMatch = ingredientTokens.length
        ? Math.min(100, Math.round((new Set(pantryHits).size / new Set(ingredientTokens).size) * 100))
        : 35;
      let score = pantryMatch * 2 - unsafePenalty;

      if (mealTokens.length && includesAny([recipe.mealType.toLowerCase(), recipe.primaryCategory.toLowerCase()], mealTokens)) score += 80;
      if (cuisineTokens.length && includesAny([recipe.cuisine.toLowerCase(), ...recipe.tags.map((tag) => tag.toLowerCase())], cuisineTokens)) score += 55;
      if (applianceTokens.length && includesAny(recipe.appliances.map((item) => item.toLowerCase()), applianceTokens)) score += 55;
      if (maxMinutes && recipe.prepTime + recipe.cookTime <= maxMinutes) score += 40;
      if (dietTokens.includes("vegetarian") && recipe.proteinType.toLowerCase() === "vegetarian") score += 90;
      if (feedingTokens.includes("blw") && recipe.blwStatus === "BLW-friendly") score += 50;
      if (ageKeys.includes(ageAdaptation)) score += 20;

      return {
        recipe,
        match: {
          source: "foody-fam-database" as const,
          baseRecipeSlug: recipe.slug,
          baseRecipeTitle: recipe.title,
          score: Math.max(0, Math.round(score)),
          pantryMatch,
          allergyFlags: [...requestedAllergens, ...avoidedMatches],
          ageAdaptation,
          matchReasons: [
            pantryMatch >= 50 ? `${pantryMatch}% pantry overlap` : "Closest verified base recipe",
            `${recipe.mealType} recipe`,
            `${recipe.cuisine} profile`,
            recipe.appliances[0] ? `${recipe.appliances[0]} friendly` : "Standard home kitchen",
            recipe.blwStatus === "BLW-friendly" ? "BLW-ready texture path" : "Baby adaptation available"
          ],
          aiChanges: [
            `Use the ${ageAdaptation} baby adaptation`,
            allergyTokens.length ? `Respect allergies: ${allergyTokens.join(", ")}` : "Keep baby portion salt-free",
            avoidTokens.length ? `Avoid: ${avoidTokens.join(", ")}` : "Adult finishing only after baby portion is removed"
          ]
        } satisfies RecipeDatabaseMatch
      };
    })
    .sort((a, b) => b.match.score - a.match.score);

  return ranked[0];
}

export function databaseRecipeToRecipe(recipe: DatabaseRecipe, match: RecipeDatabaseMatch): Recipe {
  const babyText = recipe.babyAdaptations[match.ageAdaptation];
  const time = recipe.cookTime ? `${recipe.prepTime + recipe.cookTime} min` : `${recipe.prepTime} min`;

  return {
    id: recipe.id,
    title: recipe.title,
    slug: recipe.slug,
    image: "/brand/generated/hero-family-meal.png",
    description: recipe.description,
    familyPitch: "Verified Foody Fam base recipe adapted into one baby-safe and adult-friendly cooking flow.",
    whyItWorks: match.matchReasons,
    safetyNotes: [
      "Remove the baby portion before salt, strong spices, honey, or crunchy toppings.",
      "Check texture, temperature, and family allergy needs before serving.",
      "For diagnosed allergies or feeding concerns, confirm suitability with a qualified professional."
    ],
    babyTexture: recipe.blwStatus === "BLW-friendly" ? "Soft, easy-squash BLW pieces or mash" : "Age-adjusted puree, mash, or small soft pieces",
    shoppingList: recipe.shoppingList,
    prepSteps: recipe.steps.slice(0, 2),
    cookingSteps: recipe.steps,
    babyVersion: [babyText, recipe.toddlerAdaptation],
    adultVersion: [...recipe.adultFinishing.seasoning, ...recipe.adultFinishing.steps],
    storage: recipe.freezerFriendly
      ? ["Cool quickly, refrigerate up to 3 days, or freeze baby-safe portions in small containers."]
      : ["Cool quickly and refrigerate leftovers up to 3 days."],
    leftovers: ["Reheat gently with a splash of water or broth.", "Use leftovers for lunch bowls, pasta, or soft finger-food portions."],
    nutritionSummary: [
      `${recipe.nutrition.protein}g estimated protein per adult serving`,
      `Iron: ${recipe.nutrition.iron}`,
      `Vitamin C: ${recipe.nutrition.vitaminC}`,
      `Fiber: ${recipe.nutrition.fiber}`
    ],
    allergyWarnings: recipe.allergens.length
      ? recipe.allergens.map((allergen) => `Contains or may contain ${allergen}. Use a verified swap if this is an allergy.`)
      : ["No major allergen tagged in the base recipe, but verify packaged ingredients."],
    time,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    rating: 4.8,
    tags: recipe.tags,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    baby: [babyText],
    adults: recipe.adultFinishing.steps,
    nutrition: {
      protein: Math.min(99, recipe.nutrition.protein * 3),
      iron: recipe.nutrition.iron,
      vitaminC: recipe.nutrition.vitaminC,
      fiber: recipe.nutrition.fiber,
      calories: recipe.nutrition.calories
    },
    databaseMatch: match
  };
}
