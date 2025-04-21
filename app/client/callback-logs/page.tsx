"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/ui/sidebar";
import { PageContainer } from "@/components/ui/page-container";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setCallbackLogs, setLoading, setError } from "@/app/store/features/logsSlice";
import { logsService } from "@/app/services/logs.service";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useToast } from "@/components/ui/use-toast";

// Types
interface Request {
  stage: string;
  docid: string;
  sandbox: boolean;
  buttonid: string;
  category: string;
  email: string;
  message: string;
  name: string;
  sourcecountry: string;
  sourcename: string;
  type: string;
}

interface CallbackLog {
  date: string;
  orgid: string;
  request: Request;
  status: number;
}

export default function CallbackLogsPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const logsState = useAppSelector((state) => state.logs);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedLog, setSelectedLog] = useState<CallbackLog | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isRetryModalOpen, setIsRetryModalOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryLog, setRetryLog] = useState<CallbackLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Destructure with default values to handle undefined state
  const { callbackLogs = [], loading = false, error = null } = logsState || {};

  // Calculate pagination
  const totalLogs = callbackLogs.length;
  const totalPages = Math.ceil(totalLogs / pageSize) || 1;
  const paginatedLogs = callbackLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to first page if logs change and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Fetch callback logs
  const fetchCallbackLogs = async () => {
    try {
      dispatch(setLoading(true));
      const response = await logsService.getCallbackLogs();

      if (response.success && response.data) {
        dispatch(setCallbackLogs(response.data));
      } else {
        dispatch(setError(response.error || "Failed to fetch callback logs"));
      }
    } catch (error) {
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCallbackLogs();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    fetchCallbackLogs();
  };

  const handleRowClick = (log: CallbackLog) => {
    setSelectedLog(log);
    setIsViewerOpen(true);
  };

  const handleCopyJson = () => {
    if (selectedLog) {
      navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleRetry = async () => {
    if (!retryLog) return;

    setIsRetrying(true);
    try {
      const response = await logsService.sendCallback(retryLog);
      console.log("Callback response:", response); // Debug log

      if (response.success) {
        const responseData = response.data;
        console.log("Response data:", responseData); // Debug log

        if (responseData?.error) {
          // API returned error in response data
          const errorMessage = responseData.ResponseFromCallBackUrl || "Invalid callback URL";
          console.log("Error message:", errorMessage); // Debug log

          toast({
            title: "Callback Error",
            description: errorMessage,
            variant: "destructive",
            duration: 5000, // Show for longer
          });
        } else {
          // Success case
          toast({
            title: "Success",
            description: responseData?.ResponseFromCallBackUrl || "Callback sent successfully",
            variant: "default",
          });
          // Refresh the logs
          fetchCallbackLogs();
        }
      } else {
        // API request failed
        const errorMessage = response.error || "Failed to send callback";
        console.log("API error:", errorMessage); // Debug log

        toast({
          title: "Request Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 5000, // Show for longer
        });
      }
    } catch (error: any) {
      console.error("Unexpected error:", error); // Debug log

      toast({
        title: "System Error",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
        duration: 5000, // Show for longer
      });
    } finally {
      setIsRetrying(false);
      setIsRetryModalOpen(false);
      setRetryLog(null);
    }
  };

  const handleRetryClick = (log: CallbackLog, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setRetryLog(log);
    setIsRetryModalOpen(true);
  };

  const renderJsonValue = (value: any): JSX.Element => {
    if (typeof value === "string") {
      return <span className="text-green-500">"{value}"</span>;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return <span className="text-blue-500">{String(value)}</span>;
    }
    if (value === null) {
      return <span className="text-gray-500">null</span>;
    }
    if (Array.isArray(value)) {
      return <span className="text-orange-500">[...]</span>;
    }
    if (typeof value === "object") {
      return <span className="text-orange-500">{"{...}"}</span>;
    }
    return <span>{String(value)}</span>;
  };

  const renderJsonContent = (data: any, level = 0): JSX.Element => {
    const indent = "  ".repeat(level);

    if (typeof data !== "object" || data === null) {
      return <div>{renderJsonValue(data)}</div>;
    }

    return (
      <div>
        {Object.entries(data).map(([key, value], index) => (
          <div key={key} className="flex">
            <span className="text-gray-400 select-none w-8">{indent}</span>
            <div className="flex-1">
              <span className="text-purple-500">"{key}"</span>
              <span className="text-gray-400">: </span>
              {typeof value === "object" && value !== null ? (
                <div>
                  {Array.isArray(value) ? "[" : "{"}
                  <div className="ml-4">{renderJsonContent(value, level + 1)}</div>
                  <div>
                    <span className="text-gray-400 select-none w-8">{indent}</span>
                    {Array.isArray(value) ? "]" : "}"}
                    {index < Object.keys(data).length - 1 && ","}
                  </div>
                </div>
              ) : (
                <span>
                  {renderJsonValue(value)}
                  {index < Object.keys(data).length - 1 && ","}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading logs...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8 text-destructive">
            Error loading logs: {error.message || "Unknown error"}
          </TableCell>
        </TableRow>
      );
    }

    if (!Array.isArray(callbackLogs) || callbackLogs.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
            No logs found
          </TableCell>
        </TableRow>
      );
    }

    return paginatedLogs.map((log, index) => (
      <TableRow
        key={index + (currentPage - 1) * pageSize}
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => handleRowClick(log)}
      >
        <TableCell className="font-medium">{log.request.name}</TableCell>
        <TableCell>{log.request.category}</TableCell>
        <TableCell className="font-mono text-sm">{log.request.docid}</TableCell>
        <TableCell>{log.request.type}</TableCell>
        <TableCell>{format(new Date(parseInt(log.date)), "PPp")}</TableCell>
        <TableCell className="max-w-[200px] truncate">{log.request.message}</TableCell>
        <TableCell>
          <Badge variant={log.status === 200 ? "success" : log.status === 400 ? "secondary" : "destructive"}>
            {log.status === 200 ? "Success" : log.status === 400 ? "Bad Request" : "Error"}
          </Badge>
        </TableCell>
        <TableCell className="font-mono text-sm">{log.request.email}</TableCell>
        <TableCell>
          <Button variant="outline" size="icon" onClick={(e) => handleRetryClick(log, e)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  // Pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t bg-card rounded-b-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {pageNumbers.map((num) => (
            <Button
              key={num}
              variant={num === currentPage ? "default" : "ghost"}
              size="icon"
              onClick={() => setCurrentPage(num)}
              aria-current={num === currentPage ? "page" : undefined}
              aria-label={`Page ${num}`}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-muted-foreground">
            Rows per page:
          </label>
          <select
            id="page-size"
            className="border rounded px-2 py-1 text-sm bg-background"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            aria-label="Rows per page"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar onExpandedChange={setSidebarExpanded} />
      </div>
      <PageContainer sidebarExpanded={sidebarExpanded}>
        <div className="container mx-auto px-12 pb-10 space-y-8">
          <PageHeader
            title="Callback Logs"
            description="Monitor and track all callback responses from your verification requests"
          />

          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
            {/* Logs Table */}
            <motion.div variants={itemVariants} className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Button Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Session id</TableHead>
                    <TableHead>Callback type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Callback response</TableHead>
                    <TableHead>Callback status</TableHead>
                    <TableHead>Track id</TableHead>
                    <TableHead>Retry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
              {renderPagination()}
            </motion.div>
          </motion.div>
        </div>
      </PageContainer>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Callback Log Details</DialogTitle>
          </DialogHeader>
          <div className="relative bg-slate-950 rounded-lg p-4 font-mono text-sm overflow-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyJson}
              className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-slate-800"
            >
              {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
            </Button>
            {selectedLog && renderJsonContent(selectedLog)}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        isOpen={isRetryModalOpen}
        onClose={() => {
          setIsRetryModalOpen(false);
          setRetryLog(null);
        }}
        onConfirm={handleRetry}
        title="Request Callback"
        description="Are you sure you want to request a callback?"
        cancelText="No"
        confirmText="Yes"
        variant="warning"
        isLoading={isRetrying}
      />
    </div>
  );
}
