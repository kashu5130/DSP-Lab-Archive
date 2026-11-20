import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ExperimentFile } from '../types/experiment';
import { ScilabCodeBlock } from './ScilabCodeBlock';

interface ExperimentCardProps {
  experiment: ExperimentFile;
  onRemoveCustom?: (id: string) => void;
}

export function ExperimentCard({ experiment, onRemoveCustom }: ExperimentCardProps) {
  const [theoryOpen, setTheoryOpen] = useState(false);

  return (
    <article
      id={experiment.id}
      data-testid="experiment-card"
      className="min-w-0 overflow-hidden scroll-mt-20 rounded-xl border border-[#E4DFD6] bg-white p-4 sm:p-7"
    >
      {/* Header row with unboxed editorial metadata */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#57534E]">
            <span className="font-mono tabular-nums text-[#0F766E]">
              Experiment {String(experiment.number).padStart(2, '0')}
            </span>
            <span className="mx-2 text-[#A8A29E]" aria-hidden="true">·</span>
            <span>{experiment.categoryLabel}</span>
            <span className="mx-2 text-[#A8A29E]" aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{experiment.sourcePages}</span>
            <span className="mx-2 text-[#A8A29E]" aria-hidden="true">·</span>
            <span className="font-mono">{experiment.software}</span>
          </p>

          <h2 className="mt-1.5 font-display text-xl font-bold tracking-tight text-[#1C1917] sm:text-2xl [text-wrap:balance]">
            {experiment.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {experiment.theory.length > 0 && (
            <button
              type="button"
              onClick={() => setTheoryOpen((prev) => !prev)}
              aria-expanded={theoryOpen}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#E4DFD6] bg-[#FAF8F4] px-3 py-1.5 text-xs font-medium text-[#44403C] hover:bg-[#F3EFE7] hover:text-[#1C1917] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
            >
              <span>{theoryOpen ? 'Hide Theory' : 'Theory & Notes'}</span>
              {theoryOpen ? (
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          )}

          {experiment.isCustom && onRemoveCustom && (
            <button
              type="button"
              onClick={() => onRemoveCustom(experiment.id)}
              aria-label={`Remove ${experiment.title}`}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#E4DFD6] bg-[#FAF8F4] px-3 py-1.5 text-xs font-medium text-[#991B1B] hover:bg-[#FEF2F2] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#991B1B]"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>

      {/* Aim & Expected Outcome */}
      <div className="mt-3.5 space-y-2 text-sm leading-relaxed text-[#44403C]">
        <p>
          <span className="font-semibold text-[#1C1917]">Aim: </span>
          {experiment.aim}
        </p>
        {experiment.expectedResult && (
          <p className="text-[#57534E]">
            <span className="font-semibold text-[#292524]">Recorded Result: </span>
            {experiment.expectedResult}
          </p>
        )}
      </div>

      {/* Collapsible Theory & Implementation Notes */}
      {theoryOpen && (
        <div className="mt-4 rounded-lg border border-[#EAE5DC] bg-[#FAF8F4] p-4 text-sm leading-relaxed text-[#44403C]">
          <h3 className="font-display text-xs font-semibold tracking-wide text-[#1C1917]">
            Theory Summary
          </h3>
          <ul className="mt-2 space-y-1.5">
            {experiment.theory.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#78716C]"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          {experiment.codeNote && (
            <p className="mt-3 border-t border-[#E4DFD6] pt-2.5 text-xs text-[#57534E]">
              <span className="font-semibold text-[#292524]">Implementation note: </span>
              {experiment.codeNote}
            </p>
          )}
        </div>
      )}

      {/* Always-visible Inline Scilab Code Preview */}
      <div className="mt-5">
        <ScilabCodeBlock
          filename={experiment.filename}
          experimentTitle={experiment.title}
          code={experiment.code}
        />
      </div>
    </article>
  );
}
