"use client";

import Image from "next/image";
import { Clock, Flame, Star } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { Button, Card, Pill } from "./ui";
import { useAppStore } from "@/store/useAppStore";

export function RecipeShowcase({ recipe }: { recipe: Recipe }) {
  const saveRecipe = useAppStore((state) => state.saveRecipe);
  const saved = useAppStore((state) => state.savedRecipeIds.includes(recipe.id));

  return (
    <Card className="grid gap-6 p-0 lg:grid-cols-[0.85fr_1.35fr]">
      <div className="relative min-h-[320px] overflow-hidden rounded-[24px] lg:rounded-r-none">
        <Image src={recipe.image} alt={recipe.title} fill className="object-cover object-top" />
      </div>
      <div className="grid gap-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-black">{recipe.title}</h2>
            <div className="mt-3 flex flex-wrap gap-4 text-sm font-extrabold text-[#5c4a42]">
              <span className="inline-flex items-center gap-1"><Clock size={16} /> {recipe.time}</span>
              <span className="inline-flex items-center gap-1"><Flame size={16} /> {recipe.difficulty}</span>
              <span className="inline-flex items-center gap-1 text-[#f5b52f]"><Star size={16} fill="currentColor" /> {recipe.rating}</span>
            </div>
          </div>
          <Button variant={saved ? "coral" : "secondary"} onClick={() => saveRecipe(recipe.id)}>
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="mb-3 text-sm font-black text-[#5c4a42]">Cooking steps</p>
            <ol className="grid gap-3">
              {recipe.steps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm font-bold">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#78bea8] font-black text-white">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] bg-[#f7efe9] p-5">
              <h3 className="font-display text-xl font-black text-[#78bea8]">For Baby</h3>
              <p className="mt-1 text-xs font-black text-[#5c4a42]">6-8 months</p>
              <ul className="mt-4 grid gap-2 text-sm font-bold">{recipe.baby.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="rounded-[22px] bg-[#ffccb2]/75 p-5">
              <h3 className="font-display text-xl font-black text-[#5c4a42]">For Adults</h3>
              <p className="mt-1 text-xs font-black text-[#5c4a42]">Family plate</p>
              <ul className="mt-4 grid gap-2 text-sm font-bold">{recipe.adults.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill>Protein {recipe.nutrition.protein}%</Pill>
          <Pill>Iron {recipe.nutrition.iron}</Pill>
          <Pill>Vitamin C {recipe.nutrition.vitaminC}</Pill>
          <Pill>{recipe.nutrition.fiber}</Pill>
        </div>
      </div>
    </Card>
  );
}
