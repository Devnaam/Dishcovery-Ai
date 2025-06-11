import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Utensils } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Utensils className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-2">Recipe Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        We couldn't find the recipe you're looking for. It might have been removed or doesn't exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/search">Search Recipes</Link>
        </Button>
      </div>
    </div>
  )
}
