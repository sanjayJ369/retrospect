"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";

// Define your available base themes
export const baseThemes = [
  "default",
  "gameboy",
  "sega",
  "atari",
  "nintendo",
  "arcade",
  "neogeo",
  "soft-pop",
  "pacman",
  "vhs",
  "cassette",
  "rusty-byte",
];

interface CustomThemeContextType {
  baseTheme: string;
  setBaseTheme: (theme: string) => void;
  colorMode: string | undefined;
  setColorMode: (mode: string) => void;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(
  undefined,
);

function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: colorMode, setTheme: setColorMode } = useNextTheme();
  const [baseTheme, setBaseThemeState] = useState(baseThemes[0]);

  useEffect(() => {
    const savedTheme =
      window.localStorage.getItem("base-theme") || baseThemes[0];
    setBaseThemeState(savedTheme);

    const root = window.document.documentElement;
    root.classList.remove(...baseThemes.map((t) => `theme-${t}`));
    root.classList.add(`theme-${savedTheme}`);
  }, []);

  const setBaseTheme = (theme: string) => {
    if (!baseThemes.includes(theme)) return;

    setBaseThemeState(theme);
    window.localStorage.setItem("base-theme", theme);

    const root = window.document.documentElement;
    root.classList.remove(...baseThemes.map((t) => `theme-${t}`));
    root.classList.add(`theme-${theme}`);
  };

  return (
    <CustomThemeContext.Provider
      value={{ baseTheme, setBaseTheme, colorMode, setColorMode }}
    >
      {children}
    </CustomThemeContext.Provider>
  );
}

// Custom hook to access our theme context
export function useTheme() {
  const context = useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a AppThemeProvider");
  }
  return context;
}

// The final, top-level provider
export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </NextThemesProvider>
  );
}
