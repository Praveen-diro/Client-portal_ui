"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FancyToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange: () => void;
}

export function FancyToggle({ checked, onChange, className, ...props }: FancyToggleProps) {
  return (
    <label className={cn("relative inline-block cursor-pointer", className)}>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} {...props} />
      <div
        className={cn(
          "relative h-6 w-12 rounded-full transition-colors duration-300 ease-in-out",
          "flex items-center",
          "border",
          // Theme-dependent background colors based on state
          checked
            ? "bg-indigo-100 border-indigo-200 dark:bg-indigo-900/60 dark:border-indigo-800"
            : "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800"
        )}
      >
        <span
          className={cn(
            "absolute block h-4 w-4 rounded-full transition-transform duration-300 ease-in-out",
            "left-1",
            checked
              ? "translate-x-6 bg-indigo-500 border-2 border-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              : "bg-white border-2 border-gray-300 dark:bg-gray-200"
          )}
        />
      </div>
    </label>
  );
}
