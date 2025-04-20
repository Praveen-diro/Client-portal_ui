"use client";

import { ReactNode } from "react";
import { AlertCircle, AlertTriangle, Ban, CloudOff, RefreshCw, Shield, X } from "lucide-react";
import { ConfirmationModal } from "./confirmation-modal";

export interface ErrorModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Function to call when the modal is closed without confirmation
   */
  onClose: () => void;
  /**
   * Function to call when the retry action is confirmed
   */
  onRetry?: () => void;
  /**
   * Error message to display
   */
  errorMessage?: string;
  /**
   * Error code to classify the error
   */
  errorCode?: string | number;
  /**
   * Optional additional details about the error
   */
  errorDetails?: string;
  /**
   * Whether to hide Button ID or other identification information
   */
  hideDetails?: boolean;
  /**
   * Whether to show the error icon
   */
  showIcon?: boolean;
  /**
   * Text for the cancel button
   */
  cancelText?: string;
  /**
   * Text for the retry button
   */
  retryText?: string;
  /**
   * Whether the retry action is currently loading
   */
  isRetrying?: boolean;
  /**
   * Alternative fallback action if retry isn't applicable
   */
  fallbackAction?: () => void;
  /**
   * Text for the fallback action button
   */
  fallbackActionText?: string;
  /**
   * Whether to disable animations
   */
  disableAnimation?: boolean;
}

/**
 * Maps error codes to appropriate titles, messages, and variants
 */
const ERROR_MAPPINGS: Record<
  string,
  { title: string; defaultMessage: string; icon: ReactNode; variant: "delete" | "warning" | "info" | "error" | "success" }
> = {
  "401": {
    title: "Authentication Failed",
    defaultMessage: "Your session has expired or you don't have permission to access this resource.",
    icon: <Shield />,
    variant: "warning",
  },
  "403": {
    title: "Access Denied",
    defaultMessage: "You don't have permission to access this resource.",
    icon: <Ban />,
    variant: "warning",
  },
  "404": {
    title: "Resource Not Found",
    defaultMessage: "The requested resource could not be found.",
    icon: <AlertCircle />,
    variant: "info",
  },
  "500": {
    title: "Server Error",
    defaultMessage: "An unexpected server error occurred. Please try again later.",
    icon: <AlertTriangle />,
    variant: "error",
  },
  network: {
    title: "Network Error",
    defaultMessage: "Unable to connect to the server. Please check your internet connection.",
    icon: <CloudOff />,
    variant: "warning",
  },
  data: {
    title: "Data Loading Failed",
    defaultMessage: "Failed to load the required data. Please try again.",
    icon: <RefreshCw />,
    variant: "error",
  },
  default: {
    title: "An Error Occurred",
    defaultMessage: "Something went wrong. Please try again or contact support.",
    icon: <AlertCircle />,
    variant: "error",
  },
};

export function ErrorModal({
  isOpen,
  onClose,
  onRetry,
  errorMessage,
  errorCode = "default",
  errorDetails,
  hideDetails = false,
  showIcon = true,
  cancelText = "Go Back",
  retryText = "Try Again",
  isRetrying = false,
  fallbackAction,
  fallbackActionText,
  disableAnimation = false,
}: ErrorModalProps) {
  // Convert numeric codes to string
  const errorCodeString = errorCode?.toString() || "default";

  // Get the appropriate error configuration or fall back to default
  const errorConfig = ERROR_MAPPINGS[errorCodeString] || ERROR_MAPPINGS.default;

  // Compose the description with main error message and optional details
  let descriptionContent = errorMessage || errorConfig.defaultMessage;

  // Add error details if they exist and aren't hidden
  if (errorDetails && !hideDetails) {
    descriptionContent += `\n\n${errorDetails}`;
  }

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onRetry || fallbackAction || onClose}
      title={errorConfig.title}
      description={descriptionContent}
      cancelText={cancelText}
      confirmText={onRetry ? retryText : fallbackActionText || "OK"}
      variant={errorConfig.variant}
      icon={showIcon ? errorConfig.icon : undefined}
      isLoading={isRetrying}
      disableAnimation={disableAnimation}
      // If no retry function is provided, hide the cancel button
      itemDetail={
        !onRetry && !fallbackAction
          ? {
              label: "Error Code",
              value: errorCodeString !== "default" ? errorCodeString : "Unknown",
            }
          : undefined
      }
    />
  );
}
