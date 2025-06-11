"use client"

import type { Recipe } from "./types"

const GEMINI_API_KEY = "AIzaSyBtgRmkYVpxsCuSpYdYbHJATwAy82Yt1Ds"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string
      }[]
    }
  }[]
}

export async function generateRecipeWithGemini(ingredients: string[], surprise = false): Promise<Recipe | null> {
  try {
    const prompt = createRecipePrompt(ingredients, surprise)

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data: GeminiResponse = await response.json()

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API")
    }

    const recipeText = data.candidates[0].content.parts[0].text
    return parseGeminiResponse(recipeText, ingredients, surprise)
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return null
  }
}

function createRecipePrompt(ingredients: string[], surprise: boolean): string {
  const basePrompt = `Create a recipe using these ingredients: ${ingredients.join(", ")}.`

  if (surprise) {
    return `${basePrompt} Make it a creative, fusion dish that combines elements from different global cuisines. Include a title, cuisine type, cooking time, full ingredients list (including the ones provided), step-by-step instructions, and 2-3 dietary tags (like "Vegetarian", "Gluten-Free", etc.). Format the response in a way that's easy to parse.`
  } else {
    return `${basePrompt} Include a title, cuisine type, cooking time, full ingredients list (including the ones provided), step-by-step instructions, and 2-3 dietary tags (like "Vegetarian", "Gluten-Free", etc.). Format the response in a way that's easy to parse.`
  }
}

function parseGeminiResponse(text: string, userIngredients: string[], isSurprise: boolean): Recipe {
  // Extract title (usually the first line)
  const titleMatch = text.match(/^#*\s*(.+?)(?:\r?\n|$)/) || text.match(/^(.+?)(?:\r?\n|$)/)
  const title = titleMatch ? titleMatch[1].trim() : "Custom Recipe"

  // Extract cuisine
  const cuisineMatch = text.match(/cuisine:?\s*([^\n]+)/i) || text.match(/([A-Za-z]+)\s+cuisine/i)
  const cuisine = cuisineMatch ? cuisineMatch[1].trim() : isSurprise ? "Fusion" : "International"

  // Extract cooking time
  const timeMatch =
    text.match(/time:?\s*([^\n]+)/i) ||
    text.match(/takes\s+([^\n]+)/i) ||
    text.match(/(\d+\s*(?:minutes|mins|min|hours|hrs))/i)
  const cookingTime = timeMatch ? timeMatch[1].trim() : "30 mins"

  // Extract ingredients
  const ingredientsSection = text.match(/ingredients:?\s*\n([\s\S]*?)(?:\n\s*\n|\n\s*#|\n\s*instructions)/i)
  let ingredients: string[] = []

  if (ingredientsSection) {
    ingredients = ingredientsSection[1]
      .split("\n")
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter((line) => line.length > 0)
  } else {
    // Fallback: try to find list items that might be ingredients
    const listItems = text.match(/[-*•]\s*([^\n]+)/g)
    if (listItems) {
      ingredients = listItems.map((item) => item.replace(/^[-*•]\s*/, "").trim())
    } else {
      // Ensure we at least include the user's ingredients
      ingredients = userIngredients.map((ing) => ing)
    }
  }

  // Extract instructions
  const instructionsSection = text.match(/instructions:?\s*\n([\s\S]*?)(?:\n\s*\n|\n\s*#|$)/i)
  let instructions: string[] = []

  if (instructionsSection) {
    instructions = instructionsSection[1]
      .split("\n")
      .map((line) =>
        line
          .replace(/^\d+\.\s*/, "")
          .replace(/^[-*•]\s*/, "")
          .trim(),
      )
      .filter((line) => line.length > 0)
  } else {
    // Fallback: try to find numbered items that might be instructions
    const numberedItems = text.match(/\d+\.\s*([^\n]+)/g)
    if (numberedItems) {
      instructions = numberedItems.map((item) => item.replace(/^\d+\.\s*/, "").trim())
    } else {
      instructions = ["Combine all ingredients in a bowl", "Cook according to your preference", "Serve and enjoy!"]
    }
  }

  // Extract tags
  const tagsMatch =
    text.match(/tags:?\s*([^\n]+)/i) ||
    text.match(/(vegetarian|vegan|gluten-free|dairy-free|quick|easy|healthy|spicy)/gi)
  let tags: string[] = []

  if (tagsMatch) {
    if (Array.isArray(tagsMatch)) {
      tags = [...new Set(tagsMatch.map((tag) => tag.trim()))]
    } else {
      tags = tagsMatch[1].split(/[,|]/).map((tag) => tag.trim())
    }
  } else {
    // Default tags
    tags = isSurprise ? ["Fusion", "Creative"] : ["Homemade", "Custom"]
  }

  // Filter out empty tags and limit to 3
  tags = tags.filter((tag) => tag.length > 0).slice(0, 3)

  // Generate mock nutrition data
  const nutrition = [
    { name: "Calories", value: `${300 + Math.floor(Math.random() * 200)} kcal` },
    { name: "Protein", value: `${10 + Math.floor(Math.random() * 15)}g` },
    { name: "Carbs", value: `${30 + Math.floor(Math.random() * 30)}g` },
    { name: "Fat", value: `${8 + Math.floor(Math.random() * 15)}g` },
  ]

  return {
    id: `gen-${Date.now()}`,
    title,
    cuisine,
    cookingTime,
    ingredients,
    instructions,
    tags,
    isSurprise,
    nutrition,
  }
}

export async function getIngredientSubstitutions(ingredient: string): Promise<string[]> {
  try {
    const prompt = `Suggest 3-5 common substitutes for ${ingredient} that people might have in their kitchen. Only list the substitutes, no explanations needed.`

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data: GeminiResponse = await response.json()

    if (!data.candidates || data.candidates.length === 0) {
      return []
    }

    const substitutesText = data.candidates[0].content.parts[0].text

    // Parse the response to extract substitutes
    const substitutes = substitutesText
      .split(/\n|,|-|\*|•/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && !item.includes(":") && !item.toLowerCase().includes("substitute"))
      .slice(0, 5)

    return substitutes
  } catch (error) {
    console.error("Error getting substitutions:", error)
    return []
  }
}
