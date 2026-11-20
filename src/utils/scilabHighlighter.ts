import type { ExperimentFile, FilterCategory } from '../types/experiment';

export type ScilabTokenType =
  | 'comment'
  | 'string'
  | 'keyword'
  | 'builtin'
  | 'constant'
  | 'number'
  | 'operator'
  | 'plain';

export interface ScilabToken {
  type: ScilabTokenType;
  value: string;
}

const SCILAB_KEYWORDS = new Set([
  'if',
  'then',
  'else',
  'elseif',
  'end',
  'for',
  'while',
  'do',
  'function',
  'endfunction',
  'return',
  'break',
  'continue',
  'select',
  'case',
  'try',
  'catch',
  'clear',
  'clc',
  'clf',
  'scf',
]);

const SCILAB_BUILTINS = new Set([
  'input',
  'disp',
  'error',
  'length',
  'zeros',
  'ones',
  'max',
  'min',
  'sum',
  'round',
  'modulo',
  'sqrt',
  'sin',
  'cos',
  'exp',
  'log',
  'atan',
  'abs',
  'real',
  'imag',
  'bool2s',
  'convol',
  'fft',
  'ifft',
  'poly',
  'iir',
  'frmag',
  'besseli',
  'subplot',
  'plot2d3',
  'plot',
  'xlabel',
  'ylabel',
  'title',
  'xtitle',
  'xgrid',
  'close',
]);

const SCILAB_CONSTANTS = new Set(['%pi', '%i', '%e', '%t', '%f', '%eps', '%inf', '%nan', '$']);

/**
 * Tokenizes a single line of Scilab code for syntax highlighting.
 */
export function tokenizeScilabLine(line: string): ScilabToken[] {
  const tokens: ScilabToken[] = [];
  let i = 0;

  while (i < line.length) {
    // Line comment // ...
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ type: 'comment', value: line.slice(i) });
      break;
    }

    // String literal "..." or '...'
    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === quote) {
          if (line[j + 1] === quote) {
            j += 2;
            continue;
          }
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push({ type: 'string', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Scilab % constants (%pi, %i, %e, etc.)
    if (line[i] === '%') {
      const match = line.slice(i).match(/^%[a-zA-Z_][a-zA-Z0-9_]*/);
      if (match) {
        const val = match[0];
        tokens.push({
          type: SCILAB_CONSTANTS.has(val) ? 'constant' : 'plain',
          value: val,
        });
        i += val.length;
        continue;
      }
    }

    // End-index symbol $
    if (line[i] === '$') {
      tokens.push({ type: 'constant', value: '$' });
      i += 1;
      continue;
    }

    // Numbers (integers, decimals, scientific notation)
    if (/[0-9]/.test(line[i]) || (line[i] === '.' && /[0-9]/.test(line[i + 1] ?? ''))) {
      const match = line.slice(i).match(/^(?:\d+\.?\d*|\.\d+)(?:[eEdD][+-]?\d+)?/);
      if (match) {
        tokens.push({ type: 'number', value: match[0] });
        i += match[0].length;
        continue;
      }
    }

    // Identifiers, keywords, builtins
    if (/[a-zA-Z_]/.test(line[i])) {
      const match = line.slice(i).match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
      if (match) {
        const word = match[0];
        let type: ScilabTokenType = 'plain';
        if (SCILAB_KEYWORDS.has(word)) {
          type = 'keyword';
        } else if (SCILAB_BUILTINS.has(word)) {
          type = 'builtin';
        }
        tokens.push({ type, value: word });
        i += word.length;
        continue;
      }
    }

    // Element-wise or multi-char operators (.*, ./, .^, <=, >=, <>, ==)
    const opMatch = line.slice(i).match(/^(?:\.\*|\.\/|\.\^|<=|>=|<>|==|[+\-*/^=<>:&|])/);
    if (opMatch) {
      tokens.push({ type: 'operator', value: opMatch[0] });
      i += opMatch[0].length;
      continue;
    }

    // Whitespace or punctuation run
    const plainMatch = line.slice(i).match(/^[^\w"'%$0-9+\-*/^=<>:&|.]+|^\./);
    if (plainMatch) {
      tokens.push({ type: 'plain', value: plainMatch[0] });
      i += plainMatch[0].length;
      continue;
    }

    tokens.push({ type: 'plain', value: line[i] });
    i += 1;
  }

  return tokens;
}

/**
 * Filters experiments by search query (across title, filename, aim, theory, result, code)
 * and selected category.
 */
export function filterExperiments(
  experiments: ExperimentFile[],
  searchQuery: string,
  category: FilterCategory
): ExperimentFile[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return experiments.filter((exp) => {
    if (category !== 'all' && exp.category !== category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const expNumberString = `exp ${exp.number} experiment ${exp.number} no. ${exp.number}`;
    const haystack = [
      expNumberString,
      exp.title,
      exp.filename,
      exp.categoryLabel,
      exp.aim,
      exp.expectedResult,
      exp.codeNote ?? '',
      ...exp.theory,
      exp.code,
    ]
      .join('\n')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

/**
 * Ensures any user-provided filename is safe and carries a .sce or .sci extension.
 */
export function normalizeScilabFilename(rawName: string): string {
  const trimmed = rawName.trim().replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^_+|_+$/g, '');
  const base = trimmed || 'custom_experiment';
  if (/\.(sce|sci)$/i.test(base)) {
    return base;
  }
  const stripped = base.replace(/\.(txt|m)$/i, '');
  return `${stripped || 'custom_experiment'}.sce`;
}

/**
 * Counts lines in a Scilab script string consistently.
 */
export function countCodeLines(code: string): number {
  if (!code) return 0;
  return code.replace(/\r\n/g, '\n').split('\n').length;
}
