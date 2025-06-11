"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { saveRating } from "@/lib/ratings"
import { cn } from "@/lib/utils"

interface RatingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipeId: string
  recipeTitle: string
}

export default function RatingDialog({ open, onOpenChange, recipeId, recipeTitle }: RatingDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating === 0) return

    saveRating({
      recipeId,
      rating,
      feedback,
      date: new Date().toISOString(),
    })

    setSubmitted(true)

    // Reset after 2 seconds and close
    setTimeout(() => {
      setRating(0)
      setFeedback("")
      setSubmitted(false)
      onOpenChange(false)
    }, 2000)
  }

  const reactions = ["Loved it!", "Would try again", "Good but needs tweaks", "Too spicy", "Too complicated"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this recipe</DialogTitle>
          <DialogDescription>How did you enjoy {recipeTitle}?</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-primary/20 p-3">
                <Star className="h-6 w-6 text-primary fill-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium">Thanks for your feedback!</h3>
            <p className="text-muted-foreground">Your rating has been saved.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center py-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-all",
                        (hoveredRating ? star <= hoveredRating : star <= rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Quick reactions:</h4>
                <div className="flex flex-wrap gap-2">
                  {reactions.map((reaction, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(feedback === reaction ? "bg-primary/10 border-primary/50" : "")}
                      onClick={() => setFeedback(reaction)}
                    >
                      {reaction}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Additional feedback (optional):</h4>
                <Textarea
                  placeholder="Share your thoughts about this recipe..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSubmit} disabled={rating === 0} className="w-full sm:w-auto">
                Submit Rating
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
