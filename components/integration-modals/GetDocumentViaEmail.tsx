"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface GetDocumentViaEmailProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetDocumentViaEmail({ isOpen, onClose }: GetDocumentViaEmailProps) {
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
                  <Mail className="text-blue-500" size={20} />
                  Get Document Via Email
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
              <div className="flex-1 overflow-y-auto scrollbar-thin !scrollbar-w-1.5 scrollbar-thumb-blue-500 dark:scrollbar-thumb-blue-400 scrollbar-track-transparent hover:scrollbar-thumb-blue-600 dark:hover:scrollbar-thumb-blue-300">
                <div className="p-6">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
} 