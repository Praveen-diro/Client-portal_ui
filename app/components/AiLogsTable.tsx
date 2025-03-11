"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/app/store/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getUserTime } from "@/app/utils/timeUtils";
import Loader from "@/components/ui/loader";

interface AiLogsTableProps {
  sessionId: string;
}

const AiLogsTable: React.FC<AiLogsTableProps> = ({ sessionId }) => {
  const { AutoNavData: autoNavData, loading } = useAppSelector((state) => state.table);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
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
        <div className="w-full overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px] whitespace-nowrap">Timestamp</TableHead>
                <TableHead className="min-w-[100px] whitespace-nowrap">Type</TableHead>
                <TableHead className="min-w-[120px] whitespace-nowrap">Url consistency</TableHead>
                <TableHead className="min-w-[200px] max-w-[250px] whitespace-nowrap">Current url</TableHead>
                <TableHead className="min-w-[150px] max-w-[200px] whitespace-nowrap">Event summary</TableHead>
                <TableHead className="min-w-[200px] whitespace-nowrap">Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {autoNavData.navLogs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="min-w-[120px] whitespace-nowrap">
                    {typeof log.timestamp === "string" ? log.timestamp : getUserTime(Number(log.timestamp))}
                  </TableCell>
                  <TableCell className="min-w-[100px] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {log.type === "urlChange" ? "Url change" : log.type === "clickEvent" ? "Click event" : ""}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[120px] whitespace-nowrap">
                    {log?.urlConsistency !== undefined && log?.urlConsistency !== null ? String(log.urlConsistency) : ""}
                  </TableCell>
                  <TableCell className="min-w-[200px] max-w-[250px]">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-500" />
                      <a
                        href={log.currentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline line-clamp-1"
                      >
                        {log.currentUrl}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[150px] max-w-[200px]">
                    <div className="line-clamp-2">
                      {/* {typeof log.click === "object" ? JSON.stringify(log.click) : log.click || ""}
                       */}
                      heelo dfsdjafdsjfasdjfjasdf
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    <div className="">{typeof log.summary === "object" ? JSON.stringify(log.summary) : log.summary || ""}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiLogsTable;
