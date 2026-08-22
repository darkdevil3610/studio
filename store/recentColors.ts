/**
 * Recent colors: the last colors the user has applied, persisted to
 * localStorage so a palette stays available across sessions. Most-recent
 * first, de-duplicated, capped. Seeds from the current document once if
 * empty so the feature is useful on first open.
 */

import { create } from "zustand";

const STORAGE_KEY = "zoxilsi-recent-colors";
const MAX = 12;

function load(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((c): c is string => typeof c === "string")
      .map((c) => c.toLowerCase())
      .slice(0, MAX);
  } catch {
    return [];
  }
}

function save(colors: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  } catch {
    // Storage unavailable (private mode) — recents just won't persist.
  }
}

interface RecentColorsStore {
  colors: string[];
  /** Add a color to the front (de-duped, capped). */
  push: (hex: string) => void;
  remove: (hex: string) => void;
  clear: () => void;
  /** Seed from a list only if currently empty (e.g. first run). */
  seed: (hexes: string[]) => void;
}

export const useRecentColors = create<RecentColorsStore>((set, get) => ({
  colors: load(),

  push: (hex) => {
    const norm = hex.toLowerCase();
    const next = [norm, ...get().colors.filter((c) => c !== norm)].slice(0, MAX);
    save(next);
    set({ colors: next });
  },

  remove: (hex) => {
    const norm = hex.toLowerCase();
    const next = get().colors.filter((c) => c !== norm);
    save(next);
    set({ colors: next });
  },

  clear: () => {
    save([]);
    set({ colors: [] });
  },

  seed: (hexes) => {
    if (get().colors.length > 0) return;
    const next = [...new Set(hexes.map((h) => h.toLowerCase()))].slice(0, MAX);
    save(next);
    set({ colors: next });
  },
}));
