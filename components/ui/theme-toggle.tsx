"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  showText?: boolean;
}

export function ThemeToggle({ showText = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-0 border-0 bg-transparent hover:bg-transparent focus:outline-none relative"
    >
      <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-800 dark:text-white" />
      <Moon className="absolute top-0 left-0 h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-800 dark:text-white" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
