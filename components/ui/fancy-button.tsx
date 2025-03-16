import * as React from "react";
import { cn } from "@/lib/utils";

export interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  loading?: boolean;
  size?: "default" | "small" | "tiny";
  variant?: "default" | "blue";
  successAnimation?: boolean;
}

const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  (
    {
      className,
      children,
      icon,
      loading = false,
      disabled,
      size = "small",
      variant = "default",
      successAnimation = false,
      ...props
    },
    ref
  ) => {
    const [showSuccess, setShowSuccess] = React.useState(false);

    // Handle success animation
    React.useEffect(() => {
      if (successAnimation && !loading && !showSuccess) {
        setShowSuccess(true);
        const timer = setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [loading, successAnimation]);

    return (
      <button
        className={cn(
          "relative",
          "text-white font-medium",
          "flex items-center justify-center",
          "border-none rounded-full",
          "overflow-hidden",
          "transition-all duration-300 ease-out",
          "cursor-pointer",
          "hover:translate-y-[-2px]",
          "active:translate-y-[1px]",
          "disabled:opacity-70 disabled:pointer-events-none",
          "group",
          // Simple, elegant background
          showSuccess
            ? "bg-green-500 hover:bg-green-600"
            : variant === "default"
            ? "bg-[#4361ee] hover:bg-[#3a56d4]"
            : "bg-blue-600 hover:bg-blue-700 dark:bg-[#4b6cb7] dark:hover:bg-[#3b5ca7]",
          // Clean shadow
          "shadow-sm hover:shadow-md",
          // Size styles - now with smaller default size
          size === "default" ? "text-base py-2 px-4" : size === "small" ? "text-sm py-1.5 px-3" : "text-xs py-1 px-2.5", // tiny size
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Simple icon container */}
        <div
          className={cn(
            "flex items-center justify-center mr-1.5 transition-all duration-300 ease-in-out",
            showSuccess ? "text-white" : "group-hover:translate-x-[-2px]"
          )}
        >
          {loading ? (
            <svg
              className={cn(
                "text-white animate-spin",
                size === "default" ? "w-4 h-4" : size === "small" ? "w-3.5 h-3.5" : "w-3 h-3"
              )}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : showSuccess ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn("fill-white", size === "default" ? "w-4 h-4" : size === "small" ? "w-3.5 h-3.5" : "w-3 h-3")}
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          ) : icon ? (
            icon
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={cn(
                "fill-white transition-all duration-300 ease-in-out",
                "group-hover:rotate-[25deg]",
                size === "default" ? "w-4 h-4" : size === "small" ? "w-3.5 h-3.5" : "w-3 h-3"
              )}
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                fill="currentColor"
                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
              ></path>
            </svg>
          )}
        </div>

        {/* Clean text with simple animation */}
        <span
          className={cn(
            "transition-all duration-300 ease-in-out tracking-wide",
            showSuccess ? "" : "group-hover:translate-x-[2px]"
          )}
        >
          {showSuccess ? "Sent!" : children}
        </span>

        {/* Elegant background animation */}
        <span className="absolute inset-0 w-full h-full bg-white/0 group-hover:bg-white/10 transition-all duration-300 ease-in-out"></span>

        {/* Subtle bottom border that expands */}
        <span className="absolute bottom-0 left-1/2 right-1/2 h-[1px] bg-white/30 group-hover:left-0 group-hover:right-0 transition-all duration-500 ease-in-out"></span>

        {/* Subtle ring effect on hover */}
        <span className="absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 bg-white/10 blur-sm transition-all duration-500 ease-in-out"></span>
      </button>
    );
  }
);

FancyButton.displayName = "FancyButton";

export { FancyButton };
