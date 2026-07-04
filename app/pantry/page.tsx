import { redirect } from "next/navigation";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Pantry redirect");

export default function Page() {
  redirect("/shopping");
}
