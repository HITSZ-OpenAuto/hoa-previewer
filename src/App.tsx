import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { extractFileName } from "./utils/file";

import Tabbar from "./components/tabbar";
import { ThemeContext } from "./contexts/themeContext";

const PDFComponent = React.lazy(() => import("./components/pdf"));
const MarkdownComponent = React.lazy(() => import("./components/md"));
const DocComponent = React.lazy(() => import("./components/doc"));

function App() {
  const [file, setFile] = useState("");
  const getFileName = useCallback(() => {
    return extractFileName();
  }, []);

  const [dark] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

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
        <div className="w-full md:w-1/2 h-full pt-18 flex overflow-hidden">
          <div className="overflow-y-auto">
            <MarkdownComponent source={file} />
          </div>
        </div>
      );
    } else if (extension === "pdf") {
      return (
        <div className="w-full md:w-1/2 md:min-w-[781px] h-full pt-26 flex flex-col items-end overflow-hidden">
          <div className="overflow-y-auto">
            <PDFComponent file={file} />
          </div>
        </div>
      );
    } else if (extension !== null) {
      return (
        <div className="w-full md:w-1/2 md:min-w-[800px] h-full">
          <DocComponent fileURL={file} />
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 mb-8">
          <div className="text-4xl font-bold text-gray-500">
            这里什么也没有哦～
          </div>
          <div className="text-lg font-bold text-gray-500">
            返回主站去查看文档吧!
          </div>
        </div>
      );
    }
  }, [file, extension]);

  return useMemo(
    () => (
      <ThemeContext.Provider value={{ dark }}>
        <div className="w-screen h-screen relative overflow-hidden dark:bg-slate-950/80">
          <Tabbar fileTitle={fileTitle} />
          <div className="overflow-y-hidden w-full h-full flex items-end justify-center">
            {renderComponent}
          </div>
        </div>
      </ThemeContext.Provider>
    ),
    [renderComponent, fileTitle, dark],
  );
}

export default App;
