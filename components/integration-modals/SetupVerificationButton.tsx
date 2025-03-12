"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

interface SetupVerificationButtonProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupVerificationButton({ isOpen, onClose }: SetupVerificationButtonProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = "Setup verification button";
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

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div 
            className={isMaximized ? "hidden" : "fixed inset-0 bg-black/50 backdrop-blur-sm"}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            className={`overflow-hidden ${
              isMaximized 
                ? 'fixed inset-0 p-0 m-0 bg-white dark:bg-gray-800' 
                : 'relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[95%] sm:w-[90%] md:max-w-3xl'
            }`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            ref={modalRef}
          >
            <div className={isMaximized ? "h-screen flex flex-col" : "max-h-[90vh] flex flex-col"}>
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h2 
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-gray-100"
                >
                  Setup verification button
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleMaximize}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isMaximized ? "Restore window" : "Maximize window"}
                  >
                    {isMaximized ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      </svg>
                    )}
                  </button>
                  <button 
                    onClick={onClose}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                <motion.div 
                  className={`p-6 ${isMaximized ? 'max-w-4xl mx-auto' : ''}`}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div variants={contentVariants} className="space-y-6">
                    <motion.section variants={contentItemVariants} className="rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300">
                        <b>Enable the test mode -</b> <br/>
                        It will allow you to do everything without any limitations. The only limitation is that 
                        the verification screens will show "This is for testing only" (on many end-user screens). 
                        Only the users remain common and the rest of the account is completely independent. 
                        Once done, you will have to repeat all setup for the production account.
                      </p>
                      
                      <ul className="ml-6 mt-3 space-y-1 list-disc text-gray-700 dark:text-gray-300">
                        <li>Recreate / reconfigure the buttons.</li>
                        <li>Replace any button links with production links.</li>
                        <li>Replace test API keys with production keys.</li>
                      </ul>
                    </motion.section>
                    
                    <motion.section variants={contentItemVariants} className="rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2" id="use-default-button">
                        Use default button or create a new button (choose category)
                      </h4>
                      
                      <Link 
                        href="/client/validation-buttons" 
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>&#10140; Left panel &#10140; Verification buttons &#10140; Button settings &#10140; Basic</span>
                      </Link>
                      <p className="mt-2 text-gray-700 dark:text-gray-300">
                        for the respective button
                      </p>
                      
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Select verification category</h5>
                        <ul className="ml-6 space-y-1 list-disc text-gray-700 dark:text-gray-300">
                          <li>Bank</li>
                          <li>Address</li>
                          <li>Identity</li>
                          <li>Professional</li>
                          <li>Organization</li>
                          <li>Crypto</li>
                          <li>Other</li>
                        </ul>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Select verification method</h5>
                        <ul className="ml-6 space-y-1 list-disc text-gray-700 dark:text-gray-300">
                          <li>Download only</li>
                          <li>Capture screenshot only</li>
                        </ul>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                          Show preview (enable option to preview documents before submission)
                        </h5>
                        <ul className="ml-6 space-y-1 list-disc text-gray-700 dark:text-gray-300">
                          <li>On / Off</li>
                        </ul>
                      </div>
                    </motion.section>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 