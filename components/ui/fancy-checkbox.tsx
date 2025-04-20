import * as React from "react";
import { cn } from "@/lib/utils";

export interface FancyCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const FancyCheckbox = React.forwardRef<HTMLInputElement, FancyCheckboxProps>(({ className, label, id, ...props }, ref) => {
  // Generate a unique ID if none provided
  const uniqueId = React.useId();
  const checkboxId = id || uniqueId;

  return (
    <div className={cn("checkbox-wrapper", className)}>
      <input type="checkbox" id={checkboxId} className="hidden" ref={ref} {...props} />
      <label htmlFor={checkboxId} className="cbx flex items-center cursor-pointer select-none">
        <span className="relative w-[18px] h-[18px] rounded-[3px] border border-slate-400 dark:border-slate-500 transition-all duration-200 hover:border-primary dark:hover:border-primary group-data-[state=checked]:bg-primary group-data-[state=checked]:border-primary">
          <svg
            viewBox="0 0 12 10"
            className="absolute top-[3px] left-[2px] fill-none stroke-white stroke-[2] opacity-0 transition-all duration-300 delay-100 group-data-[state=checked]:opacity-100"
            style={{
              strokeDasharray: "16px",
              strokeDashoffset: "16px",
              transform: "translate3d(0, 0, 0)",
            }}
          >
            <polyline points="1.5 6 4.5 9 10.5 1" />
          </svg>
          <span className="absolute inset-0 scale-0 opacity-100 bg-primary rounded-[50%] group-data-[state=checked]:scale-[3.5] group-data-[state=checked]:opacity-0 transition-all duration-600" />
        </span>
        {label && <span className="pl-2 text-sm">{label}</span>}
      </label>
    </div>
  );
});

FancyCheckbox.displayName = "FancyCheckbox";

export { FancyCheckbox };
