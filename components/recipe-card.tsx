"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, Star } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { Button, Card, Pill } from "./ui";

export function RecipeCard({
  recipe,
  compact = false,
  textOnly = false,
  onOpen
}: {
  recipe: Recipe;
  compact?: boolean;
  textOnly?: boolean;
  onOpen?: (recipe: Recipe) => void;
}) {
  const savedRecipeIds = useAppStore((state) => state.savedRecipeIds);
  const saveRecipe = useAppStore((state) => state.saveRecipe);
  const saved = savedRecipeIds.includes(recipe.id);
  const cardPadding = textOnly ? "p-5" : "p-0";
  const bodyPadding = textOnly ? "p-0" : "p-5 pt-0";

  return (
    <Card
      className={`grid gap-4 overflow-hidden ${cardPadding} ${
        textOnly
          ? "border border-[#e9c7b7]/80 bg-[linear-gradient(145deg,#fffaf6_0%,#f7efe9_46%,#ffccb2_140%)] shadow-[0_18px_45px_rgba(92,74,66,0.08)]"
          : ""
      }`}
    >
      {!textOnly && (
        <Link href={`/recipes/${recipe.slug}`} className="relative block aspect-[4/3] overflow-hidden rounded-t-[24px]">
          <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
        </Link>
      )}
      <div className={`grid gap-3 ${bodyPadding}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            {onOpen ? (
              <button className="text-left font-display text-xl font-black text-[#1f1d1c] hover:text-[#f59b78]" onClick={() => onOpen(recipe)}>
                {recipe.title}
              </button>
            ) : (
              <Link href={`/recipes/${recipe.slug}`} className="font-display text-xl font-black text-[#1f1d1c] hover:text-[#f59b78]">
                {recipe.title}
              </Link>
            )}
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-extrabold text-[#5c4a42]">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1">
                <Clock size={14} /> {recipe.time}
              </span>
              <span className="rounded-full bg-white/70 px-2 py-1">{recipe.difficulty}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[#f5b52f]">
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
            {recipe.tags.slice(0, textOnly ? 5 : recipe.tags.length).map((tag, index) => (
              <Pill key={tag} className={textOnly && index % 3 === 0 ? "bg-[#f7efe9]" : textOnly && index % 3 === 1 ? "bg-[#ffccb2]/70" : ""}>{tag}</Pill>
            ))}
          </div>
        )}
        {recipe.description && textOnly && <p className="line-clamp-3 text-sm font-bold leading-6 text-[#5c4a42]">{recipe.description}</p>}
        {onOpen ? (
          <Button variant="secondary" className="w-full" onClick={() => onOpen(recipe)}>Open recipe</Button>
        ) : (
          <Link href={`/recipes/${recipe.slug}`}>
            <Button variant="secondary" className="w-full">Open recipe</Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
