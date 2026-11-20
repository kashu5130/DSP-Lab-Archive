import { Check, Copy, Download, WrapText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { copyToClipboard, downloadScilabFile } from '../utils/fileActions';
import { countCodeLines, tokenizeScilabLine, type ScilabTokenType } from '../utils/scilabHighlighter';

interface ScilabCodeBlockProps {
  filename: string;
  experimentTitle: string;
  code: string;
}

const TOKEN_CLASSES: Record<ScilabTokenType, string> = {
  comment: 'text-[#78716C] italic',
  string: 'text-[#9A3412]',
  keyword: 'text-[#0F766E] font-medium',
  builtin: 'text-[#1D4ED8]',
  constant: 'text-[#B45309] font-medium',
  number: 'text-[#B45309]',
  operator: 'text-[#57534E]',
  plain: 'text-[#1C1917]',
};

export function ScilabCodeBlock({ filename, experimentTitle, code }: ScilabCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [wrapLines, setWrapLines] = useState(false);

  const lines = useMemo(() => code.replace(/\r\n/g, '\n').split('\n'), [code]);
  const lineCount = useMemo(() => countCodeLines(code), [code]);
  const tokenizedLines = useMemo(() => lines.map((line) => tokenizeScilabLine(line)), [lines]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadScilabFile(filename, code);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-[#E4DFD6] bg-[#FAF7F2]">
      {/* Code file toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4DFD6] bg-[#F3EFE7] px-3.5 py-2.5 sm:px-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate font-mono text-xs font-medium text-[#1C1917]">
            {filename}
          </span>
          <span className="text-[#A8A29E]" aria-hidden="true">·</span>
          <span className="font-mono text-xs tabular-nums text-[#57534E] whitespace-nowrap shrink-0">
            {lineCount} lines
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setWrapLines((prev) => !prev)}
            aria-pressed={wrapLines}
            aria-label={`Toggle line wrapping for ${filename}`}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] ${
              wrapLines
                ? 'border-[#0F766E] bg-[#0F766E]/10 text-[#115E59]'
                : 'border-[#D6CFC4] bg-white text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <WrapText className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Wrap</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            aria-label={`Download ${filename}`}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-[#D6CFC4] bg-white px-3 py-1.5 text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F4] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
          >
            <Download className="h-3.5 w-3.5 text-[#57534E]" aria-hidden="true" />
            <span>Download .sce</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? `Copied ${experimentTitle}` : `Copy code for ${experimentTitle}`}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] ${
              copied
                ? 'bg-[#047857] text-white'
                : 'bg-[#0F766E] text-white hover:bg-[#115E59]'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Inline Scilab Code Preview */}
      <div className="w-full max-w-full overflow-x-auto">
        <pre
          className={`min-w-0 p-3.5 text-[13px] leading-6 font-mono sm:p-4 ${
            wrapLines ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
          }`}
        >
          <code>
            {tokenizedLines.map((tokens, index) => (
              <div key={index} className="table-row">
                <span
                  aria-hidden="true"
                  className="table-cell select-none pr-4 text-right font-mono text-xs tabular-nums text-[#A8A29E]"
                >
                  {index + 1}
                </span>
                <span className="table-cell">
                  {tokens.length > 0 ? (
                    tokens.map((token, tIdx) => (
                      <span key={tIdx} className={TOKEN_CLASSES[token.type]}>
                        {token.value}
                      </span>
                    ))
                  ) : (
                    '\u00A0'
                  )}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
