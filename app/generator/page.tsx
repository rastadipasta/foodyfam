import { GeneratorPage } from "@/components/product-pages";
import { JsonLd } from "@/components/json-ld";
import { coreFaqs, faqSchema, pageMetadata, softwareApplicationSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Recipe Generator for Baby and Family Meals",
  description:
    "Generate one family recipe with ingredient quantities, baby portion timing, adult seasoning steps, and a shopping list.",
  path: "/generator"
});

export default function Page() {
  return (
    <>
      <JsonLd data={[softwareApplicationSchema("/generator"), faqSchema(coreFaqs)]} />
      <GeneratorPage />
    </>
  );
}
