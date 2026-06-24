export const STORAGE_KEYS = {
  profile: "steak-it-profile",
  savedMeals: "steak-it-saved-meals",
  dailyMeals: "steak-it-daily-meals",
  exercises: "steak-it-exercises",
  weightEntries: "steak-it-weight-entries",
  migraines: "steak-it-migraines",
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
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}