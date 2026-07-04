import { RecipesPage } from "@/components/product-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Baby-Safe Recipe Library",
  description:
    "Browse verified Foody Fam base recipes with baby adaptations, adult finishes, BLW tags, freezer-friendly meals, and family shopping lists.",
  path: "/recipes"
});

export default function Page() {
  return <RecipesPage />;
}
