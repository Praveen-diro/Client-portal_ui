"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Maximize, Minimize } from "lucide-react";
import Link from "next/link";

interface CopyLinkProps {
  isOpen: boolean;
  onClose: () => void;
  buttonId?: string;
  verificationLink?: string;
}

export default function CopyLink({ isOpen, onClose, buttonId, verificationLink }: CopyLinkProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
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
                  Copy link
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleMaximize}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isMaximized ? "Restore window" : "Maximize window"}
                  >
                    {isMaximized ? <Minimize size={18} /> : <Maximize size={18} />}
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
                  {copied && (
                    <motion.div 
                      className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      Copied!
                    </motion.div>
                  )}
                  
                  <motion.p variants={contentItemVariants} className="text-gray-700 dark:text-gray-300 mb-4">
                    Each verification button has its own unique verification link. The
                    same verification link can be used for multiple verification
                    sessions for different users but for the same type of verification.
                  </motion.p>
                  
                  <motion.ul variants={contentItemVariants} className="ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-300 mb-4">
                    <li>Shared via email to the end user for verification</li>
                    <li>Inserted into a document without writing a single line of code</li>
                    <li>Used as a button on a website (as an iframe or new window)</li>
                  </motion.ul>
                  
                  <motion.h4 variants={contentItemVariants} className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">
                    Get the verification link via
                  </motion.h4>
                  
                  <motion.ul variants={contentItemVariants} className="ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-300 mb-4">
                    <li>
                      <Link
                        href="/client/validation-buttons"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Left Panel &#10140; verification buttons &#10140; settings
                      </Link>{" "}
                      for the respective button.{" "}
                    </li>
                    <li>Go to "Basic tab &#10140; Verification link" and click copy.</li>
                    <li>
                      Or just use this link (link visible when logged in)
                      <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md flex justify-between items-center">
                        <code className="text-sm break-all">{verificationLink || `verification_link/${buttonId}&trackid=`}</code>
                        <button
                          onClick={() => copyToClipboard(verificationLink || `verification_link/${buttonId}&trackid=`)}
                          className="ml-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </li>
                  </motion.ul>
                  
                  <motion.h4 variants={contentItemVariants} className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2" id="copy-link-use-as-iframe">
                    Copy link (use an Iframe or new window)
                  </motion.h4>
                  
                  <motion.p variants={contentItemVariants} className="text-gray-700 dark:text-gray-300 mb-4">
                    Use the verification links to start a verification session. You may
                    configure the behavior of the link by modifying the button settings
                    for the link.
                  </motion.p>
                  
                  <motion.h5 variants={contentItemVariants} className="font-medium text-gray-900 dark:text-white mb-2">
                    Best practice
                  </motion.h5>
                  
                  <motion.ul variants={contentItemVariants} className="ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-300 mb-4">
                    <li>
                      The link should ideally be placed on your website as a
                      verification button.
                    </li>
                    <li>
                      A customer tracking ID should be added in the end while triggering
                      it.
                    </li>
                    <li>The link should be opened as an Iframe.</li>
                    <ul className="ml-6 mt-2 space-y-2 list-disc text-gray-700 dark:text-gray-300">
                      <li>
                        Add event listener for the message event in the parent window to
                        listen for messages from the iframe for progress status as
                        'Opened link', 'Verifying', 'Submitted'
                        <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                          <code className="text-sm break-all">
                            {"{"}sessionid: "IN-OaBTRQ", buttonid: "O.IN-X16BzE-xPg",
                            progress_status:"Started"{"}"}
                          </code>
                        </div>
                      </li>
                    </ul>
                  </motion.ul>
                  
                  <motion.h4 variants={contentItemVariants} className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2" id="add-customer-refrence-number">
                    Add customer reference number
                  </motion.h4>
                  
                  <motion.p variants={contentItemVariants} className="text-gray-700 dark:text-gray-300 mb-2">
                    A custom tracking id can be added to the link or it can be left
                    empty.
                  </motion.p>
                  
                  <motion.p variants={contentItemVariants} className="text-gray-700 dark:text-gray-300 mb-2">
                    You can add a custom value at the end (in green). For example, your
                    client's id, account number or any identifier. It should preferably
                    be your customer's email address or otherwise any unique identifier
                    to tag/ track a unique verification session.
                  </motion.p>
                  
                  <motion.p variants={contentItemVariants} className="text-gray-700 dark:text-gray-300 mb-2">
                    …instance &trackid=johndoe@johndoe.com
                  </motion.p>
                  
                  <motion.p variants={contentItemVariants} className="text-gray-700 dark:text-gray-300 mb-4">
                    It can be used to deposit verified PDFs via email into your CRM
                    directly (for CRM set up please contact support@diro.io).
                  </motion.p>
                  
                  <motion.ul variants={contentItemVariants} className="ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-300 mb-4">
                    <li>
                      <span className="font-medium">It should be unique</span> per end customer.
                    </li>
                    <li>
                      It can be alphanumeric having a maximum length of 50 characters.
                    </li>
                    <li>
                      Multiple trackid keys can be passed in one verification link
                    </li>
                  </motion.ul>
                  
                  <motion.p variants={contentItemVariants} className="text-gray-700 dark:text-gray-300 mb-2">
                    Setting a custom field as <span className="font-medium">Track ID -</span>
                  </motion.p>
                  
                  <motion.ul variants={contentItemVariants} className="ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-300 mb-4">
                    <li>Searching a record on the portal,</li>
                    <li>
                      Returned in each callbacks for your own easy reference (eliminates
                      the need to map DIRO session-id at your end)
                    </li>
                    <li>
                      Allows common session id to be maintained per customer for
                      multiple verification retries till a document is submitted.
                    </li>
                    <ul className="ml-6 mt-2 space-y-2 list-disc text-gray-700 dark:text-gray-300">
                      <li>
                        eg. - Email, account number, invoice reference number (email is
                        preferred)
                      </li>
                    </ul>
                    <li>
                      It can also be used to create dynamic email IDs for sending out
                      PDFs / data to the CRM like salesforce.
                    </li>
                  </motion.ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
