import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFProps {
  file: string;
}

export default function PDFComponent(props: PDFProps) {
  const [numPages, setNumPages] = useState<number>();
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-start justify-start md:items-center md:justify-center h-full max-w-11/12 min-w-11/12">
      <Document
        file={props.file}
        onLoadSuccess={onDocumentLoadSuccess}
        className="h-full origin-top-left scale-51 md:origin-center md:scale-105 mt-8 top-0"
      >
        {Array.from(new Array(numPages), (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            scale={1}
            width={width >= 768 ? 744 : width * 1.8}
            className="h-full shadow-md border-1 my-4 border-gray-300"
          />
        ))}
      </Document>
    </div>
  );
}
