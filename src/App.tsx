import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { extractFileName } from "./utils/file";

import Tabbar from "./components/tabbar";

const PDFComponent = React.lazy(() => import("./components/pdf"));
const MarkdownComponent = React.lazy(() => import("./components/md"));
const DocComponent = React.lazy(() => import("./components/doc"));

function App() {
  const [file, setFile] = useState("");
  const getFileName = useCallback(() => {
    return extractFileName();
  }, []);

  const { extension, fileURL, fileTitle } = getFileName();

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
        <div className="w-full md:w-1/2 flex justify-center items-center h-full mt-4 md:mt-18">
          <PDFComponent file={file} />
        </div>
      );
    } else {
      return <DocComponent fileURL={file} />;
    }
  }, [file, extension]);

  return useMemo(
    () => (
      <div className="w-screen h-screen relative flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden">
        <Tabbar fileTitle={fileTitle} />
        {renderComponent}
      </div>
    ),
    [renderComponent, fileTitle]
  );
}

export default App;
