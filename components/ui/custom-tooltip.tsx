import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface CustomTooltipProps {
  children: React.ReactNode;
  message: string;
  title?: string;
  variant?: "info" | "success" | "warning" | "error";
  trigger?: "hover" | "click";
  hideDelay?: number;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles = {
  info: {
    bg: "from-blue-900/95 to-blue-800/95",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    borderGlow: "from-blue-500/10 to-indigo-500/10",
  },
  success: {
    bg: "from-green-900/95 to-green-800/95",
    iconBg: "bg-green-500/20",
    iconColor: "text-green-400",
    borderGlow: "from-green-500/10 to-emerald-500/10",
  },
  warning: {
    bg: "from-amber-900/95 to-amber-800/95",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    borderGlow: "from-amber-500/10 to-orange-500/10",
  },
  error: {
    bg: "from-red-900/95 to-red-800/95",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    borderGlow: "from-red-500/10 to-rose-500/10",
  },
};

const defaultIcons = {
  info: <Info className="w-4 h-4" />,
  success: <CheckCircle2 className="w-4 h-4" />,
  warning: <AlertCircle className="w-4 h-4" />,
  error: <XCircle className="w-4 h-4" />,
};

export const CustomTooltip = ({
  children,
  message,
  title,
  variant = "info",
  trigger = "hover",
  hideDelay = 300,
  position = "top",
  className,
  icon,
}: CustomTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hideTimeoutId, setHideTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const styles = variantStyles[variant];
  const defaultIcon = defaultIcons[variant];

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      setHideTimeoutId(null);
    }
  }, [hideTimeoutId]);

  useEffect(() => {
    return () => {
      clearHideTimeout();
    };
  }, [clearHideTimeout]);

  const handleShow = useCallback(() => {
    clearHideTimeout();
    setIsVisible(true);
  }, [clearHideTimeout]);

  const handleHide = useCallback(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
    setHideTimeoutId(timeoutId);
  }, [hideDelay]);

  const handleClick = useCallback(() => {
    clearHideTimeout();
    setIsVisible((prev) => !prev);
  }, [clearHideTimeout]);

  const getPositionClasses = useCallback(() => {
    switch (position) {
      case "bottom":
        return "top-full mt-3";
      case "left":
        return "right-full mr-3 translate-y-0 -translate-x-2";
      case "right":
        return "left-full ml-3 translate-y-0 translate-x-2";
      default:
        return "bottom-full mb-3"; // top position
    }
  }, [position]);

  const getArrowClasses = useCallback(() => {
    switch (position) {
      case "bottom":
        return "-top-1.5 border-t border-l";
      case "left":
        return "-right-1.5 border-t border-r";
      case "right":
        return "-left-1.5 border-b border-l";
      default:
        return "-bottom-1.5 border-r border-b"; // top position
    }
  }, [position]);

  const tooltipProps =
    trigger === "hover"
      ? {
          onMouseEnter: handleShow,
          onMouseLeave: handleHide,
        }
      : {
          onClick: handleClick,
        };

  return (
    <div className={cn("relative inline-block", className)} {...tooltipProps}>
      {children}

      <div
        className={cn(
          "absolute invisible opacity-0 left-1/2 -translate-x-1/2 w-72 transition-all duration-300 ease-out transform translate-y-2 z-50",
          isVisible && "visible opacity-100 translate-y-0",
          getPositionClasses()
        )}
      >
        <div
          className={cn(
            "relative p-4 bg-gradient-to-br backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.15)]",
            styles.bg
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("flex items-center justify-center w-8 h-8 rounded-full", styles.iconBg)}>
              <div className={styles.iconColor}>{icon || defaultIcon}</div>
            </div>
            <h3 className="text-sm font-semibold text-white">{title || "Information"}</h3>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-300">{message}</p>
          </div>

          {/* Gradient background effect */}
          <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-r blur-xl opacity-50", styles.borderGlow)} />

          {/* Arrow */}
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br rotate-45 border-white/10",
              styles.bg,
              getArrowClasses()
            )}
          />
        </div>
      </div>
    </div>
  );
};
