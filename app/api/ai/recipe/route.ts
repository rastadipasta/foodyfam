import { NextResponse } from "next/server";
import { createDemoRecipe } from "@/lib/ai-demo";
import type { Recipe } from "@/lib/types";

const stringArray = { type: "array", items: { type: "string" } };

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
  const body = (await request.json().catch(() => ({}))) as {
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
  };

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ recipe: createDemoRecipe(body), source: "demo" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        input: [
          {
            role: "system",
            content:
              [
                "You create Foody Fam recipes for the product promise: One meal, whole family.",
                "Always design one shared cooking process with a gentle base, a baby portion removed before salt/spice, then adult finishing instructions.",
                "Return practical family cooking language, not medical advice. Allergy and baby safety notes must be cautious and recommend checking with a qualified professional when needed.",
                "Keep the recipe realistic, weeknight-friendly, and grounded in the provided pantry, appliances, timing, skill level, and avoid list.",
                "The output must match the provided JSON schema exactly."
              ].join(" ")
          },
          {
            role: "user",
            content: [
              `Ingredients: ${body.ingredients || "family pantry"}.`,
              `Pantry items: ${body.pantryItems || "not provided"}.`,
              `Baby profile: ${body.babyProfile || "baby"}; baby age: ${body.babyAge || "8 months"}; texture: ${body.babyTexture || "age-appropriate"}; feeding style: ${body.feedingStyle || "mixed"}.`,
              `Servings: ${body.servings || "4"}. Meal type: ${body.mealType || "dinner"}. Cuisine: ${body.cuisine || "flexible"}.`,
              `Time: ${body.cookingTime || "30 minutes"}. Appliances: ${body.appliances || "stovetop"}. Skill level: ${body.skillLevel || "easy"}.`,
              `Diet/allergy notes: ${body.diet || "none"}. Known allergies: ${body.allergies || "none"}. Avoid ingredients: ${body.avoidIngredients || "none"}.`,
              `Goal: ${body.goal || "Cook once for baby and adults."}`
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
      return NextResponse.json({ recipe: createDemoRecipe(body), source: "demo", warning: "OpenAI request failed" });
    }

    const data = (await response.json()) as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
    const text = data.output_text || data.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text;
    const parsed = text ? (JSON.parse(text) as { recipe?: Recipe }) : { recipe: createDemoRecipe(body) };
    if (!parsed.recipe?.title || !parsed.recipe?.description || !Array.isArray(parsed.recipe.shoppingList)) {
      return NextResponse.json({ recipe: createDemoRecipe(body), source: "demo", warning: "OpenAI schema validation failed" });
    }
    return NextResponse.json({ recipe: { ...parsed.recipe, image: "/brand/reference.png" }, source: "openai" });
  } catch {
    return NextResponse.json({ recipe: createDemoRecipe(body), source: "demo", warning: "OpenAI parsing failed" });
  }
}
