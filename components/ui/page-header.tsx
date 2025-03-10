"use client";

import { motion } from "framer-motion";
import { ProfileDropdown } from "./profile-dropdown";
import { Search } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const transitionConfig = {
    type: "spring",
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
    mass: 1,
  };

  return (
    <div className="border-b border-border/40">
      <div className="container flex h-24 items-center justify-between px-6">
        <motion.div initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} transition={transitionConfig}>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </motion.div>

        <div className="flex items-center gap-4">
          <motion.div
            className="relative w-64"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...transitionConfig, delay: 0.1 }}
          >
            {title !== "Requests Sent" && (
              <>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="pl-10 w-full" />
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...transitionConfig, delay: 0.2 }}
          >
            <ProfileDropdown />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
