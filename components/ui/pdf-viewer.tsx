import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { Download, FileText, AlertTriangle } from "lucide-react";
import Loader from "./loader";

interface PDFViewerProps {
  pdfUrl?: string;
  base64Data?: string;
  height?: string;
  showDownload?: boolean;
  fileName?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  base64Data,
  height = "750px",
  showDownload = true,
  fileName = "document",
}) => {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("PDFViewer received data:", {
      hasPdfUrl: !!pdfUrl,
      hasBase64Data: !!base64Data,
      base64Sample: base64Data ? `${base64Data.substring(0, 30)}...` : null,
    });

    // Convert base64 to Blob URL if base64Data is provided
    if (base64Data) {
      try {
        setLoading(true);

        // Clean up any whitespace or newlines in the base64 string
        const cleanBase64 = base64Data.replace(/\s/g, "");

        // Direct base64 decoding - simplest and most reliable approach
        try {
          // Try to decode to see if it's valid base64
          const binary = atob(cleanBase64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }

          const blob = new Blob([array], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          console.log("Created blob URL directly from base64");
          setFileUrl(url);
          setLoading(false);
        } catch (err) {
          console.error("Direct base64 conversion failed:", err);

          // Fallback to using data URL directly
          try {
            console.log("Trying fallback with data URL...");
            const dataPrefix = "data:application/pdf;base64,";
            const dataUrl = cleanBase64.startsWith(dataPrefix) ? cleanBase64 : `${dataPrefix}${cleanBase64}`;
            setFileUrl(dataUrl);
            setLoading(false);
          } catch (fallbackErr) {
            console.error("All conversion methods failed:", fallbackErr);
            setError("Failed to process PDF data. The base64 data may be invalid.");
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error in base64 conversion setup:", err);
        setError("Failed to setup PDF viewer");
        setLoading(false);
      }
    } else if (pdfUrl) {
      console.log("Using direct URL:", pdfUrl);
      setFileUrl(pdfUrl);
      setLoading(false);
    } else {
      setLoading(false);
      setError("No PDF data provided");
    }

    // Cleanup function
    return () => {
      if (fileUrl && fileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [pdfUrl, base64Data]);

  const handleDownload = () => {
    if (!fileUrl) return;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <Loader />
        <p className="text-muted-foreground ml-2">Loading PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height }}>
        <AlertTriangle className="h-12 w-12 text-destructive mb-2" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <FileText className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">PDF not available</p>
      </div>
    );
  }

  // Use an iframe for PDF rendering - most compatible approach
  return (
    <div className="pdf-viewer-container">
      {showDownload && (
        <div className="flex justify-end mb-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      )}
      <div style={{ height }} className="border rounded-md overflow-hidden">
        <iframe src={fileUrl} style={{ width: "100%", height: "100%", border: "none" }} title="PDF Viewer" allowFullScreen />
      </div>
    </div>
  );
};

export default PDFViewer;
