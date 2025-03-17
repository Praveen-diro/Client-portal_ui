"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cable, X, Copy, Check } from "lucide-react";

interface CopyToClipboardButtonProps {
  textToCopy: string;
  className?: string;
}

const CopyToClipboardButton = ({ textToCopy, className = "" }: CopyToClipboardButtonProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button 
      onClick={handleCopy} 
      className={className}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
    </button>
  );
};

interface SetupWebhookProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupWebhook({ isOpen, onClose }: SetupWebhookProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.title = "Setup Webhook";
    document.addEventListener('keydown', handleEscapeKey);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

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
              <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <h2 
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"
                >
                  <Cable className="text-blue-500" size={20} />
                  Setup Webhook
                </h2>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin !scrollbar-w-1.5 scrollbar-thumb-blue-500 dark:scrollbar-thumb-blue-400 scrollbar-track-transparent hover:scrollbar-thumb-blue-600 dark:hover:scrollbar-thumb-blue-300">
                <div className="p-6">
                  <div className="space-y-6">
                    <section className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Default Organization Webhook</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Configure a default webhook URL for the entire organization under Developers ➜ Callback Logs ➜ Settings
                      </p>
                      <div className="flex flex-col space-y-2">
                        <input 
                          type="text" 
                          placeholder="https://your-domain.com/webhook" 
                          className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">URL Override</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Set up per-button webhook URLs under Verification Buttons ➜ Button Settings ➜ After Verification ➜ "Override default callback URL"
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Webhook Notifications</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">1. Engagement Status (Final)</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Triggered when verification session begins/completes
                          </p>
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Started</li>
                              <li>• Tried upload</li>
                              <li>• Document already verified</li>
                              <li>• Live feedback</li>
                              <li>• Tamper check</li>
                              <li>• Uploaded document not supported</li>
                              <li>• Verification started</li>
                              <li>• Done, now in Review</li>
                              <li>• Upload error</li>
                              <li>• User exit</li>
                              <li>• Abandon</li>
                              <li>• JSON requested</li>
                              <li>• JSON ready</li>
                              <li>• Done</li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">2. Document Submitted</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Triggered when a document is submitted
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">3. Interim / Final JSON</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Access via pdf-to-json ➜ callbacks ➜ JSON success / Combine JSON
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">4. JSON Failure</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Triggered when document is incorrect for JSON processing
                          </p>
                        </div>
                      </div>
                    </section>

                    
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}