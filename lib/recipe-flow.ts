import type { Recipe } from "./types";

const babyFallbacks = [
  "Baby portion: remove the baby's serving before salt, pepper, chili, honey, hard toppings, or strong adult seasoning.",
  "Baby portion: mash, blend, or cut the serving to match the baby's age and texture stage."
];

const adultFallbacks = [
  "Adult finish: after the baby portion is separate, season the remaining pan with salt, pepper, herbs, acid, cheese, or gentle heat."
];

function cleanStep(step: string) {
  return step.replace(/\s+/g, " ").trim();
}

function fingerprint(step: string) {
  return cleanStep(step)
    .toLowerCase()
    .replace(/^(prep|base|step|baby version|baby portion|adult version|adult finish):\s*/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function uniqueSteps(steps: string[]) {
  const seen = new Set<string>();
  return steps.map(cleanStep).filter((step) => {
    if (!step) return false;
    const key = fingerprint(step);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isBabyStep(step: string) {
  const lower = step.toLowerCase();
  return lower.includes("baby portion") || lower.includes("baby's") || lower.startsWith("baby ") || lower.includes("baby-safe");
}

function isAdultStep(step: string) {
  const lower = step.toLowerCase();
  return lower.includes("adult finish") || lower.includes("adult portion") || lower.includes("adult pan") || lower.startsWith("adult ") || lower.includes("season with salt");
}

function withLabel(step: string, label: "Baby portion" | "Adult finish") {
  const cleaned = cleanStep(step);
  const lower = cleaned.toLowerCase();
  if (lower.startsWith(`${label.toLowerCase()}:`)) return cleaned;
  return `${label}: ${cleaned.replace(/^(baby version|adult version|baby portion|adult finish):\s*/i, "")}`;
}

export function normalizeRecipeFlow(recipe: Recipe): Recipe {
  const originalCookingSteps = recipe.cookingSteps?.length ? recipe.cookingSteps : recipe.steps;
  const prepSteps = uniqueSteps(recipe.prepSteps || []);
  const baseSteps = uniqueSteps([...(recipe.steps || []), ...(originalCookingSteps || [])].filter((step) => !isBabyStep(step) && !isAdultStep(step)));
  const babySteps = uniqueSteps([
    ...(originalCookingSteps || []).filter(isBabyStep),
    ...(recipe.babyVersion || []),
    ...(recipe.baby || [])
  ]).map((step) => withLabel(step, "Baby portion"));
  const adultSteps = uniqueSteps([
    ...(originalCookingSteps || []).filter(isAdultStep),
    ...(recipe.adultVersion || []),
    ...(recipe.adults || [])
  ]).map((step) => withLabel(step, "Adult finish"));

  const orderedSteps = uniqueSteps([
    ...prepSteps,
    ...baseSteps,
    ...(babySteps.length ? babySteps : babyFallbacks),
    ...(adultSteps.length ? adultSteps : adultFallbacks)
  ]);

  return {
    ...recipe,
    prepSteps,
    cookingSteps: orderedSteps,
    steps: orderedSteps,
    babyVersion: babySteps.length ? babySteps : babyFallbacks,
    adultVersion: adultSteps.length ? adultSteps : adultFallbacks
  };
}
