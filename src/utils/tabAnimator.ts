export const DEPLOYED_SITE_URL = 'https://labmanuals.vercel.app';

export type ElectronicsFaviconTheme =
  | 'oscilloscope'
  | 'ic_chip'
  | 'circuit_led'
  | 'clock_pulse'
  | 'dsp_spectrum'
  | 'radar_sonar'
  | 'sine_lissajous'
  | 'capacitor_charge'
  | 'logic_gate'
  | 'coil_inductor';

export const ELECTRONICS_FAVICON_THEMES: readonly ElectronicsFaviconTheme[] = [
  'oscilloscope',
  'ic_chip',
  'circuit_led',
  'clock_pulse',
  'dsp_spectrum',
  'radar_sonar',
  'sine_lissajous',
  'capacitor_charge',
  'logic_gate',
  'coil_inductor',
];

export function selectFaviconTheme(
  tickIndex: number,
  framesPerTheme = 20
): ElectronicsFaviconTheme {
  const safeFrames = Math.max(1, Math.floor(framesPerTheme));
  const normalizedTick = Math.max(0, Math.floor(tickIndex));
  const themeIndex = Math.floor(normalizedTick / safeFrames) % ELECTRONICS_FAVICON_THEMES.length;
  return ELECTRONICS_FAVICON_THEMES[themeIndex];
}

export function buildPreviewShareUrl(baseUrl: string, experimentId?: string | null): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  if (!experimentId || experimentId === 'home') {
    return `${normalizedBase}/`;
  }
  const cleanHash = experimentId.replace(/^#+/, '');
  return `${normalizedBase}/#${cleanHash}`;
}

export function computeFaviconWaveSamples(phase: number, barCount = 6): number[] {
  const samples: number[] = [];
  for (let i = 0; i < barCount; i++) {
    // High-energy multi-harmonic FFT spectrum wave normalized smoothly into [0.18, 1.0]
    const primary = Math.sin(phase * 1.35 - i * 0.8);
    const harmonic = 0.35 * Math.cos(phase * 2.1 + i * 0.65);
    const raw = (primary + harmonic) / 1.35;
    const normalized = 0.18 + ((raw + 1) * 0.5) * 0.82;
    samples.push(Math.min(1, Math.max(0.18, Number(normalized.toFixed(4)))));
  }
  return samples;
}

export function computeOscilloscopeSamples(phase: number, pointCount = 25): number[] {
  const points: number[] = [];
  for (let i = 0; i < pointCount; i++) {
    const t = (i / Math.max(1, pointCount - 1)) * Math.PI * 2.5;
    const carrier = Math.sin(t * 1.4 - phase * 1.6);
    const envelope = 0.72 + 0.28 * Math.cos(t * 0.5 + phase * 0.9);
    points.push(Number((carrier * envelope).toFixed(4)));
  }
  return points;
}

export function computeClockWaveSamples(phase: number, stepCount = 8): number[] {
  const levels: number[] = [];
  const shift = Math.floor(phase / 0.4);
  for (let i = 0; i < stepCount; i++) {
    levels.push((i + shift) % 2 === 0 ? 1 : 0);
  }
  return levels;
}

export function computeLissajousPoint(
  t: number,
  phase: number
): { x: number; y: number } {
  const x = Math.sin(3 * t + phase);
  const y = Math.sin(2 * t + phase * 0.35);
  return {
    x: Number(x.toFixed(4)),
    y: Number(y.toFixed(4)),
  };
}

const CANVAS_SIZE = 64;

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

function drawLabBadge(
  ctx: CanvasRenderingContext2D,
  fill: string,
  stroke: string
) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  drawRoundedRectPath(ctx, 2, 2, 60, 60, 14);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = stroke;
  ctx.stroke();
}

function renderOscilloscopeTheme(ctx: CanvasRenderingContext2D, phase: number) {
  drawLabBadge(ctx, '#0B3531', '#14B8A6');

  // CRT reticle grid
  ctx.strokeStyle = 'rgba(94, 234, 212, 0.22)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(8, 32);
  ctx.lineTo(56, 32);
  ctx.moveTo(32, 8);
  ctx.lineTo(32, 56);
  ctx.stroke();

  // Sweeping vertical CRT timebase beam
  const scanNorm = ((phase * 0.32) % 1 + 1) % 1;
  const scanX = 8 + scanNorm * 48;
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(scanX, 8);
  ctx.lineTo(scanX, 56);
  ctx.stroke();

  // Secondary ghost harmonic trace
  const samples = computeOscilloscopeSamples(phase, 25);
  ctx.beginPath();
  samples.forEach((val, idx) => {
    const x = 8 + (idx / (samples.length - 1)) * 48;
    const y = 32 - Math.sin(idx * 0.45 + phase * 1.1) * 10;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = 'rgba(250, 248, 244, 0.38)';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Primary bright modulated cyan oscilloscope wave
  ctx.beginPath();
  samples.forEach((val, idx) => {
    const x = 8 + (idx / (samples.length - 1)) * 48;
    const y = 32 - val * 16;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#5EEAD4';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Glowing amber phosphor beam riding the timebase sweep
  const samplePos = scanNorm * (samples.length - 1);
  const idxLow = Math.floor(samplePos);
  const idxHigh = Math.min(samples.length - 1, idxLow + 1);
  const frac = samplePos - idxLow;
  const interpVal = samples[idxLow] * (1 - frac) + samples[idxHigh] * frac;
  const dotY = 32 - interpVal * 16;

  ctx.beginPath();
  ctx.arc(scanX, dotY, 4.8, 0, Math.PI * 2);
  ctx.fillStyle = '#FBBF24';
  ctx.fill();
}

function renderIcChipTheme(ctx: CanvasRenderingContext2D, phase: number) {
  drawLabBadge(ctx, '#114440', '#14B8A6');

  // Corner PCB bus traces flashing with traveling pulse
  ctx.strokeStyle = 'rgba(94, 234, 212, 0.32)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(6, 16);
  ctx.lineTo(14, 16);
  ctx.moveTo(6, 48);
  ctx.lineTo(14, 48);
  ctx.moveTo(50, 16);
  ctx.lineTo(58, 16);
  ctx.moveTo(50, 48);
  ctx.lineTo(58, 48);
  ctx.stroke();

  // Smooth cascading DIP pins (4 left, 4 right)
  for (let row = 0; row < 4; row++) {
    const y = 14 + row * 10;
    const leftWave = 0.5 + 0.5 * Math.sin(phase * 2.4 - row * 1.1);
    const rightWave = 0.5 + 0.5 * Math.sin(phase * 2.4 - (3 - row) * 1.1 + Math.PI * 0.5);

    ctx.fillStyle = leftWave > 0.65 ? '#FBBF24' : leftWave > 0.35 ? '#5EEAD4' : '#D6CFC4';
    drawRoundedRectPath(ctx, 6, y, 11, 5, 2);
    ctx.fill();

    ctx.fillStyle = rightWave > 0.65 ? '#5EEAD4' : rightWave > 0.35 ? '#FBBF24' : '#D6CFC4';
    drawRoundedRectPath(ctx, 47, y, 11, 5, 2);
    ctx.fill();
  }

  // Silicon DIP package body
  drawRoundedRectPath(ctx, 18, 10, 28, 44, 5);
  ctx.fillStyle = '#1C1917';
  ctx.fill();
  ctx.lineWidth = 2.4;
  ctx.strokeStyle = '#FAF8F4';
  ctx.stroke();

  // Rotating die clock arc + pulsing core
  const rot = phase * 1.8;
  ctx.beginPath();
  ctx.arc(32, 32, 9.5, rot, rot + Math.PI * 1.25);
  ctx.strokeStyle = '#5EEAD4';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();

  const pulse = 0.5 + 0.5 * Math.sin(phase * 3.0);
  ctx.beginPath();
  ctx.arc(32, 32, 3.8 + pulse * 2.2, 0, Math.PI * 2);
  ctx.fillStyle = pulse > 0.5 ? '#FBBF24' : '#FAF8F4';
  ctx.fill();
}

function renderCircuitLedTheme(ctx: CanvasRenderingContext2D, phase: number) {
  drawLabBadge(ctx, '#0D3834', '#14B8A6');

  // Expanding concentric light burst rings from LED
  const burst1 = ((phase * 0.5) % 1 + 1) % 1;
  const burst2 = ((phase * 0.5 + 0.5) % 1 + 1) % 1;

  [burst1, burst2].forEach((b) => {
    ctx.beginPath();
    ctx.arc(32, 21, 9 + b * 13, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(251, 191, 36, ${(1 - b) * 0.75})`;
    ctx.lineWidth = 2.6;
    ctx.stroke();
  });

  // Glowing LED dome
  const glow = 0.5 + 0.5 * Math.sin(phase * 2.8);
  ctx.beginPath();
  ctx.arc(32, 21, 8.5, 0, Math.PI * 2);
  ctx.fillStyle = glow > 0.45 ? '#FBBF24' : '#F59E0B';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#FAF8F4';
  ctx.stroke();

  // Resistor zigzag PCB trace
  const pathPoints: Array<[number, number]> = [
    [7, 45],
    [17, 45],
    [22, 37],
    [28, 53],
    [34, 37],
    [40, 53],
    [45, 45],
    [57, 45],
  ];

  ctx.beginPath();
  pathPoints.forEach(([px, py], i) => {
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.strokeStyle = '#FAF8F4';
  ctx.lineWidth = 3.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // 3 high-speed electron packets sliding smoothly along the PCB trace
  for (let k = 0; k < 3; k++) {
    const t = ((phase * 0.45 + k / 3) % 1 + 1) % 1;
    const segFloat = t * (pathPoints.length - 1);
    const idx = Math.min(pathPoints.length - 2, Math.floor(segFloat));
    const localT = segFloat - idx;
    const [x1, y1] = pathPoints[idx];
    const [x2, y2] = pathPoints[idx + 1];
    const ex = x1 + (x2 - x1) * localT;
    const ey = y1 + (y2 - y1) * localT;

    ctx.beginPath();
    ctx.arc(ex, ey, 3.6, 0, Math.PI * 2);
    ctx.fillStyle = k === 0 ? '#5EEAD4' : '#FBBF24';
    ctx.fill();
  }
}

function renderClockPulseTheme(ctx: CanvasRenderingContext2D, phase: number) {
  drawLabBadge(ctx, '#114440', '#14B8A6');

  // Continuous sub-pixel horizontal scrolling TTL clock train
  const period = 20;
  const scroll = ((phase * 9.5) % period + period) % period;
  const highY = 17;
  const lowY = 36;

  ctx.beginPath();
  let started = false;
  for (let cycle = -1; cycle < 4; cycle++) {
    const x0 = 8 + cycle * period - scroll;
    const xMid = x0 + period * 0.5;
    const xEnd = x0 + period;

    const segs: Array<[number, number]> = [
      [x0, lowY],
      [x0, highY],
      [xMid, highY],
      [xMid, lowY],
      [xEnd, lowY],
    ];
    for (const [sx, sy] of segs) {
      const clampedX = Math.max(8, Math.min(56, sx));
      if (!started) {
        ctx.moveTo(clampedX, sy);
        started = true;
      } else {
        ctx.lineTo(clampedX, sy);
      }
    }
  }
  ctx.strokeStyle = '#5EEAD4';
  ctx.lineWidth = 4.2;
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';
  ctx.stroke();

  // Complementary inverted bottom bit stream
  const dataYHigh = 45;
  const dataYLow = 53;
  ctx.beginPath();
  for (let i = 0; i <= 4; i++) {
    const bx = 8 + i * 12 - (scroll * 0.6);
    const y = (i % 2 === 0) ? dataYHigh : dataYLow;
    const clampedBx = Math.max(8, Math.min(56, bx));
    if (i === 0) ctx.moveTo(clampedBx, y);
    else {
      const prevY = ((i - 1) % 2 === 0) ? dataYHigh : dataYLow;
      ctx.lineTo(clampedBx, prevY);
      ctx.lineTo(clampedBx, y);
    }
  }
  ctx.strokeStyle = 'rgba(250, 248, 244, 0.65)';
  ctx.lineWidth = 2.6;
  ctx.stroke();

  // Moving trigger spark on rising edge
  const edgeX = 8 + ((period - scroll) % period) + period;
  if (edgeX >= 8 && edgeX <= 56) {
    ctx.beginPath();
    ctx.arc(edgeX, (highY + lowY) / 2, 4.2, 0, Math.PI * 2);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();
  }
}

function renderDspSpectrumTheme(ctx: CanvasRenderingContext2D, phase: number) {
  drawLabBadge(ctx, '#0F766E', '#14B8A6');

  // Sweeping baseline shimmer
  ctx.beginPath();
  ctx.moveTo(8, 52);
  ctx.lineTo(56, 52);
  ctx.strokeStyle = 'rgba(94, 234, 212, 0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  const samples = computeFaviconWaveSamples(phase, 6);
  const barWidth = 5.8;
  const gap = 2.4;
  const startX = 8.6;
  const maxBarHeight = 36;

  samples.forEach((amp, idx) => {
    const barHeight = Math.max(8, Math.round(amp * maxBarHeight));
    const x = startX + idx * (barWidth + gap);
    const y = 50 - barHeight;

    ctx.fillStyle = idx % 2 === 0 ? '#FAF8F4' : '#99F6E4';
    drawRoundedRectPath(ctx, x, y, barWidth, barHeight, 2);
    ctx.fill();

    // Floating amber peak-hold cap bouncing smoothly above each bar
    const peakOffset = 3 + Math.abs(Math.sin(phase * 1.4 + idx * 0.7)) * 4;
    const capY = Math.max(8, y - peakOffset);
    ctx.fillStyle = '#FBBF24';
    drawRoundedRectPath(ctx, x, capY, barWidth, 3.2, 1.4);
    ctx.fill();
  });
}

function renderRadarSonarTheme(ctx: CanvasRenderingContext2D, phase: number) {
  drawLabBadge(ctx, '#0B3531', '#14B8A6');

  // Concentric range rings
  [21, 12].forEach((r) => {
    ctx.beginPath();
    ctx.arc(32, 32, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(94, 234, 212, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Rotating phosphor sweep wedge
  const angle = phase * 1.5;
  ctx.beginPath();
  ctx.moveTo(32, 32);
  ctx.arc(32, 32, 22, angle - 0.95, angle);
  ctx.closePath();
  ctx.fillStyle = 'rgba(94, 234, 212, 0.34)';
  ctx.fill();

  // Leading sweep beam
  const beamX = 32 + Math.cos(angle) * 22;
  const beamY = 32 + Math.sin(angle) * 22;
  ctx.beginPath();
  ctx.moveTo(32, 32);
  ctx.lineTo(beamX, beamY);
  ctx.strokeStyle = '#5EEAD4';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Pulsing target blips
  const blip1Pulse = 0.5 + 0.5 * Math.cos(angle - 0.8);
  ctx.beginPath();
  ctx.arc(44, 21, 2.5 + blip1Pulse * 2, 0, Math.PI * 2);
  ctx.fillStyle = '#FBBF24';
  ctx.fill();

  const blip2Pulse = 0.5 + 0.5 * Math.cos(angle - 3.6);
  ctx.beginPath();
  ctx.arc(21, 41, 2.2 + blip2Pulse * 1.8, 0, Math.PI * 2);
  ctx.fillStyle = '#FAF8F4';
  ctx.fill();

  // Center emitter dot
  ctx.beginPath();
  ctx.arc(32, 32, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = '#FAF8F4';
  ctx.fill();
}

function renderSineLissajousTheme(ctx: CanvasRenderingContext2D, phase: number) {
  drawLabBadge(ctx, '#114440', '#14B8A6');

  // Subtle crosshairs
  ctx.strokeStyle = 'rgba(94, 234, 212, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(8, 32);
  ctx.lineTo(56, 32);
  ctx.moveTo(32, 8);
  ctx.lineTo(32, 56);
  ctx.stroke();

  // Continuous 3:2 Lissajous figure
  const steps = 48;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const pt = computeLissajousPoint(t, phase * 0.75);
    const px = 32 + pt.x * 20;
    const py = 32 + pt.y * 20;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = '#5EEAD4';
  ctx.lineWidth = 3.6;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // High-speed electron beam tracer orbiting along the curve
  const head = computeLissajousPoint(phase * 1.3, phase * 0.75);
  ctx.beginPath();
  ctx.arc(32 + head.x * 20, 32 + head.y * 20, 4.8, 0, Math.PI * 2);
  ctx.fillStyle = '#FBBF24';
  ctx.fill();
}

function renderCapacitorChargeTheme(ctx: CanvasRenderingContext2D, phase: number) {
  drawLabBadge(ctx, '#0D3834', '#14B8A6');

  // Lead wires
  ctx.strokeStyle = '#D6CFC4';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(7, 32);
  ctx.lineTo(22, 32);
  ctx.moveTo(42, 32);
  ctx.lineTo(57, 32);
  ctx.stroke();

  // Parallel capacitor plates
  drawRoundedRectPath(ctx, 21, 13, 5.5, 38, 2.5);
  ctx.fillStyle = '#FAF8F4';
  ctx.fill();

  drawRoundedRectPath(ctx, 37.5, 13, 5.5, 38, 2.5);
  ctx.fillStyle = '#5EEAD4';
  ctx.fill();

  // Surging electric discharge arc between plates
  const arcShift = Math.sin(phase * 3.5) * 4;
  ctx.beginPath();
  ctx.moveTo(26.5, 22);
  ctx.lineTo(32 + arcShift * 0.4, 27);
  ctx.lineTo(31 - arcShift * 0.5, 34);
  ctx.lineTo(37.5, 41);
  ctx.strokeStyle = '#FBBF24';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Charge level pulse bar at bottom
  const charge = 0.5 + 0.5 * Math.sin(phase * 1.8);
  drawRoundedRectPath(ctx, 14, 54, 36, 4, 2);
  ctx.fillStyle = 'rgba(250, 248, 244, 0.2)';
  ctx.fill();

  drawRoundedRectPath(ctx, 14, 54, Math.max(6, charge * 36), 4, 2);
  ctx.fillStyle = charge > 0.7 ? '#FBBF24' : '#5EEAD4';
  ctx.fill();
}

function renderLogicGateTheme(ctx: CanvasRenderingContext2D, phase: number) {
  drawLabBadge(ctx, '#114440', '#14B8A6');

  // Input wires A and B
  ctx.strokeStyle = '#5EEAD4';
  ctx.lineWidth = 3.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(6, 22);
  ctx.lineTo(20, 22);
  ctx.moveTo(6, 42);
  ctx.lineTo(20, 42);
  ctx.stroke();

  // Output wire Y
  ctx.strokeStyle = '#FBBF24';
  ctx.beginPath();
  ctx.moveTo(45, 32);
  ctx.lineTo(58, 32);
  ctx.stroke();

  // AND gate body
  ctx.beginPath();
  ctx.moveTo(20, 15);
  ctx.lineTo(32, 15);
  ctx.arc(32, 32, 17, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(20, 49);
  ctx.closePath();
  const flash = 0.5 + 0.5 * Math.sin(phase * 2.5);
  ctx.fillStyle = flash > 0.65 ? '#0F766E' : '#1C1917';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FAF8F4';
  ctx.stroke();

  // Animated input packets on A & B and output packet on Y
  const travel = ((phase * 0.55) % 1 + 1) % 1;
  const inX = 7 + travel * 12;
  const outX = 46 + travel * 11;

  ctx.fillStyle = '#5EEAD4';
  ctx.beginPath();
  ctx.arc(inX, 22, 3.3, 0, Math.PI * 2);
  ctx.arc(inX, 42, 3.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FBBF24';
  ctx.beginPath();
  ctx.arc(outX, 32, 3.8, 0, Math.PI * 2);
  ctx.fill();
}

function renderCoilInductorTheme(ctx: CanvasRenderingContext2D, phase: number) {
  drawLabBadge(ctx, '#0B3531', '#14B8A6');

  // Expanding electromagnetic flux rings
  for (let i = 0; i < 3; i++) {
    const prog = ((phase * 0.45 + i / 3) % 1 + 1) % 1;
    const radius = 10 + prog * 16;
    ctx.beginPath();
    ctx.arc(32, 32, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(94, 234, 212, ${(1 - prog) * 0.72})`;
    ctx.lineWidth = 2.4;
    ctx.stroke();
  }

  // Multi-loop copper inductor coil across center
  ctx.beginPath();
  ctx.moveTo(7, 36);
  ctx.lineTo(14, 36);
  for (let loop = 0; loop < 3; loop++) {
    const cx = 20 + loop * 12;
    ctx.arc(cx, 36, 6, Math.PI, 0, false);
  }
  ctx.lineTo(57, 36);
  ctx.strokeStyle = '#FAF8F4';
  ctx.lineWidth = 3.8;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Alternating AC polarity flux core line above windings
  const coreShift = Math.sin(phase * 2.6) * 5;
  ctx.beginPath();
  ctx.moveTo(18 + coreShift, 21);
  ctx.lineTo(46 + coreShift, 21);
  ctx.strokeStyle = '#FBBF24';
  ctx.lineWidth = 3.4;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function renderFaviconFrame(
  ctx: CanvasRenderingContext2D,
  phase: number,
  theme: ElectronicsFaviconTheme
): string {
  switch (theme) {
    case 'oscilloscope':
      renderOscilloscopeTheme(ctx, phase);
      break;
    case 'ic_chip':
      renderIcChipTheme(ctx, phase);
      break;
    case 'circuit_led':
      renderCircuitLedTheme(ctx, phase);
      break;
    case 'clock_pulse':
      renderClockPulseTheme(ctx, phase);
      break;
    case 'dsp_spectrum':
      renderDspSpectrumTheme(ctx, phase);
      break;
    case 'radar_sonar':
      renderRadarSonarTheme(ctx, phase);
      break;
    case 'sine_lissajous':
      renderSineLissajousTheme(ctx, phase);
      break;
    case 'capacitor_charge':
      renderCapacitorChargeTheme(ctx, phase);
      break;
    case 'logic_gate':
      renderLogicGateTheme(ctx, phase);
      break;
    case 'coil_inductor':
      renderCoilInductorTheme(ctx, phase);
      break;
  }
  return ctx.canvas.toDataURL('image/png');
}

function ensureFaviconLinkElement(): HTMLLinkElement {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-live-tab="true"]');
  if (!link) {
    // Keep apple-touch-icon & manifest intact; replace static tab icon links so Chrome/Edge update live frames cleanly
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

export function startAnimatedTabFavicon(options?: {
  intervalMs?: number;
  framesPerTheme?: number;
}): () => void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return () => {};
  }

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return () => {};
  }

  const iconLink = ensureFaviconLinkElement();
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const framesPerTheme = options?.framesPerTheme ?? 20;
  let tickIndex = 0;
  let phase = 0;

  const updateFrame = () => {
    try {
      const theme = selectFaviconTheme(tickIndex, framesPerTheme);
      const dataUrl = renderFaviconFrame(ctx, phase, theme);
      iconLink.setAttribute('data-theme', theme);
      iconLink.href = dataUrl;
      tickIndex += 1;
      phase = (phase + 0.36) % (Math.PI * 40);
    } catch {
      // Ignore canvas serialization errors in restricted browsers.
    }
  };

  // Paint initial frame immediately
  updateFrame();

  if (prefersReducedMotion) {
    return () => {};
  }

  const intervalMs = options?.intervalMs ?? 80;
  const timerId = window.setInterval(updateFrame, intervalMs);

  return () => {
    window.clearInterval(timerId);
  };
}
