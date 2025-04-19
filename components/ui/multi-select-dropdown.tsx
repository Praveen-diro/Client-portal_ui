"use client";

import * as React from "react";
import { Check, X, ChevronsUpDown, FileText, AlertCircle } from "lucide-react";
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
  selected: (string | OptionType)[];
  onChange: (values: string[]) => void;
  placeholder: string;
  emptyMessage?: string;
  className?: string;
  maxDisplayItems?: number;
  disabled?: boolean;
}

export const MultiSelectDropdown = React.memo(function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder,
  emptyMessage = "No options available",
  className,
  maxDisplayItems = 3,
  disabled = false,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = React.useState(false);

  // Extract value from selected item regardless of format
  const getValueFromItem = React.useCallback((item: string | OptionType): string => {
    return typeof item === "string" ? item : item.value;
  }, []);

  // Convert selected items to string values for comparison
  const selectedValues = React.useMemo(() => {
    return selected.map((item) => getValueFromItem(item));
  }, [selected, getValueFromItem]);

  // Handler to toggle selection state
  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newSelected = [...selectedValues, currentValue];
      onChange(newSelected);
      // Don't close the dropdown after selection
    },
    [onChange, selectedValues]
  );

  // Handler to remove an item
  const handleRemove = React.useCallback(
    (valueToRemove: string, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation(); // Prevent opening the dropdown when removing a tag
      }
      const newSelected = selectedValues.filter((value) => value !== valueToRemove);
      onChange(newSelected);
    },
    [onChange, selectedValues]
  );

  // Get selected option objects
  const selectedOptions = React.useMemo(() => {
    return selectedValues
      .map((value) => {
        // First check if the item is already in the selected array as an object
        const selectedObject = selected.find((item) => typeof item !== "string" && item.value === value);

        if (selectedObject && typeof selectedObject !== "string") {
          return selectedObject;
        }

        // Otherwise, look up in options
        return options.find((option) => option.value === value);
      })
      .filter((option) => option !== undefined) as OptionType[];
  }, [selectedValues, selected, options]);

  // Filter out selected options from the available options
  const availableOptions = React.useMemo(() => {
    // Get array of values from selected items for easier comparison
    const selectedValueSet = new Set(selectedValues);

    // Filter options to only include those not in the selected set
    return options.filter((option) => !selectedValueSet.has(option.value));
  }, [options, selectedValues]);

  return (
    <Popover open={open} onOpenChange={(o) => !disabled && setOpen(o)}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <div className="flex flex-wrap gap-1.5 w-full">
            {selectedOptions.length > 0 ? (
              <>
                {selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 transition-colors duration-200"
                  >
                    {option.flag ? (
                      <img src={option.flag} alt="" className="h-3 w-auto object-contain" />
                    ) : (
                      <FileText className="h-3 w-3 flex-shrink-0" />
                    )}
                    <span className="truncate max-w-[120px] text-xs">{option.label}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 rounded-full ml-1 hover:bg-primary/20 flex-shrink-0 transition-colors duration-200"
                      onClick={(e) => handleRemove(option.value, e)}
                      disabled={disabled}
                      tabIndex={-1}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </>
            ) : (
              <div className="flex-1 flex items-center text-muted-foreground">{placeholder}</div>
            )}
            <div className="flex ml-auto items-center self-center">
              <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[200px] max-h-[300px] overflow-auto"
        align="start"
        side="bottom"
        sideOffset={5}
      >
        {options.length === 0 ? (
          // No options at all
          <div className="text-sm py-6 text-center text-muted-foreground">
            <div className="flex flex-col items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground/70" />
              <span>{emptyMessage}</span>
            </div>
          </div>
        ) : availableOptions.length > 0 ? (
          // Options available for selection
          <div className="py-1">
            {availableOptions.map((option) => (
              <div
                key={option.value}
                className="px-3 py-2 cursor-pointer hover:bg-primary/10 hover:text-primary rounded-sm flex items-center gap-2 mx-1 my-1 transition-colors duration-200"
                onClick={() => handleSelect(option.value)}
              >
                {option.flag ? (
                  <img src={option.flag} alt="" className="h-4 w-auto object-contain flex-shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 flex-shrink-0 text-primary/70" />
                )}
                <span className="truncate">{option.label}</span>
              </div>
            ))}
          </div>
        ) : (
          // All options have been selected
          <div className="text-sm py-6 text-center text-muted-foreground">
            <div className="flex flex-col items-center justify-center gap-2">
              <Check className="h-5 w-5 text-primary/60" />
              <span>All options have been selected</span>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
});
