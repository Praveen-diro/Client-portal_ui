import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TypeCellProps {
  doc: any;
  onOpenDocView: (doc: any) => void;
  makefileurl: (sessionId: string) => string;
  sessionId: string;
  isDeleteStatus: boolean;
  firstLetterCap: (str: string) => string;
}

const iconMap = {
  capture: {
    src: "/assets/images/capture.png",
    alt: "capture",
    tooltip: "Screenshot",
  },
  upload: {
    src: "/assets/images/upoladIcon.png",
    alt: "upload",
    tooltip: "Upload",
  },
  download: {
    src: "/assets/images/icon/download-icon-webhook-1330572128077478850_0.svg",
    alt: "download",
    tooltip: "Download",
  },
};

const getTypeIcon = (doc: any) => {
  if (doc.mhtmlVal === "png") return iconMap.capture;
  if (doc.button?.mode?.type === "upload") return iconMap.upload;
  return iconMap.download;
};

const TypeCell: React.FC<TypeCellProps> = ({ doc, onOpenDocView, makefileurl, sessionId, isDeleteStatus, firstLetterCap }) => {
  const icon = getTypeIcon(doc);
  const category = firstLetterCap(doc?.file?.category);

  // Logic for clickable/viewable cell
  const cellContent = (
    <div className="flex items-center font-normal text-[14px] text-black">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center">
              <Image src={icon.src} alt={icon.alt} width={18} height={18} className="mr-2 type-icon" />
            </span>
          </TooltipTrigger>
          <TooltipContent>{icon.tooltip}</TooltipContent>
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
