import { SimpleMarketingPage } from "@/components/product-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Baby-Safe Family Meal Planning Guides",
  description:
    "Practical guides for AI meal planning, baby-safe dinners, BLW, puree-friendly recipes, allergens, and weekly family planning.",
  path: "/blog"
});

export default function Page() {
  return <SimpleMarketingPage type="blog" />;
}
