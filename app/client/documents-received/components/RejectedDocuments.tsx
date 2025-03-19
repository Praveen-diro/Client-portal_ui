"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FileText, Eye, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Loader from "@/components/ui/loader";
import { tableService } from "@/app/services/table.service";
import { getRejects } from "@/app/store/features/tableSlice";

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

export default function RejectedDocuments({ isActive, searchQuery }: RejectedDocumentsProps) {
  const dispatch = useDispatch();
  const rejectedDocuments = useSelector((state: any) => state.table.rejects);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch rejected documents
  useEffect(() => {
    if (isActive) {
      fetchRejectedDocuments(currentPage);
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

  const fetchRejectedDocuments = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * itemsPerPage;
      const response = await tableService.getRejected({
        offset,
        limit: itemsPerPage,
        status: "rejected",
      });

      if (response.success) {
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
      } else {
        throw new Error(response.error || "Failed to fetch rejected documents");
      }
    } catch (err) {
      console.error("Error fetching rejected documents:", err);
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
      const response = await tableService.searchTable(searchQuery, (currentPage - 1) * itemsPerPage, itemsPerPage);

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

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={9} className="h-[300px] text-center">
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={9} className="text-center text-red-500">
            Error loading documents: {error}
          </TableCell>
        </TableRow>
      );
    }

    const currentData =
      rejectedDocuments && rejectedDocuments.data ? (Array.isArray(rejectedDocuments.data) ? rejectedDocuments.data : []) : [];

    if (currentData.length > 0) {
      return currentData.map((doc: any, index: number) => {
        // Extract specific primitive values from complex objects
        const docName = typeof doc.name === "string" ? doc.name : doc.documentName || (doc.file && doc.file.name) || "Document";

        const buttonText =
          typeof doc.button === "string" ? doc.button : (doc.button && doc.button.name) || doc.buttonName || "Default Button";

        const docType = typeof doc.type === "string" ? doc.type : doc.documentType || "Unknown";

        const sourceText = typeof doc.source === "string" ? doc.source : doc.website || "diro.me";

        const sessionIdText = typeof doc.sessionId === "string" ? doc.sessionId : doc.session_id || doc.mxid || "Unknown";

        const statusText = typeof doc.status === "string" ? doc.status : "rejected";

        const trackIdText = typeof doc.trackId === "string" ? doc.trackId : doc.track_id || `DOC-${index}`;

        // Generate unique key
        const rowKey = doc.id || doc.mxid || sessionIdText || trackIdText || `doc-${index}`;

        return (
          <TableRow key={rowKey} className="group hover:bg-muted/50">
            <TableCell>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{docName}</span>
              </div>
            </TableCell>
            <TableCell>{buttonText}</TableCell>
            <TableCell>
              <Badge variant="outline">{docType}</Badge>
            </TableCell>
            <TableCell>{sourceText}</TableCell>
            <TableCell>
              <code className="rounded bg-muted px-2 py-1 text-sm">{sessionIdText}</code>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(statusText)}>{statusText.charAt(0).toUpperCase() + statusText.slice(1)}</Badge>
            </TableCell>
            <TableCell>{doc.crtime ? getRelativeTime(doc.crtime) : "Not available"}</TableCell>
            <TableCell>{trackIdText}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
        <TableCell colSpan={9} className="h-[200px] text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <FileText className="h-10 w-10 text-muted-foreground/60" />
            <h3 className="text-lg font-semibold">No data found</h3>
            <p className="text-muted-foreground">No rejected documents found.</p>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Button</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Verification source</TableHead>
            <TableHead>Session ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Track ID</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderContent()}</TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center py-4">
        <div className="inline-flex items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-full border px-3 py-1">
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
    </>
  );
}
