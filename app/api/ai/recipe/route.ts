import { NextResponse } from "next/server";
import { createDemoRecipe } from "@/lib/ai-demo";
import { applyBabyNutritionGuardrails, babyNutritionPrompt } from "@/lib/baby-nutrition";
import { buildCompactRecipeContext, buildGeneratorPreflight, FAMILY_RECIPE_RESEARCH_PACK } from "@/lib/family-recipe-intelligence";
import { databaseRecipeToRecipe, findBestRecipeMatch } from "@/lib/recipe-database";
import { normalizeRecipeFlow } from "@/lib/recipe-flow";
import type { Recipe, RecipeMatchInput } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const fallbackRecipeImage = "/brand/generated/hero-family-meal.png";

const stringArray = { type: "array", items: { type: "string" } };
const ingredientDetailsSchema = {
  type: "array",
  items: {
    type: "object",
    additionalProperties: false,
    required: ["name", "quantity", "unit", "note", "optional"],
    properties: {
      name: { type: "string" },
      quantity: { type: "number" },
      unit: { type: "string" },
      note: { type: "string" },
      optional: { type: "boolean" }
    }
  }
};

const recipeSchema = {
  type: "object",
  additionalProperties: false,
  required: ["recipe"],
  properties: {
    recipe: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "title",
        "slug",
        "image",
        "description",
        "familyPitch",
        "whyItWorks",
        "safetyNotes",
        "babyTexture",
        "shoppingList",
        "prepSteps",
        "cookingSteps",
        "babyVersion",
        "adultVersion",
        "storage",
        "leftovers",
        "nutritionSummary",
        "allergyWarnings",
        "time",
        "difficulty",
        "servings",
        "rating",
        "tags",
        "ingredients",
        "ingredientDetails",
        "steps",
        "baby",
        "adults",
        "nutrition"
      ],
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        slug: { type: "string" },
        image: { type: "string" },
        description: { type: "string" },
        familyPitch: { type: "string" },
        whyItWorks: stringArray,
        safetyNotes: stringArray,
        babyTexture: { type: "string" },
        shoppingList: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["category", "items"],
            properties: {
              category: { type: "string" },
              items: stringArray
            }
          }
        },
        prepSteps: stringArray,
        cookingSteps: stringArray,
        babyVersion: stringArray,
        adultVersion: stringArray,
        storage: stringArray,
        leftovers: stringArray,
        nutritionSummary: stringArray,
        allergyWarnings: stringArray,
        time: { type: "string" },
        difficulty: { type: "string" },
        servings: { type: "number" },
        rating: { type: "number" },
        tags: { type: "array", items: { type: "string" } },
        ingredients: { type: "array", items: { type: "string" } },
        ingredientDetails: ingredientDetailsSchema,
        steps: { type: "array", items: { type: "string" } },
        baby: { type: "array", items: { type: "string" } },
        adults: { type: "array", items: { type: "string" } },
        nutrition: {
          type: "object",
          additionalProperties: false,
          required: ["protein", "iron", "vitaminC", "fiber", "calories"],
          properties: {
            protein: { type: "number" },
            iron: { type: "string" },
            vitaminC: { type: "string" },
            fiber: { type: "string" },
            calories: { type: "number" }
          }
        }
      }
    }
  }
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as RecipeMatchInput & {
    ingredients?: string;
    babyAge?: string;
    cuisine?: string;
    cookingTime?: string;
    diet?: string;
    servings?: string;
    babyProfile?: string;
    allergies?: string;
    pantryItems?: string;
    babyTexture?: string;
    feedingStyle?: string;
    appliances?: string;
    skillLevel?: string;
    avoidIngredients?: string;
    mealType?: string;
    goal?: string;
    subscriptionStatus?: "Free" | "Premium" | "Family" | "Unlimited";
  };
  const matched = findBestRecipeMatch(body);
  const preflight = buildGeneratorPreflight(body, matched?.match);
  const matchedRecipe = finalizeRecipeForRequest(
    normalizeRecipeFlow(applyBabyNutritionGuardrails(matched ? databaseRecipeToRecipe(matched.recipe, matched.match) : createDemoRecipe(body), body)),
    body
  );
  const includeGeneratedImage = body.subscriptionStatus === "Premium" || body.subscriptionStatus === "Family" || body.subscriptionStatus === "Unlimited";
  const recipeWithPlanImage = (recipe: Recipe) => withPlanRecipeImage(recipe, includeGeneratedImage);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      recipe: { ...matchedRecipe, image: "" },
      source: "database-demo",
      warning: "OpenAI API key is missing, so recipe text and image generation used local fallback.",
      databaseMatch: matched?.match,
      preflight
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_RECIPE_MODEL || process.env.OPENAI_MODEL || "gpt-5.4-nano",
        input: [
          {
            role: "system",
            content:
              [
                "You create Foody Fam recipes for the product promise: One meal, whole family.",
                "Always design one shared cooking process with a gentle base, a baby portion removed before salt/spice, then adult finishing instructions.",
                "The user-provided Ingredients are mandatory and are the source of truth for the final recipe title, ingredientDetails, shoppingList, and cooking flow.",
                "If the verified database recipe uses different ingredients, use it only as a cooking pattern and adapt it to the user's ingredients instead of returning the database ingredients.",
                "The main recipe value is ingredients with quantities and one canonical ordered cookingSteps array.",
                "Return 4-5 cookingSteps only; no duplicate baby/adult wording; no separate repeated instruction lists.",
                "Do not repeat the same instructions across cookingSteps, steps, babyVersion, and adultVersion.",
                "cookingSteps and steps must contain the same exact ordered flow: prep/base first, then 'Baby portion:' removal and texture steps, then 'Adult finish:' seasoning steps.",
                "babyVersion must be a short baby serving summary only, not a repeated step list. adultVersion must be a short adult serving summary only, not a repeated step list.",
                "Always include ingredientDetails with practical metric quantities, units, note as an empty string when not needed, and optional false unless it is truly optional.",
                "Use the provided Foody Fam verified database recipe as the trusted base. Adapt it, but do not ignore it or invent an unrelated recipe.",
                "Return practical family cooking language, not medical advice. Allergy and baby safety notes must be cautious and recommend checking with a qualified professional when needed.",
                FAMILY_RECIPE_RESEARCH_PACK,
                babyNutritionPrompt(body),
                "Keep the recipe realistic, weeknight-friendly, and grounded in the provided pantry, appliances, timing, skill level, and avoid list.",
                "The output must match the provided JSON schema exactly."
              ].join(" ")
          },
          {
            role: "user",
            content: [
              `Ingredients: ${body.ingredients || "family pantry"}.`,
              `Mandatory final ingredient list from the user: ${parseRequestedIngredients(body.ingredients).join(", ") || "not provided"}.`,
              `Pantry items: ${body.pantryItems || "not provided"}.`,
              `Baby profile: ${body.babyProfile || "baby"}; baby age: ${body.babyAge || "8 months"}; texture: ${body.babyTexture || "age-appropriate"}; feeding style: ${body.feedingStyle || "mixed"}.`,
              `Servings: ${body.servings || "4"}. Meal type: ${body.mealType || "dinner"}. Cuisine: ${body.cuisine || "flexible"}.`,
              `Time: ${body.cookingTime || "30 minutes"}. Appliances: ${body.appliances || "stovetop"}. Skill level: ${body.skillLevel || "easy"}.`,
              `Diet/allergy notes: ${body.diet || "none"}. Known allergies: ${body.allergies || "none"}. Avoid ingredients: ${body.avoidIngredients || "none"}.`,
              `Goal: ${body.goal || "Cook once for baby and adults."}`,
              `Preflight summary: ${JSON.stringify(preflight)}.`,
              `Compact recipe context:\n${buildCompactRecipeContext(body, matched?.recipe)}.`,
              `Match metadata: ${matched ? JSON.stringify(matched.match) : "none"}.`
            ].join(" ")
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "foody_fam_recipe",
            strict: true,
            schema: recipeSchema
          }
        }
      })
    });

    if (!response.ok) {
      return NextResponse.json({
        recipe: await recipeWithPlanImage({ ...matchedRecipe, image: fallbackRecipeImage }),
        source: "database-demo",
        warning: "OpenAI request failed",
        databaseMatch: matched?.match,
        preflight
      });
    }

    const data = (await response.json()) as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
    const text = data.output_text || data.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text;
    const parsed = text ? (JSON.parse(text) as { recipe?: Recipe }) : { recipe: matchedRecipe };
    if (!parsed.recipe?.title || !parsed.recipe?.description || !Array.isArray(parsed.recipe.shoppingList)) {
      return NextResponse.json({
        recipe: await recipeWithPlanImage({ ...matchedRecipe, image: fallbackRecipeImage }),
        source: "database-demo",
        warning: "OpenAI schema validation failed",
        databaseMatch: matched?.match,
        preflight
      });
    }
    const guardedRecipe = finalizeRecipeForRequest(
      normalizeRecipeFlow(applyBabyNutritionGuardrails({ ...parsed.recipe, image: fallbackRecipeImage, databaseMatch: matched?.match }, body)),
      body
    );
    return NextResponse.json({
      recipe: await recipeWithPlanImage(guardedRecipe),
      source: "openai",
      databaseMatch: matched?.match,
      preflight
    });
  } catch {
    return NextResponse.json({
      recipe: await recipeWithPlanImage({ ...matchedRecipe, image: fallbackRecipeImage }),
      source: "database-demo",
      warning: "OpenAI parsing failed",
      databaseMatch: matched?.match,
      preflight
    });
  }
}

async function withPlanRecipeImage(recipe: Recipe, includeGeneratedImage: boolean): Promise<Recipe> {
  if (!includeGeneratedImage) return { ...recipe, image: "" };
  return withGeneratedRecipeImage(recipe);
}

async function withGeneratedRecipeImage(recipe: Recipe): Promise<Recipe> {
  const generatedImage = await generateRecipeImage(recipe);
  return { ...recipe, image: generatedImage || "" };
}

async function generateRecipeImage(recipe: Recipe) {
  if (!process.env.OPENAI_API_KEY) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1-mini",
        prompt: buildRecipeImagePrompt(recipe),
        size: resolveOpenAIImageSize(process.env.OPENAI_IMAGE_SIZE),
        quality: process.env.OPENAI_IMAGE_QUALITY || "medium",
        output_format: process.env.OPENAI_IMAGE_FORMAT || "webp",
        output_compression: Number(process.env.OPENAI_IMAGE_COMPRESSION || 80),
        n: 1
      })
    });

    if (!response.ok) {
      console.warn("[foody-fam] recipe image generation failed", await response.text().catch(() => "Unknown image API error"));
      return null;
    }
    const data = (await response.json()) as { data?: Array<{ b64_json?: string }> };
    const imageBase64 = data.data?.[0]?.b64_json;
    if (!imageBase64) return null;
    return `data:image/${process.env.OPENAI_IMAGE_FORMAT || "webp"};base64,${imageBase64}`;
  } catch {
    return null;
  }
}

function buildRecipeImagePrompt(recipe: Recipe) {
  const ingredients = recipe.ingredientDetails?.length
    ? recipe.ingredientDetails.map((item) => item.name).slice(0, 8)
    : recipe.ingredients.slice(0, 8);

  return [
    `Create a square food photo of the finished prepared dish for this Foody Fam recipe: ${recipe.title}.`,
    `The final cooked meal should naturally contain these ingredients: ${ingredients.join(", ")}.`,
    "Show one cohesive, ready-to-eat plated meal in a ceramic bowl or on a plate, with the ingredients cooked together as the finished recipe.",
    "Do not show raw ingredients, separated ingredient piles, a deconstructed plate, prep bowls, shopping ingredients, or multiple unfinished components arranged apart.",
    "Warm natural food photography, premium family meal, baby-safe friendly presentation, soft daylight, clean kitchen surface.",
    "Use a warm cream, peach, soft green, and cocoa color mood inspired by the Foody Fam brand.",
    "No text, no logos, no watermark, no people, no hands, no baby, no utensils with sharp edges, no unsafe choking imagery.",
    "The image should look appetizing, realistic, gentle, and suitable for both baby-adapted and adult family meals, but visually it must be one complete finished dish."
  ].join(" ");
}

function resolveOpenAIImageSize(value?: string) {
  const allowed = new Set(["1024x1024", "1024x1536", "1536x1024", "auto"]);
  if (!value || value === "512x512") return "1024x1024";
  return allowed.has(value) ? value : "1024x1024";
}

function finalizeRecipeForRequest(recipe: Recipe, input: { ingredients?: string; servings?: string | number }): Recipe {
  const requestedIngredients = parseRequestedIngredients(input.ingredients);
  if (!requestedIngredients.length) return recipe;

  const ingredientDetails = requestedIngredients.map((ingredient, index) => {
    const existing = recipe.ingredientDetails?.find((item) => item.name.toLowerCase() === ingredient.toLowerCase());
    return existing || estimateRequestedIngredientDetail(ingredient, index);
  });
  const title = `${titleCase(requestedIngredients.slice(0, 2).join(" + "))} Family Meal`;

  return {
    ...recipe,
    title,
    slug: slugify(title),
    description: `A Foody Fam recipe built around ${requestedIngredients.join(", ")} with one shared base, a baby-safe portion, and an adult finish.`,
    familyPitch: `Cook ${requestedIngredients.slice(0, 4).join(", ")} once, remove the baby's portion before salt or strong seasoning, then finish the adult plates.`,
    ingredients: requestedIngredients,
    ingredientDetails,
    shoppingList: [
      {
        category: "Ingredients",
        items: ingredientDetails.map((item) => `${formatRequestedQuantity(item.quantity)} ${item.unit} ${item.name}`.trim())
      }
    ],
    tags: Array.from(new Set(["User ingredients", ...recipe.tags])).slice(0, 8),
    servings: Number(input.servings) || recipe.servings
  };
}

function parseRequestedIngredients(value?: string) {
  return (value || "")
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, all) => all.findIndex((entry) => entry.toLowerCase() === item.toLowerCase()) === index)
    .slice(0, 8);
}

function estimateRequestedIngredientDetail(name: string, index: number) {
  const lower = name.toLowerCase();
  const isLiquid = /milk|stock|broth|sauce|water|cream|yogurt/.test(lower);
  const isSmall = /oil|spice|herb|salt|pepper|lemon|lime|parsley|basil|cilantro/.test(lower);
  const isCount = /egg|onion|carrot|banana|apple|potato|zucchini|avocado/.test(lower);
  return {
    name,
    quantity: isSmall ? 1 : isLiquid ? 250 : isCount ? Math.min(4, Math.max(1, index + 1)) : index === 0 ? 400 : 220,
    unit: isSmall ? "tbsp" : isLiquid ? "ml" : isCount ? "piece" : "g",
    note: "",
    optional: false
  };
}

function formatRequestedQuantity(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function titleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "generated-family-meal";
}
