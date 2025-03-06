"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { firstLetterCap } from "@/app/utils/timeUtils";
import { useAppSelector } from "@/app/store/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, XCircle } from "lucide-react";

interface SessionReportTableProps {
  sessionId: string;
}

const SessionReportTable: React.FC<SessionReportTableProps> = ({ sessionId }) => {
  const { sessionReport, loading } = useAppSelector((state) => state.sessionReport);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!sessionReport || !sessionReport.data) {
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

  // Assuming sessionReport.data is an array of events
  const events = Array.isArray(sessionReport.data) ? sessionReport.data : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Session Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length > 0 ? (
              events.map((event, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{event.eventType || "Unknown"}</TableCell>
                  <TableCell>{event.details || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {event.status === "success" ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                      {firstLetterCap(event.status) || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell>{event.timestamp ? new Date(event.timestamp).toLocaleString() : "-"}</TableCell>
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
