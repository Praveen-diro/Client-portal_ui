"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, CheckCircle2, ArrowRight, FileText, Globe, Database } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface GetDocumentViaEmailProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetDocumentViaEmail({ isOpen, onClose }: GetDocumentViaEmailProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<number>(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

  const sections = [
    { title: "Email Integration", icon: <Mail /> },
    { title: "Data Extraction", icon: <Database /> }
  ];

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
                  <Mail className="text-blue-500" size={20} />
                  Get Document Via Email
                </h2>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Section navigation */}
              <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1 p-2">
                  {sections.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSection(index)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        activeSection === index
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      {section.icon}
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto scrollbar-thin !scrollbar-w-1.5 scrollbar-thumb-blue-500 dark:scrollbar-thumb-blue-400 scrollbar-track-transparent hover:scrollbar-thumb-blue-600 dark:hover:scrollbar-thumb-blue-300">
                <div className="p-6">
                  <div className="space-y-8">
                    {/* Email Integration Section */}
                    <AnimatePresence mode="wait">
                      {activeSection === 0 && (
                        <motion.section
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h3 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-2">
                              <Mail size={18} />
                              Email Configuration
                            </h3>
                            <ul className="ml-2 space-y-2">
                              <li className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-blue-500 mt-1"><CheckCircle2 size={16} /></span>
                                <span>You may directly trigger a document or a notification to be emailed to you everytime a submission is done.</span>
                              </li>
                              <li className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-blue-500 mt-1"><CheckCircle2 size={16} /></span>
                                <div>
                                  <span>You may setup the email address under:</span>
                                  <div className="flex items-center gap-1 mt-2 ml-1 text-sm font-medium">
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Button settings</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Triggers and emails</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">After verifications</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-blue-700 dark:text-blue-300">Email to</span>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md transition-all hover:shadow-lg">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-2 border-b border-gray-200 dark:border-gray-700">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Integration Demo</span>
                            </div>
                            <Image 
                              src="/demo-email-integration.png" 
                              alt="Email Integration Demo" 
                              width={600} 
                              height={350} 
                              className="w-full object-contain"
                            />
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              You can configure each verification button such that the document
                              submitted will appear in your customer's account in your CRM without
                              any coding.
                            </p>
                            
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-4 text-sm">
                              <p className="text-gray-700 dark:text-gray-300 flex flex-wrap items-center gap-1.5">
                                <span>Go to:</span>
                                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Left navigation bar</span>
                                <ArrowRight size={14} className="text-gray-400" />
                                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Verification buttons</span>
                                <ArrowRight size={14} className="text-gray-400" />
                                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Settings</span>
                                <ArrowRight size={14} className="text-gray-400" />
                                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Advanced</span>
                                <ArrowRight size={14} className="text-gray-400" />
                                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">After Verification</span>
                                <ArrowRight size={14} className="text-gray-400" />
                                <span className="bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded font-medium text-blue-700 dark:text-blue-300">Triggers → Email PDFs to:</span>
                              </p>
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300 font-medium">
                              Please Enter the email address of your CRM to send the
                              submitted PDF documents directly after each verification submission.
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/40 shadow-sm p-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <FileText className="text-blue-500" size={18} />
                                Salesforce Integration
                              </h4>
                              <p className="text-gray-700 dark:text-gray-300">
                                In <b>Salesforce</b> the email address is static. The tracking id
                                needs to be in the email body only. Diro adds all tracking ids in
                                email body automatically. However, you will have to activate the
                                email feature in salesforce.
                              </p>
                              <a
                                className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                                href="https://www.veonconsulting.com/email-to-salesforce/?msclkid=98b4c527c62611ec97c99a19542ef2cb"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Globe size={14} />
                                Email to Salesforce - Linking external emails
                              </a>
                            </div>
                            
                            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800/40 shadow-sm p-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Mail className="text-blue-500" size={18} />
                                Custom CRM Setup
                              </h4>
                              <p className="text-gray-700 dark:text-gray-300">
                                Few CRMs require the emails to contain a "trackingid" in the email
                                address. This you can add as {"<"}your field
                                {">"} anywhere inside the email address itself. It will
                                automatically be replaced with the field entry or tracking id.
                              </p>
                              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-700 text-sm font-mono">
                                Example: customer_-{"<"}accountnumber{">"}@yourcompany.com
                              </div>
                            </div>
                          </div>
                        </motion.section>
                      )}

                      {/* Data Extraction Section */}
                      {activeSection === 1 && (
                        <motion.section
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Database className="text-blue-500" size={20} />
                            Enable automatic extraction of data
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/40 shadow-sm p-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <CheckCircle2 className="text-green-500" size={18} />
                                Enable auto-extraction
                              </h4>
                              <ul className="ml-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                  <ArrowRight size={14} className="mt-1 text-blue-500" />
                                  <div className="flex flex-wrap items-center gap-1.5 text-sm">
                                    <span>Go to</span>
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Button settings</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Triggers and emails</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">After verifications</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Trigger</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded font-medium text-blue-700 dark:text-blue-300">Auto-json (enable)</span>
                                  </div>
                                </li>
                                <li className="ml-6 text-sm text-gray-600 dark:text-gray-400">
                                  If you do not want to pay for extraction of JSON fields from all
                                  the documents from that verification button then do not enable
                                  it. You may request it per document through the user interface
                                  or API call.
                                </li>
                              </ul>
                            </div>
                            
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/40 shadow-sm p-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <CheckCircle2 className="text-green-500" size={18} />
                                Privacy Mode Configuration
                              </h4>
                              <ul className="ml-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                  <ArrowRight size={14} className="mt-1 text-blue-500" />
                                  <span>If using high privacy mode then you must also set up the verifications fields</span>
                                </li>
                                <li className="flex items-start gap-2 ml-6">
                                  <ArrowRight size={14} className="mt-1 text-gray-400" />
                                  <div className="flex flex-wrap items-center gap-1.5 text-sm">
                                    <span>Go to</span>
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Button settings</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Privacy</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Verification fields</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded font-medium text-blue-700 dark:text-blue-300">Add field</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/40 shadow-sm p-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2" id="output-to-google-sheet">
                                <CheckCircle2 className="text-green-500" size={18} />
                                Output to Google Sheet
                              </h4>
                              <ul className="ml-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                  <ArrowRight size={14} className="mt-1 text-blue-500" />
                                  <div className="flex flex-wrap items-center gap-1.5 text-sm">
                                    <span>Go to</span>
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Button settings</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Triggers and emails</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">After verifications</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Trigger</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded font-medium text-blue-700 dark:text-blue-300">Add google sheet URL (Enable)</span>
                                  </div>
                                </li>
                                <li className="ml-6 text-sm">
                                  To enable this feature share the editor access of the google
                                  sheet to <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">diro-335@teak-spot-238407.iam.gserviceaccount.com</span>
                                </li>
                                <li className="ml-6 text-sm">
                                  Please keep the sheet empty and don't enter any data manually.
                                </li>
                              </ul>
                            </div>
                            
                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/40 shadow-sm p-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2" id="output-to-zapier">
                                <CheckCircle2 className="text-green-500" size={18} />
                                Output to Zapier
                              </h4>
                              <ul className="ml-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                  <ArrowRight size={14} className="mt-1 text-blue-500" />
                                  <span>Using Zapier you can generate a webhook URL and integrate our callbacks with your workflow.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <ArrowRight size={14} className="mt-1 text-blue-500" />
                                  <div className="flex flex-wrap items-center gap-1.5 text-sm">
                                    <span>Go to</span>
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Button settings</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Triggers and emails</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">After verifications</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Trigger</span>
                                    <ArrowRight size={14} className="text-gray-400" />
                                    <span className="bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded font-medium text-blue-700 dark:text-blue-300">Integrate with zapier (click)</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </motion.section>
                      )}
                    </AnimatePresence>
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