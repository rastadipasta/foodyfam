import { AuthPage } from "@/components/auth-pages";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Forgot password");

export default function Page() {
  return <AuthPage mode="forgot" />;
}
