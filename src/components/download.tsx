import { CSSProperties, useCallback, useMemo, useState } from "react";
import { extractFileName } from "../utils/file.tsx";

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "download"; // 设置下载文件名
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

async function downloadFile(
  url: string,
  setProgress: (progress: number) => void,
) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ERROR! CODE: ${response.status}`);
  }
  const contentLength = response.headers.get("Content-Length") || "";
  const total = parseInt(contentLength);
  let loaded = 0;

  const body = response.body;
  if (!body) {
    throw new Error(`HTTP ERROR! CODE: ${response.status}`);
  }
  const reader = response.body.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;

    setProgress(total ? (loaded / total) * 100 : 99);
  }
  setProgress(100);
  const blob = new Blob(chunks);
  triggerDownload(blob, decodeURIComponent(url.split("/").pop() || "download"));
}

export function DownloadButton() {
  const [progress, setProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [bounce, setBounce] = useState<boolean>(false);

  const getFileName = useCallback(() => {
    return extractFileName();
  }, []);

  const { fileURL } = getFileName();

  const onDownload = useCallback(() => {
    console.log("download");
    setIsDownloading(true);
    downloadFile(fileURL, setProgress)
      .then(() => {
        setTimeout(() => {
          setBounce(true);
          setTimeout(() => {
            setBounce(false);
            setIsDownloading(false);
            setProgress(0);
          }, 2000);
        }, 500);
      })
      .catch();
  }, [fileURL]);

  const downloadIcon = useMemo(
    () => (
      <svg
        className="w-7 h-7 fill-[#1890FF] group-hover:fill-gray-50"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M505.7 661c3.2 4.1 9.4 4.1 12.6 0l112-141.7c4.1-5.2 0.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8z"></path>
        <path d="M878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
      </svg>
    ),
    [],
  );

  const innerContent = useMemo(
    () =>
      isDownloading ? (
        <span className="text-xs text-[#1890FF] group-hover:text-gray-50">
          {progress.toFixed(0)}%
        </span>
      ) : (
        downloadIcon
      ),
    [downloadIcon, isDownloading, progress],
  );

  return useMemo(
    () => (
      <div
        className={`fixed z-999 md:relative right-2 bottom-2 md:right-auto md:bottom-auto h-10 w-10 md:ml-6 md:mb-8 rounded-full cursor-pointer flex items-center justify-center 
           bg-transparent hover:bg-[#1890FF] group ease-out duration-300 transition-colors
           ${bounce ? "animate-bounce" : "-translate-y-1/4"}`}
        onClick={onDownload}
      >
        {/*{!isDownloading && (*/}
        {/*  <div className="absolute -z-10 top-0 left-0 w-full h-full rounded-full animate-ping bg-inherit"></div>*/}
        {/*)}*/}
        <div
          className="absolute top-0 left-0 w-full h-full rounded-full bg-conic from-[#1890FF] via-[#1890FF] group-hover:from-gray-50 group-hover:via-gray-50 to-transparent"
          style={
            {
              "--tw-gradient-to-position": `${progress}%`,
              "--tw-gradient-via-position": `${progress}%`,
              mask: "radial-gradient(circle at center, transparent 1.050rem, #000 1.051rem)",
            } as CSSProperties
          }
        ></div>
        {innerContent}
      </div>
    ),
    [bounce, innerContent, onDownload, progress],
  );
}
