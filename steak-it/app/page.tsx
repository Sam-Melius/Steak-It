"use client";
import Link from "next/link";
import BottomNav from "./components/BottomNav";

import { useEffect, useMemo, useState } from "react";
import {
  DailyMealEntry,
  ExerciseEntry,
  MealCategory,
  NutritionFacts,
  Profile,
  SavedMeal,
} from "./data/types";
import { getStorageItem, setStorageItem, STORAGE_KEYS, todayKey } from "./data/storage";

const categories: MealCategory[] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
];

const emptyNutrition: NutritionFacts = {
  calories: 0,
  carbs: 0,
  fiber: 0,
  protein: 0,
};

export default function Home() {
  const [profile, setProfile] = useState<Profile>({ dailyCalorieGoal: 1800 });
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [dailyMeals, setDailyMeals] = useState<DailyMealEntry[]>([]);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);

  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [selectedSavedMealId, setSelectedSavedMealId] = useState("");

  const [mealForm, setMealForm] = useState({
    mealName: "",
    category: "breakfast" as MealCategory,
    nutrition: emptyNutrition,
  });

  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    caloriesBurned: 0,
    durationMinutes: 0,
  });

  useEffect(() => {
    setProfile(getStorageItem(STORAGE_KEYS.profile, { dailyCalorieGoal: 1800 }));
    setSavedMeals(getStorageItem(STORAGE_KEYS.savedMeals, []));
    setDailyMeals(getStorageItem(STORAGE_KEYS.dailyMeals, []));
    setExercises(getStorageItem(STORAGE_KEYS.exercises, []));
  }, []);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.profile, profile);
  }, [profile]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.savedMeals, savedMeals);
  }, [savedMeals]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.dailyMeals, dailyMeals);
  }, [dailyMeals]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.exercises, exercises);
  }, [exercises]);

  const todaysMeals = dailyMeals.filter((meal) => meal.date === selectedDate);
  const todaysExercises = exercises.filter((exercise) => exercise.date === selectedDate);

  const totals = useMemo(() => {
    const mealTotals = todaysMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.nutrition.calories;
        acc.carbs += meal.nutrition.carbs;
        acc.fiber += meal.nutrition.fiber;
        acc.protein += meal.nutrition.protein;
        return acc;
      },
      { calories: 0, carbs: 0, fiber: 0, protein: 0 }
    );

    const exerciseCalories = todaysExercises.reduce(
      (sum, exercise) => sum + exercise.caloriesBurned,
      0
    );

    return {
      ...mealTotals,
      exerciseCalories,
      netCalories: mealTotals.calories - exerciseCalories,
      remaining: profile.dailyCalorieGoal - (mealTotals.calories - exerciseCalories),
    };
  }, [todaysMeals, todaysExercises, profile.dailyCalorieGoal]);

  function updateNutrition(field: keyof NutritionFacts, value: string) {
    setMealForm((prev) => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [field]: Number(value),
      },
    }));
  }

  function handleSavedMealSelect(id: string) {
    setSelectedSavedMealId(id);

    const savedMeal = savedMeals.find((meal) => meal.id === id);
    if (!savedMeal) return;

    setMealForm({
      mealName: savedMeal.name,
      category: savedMeal.category,
      nutrition: savedMeal.nutrition,
    });
  }

  function addDailyMeal(saveForLater = false) {
    if (!mealForm.mealName.trim()) return;

    const entry: DailyMealEntry = {
      id: crypto.randomUUID(),
      date: selectedDate,
      category: mealForm.category,
      mealName: mealForm.mealName.trim(),
      nutrition: mealForm.nutrition,
    };

    setDailyMeals((prev) => [entry, ...prev]);

    if (saveForLater) {
      const savedMeal: SavedMeal = {
        id: crypto.randomUUID(),
        name: mealForm.mealName.trim(),
        category: mealForm.category,
        nutrition: mealForm.nutrition,
      };

      setSavedMeals((prev) => [savedMeal, ...prev]);
    }

    setMealForm({
      mealName: "",
      category: "breakfast",
      nutrition: emptyNutrition,
    });
    setSelectedSavedMealId("");
  }

  function addExercise() {
    if (!exerciseForm.name.trim()) return;

    const entry: ExerciseEntry = {
      id: crypto.randomUUID(),
      date: selectedDate,
      name: exerciseForm.name.trim(),
      caloriesBurned: exerciseForm.caloriesBurned,
      durationMinutes: exerciseForm.durationMinutes || undefined,
    };

    setExercises((prev) => [entry, ...prev]);
    setExerciseForm({ name: "", caloriesBurned: 0, durationMinutes: 0 });
  }

  function deleteMeal(id: string) {
    setDailyMeals((prev) => prev.filter((meal) => meal.id !== id));
  }

  function deleteExercise(id: string) {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-md px-4 pb-28 pt-6 md:max-w-6xl md:px-6 md:py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
              Steak-It
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Daily Fitness Tracker
            </h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Track meals, exercise, calories, macros, saved meals, and progress.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <label className="block text-xs uppercase tracking-widest text-slate-500">
              Daily calorie goal
            </label>
            <input
              type="number"
              value={profile.dailyCalorieGoal}
              onChange={(e) =>
                setProfile({ dailyCalorieGoal: Number(e.target.value) })
              }
              className="mt-2 w-32 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-lg font-semibold outline-none focus:border-emerald-500"
            />
          </div>
          <Link
            href="/profile"
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-500 hover:bg-emerald-400"
          >
            Profile
          </Link>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          <Stat label="Calories" value={totals.calories} />
          <Stat label="Exercise" value={totals.exerciseCalories} />
          <Stat label="Net" value={totals.netCalories} />
          <Stat label="Remaining" value={totals.remaining} />
          <Stat label="Protein" value={`${totals.protein}g`} />
        </section>

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="text-xs uppercase tracking-widest text-slate-500">
            Entry date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
            <h2 className="text-2xl font-semibold">Add meal</h2>

            {savedMeals.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-xs uppercase tracking-widest text-slate-400">
                  Saved meals
                </p>

                <div className="flex gap-3 overflow-x-auto pb-2">
                  {savedMeals.map((meal) => (
                    <button
                      key={meal.id}
                      onClick={() => handleSavedMealSelect(meal.id)}
                      className="min-w-[180px] rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-left transition hover:border-emerald-500"
                    >
                      <p className="font-semibold text-slate-100">{meal.name}</p>
                      <p className="mt-1 text-xs capitalize text-emerald-400">
                        {meal.category}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        {meal.nutrition.calories} cal · {meal.nutrition.protein}g protein
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 grid gap-4">
              

              <input
                placeholder="Meal name"
                value={mealForm.mealName}
                onChange={(e) =>
                  setMealForm((prev) => ({ ...prev, mealName: e.target.value }))
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500"
              />

              <select
                value={mealForm.category}
                onChange={(e) =>
                  setMealForm((prev) => ({
                    ...prev,
                    category: e.target.value as MealCategory,
                  }))
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <MacroInput label="Calories" value={mealForm.nutrition.calories} onChange={(v) => updateNutrition("calories", v)} />
                <MacroInput label="Carbs" value={mealForm.nutrition.carbs} onChange={(v) => updateNutrition("carbs", v)} />
                <MacroInput label="Fiber" value={mealForm.nutrition.fiber} onChange={(v) => updateNutrition("fiber", v)} />
                <MacroInput label="Protein" value={mealForm.nutrition.protein} onChange={(v) => updateNutrition("protein", v)} />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => addDailyMeal(false)}
                  className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-orange-300"
                >
                  Add to day
                </button>
                <button
                  onClick={() => addDailyMeal(true)}
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:border-emerald-500 hover:bg-emerald-400"
                >
                  Add + save meal
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
            <h2 className="text-2xl font-semibold">Add exercise</h2>

            <div className="mt-5 grid gap-4">
              <input
                placeholder="Exercise name"
                value={exerciseForm.name}
                onChange={(e) =>
                  setExerciseForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500"
              />

              <input
                type="number"
                placeholder="Calories burned"
                value={exerciseForm.caloriesBurned}
                onChange={(e) =>
                  setExerciseForm((prev) => ({
                    ...prev,
                    caloriesBurned: Number(e.target.value),
                  }))
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500"
              />

              <input
                type="number"
                placeholder="Duration minutes"
                value={exerciseForm.durationMinutes}
                onChange={(e) =>
                  setExerciseForm((prev) => ({
                    ...prev,
                    durationMinutes: Number(e.target.value),
                  }))
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500"
              />

              <button
                onClick={addExercise}
                className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-950 transition hover:bg-white"
              >
                Add exercise
              </button>
            </div>
          </section>
        </div>

        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          <MealsByCategory meals={todaysMeals} onDelete={deleteMeal} />

          <EntryList
            title="Exercises today"
            items={todaysExercises.map((exercise) => ({
              id: exercise.id,
              title: exercise.name,
              subtitle: `${exercise.caloriesBurned} cal burned${
                exercise.durationMinutes ? ` · ${exercise.durationMinutes} min` : ""
              }`,
            }))}
            onDelete={deleteExercise}
          />

        </section>
      </div>
      <BottomNav />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function MacroInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500"
      />
    </label>
  );
}

function EntryList({
  title,
  items,
  onDelete,
}: {
  title: string;
  items: { id: string; title: string; subtitle: string }[];
  onDelete: (id: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No entries yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
              </div>
              <button
                onClick={() => onDelete(item.id)}
                className="text-sm text-slate-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
function MealsByCategory({
  meals,
  onDelete,
}: {
  meals: DailyMealEntry[];
  onDelete: (id: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
      <h2 className="text-2xl font-semibold">Meals today</h2>

      <div className="mt-5 space-y-5">
        {categories.map((category) => {
          const categoryMeals = meals.filter((meal) => meal.category === category);

          const categoryCalories = categoryMeals.reduce(
            (sum, meal) => sum + meal.nutrition.calories,
            0
          );

          return (
            <div key={category}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold capitalize tracking-wide text-emerald-400">
                  {category}
                </h3>
                <span className="text-xs text-slate-400">
                  {categoryCalories} cal
                </span>
              </div>

              <div className="space-y-3">
                {categoryMeals.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-500">
                    No {category} entries yet.
                  </div>
                ) : (
                  categoryMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">{meal.mealName}</p>
                          <p className="mt-1 text-sm text-slate-400">
                            {meal.nutrition.calories} cal ·{" "}
                            {meal.nutrition.carbs}g carbs ·{" "}
                            {meal.nutrition.fiber}g fiber ·{" "}
                            {meal.nutrition.protein}g protein
                          </p>
                        </div>

                        <button
                          onClick={() => onDelete(meal.id)}
                          className="text-sm text-slate-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}