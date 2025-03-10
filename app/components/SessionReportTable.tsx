"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { firstLetterCap } from "@/app/utils/timeUtils";
import { useAppSelector } from "@/app/store/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, XCircle } from "lucide-react";

interface SessionEvent {
  datetime: string;
  device: string;
  browser: string;
  verified: string;
  couldnotverify: string;
  tryneedhelp: string;
  sessionid: string;
  status?: string;
  timespend?: string;
  details?: string;
}

interface SessionReport {
  data: SessionEvent[];
}

interface SessionReportTableProps {
  sessionId: string;
}

const SessionReportTable: React.FC<SessionReportTableProps> = ({ sessionId }) => {
  const { session_report: sessionReport, loading } = useAppSelector((state) => ({
    session_report: state.table.session_report as unknown as SessionReport,
    loading: state.table.loading,
  }));
  console.log("sessionReport inside the session report table", sessionReport);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!sessionReport || !sessionReport.data || sessionReport.data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <p className="text-muted-foreground">No session data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extract events from the nested data structure
  const events: SessionEvent[] = sessionReport.data;
  console.log("events inside the session report table", events);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Session Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & time</TableHead>
              <TableHead>Device & Browser</TableHead>
              <TableHead>Time spent</TableHead>
              <TableHead>Livefeedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length > 0 ? (
              events.map((event, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{event.datetime || "Unknown"}</TableCell>
                  <TableCell>
                    {event?.device
                      ?.replace("Mozilla/5.0", "")
                      ?.replace("AppleWebKit/537.36 (KHTML, like Gecko)", "")
                      ?.replace("Safari/537.36", "")}
                  </TableCell>
                  <TableCell>{event.timespend}</TableCell>
                  <TableCell>{event.couldnotverify ? "true" : "false"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No events found for this session
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SessionReportTable;
