"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, Star } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { Button, Card, Pill, RecipeTicket } from "./ui";

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
      className={`grid gap-4 overflow-hidden ${cardPadding} ${textOnly ? "!bg-transparent !p-0 !shadow-none before:hidden" : ""}`}
    >
      {textOnly ? (
        <RecipeTicket className="grid h-full gap-3 bg-white p-5">
          <RecipeCardBody recipe={recipe} compact={compact} textOnly={textOnly} onOpen={onOpen} saved={saved} onSave={() => saveRecipe(recipe.id)} />
        </RecipeTicket>
      ) : (
        <>
      {!textOnly && (
        <Link href={`/recipes/${recipe.slug}`} className="relative block aspect-[4/3] overflow-hidden rounded-t-[24px]">
          <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
        </Link>
      )}
      <RecipeCardBody recipe={recipe} compact={compact} textOnly={textOnly} onOpen={onOpen} saved={saved} onSave={() => saveRecipe(recipe.id)} className={bodyPadding} />
        </>
      )}
    </Card>
  );
}

function RecipeCardBody({
  recipe,
  compact,
  textOnly,
  onOpen,
  saved,
  onSave,
  className
}: {
  recipe: Recipe;
  compact: boolean;
  textOnly: boolean;
  onOpen?: (recipe: Recipe) => void;
  saved: boolean;
  onSave: () => void;
  className?: string;
}) {
  return (
      <div className={`grid gap-3 ${className || ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            {onOpen ? (
              <button className="text-left font-display text-xl font-black leading-tight text-[#1f1d1c]" onClick={() => onOpen(recipe)}>
                {recipe.title}
              </button>
            ) : (
              <Link href={`/recipes/${recipe.slug}`} className="font-display text-xl font-black leading-tight text-[#1f1d1c]">
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
            className="tap-target rounded-full bg-[#f7efe9] p-3 text-[#f59b78] shadow-sm transition active:scale-95"
            onClick={onSave}
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
          <Button variant="secondary" className="mt-1 w-full" onClick={() => onOpen(recipe)}>Open recipe</Button>
        ) : (
          <Link href={`/recipes/${recipe.slug}`}>
            <Button variant="secondary" className="mt-1 w-full">Open recipe</Button>
          </Link>
        )}
      </div>
  );
}
