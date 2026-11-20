import { Download, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { LAB_MANUAL } from '../data/experiments';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[#E4DFD6] bg-[#FAF8F4]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F766E]"
        >
          DSP Lab Archive
        </a>

        {/* Zone 2: 4 concise single-line text links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#57534E]"
        >
          <a
            href="#lab-manual"
            className="hover:text-[#1C1917] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F766E]"
          >
            Lab Manual
          </a>
          <a
            href="#experiments"
            className="hover:text-[#1C1917] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F766E]"
          >
            Experiments
          </a>
          <a
            href="#code-notes"
            className="hover:text-[#1C1917] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F766E]"
          >
            Code Notes
          </a>
          <a
            href="#scilab-guide"
            className="hover:text-[#1C1917] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F766E]"
          >
            Scilab Tips
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={LAB_MANUAL.pdfPath}
            download={LAB_MANUAL.downloadName}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#115E59] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sm:hidden">Manual PDF</span>
            <span className="hidden sm:inline">Download Manual</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4DFD6] bg-white text-[#1C1917] md:hidden hover:bg-[#F3EFE7] transition-colors duration-150"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-[#E4DFD6] bg-[#FAF8F4] px-4 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            <a
              href="#lab-manual"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-[#1C1917] hover:bg-[#F3EFE7]"
            >
              Lab Manual
            </a>
            <a
              href="#experiments"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-[#1C1917] hover:bg-[#F3EFE7]"
            >
              Experiments
            </a>
            <a
              href="#code-notes"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-[#1C1917] hover:bg-[#F3EFE7]"
            >
              Code Notes
            </a>
            <a
              href="#scilab-guide"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-[#1C1917] hover:bg-[#F3EFE7]"
            >
              Scilab Tips
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
