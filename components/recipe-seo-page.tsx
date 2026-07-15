import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema, recipeSchema } from "@/lib/seo";
import type { DatabaseRecipe } from "@/lib/types";

export function RecipeSeoPage({ recipe }: { recipe: DatabaseRecipe }) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const faqs = [
    {
      question: `When do I remove the baby portion for ${recipe.title}?`,
      answer: "Remove the baby portion before added salt, strong spices, honey, crunchy toppings, or adult finishing ingredients."
    },
    {
      question: `What allergens are tagged for ${recipe.title}?`,
      answer: recipe.allergens.length ? `Tagged allergens: ${recipe.allergens.join(", ")}. Parents should confirm every ingredient label.` : "No major allergen is tagged in the recipe database, but parents should still confirm every ingredient label."
    },
    {
      question: "Is this recipe medical advice?",
      answer: "No. Foody Fam provides age-aware cooking guidance. Parents should confirm allergies, readiness, texture, and medical questions with a qualified professional."
    }
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Recipes", path: "/recipes" },
            { name: recipe.title, path: `/recipes/${recipe.slug}` }
          ]),
          recipeSchema(recipe),
          faqSchema(faqs)
        ]}
      />
      <nav className="text-sm font-extrabold text-[#5c4a42]/70">
        <Link href="/" className="hover:text-[#f59b78]">Home</Link> / <Link href="/recipes" className="hover:text-[#f59b78]">Recipes</Link> / {recipe.title}
      </nav>

      <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Foody Fam verified recipe</p>
          <h1 className="mt-3 font-display text-balance text-5xl font-black leading-tight text-[#1f1d1c]">{recipe.title}</h1>
          <p className="mt-4 text-lg font-bold leading-8 text-[#5c4a42]">{recipe.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[recipe.mealType, recipe.cuisine, recipe.difficulty, `${totalTime} min`, `${recipe.servings} servings`, recipe.blwStatus, recipe.freezerFriendly ? "Freezer friendly" : "Fresh meal"].map((item) => (
              <span key={item} className="rounded-full bg-[#f7efe9] px-3 py-1 text-xs font-extrabold text-[#5c4a42] shadow-sm">{item}</span>
            ))}
          </div>
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-[28px] shadow-[0_24px_70px_rgba(92,74,66,0.16)]">
          <Image
            src="/brand/generated/hero-family-meal.png"
            alt={`${recipe.title} baby-safe family meal preview`}
            fill
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="mt-10 rounded-[28px] border border-[#e9c7b7]/70 bg-[linear-gradient(145deg,#fffaf6_0%,#f7efe9_58%,#ffccb2_150%)] p-5 shadow-[0_20px_60px_rgba(92,74,66,0.10)]">
        <h2 className="font-display text-3xl font-black">One meal, baby-safe portion, adult finish</h2>
        <p className="mt-3 max-w-3xl font-bold leading-7 text-[#5c4a42]">
          This Foody Fam recipe uses one shared cooking base. Remove the baby portion before salt, strong spices, honey, crunchy toppings, or adult finishes, then season the adult portion at the end.
        </p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[24px] border border-[#e9c7b7]/70 bg-white/82 p-5">
          <h2 className="font-display text-2xl font-black">Ingredients</h2>
          <ul className="mt-4 grid gap-3 text-sm font-bold leading-6 text-[#5c4a42]">
            {recipe.ingredients.map((ingredient) => <li key={ingredient}>- {ingredient}</li>)}
          </ul>
        </section>
        <section className="rounded-[24px] border border-[#e9c7b7]/70 bg-white/82 p-5">
          <h2 className="font-display text-2xl font-black">Cooking steps</h2>
          <ol className="mt-4 grid gap-3 text-sm font-bold leading-6 text-[#5c4a42]">
            {recipe.steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e8f4ef] text-xs font-black text-[#78bea8]">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <Adaptation title="Baby adaptation 6-8 months" body={recipe.babyAdaptations["6-8"]} />
        <Adaptation title="Baby adaptation 8-10 months" body={recipe.babyAdaptations["8-10"]} />
        <Adaptation title="Baby adaptation 10-12 months" body={recipe.babyAdaptations["10-12"]} />
        <Adaptation title="Toddler adaptation" body={recipe.babyAdaptations.toddler} />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[#e9c7b7]/70 bg-[#fffaf6] p-5">
          <h2 className="font-display text-2xl font-black">Adult finish</h2>
          <ul className="mt-4 grid gap-3 text-sm font-bold leading-6 text-[#5c4a42]">
            {[...recipe.adultFinishing.seasoning, ...recipe.adultFinishing.steps].map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </div>
        <div className="rounded-[24px] border border-[#e9c7b7]/70 bg-[#fffaf6] p-5">
          <h2 className="font-display text-2xl font-black">Nutrition and safety notes</h2>
          <div className="mt-4 grid gap-3 text-sm font-bold leading-6 text-[#5c4a42]">
            <p>Estimated calories: {recipe.nutrition.calories}</p>
            <p>Protein: {recipe.nutrition.protein}g</p>
            <p>Iron: {recipe.nutrition.iron}</p>
            <p>Allergens: {recipe.allergens.length ? recipe.allergens.join(", ") : "No major allergen tagged"}</p>
            <p>No honey under 12 months, no added salt in baby portions, and prepare round or firm foods to reduce choking risk.</p>
            <p>Always confirm suitability for diagnosed allergies or feeding concerns with a qualified professional.</p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[28px] bg-[#405f46] p-6 text-white sm:p-8">
        <h2 className="[font-family:Georgia,serif] text-3xl font-normal">Generate a version from your own ingredients</h2>
        <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-white/78">Use your pantry, baby age, and allergy notes to create one shared cooking flow with baby portion timing and adult finish.</p>
        <Link href="/generator" className="mt-5 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-[#243929]">Generate tonight&apos;s family meal free</Link>
      </section>
    </main>
  );
}

function Adaptation({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-[#78bea8]/30 bg-[#e8f4ef] p-5">
      <h2 className="font-display text-xl font-black">{title}</h2>
      <p className="mt-3 text-sm font-bold leading-6 text-[#315f52]">{body}</p>
    </div>
  );
}
