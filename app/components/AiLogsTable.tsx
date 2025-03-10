"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/app/store/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getUserTime } from "@/app/utils/timeUtils";

interface AiLogsTableProps {
  sessionId: string;
}

const AiLogsTable: React.FC<AiLogsTableProps> = ({ sessionId }) => {
  const { AutoNavData: autoNavData, loading } = useAppSelector((state) => state.table);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!autoNavData || !autoNavData.navLogs || autoNavData.navLogs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <p className="text-muted-foreground">No navigation logs available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Navigation Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {autoNavData.navLogs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                    <a
                      href={log.currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate max-w-[300px]"
                    >
                      {log.currentUrl}
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  {typeof log.timestamp === "string"
                    ? getUserTime(new Date(log.timestamp).getTime())
                    : getUserTime(log.timestamp)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Visited
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AiLogsTable;
