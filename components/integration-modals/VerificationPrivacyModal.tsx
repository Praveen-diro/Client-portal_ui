"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Shield } from "lucide-react";
import Link from "next/link";

interface VerificationPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationPrivacyModal({ isOpen, onClose }: VerificationPrivacyModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = "Set verification fields and privacy";
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
                  Set verification fields and privacy
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
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
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
                          <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Privacy Settings
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            Configure privacy settings and verification fields to control what data is retained and how it's processed.
                          </p>
                          <div className="mt-4">
                            <Link 
                              href="/client/validation-buttons" 
                              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <span className="mr-2">-</span>
                              <span>Left panel &#10140; Verification buttons &#10140; Button settings &#10140; Privacy</span>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        variants={contentItemVariants}
                        className="ml-12 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <p className="font-medium text-gray-900 dark:text-white">Basic Privacy Options</p>
                        </div>
                        <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                          <li>Enable auto deletion (default 7 days) &#10140; On / Off</li>
                          <li>Share only JSON (do not generate PDF) &#10140; On / Off</li>
                        </ul>
                      </motion.div>
                    </motion.section>
                    
                    <motion.section 
                      variants={contentItemVariants}
                      className="rounded-lg bg-white dark:bg-gray-800 p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Verification fields - you are required to setup verification fields for
                      </h4>
                      <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>
                          Privacy messaging to end-customers regarding what data is going to be
                          retained.
                        </li>
                        <li>
                          This is critical before advanced privacy can be turned on. The fields
                          need to be mapped to the dictionary fields for the PDF to JSON to work
                          properly.
                        </li>
                        <ul className="ml-4 mt-2 space-y-2">
                          <li>Select field label names</li>
                          <li>Type; text, trackid, date</li>
                          <li>Sample text (Hint for data entry in form)</li>
                          <li>
                            Tag (address, account no, name, date, entity, transaction, contact)
                          </li>
                        </ul>
                      </ul>
                    </motion.section>
                    
                    <motion.section 
                      variants={contentItemVariants}
                      className="rounded-lg bg-white dark:bg-gray-800 p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        - Triggers & emails
                      </h4>
                      <Link 
                        href="/client/validation-buttons" 
                        className="mb-3 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>&#10140; Left panel &#10140; Verification buttons &#10140; Button settings &#10140; Triggers & emails</span>
                      </Link>
                      
                      <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Invitation email template</li>
                        <li>Triggers</li>
                        <ul className="ml-4 mt-2 space-y-2">
                          <li>Email</li>
                          <ul className="ml-4 mt-2">
                            <li>Include pdf &#10140; On / Off</li>
                          </ul>
                          <li>Enable engagement callback &#10140; On / Off</li>
                          <li>Auto JSON &#10140; On / Off</li>
                          <li>Override default callback url</li>
                          <li>Add google sheet URL &#10140; On / Off</li>
                          <li>Integration with Zapier</li>
                        </ul>
                        <li>Redirection</li>
                        <ul className="ml-4 mt-2 space-y-2">
                          <li>Redirect url</li>
                          <ul className="ml-4 mt-2 space-y-2">
                            <li>Redirect URL is the website where user wants to redirect after successful submission of document.</li>
                            <li>When configuring redirect url user can add fields of type trackid in URL at end.</li>
                            <li>Example:</li>
                            <ul className="ml-4 mt-2 space-y-2">
                              <li>
                                Redirect website is <a href="https://diro.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://www.diro.io</a> and we have a field named docid as type of trackid.
                              </li>
                              <li>
                                Final redirect url will be <a href="https://diro.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://www.diro.io</a>{"<docid>"}.
                                docid is name of the field setup in verification field as trackid.
                              </li>
                              <li>
                                {"<docid>"} will be replaced with the value of trackid in verification link.
                              </li>
                            </ul>
                          </ul>
                          <li>Redirect message</li>
                        </ul>
                        <li>Email SMTP setup</li>
                        <li>Customer Reminders - you may send reminder emails via DIRO.</li>
                      </ul>
                    </motion.section>
                    
                    <motion.section 
                      variants={contentItemVariants}
                      className="rounded-lg bg-white dark:bg-gray-800 p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        - Display
                      </h4>
                      <Link 
                        href="/client/validation-buttons" 
                        className="mb-3 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>Left panel &#10140; Verification buttons &#10140; Button settings &#10140; Display</span>
                      </Link>
                      
                      <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>
                          Invite link expiry (only works when using API to generate verification
                          link per session)
                        </li>
                        <li>Show preference for desktop on mobile devices</li>
                        <li>Guide screen</li>
                        <ul className="ml-4 mt-2 space-y-2">
                          <li>Login text</li>
                          <li>Instruction text</li>
                        </ul>
                        <li>Exit screen</li>
                        <ul className="ml-4 mt-2 space-y-2">
                          <li>On success</li>
                          <li>On failure</li>
                        </ul>
                        <li>Override Organization details</li>
                        <ul className="ml-4 mt-2 space-y-2">
                          <li>Organization name</li>
                          <li>Organization logo</li>
                        </ul>
                      </ul>
                    </motion.section>
                    
                    <motion.section 
                      variants={contentItemVariants}
                      className="rounded-lg bg-white dark:bg-gray-800 p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        - Rejection
                      </h4>
                      <Link 
                        href="/client/validation-buttons" 
                        className="mb-3 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>Left panel &#10140; Verification buttons &#10140; Button settings &#10140; Rejection</span>
                      </Link>
                      
                      <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Reasons for rejection for documents received</li>
                      </ul>
                    </motion.section>
                    
                    <motion.section 
                      variants={contentItemVariants}
                      className="rounded-lg bg-white dark:bg-gray-800 p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        - Others
                      </h4>
                      <Link 
                        href="/client/validation-buttons" 
                        className="mb-3 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>Left panel &#10140; Verification buttons &#10140; Button settings &#10140; Others</span>
                      </Link>
                      
                      <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Force local proxy based on end-customer device</li>
                        <ul className="ml-4 mt-2 space-y-2">
                          <li>USA only (default)</li>
                          <li>Use local country</li>
                        </ul>
                      </ul>
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
