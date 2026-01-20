import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import { useContext } from 'react'
import '@cyntler/react-doc-viewer/dist/index.css'
import { ThemeContext } from '../contexts/themeContext'

interface docProps {
  fileURL: string
}

export default function DocComponent(props: docProps) {
  const { dark } = useContext(ThemeContext)
  return (
    <DocViewer
      documents={[{ uri: props.fileURL }]}
      pluginRenderers={DocViewerRenderers}
      config={{
        header: {
          disableHeader: true,
        },
      }}
      style={{ backgroundColor: dark ? 'oklch(0.129 0.042 264.695)' : 'white' }}
      className="mt-18"
    />
  )
}
