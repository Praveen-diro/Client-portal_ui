"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Maximize, Minimize, Users, Code, FileText } from "lucide-react";

interface SetupUserPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupUserPermissionsModal({ isOpen, onClose }: SetupUserPermissionsModalProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = isOpen ? "Setup User & Permissions" : document.title;
    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

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
        staggerChildren: 0.08,
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

  // Modal variants
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
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={`bg-white dark:bg-gray-800 rounded-xl w-full overflow-hidden shadow-xl transition-all ${
              isMaximized ? 'max-w-[90vw] h-[90vh]' : 'max-w-4xl max-h-[90vh]'
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Users className="mr-2 text-blue-600 dark:text-blue-400" size={22} />
                  Setup user and permissions
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMaximize}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isMaximized ? "Minimize" : "Maximize"}
                  >
                    {isMaximized ? <Minimize size={20} /> : <Maximize size={20} />}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[80vh]">
                <motion.div 
                  className="space-y-8"
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                >
                  <motion.section variants={contentItemVariants}>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <div>
                        <p>
                          You may add additional users and assign roles to provide secure access to various features and restrict access to their own requested documents.
                        </p>
                        <ul className="ml-6 space-y-3 list-disc mt-4">
                          <li><strong className="text-gray-900 dark:text-white">Admin:</strong> Complete access and manage users</li>
                          <li><strong className="text-gray-900 dark:text-white">Developer:</strong> Access to API key and token</li>
                          <li><strong className="text-gray-900 dark:text-white">User:</strong> Access to only their own documents</li>
                          <li><strong className="text-gray-900 dark:text-white">Account:</strong> Access to accounts section</li>
                          <li><strong className="text-gray-900 dark:text-white">Manager:</strong> Access to documents of all users</li>
                        </ul>
                      </div>
                      
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mt-4 border-l-4 border-amber-400 dark:border-amber-500">
                        <p className="text-amber-800 dark:text-amber-300 text-sm">
                          Added user(s) will receive an email from DIRO support with a temporary password and link to reset their password. Please do ask to check the spam folder if email is not received.
                        </p>
                      </div>
                      
                      <motion.a 
                        href="/user-details" 
                        className="flex items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4 gap-3 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                          <FileText className="text-blue-600 dark:text-blue-400" size={18} />
                        </div>
                        <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">
                          Manage account ➜ User details
                        </p>
                      </motion.a>
                    </div>
                  </motion.section>

                  <motion.section variants={contentItemVariants}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Code className="text-blue-600 dark:text-blue-400" size={20} />
                      Make Your Own Landing Page
                    </h3>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <p>
                        Please refer to DIRO sample landing page template for displaying buttons and adding email as the tracking ID - google drive link for source code
                      </p>
                      
                      <motion.a 
                        href="https://client-page.diro.io" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        <span className="underline">Or from the following url: https://client-page.diro.io (sample page)</span>
                      </motion.a>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg mt-4 border border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-bold px-2.5 py-0.5 rounded">REQUIRED</span>
                          You must:
                        </h4>
                        <ul className="space-y-3 ml-4 text-gray-700 dark:text-gray-300">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            Replace the links in <code className="bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-sm">diro_button_links.js</code> (each file has comments)
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            Copy and insert div code <code className="bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-sm">&lt;div class='main-container'&gt;</code> from HTML file
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            The CSS file is optional
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.section>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}