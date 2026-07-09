import { noIndexMetadata } from "@/lib/seo";
import { BillingSuccess } from "@/components/billing-success";

export const metadata = noIndexMetadata("Subscription confirmed");

export default function Page() {
  return <BillingSuccess />;
}
