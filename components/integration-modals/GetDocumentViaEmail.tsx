"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface GetDocumentViaEmailProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetDocumentViaEmail({ isOpen, onClose }: GetDocumentViaEmailProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = "Get Document Via Email";
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
        type: "spring", 
        stiffness: 400, 
        damping: 30, 
        duration: 0.4 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95, 
      transition: { duration: 0.2 } 
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
                  Get Document Via Email
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleMaximize}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isMaximized ? "Restore window" : "Maximize window"}
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
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className={`p-6 ${isMaximized ? 'max-w-4xl mx-auto' : ''}`}>
                  <div className="space-y-6">
                    <section>
                      <ul className="ml-4 pr-4">
                        <li className="text-gray-700 dark:text-gray-300 mb-2">
                          You may directly trigger a document or a notification to be
                          emailed to you everytime a submission is done.
                        </li>
                        <li className="text-gray-700 dark:text-gray-300">
                          You may setup the email address under
                          <ul className="py-2 ml-6">
                            Button settings &#10140; triggers and emails &#10140; After
                            verifications &#10140; email to (add email)
                          </ul>
                        </li>
                      </ul>
                      
                      <div className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                        <Image 
                          src="/demo-email-integration.png" 
                          alt="Email Integration Demo" 
                          width={600} 
                          height={350} 
                          className="w-full object-contain"
                          // If the image doesn't exist, you'll need to add it to your public folder
                          // or replace with an actual image path from your project
                        />
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mt-4">
                        You can configure each verification button such that the document
                        submitted will appear in your customer's account in your CRM without
                        any coding.
                      </p>
                      
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        Go to: Left navigation bar → Verification buttons → Settings →
                        Advanced → After Verification <b>→ Triggers → Email PDFs to:</b>
                      </p>
                      
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        <b>Please Enter the email address of your CRM</b> to send the
                        submitted PDF documents directly after each verification submission.
                      </p>
                      
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        In <b>Salesforce</b> the email address is static. The tracking id
                        needs to be in the email body only. Diro adds all tracking ids in
                        email body automatically. However, you will have to activate the
                        email feature in salesforce -
                        <a
                          className="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
                          href="https://www.veonconsulting.com/email-to-salesforce/?msclkid=98b4c527c62611ec97c99a19542ef2cb"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Email to Salesforce - Linking external emails to Salesforce
                        </a>
                      </p>
                      
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        Few CRMs require the emails to contain a "trackingid" in the email
                        address. This you can add as {"<"}your field
                        {">"} anywhere inside the email address itself. It will
                        automatically be replaced with the field entry or tracking id. Ex.
                        customer_-{"<"}accountnumber{">"}@yourcompany.com
                      </p>
                    </section>
                    
                    <section>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Enable automatic extraction of data
                      </h4>
                      
                      <ul className="ml-4 pr-4 space-y-4 text-gray-700 dark:text-gray-300">
                        <li>
                          <b>Enable auto-extraction</b>
                          <ul className="ml-6 mt-1">
                            <li>
                              Go to button settings &#10140; triggers and emails &#10140;
                              After verifications &#10140; trigger &#10140; auto-json (enable)
                            </li>
                            <li className="mt-1">
                              If you do not want to pay for extraction of JSON fields from all
                              the documents from that verification button then do not enable
                              it. You may request it per document through the user interface
                              or API call.
                            </li>
                          </ul>
                        </li>
                        
                        <li>
                          <b>If using high privacy mode</b> then you must also set up the
                          verifications fields
                          <ul className="ml-6 mt-1">
                            <li>
                              Go to button settings &#10140; privacy &#10140; Verification
                              fields &#10140; "add field"
                            </li>
                          </ul>
                        </li>
                        
                        <li id="output-to-google-sheet">
                          <b>Output to Google Sheet</b>
                          <ul className="ml-6 mt-1">
                            <li>
                              Go to button settings &#10140; triggers and emails &#10140;
                              After verifications &#10140; trigger &#10140; add google sheet
                              URL (Enable)
                            </li>
                            <li className="mt-1">
                              To enable this feature share the editor access of the google
                              sheet to diro-335@teak-spot-238407.iam.gserviceaccount.com
                            </li>
                            <li className="mt-1">
                              Please keep the sheet empty and don't enter any data manually.
                            </li>
                          </ul>
                        </li>
                        
                        <li id="output-to-zapier">
                          <b>Output to Zapier</b>
                          <ul className="ml-6 mt-1">
                            <li>
                              Using Zapier you can generate a webhook URL and integrate our
                              callbacks with your workflow.
                            </li>
                            <li className="mt-1">
                              Go to button settings &#10140; triggers and emails &#10140;
                              After verifications &#10140; trigger &#10140; integrate with
                              zapier (click)
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 