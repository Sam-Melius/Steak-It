export const STORAGE_KEYS = {
  profile: "steak-it-profile",
  savedMeals: "steak-it-saved-meals",
  dailyMeals: "steak-it-daily-meals",
  exercises: "steak-it-exercises",
  weightEntries: "steak-it-weight-entries",
};

export function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function todayKey() {
  return new Date().toISOString().split("T")[0];
}