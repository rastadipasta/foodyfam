import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "data", "recipe-database.json");
const recipes = JSON.parse(fs.readFileSync(file, "utf8"));

const allowedMealTypes = new Set(["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"]);
const allowedDifficulties = new Set(["Easy", "Medium", "Hard"]);
const required = [
  "id",
  "title",
  "slug",
  "description",
  "mealType",
  "cuisine",
  "difficulty",
  "prepTime",
  "cookTime",
  "servings",
  "ingredients",
  "steps",
  "babyAdaptations",
  "toddlerAdaptation",
  "adultFinishing",
  "nutrition",
  "allergens",
  "blwStatus",
  "freezerFriendly",
  "appliances",
  "proteinType",
  "tags",
  "aiTags",
  "shoppingList",
  "primaryCategory"
];

const errors = [];
const warnings = [];
const slugs = new Set();

for (const recipe of recipes) {
  for (const key of required) {
    if (!(key in recipe)) errors.push(`${recipe.slug || recipe.title || "unknown"} missing ${key}`);
  }
  if (slugs.has(recipe.slug)) errors.push(`Duplicate slug ${recipe.slug}`);
  slugs.add(recipe.slug);
  if (!allowedMealTypes.has(recipe.mealType)) errors.push(`${recipe.slug} invalid mealType ${recipe.mealType}`);
  if (!allowedDifficulties.has(recipe.difficulty)) errors.push(`${recipe.slug} invalid difficulty ${recipe.difficulty}`);
  for (const age of ["6-8", "8-10", "10-12", "toddler"]) {
    if (!recipe.babyAdaptations?.[age]) errors.push(`${recipe.slug} missing baby adaptation ${age}`);
  }
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length < 3) errors.push(`${recipe.slug} needs at least 3 ingredients`);
  if (!Array.isArray(recipe.steps) || recipe.steps.length < 5) errors.push(`${recipe.slug} needs at least 5 steps`);
  if (!Array.isArray(recipe.shoppingList) || recipe.shoppingList.length < 2) errors.push(`${recipe.slug} needs grouped shopping list`);
  if (!Array.isArray(recipe.aiTags) || !recipe.aiTags.includes("baby portion first")) warnings.push(`${recipe.slug} should include baby portion first AI tag`);
  if (!recipe.steps.some((step) => /baby portion/i.test(step))) warnings.push(`${recipe.slug} should explicitly separate baby portion`);
  if (recipe.allergens?.includes("egg") && !/egg/i.test([recipe.title, ...recipe.ingredients].join(" "))) warnings.push(`${recipe.slug} egg allergen may need review`);
}

function tokens(value) {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function basicMatch(input) {
  const ingredientTokens = tokens(`${input.ingredients || ""} ${input.pantryItems || ""}`);
  const allergyTokens = tokens(input.allergies || "");
  const avoidTokens = tokens(input.avoidIngredients || "");
  return [...recipes]
    .map((recipe) => {
      const searchable = [recipe.title, recipe.mealType, recipe.cuisine, recipe.proteinType, ...recipe.ingredients, ...recipe.tags, ...recipe.aiTags, ...recipe.appliances].join(" ").toLowerCase();
      const unsafe = allergyTokens.filter((token) => recipe.allergens.includes(token)).length + avoidTokens.filter((token) => searchable.includes(token)).length;
      const hits = ingredientTokens.filter((token) => searchable.includes(token)).length;
      let score = hits * 30 - unsafe * 1000;
      if (input.mealType && searchable.includes(input.mealType.toLowerCase())) score += 40;
      if (input.cuisine && searchable.includes(input.cuisine.toLowerCase())) score += 25;
      if (input.appliances && searchable.includes(input.appliances.toLowerCase())) score += 25;
      if (input.diet?.toLowerCase().includes("vegetarian") && recipe.proteinType === "Vegetarian") score += 80;
      return { recipe, score };
    })
    .sort((a, b) => b.score - a.score)[0].recipe;
}

const scenarios = [
  {
    name: "chicken broccoli rice",
    input: { ingredients: "chicken broccoli rice", babyAge: "6-8 months" },
    expect: (recipe) => /chicken/i.test(recipe.title) && recipe.ingredients.join(" ").toLowerCase().includes("rice")
  },
  {
    name: "egg allergy",
    input: { ingredients: "oats banana", allergies: "egg" },
    expect: (recipe) => !recipe.allergens.includes("egg")
  },
  {
    name: "air fryer",
    input: { ingredients: "turkey carrot", appliances: "air fryer" },
    expect: (recipe) => recipe.appliances.includes("Air fryer")
  },
  {
    name: "vegetarian dinner under 30",
    input: { ingredients: "lentils tomato", mealType: "Dinner", diet: "vegetarian", cookingTime: "30 min" },
    expect: (recipe) => recipe.proteinType === "Vegetarian" && recipe.mealType === "Dinner"
  }
];

for (const scenario of scenarios) {
  const match = basicMatch(scenario.input);
  if (!scenario.expect(match)) errors.push(`Scenario failed: ${scenario.name} matched ${match.title}`);
}

if (recipes.length !== 100) errors.push(`Expected 100 recipes, found ${recipes.length}`);

if (warnings.length) {
  console.log(`Recipe warnings (${warnings.length}):`);
  for (const warning of warnings.slice(0, 20)) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error(`Recipe validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Recipe database validation passed: ${recipes.length} recipes, ${slugs.size} unique slugs.`);
