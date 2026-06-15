"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "../components/BottomNav";
import { MigraineEntry } from "../data/types";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../data/storage";

const symptomOptions = [
  "Nausea",
  "Light sensitivity",
  "Sound sensitivity",
  "Aura",
  "Dizziness",
  "Neck pain",
  "Fatigue",
];

const triggerOptions = [
  "Stress",
  "Poor sleep",
  "Dehydration",
  "Food",
  "Weather",
  "Hormones",
  "Screen time",
  "Caffeine",
];

const reliefOptions = [
  "Medication",
  "Sleep",
  "Dark room",
  "Hydration",
  "Ice pack",
  "Heat",
  "Stretching",
];

const today = () => new Date().toISOString().split("T")[0];

export default function MigrainesPage() {
  const [entries, setEntries] = useState<MigraineEntry[]>([]);
  const [form, setForm] = useState({
    date: today(),
    startTime: "",
    endTime: "",
    severity: 5,
    location: "",
    symptoms: [] as string[],
    triggers: [] as string[],
    medicationTaken: "",
    reliefMethod: "",
    notes: "",
  });

  useEffect(() => {
    setEntries(getStorageItem(STORAGE_KEYS.migraines, []));
  }, []);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.migraines, entries);
  }, [entries]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.startTime.localeCompare(a.startTime);
    });
  }, [entries]);

  const averageSeverity = useMemo(() => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.severity, 0);
    return Math.round((total / entries.length) * 10) / 10;
  }, [entries]);

  function toggleArrayValue(field: "symptoms" | "triggers", value: string) {
    setForm((prev) => {
      const current = prev[field];

      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  }

  function addMigraineEntry() {
    if (!form.date || !form.startTime || !form.location.trim()) return;

    const entry: MigraineEntry = {
      id: crypto.randomUUID(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime || undefined,
      severity: form.severity as MigraineEntry["severity"],
      location: form.location.trim(),
      symptoms: form.symptoms,
      triggers: form.triggers,
      medicationTaken: form.medicationTaken.trim(),
      reliefMethod: form.reliefMethod,
      notes: form.notes.trim(),
    };

    setEntries((prev) => [entry, ...prev]);

    setForm({
      date: today(),
      startTime: "",
      endTime: "",
      severity: 5,
      location: "",
      symptoms: [],
      triggers: [],
      medicationTaken: "",
      reliefMethod: "",
      notes: "",
    });
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-md px-4 pb-28 pt-6 md:max-w-6xl md:px-6 md:py-8">
        <header className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
            Steak-It
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Migraine Tracker
          </h1>
          <p className="mt-2 text-slate-400">
            Log severity, symptoms, triggers, medication, and relief methods.
          </p>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-3">
          <Stat label="Total" value={entries.length} />
          <Stat label="Avg Severity" value={averageSeverity || "—"} />
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
          <h2 className="text-2xl font-semibold">Add migraine</h2>

          <div className="mt-5 grid gap-4">
            <Field label="Date">
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, date: e.target.value }))
                }
                className="input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Start time">
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, startTime: e.target.value }))
                  }
                  className="input"
                />
              </Field>

              <Field label="End time">
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, endTime: e.target.value }))
                  }
                  className="input"
                />
              </Field>
            </div>

            <Field label={`Severity: ${form.severity}/10`}>
              <input
                type="range"
                min="1"
                max="10"
                value={form.severity}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    severity: Number(e.target.value),
                  }))
                }
                className="w-full accent-emerald-500"
              />
            </Field>

            <Field label="Pain location">
              <input
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
                className="input"
                placeholder="Example: left temple, behind eyes"
              />
            </Field>

            <Picker
              title="Symptoms"
              options={symptomOptions}
              selected={form.symptoms}
              onToggle={(value) => toggleArrayValue("symptoms", value)}
            />

            <Picker
              title="Possible triggers"
              options={triggerOptions}
              selected={form.triggers}
              onToggle={(value) => toggleArrayValue("triggers", value)}
            />

            <Field label="Medication taken">
              <input
                value={form.medicationTaken}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    medicationTaken: e.target.value,
                  }))
                }
                className="input"
                placeholder="Example: Nurtec, ibuprofen"
              />
            </Field>

            <Field label="Relief method">
              <select
                value={form.reliefMethod}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    reliefMethod: e.target.value,
                  }))
                }
                className="input"
              >
                <option value="">Select relief method</option>
                {reliefOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Notes">
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="input min-h-28 resize-none"
                placeholder="Anything else worth remembering?"
              />
            </Field>

            <button
              onClick={addMigraineEntry}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Save migraine entry
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
          <h2 className="text-2xl font-semibold">Migraine history</h2>

          <div className="mt-5 space-y-3">
            {sortedEntries.length === 0 ? (
              <p className="text-sm text-slate-500">No migraine entries yet.</p>
            ) : (
              sortedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {entry.date} · Severity {entry.severity}/10
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {entry.startTime}
                        {entry.endTime ? ` - ${entry.endTime}` : ""} ·{" "}
                        {entry.location}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-sm text-slate-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>

                  {(entry.symptoms.length > 0 || entry.triggers.length > 0) && (
                    <div className="mt-4 grid gap-3 text-sm text-slate-400">
                      {entry.symptoms.length > 0 && (
                        <p>
                          <span className="text-slate-300">Symptoms:</span>{" "}
                          {entry.symptoms.join(", ")}
                        </p>
                      )}

                      {entry.triggers.length > 0 && (
                        <p>
                          <span className="text-slate-300">Triggers:</span>{" "}
                          {entry.triggers.join(", ")}
                        </p>
                      )}
                    </div>
                  )}

                  {(entry.medicationTaken ||
                    entry.reliefMethod ||
                    entry.notes) && (
                    <div className="mt-4 space-y-2 text-sm text-slate-400">
                      {entry.medicationTaken && (
                        <p>
                          <span className="text-slate-300">Medication:</span>{" "}
                          {entry.medicationTaken}
                        </p>
                      )}

                      {entry.reliefMethod && (
                        <p>
                          <span className="text-slate-300">Relief:</span>{" "}
                          {entry.reliefMethod}
                        </p>
                      )}

                      {entry.notes && (
                        <p>
                          <span className="text-slate-300">Notes:</span>{" "}
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

function Picker({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-300">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`rounded-full border px-3 py-2 text-sm transition ${
                active
                  ? "border-emerald-500 bg-emerald-500 text-slate-950"
                  : "border-slate-700 bg-slate-950 text-slate-300"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
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