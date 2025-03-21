"use client";

import { useState, useEffect, useRef, Component, ErrorInfo, ReactNode, memo } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  FileText,
  Download,
  Languages,
  CheckCircle,
  XCircle,
  Search,
  User,
  Check,
  X,
  Maximize,
  Minimize,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/ui/loader";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import BackButton from "@/components/ui/back-button";

import { viewDocService } from "@/app/services/viewdoc.service";
import { env } from "@/app/config/environment";
import { useToast } from "@/components/ui/use-toast";
import { setDocumentData, setDataPdf, setViewDocLoading } from "@/app/store/features/viewDocSlice";
import { RootState } from "@/app/store/store";

// Dynamically import react-pdf components with SSR disabled
const PDFDocument = dynamic(() => import("react-pdf").then((mod) => mod.Document), { ssr: false });
const PDFPage = dynamic(() => import("react-pdf").then((mod) => mod.Page), { ssr: false });

// Helper functions
const getHostnameFromRegex = (url: string) => {
  const matches = url?.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  return matches && matches[1];
};

const formatDate = (timestamp: number) => {
  if (!timestamp) return "Not available";
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

const base64ToArrayBuffer = (base64: string) => {
  try {
    // Remove any potential data URL prefix if present
    const base64Data = base64.includes("base64,") ? base64.split("base64,")[1] : base64;

    const binary_string = atob(base64Data);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    console.error("Error processing base64 data:", error);
    return null;
  }
};

// Error boundary for PDF rendering
class PDFErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("PDF Rendering Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
          <XCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">PDF Rendering Error</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {this.state.error?.message || "There was an error rendering the PDF"}
          </p>
          <Button variant="outline" onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Define a function to check if a URL exists
const checkUrlExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error);
    return false;
  }
};

// Function to try loading worker from different CDNs
const setupPdfWorker = async (pdfjs: any, version: string) => {
  // List of CDNs to try, in order of preference
  const cdns = [
    `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`,
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`,
  ];

  // Try each CDN until one works
  for (const cdn of cdns) {
    console.log(`Trying worker from: ${cdn}`);
    try {
      const exists = await checkUrlExists(cdn);
      if (exists) {
        pdfjs.GlobalWorkerOptions.workerSrc = cdn;
        console.log(`Successfully set worker URL to: ${cdn}`);
        return true;
      }
    } catch (e) {
      console.error(`Failed to check ${cdn}:`, e);
    }
  }

  // If all CDNs fail, use a known working version as fallback
  const fallbackUrl = "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";
  console.warn(`All CDNs failed, using fallback: ${fallbackUrl}`);
  pdfjs.GlobalWorkerOptions.workerSrc = fallbackUrl;
  return false;
};

// Memoized PDF Viewer component to prevent re-renders when modal state changes
const PDFViewerComponent = memo(
  ({
    pdfSource,
    theme,
    isFullscreen,
    toggleFullscreen,
    pdfContainerRef,
  }: {
    pdfSource: string | null;
    theme: string | undefined;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    pdfContainerRef: React.RefObject<HTMLDivElement>;
  }) => {
    return (
      <div
        ref={pdfContainerRef}
        className={`pdf-container flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 flex justify-center ${
          isFullscreen ? "fullscreen" : ""
        }`}
      >
        {pdfSource ? (
          <div className="pdf-container-wrapper relative">
            <div className={`pdf-iframe-container ${theme === "dark" ? "dark" : ""}`}>
              <iframe src={`${pdfSource || ""}#zoom=75`} className="pdf-iframe" title="PDF Document" />
              <div className="pdf-page-effect"></div>
              {theme === "dark" && <div className="pdf-frame-border" />}

              {/* Fullscreen button */}
              <button
                onClick={toggleFullscreen}
                className="absolute top-3 right-3 p-2 rounded bg-white/80 hover:bg-white/90 shadow-sm z-10 dark:bg-gray-900/70 dark:hover:bg-gray-900/90"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground dark:text-gray-400">PDF preview not available</p>
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if these specific props change
    return (
      prevProps.pdfSource === nextProps.pdfSource &&
      prevProps.theme === nextProps.theme &&
      prevProps.isFullscreen === nextProps.isFullscreen
    );
  }
);

PDFViewerComponent.displayName = "PDFViewerComponent";

export default function PdfViewer() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const { viewpdfdata, view_loading, error } = useSelector((state: RootState) => state.viewDoc);

  // State variables
  const [loading, setLoading] = useState(true);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [viewDocData, setViewDocData] = useState<any>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [verifiedFields, setVerifiedFields] = useState<string[]>([]);
  const [warnCases, setWarnCases] = useState<any[]>([]);
  const [verFields, setVerFields] = useState<any[]>([]);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("Duplicate submission");
  const [showTranslationDialog, setShowTranslationDialog] = useState(false);
  const [translatedPdfData, setTranslatedPdfData] = useState<ArrayBuffer | null>(null);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [docInvalid, setDocInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);
  const [workerVersion, setWorkerVersion] = useState("4.10.38");
  const [useFallback, setUseFallback] = useState(false);
  const [pdfDarkModeApplied, setPdfDarkModeApplied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [showCustomReason, setShowCustomReason] = useState(false);

  // Refs
  const isMounted = useRef(true);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pdfUrlRef = useRef<string | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Theme context
  const { theme, setTheme } = useTheme();

  // Initialize PDF.js worker
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-pdf")
        .then(({ pdfjs }) => {
          try {
            // Use the exact API version from pdfjs itself
            const version = pdfjs.version;
            console.log("PDF.js API version:", version);

            // Set worker directly using the same version
            pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`;
            console.log("Worker URL set to:", pdfjs.GlobalWorkerOptions.workerSrc);

            // Update worker version state
            setWorkerVersion(version);
          } catch (err) {
            console.error("Error setting PDF.js worker:", err);
          }
        })
        .catch((err) => {
          console.error("Error loading PDF.js:", err);
        });
    }

    return () => {
      isMounted.current = false;

      // Clean up any blob URLs when component unmounts
      if (pdfUrlRef.current) {
        try {
          URL.revokeObjectURL(pdfUrlRef.current);
          console.log("Cleaned up PDF URL");
        } catch (e) {
          console.error("Error cleaning up PDF URL:", e);
        }
      }

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Effect to track and apply theme changes to PDF
  useEffect(() => {
    if (theme === "dark") {
      setPdfDarkModeApplied(true);
    } else {
      setPdfDarkModeApplied(false);
    }
  }, [theme]);

  // Add event listener for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Fetch document data when component mounts
  useEffect(() => {
    const fetchDocumentData = async () => {
      if (!sessionId) return;

      try {
        setLoading(true);
        console.log("Fetching document data for sessionId:", sessionId);

        // Comment out the lastlinked clicked functionality
        /* 
        // Fetch document metadata first
        const metadataResponse = await viewDocService.getLastClickedDocument(sessionId as string);
        console.log("Metadata Response:", metadataResponse);

        if (!metadataResponse.success) {
          setErrorMessage(metadataResponse.error || "Failed to fetch document metadata");
          setLoading(false);
          return;
        } else {
          // Process metadata
          const metadata = metadataResponse.data;

          if (metadata) {
            // Process verification fields
            dispatch(setDocumentData(metadata));
            let trackId = [];
            if (metadata.data?.capture?.warn_case) {
              trackId = metadata.data.capture.warn_case.filter((res: any) => res.hinttext === "trackid");
            }

            // Process verification fields
            let verifyFields = [];
            if (metadata.button?.capture?.warn_case && metadata.data?.capture?.warn_case) {
              for (let x = 0; x < metadata.button.capture.warn_case.length; x++) {
                let found = false;
                for (let y = 0; y < metadata.data.capture.warn_case.length; y++) {
                  if (metadata.button.capture.warn_case[x].message === metadata.data.capture.warn_case[y].message) {
                    found = true;
                    let data = { ...metadata.button.capture.warn_case[x] };
                    data.keyword = metadata.data.capture.warn_case[y].keyword;
                    verifyFields.push(data);
                  }
                }
                if (!found) {
                  verifyFields.push(metadata.button.capture.warn_case[x]);
                }
              }
            }

            setWarnCases(metadata.data?.capture?.warn_case || []);
            setVerFields([...trackId, ...verifyFields]);

            // Set verified fields from metadata if available
            if (metadata.file?.verifiedfields) {
              setVerifiedFields(metadata.file.verifiedfields);
            }

            // Set view document data
            setViewDocData(metadata);
          }
        }
        */

        // Skip lastlinked clicked functionality - temporarily disabled
        // Create empty metadata for the UI to work with
        setWarnCases([]);
        setVerFields([]);
        setViewDocData({});

        // Now fetch PDF document data (after metadata)
        const downloadResponse = await viewDocService.getDownloadDocument(sessionId as string);
        console.log("Download Response:", downloadResponse);

        if (!downloadResponse.success) {
          if (downloadResponse.message === "You are not allowed to see this document!") {
            setDocInvalid(true);
          } else {
            setErrorMessage(downloadResponse.error || "Failed to download document");
          }
          setLoading(false);
          return;
        }

        // Process the document data
        if (downloadResponse.data?.base64) {
          try {
            const pdfArrayBuffer = base64ToArrayBuffer(downloadResponse.data.base64);
            if (pdfArrayBuffer) {
              setPdfData(pdfArrayBuffer);
              console.log("PDF data processed successfully:", !!pdfArrayBuffer, "Size:", pdfArrayBuffer.byteLength);

              // Log the first few bytes to check if it's a valid PDF (should start with %PDF)
              const firstBytes = new Uint8Array(pdfArrayBuffer.slice(0, 8));
              const header = String.fromCharCode.apply(null, Array.from(firstBytes));
              console.log("PDF header check:", header);

              if (!header.startsWith("%PDF")) {
                console.warn("PDF header does not start with %PDF - this may not be a valid PDF file");
              }
            } else {
              console.error("Failed to process PDF data: null array buffer");
              setErrorMessage("Failed to process PDF data. The file may be corrupted.");
            }
          } catch (err) {
            console.error("Error processing PDF data:", err);
            setErrorMessage("Failed to process PDF data. The file may be corrupted.");
          }
        }
        dispatch(setDataPdf(downloadResponse.data));
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching document data:", err);
        if (isMounted.current) {
          setErrorMessage(err.message || "An error occurred while fetching document data");
          setLoading(false);
        }
      }
    };

    fetchDocumentData();
  }, [sessionId]);

  // Function to handle PDF document load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("PDF loaded successfully with", numPages, "pages");
    setNumPages(numPages);
    // Clear any previous load errors
    setPdfLoadError(null);
  };

  // Function to handle PDF document load error with fallback
  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);

    // Check for version mismatch errors
    if (error.message.includes("version")) {
      console.log("Version mismatch detected, switching to fallback renderer");
      setUseFallback(true);
    }

    setPdfLoadError(error.message || "Failed to load PDF");
  };

  // Function to handle downloading PDF
  const handleDownloadPdf = () => {
    if (!pdfData) return;

    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sessionId}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Function to handle translating PDF
  const handleTranslatePdf = async () => {
    if (!sessionId) return;

    try {
      setTranslationLoading(true);
      setTranslationError(null);
      setShowTranslationDialog(true);

      // API call to translate PDF
      const response = await fetch(env.translatepdf, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          Authorization: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          targetlanguage: "en",
          docid: sessionId,
          filenumber: 1,
          apikey: localStorage.getItem("apikey") || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data = await response.arrayBuffer();
      setTranslatedPdfData(data);
      setTranslationLoading(false);
    } catch (err: any) {
      setTranslationError(err.message || "Translation failed");
      setTranslationLoading(false);
    }
  };

  // Function to handle downloading translated PDF
  const handleDownloadTranslatedPdf = () => {
    if (!translatedPdfData) return;

    const blob = new Blob([translatedPdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sessionId}_translated.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Function to handle field verification
  const handleFieldToggle = (field: string) => {
    setVerifiedFields((prev) => {
      const index = prev.indexOf(field);
      if (index > -1) {
        return prev.filter((item) => item !== field);
      } else {
        return [...prev, field];
      }
    });
  };

  // Function to handle document approval
  const handleApprove = async () => {
    if (!sessionId) return;

    try {
      const response = await viewDocService.approveDocument({
        docid: sessionId,
        status: "verified",
        verifiedfields: verifiedFields,
        apikey: localStorage.getItem("apikey") || "",
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to approve document");
      }

      setShowApproveDialog(false);
      toast({
        title: "Document Approved",
        description: "The document has been successfully approved.",
        variant: "default", // Using default variant
      });

      // Redirect to the documents page after a short delay
      toastTimeoutRef.current = setTimeout(() => {
        window.location.href = "/client/documents-received";
      }, 2000);
    } catch (err: any) {
      toast({
        title: "Approval Failed",
        description: err.message || "An error occurred while approving the document.",
        variant: "destructive",
      });
    }
  };

  // Function to handle document rejection
  const handleReject = async () => {
    if (!sessionId) return;

    try {
      // Show loading state
      setLoading(true);

      const response = await viewDocService.rejectDocument({
        docid: sessionId,
        status: "rejected",
        remarks: rejectReason,
        verifiedfields: verifiedFields,
        apikey: localStorage.getItem("apikey") || "",
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to reject document");
      }

      // Close the dialog first
      setShowRejectDialog(false);

      // Show success message
      toast({
        title: "Document Rejected",
        description: "The document has been rejected.",
        variant: "destructive",
      });

      // Prevent any other API calls by using state
      setDocInvalid(true);

      // Redirect to the documents page after a short delay without triggering other APIs
      toastTimeoutRef.current = setTimeout(() => {
        // Use direct navigation instead of triggering other page loads
        window.location.href = "/client/documents-received";
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      toast({
        title: "Rejection Failed",
        description: err.message || "An error occurred while rejecting the document.",
        variant: "destructive",
      });
    }
  };

  // Handle navigation back to documents page
  const handleBack = () => {
    window.location.href = "/client/documents-received";
  };

  // Add theme toggle handler
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Function to handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!pdfContainerRef.current) return;

    if (!isFullscreen) {
      if (pdfContainerRef.current.requestFullscreen) {
        pdfContainerRef.current
          .requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch((err) => console.error("Error attempting to enable fullscreen:", err));
      } else if ((pdfContainerRef.current as any).webkitRequestFullscreen) {
        (pdfContainerRef.current as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if ((pdfContainerRef.current as any).msRequestFullscreen) {
        (pdfContainerRef.current as any).msRequestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch((err) => console.error("Error attempting to exit fullscreen:", err));
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
        setIsFullscreen(false);
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // For development debugging - just to show something is loading
  console.log("PDF Viewer rendering. SessionId:", sessionId);

  // If the document is invalid
  if (docInvalid) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
          {/* Red X Icon Circle */}
          <div className="mx-auto my-6 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center">
              <X className="h-12 w-12 text-red-500" />
            </div>
          </div>

          {/* Rejected Title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Rejected!</h2>

          {/* Rejected Message */}
          <p className="text-xl text-gray-500 mb-8">You rejected document!</p>

          {/* Close Button */}
          <button
            onClick={handleBack}
            className="bg-blue-300 hover:bg-blue-400 text-white py-3 px-16 rounded-md text-xl font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // If there's an error
  if (errorMessage) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Card className="w-[400px]">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Error</h3>
              <p className="text-muted-foreground text-center">{errorMessage}</p>
              <Button onClick={handleBack}>Back to Documents</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If it's loading
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader />
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  // Get document URL/source
  let pdfSource = null;
  let pdfUrlCreated = false;

  if (pdfData) {
    try {
      // Method 1: Create a blob URL (most common approach)
      const blob = new Blob([pdfData], { type: "application/pdf" });
      pdfSource = URL.createObjectURL(blob);
      pdfUrlCreated = true;

      // Store the URL reference for cleanup
      pdfUrlRef.current = pdfSource;

      console.log("PDF URL created successfully using Blob method");
    } catch (error) {
      console.error("Error creating PDF URL from blob:", error);
      pdfSource = null;
    }
  }

  console.log("PDF source created:", !!pdfSource);

  // Prepare MHT files display
  const mhtFiles = viewDocData?.file?.mhtmlhashkey ? Object.keys(viewDocData.file.mhtmlhashkey) : [];

  return (
    <div className="container mx-auto px-4 mt-6">
      {/* Include global styles for PDF dark mode */}
      <style jsx global>
        {`
          /* Remove invert filter to keep PDF content in its original colors */
          .pdf-iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block; /* Remove any inline spacing */
            background-color: white !important; /* Always keep PDF background white */
          }

          /* Add blur effect to dialog backdrop when open */
          [data-state="open"][data-dialog-overlay] {
            backdrop-filter: blur(4px);
          }

          .pdf-container-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 10px;
            background-color: transparent; /* Allow parent background to show through */
          }

          .pdf-iframe-container {
            width: 100%;
            height: 100%;
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            transition: box-shadow 0.3s ease, background-color 0.3s ease;
            background-color: white; /* Light theme background */
          }

          /* Different shadow and background for dark mode */
          .dark .pdf-iframe-container {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            background-color: #1e1e2e; /* Dark theme background for container only */
          }

          .pdf-frame-border {
            position: absolute;
            inset: 0;
            border: 1px solid rgb(24, 30, 46);
            border-radius: 4px;
            pointer-events: none;
          }

          /* Add a subtle page effect with inner shadow */
          .pdf-page-effect {
            position: absolute;
            inset: 0;
            pointer-events: none;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.02);
            border-radius: 4px;
          }

          .dark .pdf-page-effect {
            box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.01);
          }

          /* Fullscreen styling */
          .pdf-container.fullscreen {
            padding: 0;
            background-color: white;
          }

          .dark .pdf-container.fullscreen {
            background-color: #1e1e2e;
          }

          :fullscreen .pdf-iframe-container {
            border-radius: 0;
            border: none;
          }

          :fullscreen .pdf-container-wrapper {
            padding: 0;
          }

          :fullscreen .pdf-page-effect {
            border-radius: 0;
          }

          :fullscreen .pdf-frame-border {
            border-radius: 0;
          }

          /* PDF toolbar styling */
          .pdf-toolbar {
            background-color: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            padding: 8px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .dark .pdf-toolbar {
            background-color: #1f2937;
            border-bottom: 1px solid #374151;
          }

          /* Verification section styling */
          .verification-item {
            padding: 8px 12px;
            border-radius: 4px;
            transition: background-color 0.2s;
          }

          .verification-item:hover {
            background-color: rgba(0, 0, 0, 0.03);
          }

          .dark .verification-item:hover {
            background-color: rgba(255, 255, 255, 0.05);
          }

          /* Add custom scrollbar for the options list */
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.3);
            border-radius: 20px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(156, 163, 175, 0.5);
          }
        `}
      </style>

      {/* Main document container with sidebar and PDF viewer */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row min-h-[700px]">
          {/* Left sidebar for document verification */}
          <div className="md:w-[350px] border-r border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-900">
            {/* Replace the existing back button with our custom BackButton component */}
            <BackButton onClick={handleBack} className="mb-4" />

            <h2 className="text-xl font-semibold mb-6">Document Verification</h2>

            {/* User info */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-amber-600" />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-base">{viewDocData?.doc?.firstname || "User"}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{viewDocData?.doc?.mobile || "demo@diro.io"}</p>
              </div>
            </div>

            {/* Website and date */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-sm mb-1">
                {getHostnameFromRegex(viewDocData?.url) || viewDocData?.url || "https://testing99.diro.me/"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(viewDocData?.doc?.crtime) || "18/02/2025"}</p>
            </div>

            <h3 className="text-base font-medium text-blue-600 dark:text-blue-400 mb-3">Information to be verified</h3>

            <div className="space-y-1 mb-8 max-h-[250px] overflow-y-auto">
              {verFields.length > 0 ? (
                verFields.map((field, index) => (
                  <div key={`${field.message}-${index}`} className="verification-item">
                    <div className="flex items-start">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <Checkbox
                          id={`field-${index}`}
                          checked={verifiedFields.includes(field.message)}
                          onCheckedChange={() => handleFieldToggle(field.message)}
                          className="mt-0.5"
                        />
                        <Label htmlFor={`field-${index}`} className="text-sm cursor-pointer line-clamp-2">
                          {field.message}
                        </Label>
                      </div>

                      {field.keyword && (
                        <div
                          className="flex items-center justify-center h-6 w-6 ml-2 shrink-0 border border-gray-200 dark:border-gray-700 rounded"
                          title={`Search keyword: ${field.keyword}`}
                        >
                          <Search className="h-3 w-3 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : warnCases.length > 0 ? (
                warnCases.map((field, index) => (
                  <div key={`${field.message}-${index}`} className="verification-item">
                    <div className="flex items-start">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <Checkbox
                          id={`field-${index}`}
                          checked={verifiedFields.includes(field.message)}
                          onCheckedChange={() => handleFieldToggle(field.message)}
                          className="mt-0.5"
                        />
                        <Label htmlFor={`field-${index}`} className="text-sm cursor-pointer line-clamp-2">
                          {field.message}
                        </Label>
                      </div>

                      {field.keyword && (
                        <div
                          className="flex items-center justify-center h-6 w-6 ml-2 shrink-0 border border-gray-200 dark:border-gray-700 rounded"
                          title={`Search keyword: ${field.keyword}`}
                        >
                          <Search className="h-3 w-3 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No fields to verify</p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowApproveDialog(true)}
                variant="default"
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>

              <Button onClick={() => setShowRejectDialog(true)} variant="outline" className="w-full border-gray-300">
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>

          {/* PDF viewer section */}
          <div className="flex-1 flex flex-col">
            {/* PDF toolbar */}
            <div className="pdf-toolbar">
              {/* Back button removed from here and moved to top container */}
              <div className="flex items-center gap-3 ml-auto">
                {!viewDocData?.data?.shareonlyjson && mhtFiles.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Download:</span>
                    <div className="flex flex-wrap gap-1">
                      {mhtFiles.map((key, index) => (
                        <TooltipProvider key={key}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={`${env.downloadmht}?docid=${sessionId}&filename=${key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                              >
                                {index + 1}
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>Download original MHT file {index + 1}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {!viewDocData?.shareonlyjson && viewDocData?.button?.mode?.type !== "capture" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTranslatePdf}
                      disabled={translationLoading}
                      className="h-8 px-3 text-sm border-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <Languages className="mr-2 h-4 w-4" />
                      Translate (En)
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Use the memoized PDF viewer component */}
            <PDFViewerComponent
              pdfSource={pdfSource}
              theme={theme}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
              pdfContainerRef={pdfContainerRef}
            />
          </div>
        </div>
      </div>

      {/* Theme toggle - positioned at bottom left */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 left-4 p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors shadow-md z-10"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Approval Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent className="dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Approve Document</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              Are you sure you want to approve this document?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction className="dark:bg-green-700 dark:text-white dark:hover:bg-green-600" onClick={handleApprove}>
              <Check className="mr-2 h-4 w-4" />
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="p-0 max-w-[850px] rounded-xl overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Document Rejection</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row">
            {/* Left sidebar with decorative elements */}
            <div className="w-full md:w-[280px] bg-gradient-to-b from-[#1E1E2E] to-[#2D2D44] p-6 md:p-8 relative overflow-hidden">
              {/* Beautiful decorative elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500 rounded-full opacity-10"></div>
              <div className="absolute top-1/3 -left-16 w-32 h-32 bg-blue-500 rounded-full opacity-10"></div>
              <div className="absolute bottom-10 right-20 w-24 h-24 bg-pink-500 rounded-full opacity-10"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-md">
                    <X className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                    Document Rejection
                  </h3>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Please select a reason for rejection to help the user understand why this document was not accepted.
                </p>

                <div className="mt-10 space-y-3">
                  <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-transparent rounded-full"></div>
                  <div className="h-1 w-16 bg-gradient-to-r from-red-500/70 to-transparent rounded-full"></div>
                  <div className="h-1 w-12 bg-gradient-to-r from-red-500/40 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Right content area */}
            <div className="w-full md:flex-1 bg-white dark:bg-gray-900 p-6 md:p-8 relative">
              <div className="mt-2 mb-7">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Select a reason for rejection</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose the most appropriate reason why this document is being rejected
                </p>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {viewDocData?.button?.reject_reasons && viewDocData.button.reject_reasons.length > 0 ? (
                  viewDocData.button.reject_reasons.map((reason: string) => (
                    <div
                      key={reason}
                      className={`flex items-start p-4 cursor-pointer transition-all rounded-lg ${
                        rejectReason === reason
                          ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent"
                      }`}
                      onClick={() => {
                        setRejectReason(reason);
                        setShowCustomReason(reason === "Other");
                      }}
                    >
                      <div
                        className={`h-5 w-5 mt-0.5 rounded-full mr-3 flex items-center justify-center border-2 transition-all ${
                          rejectReason === reason
                            ? "border-blue-500 bg-blue-500 scale-110"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {rejectReason === reason && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p
                          className={`${
                            rejectReason === reason
                              ? "font-medium text-blue-700 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {reason}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div
                      className={`flex items-start p-4 cursor-pointer transition-all rounded-lg ${
                        rejectReason === "Duplicate submission"
                          ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent"
                      }`}
                      onClick={() => {
                        setRejectReason("Duplicate submission");
                        setShowCustomReason(false);
                      }}
                    >
                      <div
                        className={`h-5 w-5 mt-0.5 rounded-full mr-3 flex items-center justify-center border-2 transition-all ${
                          rejectReason === "Duplicate submission"
                            ? "border-blue-500 bg-blue-500 scale-110"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {rejectReason === "Duplicate submission" && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p
                          className={`${
                            rejectReason === "Duplicate submission"
                              ? "font-medium text-blue-700 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          Duplicate submission
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          This document has already been submitted previously
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-start p-4 cursor-pointer transition-all rounded-lg ${
                        rejectReason === "Not a bank statement/utility bill"
                          ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent"
                      }`}
                      onClick={() => {
                        setRejectReason("Not a bank statement/utility bill");
                        setShowCustomReason(false);
                      }}
                    >
                      <div
                        className={`h-5 w-5 mt-0.5 rounded-full mr-3 flex items-center justify-center border-2 transition-all ${
                          rejectReason === "Not a bank statement/utility bill"
                            ? "border-blue-500 bg-blue-500 scale-110"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {rejectReason === "Not a bank statement/utility bill" && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p
                          className={`${
                            rejectReason === "Not a bank statement/utility bill"
                              ? "font-medium text-blue-700 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          Not a bank statement/utility bill
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          The document does not appear to be a valid bank statement or utility bill
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-start p-4 cursor-pointer transition-all rounded-lg ${
                        rejectReason === "Does not contain full name"
                          ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent"
                      }`}
                      onClick={() => {
                        setRejectReason("Does not contain full name");
                        setShowCustomReason(false);
                      }}
                    >
                      <div
                        className={`h-5 w-5 mt-0.5 rounded-full mr-3 flex items-center justify-center border-2 transition-all ${
                          rejectReason === "Does not contain full name"
                            ? "border-blue-500 bg-blue-500 scale-110"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {rejectReason === "Does not contain full name" && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p
                          className={`${
                            rejectReason === "Does not contain full name"
                              ? "font-medium text-blue-700 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          Does not contain full name
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          The document does not include the user's complete name
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-start p-4 cursor-pointer transition-all rounded-lg ${
                        rejectReason === "Need a more recent document"
                          ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent"
                      }`}
                      onClick={() => {
                        setRejectReason("Need a more recent document");
                        setShowCustomReason(false);
                      }}
                    >
                      <div
                        className={`h-5 w-5 mt-0.5 rounded-full mr-3 flex items-center justify-center border-2 transition-all ${
                          rejectReason === "Need a more recent document"
                            ? "border-blue-500 bg-blue-500 scale-110"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {rejectReason === "Need a more recent document" && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p
                          className={`${
                            rejectReason === "Need a more recent document"
                              ? "font-medium text-blue-700 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          Need a more recent document
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          The document is too old and a more recent one is required
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-start p-4 cursor-pointer transition-all rounded-lg ${
                        rejectReason === "Other"
                          ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent"
                      }`}
                      onClick={() => {
                        setRejectReason("Other");
                        setShowCustomReason(true);
                      }}
                    >
                      <div
                        className={`h-5 w-5 mt-0.5 rounded-full mr-3 flex items-center justify-center border-2 transition-all ${
                          rejectReason === "Other"
                            ? "border-blue-500 bg-blue-500 scale-110"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {rejectReason === "Other" && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p
                          className={`${
                            rejectReason === "Other"
                              ? "font-medium text-blue-700 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          Other reason
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Specify a different reason for rejection</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {showCustomReason && (
                <div className="mt-6 mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Please specify the reason
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => {
                      setCustomReason(e.target.value);
                      setRejectReason(`Other: ${e.target.value}`);
                    }}
                    placeholder="Enter the specific reason for rejection..."
                    className="w-full p-3 min-h-24 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-600"
                  />
                </div>
              )}

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectDialog(false)}
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectReason === "Other" && !customReason}
                  className={`px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow text-white rounded-lg flex items-center gap-2 font-medium transition-all ${
                    rejectReason === "Other" && !customReason ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <X className="h-4 w-4" />
                  Reject Document
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Translation Dialog */}
      <Dialog open={showTranslationDialog} onOpenChange={setShowTranslationDialog}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center dark:text-white">
              <span>Translated Document</span>
              {translatedPdfData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTranslatedPdf}
                  className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-grow overflow-auto bg-muted/30 dark:bg-gray-900/50 rounded-md">
            {translationLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-4">
                  <Loader />
                  <p className="text-muted-foreground">Translating document...</p>
                </div>
              </div>
            ) : translationError ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-4">
                  <XCircle className="h-12 w-12 text-destructive" />
                  <p className="text-muted-foreground">{translationError}</p>
                </div>
              </div>
            ) : translatedPdfData ? (
              <div className="pdf-container h-full flex justify-center">
                <PDFDocument
                  file={URL.createObjectURL(new Blob([translatedPdfData], { type: "application/pdf" }))}
                  className="w-full"
                >
                  {Array.from(new Array(numPages || 0), (_, index) => (
                    <div key={`trans_page_${index + 1}`} className="mb-4 flex justify-center">
                      <PDFPage
                        pageNumber={index + 1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        width={Math.min(window.innerWidth * 0.7, 800)}
                      />
                    </div>
                  ))}
                </PDFDocument>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Translated PDF preview not available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
