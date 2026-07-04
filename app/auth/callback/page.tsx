import { AuthCallbackPage } from "@/components/auth-pages";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Auth callback");

export default function Page() {
  return <AuthCallbackPage />;
}
