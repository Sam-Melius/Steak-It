"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  DailyMealEntry,
  ExerciseEntry,
  Profile,
  SavedMeal,
  WeightEntry,
} from "../data/types";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../data/storage";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ dailyCalorieGoal: 1800 });
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [dailyMeals, setDailyMeals] = useState<DailyMealEntry[]>([]);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);

  const [weightForm, setWeightForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: 0,
  });

  useEffect(() => {
    setProfile(getStorageItem(STORAGE_KEYS.profile, { dailyCalorieGoal: 1800 }));
    setSavedMeals(getStorageItem(STORAGE_KEYS.savedMeals, []));
    setDailyMeals(getStorageItem(STORAGE_KEYS.dailyMeals, []));
    setExercises(getStorageItem(STORAGE_KEYS.exercises, []));
    setWeightEntries(getStorageItem(STORAGE_KEYS.weightEntries, []));
  }, []);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.profile, profile);
  }, [profile]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.weightEntries, weightEntries);
  }, [weightEntries]);

  const sortedWeights = useMemo(() => {
    return [...weightEntries].sort((a, b) => a.date.localeCompare(b.date));
  }, [weightEntries]);

  const pastDates = useMemo(() => {
    const dates = new Set<string>();

    dailyMeals.forEach((meal) => dates.add(meal.date));
    exercises.forEach((exercise) => dates.add(exercise.date));

    return [...dates].sort((a, b) => b.localeCompare(a));
  }, [dailyMeals, exercises]);

  function addWeightEntry() {
    if (!weightForm.weight || weightForm.weight <= 0) return;

    const entry: WeightEntry = {
      id: crypto.randomUUID(),
      date: weightForm.date,
      weight: weightForm.weight,
    };

    setWeightEntries((prev) => [entry, ...prev]);
    setWeightForm({
      date: new Date().toISOString().split("T")[0],
      weight: 0,
    });
  }

  function deleteWeightEntry(id: string) {
    setWeightEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  function deleteSavedMeal(id: string) {
    const updated = savedMeals.filter((meal) => meal.id !== id);
    setSavedMeals(updated);
    setStorageItem(STORAGE_KEYS.savedMeals, updated);
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-400">
              Steak-It
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Profile</h1>
            <p className="mt-2 max-w-2xl text-stone-400">
              Manage saved meals, daily calorie goals, weight progress, and past
              entries.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-200 transition hover:border-orange-400 hover:text-orange-300"
          >
            Back to dashboard
          </Link>
        </header>

        <div className="grid gap-8">
          <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
            <h2 className="text-2xl font-semibold">Daily calorie goal</h2>

            <div className="mt-5 max-w-xs">
              <label className="block text-xs uppercase tracking-widest text-stone-500">
                Calories
              </label>
              <input
                type="number"
                value={profile.dailyCalorieGoal}
                onChange={(e) =>
                  setProfile({ dailyCalorieGoal: Number(e.target.value) })
                }
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-3 text-lg font-semibold outline-none focus:border-orange-400"
              />
            </div>
          </section>

          <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
            <h2 className="text-2xl font-semibold">Weight progress</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
              <input
                type="date"
                value={weightForm.date}
                onChange={(e) =>
                  setWeightForm((prev) => ({ ...prev, date: e.target.value }))
                }
                className="rounded-xl border border-stone-700 bg-stone-950 px-3 py-3 outline-none focus:border-orange-400"
              />

              <input
                type="number"
                placeholder="Weight"
                value={weightForm.weight}
                onChange={(e) =>
                  setWeightForm((prev) => ({
                    ...prev,
                    weight: Number(e.target.value),
                  }))
                }
                className="rounded-xl border border-stone-700 bg-stone-950 px-3 py-3 outline-none focus:border-orange-400"
              />

              <button
                onClick={addWeightEntry}
                className="rounded-xl bg-orange-400 px-5 py-3 font-semibold text-stone-950 transition hover:bg-orange-300"
              >
                Add
              </button>
            </div>

            <div className="mt-8 h-72 rounded-2xl border border-stone-800 bg-stone-950/60 p-4">
              {sortedWeights.length < 2 ? (
                <div className="flex h-full items-center justify-center text-sm text-stone-500">
                  Add at least two weight entries to see a graph.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedWeights}>
                    <CartesianGrid stroke="#292524" />
                    <XAxis dataKey="date" stroke="#a8a29e" />
                    <YAxis stroke="#a8a29e" domain={["dataMin - 5", "dataMax + 5"]} />
                    <Tooltip
                      contentStyle={{
                        background: "#0c0a09",
                        border: "1px solid #292524",
                        borderRadius: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#fb923c"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-5 space-y-3">
              {sortedWeights.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-950/70 p-4"
                >
                  <div>
                    <p className="font-semibold">{entry.weight} lbs</p>
                    <p className="text-sm text-stone-500">{entry.date}</p>
                  </div>
                  <button
                    onClick={() => deleteWeightEntry(entry.id)}
                    className="text-sm text-stone-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
            <h2 className="text-2xl font-semibold">Saved meals</h2>

            <div className="mt-5 grid gap-3">
              {savedMeals.length === 0 ? (
                <p className="text-sm text-stone-500">
                  No saved meals yet. Save meals from the dashboard.
                </p>
              ) : (
                savedMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-stone-800 bg-stone-950/70 p-4 md:flex-row md:items-center"
                  >
                    <div>
                      <p className="font-semibold">{meal.name}</p>
                      <p className="mt-1 text-sm text-stone-500">
                        {meal.category} · {meal.nutrition.calories} cal ·{" "}
                        {meal.nutrition.carbs}g carbs · {meal.nutrition.fiber}g
                        fiber · {meal.nutrition.protein}g protein
                      </p>
                    </div>

                    <button
                      onClick={() => deleteSavedMeal(meal.id)}
                      className="text-left text-sm text-stone-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
            <h2 className="text-2xl font-semibold">Past daily entries</h2>

            <div className="mt-5 grid gap-3">
              {pastDates.length === 0 ? (
                <p className="text-sm text-stone-500">No past entries yet.</p>
              ) : (
                pastDates.map((date) => {
                  const mealsForDate = dailyMeals.filter(
                    (meal) => meal.date === date
                  );
                  const exercisesForDate = exercises.filter(
                    (exercise) => exercise.date === date
                  );

                  const calories = mealsForDate.reduce(
                    (sum, meal) => sum + meal.nutrition.calories,
                    0
                  );
                  const burned = exercisesForDate.reduce(
                    (sum, exercise) => sum + exercise.caloriesBurned,
                    0
                  );

                  return (
                    <div
                      key={date}
                      className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4"
                    >
                      <p className="font-semibold">{date}</p>
                      <p className="mt-1 text-sm text-stone-500">
                        {mealsForDate.length} meals · {exercisesForDate.length}{" "}
                        exercises · {calories} cal eaten · {burned} cal burned
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}