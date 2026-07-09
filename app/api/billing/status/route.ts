import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromBearer } from "@/lib/supabase/server-admin";

export async function GET(request: Request) {
  try {
    const user = await getUserFromBearer(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("profiles")
      .select("subscription_status,subscription_state,billing_interval,subscription_current_period_end")
      .eq("id", user.id)
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load billing status." }, { status: 500 });
  }
}
