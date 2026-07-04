import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Foody Fam dashboard");

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
