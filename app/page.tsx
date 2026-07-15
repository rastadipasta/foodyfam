import { HomePage } from "@/components/home-page";
import { JsonLd } from "@/components/json-ld";
import { coreFaqs, faqSchema, organizationSchema, pageMetadata, softwareApplicationSchema, websiteSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "One Meal. Two Age-Appropriate Plates.",
  description:
    "Enter ingredients you already have and Foody Fam proposes one shared dinner with baby portion timing, adult finish, shopping list, and weekly planner.",
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
