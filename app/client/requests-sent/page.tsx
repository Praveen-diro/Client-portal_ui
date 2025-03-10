"use client";

import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowUpRight,
  Ban,
  Loader2,
  ExternalLink,
  MoreHorizontal,
  Download,
  RefreshCw,
  Timer,
  XCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageHeader } from "@/components/ui/page-header";
import { Sidebar } from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchSessionReport,
  fetchAutoNavData,
  submitFeedback,
  resetFeedbackStatus,
} from "@/app/store/features/sessionReportSlice";
import SessionReportTable from "@/app/components/SessionReportTable";
import AiLogsTable from "@/app/components/AiLogsTable";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tableService } from "@/app/services/table.service";
import { getUserTime } from "@/app/utils/timeUtils";

// Define form schema for feedback
const formSchema = z.object({
  comment: z.string().min(1, { message: "Comment is required" }),
});

// Type for request items
interface RequestItem {
  sessionId: string;
  button: string;
  site: string;
  initiatedOn: string;
  finalStatus: string;
  exitReason: string;
  trackId: string;
  statusColor: string;
}

// Type for stats card
interface StatsCard {
  title: string;
  value: string;
  description: string;
  icon: any; // Component type
  color: string;
  trend: string;
  trendUp: boolean;
}

// Mock requests data - will be replaced with API data
const initialRequests: RequestItem[] = [];

// Initial stats cards data
const initialStatsCards: StatsCard[] = [
  {
    title: "Total Requests",
    value: "0",
    description: "In the last 7 days",
    icon: Clock,
    color: "blue",
    trend: "",
    trendUp: true,
  },
  {
    title: "Completed Requests",
    value: "0",
    description: "In review",
    icon: CheckCircle2,
    color: "green",
    trend: "",
    trendUp: true,
  },
  {
    title: "Abandoned Requests",
    value: "0",
    description: "Require attention",
    icon: AlertCircle,
    color: "red",
    trend: "",
    trendUp: false,
  },
];

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "tried download / submit":
    case "download / submit":
      return <Loader2 className="h-4 w-4 text-yellow-500" />;
    case "abandon":
    case "abandoned":
      return <Ban className="h-4 w-4 text-red-500" />;
    case "in progress":
      return <RefreshCw className="h-4 w-4 text-blue-500" />;
    case "started":
      return <Timer className="h-4 w-4 text-blue-500" />;
    case "done, now in review":
    case "completed":
    case "verified":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadgeColor = (status: string) => {
  status = status.toLowerCase();

  if (status.includes("abandon")) {
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  } else if (status.includes("tried") || status.includes("download") || status.includes("submit")) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  } else if (status.includes("progress") || status.includes("started")) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  } else if (
    status.includes("done") ||
    status.includes("review") ||
    status.includes("completed") ||
    status.includes("verified")
  ) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  } else {
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

// Function to map API response to request items
const mapApiResponseToRequestItems = (apiData: any): RequestItem[] => {
  console.log("Mapping API data to request items:", apiData);

  if (!apiData) {
    console.warn("No API data received");
    return [];
  }

  // Handle different API response structures
  let dataArray: any[] = [];

  if (Array.isArray(apiData)) {
    // Direct array response
    dataArray = apiData;
  } else if (apiData.data && Array.isArray(apiData.data)) {
    // Nested data response
    dataArray = apiData.data;
  } else {
    console.warn("Unexpected API response structure:", apiData);
    return [];
  }

  console.log("Data array to map:", dataArray);

  return dataArray.map((item: any) => {
    const status = item.sessionstats?.[0].finalindicatorstatus || "Not available";
    console.log("Mapping item:", item);

    return {
      sessionId: item.sessionId || item.session_id || item.usertoken || "Unknown",
      button: item.button || item.buttonname || item.button_name || "Unknown",
      site: item.site || item.sessionstats?.[0]?.site || item.website || item.site_name || "Not available",
      initiatedOn: item.crtime ? getUserTime(item.crtime) : "",
      finalStatus: status,
      exitReason: item.sessionstats?.[0]?.finalExitstatus || item.reason || item.exit_reason || "",
      trackId: item.trackId || item.track_id || "",
      statusColor: getStatusColorFromStatus(status),
    };
  });
};

// Helper function to determine status color
const getStatusColorFromStatus = (status: string): string => {
  status = status.toLowerCase();

  if (status.includes("abandon")) {
    return "red";
  } else if (status.includes("tried") || status.includes("download") || status.includes("submit")) {
    return "yellow";
  } else if (status.includes("progress") || status.includes("started")) {
    return "blue";
  } else if (
    status.includes("done") ||
    status.includes("review") ||
    status.includes("completed") ||
    status.includes("verified")
  ) {
    return "green";
  } else {
    return "gray";
  }
};

export default function RequestsSent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { autoNavData, loading, feedbackSubmitted, error: reduxError } = useAppSelector((state) => state.sessionReport);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [sessionModal, setSessionModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [stats, setStats] = useState<StatsCard[]>(initialStatsCards);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  // Fetch requests data from API
  const fetchRequests = async (page = 1, search = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const offset = page - 1;
      let response;

      if (search) {
        response = await tableService.searchTable(search, offset, itemsPerPage);
      } else {
        response = await tableService.getRequested({
          offset,
          limit: itemsPerPage,
          status: "invite",
        });
      }

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch requests");
      }

      // Debug the response data
      console.log("API Response data:", response.data);

      const mappedRequests = mapApiResponseToRequestItems(response.data);

      console.log("Mapped requests:", mappedRequests);

      setRequests(mappedRequests);

      // Update stats based on data
      const totalRequests = response.data?.total || mappedRequests.length;
      const completedRequests = mappedRequests.filter(
        (req) =>
          req.statusColor === "green" ||
          req.finalStatus.toLowerCase().includes("done") ||
          req.finalStatus.toLowerCase().includes("completed") ||
          req.finalStatus.toLowerCase().includes("verified")
      ).length;
      const abandonedRequests = mappedRequests.filter(
        (req) => req.statusColor === "red" || req.finalStatus.toLowerCase().includes("abandon")
      ).length;

      setStats([
        {
          ...initialStatsCards[0],
          value: totalRequests.toString(),
          trend: "",
        },
        {
          ...initialStatsCards[1],
          value: completedRequests.toString(),
          trend: "",
        },
        {
          ...initialStatsCards[2],
          value: abandonedRequests.toString(),
          trend: "",
        },
      ]);

      // Update pagination
      const totalItems = response.data?.total || mappedRequests.length;
      setTotalPages(Math.max(1, Math.ceil(totalItems / itemsPerPage)));
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch data on mount and when search or current page changes
  useEffect(() => {
    // Debug Redux state - using the already retrieved state at component level
    console.log("Redux sessionReport state:", {
      autoNavData,
      loading,
      feedbackSubmitted,
      error: reduxError,
    });

    // Fetch data with the current page
    fetchRequests(currentPage, searchQuery);
  }, [currentPage, searchQuery, autoNavData, loading, feedbackSubmitted, reduxError, currentPage]);

  useEffect(() => {
    setShouldAnimate(true);
    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const initialAnimation = shouldAnimate ? { opacity: 0, x: 200 } : { opacity: 1, x: 0 };

  const headerTransitionConfig = {
    type: "spring",
    stiffness: 50,
    damping: 30,
    restDelta: 0.001,
    mass: 1,
  };

  const transitionConfig = {
    type: "spring",
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
    mass: 0.5,
  };

  // Function to handle session detail view
  const handleViewSessionDetails = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    dispatch(fetchSessionReport(sessionId));
    dispatch(fetchAutoNavData(sessionId));
    setSessionModal(true);
  };

  // Function to open report modal
  const handleOpenReportModal = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setReportModal(true);
    dispatch(resetFeedbackStatus());
    form.reset();
  };

  // Function to handle feedback submission
  const onSubmitFeedback = (values: z.infer<typeof formSchema>) => {
    if (!selectedSessionId) return;

    const feedbackData = {
      email: "user@example.com", // Replace with actual user email
      sessionId: selectedSessionId,
      comment: values.comment,
      source: "client portal",
    };

    dispatch(submitFeedback(feedbackData));
  };

  // Check if the auto nav data has URLs
  const hasUrls = autoNavData && autoNavData.navLogs && autoNavData.navLogs.some((log) => log.currentUrl);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchRequests(1, searchQuery);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar onExpandedChange={setSidebarExpanded} />
      </div>
      <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${sidebarExpanded ? "ml-64" : "ml-16"}`}>
        <TooltipProvider>
          <div className="flex-1 relative">
            <PageHeader title="Requests Sent" description="Manage and track your document verification requests" />
            <div className="container mx-auto px-6 py-8">
              <div className="grid gap-4 md:grid-cols-3">
                {stats.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={initialAnimation}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      ...transitionConfig,
                      delay: index * 0.1,
                    }}
                  >
                    <Card className={`relative overflow-hidden`}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className={`h-4 w-4 text-${card.color}-500`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">{card.description}</p>
                        {card.trend && (
                          <div
                            className={`flex items-center gap-1 mt-2 text-xs ${card.trendUp ? "text-green-500" : "text-red-500"}`}
                          >
                            {card.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {card.trend}
                          </div>
                        )}
                        <div className={`absolute bottom-0 left-0 h-1 w-full bg-${card.color}-500/20`} />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 mb-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                  />
                  <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
              </div>

              <motion.div
                initial={initialAnimation}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  ...transitionConfig,
                  delay: 0.4,
                }}
                className="rounded-lg border bg-card mt-6"
              >
                <div className="rounded-md">
                  <Table>
                    <TableHeader>
                      <motion.tr
                        initial={initialAnimation}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          ...transitionConfig,
                          delay: 0.45,
                        }}
                      >
                        <TableHead>Session Id</TableHead>
                        <TableHead>Button</TableHead>
                        <TableHead>Site</TableHead>
                        <TableHead>Initiated on</TableHead>
                        <TableHead>Final status</TableHead>
                        <TableHead>Exit reason</TableHead>
                        <TableHead>Track Id</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </motion.tr>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        // Loading state
                        Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <TableRow key={index}>
                              <TableCell colSpan={8} className="h-12 animate-pulse bg-gray-100 dark:bg-gray-800"></TableCell>
                            </TableRow>
                          ))
                      ) : error ? (
                        // Error state
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-red-500">
                            Error loading requests: {error}
                          </TableCell>
                        </TableRow>
                      ) : requests.length === 0 ? (
                        // Empty state
                        <TableRow>
                          <TableCell colSpan={8} className="text-center">
                            No requests found
                          </TableCell>
                        </TableRow>
                      ) : (
                        (console.log(requests, "here is the request-sent"),
                        // Populated state
                        requests.map((request, index) => (
                          <motion.tr
                            key={request.sessionId}
                            initial={initialAnimation}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              ...transitionConfig,
                              delay: 0.5 + index * 0.05,
                            }}
                            className="group cursor-pointer relative overflow-hidden hover:bg-gray-100/80 dark:hover:bg-gray-700/30 border-l-0 hover:border-l-4 border-l-transparent hover:border-primary"
                          >
                            <TableCell className="font-medium">
                              <code className="rounded bg-muted px-2 py-1 text-sm">{request.sessionId}</code>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Download className="h-4 w-4 text-blue-500" />
                                {request.button}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4 text-gray-500" />
                                {request.site}
                              </div>
                            </TableCell>
                            <TableCell>{request.initiatedOn}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusBadgeColor(request.finalStatus)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(request.finalStatus)}
                                    <span>{request.finalStatus}</span>
                                  </div>
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{request.exitReason}</TableCell>
                            <TableCell>
                              {request.trackId && <code className="rounded bg-muted px-2 py-1 text-sm">{request.trackId}</code>}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className=" group-hover:opacity-100">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewSessionDetails(request.sessionId)}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Download Report</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOpenReportModal(request.sessionId)}>
                                      Report Issue
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Cancel Request</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </motion.tr>
                        )))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <motion.div
                  initial={initialAnimation}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    ...transitionConfig,
                    delay: 0.6,
                  }}
                  className="flex items-center justify-center py-4"
                >
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Logic to show pagination numbers around current page
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }

                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </TooltipProvider>
      </main>

      {/* Session Details Modal */}
      <Dialog open={sessionModal} onOpenChange={setSessionModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Session Details: {selectedSessionId}</DialogTitle>
            <DialogDescription>View detailed information about this session.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="session">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="session">Session Report</TabsTrigger>
              <TabsTrigger value="aiLogs" disabled={!hasUrls}>
                AI Navigation Logs
              </TabsTrigger>
            </TabsList>
            <TabsContent value="session" className="space-y-4 mt-4">
              {selectedSessionId && <SessionReportTable sessionId={selectedSessionId} />}
            </TabsContent>
            <TabsContent value="aiLogs" className="space-y-4 mt-4">
              {selectedSessionId && <AiLogsTable sessionId={selectedSessionId} />}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button onClick={() => handleOpenReportModal(selectedSessionId!)}>Report Issue</Button>
            <Button variant="outline" onClick={() => setSessionModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Issue Modal */}
      <Dialog open={reportModal} onOpenChange={setReportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Issue</DialogTitle>
            <DialogDescription>Submit feedback for session {selectedSessionId}</DialogDescription>
          </DialogHeader>

          {feedbackSubmitted ? (
            <Alert className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              <AlertDescription>Thank you for your feedback! Your issue has been reported successfully.</AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitFeedback)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please describe the issue you're experiencing" className="min-h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => setReportModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
