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
  FamilyMember,
  MealPlanDay,
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
  saveRecipe: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  addPantryItem: (label: string) => void;
  removePantryItem: (label: string) => void;
  setPlannerMeal: (day: string, recipeId: string) => void;
  addRecipeToPlanner: (day: string, recipe: Recipe) => void;
  removeRecipeFromPlanner: (recipeId: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  setActiveUser: (name: string | null) => void;
  loginDemoUser: (user: AuthUser, onboardingCompleted?: boolean) => void;
  registerDemoUser: (user: AuthUser) => void;
  loginWithProvider: (user: AuthUser, onboardingCompleted?: boolean) => void;
  logout: () => void;
  requestPasswordReset: (email: string) => void;
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
      addPantryItem: (label) =>
        set((state) => {
          const normalized = label.trim();
          if (!normalized || state.pantry.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
            return state;
          }
          return { pantry: [...state.pantry, normalized] };
        }),
      removePantryItem: (label) => set((state) => ({ pantry: state.pantry.filter((item) => item !== label) })),
      setPlannerMeal: (day, recipeId) =>
        set((state) => {
          if (!recipeId) {
            return {
              planner: state.planner.map((item) =>
                item.day === day ? { ...item, recipeId: "", meal: "Choose a meal" } : item
              )
            };
          }
          const recipe = state.recipes.find((item) => item.id === recipeId);
          return {
            planner: state.planner.map((item) =>
              item.day === day && recipe ? { ...item, recipeId, meal: recipe.title } : item
            )
          };
        }),
      addRecipeToPlanner: (day, recipe) =>
        set((state) => ({
          recipes: [recipe, ...state.recipes.filter((item) => item.id !== recipe.id)],
          savedRecipeIds: Array.from(new Set([recipe.id, ...state.savedRecipeIds])),
          planner: state.planner.map((item) =>
            item.day === day ? { ...item, recipeId: recipe.id, meal: recipe.title } : item
          )
        })),
      removeRecipeFromPlanner: (recipeId) =>
        set((state) => ({
          planner: state.planner.map((item) =>
            item.recipeId === recipeId ? { ...item, recipeId: "", meal: "Choose a meal" } : item
          )
        })),
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
          babyProfiles: [profile, ...state.babyProfiles.filter((item) => item.id !== profile.id)],
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
