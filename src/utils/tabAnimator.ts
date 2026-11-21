export const DEPLOYED_SITE_URL = 'https://labmanuals.vercel.app';

export function buildPreviewShareUrl(baseUrl: string, experimentId?: string | null): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  if (!experimentId || experimentId === 'home') {
    return `${normalizedBase}/`;
  }
  const cleanHash = experimentId.replace(/^#+/, '');
  return `${normalizedBase}/#${cleanHash}`;
}

export function computeFaviconWaveSamples(phase: number, barCount = 5): number[] {
  const samples: number[] = [];
  for (let i = 0; i < barCount; i++) {
    // Traveling multi-harmonic DSP wave normalized smoothly into [0.22, 1.0]
    const primary = Math.sin(phase - i * 0.85);
    const harmonic = 0.25 * Math.cos(phase * 1.5 + i * 0.6);
    const raw = (primary + harmonic) / 1.25;
    const normalized = 0.22 + ((raw + 1) * 0.5) * 0.78;
    samples.push(Math.min(1, Math.max(0.22, Number(normalized.toFixed(4)))));
  }
  return samples;
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function renderFaviconFrame(ctx: CanvasRenderingContext2D, phase: number): string {
  const size = 32;
  ctx.clearRect(0, 0, size, size);

  // Warm deep-teal badge matching DSP Lab Archive brand palette
  drawRoundedRectPath(ctx, 1, 1, 30, 30, 7);
  ctx.fillStyle = '#0F766E';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#115E59';
  ctx.stroke();

  // Subtle horizontal reference axis
  ctx.beginPath();
  ctx.moveTo(4.5, 16);
  ctx.lineTo(27.5, 16);
  ctx.strokeStyle = 'rgba(94, 234, 212, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 5 oscillating discrete-time signal bars
  const samples = computeFaviconWaveSamples(phase, 5);
  const barWidth = 3.2;
  const gap = 1.6;
  const startX = 5.2;
  const maxBarHeight = 20;

  samples.forEach((amp, idx) => {
    const barHeight = Math.max(5, Math.round(amp * maxBarHeight));
    const x = startX + idx * (barWidth + gap);
    const y = Math.round((size - barHeight) / 2);

    ctx.fillStyle = idx % 2 === 0 ? '#FAF8F4' : '#99F6E4';
    drawRoundedRectPath(ctx, x, y, barWidth, barHeight, 1.4);
    ctx.fill();
  });

  return ctx.canvas.toDataURL('image/png');
}

function ensureFaviconLinkElement(): HTMLLinkElement {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-live-tab="true"]');
  if (!link) {
    // Remove static icon links when live canvas favicon takes over so Chrome/Edge always pick the updated icon
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach((el) => {
      if (el.getAttribute('data-live-tab') !== 'true') {
        el.remove();
      }
    });
    link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.setAttribute('data-live-tab', 'true');
    document.head.appendChild(link);
  }
  return link;
}

export function startAnimatedTabFavicon(options?: { intervalMs?: number }): () => void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return () => {};
  }

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return () => {};
  }

  const iconLink = ensureFaviconLinkElement();
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let phase = 0;
  const updateFrame = () => {
    try {
      const dataUrl = renderFaviconFrame(ctx, phase);
      iconLink.href = dataUrl;
      phase = (phase + 0.45) % (Math.PI * 20);
    } catch {
      // Ignore canvas serialization errors in restricted browsers.
    }
  };

  // Paint initial frame immediately
  updateFrame();

  if (prefersReducedMotion) {
    return () => {};
  }

  const intervalMs = options?.intervalMs ?? 150;
  const timerId = window.setInterval(updateFrame, intervalMs);

  return () => {
    window.clearInterval(timerId);
  };
}
