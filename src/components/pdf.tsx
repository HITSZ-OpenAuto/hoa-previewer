import { useState, useEffect, useRef } from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFProps {
  file: string
}

export default function PDFComponent(props: PDFProps) {
  const [numPages, setNumPages] = useState<number>()
  const [width, setWidth] = useState(window.innerWidth)
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1]))
  const observerRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pageNumber = parseInt(
            entry.target.getAttribute('data-page-number') || '0',
          )
          if (entry.isIntersecting) {
            setVisiblePages((prev) => new Set([...prev, pageNumber]))
          }
        })
      },
      {
        rootMargin: '200px 0px', // Start loading pages when they're 200px from viewport
        threshold: 0.1,
      },
    )

    // Clean up previous observers
    observerRefs.current.forEach((ref) => {
      observer.unobserve(ref)
    })

    // Observe new refs
    observerRefs.current.forEach((ref) => {
      observer.observe(ref)
    })

    const currentObserverRefs = observerRefs.current

    return () => {
      currentObserverRefs.forEach((ref) => {
        observer.unobserve(ref)
      })
    }
  }, [numPages])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
    // Initially set only the first page as visible
    setVisiblePages(new Set([1]))
  }

  const setRef = (pageNumber: number, ref: HTMLDivElement | null) => {
    if (ref) {
      ref.setAttribute('data-page-number', pageNumber.toString())
      observerRefs.current.set(pageNumber, ref)
    } else {
      observerRefs.current.delete(pageNumber)
    }
  }

  return (
    <Document
      file={props.file}
      onLoadSuccess={onDocumentLoadSuccess}
      className=""
    >
      {Array.from(new Array(numPages || 0), (_el, index) => {
        const pageNumber = index + 1
        const shouldRenderPage = visiblePages.has(pageNumber)

        return (
          <div
            key={`page_container_${pageNumber}`}
            ref={(ref) => setRef(pageNumber, ref)}
            className="my-4 flex justify-center"
            style={{
              minHeight:
                pageNumber === 1 || shouldRenderPage ? 'auto' : '800px',
            }}
          >
            {shouldRenderPage && (
              <Page
                key={`page_${pageNumber}`}
                pageNumber={pageNumber}
                scale={1}
                width={width >= 768 ? 781.2 : width}
                className="border-1 border-gray-300 shadow-md"
              />
            )}
          </div>
        )
      })}
    </Document>
  )
}
