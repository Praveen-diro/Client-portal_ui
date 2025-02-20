"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Search, Eye, MoreVertical, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

// Sample data
const documents = [
  {
    id: 1,
    name: "Bank Statement - March 2024",
    button: "New Buttondfsa",
    type: "Bank",
    source: "diro.me",
    sessionId: "DD-WyJ91S-test",
    status: "pending",
    dateReceived: "2024-03-08",
    trackId: "JSON-001",
  },
  {
    id: 2,
    name: "Proof of Address",
    button: "Address Verification",
    type: "Address",
    source: "diro.me",
    sessionId: "DD-WyJ92S-test",
    status: "approved",
    dateReceived: "2024-03-07",
    trackId: "JSON-002",
  },
  {
    id: 3,
    name: "Utility Bill",
    button: "Bill Verification",
    type: "Address",
    source: "diro.me",
    sessionId: "DD-WyJ93S-test",
    status: "rejected",
    dateReceived: "2024-03-06",
    trackId: "JSON-003",
  },
  {
    id: 4,
    name: "Credit Card Statement",
    button: "Bank Statement",
    type: "Bank",
    source: "diro.me",
    sessionId: "DD-WyJ94S-test",
    status: "pending",
    dateReceived: "2024-03-05",
    trackId: "JSON-004",
  },
];

const stats = {
  pending: 10,
  approved: 25,
  rejected: 5,
};

export default function DocumentsReceived() {
  const pathname = usePathname();
  const [shouldAnimate, setShouldAnimate] = useState(true);

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

  return (
    <div className="flex-1">
      <PageHeader title="Documents Received" description="View and manage received documents for verification" />
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            initial={initialAnimation}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              ...transitionConfig,
              delay: 0.1,
            }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-yellow-500/20" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={initialAnimation}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              ...transitionConfig,
              delay: 0.2,
            }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{stats.approved}</div>
                <p className="text-xs text-muted-foreground mt-1">Verified documents</p>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-green-500/20" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={initialAnimation}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              ...transitionConfig,
              delay: 0.3,
            }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{stats.rejected}</div>
                <p className="text-xs text-muted-foreground mt-1">Failed verification</p>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-red-500/20" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={initialAnimation}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            ...transitionConfig,
            delay: 0.4,
          }}
          className="bg-card rounded-lg border shadow-sm mt-6"
        >
          <Tabs defaultValue="all" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Button</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Session ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Received</TableHead>
                      <TableHead>Track ID</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc, index) => (
                      <motion.tr
                        key={doc.id}
                        initial={initialAnimation}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          ...transitionConfig,
                          delay: 0.5 + index * 0.05,
                        }}
                        className="group"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{doc.button}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>{doc.source}</TableCell>
                        <TableCell>
                          <code className="rounded bg-muted px-2 py-1 text-sm">{doc.sessionId}</code>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{doc.dateReceived}</TableCell>
                        <TableCell>{doc.trackId}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
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
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
