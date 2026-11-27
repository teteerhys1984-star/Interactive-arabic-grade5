import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { AssessmentShell } from '../components/assessment/AssessmentShell';
import { getLessonTestByLessonId } from '../data/assessments';
import { draftKey } from '../utils/draftStorage';

/**
 * PR1 — assessment draft save-failure behaviour.
 *
 * These tests pin the approved guarantees:
 * - a failed write is reported honestly and never as success;
 * - answers stay in page memory and the test remains submittable;
 * - the warning clears only after a real successful write;
 * - leaving is warned about (beforeunload, best-effort) without trapping.
 *
 * The shell is rendered standalone here (no app-shell provider) on purpose:
 * guard registration must no-op safely outside App.tsx.
 */
afterEach(cleanup);
beforeEach(() => window.sessionStorage.clear());

const test = getLessonTestByLessonId('lesson1')!;
const draftStorageKey = draftKey('assessment-answers', test.id);

/** Simulates a storage backend that refuses every write (quota / private mode). */
function failAllWrites() {
  return vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota exceeded');
  });
}

const radioOf = (index: number) => screen.getAllByRole('radio')[index] as HTMLInputElement;
const retryButton = () => screen.getByRole('button', { name: 'إعادة محاولة الحفظ' });
const submitButton = () => screen.getByRole('button', { name: /اعتماد وإرسال الإجابات/ });

describe('PR1 — assessment draft save failure', () => {
  it('warns honestly and keeps answers in memory when the draft write fails', () => {
    const spy = failAllWrites();
    render(<AssessmentShell test={test} />);

    fireEvent.click(radioOf(0));

    // The warning states the draft was NOT saved — no success is claimed.
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('تعذّر حفظ مسودّة إجاباتك في هذه الجلسة');
    expect(alert).toHaveTextContent('إجاباتك لم تُحفظ');
    // Answers remain in page memory and the test stays fully usable.
    expect(radioOf(0).checked).toBe(true);
    expect(submitButton()).toBeEnabled();
    // Nothing was persisted, and no element claims otherwise.
    expect(window.sessionStorage.getItem(draftStorageKey)).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();

    spy.mockRestore();
  });

  it('keeps the warning until a write actually succeeds, then persists the draft', () => {
    const spy = failAllWrites();
    render(<AssessmentShell test={test} />);

    fireEvent.click(radioOf(0));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Retry while storage still fails: the warning stays, the retry is reported as failed.
    fireEvent.click(retryButton());
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('لم تنجح إعادة المحاولة الأخيرة');
    expect(window.sessionStorage.getItem(draftStorageKey)).toBeNull();

    // A later answer change retries implicitly; still failing → the warning stays.
    fireEvent.click(radioOf(4)); // first choice of the second single-choice question
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(window.sessionStorage.getItem(draftStorageKey)).toBeNull();

    // Storage recovers: the next retry writes for real and the warning clears.
    spy.mockRestore();
    fireEvent.click(retryButton());
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByRole('button', { name: 'إعادة محاولة الحفظ' })).toBeNull();
    const stored = window.sessionStorage.getItem(draftStorageKey);
    expect(stored).toBeTruthy();
    expect(Object.keys(JSON.parse(stored as string)).length).toBe(2);
  });

  it('submits and evaluates from in-memory answers when nothing ever persisted', () => {
    const spy = failAllWrites();
    render(<AssessmentShell test={test} />);

    const firstQuestion = test.questions[0];
    if (firstQuestion.type !== 'single_choice') throw new Error('expected a single-choice first question');
    const correctIndex = firstQuestion.choices.findIndex((choice) => choice.id === firstQuestion.correctChoiceId);
    fireEvent.click(radioOf(correctIndex));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.click(submitButton());

    // Evaluation comes from memory against the original denominator — unchanged.
    const results = screen.getByRole('region', { name: 'نتائج الاختبار' });
    const percentageCard = within(results).getByText('النسبة المئوية').closest('.metric-card')!;
    expect(percentageCard.querySelector('.metric-value')).toHaveTextContent('5%');
    const scoreCard = within(results).getByText('الدرجة').closest('.metric-card')!;
    expect(scoreCard.querySelector('.metric-value')).toHaveTextContent(`1 / ${test.questions.length}`);
    // No save-failure warning is shown for a completed attempt, and nothing was stored.
    expect(screen.queryByRole('alert')).toBeNull();
    expect(window.sessionStorage.getItem(draftStorageKey)).toBeNull();

    spy.mockRestore();
  });

  it('warns before browser close/reload only while answers are unsaved', () => {
    const spy = failAllWrites();
    render(<AssessmentShell test={test} />);

    const dispatchBeforeUnload = () => {
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      return event;
    };

    // No unsaved answers yet: no close/reload warning is registered.
    expect(dispatchBeforeUnload().defaultPrevented).toBe(false);

    fireEvent.click(radioOf(0));
    expect(dispatchBeforeUnload().defaultPrevented).toBe(true);

    // A successful save removes the close/reload warning again.
    spy.mockRestore();
    fireEvent.click(retryButton());
    expect(dispatchBeforeUnload().defaultPrevented).toBe(false);
  });

  it('does not warn or block leaving when every save succeeds', () => {
    render(<AssessmentShell test={test} />);

    fireEvent.click(radioOf(0));
    fireEvent.click(radioOf(4));

    expect(screen.queryByRole('alert')).toBeNull();
    expect(window.sessionStorage.getItem(draftStorageKey)).toBeTruthy();
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('offers no restart control during the attempt, so unsaved answers cannot be wiped', () => {
    const spy = failAllWrites();
    render(<AssessmentShell test={test} />);

    fireEvent.click(radioOf(0));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    // Restart exists only after submit; during the attempt — even with a failed
    // save — no control can discard the in-memory answers.
    expect(screen.queryByRole('button', { name: /إعادة المحاولة باختبار جديد/ })).toBeNull();
    expect(radioOf(0).checked).toBe(true);
    expect(submitButton()).toBeEnabled();

    spy.mockRestore();
  });

  it('after a submit with failed saves, restart still yields a genuinely fresh attempt', () => {
    const spy = failAllWrites();
    render(<AssessmentShell test={test} />);

    const firstQuestion = test.questions[0];
    if (firstQuestion.type !== 'single_choice') throw new Error('expected a single-choice first question');
    const correctIndex = firstQuestion.choices.findIndex((choice) => choice.id === firstQuestion.correctChoiceId);
    fireEvent.click(radioOf(correctIndex));
    fireEvent.click(submitButton());
    const results = screen.getByRole('region', { name: 'نتائج الاختبار' });
    const percentageCard = within(results).getByText('النسبة المئوية').closest('.metric-card')!;
    expect(percentageCard.querySelector('.metric-value')).toHaveTextContent('5%');
    expect(window.sessionStorage.getItem(draftStorageKey)).toBeNull();

    // Restart intentionally starts over: the submitted attempt is not restored
    // as a draft, and no unsaved answer is lost by the act of restarting.
    fireEvent.click(screen.getByRole('button', { name: /إعادة المحاولة باختبار جديد/ }));
    expect(screen.queryByRole('region', { name: 'نتائج الاختبار' })).toBeNull();
    expect(radioOf(0).checked).toBe(false);
    expect(screen.queryByRole('alert')).toBeNull();

    spy.mockRestore();
  });
});
