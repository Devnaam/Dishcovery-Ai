"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Heart, Globe, ChefHat } from "lucide-react"
import type { Recipe } from "@/lib/types"
import { toggleFavorite, isFavorite } from "@/lib/favorites"
import { cn } from "@/lib/utils"

interface RecipeCardProps {
  recipe: Recipe
  userIngredients: string[]
}

export default function RecipeCard({ recipe, userIngredients }: RecipeCardProps) {
  const [favorite, setFavorite] = useState(isFavorite(recipe.id))

  const handleToggleFavorite = () => {
    toggleFavorite(recipe)
    setFavorite(!favorite)
  }

  // Calculate which ingredients the user has and which are missing
  const hasIngredients = recipe.ingredients.filter((ing) =>
    userIngredients.some((userIng) => ing.toLowerCase().includes(userIng)),
  )

  const missingIngredients = recipe.ingredients.filter(
    (ing) => !userIngredients.some((userIng) => ing.toLowerCase().includes(userIng)),
  )

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <h3 className="text-xl font-bold">{recipe.title}</h3>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                {recipe.cuisine}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {recipe.cookingTime}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className="text-muted-foreground hover:text-primary self-end sm:self-auto"
          >
            <Heart className={cn("h-5 w-5", favorite ? "fill-primary text-primary" : "")} />
            <span className="sr-only">{favorite ? "Remove from favorites" : "Add to favorites"}</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {recipe.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {recipe.isSurprise && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Globe className="h-3 w-3" />
              Surprise Dish
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-4 flex-grow">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Ingredients you have:</h4>
            <div className="flex flex-wrap gap-1.5">
              {hasIngredients.map((ing, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {ing}
                </Badge>
              ))}
            </div>
          </div>

          {missingIngredients.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Missing ingredients:</h4>
              <div className="flex flex-wrap gap-1.5">
                {missingIngredients.map((ing, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-muted-foreground">
                    {ing}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/recipe/${recipe.id}`}>View Recipe</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
