import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, planFromPriceId } from "@/lib/billing";
import { getSupabaseAdmin } from "@/lib/supabase/server-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      if (subscriptionId) await syncSubscription(await stripe.subscriptions.retrieve(subscriptionId));
    }
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      await syncSubscription(event.data.object);
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0]?.price.id;
  const selected = priceId ? planFromPriceId(priceId) : null;
  const userId = subscription.metadata.user_id;
  if (!userId) return;

  const active = subscription.status === "active" || subscription.status === "trialing" || subscription.status === "past_due";
  const periodEnd = subscription.items.data[0]?.current_period_end;
  await getSupabaseAdmin()
    .from("profiles")
    .update({
      subscription_status: active && selected ? selected.plan : "Free",
      subscription_state: normalizeState(subscription.status),
      billing_interval: active && selected ? selected.interval : null,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
      subscription_current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null
    })
    .eq("id", userId);
}

function normalizeState(status: Stripe.Subscription.Status) {
  if (status === "trialing" || status === "past_due" || status === "unpaid") return status;
  if (status === "active") return "active";
  return "canceled";
}
