import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromBearer } from "@/lib/supabase/server-admin";

const allowedEvents = new Set([
  "generator_started",
  "recipe_generated",
  "recipe_saved",
  "signup_started",
  "signup_completed",
  "plan_selected",
  "checkout_started",
  "checkout_completed",
  "feedback_submitted"
]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { eventName?: string; metadata?: Record<string, unknown> };
    if (!body.eventName || !allowedEvents.has(body.eventName)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    let userId: string | null = null;
    try {
      const user = await getUserFromBearer(request);
      userId = user?.id || null;
    } catch {
      userId = null;
    }
    await getSupabaseAdmin().from("analytics_events").insert({
      event_name: body.eventName,
      user_id: userId,
      metadata: body.metadata || {}
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true, skipped: true });
  }
}
