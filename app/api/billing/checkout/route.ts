import { NextResponse } from "next/server";
import { getPriceId, getStripe, type BillingInterval, type PaidPlan } from "@/lib/billing";
import { getSupabaseAdmin, getUserFromBearer } from "@/lib/supabase/server-admin";

export async function POST(request: Request) {
  try {
    const user = await getUserFromBearer(request);
    if (!user?.email) return NextResponse.json({ error: "Sign in before choosing a paid plan." }, { status: 401 });

    const body = (await request.json()) as { plan?: PaidPlan; interval?: BillingInterval };
    if (!["Premium", "Unlimited"].includes(body.plan || "") || !["monthly", "yearly"].includes(body.interval || "")) {
      return NextResponse.json({ error: "Choose a valid plan and billing interval." }, { status: 400 });
    }

    const plan = body.plan as PaidPlan;
    const interval = body.interval as BillingInterval;
    const stripe = getStripe();
    const admin = getSupabaseAdmin();
    const { data: profile } = await admin.from("profiles").select("stripe_customer_id").eq("id", user.id).single();
    let customerId = profile?.stripe_customer_id as string | null;

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, name: user.user_metadata?.display_name, metadata: { user_id: user.id } });
      customerId = customer.id;
      await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin).replace(/\/$/, "");
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: getPriceId(plan, interval), quantity: 1 }],
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/register?step=plan&checkout=cancelled`,
      allow_promotion_codes: true,
      client_reference_id: user.id,
      metadata: { user_id: user.id, plan, interval },
      subscription_data: { metadata: { user_id: user.id, plan, interval } }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not open checkout." }, { status: 503 });
  }
}
