"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Trash2, AlertTriangle, Code } from "lucide-react";

interface DeleteDataApiProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteDataApi({ isOpen, onClose }: DeleteDataApiProps) {
  const [apiKey, setApiKey] = useState("sk_live_Abcd1234Efgh5678Ijkl9012");
  const [copied, setCopied] = useState<string | null>(null);
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
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

  // API request examples
  const deleteRequestExample = `curl -X DELETE \\
  https://api.example.com/v1/data/VER123456 \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`;

  const deleteResponseExample = `{
  "id": "VER123456",
  "status": "deleted",
  "deleted_at": "2023-11-15T14:22:33Z",
  "deleted_by": "API",
  "success": true
}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          <motion.div 
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Delete Data API
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Important Notice</h4>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                      Data deletion is permanent and cannot be undone. Make sure you have proper authorization before deleting any user data.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
                    <Trash2 size={18} />
                    API Endpoint for Data Deletion
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      API Endpoint
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value="https://api.example.com/v1/data/{verification_id}"
                        readOnly
                        className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      />
                      <button
                        onClick={() => handleCopy("https://api.example.com/v1/data/{verification_id}", "endpoint")}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {copied === "endpoint" ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Use a DELETE HTTP method with your API key to remove data for a specific verification.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Your API Key
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => handleCopy(apiKey, "key")}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {copied === "key" ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
                    <Code size={18} />
                    Example API Request
                  </h3>
                  
                  <div className="relative">
                    <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm text-gray-800 dark:text-gray-200 overflow-x-auto border border-gray-200 dark:border-gray-700">
                      {deleteRequestExample}
                    </pre>
                    <button
                      onClick={() => handleCopy(deleteRequestExample, "request")}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-200/70 dark:bg-gray-700/70 backdrop-blur-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      {copied === "request" ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-700 dark:text-gray-300" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
                    Example Response
                  </h3>
                  
                  <div className="relative">
                    <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm text-gray-800 dark:text-gray-200 overflow-x-auto border border-gray-200 dark:border-gray-700">
                      {deleteResponseExample}
                    </pre>
                    <button
                      onClick={() => handleCopy(deleteResponseExample, "response")}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-200/70 dark:bg-gray-700/70 backdrop-blur-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      {copied === "response" ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-700 dark:text-gray-300" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      You can also use our server-side SDKs to call the deletion API. Available for Node.js, Python, Ruby, PHP, Java, and .NET.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Footer/Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 