import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat, Utensils, Globe, Heart, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 text-center">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Discover Recipes With Ingredients You Already Have
        </h1>
        <p className="text-xl text-muted-foreground">
          Enter the ingredients from your kitchen and let Dishcovery suggest creative, global recipes that you can make
          right now.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button asChild size="lg" className="gap-2">
            <Link href="/search">
              <Utensils className="h-5 w-5" />
              Start Cooking
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/leftover-genie">
              <Sparkles className="h-5 w-5" />
              Leftover Genie
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/cuisines">
              <Globe className="h-5 w-5" />
              Explore Cuisines
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 max-w-6xl w-full">
        <div className="flex flex-col items-center p-6 rounded-lg border bg-card text-card-foreground shadow">
          <ChefHat className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Ingredient-Based</h3>
          <p className="text-center text-muted-foreground">
            Input what you have and get personalized recipe suggestions.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 rounded-lg border bg-card text-card-foreground shadow">
          <Sparkles className="h-12 w-12 mb-4 text-green-600" />
          <h3 className="text-xl font-semibold mb-2">Leftover Magic</h3>
          <p className="text-center text-muted-foreground">
            Transform your leftovers into delicious meals and reduce food waste.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 rounded-lg border bg-card text-card-foreground shadow">
          <Globe className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Global Cuisine</h3>
          <p className="text-center text-muted-foreground">
            Discover dishes from around the world with our surprise feature.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 rounded-lg border bg-card text-card-foreground shadow">
          <Heart className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
          <p className="text-center text-muted-foreground">Rate and save recipes you love for quick access later.</p>
        </div>
      </div>
    </div>
  )
}
