import type { Metadata } from "next";
import { AdminPage } from "@/components/admin-page";

export const metadata: Metadata = {
  title: "Admin Users",
  robots: {
    index: false,
    follow: false
  }
};

export default function Page() {
  return <AdminPage />;
}
