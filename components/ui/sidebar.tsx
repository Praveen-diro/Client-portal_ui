"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { FileText, Globe, HelpCircle, LayoutGrid, Settings, User2, Moon, Sun, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

interface SidebarProps {
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
}

const sidebarTransition = {
  type: "spring",
  stiffness: 400,
  damping: 28,
};

const itemVariants = {
  expanded: { width: "100%", opacity: 1 },
  collapsed: { width: 0, opacity: 0 },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.2,
    },
  }),
};

export function Sidebar({ onExpandedChange, className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeItem, setActiveItem] = useState(pathname);

  // Keep track of mouse state with persistent refs
  const [isHovering, setIsHovering] = useState(false);

  // Initialize once
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update the active item when pathname changes
  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  // Notify parent component of expansion changes
  useEffect(() => {
    if (onExpandedChange) {
      onExpandedChange(isExpanded);
    }
  }, [isExpanded, onExpandedChange]);

  // Control expansion based on hover state
  useEffect(() => {
    setIsExpanded(isHovering);
  }, [isHovering]);

  // Define stable event handlers with useCallback
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Custom navigation handler to ensure clean state transitions
  const handleItemClick = useCallback(
    (href: string, e: React.MouseEvent) => {
      // Update active item immediately for UX
      setActiveItem(href);

      // Prevent default navigation so we can control it
      e.preventDefault();

      // First set not hovering to collapse sidebar
      setIsHovering(false);

      // Then navigate after a short delay to ensure smooth animation
      setTimeout(() => {
        router.push(href);
      }, 100);
    },
    [router]
  );

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
      transition={{ ...sidebarTransition, duration: 0.3 }}
    >
      <div
        className="flex h-full flex-col"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-expanded={isExpanded}
        data-hover={isHovering}
      >
        <div className="flex h-24 items-center justify-start border-b border-border px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_dirosvg-SlKV6MwAd8fixuyjmkq61ZTjUPmRnk.png"
              alt="Diro Logo"
              className="h-14 w-10 object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  key="sidebarTitle"
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  variants={itemVariants}
                  transition={{ ...sidebarTransition, delay: 0.1 }}
                  className="flex flex-col overflow-hidden"
                >
                  <h2 className="text-xl font-semibold">Beta</h2>
                  <p className="text-xs text-sidebar-muted-foreground">Verification Portal</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-6">
          {navItems.map((item, index) => {
            const isActive = activeItem === item.href;
            return (
              <motion.div
                key={item.href}
                variants={navItemVariants}
                initial={false}
                animate="visible"
                custom={index}
                layout={false}
                className="mb-1"
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleItemClick(item.href, e)}
                  className={cn(
                    "group relative flex items-center rounded-lg px-4 py-2.5 text-sm font-medium",
                    "transition-colors duration-150",
                    "overflow-hidden",
                    "active:scale-95 active:opacity-90",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary/90"
                  )}
                >
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                      layoutId="sidebar-indicator"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center justify-center">
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors duration-150",
                        isActive ? "text-primary" : "text-sidebar-muted-foreground group-hover:text-primary/80"
                      )}
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {isExpanded && (
                      <motion.span
                        key={`label-${item.href}`}
                        className="ml-3 overflow-hidden whitespace-nowrap"
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={itemVariants}
                        transition={{ ...sidebarTransition, delay: 0.05 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-lg z-50 group-hover:block">
                      {item.label}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="border-t border-border p-2 space-y-2 mb-2">
          {footerItems.map((item, index) => (
            <motion.div
              key={item.label}
              variants={navItemVariants}
              initial={false}
              animate="visible"
              custom={index}
              layout={false}
            >
              <button
                onClick={item.onClick}
                className="group relative flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium 
                transition-colors duration-150
                bg-sidebar-accent/30 text-sidebar-foreground 
                hover:bg-sidebar-accent/60 hover:text-primary/90 
                active:scale-95 active:opacity-90"
              >
                <div className="flex items-center justify-center">
                  {mounted ? (
                    <item.icon className="h-5 w-5 shrink-0 text-sidebar-muted-foreground group-hover:text-primary/80 transition-colors duration-150" />
                  ) : (
                    <div className="h-5 w-5 shrink-0" />
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {isExpanded && (
                    <motion.span
                      key={`footer-${item.label}`}
                      className="ml-3 overflow-hidden whitespace-nowrap"
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={itemVariants}
                      transition={{ ...sidebarTransition, delay: 0.05 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isExpanded && (
                  <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-lg z-50 group-hover:block">
                    {item.label}
                  </div>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
