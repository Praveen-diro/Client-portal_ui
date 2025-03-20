import * as React from "react";
import { cn } from "@/lib/utils";
import { CodeIcon } from "lucide-react";

export interface JsonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: "default" | "sm" | "lg";
}

const JsonButton = React.forwardRef<HTMLButtonElement, JsonButtonProps>(
  ({ className, children, loading = false, disabled, size = "sm", ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          "relative group overflow-hidden rounded-md font-medium cursor-pointer",
          "inline-flex items-center justify-center gap-1.5",
          "transition-all duration-500 ease-out transform",

          // Light theme: lighter blue gradient
          "bg-[linear-gradient(to_right,#78a6e3_0%,#4a7dbe_51%,#78a6e3_100%)]",
          // Dark theme: original deep blue gradient
          "dark:bg-[linear-gradient(to_right,#4b6cb7_0%,#182848_51%,#4b6cb7_100%)]",
          "bg-[length:200%_auto] bg-left",
          "text-white",

          // Hover states
          "hover:bg-right",
          "hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-100",
          "disabled:opacity-70 disabled:pointer-events-none",

          // Size variants
          size === "default" ? "px-4 py-2 text-sm" : size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-base", // lg

          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Icon with enhanced animation */}
        <span
          className="relative z-10 flex items-center justify-center transition-all duration-300 
                        group-hover:rotate-[-20deg] group-hover:scale-110"
        >
          {loading ? (
            <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <CodeIcon className="h-3.5 w-3.5" />
          )}
        </span>

        {/* Text content with enhanced animation */}
        <span
          className="relative z-10 font-medium transition-all duration-300 
                       group-hover:translate-x-1 group-hover:font-semibold"
        >
          {children || "JSON"}
        </span>

        {/* Improved shimmer effect */}
        <span
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent 
                        via-white/20 to-transparent -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-700 ease-in-out"
        ></span>

        {/* Enhanced border glow on hover with theme-specific colors */}
        <span
          className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 
                        ring-2 ring-[#78a6e3]/50 dark:ring-[#4b6cb7]/50 
                        transition-all duration-300 animate-pulse-slow"
        ></span>
      </button>
    );
  }
);

JsonButton.displayName = "JsonButton";

export { JsonButton };
