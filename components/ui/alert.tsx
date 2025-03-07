import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle, Ban } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva("relative rounded-xl px-5 py-4 text-sm shadow-xl backdrop-blur-sm border-l-4 animate-slideIn", {
  variants: {
    variant: {
      default: "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-300 dark:border-slate-600",
      destructive: "bg-white dark:bg-slate-800/90 text-red-600 dark:text-red-400 border-red-500",
      success: "bg-white dark:bg-slate-800/90 text-green-600 dark:text-green-400 border-green-500",
      info: "bg-white dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 border-blue-500",
      warning: "bg-white dark:bg-slate-800/90 text-amber-600 dark:text-amber-400 border-amber-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant, children, onClose, ...props }, ref) => {
  // Add icon based on variant
  let icon = null;
  let iconBgColor = "";

  if (variant === "destructive") {
    icon = <Ban className="h-5 w-5" />;
    iconBgColor = "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
  } else if (variant === "success") {
    icon = <CheckCircle2 className="h-5 w-5" />;
    iconBgColor = "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
  } else if (variant === "info") {
    icon = <Info className="h-5 w-5" />;
    iconBgColor = "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
  } else if (variant === "warning") {
    icon = <AlertTriangle className="h-5 w-5" />;
    iconBgColor = "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
  }

  return (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), "flex items-center space-x-4", className)} {...props}>
      {variant && variant !== "default" && <div className={cn("flex-shrink-0 p-1 rounded-full", iconBgColor)}>{icon}</div>}
      <div className="flex-1 font-medium">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "p-1.5 rounded-full transition-colors",
            variant === "destructive"
              ? "hover:bg-red-100 dark:hover:bg-red-900/30"
              : variant === "success"
              ? "hover:bg-green-100 dark:hover:bg-green-900/30"
              : variant === "info"
              ? "hover:bg-blue-100 dark:hover:bg-blue-900/30"
              : variant === "warning"
              ? "hover:bg-amber-100 dark:hover:bg-amber-900/30"
              : "hover:bg-slate-100 dark:hover:bg-slate-700"
          )}
          aria-label="Close alert"
        >
          <X
            className={cn(
              "h-4 w-4",
              variant === "destructive"
                ? "text-red-500 dark:text-red-400"
                : variant === "success"
                ? "text-green-500 dark:text-green-400"
                : variant === "info"
                ? "text-blue-500 dark:text-blue-400"
                : variant === "warning"
                ? "text-amber-500 dark:text-amber-400"
                : "text-slate-500 dark:text-slate-400"
            )}
          />
        </button>
      )}
    </div>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("text-base font-semibold leading-none tracking-tight mb-1", className)} {...props} />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("[&_p]:leading-relaxed", className)} {...props} />
);
AlertDescription.displayName = "AlertDescription";

// Wrapper component that handles animation and auto-dismissal
interface AlertContainerProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose?: () => void;
  autoDismiss?: boolean;
  dismissTimeout?: number;
  className?: string;
}

const AlertContainer: React.FC<AlertContainerProps> = ({
  children,
  isVisible,
  onClose,
  autoDismiss = false,
  dismissTimeout = 5000,
  className,
}) => {
  React.useEffect(() => {
    if (autoDismiss && isVisible && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, dismissTimeout);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTimeout, isVisible, onClose]);

  return <div className={cn("relative", className)}>{isVisible && children}</div>;
};

export { Alert, AlertTitle, AlertDescription, AlertContainer };
