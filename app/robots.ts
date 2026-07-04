import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/login",
        "/register",
        "/forgot-password",
        "/onboarding",
        "/auth/callback",
        "/pantry",
        "/dashboard/pantry"
      ]
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
