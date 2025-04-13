"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Link2, ExternalLink, FileText, MessageSquare, Share2, Tag, Database, GanttChartSquare } from "lucide-react";
import Link from "next/link";
import { buttonService } from "../../app/services/button.service";
import { env } from "../../app/config/environment";

interface CopyLinkProps {
  isOpen: boolean;
  onClose: () => void;
  buttonId?: string;
  verificationLink?: string;
  buttons?: Array<{buttonid: string, btndata: {name: string}}>;
}

export default function CopyLink({ 
  isOpen, 
  onClose, 
  buttonId = "", 
  verificationLink,
  buttons = []
}: CopyLinkProps) {
  const [copied, setCopied] = useState(false);
  const [selectedButtonId, setSelectedButtonId] = useState(buttonId);
  const [buttonList, setButtonList] = useState<Array<{buttonid: string, btndata: {name: string}}>>(buttons);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonsFetched, setButtonsFetched] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Use the verification link from environment
  const verificationBaseUrl = env.verification_link;

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
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };
  
  // Create the copyLink exactly like in CompareVerifyUserData.tsx
  const copyLink = verificationBaseUrl + selectedButtonId + "&trackid=";

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
                  <Link2 className="text-blue-500" size={20} />
                  Copy link
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
                  {copied && (
                    <motion.div 
                      className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md border border-blue-200 dark:border-blue-800/50 flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Copy size={16} className="mr-2" />
                      Link copied to clipboard!
                    </motion.div>
                  )}

                  {/* Button Selection */}
                  <motion.div variants={contentItemVariants} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
                    <label className="font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2">
                      <GanttChartSquare size={18} className="text-blue-500 mr-2" />
                      Select verification button:
                    </label>
                    {isLoading ? (
                      <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        Loading buttons...
                      </div>
                    ) : (
                      <select
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors cursor-pointer"
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
                  </motion.div>
                  
                  <motion.div variants={contentItemVariants} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                   <Link2 className="text-blue-500 mr-2 inline-block" size={18} />
                      Each verification button has its own unique verification link. The
                      same verification link can be used for multiple verification
                      sessions for different users but for the same type of verification.
                    </p>
                    
                    <ul className="ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-300">
                      <li>Shared via email to the end user for verification</li>
                      <li>Inserted into a document without writing a single line of code</li>
                      <li>Used as a button on a website (as an iframe or new window)</li>
                    </ul>
                  </motion.div>
                  
                  <motion.div variants={contentItemVariants} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <FileText className="text-blue-500 mr-2" size={18} />
                      Get the verification link via
                    </h4>
                    
                    <ul className="ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-300">
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
                          <code className="text-sm break-all font-mono">{copyLink}</code>
                          <button
                            onClick={() => copyToClipboard(copyLink)}
                            className="ml-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Copy link to clipboard"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div variants={contentItemVariants} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center" id="copy-link-use-as-iframe">
                      <Share2 className="text-blue-500 mr-2" size={18} />
                      Copy link (use an Iframe or new window)
                    </h4>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Use the verification links to start a verification session. You may
                      configure the behavior of the link by modifying the button settings
                      for the link.
                    </p>
                    
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <MessageSquare className="text-blue-500 mr-2" size={16} />
                      Best practice
                    </h5>
                    
                    <ul className="ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-300">
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
                          <br />
                          Example:
                          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                            <code className="text-sm break-all font-mono">
                              {"{"}sessionid: "IN-OaBTRQ", buttonid: "O.IN-X16BzE-xPg",
                              progress_status:"Started"{"}"}
                            </code>
                          </div>
                        </li>
                      </ul>
                    </ul>
                  </motion.div>
                  
                  <motion.div variants={contentItemVariants} className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center" id="add-customer-refrence-number">
                      <Tag className="text-blue-500 mr-2" size={18} />
                      Add customer reference number
                    </h4>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      A custom tracking id can be added to the link or it can be left
                      empty.
                    </p>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      You can add a custom value at the end (in green). For example, your
                      client's id, account number or any identifier. It should preferably
                      be your customer's email address or otherwise any unique identifier
                      to tag/ track a unique verification session.
                    </p>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-3 font-mono text-sm">
                      …instance <span className="text-green-500">&trackid=johndoe@johndoe.com</span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      It can be used to deposit verified PDFs via email into your CRM
                      directly (for CRM set up please contact support@diro.io).
                    </p>
                    
                    <ul className="ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-300 mb-4">
                      <li>
                        <span className="font-medium">It should be unique</span> per end customer.
                      </li>
                      <li>
                        It can be alphanumeric having a maximum length of 50 characters.
                      </li>
                      <li>
                        Multiple trackid keys can be passed in one verification link
                      </li>
                    </ul>
                    
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <Database className="text-blue-500 mr-2" size={16} />
                      Setting a custom field as <span className="font-medium">Track ID -</span>
                    </h5>
                    
                    <ul className="ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-300">
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
                    </ul>
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
