import type { Recipe } from "./types";

const unsafeAdultItems = "salt, strong spices, honey, crunchy toppings, or adult garnishes";

function cleanText(value: string | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function sentence(value: string, fallback: string) {
  const cleaned = cleanText(value || fallback);
  return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
}

function uniqueShortItems(items: string[], max = 5) {
  const seen = new Set<string>();
  return items
    .map(cleanText)
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, max);
}

function ingredientNames(recipe: Recipe) {
  const details = recipe.ingredientDetails?.map((item) => item.name).filter(Boolean) || [];
  return uniqueShortItems(details.length ? details : recipe.ingredients || [], 4);
}

function buildPrepStep(recipe: Recipe) {
  const names = ingredientNames(recipe);
  if (!names.length) return "Prep the ingredients into soft, baby-safe pieces.";
  return `Prep ${names.join(", ")} into soft, baby-safe pieces.`;
}

function buildBaseStep(recipe: Recipe) {
  const time = recipe.time ? ` for about ${recipe.time}` : "";
  return `Cook the shared base gently${time} until everything is tender and easy to mash.`;
}

function buildBabyTextureStep(recipe: Recipe) {
  const texture = recipe.babyTexture || recipe.babyVersion?.[0] || recipe.baby?.[0] || "the selected baby texture";
  return `Baby portion: mash, blend, or cut the reserved serving to ${cleanText(texture).toLowerCase()}.`;
}

function buildAdultFinishStep(recipe: Recipe) {
  const adultFinish = uniqueShortItems([...(recipe.adultVersion || []), ...(recipe.adults || [])], 2)
    .map((item) => item.replace(/^Adult finish:\s*/i, ""))
    .join(" ");
  return sentence(
    `Adult finish: season the remaining portion with ${adultFinish || "salt, pepper, herbs, lemon, cheese, or gentle heat"} and serve warm`,
    "Adult finish: season the remaining portion and serve warm."
  );
}

export function normalizeRecipeFlow(recipe: Recipe): Recipe {
  const cookingSteps = [
    buildPrepStep(recipe),
    buildBaseStep(recipe),
    `Baby portion: remove the baby's serving before adding ${unsafeAdultItems}.`,
    buildBabyTextureStep(recipe),
    buildAdultFinishStep(recipe)
  ];
  const babyVersion = [
    `Baby portion: reserved before ${unsafeAdultItems}.`,
    buildBabyTextureStep(recipe)
  ];
  const adultVersion = [buildAdultFinishStep(recipe)];

  return {
    ...recipe,
    prepSteps: cookingSteps.slice(0, 1),
    cookingSteps,
    steps: cookingSteps,
    babyVersion,
    adultVersion
  };
}
