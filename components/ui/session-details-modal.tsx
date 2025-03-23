"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchSessionReport, fetchAutoNavData } from "@/app/store/features/tableSlice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionReportTable from "@/app/components/SessionReportTable";
import AiLogsTable from "@/app/components/AiLogsTable";
import Loader from "@/components/ui/loader";

interface SessionDetailsModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  /**
   * The session ID to display details for
   */
  sessionId?: string;
  /**
   * Function to call when "Report Issue" is clicked
   */
  onReportIssue?: (sessionId: string) => void;
}

// Define the NavLog interface to match what's needed
interface NavLog {
  currentUrl: string;
  timestamp?: string;
  title?: string;
}

export function SessionDetailsModal({ isOpen, onClose, sessionId, onReportIssue }: SessionDetailsModalProps) {
  const dispatch = useAppDispatch();
  const { AutoNavData: autoNavData, loading } = useAppSelector((state) => state.table);
  const [activeTab, setActiveTab] = useState("session");

  // Fetch session report and auto nav data when component mounts or sessionId changes
  useEffect(() => {
    if (isOpen && sessionId) {
      dispatch(fetchSessionReport(sessionId));
      dispatch(fetchAutoNavData(sessionId));
    }
  }, [isOpen, sessionId, dispatch]);

  // Check if the auto nav data has URLs
  const hasUrls = autoNavData?.baseUrl || autoNavData?.navLogs?.some((log: NavLog) => Boolean(log.currentUrl));

  const handleReportIssue = () => {
    if (sessionId && onReportIssue) {
      onReportIssue(sessionId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] w-full h-[800px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Session Details: {sessionId}</DialogTitle>
          <DialogDescription>View detailed information about this session.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader />
          </div>
        ) : (
          <Tabs defaultValue="session" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="session">Session Report</TabsTrigger>
              <TabsTrigger value="aiLogs" disabled={!hasUrls}>
                AI Navigation Logs
              </TabsTrigger>
            </TabsList>
            <TabsContent value="session" className="space-y-4 mt-4">
              {sessionId && <SessionReportTable sessionId={sessionId} />}
            </TabsContent>
            <TabsContent value="aiLogs" className="space-y-4 mt-4">
              {sessionId && <AiLogsTable sessionId={sessionId} />}
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className="mt-4">
          {onReportIssue && <Button onClick={handleReportIssue}>Report Issue</Button>}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
