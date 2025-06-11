"use client"

import type { LeftoverStats } from "./types"

const LEFTOVER_STATS_KEY = "dishcovery-leftover-stats"

function getWeekStart(): string {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek
  const weekStart = new Date(now.setDate(diff))
  weekStart.setHours(0, 0, 0, 0)
  return weekStart.toISOString()
}

export function getLeftoverStats(): LeftoverStats {
  if (typeof window === "undefined") {
    return {
      savedMealsThisWeek: 0,
      totalSavedMeals: 0,
      lastResetDate: getWeekStart(),
    }
  }

  const stored = localStorage.getItem(LEFTOVER_STATS_KEY)
  const currentWeekStart = getWeekStart()

  if (!stored) {
    const initialStats: LeftoverStats = {
      savedMealsThisWeek: 0,
      totalSavedMeals: 0,
      lastResetDate: currentWeekStart,
    }
    localStorage.setItem(LEFTOVER_STATS_KEY, JSON.stringify(initialStats))
    return initialStats
  }

  const stats: LeftoverStats = JSON.parse(stored)

  // Reset weekly count if it's a new week
  if (stats.lastResetDate !== currentWeekStart) {
    stats.savedMealsThisWeek = 0
    stats.lastResetDate = currentWeekStart
    localStorage.setItem(LEFTOVER_STATS_KEY, JSON.stringify(stats))
  }

  return stats
}

export function incrementSavedMeals(): void {
  if (typeof window === "undefined") return

  const stats = getLeftoverStats()
  stats.savedMealsThisWeek += 1
  stats.totalSavedMeals += 1

  localStorage.setItem(LEFTOVER_STATS_KEY, JSON.stringify(stats))

  // Dispatch storage event to update other components
  window.dispatchEvent(new Event("storage"))
}

export function getLeftoverRating(recipeId: string): number {
  if (typeof window === "undefined") return 0

  const ratings = JSON.parse(localStorage.getItem("dishcovery-leftover-ratings") || "{}")
  return ratings[recipeId] || 0
}

export function saveLeftoverRating(recipeId: string, rating: number): void {
  if (typeof window === "undefined") return

  const ratings = JSON.parse(localStorage.getItem("dishcovery-leftover-ratings") || "{}")
  ratings[recipeId] = rating

  localStorage.setItem("dishcovery-leftover-ratings", JSON.stringify(ratings))

  // Dispatch storage event to update other components
  window.dispatchEvent(new Event("storage"))
}
