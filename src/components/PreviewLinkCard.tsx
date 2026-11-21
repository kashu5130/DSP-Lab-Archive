import { Check, Copy, ExternalLink, Link2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ExperimentFile } from '../types/experiment';
import { copyToClipboard } from '../utils/fileActions';
import { DEPLOYED_SITE_URL, buildPreviewShareUrl } from '../utils/tabAnimator';

interface PreviewLinkCardProps {
  experiments: ExperimentFile[];
}

const PREVIEW_IMAGE_SRC = '/src/assets/images/dsp_lab_preview_card_1795255855708.jpg';

export function PreviewLinkCard({ experiments }: PreviewLinkCardProps) {
  const [selectedTarget, setSelectedTarget] = useState<string>('home');
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageError, setImageError] = useState(false);

  const selectedExperiment = useMemo(
    () => experiments.find((exp) => exp.id === selectedTarget) ?? null,
    [experiments, selectedTarget]
  );

  const shareUrl = useMemo(
    () => buildPreviewShareUrl(DEPLOYED_SITE_URL, selectedExperiment?.id ?? 'home'),
    [selectedExperiment]
  );

  const displayHost = 'labmanuals.vercel.app';

  const cardTitle = selectedExperiment
    ? `Exp ${String(selectedExperiment.number).padStart(2, '0')}: ${selectedExperiment.title} — DSP Lab Archive`
    : 'DSP Lab Archive — Scilab Practical Experiments & Manual';

  const cardDescription = selectedExperiment
    ? selectedExperiment.aim
    : 'Explore 11 Scilab 6.1.0 DSP practical experiments and the lab manual with inline code preview, one-click copy, search filtering, and .sce downloads.';

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section
      id="share-preview"
      aria-labelledby="share-preview-heading"
      className="mt-10"
      data-testid="preview-link-card-section"
    >
      <div className="rounded-xl border border-[#E4DFD6] bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-[#EAE5DC] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#0F766E]">Share &amp; Social Metadata</p>
            <h2
              id="share-preview-heading"
              className="mt-1 font-display text-xl font-bold text-[#1C1917] sm:text-2xl"
            >
              Preview Link Card
            </h2>
            <p className="mt-1 text-sm text-[#57534E]">
              Live preview of the OpenGraph link card for{' '}
              <span className="font-mono text-xs text-[#1C1917]">{DEPLOYED_SITE_URL}</span> when sharing the repository or an experiment URL.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <label htmlFor="preview-link-target" className="sr-only">
              Choose link destination to preview and copy
            </label>
            <select
              id="preview-link-target"
              value={selectedTarget}
              onChange={(e) => {
                setSelectedTarget(e.target.value);
                setCopiedLink(false);
              }}
              className="h-10 min-w-0 max-w-full rounded-lg border border-[#D6CFC4] bg-[#FAF8F4] px-3 text-xs font-medium text-[#1C1917] focus:border-[#0F766E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
            >
              <option value="home">Full Repository (Home Page)</option>
              {experiments.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  Exp {String(exp.number).padStart(2, '0')} — {exp.title}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleCopyLink}
              className={`inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] ${
                copiedLink
                  ? 'bg-[#047857] text-white'
                  : 'bg-[#0F766E] text-white hover:bg-[#115E59]'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copied Link</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copy Share Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social / Rich Link Preview Card */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-stretch">
          <a
            href={selectedExperiment ? `#${selectedExperiment.id}` : '#top'}
            className="group min-w-0 overflow-hidden rounded-xl border border-[#D6CFC4] bg-[#FAF8F4] transition-colors duration-150 hover:border-[#0F766E] lg:col-span-7 flex flex-col"
          >
            <div className="relative aspect-video w-full overflow-hidden border-b border-[#E4DFD6] bg-[#F3EFE7]">
              {!imageError ? (
                <img
                  src={PREVIEW_IMAGE_SRC}
                  alt="DSP Lab Archive discrete-time signal stem plot and Butterworth frequency response preview"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[#F3EFE7] px-6 text-center">
                  <Link2 className="h-7 w-7 text-[#0F766E]" aria-hidden="true" />
                  <p className="mt-2 font-display text-sm font-semibold text-[#1C1917]">
                    DSP Lab Archive — Scilab 6.1.0
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
              <div>
                <p className="font-mono text-xs text-[#57534E] truncate">{displayHost}</p>
                <h3 className="mt-1 font-display text-base font-bold text-[#1C1917] group-hover:text-[#0F766E] sm:text-lg [text-wrap:balance]">
                  {cardTitle}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#57534E]">
                  {cardDescription}
                </p>
              </div>
              <p className="mt-3 text-xs font-medium text-[#78716C]">
                <span>Scilab 6.1.0</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{experiments.length} Experiments</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Developed by PhantomZyrex</span>
              </p>
            </div>
          </a>

          {/* Direct URL Bar & OpenGraph Summary */}
          <div className="flex min-w-0 flex-col justify-between rounded-xl border border-[#E4DFD6] bg-[#FAF8F4] p-4 sm:p-5 lg:col-span-5">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#1C1917]">Deployed Shareable URL</p>
                <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-[#D6CFC4] bg-white px-3 py-2">
                  <Link2 className="h-4 w-4 shrink-0 text-[#0F766E]" aria-hidden="true" />
                  <code
                    data-testid="share-preview-url"
                    className="min-w-0 flex-1 truncate font-mono text-xs text-[#1C1917]"
                  >
                    {shareUrl}
                  </code>
                </div>
              </div>

              <div className="border-t border-[#EAE5DC] pt-3.5 text-xs leading-relaxed text-[#57534E]">
                <p className="font-semibold text-[#1C1917]">Configured Social Card Tags</p>
                <ul className="mt-2 space-y-1.5 font-mono text-[11px]">
                  <li className="truncate" title={`og:url · ${DEPLOYED_SITE_URL}/`}>
                    og:url · {DEPLOYED_SITE_URL}/
                  </li>
                  <li className="truncate" title={`og:image · ${DEPLOYED_SITE_URL}/og-preview.jpg`}>
                    og:image · {DEPLOYED_SITE_URL}/og-preview.jpg
                  </li>
                  <li className="truncate">twitter:card · summary_large_image</li>
                  <li className="truncate">schema.org · WebApplication JSON-LD</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EAE5DC] pt-4">
              <a
                href={selectedExperiment ? `#${selectedExperiment.id}` : '#top'}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] hover:text-[#115E59] hover:underline whitespace-nowrap"
              >
                <span>Jump to section</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>

              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] hover:text-[#0F766E] hover:underline whitespace-nowrap"
              >
                <span>Open {displayHost}</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
