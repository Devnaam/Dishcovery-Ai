"use client"

import type { Recipe } from "@/lib/types"
import RecipeCard from "./recipe-card"

interface RecipeListProps {
  recipes: Recipe[]
  userIngredients: string[]
}

export default function RecipeList({ recipes, userIngredients }: RecipeListProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Recipe Suggestions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} userIngredients={userIngredients} />
        ))}
      </div>
    </div>
  )
}
