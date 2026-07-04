import { HomePage } from "@/components/home-page";
import { JsonLd } from "@/components/json-ld";
import { coreFaqs, faqSchema, organizationSchema, pageMetadata, softwareApplicationSchema, websiteSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Meal Planner for Baby-Safe Family Recipes",
  description:
    "Foody Fam creates one family meal with a baby-safe portion, adult finish, shopping list, and weekly planner.",
  path: "/"
});

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema(), softwareApplicationSchema("/"), faqSchema(coreFaqs)]} />
      <HomePage />
    </>
  );
}
