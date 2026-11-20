import { Upload, X } from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { ExperimentFile } from '../types/experiment';
import { normalizeScilabFilename } from '../utils/scilabHighlighter';

interface ImportScilabModalProps {
  isOpen: boolean;
  nextNumber: number;
  onClose: () => void;
  onAddExperiment: (experiment: ExperimentFile) => void;
}

export function ImportScilabModal({
  isOpen,
  nextNumber,
  onClose,
  onAddExperiment,
}: ImportScilabModalProps) {
  const [title, setTitle] = useState('');
  const [filename, setFilename] = useState('');
  const [aim, setAim] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setCode(text);
    if (!filename) {
      setFilename(normalizeScilabFilename(file.name));
    }
    if (!title) {
      const cleanTitle = file.name.replace(/\.(sce|sci|txt|m)$/i, '').replace(/[_-]+/g, ' ');
      setTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
    }
    setError('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanCode = code.trim();

    if (!cleanTitle) {
      setError('Please enter an experiment title.');
      return;
    }
    if (!cleanCode) {
      setError('Please upload a .sce / .txt file or paste Scilab code.');
      return;
    }

    const safeFilename = normalizeScilabFilename(filename || cleanTitle.toLowerCase());
    const newExp: ExperimentFile = {
      id: `custom-${Date.now()}`,
      number: nextNumber,
      title: cleanTitle,
      filename: safeFilename,
      sourcePages: 'Local script',
      category: 'custom',
      categoryLabel: 'Imported Script',
      software: 'Scilab 6.1.0',
      aim: aim.trim() || 'User-imported Scilab practical script.',
      theory: [],
      expectedResult: '',
      code: cleanCode,
      isCustom: true,
    };

    onAddExperiment(newExp);
    setTitle('');
    setFilename('');
    setAim('');
    setCode('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#E4DFD6] bg-white p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-[#EAE5DC] pb-4">
          <div>
            <h2
              id="import-modal-title"
              className="font-display text-xl font-bold text-[#1C1917]"
            >
              Add Scilab (.sce) Script
            </h2>
            <p className="mt-1 text-sm text-[#57534E]">
              Load a local <code className="font-mono text-xs text-[#1C1917]">.sce</code>,{' '}
              <code className="font-mono text-xs text-[#1C1917]">.sci</code>, or{' '}
              <code className="font-mono text-xs text-[#1C1917]">.txt</code> file directly in your browser for inline preview, one-click copy, and .sce download.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Add Scilab Script dialog"
            className="rounded-lg p-2 text-[#57534E] hover:bg-[#F3EFE7] hover:text-[#1C1917]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="scilab-file-upload"
              className="flex cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-dashed border-[#C7BFB3] bg-[#FAF8F4] px-4 py-4 text-sm font-medium text-[#1C1917] hover:border-[#0F766E] hover:bg-[#F3EFE7] transition-colors duration-150"
            >
              <Upload className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
              <span>Choose a .sce, .sci, or .txt file from your computer</span>
              <input
                id="scilab-file-upload"
                type="file"
                accept=".sce,.sci,.txt,.m"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="import-title"
                className="block text-xs font-semibold text-[#292524]"
              >
                Experiment Title
              </label>
              <input
                id="import-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Bandpass Chebyshev filter"
                className="mt-1.5 h-10 w-full rounded-lg border border-[#D6CFC4] bg-[#FAF8F4] px-3 text-sm text-[#1C1917] focus:border-[#0F766E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
              />
            </div>

            <div>
              <label
                htmlFor="import-filename"
                className="block text-xs font-semibold text-[#292524]"
              >
                File Name (.sce)
              </label>
              <input
                id="import-filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="e.g. exp11_chebyshev.sce"
                className="mt-1.5 h-10 w-full rounded-lg border border-[#D6CFC4] bg-[#FAF8F4] px-3 font-mono text-sm text-[#1C1917] focus:border-[#0F766E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="import-aim" className="block text-xs font-semibold text-[#292524]">
              Aim / Short Description (Optional)
            </label>
            <input
              id="import-aim"
              type="text"
              value={aim}
              onChange={(e) => setAim(e.target.value)}
              placeholder="Briefly describe what this Scilab program demonstrates..."
              className="mt-1.5 h-10 w-full rounded-lg border border-[#D6CFC4] bg-[#FAF8F4] px-3 text-sm text-[#1C1917] focus:border-[#0F766E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
            />
          </div>

          <div>
            <label htmlFor="import-code" className="block text-xs font-semibold text-[#292524]">
              Scilab Source Code
            </label>
            <textarea
              id="import-code"
              rows={8}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              placeholder={'clc;\nclear;\nclf;\n// Paste your Scilab code here...'}
              className="mt-1.5 w-full rounded-lg border border-[#D6CFC4] bg-[#FAF7F2] p-3 font-mono text-xs leading-6 text-[#1C1917] focus:border-[#0F766E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs font-medium text-[#991B1B]">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-[#EAE5DC] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] rounded-lg border border-[#D6CFC4] bg-white px-4 py-2 text-sm font-medium text-[#57534E] hover:bg-[#FAF8F4] hover:text-[#1C1917]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[40px] rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#115E59]"
            >
              Add to Experiments List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
