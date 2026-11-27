import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from '../App';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import {
  getStudentSteps,
  isStudentBlockVisible,
  resolveStudentStepIndex,
} from '../components/curriculum/studentVisibility';
import { getLessonById } from '../data/curriculumRegistry';
import { LESSON3_STEP_CONTENT } from '../data/lesson3/content';
import { readLearningLocation, writeLearningLocation } from '../utils/learningProgress';

/**
 * PR 3 — student view of Lesson 3 hides listening («أستمع») and oral-communication («أتواصل شفهياً»)
 * material. Policy: docs/redesign/learning-experience-phase-1-diagnosis-and-concept.md §٦ و§١١ و§١٣.١.
 * These tests check the student surface and the unchanged data/teacher layer.
 */

afterEach(cleanup);
beforeEach(() => window.sessionStorage.clear());

const HIDDEN_STEP = 'l3-s4';
const HIDDEN_ACTIVITY_SOURCE_IDS = ['L3-25-01', 'L3-25-05', 'L3-25-06', 'L3-28-01', 'L3-28-02', 'L3-29-05', 'L3-32-03'];
const FORBIDDEN_STUDENT_PHRASES = [
  'أتواصل شفهياً',
  'أستمع إلى النص',
  'أتأمل الصور وأستمع',
  'أستكشف الصور وأستمع',
  'تنبيه المصدر: الاستماع',
];

const lesson3 = () => getLessonById('lesson3')!.lesson;

/** Clicks every visible step and returns the whole rendered HTML seen along the way. */
function visitEveryVisibleStep(container: HTMLElement): string {
  const stepButtons = screen.getAllByRole('button', { name: /^الخطوة \d+:/ });
  let seen = '';
  stepButtons.forEach((_, index) => {
    fireEvent.click(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })[index]);
    seen += container.innerHTML;
  });
  return seen;
}

describe('PR 3 — data and student step list', () => {
  it('keeps the full Lesson 3 data untouched (9 steps, hidden activities still registered)', () => {
    expect(lesson3().steps.map((step) => step.id)).toContain(HIDDEN_STEP);
    expect(lesson3().steps).toHaveLength(9);
    const hiddenStepBlocks = LESSON3_STEP_CONTENT[HIDDEN_STEP].blocks;
    expect(hiddenStepBlocks).toContainEqual({ kind: 'activity', activityId: 'l3-a-19' });
    expect(hiddenStepBlocks).toContainEqual({ kind: 'activity', activityId: 'l3-a-20' });
  });

  it('removes l3-s4 from the student list and applies only the approved truncations', () => {
    const visible = getStudentSteps(lesson3());
    expect(visible.map((step) => step.id)).toEqual(
      lesson3().steps.map((step) => step.id).filter((id) => id !== HIDDEN_STEP),
    );
    expect(visible).toHaveLength(8);

    const first = visible[0];
    expect(first.title).toBe('أستكشف الصور');
    expect(first.source && 'sectionName' in first.source ? first.source.sectionName : undefined).toBe('أتأمل الصور');

    // The registry itself is not mutated by the student view.
    expect(lesson3().steps[0].title).toBe('أستكشف الصور وأستمع');
  });

  it('resolves a stored hidden step to the next visible step, otherwise the previous one', () => {
    expect(resolveStudentStepIndex(lesson3(), HIDDEN_STEP)).toBe(3); // l3-s5 is visible index 3
    expect(resolveStudentStepIndex(lesson3(), 'l3-s3')).toBe(2);
    expect(resolveStudentStepIndex(lesson3(), 'no-such-step')).toBe(-1);
  });

  it('filters blocks by explicit identifiers, not by block kind', () => {
    const blocksOf = (stepId: string) =>
      LESSON3_STEP_CONTENT[stepId].blocks.filter((block) => isStudentBlockVisible('lesson3', stepId, block));

    const step1 = blocksOf('l3-s1');
    const step1Activities = step1.flatMap((block) => (block.kind === 'activity' ? [block.activityId] : []));
    expect(step1Activities).toEqual(['l3-a-02', 'l3-a-03', 'l3-a-04']);
    expect(step1.some((block) => block.kind === 'source_info' && block.heading === 'تنبيه المصدر: الاستماع')).toBe(false);

    // Reading-aloud and recitation are not oral-communication sections and stay visible.
    const step2Activities = blocksOf('l3-s2').flatMap((block) => (block.kind === 'activity' ? [block.activityId] : []));
    expect(step2Activities).toEqual(['l3-a-07', 'l3-a-08', 'l3-a-09']);
    const step3Activities = blocksOf('l3-s3').flatMap((block) => (block.kind === 'activity' ? [block.activityId] : []));
    expect(step3Activities).toContain('l3-a-11');

    // Only the identified grammar and dictation activities are hidden in their steps.
    expect(isStudentBlockVisible('lesson3', 'l3-s5', { kind: 'activity', activityId: 'l3-a-29' })).toBe(false);
    expect(isStudentBlockVisible('lesson3', 'l3-s5', { kind: 'activity', activityId: 'l3-a-30' })).toBe(true);
    expect(isStudentBlockVisible('lesson3', 'l3-s6', { kind: 'activity', activityId: 'l3-a-41' })).toBe(false);
    expect(isStudentBlockVisible('lesson3', 'l3-s6', { kind: 'activity', activityId: 'l3-a-38' })).toBe(true);

    // The listening source note is hidden only inside its own step.
    expect(isStudentBlockVisible('lesson3', 'l3-s2', { kind: 'source_info', heading: 'تنبيه المصدر: الاستماع' })).toBe(true);
  });
});

describe('PR 3 — rendered student surface', () => {
  it('shows no listening or oral wording and no hidden activity on any visible step', () => {
    const { container } = render(<LessonFlow lesson={lesson3()} />);
    const seen = visitEveryVisibleStep(container);

    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })).toHaveLength(8);
    for (const phrase of FORBIDDEN_STUDENT_PHRASES) {
      expect(seen.includes(phrase), `phrase still visible: ${phrase}`).toBe(false);
    }
    for (const sourceId of HIDDEN_ACTIVITY_SOURCE_IDS) {
      expect(seen.includes(sourceId), `hidden activity still rendered: ${sourceId}`).toBe(false);
    }
  });

  it('keeps reading-aloud and recitation activities visible', () => {
    const { container } = render(<LessonFlow lesson={lesson3()} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 2:/ }));
    expect(container.querySelector('[aria-label="نشاط المصدر L3-26-01"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 3:/ }));
    expect(container.querySelector('[aria-label="نشاط المصدر L3-27-02"]')).not.toBeNull();
  });

  it('skips the hidden step with the next button and reports the visible position', () => {
    const { container } = render(<LessonFlow lesson={lesson3()} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 3:/ }));
    fireEvent.click(screen.getByRole('button', { name: 'الانتقال إلى الخطوة 4' }));
    expect(screen.getByRole('heading', { level: 2, name: 'قواعد اللغة: أركان الجملة الفعلية' })).toBeInTheDocument();
    // Visible numbering counts only the student-visible steps (4 of 8); digits may render Latin or Arabic.
    expect(container.querySelector('.lesson-step-position')?.textContent).toMatch(/[٤4].*[٨8]/);
  });

  it('shows the hidden step as absent in the step list, with the visible title for step 1', () => {
    render(<LessonFlow lesson={lesson3()} />);
    expect(screen.queryByRole('button', { name: /أتواصل شفهياً/ })).toBeNull();
    expect(screen.getByRole('button', { name: /^الخطوة 1: أستكشف الصور/ })).toBeInTheDocument();
  });
});

describe('PR 3 — resume and storage', () => {
  it('opens a stored hidden position at the next visible step and does not overwrite storage', () => {
    writeLearningLocation({ unitId: 'unit1', lessonId: 'lesson3', stepId: HIDDEN_STEP });
    render(<LessonFlow lesson={lesson3()} />);

    expect(screen.getByRole('button', { name: /^الخطوة 4:/ })).toHaveAttribute('aria-current', 'step');
    expect(readLearningLocation()).toEqual({ unitId: 'unit1', lessonId: 'lesson3', stepId: HIDDEN_STEP });
  });

  it('saves the position only after the student selects a visible step', () => {
    writeLearningLocation({ unitId: 'unit1', lessonId: 'lesson3', stepId: HIDDEN_STEP });
    render(<LessonFlow lesson={lesson3()} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 3:/ }));
    expect(readLearningLocation()?.stepId).toBe('l3-s3');
  });

  it('home resume card and unit page count only visible steps', () => {
    writeLearningLocation({ unitId: 'unit1', lessonId: 'lesson3', stepId: HIDDEN_STEP });
    const { container } = render(<App />);

    const resume = container.querySelector('.home-resume');
    expect(resume).not.toBeNull();
    expect(resume!.textContent).toMatch(/٤/);
    expect(resume!.textContent).toMatch(/٨/);
    expect(resume!.textContent).not.toMatch(/٩/);

    fireEvent.click(screen.getByRole('button', { name: /عرض دروس الوحدة الأولى/ }));
    const row = screen.getByRole('button', { name: /تابع الدرس 3: لُغَتي/ }).closest('li');
    expect(row).not.toBeNull();
    expect(row!.textContent).toMatch(/٨\s*خطوات/);
    expect(row!.textContent).toMatch(/الخطوة\s*٤\s*من\s*٨/);
  });
});
