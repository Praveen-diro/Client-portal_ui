"use client";

import * as React from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type OptionType = {
  value: string;
  label: string;
  flag?: string; // Optional flag emoji or image URL
  uniquekey?: string; // Optional unique identifier
};

interface MultiSelectDropdownProps {
  options: OptionType[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  emptyMessage?: string;
  className?: string;
  maxDisplayItems?: number;
}

export const MultiSelectDropdown = React.memo(function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder,
  emptyMessage = "No options available",
  className,
  maxDisplayItems = 3,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = React.useState(false);

  // Log for debugging
  React.useEffect(() => {
    console.log("MultiSelectDropdown options:", options);
    console.log("MultiSelectDropdown selected:", selected);
  }, [options, selected]);

  // Handler to toggle selection state
  const handleSelect = React.useCallback(
    (currentValue: string) => {
      console.log("Handling selection for:", currentValue);
      const newSelected = selected.includes(currentValue)
        ? selected.filter((item) => item !== currentValue)
        : [...selected, currentValue];
      console.log("New selection will be:", newSelected);
      onChange(newSelected);
    },
    [onChange, selected]
  );

  // Memoized display value
  const displayValue = React.useMemo(() => {
    if (selected.length === 0) return placeholder;

    // Get labels for selected values
    const selectedLabels = selected.map((value) => options.find((option) => option.value === value)?.label || value);

    // Show first few selections and a count for the rest
    if (selectedLabels.length > maxDisplayItems) {
      return (
        <>
          {selectedLabels.slice(0, maxDisplayItems).join(", ")}
          <Badge variant="secondary" className="ml-1 rounded-sm">
            +{selectedLabels.length - maxDisplayItems}
          </Badge>
        </>
      );
    }

    return selectedLabels.join(", ");
  }, [selected, options, placeholder, maxDisplayItems]);

  // Manually rendered options for better control
  const optionsList = React.useMemo(() => {
    return options.map((option) => (
      <div
        key={option.value}
        className="px-2 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm flex items-center gap-2"
        onClick={() => {
          handleSelect(option.value);
          // Don't close dropdown on selection
        }}
      >
        <div className="w-5 flex justify-center">
          {selected.includes(option.value) ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <div className="h-4 w-4" /> // Empty placeholder to maintain alignment
          )}
        </div>
        <span>{option.label}</span>
      </div>
    ));
  }, [options, selected, handleSelect]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between relative hover:bg-background transition-all focus:ring-2 focus:ring-primary/20",
            className
          )}
        >
          <span className="truncate">{displayValue}</span>
          <div className="flex gap-1 items-center">
            {selected.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 rounded-full hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
                type="button"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[200px] max-h-[300px] overflow-auto"
        align="start"
        side="bottom"
        sideOffset={5}
      >
        {options.length > 0 ? (
          <div className="py-1">{optionsList}</div>
        ) : (
          <div className="text-sm py-6 text-center text-muted-foreground">{emptyMessage}</div>
        )}
      </PopoverContent>
    </Popover>
  );
});
