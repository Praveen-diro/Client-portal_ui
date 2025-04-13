"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, CheckSquare, Settings, ChevronRight, AlertTriangle, 
  ListCheck, ToggleLeft, Camera, Download, Eye,
  AlertCircle, CheckCircle2, ExternalLink, Layers
} from "lucide-react";
import Link from "next/link";

interface SetupVerificationButtonProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupVerificationButton({ isOpen, onClose }: SetupVerificationButtonProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = "Setup Verification Button";
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
  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95, 
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } 
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
    }
  };

  // Animation variants for individual content items
  const contentItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: "easeOut" } 
    }
  };

  const handleSectionHover = (index: number | null) => {
    setActiveSection(index);
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
              <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-cyan-50 to-white dark:from-cyan-900/20 dark:to-gray-800 backdrop-blur-sm">
                <h2 
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"
                >
                  <div className="bg-cyan-100 dark:bg-cyan-900/50 p-2 rounded-lg">
                    <CheckSquare className="text-cyan-500 dark:text-cyan-400" size={20} />
                  </div>
                  Setup Verification Button
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
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800">
                <motion.div 
                  className="p-6"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link 
                    href="/client/validation-buttons" 
                    className="mb-6 inline-flex items-center px-4 py-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-all"
                  >
                    <Settings size={16} className="mr-2" />
                    <span>Manage Verification Buttons</span>
                    <ChevronRight size={16} className="ml-1" />
                  </Link>

                  <motion.div variants={contentVariants} className="space-y-6 mt-2">
                    <motion.section 
                      variants={contentItemVariants} 
                      className={`bg-gradient-to-r ${activeSection === 0 ? 'from-amber-50 to-white' : 'from-white to-white'} dark:from-gray-800/60 dark:to-gray-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300`}
                      onMouseEnter={() => handleSectionHover(0)}
                      onMouseLeave={() => handleSectionHover(null)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                            <AlertCircle className="text-amber-500 dark:text-amber-400" size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Enable Test Mode
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            It will allow you to do everything without any limitations. The only limitation is that 
                            the verification screens will show "This is for testing only" (on many end-user screens). 
                            Only the users remain common and the rest of the account is completely independent. 
                            Once done, you will have to repeat all setup for the production account.
                          </p>
                          
                          <div className="mt-4 bg-white/70 dark:bg-gray-800/40 rounded-lg p-4 border border-amber-100 dark:border-amber-900/20">
                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                              <AlertTriangle size={16} className="text-amber-500 dark:text-amber-400 mr-2" />
                              <span>Remember to:</span>
                            </h5>
                            <ul className="grid gap-2 ml-6">
                              <li className="flex items-start text-gray-700 dark:text-gray-300">
                                <CheckCircle2 size={16} className="text-cyan-500 dark:text-cyan-400 mr-2 mt-0.5 shrink-0" />
                                <span>Recreate / reconfigure the buttons</span>
                              </li>
                              <li className="flex items-start text-gray-700 dark:text-gray-300">
                                <CheckCircle2 size={16} className="text-cyan-500 dark:text-cyan-400 mr-2 mt-0.5 shrink-0" />
                                <span>Replace any button links with production links</span>
                              </li>
                              <li className="flex items-start text-gray-700 dark:text-gray-300">
                                <CheckCircle2 size={16} className="text-cyan-500 dark:text-cyan-400 mr-2 mt-0.5 shrink-0" />
                                <span>Replace test API keys with production keys</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.section>
                    
                    <motion.section 
                      variants={contentItemVariants} 
                      className={`bg-gradient-to-r ${activeSection === 1 ? 'from-cyan-50 to-white' : 'from-white to-white'} dark:from-gray-800/60 dark:to-gray-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300`}
                      onMouseEnter={() => handleSectionHover(1)}
                      onMouseLeave={() => handleSectionHover(null)}
                      id="use-default-button"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-lg">
                            <ListCheck className="text-cyan-500 dark:text-cyan-400" size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Use Default Button or Create a New Button
                          </h4>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            Configure button settings by navigating to:
                          </p>
                          
                          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center">
                            <ExternalLink size={16} className="text-cyan-500 dark:text-cyan-400 mr-2 shrink-0" />
                            <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                              Left panel → Verification buttons → Button settings → Basic
                            </p>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                            for the respective button
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <div className="bg-white dark:bg-gray-800/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                <Layers className="text-cyan-500 dark:text-cyan-400 mr-2" size={18} />
                                Select Verification Category
                              </h5>
                              <ul className="grid grid-cols-2 gap-2">
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                  <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full mr-2"></span>
                                  Bank
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                  <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full mr-2"></span>
                                  Address
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                  <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full mr-2"></span>
                                  Identity
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                  <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full mr-2"></span>
                                  Professional
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                  <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full mr-2"></span>
                                  Organization
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                  <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full mr-2"></span>
                                  Crypto
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                  <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full mr-2"></span>
                                  Other
                                </li>
                              </ul>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="bg-white dark:bg-gray-800/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                  <Camera className="text-cyan-500 dark:text-cyan-400 mr-2" size={18} />
                                  Select Verification Method
                                </h5>
                                <ul className="space-y-2">
                                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <Download size={14} className="text-cyan-500 dark:text-cyan-400 mr-2" />
                                    Download only
                                  </li>
                                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <Camera size={14} className="text-cyan-500 dark:text-cyan-400 mr-2" />
                                    Capture screenshot only
                                  </li>
                                </ul>
                              </div>
                              
                              <div className="bg-white dark:bg-gray-800/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                  <Eye className="text-cyan-500 dark:text-cyan-400 mr-2" size={18} />
                                  Show Preview
                                </h5>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                  Enable option to preview documents before submission
                                </p>
                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                  <ToggleLeft size={14} className="text-cyan-500 dark:text-cyan-400 mr-2" />
                                  On / Off
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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