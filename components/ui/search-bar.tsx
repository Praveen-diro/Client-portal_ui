"use client";

import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  expanded: boolean;
}

export function SearchBar({ expanded }: SearchBarProps) {
  const itemVariants = {
    expanded: { width: "100%", opacity: 1 },
    collapsed: { width: 0, opacity: 0 },
  };

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2", "border-t border-border/40")}>
      <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="flex-1 overflow-hidden"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={itemVariants}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <Input type="search" placeholder="Search..." className="h-8" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
