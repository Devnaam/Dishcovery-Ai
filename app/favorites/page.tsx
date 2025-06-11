"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Recipe } from "@/lib/types"
import { getFavorites } from "@/lib/favorites"
import RecipeCard from "@/components/recipe-card"
import { Globe } from "lucide-react"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = () => {
      const favs = getFavorites()
      setFavorites(favs)
      setLoading(false)
    }

    loadFavorites()

    // Listen for storage events to update favorites in real-time
    window.addEventListener("storage", loadFavorites)
    return () => window.removeEventListener("storage", loadFavorites)
  }, [])

  const regularFavorites = favorites.filter((recipe) => !recipe.isSurprise)
  const surpriseFavorites = favorites.filter((recipe) => recipe.isSurprise)

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Your Favorites</h1>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            You haven't saved any recipes yet. When you find recipes you love, save them here for easy access.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Favorites ({favorites.length})</TabsTrigger>
          <TabsTrigger value="regular">Regular ({regularFavorites.length})</TabsTrigger>
          <TabsTrigger value="surprise" className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            Surprise ({surpriseFavorites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} userIngredients={[]} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regular" className="mt-6">
          {regularFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regularFavorites.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} userIngredients={[]} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No regular favorites saved yet.</div>
          )}
        </TabsContent>

        <TabsContent value="surprise" className="mt-6">
          {surpriseFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {surpriseFavorites.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} userIngredients={[]} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No surprise favorites saved yet. Try the "Surprise Me" feature to discover unique global recipes!
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
