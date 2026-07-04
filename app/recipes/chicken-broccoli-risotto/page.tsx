import { RecipeSeoPage } from "@/components/recipe-seo-page";
import { databaseRecipes } from "@/lib/recipe-database";
import { pageMetadata } from "@/lib/seo";

const recipe = databaseRecipes.find((item) => item.slug === "chicken-broccoli-risotto") || databaseRecipes[15];

export const metadata = pageMetadata({
  title: "Chicken Broccoli Risotto - Baby-Safe Family Recipe",
  description:
    "Chicken Broccoli Risotto with baby adaptations, adult finishing steps, ingredients, nutrition notes, and one shared cooking process.",
  path: "/recipes/chicken-broccoli-risotto"
});

export default function Page() {
  return <RecipeSeoPage recipe={recipe} />;
}
