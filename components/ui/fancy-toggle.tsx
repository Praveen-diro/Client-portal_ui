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
          "bg-white border border-gray-200",
          "flex items-center"
        )}
      >
        <span
          className={cn(
            "absolute block h-4 w-4 rounded-full transition-transform duration-300 ease-in-out",
            "left-1",
            checked ? "translate-x-6 bg-[#F9C163] border-2 border-[#F3B146]" : "bg-white border-2 border-gray-300"
          )}
        />
      </div>
    </label>
  );
}
