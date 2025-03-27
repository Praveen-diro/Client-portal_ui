"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FileText, Eye, MoreVertical, ChevronLeft, ChevronRight, Copy, Info, Check, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Loader from "@/components/ui/loader";
import { JsonButton } from "@/components/ui/json-button";
import { DeleteModal } from "@/components/ui/delete-modal";
import { SessionDetailsModal } from "@/components/ui/session-details-modal";
import { tableService } from "@/app/services/table.service";
import { getApproves, getTotalDocuments } from "@/app/store/features/tableSlice";
import { viewDocService } from "@/app/services/viewdoc.service";
import { cookies } from "@/app/services/cookie.service";
import { JsonViewer } from "./JsonViewer";
import {
  pdfLoader,
  pdfToJsonData,
  pdfToJsonError,
  extractTransactionData,
  extractTransactionError,
} from "@/app/store/features/tableSlice";
import { ReportIssueModal } from "@/components/ui/report-issue-modal";

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// Function to get relative time (e.g., "2 minutes ago", "3 days ago")
const getRelativeTime = (dateString: string) => {
  if (!dateString) return "Not available";

  const date = new Date(dateString);
  const now = new Date();

  // Calculate time difference in milliseconds
  const timeDiff = now.getTime() - date.getTime();

  // Convert to minutes
  const minutesAgo = Math.floor(timeDiff / (1000 * 60));

  if (minutesAgo < 1) return "Just now";
  if (minutesAgo === 1) return "1 minute ago";
  if (minutesAgo < 60) return `${minutesAgo} minutes ago`;

  // Convert to hours
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo === 1) return "1 hour ago";
  if (hoursAgo < 24) return `${hoursAgo} hours ago`;

  // Convert to days
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo === 1) return "1 day ago";
  if (daysAgo < 7) return `${daysAgo} days ago`;

  // Convert to weeks
  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo === 1) return "1 week ago";
  return `${weeksAgo} weeks ago`;
};

// Helper function to format user time
const getUserTime = (epochTime: string | number) => {
  if (!epochTime) return "Not available";
  const date = new Date(Number(epochTime));
  return date.toLocaleDateString();
};

// Helper to truncate text
const truncate = (text: string, maxLength = 15) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Helper to check if PDF is generated
const pdfGenerated = (pdfData: any) => {
  return pdfData && Object.keys(pdfData).length > 0;
};

// Helper to make file URL
const makefileurl = (sessionId: string) => {
  return sessionId ? encodeURIComponent(sessionId) : "";
};

// Helper for first letter capitalization
const firstLetterCap = (text: string) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Get status color for badges
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "delete":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

interface ApprovedDocumentsProps {
  isActive: boolean;
  searchQuery: string;
}

export default function ApprovedDocuments({ isActive, searchQuery }: ApprovedDocumentsProps) {
  const dispatch = useDispatch();
  const approvedDocuments = useSelector((state: any) => state.table.approved);
  const user = useSelector((state: any) => state.auth.user);
  const table = useSelector((state: any) => state.table);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [copiedSessionId, setCopiedSessionId] = useState(false);
  const [copiedSessionIdText, setCopiedSessionIdText] = useState("");
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [sessionDetailsModalOpen, setSessionDetailsModalOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [docViewModalOpen, setDocViewModalOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [jsonLoading, setJsonLoading] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch approved documents
  useEffect(() => {
    if (isActive) {
      fetchApprovedDocuments(currentPage);
    }
  }, [isActive, currentPage]);

  // Effect for search query
  useEffect(() => {
    if (isActive && searchQuery.trim().length >= 3) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [searchQuery, isActive]);

  const fetchApprovedDocuments = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * itemsPerPage;
      const response = await tableService.getApproved({
        offset,
        limit: itemsPerPage,
        status: "approved",
      });

      if (response.success) {
        dispatch(getApproves({ data: { data: response.data, limit: response.data?.length || 0 } }));
        if (response.data.totalCounts) {
          dispatch(getTotalDocuments({ data: { data: response.data.totalCounts } }));
        }

        // Update pagination
        let total = 0;
        if (typeof response.data === "object" && response.data !== null) {
          if (response.data.total && typeof response.data.total === "number") {
            total = response.data.total;
          } else if (Array.isArray(response.data)) {
            total = response.data.length;
          } else if (Array.isArray(response.data.data)) {
            total = response.data.data.length;
          }
        }

        setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));
      } else {
        throw new Error(response.error || "Failed to fetch approved documents");
      }
    } catch (err) {
      console.error("Error fetching approved documents:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await viewDocService.searchTable(
        searchQuery,
        (currentPage - 1) * itemsPerPage,
        user?.email || cookies.get("email") || "",
        user?.role || cookies.get("roles") || "",
        "approved"
      );

      if (!response.success) {
        throw new Error(response.error || "Search failed");
      }

      dispatch(getApproves({ data: { data: response.data, limit: response.data?.length || 0 } }));

      // Update pagination
      let total = 0;
      if (typeof response.data === "object" && response.data !== null) {
        if (response.data.total && typeof response.data.total === "number") {
          total = response.data.total;
        } else if (Array.isArray(response.data)) {
          total = response.data.length;
        } else if (Array.isArray(response.data.data)) {
          total = response.data.data.length;
        }
      }

      setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));
    } catch (err) {
      console.error("Error searching documents:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle copy session ID with tooltip feedback
  const handleCopyDocID = (docId: string) => {
    if (!docId) return;

    // Clear any existing timeouts to prevent multiple states
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    navigator.clipboard
      .writeText(docId)
      .then(() => {
        // Set copy icon state to show check mark and show toast
        setCopiedSessionId(true);
        setCopiedSessionIdText(docId);
        setShowCopyNotification(true);

        // Reset states after 1 second
        toastTimeoutRef.current = setTimeout(() => {
          setCopiedSessionId(false);
          setShowCopyNotification(false);
        }, 1500);
      })
      .catch((error) => {
        console.error("Could not copy text: ", error);
      });
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Update toggle dropdown function to manage the specific dropdown
  const toggleDropdown = (sessionId: string) => {
    setOpenDropdownId(openDropdownId === sessionId ? null : sessionId);
  };

  // Session details modal toggle
  const sessiontoggle = (sessionId: string, index: number, id: string) => {
    setCurrentSessionId(id);
    setSessionDetailsModalOpen(true);
  };

  // Document view modal
  const onOpenDocView = (doc: any) => {
    setCurrentDoc(doc);
    setDocViewModalOpen(true);
  };

  // Session status check
  const onSessionStatusCheck = () => {
    alert("This document has been marked for deletion and cannot be accessed.");
  };

  // Report modal toggle function to pass to SessionDetailsModal
  const handleOpenReportModal = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSessionDetailsModalOpen(false); // Close the session details modal
    setReportModalOpen(true);
  };

  // Delete modal toggle
  const deleteToggle = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setDeleteModalOpen(true);
  };

  // Handle session deletion
  const handleDeleteSession = async () => {
    if (!currentSessionId) return;

    try {
      setIsLoading(true);
      const response = await tableService.deleteSession(currentSessionId);

      if (response.success) {
        toast({
          title: "Success",
          description: "Document deleted successfully",
          variant: "default",
        });
        // Refresh the document list and keep loader active until complete
        await fetchApprovedDocuments(currentPage);
        setDeleteModalOpen(false);
      } else {
        throw new Error(response.error || "Failed to delete document");
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      setDeleteModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // JSON modal
  const openPdftojsonModal = (sessionId: string, doc: any) => {
    setCurrentSessionId(sessionId);
    setCurrentDoc(doc);

    // Open the modal immediately with loading state
    setJsonLoading(true);
    setJsonModalOpen(true);

    // Dispatch loading state for PDF data in Redux
    dispatch(pdfLoader());

    // Call both getPdfToJson and getExtractTransactionData methods simultaneously
    Promise.all([
      tableService.getPdfToJson(sessionId),
      tableService.getExtractTransactionData({ docid: "", sessionid: sessionId }),
    ])
      .then(([pdfToJsonResponse, extractTransactionResponse]) => {
        // Handle PDF to JSON response
        if (pdfToJsonResponse.success) {
          // Dispatch success action for PDF to JSON
          dispatch(pdfToJsonData(pdfToJsonResponse.data));

          // Update the current document with JSON data
          setCurrentDoc({
            ...doc,
            extractedData: pdfToJsonResponse.data,
            transaction: extractTransactionResponse.success ? extractTransactionResponse.data : null,
          });

          toast({
            title: "Success",
            description: "JSON data loaded successfully",
            variant: "default",
          });
        } else {
          // Dispatch error action for PDF to JSON
          dispatch(pdfToJsonError({ data: pdfToJsonResponse.error }));

          toast({
            title: "Error",
            description: pdfToJsonResponse.error || "Failed to load JSON data",
            variant: "destructive",
          });
        }

        // Handle transaction data response
        if (extractTransactionResponse.success) {
          // Dispatch success action for transaction data
          dispatch(extractTransactionData(extractTransactionResponse.data));
        } else {
          // Dispatch error action for transaction data
          dispatch(extractTransactionError(extractTransactionResponse.error));
        }
      })
      .catch((error) => {
        console.error("Error loading JSON data:", error);

        // Dispatch error actions for both
        dispatch(pdfToJsonError({ data: error }));
        dispatch(extractTransactionError(error));

        toast({
          title: "Error",
          description: "An error occurred while loading JSON data",
          variant: "destructive",
        });
      })
      .finally(() => {
        // Clear loading state for JSON modal only
        setJsonLoading(false);
      });
  };

  // Handle track toggle
  const tracktoggle = (warncase: any) => {
    console.log("Track toggle clicked", warncase);
    // Implement track toggle functionality
  };

  // Verification cell
  const verificationCell = (doc: any) => {
    return (
      <span
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          fontWeight: "400",
          fontSize: "14px",
          color: "black",
        }}
      >
        {doc?.website || "diro.me"}
      </span>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-[300px] text-center">
            <div className="flex justify-center items-center h-full">
              <div className="loader-wrapper">
                <Loader />
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center text-red-500">
            Error loading documents: {error}
          </TableCell>
        </TableRow>
      );
    }

    const currentData =
      approvedDocuments && approvedDocuments.data ? (Array.isArray(approvedDocuments.data) ? approvedDocuments.data : []) : [];

    if (currentData.length > 0) {
      return currentData.map((doc: any, index: number) => {
        // Generate unique key
        const sessionId = doc.sessionid || `session-${index}`;
        // Always incorporate index to ensure uniqueness
        const rowKey = `row-${index}-${doc.id || doc.mxid || doc?.file?.docid || "doc"}`;

        // Extract button name
        const buttonText =
          typeof doc.button === "object" && doc.button
            ? doc.button.name || "Default Button"
            : typeof doc.button === "string"
            ? doc.button
            : "Default Button";

        // Document type
        const docType = doc?.file?.category || (doc.button && doc.button.coverage ? doc.button.coverage.category : "Unknown");

        // Extract verification source
        const sourceText = doc?.website || (typeof doc.source === "string" ? doc.source : "diro.me");

        // Session ID
        const sessionIdText = doc?.file?.docid || sessionId || "Unknown";

        // Track ID
        const trackIdText = doc?.trackId || doc?.track_id || `DOC-${index}`;

        // Check various conditions
        const hasShareOnlyJson = doc?.button?.shareonlyjson;
        const isPdfGenerated = pdfGenerated(doc?.file?.pdfdata);
        const isAdminUser = user?.email === "dirolabs@gmail.com";
        const isFinalPdfToJson = doc?.file?.json_v3_status === "final-pdftojson";
        const isDeleteStatus = doc?.status === "delete";

        // Document processing status check
        const hasProcessingData =
          doc?.file?.Algorithm !== "" &&
          doc?.file?.Interimresponse !== "" &&
          doc?.file?.mhtmlhashkey !== "" &&
          doc?.file?.pdfjson !== "" &&
          doc?.file?.mhtmlVal !== "" &&
          doc?.file?.rootcertfound !== "" &&
          doc?.file?.predictionData2 !== "";

        // Determine if document should be viewed in DocView
        const shouldOpenInDocView =
          hasShareOnlyJson && isPdfGenerated && !isAdminUser && !isFinalPdfToJson && (isDeleteStatus ? hasProcessingData : true);

        return (
          <TableRow key={rowKey} className="group hover:bg-muted/50">
            {/* Button column */}
            <TableCell>
              {shouldOpenInDocView ? (
                <div
                  className="cursor-pointer text-sm"
                  onClick={isDeleteStatus ? onSessionStatusCheck : () => onOpenDocView(doc)}
                >
                  {buttonText}
                </div>
              ) : !isDeleteStatus ? (
                <Link href={`/pdf/${makefileurl(sessionId)}`} className="text-sm">
                  {buttonText}
                </Link>
              ) : (
                <div className="cursor-pointer text-sm" onClick={onSessionStatusCheck}>
                  {buttonText}
                </div>
              )}
            </TableCell>

            {/* Type column */}
            <TableCell>
              <Badge variant="outline">{firstLetterCap(docType)}</Badge>
            </TableCell>

            {/* Verification source column */}
            <TableCell>
              {shouldOpenInDocView ? (
                <div className="cursor-pointer" onClick={isDeleteStatus ? onSessionStatusCheck : () => onOpenDocView(doc)}>
                  {verificationCell(doc)}
                </div>
              ) : !isDeleteStatus ? (
                <Link href={`/pdf/${makefileurl(sessionId)}`} className="text-sm">
                  {verificationCell(doc)}
                </Link>
              ) : (
                <div className="cursor-pointer" onClick={onSessionStatusCheck}>
                  {verificationCell(doc)}
                </div>
              )}
            </TableCell>

            {/* Session ID column */}
            <TableCell>
              {hasProcessingData && (
                <div className="flex items-center">
                  <div className="bg-muted/40 px-2 py-1 rounded flex items-center">
                    <div className="flex items-center text-xs truncate min-w-[110px] max-w-[110px]">
                      {doc?.button?.livefeedbackMode ? (
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2 flex-shrink-0" />
                      )}
                      <span className="truncate">{truncate(sessionIdText)}</span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1.5 flex-shrink-0"
                            onClick={() => handleCopyDocID(sessionId)}
                          >
                            {copiedSessionId && copiedSessionIdText === sessionId ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copiedSessionId && copiedSessionIdText === sessionId ? "Copied!" : "Copy"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {isAdminUser && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="ml-2">
                            {shouldOpenInDocView &&
                            doc?.Interimresponse === "" &&
                            doc?.mhtmlhaskKey === "" &&
                            doc?.pdfJSON === "" &&
                            doc?.predictionData2 === "" &&
                            doc?.rootCertfound === "" &&
                            doc?.userinfo === "" ? (
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenDocView(doc)}>
                                <Info className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Link href={`/session-details/${makefileurl(sessionId)}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Session Info</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
            </TableCell>

            {/* Name column */}
            <TableCell>
              {hasProcessingData && (
                <>
                  {doc?.file?.pdfdata_v3
                    ? doc.file.pdfdata_v3?.map((item: any, i: number) =>
                        item?.type === "name"
                          ? item?.values?.map((value: any, idx: number) => (
                              <span key={`name-${i}-${idx}`} className="text-sm block">
                                {value?.name}
                              </span>
                            ))
                          : null
                      )
                    : null}
                </>
              )}
            </TableCell>

            {/* Date column */}
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {shouldOpenInDocView && hasProcessingData ? (
                      <div className="cursor-pointer text-sm" onClick={() => onOpenDocView(doc)}>
                        {getUserTime(doc?.file?.eptime)}
                      </div>
                    ) : !isDeleteStatus ? (
                      <Link href={`/pdf/${makefileurl(sessionId)}`} className="text-sm">
                        {getUserTime(doc?.file?.eptime)}
                      </Link>
                    ) : (
                      <div className="cursor-pointer text-sm" onClick={onSessionStatusCheck}>
                        {getUserTime(doc?.file?.eptime)}
                      </div>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {doc?.file?.eptime
                      ? `${new Date(Number(doc?.file?.eptime)).toDateString()}, ${new Date(
                          Number(doc?.file?.eptime)
                        ).toLocaleTimeString()}`
                      : "Date not available"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>

            {/* Track ID column */}
            <TableCell>
              {(!isDeleteStatus || hasProcessingData) && doc?.warncase && (
                <div className="text-xs">
                  {doc.warncase.map((wcase: any, idx: number) =>
                    wcase?.type === "trackid" ? (
                      <span key={`track-${idx}`} className="cursor-pointer block" onClick={() => tracktoggle(doc?.warncase)}>
                        {wcase?.keyword}
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </TableCell>

            {/* Actions column */}
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <JsonButton onClick={() => openPdftojsonModal(sessionId, doc)}>JSON</JsonButton>

                <DropdownMenu
                  open={openDropdownId === sessionId}
                  onOpenChange={(open) => (open ? setOpenDropdownId(sessionId) : setOpenDropdownId(null))}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {shouldOpenInDocView && hasProcessingData ? (
                      <DropdownMenuItem onClick={() => onOpenDocView(doc)}>View doc</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link href={`/pdf/${makefileurl(sessionId)}`}>View doc</Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={!isDeleteStatus ? () => sessiontoggle(sessionId, index, sessionId) : onSessionStatusCheck}
                    >
                      Session details
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => handleOpenReportModal(sessionId)}>Report issue</DropdownMenuItem>

                    <DropdownMenuItem onClick={() => deleteToggle(sessionId)} className="text-red-500">
                      Delete session
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        );
      });
    }

    return (
      <TableRow>
        <TableCell colSpan={8} className="h-[200px] text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <FileText className="h-10 w-10 text-muted-foreground/60" />
            <p className="text-muted-foreground">No approved documents found.</p>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-sm">Button</TableHead>
              <TableHead className="font-medium text-sm">Type</TableHead>
              <TableHead className="font-medium text-sm">Verification source</TableHead>
              <TableHead className="font-medium text-sm">Session ID</TableHead>
              <TableHead className="font-medium text-sm">Name</TableHead>
              <TableHead className="font-medium text-sm">Date</TableHead>
              <TableHead className="font-medium text-sm">Track ID</TableHead>
              <TableHead className="font-medium text-sm text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-[300px] text-center">
                  <div className="flex justify-center items-center h-full">
                    <div className="loader-wrapper">
                      <Loader />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-500">
                  Error loading documents: {error}
                </TableCell>
              </TableRow>
            ) : approvedDocuments?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-[200px] text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <FileText className="h-10 w-10 text-muted-foreground/60" />
                    <p className="text-muted-foreground">No approved documents found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              approvedDocuments?.data?.map((doc: any, index: number) => {
                // Generate unique key
                const sessionId = doc.sessionid || `session-${index}`;
                // Always incorporate index to ensure uniqueness
                const rowKey = `row-${index}-${doc.id || doc.mxid || doc?.file?.docid || "doc"}`;

                // Extract button name
                const buttonText =
                  typeof doc.button === "object" && doc.button
                    ? doc.button.name || "Default Button"
                    : typeof doc.button === "string"
                    ? doc.button
                    : "Default Button";

                // Document type
                const docType =
                  doc?.file?.category || (doc.button && doc.button.coverage ? doc.button.coverage.category : "Unknown");

                // Extract verification source
                const sourceText = doc?.website || (typeof doc.source === "string" ? doc.source : "diro.me");

                // Session ID
                const sessionIdText = doc?.file?.docid || sessionId || "Unknown";

                // Track ID
                const trackIdText = doc?.trackId || doc?.track_id || `DOC-${index}`;

                // Check various conditions
                const hasShareOnlyJson = doc?.button?.shareonlyjson;
                const isPdfGenerated = pdfGenerated(doc?.file?.pdfdata);
                const isAdminUser = user?.email === "dirolabs@gmail.com";
                const isFinalPdfToJson = doc?.file?.json_v3_status === "final-pdftojson";
                const isDeleteStatus = doc?.status === "delete";

                // Document processing status check
                const hasProcessingData =
                  doc?.file?.Algorithm !== "" &&
                  doc?.file?.Interimresponse !== "" &&
                  doc?.file?.mhtmlhashkey !== "" &&
                  doc?.file?.pdfjson !== "" &&
                  doc?.file?.mhtmlVal !== "" &&
                  doc?.file?.rootcertfound !== "" &&
                  doc?.file?.predictionData2 !== "";

                // Determine if document should be viewed in DocView
                const shouldOpenInDocView =
                  hasShareOnlyJson &&
                  isPdfGenerated &&
                  !isAdminUser &&
                  !isFinalPdfToJson &&
                  (isDeleteStatus ? hasProcessingData : true);

                return (
                  <TableRow key={rowKey} className="hover:bg-muted/30 border-b">
                    {/* Button column */}
                    <TableCell className="py-3">
                      {shouldOpenInDocView ? (
                        <div
                          className="cursor-pointer text-sm font-medium"
                          onClick={isDeleteStatus ? onSessionStatusCheck : () => onOpenDocView(doc)}
                        >
                          {buttonText}
                        </div>
                      ) : !isDeleteStatus ? (
                        <Link href={`/pdf/${makefileurl(sessionId)}`} className="text-sm font-medium">
                          {buttonText}
                        </Link>
                      ) : (
                        <div className="cursor-pointer text-sm font-medium" onClick={onSessionStatusCheck}>
                          {buttonText}
                        </div>
                      )}
                    </TableCell>

                    {/* Type column */}
                    <TableCell className="py-3">
                      <Badge variant="outline" className="bg-background">
                        {firstLetterCap(docType)}
                      </Badge>
                    </TableCell>

                    {/* Verification source column */}
                    <TableCell className="py-3">
                      {shouldOpenInDocView ? (
                        <div
                          className="cursor-pointer text-sm"
                          onClick={isDeleteStatus ? onSessionStatusCheck : () => onOpenDocView(doc)}
                        >
                          {verificationCell(doc)}
                        </div>
                      ) : !isDeleteStatus ? (
                        <Link href={`/pdf/${makefileurl(sessionId)}`} className="text-sm">
                          {verificationCell(doc)}
                        </Link>
                      ) : (
                        <div className="cursor-pointer text-sm" onClick={onSessionStatusCheck}>
                          {verificationCell(doc)}
                        </div>
                      )}
                    </TableCell>

                    {/* Session ID column */}
                    <TableCell className="py-3">
                      {hasProcessingData && (
                        <div className="flex items-center">
                          <div className="bg-muted/40 px-2 py-1 rounded flex items-center">
                            <div className="flex items-center text-xs truncate min-w-[110px] max-w-[110px]">
                              {doc?.button?.livefeedbackMode ? (
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2 flex-shrink-0" />
                              )}
                              <span className="truncate">{truncate(sessionIdText)}</span>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 ml-1.5 flex-shrink-0"
                                    onClick={() => handleCopyDocID(sessionId)}
                                  >
                                    {copiedSessionId && copiedSessionIdText === sessionId ? (
                                      <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {copiedSessionId && copiedSessionIdText === sessionId ? "Copied!" : "Copy"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          {isAdminUser && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="ml-2">
                                    {shouldOpenInDocView &&
                                    doc?.Interimresponse === "" &&
                                    doc?.mhtmlhaskKey === "" &&
                                    doc?.pdfJSON === "" &&
                                    doc?.predictionData2 === "" &&
                                    doc?.rootCertfound === "" &&
                                    doc?.userinfo === "" ? (
                                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenDocView(doc)}>
                                        <Info className="h-4 w-4" />
                                      </Button>
                                    ) : (
                                      <Link href={`/session-details/${makefileurl(sessionId)}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <Info className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>Session Info</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* Name column */}
                    <TableCell className="py-3">
                      {hasProcessingData && (
                        <>
                          {doc?.file?.pdfdata_v3
                            ? doc.file.pdfdata_v3?.map((item: any, i: number) =>
                                item?.type === "name"
                                  ? item?.values?.map((value: any, idx: number) => (
                                      <span key={`name-${i}-${idx}`} className="text-sm block">
                                        {value?.name}
                                      </span>
                                    ))
                                  : null
                              )
                            : null}
                        </>
                      )}
                    </TableCell>

                    {/* Date column */}
                    <TableCell className="py-3">
                      <span className="text-sm">{getUserTime(doc?.file?.eptime)}</span>
                    </TableCell>

                    {/* Track ID column */}
                    <TableCell className="py-3">
                      {(!isDeleteStatus || hasProcessingData) && doc?.warncase && (
                        <div className="text-xs">
                          {doc.warncase.map((wcase: any, idx: number) =>
                            wcase?.type === "trackid" ? (
                              <span
                                key={`track-${idx}`}
                                className="cursor-pointer block"
                                onClick={() => tracktoggle(doc?.warncase)}
                              >
                                {wcase?.keyword}
                              </span>
                            ) : null
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* Actions column */}
                    <TableCell className="text-right py-3">
                      <div className="flex items-center justify-end gap-2">
                        <JsonButton onClick={() => openPdftojsonModal(sessionId, doc)}>JSON</JsonButton>
                        <DropdownMenu
                          open={openDropdownId === sessionId}
                          onOpenChange={(open) => (open ? setOpenDropdownId(sessionId) : setOpenDropdownId(null))}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {shouldOpenInDocView && hasProcessingData ? (
                              <DropdownMenuItem onClick={() => onOpenDocView(doc)}>View doc</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem asChild>
                                <Link href={`/pdf/${makefileurl(sessionId)}`}>View doc</Link>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={!isDeleteStatus ? () => sessiontoggle(sessionId, index, sessionId) : onSessionStatusCheck}
                            >
                              Session details
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={() => handleOpenReportModal(sessionId)}>Report issue</DropdownMenuItem>

                            <DropdownMenuItem onClick={() => deleteToggle(sessionId)} className="text-red-500">
                              Delete session
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center py-4">
        <div className="inline-flex items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-full border px-3 py-1 shadow-sm">
          <Button
            variant="ghost"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className="h-8 rounded-full flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          <span className="text-sm font-medium">{currentPage}</span>
          <Button
            variant="ghost"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="h-8 rounded-full flex items-center gap-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Toast Notification */}
      {showCopyNotification && (
        <div className="toast-container">
          <div className="toast-notification">
            <div className="toast-icon">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div className="toast-content">
              <p className="toast-title">Copied!</p>
              <p className="toast-message">Session ID copied to clipboard</p>
            </div>
            <div className="toast-progress">
              <div className="toast-progress-bar"></div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteSession}
        itemType="document"
        isLoading={isLoading}
        itemDetail={
          currentSessionId
            ? {
                label: "Session ID",
                value: currentSessionId,
              }
            : undefined
        }
      />

      {/* Session Details Modal */}
      <SessionDetailsModal
        isOpen={sessionDetailsModalOpen}
        onClose={() => setSessionDetailsModalOpen(false)}
        sessionId={currentSessionId}
        onReportIssue={handleOpenReportModal}
      />

      {/* JSON Viewer Modal */}
      <JsonViewer
        isOpen={jsonModalOpen}
        onClose={() => setJsonModalOpen(false)}
        jsonData={(currentDoc as any)?.extractedData || {}}
        status="final"
        title="Extracted fields"
        transactionData={(currentDoc as any)?.transaction}
        showSendForReviewButton={true}
        isLoading={jsonLoading}
        onSendForReview={() => {
          // Implement send for review logic here
          console.log("Send for review clicked", currentSessionId);
          setJsonModalOpen(false);
          toast({
            title: "Success",
            description: "Document sent for review",
            variant: "default",
          });
        }}
      />

      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      {/* Add this to your global CSS or add it inline */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .toast-container {
          position: fixed;
          top: 20px;
          left: 0;
          right: 0;
          z-index: 9999;
          display: flex;
          justify-content: center;
          pointer-events: none;
        }

        .toast-notification {
          background: #ffffff;
          color: #1a1a1a;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          padding: 12px 16px;
          min-width: 300px;
          max-width: 90%;
          position: relative;
          animation: toastIn 0.3s ease forwards;
          overflow: hidden;
          pointer-events: auto;
        }

        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ecfdf5;
          color: #10b981;
          padding: 8px;
          border-radius: 8px;
          margin-right: 12px;
        }

        .toast-content {
          flex: 1;
        }

        .toast-title {
          font-weight: 600;
          font-size: 14px;
          margin: 0;
          color: #111827;
        }

        .toast-message {
          font-size: 12px;
          margin: 4px 0 0 0;
          color: #6b7280;
        }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: #f3f4f6;
        }

        .toast-progress-bar {
          height: 100%;
          background: #10b981;
          width: 100%;
          animation: progress 1s linear forwards;
        }

        @keyframes toastIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          0% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }

        .loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
