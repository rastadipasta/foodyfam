import { NutritionPage } from "@/components/product-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Family Nutrition Insights",
  description:
    "Understand protein, iron, fiber, vitamin C, baby texture notes, and family nutrition signals in Foody Fam meals.",
  path: "/nutrition"
});

export default function Page() {
  return <NutritionPage />;
}
