
export interface Nutrition {
  calories: string;
  protein: string;
  carbohydrates: string;
  fat: string;
}

export interface Recipe {
  difficulty: string;
  cookTime: string;
  steps: string[];
}

export interface AnalysisResult {
  isFood: boolean;
  reason?: string;
  dishName?: string;
  ingredients?: string[];
  nutrition?: Nutrition;
  recipe?: Recipe;
  uncertainty?: string;
}
