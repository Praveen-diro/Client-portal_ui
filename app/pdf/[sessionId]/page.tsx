"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { FileText, Download, Languages, CheckCircle, XCircle, Search, User, Check, X } from "lucide-react";
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
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

export default function PdfViewer() {
  const { sessionId } = useParams();
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

  // Track if the component is mounted to avoid state updates after unmount
  const isMounted = useRef(true);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize PDF.js worker
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-pdf").then(({ pdfjs }) => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
      });
    }

    return () => {
      isMounted.current = false;
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Fetch document data when component mounts
  useEffect(() => {
    const fetchDocumentData = async () => {
      if (!sessionId) return;

      try {
        setLoading(true);
        console.log("Fetching document data for sessionId:", sessionId);

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
          const pdfArrayBuffer = base64ToArrayBuffer(downloadResponse.data.base64);
          setPdfData(pdfArrayBuffer);
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
    setNumPages(numPages);
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

      setShowRejectDialog(false);
      toast({
        title: "Document Rejected",
        description: "The document has been rejected.",
        variant: "destructive",
      });

      // Redirect to the documents page after a short delay
      toastTimeoutRef.current = setTimeout(() => {
        window.location.href = "/client/documents-received";
      }, 2000);
    } catch (err: any) {
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

  // For development debugging - just to show something is loading
  console.log("PDF Viewer rendering. SessionId:", sessionId);

  // If the document is invalid
  if (docInvalid) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Document Unavailable</AlertDialogTitle>
              <AlertDialogDescription>
                The document is currently under investigation. Please check back shortly.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleBack}>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

  // Get document URL
  const pdfUrl = pdfData ? URL.createObjectURL(new Blob([pdfData], { type: "application/pdf" })) : "";

  // Prepare MHT files display
  const mhtFiles = viewDocData?.file?.mhtmlhashkey ? Object.keys(viewDocData.file.mhtmlhashkey) : [];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left sidebar for document details and verification */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4 sm:space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:pt-6">
              <h3 className="text-lg font-semibold mb-3 sm:mb-4">Document Verification</h3>

              {/* User info */}
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium truncate">{viewDocData?.doc?.firstname || "User"}</h4>
                  <p className="text-xs text-muted-foreground truncate">{viewDocData?.doc?.mobile || "No mobile"}</p>
                </div>
              </div>

              {/* Website and date */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-sm font-medium truncate">
                  {getHostnameFromRegex(viewDocData?.url) || viewDocData?.url || "Unknown source"}
                </h4>
                <p className="text-xs text-muted-foreground">{formatDate(viewDocData?.doc?.crtime) || "Unknown date"}</p>
              </div>

              <Separator className="my-3 sm:my-4" />

              {/* Fields to verify */}
              <h3 className="text-sm font-semibold text-primary mb-3 sm:mb-4">Information to be verified</h3>

              <div className="space-y-2 sm:space-y-3 max-h-[250px] sm:max-h-[320px] overflow-y-auto pr-2">
                {verFields.length > 0 ? (
                  verFields.map((field, index) => (
                    <div key={`${field.message}-${index}`} className="p-2 sm:p-3 bg-muted/50 rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-2 flex-1 min-w-0">
                          <Checkbox
                            id={`field-${index}`}
                            checked={verifiedFields.includes(field.message)}
                            onCheckedChange={() => handleFieldToggle(field.message)}
                            className="mt-0.5"
                          />
                          <Label htmlFor={`field-${index}`} className="text-sm font-medium cursor-pointer line-clamp-2">
                            {field.message}
                          </Label>
                        </div>

                        {field.keyword && (
                          <div className="flex items-center space-x-1 ml-2 shrink-0">
                            <Search className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground truncate max-w-[60px] sm:max-w-[100px]">
                              {field.keyword}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : warnCases.length > 0 ? (
                  warnCases.map((field, index) => (
                    <div key={`${field.message}-${index}`} className="p-2 sm:p-3 bg-muted/50 rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-2 flex-1 min-w-0">
                          <Checkbox
                            id={`field-${index}`}
                            checked={verifiedFields.includes(field.message)}
                            onCheckedChange={() => handleFieldToggle(field.message)}
                            className="mt-0.5"
                          />
                          <Label htmlFor={`field-${index}`} className="text-sm font-medium cursor-pointer line-clamp-2">
                            {field.message}
                          </Label>
                        </div>

                        {field.keyword && (
                          <div className="flex items-center space-x-1 ml-2 shrink-0">
                            <Search className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground truncate max-w-[60px] sm:max-w-[100px]">
                              {field.keyword}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No fields to verify</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                <Button onClick={() => setShowApproveDialog(true)} variant="default" className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>

                <Button onClick={() => setShowRejectDialog(true)} variant="destructive" className="w-full">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PDF viewer section */}
        <div className="lg:col-span-8 xl:col-span-9">
          <Card className="shadow-sm">
            <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {!viewDocData?.data?.shareonlyjson && mhtFiles.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Download:</span>
                    <div className="flex flex-wrap gap-1">
                      {mhtFiles.map((key, index) => (
                        <TooltipProvider key={key}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={`${env.downloadmht}?docid=${sessionId}&filename=${key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
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
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {!viewDocData?.shareonlyjson && viewDocData?.button?.mode?.type !== "capture" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTranslatePdf}
                    disabled={translationLoading}
                    className="flex-1 sm:flex-none"
                  >
                    <Languages className="mr-1 sm:mr-2 h-4 w-4" />
                    <span className="sm:inline">Translate (En)</span>
                  </Button>
                )}

                <Button variant="outline" size="sm" onClick={handleDownloadPdf} className="flex-1 sm:flex-none">
                  <Download className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="sm:inline">Download PDF</span>
                </Button>
              </div>
            </div>

            <div className="pdf-container h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-auto bg-muted/30 flex justify-center">
              {pdfUrl ? (
                <PDFDocument file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} className="w-full">
                  {Array.from(new Array(numPages || 0), (_, index) => (
                    <div key={`page_${index + 1}`} className="mb-4 flex justify-center">
                      <PDFPage
                        pageNumber={index + 1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        width={Math.min(window.innerWidth - 40, 800)}
                      />
                    </div>
                  ))}
                </PDFDocument>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">PDF preview not available</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Approval Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Document</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to approve this document?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove}>
              <Check className="mr-2 h-4 w-4" />
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>Please select a reason for rejecting this document.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="reject-reason">Reason for rejection</Label>
            <Select value={rejectReason} onValueChange={setRejectReason}>
              <SelectTrigger id="reject-reason" className="w-full mt-2">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {viewDocData?.button?.reject_reasons && viewDocData.button.reject_reasons.length > 0 ? (
                  viewDocData.button.reject_reasons.map((reason: string) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="Duplicate submission">Duplicate submission</SelectItem>
                    <SelectItem value="Not a bank statement / utility bill">Not a bank statement / utility bill</SelectItem>
                    <SelectItem value="Does not contain full name">Does not contain full name</SelectItem>
                    <SelectItem value="Need a more recent document">Need a more recent document</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Translation Dialog */}
      <Dialog open={showTranslationDialog} onOpenChange={setShowTranslationDialog}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Translated Document</span>
              {translatedPdfData && (
                <Button variant="outline" size="sm" onClick={handleDownloadTranslatedPdf}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-grow overflow-auto bg-muted/30 rounded-md">
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
