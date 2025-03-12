"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface SetupWebhookProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupWebhook({ isOpen, onClose }: SetupWebhookProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
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
          <motion.div 
            className={isMaximized ? "hidden" : "fixed inset-0 bg-black/60 backdrop-blur-sm"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
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
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h2 
                  id="modal-title"
                  className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
                >
                  Setup webhook (Callback URL)
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleMaximize}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isMaximized ? "Restore Window" : "Maximize Window"}
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
                    aria-label="Close Modal"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className={`p-6 ${isMaximized ? 'max-w-4xl mx-auto' : ''}`}>
                  <motion.div 
                    className="space-y-6"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.ul variants={contentVariants} className="ml-4 space-y-4">
                      <motion.li variants={contentItemVariants} className="flex items-start" aria-label="Default Webhook Configuration">
                        <article className="flex items-start">
                          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mt-2 mr-3"></div>
                          <div>
                            <span className="font-medium">Default webhook</span> URL can be configured for the entire organization.
                            <ul className="ml-5 mt-2 space-y-2">
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Go to developers (Left vertical nav bar) → Callback logs → Click on settings icon (Top-right).</span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Please enter the URL at which you wish to receive the webhook. This will be used as default for all verification types in the organization. You may test if the URL is working.</span>
                              </li>
                            </ul>
                          </div>
                        </article>
                      </motion.li>
                      
                      <motion.li variants={contentItemVariants} className="flex items-start" aria-label="Setup URL Override">
                        <article className="flex items-start">
                          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mt-2 mr-3"></div>
                          <div>
                            <span className="font-medium">Setup URL override</span> - The webhook URL can also be set up per button under button settings as an override.
                            <ul className="ml-5 mt-2 space-y-2">
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Please go to verification buttons on the left vertical bar, click on the settings icon of the respective button, then go to "After verification" section and update the value against the label "Override default callback URL".</span>
                              </li>
                            </ul>
                          </div>
                        </article>
                      </motion.li>
                    </motion.ul>
                    
                    <motion.div variants={contentVariants} className="mt-8 space-y-6">
                      <motion.div variants={contentItemVariants}>
                        <p className="text-blue-600 dark:text-blue-400 font-medium text-lg mb-4">
                          Notification 1 - Engagement status (Final)
                        </p>
                        <div className="ml-4 mb-3">
                          This is triggered once a verification session begins or completes. Navigate to see the callback responses → <Link href="/client/developers/api-reference#no-code-integration" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Get-verification-link → Callbacks → Engagement status
                          </Link>
                        </div>
                        
                        <div className="ml-4 mt-4">
                          <ol className="list-decimal ml-4 space-y-2">
                            <li>Started</li>
                            <li>Tried upload</li>
                            <li>Document already verified</li>
                            <li>Live feedback</li>
                            <li>Tamper check</li>
                            <li>Uploaded document not supported</li>
                            <li>Verification started</li>
                            <li>Done, now in review</li>
                            <li>Upload error (Reason for exit)</li>
                            <li>User exit - (Reason for exit)
                              <div className="ml-4 mt-1">10.a Abandon</div>
                            </li>
                            <li>JSON requested</li>
                            <li>JSON ready</li>
                            <li>Done</li>
                          </ol>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={contentItemVariants} className="mt-8">
                        <p className="text-blue-600 dark:text-blue-400 font-medium text-lg mb-4">
                          Notification 2 - Document submitted
                        </p>
                        <div className="ml-4">
                          This is triggered when a document is submitted. Navigate to see the callback responses → <Link href="/client/developers/api-reference#no-code-integration" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Get-verification-link → Callbacks → Document upload
                          </Link>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={contentItemVariants} className="mt-8">
                        <p className="text-blue-600 dark:text-blue-400 font-medium text-lg mb-4">
                          Notification 3 - Interim / Final JSON
                        </p>
                        <div className="ml-4">
                          This is triggered when automatic extraction is enabled or requested via the API. Navigate to see the callback responses → <Link href="/client/developers/api-reference#no-code-integration" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Pdf-to-json → Callbacks → JSON success / Combine JSON (Multi-download)
                          </Link>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={contentItemVariants} className="mt-8">
                        <p className="text-blue-600 dark:text-blue-400 font-medium text-lg mb-4">
                          Notification 4 - JSON-failure
                        </p>
                        <div className="ml-4">
                          This is triggered when the submitted document is not correct for JSON processing. Navigate to see the callback responses → <Link href="/client/developers/api-reference#no-code-integration" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Pdf-to-json → Callbacks → JSON failure
                          </Link>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 