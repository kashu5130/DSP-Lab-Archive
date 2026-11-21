import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEPLOYED_SITE_URL,
  ELECTRONICS_FAVICON_THEMES,
  buildPreviewShareUrl,
  computeClockWaveSamples,
  computeFaviconWaveSamples,
  computeLissajousPoint,
  computeOscilloscopeSamples,
  selectFaviconTheme,
} from './tabAnimator';

test('buildPreviewShareUrl formats root and experiment hash links for deployed URL', () => {
  assert.equal(buildPreviewShareUrl(DEPLOYED_SITE_URL), 'https://labmanuals.vercel.app/');
  assert.equal(buildPreviewShareUrl(`${DEPLOYED_SITE_URL}/`, 'home'), 'https://labmanuals.vercel.app/');
  assert.equal(
    buildPreviewShareUrl(`${DEPLOYED_SITE_URL}/`, 'exp-11'),
    'https://labmanuals.vercel.app/#exp-11'
  );
  assert.equal(
    buildPreviewShareUrl(DEPLOYED_SITE_URL, '#exp-4'),
    'https://labmanuals.vercel.app/#exp-4'
  );
});

test('computeFaviconWaveSamples produces bounded oscillating bar heights across phases', () => {
  const frame0 = computeFaviconWaveSamples(0, 6);
  const frame1 = computeFaviconWaveSamples(0.9, 6);

  assert.equal(frame0.length, 6);
  assert.equal(frame1.length, 6);

  for (const val of [...frame0, ...frame1]) {
    assert.ok(val >= 0.18 && val <= 1.0, `Expected sample ${val} within [0.18, 1.0]`);
  }

  assert.notDeepEqual(frame0, frame1);
});

test('selectFaviconTheme cycles cleanly through all 10 electronics lab themes', () => {
  assert.equal(ELECTRONICS_FAVICON_THEMES.length, 10);
  const observed = new Set(
    Array.from({ length: ELECTRONICS_FAVICON_THEMES.length * 4 }, (_, i) =>
      selectFaviconTheme(i, 4)
    )
  );
  assert.equal(observed.size, 10);
  assert.equal(selectFaviconTheme(0, 20), 'oscilloscope');
  assert.equal(selectFaviconTheme(20, 20), 'ic_chip');
  assert.equal(selectFaviconTheme(100, 20), 'radar_sonar');
  assert.equal(selectFaviconTheme(180, 20), 'coil_inductor');
  assert.equal(selectFaviconTheme(200, 20), 'oscilloscope');
});

test('computeOscilloscopeSamples, computeClockWaveSamples, and computeLissajousPoint produce valid waveform values', () => {
  const osc0 = computeOscilloscopeSamples(0, 25);
  const osc1 = computeOscilloscopeSamples(1.1, 25);
  assert.equal(osc0.length, 25);
  assert.ok(osc0.every((v) => v >= -1 && v <= 1));
  assert.notDeepEqual(osc0, osc1);

  const clk0 = computeClockWaveSamples(0, 8);
  const clk1 = computeClockWaveSamples(0.45, 8);
  assert.equal(clk0.length, 8);
  assert.ok(clk0.every((v) => v === 0 || v === 1));
  assert.notDeepEqual(clk0, clk1);

  const lis0 = computeLissajousPoint(0.5, 0);
  const lis1 = computeLissajousPoint(0.5, 1.2);
  assert.ok(lis0.x >= -1 && lis0.x <= 1 && lis0.y >= -1 && lis0.y <= 1);
  assert.notDeepEqual(lis0, lis1);
});
