"use client"

import type { Recipe } from "./types"

const FAVORITES_KEY = "dishcovery-favorites"

export function getFavorites(): Recipe[] {
  if (typeof window === "undefined") return []

  const storedFavorites = localStorage.getItem(FAVORITES_KEY)
  return storedFavorites ? JSON.parse(storedFavorites) : []
}

export function toggleFavorite(recipe: Recipe): boolean {
  if (typeof window === "undefined") return false

  const favorites = getFavorites()
  const index = favorites.findIndex((fav) => fav.id === recipe.id)

  if (index >= 0) {
    // Remove from favorites
    favorites.splice(index, 1)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    // Dispatch storage event to update other components
    window.dispatchEvent(new Event("storage"))
    return false
  } else {
    // Add to favorites
    favorites.push(recipe)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    // Dispatch storage event to update other components
    window.dispatchEvent(new Event("storage"))
    return true
  }
}

export function isFavorite(recipeId: string): boolean {
  if (typeof window === "undefined") return false

  const favorites = getFavorites()
  return favorites.some((fav) => fav.id === recipeId)
}
