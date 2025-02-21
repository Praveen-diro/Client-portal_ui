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

const requests = [
  {
    sessionId: "US-zsXuEe",
    button: "Download address",
    site: "sample.diro.me",
    initiatedOn: "23 Hours ago",
    finalStatus: "Tried download / submit",
    exitReason: "",
    trackId: "",
    statusColor: "yellow",
  },
  {
    sessionId: "US-VXbYiZ",
    button: "Bank download green",
    site: "canarabank.com",
    initiatedOn: "23 Hours ago",
    finalStatus: "Abandon",
    exitReason: "User left",
    trackId: "",
    statusColor: "red",
  },
  {
    sessionId: "US-XWDHz2",
    button: "Download address",
    site: "sample.diro.me",
    initiatedOn: "24 Hours ago",
    finalStatus: "In Progress",
    exitReason: "",
    trackId: "",
    statusColor: "blue",
  },
  {
    sessionId: "US-ygs5iX",
    button: "Download address",
    site: "testing99.diro.me",
    initiatedOn: "4 Days ago",
    finalStatus: "Started",
    exitReason: "",
    trackId: "143",
    statusColor: "blue",
  },
  {
    sessionId: "US-NDufyc",
    button: "Download address",
    site: "utility5.diro.me",
    initiatedOn: "4 Days ago",
    finalStatus: "Done, now in Review",
    exitReason: "",
    trackId: "14141",
    statusColor: "green",
  },
];

const statsCards = [
  {
    title: "Total Requests",
    value: "5",
    description: "In the last 7 days",
    icon: Clock,
    color: "blue",
    trend: "+12% from last week",
    trendUp: true,
  },
  {
    title: "Completed Requests",
    value: "1",
    description: "In review",
    icon: CheckCircle2,
    color: "green",
    trend: "On track",
    trendUp: true,
  },
  {
    title: "Abandoned Requests",
    value: "1",
    description: "Require attention",
    icon: AlertCircle,
    color: "red",
    trend: "-5% from last week",
    trendUp: false,
  },
];

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "tried download / submit":
      return <Loader2 className="h-4 w-4 text-yellow-500" />;
    case "abandon":
      return <Ban className="h-4 w-4 text-red-500" />;
    case "in progress":
      return <RefreshCw className="h-4 w-4 text-blue-500" />;
    case "started":
      return <Timer className="h-4 w-4 text-blue-500" />;
    case "done, now in review":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadgeColor = (color: string) => {
  switch (color) {
    case "yellow":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "red":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "blue":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "green":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export default function RequestsSent() {
  const pathname = usePathname();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

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

  return (
    <div className="dark:bg-black bg-white min-h-screen">
      <div className="flex h-screen overflow-hidden">
        <Sidebar onExpandedChange={setSidebarExpanded} />
        <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${sidebarExpanded ? "ml-64" : "ml-16"}`}>
          <TooltipProvider>
            <div className="flex-1 relative">
              <PageHeader title="Requests Sent" description="Manage and track your document verification requests" />
              <div className="container mx-auto px-6 py-8">
                {/* <motion.p
                  className="text-muted-foreground mb-6"
                  initial={initialAnimation}
                  animate={{ opacity: 1, x: 0 }}
                  transition={headerTransitionConfig}
                >
                  Manage and track your document verification requests
                </motion.p> */}

                <div className="grid gap-4 md:grid-cols-3">
                  {statsCards.map((card, index) => (
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
                          <div
                            className={`flex items-center gap-1 mt-2 text-xs ${card.trendUp ? "text-green-500" : "text-red-500"}`}
                          >
                            {card.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {card.trend}
                          </div>
                          <div className={`absolute bottom-0 left-0 h-1 w-full bg-${card.color}-500/20`} />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
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
                        {requests.map((request, index) => (
                          <motion.tr
                            key={request.sessionId}
                            initial={initialAnimation}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              ...transitionConfig,
                              delay: 0.5 + index * 0.05,
                            }}
                            className="group"
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
                                <Badge className={getStatusBadgeColor(request.statusColor)}>
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
                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Download Report</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Cancel Request</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
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
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>
                            1
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </TooltipProvider>
        </main>
      </div>
    </div>
  );
}
