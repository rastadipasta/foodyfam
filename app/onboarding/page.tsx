import { OnboardingPage } from "@/components/product-pages";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Onboarding");

export default function Page() {
  return <OnboardingPage />;
}
