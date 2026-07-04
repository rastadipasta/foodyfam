import { AssistantPage } from "@/components/product-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Cooking Assistant",
  description:
    "Ask Foody Fam about family meal swaps, baby texture checks, leftovers, freezer notes, and cautious allergy-aware cooking.",
  path: "/assistant"
});

export default function Page() {
  return <AssistantPage />;
}
