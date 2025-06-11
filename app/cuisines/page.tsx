"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Cuisine {
  name: string
  icon: string
  description: string
  color: string
}

export default function CuisinesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const cuisines: Cuisine[] = [
    {
      name: "Italian",
      icon: "🍝",
      description: "Pasta, pizza, and Mediterranean flavors",
      color: "bg-red-100 dark:bg-red-950",
    },
    {
      name: "Indian",
      icon: "🍛",
      description: "Spicy curries and aromatic spices",
      color: "bg-orange-100 dark:bg-orange-950",
    },
    {
      name: "Mexican",
      icon: "🌮",
      description: "Tacos, salsas, and bold flavors",
      color: "bg-green-100 dark:bg-green-950",
    },
    {
      name: "Chinese",
      icon: "🥡",
      description: "Stir-fries, dumplings, and umami flavors",
      color: "bg-yellow-100 dark:bg-yellow-950",
    },
    {
      name: "Japanese",
      icon: "🍣",
      description: "Sushi, ramen, and delicate flavors",
      color: "bg-pink-100 dark:bg-pink-950",
    },
    {
      name: "Thai",
      icon: "🍲",
      description: "Spicy, sweet, sour, and savory balance",
      color: "bg-purple-100 dark:bg-purple-950",
    },
    {
      name: "Mediterranean",
      icon: "🫒",
      description: "Olive oil, herbs, and fresh ingredients",
      color: "bg-blue-100 dark:bg-blue-950",
    },
    {
      name: "French",
      icon: "🥐",
      description: "Elegant techniques and rich flavors",
      color: "bg-indigo-100 dark:bg-indigo-950",
    },
    {
      name: "Korean",
      icon: "🍚",
      description: "Fermented foods and bold flavors",
      color: "bg-teal-100 dark:bg-teal-950",
    },
    {
      name: "Middle Eastern",
      icon: "🧆",
      description: "Aromatic spices and hearty dishes",
      color: "bg-amber-100 dark:bg-amber-950",
    },
    {
      name: "American",
      icon: "🍔",
      description: "Comfort food and regional specialties",
      color: "bg-lime-100 dark:bg-lime-950",
    },
    {
      name: "Spanish",
      icon: "🥘",
      description: "Paella, tapas, and vibrant flavors",
      color: "bg-rose-100 dark:bg-rose-950",
    },
  ]

  const filteredCuisines = cuisines.filter(
    (cuisine) =>
      cuisine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cuisine.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Explore Global Cuisines</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search cuisines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredCuisines.map((cuisine) => (
          <Link key={cuisine.name} href={`/cuisines/${cuisine.name.toLowerCase()}`} className="block h-full">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className={cn("p-6 flex flex-col items-center text-center h-full", cuisine.color)}>
                <span className="text-4xl mb-3">{cuisine.icon}</span>
                <h2 className="text-xl font-semibold mb-1">{cuisine.name}</h2>
                <p className="text-sm text-muted-foreground">{cuisine.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCuisines.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No cuisines found matching "{searchQuery}".</div>
      )}
    </div>
  )
}
