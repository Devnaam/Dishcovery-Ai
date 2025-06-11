"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, X, ChefHat, Leaf, TrendingUp } from "lucide-react"
import { generateLeftoverRecipes } from "@/lib/leftover-service"
import type { LeftoverRecipe } from "@/lib/types"
import LeftoverRecipeCard from "@/components/leftover-recipe-card"
import { getLeftoverStats, incrementSavedMeals } from "@/lib/leftover-stats"

export default function LeftoverGeniePage() {
  const [ingredient, setIngredient] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<LeftoverRecipe[]>([])
  const [loading, setLoading] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")
  const [activeTab, setActiveTab] = useState("quick")
  const [stats, setStats] = useState(getLeftoverStats())

  const commonLeftovers = [
    "Rice",
    "Dal",
    "Roti",
    "Bread",
    "Potatoes",
    "Onions",
    "Tomatoes",
    "Chicken",
    "Vegetables",
    "Pasta",
    "Cheese",
    "Eggs",
    "Milk",
    "Yogurt",
  ]

  const addIngredient = (ingredientToAdd: string = ingredient) => {
    const trimmedIngredient = ingredientToAdd.trim()
    if (trimmedIngredient && !ingredients.includes(trimmedIngredient.toLowerCase())) {
      setIngredients([...ingredients, trimmedIngredient.toLowerCase()])
      setIngredient("")
    }
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addIngredient()
    }
  }

  const handleGetRecipes = async () => {
    if (ingredients.length === 0 && !customPrompt.trim()) return

    setLoading(true)
    try {
      const results = await generateLeftoverRecipes(ingredients, customPrompt)
      setRecipes(results)
    } catch (error) {
      console.error("Error fetching leftover recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRecipe = () => {
    incrementSavedMeals()
    setStats(getLeftoverStats())
  }

  const clearAll = () => {
    setIngredients([])
    setCustomPrompt("")
    setRecipes([])
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Leftover Genie
          </h1>
        </div>
        <p className="text-xl text-muted-foreground mb-4">
          Transform your leftover ingredients into delicious meals with AI magic!
        </p>

        {/* Stats Card */}
        <Card className="max-w-md mx-auto bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
              <Leaf className="h-5 w-5" />
              <span className="font-medium">
                You saved {stats.savedMealsThisWeek} meals from being wasted this week!
              </span>
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            What leftovers do you have?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick">Quick Select</TabsTrigger>
              <TabsTrigger value="custom">Custom Description</TabsTrigger>
            </TabsList>

            <TabsContent value="quick" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  placeholder="Add a leftover ingredient..."
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button onClick={() => addIngredient()} disabled={!ingredient.trim()}>
                  Add
                </Button>
              </div>

              {/* Common Leftovers */}
              <div>
                <h4 className="text-sm font-medium mb-2">Common leftovers:</h4>
                <div className="flex flex-wrap gap-2">
                  {commonLeftovers.map((item) => (
                    <Button
                      key={item}
                      variant="outline"
                      size="sm"
                      onClick={() => addIngredient(item)}
                      disabled={ingredients.includes(item.toLowerCase())}
                      className="text-xs"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selected Ingredients */}
              {ingredients.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Your leftovers:</h4>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                        {item}
                        <button onClick={() => removeIngredient(index)} className="ml-2 hover:text-destructive">
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {item}</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <Textarea
                placeholder="Describe what leftovers you have... (e.g., 'I have some leftover rice, dal, and vegetables from yesterday's dinner')"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
              />
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              onClick={handleGetRecipes}
              disabled={(ingredients.length === 0 && !customPrompt.trim()) || loading}
              className="flex-1 gap-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating Magic..." : "Get Recipe Ideas"}
            </Button>
            {(ingredients.length > 0 || customPrompt.trim()) && (
              <Button variant="outline" onClick={clearAll} size="lg">
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">The Genie is working its magic...</p>
        </div>
      )}

      {/* Recipes Display */}
      {recipes.length > 0 && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recipe Suggestions</h2>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {recipes.length} recipes found
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <LeftoverRecipeCard key={index} recipe={recipe} onSave={handleSaveRecipe} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recipes.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Ready to create magic?</h3>
            <p className="text-muted-foreground">
              Add your leftover ingredients above and let the Genie suggest amazing recipes!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
