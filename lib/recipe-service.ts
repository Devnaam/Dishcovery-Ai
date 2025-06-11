"use client"

import type { Recipe } from "./types"
import { generateRecipeWithGemini } from "./gemini-service"
import { mockRecipes } from "./mock-recipes"

// Update the generateRecipes function to store generated recipes in localStorage
export async function generateRecipes(ingredients: string[], surprise = false): Promise<Recipe[]> {
  try {
    // Try to generate a recipe with Gemini API
    const result = await generateRecipeWithGemini(ingredients, surprise)

    if (result) {
      // Store the generated recipe in localStorage for later retrieval
      if (typeof window !== "undefined") {
        const generatedRecipes = JSON.parse(localStorage.getItem("dishcovery-generated-recipes") || "[]")
        // Check if recipe with this ID already exists
        const existingIndex = generatedRecipes.findIndex((r: Recipe) => r.id === result.id)
        if (existingIndex >= 0) {
          generatedRecipes[existingIndex] = result
        } else {
          generatedRecipes.push(result)
        }
        localStorage.setItem("dishcovery-generated-recipes", JSON.stringify(generatedRecipes))
        // Dispatch storage event to update other components
        window.dispatchEvent(new Event("storage"))
      }
      return [result]
    }

    // Fallback to mock data if Gemini fails
    return mockRecipes.filter((recipe) =>
      ingredients.some((ingredient) =>
        recipe.ingredients.some((recipeIng) => recipeIng.toLowerCase().includes(ingredient.toLowerCase())),
      ),
    )
  } catch (error) {
    console.error("Error generating recipes:", error)

    // Fallback to mock data
    return mockRecipes.filter((recipe) =>
      ingredients.some((ingredient) =>
        recipe.ingredients.some((recipeIng) => recipeIng.toLowerCase().includes(ingredient.toLowerCase())),
      ),
    )
  }
}

// Update the getRecipeById function to check localStorage for generated recipes
export async function getRecipeById(id: string): Promise<Recipe> {
  // First check in mock recipes
  const mockRecipe = mockRecipes.find((r) => r.id === id)

  if (mockRecipe) {
    return mockRecipe
  }

  // If not found in mock recipes, check in localStorage for generated recipes
  if (typeof window !== "undefined") {
    const generatedRecipes = JSON.parse(localStorage.getItem("dishcovery-generated-recipes") || "[]")
    const generatedRecipe = generatedRecipes.find((r: Recipe) => r.id === id)

    if (generatedRecipe) {
      return generatedRecipe
    }
  }

  // If still not found, throw an error
  throw new Error("Recipe not found")
}

export async function getCuisineRecipes(cuisine: string): Promise<Recipe[]> {
  // In a real app, we would fetch from an API or database
  return mockRecipes.filter((recipe) => recipe.cuisine.toLowerCase() === cuisine.toLowerCase())
}
