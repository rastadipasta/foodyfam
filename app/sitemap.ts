import type { MetadataRoute } from "next";
import { databaseRecipes } from "@/lib/recipe-database";
import { seoGuides } from "@/lib/seo-content";
import { absoluteUrl } from "@/lib/seo";

const publicRoutes = [
  "/",
  "/recipes",
  "/generator",
  "/planner",
  "/shopping",
  "/nutrition",
  "/pricing",
  "/blog",
  "/about",
  "/experts",
  "/contact",
  "/privacy",
  "/cookies"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const recipes = databaseRecipes.slice(0, 20).map((recipe) => `/recipes/${recipe.slug}`);
  const guides = seoGuides.map((guide) => `/blog/${guide.slug}`);

  return [...publicRoutes, ...recipes, ...guides].map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/recipes/") || route.startsWith("/blog/") ? 0.75 : 0.85
  }));
}
