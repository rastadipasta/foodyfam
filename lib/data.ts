import type { BabyProfile, ChatMessage, FamilyMember, MealPlanDay, Recipe, ShoppingListItem } from "./types";

export const brand = {
  colors: ["#FFCCB2", "#F59B78", "#E9C7B7", "#F7EFE9", "#5C4A42"],
  logo: "/brand/logo.png",
  reference: "/brand/reference.png"
};

export const demoRecipes: Recipe[] = [
  {
    id: "risotto",
    title: "Chicken & Broccoli Risotto",
    slug: "chicken-broccoli-risotto",
    image: "/brand/reference.png",
    time: "25 min",
    difficulty: "Easy",
    servings: 4,
    rating: 4.9,
    tags: ["Italian", "Baby-led", "Iron rich"],
    ingredients: ["Chicken", "Broccoli", "Rice", "Carrots", "Onion", "Parmesan"],
    steps: [
      "Cook rice until soft and creamy.",
      "Add chicken and vegetables until tender.",
      "Remove baby's portion before seasoning.",
      "Blend or mash baby's portion to the right texture.",
      "Season the adult portion and finish warm."
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
    image: "/brand/reference.png",
    time: "30 min",
    difficulty: "Easy",
    servings: 4,
    rating: 4.8,
    tags: ["Freezer friendly", "Toddler favorite", "Protein"],
    ingredients: ["Turkey", "Pasta", "Tomatoes", "Zucchini", "Basil"],
    steps: ["Simmer turkey sauce.", "Cook pasta soft.", "Separate baby portion.", "Cut pasta safely.", "Season family plates."],
    baby: ["Tiny pasta cuts", "No added salt", "Mash zucchini", "Cool before serving"],
    adults: ["Add basil", "Finish with olive oil", "Black pepper", "Serve with salad"],
    nutrition: { protein: 86, iron: "Good", vitaminC: "Medium", fiber: "High", calories: 560 }
  },
  {
    id: "curry",
    title: "Mild Coconut Lentil Curry",
    slug: "mild-coconut-lentil-curry",
    image: "/brand/reference.png",
    time: "35 min",
    difficulty: "Medium",
    servings: 5,
    rating: 4.7,
    tags: ["Vegetarian", "Dairy free", "Batch cook"],
    ingredients: ["Lentils", "Coconut milk", "Spinach", "Rice", "Carrots"],
    steps: ["Cook lentils with carrots.", "Stir in coconut milk.", "Remove baby portion.", "Add spinach.", "Season adult bowls."],
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
  { day: "Monday", meal: "Chicken & Broccoli Risotto", recipeId: "risotto" },
  { day: "Tuesday", meal: "Sweet Tomato Turkey Pasta", recipeId: "pasta" },
  { day: "Wednesday", meal: "Mild Coconut Lentil Curry", recipeId: "curry" },
  { day: "Thursday", meal: "Leftover risotto cakes", recipeId: "risotto" },
  { day: "Friday", meal: "Family veggie tray", recipeId: "curry" },
  { day: "Saturday", meal: "Pantry pasta night", recipeId: "pasta" },
  { day: "Sunday", meal: "Cook-once roast bowl", recipeId: "risotto" }
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
  generator: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1100&q=80",
  recipes: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1100&q=80",
  planner: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1100&q=80",
  shopping: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1100&q=80",
  pantry: "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=1100&q=80",
  nutrition: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1100&q=80",
  assistant: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1100&q=80",
  pricing: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1100&q=80",
  blog: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1100&q=80",
  about: "https://images.unsplash.com/photo-1556911073-52527ac43761?auto=format&fit=crop&w=1100&q=80",
  contact: "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1100&q=80",
  auth: "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=1100&q=80",
  onboarding: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1100&q=80"
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
