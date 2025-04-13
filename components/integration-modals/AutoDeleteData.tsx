"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface AutoDeleteDataProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AutoDeleteData({ isOpen, onClose }: AutoDeleteDataProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = "Auto delete data";
    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95, 
      transition: { 
        duration: 0.3, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.98, 
      transition: { 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      } 
    }
  };

  // Animation variants for individual content items
  const contentItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      } 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Modal */}
          <motion.div 
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[95%] sm:w-[90%] md:max-w-3xl overflow-hidden border border-gray-200 dark:border-gray-700"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <h2 
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"
                >
                  <Shield className="text-blue-500" size={20} />
                  Auto delete data
                </h2>
                <motion.button 
                  onClick={onClose}
                  className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </motion.button>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                <motion.div 
                  className="p-6"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div 
                    variants={contentVariants}
                    className="space-y-6 mt-4"
                  >
                    <motion.section 
                      variants={contentItemVariants}
                      className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-6 border border-gray-100 dark:border-gray-700"
                    >
                      <motion.div 
                        variants={contentItemVariants}
                        className="flex items-start gap-4 mb-6"
                      >
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                          <Clock className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <div>
                         
                          <p className="text-gray-700 dark:text-gray-300">
                            You can configure the number of days after which the data gets automatically purged with DIRO being the processor after processing is complete for each verification button.
                          </p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        variants={contentItemVariants}
                        className="ml-12 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <p className="font-medium text-gray-900 dark:text-white">Configuration path</p>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 ml-4 p-2 bg-gray-50 dark:bg-gray-900/50 rounded border-l-2 border-blue-500">
                          Button setting ➜ Privacy ➜ Enable auto deletion
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        variants={contentItemVariants}
                        className="flex items-start gap-4"
                      >
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                          <AlertTriangle className="text-amber-600 dark:text-amber-400" size={24} />
                        </div>
                        <div>
                         
                          <p className="text-gray-700 dark:text-gray-300">
                            DIRO deletes the encryption token and therefore even the backup data can not be decrypted.
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                            Default setting is off. Enable this feature for enhanced data privacy.
                          </p>
                        </div>
                      </motion.div>
                    </motion.section>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 