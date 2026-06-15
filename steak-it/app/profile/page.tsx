"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../components/BottomNav";
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
  ReferenceLine,
} from "recharts";

const defaultProfile: Profile = {
  dailyCalorieGoal: 1800,
  fiberGoal: 25,
  proteinGoal: 120,
  exerciseGoal: 300,
  weightGoal: 0,
  age: 0,
  heightFeet: 5,
  heightInches: 4,
  sex: "female",
  exerciseMinutesGoal: 30,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [dailyMeals, setDailyMeals] = useState<DailyMealEntry[]>([]);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);

  const [weightForm, setWeightForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: 0,
  });

  useEffect(() => {
    setProfile(getStorageItem(STORAGE_KEYS.profile, defaultProfile));
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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-md px-4 pb-28 pt-6 md:max-w-6xl md:px-6 md:py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
              Steak-It
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Profile
            </h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Manage goals, saved meals, weight progress, and past entries.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-500 hover:text-emerald-300"
          >
            Back to dashboard
          </Link>
        </header>

        <div className="grid gap-8">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-2xl font-semibold">Profile settings</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <GoalInput
                label="Daily Calorie Goal"
                value={profile.dailyCalorieGoal}
                onChange={(value) =>
                  setProfile((prev) => ({
                    ...prev,
                    dailyCalorieGoal: value,
                  }))
                }
              />

              <GoalInput
                label="Fiber Goal (g)"
                value={profile.fiberGoal}
                onChange={(value) =>
                  setProfile((prev) => ({ ...prev, fiberGoal: value }))
                }
              />

              <GoalInput
                label="Protein Goal (g)"
                value={profile.proteinGoal}
                onChange={(value) =>
                  setProfile((prev) => ({ ...prev, proteinGoal: value }))
                }
              />

              <GoalInput
                label="Exercise Goal (cal burned)"
                value={profile.exerciseGoal}
                onChange={(value) =>
                  setProfile((prev) => ({ ...prev, exerciseGoal: value }))
                }
              />

              <GoalInput
                label="Exercise Minutes Goal"
                value={profile.exerciseMinutesGoal}
                onChange={(value) =>
                    setProfile((prev) => ({ ...prev, exerciseMinutesGoal: value }))
                }
              />

              <GoalInput
                label="Weight Goal (lbs)"
                value={profile.weightGoal}
                onChange={(value) =>
                  setProfile((prev) => ({ ...prev, weightGoal: value }))
                }
              />

              <GoalInput
                label="Age"
                value={profile.age}
                onChange={(value) =>
                  setProfile((prev) => ({ ...prev, age: value }))
                }
              />

              <GoalInput
                label="Height Feet"
                value={profile.heightFeet}
                onChange={(value) =>
                  setProfile((prev) => ({ ...prev, heightFeet: value }))
                }
              />

              <GoalInput
                label="Height Inches"
                value={profile.heightInches}
                onChange={(value) =>
                  setProfile((prev) => ({ ...prev, heightInches: value }))
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Sex
                </label>

                <select
                  value={profile.sex}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      sex: e.target.value as Profile["sex"],
                    }))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-2xl font-semibold">Weight progress</h2>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                type="date"
                value={weightForm.date}
                onChange={(e) =>
                  setWeightForm((prev) => ({ ...prev, date: e.target.value }))
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500"
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
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500"
              />

              <button
                onClick={addWeightEntry}
                className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Add
              </button>
            </div>

            <div className="mt-8 h-72 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              {sortedWeights.length < 2 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  Add at least two weight entries to see a graph.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedWeights}>
                    <CartesianGrid stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis
                      stroke="#94a3b8"
                      domain={["dataMin - 5", "dataMax + 5"]}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid #1e293b",
                        borderRadius: "12px",
                      }}
                    />

                    {profile.weightGoal > 0 && (
                      <ReferenceLine
                        y={profile.weightGoal}
                        stroke="#10b981"
                        strokeDasharray="6 6"
                        label={{
                          value: "Goal",
                          fill: "#10b981",
                          fontSize: 12,
                        }}
                      />
                    )}

                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#10b981"
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
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div>
                    <p className="font-semibold">{entry.weight} lbs</p>
                    <p className="text-sm text-slate-500">{entry.date}</p>
                  </div>

                  <button
                    onClick={() => deleteWeightEntry(entry.id)}
                    className="text-sm text-slate-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-2xl font-semibold">Saved meals</h2>

            <div className="mt-5 grid gap-3">
              {savedMeals.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No saved meals yet. Save meals from the dashboard.
                </p>
              ) : (
                savedMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 md:flex-row md:items-center"
                  >
                    <div>
                      <p className="font-semibold">{meal.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {meal.category} · {meal.nutrition.calories} cal ·{" "}
                        {meal.nutrition.carbs}g carbs ·{" "}
                        {meal.nutrition.fiber}g fiber ·{" "}
                        {meal.nutrition.protein}g protein
                      </p>
                    </div>

                    <button
                      onClick={() => deleteSavedMeal(meal.id)}
                      className="text-left text-sm text-slate-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-2xl font-semibold">Past daily entries</h2>

            <div className="mt-5 grid gap-3">
              {pastDates.length === 0 ? (
                <p className="text-sm text-slate-500">No past entries yet.</p>
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
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <p className="font-semibold">{date}</p>
                      <p className="mt-1 text-sm text-slate-500">
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

      <BottomNav />
    </main>
  );
}

function GoalInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500"
      />
    </div>
  );
}