import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

interface docProps {
  fileURL: string;
}

export default function DocComponent(props: docProps) {
  return (
    <DocViewer
      documents={[{ uri: props.fileURL }]}
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
