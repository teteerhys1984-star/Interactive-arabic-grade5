import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { App } from '../App';
import { Lesson3StepRenderer } from '../components/curriculum/Lesson3StepRenderer';
import { LESSON3_STEPS } from '../data/lesson3/content';
import { getLesson3Activity } from '../data/lesson3/activities';
import { LESSON3_TEST } from '../data/lesson3/lessonTest';
import { UNIT1_TEST } from '../data/unit1/unitTest';
import { AssessmentShell } from '../components/assessment/AssessmentShell';
import { TestSolutions } from '../components/assessment/TestSolutions';
import { fromKeyedLesson, resolveAnswerReveal } from '../components/common/answerDisclosure';
import { readDraft } from '../utils/draftStorage';
import {
  areRiddleFieldsComplete,
  canRevealRiddleForStudent,
  clearRiddleAttemptConfirmation,
  confirmRiddleAttempt,
} from '../utils/riddleGuard';

const riddleStep = LESSON3_STEPS.find((s) => s.id === 'l3-s9')!;
const riddleActivity = getLesson3Activity('l3-a-49')!;

describe('PR2 — Riddle & Assessment Guard (l3-a-49, l3-t-20, u1-t-50)', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    clearRiddleAttemptConfirmation();
  });

  it('blocks resolveAnswerReveal in student scope for l3-a-49 / L3-35-01 before confirmation, while keeping teacher scope separate', () => {
    const record = fromKeyedLesson(riddleActivity);
    expect(resolveAnswerReveal(record, 'student')).toBeNull();

    const teacherView = resolveAnswerReveal(record, 'teacher');
    expect(teacherView).not.toBeNull();
    expect(teacherView?.kind).toBe('teacher_solution');
    expect(teacherView?.modelAnswer).toContain('الجملة الفعلية');
  });

  it('requires all 4 fields (b1..b4) AND explicit "أنهيت المحاولة" press; never auto-reveals on fill, navigation, or reload', () => {
    const firstRender = render(<Lesson3StepRenderer step={riddleStep} />);
    const riddleSection = screen.getByRole('region', { name: 'نشاط المصدر L3-35-01' });

    // Initially guarded: no reveal button inside L3-35-01, confirm button disabled
    expect(within(riddleSection).queryByRole('button', { name: /أظهر الجواب|إرشادات للإجابة/ })).not.toBeInTheDocument();
    const confirmBtn = within(riddleSection).getByRole('button', { name: 'أنهيت المحاولة' });
    expect(confirmBtn).toBeDisabled();

    // Fill only 3 fields -> still disabled
    fireEvent.change(within(riddleSection).getByLabelText('مقصود البيت الأول'), { target: { value: 'تبدأ بفعل' } });
    fireEvent.change(within(riddleSection).getByLabelText('مقصود البيت الثاني'), { target: { value: 'الفاعل' } });
    fireEvent.change(within(riddleSection).getByLabelText('مقصود البيت الثالث'), { target: { value: 'المفعول به' } });
    expect(confirmBtn).toBeDisabled();

    // Fill 4th field -> confirm button enabled, but solution STILL NOT revealed automatically
    fireEvent.change(within(riddleSection).getByLabelText('مقصود البيت الرابع'), { target: { value: 'الجملة الفعلية' } });
    expect(confirmBtn).toBeEnabled();
    expect(canRevealRiddleForStudent()).toBe(false);
    expect(within(riddleSection).queryByRole('button', { name: /أظهر الجواب|إرشادات للإجابة/ })).not.toBeInTheDocument();

    // Save draft and simulate navigation away / reload (unmount + remount)
    fireEvent.click(within(riddleSection).getByRole('button', { name: 'حفظ مسودة إجابتي' }));
    firstRender.unmount();

    render(<Lesson3StepRenderer step={riddleStep} />);
    const remountedRiddleSection = screen.getByRole('region', { name: 'نشاط المصدر L3-35-01' });
    // Draft is preserved, but solution is STILL not auto-revealed
    expect((within(remountedRiddleSection).getByLabelText('مقصود البيت الأول') as HTMLTextAreaElement).value).toBe('تبدأ بفعل');
    expect((within(remountedRiddleSection).getByLabelText('مقصود البيت الرابع') as HTMLTextAreaElement).value).toBe('الجملة الفعلية');
    expect(canRevealRiddleForStudent()).toBe(false);
    expect(within(remountedRiddleSection).queryByRole('button', { name: /أظهر الجواب|إرشادات للإجابة/ })).not.toBeInTheDocument();

    // Explicit press of "أنهيت المحاولة" unlocks the reveal button and preserves draft under L3-35-01
    fireEvent.click(within(remountedRiddleSection).getByRole('button', { name: 'أنهيت المحاولة' }));
    expect(canRevealRiddleForStudent()).toBe(true);
    expect(readDraft('lesson3', 'L3-35-01')).toEqual({
      b1: 'تبدأ بفعل',
      b2: 'الفاعل',
      b3: 'المفعول به',
      b4: 'الجملة الفعلية',
    });
    expect(readDraft('lesson3', 'l3-a-49')).toEqual({});
    expect(within(remountedRiddleSection).getByRole('button', { name: /أظهر الجواب/ })).toBeInTheDocument();
  });

  it('guards l3-t-20 in Lesson 3 test while keeping all other 19 questions usable and preserving denominator 20', () => {
    render(<AssessmentShell test={LESSON3_TEST} />);

    expect(screen.getByTestId('guarded-question-l3-t-20')).toBeInTheDocument();
    expect(screen.queryByText('أحجية «ألعب وأتعلم» في الدرس تصف:')).not.toBeInTheDocument();

    // Other questions remain usable and denominator is still 20
    expect(screen.getByText(/من أصل/)).toHaveTextContent('20');
    fireEvent.click(screen.getByRole('button', { name: /اعتماد وإرسال الإجابات/ }));
    expect(screen.getByTestId('guarded-question-l3-t-20')).toBeInTheDocument();
  });

  it('guards u1-t-50 in Unit 1 test while keeping all other 49 questions usable and preserving denominator 50', () => {
    render(<AssessmentShell test={UNIT1_TEST} />);

    expect(screen.getByTestId('guarded-question-u1-t-50')).toBeInTheDocument();
    expect(screen.queryByText(/وسبعةٌ حروفُهُ/)).not.toBeInTheDocument();

    // Denominator is still 50
    expect(screen.getByText(/من أصل/)).toHaveTextContent('50');
  });

  it('unlocks l3-t-20 and u1-t-50 after riddle attempt is confirmed', () => {
    expect(
      confirmRiddleAttempt({
        b1: '١',
        b2: '٢',
        b3: '٣',
        b4: '٤',
      }),
    ).toBe(true);

    const { unmount } = render(<AssessmentShell test={LESSON3_TEST} />);
    expect(screen.queryByTestId('guarded-question-l3-t-20')).not.toBeInTheDocument();
    expect(screen.getByText('أحجية «ألعب وأتعلم» في الدرس تصف:')).toBeInTheDocument();
    unmount();

    render(<AssessmentShell test={UNIT1_TEST} />);
    expect(screen.queryByTestId('guarded-question-u1-t-50')).not.toBeInTheDocument();
    expect(screen.getByText(/وسبعةٌ حروفُهُ/)).toBeInTheDocument();
  });

  it('guards TestSolutions in student scope while keeping teacher scope intact', () => {
    const { unmount } = render(<TestSolutions test={LESSON3_TEST} scope="student" />);
    expect(screen.getByTestId('guarded-solution-l3-t-20')).toBeInTheDocument();
    expect(screen.queryByText('أحجية «ألعب وأتعلم» في الدرس تصف:')).not.toBeInTheDocument();
    unmount();

    render(<TestSolutions test={LESSON3_TEST} scope="teacher" />);
    expect(screen.queryByTestId('guarded-solution-l3-t-20')).not.toBeInTheDocument();
    expect(screen.getByText('أحجية «ألعب وأتعلم» في الدرس تصف:')).toBeInTheDocument();
  });

  it('rejects whitespace-only fields in areRiddleFieldsComplete', () => {
    expect(areRiddleFieldsComplete({ b1: '  ', b2: 'أ', b3: 'ب', b4: 'ج' })).toBe(false);
    expect(confirmRiddleAttempt({ b1: '  ', b2: 'أ', b3: 'ب', b4: 'ج' })).toBe(false);
    expect(canRevealRiddleForStudent()).toBe(false);
  });

  it('integration: App TestSolutions route guards l3-t-20 and u1-t-50 before confirmation and reveals them after confirmation', () => {
    const { unmount } = render(<App />);

    // Open «حلول الاختبارات» from the app header and unlock the solutions gate
    fireEvent.click(screen.getByRole('button', { name: 'حلول الاختبارات' }));
    fireEvent.change(screen.getByLabelText('كلمة مرور الحلول'), { target: { value: 'st12' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول منطقة الحلول' }));

    // Open Lesson 3 test solutions
    fireEvent.click(screen.getByRole('button', { name: /اختبار الدرس الثالث: لغتي/i }));
    expect(screen.getByTestId('guarded-solution-l3-t-20')).toBeInTheDocument();
    expect(screen.queryByText('أحجية «ألعب وأتعلم» في الدرس تصف:')).not.toBeInTheDocument();
    // Other questions in Lesson 3 test solutions remain visible
    expect(screen.getAllByText(/الإجابَةُ الصَّحيحَةُ/).length).toBe(19);

    // Go back to solutions index and open Unit 1 test solutions
    fireEvent.click(screen.getByRole('button', { name: /العودة/ }));
    fireEvent.click(screen.getByRole('button', { name: /اختبار الوحدة الأولى: أحلامي وطموحاتي/i }));
    expect(screen.getByTestId('guarded-solution-u1-t-50')).toBeInTheDocument();
    expect(screen.queryByText(/وسبعةٌ حروفُهُ/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/الإجابَةُ الصَّحيحَةُ/).length).toBe(49);
    unmount();

    // Confirm riddle attempt, then re-open App TestSolutions route
    expect(confirmRiddleAttempt({ b1: '١', b2: '٢', b3: '٣', b4: '٤' })).toBe(true);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'حلول الاختبارات' }));
    fireEvent.click(screen.getByRole('button', { name: /اختبار الدرس الثالث: لغتي/i }));
    expect(screen.queryByTestId('guarded-solution-l3-t-20')).not.toBeInTheDocument();
    expect(screen.getByText('أحجية «ألعب وأتعلم» في الدرس تصف:')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /العودة/ }));
    fireEvent.click(screen.getByRole('button', { name: /اختبار الوحدة الأولى: أحلامي وطموحاتي/i }));
    expect(screen.queryByTestId('guarded-solution-u1-t-50')).not.toBeInTheDocument();
    expect(screen.getByText(/وسبعةٌ حروفُهُ/)).toBeInTheDocument();
  });
});
