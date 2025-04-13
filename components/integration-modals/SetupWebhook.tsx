"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cable, X, Copy, Check, AlertCircle, Info, ExternalLink, 
  Bell, FileText, FileJson, AlertTriangle, ArrowRight, 
  Zap, CheckCircle2, ArrowUpDown
} from "lucide-react";

interface CopyToClipboardButtonProps {
  textToCopy: string;
  className?: string;
}

const CopyToClipboardButton = ({ textToCopy, className = "" }: CopyToClipboardButtonProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button 
      onClick={handleCopy} 
      className={`transition-colors ${className}`}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
    </button>
  );
};

interface NotificationCardProps {
  title: string;
  description: string;
  items?: string[];
  path?: string;
  icon?: React.ReactNode;
  color: string;
}

const NotificationCard = ({ title, description, items, path, icon, color }: NotificationCardProps) => {
  const getBgColor = () => {
    switch(color) {
      case 'blue': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30';
      case 'green': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30';
      case 'amber': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30';
      case 'red': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';
      default: return 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-700';
    }
  };

  const getHeaderColor = () => {
    switch(color) {
      case 'blue': return 'text-blue-700 dark:text-blue-400';
      case 'green': return 'text-green-700 dark:text-green-400';
      case 'amber': return 'text-amber-700 dark:text-amber-400';
      case 'red': return 'text-red-700 dark:text-red-400';
      default: return 'text-gray-900 dark:text-white';
    }
  };

  const getIconBg = () => {
    switch(color) {
      case 'blue': return 'bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-400';
      case 'green': return 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-400';
      case 'amber': return 'bg-amber-100 dark:bg-amber-800/30 text-amber-700 dark:text-amber-400';
      case 'red': return 'bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className={`rounded-lg p-5 border shadow-sm hover:shadow-md transition-shadow ${getBgColor()}`}>
      <h4 className={`font-medium mb-2 flex items-center gap-2 ${getHeaderColor()}`}>
        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconBg()}`}>
          {icon}
        </span>
        {title}
      </h4>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
        {description}
      </p>
      {path && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2 bg-white/70 dark:bg-gray-800/50 p-2 rounded-md">
          <ArrowRight size={12} className={getHeaderColor()} />
          <span>Navigate to: {path}</span>
        </div>
      )}
      {items && items.length > 0 && (
        <div className="bg-white/80 dark:bg-gray-800/50 rounded-lg p-3 mt-2">
          <ul className="text-sm text-gray-700 dark:text-gray-300 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            {items.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className={`mr-2 ${getHeaderColor()}`}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface SetupWebhookProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupWebhook({ isOpen, onClose }: SetupWebhookProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isUrlTested, setIsUrlTested] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.title = "Setup Webhook";
    document.addEventListener('keydown', handleEscapeKey);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleTestUrl = () => {
    // Mock URL testing - would be replaced with actual API call
    if (webhookUrl.trim().startsWith('http')) {
      setTestSuccess(true);
    } else {
      setTestSuccess(false);
    }
    setIsUrlTested(true);
    setTimeout(() => setIsUrlTested(false), 3000);
  };

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
          <motion.div 
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[95%] sm:w-[90%] md:max-w-4xl overflow-hidden border border-gray-200 dark:border-gray-700"
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
              <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <h2 
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"
                >
                  <Cable className="text-blue-500" size={22} />
                  Setup Webhook
                </h2>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin !scrollbar-w-1.5 scrollbar-thumb-blue-500 dark:scrollbar-thumb-blue-400 scrollbar-track-transparent hover:scrollbar-thumb-blue-600 dark:hover:scrollbar-thumb-blue-300">
                <div className="p-6">
                  <div className="space-y-8">
                    {/* Default Organization Webhook Section */}
                    <section className="space-y-4 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent p-5 rounded-lg border-2 border-blue-200 dark:border-blue-800/60 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-xs font-bold">1</span>
                        Default Organization Webhook
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        A default Webhook URL can be configured for the entire organization.
                      </p>
                      <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex items-start">
                        <Info size={16} className="mr-2 shrink-0 mt-0.5" />
                        <span>Go to developers (left vertical nav bar) ➜ callback logs ➜ click on settings icon (top-right).</span>
                      </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex items-start">
                        <Info size={16} className="mr-2 shrink-0 mt-0.5" />
                        {/* <p className="text-sm text-gray-700 dark:text-gray-300"> */}
                          Please enter the URL at which you wish to receive the webhook on. This will be used as default for all the different types of verifications in the organization. You may test if the URL is working.
                        {/* </p> */}
                      </div>
                    </section>

                    {/* URL Override Section */}
                    <section className="space-y-4 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent p-5 rounded-lg border-2 border-purple-200 dark:border-purple-800/60 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-xs font-bold">2</span>
                        Setup URL Override
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        The webhook URL can also be set up per button under button settings as an override.
                      </p>
                      <div className="text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md flex items-start">
                        <Info size={16} className="mr-2 shrink-0 mt-0.5" />
                        <span>Please go to verification buttons on the left vertical bar and then click on setting icon of the respective button to access setting then go to "After Verification" Section then update value against label "Override default callback URL"</span>
                      </div>
                    </section>

                    {/* Webhook Notifications Section */}
                    <section className="space-y-5 border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800">
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="bg-indigo-100 dark:bg-indigo-800/30 p-2 rounded-lg">
                          <Zap size={22} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Webhook Notifications
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
                        <NotificationCard 
                          title="1. Engagement Status (Final)"
                          description="Triggered when verification session begins or completes"
                          path="get-verification-link ➜ callbacks ➜ engagement status"
                          icon={<Bell size={16} />}
                          color="blue"
                          items={[
                            "Started", "Tried upload", "Document already verified", 
                            "Live feedback", "Tamper check", "Uploaded document not supported",
                            "Verification started", "Done, now in Review", "Upload error",
                            "User exit", "Abandon", "JSON requested",
                            "JSON ready", "Done"
                          ]}
                        />

                        <NotificationCard 
                          title="2. Document Submitted"
                          description="Triggered when a document is submitted"
                          path="get-verification-link ➜ callbacks ➜ document upload"
                          icon={<FileText size={16} />}
                          color="green"
                        />

                        <NotificationCard 
                          title="3. Interim / Final JSON"
                          description="Triggered when automatic extraction is enabled or requested via API"
                          path="pdf-to-json ➜ callbacks ➜ JSON success / Combine JSON"
                          icon={<FileJson size={16} />}
                          color="amber"
                        />

                        <NotificationCard 
                          title="4. JSON Failure"
                          description="Triggered when the submitted document is not correct for JSON processing"
                          path="pdf-to-json ➜ callbacks ➜ JSON failure"
                          icon={<AlertTriangle size={16} />}
                          color="red"
                        />
                      </div>
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