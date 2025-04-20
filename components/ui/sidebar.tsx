"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  FileText,
  LayoutGrid,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  Menu,
  FileCheck,
  Earth,
  UserCircle2,
  Gauge,
  LifeBuoy,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ModeToggle, ModeToggleRef } from "./mode-toggle";
import { cookies } from "@/app/services/cookie.service";
import { ReportIssueModal } from "./report-issue-modal";
import { authService } from "@/app/services/auth.service";

interface SidebarProps {
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
}

export function Sidebar({ onExpandedChange, className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeItem, setActiveItem] = useState(pathname);
  const [isExpanded, setIsExpanded] = useState(false); // For hover expansion
  const [tooltipInfo, setTooltipInfo] = useState<{ show: boolean; text: string; y: number } | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Reference to ModeToggle component
  const modeToggleRef = useRef<ModeToggleRef>(null);

  // Get current test mode status
  const getTestMode = useCallback(() => {
    try {
      const testMode = cookies.get("testMode");
      return testMode === "true";
    } catch (error) {
      console.error("Error getting test mode from cookies:", error);
      return false;
    }
  }, []);

  // Fetch the current test mode on mount
  useEffect(() => {
    if (mounted) {
      setIsTestMode(getTestMode());
    }
  }, [mounted, getTestMode]);

  // Handle test mode toggle
  const handleTestModeToggle = useCallback(() => {
    if (isToggling) return;

    // Use the ModeToggle's toggleModal method when in collapsed mode
    if (!isExpanded && modeToggleRef.current) {
      modeToggleRef.current.toggleModal();
    }
  }, [isExpanded, isToggling]);

  // Initialize component
  useEffect(() => {
    setMounted(true);

    // Set initial mobile state
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Update active item when pathname changes
  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  // Notify parent of sidebar state changes
  useEffect(() => {
    if (onExpandedChange) {
      onExpandedChange(isExpanded);
    }
  }, [isExpanded, onExpandedChange]);

  // Handle mouse enter for hover expansion - only on large screens
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    if (isExpanded || isMobile) return;

    // Small delay to prevent accidental triggers
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(true);
    }, 50);
  }, [isExpanded, isMobile]);

  // Handle mouse leave for hover collapse
  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    if (!isExpanded) return;

    // Small delay before collapsing to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  }, [isExpanded]);

  // Handle navigation
  const handleNavigation = useCallback(
    (href: string, e: React.MouseEvent) => {
      e.preventDefault();
      if (href === "support") {
        setIsReportModalOpen(true);
        setActiveItem("support");
        return;
      }
      setActiveItem(href);
      router.push(href);
    },
    [router]
  );

  // Update active item when modal closes
  useEffect(() => {
    if (!isReportModalOpen && activeItem === "support") {
      setActiveItem(pathname);
    }
  }, [isReportModalOpen, pathname, activeItem]);

  // Show tooltip
  const showTooltip = useCallback(
    (text: string, e: React.MouseEvent) => {
      if (!isExpanded && isMobile) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setTooltipInfo({
          show: true,
          text,
          y: rect.top + window.scrollY + rect.height / 2,
        });
      }
    },
    [isExpanded, isMobile]
  );

  // Hide tooltip
  const hideTooltip = useCallback(() => {
    setTooltipInfo(null);
  }, []);

  // If not mounted yet, return a simple placeholder
  if (!mounted) {
    return null;
  }

  // Flatten navigation items into a single list
  const navItems = [
    {
      id: "verification",
      icon: LayoutGrid,
      label: "Verification buttons",
      href: "/client/validation-buttons",
    },
    {
      id: "requests",
      icon: FileText,
      label: "Requests sent",
      href: "/client/requests-sent",
    },
    {
      id: "documents",
      icon: FileCheck,
      label: "Documents received",
      href: "/client/documents-received",
    },
    {
      id: "logs",
      icon: FileText,
      label: "Callback Logs",
      href: "/client/callback-logs",
    },
    {
      id: "See coverage",
      icon: Earth,
      label: "Coverage", 
      href: "https://diro.live/see-coverage/",
      target: "_blank",
      rel: "noopener noreferrer"
    },
    {
      id: "integrations",
      icon: Gauge,
      label: "Integration",
      href: "/client/integrations",
    },
    {
      id: "account",
      icon: UserCircle2,
      label: "Manage account",
      href: "/client/account",
    },
    {
      id: "help",
      icon: LifeBuoy,
      label: "Report issue",
      href: "support",
    },
  ];

  // Footer actions
  const footerActions = [
    {
      id: "theme",
      icon: theme === "dark" ? Sun : Moon,
      label: theme === "dark" ? "Light Mode" : "Dark Mode",
      onClick: () => {
        if (!mounted) return;
        setTheme(theme === "light" ? "dark" : "light");
      },
    },
    {
      id: "logout",
      icon: LogOut,
      label: "Logout",
      onClick: async () => {
        try {
          await authService.logout();
          router.push("/authentication/login");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    },
  ];

  return (
    <>
      {/* Tooltip for collapsed state */}
      <AnimatePresence>
        {tooltipInfo?.show && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ top: tooltipInfo.y }}
            className="fixed left-16 z-50 py-1.5 px-3 bg-popover text-popover-foreground rounded-md shadow-md text-sm whitespace-nowrap transform -translate-y-1/2"
          >
            {tooltipInfo.text}
            <div className="absolute top-1/2 -left-1 h-2 w-2 bg-popover transform rotate-45 -translate-y-1/2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar with hover functionality */}
      <motion.div
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40",
          "bg-card/90 backdrop-blur-lg border-r border-border/20 flex flex-col overflow-hidden",
          "shadow-xl",
          className
        )}
        style={{ top: 0 }}
        animate={{
          width: isExpanded && !isMobile ? 280 : 72,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          duration: 0.3,
        }}
      >
        {/* Logo section */}
        <div className="flex items-center h-[40px] px-3 py-2 border-b border-border/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_dirosvg-SlKV6MwAd8fixuyjmkq61ZTjUPmRnk.png"
              alt="Diro Logo"
              className="h-10 w-8 object-contain flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />

            {/* Only render logo text when expanded */}
            {isExpanded && !isMobile && (
              <motion.div
                className="flex flex-col overflow-hidden flex-shrink-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{
                  duration: 0.25,
                  ease: [0.33, 1, 0.68, 1],
                }}
              >
                <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent whitespace-nowrap">
                  DIRO
                </h2>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Verification Portal</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation items - flat list with increased height */}
        <div className={cn("flex-1 overflow-y-auto py-6", isExpanded && !isMobile ? "px-4" : "px-2")}>
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = activeItem === item.href;
              return (
                <Link key={item.id} href={item.href} onClick={(e) => handleNavigation(item.href, e)}>
                  <motion.div
                    className={cn(
                      "relative flex items-center rounded-xl overflow-hidden",
                      "h-14 transition-all duration-200",
                      isExpanded && !isMobile ? "px-4" : "justify-center",
                      isActive
                        ? "text-primary bg-primary/10 font-medium shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                    )}
                    whileHover={{
                      scale: isExpanded && !isMobile ? 1.02 : 1.15,
                      x: isExpanded && !isMobile ? 2 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: isExpanded && !isMobile ? 20 : 17,
                    }}
                    onMouseEnter={!isExpanded && isMobile ? (e) => showTooltip(item.label, e) : undefined}
                    onMouseLeave={!isExpanded && isMobile ? hideTooltip : undefined}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                        layoutId="active-indicator"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Icon wrapper - always visible */}
                    <div
                      className={cn(
                        "flex items-center justify-center flex-shrink-0",
                        isExpanded && !isMobile ? "h-10 w-10 mr-4 rounded-lg" : "h-12 w-12",
                        isActive ? "text-primary" : ""
                      )}
                    >
                      <item.icon className={isExpanded && !isMobile ? "h-[22px] w-[22px]" : "h-6 w-6"} />
                    </div>

                    {/* Only render label when sidebar is expanded and not on mobile */}
                    {isExpanded && !isMobile && (
                      <motion.span
                        className="text-[15px] truncate flex-shrink-0 font-medium"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeOut",
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={cn("border-t border-border/10 p-4", isExpanded && !isMobile ? "space-y-3" : "space-y-5")}>
          {/* Test Mode Toggle */}
          <div
            className={cn(
              "text-muted-foreground hover:text-foreground flex items-center",
              "h-12 rounded-xl w-full transition-colors duration-200 relative",
              isExpanded && !isMobile
                ? "px-4 hover:bg-accent/30 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50"
                : "justify-center cursor-pointer hover:bg-accent/10 active:bg-accent/20"
            )}
            onClick={() => {
              if (!isExpanded && !isToggling) {
                handleTestModeToggle();
              }
            }}
            onMouseEnter={
              !isExpanded ? (e) => showTooltip(isTestMode ? "Test Mode: Active" : "Test Mode: Inactive", e) : undefined
            }
            onMouseLeave={!isExpanded ? hideTooltip : undefined}
          >
            {/* Loading indicator for collapsed mode */}
            {isToggling && !isExpanded && (
              <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-xl flex items-center justify-center z-10">
                <svg
                  className="animate-spin h-5 w-5 text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}

            <div
              className={cn(
                "flex items-center justify-center flex-shrink-0 z-0",
                isExpanded && !isMobile ? "h-10 w-10 rounded-lg" : "p-2 rounded-full",
                !isExpanded && "hover:bg-indigo-100/30 dark:hover:bg-indigo-900/30"
              )}
            >
              {isToggling && isExpanded ? (
                <svg
                  className="animate-spin h-[22px] w-[22px] text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Settings
                  className={cn(
                    "h-[22px] w-[22px]",
                    isTestMode ? "text-indigo-500 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"
                  )}
                />
              )}
            </div>

            {isExpanded && !isMobile && (
              <motion.div
                className="ml-2 flex-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <ModeToggle
                  ref={modeToggleRef}
                  onToggleStart={() => setIsToggling(true)}
                  onToggleEnd={() => setIsToggling(false)}
                />
              </motion.div>
            )}
          </div>

          {/* Theme Toggle */}
          {footerActions.map((action) => (
            <motion.button
              key={action.id}
              onClick={action.onClick}
              className={cn(
                "text-muted-foreground hover:text-foreground flex items-center",
                "h-12 rounded-xl w-full transition-colors duration-200",
                isExpanded && !isMobile
                  ? "px-4 hover:bg-accent/30 bg-indigo-50/80 dark:bg-blue-950/40 border border-indigo-100 dark:border-blue-900/50"
                  : "justify-center"
              )}
              whileHover={isExpanded && !isMobile ? { x: 2, scale: 1.02 } : { scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onMouseEnter={!isExpanded && isMobile ? (e) => showTooltip(action.label, e) : undefined}
              onMouseLeave={!isExpanded && isMobile ? hideTooltip : undefined}
            >
              {/* Button icon - always visible */}
              <div
                className={cn(
                  "flex items-center justify-center flex-shrink-0",
                  isExpanded && !isMobile ? "h-10 w-10 rounded-lg" : ""
                )}
              >
                {mounted ? (
                  <action.icon className={`h-[22px] w-[22px] ${theme === "dark" ? "text-blue-400" : "text-indigo-500"}`} />
                ) : (
                  <div className="h-[22px] w-[22px]" />
                )}
              </div>

              {/* Only render button label when expanded and not on mobile */}
              {isExpanded && !isMobile && (
                <motion.span
                  className="text-[15px] truncate flex-shrink-0 ml-2 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                >
                  {action.label}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Hidden ModeToggle for collapsed state - this is the shared modal */}
      {!isExpanded && (
        <div className="hidden">
          <ModeToggle ref={modeToggleRef} onToggleStart={() => setIsToggling(true)} onToggleEnd={() => setIsToggling(false)} />
        </div>
      )}

      {/* Report Issue Modal */}
      <ReportIssueModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </>
  );
}
