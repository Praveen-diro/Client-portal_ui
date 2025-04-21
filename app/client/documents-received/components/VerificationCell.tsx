import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, XCircle, AlertTriangle, HelpCircle, Upload, Download, Image as ImageIcon } from "lucide-react";

interface VerificationCellProps {
  doc: any;
}

// Helper to extract hostname from a URL
const getHostname = (url?: string | null) => {
  if (!url) return "";
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

// Helper to get the most recent URL from urlChangeList
const getLatestUrl = (urlChangeList?: any[]) => {
  if (Array.isArray(urlChangeList) && urlChangeList.length > 0) {
    return urlChangeList[0]?.url || null;
  }
  return null;
};

export const VerificationCell: React.FC<VerificationCellProps> = ({ doc }) => {
  // Determine mode and fraud check
  const isUpload = doc?.button?.mode?.type === "upload";
  const fraudScore = doc?.fraudCheck?.verifiedScore;
  const urlStatus = doc?.file?.urlStatus;
  const fileUrl = doc?.file?.url;
  const latestUrl = getLatestUrl(doc?.urlChangeList);
  const hostname = getHostname(fileUrl || latestUrl);
  const fullUrl = fileUrl || latestUrl;

  // Icon and tooltip logic
  let icon = null;
  let tooltip = "";
  if (isUpload) {
    if (fraudScore === null || fraudScore === undefined) {
      icon = <Upload className="w-4 h-4 text-gray-400 mr-1" />;
      tooltip = "Fraud check can't be done on images";
    } else if (fraudScore === 0) {
      icon = <XCircle className="w-4 h-4 text-destructive mr-1" />;
      tooltip = "Tampered (score 0%)";
    } else if (fraudScore === 50) {
      icon = <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />;
      tooltip = "Suspicious (score 50%)";
    } else if (fraudScore === 75) {
      icon = <CheckCircle className="w-4 h-4 text-blue-500 mr-1" />;
      tooltip = "Likely pass (score 75%)";
    } else if (fraudScore === 100) {
      icon = <CheckCircle className="w-4 h-4 text-green-500 mr-1" />;
      tooltip = "Pass (score 100%)";
    } else {
      icon = <HelpCircle className="w-4 h-4 text-gray-400 mr-1" />;
      tooltip = "Unknown fraud check status";
    }
  } else if (urlStatus) {
    if (urlStatus.urlMatch && urlStatus.sslVerified) {
      icon = <CheckCircle className="w-4 h-4 text-green-500 mr-1" />;
      tooltip = "Source verified";
    } else if (!urlStatus.sslVerified) {
      icon = <XCircle className="w-4 h-4 text-destructive mr-1" />;
      tooltip = "Source not verified";
    } else {
      icon = <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />;
      tooltip = "Verify again";
    }
  } else {
    icon = <HelpCircle className="w-4 h-4 text-gray-400 mr-1" />;
    tooltip = "No verification data";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1 text-sm font-normal text-foreground cursor-default">
            {icon}
            <span className="truncate max-w-[160px]" title={hostname}>
              {hostname || "Not available"}
            </span>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col">
            <span>{tooltip}</span>
            {fullUrl && <span className="text-xs text-muted-foreground break-all mt-1">{fullUrl}</span>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationCell;
