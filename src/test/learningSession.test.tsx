import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from '../App';
import { AssessmentShell } from '../components/assessment/AssessmentShell';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { getLessonById } from '../data/curriculumRegistry';
import { getLessonTestByLessonId } from '../data/assessments';
import { clearLearningLocation, readLearningLocation, writeLearningLocation } from '../utils/learningProgress';
import { draftKey } from '../utils/draftStorage';

afterEach(cleanup);
beforeEach(() => window.sessionStorage.clear());

describe('session-only learning location', () => {
  it('stores a valid location in sessionStorage and safely ignores malformed data', () => {
    expect(writeLearningLocation({ unitId: 'unit1', lessonId: 'lesson1', stepId: 'l1-s4' })).toBe(true);
    expect(readLearningLocation()).toEqual({ unitId: 'unit1', lessonId: 'lesson1', stepId: 'l1-s4' });

    window.sessionStorage.setItem('arabic-grade5-learning-location-v1', '{broken');
    expect(readLearningLocation()).toBeNull();

    clearLearningLocation();
    expect(readLearningLocation()).toBeNull();
  });

  it('restores the same lesson step after unmounting without presenting a completion percentage', () => {
    const { lesson, unit } = getLessonById('unit2-lesson2')!;
    const firstRender = render(<LessonFlow lesson={lesson} unit={unit} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 4:/ }));
    expect(readLearningLocation()).toEqual({ unitId: 'unit2', lessonId: 'unit2-lesson2', stepId: 'u2l2-s4' });
    expect(screen.queryByRole('progressbar')).toBeNull();
    firstRender.unmount();

    const resumedRender = render(<LessonFlow lesson={lesson} unit={unit} />);
    expect(screen.getByRole('button', { name: /^الخطوة 4:/ })).toHaveAttribute('aria-current', 'step');
    expect(resumedRender.container.querySelector('.lesson-step-position')).toHaveTextContent('الخطوة 4 من 11');
  });

  it('starts without a Continue action when the session has no valid saved location', () => {
    render(<App />);
    expect(screen.queryByRole('button', { name: 'متابعة التعلّم' })).toBeNull();
    expect(screen.getByRole('button', { name: 'ابدأ من أول درس' })).toBeInTheDocument();
  });

  it('returns from a lesson to its unit, then resumes the saved step and activity draft', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ من أول درس' }));
    expect(screen.getByRole('heading', { level: 1, name: /الوحدة الأولى/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ابدأ الدرس 1:/ }));
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 4:/ }));
    const answer = container.querySelector('.l1-activity input') as HTMLInputElement;
    expect(answer).toBeTruthy();
    fireEvent.change(answer, { target: { value: 'إجابة محفوظة للجلسة' } });

    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 3:/ }));
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 4:/ }));
    expect(container.querySelector('.l1-activity input')).toHaveValue('إجابة محفوظة للجلسة');

    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى صفحة الوحدة' }));
    expect(container.querySelector('.unit-page-resume-note')).toHaveTextContent('آخر موضع وصلت إليه: الخطوة 4 من 10');
    fireEvent.click(screen.getByRole('button', { name: /تابع الدرس 1:/ }));
    expect(screen.getByRole('button', { name: /^الخطوة 4:/ })).toHaveAttribute('aria-current', 'step');
    expect(container.querySelector('.l1-activity input')).toHaveValue('إجابة محفوظة للجلسة');

    fireEvent.click(screen.getByRole('button', { name: 'الرئيسية' }));
    expect(screen.getByRole('button', { name: 'متابعة التعلّم' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'متابعة التعلّم' }));
    expect(screen.getByRole('button', { name: /^الخطوة 4:/ })).toHaveAttribute('aria-current', 'step');
  });

  it('restores temporary assessment answers as an unsubmitted attempt, not as a result', () => {
    const test = getLessonTestByLessonId('lesson1')!;
    const firstRender = render(<AssessmentShell test={test} />);
    const firstRadio = screen.getAllByRole('radio')[0] as HTMLInputElement;
    fireEvent.click(firstRadio);
    expect(window.sessionStorage.getItem(draftKey('assessment-answers', test.id))).toBeTruthy();
    firstRender.unmount();

    render(<AssessmentShell test={test} />);
    expect((screen.getAllByRole('radio')[0] as HTMLInputElement).checked).toBe(true);
    expect(screen.queryByRole('region', { name: 'نتائج الاختبار' })).toBeNull();
    expect(screen.getByRole('button', { name: /اعتماد وإرسال الإجابات/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /اعتماد وإرسال الإجابات/ }));
    expect(screen.getByRole('region', { name: 'نتائج الاختبار' })).toBeInTheDocument();
    expect(window.sessionStorage.getItem(draftKey('assessment-answers', test.id))).toBeNull();
    cleanup();
    render(<AssessmentShell test={test} />);
    expect(screen.queryByRole('region', { name: 'نتائج الاختبار' })).toBeNull();
    expect((screen.getAllByRole('radio')[0] as HTMLInputElement).checked).toBe(false);
  });

  it('does not crash or restore an unknown step identifier', () => {
    writeLearningLocation({ unitId: 'unit1', lessonId: 'lesson1', stepId: 'removed-step' });
    const { lesson, unit } = getLessonById('lesson1')!;
    render(<LessonFlow lesson={lesson} unit={unit} />);
    expect(screen.getByRole('button', { name: /^الخطوة 1:/ })).toHaveAttribute('aria-current', 'step');
  });
});
