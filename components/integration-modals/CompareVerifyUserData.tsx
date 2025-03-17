"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, CheckCircle2, FileCheck } from "lucide-react";
import Link from "next/link";

interface CompareVerifyUserDataProps {
  isOpen: boolean;
  onClose: () => void;
  buttonId?: string;
  buttons?: Array<{buttonid: string, btndata: {name: string}}>;
}

export default function CompareVerifyUserData({ 
  isOpen, 
  onClose, 
  buttonId = "", 
  buttons = []
}: CompareVerifyUserDataProps) {
  const [selectedButtonId, setSelectedButtonId] = useState(buttonId);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const verificationBaseUrl = "https://diro.io/verification?buttonid=";

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = "Compare & verify user data";
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

  useEffect(() => {
    setSelectedButtonId(buttonId);
  }, [buttonId]);

  const handleButtonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedButtonId(e.target.value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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

  const copyLink = verificationBaseUrl + selectedButtonId + "&trackid=";

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
                  <FileCheck className="text-blue-500" size={20} />
                  Compare & verify user data
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
                  {/* Button Selection */}
                  <motion.div variants={contentItemVariants} className="mb-6 flex flex-wrap items-center gap-4">
                    <label className="font-medium text-gray-700 dark:text-gray-300">Select button:</label>
                    <select
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors cursor-pointer"
                      value={selectedButtonId}
                      onChange={handleButtonChange}
                    >
                      {buttons.map((button, index) => (
                        <option key={index} value={button.buttonid}>
                          {button.btndata.name}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                  
                  {/* Alert for copied */}
                  <AnimatePresence>
                    {copied && (
                      <motion.div 
                        className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-200 flex items-center gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <CheckCircle2 size={16} />
                        <span>Copied to clipboard!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Advanced Features Section */}
                  <motion.div variants={contentVariants} className="space-y-6">
                    <motion.section variants={contentItemVariants}>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Advanced features
                      </h3>
                      
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Compare and verify user data
                        </h4>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          You can enable automatic matching by passing user data for multiple fields inside the no-code link. 
                          DIRO will automatically start returning a matching score along with extracted data inside the PDF-to-JSON results.
                        </p>
                        
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          Copy the link from the verification button and then:
                        </p>
                        
                        <ul className="list-disc pl-5 my-3 text-gray-700 dark:text-gray-300 space-y-1">
                          <li>Add field label as query parameter in no code link.</li>
                          <li>Please do not use tag or dictionary name as query parameter.</li>
                        </ul>
                        
                        <p className="text-gray-700 dark:text-gray-300 font-medium mt-4">
                          For example:
                        </p>
                        
                        <ul className="list-disc pl-5 my-3 text-gray-700 dark:text-gray-300 space-y-3">
                          <li>
                            <p>If field label is firstname:</p>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 text-sm font-mono overflow-x-auto">
                              {`${verificationBaseUrl}${selectedButtonId || "<buttonid>"}&trackid=<trackid>&firstname=<YOUR FIRSTNAME>`}
                            </div>
                          </li>
                          
                          <li>
                            <p>If you have three verification fields: firstname, lastname and zipcode:</p>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 text-sm font-mono overflow-x-auto">
                              {`${verificationBaseUrl}${selectedButtonId || "<buttonid>"}&trackid=<TRACK_ID>&firstname=<YOUR FIRSTNAME>&lastname=<YOUR LASTNAME>&zipcode=<YOUR ZIPCODE>`}
                            </div>
                          </li>
                        </ul>
                        
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                          <p className="text-gray-700 dark:text-gray-300">Your verification link:</p>
                          <div className="flex-1 flex items-center">
                            <code className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded text-sm overflow-x-auto flex-1">
                              {copyLink}
                            </code>
                            <button 
                              onClick={() => copyToClipboard(copyLink)}
                              className="ml-2 p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              aria-label="Copy to clipboard"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mt-4">
                          <strong>Note:</strong> Please follow URL encoding while building no-code URL. Refer <a href="https://session.diro.live/server/#/client/?buttonid=" className="text-blue-600 dark:text-blue-400 hover:underline">HTML URL</a> encoding for proper formatting.
                        </p>
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
