import type { SettingsPreferences } from "@/lib/types";

export type SubscriptionPlan = SettingsPreferences["subscriptionStatus"];

export type PlanFeature =
  | "generatedImages"
  | "recipeLibrary"
  | "savedRecipes"
  | "shoppingList"
  | "planner"
  | "nutrition"
  | "assistant"
  | "unlimitedGenerationHistory";

export const featureLabels: Record<PlanFeature, string> = {
  generatedImages: "AI recipe images",
  recipeLibrary: "Verified recipe library",
  savedRecipes: "Saved recipes",
  shoppingList: "Shopping list",
  planner: "Weekly planner",
  nutrition: "Nutrition insights",
  assistant: "AI assistant",
  unlimitedGenerationHistory: "Full generation history"
};

const access: Record<SubscriptionPlan, Record<PlanFeature, boolean>> = {
  Free: {
    generatedImages: false,
    recipeLibrary: false,
    savedRecipes: false,
    shoppingList: false,
    planner: false,
    nutrition: false,
    assistant: false,
    unlimitedGenerationHistory: false
  },
  Premium: {
    generatedImages: true,
    recipeLibrary: false,
    savedRecipes: true,
    shoppingList: false,
    planner: true,
    nutrition: true,
    assistant: true,
    unlimitedGenerationHistory: false
  },
  Unlimited: {
    generatedImages: true,
    recipeLibrary: true,
    savedRecipes: true,
    shoppingList: true,
    planner: true,
    nutrition: true,
    assistant: true,
    unlimitedGenerationHistory: true
  }
};

export function canAccessFeature(plan: SubscriptionPlan, feature: PlanFeature) {
  return access[plan]?.[feature] ?? false;
}

export function getUpgradeTarget(feature: PlanFeature): SubscriptionPlan {
  if (feature === "recipeLibrary" || feature === "shoppingList" || feature === "unlimitedGenerationHistory") {
    return "Unlimited";
  }
  return "Premium";
}

export function getPlanLimit(plan: SubscriptionPlan) {
  if (plan === "Free") return "3 meal generations";
  if (plan === "Premium") return "14 meal generations per week";
  return "Unlimited meal generations";
}
