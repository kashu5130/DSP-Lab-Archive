import test from 'node:test';
import assert from 'node:assert/strict';
import {
  countCodeLines,
  filterExperiments,
  normalizeScilabFilename,
  tokenizeScilabLine,
} from './scilabHighlighter';
import type { ExperimentFile } from '../types/experiment';

const SAMPLE_EXPERIMENTS: ExperimentFile[] = [
  {
    id: 'exp-1',
    number: 1,
    title: 'Basic signals',
    filename: 'exp01_basic_signals.sce',
    sourcePages: 'Pages 1–6',
    category: 'signals-convolution',
    categoryLabel: 'Signals & Convolution',
    software: 'Scilab 6.1.0',
    aim: 'Generate basic signals such as unit impulse, unit step, ramp.',
    theory: ['Unit step u[n] = 1 for n >= 0.'],
    expectedResult: 'Impulse exists only at n = 0.',
    code: 'clc;\nclear;\nu = bool2s(n >= 0);\nplot2d3(n, u);',
  },
  {
    id: 'exp-8',
    number: 8,
    title: 'IIR Butterworth filter (LPF/HPF)',
    filename: 'exp08_iir_butterworth.sce',
    sourcePages: 'Pages 23–25',
    category: 'filters-multirate',
    categoryLabel: 'Filters & Multirate',
    software: 'Scilab 6.1.0',
    aim: 'Design IIR Butterworth low-pass and high-pass filters.',
    theory: ['Uses bilinear transformation.'],
    expectedResult: 'Sharper transition with higher order.',
    code: 'Hz_lp = iir(N1, "lp", "butt", [fc 0], [0 0]);\n[hm_lp, fr] = frmag(Hz_lp, 512);',
  },
];

test('tokenizeScilabLine identifies keywords, builtins, constants, strings, numbers, and comments', () => {
  const tokens = tokenizeScilabLine('w = 0:%pi/255:%pi; // unit circle');
  assert.equal(tokens.some((t) => t.type === 'constant' && t.value === '%pi'), true);
  assert.equal(tokens.some((t) => t.type === 'number' && t.value === '255'), true);
  assert.equal(tokens.some((t) => t.type === 'comment' && t.value === '// unit circle'), true);

  const fnTokens = tokenizeScilabLine('u = bool2s(n >= 0); disp("Done");');
  assert.equal(fnTokens.some((t) => t.type === 'builtin' && t.value === 'bool2s'), true);
  assert.equal(fnTokens.some((t) => t.type === 'builtin' && t.value === 'disp'), true);
  assert.equal(fnTokens.some((t) => t.type === 'string' && t.value === '"Done"'), true);
});

test('filterExperiments matches across titles, filenames, functions inside code, and categories', () => {
  assert.equal(filterExperiments(SAMPLE_EXPERIMENTS, '', 'all').length, 2);
  assert.equal(filterExperiments(SAMPLE_EXPERIMENTS, 'Butterworth', 'all').length, 1);
  assert.equal(filterExperiments(SAMPLE_EXPERIMENTS, 'frmag', 'all')[0].id, 'exp-8');
  assert.equal(filterExperiments(SAMPLE_EXPERIMENTS, 'bool2s', 'signals-convolution').length, 1);
  assert.equal(filterExperiments(SAMPLE_EXPERIMENTS, 'bool2s', 'filters-multirate').length, 0);
  assert.equal(filterExperiments(SAMPLE_EXPERIMENTS, 'nonexistent_xyz', 'all').length, 0);
});

test('normalizeScilabFilename enforces safe .sce filenames', () => {
  assert.equal(normalizeScilabFilename('my signal test.txt'), 'my_signal_test.sce');
  assert.equal(normalizeScilabFilename('filter_design.sce'), 'filter_design.sce');
  assert.equal(normalizeScilabFilename('helper.sci'), 'helper.sci');
  assert.equal(normalizeScilabFilename('   '), 'custom_experiment.sce');
});

test('countCodeLines counts LF and CRLF lines accurately', () => {
  assert.equal(countCodeLines(''), 0);
  assert.equal(countCodeLines('clc;\nclear;'), 2);
  assert.equal(countCodeLines('clc;\r\nclear;\r\nclf;'), 3);
});
