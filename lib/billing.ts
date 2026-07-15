import Stripe from "stripe";
import { normalizeSubscriptionPlan, type BillingInterval, type PaidPlan } from "@/lib/pricing";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured.");
  return new Stripe(key);
}

export function getPriceId(plan: PaidPlan, interval: BillingInterval) {
  const normalized = normalizeSubscriptionPlan(plan);
  const legacyPlanName = normalized === "Family" ? "PREMIUM" : normalized.toUpperCase();
  const key = `STRIPE_PRICE_${legacyPlanName}_${interval.toUpperCase()}`;
  const priceId = process.env[key];
  if (!priceId) throw new Error(`${key} is not configured.`);
  return priceId;
}

export function planFromPriceId(priceId: string): { plan: PaidPlan; interval: BillingInterval } | null {
  const entries: [PaidPlan, BillingInterval, string | undefined][] = [
    ["Family", "monthly", process.env.STRIPE_PRICE_PREMIUM_MONTHLY],
    ["Family", "yearly", process.env.STRIPE_PRICE_PREMIUM_YEARLY],
    ["Unlimited", "monthly", process.env.STRIPE_PRICE_UNLIMITED_MONTHLY],
    ["Unlimited", "yearly", process.env.STRIPE_PRICE_UNLIMITED_YEARLY]
  ];
  const match = entries.find((entry) => entry[2] === priceId);
  return match ? { plan: match[0], interval: match[1] } : null;
}
