"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Filter, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface CallbackLog {
  id: string;
  buttonName: string;
  category: string;
  sessionId: string;
  callbackType: string;
  date: string;
  response: string;
  status: "success" | "error" | "pending";
  trackId: string;
}

export default function CallbackLogsPage() {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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

  // Mock data - replace with actual data fetching
  const mockLogs: CallbackLog[] = [
    {
      id: "1",
      buttonName: "Verify Identity",
      category: "KYC",
      sessionId: "sess_123456",
      callbackType: "Webhook",
      date: "2024-03-20T10:30:00",
      response: "Verification successful",
      status: "success",
      trackId: "track_abc123",
    },
    {
      id: "2",
      buttonName: "Document Upload",
      category: "Document",
      sessionId: "sess_789012",
      callbackType: "API",
      date: "2024-03-20T09:15:00",
      response: "Invalid document format",
      status: "error",
      trackId: "track_def456",
    },
    // Add more mock data as needed
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <PageHeader title="Callback Logs" description="Monitor and track all callback responses from your verification requests" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        {/* Filters Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-lg border shadow-sm"
        >
          <div className="flex flex-1 gap-4 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="kyc">KYC</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="biometric">Biometric</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[130px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Logs Table */}
        <motion.div variants={itemVariants} className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Button Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Session ID</TableHead>
                <TableHead>Callback Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Track ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.buttonName}</TableCell>
                  <TableCell>{log.category}</TableCell>
                  <TableCell className="font-mono text-sm">{log.sessionId}</TableCell>
                  <TableCell>{log.callbackType}</TableCell>
                  <TableCell>{format(new Date(log.date), "PPp")}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{log.response}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "success" ? "success" : log.status === "error" ? "destructive" : "outline"}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.trackId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </motion.div>
    </div>
  );
}
