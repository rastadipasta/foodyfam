"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { babyProfiles, demoRecipes, familyMembers, initialChat, initialPlanner, initialShopping } from "@/lib/data";
import type {
  AuthMode,
  AuthProvider,
  AuthUser,
  BabyProfile,
  ChatMessage,
  FamilyPreferences,
  FamilyMember,
  MealPlanDay,
  MealSlotType,
  OnboardingDraft,
  Recipe,
  ShoppingListItem
} from "@/lib/types";

const defaultOnboardingDraft: OnboardingDraft = {
  familyCount: "3",
  babyName: "Mia",
  babyAge: "8 months",
  babyStyle: "Mixed",
  allergies: [],
  dietPreferences: ["Balanced"],
  favoriteCuisines: ["Italian"],
  appliances: ["Stovetop", "Oven"],
  cookingGoals: ["20-minute dinners", "Less food waste"]
};

type AppStore = {
  recipes: Recipe[];
  generatedRecipes: Recipe[];
  savedRecipeIds: string[];
  planner: MealPlanDay[];
  shopping: ShoppingListItem[];
  pantry: string[];
  babyProfiles: BabyProfile[];
  familyMembers: FamilyMember[];
  chat: ChatMessage[];
  activeUser: string | null;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  lastLoginAt: string | null;
  authMode: AuthMode;
  authProvider: AuthProvider | null;
  onboardingStep: number;
  onboardingDraft: OnboardingDraft;
  familyPreferences: FamilyPreferences;
  saveRecipe: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  addShoppingItem: (item: Omit<ShoppingListItem, "id" | "checked"> & { id?: string; checked?: boolean }) => void;
  removeShoppingItem: (id: string) => void;
  addPantryItem: (label: string) => void;
  removePantryItem: (label: string) => void;
  setPlannerSlot: (day: string, mealType: MealSlotType, recipeId: string) => void;
  clearPlannerSlot: (day: string, mealType: MealSlotType) => void;
  setPlannerMeal: (day: string, recipeId: string) => void;
  addRecipeToPlanner: (day: string, recipe: Recipe) => void;
  removeRecipeFromPlanner: (recipeId: string) => void;
  addGeneratedRecipe: (recipe: Recipe) => void;
  addRecipeToShoppingList: (recipe: Recipe) => void;
  addChatMessage: (message: ChatMessage) => void;
  setActiveUser: (name: string | null) => void;
  loginDemoUser: (user: AuthUser, onboardingCompleted?: boolean) => void;
  registerDemoUser: (user: AuthUser) => void;
  loginWithProvider: (user: AuthUser, onboardingCompleted?: boolean) => void;
  logout: () => void;
  requestPasswordReset: (email: string) => void;
  updateAuthUser: (user: Partial<AuthUser>) => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, member: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  addBabyProfile: (profile: BabyProfile) => void;
  updateBabyProfile: (id: string, profile: Partial<BabyProfile>) => void;
  removeBabyProfile: (id: string) => void;
  updateFamilyPreferences: (preferences: Partial<FamilyPreferences>) => void;
  setOnboardingStep: (step: number) => void;
  updateOnboardingDraft: (draft: Partial<OnboardingDraft>) => void;
  updateDashboardPreferences: (draft: Partial<OnboardingDraft>) => void;
  completeOnboarding: (profile: BabyProfile) => void;
  upsertRecipe: (recipe: Recipe, save?: boolean) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      recipes: demoRecipes,
      generatedRecipes: [],
      savedRecipeIds: ["risotto"],
      planner: initialPlanner,
      shopping: initialShopping,
      pantry: ["Chicken", "Rice", "Eggs", "Milk"],
      babyProfiles,
      familyMembers,
      chat: initialChat,
      activeUser: null,
      authUser: null,
      isAuthenticated: false,
      onboardingCompleted: false,
      lastLoginAt: null,
      authMode: "demo",
      authProvider: null,
      onboardingStep: 0,
      onboardingDraft: defaultOnboardingDraft,
      familyPreferences: {
        allergies: defaultOnboardingDraft.allergies,
        dietPreferences: defaultOnboardingDraft.dietPreferences,
        favoriteCuisines: defaultOnboardingDraft.favoriteCuisines,
        appliances: defaultOnboardingDraft.appliances,
        cookingGoals: defaultOnboardingDraft.cookingGoals
      },
      saveRecipe: (id) =>
        set((state) => ({
          savedRecipeIds: state.savedRecipeIds.includes(id)
            ? state.savedRecipeIds.filter((recipeId) => recipeId !== id)
            : [...state.savedRecipeIds, id]
        })),
      toggleShoppingItem: (id) =>
        set((state) => ({
          shopping: state.shopping.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
        })),
      addShoppingItem: (item) =>
        set((state) => {
          const normalized = item.label.trim();
          if (!normalized) return state;
          return {
            shopping: [
              ...state.shopping,
              {
                id: item.id || createLocalId("shopping"),
                label: normalized,
                category: item.category.trim() || "Other",
                checked: item.checked || false
              }
            ]
          };
        }),
      removeShoppingItem: (id) =>
        set((state) => ({
          shopping: state.shopping.filter((item) => item.id !== id)
        })),
      addPantryItem: (label) =>
        set((state) => {
          const normalized = label.trim();
          if (!normalized || state.pantry.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
            return state;
          }
          return { pantry: [...state.pantry, normalized] };
        }),
      removePantryItem: (label) => set((state) => ({ pantry: state.pantry.filter((item) => item !== label) })),
      setPlannerSlot: (day, mealType, recipeId) =>
        set((state) => {
          const recipe = state.recipes.find((item) => item.id === recipeId);
          return {
            planner: state.planner.map((item) => {
              if (item.day !== day) return normalizePlannerDay(item);
              const nextSlots = ensurePlannerSlots(item).map((slot) =>
                slot.mealType === mealType
                  ? { ...slot, recipeId, meal: recipe ? recipe.title : "Choose a meal" }
                  : slot
              );
              const dinner = nextSlots.find((slot) => slot.mealType === "Dinner");
              return {
                ...item,
                slots: nextSlots,
                recipeId: dinner?.recipeId || "",
                meal: dinner?.meal || "Choose a meal"
              };
            })
          };
        }),
      clearPlannerSlot: (day, mealType) =>
        set((state) => ({
          planner: state.planner.map((item) => {
            if (item.day !== day) return normalizePlannerDay(item);
            const nextSlots = ensurePlannerSlots(item).map((slot) =>
              slot.mealType === mealType ? { ...slot, recipeId: "", meal: "Choose a meal" } : slot
            );
            const dinner = nextSlots.find((slot) => slot.mealType === "Dinner");
            return {
              ...item,
              slots: nextSlots,
              recipeId: dinner?.recipeId || "",
              meal: dinner?.meal || "Choose a meal"
            };
          })
        })),
      setPlannerMeal: (day, recipeId) =>
        set((state) => {
          const recipe = state.recipes.find((item) => item.id === recipeId);
          return {
            planner: state.planner.map((item) => {
              if (item.day !== day) return normalizePlannerDay(item);
              const nextSlots = ensurePlannerSlots(item).map((slot) =>
                slot.mealType === "Dinner"
                  ? { ...slot, recipeId, meal: recipe ? recipe.title : "Choose a meal" }
                  : slot
              );
              return { ...item, recipeId, meal: recipe?.title || "Choose a meal", slots: nextSlots };
            })
          };
        }),
      addRecipeToPlanner: (day, recipe) =>
        set((state) => ({
          recipes: [recipe, ...state.recipes.filter((item) => item.id !== recipe.id)],
          savedRecipeIds: Array.from(new Set([recipe.id, ...state.savedRecipeIds])),
          planner: state.planner.map((item) => {
            if (item.day !== day) return normalizePlannerDay(item);
            const nextSlots = ensurePlannerSlots(item).map((slot) =>
              slot.mealType === "Dinner" ? { ...slot, recipeId: recipe.id, meal: recipe.title } : slot
            );
            return { ...item, recipeId: recipe.id, meal: recipe.title, slots: nextSlots };
          })
        })),
      removeRecipeFromPlanner: (recipeId) =>
        set((state) => ({
          planner: state.planner.map((item) => {
            const nextSlots = ensurePlannerSlots(item).map((slot) =>
              slot.recipeId === recipeId ? { ...slot, recipeId: "", meal: "Choose a meal" } : slot
            );
            const dinner = nextSlots.find((slot) => slot.mealType === "Dinner");
            return {
              ...item,
              slots: nextSlots,
              recipeId: item.recipeId === recipeId ? dinner?.recipeId || "" : item.recipeId,
              meal: item.recipeId === recipeId ? dinner?.meal || "Choose a meal" : item.meal
            };
          })
        })),
      addGeneratedRecipe: (recipe) =>
        set((state) => ({
          recipes: [recipe, ...state.recipes.filter((item) => item.id !== recipe.id)],
          generatedRecipes: [recipe, ...state.generatedRecipes.filter((item) => item.id !== recipe.id)].slice(0, 20)
        })),
      addRecipeToShoppingList: (recipe) =>
        set((state) => {
          const existing = new Set(state.shopping.map((item) => item.label.trim().toLowerCase()));
          const additions = recipeShoppingItems(recipe)
            .filter((item) => !existing.has(item.label.trim().toLowerCase()))
            .map((item) => ({ ...item, id: createLocalId("shopping"), checked: false }));
          if (!additions.length) return state;
          return { shopping: [...state.shopping, ...additions] };
        }),
      addChatMessage: (message) => set((state) => ({ chat: [...state.chat, message] })),
      setActiveUser: (name) => set({ activeUser: name }),
      loginDemoUser: (user, completed = true) =>
        set({
          authUser: user,
          activeUser: user.displayName,
          isAuthenticated: true,
          onboardingCompleted: completed,
          lastLoginAt: user.lastLoginAt,
          authMode: "demo",
          authProvider: user.provider
        }),
      registerDemoUser: (user) =>
        set({
          authUser: user,
          activeUser: user.displayName,
          isAuthenticated: true,
          onboardingCompleted: false,
          lastLoginAt: user.lastLoginAt,
          authMode: "demo",
          authProvider: user.provider,
          onboardingStep: 0
        }),
      loginWithProvider: (user, completed = true) =>
        set({
          authUser: user,
          activeUser: user.displayName,
          isAuthenticated: true,
          onboardingCompleted: completed,
          lastLoginAt: user.lastLoginAt,
          authMode: "demo",
          authProvider: user.provider
        }),
      logout: () =>
        set({
          authUser: null,
          activeUser: null,
          isAuthenticated: false,
          lastLoginAt: null,
          authProvider: null
        }),
      requestPasswordReset: () => set({}),
      updateAuthUser: (user) =>
        set((state) => {
          const nextUser = state.authUser ? { ...state.authUser, ...user } : null;
          return {
            authUser: nextUser,
            activeUser: nextUser?.displayName || state.activeUser
          };
        }),
      addFamilyMember: (member) =>
        set((state) => ({
          familyMembers: [member, ...state.familyMembers.filter((item) => item.id !== member.id)]
        })),
      updateFamilyMember: (id, member) =>
        set((state) => ({
          familyMembers: state.familyMembers.map((item) => (item.id === id ? { ...item, ...member } : item))
        })),
      removeFamilyMember: (id) =>
        set((state) => ({
          familyMembers: state.familyMembers.filter((item) => item.id !== id)
        })),
      addBabyProfile: (profile) =>
        set((state) => ({
          babyProfiles: [profile, ...state.babyProfiles.filter((item) => item.id !== profile.id)]
        })),
      updateBabyProfile: (id, profile) =>
        set((state) => ({
          babyProfiles: state.babyProfiles.map((item) => (item.id === id ? { ...item, ...profile } : item))
        })),
      removeBabyProfile: (id) =>
        set((state) => ({
          babyProfiles: state.babyProfiles.filter((item) => item.id !== id)
        })),
      updateFamilyPreferences: (preferences) =>
        set((state) => ({
          familyPreferences: { ...state.familyPreferences, ...preferences },
          onboardingDraft: { ...state.onboardingDraft, ...preferences }
        })),
      setOnboardingStep: (step) => set({ onboardingStep: Math.max(0, Math.min(6, step)) }),
      updateOnboardingDraft: (draft) =>
        set((state) => ({ onboardingDraft: { ...state.onboardingDraft, ...draft } })),
      updateDashboardPreferences: (draft) =>
        set((state) => ({ onboardingDraft: { ...state.onboardingDraft, ...draft } })),
      completeOnboarding: (profile) =>
        set((state) => ({
          activeUser: state.authUser?.displayName || "Parent",
          onboardingCompleted: true,
          onboardingStep: 6,
          familyMembers: buildFamilyMembersFromDraft(state.onboardingDraft, state.authUser?.displayName),
          babyProfiles: [profile, ...state.babyProfiles.filter((item) => item.id !== profile.id)],
          familyPreferences: {
            allergies: state.onboardingDraft.allergies,
            dietPreferences: state.onboardingDraft.dietPreferences,
            favoriteCuisines: state.onboardingDraft.favoriteCuisines,
            appliances: state.onboardingDraft.appliances,
            cookingGoals: state.onboardingDraft.cookingGoals
          },
          pantry: Array.from(new Set([...state.pantry, "Oats", "Banana", "Sweet potato", "Greek yogurt"]))
        })),
      upsertRecipe: (recipe, save = true) =>
        set((state) => ({
          recipes: [recipe, ...state.recipes.filter((item) => item.id !== recipe.id)],
          savedRecipeIds: save
            ? Array.from(new Set([recipe.id, ...state.savedRecipeIds]))
            : state.savedRecipeIds
        }))
    }),
    { name: "foody-fam-local" }
  )
);

function buildFamilyMembersFromDraft(draft: OnboardingDraft, displayName?: string): FamilyMember[] {
  const count = Math.max(1, Number.parseInt(draft.familyCount, 10) || 1);
  return Array.from({ length: count }).map((_, index) => ({
    id: index === 0 ? "primary-parent" : `family-member-${index + 1}`,
    name: index === 0 ? displayName || "Parent" : `Family member ${index + 1}`,
    role: index === 0 ? "Parent" : index === 1 ? "Adult" : "Child",
    preferences: index === 0 ? draft.dietPreferences.slice(0, 3) : draft.favoriteCuisines.slice(0, 2)
  }));
}

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function emptyPlannerSlots() {
  return (["Breakfast", "Lunch", "Dinner"] as const).map((mealType) => ({
    mealType,
    meal: "Choose a meal",
    recipeId: ""
  }));
}

function ensurePlannerSlots(day: MealPlanDay) {
  const current = day.slots?.length ? day.slots : emptyPlannerSlots();
  const byType = new Map(current.map((slot) => [slot.mealType, slot]));
  return (["Breakfast", "Lunch", "Dinner"] as const).map((mealType) => {
    const slot = byType.get(mealType);
    if (slot) return slot;
    if (mealType === "Dinner" && day.recipeId) return { mealType, meal: day.meal, recipeId: day.recipeId };
    return { mealType, meal: "Choose a meal", recipeId: "" };
  });
}

function normalizePlannerDay(day: MealPlanDay) {
  return { ...day, slots: ensurePlannerSlots(day) };
}

function recipeShoppingItems(recipe: Recipe) {
  const grouped = recipe.shoppingList?.flatMap((group) =>
    group.items.map((label) => ({ label, category: group.category || "Recipe" }))
  );
  const items = grouped?.length ? grouped : recipe.ingredients.map((label) => ({ label, category: "Recipe" }));
  return items.filter((item) => item.label.trim());
}
