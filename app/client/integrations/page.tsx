"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer } from "@/components/ui/page-container";
import { 
  PlayCircle, 
  ZapIcon, 
  Activity, 
  CheckCircle, 
  Trash2, 
  Rocket, 
  FileText 
} from "lucide-react";
import { useRouter } from "next/navigation";

// Only import components that are actually used/rendered in your JSX
import SetupOrganization from "@/components/integration-modals/SetupOrganization";
import CopyLink from "@/components/integration-modals/CopyLink";
import CompareVerifyUserData from "@/components/integration-modals/CompareVerifyUserData";
import VerificationPrivacyModal from "@/components/integration-modals/VerificationPrivacyModal";
import SetupVerificationButton from "@/components/integration-modals/SetupVerificationButton";
import CustomerReferenceNumber from "@/components/integration-modals/CustomerReferenceNumber";
import SetLogo from "@/components/integration-modals/SetLogo";
import AdvanceConfig from "@/components/integration-modals/AdvanceConfig";
import GetDocumentViaEmail from "../../../components/integration-modals/GetDocumentViaEmail";
import SetupWebhook from "../../../components/integration-modals/SetupWebhook";
import AutoDeleteData from "@/components/integration-modals/AutoDeleteData";
import BeforeLiveModal from "@/components/integration-modals/BeforeLiveModal";
import SetupUserPermissionsModal from "@/components/integration-modals/SetupUserPermissionsModal";
import HmacSecureCommunication from "@/components/integration-modals/HmacSecureCommunication";
import DocumentsModal from "@/components/integration-modals/DocumentsModal";
import DocumentsSection from "@/components/integration-sections/DocumentsSection";

export default function IntegrationsPage() {
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSetLogoOpen, setIsSetLogoOpen] = useState(false);
  const [isAdvanceConfigOpen, setIsAdvanceConfigOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const transitionConfig = {
    type: "tween",
    duration: 0.3,
    ease: "easeOut",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        when: "beforeChildren",
      },
    },
  };

  const tableVariants = {
    hidden: {
      opacity: 0,
      x: 60,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 20,
        mass: 0.4,
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const boxVariants = {
    hidden: {
      opacity: 0,
      x: 15,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15,
        mass: 0.3,
        duration: 0.3,
      },
    },
  };

  const closeModal = () => setActiveModal(null);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SetLogo isOpen={isSetLogoOpen} onClose={() => setIsSetLogoOpen(false)} />
      <SetupOrganization isOpen={activeModal === "setupOrganization"} onClose={closeModal} />
      <SetupVerificationButton isOpen={activeModal === "setupVerificationButton"} onClose={closeModal} />
      <CopyLink isOpen={activeModal === "copyLink"} onClose={closeModal} />
      <CompareVerifyUserData isOpen={activeModal === "compareVerifyUserData"} onClose={closeModal} />
      <VerificationPrivacyModal isOpen={activeModal === "verificationPrivacyModal"} onClose={closeModal} />
      <CustomerReferenceNumber isOpen={activeModal === "customerReferenceNumber"} onClose={closeModal} />
      <AutoDeleteData isOpen={activeModal === "autoDeleteData"} onClose={closeModal} />
      <BeforeLiveModal isOpen={activeModal === "beforeLive"} onClose={closeModal} />
      <SetupUserPermissionsModal isOpen={activeModal === "setupUserPermissions"} onClose={closeModal} />
      <AdvanceConfig isOpen={isAdvanceConfigOpen} onClose={() => setIsAdvanceConfigOpen(false)} />
      <GetDocumentViaEmail isOpen={activeModal === "documentViaEmail"} onClose={closeModal} />
      <SetupWebhook isOpen={activeModal === "setupWebhook"} onClose={closeModal} />
      <HmacSecureCommunication 
        isOpen={activeModal === 'hmac'} 
        onClose={closeModal} 
      />
      <DocumentsModal isOpen={isDocumentsModalOpen} onClose={() => setIsDocumentsModalOpen(false)} />
      <div className="flex-none">
        <Sidebar onExpandedChange={setSidebarExpanded} />
      </div>
      <PageContainer sidebarExpanded={sidebarExpanded}>
        <div className="flex-1 relative">
          <PageHeader title="Integrations" description="Manage your integration settings and connections" />

          <motion.div initial="hidden" animate="show" variants={containerVariants} className="container mx-auto px-6 py-8">
            <motion.div variants={tableVariants}>
              <motion.div
                variants={tableVariants}
                className="bg-card rounded-lg border shadow-lg dark:shadow-gray-900/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="grid grid-cols-12 border-b border-border">
                <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-center">
                      Steps
                    </h2>
                  </div>
                  <div className="col-span-4 p-6 bg-white/50 dark:bg-gray-800/50 border-l border-border">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-center">
                      Quick start (no code)
                    </h2>
                  </div>
                  <div className="col-span-5 p-6 bg-white/50 dark:bg-gray-800/50 border-l border-border">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-center">
                      Advanced (high volume)
                    </h2>
                  </div>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="show">
                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-blue-600" />
                        Get started
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <div className="grid grid-cols-1 gap-4">
                        <motion.div
                          variants={boxVariants}
                          className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group"
                        >
                          <motion.div
                            variants={boxVariants}
                            className="flex items-center gap-3 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => setActiveModal("setupOrganization")}
                          >
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Setup organization
                          </motion.div>
                        </motion.div>
                        
                        <motion.div
                          variants={boxVariants}
                          className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group"
                        >
                          <motion.div
                            variants={boxVariants}
                            className="flex items-center gap-3 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => setActiveModal("setupVerificationButton")}
                          >
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Setup verification button
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => setActiveModal("verificationPrivacyModal")}
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li 
                            variants={boxVariants} 
                            className="flex items-center gap-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Configure verification fields
                          </motion.li>
                          <motion.li 
                            variants={boxVariants} 
                            className="flex items-center gap-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Enable privacy
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <ZapIcon className="h-5 w-5 text-blue-600" />
                        Trigger verification
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => setActiveModal("copyLink")}
                      >
                        <ul className="space-y-3">
                          <motion.li 
                            variants={boxVariants} 
                            className="flex items-center gap-3 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Copy link (use as Iframe or new window)
                          </motion.li>
                          <motion.li 
                            variants={boxVariants} 
                            className="flex items-center gap-3 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Add customer reference number
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => setActiveModal("compareVerifyUserData")}
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li 
                            variants={boxVariants} 
                            className="flex items-center gap-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Compare and verify user data
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        During verification
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => setIsSetLogoOpen(true)}
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Set your logo
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => setIsAdvanceConfigOpen(true)}
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li 
                            variants={boxVariants} 
                            className="flex items-center gap-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Advanced configurations
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Verification progress status Window.postMessage()
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        After verification
                      </h3>
                    </div>
                    
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => setActiveModal("documentViaEmail")}
                      >
                        <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-all duration-300">
                          <div className="flex items-center gap-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Get document via email
                          </div>

                          <p className="font-medium text-gray-900 dark:text-white mb-2 mt-6">Enable automatic extraction of data:</p>
                          
                          <ul className="space-y-2 ml-4 text-gray-600 dark:text-gray-300">
                            <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              <span className="text-blue-500 dark:text-blue-400">•</span>
                              Output to Google Sheet
                            </motion.li>
                            <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              <span className="text-blue-500 dark:text-blue-400">•</span>
                              Output to Zapier
                            </motion.li>
                            <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              <span className="text-blue-500 dark:text-blue-400">•</span>
                              Enable auto-extraction
                            </motion.li>
                            <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              <span className="text-blue-500 dark:text-blue-400">•</span>
                              If using high privacy mode
                            </motion.li>
                          </ul>
                        </div>
                      </motion.div>
                    </div>

                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group"
                      >
                        <ul className="space-y-6 text-gray-600 dark:text-gray-300">
                          <motion.li
                            variants={boxVariants}
                            className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md hover:bg-gray-50/80 dark:hover:bg-gray-700/80 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer"
                            onClick={() => setActiveModal("setupWebhook")}
                          >
                            <div 
                              className="flex items-center gap-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                            >
                              <span className="text-blue-500 dark:text-blue-400">•</span>
                              Setup webhook (callback URL)
                            </div>
                              <p className="font-medium text-gray-900 dark:text-white mb-2 mt-6">Receive webhooks (View logs):</p>
                              <ul className="space-y-2 ml-4">
                                <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                  <span className="text-blue-500 dark:text-blue-400">•</span>
                                  Engagement status (final)
                                </motion.li>
                                <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                  <span className="text-blue-500 dark:text-blue-400">•</span>
                                  Document submitted
                                </motion.li>
                                <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                  <span className="text-blue-500 dark:text-blue-400">•</span>
                                  Extracted JSON (Interim /Final)
                                </motion.li>
                                <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                  <span className="text-blue-500 dark:text-blue-400">•</span>
                                  JSON failure
                                </motion.li>
                              </ul>
                          </motion.li>
                          
                          <motion.li
                            variants={boxVariants}
                            className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md hover:bg-gray-50/80 dark:hover:bg-gray-700/80 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white mb-2">APIs to retrieve data</p>
                              <ul className="space-y-3">
                                <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                  <span className="text-blue-500 dark:text-blue-400">•</span>
                                  View API keys and secret token
                                </motion.li>
                                <motion.li variants={boxVariants} className="mt-3">
                                  <div className="flex items-center gap-3 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    <span className="text-blue-500 dark:text-blue-400">•</span>
                                    <p className="font-medium">Get native original (MHTML / PDF / other types)</p>
                                  </div>
                                  <ul className="space-y-2 ml-7">
                                    <motion.li variants={boxVariants} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                      <span className="text-indigo-400 dark:text-indigo-300">•</span>
                                      Get certified PDF
                                    </motion.li>
                                    <motion.li variants={boxVariants} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                      <span className="text-indigo-400 dark:text-indigo-300">•</span>
                                      Get session data
                                    </motion.li>
                                    <motion.li variants={boxVariants} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                      <span className="text-indigo-400 dark:text-indigo-300">•</span>
                                      Get extracted JSON
                                    </motion.li>
                                    <motion.li variants={boxVariants} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                      <span className="text-indigo-400 dark:text-indigo-300">•</span>
                                      Download postman templates ⤓
                                    </motion.li>
                                  </ul>
                                </motion.li>
                              </ul>
                            </div>
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-blue-600" />
                        Deletion
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => setActiveModal("autoDeleteData")}
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li 
                            variants={boxVariants} 
                            className="flex items-center gap-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Auto delete data
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => router.push('/client/integrations/apireference')}
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            View API Documentation
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 cursor-pointer" onClick={() => setActiveModal("beforeLive")}>
                        <Rocket className="h-5 w-5 text-blue-600" />
                        Before you go live
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => setActiveModal("beforeLive")}
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Testing
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Activating production
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => setActiveModal("setupUserPermissions")}
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Setup user and permissions
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Creating a Landing page
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Documents
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => setIsDocumentsModalOpen(true)}
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Interaction flow overview
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Sample certified pdf
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Sample uncertified original
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Data dictionary
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 dark:text-blue-400">•</span>
                            Iframe Integration guide
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>

                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 group cursor-pointer"
                        onClick={() => setActiveModal('hmac')}
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li 
                            variants={boxVariants} 
                            className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg transition-colors"
                          >
                           
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white mb-2">HMAC for Secure Communication</h3>
                              <span className="text-blue-500 dark:text-blue-400">•</span> Authenticate and secure data using HMAC
                            </div>
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3"></motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </PageContainer>
    </div>
  );
}
