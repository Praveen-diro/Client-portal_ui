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
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { ReportIssueModal } from "./report-issue-modal";

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
  const [isOpen, setIsOpen] = useState(false); // For mobile drawer
  const [isExpanded, setIsExpanded] = useState(false); // For hover expansion
  const [tooltipInfo, setTooltipInfo] = useState<{ show: boolean; text: string; y: number } | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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

  // Handle clicks outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isMobile && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMobile]);

  // Toggle sidebar open/close (mobile)
  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle mouse enter for hover expansion
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    if (isExpanded) return;

    // Small delay to prevent accidental triggers
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(true);
    }, 50);
  }, [isExpanded]);

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
      if (isMobile) {
        setIsOpen(false);
      }
    },
    [router, isMobile]
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
      if (!isExpanded) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setTooltipInfo({
          show: true,
          text,
          y: rect.top + window.scrollY + rect.height / 2,
        });
      }
    },
    [isExpanded]
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
      label: "Verification Buttons",
      href: "/client/validation-buttons",
    },
    {
      id: "requests",
      icon: FileText,
      label: "Requests Sent",
      href: "/client/requests-sent",
    },
    {
      id: "documents",
      icon: FileCheck,
      label: "Documents Received",
      href: "/client/documents-received",
    },
    {
      id: "coverage",
      icon: Earth,
      label: "Coverage", 
      href: "https://diro.live/see-coverage/",
      target: "_blank",
      rel: "noopener noreferrer"
    },
    {
      id: "integrations",
      icon: Gauge,
      label: "Integrations",
      href: "/client/integrations",
    },
    {
      id: "account",
      icon: UserCircle2,
      label: "Account",
      href: "/client/account",
    },
    {
      id: "help",
      icon: LifeBuoy,
      label: "Support",
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
  ];

  return (
    <>
      {/* Report Issue Modal */}
      <ReportIssueModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />

      {/* Mobile toggle button */}
      <motion.button
        onClick={toggleSidebar}
        className={cn(
          "lg:hidden fixed z-50 bottom-6 right-6 p-3 rounded-full",
          "bg-primary text-primary-foreground shadow-md",
          isOpen && "rotate-90"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Menu className="h-6 w-6" />
      </motion.button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Tooltip for collapsed state
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
      </AnimatePresence> */}

      {/* Sidebar with hover functionality */}
      <motion.div
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50",
          "bg-card/90 backdrop-blur-lg border-r border-border/20 flex flex-col overflow-hidden",
          !isOpen && "-translate-x-full lg:translate-x-0",
          "shadow-xl",
          className
        )}
        animate={{
          width: isExpanded ? (isMobile ? 320 : 280) : 72,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          duration: 0.3,
        }}
      >
        {/* Logo section */}
        <div className="flex items-center p-5 h-[80px] border-b border-border/10 relative">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_dirosvg-SlKV6MwAd8fixuyjmkq61ZTjUPmRnk.png"
              alt="Diro Logo"
              className="h-10 w-8 object-contain flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />

            {/* Only render logo text when expanded */}
            {isExpanded && (
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

          {/* Mobile close button */}
          {isExpanded && (
            <motion.button
              onClick={toggleSidebar}
              className="ml-auto p-2 rounded-full lg:hidden hover:bg-accent/50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          )}
        </div>

        {/* Navigation items - flat list with increased height */}
        <div className={cn("flex-1 overflow-y-auto py-6", isExpanded ? "px-4" : "px-2")}>
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = activeItem === item.href;
              return (
                <Link key={item.id} href={item.href} onClick={(e) => handleNavigation(item.href, e)}>
                  <motion.div
                    className={cn(
                      "relative flex items-center rounded-xl overflow-hidden",
                      "h-14 transition-all duration-200",
                      isExpanded ? "px-4" : "justify-center",
                      isActive
                        ? "text-primary bg-primary/10 font-medium shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                    )}
                    whileHover={{
                      scale: isExpanded ? 1.02 : 1.15,
                      x: isExpanded ? 2 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: isExpanded ? 20 : 17,
                    }}
                    onMouseEnter={!isExpanded ? (e) => showTooltip(item.label, e) : undefined}
                    onMouseLeave={!isExpanded ? hideTooltip : undefined}
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
                        isExpanded ? "h-10 w-10 mr-4 rounded-lg" : "h-12 w-12",
                        isActive ? "text-primary" : ""
                      )}
                    >
                      <item.icon className={isExpanded ? "h-[22px] w-[22px]" : "h-6 w-6"} />
                    </div>

                    {/* Only render label when sidebar is expanded */}
                    {isExpanded && (
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
        <div className={cn("border-t border-border/10 p-4", isExpanded ? "space-y-3" : "space-y-5")}>
          {/* Test Mode Toggle */}
          <div
            className={cn(
              "text-muted-foreground hover:text-foreground flex items-center",
              "h-12 rounded-xl w-full transition-colors duration-200",
              isExpanded ? "px-4 hover:bg-accent/30" : "justify-center"
            )}
          >
            <div className={cn("flex items-center justify-center flex-shrink-0", isExpanded ? "h-10 w-10 rounded-lg" : "")}>
              <Settings className="h-[22px] w-[22px]" />
            </div>

            {isExpanded && (
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
                <ModeToggle />
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
                isExpanded ? "px-4 hover:bg-accent/30" : "justify-center"
              )}
              whileHover={isExpanded ? { x: 2, scale: 1.02 } : { scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Button icon - always visible */}
              <div className={cn("flex items-center justify-center flex-shrink-0", isExpanded ? "h-10 w-10 rounded-lg" : "")}>
                {mounted ? <action.icon className="h-[22px] w-[22px]" /> : <div className="h-[22px] w-[22px]" />}
              </div>

              {/* Only render button label when expanded */}
              {isExpanded && (
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
    </>
  );
}
