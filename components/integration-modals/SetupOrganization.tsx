"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Building2, Upload, CreditCard, Users, ExternalLink, 
  Settings, Shield, Briefcase, CheckCircle2, AlertCircle, ChevronRight
} from "lucide-react";
import Link from "next/link";

interface SetupOrganizationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupOrganization({ isOpen, onClose }: SetupOrganizationProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = "Setup Organization";
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
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95, 
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } 
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
    }
  };

  // Animation variants for individual content items
  const contentItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: "easeOut" } 
    }
  };

  const handleSectionHover = (index: number | null) => {
    setActiveSection(index);
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
              <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 backdrop-blur-sm">
                <h2 
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                    <Building2 className="text-blue-500 dark:text-blue-400" size={20} />
                  </div>
                  Setup Organization
                </h2>
                <motion.button 
                  onClick={onClose}
                  className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </motion.button>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800">
                <motion.div 
                  className="p-6"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div variants={contentItemVariants}>
                    <Link 
                      href="/client/account/" 
                      className="mb-6 inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                    >
                      <Settings size={16} className="mr-2" />
                      <span>- Manage account ➜ Organization details</span>
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </motion.div>
                  
                  <div className="space-y-6 mt-6">
                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-gradient-to-r from-blue-50 to-white dark:from-gray-800/60 dark:to-gray-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                      onMouseEnter={() => handleSectionHover(0)}
                      onMouseLeave={() => handleSectionHover(null)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                            <Upload className="text-blue-500 dark:text-blue-400" size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            Add Organization Logo
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            As the starting point you need to upload your logo in the organization
                            settings. The system will allow you to crop or remove background during
                            the process. This logo will then display to all the end-users who go
                            through the verification process.
                          </p>
                         
                        </div>
                      </div>
                    </motion.section>
                    
                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-gradient-to-r from-purple-50 to-white dark:from-gray-800/60 dark:to-gray-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                      onMouseEnter={() => handleSectionHover(1)}
                      onMouseLeave={() => handleSectionHover(null)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                            <CreditCard className="text-purple-500 dark:text-purple-400" size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Add Billing Address <span className="text-sm font-normal text-purple-600 dark:text-purple-400 ml-2">(before going live)</span>
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            You can try all features within the sandbox and complete the
                            integration. Then you need to add a billing address to activate the
                            production. You would also need to select a plan or buy credits.
                          </p>
                       
                        </div>
                      </div>
                    </motion.section>
                    
                    <motion.section 
                      variants={contentItemVariants}
                      className="bg-gradient-to-r from-green-50 to-white dark:from-gray-800/60 dark:to-gray-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                      onMouseEnter={() => handleSectionHover(2)}
                      onMouseLeave={() => handleSectionHover(null)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                            <Users className="text-green-500 dark:text-green-400" size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            Setup Users & Permissions
                            <span className="text-sm font-normal text-green-600 dark:text-green-400 ml-2">(optional)</span>
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            You may add additional users and assign roles to provide secure access
                            to various features and restrict access to their own requested
                            documents.
                          </p>
                          
                          <div className="bg-white/70 dark:bg-gray-800/40 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Available Roles:</h5>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <li className="flex items-center text-gray-700 dark:text-gray-300">
                                <Shield size={14} className="text-red-500 mr-2" />
                                <span><strong>Admin:</strong> Complete access and management</span>
                              </li>
                              <li className="flex items-center text-gray-700 dark:text-gray-300">
                                <Briefcase size={14} className="text-green-500 mr-2" />
                                <span><strong>Developer:</strong> API key and token access</span>
                              </li>
                              <li className="flex items-center text-gray-700 dark:text-gray-300">
                                <Users size={14} className="text-blue-500 mr-2" />
                                <span><strong>User:</strong> Access to own documents</span>
                              </li>
                              <li className="flex items-center text-gray-700 dark:text-gray-300">
                                <CreditCard size={14} className="text-purple-500 mr-2" />
                                <span><strong>Account:</strong> Access to accounts section</span>
                              </li>
                              <li className="flex items-start text-gray-700 dark:text-gray-300 md:col-span-2">
                                <Users size={14} className="text-amber-500 mr-2 mt-1" />
                                <span><strong>Manager:</strong> Access to documents of all users</span>
                              </li>
                            </ul>
                          </div>
                          
                          <p className="mt-4 text-gray-700 dark:text-gray-300">
                            Added user(s) will receive an email from DIRO support with a temporary
                            password and link to reset their password. Please ask them to check the
                            spam folder if email is not received.
                          </p>
                        </div>
                      </div>
                    </motion.section>
                  </div>
                  
                  <motion.div variants={contentItemVariants} className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link 
                       href="/client/account/"  
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all"
                    >
                      <Users size={16} className="mr-2" />
                      <span>Manage User Details</span>
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
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