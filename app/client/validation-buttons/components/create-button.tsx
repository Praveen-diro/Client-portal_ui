"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface CreateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  authMode: number;
  adminAccess: boolean;
}

export function CreateButton({ onClick, disabled, authMode, adminAccess }: CreateButtonProps) {
  const isDisabled = Boolean(authMode === 1);

  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!adminAccess && (
        <span className="text-red-500 mr-4 text-sm">Access denied. You don't have permission to create buttons.</span>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={isDisabled ? "cursor-not-allowed" : "cursor-pointer"}>
            <Button
              className={
                isDisabled
                  ? "opacity-50 pointer-events-none bg-gray-400 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }
              onClick={onClick}
              disabled={isDisabled || false}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Button
            </Button>
          </div>
        </TooltipTrigger>
        {isDisabled && (
          <TooltipContent>
            <p>To create a button, please switch to test mode</p>
          </TooltipContent>
        )}
      </Tooltip>
    </motion.div>
  );
}
