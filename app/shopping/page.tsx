import { ShoppingPage } from "@/components/product-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Family Shopping List",
  description:
    "Turn planned family recipes into one smart shopping list with ingredients for baby-safe portions and adult meals.",
  path: "/shopping"
});

export default function Page() {
  return <ShoppingPage />;
}
