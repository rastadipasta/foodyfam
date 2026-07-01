import type { BabyProfile, ChatMessage, FamilyMember, MealPlanDay, Recipe, ShoppingListItem } from "./types";

export const brand = {
  colors: ["#FFCCB2", "#F59B78", "#E9C7B7", "#F7EFE9", "#5C4A42"],
  logo: "/brand/logo.png",
  hero: "/brand/generated/hero-family-meal.png"
};

export const demoRecipes: Recipe[] = [
  {
    id: "risotto",
    title: "Chicken & Broccoli Risotto",
    slug: "chicken-broccoli-risotto",
    image: "/brand/generated/hero-family-meal.png",
    time: "25 min",
    difficulty: "Easy",
    servings: 4,
    rating: 4.9,
    tags: ["Italian", "Baby-led", "Iron rich"],
    ingredients: ["Chicken", "Broccoli", "Rice", "Carrots", "Onion", "Parmesan"],
    ingredientDetails: [
      { name: "Chicken breast", quantity: 450, unit: "g", note: "diced small" },
      { name: "Broccoli", quantity: 220, unit: "g", note: "tiny florets" },
      { name: "Risotto rice", quantity: 280, unit: "g" },
      { name: "Carrots", quantity: 2, unit: "medium", note: "finely diced" },
      { name: "Onion", quantity: 1, unit: "small", note: "finely diced" },
      { name: "Parmesan", quantity: 40, unit: "g", note: "adult finish", optional: true }
    ],
    steps: [
      "Cook rice until soft and creamy.",
      "Add chicken and vegetables until tender.",
      "Baby portion: remove a salt-free serving before adding parmesan or pepper.",
      "Baby portion: blend or mash with cooking liquid to the right texture.",
      "Adult finish: add parmesan, black pepper, and a small pinch of salt, then serve warm."
    ],
    baby: ["Blend until smooth", "No salt", "Small soft flakes", "Serve lukewarm"],
    adults: ["Add parmesan", "Salt and pepper", "Optional chili flakes", "Serve hot"],
    nutrition: {
      protein: 92,
      iron: "Excellent",
      vitaminC: "High",
      fiber: "BLW friendly",
      calories: 510
    }
  },
  {
    id: "pasta",
    title: "Sweet Tomato Turkey Pasta",
    slug: "sweet-tomato-turkey-pasta",
    image: "/brand/generated/ai-generator-ingredients.png",
    time: "30 min",
    difficulty: "Easy",
    servings: 4,
    rating: 4.8,
    tags: ["Freezer friendly", "Toddler favorite", "Protein"],
    ingredients: ["Turkey", "Pasta", "Tomatoes", "Zucchini", "Basil"],
    ingredientDetails: [
      { name: "Ground turkey", quantity: 400, unit: "g" },
      { name: "Small pasta", quantity: 320, unit: "g" },
      { name: "Crushed tomatoes", quantity: 400, unit: "g" },
      { name: "Zucchini", quantity: 1, unit: "medium", note: "grated" },
      { name: "Basil", quantity: 10, unit: "g", note: "adult finish", optional: true }
    ],
    steps: ["Simmer turkey sauce until fully cooked.", "Cook pasta soft.", "Baby portion: separate pasta and sauce before salt or pepper.", "Baby portion: cut pasta safely and mash zucchini into sauce.", "Adult finish: add basil, olive oil, pepper, and salt to family plates."],
    baby: ["Tiny pasta cuts", "No added salt", "Mash zucchini", "Cool before serving"],
    adults: ["Add basil", "Finish with olive oil", "Black pepper", "Serve with salad"],
    nutrition: { protein: 86, iron: "Good", vitaminC: "Medium", fiber: "High", calories: 560 }
  },
  {
    id: "curry",
    title: "Mild Coconut Lentil Curry",
    slug: "mild-coconut-lentil-curry",
    image: "/brand/generated/nutrition-balance.png",
    time: "35 min",
    difficulty: "Medium",
    servings: 5,
    rating: 4.7,
    tags: ["Vegetarian", "Dairy free", "Batch cook"],
    ingredients: ["Lentils", "Coconut milk", "Spinach", "Rice", "Carrots"],
    ingredientDetails: [
      { name: "Red lentils", quantity: 260, unit: "g", note: "rinsed" },
      { name: "Coconut milk", quantity: 400, unit: "ml" },
      { name: "Spinach", quantity: 120, unit: "g", note: "chopped" },
      { name: "Rice", quantity: 280, unit: "g" },
      { name: "Carrots", quantity: 2, unit: "medium", note: "diced" }
    ],
    steps: ["Cook lentils with carrots until very soft.", "Stir in coconut milk and simmer gently.", "Baby portion: remove a mild portion before curry paste, salt, or chili.", "Baby portion: mash lentils with soft rice and check texture.", "Adult finish: add curry paste, lime, cilantro, and seasoning to adult bowls."],
    baby: ["Mash lentils", "Mild spices only", "Serve with soft rice", "Check texture"],
    adults: ["Add curry paste", "Lime finish", "Fresh cilantro", "Serve warm"],
    nutrition: { protein: 78, iron: "Excellent", vitaminC: "Good", fiber: "Very high", calories: 490 }
  }
];

export const babyProfiles: BabyProfile[] = [
  { id: "emma", name: "Emma", age: "8 months", style: "Mixed", allergies: ["Egg"] },
  { id: "noah", name: "Noah", age: "3 years", style: "BLW", allergies: [] }
];

export const familyMembers: FamilyMember[] = [
  { id: "mom", name: "Mia", role: "Mom", preferences: ["Low salt", "Mediterranean"] },
  { id: "dad", name: "Mark", role: "Dad", preferences: ["High protein", "Quick dinners"] },
  { id: "kid", name: "Luka", role: "Kid", preferences: ["No mushrooms", "Pasta"] }
];

export const initialPlanner: MealPlanDay[] = [
  {
    day: "Monday",
    meal: "Chicken & Broccoli Risotto",
    recipeId: "risotto",
    slots: [
      { mealType: "Breakfast", meal: "Choose a meal", recipeId: "" },
      { mealType: "Lunch", meal: "Mild Coconut Lentil Curry", recipeId: "curry" },
      { mealType: "Dinner", meal: "Chicken & Broccoli Risotto", recipeId: "risotto" }
    ]
  },
  {
    day: "Tuesday",
    meal: "Sweet Tomato Turkey Pasta",
    recipeId: "pasta",
    slots: [
      { mealType: "Breakfast", meal: "Choose a meal", recipeId: "" },
      { mealType: "Lunch", meal: "Chicken & Broccoli Risotto", recipeId: "risotto" },
      { mealType: "Dinner", meal: "Sweet Tomato Turkey Pasta", recipeId: "pasta" }
    ]
  },
  {
    day: "Wednesday",
    meal: "Mild Coconut Lentil Curry",
    recipeId: "curry",
    slots: [
      { mealType: "Breakfast", meal: "Choose a meal", recipeId: "" },
      { mealType: "Lunch", meal: "Sweet Tomato Turkey Pasta", recipeId: "pasta" },
      { mealType: "Dinner", meal: "Mild Coconut Lentil Curry", recipeId: "curry" }
    ]
  },
  {
    day: "Thursday",
    meal: "Chicken & Broccoli Risotto",
    recipeId: "risotto",
    slots: [
      { mealType: "Breakfast", meal: "Choose a meal", recipeId: "" },
      { mealType: "Lunch", meal: "Choose a meal", recipeId: "" },
      { mealType: "Dinner", meal: "Chicken & Broccoli Risotto", recipeId: "risotto" }
    ]
  },
  {
    day: "Friday",
    meal: "Mild Coconut Lentil Curry",
    recipeId: "curry",
    slots: [
      { mealType: "Breakfast", meal: "Choose a meal", recipeId: "" },
      { mealType: "Lunch", meal: "Choose a meal", recipeId: "" },
      { mealType: "Dinner", meal: "Mild Coconut Lentil Curry", recipeId: "curry" }
    ]
  },
  {
    day: "Saturday",
    meal: "Sweet Tomato Turkey Pasta",
    recipeId: "pasta",
    slots: [
      { mealType: "Breakfast", meal: "Choose a meal", recipeId: "" },
      { mealType: "Lunch", meal: "Choose a meal", recipeId: "" },
      { mealType: "Dinner", meal: "Sweet Tomato Turkey Pasta", recipeId: "pasta" }
    ]
  },
  {
    day: "Sunday",
    meal: "Chicken & Broccoli Risotto",
    recipeId: "risotto",
    slots: [
      { mealType: "Breakfast", meal: "Choose a meal", recipeId: "" },
      { mealType: "Lunch", meal: "Choose a meal", recipeId: "" },
      { mealType: "Dinner", meal: "Chicken & Broccoli Risotto", recipeId: "risotto" }
    ]
  }
];

export const initialShopping: ShoppingListItem[] = [
  { id: "broccoli", label: "Broccoli", category: "Vegetables", checked: false },
  { id: "carrots", label: "Carrots", category: "Vegetables", checked: true },
  { id: "chicken", label: "Chicken breast", category: "Meat", checked: false },
  { id: "rice", label: "Risotto rice", category: "Pantry", checked: false },
  { id: "milk", label: "Coconut milk", category: "Pantry", checked: true },
  { id: "parmesan", label: "Parmesan", category: "Dairy", checked: false }
];

export const initialChat: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Ask me about swaps, allergies, freezing, textures, or how to turn dinner into a baby-safe portion."
  }
];

export const blogPosts = [
  "How to stop cooking two dinners",
  "Baby-led weaning without the chaos",
  "Freezer-friendly meals that still feel fresh"
];

export const pagePhotos = {
  hero: "/brand/generated/hero-family-meal.png",
  generator: "/brand/generated/ai-generator-ingredients.png",
  recipes: "/brand/generated/hero-family-meal.png",
  planner: "/brand/generated/weekly-planner.png",
  shopping: "/brand/generated/shopping-pantry.png",
  pantry: "/brand/generated/shopping-pantry.png",
  nutrition: "/brand/generated/nutrition-balance.png",
  assistant: "/brand/generated/ai-assistant-safety.png",
  pricing: "/brand/generated/brand-editorial.png",
  blog: "/brand/generated/brand-editorial.png",
  about: "/brand/generated/onboarding-family.png",
  contact: "/brand/generated/brand-editorial.png",
  auth: "/brand/generated/onboarding-family.png",
  onboarding: "/brand/generated/onboarding-family.png"
};

export const familyMoments = [
  {
    title: "Sunday batch base",
    body: "A soft vegetable base becomes baby puree, toddler pasta sauce, and an adult grain bowl.",
    image: pagePhotos.planner
  },
  {
    title: "Allergy-aware swaps",
    body: "Profiles keep egg, dairy, gluten, and texture notes visible before the recipe is generated.",
    image: pagePhotos.assistant
  },
  {
    title: "One shopping rhythm",
    body: "Pantry items, planner meals, and saved recipes collapse into one family grocery list.",
    image: pagePhotos.shopping
  }
];

export const testimonials = [
  "Foody Fam stopped us from cooking two separate dinners.",
  "The baby-friendly instructions are a game changer.",
  "Healthy, easy, and so much less stress at dinner time."
];
