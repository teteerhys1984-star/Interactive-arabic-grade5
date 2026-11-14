import { describe, it, expect } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import indexCss from '../index.css?raw';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { getLessonById } from '../data/curriculumRegistry';

/**
 * PR #18 — step bar: the «الآن» label and the current-step dot must not overlap.
 *
 * The bug was a grid-placement collision, not a font or spacing accident: both
 * `.lesson-step-status` («الآن») and `.lesson-step-current-marker` were forced
 * into the same cell (`grid-column: 3; grid-row: 1`), so the dot — centered with
 * `justify-self: center` — was painted over the label's last letters in RTL.
 * jsdom has no layout engine, so the geometry itself was verified in a real
 * Chromium (see the PR report); this file locks the placement contract that
 * caused it: two distinct cells, four tracks, and a label that stays visible,
 * complete, and untruncated.
 */

/* ------------------------------------------------------------------ */
/* A tiny top-level CSS reader: enough to resolve the cascade by hand. */
/* ------------------------------------------------------------------ */

const stripComments = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, '');

function blockEnd(css: string, openIndex: number): number {
  let depth = 0;
  for (let i = openIndex; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Rules that live at the top level of the stylesheet (not inside @media/@supports). */
function topLevelRules(source: string): Array<{ prelude: string; body: string }> {
  const css = stripComments(source);
  const rules: Array<{ prelude: string; body: string }> = [];
  let index = 0;
  while (index < css.length) {
    const open = css.indexOf('{', index);
    if (open === -1) break;
    const prelude = css.slice(index, open).trim();
    const end = blockEnd(css, open);
    if (end === -1) break;
    if (!prelude.startsWith('@')) rules.push({ prelude, body: css.slice(open + 1, end) });
    index = end + 1;
  }
  return rules;
}

/**
 * Declarations of `selector`, merged in source order — i.e. the winning values.
 * Pass several selectors to resolve a cascade (e.g. base rule + current-row rule).
 */
function declarations(selector: string | string[], source: string = indexCss): Map<string, string> {
  const wanted = typeof selector === 'string' ? [selector] : selector;
  const merged = new Map<string, string>();
  for (const rule of topLevelRules(source)) {
    const selectors = rule.prelude.split(',').map((item) => item.trim());
    if (!selectors.some((item) => wanted.includes(item))) continue;
    for (const declaration of rule.body.split(';')) {
      const separator = declaration.indexOf(':');
      if (separator === -1) continue;
      merged.set(declaration.slice(0, separator).trim(), declaration.slice(separator + 1).trim());
    }
  }
  return merged;
}

/** Splits a `grid-template-columns` value into its tracks (keeping `minmax(…)` whole). */
function gridTracks(value: string): string[] {
  const tracks: string[] = [];
  let depth = 0;
  let current = '';
  for (const character of value) {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    if (depth === 0 && /\s/.test(character)) {
      if (current) tracks.push(current);
      current = '';
    } else {
      current += character;
    }
  }
  if (current) tracks.push(current);
  return tracks;
}

/** The four children a current step button renders, in DOM order. */
const STEP_BUTTON_ITEMS = [
  { name: 'number', selector: '.lesson-step-number' },
  { name: 'title', selector: '.lesson-step-name' },
  { name: 'status', selector: '.lesson-step-status' },
  { name: 'marker', selector: '.lesson-step-current-marker' },
];

/**
 * Auto-placement simulation for the step button: explicit cells are claimed
 * first, then every remaining item takes the next free track in DOM order.
 */
const CURRENT_BUTTON = ['.lesson-nav-button', '.lesson-nav-item.is-current .lesson-nav-button'];

function cellOf(source: string = indexCss) {
  const tracks = gridTracks(declarations(CURRENT_BUTTON, source).get('grid-template-columns') ?? '');
  const explicit = STEP_BUTTON_ITEMS.map((item) => {
    const rule = declarations(item.selector, source);
    const value = rule.get('grid-column') ?? rule.get('grid-column-start');
    const column = value ? Number(value.split('/')[0].trim()) : NaN;
    return Number.isFinite(column) ? column : null;
  });
  const claimed = new Set(explicit.filter((column): column is number => column !== null));
  const cells = explicit.map((column) => {
    if (column !== null) return column;
    let next = 1;
    while (claimed.has(next)) next += 1;
    claimed.add(next);
    return next;
  });
  return { tracks, cells };
}

const currentButton = () => screen.getByRole('button', { name: /، الخطوة الحالية$/ });

describe('step bar — «الآن» label vs current-step dot', () => {
  it('places the label and the dot in two different grid cells', () => {
    const { tracks, cells } = cellOf();
    const status = STEP_BUTTON_ITEMS.findIndex((item) => item.name === 'status');
    const marker = STEP_BUTTON_ITEMS.findIndex((item) => item.name === 'marker');

    expect(tracks.length, 'the step button needs a track per child').toBeGreaterThanOrEqual(STEP_BUTTON_ITEMS.length);
    expect(cells[status]).not.toBe(cells[marker]);
    expect(new Set(cells).size, 'every step-button child occupies its own column').toBe(STEP_BUTTON_ITEMS.length);
  });

  it('keeps the dot layout logical (RTL-safe) instead of physical offsets', () => {
    for (const selector of ['.lesson-step-status', '.lesson-step-current-marker']) {
      const rule = declarations(selector);
      for (const physical of ['left', 'right', 'margin-left', 'margin-right', 'translate', 'transform']) {
        expect(rule.has(physical), `${selector} must not position with ${physical}`).toBe(false);
      }
    }
  });

  it('keeps the label visible and complete — no hiding, clipping, or ellipsis workaround', () => {
    const status = declarations('.lesson-step-status');
    expect(status.get('display')).not.toBe('none');
    expect(status.has('text-overflow')).toBe(false);
    expect(status.has('text-indent')).toBe(false);
    expect(status.get('overflow')).not.toBe('hidden');
    expect(status.get('visibility')).not.toBe('hidden');
    expect(status.has('clip-path')).toBe(false);
    expect(status.has('font-size') ? Number.parseFloat(status.get('font-size') as string) : 1).toBeGreaterThan(0);
    expect(indexCss).not.toMatch(/\.lesson-step-status[^{]*\{[^}]*text-overflow:\s*ellipsis/);
  });

  it('renders «الآن» once, beside an aria-hidden dot, and keeps step navigation intact', () => {
    const { lesson, unit } = getLessonById('lesson1')!;
    const view = render(<LessonFlow lesson={lesson} unit={unit} />);

    const button = currentButton();
    const status = button.querySelector('.lesson-step-status') as HTMLElement;
    const marker = button.querySelector('.lesson-step-current-marker') as HTMLElement;

    expect(status).not.toBeNull();
    expect(status.textContent).toBe('الآن');
    expect(marker).not.toBeNull();
    expect(marker.getAttribute('aria-hidden')).toBe('true');
    // siblings in the same grid, not nested inside one another
    expect(status.parentElement).toBe(marker.parentElement);
    expect(status.contains(marker)).toBe(false);
    expect(marker.contains(status)).toBe(false);
    expect(view.container.querySelector('.lesson-shell')?.getAttribute('dir')).toBe('rtl');

    // Navigation still moves the marker and the label to the newly selected step.
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 3:/ }));
    const moved = currentButton();
    expect(moved).toHaveAttribute('aria-current', 'step');
    expect(moved.querySelector('.lesson-step-status')?.textContent).toBe('الآن');
    expect(moved.querySelector('.lesson-step-current-marker')).not.toBeNull();
    expect(view.container.querySelectorAll('.lesson-step-status')).toHaveLength(1);
    view.unmount();
    cleanup();
  });
});
