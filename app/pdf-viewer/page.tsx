"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ArrowLeft,
  AlertTriangle,
  Info,
  Bug,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Printer,
  Download,
} from "lucide-react";
import { RootState } from "@/app/store/store";
import dynamic from "next/dynamic";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoaderComponent from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Set up PDF.js worker
// This needs to be called once before using react-pdf
const PDFViewer = dynamic(
  () =>
    import("react-pdf").then((mod) => {
      // Set worker path
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.js`;

      // Return the Document and Page components
      return function PDFViewerComponent({ base64Data, fileName }: { base64Data: string; fileName: string }) {
        const [numPages, setNumPages] = useState<number | null>(null);
        const [pageNumber, setPageNumber] = useState<number>(1);
        const [scale, setScale] = useState<number>(1.2);

        function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
          setNumPages(numPages);
        }

        function changePage(offset: number) {
          setPageNumber((prevPageNumber) => Math.min(Math.max(prevPageNumber + offset, 1), numPages || 1));
        }

        function zoomIn() {
          setScale((prevScale) => Math.min(prevScale + 0.2, 2.5));
        }

        function zoomOut() {
          setScale((prevScale) => Math.max(prevScale - 0.2, 0.7));
        }

        function printPdf() {
          const pdfWindow = window.open("");
          pdfWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
          setTimeout(() => {
            pdfWindow?.document.close();
            pdfWindow?.focus();
            pdfWindow?.print();
          }, 1000);
        }

        // Convert base64 to data URL if needed
        const pdfData = base64Data.startsWith("data:") ? base64Data : `data:application/pdf;base64,${base64Data}`;

        return (
          <div className="flex flex-col items-center">
            <div className="w-full flex flex-wrap justify-between items-center mb-4 p-4 bg-muted/30 rounded-md">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <Button variant="outline" size="sm" onClick={() => changePage(-1)} disabled={pageNumber <= 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <span className="text-sm font-medium">
                  Page {pageNumber} of {numPages || "--"}
                </span>
                <Button variant="outline" size="sm" onClick={() => changePage(1)} disabled={!numPages || pageNumber >= numPages}>
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Zoom Out</span>
                </Button>
                <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
                <Button variant="outline" size="sm" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Zoom In</span>
                </Button>
                <Button variant="outline" size="sm" onClick={printPdf}>
                  <Printer className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = pdfData;
                    link.download = fileName || "document.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            </div>

            <div className="overflow-auto w-full flex justify-center border-none" style={{ height: "calc(90vh - 110px)" }}>
              <mod.Document
                file={pdfData}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center h-full w-full">
                    <LoaderComponent />
                  </div>
                }
                error={<div className="text-center text-destructive">Failed to load PDF document.</div>}
                className="flex justify-center"
              >
                <mod.Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-none border-none"
                />
              </mod.Document>
            </div>
          </div>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[90vh]">
        <LoaderComponent />
        <p className="text-muted-foreground ml-2">Loading PDF viewer...</p>
      </div>
    ),
  }
);

export default function ViewPdfPage() {
  const { viewpdfdata, view_loading } = useSelector((state: RootState) => state.viewDoc);
  const [fileName, setFileName] = useState<string>("document");
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showDebug, setShowDebug] = useState<boolean>(true); // Set to true by default for troubleshooting
  const [debugTab, setDebugTab] = useState<string>("info");
  const [isValidatingBase64, setIsValidatingBase64] = useState<boolean>(false);

  // Add state for PDF control
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);

  // For debugging purposes
  useEffect(() => {
    if (viewpdfdata) {
      console.log("ViewDoc Redux State:", viewpdfdata);

      // Prepare debug info
      const debug = {
        type: typeof viewpdfdata,
        keys: Object.keys(viewpdfdata),
        hasBase64: !!(viewpdfdata.base64 || (viewpdfdata.data && viewpdfdata.data.base64)),
        dataType: viewpdfdata.data ? typeof viewpdfdata.data : "undefined",
        dataKeys: viewpdfdata.data ? Object.keys(viewpdfdata.data) : [],
        viewpdfdata: viewpdfdata, // Store the actual data for debugging
      };

      setDebugInfo(debug);
    } else {
      console.log("No viewpdfdata in Redux state");
    }
  }, [viewpdfdata]);

  // Function to validate if a string is likely base64
  function validateBase64(str: string): boolean {
    if (!str) return false;

    // Remove common prefixes if present
    let testStr = str;
    if (testStr.startsWith("data:application/pdf;base64,")) {
      testStr = testStr.substring("data:application/pdf;base64,".length);
    }

    // Base64 regex validation (allowing for some padding characters)
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    return base64Regex.test(testStr) && testStr.length % 4 === 0;
  }

  // Function to check if a string can be decoded as base64
  async function isDecodableBase64(str: string): Promise<boolean> {
    setIsValidatingBase64(true);
    try {
      // Try to decode a small sample to see if it's valid base64
      const testStr = str.startsWith("data:application/pdf;base64,") ? str.substring("data:application/pdf;base64,".length) : str;

      const sample = testStr.substring(0, Math.min(1000, testStr.length));
      atob(sample);

      // If we get here, it's valid base64
      setIsValidatingBase64(false);
      return true;
    } catch (err) {
      console.error("Base64 validation failed:", err);
      setIsValidatingBase64(false);
      return false;
    }
  }

  useEffect(() => {
    // Extract data from the viewpdfdata, which may have different structures
    try {
      if (viewpdfdata) {
        // Set filename if available
        if (viewpdfdata.filename) {
          setFileName(viewpdfdata.filename);
        } else if (viewpdfdata.name) {
          setFileName(viewpdfdata.name);
        }

        // Extract base64 data which may be in different locations depending on the API response
        if (viewpdfdata.base64) {
          console.log("Found base64 data directly in viewpdfdata");
          setBase64Data(viewpdfdata.base64);
        } else if (viewpdfdata.data && viewpdfdata.data.base64) {
          console.log("Found base64 data in viewpdfdata.data");
          setBase64Data(viewpdfdata.data.base64);
        } else if (viewpdfdata.data && typeof viewpdfdata.data === "string" && viewpdfdata.data.length > 100) {
          // Sometimes the base64 might be directly in the data field as a string
          console.log("Found potential base64 data as string in viewpdfdata.data");
          // Verify if it's actually base64
          isDecodableBase64(viewpdfdata.data).then((isValid) => {
            if (isValid) {
              setBase64Data(viewpdfdata.data);
            } else {
              console.log("Data in viewpdfdata.data is not valid base64");
              setError("Invalid base64 data format found in the document");
            }
          });
        } else {
          // Additional checks for other potential locations of base64 data
          console.log("Looking for base64 data in nested objects...");
          const foundKeyPath = findBase64InObject(viewpdfdata);
          if (foundKeyPath) {
            console.log(`Found base64 data in custom location: ${foundKeyPath}`);
            // Extract the value using the path
            const value = getValueByPath(viewpdfdata, foundKeyPath);
            if (value) {
              // Verify if it's actually base64
              isDecodableBase64(value).then((isValid) => {
                if (isValid) {
                  setBase64Data(value);
                } else {
                  console.log(`Data at ${foundKeyPath} is not valid base64`);
                  setError(`Found potential PDF data at ${foundKeyPath} but it's not valid base64`);
                }
              });
            } else {
              setError("Found potential PDF data but couldn't access it");
            }
          } else {
            setError("No PDF data found in the current state. The document may not have been properly loaded.");
            console.log("No base64 data found in viewpdfdata:", viewpdfdata);
          }
        }
      } else {
        setError("No document data available in Redux store.");
      }
    } catch (err) {
      console.error("Error processing PDF data:", err);
      setError(`An error occurred while processing the document data: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }, [viewpdfdata]);

  // Helper function to find base64 data in a nested object
  function findBase64InObject(obj: any, path = "", depth = 0): string | null {
    if (depth > 3) return null; // Limit recursion depth

    if (typeof obj !== "object" || obj === null) return null;

    for (const key in obj) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      // Check if the value might be base64 data
      if (typeof value === "string" && value.length > 100) {
        // More strict check for base64 pattern
        if (validateBase64(value)) {
          console.log(`Found potential base64 at ${currentPath} (passes regex check)`);
          return currentPath;
        }
      }

      // Recursively check nested objects
      if (typeof value === "object" && value !== null) {
        const foundPath = findBase64InObject(value, currentPath, depth + 1);
        if (foundPath) {
          return foundPath;
        }
      }
    }

    return null;
  }

  // Helper function to get a value from an object using a dot-notation path
  function getValueByPath(obj: any, path: string): any {
    return path.split(".").reduce((o, p) => (o && o[p] !== undefined ? o[p] : null), obj);
  }

  // Add PDF control functions
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => Math.min(Math.max(prevPageNumber + offset, 1), numPages || 1));
  }

  function zoomIn() {
    setScale((prevScale) => Math.min(prevScale + 0.2, 2.5));
  }

  function zoomOut() {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.7));
  }

  function printPdf() {
    if (!base64Data) return;

    const pdfData = base64Data.startsWith("data:") ? base64Data : `data:application/pdf;base64,${base64Data}`;
    const pdfWindow = window.open("");
    pdfWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
    setTimeout(() => {
      pdfWindow?.document.close();
      pdfWindow?.focus();
      pdfWindow?.print();
    }, 1000);
  }

  function downloadPdf() {
    if (!base64Data) return;

    const pdfData = base64Data.startsWith("data:") ? base64Data : `data:application/pdf;base64,${base64Data}`;
    const link = document.createElement("a");
    link.href = pdfData;
    link.download = fileName || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Navigate back function
  const handleBack = () => {
    window.history.back();
  };

  // Toggle debug info visibility
  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  // Create a modified PDFViewer component that uses our state
  const ModifiedPDFViewer = dynamic(
    () =>
      import("react-pdf").then((mod) => {
        // Set worker path
        mod.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.js`;

        return function ModifiedPDFViewerComponent({ base64Data }: { base64Data: string }) {
          // Convert base64 to data URL if needed
          const pdfData = base64Data.startsWith("data:") ? base64Data : `data:application/pdf;base64,${base64Data}`;

          return (
            <div className="w-full flex justify-center border-none h-full">
              <mod.Document
                file={pdfData}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center h-full w-full">
                    <LoaderComponent />
                  </div>
                }
                error={<div className="text-center text-destructive">Failed to load PDF document.</div>}
                className="flex justify-center"
              >
                <mod.Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-none border-none"
                />
              </mod.Document>
            </div>
          );
        };
      }),
    {
      ssr: false,
      loading: () => (
        <div className="flex items-center justify-center h-[90vh]">
          <LoaderComponent />
          <p className="text-muted-foreground ml-2">Loading PDF viewer...</p>
        </div>
      ),
    }
  );

  return (
    <div className="container mx-auto py-6">
      <Card className="shadow-lg border-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between border-none">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              {fileName || "Document Viewer"}
            </CardTitle>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleDebug} title="Toggle debugging info">
            <Bug className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {view_loading || isValidatingBase64 ? (
            <div className="flex items-center justify-center h-[90vh]">
              <LoaderComponent />
              <p className="text-muted-foreground ml-2">
                {isValidatingBase64 ? "Validating PDF data..." : "Loading document..."}
              </p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mx-6 mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                <p>{error}</p>
                <p className="text-sm mt-2">
                  Make sure the PDF data is correctly loaded in the Redux store. You may need to navigate to a document first
                  before accessing this page.
                </p>
              </AlertDescription>
            </Alert>
          ) : base64Data ? (
            <IntegratedPDFViewer
              base64Data={base64Data}
              fileName={fileName}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              numPages={numPages}
              setNumPages={setNumPages}
              scale={scale}
              setScale={setScale}
              printPdf={printPdf}
              downloadPdf={downloadPdf}
            />
          ) : (
            <div className="flex items-center justify-center h-[90vh] bg-muted/20 rounded-md mx-6">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No PDF document available in the state.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please navigate to a document first or use the documents section.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Create an integrated PDF viewer that handles everything in one component
// This ensures the toolbar and PDF are tightly integrated
const IntegratedPDFViewer = dynamic(
  () =>
    import("react-pdf").then((mod) => {
      // Set worker path
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.js`;

      return function IntegratedPDFViewerComponent({
        base64Data,
        fileName,
        pageNumber,
        setPageNumber,
        numPages,
        setNumPages,
        scale,
        setScale,
        printPdf,
        downloadPdf,
      }: {
        base64Data: string;
        fileName: string;
        pageNumber: number;
        setPageNumber: React.Dispatch<React.SetStateAction<number>>;
        numPages: number | null;
        setNumPages: React.Dispatch<React.SetStateAction<number | null>>;
        scale: number;
        setScale: React.Dispatch<React.SetStateAction<number>>;
        printPdf: () => void;
        downloadPdf: () => void;
      }) {
        // Convert base64 to data URL if needed
        const pdfData = base64Data.startsWith("data:") ? base64Data : `data:application/pdf;base64,${base64Data}`;

        function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
          setNumPages(numPages);
        }

        function changePage(offset: number) {
          setPageNumber((prevPageNumber) => Math.min(Math.max(prevPageNumber + offset, 1), numPages || 1));
        }

        function zoomIn() {
          setScale((prevScale) => Math.min(prevScale + 0.2, 2.5));
        }

        function zoomOut() {
          setScale((prevScale) => Math.max(prevScale - 0.2, 0.7));
        }

        return (
          <div className="pdf-viewer-container mx-4 border rounded-md overflow-hidden flex flex-col">
            {/* Top static toolbar with light background - like Adobe PDF */}
            <div className="bg-gray-50 border-b flex justify-end items-center p-3 gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 8 6 6 6-6" />
                  <path d="M12 2v12" />
                  <path d="M19 15v6" />
                  <path d="M19 21H5" />
                </svg>
                <span>Translate (En)</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-1" onClick={downloadPdf}>
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </Button>
            </div>

            {/* Main content area with PDF */}
            <div className="relative flex-grow">
              {/* PDF document container */}
              <div className="h-[75vh] overflow-auto bg-gray-100 flex justify-center">
                <mod.Document
                  file={pdfData}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center h-full w-full">
                      <LoaderComponent />
                    </div>
                  }
                  error={<div className="text-center text-destructive p-4">Failed to load PDF document.</div>}
                  className="my-4"
                >
                  <mod.Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-md bg-white border border-gray-200"
                  />
                </mod.Document>
              </div>

              {/* Floating controls at bottom */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-white shadow-lg rounded-md px-4 py-2 border flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => changePage(-1)} disabled={pageNumber <= 1}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium">
                    {pageNumber} / {numPages || "-"}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => changePage(1)} disabled={!numPages || pageNumber >= numPages}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <div className="h-6 border-l mx-2"></div>
                  <Button variant="ghost" size="icon" onClick={zoomOut} className="h-8 w-8">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
                  <Button variant="ghost" size="icon" onClick={zoomIn} className="h-8 w-8">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <div className="h-6 border-l mx-2"></div>
                  <Button variant="ghost" size="icon" onClick={printPdf} className="h-8 w-8">
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[80vh] mx-4 border rounded-md">
        <div className="text-center">
          <LoaderComponent />
          <p className="text-muted-foreground mt-4">Loading PDF viewer...</p>
        </div>
      </div>
    ),
  }
);
