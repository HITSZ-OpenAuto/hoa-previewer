import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Document, Page } from "react-pdf";
import { extractFileName } from "./utils/file";
import { pdfjs } from "react-pdf";

import Tabbar from "./components/tabbar";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFProps {
  file: string;
}

function PDFComponent(props: PDFProps) {
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Document
        file={props.file}
        onLoadSuccess={onDocumentLoadSuccess}
        className="h-full scale-105 mt-8"
      >
        {Array.from(new Array(numPages), (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            className="h-full shadow-md border-1 my-4 border-gray-300"
          />
        ))}
      </Document>
    </div>
  );
}

interface MarkdownProps {
  source: string;
}

function MarkdownComponent(props: MarkdownProps) {
  return (
    <MarkdownPreview
      className="h-full mt-8"
      source={props.source}
      style={{ padding: 16 }}
      components={{
        code: ({ children = [], className, ...props }) => {
          if (typeof children === "string" && /^\$\$(.*)\$\$/.test(children)) {
            const html = katex.renderToString(
              children.replace(/^\$\$(.*)\$\$/, "$1"),
              {
                throwOnError: false,
              }
            );
            return (
              <code
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ background: "transparent" }}
              />
            );
          }
          const code =
            props.node && props.node.children
              ? getCodeString(props.node.children)
              : children;
          if (
            typeof code === "string" &&
            typeof className === "string" &&
            /^language-katex/.test(className.toLocaleLowerCase())
          ) {
            const html = katex.renderToString(code, {
              throwOnError: false,
            });
            return (
              <code
                style={{ fontSize: "150%" }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }
          return <code className={String(className)}>{children}</code>;
        },
      }}
    />
  );
}

function App() {
  const [file, setFile] = useState("");
  const getFileName = useCallback(() => {
    return extractFileName();
  }, []);

  const { extension, fileURL } = getFileName();

  useEffect(() => {
    if (extension === "md") {
      fetch(fileURL).then(async (resp) => {
        if (resp.ok) {
          setFile(await resp.text());
        }
      });
    } else {
      setFile(fileURL);
    }
  }, [extension, fileURL]);

  const renderComponent = useMemo(() => {
    if (extension === "md") {
      return (
        <div className="w-1/2 flex justify-center items-center h-full mt-18">
          <MarkdownComponent source={file} />
        </div>
      );
    } else if (extension === "pdf") {
      return (
        <div className="w-1/2 flex justify-center items-center h-full mt-18">
          <PDFComponent file={file} />
        </div>
      );
    } else {
      return (
        <DocViewer
          documents={[{ uri: file }]}
          pluginRenderers={DocViewerRenderers}
          config={{
            header: {
              disableHeader: true,
            },
          }}
          className="mt-18"
        />
      );
    }
  }, [file, extension]);

  return useMemo(
    () => (
      <div className="w-screen h-screen relative flex flex-col items-center justify-center overflow-y-auto">
        <Tabbar />
        {renderComponent}
      </div>
    ),
    [renderComponent]
  );
}

export default App;
