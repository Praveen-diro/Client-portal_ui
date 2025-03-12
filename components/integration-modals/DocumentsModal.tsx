"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize, Minimize, FileText, Download, ExternalLink } from "lucide-react";
import Image from "next/image";

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Add PDF Preview component
const PDFThumbnail = ({ url }: { url: string }) => {
  return (
    <div className="relative w-full h-full">
      <object
        data={`${url}#page=1&view=Fit`}
        type="application/pdf"
        className="absolute inset-0 w-full h-full"
      >
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
      </object>
    </div>
  );
};

// Sample PDF data
const pdfDocuments = [
  {
    id: 1,
    title: "API interaction overview",
    description: "Detailed diagram of the interaction process flow",
    thumbnail: "/pdfs/diro-interaction-diagram2_up.svg",
    pdfUrl: "/pdfs/diro-interaction-diagram2_up.svg",
    type: "svg"
  },
  {
    id: 2,
    title: "Iframe Integration Guide",
    description: "Step-by-step instructions for iframe implementation",
    thumbnail: "/pdfs/IframeIntegration.pdf",
    pdfUrl: "/pdfs/IframeIntegration.pdf",
    type: "pdf"
  },
  {
    id: 3,
    title: "Sample Certified Original",
    description: "Example of a certified document with verification details",
    thumbnail: "/pdfs/Sample certified original.pdf",
    pdfUrl: "/pdfs/Sample certified original.pdf",
    type: "pdf"
  },
  {
    id: 4,
    title: "Sample Uncertified",
    description: "Example of an uncertified document",
    thumbnail: "/pdfs/Sample uncertified.pdf",
    pdfUrl: "/pdfs/Sample uncertified.pdf",
    type: "pdf"
  },
  {
    id: 5,
    title: "DIRO Data Dictionary",
    description: "Complete reference of all data fields and formats",
    thumbnail: "/pdfs/DIRODataDictionary.pdf",
    pdfUrl: "/pdfs/DIRODataDictionary.pdf",
    type: "pdf"
  },
];

export default function DocumentsModal({ isOpen, onClose }: DocumentsModalProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<typeof pdfDocuments[0] | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPdf) {
          setSelectedPdf(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    
    document.title = isOpen ? "Documentation" : document.title;
    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, selectedPdf]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && isOpen) {
        if (selectedPdf) {
          // If a PDF is selected, just close the PDF view
          setSelectedPdf(null);
        } else {
          // Otherwise close the entire modal
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, selectedPdf]);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
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
          onClick={() => selectedPdf ? setSelectedPdf(null) : onClose()}
        >
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={`bg-white dark:bg-gray-800 rounded-xl w-[95%] sm:w-[90%] md:max-w-4xl overflow-hidden shadow-xl`}
          >
            <div className="flex flex-col h-[90vh]">
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FileText className="mr-2 text-blue-600 dark:text-blue-400" size={24} />
                  {selectedPdf ? selectedPdf.title : "Documentation"}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMaximize}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isMaximized ? "Minimize" : "Maximize"}
                  >
                    {isMaximized ? <Minimize size={20} /> : <Maximize size={20} />}
                  </button>
                  <button
                    onClick={() => selectedPdf ? setSelectedPdf(null) : onClose()}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <AnimatePresence mode="wait">
                  {selectedPdf ? (
                    <motion.div
                      key="pdf-viewer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {selectedPdf.title}
                        </h3>
                        <div className="flex gap-2">
                          <a 
                            href={selectedPdf.pdfUrl} 
                            download
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            <Download size={16} />
                            Download
                          </a>
                          <a 
                            href={selectedPdf.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <ExternalLink size={16} />
                            Open
                          </a>
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <iframe 
                          src={`${selectedPdf.pdfUrl}#toolbar=0&navpanes=0`} 
                          className="w-full h-full border-0"
                          title={selectedPdf.title}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="pdf-grid"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {pdfDocuments.map((doc) => (
                        <motion.div
                          key={doc.id}
                          variants={itemVariants}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                          onClick={() => setSelectedPdf(doc)}
                        >
                          <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-full relative">
                                {doc.type === 'svg' ? (
                                  <Image
                                    src={doc.thumbnail}
                                    alt={doc.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <PDFThumbnail url={doc.thumbnail} />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <div className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <Maximize size={20} className="text-blue-600 dark:text-blue-400" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{doc.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{doc.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 