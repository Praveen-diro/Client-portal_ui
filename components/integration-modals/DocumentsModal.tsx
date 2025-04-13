"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize, Minimize, FileText, Download, ExternalLink, ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { setCookie, getCookie } from 'cookies-next';
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Add PDF Preview component
const PDFThumbnail = ({ url }: { url: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 z-10">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}
      <object
        data={`${url}#page=1&view=Fit`}
        type="application/pdf"
        className="absolute inset-0 w-full h-full"
        onLoad={() => setIsLoading(false)}
      >
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
      </object>
    </div>
  );
};

// Loading shimmer effect component
const Shimmer = () => (
  <div className="animate-pulse rounded-lg overflow-hidden">
    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    </div>
  </div>
);

// PDF Loading Skeleton component
const PDFSkeleton = () => (
  <div className="h-full flex flex-col">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
      <div className="flex gap-2 w-full sm:w-auto">
        <div className="h-9 bg-blue-100 dark:bg-blue-900/20 rounded w-28 animate-pulse"></div>
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
      </div>
    </div>
    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Loading PDF...</p>
        </div>
      </div>
    </div>
  </div>
);

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
  const [isLoading, setIsLoading] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Reset PDF loaded state when changing PDFs
  useEffect(() => {
    if (selectedPdf) {
      setPdfLoaded(false);
    }
  }, [selectedPdf?.id]);

  // Load the selected PDF from cookie when the modal opens
  useEffect(() => {
    if (isOpen) {
      const savedPdfId = getCookie('selectedPdfId');
      if (savedPdfId) {
        const pdf = pdfDocuments.find(doc => doc.id === Number(savedPdfId));
        if (pdf) {
          setSelectedPdf(pdf);
        }
      }
    }
  }, [isOpen]);

  // Save the selected PDF to cookie
  useEffect(() => {
    if (selectedPdf) {
      setCookie('selectedPdfId', selectedPdf.id.toString(), { maxAge: 60 * 60 * 24 * 7 }); // 7 days
    }
  }, [selectedPdf]);

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

  // Handle loading state
  const handlePdfSelect = (pdf: typeof pdfDocuments[0]) => {
    setIsLoading(true);
    setPdfLoaded(false);
    setSelectedPdf(pdf);
    
    // If it's an SVG, we can set loaded faster
    if (pdf.type === 'svg') {
      setTimeout(() => {
        setIsLoading(false);
        setPdfLoaded(true);
      }, 300);
    } else {
      // For PDFs, we'll let the iframe onLoad handle it
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
    setPdfLoaded(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm",
            isDark ? "bg-black/80" : "bg-black/60"
          )}
          onClick={onClose}
        >
          <motion.div 
            className={cn(
              "relative rounded-xl shadow-2xl w-[95%] md:w-[90%] md:max-w-4xl overflow-hidden border",
              isDark ? "bg-[#1A1F2C] border-gray-700/50" : "bg-white border-gray-200/50"
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
                "sticky top-0 z-10 flex justify-between items-center p-5 border-b",
                isDark ? "bg-[#1A1F2C] border-gray-700/50" : "bg-white border-gray-200/50"
              )}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  {selectedPdf ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPdf(null);
                        setPdfLoaded(false);
                      }} 
                      className="mr-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  ) : (
                    <FileText className="mr-2 text-blue-600 dark:text-blue-400" size={24} />
                  )}
                  {selectedPdf ? (
                    <span className="flex items-center">
                      {selectedPdf.title}
                      {isLoading && <Loader2 className="w-4 h-4 text-blue-500 animate-spin ml-2" />}
                    </span>
                  ) : "Documentation"}
                </h2>
                <div className="flex items-center gap-2">
                  {/* <button
                    onClick={toggleMaximize}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isMaximized ? "Minimize" : "Maximize"}
                  >
                    {isMaximized ? <Minimize size={20} /> : <Maximize size={20} />}
                  </button> */}
                  <motion.button
                    onClick={() => selectedPdf ? setSelectedPdf(null) : onClose()}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    aria-label="Close"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {selectedPdf ? (
                    <motion.div
                      key="pdf-viewer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      {isLoading ? (
                        <PDFSkeleton />
                      ) : (
                        <div className="h-full flex flex-col">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {selectedPdf.title}
                            </h3>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <a 
                                href={selectedPdf.pdfUrl} 
                                download
                                className="flex items-center justify-center sm:justify-start gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors w-full sm:w-auto"
                              >
                                <Download size={16} />
                                <span>Download</span>
                              </a>
                              <a 
                                href={selectedPdf.pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center sm:justify-start gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto"
                              >
                                <ExternalLink size={16} />
                                <span>Open</span>
                              </a>
                            </div>
                          </div>
                          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                            {!pdfLoaded && (
                              <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-100 dark:bg-gray-700">
                                <div className="flex flex-col items-center">
                                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Loading document...</p>
                                </div>
                              </div>
                            )}
                            {selectedPdf.type === 'svg' ? (
                              <div className={`w-full h-full relative ${pdfLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                                <Image 
                                  src={selectedPdf.pdfUrl}
                                  alt={selectedPdf.title}
                                  fill
                                  className="object-contain"
                                  onLoadingComplete={() => setPdfLoaded(true)}
                                  priority
                                />
                              </div>
                            ) : (
                              <iframe 
                                ref={iframeRef}
                                src={`${selectedPdf.pdfUrl}#toolbar=0&navpanes=0`} 
                                className={`w-full h-full border-0 ${pdfLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                                title={selectedPdf.title}
                                onLoad={handleIframeLoad}
                              />
                            )}
                          </div>
                        </div>
                      )}
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
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      {pdfDocuments.map((doc) => (
                        <motion.div
                          key={doc.id}
                          variants={itemVariants}
                          className={cn(
                            "rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group",
                            "border hover:border-blue-300/50 dark:hover:border-blue-500/30",
                            "transform hover:-translate-y-1 duration-200",
                            isDark ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200"
                          )}
                          onClick={() => handlePdfSelect(doc)}
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