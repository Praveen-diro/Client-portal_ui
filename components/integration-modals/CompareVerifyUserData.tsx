"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Copy, CheckCircle2, FileCheck, Code, Database, 
  Terminal, Link2, ChevronRight, ArrowRight, FileText, 
  AlertTriangle, ChevronDown, Cpu, ListFilter
} from "lucide-react";
import Link from "next/link";
import { buttonService } from "../../app/services/button.service";
import { env } from "../../app/config/environment";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface CompareVerifyUserDataProps {
  isOpen: boolean;
  onClose: () => void;
  buttonId?: string;
  buttons?: Array<{buttonid: string, btndata: {name: string}}>;
}

export default function CompareVerifyUserData({ 
  isOpen, 
  onClose, 
  buttonId = "", 
  buttons = []
}: CompareVerifyUserDataProps) {
  const [selectedButtonId, setSelectedButtonId] = useState(buttonId);
  const [copied, setCopied] = useState(false);
  const [expandedExample, setExpandedExample] = useState<number | null>(null);
  const [buttonList, setButtonList] = useState<Array<{buttonid: string, btndata: {name: string}}>>(buttons);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonsFetched, setButtonsFetched] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Use the verification link from environment
  const verificationBaseUrl = env.verification_link;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.title = "Compare & Verify User Data";
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

  useEffect(() => {
    setSelectedButtonId(buttonId);
  }, [buttonId]);

  useEffect(() => {
    // Only fetch buttons once when modal opens and buttons aren't provided
    if (isOpen && buttons.length === 0 && !buttonsFetched && !isLoading) {
      fetchButtons();
    } else if (buttons.length > 0) {
      // If buttons are provided via props, use those
      setButtonList(buttons);
    }
  }, [isOpen]); // Only depend on isOpen to prevent infinite loop

  const fetchButtons = async () => {
    try {
      setIsLoading(true);
      const response = await buttonService.getButtons();
      
      if (response.success && response.data?.data) {
        setButtonList(response.data.data);
        
        // If no button is selected, select the first one
        if (!selectedButtonId && response.data.data.length > 0) {
          setSelectedButtonId(response.data.data[0].buttonid);
        }
      }
    } catch (error) {
      console.error("Error fetching buttons:", error);
    } finally {
      setIsLoading(false);
      setButtonsFetched(true); // Mark that we've fetched buttons
    }
  };

  const handleButtonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedButtonId(e.target.value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const toggleExample = (index: number) => {
    setExpandedExample(expandedExample === index ? null : index);
  };

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

  const copyLink = verificationBaseUrl + selectedButtonId + "&trackid=";

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
                isDark ? "bg-[#1A1F2C]/95 border-gray-700 bg-gradient-to-r from-blue-900/20 to-[#1A1F2C]/95" : 
                        "bg-white/95 border-gray-200 bg-gradient-to-r from-blue-50 to-white/95"
              )}>
                <h2 
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                    <FileCheck className="text-blue-500 dark:text-blue-400" size={20} />
                  </div>
                  Compare & Verify User Data
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
              
              <div className="flex-1 overflow-y-auto">
                <motion.div 
                  className="p-6"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Button Selection */}
                  <motion.div variants={contentItemVariants} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <ListFilter size={18} className="text-blue-500 dark:text-blue-400" />
                        <label className="font-medium text-gray-700 dark:text-gray-300">Select verification button:</label>
                      </div>
                      {isLoading ? (
                        <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center">
                          <Cpu size={16} className="mr-2 animate-pulse" />
                          <span>Loading buttons...</span>
                        </div>
                      ) : (
                        <select
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors cursor-pointer flex-1"
                          value={selectedButtonId}
                          onChange={handleButtonChange}
                          disabled={isLoading}
                        >
                          {buttonList.length === 0 ? (
                            <option value="">No buttons available</option>
                          ) : (
                            buttonList.map((button, index) => (
                              <option key={index} value={button.buttonid}>
                                {button.btndata?.name || `Button ${index + 1}`}
                              </option>
                            ))
                          )}
                        </select>
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Alert for copied */}
                  <AnimatePresence>
                    {copied && (
                      <motion.div 
                        className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-200 flex items-center gap-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <CheckCircle2 size={20} className="text-green-500 dark:text-green-400" />
                        <span className="font-medium">Success! Link copied to clipboard.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Advanced Features Section */}
                  <motion.div variants={contentVariants} className="space-y-6">
                    <motion.section variants={contentItemVariants}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                          <Database className="text-blue-600 dark:text-blue-400" size={18} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Advanced Features
                        </h3>
                      </div>
                      
                      <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/30 dark:to-gray-800/60 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full shrink-0 mt-1">
                            <FileText className="text-blue-600 dark:text-blue-400" size={18} />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Compare and Verify User Data
                            </h4>
                            
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              You can enable automatic matching by passing user data for multiple fields inside the no-code link. 
                              DIRO will automatically start returning a matching score along with extracted data inside the PDF-to-JSON results.
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-5 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/40">
                          <div className="flex items-start gap-3">
                            <Terminal size={18} className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                                Copy the link from the verification button and then:
                              </p>
                              
                              <ul className="list-disc pl-5 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Add field label as query parameter in no code link.</li>
                                <li>Please do not use tag or dictionary name as query parameter.</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-5">
                          <p className="text-gray-700 dark:text-gray-300 font-medium mb-3 flex items-center">
                            <Code size={16} className="mr-2 text-blue-500 dark:text-blue-400" />
                            Examples:
                          </p>
                          
                          <div className="space-y-5">
                            {/* Example 1 */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-gray-700 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                                <span>If field label is firstname:</span>
                              </div>
                              
                              <div className="p-4 text-sm font-mono bg-blue-50 dark:bg-blue-900/20 overflow-x-auto">
                                <pre className="text-xs md:text-sm whitespace-pre-wrap break-all text-gray-700 dark:text-gray-300">
                                  {`${verificationBaseUrl}${selectedButtonId || "<buttonid>"}&trackid=<trackid>&firstname=<YOUR FIRSTNAME>`}
                                </pre>
                              </div>
                            </div>
                            
                            {/* Example 2 */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-gray-700 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                                <span>If you have three verification fields: firstname, lastname and zipcode:</span>
                              </div>
                              
                              <div className="p-4 text-sm font-mono bg-blue-50 dark:bg-blue-900/20 overflow-x-auto">
                                <pre className="text-xs md:text-sm whitespace-pre-wrap break-all text-gray-700 dark:text-gray-300">
                                  {`${verificationBaseUrl}${selectedButtonId || "<buttonid>"}&trackid=<TRACK_ID>&firstname=<YOUR FIRSTNAME>&lastname=<YOUR LASTNAME>&zipcode=<YOUR ZIPCODE>`}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                       
                        <div className="flex items-start">
                          <AlertTriangle size={18} className="text-amber-500 dark:text-amber-400 mr-2 mt-0.5 shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            <strong>Note:</strong> Please follow URL encoding while building no-code URL. Refer <a href="https://session.diro.live/server/#/client/?buttonid=" className="text-blue-600 dark:text-blue-400 hover:underline">HTML URL</a> encoding for proper formatting.
                            <span className="flex items-center mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                              <span className="mr-2 font-mono text-sm break-all"> {`${verificationBaseUrl}${selectedButtonId || "<buttonid>"}&trackid=`}</span>
                              <button 
                                onClick={() => copyToClipboard(`${verificationBaseUrl}${selectedButtonId || "<buttonid>"}&trackid=`)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                                title="Copy URL"
                              >
                                <Copy size={16} className="text-blue-500 dark:text-blue-400" />
                              </button>
                            </span>
                          </p>
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
  );
}
