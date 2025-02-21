"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  sidebarExpanded: boolean;
}

const containerTransition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function PageContainer({ children, sidebarExpanded }: PageContainerProps) {
  return (
    <motion.main
      className="flex-1 overflow-auto"
      initial={false}
      animate={{
        marginLeft: sidebarExpanded ? "256px" : "80px",
      }}
      transition={containerTransition}
    >
      {children}
    </motion.main>
  );
}
