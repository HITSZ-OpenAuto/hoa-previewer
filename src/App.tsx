import React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { extractFileName } from './utils/file'

import Tabbar from './components/tabbar'
import { ThemeContext } from './contexts/themeContext'
import { DownloadButton } from './components/download.tsx'

const PDFComponent = React.lazy(() => import('./components/pdf'))
const MarkdownComponent = React.lazy(() => import('./components/md'))
const DocComponent = React.lazy(() => import('./components/doc'))

function App() {
  const [file, setFile] = useState('')
  const getFileName = useCallback(() => {
    return extractFileName()
  }, [])

  const [dark] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [dark])

  const { extension, fileURL, fileTitle } = getFileName()

  useEffect(() => {
    if (extension === 'md') {
      fetch(fileURL).then(async (resp) => {
        if (resp.ok) {
          const text = await resp.text()
          setFile(text)
        }
      })
    } else {
      // Use requestAnimationFrame to avoid synchronous setState in effect
      requestAnimationFrame(() => {
        setFile(fileURL)
      })
    }
  }, [extension, fileURL])

  const renderComponent = useMemo(() => {
    if (extension === 'md') {
      return (
        <div className="flex h-full w-full overflow-hidden pt-18 md:w-1/2">
          <div className="overflow-y-auto">
            <MarkdownComponent source={file} />
          </div>
        </div>
      )
    } else if (extension === 'pdf') {
      return (
        <div className="flex h-full w-full flex-col items-center overflow-hidden pt-26 md:w-1/2 md:min-w-[781px]">
          <div className="overflow-y-auto">
            <PDFComponent file={file} />
          </div>
        </div>
      )
    } else if (extension !== null) {
      return (
        <div className="h-full w-full md:w-1/2 md:min-w-[800px]">
          <DocComponent fileURL={file} />
        </div>
      )
    } else {
      return (
        <div className="mb-8 flex h-full w-full flex-col items-center justify-center gap-4">
          <div className="text-4xl font-bold text-gray-500">
            这里什么也没有哦～
          </div>
          <div className="text-lg font-bold text-gray-500">
            返回主站去查看文档吧!
          </div>
        </div>
      )
    }
  }, [file, extension])

  return useMemo(
    () => (
      <ThemeContext.Provider value={{ dark }}>
        <div className="relative h-screen w-screen overflow-hidden dark:bg-slate-950/80">
          <Tabbar fileTitle={fileTitle} />
          <div className="flex h-full w-full items-end justify-center overflow-y-hidden">
            {renderComponent}
            {extension && <DownloadButton />}
          </div>
        </div>
      </ThemeContext.Provider>
    ),
    [dark, fileTitle, renderComponent, extension],
  )
}

export default App
