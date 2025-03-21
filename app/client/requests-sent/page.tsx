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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageHeader } from "@/components/ui/page-header";
import { Sidebar } from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchSessionReport, fetchAutoNavData, submitFeedback, resetFeedbackStatus } from "@/app/store/features/tableSlice";
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
import Loader from "@/components/ui/loader";
// Define form schema for feedback
const formSchema = z.object({
  comment: z.string().min(1, { message: "Comment is required" }),
  rating: z.string().refine((value) => parseInt(value) >= 1 && parseInt(value) <= 5, {
    message: "Rating must be between 1 and 5",
  }),
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

// Define the NavLog interface to match what's needed in this component
interface NavLog {
  currentUrl: string;
  timestamp?: string;
  title?: string;
}

export default function RequestsSent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const {
    AutoNavData: autoNavData,
    loading,
    submitFeedalert: feedbackSubmitted,
    error: reduxError,
  } = useAppSelector((state) => state.table);
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
      rating: "1",
    },
  });

  // Fetch requests data from API
  const fetchRequests = async (page = 1, search = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const offset = page - 1; // Calculate offset based on current page
      let response;

      if (search) {
        // Debounced search using searchTable
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

      // If we got less than itemsPerPage items, we're on the last page
      const isLastPage = mappedRequests.length < itemsPerPage;
      setTotalPages(isLastPage ? page : page + 1);

      setRequests(mappedRequests);
      setCurrentPage(page);

      // Update stats based on current page data
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
          value: mappedRequests.length.toString(),
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
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch initial data
  useEffect(() => {
    fetchRequests(1);
  }, []);

  // Effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        fetchRequests(1, searchQuery);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    console.log("Dispatching session details for:", sessionId);
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
      rating: parseInt(values.rating),
    };

    dispatch(submitFeedback(feedbackData));
  };

  // Check if the auto nav data has URLs
  const hasUrls = autoNavData?.baseUrl || autoNavData?.navLogs.some((log: NavLog) => Boolean(log.currentUrl));

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Only search if query has 3 or more characters
    if (searchQuery.trim().length >= 3) {
      fetchRequests(1, searchQuery);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when search query changes

    // If search input is cleared, reset to default table data
    if (!value.trim()) {
      fetchRequests(1);
    }
    // Don't need to add minimum character check here as it's handled in the debounced effect
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
              {/* <div className="grid gap-4 md:grid-cols-3">
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
              </div> */}

              <div className="mt-1 mb-4 flex justify-end">
                <div className="relative max-w-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="Search requests... (minimum 3 characters)"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="w-[300px] pr-8 py-2 h-10 bg-background border border-input rounded-md focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    {searchQuery && (
                      <div className="absolute inset-y-0 right-0 flex items-center mr-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 hover:bg-transparent"
                          onClick={() => {
                            setSearchQuery("");
                            fetchRequests(1);
                          }}
                        >
                          <XCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
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
                <div className="rounded-md min-h-[400px]">
                  <Table>
                    <TableHeader>
                      <motion.tr
                        initial={initialAnimation}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          ...transitionConfig,
                          delay: 0.45,
                        }}
                        className="border-b border-border/70 dark:border-border/50 bg-muted/30"
                      >
                        <TableHead className="h-11 font-medium text-muted-foreground">Session Id</TableHead>
                        <TableHead className="h-11 font-medium text-muted-foreground">Button</TableHead>
                        <TableHead className="h-11 font-medium text-muted-foreground">Site</TableHead>
                        <TableHead className="h-11 font-medium text-muted-foreground">Initiated on</TableHead>
                        <TableHead className="h-11 font-medium text-muted-foreground">Final status</TableHead>
                        <TableHead className="h-11 font-medium text-muted-foreground">Exit reason</TableHead>
                        <TableHead className="h-11 font-medium text-muted-foreground">Track Id</TableHead>
                        <TableHead className="h-11 font-medium text-muted-foreground text-right">Actions</TableHead>
                      </motion.tr>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-[300px] text-center">
                            <div className="flex justify-center items-center h-full">
                              <Loader />
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-red-500">
                            Error loading requests: {error}
                          </TableCell>
                        </TableRow>
                      ) : requests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-16 text-center">
                            <h3 className="text-lg font-semibold">No requests found</h3>
                          </TableCell>
                        </TableRow>
                      ) : (
                        // Render request items
                        requests.map((request, index) => (
                          <motion.tr
                            key={request.sessionId}
                            initial={initialAnimation}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              ...transitionConfig,
                              delay: 0.5 + index * 0.05,
                            }}
                            className="group cursor-pointer h-16 border-b border-border/60 dark:border-border/40 hover:bg-accent/40"
                          >
                            <TableCell className="font-medium">
                              <code className="rounded bg-muted px-2 py-1 text-sm font-mono">{request.sessionId}</code>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Download className="h-4 w-4 text-blue-500" />
                                {request.button}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
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
                            <TableCell className="max-w-[200px] truncate">{request.exitReason}</TableCell>
                            <TableCell>
                              {request.trackId && (
                                <code className="rounded bg-muted px-2 py-1 text-sm font-mono">{request.trackId}</code>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="opacity-70 group-hover:opacity-100">
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
                        ))
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
                  <div className="inline-flex items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-full border px-3 py-1">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (currentPage > 1) {
                          const newPage = currentPage - 1;
                          fetchRequests(newPage, searchQuery);
                        }
                      }}
                      disabled={currentPage <= 1}
                      className="h-8 rounded-full flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>
                    <span className="text-sm font-medium">{currentPage}</span>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const newPage = currentPage + 1;
                        fetchRequests(newPage, searchQuery);
                      }}
                      disabled={requests.length < itemsPerPage}
                      className="h-8 rounded-full flex items-center gap-2"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </TooltipProvider>
      </main>

      {/* Session Details Modal */}
      <Dialog open={sessionModal} onOpenChange={setSessionModal}>
        <DialogContent className="max-w-[1200px] w-full h-[800px] max-h-[90vh] overflow-auto">
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
