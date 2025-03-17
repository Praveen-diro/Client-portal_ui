import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings } from "lucide-react";
import Link from "next/link";

interface AdvanceConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvanceConfig: React.FC<AdvanceConfigProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = isOpen ? "Advanced Configurations" : document.title;
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
                  <Settings className="text-blue-500" size={20} />
                  Advanced Configurations
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
                  <motion.div 
                    variants={contentVariants}
                    className="space-y-6"
                  >
                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        Verification progress status - Instant Window.postMessage()
                      </h4>
                      <p className="mb-3 text-gray-700 dark:text-gray-300">
                        <b>
                          Receive status via Post message in iframe - when the link is
                          opened as an Iframe.
                        </b>
                      </p>
                      <ul className="ml-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>
                          Add event listener for the message event in the parent window to
                          listen for messages from the <br />iframe for progress status
                          as 'Opened link', 'Verifying', 'Submitted'
                          <ul className="ml-6 mt-1 space-y-1">
                            <li>
                              Example - {"{"}sessionid: "IN-OaBTRQ", buttonid:
                              "O.IN-X16BzE-xPg",progress_status:"Started"{"}"}
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </motion.section>

                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <p className="mb-3 text-gray-700 dark:text-gray-300">
                        The window.postMessage() method is used in JavaScript to enable
                        cross-origin communication between Window objects. It is a security
                        feature that allows you to safely enable cross-origin communication
                        between different windows or iframes.
                      </p>
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                        <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                          {"// Sending a message from one window/iframe"}
                        </p>
                        <code className="block text-sm text-blue-600 dark:text-blue-400 mb-2">
                          var message = {"{"} sessionid:"IN-TEST12",buttonid:
                          "test.button",progress_status: "Submitted",sender: "capture"{"}"};
                        </code>
                        <code className="block text-sm text-blue-600 dark:text-blue-400">
                          window.top.postMessage(message, "*");
                        </code>
                      </div>
                    </motion.section>

                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <p className="mb-2 text-gray-700 dark:text-gray-300 font-medium">
                        progress_status where the user progressed during the verification
                        process.
                      </p>
                      <p className="mb-2 text-gray-700 dark:text-gray-300">The values will be: </p>
                      <ul className="ml-6 mb-4 space-y-1 text-gray-700 dark:text-gray-300">
                        <li>#Started,</li>
                        <li>#Selected source link,</li>
                        <li>#Opened link,</li>
                        <li>#Saw preview,</li>
                        <li>#Tried to find info / Tried help,</li>
                        <li>#Canceled preview,</li>
                        <li>#Tried download,</li>
                        <li>#Verifying,</li>
                        <li>#Submitted </li>
                      </ul>
                    </motion.section>

                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                        <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                          {"// Receiving the message in another window/iframe"}
                        </p>
                        <code className="block text-sm text-blue-600 dark:text-blue-400">
                          window.addEventListener{"("}"message", event &#10140; {"{"}if
                          (event.data.sessionid) {"{ }}"}
                        </code>
                      </div>
                      <p className="mb-3 text-gray-700 dark:text-gray-300">
                        In this example, the parent window sends a message to the iframe,
                        and the iframe listens for messages using the
                        `window.addEventListener` method. The `event.origin` property is
                        used to ensure that the message is coming from an expected source to
                        prevent unauthorized communication.
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        It's important to note that while `postMessage` is a powerful tool
                        for communication between windows and frames, it should be used
                        carefully and with security considerations in mind, as improper
                        usage can introduce vulnerabilities in your web application.
                      </p>
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
};

export default AdvanceConfig;
