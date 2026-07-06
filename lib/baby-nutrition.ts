import type { RecipeMatchInput } from "./types";

export type BabyAgeBand = "under-6" | "6-8" | "8-10" | "10-12" | "12-24";

type NutritionFlag = {
  label: string;
  reason: string;
  rule: string;
  severity: "avoid" | "limit" | "prepare-safely";
  pattern: RegExp;
  minAgeMonths?: number;
  untilAgeMonths?: number;
};

const safetyFlags: NutritionFlag[] = [
  {
    label: "Honey",
    reason: "Avoid before 12 months because of infant botulism risk.",
    rule: "Never include honey or honey-sweetened foods in baby portions under 12 months.",
    severity: "avoid",
    pattern: /\bhoney\b/i,
    untilAgeMonths: 12
  },
  {
    label: "Cow's milk as a drink",
    reason: "Avoid cow's milk as a main drink before 12 months; yogurt and cheese can be used when age-appropriate and tolerated.",
    rule: "Do not use cow's milk as the baby's drink before 12 months; use breast milk, formula, water, or recipe liquid as appropriate.",
    severity: "avoid",
    pattern: /\b(cow'?s milk|whole milk|milk as a drink)\b/i,
    untilAgeMonths: 12
  },
  {
    label: "Unpasteurized food",
    reason: "Unpasteurized dairy, juice, or foods may carry harmful bacteria.",
    rule: "Use pasteurized dairy and fully cooked foods for baby portions.",
    severity: "avoid",
    pattern: /\b(unpasteuri[sz]ed|raw milk|raw cheese|raw juice)\b/i,
    untilAgeMonths: 24
  },
  {
    label: "Added salt / high sodium",
    reason: "Baby portions should stay salt-free; toddlers should still have low-sodium meals.",
    rule: "Remove the baby portion before salt, bouillon cubes, salty sauces, cured meats, or salty cheese finishes.",
    severity: "limit",
    pattern: /\b(salt|soy sauce|bouillon|stock cube|bacon|sausage|ham|prosciutto|salami|pepperoni|miso)\b/i,
    untilAgeMonths: 24
  },
  {
    label: "Added sugar / sweet drinks",
    reason: "Avoid added sugars for babies and keep sweet drinks out of baby meals.",
    rule: "Do not add sugar, syrup, juice, soda, sweetened yogurt, or sweet drinks to baby portions.",
    severity: "limit",
    pattern: /\b(sugar|brown sugar|maple syrup|syrup|juice|soda|sweetened|candy|chocolate)\b/i,
    untilAgeMonths: 24
  },
  {
    label: "Whole nuts or peanuts",
    reason: "Whole nuts and peanuts are choking hazards for young children.",
    rule: "Use smooth nut butter thinned into food or finely ground nuts only when allergen introduction is appropriate; never whole nuts.",
    severity: "prepare-safely",
    pattern: /\b(whole nuts?|whole peanuts?|peanuts?|almonds?|cashews?|hazelnuts?|walnuts?)\b/i,
    untilAgeMonths: 60
  },
  {
    label: "Round choking shapes",
    reason: "Whole grapes, cherry tomatoes, berries, cherries, and similar round foods can block the airway.",
    rule: "Cut round foods lengthwise into small pieces; never serve them whole to babies or toddlers.",
    severity: "prepare-safely",
    pattern: /\b(grapes?|cherry tomatoes?|tomatoes?|cherries|berries|blueberries|olives)\b/i,
    untilAgeMonths: 48
  },
  {
    label: "Hard or dry choking foods",
    reason: "Popcorn, hard candy, seeds, hard raw vegetables, and dried fruit are choking hazards.",
    rule: "Avoid hard, dry, sticky, or crunchy foods in baby portions; cook until soft and mashable.",
    severity: "prepare-safely",
    pattern: /\b(popcorn|hard candy|seeds?|raw carrots?|raw apples?|dried fruit|raisins?|chips|pretzels?)\b/i,
    untilAgeMonths: 48
  },
  {
    label: "Chunky protein or cheese",
    reason: "Large chunks of meat, cheese, or hot dog-style foods are choking hazards.",
    rule: "Shred, mince, flake, or cut protein into soft small pieces; avoid hot dog rounds and firm cubes.",
    severity: "prepare-safely",
    pattern: /\b(hot dogs?|chunks? of meat|meat cubes?|cheese cubes?|string cheese)\b/i,
    untilAgeMonths: 48
  },
  {
    label: "Undercooked animal foods",
    reason: "Baby portions should use fully cooked eggs, meat, poultry, and fish.",
    rule: "Cook eggs until firm and meat, poultry, and fish until fully cooked; avoid raw or undercooked animal foods.",
    severity: "avoid",
    pattern: /\b(raw egg|runny egg|undercooked|rare meat|sushi|raw fish|raw seafood)\b/i,
    untilAgeMonths: 24
  },
  {
    label: "High-mercury fish",
    reason: "High-mercury fish are not appropriate for baby meals.",
    rule: "Use low-mercury fish options and avoid shark, swordfish, king mackerel, marlin, orange roughy, and bigeye tuna.",
    severity: "avoid",
    pattern: /\b(shark|swordfish|king mackerel|marlin|orange roughy|bigeye tuna)\b/i,
    untilAgeMonths: 24
  }
];

export function resolveBabyAgeBand(age?: string): BabyAgeBand {
  const text = (age || "").toLowerCase();
  if (/\b(0|1|2|3|4|5)\b|under 6|under six|newborn/.test(text)) return "under-6";
  if (/6\s*[-–]\s*8|6\s*to\s*8|six\s*[-–]\s*eight|six\s*to\s*eight/.test(text)) return "6-8";
  if (/8\s*[-–]\s*10|8\s*to\s*10|eight\s*[-–]\s*ten|eight\s*to\s*ten/.test(text)) return "8-10";
  if (/10\s*[-–]\s*12|10\s*to\s*12|ten\s*[-–]\s*twelve|ten\s*to\s*twelve/.test(text)) return "10-12";
  if (/12|13|14|15|16|17|18|19|20|21|22|23|24|toddler|1 year|2 year/.test(text)) return "12-24";
  if (/10|11/.test(text)) return "10-12";
  if (/8|9/.test(text)) return "8-10";
  return "6-8";
}

export function babyNutritionPrompt(input: RecipeMatchInput & { babyTexture?: string; feedingStyle?: string }) {
  const guidance = getBabyNutritionGuidance(input);
  return [
    "Baby nutrition guardrails for Foody Fam:",
    ...guidance.promptRules.map((rule) => `- ${rule}`)
  ].join("\n");
}

export function getBabyNutritionGuidance(input: RecipeMatchInput & { babyTexture?: string; feedingStyle?: string }) {
  const ageBand = resolveBabyAgeBand(input.babyAge);
  const textToCheck = [
    input.ingredients,
    input.pantryItems,
    input.avoidIngredients,
    input.allergies,
    input.diet,
    input.feedingStyle,
    input.babyTexture
  ].filter(Boolean).join(", ");
  const flags = findBabyNutritionFlags(textToCheck, ageBand);

  const stageRules = getStageRules(ageBand);
  const promptRules = [
    ...stageRules,
    "Use baby-feeding language as cautious cooking guidance, not medical diagnosis.",
    "If allergies, eczema, feeding difficulties, prematurity, or medical conditions are mentioned, add a note to confirm with a qualified clinician.",
    "Introduce new allergens only when the family has not listed an allergy, and keep the wording cautious.",
    "Keep baby portions free from honey, added salt, added sugar, spicy heat, hard/crunchy toppings, and unsafe choking shapes.",
    "Every recipe must explicitly say when to remove the baby portion before adult seasoning.",
    ...flags.map((flag) => `${flag.label}: ${flag.rule}`)
  ];

  return {
    ageBand,
    flags,
    promptRules,
    safetyNotes: [
      ...stageRules,
      ...flags.map((flag) => `${flag.label}: ${flag.reason}`),
      "Always supervise babies and toddlers while eating and check texture and temperature before serving."
    ]
  };
}

export function findBabyNutritionFlags(text: string, ageBand: BabyAgeBand) {
  const months = ageBandToMonths(ageBand);
  return safetyFlags
    .filter((flag) => flag.pattern.test(text))
    .filter((flag) => {
      if (flag.minAgeMonths && months < flag.minAgeMonths) return false;
      if (flag.untilAgeMonths && months >= flag.untilAgeMonths) return false;
      return true;
    })
    .map((flag) => ({
      label: flag.label,
      reason: flag.reason,
      rule: flag.rule,
      severity: flag.severity,
      minAgeMonths: flag.minAgeMonths,
      untilAgeMonths: flag.untilAgeMonths
    }));
}

export function applyBabyNutritionGuardrails<T extends { safetyNotes?: string[]; allergyWarnings?: string[]; babyVersion?: string[]; baby?: string[]; tags?: string[] }>(
  recipe: T,
  input: RecipeMatchInput & { babyTexture?: string; feedingStyle?: string }
): T {
  const guidance = getBabyNutritionGuidance(input);
  const ageLabel = ageBandLabel(guidance.ageBand);
  return {
    ...recipe,
    safetyNotes: uniqueStrings([...(recipe.safetyNotes || []), ...guidance.safetyNotes]).slice(0, 10),
    allergyWarnings: uniqueStrings([
      ...(recipe.allergyWarnings || []),
      ...(guidance.flags.length ? guidance.flags.map((flag) => `${flag.label}: ${flag.rule}`) : ["No listed unsafe ingredient was detected, but verify labels and family allergies."])
    ]).slice(0, 8),
    babyVersion: uniqueStrings([
      ...(recipe.babyVersion || []),
      `Age path ${ageLabel}: ${getShortTextureRule(guidance.ageBand)}`
    ]),
    baby: uniqueStrings([
      ...(recipe.baby || []),
      `Age path ${ageLabel}`,
      getShortTextureRule(guidance.ageBand)
    ]),
    tags: uniqueStrings([...(recipe.tags || []), `Age ${ageLabel}`, "Baby safety checked"])
  };
}

function getStageRules(ageBand: BabyAgeBand) {
  switch (ageBand) {
    case "under-6":
      return [
        "Under 6 months: do not generate a solids meal as a recommendation; explain that solids usually start around 6 months when readiness signs are present.",
        "For under 6 months, suggest discussing feeding plans with a pediatric clinician and keep breast milk or formula as the core feeding source."
      ];
    case "6-8":
      return [
        "6-8 months: use smooth purees, very soft mash, or soft foods that dissolve easily; cook until easily mashable.",
        "6-8 months: begin with simple foods and introduce one new potential allergen at a time when appropriate.",
        "6-8 months: avoid added salt, added sugar, honey, choking shapes, and hard textures."
      ];
    case "8-10":
      return [
        "8-10 months: move from smooth textures toward thicker mash, soft lumps, and soft finger foods when developmentally ready.",
        "8-10 months: every piece must be soft enough to mash between fingers or gums.",
        "8-10 months: cut round foods small and lengthwise; avoid hard, sticky, crunchy, or dry textures."
      ];
    case "10-12":
      return [
        "10-12 months: use minced, chopped, shredded, or soft finger-food textures while still avoiding choking hazards.",
        "10-12 months: keep baby portions low-sodium and remove them before adult seasoning.",
        "10-12 months: continue using soft, moist, easy-to-chew pieces and supervise eating."
      ];
    case "12-24":
      return [
        "12-24 months: toddlers can eat many family foods when cut safely, but still need low-salt, low-added-sugar meals.",
        "12-24 months: whole nuts, popcorn, hard candy, round whole grapes, and hard chunks remain choking risks.",
        "12-24 months: use small soft pieces and avoid adult-level spicy heat or salty finishes."
      ];
  }
}

function ageBandToMonths(ageBand: BabyAgeBand) {
  if (ageBand === "under-6") return 5;
  if (ageBand === "6-8") return 7;
  if (ageBand === "8-10") return 9;
  if (ageBand === "10-12") return 11;
  return 18;
}

function ageBandLabel(ageBand: BabyAgeBand) {
  if (ageBand === "under-6") return "under 6 months";
  if (ageBand === "12-24") return "12-24 months";
  return `${ageBand} months`;
}

function getShortTextureRule(ageBand: BabyAgeBand) {
  if (ageBand === "under-6") return "Solids are usually not recommended before about 6 months.";
  if (ageBand === "6-8") return "Smooth puree or very soft mash; no added salt, honey, or hard pieces.";
  if (ageBand === "8-10") return "Thicker mash, soft lumps, or soft finger foods when ready.";
  if (ageBand === "10-12") return "Soft minced, chopped, shredded, or finger-food pieces.";
  return "Small safe toddler pieces with low salt and low added sugar.";
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}
