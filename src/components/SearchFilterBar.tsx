import { FilePlus2, Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { FilterCategory } from '../types/experiment';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
  totalCount: number;
  filteredCount: number;
  hasCustomFiles: boolean;
  onOpenImport: () => void;
}

const CATEGORIES: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'All Files' },
  { id: 'signals-convolution', label: 'Signals & Convolution' },
  { id: 'transforms-zdomain', label: 'Transforms & Z-Domain' },
  { id: 'filters-multirate', label: 'Filters & Multirate' },
];

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  totalCount,
  filteredCount,
  hasCustomFiles,
  onOpenImport,
}: SearchFilterBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const visibleCategories = hasCustomFiles
    ? [...CATEGORIES, { id: 'custom' as const, label: 'Imported' }]
    : CATEGORIES;

  return (
    <div className="rounded-xl border border-[#E4DFD6] bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <label htmlFor="experiment-search" className="sr-only">
            Search Scilab experiments, filenames, functions, or theory
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id="experiment-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by experiment, .sce filename, or Scilab function (e.g. fft, convol, iir)..."
            className="h-11 w-full rounded-lg border border-[#D6CFC4] bg-[#FAF8F4] pl-10 pr-16 text-sm text-[#1C1917] placeholder:text-[#78716C] focus:border-[#0F766E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#57534E] hover:bg-[#EAE5DC] hover:text-[#1C1917]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[#D6CFC4] bg-white px-1.5 py-0.5 font-mono text-[11px] text-[#78716C] sm:inline-block">
              /
            </kbd>
          )}
        </div>

        {/* Live Match Count & Import .sce Button */}
        <div className="flex items-center justify-between gap-3 md:justify-end">
          <span
            className="font-mono text-xs tabular-nums text-[#57534E] whitespace-nowrap"
            data-testid="filter-count"
          >
            {filteredCount} of {totalCount} {totalCount === 1 ? 'file' : 'files'}
          </span>

          <button
            type="button"
            onClick={onOpenImport}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-[#D6CFC4] bg-[#FAF8F4] px-3.5 py-2 text-xs font-semibold text-[#1C1917] hover:border-[#0F766E]/40 hover:bg-[#F3EFE7] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
          >
            <FilePlus2 className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
            <span>Add .sce Script</span>
          </button>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div
        role="group"
        aria-label="Filter experiments by topic"
        className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-[#EAE5DC] pt-3.5"
      >
        {visibleCategories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              aria-pressed={isActive}
              className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] ${
                isActive
                  ? 'bg-[#1C1917] text-white'
                  : 'bg-[#F3EFE7] text-[#57534E] hover:bg-[#EAE5DC] hover:text-[#1C1917]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
