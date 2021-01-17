import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type loadSuccess = (numPages: any) => void;

interface PdfProps {
  preview: boolean;
  previewSize: number;
  selectedFile: string;
}

const Pdf: React.FC<PdfProps> = ({ preview, previewSize, selectedFile }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess: loadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <>
      {preview && (
        <Document file={selectedFile}>
          <Page height={previewSize} pageNumber={1} />
        </Document>
      )}
      {!preview && (
        <div>
          <Document file={selectedFile} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          {pageNumber > 1 && (
            <button onClick={() => setPageNumber(pageNumber - 1)}>Prev</button>
          )}
          {pageNumber < numPages! && (
            <button onClick={() => setPageNumber(pageNumber + 1)}>Next</button>
          )}
        </div>
      )}
    </>
  );
};

export default Pdf;
