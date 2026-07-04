import { SimpleMarketingPage } from "@/components/product-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Foody Fam",
  description: "Contact Foody Fam with product questions, family meal planning feedback, and AI recipe ideas.",
  path: "/contact"
});

export default function Page() {
  return <SimpleMarketingPage type="contact" />;
}
