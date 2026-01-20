import MarkdownPreview from "@uiw/react-markdown-preview";
import { getCodeString } from "rehype-rewrite";
import { useState, useEffect } from "react";
import type { KatexOptions } from "katex";

interface KatexInstance {
  renderToString(tex: string, options?: KatexOptions): string;
}

interface MarkdownProps {
  source: string;
}

// Check if math expressions exist in the content
const hasMathExpression = (content: string): boolean => {
  return /\$\$(.*)\$\$/.test(content) || /```katex/.test(content);
};

export default function MarkdownComponent(props: MarkdownProps) {
  const [katexLoaded, setKatexLoaded] = useState(false);
  const [katexInstance, setKatexInstance] = useState<KatexInstance | null>(null);

  // Only load KaTeX if math expressions are detected
  useEffect(() => {
    if (hasMathExpression(props.source) && !katexLoaded) {
      import("katex").then((katexModule) => {
        import("katex/dist/katex.css");
        setKatexInstance(katexModule.default as unknown as KatexInstance);
        setKatexLoaded(true);
      });
    }
  }, [props.source, katexLoaded]);

  const renderKatexCode = (content: string) => {
    if (!katexInstance) return content;

    if (/^\$\$(.*)\$\$/.test(content)) {
      const html = katexInstance.renderToString(
        content.replace(/^\$\$(.*)\$\$/, "$1"),
        { throwOnError: false },
      );
      return (
        <code
          dangerouslySetInnerHTML={{ __html: html }}
          style={{ background: "transparent" }}
        />
      );
    }
    return content;
  };

  return (
    <MarkdownPreview
      source={props.source}
      style={{ padding: 16 }}
      components={{
        code: ({ children = [], className, ...props }) => {
          // If KaTeX is needed but not loaded yet, show a simple placeholder
          if (hasMathExpression(String(children)) && !katexLoaded) {
            return <code className={String(className)}>{children}</code>;
          }

          // Render KaTeX content if it's loaded
          if (
            katexLoaded &&
            typeof children === "string" &&
            /^\$\$(.*)\$\$/.test(children)
          ) {
            return renderKatexCode(children);
          }

          const code =
            props.node && props.node.children
              ? getCodeString(props.node.children)
              : children;

          if (
            katexInstance &&
            typeof code === "string" &&
            typeof className === "string" &&
            /^language-katex/.test(className.toLocaleLowerCase())
          ) {
            const html = katexInstance.renderToString(code, {
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
