"use client";
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAppSelector } from "@/app/store/hooks";
import type { RootState } from "@/app/store/store";
import { cn } from "@/lib/utils";
import { FancyToggle } from "@/components/ui/fancy-toggle";
import { authService } from "@/app/services/auth.service";
import { cookies } from "@/app/services/cookie.service";
import { createPortal } from "react-dom";

// Modal component
function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  onCancel,
  type = "confirm",
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: "confirm" | "success";
  isLoading?: boolean;
}) {
  const [backdropVisible, setBackdropVisible] = useState(false);

  // Handle backdrop visibility
  useEffect(() => {
    if (isOpen) {
      setBackdropVisible(true);
    } else {
      const timer = setTimeout(() => {
        setBackdropVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Get colors based on modal type
  const getColors = () => {
    switch (type) {
      case "confirm":
        return {
          gradientFrom: "from-amber-500 via-amber-600 to-orange-600",
          gradientDark: "dark:from-amber-700 dark:via-amber-600 dark:to-orange-700",
          iconColor: "text-amber-500 dark:text-amber-400",
          buttonGradient: "from-amber-500 via-amber-600 to-orange-600",
          backgroundGradient: "from-amber-500/10 via-orange-500/10 to-yellow-500/10",
          confirmBg: "bg-blue-600 hover:bg-blue-700",
          cancelBg: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        };
      case "success":
        return {
          gradientFrom: "from-green-500 via-green-600 to-emerald-600",
          gradientDark: "dark:from-green-700 dark:via-green-600 dark:to-emerald-700",
          iconColor: "text-green-500 dark:text-green-400",
          buttonGradient: "from-green-500 via-green-600 to-emerald-600",
          backgroundGradient: "from-green-500/10 via-emerald-500/10 to-teal-500/10",
          confirmBg: "bg-green-600 hover:bg-green-700",
          cancelBg: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        };
      default:
        return {
          gradientFrom: "from-amber-500 via-amber-600 to-orange-600",
          gradientDark: "dark:from-amber-700 dark:via-amber-600 dark:to-orange-700",
          iconColor: "text-amber-500 dark:text-amber-400",
          buttonGradient: "from-amber-500 via-amber-600 to-orange-600",
          backgroundGradient: "from-amber-500/10 via-orange-500/10 to-yellow-500/10",
          confirmBg: "bg-blue-600 hover:bg-blue-700",
          cancelBg: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        };
    }
  };

  const colors = getColors();

  // Use portal to render at the root level of the document
  const modalContent = isOpen ? (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            backdropVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ margin: 0, padding: 0, height: "100vh", width: "100vw" }}
          onClick={onClose}
        />

        {/* Modal content */}
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
          <motion.div
            className="w-full max-w-md"
            initial={{ y: 50, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                damping: 15,
                stiffness: 300,
              },
            }}
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
                  {/* Icon */}
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientDark} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                      {isLoading ? (
                        <svg
                          className="animate-spin h-10 w-10 text-gray-500"
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
                      ) : type === "confirm" ? (
                        <AlertTriangle className={`h-9 w-9 ${colors.iconColor}`} />
                      ) : (
                        <Check className={`h-9 w-9 ${colors.iconColor}`} />
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 text-center font-bold text-xl text-gray-900 dark:text-white">{title}</h3>

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-3 right-3 rounded-full p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Content */}
                  {children && <div className="mt-2 text-center text-gray-600 dark:text-gray-300">{children}</div>}

                  {/* Buttons */}
                  {type === "confirm" && (
                    <div className="flex justify-center space-x-4 mt-6">
                      <button
                        onClick={onConfirm}
                        className={`px-6 py-2 rounded-lg text-white font-medium transition-transform ${colors.confirmBg} hover:scale-105 active:scale-95`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={onCancel}
                        className={`px-6 py-2 rounded-lg font-medium transition-transform ${colors.cancelBg} hover:scale-105 active:scale-95`}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    </AnimatePresence>
  ) : null;

  // Use createPortal to render at document body level
  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : modalContent;
}

// Define ModeToggle component with ref
export interface ModeToggleRef {
  toggleModal: () => void;
}

export interface ModeToggleProps {
  className?: string;
  onToggleStart?: () => void;
  onToggleEnd?: () => void;
}

export const ModeToggle = forwardRef<ModeToggleRef, ModeToggleProps>(({ className, onToggleStart, onToggleEnd }, ref) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reloadCountdown, setReloadCountdown] = useState(0);
  const AuthReducer = useAppSelector((state: RootState) => state.auth.user);

  // Get current authMode from cookies
  const getAuthMode = () => {
    try {
      const testMode = cookies.get("authMode");
      return testMode === "2";
    } catch (error) {
      console.error("Error getting test mode from cookies:", error);
      return false;
    }
  };

  // Function to toggle the modal - can be called from parent
  const toggleModal = () => {
    setShowConfirmModal(true);
  };

  // Expose the toggleModal method via ref
  useImperativeHandle(ref, () => ({
    toggleModal,
  }));

  // // Function to set API key based on environment
  // const setApiKeyForEnvironment = (isTest: boolean) => {
  //   // Set appropriate API key based on environment
  //   if (isTest) {
  //     cookies.set("apikey", AuthReducer?.sandbox?.apikey);
  //     cookies.set("token", AuthReducer?.sandbox?.accesstoken);
  //   } else {
  //     cookies.set("apikey", AuthReducer?.apikey);
  //     cookies.set("token", AuthReducer?.token);
  //   }
  //   console.log(`API key set for ${isTest ? "test" : "production"} environment`);
  // };

  // Load saved mode from cookies on component mount
  // useEffect(() => {
  //   try {
  //     const isTest = getAuthMode();
  //     // Set API key based on saved mode
  //     setApiKeyForEnvironment(isTest);
  //   } catch (error) {
  //     console.error("Error loading test mode from cookies:", error);
  //   }
  // }, []);

  // Countdown effect for page reload
  useEffect(() => {
    if (reloadCountdown > 0) {
      const timer = setTimeout(() => {
        setReloadCountdown(reloadCountdown - 1);

        if (reloadCountdown === 1) {
          if (onToggleEnd) onToggleEnd();
          window.location.reload();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [reloadCountdown, onToggleEnd]);

  const handleModeSwitch = async (confirmed: boolean) => {
    setShowConfirmModal(false);

    if (confirmed) {
      if (onToggleStart) onToggleStart();
      setIsLoading(true);
      const currentAuthMode = getAuthMode();
      const newMode = currentAuthMode ? "1" : "2";

      // Show success modal immediately with loading state
      setSuccessMessage(`Switching to ${newMode ? "test" : "production"} mode...`);
      try {
        // Save mode to cookies
        cookies.set("authMode", newMode ? "2" : "1");

        // Get email from cookies
        const email = cookies.get("email");

        if (!email) {
          setShowEmailError(true);
          setIsLoading(false);
          if (onToggleEnd) onToggleEnd();
          return;
        }

        // Call switchModeServer to change the server mode with the current authMode
        const response = await authService.switchModeServer({ email, sandbox: currentAuthMode ? "true" : "false" });
        setShowSuccessModal(true);
        console.log("response switchModeServer", response);
        console.log(`Successfully switched to ${newMode ? "test" : "production"} mode on server`);

        // Update success message with simpler text
        setSuccessMessage(`Switched to ${newMode ? "test" : "production"} mode successfully!`);

        // Start countdown for page reload
        setReloadCountdown(3);
        // Force reload after a short delay to ensure new cookies are picked up
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (error) {
        console.error("Error switching mode:", error);
        setSuccessMessage(`Failed to switch mode. Please try again.`);

        // Close error modal after delay
        setTimeout(() => {
          setShowSuccessModal(false);
          if (onToggleEnd) onToggleEnd();
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get current auth mode for rendering
  const isTestMode = getAuthMode();

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Test Mode</span>
        <FancyToggle checked={isTestMode} onChange={toggleModal} disabled={isLoading} className="relative z-10" />
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={`Do you want to switch to ${isTestMode ? "production" : "test"} mode?`}
        onConfirm={() => handleModeSwitch(true)}
        onCancel={() => handleModeSwitch(false)}
        type="confirm"
      >
        <p>Switching modes will reload the page and may change API endpoints and available features.</p>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successMessage}
        type="success"
        isLoading={isLoading}
      ></Modal>

      {/* Email Error Modal */}
      <Modal
        isOpen={showEmailError}
        onClose={() => setShowEmailError(false)}
        title="Cannot switch mode: Email not found"
        type="confirm"
      >
        <p className="text-red-500">Your email is missing from cookies. Please log out and log in again to fix this issue.</p>
      </Modal>
    </div>
  );
});
