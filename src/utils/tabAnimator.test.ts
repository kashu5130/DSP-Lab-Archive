import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEPLOYED_SITE_URL,
  buildPreviewShareUrl,
  computeFaviconWaveSamples,
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
  const frame0 = computeFaviconWaveSamples(0, 5);
  const frame1 = computeFaviconWaveSamples(0.9, 5);

  assert.equal(frame0.length, 5);
  assert.equal(frame1.length, 5);

  for (const val of [...frame0, ...frame1]) {
    assert.ok(val >= 0.22 && val <= 1.0, `Expected sample ${val} within [0.22, 1.0]`);
  }

  assert.notDeepEqual(frame0, frame1);
});
