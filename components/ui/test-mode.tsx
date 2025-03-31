"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TestMode() {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full justify-center gap-2",
        "bg-indigo-50 hover:bg-indigo-100/90 border-indigo-200 text-indigo-700",
        "dark:bg-indigo-950/50 dark:hover:bg-indigo-900/70 dark:border-indigo-800/50 dark:text-indigo-300"
      )}
    >
      <Settings className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
      Test mode
    </Button>
  );
}
