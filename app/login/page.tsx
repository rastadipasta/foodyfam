import { AuthPage } from "@/components/auth-pages";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Log in");

export default function Page() {
  return <AuthPage mode="login" />;
}
