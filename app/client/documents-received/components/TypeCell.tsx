import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, Upload, Camera } from "lucide-react";
import Link from "next/link";

interface TypeCellProps {
  doc: any;
  onOpenDocView: (doc: any) => void;
  makefileurl: (sessionId: string) => string;
  sessionId: string;
  isDeleteStatus: boolean;
  firstLetterCap: (str: string) => string;
}

const TypeCell: React.FC<TypeCellProps> = ({ doc, onOpenDocView, makefileurl, sessionId, isDeleteStatus, firstLetterCap }) => {
  const category = firstLetterCap(doc?.file?.category);

  // Determine which icon to show
  let icon = null;
  let tooltip = "";
  if (doc.mhtmlVal === "png") {
    icon = <Camera className="mr-2 type-icon" size={18} />;
    tooltip = "Screenshot";
  } else if (doc.button?.mode?.type === "upload") {
    icon = <Upload className="mr-2 type-icon" size={18} />;
    tooltip = "Upload";
  } else {
    icon = <Download className="mr-2 type-icon" size={18} />;
    tooltip = "Download";
  }

  // Logic for clickable/viewable cell
  const cellContent = (
    <div className="flex items-center font-normal text-[14px] text-black">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center">{icon}</span>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span>{category}</span>
    </div>
  );

  if (
    doc?.button?.shareonlyjson &&
    doc?.file?.pdfdata &&
    doc?.file?.pdfdata !== "" &&
    doc?.file?.json_v3_status !== "final-pdftojson"
  ) {
    return (
      <div
        className="cursor-pointer"
        onClick={() => onOpenDocView(doc)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onOpenDocView(doc);
        }}
        role="button"
        tabIndex={0}
      >
        {cellContent}
      </div>
    );
  } else if (!isDeleteStatus) {
    return (
      <Link href={`/pdf/${makefileurl(sessionId)}`} className="block">
        {cellContent}
      </Link>
    );
  } else {
    return (
      <div
        className="cursor-pointer"
        onClick={() => onOpenDocView(doc)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onOpenDocView(doc);
        }}
        role="button"
        tabIndex={0}
      >
        {cellContent}
      </div>
    );
  }
};

export default TypeCell;
