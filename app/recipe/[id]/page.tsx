"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Clock, ChefHat, ArrowLeft, Share2, Youtube, Globe, Star, AlertTriangle } from "lucide-react"
import { getRecipeById } from "@/lib/recipe-service"
import type { Recipe } from "@/lib/types"
import { toggleFavorite, isFavorite } from "@/lib/favorites"
import { cn } from "@/lib/utils"
import RatingDialog from "@/components/rating-dialog"
import { fetchYoutubeVideos } from "@/lib/youtube-service"
import type { YoutubeVideo } from "@/lib/types"
import IngredientSubstitution from "@/components/ingredient-substitution"

export default function RecipePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [favorite, setFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [ratingOpen, setRatingOpen] = useState(false)
  const [videos, setVideos] = useState<YoutubeVideo[]>([])

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeData = await getRecipeById(params.id)
        setRecipe(recipeData)
        setFavorite(isFavorite(recipeData.id))

        // Fetch related YouTube videos
        const videoResults = await fetchYoutubeVideos(recipeData.title)
        setVideos(videoResults)
      } catch (error) {
        console.error("Error fetching recipe:", error)
        setError("Recipe not found. It may have been removed or doesn't exist.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id])

  const handleToggleFavorite = () => {
    if (!recipe) return
    toggleFavorite(recipe)
    setFavorite(!favorite)
  }

  const toggleStep = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) {
      setCompletedSteps(completedSteps.filter((i) => i !== stepIndex))
    } else {
      setCompletedSteps([...completedSteps, stepIndex])
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Recipe Not Found</h2>
        <p className="text-muted-foreground mb-6">{error || "This recipe could not be found."}</p>
        <div className="flex gap-4">
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => router.push("/search")}>Search Recipes</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant={favorite ? "default" : "outline"} size="sm" onClick={handleToggleFavorite} className="gap-2">
            <Heart className={cn("h-4 w-4", favorite ? "fill-current" : "")} />
            {favorite ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-muted-foreground">
              <ChefHat className="h-4 w-4" />
              {recipe.cuisine}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {recipe.cookingTime}
            </span>
            {recipe.isSurprise && (
              <Badge variant="secondary" className="gap-1">
                <Globe className="h-3.5 w-3.5" />
                Surprise Dish
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {recipe.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="instructions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="instructions" className="space-y-4 mt-4">
            <div className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <Checkbox
                    id={`step-${index}`}
                    checked={completedSteps.includes(index)}
                    onCheckedChange={() => toggleStep(index)}
                    className="mt-1"
                  />
                  <div className={cn(completedSteps.includes(index) ? "text-muted-foreground line-through" : "")}>
                    <label htmlFor={`step-${index}`} className="font-medium block mb-1">
                      Step {index + 1}
                    </label>
                    <p>{step}</p>
                  </div>
                </div>
              ))}
            </div>

            {completedSteps.length === recipe.instructions.length && (
              <div className="pt-4">
                <Button onClick={() => setRatingOpen(true)} className="w-full gap-2">
                  <Star className="h-4 w-4" />
                  Rate This Recipe
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ingredients" className="mt-4">
            <Card className="p-4">
              <h3 className="font-medium mb-3">Ingredients List</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{ingredient}</span>
                        <IngredientSubstitution ingredient={ingredient.split(",")[0]} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <h3 className="font-medium mb-3">Nutrition Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {recipe.nutrition.map((item, index) => (
                    <div key={index} className="text-center p-2 bg-muted rounded-md">
                      <p className="text-xs sm:text-sm text-muted-foreground">{item.name}</p>
                      <p className="font-medium text-sm sm:text-base">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="mt-4 space-y-4">
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video relative">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                          <Youtube className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium line-clamp-2">{video.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{video.channelTitle}</p>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No videos found for this recipe.</div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <RatingDialog open={ratingOpen} onOpenChange={setRatingOpen} recipeId={recipe.id} recipeTitle={recipe.title} />
    </div>
  )
}
