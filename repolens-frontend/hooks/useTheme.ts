/**
 * Theme Hook
 * Manages dark/light mode with localStorage persistence
 */

"use client";

import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

const applyTheme = (newTheme: Theme) => {
  const root = document.documentElement;

  if (newTheme === "dark") {
    root.setAttribute("data-theme", "dark");
    root.classList.add("dark");
  } else {
    root.setAttribute("data-theme", "light");
    root.classList.remove("dark");
  }
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    Promise.resolve().then(() => {
      // Check localStorage first
      const savedTheme = localStorage.getItem("theme") as Theme | null;

      if (savedTheme) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        const systemTheme = prefersDark ? "dark" : "light";
        setTheme(systemTheme);
        applyTheme(systemTheme);
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    isDarkMode: theme === "dark",
    mounted: true,
  };
}

// Made with Bob
