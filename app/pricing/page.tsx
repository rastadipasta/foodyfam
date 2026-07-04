import { SimpleMarketingPage } from "@/components/product-pages";
import { JsonLd } from "@/components/json-ld";
import { coreFaqs, faqSchema, pageMetadata, softwareApplicationSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Foody Fam Pricing",
  description:
    "Compare Foody Fam Free, Premium, and Unlimited plans for AI meal generation, weekly planning, recipes, and shopping lists.",
  path: "/pricing"
});

export default function Page() {
  return (
    <>
      <JsonLd data={[softwareApplicationSchema("/pricing"), faqSchema(coreFaqs)]} />
      <SimpleMarketingPage type="pricing" />
    </>
  );
}
