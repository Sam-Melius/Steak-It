export type MealCategory =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "dessert";

export type NutritionFacts = {
  calories: number;
  carbs: number;
  fiber: number;
  protein: number;
};

export type SavedMeal = {
  id: string;
  name: string;
  category: MealCategory;
  nutrition: NutritionFacts;
};

export type DailyMealEntry = {
  id: string;
  date: string;
  category: MealCategory;
  mealName: string;
  nutrition: NutritionFacts;
};

export type ExerciseEntry = {
  id: string;
  date: string;
  name: string;
  caloriesBurned: number;
  durationMinutes?: number;
};

export type WeightEntry = {
  id: string;
  date: string;
  weight: number;
};

export type Profile = {
  dailyCalorieGoal: number;
  fiberGoal: number;
  proteinGoal: number;
  exerciseGoal: number;
  weightGoal: number;
  age: number;
  heightFeet: number;
  heightInches: number;
  sex: "female" | "male" | "other";
};

export type MigraineEntry = {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  severity: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  location: string;
  symptoms: string[];
  triggers: string[];
  medicationTaken: string;
  reliefMethod: string;
  notes: string;
};