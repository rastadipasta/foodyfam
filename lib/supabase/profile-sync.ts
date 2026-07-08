import type { User } from "@supabase/supabase-js";
import { demoRecipes, initialPlanner } from "@/lib/data";
import type {
  AuthProvider,
  AuthUser,
  BabyProfile,
  FamilyMember,
  FamilyPreferences,
  MealPlanDay,
  MealPlanSlot,
  MealSlotType,
  Recipe,
  SettingsPreferences,
  ShoppingListItem
} from "@/lib/types";
import { getSupabaseBrowserClient } from "./client";

export type SupabaseAppSnapshot = {
  authUser: AuthUser;
  onboardingCompleted: boolean;
  authProvider: AuthProvider;
  familyMembers: FamilyMember[];
  babyProfiles: BabyProfile[];
  familyPreferences: FamilyPreferences;
  settingsPreferences: SettingsPreferences;
  savedRecipeIds: string[];
  generatedRecipes: Recipe[];
  recipes: Recipe[];
  planner: MealPlanDay[];
  shopping: ShoppingListItem[];
};

const defaultPreferences: FamilyPreferences = {
  allergies: [],
  dietPreferences: ["Balanced"],
  favoriteCuisines: ["Italian"],
  appliances: ["Stovetop", "Oven"],
  cookingGoals: ["20-minute dinners"]
};

export function providerFromSupabaseUser(user: User): AuthProvider {
  const provider = String(user.app_metadata?.provider || user.identities?.[0]?.provider || "password");
  if (provider === "google") return "google";
  if (provider === "apple") return "apple";
  return "password";
}

export function authUserFromSupabase(user: User, profile?: Record<string, unknown> | null): AuthUser {
  const displayName =
    asString(profile?.display_name) ||
    asString(user.user_metadata?.display_name) ||
    asString(user.user_metadata?.full_name) ||
    asString(user.user_metadata?.name) ||
    user.email?.split("@")[0] ||
    "Foody Parent";
  const provider = providerFromSupabaseUser(user);

  return {
    id: user.id,
    email: asString(profile?.email) || user.email || "",
    displayName,
    avatarUrl: asString(profile?.avatar_url) || asString(user.user_metadata?.avatar_url) || undefined,
    provider,
    providerId: user.identities?.[0]?.id || user.id,
    emailVerified: Boolean(user.email_confirmed_at),
    lastLoginAt: user.last_sign_in_at || new Date().toISOString(),
    role: profile?.role === "admin" ? "admin" : "user",
    accountStatus: profile?.account_status === "suspended" ? "suspended" : "active"
  };
}

export async function ensureSupabaseProfile(user: User, name?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const provider = providerFromSupabaseUser(user);
  const displayName =
    name ||
    asString(user.user_metadata?.display_name) ||
    asString(user.user_metadata?.full_name) ||
    asString(user.user_metadata?.name) ||
    user.email?.split("@")[0] ||
    "Foody Parent";

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email || "",
        display_name: displayName,
        avatar_url: asString(user.user_metadata?.avatar_url),
        provider
      },
      { onConflict: "id" }
    )
    .select()
    .single();
  if (error) return null;
  return data as Record<string, unknown>;
}

export async function loadSupabaseSnapshot(user: User): Promise<SupabaseAppSnapshot> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const profile = await ensureSupabaseProfile(user);
  const userId = user.id;

  const [familyRows, babyRows, preferencesRow, savedRows, generatedRows, plannerRows, shoppingRows] =
    await Promise.all([
      supabase.from("family_members").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
      supabase.from("baby_profiles").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
      supabase.from("family_preferences").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("saved_recipes").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("generated_recipes").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
      supabase.from("planner_slots").select("*").eq("user_id", userId),
      supabase.from("shopping_items").select("*").eq("user_id", userId).order("created_at", { ascending: true })
    ]);

  const generatedRecipes = ((generatedRows.data || []) as Record<string, unknown>[])
    .map((row) => row.recipe_snapshot as Recipe | null)
    .filter(Boolean) as Recipe[];
  const savedSnapshots = ((savedRows.data || []) as Record<string, unknown>[])
    .map((row) => row.recipe_snapshot as Recipe | null)
    .filter(Boolean) as Recipe[];

  return {
    authUser: authUserFromSupabase(user, profile),
    onboardingCompleted: Boolean(profile?.onboarding_completed),
    authProvider: providerFromSupabaseUser(user),
    familyMembers: ((familyRows.data || []) as Record<string, unknown>[]).map((row) => ({
      id: asString(row.id),
      name: asString(row.name),
      role: asString(row.role) || "Family",
      preferences: asStringArray(row.preferences)
    })),
    babyProfiles: ((babyRows.data || []) as Record<string, unknown>[]).map((row) => ({
      id: asString(row.id),
      name: asString(row.name),
      age: asString(row.age),
      style: parseBabyStyle(row.style),
      allergies: asStringArray(row.allergies)
    })),
    familyPreferences: preferencesRow.data
      ? {
          allergies: asStringArray(preferencesRow.data.allergies),
          dietPreferences: asStringArray(preferencesRow.data.diet_preferences),
          favoriteCuisines: asStringArray(preferencesRow.data.favorite_cuisines),
          appliances: asStringArray(preferencesRow.data.appliances),
          cookingGoals: asStringArray(preferencesRow.data.cooking_goals)
        }
      : defaultPreferences,
    settingsPreferences: {
      measurementSystem: profile?.measurement_system === "us" ? "us" : "metric",
      temperatureUnit: profile?.temperature_unit === "fahrenheit" ? "fahrenheit" : "celsius",
      subscriptionStatus: parseSubscriptionStatus(profile?.subscription_status),
      billingInterval: profile?.billing_interval === "yearly" ? "yearly" : "monthly",
      subscriptionCurrentPeriodEnd: asString(profile?.subscription_current_period_end) || undefined
    },
    savedRecipeIds: ((savedRows.data || []) as Record<string, unknown>[]).map((row) => asString(row.recipe_id)).filter(Boolean),
    generatedRecipes,
    recipes: mergeRecipes([...generatedRecipes, ...savedSnapshots]),
    planner: buildPlanner((plannerRows.data || []) as Record<string, unknown>[]),
    shopping: ((shoppingRows.data || []) as Record<string, unknown>[]).map((row) => ({
      id: asString(row.id),
      label: asString(row.label),
      category: asString(row.category) || "Shopping list",
      checked: Boolean(row.checked)
    }))
  };
}

export async function syncAccountProfile(user: Partial<AuthUser>, onboardingCompleted?: boolean) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  const payload: Record<string, unknown> = {};
  if (user.email !== undefined) payload.email = user.email;
  if (user.displayName !== undefined) payload.display_name = user.displayName;
  if (user.avatarUrl !== undefined) payload.avatar_url = user.avatarUrl || null;
  if (onboardingCompleted !== undefined) payload.onboarding_completed = onboardingCompleted;
  if (user.role !== undefined) payload.role = user.role;
  if (user.accountStatus !== undefined) payload.account_status = user.accountStatus;
  if (Object.keys(payload).length === 0) return;
  await supabase.from("profiles").update(payload).eq("id", userId);
}

export async function syncSettings(preferences: Partial<SettingsPreferences>) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  const payload: Record<string, unknown> = {};
  if (preferences.measurementSystem !== undefined) payload.measurement_system = preferences.measurementSystem;
  if (preferences.temperatureUnit !== undefined) payload.temperature_unit = preferences.temperatureUnit;
  if (preferences.subscriptionStatus !== undefined) payload.subscription_status = preferences.subscriptionStatus;
  if (preferences.billingInterval !== undefined) payload.billing_interval = preferences.billingInterval;
  if (preferences.subscriptionCurrentPeriodEnd !== undefined) {
    payload.subscription_current_period_end = preferences.subscriptionCurrentPeriodEnd || null;
  }
  if (Object.keys(payload).length === 0) return;
  await supabase.from("profiles").update(payload).eq("id", userId);
}

export async function uploadProfileAvatar(file: File) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) throw new Error("Supabase avatar upload is not configured.");
  const ext = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: true,
    contentType: file.type || "image/webp",
    cacheControl: "3600"
  });
  if (error) throw error;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const avatarUrl = data.publicUrl ? `${data.publicUrl}?v=${Date.now()}` : "";
  await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", userId);
  return avatarUrl;
}

export async function removeProfileAvatar() {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  await supabase.storage.from("avatars").remove([
    `${userId}/avatar.webp`,
    `${userId}/avatar.png`,
    `${userId}/avatar.jpg`
  ]);
  await supabase.from("profiles").update({ avatar_url: null }).eq("id", userId);
}

export async function syncFamilyMember(member: FamilyMember) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  await supabase.from("family_members").upsert({ user_id: userId, ...member, updated_at: new Date().toISOString() });
}

export async function deleteFamilyMember(id: string) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  await supabase.from("family_members").delete().eq("user_id", userId).eq("id", id);
}

export async function syncBabyProfile(profile: BabyProfile) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  await supabase.from("baby_profiles").upsert({ user_id: userId, ...profile, updated_at: new Date().toISOString() });
}

export async function deleteBabyProfile(id: string) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  await supabase.from("baby_profiles").delete().eq("user_id", userId).eq("id", id);
}

export async function syncFamilyPreferences(preferences: FamilyPreferences) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  await supabase.from("family_preferences").upsert({
    user_id: userId,
    allergies: preferences.allergies,
    diet_preferences: preferences.dietPreferences,
    favorite_cuisines: preferences.favoriteCuisines,
    appliances: preferences.appliances,
    cooking_goals: preferences.cookingGoals,
    updated_at: new Date().toISOString()
  });
}

export async function syncSavedRecipe(recipeId: string, saved: boolean, recipe?: Recipe) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  if (!saved) {
    await supabase.from("saved_recipes").delete().eq("user_id", userId).eq("recipe_id", recipeId);
    return;
  }
  await supabase.from("saved_recipes").upsert({
    user_id: userId,
    recipe_id: recipeId,
    recipe_snapshot: recipe || null
  });
}

export async function syncGeneratedRecipe(recipe: Recipe) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  await supabase.from("generated_recipes").upsert({
    user_id: userId,
    recipe_id: recipe.id,
    recipe_snapshot: recipe,
    created_at: new Date().toISOString()
  });
  const { data } = await supabase
    .from("generated_recipes")
    .select("recipe_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(20, 1000);
  const oldIds = (data || []).map((row) => row.recipe_id).filter(Boolean);
  if (oldIds.length) {
    await supabase.from("generated_recipes").delete().eq("user_id", userId).in("recipe_id", oldIds);
  }
}

export async function syncPlannerSlot(day: string, mealType: MealSlotType, recipeId: string, mealSnapshot?: Recipe | null) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  await supabase.from("planner_slots").upsert({
    user_id: userId,
    week_start: currentWeekStart(),
    day,
    meal_type: mealType,
    recipe_id: recipeId || null,
    meal_snapshot: mealSnapshot || null,
    updated_at: new Date().toISOString()
  });
}

export async function deletePlannerSlot(day: string, mealType: MealSlotType) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  await supabase
    .from("planner_slots")
    .delete()
    .eq("user_id", userId)
    .eq("week_start", currentWeekStart())
    .eq("day", day)
    .eq("meal_type", mealType);
}

export async function syncShoppingItem(item: ShoppingListItem) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  await supabase.from("shopping_items").upsert({ user_id: userId, ...item, updated_at: new Date().toISOString() });
}

export async function deleteShoppingItem(id: string) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return;
  await supabase.from("shopping_items").delete().eq("user_id", userId).eq("id", id);
}

export async function syncOnboardingState(snapshot: {
  authUser: AuthUser | null;
  familyMembers: FamilyMember[];
  babyProfiles: BabyProfile[];
  familyPreferences: FamilyPreferences;
}) {
  await Promise.all([
    syncAccountProfile(snapshot.authUser || {}, true),
    syncFamilyPreferences(snapshot.familyPreferences),
    ...snapshot.familyMembers.map((member) => syncFamilyMember(member)),
    ...snapshot.babyProfiles.map((profile) => syncBabyProfile(profile))
  ]);
}

async function getCurrentUserId() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
}

function buildPlanner(rows: Record<string, unknown>[]) {
  const planner = initialPlanner.map((day) => ({ ...day, slots: ensureSlots(day.slots) }));
  for (const row of rows) {
    const day = asString(row.day);
    const mealType = row.meal_type as MealSlotType;
    const target = planner.find((item) => item.day === day);
    if (!target || !["Breakfast", "Lunch", "Dinner"].includes(mealType)) continue;
    const snapshot = row.meal_snapshot as Recipe | null;
    target.slots = ensureSlots(target.slots).map((slot) =>
      slot.mealType === mealType
        ? { mealType, recipeId: asString(row.recipe_id), meal: snapshot?.title || (row.recipe_id ? "Saved recipe" : "Choose a meal") }
        : slot
    );
    const dinner = target.slots.find((slot) => slot.mealType === "Dinner");
    target.recipeId = dinner?.recipeId || "";
    target.meal = dinner?.meal || "Choose a meal";
  }
  return planner;
}

function ensureSlots(slots?: MealPlanSlot[]) {
  const byType = new Map((slots || []).map((slot) => [slot.mealType, slot]));
  return (["Breakfast", "Lunch", "Dinner"] as const).map((mealType) => byType.get(mealType) || { mealType, recipeId: "", meal: "Choose a meal" });
}

function mergeRecipes(recipes: Recipe[]) {
  const byId = new Map(demoRecipes.map((recipe) => [recipe.id, recipe]));
  for (const recipe of recipes) byId.set(recipe.id, recipe);
  return Array.from(byId.values());
}

function currentWeekStart() {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

function parseBabyStyle(value: unknown): BabyProfile["style"] {
  if (value === "Puree" || value === "BLW" || value === "Mixed") return value;
  return "Mixed";
}

function parseSubscriptionStatus(value: unknown): SettingsPreferences["subscriptionStatus"] {
  if (value === "Premium" || value === "Unlimited") return value;
  return "Free";
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
