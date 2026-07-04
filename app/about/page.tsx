import { SimpleMarketingPage } from "@/components/product-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Foody Fam",
  description: "Learn how Foody Fam helps parents cook one shared meal with baby-safe portions and adult finishes.",
  path: "/about"
});

export default function Page() {
  return <SimpleMarketingPage type="about" />;
}
