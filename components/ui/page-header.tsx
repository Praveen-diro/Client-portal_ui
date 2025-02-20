"use client";

import { motion } from "framer-motion";
import { ProfileDropdown } from "./profile-dropdown";

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
    <div className="border-b bg-background text-foreground">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-6">
          <motion.div initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} transition={transitionConfig}>
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...transitionConfig, delay: 0.1 }}
          >
            <ProfileDropdown />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
