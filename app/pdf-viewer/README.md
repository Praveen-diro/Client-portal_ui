# PDF Viewer Component and Page

This directory contains a page that displays PDF documents from the Redux state, specifically from the `viewDoc` slice.

## How to Use

### Programmatic Navigation

You can navigate to this page programmatically after loading a PDF into the Redux state:

```javascript
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setDataPdf } from "@/app/store/features/viewDocSlice";

const YourComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleViewPdf = (pdfData) => {
    // Store the PDF data in Redux
    dispatch(
      setDataPdf({
        filename: "your-document-name.pdf",
        base64: "your-base64-pdf-data", // Base64 encoded PDF string
      })
    );

    // Navigate to the PDF viewer page
    router.push("/pdf-viewer");
  };

  return <button onClick={() => handleViewPdf(yourPdfData)}>View PDF</button>;
};
```

### Direct Link

You can also create a direct link to the PDF viewer page:

```html
<Link href="/pdf-viewer">View PDF</Link>
```

Note that the PDF viewer page expects the PDF data to be already loaded in the Redux state.

## Component Props

The PDF viewer component (`components/ui/pdf-viewer.tsx`) accepts the following props:

- `pdfUrl` (optional): A URL to a PDF file.
- `base64Data` (optional): A base64-encoded string of the PDF data.
- `height` (optional): The height of the PDF viewer container. Defaults to '750px'.
- `showDownload` (optional): Whether to show the download button. Defaults to true.
- `fileName` (optional): The name of the file when downloaded. Defaults to 'document'.

## Redux State Structure

The PDF viewer page expects the PDF data to be in the following structure in the Redux state:

```javascript
{
  viewDoc: {
    viewpdfdata: {
      filename: 'document-name.pdf', // The name of the PDF file
      base64: 'base64-encoded-pdf-data', // The base64-encoded PDF data
      // OR
      data: {
        base64: 'base64-encoded-pdf-data' // Alternative location for the base64 data
      }
    },
    view_loading: false // Whether the PDF is currently loading
  }
}
```

## Example Usage in Code

```jsx
// Using the PDF viewer component directly
import PDFViewer from "@/components/ui/pdf-viewer";

const MyComponent = () => {
  return <PDFViewer base64Data={myBase64PdfData} fileName="my-document.pdf" height="500px" showDownload={true} />;
};
```
