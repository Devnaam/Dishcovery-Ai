"use client"

import type { LeftoverRecipe } from "./types"

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

export async function generateLeftoverRecipes(ingredients: string[], customPrompt?: string): Promise<LeftoverRecipe[]> {
  try {
    const prompt = createLeftoverPrompt(ingredients, customPrompt)

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
    return parseLeftoverRecipes(recipeText, ingredients)
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return []
  }
}

function createLeftoverPrompt(ingredients: string[], customPrompt?: string): string {
  if (customPrompt && customPrompt.trim()) {
    return `Based on this description of leftover ingredients: "${customPrompt}", suggest 3 detailed and creative recipes focusing on Indian and global cuisines. 

For each recipe, provide EXACTLY this format:

**RECIPE 1: [Unique Creative Recipe Name]**
**Cuisine:** [Indian/Italian/Chinese/etc.]
**Cooking Time:** [X minutes]
**Description:** [2-line creative description of the dish, its flavors, and appeal]

**Ingredients:**
- [Complete ingredient list including leftovers and additional items needed]
- [Each ingredient on a new line with quantities]

**Instructions:**
1. [Detailed first step]
2. [Detailed second step]
3. [Detailed third step]
4. [Detailed fourth step]
5. [Additional steps as needed]

**RECIPE 2: [Another Unique Creative Recipe Name]**
[Same format as above]

**RECIPE 3: [Third Unique Creative Recipe Name]**
[Same format as above]

Make each recipe unique, creative, and practical for home cooking. Focus on transforming leftovers into exciting new dishes.`
  }

  return `Suggest 3 detailed and creative recipes using these leftover ingredients: ${ingredients.join(", ")}. Focus on Indian and global cuisines and make each recipe unique and exciting.

For each recipe, provide EXACTLY this format:

**RECIPE 1: [Unique Creative Recipe Name]**
**Cuisine:** [Indian/Italian/Chinese/etc.]
**Cooking Time:** [X minutes]
**Description:** [2-line creative description of the dish, its flavors, and appeal]

**Ingredients:**
- ${ingredients.map((ing) => `${ing} (leftover)`).join("\n- ")}
- [Additional ingredients needed with quantities]

**Instructions:**
1. [Detailed first step with specific actions]
2. [Detailed second step with specific actions]
3. [Detailed third step with specific actions]
4. [Detailed fourth step with specific actions]
5. [Additional steps as needed for completion]

**RECIPE 2: [Another Unique Creative Recipe Name]**
[Same format as above]

**RECIPE 3: [Third Unique Creative Recipe Name]**
[Same format as above]

Make each recipe creative, transforming the leftovers into exciting fusion dishes. Include specific cooking techniques and make them easy to follow for home cooks.`
}

function parseLeftoverRecipes(text: string, userIngredients: string[]): LeftoverRecipe[] {
  const recipes: LeftoverRecipe[] = []

  // Split by recipe markers
  const recipeBlocks = text.split(/\*\*RECIPE \d+:/i).filter((block) => block.trim().length > 0)

  // Remove the first block if it's just introductory text
  if (recipeBlocks.length > 3) {
    recipeBlocks.shift()
  }

  for (let i = 0; i < Math.min(recipeBlocks.length, 3); i++) {
    const block = recipeBlocks[i]

    try {
      // Extract recipe name (first line after the recipe marker)
      const nameMatch = block.match(/^([^*\n]+?)(?:\*\*|$)/m)
      const name = nameMatch ? nameMatch[1].trim().replace(/\*\*/g, "") : `Creative Leftover Recipe ${i + 1}`

      // Extract cuisine
      const cuisineMatch = block.match(/\*\*Cuisine:\*\*\s*([^\n]+)/i)
      const cuisine = cuisineMatch ? cuisineMatch[1].trim() : "Fusion"

      // Extract cooking time
      const timeMatch = block.match(/\*\*Cooking Time:\*\*\s*([^\n]+)/i)
      const cookingTime = timeMatch ? timeMatch[1].trim() : "30 minutes"

      // Extract description
      const descMatch = block.match(/\*\*Description:\*\*\s*([^\n]+(?:\n[^*\n]+)*)/i)
      const description = descMatch
        ? descMatch[1].trim().replace(/\n/g, " ")
        : `A creative fusion dish that transforms your leftover ${userIngredients.join(", ")} into something delicious and exciting.`

      // Extract ingredients
      const ingredientsMatch = block.match(/\*\*Ingredients:\*\*\s*((?:\n?[-•*]\s*[^\n]+)+)/i)
      let ingredients: string[] = []

      if (ingredientsMatch) {
        ingredients = ingredientsMatch[1]
          .split("\n")
          .map((line) => line.replace(/^[-•*]\s*/, "").trim())
          .filter((line) => line.length > 0)
      } else {
        // Fallback ingredients
        ingredients = [
          ...userIngredients.map((ing) => `${ing} (leftover)`),
          "Salt and pepper to taste",
          "Oil for cooking",
          "Additional spices as needed",
        ]
      }

      // Extract instructions
      const instructionsMatch = block.match(/\*\*Instructions:\*\*\s*((?:\n?\d+\.\s*[^\n]+)+)/i)
      let instructions: string[] = []

      if (instructionsMatch) {
        instructions = instructionsMatch[1]
          .split("\n")
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .filter((line) => line.length > 0)
      } else {
        // Fallback instructions based on common cooking patterns
        instructions = [
          `Heat oil in a pan and prepare your leftover ${userIngredients.join(", ")} by chopping or breaking them into suitable pieces.`,
          "Add aromatics like onions, garlic, or ginger to the pan and sauté until fragrant.",
          `Incorporate the leftover ${userIngredients[0] || "ingredients"} and mix well with the aromatics.`,
          "Season with spices, salt, and pepper according to your taste preferences.",
          "Cook until everything is heated through and flavors are well combined.",
          "Serve hot and enjoy your creative leftover transformation!",
        ]
      }

      // Determine difficulty based on number of steps
      const difficulty = instructions.length <= 4 ? "Easy" : instructions.length <= 6 ? "Medium" : "Advanced"

      recipes.push({
        id: `leftover-${Date.now()}-${i}`,
        name: name,
        description: description,
        cookingTime: cookingTime,
        cuisine: cuisine,
        difficulty: difficulty,
        ingredients: ingredients,
        instructions: instructions,
        userIngredients: userIngredients,
        rating: 0,
        isSaved: false,
      })
    } catch (error) {
      console.error(`Error parsing recipe ${i + 1}:`, error)

      // Create a fallback recipe
      recipes.push({
        id: `leftover-${Date.now()}-${i}`,
        name: `Creative ${userIngredients[0] || "Leftover"} Fusion`,
        description: `A delicious fusion dish that creatively combines your leftover ${userIngredients.join(", ")} with fresh ingredients to create something entirely new and exciting.`,
        cookingTime: "25 minutes",
        cuisine: "Fusion",
        difficulty: "Easy",
        ingredients: [
          ...userIngredients.map((ing) => `${ing} (leftover)`),
          "2 tbsp cooking oil",
          "1 onion, chopped",
          "2 cloves garlic, minced",
          "Salt and pepper to taste",
          "Fresh herbs for garnish",
        ],
        instructions: [
          "Heat oil in a large pan over medium heat.",
          `Add chopped onion and garlic, sauté until golden and fragrant.`,
          `Add your leftover ${userIngredients.join(", ")} to the pan and mix well.`,
          "Season with salt, pepper, and any preferred spices.",
          "Cook for 5-7 minutes until everything is heated through and flavors meld.",
          "Garnish with fresh herbs and serve hot.",
        ],
        userIngredients: userIngredients,
        rating: 0,
        isSaved: false,
      })
    }
  }

  return recipes
}
