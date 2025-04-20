import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ConfirmationSingleButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description: string;
  buttonText?: string;
  buttonVariant?: "error" | "success" | "info" | "warning" | "default";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantMap = {
  error: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  info: "bg-blue-600 hover:bg-blue-700 text-white",
  warning: "bg-amber-500 hover:bg-amber-600 text-white",
  default: "bg-gray-700 hover:bg-gray-800 text-white",
};

const ConfirmationSingleButtonModal: React.FC<ConfirmationSingleButtonModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "Close",
  buttonVariant = "default",
  icon,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 relative flex flex-col"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 rounded-full p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {icon && <div className="mx-auto mb-4">{icon}</div>}
            {title && <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">{title}</h3>}
            <div className="text-center text-gray-700 dark:text-gray-300 mb-6">{description}</div>
            {children}
            <div className="flex justify-center mt-2">
              <button
                onClick={onClose}
                className={`px-6 py-2 rounded-lg font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  variantMap[buttonVariant] || variantMap.default
                }`}
                autoFocus
              >
                {buttonText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationSingleButtonModal;
