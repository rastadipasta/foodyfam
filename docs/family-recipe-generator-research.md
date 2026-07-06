# Foody Fam Family Recipe Generator Research

This document summarizes how Foody Fam turns baby-safe feeding guidance into low-token recipe generation.

## Research Basis

- CDC Infant and Toddler Nutrition: https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/index.html
- CDC solid food introduction: https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html
- NHS baby and toddler foods to avoid: https://www.nhs.uk/conditions/baby/weaning-and-feeding/foods-to-avoid-giving-babies-and-young-children/
- WHO infant and young child feeding: https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding
- FDA fish advice: https://www.fda.gov/food/consumers/advice-about-eating-fish
- OpenAI prompt caching guidance: https://developers.openai.com/api/docs/guides/prompt-caching
- OpenAI structured outputs guidance: https://developers.openai.com/api/docs/guides/structured-outputs

## Recipe Intelligence Model

Foody Fam does not send a full cookbook to OpenAI. The generator uses:

- a stable system-level research pack for prompt caching friendliness
- a local verified recipe match
- a compact recipe context with only the matched recipe title, category, cuisine, time, core ingredients, first steps, age path, safety flags, and recipe formula
- structured JSON output so the UI can render ingredients, quantities, baby split steps, and adult finishing steps reliably

## Family Recipe Patterns

- Soft grain bowl: grain + protein or legume + vegetables + mild liquid.
- Sauce and pasta: soft sauce + short pasta/noodles + vegetable + protein or legume.
- Soup/stew: aromatics + vegetable + legume/protein + low-sodium liquid.
- Breakfast soft base: oats, yogurt, egg if tolerated, fruit/vegetable, gentle fat.
- Tray bake: soft protein + soft vegetables + starch + mild oil.

Each pattern follows one cooking process:

1. Build a mild shared base.
2. Cook until the baby portion can be made age-appropriate.
3. Remove the baby portion before salt, honey, spicy heat, crunchy toppings, or adult sauces.
4. Adjust baby texture.
5. Finish adult portions with flavor.

## Token Control Rules

- Do not include the full 100-recipe JSON database in model input.
- Do not include every baby rule in every dynamic request; use the stable compact research pack plus only relevant safety flags.
- Keep dynamic context under a small paragraph-style pack.
- Keep secondary output fields concise because structured output already forces many fields.
- Use local fallback and local guardrails when OpenAI is unavailable.
