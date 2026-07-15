export type SeoGuide = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  steps: string[];
  faqs: { question: string; answer: string }[];
  links: { label: string; href: string }[];
};

export const seoGuides: SeoGuide[] = [
  {
    slug: "ai-meal-planner-for-families-with-babies",
    title: "AI Meal Planner for Families With Babies",
    description: "How AI meal planning helps parents cook one meal for babies, kids, and adults.",
    summary:
      "An AI meal planner for families with babies should start from one shared recipe base, remove the baby portion before seasoning, and turn the same plan into shopping and weekly meals.",
    steps: ["Add baby age and feeding style.", "Choose family ingredients and time limit.", "Generate one shared recipe flow.", "Save the recipe to planner and shopping list."],
    faqs: [
      { question: "Can AI plan baby-safe meals?", answer: "AI can help organize baby-aware meal ideas, but parents should verify ingredients, texture, temperature, and allergies." },
      { question: "What makes Foody Fam different?", answer: "Foody Fam starts from verified base recipes and keeps baby/adult instructions in one cooking process." }
    ],
    links: [{ label: "Try the generator", href: "/generator" }, { label: "Open recipes", href: "/recipes" }]
  },
  {
    slug: "how-to-cook-one-meal-for-baby-and-adults",
    title: "How to Cook One Meal for Baby and Adults",
    description: "A practical one-meal workflow for families who do not want to cook twice.",
    summary:
      "Cook a mild shared base first, remove a baby portion before salt or strong spices, then finish the adult portion with seasoning, herbs, acidity, cheese, or heat.",
    steps: ["Start with soft family-friendly ingredients.", "Cook until baby-safe texture is possible.", "Remove the baby portion before adult seasoning.", "Finish adults separately and serve together."],
    faqs: [
      { question: "When should I remove the baby portion?", answer: "Remove it before salt, strong spices, honey, crunchy toppings, or any ingredient not suitable for the baby." },
      { question: "Can adults still get flavor?", answer: "Yes. Adults get the final seasoning step after the baby portion is separate." }
    ],
    links: [{ label: "View family recipes", href: "/recipes" }, { label: "Plan a week", href: "/planner" }]
  },
  {
    slug: "baby-safe-dinners-by-age",
    title: "Baby-Safe Dinners by Age",
    description: "How dinner texture changes from 6-8 months through toddler meals.",
    summary:
      "Baby-safe dinners depend on age, texture skill, and ingredients. Foody Fam keeps age paths visible for 6-8, 8-10, 10-12 months, and toddler portions.",
    steps: ["Use smooth or mashed textures for early eaters.", "Move toward soft small pieces when ready.", "Keep salt and strong spices out of baby portions.", "Check every piece for easy squashing."],
    faqs: [
      { question: "Are all recipes suitable for every baby?", answer: "No. Age, readiness, allergies, and family medical advice matter." },
      { question: "Does Foody Fam show age adaptations?", answer: "Yes. Verified base recipes include baby adaptations by age range." }
    ],
    links: [{ label: "Browse baby-aware recipes", href: "/recipes" }, { label: "Nutrition page", href: "/nutrition" }]
  },
  {
    slug: "6-8-month-recipe-adaptations",
    title: "6-8 Month Recipe Adaptations",
    description: "Gentle recipe adaptation rules for early baby meals.",
    summary:
      "For 6-8 months, family recipes usually need smooth puree or soft mash, no added salt, cautious allergen handling, and lukewarm serving temperature.",
    steps: ["Blend or mash the baby portion.", "Thin with water, milk, or low-sodium broth when needed.", "Avoid added salt and honey.", "Serve lukewarm and texture-check before serving."],
    faqs: [
      { question: "Can 6-8 month babies eat family meals?", answer: "Often yes when the portion is adapted for texture and ingredients, but readiness varies." },
      { question: "What should adults do after removing the baby portion?", answer: "Add salt, pepper, herbs, spice, cheese, or acidity only to the adult portion." }
    ],
    links: [{ label: "Generate a baby recipe", href: "/generator" }, { label: "Chicken broccoli risotto", href: "/recipes/chicken-broccoli-risotto" }]
  },
  {
    slug: "blw-family-meals",
    title: "BLW Family Meals",
    description: "How to plan baby-led weaning family meals without cooking twice.",
    summary:
      "BLW family meals work best when the shared base can become soft, easy-squash pieces before adult seasoning is added.",
    steps: ["Choose soft-cooking vegetables, grains, and proteins.", "Cut or shape pieces safely.", "Remove the baby portion before salt and spice.", "Serve adult portions with stronger finishing flavors."],
    faqs: [
      { question: "What does BLW-friendly mean?", answer: "It means the food can be served in soft, graspable, easy-squash pieces when developmentally appropriate." },
      { question: "Does Foody Fam filter BLW recipes?", answer: "Yes. The recipe library includes BLW-friendly tags and filters." }
    ],
    links: [{ label: "BLW recipes", href: "/recipes" }, { label: "Meal planner", href: "/planner" }]
  },
  {
    slug: "puree-friendly-family-dinners",
    title: "Puree-Friendly Family Dinners",
    description: "How to make family dinners that also become smooth baby portions.",
    summary:
      "Puree-friendly dinners use a soft shared base that can be blended before adults add texture, spice, salt, or toppings.",
    steps: ["Build a soft base with vegetables, grains, or protein.", "Blend the baby portion separately.", "Adjust thickness gradually.", "Finish adult plates with texture and seasoning."],
    faqs: [
      { question: "Can pasta or rice become puree-friendly?", answer: "Yes, if cooked soft and blended with enough liquid." },
      { question: "Can adults avoid bland food?", answer: "Yes. Adult finishing happens after the baby portion is removed." }
    ],
    links: [{ label: "Open generator", href: "/generator" }, { label: "Recipe library", href: "/recipes" }]
  },
  {
    slug: "baby-food-allergens-and-meal-planning",
    title: "Baby Food Allergens and Meal Planning",
    description: "Cautious allergy-aware meal planning for family recipes.",
    summary:
      "Allergy-aware meal planning means keeping known allergies visible, checking packaged ingredients, and avoiding medical claims inside recipe instructions.",
    steps: ["Store family allergy notes in profiles.", "Filter recipes by allergen risk.", "Review packaged ingredients.", "Ask a qualified professional about diagnosed allergies."],
    faqs: [
      { question: "Does Foody Fam diagnose allergies?", answer: "No. Foody Fam helps organize allergy-aware cooking notes but does not diagnose or replace medical advice." },
      { question: "Can recipes avoid allergens?", answer: "The generator and library can prioritize avoiding listed allergens and ingredients." }
    ],
    links: [{ label: "Profiles", href: "/register" }, { label: "Assistant", href: "/assistant" }]
  },
  {
    slug: "no-sugar-baby-desserts",
    title: "No-Sugar Baby Desserts",
    description: "Baby dessert ideas that rely on fruit and gentle textures.",
    summary:
      "No-sugar baby desserts can use fruit, oats, yogurt, chia, rice, or soft baked textures while keeping added sugar out of the baby portion.",
    steps: ["Use ripe fruit for sweetness.", "Keep textures soft and moist.", "Avoid honey for babies under 12 months.", "Let adults add toppings separately."],
    faqs: [
      { question: "Can desserts be family-friendly?", answer: "Yes, when the baby portion stays unsweetened and adults add optional toppings later." },
      { question: "Does Foody Fam include dessert recipes?", answer: "Yes. The recipe database includes no-sugar dessert-style ideas." }
    ],
    links: [{ label: "Dessert recipes", href: "/recipes" }, { label: "Shopping list", href: "/shopping" }]
  },
  {
    slug: "weekly-meal-planning-for-parents",
    title: "Weekly Meal Planning for Parents",
    description: "A simple weekly meal planning system for busy parents.",
    summary:
      "Weekly meal planning for parents works best when recipes, leftovers, baby adaptations, and shopping items all live in one workflow.",
    steps: ["Plan breakfast, lunch, and dinner slots.", "Reuse ingredients across meals.", "Save freezer-friendly recipes.", "Turn planned recipes into one shopping list."],
    faqs: [
      { question: "How many meals should parents plan?", answer: "A useful starting point is dinners first, then add breakfast and lunch when the rhythm is stable." },
      { question: "Does Foody Fam support weekly planning?", answer: "Yes. The planner has breakfast, lunch, and dinner slots for a full week." }
    ],
    links: [{ label: "Weekly planner", href: "/planner" }, { label: "Pricing", href: "/pricing" }]
  },
  {
    slug: "verified-base-recipes-for-ai",
    title: "How Foody Fam Uses Verified Base Recipes",
    description: "Why verified recipe bases make AI meal generation more reliable.",
    summary:
      "Foody Fam improves AI recipe quality by matching a request to a verified base recipe before adapting it for age, allergies, pantry items, and family goals.",
    steps: ["Search the local recipe database.", "Match by allergies, age, pantry, cuisine, time, and appliances.", "Send the trusted base to AI.", "Return a structured family recipe."],
    faqs: [
      { question: "Why not let AI invent every recipe?", answer: "Starting from verified bases makes recipes more consistent, safer, and easier to adapt." },
      { question: "Is the full recipe database stored in Supabase?", answer: "No. The recipe database stays local; Supabase stores user state and saved/generated recipe snapshots." }
    ],
    links: [{ label: "Recipe library", href: "/recipes" }, { label: "Generator", href: "/generator" }]
  },
  {
    slug: "baby-friendly-chicken-recipes",
    title: "Baby-Friendly Chicken Recipes",
    description: "How to cook chicken once for a baby portion and an adult family plate.",
    summary:
      "Baby-friendly chicken recipes work best when chicken is cooked tender in a mild base, the baby portion is shredded, mashed, or blended before seasoning, and adults finish the remaining portion with herbs, acidity, or spice.",
    steps: ["Cook chicken until fully tender.", "Remove a salt-free baby portion.", "Shred, mash, or blend to the right texture.", "Season the adult portion after the baby serving is separate."],
    faqs: [
      { question: "Can babies eat chicken from a family dinner?", answer: "Often yes when it is fully cooked, tender, age-appropriate in texture, and free from added salt in the baby portion." },
      { question: "What adult finishes work with chicken?", answer: "Adults can add lemon, herbs, pepper, parmesan, chili, or sauces after the baby portion is removed." }
    ],
    links: [{ label: "Generate chicken dinner", href: "/generator" }, { label: "Recipe library", href: "/recipes" }]
  },
  {
    slug: "no-salt-family-recipes",
    title: "No-Salt Family Recipes",
    description: "How to keep baby portions salt-free without making adult food bland.",
    summary:
      "No-salt family recipes start with a flavorful but unsalted base. The baby portion is removed first, then adults add salt, cheese, sauces, or strong seasoning at the end.",
    steps: ["Use aromatics, vegetables, and gentle herbs in the shared base.", "Remove the baby portion before salty ingredients.", "Add adult salt and finishers separately.", "Label leftovers so baby portions stay salt-free."],
    faqs: [
      { question: "Do adults have to eat unsalted food?", answer: "No. Adults can season after the baby portion is separate." },
      { question: "What should parents check?", answer: "Check packaged stock, cheese, sauces, and processed ingredients because salt can hide there." }
    ],
    links: [{ label: "Try the generator", href: "/generator" }, { label: "Safety foundation", href: "/experts" }]
  },
  {
    slug: "chicken-and-rice-for-baby-and-family",
    title: "What Can I Cook With Chicken and Rice for My Baby?",
    description: "A simple chicken and rice family meal framework with baby portion timing.",
    summary:
      "Chicken and rice can become one shared family meal when rice and chicken are cooked soft, vegetables are added for moisture, the baby portion is removed before seasoning, and adults finish with brighter flavor.",
    steps: ["Cook rice, chicken, and vegetables until soft.", "Remove the baby portion before salt or strong sauces.", "Mash or blend with liquid for younger babies.", "Finish adult plates with herbs, pepper, lemon, or parmesan."],
    faqs: [
      { question: "Is chicken and rice a good baby-family base?", answer: "It can be practical because it cooks soft and can be mashed, blended, or served as soft pieces depending on age." },
      { question: "What vegetables work well?", answer: "Carrot, broccoli, peas, zucchini, sweet potato, and spinach can work when cooked soft and prepared safely." }
    ],
    links: [{ label: "Chicken broccoli risotto", href: "/recipes/chicken-broccoli-risotto" }, { label: "Generate from ingredients", href: "/generator" }]
  }
];

export function getGuide(slug: string) {
  return seoGuides.find((guide) => guide.slug === slug);
}
