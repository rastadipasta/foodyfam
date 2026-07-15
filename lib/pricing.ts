import type { SettingsPreferences } from "@/lib/types";

export type SubscriptionPlan = SettingsPreferences["subscriptionStatus"];
export type BillingInterval = "monthly" | "yearly";
export type PaidPlan = Exclude<SubscriptionPlan, "Free">;

const euro = "\u20ac";

export const planOrder: SubscriptionPlan[] = ["Free", "Family", "Unlimited"];

export const pricingPlans = [
  {
    name: "Free" as const,
    monthlyPrice: 0,
    yearlyMonthlyPrice: 0,
    yearlyTotal: 0,
    cadence: "Forever",
    body: "Try Foody Fam with five complete family recipes.",
    cta: "Start free",
    features: ["5 full recipes", "Ingredients with quantities", "Baby/adult split instructions"],
    limits: ["Saving, planner, and history need an account"]
  },
  {
    name: "Family" as const,
    monthlyPrice: 8,
    yearlyMonthlyPrice: 7,
    yearlyTotal: 80,
    cadence: "/ month",
    body: "Weekly family meal planning support with recipe saving, history, and age-aware guidance.",
    cta: "Choose Family",
    features: ["14 meal generations per week", "Recipe images", "Meal planner access", "Nutrition insights", "AI assistant"],
    limits: ["Full recipe library and shopping list unlock with Unlimited"]
  },
  {
    name: "Unlimited" as const,
    monthlyPrice: 13,
    yearlyMonthlyPrice: 11,
    yearlyTotal: 130,
    cadence: "/ month",
    body: "The full Foody Fam system: generator, verified recipes, planner, shopping, nutrition, assistant, saving and sharing.",
    cta: "Go Unlimited",
    features: ["Unlimited meal generations", "Full verified recipe library", "Shopping list and pantry matching", "Meal planner and saved recipes", "Priority AI assistant"],
    limits: []
  }
] satisfies Array<{
  name: SubscriptionPlan;
  monthlyPrice: number;
  yearlyMonthlyPrice: number;
  yearlyTotal: number;
  cadence: string;
  body: string;
  cta: string;
  features: string[];
  limits: string[];
}>;

export function normalizeSubscriptionPlan(value: unknown): SubscriptionPlan {
  if (value === "Premium" || value === "Family") return "Family";
  if (value === "Unlimited") return "Unlimited";
  return "Free";
}

export function isPaidPlan(plan: unknown): plan is PaidPlan {
  return normalizeSubscriptionPlan(plan) !== "Free";
}

export function getPricingPlan(plan: SubscriptionPlan) {
  return pricingPlans.find((item) => item.name === plan) || pricingPlans[0];
}

export function formatPlanPrice(plan: SubscriptionPlan, interval: BillingInterval) {
  const config = getPricingPlan(plan);
  if (plan === "Free") return `${euro}0`;
  return `${euro}${interval === "monthly" ? config.monthlyPrice : config.yearlyMonthlyPrice}`;
}

export function yearlyBillingNote(plan: SubscriptionPlan) {
  const config = getPricingPlan(plan);
  if (plan === "Free") return "";
  return `Billed ${euro}${config.yearlyTotal} yearly - 2 months free`;
}

export function planMarketingLabel(plan: SubscriptionPlan) {
  if (plan === "Family") return "Family";
  return plan;
}
