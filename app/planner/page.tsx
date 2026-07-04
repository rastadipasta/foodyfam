import { PlannerPage } from "@/components/product-pages";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Weekly Family Meal Planner",
  description:
    "Plan breakfast, lunch, and dinner for a full week with baby-aware recipes and one family shopping flow.",
  path: "/planner"
});

export default function Page() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema("/planner")} />
      <PlannerPage />
    </>
  );
}
