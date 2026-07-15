import { NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromBearer } from "@/lib/supabase/server-admin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      babyAge?: string;
      cookingFrequency?: string;
      biggestDinnerProblem?: string;
      consent?: boolean;
      recipeId?: string;
      recipeTitle?: string;
      cooked?: boolean;
      babyAte?: boolean;
      confusion?: string;
      willingnessToPay?: string;
    };
    let userId: string | null = null;
    try {
      const user = await getUserFromBearer(request);
      userId = user?.id || null;
    } catch {
      userId = null;
    }
    await getSupabaseAdmin().from("beta_feedback").insert({
      user_id: userId,
      email: body.email || null,
      baby_age: body.babyAge || null,
      cooking_frequency: body.cookingFrequency || null,
      biggest_dinner_problem: body.biggestDinnerProblem || null,
      consent: Boolean(body.consent),
      recipe_id: body.recipeId || null,
      recipe_title: body.recipeTitle || null,
      cooked: body.cooked ?? null,
      baby_ate: body.babyAte ?? null,
      confusion: body.confusion || null,
      willingness_to_pay: body.willingnessToPay || null
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Feedback could not be saved." }, { status: 503 });
  }
}
