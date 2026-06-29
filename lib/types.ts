export type BabyProfile = {
  id: string;
  name: string;
  age: string;
  style: "Puree" | "BLW" | "Mixed";
  allergies: string[];
};

export type FamilyMember = {
  id: string;
  name: string;
  role: string;
  preferences: string[];
};

export type Recipe = {
  id: string;
  title: string;
  slug: string;
  image: string;
  description?: string;
  familyPitch?: string;
  whyItWorks?: string[];
  safetyNotes?: string[];
  babyTexture?: string;
  shoppingList?: {
    category: string;
    items: string[];
  }[];
  prepSteps?: string[];
  cookingSteps?: string[];
  babyVersion?: string[];
  adultVersion?: string[];
  storage?: string[];
  leftovers?: string[];
  nutritionSummary?: string[];
  allergyWarnings?: string[];
  time: string;
  difficulty: string;
  servings: number;
  rating: number;
  tags: string[];
  ingredients: string[];
  steps: string[];
  baby: string[];
  adults: string[];
  nutrition: {
    protein: number;
    iron: string;
    vitaminC: string;
    fiber: string;
    calories: number;
  };
};

export type MealPlanDay = {
  day: string;
  meal: string;
  recipeId: string;
};

export type ShoppingListItem = {
  id: string;
  label: string;
  category: string;
  checked: boolean;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
