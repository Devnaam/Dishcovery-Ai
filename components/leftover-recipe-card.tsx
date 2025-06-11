"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, ChefHat, ThumbsUp, ThumbsDown, ChevronDown, Star, Utensils } from "lucide-react"
import type { LeftoverRecipe } from "@/lib/types"
import { getLeftoverRating, saveLeftoverRating } from "@/lib/leftover-stats"
import { cn } from "@/lib/utils"

interface LeftoverRecipeCardProps {
  recipe: LeftoverRecipe
  onSave: () => void
}

export default function LeftoverRecipeCard({ recipe, onSave }: LeftoverRecipeCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [rating, setRating] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setRating(getLeftoverRating(recipe.id))
  }, [recipe.id])

  const handleSave = () => {
    setIsSaved(true)
    onSave()

    // Reset after animation
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleRating = (newRating: number) => {
    setRating(newRating)
    saveLeftoverRating(recipe.id, newRating)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getCuisineIcon = (cuisine: string) => {
    const cuisineLower = cuisine.toLowerCase()
    if (cuisineLower.includes("indian")) return "🇮🇳"
    if (cuisineLower.includes("italian")) return "🇮🇹"
    if (cuisineLower.includes("chinese")) return "🇨🇳"
    if (cuisineLower.includes("mexican")) return "🇲🇽"
    if (cuisineLower.includes("thai")) return "🇹🇭"
    if (cuisineLower.includes("japanese")) return "🇯🇵"
    if (cuisineLower.includes("korean")) return "🇰🇷"
    if (cuisineLower.includes("french")) return "🇫🇷"
    return "🌍"
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
              {recipe.name}
            </CardTitle>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="text-base">{getCuisineIcon(recipe.cuisine)}</span>
                <span>{recipe.cuisine}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{recipe.cookingTime}</span>
              </div>
              <Badge variant="outline" className={getDifficultyColor(recipe.difficulty || "Easy")}>
                {recipe.difficulty || "Easy"}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={cn(
              "text-muted-foreground hover:text-primary transition-all duration-200",
              isSaved && "text-primary scale-110",
            )}
          >
            <Heart className={cn("h-4 w-4 transition-all", isSaved && "fill-current")} />
            <span className="sr-only">Save recipe</span>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{recipe.description}</p>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        {/* User Ingredients Used */}
        <div>
          <h4 className="text-xs font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
            <Utensils className="h-3 w-3" />
            Your leftovers used:
          </h4>
          <div className="flex flex-wrap gap-1">
            {recipe.userIngredients.map((ingredient, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
              >
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        {/* Toggle Button */}
        <Button variant="outline" className="w-full justify-between text-sm" onClick={toggleExpanded}>
          {isExpanded ? "Hide" : "View"} Full Recipe
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")} />
        </Button>

        {/* Expandable Content */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="space-y-4 pt-2">
            {/* Complete Ingredients */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                Complete Ingredients:
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 font-bold">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Complete Instructions */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <ChefHat className="h-3.5 w-3.5" />
                Step-by-Step Instructions:
              </h4>
              <ol className="text-xs space-y-2 text-muted-foreground">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-primary font-bold bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Quick Preview when collapsed */}
        {!isExpanded && (
          <div>
            <h4 className="text-sm font-medium mb-2">Quick Preview:</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <span className="font-medium">Ingredients:</span> {recipe.ingredients.length} items needed
              </p>
              <p>
                <span className="font-medium">Steps:</span> {recipe.instructions.length} easy steps
              </p>
              <p className="italic">Click "View Full Recipe" for complete details</p>
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-xs text-muted-foreground">Rate this recipe:</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRating(rating === -1 ? 0 : -1)}
              className={cn(
                "h-8 w-8 p-0 transition-all",
                rating === -1 ? "text-red-500 bg-red-50 dark:bg-red-950" : "text-muted-foreground hover:text-red-500",
              )}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRating(rating === 1 ? 0 : 1)}
              className={cn(
                "h-8 w-8 p-0 transition-all",
                rating === 1
                  ? "text-green-500 bg-green-50 dark:bg-green-950"
                  : "text-muted-foreground hover:text-green-500",
              )}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
