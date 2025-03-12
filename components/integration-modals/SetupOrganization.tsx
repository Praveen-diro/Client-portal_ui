"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

interface SetupOrganizationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupOrganization({ isOpen, onClose }: SetupOrganizationProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = "Setup Organization";
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
                  Setup organization
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
                  <motion.div variants={contentItemVariants}>
                    <Link 
                      href="/client/manage-account/organizations-details" 
                      className="mb-6 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span className="mr-2">-</span>
                      <span>Manage account &#10140; Organization details</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={contentVariants} className="space-y-6 mt-4">
                    <motion.section variants={contentItemVariants} className="rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Add organization logo
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        As the starting point you need to upload your logo in the organization
                        settings. The system will allow you to crop or remove background during
                        the process. This logo will then display to all the end-users who go
                        through the verification process.
                      </p>
                    </motion.section>
                    
                    <motion.section variants={contentItemVariants} className="rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Add billing address (before going live)
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        You can try all features within the sandbox and complete the
                        integration. Then you need to add a billing address to activate the
                        production. You would also need to select a plan or buy credits.
                      </p>
                    </motion.section>
                    
                    <motion.section variants={contentItemVariants} className="rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Setup user and permissions (optional)
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        You may add additional users and assign roles to provide secure access
                        to various features and restrict access to their own requested
                        documents.
                      </p>
                      
                      <ul className="ml-6 space-y-1 list-disc text-gray-700 dark:text-gray-300">
                        <li>Admin (Complete access and manage users)</li>
                        <li>Developer (Access to API key and token)</li>
                        <li>User (Access to only their own documents)</li>
                        <li>Account (Access to accounts section)</li>
                        <li>Manager (Access to documents of all users)</li>
                      </ul>
                      
                      <p className="mt-3 text-gray-700 dark:text-gray-300">
                        Added user(s) will receive an email from DIRO support with a temporary
                        password and link to reset their password. Please do ask to check the
                        spam folder if email is not received.
                      </p>
                    </motion.section>
                  </motion.div>
                  
                  <motion.div variants={contentItemVariants} className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link 
                      href="/client/manage-account/users" 
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span className="mr-2">-</span>
                      <span>Manage account &#10140; User details</span>
                    </Link>
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