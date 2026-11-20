import { RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ExperimentCard } from './components/ExperimentCard';
import { Header } from './components/Header';
import { ImportScilabModal } from './components/ImportScilabModal';
import { LabManualSection } from './components/LabManualSection';
import { ScilabGuideSection } from './components/ScilabGuideSection';
import { SearchFilterBar } from './components/SearchFilterBar';
import { EXPERIMENTS } from './data/experiments';
import type { ExperimentFile, FilterCategory } from './types/experiment';
import { filterExperiments } from './utils/scilabHighlighter';

const CUSTOM_STORAGE_KEY = 'dsp_lab_custom_scripts_v1';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [importOpen, setImportOpen] = useState(false);
  const [customExperiments, setCustomExperiments] = useState<ExperimentFile[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem(CUSTOM_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(customExperiments));
    } catch {
      // Ignore storage quota errors in restricted environments.
    }
  }, [customExperiments]);

  const allExperiments = useMemo(
    () => [...EXPERIMENTS, ...customExperiments],
    [customExperiments]
  );

  const filteredExperiments = useMemo(
    () => filterExperiments(allExperiments, searchQuery, selectedCategory),
    [allExperiments, searchQuery, selectedCategory]
  );

  const handleAddExperiment = (exp: ExperimentFile) => {
    setCustomExperiments((prev) => [...prev, exp]);
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const handleRemoveCustom = (id: string) => {
    setCustomExperiments((prev) => prev.filter((item) => item.id !== id));
    if (selectedCategory === 'custom' && customExperiments.length <= 1) {
      setSelectedCategory('all');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div id="top" className="min-h-screen bg-[#FAF8F4] text-[#1C1917]">
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Lab Manual Section at Top */}
        <LabManualSection
          experiments={allExperiments}
          onSelectExperiment={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
        />

        {/* Practical Experiments List & Search */}
        <section id="experiments" aria-labelledby="experiments-heading" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="experiments-heading"
                className="font-display text-2xl font-bold tracking-tight text-[#1C1917] sm:text-3xl"
              >
                Practical Experiments &amp; Scilab Files
              </h2>
              <p className="mt-1 text-sm text-[#57534E]">
                Every experiment script with inline syntax-highlighted preview, one-click copy, and direct{' '}
                <code className="font-mono text-xs text-[#1C1917]">.sce</code> download.
              </p>
            </div>
          </div>

          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            totalCount={allExperiments.length}
            filteredCount={filteredExperiments.length}
            hasCustomFiles={customExperiments.length > 0}
            onOpenImport={() => setImportOpen(true)}
          />

          {filteredExperiments.length > 0 ? (
            <div className="space-y-6" data-testid="experiments-list">
              {filteredExperiments.map((exp) => (
                <ExperimentCard
                  key={exp.id}
                  experiment={exp}
                  onRemoveCustom={handleRemoveCustom}
                />
              ))}
            </div>
          ) : (
            <div
              data-testid="empty-search-state"
              className="rounded-xl border border-[#E4DFD6] bg-white px-6 py-12 text-center"
            >
              <h3 className="font-display text-lg font-semibold text-[#1C1917]">
                No matching Scilab experiments found
              </h3>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-[#57534E]">
                No experiment titles, filenames, or code lines matched{' '}
                <span className="font-mono text-[#1C1917]">
                  &ldquo;{searchQuery || selectedCategory}&rdquo;
                </span>
                .
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#115E59] transition-colors duration-150"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span>Reset search &amp; filters</span>
              </button>
            </div>
          )}
        </section>

        {/* Code Review Summary & Scilab File Guide */}
        <ScilabGuideSection />
      </main>

      <footer className="border-t border-[#E4DFD6] bg-[#F3EFE7]/60 py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-xs text-[#57534E] sm:px-6 lg:px-8">
          <p>
            DSP Lab Archive · Scilab 6.1.0 · <span className="font-semibold text-[#1C1917]">Developed by PhantomZyrex</span>
          </p>
          <p className="font-mono tabular-nums">11 Core Experiments · Inline Preview &amp; .sce Export</p>
        </div>
      </footer>

      <ImportScilabModal
        isOpen={importOpen}
        nextNumber={allExperiments.length + 1}
        onClose={() => setImportOpen(false)}
        onAddExperiment={handleAddExperiment}
      />
    </div>
  );
}
