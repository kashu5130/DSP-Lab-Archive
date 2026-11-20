import { LAB_MANUAL } from '../data/experiments';

export function ScilabGuideSection() {
  return (
    <section
      id="code-notes"
      aria-labelledby="code-notes-heading"
      className="mt-12 grid gap-6 lg:grid-cols-2"
    >
      <div className="min-w-0 rounded-xl border border-[#E4DFD6] bg-white p-6 sm:p-7">
        <p className="text-xs font-medium text-[#0F766E]">Manual Verification</p>
        <h2
          id="code-notes-heading"
          className="mt-1.5 font-display text-xl font-bold text-[#1C1917]"
        >
          Code Review &amp; Repairs Summary
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#57534E]">
          Summary of Scilab 6.1.0 fixes applied across the 10 practical programs transcribed from the 33-page lab record:
        </p>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#44403C]">
          {LAB_MANUAL.codeReviewSummary.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F766E]"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        id="scilab-guide"
        className="min-w-0 rounded-xl border border-[#E4DFD6] bg-white p-6 sm:p-7"
      >
        <p className="text-xs font-medium text-[#0F766E]">File Handling &amp; Workflow</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-[#1C1917]">
          Working with Scilab (.sce) Files
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#44403C]">
          <p>
            <span className="font-semibold text-[#1C1917]">Why .sce uploads fail in chat tools: </span>
            Many web chat uploaders only allow PDF, image, or <code className="font-mono text-xs text-[#1C1917]">.txt</code> files. Because Scilab{' '}
            <code className="font-mono text-xs text-[#1C1917]">.sce</code> and{' '}
            <code className="font-mono text-xs text-[#1C1917]">.sci</code> scripts are standard UTF-8 plain text, you can either load{' '}
            <code className="font-mono text-xs text-[#1C1917]">.sce</code> files directly using{' '}
            <span className="font-semibold text-[#1C1917]">Add .sce Script</span> above, or temporarily rename a copy to{' '}
            <code className="font-mono text-xs text-[#1C1917]">.txt</code> before sharing.
          </p>
          <p>
            <span className="font-semibold text-[#1C1917]">Running in Scilab 6.1.0: </span>
            Click <span className="font-semibold text-[#1C1917]">Download .sce</span> on any experiment card, open the file in SciNotes, and press Execute—or run it directly in the Scilab console:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-[#E4DFD6] bg-[#FAF7F2] p-3 font-mono text-xs text-[#1C1917]">
            <code>exec("exp01_basic_signals.sce", -1);</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
