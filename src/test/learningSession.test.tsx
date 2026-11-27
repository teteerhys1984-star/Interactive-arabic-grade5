import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../App';
import { AssessmentShell } from '../components/assessment/AssessmentShell';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { getLessonById } from '../data/curriculumRegistry';
import { getLessonTestByLessonId, getUnitTestByUnitId } from '../data/assessments';
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
    // The hero CTA opens lesson 1 directly; the unit page is its own entry point.
    fireEvent.click(screen.getByRole('button', { name: /عرض دروس الوحدة الأولى/ }));
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
    expect(container.querySelector('.unit-page-resume-note')).toHaveTextContent('آخر موضع وصلت إليه: الخطوة ٤ من ٨');
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

describe('PR1 — assessment draft guard on app navigation', () => {
  it('confirms before leaving a test whose answers failed to save, and never traps the learner', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /عرض دروس الوحدة الأولى/ }));
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ اختبار الوحدة' }));

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    fireEvent.click(screen.getAllByRole('radio')[0]);
    expect(screen.getByRole('alert')).toHaveTextContent('تعذّر حفظ مسودّة إجاباتك');

    // Leaving via the always-visible header is intercepted with an explicit confirmation.
    fireEvent.click(screen.getByRole('button', { name: /اللغة العربية التفاعلية/ }));
    expect(screen.getByRole('alertdialog')).toHaveTextContent('إجابات لم تُحفظ');
    expect(screen.getByRole('button', { name: /اعتماد وإرسال الإجابات/ })).toBeInTheDocument();

    // Staying keeps the learner on the test with the answers intact.
    fireEvent.click(screen.getByRole('button', { name: 'البقاء في الاختبار' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect((screen.getAllByRole('radio')[0] as HTMLInputElement).checked).toBe(true);

    // Leaving without a successful save requires a second explicit confirmation,
    // and the failed final save must not move the learner anywhere yet.
    fireEvent.click(screen.getByRole('button', { name: /اللغة العربية التفاعلية/ }));
    fireEvent.click(screen.getByRole('button', { name: 'المغادرة دون حفظ' }));
    expect(screen.getByRole('alertdialog')).toHaveTextContent('لم تنجح محاولة الحفظ الأخيرة');
    expect(screen.getByRole('button', { name: /اعتماد وإرسال الإجابات/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'المغادرة على أي حال' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'ابدأ من أول درس' })).toBeInTheDocument();

    // Once the assessment is gone the guard is unregistered: navigation is free again.
    fireEvent.click(screen.getByRole('button', { name: /اللغة العربية التفاعلية/ }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'ابدأ من أول درس' })).toBeInTheDocument();

    setItemSpy.mockRestore();
  });

  it('leaves directly once the final save attempt succeeds', () => {
    const unitTest = getUnitTestByUnitId('unit1')!;
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /عرض دروس الوحدة الأولى/ }));
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ اختبار الوحدة' }));

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    fireEvent.click(screen.getAllByRole('radio')[0]);
    setItemSpy.mockRestore(); // storage recovers before the learner leaves

    fireEvent.click(screen.getByRole('button', { name: /اللغة العربية التفاعلية/ }));
    // Both the shell warning and the dialog offer a retry; target the dialog's.
    fireEvent.click(
      within(screen.getByRole('alertdialog')).getByRole('button', { name: 'إعادة محاولة الحفظ' }),
    );
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'ابدأ من أول درس' })).toBeInTheDocument();
    expect(window.sessionStorage.getItem(draftKey('assessment-answers', unitTest.id))).toBeTruthy();
  });
});

describe('PR1 — assessment draft guard across every leaving path', () => {
  it('intercepts leaving through any header link, then frees navigation after the learner leaves', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /عرض دروس الوحدة الأولى/ }));
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ اختبار الوحدة' }));

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    fireEvent.click(screen.getAllByRole('radio')[0]);

    // A header link other than the brand button is intercepted too.
    fireEvent.click(screen.getByRole('button', { name: 'الوحدات والدروس' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'البقاء في الاختبار' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect((screen.getAllByRole('radio')[0] as HTMLInputElement).checked).toBe(true);

    // Confirmed loss through this path reaches the home page…
    fireEvent.click(screen.getByRole('button', { name: 'الوحدات والدروس' }));
    fireEvent.click(screen.getByRole('button', { name: 'المغادرة دون حفظ' }));
    fireEvent.click(screen.getByRole('button', { name: 'المغادرة على أي حال' }));
    expect(screen.queryByRole('button', { name: /اعتماد وإرسال الإجابات/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'ابدأ من أول درس' })).toBeInTheDocument();

    // …and the guard no longer intercepts anything once the assessment unmounts.
    fireEvent.click(screen.getByRole('button', { name: /اللغة العربية التفاعلية/ }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'ابدأ من أول درس' })).toBeInTheDocument();

    setItemSpy.mockRestore();
  });

  it('keeps the supported return path working after a normal submit', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /عرض دروس الوحدة الأولى/ }));
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ اختبار الوحدة' }));

    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: /اعتماد وإرسال الإجابات/ }));
    expect(screen.getByRole('region', { name: 'نتائج الاختبار' })).toBeInTheDocument();

    // The supported return button works and is not intercepted: once the attempt
    // is submitted there are no unsaved answers left to protect.
    fireEvent.click(screen.getByRole('button', { name: 'العودة للدرس' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    // The return lands on the unit page (not the home page).
    expect(screen.getByRole('button', { name: 'ابدأ اختبار الوحدة' })).toBeInTheDocument();
  });
});
