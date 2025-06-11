"use client"

import type { Rating } from "./types"

const RATINGS_KEY = "dishcovery-ratings"

export function getRatings(): Rating[] {
  if (typeof window === "undefined") return []

  const storedRatings = localStorage.getItem(RATINGS_KEY)
  return storedRatings ? JSON.parse(storedRatings) : []
}

export function saveRating(rating: Rating): void {
  if (typeof window === "undefined") return

  const ratings = getRatings()
  const existingIndex = ratings.findIndex((r) => r.recipeId === rating.recipeId)

  if (existingIndex >= 0) {
    // Update existing rating
    ratings[existingIndex] = rating
  } else {
    // Add new rating
    ratings.push(rating)
  }

  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings))
  // Dispatch storage event to update other components
  window.dispatchEvent(new Event("storage"))
}

export function getRecipeRating(recipeId: string): Rating | null {
  if (typeof window === "undefined") return null

  const ratings = getRatings()
  return ratings.find((r) => r.recipeId === recipeId) || null
}
