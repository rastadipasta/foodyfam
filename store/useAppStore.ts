"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { babyProfiles, demoRecipes, familyMembers, initialChat, initialPlanner, initialShopping } from "@/lib/data";
import type { BabyProfile, ChatMessage, FamilyMember, MealPlanDay, Recipe, ShoppingListItem } from "@/lib/types";

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
  saveRecipe: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  addPantryItem: (label: string) => void;
  removePantryItem: (label: string) => void;
  setPlannerMeal: (day: string, recipeId: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  setActiveUser: (name: string | null) => void;
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
          const recipe = state.recipes.find((item) => item.id === recipeId);
          return {
            planner: state.planner.map((item) =>
              item.day === day && recipe ? { ...item, recipeId, meal: recipe.title } : item
            )
          };
        }),
      addChatMessage: (message) => set((state) => ({ chat: [...state.chat, message] })),
      setActiveUser: (name) => set({ activeUser: name }),
      completeOnboarding: (profile) =>
        set((state) => ({
          activeUser: "Parent",
          babyProfiles: [profile, ...state.babyProfiles.filter((item) => item.id !== profile.id)]
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
