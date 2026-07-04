import type { Metadata } from "next";
import type { DatabaseRecipe } from "@/lib/types";

export const siteName = "Foody Fam";
export const defaultOgImage = "/brand/generated/hero-family-meal.png";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
  noIndex = false
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false, nocache: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: `${siteName} - ${title}` }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)]
    }
  };
}

export function noIndexMetadata(title: string): Metadata {
  return pageMetadata({
    title,
    description: "Private Foody Fam app page.",
    path: "/",
    noIndex: true
  });
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: getSiteUrl(),
    logo: absoluteUrl("/brand/logo.png"),
    sameAs: []
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: getSiteUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/recipes")}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function softwareApplicationSchema(path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: absoluteUrl(path),
    description:
      "Foody Fam is an AI meal planner that turns one family cooking process into baby-safe portions, adult finishes, shopping lists, and weekly plans.",
    offers: [
      { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
      { "@type": "Offer", name: "Premium", price: "12", priceCurrency: "USD" },
      { "@type": "Offer", name: "Unlimited", price: "20", priceCurrency: "USD" }
    ]
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function recipeSchema(recipe: DatabaseRecipe) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: [absoluteUrl("/brand/generated/hero-family-meal.png")],
    author: { "@type": "Organization", name: siteName },
    recipeCategory: recipe.mealType,
    recipeCuisine: recipe.cuisine,
    prepTime: toIsoDuration(recipe.prepTime),
    cookTime: toIsoDuration(recipe.cookTime),
    totalTime: toIsoDuration(recipe.prepTime + recipe.cookTime),
    recipeYield: `${recipe.servings} servings`,
    keywords: [...recipe.tags, ...recipe.aiTags].join(", "),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((step) => ({ "@type": "HowToStep", text: step })),
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${recipe.nutrition.calories} calories`,
      proteinContent: `${recipe.nutrition.protein} g`
    }
  };
}

export const coreFaqs = [
  {
    question: "What does Foody Fam do?",
    answer:
      "Foody Fam turns one cooking process into a family meal with a baby-safe portion, adult finish, shopping list, and weekly planner."
  },
  {
    question: "Can Foody Fam support BLW and puree feeding?",
    answer:
      "Yes. Foody Fam can adapt recipes for puree, baby-led weaning, or mixed feeding while keeping texture and safety notes visible."
  },
  {
    question: "How does Foody Fam handle baby and adult portions?",
    answer:
      "Recipes are built around one gentle base. The baby portion is removed before salt, strong spices, honey, crunchy toppings, or adult finishes."
  },
  {
    question: "Is Foody Fam medical advice?",
    answer:
      "No. Foody Fam provides cautious cooking guidance and allergy-aware prompts, but families should confirm medical or allergy concerns with a qualified professional."
  }
];

function toIsoDuration(minutes: number) {
  return `PT${Math.max(1, minutes)}M`;
}
