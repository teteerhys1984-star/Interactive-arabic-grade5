import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import indexCss from '../index.css?raw';
import { Lesson2StepRenderer } from '../components/curriculum/Lesson2StepRenderer';
import { LESSON2_STEPS } from '../data/lesson2/content';

/**
 * PR #17 — Lesson 2 platform exercises, UI & accessibility polish.
 *
 * These tests lock the presentation/accessibility contract added on top of the
 * already-approved Lesson 2 platform panels: a padded panel header, a single
 * vertical rhythm, a ≥44px «تحقّق» button, non-colour-only feedback, clearly
 * enabled choice fields, and a polite/atomic announcement of the result.
 * They assert *contract*, never content: no prompt, option, or answer key is
 * restated here, so a future content change cannot be smuggled in via this file.
 */

const step = (id: string) => LESSON2_STEPS.find((item) => item.id === id)!;
const grammarPanel = 'شرح المنصة وتدريبات المصدر';
const spellingPanel = 'شرح المنصة وتدريبات همزة القطع';
const panel = (name: string) => screen.getByRole('region', { name });
const exercise = (title: string) => screen.getByRole('region', { name: title });
const choose = (region: HTMLElement, label: string, value: string) =>
  fireEvent.change(within(region).getByLabelText(label), { target: { value } });

/** Returns the declarations of one exact CSS rule (`selector { … }`). */
const rule = (selector: string) => {
  const start = indexCss.indexOf(`${selector} {`);
  expect(start, `missing CSS rule: ${selector}`).toBeGreaterThan(-1);
  return indexCss.slice(start, indexCss.indexOf('}', start));
};

describe('Lesson 2 platform exercises — UI & accessibility polish', () => {
  it('places the panel introduction inside the shared Lesson-1 header pattern with real padding', () => {
    const { unmount } = render(<Lesson2StepRenderer step={step('l2-s5')} />);
    const region = panel(grammarPanel);
    const header = region.querySelector('.platform-panel-header');
    expect(header).not.toBeNull();
    expect(within(header as HTMLElement).getByRole('heading', { level: 3 })).toHaveTextContent('أفهم المصدر وأتدرّب');
    expect(region.querySelector('.l2-platform-body')).not.toBeNull();
    // the intro no longer sits flush against the panel edge
    expect(rule('.platform-panel-header')).toMatch(/padding:/);
    expect(rule('.l2-platform-body')).toMatch(/padding:/);
    unmount();

    render(<Lesson2StepRenderer step={step('l2-s6')} />);
    const spellingRegion = panel(spellingPanel);
    expect(spellingRegion.querySelector('.platform-panel-header')).not.toBeNull();
    expect(within(spellingRegion).getByRole('heading', { level: 3 })).toHaveTextContent('أتدرّب على همزة القطع');
    expect(spellingRegion.querySelector('.l2-platform-body')).not.toBeNull();
  });

  it('keeps one vertical rhythm from heading to question to fields to action', () => {
    render(<Lesson2StepRenderer step={step('l2-s5')} />);
    const task = exercise('أميّز الكلمات');
    const heading = within(task).getByRole('heading', { level: 4, name: 'أميّز الكلمات' });
    const prompt = task.querySelector('.l2-exercise-prompt') as HTMLElement;
    const firstField = within(task).getByLabelText('جَلَسَ');
    const check = within(task).getByRole('button', { name: 'تحقّق' });

    const order = (first: Node, second: Node) =>
      Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(order(heading, prompt)).toBe(true);
    expect(order(prompt, firstField)).toBe(true);
    expect(order(firstField, check)).toBe(true);
    expect(task.querySelector('.l2-exercise-head')).not.toBeNull();
    expect(task.querySelector('.l2-exercise-actions')).not.toBeNull();

    // spacing is declared on the containers, not improvised per element
    expect(rule('.l2-platform-body')).toMatch(/display:\s*flex/);
    expect(rule('.l2-platform-body')).toMatch(/gap:/);
    expect(rule('.l2-exercise-head')).toMatch(/gap:/);
    expect(rule('.l2-exercise-rows')).toMatch(/gap:/);
    expect(rule('.l2-exercise-actions')).toMatch(/gap:/);
  });

  it('renders a «تحقّق» button that is at least 44px tall', () => {
    render(<Lesson2StepRenderer step={step('l2-s5')} />);
    const task = exercise('أميّز الكلمات');
    const check = within(task).getByRole('button', { name: 'تحقّق' });
    expect(check).toHaveClass('l2-check-button');
    // btn-small would shrink it to 36px — the panel button must not use it
    expect(check).not.toHaveClass('btn-small');
    expect(rule('.l2-platform-exercise .l2-check-button')).toMatch(/min-height:\s*44px/);
    expect(check).toBeDisabled();
    choose(task, 'جَلَسَ', 'verb');
    choose(task, 'جُلوس', 'source');
    choose(task, 'كُرسيّ', 'thing');
    expect(within(task).getByRole('button', { name: 'تحقّق' })).toBeEnabled();
  });

  it('separates correct from incorrect feedback by icon, word and border style', () => {
    render(<Lesson2StepRenderer step={step('l2-s5')} />);
    const task = exercise('أميّز الكلمات');
    choose(task, 'جَلَسَ', 'verb');
    choose(task, 'جُلوس', 'thing');
    choose(task, 'كُرسيّ', 'thing');
    fireEvent.click(within(task).getByRole('button', { name: 'تحقّق' }));

    const status = within(task).getByRole('status');
    const lines = [...status.querySelectorAll('.l2-check-line')];
    expect(lines).toHaveLength(3);

    expect(lines[0]).toHaveClass('is-correct');
    expect(lines[1]).toHaveClass('is-wrong');
    expect(lines[0].querySelector('.l2-check-mark')).toHaveTextContent('✓');
    expect(lines[1].querySelector('.l2-check-mark')).toHaveTextContent('✗');
    // the glyph is decoration; the meaning is carried by real text
    expect(lines[0].querySelector('.l2-check-mark')).toHaveAttribute('aria-hidden', 'true');
    expect(within(lines[0] as HTMLElement).getByText('صحيح')).toBeInTheDocument();
    expect(within(lines[1] as HTMLElement).getByText('يحتاج مراجعة')).toBeInTheDocument();
    expect(status).toHaveTextContent('أحسنت');
    expect(status).toHaveTextContent('حاول مجددًا');
    expect(status).toHaveTextContent('الإجابة المناسبة');

    // solid vs dashed borders + a start edge: recognisable without colour
    expect(rule('.l2-check-line')).toMatch(/border-inline-start-width:\s*5px/);
    expect(rule('.l2-check-line.is-correct')).toMatch(/border-style:\s*solid/);
    expect(rule('.l2-check-line.is-wrong')).toMatch(/border-style:\s*dashed/);
  });

  it('announces the result in a polite atomic live region and links every field to its own line', () => {
    render(<Lesson2StepRenderer step={step('l2-s5')} />);
    const task = exercise('أميّز الكلمات');
    const field = within(task).getByLabelText('جَلَسَ');
    expect(field).not.toHaveAttribute('aria-describedby');
    expect(task.querySelector('[role="status"]')).toBeNull();

    choose(task, 'جَلَسَ', 'verb');
    choose(task, 'جُلوس', 'thing');
    choose(task, 'كُرسيّ', 'thing');
    fireEvent.click(within(task).getByRole('button', { name: 'تحقّق' }));

    const status = within(task).getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-atomic', 'true');
    expect(status).toHaveTextContent('الإجابات الصحيحة: 2 من 3');

    const describedField = within(task).getByLabelText('جَلَسَ');
    expect(describedField).toHaveAttribute('aria-describedby', 'l2p-g-classify-jalasa-feedback');
    const line = task.querySelector('#l2p-g-classify-jalasa-feedback');
    expect(line).not.toBeNull();
    expect(line).toHaveTextContent('صحيح');
    expect(task.querySelector('#l2p-g-classify-julus-feedback')).toHaveTextContent('يحتاج مراجعة');

    // a new attempt clears the stale announcement and the field association
    choose(task, 'جَلَسَ', 'thing');
    expect(within(task).queryByRole('status')).not.toBeInTheDocument();
    expect(within(task).getByLabelText('جَلَسَ')).not.toHaveAttribute('aria-describedby');
  });

  it('keeps the choice fields clearly enabled and named only by their row label', () => {
    render(<Lesson2StepRenderer step={step('l2-s5')} />);
    const field = within(exercise('أميّز الكلمات')).getByLabelText('جَلَسَ') as HTMLSelectElement;
    expect(field.tagName).toBe('SELECT');
    expect(field).not.toBeDisabled();
    expect(field.labels?.[0]?.textContent).toBe('جَلَسَ');
    // the accessible name must not absorb the option texts
    expect(field.labels?.[0]?.textContent).not.toContain('فعل');

    const block = rule('.l2-exercise-select');
    expect(block).toMatch(/min-height:\s*46px/);
    expect(block).toMatch(/cursor:\s*pointer/);
    expect(block).toMatch(/appearance:\s*none/);
    expect(block).toMatch(/var\(--line-strong\)/);
    expect(rule('.l2-exercise-select:focus-visible')).toMatch(/outline:\s*3px/);
  });

  it('applies the same treatment to l2-s6 and still reports the approved answer', () => {
    render(<Lesson2StepRenderer step={step('l2-s6')} />);
    const task = exercise('أعلّل همزة القطع');
    expect(within(task).getByRole('heading', { level: 4 })).toHaveTextContent('أعلّل همزة القطع');
    choose(task, 'السبب', 'past4');
    fireEvent.click(within(task).getByRole('button', { name: 'تحقّق' }));
    const status = within(task).getByRole('status');
    expect(status).toHaveTextContent('أحسنت');
    expect(status).not.toHaveTextContent('حاول مجددًا');
    expect(status.querySelector('.l2-check-line')).toHaveClass('is-correct');
    expect(within(status).getByText('صحيح')).toBeInTheDocument();
  });
});
