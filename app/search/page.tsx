"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X, Sparkles } from "lucide-react"
import RecipeList from "@/components/recipe-list"
import { generateRecipes } from "@/lib/recipe-service"
import type { Recipe } from "@/lib/types"
import AISuggestionButton from "@/components/ai-suggestion-button"

export default function SearchPage() {
  const [ingredient, setIngredient] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")

  const addIngredient = () => {
    if (ingredient.trim() && !ingredients.includes(ingredient.trim().toLowerCase())) {
      setIngredients([...ingredients, ingredient.trim().toLowerCase()])
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

  const handleSearch = async () => {
    if (ingredients.length === 0) return

    setLoading(true)
    try {
      const results = await generateRecipes(ingredients)
      setRecipes(results)
    } catch (error) {
      console.error("Error fetching recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSurpriseMe = async () => {
    if (ingredients.length === 0) return

    setLoading(true)
    try {
      const results = await generateRecipes(ingredients, true)
      setRecipes(results)
    } catch (error) {
      console.error("Error fetching surprise recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Recipes by Ingredients</h1>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Add an ingredient (e.g., tomato, chicken, rice)"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={addIngredient} className="mt-2 sm:mt-0">
              Add
            </Button>
          </div>

          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
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
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={handleSearch}
                disabled={ingredients.length === 0 || loading}
                className="flex-1 gap-2 w-full sm:w-auto"
              >
                <Search className="h-4 w-4" />
                Discover Recipes
              </Button>
              <Button
                onClick={handleSurpriseMe}
                disabled={ingredients.length === 0 || loading}
                variant="secondary"
                className="flex-1 gap-2 w-full sm:w-auto"
              >
                <Sparkles className="h-4 w-4" />
                Surprise Me
              </Button>
            </div>

            {ingredients.length > 0 && (
              <AISuggestionButton ingredients={ingredients} onSuggestionSelected={setAiSuggestion} />
            )}
          </div>

          {aiSuggestion && (
            <div className="mt-2 p-3 bg-primary/10 rounded-md border border-primary/20">
              <h3 className="text-sm font-medium flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI Suggestion
              </h3>
              <p className="text-sm">{aiSuggestion}</p>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : recipes.length > 0 ? (
        <RecipeList recipes={recipes} userIngredients={ingredients} />
      ) : null}
    </div>
  )
}
