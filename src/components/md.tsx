import { Streamdown } from 'streamdown'
import type { MathPlugin } from 'streamdown'
import { code } from '@streamdown/code'
import { mermaid } from '@streamdown/mermaid'
import { createMathPlugin } from '@streamdown/math'
import { cjk } from '@streamdown/cjk'
import 'katex/dist/katex.min.css'

interface MarkdownProps {
  source: string
}

// Create the base math plugin using the built-in creator
const baseMath = createMathPlugin({
  singleDollarTextMath: true,
})

// Extend it with our custom macros for \scr and \cal
const mathPlugin = baseMath.rehypePlugin as [unknown, Record<string, unknown>]
const math: MathPlugin = {
  ...baseMath,
  rehypePlugin: [
    mathPlugin[0],
    {
      ...(mathPlugin[1] as Record<string, unknown>),
      macros: {
        '\\scr': '\\mathscr',
        '\\cal': '\\mathcal',
      },
      throwOnError: false,
    },
  ] as MathPlugin['rehypePlugin'],
}

export default function MarkdownComponent(props: MarkdownProps) {
  return (
    <div className="h-full w-full overflow-auto p-4 wrap-break-word [&_pre]:whitespace-pre-wrap [&_pre]:overflow-x-auto [&_code]:break-all [&_.katex-display]:overflow-x-auto">
      <Streamdown plugins={{ code, mermaid, math, cjk }}>
        {props.source}
      </Streamdown>
    </div>
  )
}
