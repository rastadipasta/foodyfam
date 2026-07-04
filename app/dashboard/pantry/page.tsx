import { redirect } from "next/navigation";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Dashboard pantry redirect");

export default function Page() {
  redirect("/dashboard/shopping");
}
