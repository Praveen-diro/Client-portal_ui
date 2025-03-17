import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image } from "lucide-react";
import Link from "next/link";

interface SetLogoProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetLogo: React.FC<SetLogoProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
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
                  <Image className="text-blue-500" size={20} />
                  Set logo
                </h2>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
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
                  <motion.div variants={contentItemVariants}>
                    <Link 
                      href="/client/manage-account/organizations-details" 
                      className="mb-6 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span className="mr-2">-</span>
                      <span>Manage account &#10140; Organization details</span>
                    </Link>
                  </motion.div>
                  
                  <div className="space-y-6 mt-4">
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
                  </div>
                  
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SetLogo;
