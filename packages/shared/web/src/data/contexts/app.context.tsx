"use client";
import React, { createContext, useCallback, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";

export type AppContextProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  toggleThemeMode: () => void;
};

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

const THEME_STORAGE_KEY = "pharmacore_theme_mode";

function applyThemeToDocument(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme: ThemeMode =
      savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
    setThemeModeState(initialTheme);
    applyThemeToDocument(initialTheme);
  }, []);

  const setThemeMode = useCallback((theme: ThemeMode) => {
    setThemeModeState(theme);
    applyThemeToDocument(theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, []);

  const toggleThemeMode = useCallback(() => {
    setThemeMode(themeMode === "dark" ? "light" : "dark");
  }, [setThemeMode, themeMode]);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        themeMode,
        setThemeMode,
        toggleThemeMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
