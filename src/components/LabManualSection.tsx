import { BookOpen, ChevronDown, ChevronUp, Download, ExternalLink, FileText } from 'lucide-react';
import { useState } from 'react';
import { LAB_MANUAL } from '../data/experiments';
import type { ExperimentFile } from '../types/experiment';

interface LabManualSectionProps {
  experiments: ExperimentFile[];
  onSelectExperiment?: (id: string) => void;
}

export function LabManualSection({ experiments, onSelectExperiment }: LabManualSectionProps) {
  const [manualOpen, setManualOpen] = useState(false);
  const [readerTab, setReaderTab] = useState<'pdf' | 'transcribed'>('pdf');

  const handleToggleManual = () => {
    setManualOpen((prev) => {
      const next = !prev;
      if (next) {
        setReaderTab('pdf');
      }
      return next;
    });
  };

  return (
    <section id="lab-manual" aria-labelledby="lab-manual-heading" className="pt-8 pb-8 sm:pt-10 sm:pb-10">
      <div className="rounded-xl border border-[#E4DFD6] bg-white p-5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left column: Lab Manual introduction and actions */}
          <div className="min-w-0 lg:col-span-7">
            <p className="text-xs font-medium tracking-wide text-[#57534E]">
              <span>Laboratory Manual</span>
              <span className="mx-2 text-[#A8A29E]" aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{LAB_MANUAL.softwareVersion}</span>
              <span className="mx-2 text-[#A8A29E]" aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{experiments.length} Experiments</span>
            </p>

            <h1
              id="lab-manual-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-[#1C1917] sm:text-4xl [text-wrap:balance]"
            >
              {LAB_MANUAL.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#57534E] sm:text-base">
              {LAB_MANUAL.subtitle}. Browse the full manual below, jump directly to any practical experiment, copy ready-to-run Scilab scripts, or download individual{' '}
              <code className="rounded bg-[#F3EFE7] px-1.5 py-0.5 font-mono text-xs text-[#1C1917]">
                .sce
              </code>{' '}
              files.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-[#44403C]">
              {LAB_MANUAL.notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F766E]"
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleToggleManual}
                aria-expanded={manualOpen}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#115E59] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                <span>{manualOpen ? 'Hide Lab Manual' : 'Read Lab Manual'}</span>
                {manualOpen ? (
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                )}
              </button>

              <a
                href={LAB_MANUAL.pdfPath}
                download={LAB_MANUAL.downloadName}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#D6CFC4] bg-[#FAF8F4] px-4 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F3EFE7] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
              >
                <Download className="h-4 w-4 text-[#57534E]" aria-hidden="true" />
                <span>Download PDF</span>
              </a>

              <a
                href={LAB_MANUAL.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-[#0F766E] hover:text-[#115E59] underline underline-offset-4 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
              >
                <span>Open PDF in new tab</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right column: Quick Experiment Index */}
          <div className="min-w-0 overflow-hidden rounded-lg border border-[#E4DFD6] bg-[#FAF8F4] p-4 sm:p-5 lg:col-span-5">
            <div className="flex items-center justify-between gap-2 border-b border-[#E4DFD6] pb-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 shrink-0 text-[#0F766E]" aria-hidden="true" />
                <h2 className="truncate font-display text-sm font-semibold text-[#1C1917]">
                  Practical Experiments Index
                </h2>
              </div>
              <span className="font-mono text-xs tabular-nums text-[#57534E] whitespace-nowrap shrink-0">
                33 Source Pages
              </span>
            </div>

            <ol className="mt-3 divide-y divide-[#EAE5DC]">
              {experiments.filter((exp) => !exp.isCustom).map((exp) => (
                <li key={exp.id} className="min-w-0">
                  <a
                    href={`#${exp.id}`}
                    onClick={() => onSelectExperiment?.(exp.id)}
                    className="group flex items-baseline justify-between gap-3 py-2 text-sm hover:text-[#0F766E] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
                  >
                    <span className="flex items-baseline gap-2 min-w-0 flex-1">
                      <span className="font-mono text-xs font-medium tabular-nums text-[#78716C] group-hover:text-[#0F766E] shrink-0">
                        {String(exp.number).padStart(2, '0')}
                      </span>
                      <span className="truncate font-medium text-[#292524] group-hover:text-[#0F766E]">
                        {exp.title}
                      </span>
                    </span>
                    <span className="font-mono text-xs tabular-nums text-[#78716C] whitespace-nowrap shrink-0">
                      {exp.sourcePages}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Inline Lab Manual Reader (Transcribed Document + Optional PDF Embed) */}
        {manualOpen && (
          <div className="mt-6 border-t border-[#E4DFD6] pt-6" data-testid="lab-manual-reader">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div
                role="tablist"
                aria-label="Lab manual view mode"
                className="inline-flex items-center gap-1 rounded-lg bg-[#F3EFE7] p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={readerTab === 'pdf'}
                  onClick={() => setReaderTab('pdf')}
                  className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap ${
                    readerTab === 'pdf'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  Original PDF
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={readerTab === 'transcribed'}
                  onClick={() => setReaderTab('transcribed')}
                  className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap ${
                    readerTab === 'transcribed'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  Readable Manual (All 10 Experiments)
                </button>
              </div>

              <a
                href={LAB_MANUAL.pdfPath}
                download={LAB_MANUAL.downloadName}
                className="text-xs font-medium text-[#0F766E] hover:underline"
              >
                Save {LAB_MANUAL.downloadName}
              </a>
            </div>

            {readerTab === 'transcribed' ? (
              <div className="max-h-[540px] overflow-y-auto rounded-lg border border-[#E4DFD6] bg-[#FAF8F4] p-5 sm:p-7">
                <div className="border-b border-[#E4DFD6] pb-4">
                  <p className="font-mono text-xs text-[#0F766E]">
                    Digital Signal Processing Lab Manual · Scilab 6.1.0
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold text-[#1C1917]">
                    Complete Practical Manual — Aims, Theory &amp; Recorded Results
                  </h3>
                </div>

                <div className="mt-5 space-y-6 divide-y divide-[#EAE5DC]">
                  {experiments.slice(0, 10).map((exp) => (
                    <div key={exp.id} className="pt-5 first:pt-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-display text-base font-bold text-[#1C1917]">
                          Experiment No. {exp.number} — {exp.title}
                        </h4>
                        <span className="font-mono text-xs text-[#78716C]">
                          {exp.sourcePages}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-[#44403C]">
                        <span className="font-semibold text-[#1C1917]">Aim: </span>
                        {exp.aim}
                      </p>
                      {exp.theory.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm text-[#57534E]">
                          {exp.theory.map((t, i) => (
                            <li key={i}>• {t}</li>
                          ))}
                        </ul>
                      )}
                      {exp.expectedResult && (
                        <p className="mt-2 text-sm text-[#44403C]">
                          <span className="font-semibold text-[#1C1917]">Notebook Result: </span>
                          {exp.expectedResult}
                        </p>
                      )}
                      <div className="mt-2">
                        <a
                          href={`#${exp.id}`}
                          className="text-xs font-semibold text-[#0F766E] hover:underline"
                        >
                          Jump to {exp.filename} code ↓
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-[#D6CFC4] bg-[#F3EFE7]">
                <object
                  data={LAB_MANUAL.pdfPath}
                  type="application/pdf"
                  aria-label="Digital Signal Processing Lab Manual PDF"
                  className="h-[520px] w-full sm:h-[640px]"
                >
                  <div className="flex h-[320px] flex-col items-center justify-center p-6 text-center">
                    <p className="font-display text-base font-semibold text-[#1C1917]">
                      Inline PDF plugin is unavailable in this browser
                    </p>
                    <p className="mt-1.5 max-w-md text-sm text-[#57534E]">
                      Switch to the Readable Manual tab above, or open/download the PDF directly.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                      <a
                        href={LAB_MANUAL.pdfPath}
                        download={LAB_MANUAL.downloadName}
                        className="rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#115E59]"
                      >
                        Download PDF
                      </a>
                      <a
                        href={LAB_MANUAL.pdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-[#D6CFC4] bg-white px-4 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#FAF8F4]"
                      >
                        Open PDF in new tab
                      </a>
                    </div>
                  </div>
                </object>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
