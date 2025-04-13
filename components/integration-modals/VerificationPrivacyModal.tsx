"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, FileText, Shield, ChevronRight, Settings, 
  Bell, Info, ToggleLeft, User, Eye, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface VerificationPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationPrivacyModal({ isOpen, onClose }: VerificationPrivacyModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeSection, setActiveSection] = useState<number | null>(null);

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

  const handleSectionHover = (index: number | null) => {
    setActiveSection(index);
  };

  return (
    <>
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
                <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 backdrop-blur-sm">
                  <h2 
                    id="modal-title"
                    className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"
                  >
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                      <Shield className="text-blue-500 dark:text-blue-400" size={20} />
                    </div>
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
                
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800">
                  <motion.div 
                    className="p-6"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.div variants={contentItemVariants}>
                      <Link 
                        href="/client/validation-buttons" 
                        className="mb-6 inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                      >
                        <Settings size={16} className="mr-2" />
                        <span>Manage Privacy Settings</span>
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </motion.div>
                    
                    <motion.div 
                      variants={contentVariants}
                      className="space-y-6 mt-4"
                    >
                      <motion.section 
                        variants={contentItemVariants}
                        className={`bg-gradient-to-r ${activeSection === 0 ? 'from-blue-50 to-white' : 'from-white to-white'} dark:from-gray-800/60 dark:to-gray-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300`}
                        onMouseEnter={() => handleSectionHover(0)}
                        onMouseLeave={() => handleSectionHover(null)}
                      >
                        <motion.div 
                          variants={contentItemVariants}
                          className="flex items-start"
                        >
                          <div className="flex-shrink-0">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                              <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
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
                            
                            <div className="mt-4 p-4 bg-white/80 dark:bg-gray-800/40 rounded-lg border border-blue-100 dark:border-blue-900/20">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                                <p className="font-medium text-gray-900 dark:text-white">Basic Privacy Options</p>
                              </div>
                              <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                                <li className="flex items-center">
                                  <ToggleLeft size={14} className="text-blue-500 dark:text-blue-400 mr-2 shrink-0" />
                                  Enable auto deletion (default 7 days) &#10140; On / Off
                                </li>
                                <li className="flex items-center">
                                  <ToggleLeft size={14} className="text-blue-500 dark:text-blue-400 mr-2 shrink-0" />
                                  Share only JSON (do not generate PDF) &#10140; On / Off
                                </li>
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      </motion.section>
                      
                      <motion.section 
                        variants={contentItemVariants}
                        className={`bg-gradient-to-r ${activeSection === 1 ? 'from-indigo-50 to-white' : 'from-white to-white'} dark:from-gray-800/60 dark:to-gray-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300`}
                        onMouseEnter={() => handleSectionHover(1)}
                        onMouseLeave={() => handleSectionHover(null)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                              <User className="text-indigo-600 dark:text-indigo-400" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Verification fields - you are required to setup verification fields for
                            </h4>
                            <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                              <li className="flex items-start">
                                <span className="text-indigo-500 dark:text-indigo-400 mr-2">•</span>
                                Privacy messaging to end-customers regarding what data is going to be
                                retained.
                              </li>
                              <li className="flex items-start">
                                <span className="text-indigo-500 dark:text-indigo-400 mr-2">•</span>
                                This is critical before advanced privacy can be turned on. The fields
                                need to be mapped to the dictionary fields for the PDF to JSON to work
                                properly.
                              </li>
                              <div className="ml-8 mt-2 p-3 bg-white/80 dark:bg-gray-800/40 rounded-lg border border-indigo-100 dark:border-indigo-900/20">
                                <ul className="space-y-2">
                                  <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-2"></span>
                                    Select field label names
                                  </li>
                                  <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-2"></span>
                                    Type; text, trackid, date
                                  </li>
                                  <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-2"></span>
                                    Sample text (Hint for data entry in form)
                                  </li>
                                  <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-2"></span>
                                    Tag (address, account no, name, date, entity, transaction, contact)
                                  </li>
                                </ul>
                              </div>
                            </ul>
                          </div>
                        </div>
                      </motion.section>
                      
                      <motion.section 
                        variants={contentItemVariants}
                        className={`bg-gradient-to-r ${activeSection === 2 ? 'from-amber-50 to-white' : 'from-white to-white'} dark:from-gray-800/60 dark:to-gray-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300`}
                        onMouseEnter={() => handleSectionHover(2)}
                        onMouseLeave={() => handleSectionHover(null)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                              <Bell className="text-amber-600 dark:text-amber-400" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                              Triggers & emails
                            </h4>
                            <div className="mb-4 p-2 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg inline-flex items-center">
                              <Info size={16} className="text-amber-500 dark:text-amber-400 mr-2" />
                              <Link 
                                href="/client/validation-buttons" 
                                className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                              >
                                <span>Left panel &#10140; Verification buttons &#10140; Button settings &#10140; Triggers & emails</span>
                              </Link>
                            </div>
                            
                            <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                              <li className="flex items-center">
                                <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                Invitation email template
                              </li>
                              <li className="flex items-start">
                                <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                <div className="w-full">
                                  <p>Triggers</p>
                                  <ul className="ml-6 mt-2 space-y-2">
                                    <li className="flex items-start">
                                      <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                      <div className="w-full">
                                        <p>Email</p>
                                        <ul className="ml-6 mt-2">
                                          <li className="flex items-center">
                                            <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                            Include pdf &#10140; On / Off
                                          </li>
                                        </ul>
                                      </div>
                                    </li>
                                    <li className="flex items-center">
                                      <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                      Enable engagement callback &#10140; On / Off
                                    </li>
                                    <li className="flex items-center">
                                      <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                      Auto JSON &#10140; On / Off
                                    </li>
                                    <li className="flex items-center">
                                      <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                      Override default callback url
                                    </li>
                                    <li className="flex items-center">
                                      <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                      Add google sheet URL &#10140; On / Off
                                    </li>
                                    <li className="flex items-center">
                                      <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                      Integration with Zapier
                                    </li>
                                  </ul>
                                </div>
                              </li>
                              <li className="flex items-start">
                                <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                <div className="w-full">
                                  <p>Redirection</p>
                                  <ul className="ml-6 mt-2 space-y-2">
                                    <li className="flex items-start">
                                      <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                      <div className="w-full">
                                        <p>Redirect url</p>
                                        <div className="ml-6 mt-2 p-3 bg-white/80 dark:bg-gray-800/40 rounded-lg border border-amber-100 dark:border-amber-900/20">
                                          <ul className="space-y-2">
                                            <li className="text-sm">
                                              • Redirect URL is the website where user wants to redirect after successful submission of document.
                                            </li>
                                            <li className="text-sm">
                                              • When configuring redirect url user can add fields of type trackid in URL at end.
                                            </li>
                                            <li className="text-sm">
                                              • Example:
                                              <ul className="ml-6 mt-2 space-y-2">
                                                <li className="text-sm">
                                                  • Redirect website is <a href="https://diro.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://www.diro.io</a> and we have a field named docid as type of trackid.
                                                </li>
                                                <li className="text-sm">
                                                  • Final redirect url will be <a href="https://diro.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://www.diro.io</a>{"<docid>"}.
                                                  docid is name of the field setup in verification field as trackid.
                                                </li>
                                                <li className="text-sm">
                                                  • {"<docid>"} will be replaced with the value of trackid in verification link.
                                                </li>
                                              </ul>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </li>
                                    <li className="flex items-center">
                                      <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                      Redirect message
                                    </li>
                                  </ul>
                                </div>
                              </li>
                              <li className="flex items-center">
                                <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                Email SMTP setup
                              </li>
                              <li className="flex items-center">
                                <span className="text-amber-500 dark:text-amber-400 mr-2">•</span>
                                Customer Reminders - you may send reminder emails via DIRO.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </motion.section>
                      
                      <motion.section 
                        variants={contentItemVariants}
                        className={`bg-gradient-to-r ${activeSection === 3 ? 'from-cyan-50 to-white' : 'from-white to-white'} dark:from-gray-800/60 dark:to-gray-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300`}
                        onMouseEnter={() => handleSectionHover(3)}
                        onMouseLeave={() => handleSectionHover(null)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-lg">
                              <Eye className="text-cyan-600 dark:text-cyan-400" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                              Display
                            </h4>
                            <div className="mb-4 p-2 bg-cyan-50/50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/20 rounded-lg inline-flex items-center">
                              <Info size={16} className="text-cyan-500 dark:text-cyan-400 mr-2" />
                              <Link 
                                href="/client/validation-buttons" 
                                className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                              >
                                <span>Left panel &#10140; Verification buttons &#10140; Button settings &#10140; Display</span>
                              </Link>
                            </div>
                            
                            <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                              <li className="flex items-center">
                                <span className="text-cyan-500 dark:text-cyan-400 mr-2">•</span>
                                Invite link expiry (only works when using API to generate verification
                                link per session)
                              </li>
                              <li className="flex items-center">
                                <span className="text-cyan-500 dark:text-cyan-400 mr-2">•</span>
                                Show preference for desktop on mobile devices
                              </li>
                              <li className="flex items-start">
                                <span className="text-cyan-500 dark:text-cyan-400 mr-2">•</span>
                                <div className="w-full">
                                  <p>Guide screen</p>
                                  <ul className="ml-6 mt-2 space-y-2">
                                    <li className="flex items-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mr-2"></span>
                                      Login text
                                    </li>
                                    <li className="flex items-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mr-2"></span>
                                      Instruction text
                                    </li>
                                  </ul>
                                </div>
                              </li>
                              <li className="flex items-start">
                                <span className="text-cyan-500 dark:text-cyan-400 mr-2">•</span>
                                <div className="w-full">
                                  <p>Exit screen</p>
                                  <ul className="ml-6 mt-2 space-y-2">
                                    <li className="flex items-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mr-2"></span>
                                      On success
                                    </li>
                                    <li className="flex items-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mr-2"></span>
                                      On failure
                                    </li>
                                  </ul>
                                </div>
                              </li>
                              <li className="flex items-start">
                                <span className="text-cyan-500 dark:text-cyan-400 mr-2">•</span>
                                <div className="w-full">
                                  <p>Override Organization details</p>
                                  <ul className="ml-6 mt-2 space-y-2">
                                    <li className="flex items-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mr-2"></span>
                                      Organization name
                                    </li>
                                    <li className="flex items-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mr-2"></span>
                                      Organization logo
                                    </li>
                                  </ul>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </motion.section>
                      
                      <motion.section 
                        variants={contentItemVariants}
                        className={`bg-gradient-to-r ${activeSection === 4 ? 'from-red-50 to-white' : 'from-white to-white'} dark:from-gray-800/60 dark:to-gray-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300`}
                        onMouseEnter={() => handleSectionHover(4)}
                        onMouseLeave={() => handleSectionHover(null)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                              <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                              Rejection
                            </h4>
                            <div className="mb-4 p-2 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg inline-flex items-center">
                              <Info size={16} className="text-red-500 dark:text-red-400 mr-2" />
                              <Link 
                                href="/client/validation-buttons" 
                                className="text-sm text-red-600 dark:text-red-400 hover:underline"
                              >
                                <span>Left panel &#10140; Verification buttons &#10140; Button settings &#10140; Rejection</span>
                              </Link>
                            </div>
                            
                            <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                              <li className="flex items-center">
                                <span className="text-red-500 dark:text-red-400 mr-2">•</span>
                                Reasons for rejection for documents received
                              </li>
                            </ul>
                          </div>
                        </div>
                      </motion.section>
                      
                      <motion.section 
                        variants={contentItemVariants}
                        className={`bg-gradient-to-r ${activeSection === 5 ? 'from-purple-50 to-white' : 'from-white to-white'} dark:from-gray-800/60 dark:to-gray-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300`}
                        onMouseEnter={() => handleSectionHover(5)}
                        onMouseLeave={() => handleSectionHover(null)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                              <Settings className="text-purple-600 dark:text-purple-400" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                              Others
                            </h4>
                            <div className="mb-4 p-2 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 rounded-lg inline-flex items-center">
                              <Info size={16} className="text-purple-500 dark:text-purple-400 mr-2" />
                              <Link 
                                href="/client/validation-buttons" 
                                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                              >
                                <span>Left panel &#10140; Verification buttons &#10140; Button settings &#10140; Others</span>
                              </Link>
                            </div>
                            
                            <ul className="ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                              <li className="flex items-start">
                                <span className="text-purple-500 dark:text-purple-400 mr-2">•</span>
                                <div className="w-full">
                                  <p>Force local proxy based on end-customer device</p>
                                  <ul className="ml-6 mt-2 space-y-2">
                                    <li className="flex items-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 mr-2"></span>
                                      USA only (default)
                                    </li>
                                    <li className="flex items-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 mr-2"></span>
                                      Use local country
                                    </li>
                                  </ul>
                                </div>
                              </li>
                            </ul>
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
    </>
  );
}
