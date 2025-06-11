"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { Recipe } from "@/lib/types"
import { getCuisineRecipes } from "@/lib/recipe-service"
import RecipeList from "@/components/recipe-list"

export default function CuisinePage({ params }: { params: { cuisine: string } }) {
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  const cuisineName = params.cuisine.charAt(0).toUpperCase() + params.cuisine.slice(1)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipeData = await getCuisineRecipes(cuisineName)
        setRecipes(recipeData)
      } catch (error) {
        console.error("Error fetching cuisine recipes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [cuisineName])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">{cuisineName} Cuisine</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : recipes.length > 0 ? (
        <RecipeList recipes={recipes} userIngredients={[]} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">No recipes found for {cuisineName} cuisine.</div>
      )}
    </div>
  )
}
