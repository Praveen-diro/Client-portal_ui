import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export interface FancySwitchToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  id?: string;
}

const FancySwitchToggle = React.forwardRef<HTMLInputElement, FancySwitchToggleProps>(
  (
    { className, onCheckedChange, checked = false, id = `toggler-${Math.random().toString(36).substring(2, 9)}`, ...props },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      onCheckedChange?.(isChecked);
    };

    return (
      <label htmlFor={id} className={cn("cursor-pointer inline-block", className)}>
        <input id={id} type="checkbox" ref={ref} checked={checked} onChange={handleChange} className="sr-only" {...props} />
        <div
          className={cn(
            "relative w-[44px] h-[22px] rounded-full overflow-hidden transition-all duration-500 ease-in-out border",
            checked
              ? "bg-primary shadow-[0_2px_10px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.1),0_0_0_4px_rgba(var(--primary),0.2)] border-primary/50 dark:shadow-[0_2px_8px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.2),0_0_0_4px_rgba(var(--primary),0.3)]"
              : "bg-muted shadow-[0_2px_5px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(0,0,0,0.1)] border-border dark:bg-muted/70 dark:border-border/60 dark:shadow-[0_2px_5px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.05)]"
          )}
        >
          <div
            className={cn(
              "absolute w-[20px] h-[20px] rounded-full bg-card top-[0.5px] left-[0.5px] flex justify-center items-center transition-transform duration-300 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] shadow-[0_2px_4px_rgba(0,0,0,0.2),0_0_2px_rgba(0,0,0,0.1)]",
              "active:scale-95 ring-1 ring-border/50 dark:bg-card dark:ring-white/20 dark:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_0_2px_rgba(255,255,255,0.05)]",
              checked ? "translate-x-[22px]" : "translate-x-0"
            )}
          >
            <span
              className={cn(
                "text-primary text-[10px] absolute transition-all duration-300 ease-in-out dark:text-primary/90",
                checked ? "opacity-100 scale-100" : "opacity-0 scale-0"
              )}
            >
              <Check size={12} strokeWidth={3} />
            </span>
            <span
              className={cn(
                "text-muted-foreground text-[10px] absolute transition-all duration-300 ease-in-out dark:text-muted-foreground/90",
                checked ? "opacity-0 scale-0" : "opacity-100 scale-100"
              )}
            >
              <X size={12} strokeWidth={3} />
            </span>
          </div>
        </div>
      </label>
    );
  }
);

FancySwitchToggle.displayName = "FancySwitchToggle";

export { FancySwitchToggle };
