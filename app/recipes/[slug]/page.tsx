import { notFound } from "next/navigation";
import { RecipeSeoPage } from "@/components/recipe-seo-page";
import { databaseRecipes } from "@/lib/recipe-database";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return databaseRecipes.slice(0, 20).map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = databaseRecipes.find((item) => item.slug === slug);
  if (!recipe) return pageMetadata({ title: "Recipe not found", description: "Foody Fam recipe not found.", path: "/recipes" });
  return pageMetadata({
    title: `${recipe.title} - Baby-Safe Family Recipe`,
    description: `${recipe.description} Includes baby adaptations, adult finishing steps, ingredients, and nutrition notes.`,
    path: `/recipes/${recipe.slug}`
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = databaseRecipes.find((item) => item.slug === slug);
  if (!recipe) notFound();
  return <RecipeSeoPage recipe={recipe} />;
}
