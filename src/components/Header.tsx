"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

interface HeaderProps {
  user: { username: string; name: string };
}

export default function Header({ user }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500 text-sm font-bold text-white">
          IA
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">Clases IA</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Administrador
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 text-sm font-semibold text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
