export interface Recipe {
  id: string
  title: string
  cuisine: string
  cookingTime: string
  ingredients: string[]
  instructions: string[]
  tags: string[]
  isSurprise?: boolean
  nutrition: {
    name: string
    value: string
  }[]
}

export interface LeftoverRecipe {
  id: string
  name: string
  description: string
  cookingTime: string
  cuisine: string
  difficulty: string
  ingredients: string[]
  instructions: string[]
  userIngredients: string[]
  rating: number
  isSaved: boolean
}

export interface Rating {
  recipeId: string
  rating: number
  feedback: string
  date: string
}

export interface YoutubeVideo {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  duration: string
}

export interface LeftoverStats {
  savedMealsThisWeek: number
  totalSavedMeals: number
  lastResetDate: string
}
