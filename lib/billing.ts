import Stripe from "stripe";
import type { SettingsPreferences } from "@/lib/types";

export type PaidPlan = Exclude<SettingsPreferences["subscriptionStatus"], "Free">;
export type BillingInterval = "monthly" | "yearly";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured.");
  return new Stripe(key);
}

export function getPriceId(plan: PaidPlan, interval: BillingInterval) {
  const key = `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`;
  const priceId = process.env[key];
  if (!priceId) throw new Error(`${key} is not configured.`);
  return priceId;
}

export function planFromPriceId(priceId: string): { plan: PaidPlan; interval: BillingInterval } | null {
  const entries: [PaidPlan, BillingInterval, string | undefined][] = [
    ["Premium", "monthly", process.env.STRIPE_PRICE_PREMIUM_MONTHLY],
    ["Premium", "yearly", process.env.STRIPE_PRICE_PREMIUM_YEARLY],
    ["Unlimited", "monthly", process.env.STRIPE_PRICE_UNLIMITED_MONTHLY],
    ["Unlimited", "yearly", process.env.STRIPE_PRICE_UNLIMITED_YEARLY]
  ];
  const match = entries.find((entry) => entry[2] === priceId);
  return match ? { plan: match[0], interval: match[1] } : null;
}
