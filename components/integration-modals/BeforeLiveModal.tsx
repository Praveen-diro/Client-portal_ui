"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, ExternalLink, Link as LinkIcon, FileCheck, Settings, Bell, FileText, CreditCard, Copy, CheckSquare } from "lucide-react";
import Link from "next/link";

interface BeforeLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BeforeLiveModal({ isOpen, onClose }: BeforeLiveModalProps) {
  const [activeTab, setActiveTab] = useState<'testing' | 'production'>('testing');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = isOpen ? "Before You Go Live" : document.title;
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

  // Animation variants for tab content
  const tabContentVariants = {
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
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[95%] sm:w-[90%] md:max-w-3xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="max-h-[90vh] flex flex-col">
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <CheckSquare className="mr-2 text-blue-600 dark:text-blue-400" size={24} />
                  Before you go live
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 sticky top-[84px] z-[5]">
                <nav className="flex px-6">
                  <button
                    onClick={() => setActiveTab('testing')}
                    className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors flex items-center ${
                      activeTab === 'testing'
                        ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <FileCheck size={16} className="mr-2" />
                    Testing
                  </button>
                  <button
                    onClick={() => setActiveTab('production')}
                    className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors flex items-center ${
                      activeTab === 'production'
                        ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Settings size={16} className="mr-2" />
                    Going live
                  </button>
                </nav>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'testing' && (
                      <motion.div
                        key="testing-tab"
                        variants={tabContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                      >
                        <motion.section
                          variants={contentItemVariants}
                          className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <LinkIcon size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                            Copy verification link [+ add tracking ID (optional)]
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            Go to Left navigation bar → Verification buttons → "Copy Link".
                            You can use this link to send a request to your customer in an email (ideally as hyperlink) or chat message.
                          </p>
                          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                              Sample verification link:
                            </p>
                            <div className="flex items-center justify-between">
                              <code className="text-sm text-blue-600 dark:text-blue-400 break-all">
                                https://diro.io/verification?buttonid=597-xx-xxx-x-c&trackid=anything
                              </code>
                              <button className="ml-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <Copy size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.section>

                        <motion.section
                          variants={contentItemVariants}
                          className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <CheckSquare size={18} className="mr-2 text-green-600 dark:text-green-400" />
                            Please check
                          </h3>
                          <ul className="ml-6 space-y-3">
                            <li className="flex items-start text-gray-700 dark:text-gray-300">
                              <CheckCircle size={16} className="mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                              Your logo is displayed correctly.
                            </li>
                            <li className="flex items-start text-gray-700 dark:text-gray-300">
                              <CheckCircle size={16} className="mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                              Your privacy settings are working.
                            </li>
                            <li className="flex items-start text-gray-700 dark:text-gray-300">
                              <CheckCircle size={16} className="mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                              You are getting the appropriate email alerts.
                            </li>
                            <li className="flex items-start text-gray-700 dark:text-gray-300">
                              <CheckCircle size={16} className="mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                              You received the submitted document.
                            </li>
                          </ul>
                        </motion.section>
                      </motion.div>
                    )}

                    {activeTab === 'production' && (
                      <motion.div
                        key="production-tab"
                        variants={tabContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                      >
                        <motion.section
                          variants={contentItemVariants}
                          className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">You need to:</h3>
                          <ul className="space-y-4">
                            <li className="flex items-start">
                              <div className="mt-1 mr-3 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="text-green-600 dark:text-green-400 font-medium text-sm">1</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">
                                Activate the production account by adding a billing address.
                              </p>
                            </li>
                            <li className="flex items-start">
                              <div className="mt-1 mr-3 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="text-green-600 dark:text-green-400 font-medium text-sm">2</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">
                                Create similar verification buttons in production.
                              </p>
                            </li>
                            <li className="flex items-start">
                              <div className="mt-1 mr-3 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="text-green-600 dark:text-green-400 font-medium text-sm">3</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">
                                The URLs of the verification buttons need to be changed and need to point to the production buttons inside the landing page.
                              </p>
                            </li>
                            <li className="flex items-start">
                              <div className="mt-1 mr-3 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="text-green-600 dark:text-green-400 font-medium text-sm">4</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">
                                You can choose a billing plan as per your anticipated volume. You can easily purchase credits from our billing dashboard.
                              </p>
                            </li>
                          </ul>
                        </motion.section>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}