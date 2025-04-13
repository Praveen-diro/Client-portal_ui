"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2, Shield, Copy, CheckCircle, MessageSquare, Info, Lock, FileJson, ArrowRightLeft, Code, KeyRound, AlertTriangle } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface HmacSecureCommunicationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HmacSecureCommunication({ isOpen, onClose }: HmacSecureCommunicationProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: string }>({
    payload: "",
    java: "",
    javascript: "",
    response: ""
  });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = isOpen ? "HMAC Secure Communication" : document.title;
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

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyStatus({ ...copyStatus, [key]: "Copied!" });
        setTimeout(() => setCopyStatus({ ...copyStatus, [key]: "" }), 3000);
      },
      () => {
        setCopyStatus({ ...copyStatus, [key]: "Failed to copy!" });
      }
    );
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

  const payloadExample = `{
  "urlStatus": {
    "urlMatch": false,
    "message": "The link will be sent for review.",
    "status": "pending"
  },
  "docid": "IS-fJ534O",
  "trackid": "rishabh014014",
  "type": "final-pdftojson",
  "url": "https://testing99.diro.me/",
  "filename": "IS-fJ534O1733483907250.pdf",
  "status": true
}`;

  const javaCode = `public static boolean verifyHmacSHA256Signature(String payload, String receivedSignature, String secretKey) {
    Mac mac = Mac.getInstance("HmacSHA256");
    SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
    mac.init(keySpec);
    byte[] hmacBytes = mac.doFinal(payload.getBytes());
    String regeneratedSignature = Base64.getEncoder().encodeToString(hmacBytes);
    return regeneratedSignature.equals(receivedSignature);
}`;

  const javascriptCode = `const crypto = require('crypto');
function verifyHmacSHA256Signature(payload, receivedSignature, secretKey) {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('base64') === receivedSignature;
}`;

  const responseExample = `{
  "status": "success",
  "message": "Verification completed successfully",
  "timestamp": "2023-11-15T14:22:33Z",
  "requestId": "req-12345-abcde"
}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm",
            isDark ? "bg-black/80" : "bg-black/80"
          )}
          onClick={onClose}
        >
          <motion.div 
            className={cn(
              "relative rounded-xl shadow-2xl w-[95%] sm:w-[90%] md:max-w-3xl overflow-hidden border-0",
              isDark ? "bg-[#1A1F2C]" : "bg-white"
            )}
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
              <div className={cn(
                "sticky top-0 z-10 flex justify-between items-center p-6 border-b",
                isDark ? "bg-[#1A1F2C] border-gray-700" : "bg-white border-gray-200"
              )}>
                <h2 
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"
                >
                  <Shield className="text-blue-500" size={20} />
                  HMAC Secure Communication
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={onClose}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <motion.div 
                  className={`p-6 ${isMaximized ? 'max-w-4xl mx-auto' : ''}`}
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
                      className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800/40 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Info size={18} className="text-blue-500" />
                        HMAC Key Setup and Verification Guide
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        This document explains how to secure communication between the application
                        and external callback URLs using HMAC signatures, ensuring payload
                        integrity and authenticity.
                      </p>
                    </motion.section>

                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800/40 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Lock size={18} className="text-blue-500" />
                        What Is Secured?
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        The system secures the payload data sent to callback URLs. Each payload
                        includes details like document status, metadata, and more.
                      </p>
                    </motion.section>

                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-lg border border-amber-200 dark:border-amber-800/40 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <FileJson size={18} className="text-blue-500" />
                        Example Payload:
                      </h3>
                      <div className="relative">
                        <pre className="bg-gray-50 dark:bg-gray-900/50 p-4 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                          <code className="text-sm text-gray-800 dark:text-gray-200">{payloadExample}</code>
                        </pre>
                        <button 
                          onClick={() => copyToClipboard(payloadExample, "payload")}
                          className="absolute top-2 right-2 p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Copy code"
                        >
                          {copyStatus.payload ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        {copyStatus.payload && (
                          <span className="absolute top-2 right-12 text-xs text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                            {copyStatus.payload}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-3">
                        The payload is sent along with a cryptographic signature (MessageHash) in
                        HTTP headers to ensure integrity and authenticity.
                      </p>
                    </motion.section>

                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-lg border border-emerald-200 dark:border-emerald-800/40 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <ArrowRightLeft size={18} className="text-blue-500" />
                        Example Response:
                      </h3>
                      <div className="relative">
                        <pre className="bg-gray-50 dark:bg-gray-900/50 p-4 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                          <code className="text-sm text-gray-800 dark:text-gray-200">{responseExample}</code>
                        </pre>
                        <button 
                          onClick={() => copyToClipboard(responseExample, "response")}
                          className="absolute top-2 right-2 p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Copy code"
                        >
                          {copyStatus.response ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        {copyStatus.response && (
                          <span className="absolute top-2 right-12 text-xs text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                            {copyStatus.response}
                          </span>
                        )}
                      </div>
                    </motion.section>

                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg border border-indigo-200 dark:border-indigo-800/40 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Shield size={18} className="text-blue-500" />
                        How to Verify HMAC Signatures
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        To verify the HMAC signature, you need to:
                      </p>
                      <ol className="list-decimal ml-5 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Extract the signature from the <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">MessageHash</code> header</li>
                        <li>Compute the HMAC-SHA256 of the payload using your secret key</li>
                        <li>Compare the computed signature with the received signature</li>
                      </ol>
                    </motion.section>

                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-rose-50 dark:bg-rose-900/20 p-5 rounded-lg border border-rose-200 dark:border-rose-800/40 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Code size={18} className="text-blue-500" />
                        Java Implementation:
                      </h3>
                      <div className="relative">
                        <pre className="bg-gray-50 dark:bg-gray-900/50 p-4 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                          <code className="text-sm text-gray-800 dark:text-gray-200">{javaCode}</code>
                        </pre>
                        <button 
                          onClick={() => copyToClipboard(javaCode, "java")}
                          className="absolute top-2 right-2 p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Copy code"
                        >
                          {copyStatus.java ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        {copyStatus.java && (
                          <span className="absolute top-2 right-12 text-xs text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                            {copyStatus.java}
                          </span>
                        )}
                      </div>
                    </motion.section>

                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded-lg border border-cyan-200 dark:border-cyan-800/40 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Code size={18} className="text-blue-500" />
                        JavaScript Implementation:
                      </h3>
                      <div className="relative">
                        <pre className="bg-gray-50 dark:bg-gray-900/50 p-4 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                          <code className="text-sm text-gray-800 dark:text-gray-200">{javascriptCode}</code>
                        </pre>
                        <button 
                          onClick={() => copyToClipboard(javascriptCode, "javascript")}
                          className="absolute top-2 right-2 p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Copy code"
                        >
                          {copyStatus.javascript ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        {copyStatus.javascript && (
                          <span className="absolute top-2 right-12 text-xs text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                            {copyStatus.javascript}
                          </span>
                        )}
                      </div>
                    </motion.section>

                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-lime-50 dark:bg-lime-900/20 p-5 rounded-lg border border-lime-200 dark:border-lime-800/40 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <KeyRound size={18} className="text-blue-500" />
                        Security Best Practices
                      </h3>
                      <ul className="list-disc ml-5 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Keep your secret key secure and never expose it in client-side code</li>
                        <li>Use HTTPS for all communications</li>
                        <li>Implement proper error handling for signature verification failures</li>
                        <li>Consider implementing timestamp validation to prevent replay attacks</li>
                      </ul>
                    </motion.section>

                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-5 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800/40 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <MessageSquare size={18} className="text-blue-500" />
                        Need Help?
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        If you have any questions or need assistance with implementing HMAC
                        verification, please contact our support team at{" "}
                        <a
                          href="mailto:support@diro.io"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          support@diro.io
                        </a>
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
}
