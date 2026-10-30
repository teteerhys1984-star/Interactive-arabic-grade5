import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../App';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { getLessonById } from '../data/curriculumRegistry';
import { LESSON1_TEST } from '../data/lesson1/lessonTest';
import { LESSON2_TEST } from '../data/lesson2/lessonTest';
import { LESSON3_TEST } from '../data/lesson3/lessonTest';
import { UNIT1_TEST } from '../data/unit1/unitTest';
import { LESSON3_ACTIVITIES } from '../data/lesson3/activities';
import {
  auditCrossTestDuplication,
  normalizedCorrectAnswer,
} from '../utils/testDuplicationAudit';
import { clearDraft, draftKey, readDraft, writeDraft } from '../utils/draftStorage';
import { evaluateAssessmentAttempt } from '../utils/testEvaluator';
import { AssessmentTest } from '../types/curriculum';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.sessionStorage.clear();
});

const unitQuestion = (id: string) => UNIT1_TEST.questions.find((question) => question.id === id)!;

const scoreOne = (test: AssessmentTest, questionId: string, answer: unknown) => {
  const targeted = { ...test, questions: test.questions.filter((question) => question.id === questionId) };
  return evaluateAssessmentAttempt(targeted, { [questionId]: answer } as never).score;
};

describe('Audit fix 1a — u1-t-33 must not accept a word absent from the sentence', () => {
  it('accepts only the masdar actually present in the sentence', () => {
    const question = unitQuestion('u1-t-33');
    expect(question.type === 'fill_blank' && question.acceptedAnswers).not.toContain('اشتراك');
    expect(question.type === 'fill_blank' && question.acceptedAnswers).not.toContain('الاشتراك');
    expect(scoreOne(UNIT1_TEST, 'u1-t-33', 'الإذاعة')).toBe(1);
    expect(scoreOne(UNIT1_TEST, 'u1-t-33', 'إذاعة')).toBe(1);
  });

  it('rejects the literal-extraction of a word that is not in the sentence', () => {
    expect(scoreOne(UNIT1_TEST, 'u1-t-33', 'اشتراك')).toBe(0);
    expect(scoreOne(UNIT1_TEST, 'u1-t-33', 'الاشتراك')).toBe(0);
  });

  it('accepts only the masdar itself, not the masdar with its adjective', () => {
    const question = unitQuestion('u1-t-33');
    expect(question.type === 'fill_blank' && question.acceptedAnswers).not.toContain('الإذاعة المدرسية');
    expect(scoreOne(UNIT1_TEST, 'u1-t-33', 'الإذاعة المدرسية')).toBe(0);
  });
});

describe('Audit fix 1b — u1-t-48 rebuilt on the source-reading-phase sentence with a correct reference', () => {
  it('quotes only that sentence, cites page 31 examples, and keeps an honest origin wording', () => {
    const question = unitQuestion('u1-t-48');
    expect(question.passageContext).toBe('«أنا حريصٌ على إعلاءِ اسمِ بلادي.»');
    expect(question.passageContext).not.toContain('ابن');
    expect(question.source.pageNumber).toBe(31);
    expect(question.source.sectionName).toBe('أقرأ الأمثلة');
    expect(question.explanation).toContain('المدوّنة من مرحلة قراءة المصدر');
  });
});

describe('Audit fix 1c — l3-t-16 has exactly one unambiguous correct sentence', () => {
  it('removed the exclamation-sentence distractor', () => {
    const question = LESSON3_TEST.questions.find((entry) => entry.id === 'l3-t-16')!;
    expect(question.type).toBe('grammar_application');
    if (question.type !== 'grammar_application') throw new Error('unexpected type');
    expect(question.choices.some((choice) => choice.text.includes('ما أجملَ'))).toBe(false);
    expect(question.choices.map((choice) => choice.text)).toContain('العلمُ نورٌ.');
    expect(question.correctChoiceId).toBe('a');
  });

  it('scores only the three-explicit-pillar verbal sentence as correct', () => {
    expect(scoreOne(LESSON3_TEST, 'l3-t-16', 'a')).toBe(1);
    expect(scoreOne(LESSON3_TEST, 'l3-t-16', 'b')).toBe(0);
    expect(scoreOne(LESSON3_TEST, 'l3-t-16', 'c')).toBe(0);
    expect(scoreOne(LESSON3_TEST, 'l3-t-16', 'd')).toBe(0);
  });
});

describe('Audit fix 1d — u1-t-13 accepts grammatically valid alternatives', () => {
  it('accepts both the past and present transformations', () => {
    expect(scoreOne(UNIT1_TEST, 'u1-t-13', 'تعاون الصيادون على صنع المركب')).toBe(1);
    expect(scoreOne(UNIT1_TEST, 'u1-t-13', 'يتعاون الصيادون على صنع المركب')).toBe(1);
    expect(scoreOne(UNIT1_TEST, 'u1-t-13', 'يتعاون الصيادون على صنع المركب.')).toBe(1);
  });

  it('still rejects a transformation that keeps the sentence nominal or changes meaning', () => {
    expect(scoreOne(UNIT1_TEST, 'u1-t-13', 'الصيادون يتعاونون على صنع المركب')).toBe(0);
    expect(scoreOne(UNIT1_TEST, 'u1-t-13', 'ذهب الصيادون إلى البحر')).toBe(0);
  });
});

describe('Audit fix — l3-t-05 no longer accepts the wrong verb form', () => {
  it('is strict about the masdar letters and diacritics matter for the verb', () => {
    expect(scoreOne(LESSON3_TEST, 'l3-t-05', 'عَلِمَ')).toBe(1);
    expect(scoreOne(LESSON3_TEST, 'l3-t-05', 'علم')).toBe(1);
    expect(scoreOne(LESSON3_TEST, 'l3-t-05', 'عَلَمَ')).toBe(0);
  });

  it('rejects the nominal form and keeps the acceptance list free of duplicates', () => {
    expect(scoreOne(LESSON3_TEST, 'l3-t-05', 'العلم')).toBe(0);
    const question = LESSON3_TEST.questions.find((entry) => entry.id === 'l3-t-05')!;
    expect(question.type === 'fill_blank' && question.acceptedAnswers).toEqual(['عَلِمَ', 'علم']);
  });
});

describe('Audit fix 2 — cross-test duplication guard', () => {
  it('passes for the real unit test against all three lesson tests', () => {
    const report = auditCrossTestDuplication(UNIT1_TEST, [LESSON1_TEST, LESSON2_TEST, LESSON3_TEST]);
    expect(report.findings).toEqual([]);
    expect(report.passed).toBe(true);
  });

  it('detects a synthetic near-duplicate question', () => {
    const syntheticUnit: AssessmentTest = {
      ...UNIT1_TEST,
      id: 'synthetic-unit',
      questions: [
        {
          id: 'syn-01', order: 1, type: 'single_choice', difficulty: 'basic',
          prompt: 'ما الحلم الذي كان يراود الصياد في القصة؟',
          choices: [
            { id: 'a', text: 'اصطياد سمكة ذهبية' },
            { id: 'b', text: 'بناء بيت' },
          ],
          correctChoiceId: 'a',
          explanation: 'مكرر عمداً لغرض التدقيق.',
          testedSkill: 'استرجاع',
          source: UNIT1_TEST.questions[0].source,
        },
      ],
    };
    const report = auditCrossTestDuplication(syntheticUnit, [LESSON1_TEST, LESSON2_TEST, LESSON3_TEST]);
    expect(report.passed).toBe(false);
    expect(report.findings[0].lessonQuestionId).toBe('l1-t-02');
  });

  it('detects answer reuse even under a reworded prompt', () => {
    const targetAnswer = normalizedCorrectAnswer(
      LESSON1_TEST.questions.find((question) => question.id === 'l1-t-10')!,
    );
    expect(targetAnswer.length).toBeGreaterThan(10);
    const syntheticUnit: AssessmentTest = {
      ...UNIT1_TEST,
      id: 'synthetic-unit-2',
      questions: [
        {
          id: 'syn-02', order: 1, type: 'fill_blank', difficulty: 'basic',
          prompt: 'أكمل ما يأتي بمعانٍ من معجم الدرس:',
          acceptedAnswers: ['الزورق المركب الصغير وفير كثير فقير قليل المال'],
          explanation: 'إعادة استخدام الإجابة نفسها.',
          testedSkill: 'مفردات',
          source: UNIT1_TEST.questions[0].source,
        },
      ],
    };
    const report = auditCrossTestDuplication(syntheticUnit, [LESSON1_TEST]);
    expect(report.passed).toBe(false);
  });

  it('does not flag different questions that merely share common words', () => {
    const syntheticUnit: AssessmentTest = {
      ...UNIT1_TEST,
      id: 'synthetic-unit-3',
      questions: [
        {
          id: 'syn-03', order: 1, type: 'single_choice', difficulty: 'basic',
          prompt: 'ما لون مياه البحر في الصباح الباكر؟',
          choices: [
            { id: 'a', text: 'أزرق' },
            { id: 'b', text: 'أخضر' },
          ],
          correctChoiceId: 'a',
          explanation: 'سؤال مختلف يشترك مع غيره في كلمات عامة فقط.',
          testedSkill: 'فهم',
          source: UNIT1_TEST.questions[0].source,
        },
      ],
    };
    const report = auditCrossTestDuplication(syntheticUnit, [LESSON1_TEST, LESSON2_TEST, LESSON3_TEST]);
    expect(report.passed).toBe(true);
    expect(report.findings).toEqual([]);
  });

  it('KNOWN LIMIT: does not detect a semantic duplicate rephrased in different words', () => {
    // The pre-fix u1-t-01 asked the same idea as l1-t-02 in different words.
    // The guard is lexical: this case passes it undetected, which is why
    // semantic duplication still requires manual review and targeted tests.
    const syntheticUnit: AssessmentTest = {
      ...UNIT1_TEST,
      id: 'synthetic-unit-4',
      questions: [
        {
          id: 'syn-04', order: 1, type: 'single_choice', difficulty: 'basic',
          prompt: 'بماذا كان يحلم الصياد أن يظفر ليشتري بثمنه زورقاً؟',
          choices: [
            { id: 'a', text: 'بسمكة ذهبية' },
            { id: 'b', text: 'بكنز غارق' },
          ],
          correctChoiceId: 'a',
          explanation: 'إعادة صياغة جوهر سؤال قائم بصياغة مختلفة.',
          testedSkill: 'استرجاع',
          source: UNIT1_TEST.questions[0].source,
        },
      ],
    };
    const report = auditCrossTestDuplication(syntheticUnit, [LESSON1_TEST]);
    expect(report.passed).toBe(true);
    expect(report.findings).toEqual([]);
  });
});

describe('Audit fix 3 — real draft saving and restoration (Lesson 3)', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('namespaces drafts per lesson and per activity with no collisions', () => {
    expect(writeDraft('lesson3', 'L3-25-02', { language: 'العربية' })).toBe(true);
    expect(writeDraft('lesson2', 'L2-13-01', { language: 'شيء آخر' })).toBe(true);
    expect(readDraft('lesson3', 'L3-25-02')).toEqual({ language: 'العربية' });
    expect(readDraft('lesson3', 'L2-13-01')).toEqual({});
    expect(readDraft('lesson2', 'L3-25-02')).toEqual({});
    expect(draftKey('lesson3', 'L3-25-02')).toContain('lesson3:L3-25-02');
    clearDraft('lesson3', 'L3-25-02');
    expect(readDraft('lesson3', 'L3-25-02')).toEqual({});
  });

  it('restores a draft after leaving the step and coming back', () => {
    const lesson3 = getLessonById('lesson3')!.lesson;
    render(<LessonFlow lesson={lesson3} />);

    const input = screen.getByLabelText('اللغة المكتوبة في الصورة الأخيرة') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'العربية' } });

    // Leave to step 2, then return to step 1 (widget unmounts/remounts).
    fireEvent.click(screen.getByRole('button', { name: /الانتقال إلى الخطوة/ }));
    expect(screen.queryByLabelText('اللغة المكتوبة في الصورة الأخيرة')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 1:/ }));

    const restored = screen.getByLabelText('اللغة المكتوبة في الصورة الأخيرة') as HTMLInputElement;
    expect(restored.value).toBe('العربية');
    expect(readDraft('lesson3', 'L3-25-02')).toEqual({ language: 'العربية' });
  });

  it('keeps another activity draft empty (no data leaking between activities)', () => {
    const lesson3 = getLessonById('lesson3')!.lesson;
    render(<LessonFlow lesson={lesson3} />);
    const input = screen.getByLabelText('اللغة المكتوبة في الصورة الأخيرة');
    fireEvent.change(input, { target: { value: 'العربية' } });
    expect(readDraft('lesson3', 'L3-25-03')).toEqual({});
    expect(readDraft('lesson3', 'L3-25-04')).toEqual({});
  });

  it('claims a saved draft only when storage succeeded, and supports reset', () => {
    const lesson3 = getLessonById('lesson3')!.lesson;
    render(<LessonFlow lesson={lesson3} />);
    const widget = within(screen.getByLabelText('نشاط المصدر L3-25-02'));
    const input = widget.getByLabelText('اللغة المكتوبة في الصورة الأخيرة');
    fireEvent.change(input, { target: { value: 'العربية' } });

    fireEvent.click(widget.getByRole('button', { name: 'حفظ مسودة إجابتي' }));
    expect(widget.getByRole('status')).toHaveTextContent('حُفظت مسودتك في جلسة التصفح الحالية');

    fireEvent.click(widget.getByRole('button', { name: 'مسح مسودتي' }));
    expect((input as HTMLInputElement).value).toBe('');
    expect(readDraft('lesson3', 'L3-25-02')).toEqual({});
    expect(widget.getByRole('status')).toHaveTextContent('مُسحت مسودة هذا النشاط');
  });

  it('does not claim a saved draft when storage fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    const lesson3 = getLessonById('lesson3')!.lesson;
    render(<LessonFlow lesson={lesson3} />);
    const widget = within(screen.getByLabelText('نشاط المصدر L3-25-02'));
    const input = widget.getByLabelText('اللغة المكتوبة في الصورة الأخيرة');
    fireEvent.change(input, { target: { value: 'محاولة' } });
    fireEvent.click(widget.getByRole('button', { name: 'حفظ مسودة إجابتي' }));
    expect(widget.getByRole('alert')).toHaveTextContent('تعذّر حفظ المسودة');
  });
});

describe('Audit fix — Lesson 2 draft persistence through the student UI', () => {
  // jsdom-only: this exercises the real widget path (type → save → navigate →
  // remount → restore) but cannot perform a real page reload.
  it('saves, isolates, and restores Lesson 2 activity drafts when navigating steps', () => {
    const lesson2 = getLessonById('lesson2')!.lesson;
    render(<LessonFlow lesson={lesson2} />);

    // Step 3 (الفهم القرائي) holds both activities.
    fireEvent.click(screen.getByRole('button', { name: /الانتقال إلى الخطوة 2/ }));
    fireEvent.click(screen.getByRole('button', { name: /الانتقال إلى الخطوة 3/ }));

    const firstActivity = within(screen.getByLabelText('نشاط المصدر L2-14-01'));
    fireEvent.change(firstActivity.getByLabelText('جمع «تاج»'), { target: { value: 'تيجان' } });

    const secondActivity = within(screen.getByLabelText('نشاط المصدر L2-14-02'));
    fireEvent.change(secondActivity.getByLabelText('معنى «تنضج» في جملة الحكمة'), {
      target: { value: 'تنمو وتزداد' },
    });

    // Keys are namespaced per lesson and per activity; nothing leaks into lesson 3.
    expect(readDraft('lesson2', 'L2-14-01')).toEqual({ 'plural-taj': 'تيجان' });
    expect(readDraft('lesson2', 'L2-14-02')).toEqual({ wisdom: 'تنمو وتزداد' });
    expect(readDraft('lesson3', 'L2-14-01')).toEqual({});

    // Leave the step and come back: drafts must be restored from storage.
    fireEvent.click(screen.getByRole('button', { name: /الانتقال إلى الخطوة 4/ }));
    fireEvent.click(screen.getByRole('button', { name: /العودة إلى الخطوة 3/ }));

    const firstAgain = within(screen.getByLabelText('نشاط المصدر L2-14-01'));
    expect((firstAgain.getByLabelText('جمع «تاج»') as HTMLInputElement).value).toBe('تيجان');
    const secondAgain = within(screen.getByLabelText('نشاط المصدر L2-14-02'));
    expect((secondAgain.getByLabelText('معنى «تنضج» في جملة الحكمة') as HTMLTextAreaElement).value).toBe(
      'تنمو وتزداد',
    );
  });
});

describe('Audit fix 4 — solutions gateway (st12) with honest limits', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('blocks direct navigation to the solutions hub without the password', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'حلول الاختبارات' }));
    expect(screen.getByLabelText('كلمة مرور الحلول')).toBeInTheDocument();
    expect(screen.queryByText('اختر اختبار الدرس')).toBeNull();
    expect(screen.queryAllByText(/حلول اختبار الدرس/)).toHaveLength(0);
  });

  it('rejects a wrong password and accepts st12', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'حلول الاختبارات' }));
    fireEvent.change(screen.getByLabelText('كلمة مرور الحلول'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول منطقة الحلول' }));
    expect(screen.getByRole('alert')).toHaveTextContent('كلمة المرور غير صحيحة');
    expect(screen.queryByText('اختر اختبار الدرس')).toBeNull();

    fireEvent.change(screen.getByLabelText('كلمة مرور الحلول'), { target: { value: 'st12' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول منطقة الحلول' }));
    expect(screen.getByText('اختر اختبار الدرس')).toBeInTheDocument();
    expect(screen.getAllByText('حلول اختبار الدرس').length).toBeGreaterThan(2);
    expect(screen.getByText('منطقة مستقلة: حلول اختبار الوحدة')).toBeInTheDocument();
    expect(screen.getByText(/حماية واجهية فقط/)).toBeInTheDocument();
  });

  it('keeps the gate unlocked across remounts within the session and supports locking again', () => {
    const first = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'حلول الاختبارات' }));
    fireEvent.change(screen.getByLabelText('كلمة مرور الحلول'), { target: { value: 'st12' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول منطقة الحلول' }));
    expect(screen.getByText('اختر اختبار الدرس')).toBeInTheDocument();
    first.unmount();

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'حلول الاختبارات' }));
    expect(screen.getByText('اختر اختبار الدرس')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /قفل منطقة الحلول/ }));
    expect(screen.getByLabelText('كلمة مرور الحلول')).toBeInTheDocument();
  });
});

describe('Audit fixes kept the required counts and distribution intact', () => {
  it('still has 51 activities, 20 lesson-test questions, and 50 unit-test questions', () => {
    expect(LESSON3_ACTIVITIES).toHaveLength(51);
    expect(LESSON3_TEST.questions).toHaveLength(20);
    expect(UNIT1_TEST.questions).toHaveLength(50);
  });

  it('kept the lesson-page distribution 15 / 18 / 17', () => {
    const pagesOf = (from: number, to: number) =>
      UNIT1_TEST.questions.filter((question) => question.source.pageNumber >= from && question.source.pageNumber <= to).length;
    expect(pagesOf(4, 11)).toBe(15);
    expect(pagesOf(12, 24)).toBe(18);
    expect(pagesOf(25, 35)).toBe(17);
  });

  it('kept the unit difficulty distribution 20 / 16 / 6 / 8', () => {
    const count = (level: string) => UNIT1_TEST.questions.filter((question) => question.difficulty === level).length;
    expect(count('basic')).toBe(20);
    expect(count('medium')).toBe(16);
    expect(count('advanced')).toBe(6);
    expect(count('thinking')).toBe(8);
  });

  it('kept the Lesson 3 test difficulty blueprint 6 / 7 / 4 / 3', () => {
    const count = (level: string) => LESSON3_TEST.questions.filter((question) => question.difficulty === level).length;
    expect(count('basic')).toBe(6);
    expect(count('medium')).toBe(7);
    expect(count('advanced')).toBe(4);
    expect(count('thinking')).toBe(3);
  });
});
