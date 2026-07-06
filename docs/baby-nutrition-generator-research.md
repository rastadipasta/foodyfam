# Foody Fam Baby Nutrition Generator Guardrails

Foody Fam uses these notes as product safety guardrails for recipe generation. They are practical cooking rules, not medical advice.

## Source Basis

- CDC Infant and Toddler Nutrition: https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/index.html
- CDC solid food introduction: https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html
- NHS foods to avoid for babies and young children: https://www.nhs.uk/conditions/baby/weaning-and-feeding/foods-to-avoid-giving-babies-and-young-children/
- WHO infant and young child feeding: https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding
- FDA fish advice for children and families: https://www.fda.gov/food/consumers/advice-about-eating-fish

## Generator Rules

- Do not recommend solids for babies under about 6 months; use clinician-facing caution copy instead.
- For 6-8 months, use smooth puree, very soft mash, or foods that dissolve easily.
- For 8-10 months, allow thicker mash, soft lumps, and soft finger foods only when developmentally ready.
- For 10-12 months, allow soft minced, chopped, shredded, or finger-food pieces.
- For toddlers, keep family foods low in salt and added sugar and continue choking-risk preparation.
- Remove the baby portion before salt, salty sauces, stock cubes, cured meats, strong spice, honey, crunchy toppings, or adult finishes.
- Never include honey in baby portions under 12 months.
- Do not use cow's milk as the main baby drink before 12 months.
- Avoid unpasteurized dairy/juice and raw or undercooked egg, meat, poultry, fish, or seafood.
- Prepare choking-risk foods safely: no whole nuts, popcorn, hard candy, hard raw vegetables, dried fruit, whole grapes, whole cherry tomatoes, round sausage slices, or firm cubes.
- Use low-mercury fish choices and avoid high-mercury fish such as shark, swordfish, king mackerel, marlin, orange roughy, and bigeye tuna.
- Allergies must be treated as user-provided safety constraints, not diagnosed or overridden by the model.
