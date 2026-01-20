import { Streamdown } from "streamdown";
import { code } from '@streamdown/code';
import { mermaid } from '@streamdown/mermaid';
import { createMathPlugin } from '@streamdown/math';
import { cjk } from '@streamdown/cjk';
import "katex/dist/katex.min.css";

interface MarkdownProps {
  source: string;
}

// Create the base math plugin using the built-in creator
const baseMath = createMathPlugin({
  singleDollarTextMath: true,
});

// Extend it with our custom macros for \scr and \cal
const mathPlugin = baseMath.rehypePlugin as [any, any];
const math = {
  ...baseMath,
  rehypePlugin: [
    mathPlugin[0],
    {
      ...mathPlugin[1],
      macros: {
        "\\scr": "\\mathscr",
        "\\cal": "\\mathcal",
      },
      throwOnError: false,
    },
  ],
};

export default function MarkdownComponent(props: MarkdownProps) {
  return (
    <div className="p-4 overflow-auto h-full w-full">
      <Streamdown plugins={{ code, mermaid, math: math as any, cjk }}>
        {props.source}
      </Streamdown>
    </div>
  );
}
