"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getIngredientSubstitutions } from "@/lib/gemini-service"
import { Wand2 } from "lucide-react"

interface IngredientSubstitutionProps {
  ingredient: string
}

export default function IngredientSubstitution({ ingredient }: IngredientSubstitutionProps) {
  const [substitutes, setSubstitutes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetSubstitutes = async () => {
    setLoading(true)
    setError(null)

    try {
      const results = await getIngredientSubstitutions(ingredient)
      setSubstitutes(results)
    } catch (err) {
      setError("Failed to get substitutions. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.preventDefault()
            if (substitutes.length === 0 && !loading) {
              handleGetSubstitutes()
            }
          }}
        >
          <Wand2 className="h-3 w-3 mr-1" />
          Substitutes
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Substitutes for {ingredient}</h4>

          {loading ? (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-xs text-destructive">{error}</div>
          ) : substitutes.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {substitutes.map((sub, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {sub}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">Click to find substitutes for this ingredient.</div>
          )}

          {!loading && substitutes.length === 0 && (
            <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7" onClick={handleGetSubstitutes}>
              Find Substitutes
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
