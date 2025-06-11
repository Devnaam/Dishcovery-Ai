"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import { GEMINI_API_KEY, GEMINI_API_URL } from "@/lib/gemini-constants"

interface AISuggestionButtonProps {
  ingredients: string[]
  onSuggestionSelected: (suggestion: string) => void
}

export default function AISuggestionButton({ ingredients, onSuggestionSelected }: AISuggestionButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleGetSuggestion = async () => {
    if (ingredients.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const prompt = `I have these ingredients: ${ingredients.join(", ")}. 
      What's a creative dish I could make? Give me a brief 2-3 sentence suggestion for a dish. 
      Be specific and creative, but keep it simple enough for a home cook.`

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
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No suggestion generated")
      }

      const suggestionText = data.candidates[0].content.parts[0].text
      setSuggestion(suggestionText)
    } catch (err) {
      console.error("Error getting AI suggestion:", err)
      setError("Failed to get a suggestion. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleApplySuggestion = () => {
    onSuggestionSelected(suggestion)
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => {
          setOpen(true)
          handleGetSuggestion()
        }}
        disabled={ingredients.length === 0}
      >
        <Sparkles className="h-3.5 w-3.5" />
        Ask AI for Ideas
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>AI Recipe Suggestion</DialogTitle>
            <DialogDescription>Based on your ingredients: {ingredients.join(", ")}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-destructive text-center py-4">
                {error}
                <Button variant="outline" size="sm" className="mt-2 mx-auto block" onClick={handleGetSuggestion}>
                  Try Again
                </Button>
              </div>
            ) : (
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="min-h-[120px]"
                placeholder="AI suggestion will appear here..."
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplySuggestion} disabled={loading || !suggestion}>
              Use This Idea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
