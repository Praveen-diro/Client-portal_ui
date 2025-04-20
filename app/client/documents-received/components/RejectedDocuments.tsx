"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FileText, Eye, MoreVertical, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, CalendarIcon } from "lucide-react";
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
import Loader from "@/components/ui/loader";
import { JsonButton } from "@/components/ui/json-button";
import { DeleteModal } from "@/components/ui/delete-modal";
import { SessionDetailsModal } from "@/components/ui/session-details-modal";
import { tableService } from "@/app/services/table.service";
import { getRejects, getTotalDocuments } from "@/app/store/features/tableSlice";
import { viewDocService } from "@/app/services/viewdoc.service";
import { cookies } from "@/app/services/cookie.service";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardCheck, Copy, Check } from "lucide-react";
import { JsonViewer } from "./JsonViewer";
import {
  pdfLoader,
  pdfToJsonData,
  pdfToJsonError,
  extractTransactionData,
  extractTransactionError,
} from "@/app/store/features/tableSlice";
import { ReportIssueModal } from "@/components/ui/report-issue-modal";
import VerificationCell from "./VerificationCell";
import ConfirmationSingleButtonModal from "@/components/ui/confirmation-single-button-modal";
import TypeCell from "./TypeCell";
import countriesData from "@/app/data/countries.json";
import { DateRangePicker } from "@heroui/date-picker";
import { DateValue } from "@internationalized/date";

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

// Get status color for badges
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

interface RejectedDocumentsProps {
  isActive: boolean;
  searchQuery: string;
}

// Helper functions - Pure utilities that don't interact with state
const firstLetterCap = (str: string) => {
  if (!str) return "Unknown";
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
};

const truncate = (str: string, length = 10) => {
  if (!str) return "";
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

const makefileurl = (sessionId: string) => {
  return encodeURIComponent(sessionId);
};

// Function to check if PDF is generated
const pdfGenerated = (pdfdata: any) => {
  return pdfdata && pdfdata !== "";
};

export default function RejectedDocuments({ isActive, searchQuery }: RejectedDocumentsProps) {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const rejectedDocuments = useSelector((state: any) => state.table.rejects);
  const user = useSelector((state: any) => state.auth.user);
  const itemsPerPage = 10; // Number of items per page

  // Country filter dropdown state (matching PendingDocuments/ApprovedDocuments)
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const countryInputRef = React.useRef<HTMLInputElement>(null);
  const countryDropdownRef = React.useRef<HTMLDivElement>(null);
  const countries = countriesData;
  const countryOptions = countriesData.map((c) => ({ label: c.name, value: c.code }));
  const filteredCountries = countryOptions.filter(
    (c) => !selectedCountries.includes(c.value) && c.label.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Add effect for click outside to close dropdown (matching PendingDocuments/ApprovedDocuments)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    }
    if (isCountryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  // Add state for session ID copying
  const [copiedSessionId, setCopiedSessionId] = useState(false);
  const [copiedSessionIdText, setCopiedSessionIdText] = useState("");
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionDetailsModalOpen, setSessionDetailsModalOpen] = useState(false);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<any>(null);

  // Add a new state for JSON modal loading
  const [jsonLoading, setJsonLoading] = useState(false);

  // Add a new state for report modal
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Add a new state for null file alert
  const [nullFileAlert, setNullFileAlert] = useState(false);
  const [nullFileColumn, setNullFileColumn] = useState<string | null>(null);
  const [nullFileRow, setNullFileRow] = useState<any>(null);

  // Add missing state for date dropdown
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("Date");
  const [customRange, setCustomRange] = useState<{ start: DateValue | null; end: DateValue | null }>({ start: null, end: null });
  const [isCustomCalendarOpen, setIsCustomCalendarOpen] = useState(false);

  // Placeholder functions - these will need to be implemented with the actual functionality
  const onSessionStatusCheck = () => {
    console.log("Session status check");
    // Implement actual functionality here
  };

  const onOpenDocView = (doc: any) => {
    console.log("Open doc view", doc);
    // Implement actual functionality here
  };

  const tracktoggle = (warncase: any) => {
    console.log("Track toggle", warncase);
    // Implement actual functionality here
  };

  const sessiontoggle = (sessionId: string, index: number, id: string) => {
    setCurrentSessionId(id);
    setSessionDetailsModalOpen(true);
  };

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

  const deleteToggle = (sessionId: string) => {
    console.log("Delete toggle", sessionId);
    // Implement actual functionality here
    setCurrentSessionId(sessionId);
    setDeleteModalOpen(true);
  };

  const getUserTime = (timestamp: string | number) => {
    if (!timestamp) return "";
    try {
      const date = new Date(Number(timestamp));
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } catch (e) {
      return "Invalid date";
    }
  };

  // Handle copy sessionId
  const handleCopyDocID = (sessionId: string) => {
    navigator.clipboard.writeText(sessionId).then(() => {
      setCopiedSessionId(true);
      setCopiedSessionIdText(sessionId);
      setShowCopyNotification(true);

      setTimeout(() => {
        setCopiedSessionId(false);
        setShowCopyNotification(false);
      }, 2000);
    });
  };

  // Fetch rejected documents when component is active or page changes
  useEffect(() => {
    if (isActive) {
      fetchRejectedDocuments();
    }
  }, [isActive, currentPage]);

  const fetchRejectedDocuments = async () => {
    try {
      setIsLoading(true);
      setError("");

      const offset = (currentPage - 1) * itemsPerPage;
      const response = await tableService.getRejected({
        offset,
        limit: itemsPerPage,
        status: "rejected",
      });

      if (response.success) {
        dispatch(getRejects({ data: { data: response.data, limit: response.data?.length || 0 } }));
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
        throw new Error(response.error || "Failed to fetch rejected documents");
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("Failed to fetch rejected documents");
      console.error("Error fetching rejected documents:", err);
    }
  };

  // Handle search functionality
  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await viewDocService.searchTable(
        searchQuery,
        (currentPage - 1) * itemsPerPage,
        user?.email || cookies.get("email") || "",
        user?.role || cookies.get("roles") || "",
        "rejected"
      );

      if (!response.success) {
        throw new Error(response.error || "Search failed");
      }

      dispatch(getRejects({ data: { data: response.data, limit: response.data?.length || 0 } }));

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
      setError("Failed to search documents");
    } finally {
      setIsLoading(false);
    }
  };

  // Add effect for search query
  useEffect(() => {
    if (isActive && searchQuery.trim().length >= 3) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [searchQuery, isActive]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
        await fetchRejectedDocuments();
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

  // Report modal toggle function to pass to SessionDetailsModal
  const handleOpenReportModal = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSessionDetailsModalOpen(false); // Close the session details modal
    setReportModalOpen(true);
  };

  const handleNullFileClick = (e: React.MouseEvent, columnName: string, rowData: any) => {
    e.preventDefault();
    e.stopPropagation();
    setNullFileColumn(columnName);
    setNullFileRow(rowData);
    setNullFileAlert(true);
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-sm">Button</TableHead>
              <TableHead className="font-medium text-sm">Type</TableHead>
              <TableHead className="font-medium text-sm relative">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Verification source</span>
                  <button
                    type="button"
                    className="text-lg text-muted-foreground hover:text-primary focus:outline-none"
                    onClick={() => {
                      setIsCountryDropdownOpen((open) => {
                        if (!open) {
                          setTimeout(() => countryInputRef.current?.focus(), 0);
                        }
                        return !open;
                      });
                    }}
                    tabIndex={0}
                    aria-label="Toggle country filter dropdown"
                  >
                    {isCountryDropdownOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {selectedCountries.length > 0 && (
                    <button
                      type="button"
                      className="text-lg text-muted-foreground hover:text-red-500 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCountries([]);
                      }}
                      tabIndex={0}
                      aria-label="Clear selected countries"
                    >
                      ×
                    </button>
                  )}
                </div>
                {isCountryDropdownOpen && (
                  <>
                    <div
                      ref={countryDropdownRef}
                      className="relative flex flex-wrap items-center border rounded-md px-2 py-1 bg-background min-h-8 gap-1 cursor-text mt-1"
                      style={{ minWidth: 100, maxWidth: 180 }}
                      tabIndex={0}
                    >
                      {selectedCountries.length > 0 &&
                        selectedCountries.map((code) => {
                          const country = countryOptions.find((c) => c.value === code);
                          return (
                            <span
                              key={code}
                              className="bg-muted px-1.5 py-0.5 rounded text-xs flex items-center gap-1"
                              style={{ fontWeight: 500 }}
                            >
                              {country?.label || code}
                              <button
                                type="button"
                                className="ml-0.5 text-xs text-gray-500 hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCountries((prev) => prev.filter((c) => c !== code));
                                }}
                                tabIndex={-1}
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      <input
                        ref={countryInputRef}
                        className="flex-1 outline-none border-none bg-transparent text-xs px-1 min-w-[30px]"
                        placeholder={selectedCountries.length === 0 && !countrySearch ? "Filter by countries..." : ""}
                        value={countrySearch}
                        onChange={(e) => {
                          setCountrySearch(e.target.value);
                        }}
                        style={{ minWidth: 30, maxWidth: 80 }}
                        autoFocus
                      />
                    </div>
                    <div
                      className="absolute left-4 top-full z-30 bg-background border rounded-md shadow w-full max-h-40 overflow-auto"
                      style={{ minWidth: 100, maxWidth: 180 }}
                    >
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <div
                            key={country.value}
                            className="px-2 py-1 cursor-pointer hover:bg-muted rounded text-xs"
                            onClick={(e) => {
                              setSelectedCountries((prev) => [...prev, country.value]);
                              setCountrySearch("");
                              setTimeout(() => countryInputRef.current?.focus(), 0);
                            }}
                          >
                            {country.label}
                          </div>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-muted-foreground text-xs">No countries found</div>
                      )}
                    </div>
                  </>
                )}
              </TableHead>
              <TableHead className="font-medium text-sm">Session ID</TableHead>
              <TableHead className="font-medium text-sm">Remarks</TableHead>
              <TableHead className="font-medium text-sm">Name</TableHead>
              <TableHead className="font-medium text-sm relative" style={{ position: "relative" }}>
                {dateFilter !== "Date" ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-xs font-medium text-muted-foreground">
                      {dateFilter === "Custom" && customRange && customRange.start && customRange.end ? (
                        <>
                          Custom {formatDate(customRange.start?.toString())} to {formatDate(customRange.end?.toString())}
                          <button
                            type="button"
                            className="ml-1 text-muted-foreground hover:text-primary focus:outline-none"
                            onClick={() => setIsCustomCalendarOpen(true)}
                            tabIndex={0}
                            aria-label="Open custom date picker"
                          >
                            <CalendarIcon className="w-4 h-4" />
                          </button>
                        </>
                      ) : dateFilter === "Week" ? (
                        "Last week"
                      ) : dateFilter === "Month" ? (
                        "Last month"
                      ) : dateFilter === "Year" ? (
                        "Last year"
                      ) : (
                        dateFilter
                      )}
                      <button
                        type="button"
                        className="ml-2 text-lg text-muted-foreground hover:text-red-500 focus:outline-none"
                        onClick={() => {
                          setDateFilter("Date");
                          setCustomRange({ start: null, end: null });
                          setIsCustomCalendarOpen(false);
                        }}
                        tabIndex={0}
                        aria-label="Clear date filter"
                      >
                        ×
                      </button>
                    </span>
                    {dateFilter === "Custom" && isCustomCalendarOpen && (
                      <div className="flex flex-col gap-1">
                        <DateRangePicker
                          className="max-w-xs"
                          value={
                            customRange.start && customRange.end ? { start: customRange.start, end: customRange.end } : undefined
                          }
                          onChange={(range: { start?: DateValue; end?: DateValue } | null) => {
                            setCustomRange({
                              start: range?.start ?? null,
                              end: range?.end ?? null,
                            });
                            if (range?.start && range?.end) setIsCustomCalendarOpen(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 relative">
                    Date
                    <button
                      type="button"
                      className="ml-1 p-1 rounded hover:bg-muted"
                      onClick={() => setDateDropdownOpen((open) => !open)}
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {dateDropdownOpen && (
                      <div className="absolute left-0 mt-2 z-30 bg-background border rounded shadow w-56 p-3">
                        <div className="flex flex-col gap-2">
                          <button
                            className="text-left px-2 py-1 rounded hover:bg-muted"
                            onClick={() => {
                              setDateFilter("Week");
                              setDateDropdownOpen(false);
                            }}
                          >
                            Last week
                          </button>
                          <button
                            className="text-left px-2 py-1 rounded hover:bg-muted"
                            onClick={() => {
                              setDateFilter("Month");
                              setDateDropdownOpen(false);
                            }}
                          >
                            Last month
                          </button>
                          <button
                            className="text-left px-2 py-1 rounded hover:bg-muted"
                            onClick={() => {
                              setDateFilter("Year");
                              setDateDropdownOpen(false);
                            }}
                          >
                            Last year
                          </button>
                          <button
                            className="text-left px-2 py-1 rounded hover:bg-muted"
                            onClick={() => {
                              setDateFilter("Custom");
                              setDateDropdownOpen(false);
                              setIsCustomCalendarOpen(true);
                            }}
                          >
                            Custom period
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TableHead>
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
            ) : rejectedDocuments?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-[200px] text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <FileText className="h-10 w-10 text-muted-foreground/60" />
                    <p className="text-muted-foreground">No rejected documents found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rejectedDocuments?.data?.map((doc: any, index: number) => {
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

                // Define sessionIdText here for use below
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
                          <VerificationCell doc={doc} />
                        </div>
                      ) : !isDeleteStatus ? (
                        <Link href={`/pdf/${makefileurl(sessionId)}`} className="text-sm">
                          <VerificationCell doc={doc} />
                        </Link>
                      ) : (
                        <div className="cursor-pointer text-sm" onClick={onSessionStatusCheck}>
                          <VerificationCell doc={doc} />
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
                        </div>
                      )}
                    </TableCell>

                    {/* Remarks column */}
                    <TableCell className="py-3">
                      {(() => {
                        // Show remarks with logic similar to your provided code
                        if (
                          doc?.button?.shareonlyjson &&
                          pdfGenerated(doc?.file?.pdfdata) &&
                          user?.email !== "dirolabs@gmail.com" &&
                          doc?.file?.json_v3_status !== "final-pdftojson"
                        ) {
                          return (
                            <div
                              className="cursor-pointer"
                              onClick={() => onOpenDocView(doc)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") onOpenDocView(doc);
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              <div className="text-left flex justify-start text-[11px] leading-[1] text-black">
                                {doc?.file?.remarks || doc?.remarks}
                                <br />
                              </div>
                            </div>
                          );
                        } else if (doc?.status !== "delete") {
                          return (
                            <Link href={`/pdf/${makefileurl(sessionId)}`} className="block">
                              <div className="text-left flex justify-start text-[11px] leading-[1] text-black">
                                {doc?.file?.remarks || doc?.remarks}
                                <br />
                              </div>
                            </Link>
                          );
                        } else {
                          return (
                            <span
                              className="cursor-pointer flex justify-start"
                              onClick={onSessionStatusCheck}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") onSessionStatusCheck();
                              }}
                              tabIndex={0}
                              role="button"
                            >
                              <div className="text-left flex justify-start text-[11px] leading-[1] text-black">
                                {doc?.file?.remarks || doc?.remarks}
                                <br />
                              </div>
                            </span>
                          );
                        }
                      })()}
                    </TableCell>

                    {/* Name column */}
                    <TableCell className="py-3">
                      {hasProcessingData && (
                        <>
                          {doc?.file?.pdfdata_v3
                            ? doc.file.pdfdata_v3?.map((item: any, i: number) =>
                                item?.type === "name"
                                  ? (item?.values as any[])?.map((value: any, idx: number) => (
                                      <span key={`name-${i}-${idx}`} className="text-sm block">
                                        {value?.name}
                                      </span>
                                    ))
                                  : null
                              )
                            : doc?.file?.combinedJSON
                            ? (doc.file.combinedJSON as any[]).map((item: any, index: number) =>
                                Array.isArray(item?.accountdetails)
                                  ? (item.accountdetails as any[]).map((detail: any, i: number) => (
                                      <span
                                        key={i}
                                        style={{
                                          display: "flex ",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          fontSize: "13px",
                                          fontWeight: "400",
                                          lineHeight: "1",
                                          color: "black",
                                        }}
                                      >
                                        {detail?.name}
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
                        <JsonButton
                          onClick={
                            doc?.file ? () => openPdftojsonModal(sessionId, doc) : (e) => handleNullFileClick(e, "JSON", doc)
                          }
                        >
                          JSON
                        </JsonButton>
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
        sessionId={currentSessionId || undefined}
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

      {/* Report Issue Modal */}
      <ReportIssueModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} />

      {/* Confirmation Modal for null file */}
      {nullFileAlert && (
        <ConfirmationSingleButtonModal
          isOpen={true}
          onClose={() => setNullFileAlert(false)}
          title="Document inaccessible"
          description="Document inaccessible due to unverified URL submission."
          buttonText="Close"
          buttonVariant="error"
        />
      )}

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
      `}</style>
    </>
  );
}
