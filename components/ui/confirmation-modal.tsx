"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Check, Trash2, User, Loader2 } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

export interface ConfirmationModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Function to call when the modal is closed without confirmation
   */
  onClose: () => void;
  /**
   * Function to call when the action is confirmed
   */
  onConfirm: () => void;
  /**
   * Title of the confirmation modal
   */
  title?: string;
  /**
   * Custom icon to display, defaults to User icon
   */
  icon?: ReactNode;
  /**
   * Description text explaining the action
   */
  description?: string;
  /**
   * Text to show on the cancel button
   */
  cancelText?: string;
  /**
   * Text to show on the confirm button
   */
  confirmText?: string;
  /**
   * Item details to display
   */
  itemDetail?: {
    label: string;
    value: string;
  };
  /**
   * Type of confirmation - affects the color scheme
   */
  variant?: "delete" | "warning" | "info";
  /**
   * Whether the confirmation action is currently loading
   */
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  icon,
  description = "Are you sure you want to perform this action? This cannot be undone.",
  cancelText = "Cancel",
  confirmText = "Confirm",
  itemDetail,
  variant = "delete",
  isLoading = false,
}: ConfirmationModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [backdropVisible, setBackdropVisible] = useState(false);

  // Handle backdrop visibility
  useEffect(() => {
    if (isOpen) {
      // Set backdrop visible immediately when modal opens
      setBackdropVisible(true);
    } else {
      // Delay hiding backdrop to allow exit animations to complete
      const timer = setTimeout(() => {
        setBackdropVisible(false);
      }, 300); // Match this to exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Determine colors based on variant
  const getColors = () => {
    switch (variant) {
      case "delete":
        return {
          gradientFrom: "from-red-500 via-red-600 to-rose-600",
          gradientDark: "dark:from-red-700 dark:via-red-600 dark:to-rose-700",
          iconColor: "text-red-500 dark:text-red-400",
          buttonGradient: "from-red-500 via-red-600 to-rose-600 dark:from-red-600 dark:via-red-700 dark:to-rose-700",
          backgroundGradient:
            "from-red-500/10 via-pink-500/10 to-purple-500/10 dark:from-red-900/20 dark:via-pink-900/20 dark:to-purple-900/20",
          ring: "focus:ring-red-500",
        };
      case "warning":
        return {
          gradientFrom: "from-amber-500 via-amber-600 to-orange-600",
          gradientDark: "dark:from-amber-700 dark:via-amber-600 dark:to-orange-700",
          iconColor: "text-amber-500 dark:text-amber-400",
          buttonGradient: "from-amber-500 via-amber-600 to-orange-600 dark:from-amber-600 dark:via-amber-700 dark:to-orange-700",
          backgroundGradient:
            "from-amber-500/10 via-orange-500/10 to-yellow-500/10 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20",
          ring: "focus:ring-amber-500",
        };
      case "info":
        return {
          gradientFrom: "from-blue-500 via-blue-600 to-indigo-600",
          gradientDark: "dark:from-blue-700 dark:via-blue-600 dark:to-indigo-700",
          iconColor: "text-blue-500 dark:text-blue-400",
          buttonGradient: "from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700",
          backgroundGradient:
            "from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20",
          ring: "focus:ring-blue-500",
        };
      default:
        return {
          gradientFrom: "from-red-500 via-red-600 to-rose-600",
          gradientDark: "dark:from-red-700 dark:via-red-600 dark:to-rose-700",
          iconColor: "text-red-500 dark:text-red-400",
          buttonGradient: "from-red-500 via-red-600 to-rose-600 dark:from-red-600 dark:via-red-700 dark:to-rose-700",
          backgroundGradient:
            "from-red-500/10 via-pink-500/10 to-purple-500/10 dark:from-red-900/20 dark:via-pink-900/20 dark:to-purple-900/20",
          ring: "focus:ring-red-500",
        };
    }
  };

  const colors = getColors();

  const handleConfirm = () => {
    // Don't do anything if already loading
    if (isLoading) return;

    setIsConfirming(true);
    setTimeout(() => {
      onConfirm();
      setIsConfirming(false);
    }, 300); // Reduced the delay
  };

  // Default icon based on variant
  const getDefaultIcon = () => {
    switch (variant) {
      case "delete":
        return <User className={`h-9 w-9 ${colors.iconColor}`} />;
      case "warning":
        return <AlertTriangle className={`h-9 w-9 ${colors.iconColor}`} />;
      case "info":
        return <AlertTriangle className={`h-9 w-9 ${colors.iconColor}`} />;
      default:
        return <User className={`h-9 w-9 ${colors.iconColor}`} />;
    }
  };

  return (
    <>
      {/* Persistent backdrop that's always in the DOM but only visible when needed */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-100 ${
          backdropVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ margin: 0, padding: 0, height: "100vh", width: "100vw" }}
      />

      {/* Animated modal content */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isLoading) onClose();
            }}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ y: 50, rotateX: -15, opacity: 0 }}
              animate={
                isConfirming
                  ? {
                      rotateY: 180,
                      scale: [1, 1.05, 0.95, 0],
                      transition: { duration: 0.8 },
                    }
                  : {
                      y: 0,
                      rotateX: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        damping: 15,
                        stiffness: 300,
                      },
                    }
              }
              exit={{
                y: 100,
                opacity: 0,
                transition: {
                  type: "spring",
                  damping: 15,
                  stiffness: 300,
                },
              }}
            >
              <div className="overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.backgroundGradient}`} />

                  <div className="relative pt-8 pb-6 px-6 flex flex-col items-center">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientDark} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                        {icon || getDefaultIcon()}
                      </div>
                    </div>

                    <h3 className="mt-5 text-center font-bold text-xl text-gray-900 dark:text-white">
                      {isConfirming ? (variant === "delete" ? "Item deleted!" : "Action confirmed!") : title}
                    </h3>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={`rounded-full p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-center">{description}</p>

                    {itemDetail && (
                      <div className="my-4 p-3 rounded-lg bg-gray-50/70 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/70">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{itemDetail.label}:</span>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[250px]">
                            {itemDetail.value}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: isLoading ? 1 : 1.03 }}
                        whileTap={{ scale: isLoading ? 1 : 0.97 }}
                        onClick={onClose}
                        disabled={isLoading}
                        className={`group px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all shadow-sm ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {cancelText}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: isLoading ? 1 : 1.03 }}
                        whileTap={{ scale: isLoading ? 1 : 0.97 }}
                        onClick={handleConfirm}
                        disabled={isLoading || isConfirming}
                        className={`relative px-4 py-2.5 rounded-xl bg-gradient-to-r ${
                          colors.buttonGradient
                        } text-white font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 ${
                          colors.ring
                        } focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all overflow-hidden ${
                          isLoading ? "opacity-90 cursor-wait" : ""
                        }`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            {variant === "delete" ? "Deleting..." : "Processing..."}
                          </span>
                        ) : isConfirming ? (
                          <span className="flex items-center justify-center">
                            <Check className="h-5 w-5 mr-1" />
                            {variant === "delete" ? "Deleted" : "Confirmed"}
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            {variant === "delete" && <Trash2 className="h-5 w-5 mr-1.5" />}
                            {confirmText}
                          </span>
                        )}

                        <span className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.span
                              key={i}
                              className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-50"
                              initial={{
                                x: "50%",
                                y: "50%",
                                opacity: 0,
                              }}
                              animate={{
                                x: `${50 + Math.random() * 100 - 50}%`,
                                y: `${50 + Math.random() * 100 - 50}%`,
                                opacity: [0, 0.6, 0],
                                scale: [0, 1.5, 0.5, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop",
                                delay: i * 0.1,
                                ease: "easeOut",
                              }}
                            />
                          ))}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
