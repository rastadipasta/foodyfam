"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, Star } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { Button, Card, Pill } from "./ui";

export function RecipeCard({ recipe, compact = false }: { recipe: Recipe; compact?: boolean }) {
  const savedRecipeIds = useAppStore((state) => state.savedRecipeIds);
  const saveRecipe = useAppStore((state) => state.saveRecipe);
  const saved = savedRecipeIds.includes(recipe.id);

  return (
    <Card className="grid gap-4 overflow-hidden p-0">
      <Link href={`/recipes/${recipe.slug}`} className="relative block aspect-[4/3] overflow-hidden rounded-t-[24px]">
        <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
      </Link>
      <div className="grid gap-3 p-5 pt-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/recipes/${recipe.slug}`} className="font-display text-xl font-black text-[#1f1d1c] hover:text-[#f59b78]">
              {recipe.title}
            </Link>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-extrabold text-[#5c4a42]">
              <span className="inline-flex items-center gap-1">
                <Clock size={14} /> {recipe.time}
              </span>
              <span>{recipe.difficulty}</span>
              <span className="inline-flex items-center gap-1 text-[#f5b52f]">
                <Star size={14} fill="currentColor" /> {recipe.rating}
              </span>
            </div>
          </div>
          <button
            aria-label={saved ? "Remove from saved" : "Save recipe"}
            className="rounded-full bg-[#f7efe9] p-3 text-[#f59b78] transition hover:scale-105"
            onClick={() => saveRecipe(recipe.id)}
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        {!compact && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
        )}
        <Link href={`/recipes/${recipe.slug}`}>
          <Button variant="secondary" className="w-full">Open recipe</Button>
        </Link>
      </div>
    </Card>
  );
}
