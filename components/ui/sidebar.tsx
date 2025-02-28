"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FileText, Globe, HelpCircle, LayoutGrid, Settings, User2, Moon, Sun, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

interface SidebarProps {
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
}

const sidebarTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

const itemVariants = {
  expanded: { width: "100%", opacity: 1 },
  collapsed: { width: 0, opacity: 0 },
};

export function Sidebar({ onExpandedChange, className }: SidebarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (onExpandedChange) {
      onExpandedChange(isExpanded);
    }
  }, [isExpanded, onExpandedChange]);

  const navItems = [
    { icon: LayoutGrid, label: "Verification buttons", href: "/client/validation-buttons" },
    { icon: FileText, label: "Requests sent", href: "/client/requests-sent" },
    { icon: FileText, label: "Documents received", href: "/client/documents-received" },
    { icon: Globe, label: "See coverage", href: "/coverage" },
    { icon: Settings, label: "Integrations", href: "/client/integrations" },
    { icon: User2, label: "Manage account", href: "/client/account" },
    { icon: HelpCircle, label: "Report issue", href: "/client/report-issue" },
  ];

  const footerItems = [
    {
      icon: Settings,
      label: "Test mode",
      onClick: () => console.log("Test mode clicked"),
    },
    {
      icon: theme === "dark" ? Sun : Moon,
      label: "Theme",
      onClick: () => {
        if (!mounted) return;
        setTheme(theme === "light" ? "dark" : "light");
      },
    },
  ];

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen",
        "bg-background dark:bg-background",
        "text-sidebar-foreground transition-colors duration-300",
        "border-r border-border/40",
        "shadow-[2px_0_12px_-2px_rgba(0,0,0,0.05)]",
        className
      )}
      initial={false}
      animate={{ width: isExpanded ? "256px" : "80px" }}
      transition={sidebarTransition}
    >
      <div className="flex h-full flex-col" onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}>
        <div className="flex h-24 items-center justify-start border-b border-border px-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_dirosvg-SlKV6MwAd8fixuyjmkq61ZTjUPmRnk.png"
              alt="Diro Logo"
              className="h-14 w-10 object-contain"
            />
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  variants={itemVariants}
                  transition={sidebarTransition}
                  className="flex flex-col overflow-hidden"
                >
                  <h2 className="text-xl font-semibold">Beta</h2>
                  <p className="text-xs text-sidebar-muted-foreground">Verification Portal</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-2 py-6">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", pathname === item.href && "text-primary")} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    className="ml-3 overflow-hidden whitespace-nowrap"
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={itemVariants}
                    transition={sidebarTransition}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!isExpanded && (
                <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-sm text-popover-foreground group-hover:block">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-2 space-y-2">
          {footerItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="group relative flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-muted hover:text-sidebar-muted-foreground"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    className="ml-3 overflow-hidden whitespace-nowrap"
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={itemVariants}
                    transition={sidebarTransition}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!isExpanded && (
                <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-sm text-popover-foreground group-hover:block">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
