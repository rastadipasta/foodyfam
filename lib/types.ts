export type BabyProfile = {
  id: string;
  name: string;
  age: string;
  style: "Puree" | "BLW" | "Mixed";
  allergies: string[];
};

export type AuthProvider = "password" | "google" | "apple";

export type AuthMode = "demo" | "supabase";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  provider: AuthProvider;
  providerId?: string;
  emailVerified: boolean;
  lastLoginAt: string;
};

export type OnboardingDraft = {
  familyCount: string;
  babyName: string;
  babyAge: string;
  babyStyle: BabyProfile["style"];
  allergies: string[];
  dietPreferences: string[];
  favoriteCuisines: string[];
  appliances: string[];
  cookingGoals: string[];
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
  databaseMatch?: RecipeDatabaseMatch;
};

export type DatabaseRecipe = {
  id: string;
  title: string;
  slug: string;
  description: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Dessert";
  cuisine: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  babyAdaptations: {
    "6-8": string;
    "8-10": string;
    "10-12": string;
    toddler: string;
  };
  toddlerAdaptation: string;
  adultFinishing: {
    seasoning: string[];
    steps: string[];
  };
  nutrition: {
    calories: number;
    protein: number;
    iron: string;
    vitaminC: string;
    fiber: string;
  };
  allergens: string[];
  blwStatus: "BLW-friendly" | "Adaptable" | "Not BLW";
  freezerFriendly: boolean;
  appliances: string[];
  proteinType: string;
  tags: string[];
  aiTags: string[];
  shoppingList: {
    category: string;
    items: string[];
  }[];
  primaryCategory: string;
};

export type RecipeMatchInput = {
  ingredients?: string;
  pantryItems?: string;
  babyAge?: string;
  allergies?: string;
  avoidIngredients?: string;
  mealType?: string;
  cuisine?: string;
  cookingTime?: string;
  appliances?: string;
  diet?: string;
  feedingStyle?: string;
};

export type RecipeDatabaseMatch = {
  source: "foody-fam-database";
  baseRecipeSlug: string;
  baseRecipeTitle: string;
  score: number;
  pantryMatch: number;
  allergyFlags: string[];
  ageAdaptation: "6-8" | "8-10" | "10-12" | "toddler";
  matchReasons: string[];
  aiChanges: string[];
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
