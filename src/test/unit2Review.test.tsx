import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from '../App';
import {
  curriculumRegistry,
  getUnitById,
  getUnitReviewByUnitId,
  getUnitReviews,
  isUnitTestAvailable,
} from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS } from '../data/assessments';
import { UNIT2_REVIEW_QUESTIONS } from '../data/unit2Review/reviewItems';
import { UNIT2_REVIEW_SOURCE_RECORDS, unit2ReviewRecord } from '../data/unit2Review/sourceAudit';
import { UNIT2_REVIEW_EXCLUSIONS } from '../data/unit2Review/sourceMeta';
import { auditCurriculum } from '../utils/audit';

/**
 * «تقويم الوحدة الثانية» (pages 69–70) — coverage and regression contract.
 *
 * One test case per agreed verification item (14 cases). The printed counts
 * (questions / branches / answer spaces) are documentation facts recorded in
 * docs/source-locks and docs/coverage; they are NOT asserted here on purpose.
 *
 * Questions ٢ and ٤ are excluded by owner decision: they must own no student
 * element and leave no trace in the student area.
 */

const UNIT2 = 'الوحدة الثانية';

const openUnit2 = () => {
  fireEvent.click(screen.getByRole('button', { name: `عرض دروس ${UNIT2}` }));
};

const openUnit2Review = () => {
  openUnit2();
  fireEvent.click(screen.getByRole('button', { name: 'ابدأ المراجعة' }));
};

const shellText = () => document.querySelector('.u2r-shell')?.textContent ?? '';

const stepButtons = () => Array.from(document.querySelectorAll('.u2r-step-button')) as HTMLElement[];

beforeEach(() => {
  try {
    window.sessionStorage.clear();
  } catch {
    /* storage unavailable in this environment */
  }
});

afterEach(cleanup);

describe('Unit 2 review (تقويم الوحدة الثانية) — registration and linkage', () => {
  it('1. is registered as a unit review of unit 2 covering pages 69–70 only', () => {
    const review = getUnitReviewByUnitId('unit2');
    expect(review).toBeDefined();
    expect(review?.metadata.kind).toBe('unit_review');
    expect(review?.metadata.unitId).toBe('unit2');
    expect(review?.metadata.id).toBe('unit2-review');
    expect(review?.metadata.sourcePagesRange).toEqual({ startPage: 69, endPage: 70 });
    expect(review?.metadata.source.pageNumber).toBe(69);
    expect(review?.metadata.source.pageEndNumber).toBe(70);
    expect(review?.metadata.source.readabilityVerified).toBe(true);
  });

  it('2. is linked through unit2.reviewId and is not a fourth lesson', () => {
    const unit2 = getUnitById('unit2')!;
    expect(unit2.reviewId).toBe('unit2-review');
    expect(unit2.lessons).toHaveLength(3);
    expect(unit2.lessons.map((lesson) => lesson.metadata.id)).toEqual([
      'unit2-lesson1',
      'unit2-lesson2',
      'unit2-lesson3',
    ]);
    expect(unit2.lessons.map((lesson) => lesson.metadata.order)).toEqual([1, 2, 3]);
    expect(unit2.lessons.some((lesson) => lesson.metadata.id === 'unit2-review')).toBe(false);
    expect(getUnitReviews().map((review) => review.metadata.id)).toEqual([
      'unit1-review',
      'unit2-review',
    ]);
  });

  it('3. keeps unit 2 incomplete with no unit test', () => {
    const unit2 = getUnitById('unit2')!;
    expect(unit2.metadata.isComplete).toBe(false);
    expect(unit2.unitTestId).toBeUndefined();
    expect(isUnitTestAvailable('unit2')).toBe(false);
    expect(unit2.metadata.sourcePagesRange).toEqual({ startPage: 40, endPage: 68 });
  });

  it('4. links every implemented element to an audited source record and excludes questions ٢ and ٤', () => {
    for (const question of UNIT2_REVIEW_QUESTIONS) {
      const record = unit2ReviewRecord(`U2R-${question.page}-Q${question.printedNumber}`);
      expect(record.status).toBe('implemented');
      expect(record.page).toBe(question.page);
      expect(record.text).toBe(question.instruction);
      expect(question.source.pageNumber).toBe(question.page);
      expect([69, 70]).toContain(question.source.pageNumber);
      expect(question.source.readabilityVerified).toBe(true);
      expect(question.source.sectionName).toContain('تقويم الوحدة');
    }

    // No field may point at an excluded printed question.
    for (const question of UNIT2_REVIEW_QUESTIONS) {
      for (const field of question.fields) {
        expect(field.id).not.toMatch(/-Q2|-Q4/);
      }
    }

    // The audit records the two excluded questions, and nothing else, as excluded.
    const excludedNumbers = Array.from(
      new Set(UNIT2_REVIEW_SOURCE_RECORDS.filter((r) => r.status === 'excluded').map((r) => r.printedNumber)),
    ).sort();
    expect(excludedNumbers).toEqual([2, 4]);
    expect(UNIT2_REVIEW_EXCLUSIONS.map((entry) => entry.printedNumber)).toEqual([2, 4]);
    expect(UNIT2_REVIEW_SOURCE_RECORDS.every((r) => [69, 70].includes(r.page))).toBe(true);
  });
});

describe('Unit 2 review — five implemented steps only', () => {
  it('5. exposes exactly the five approved questions, numbered ١ ٣ ٥ ٦ ٧', () => {
    expect(UNIT2_REVIEW_QUESTIONS.map((question) => question.printedNumber)).toEqual([1, 3, 5, 6, 7]);

    render(<App />);
    openUnit2Review();

    const questionTitles = stepButtons()
      .map((button) => button.textContent?.trim() ?? '')
      .filter((title) => title.startsWith('السؤال'));
    expect(questionTitles).toEqual(['السؤال ١', 'السؤال ٣', 'السؤال ٥', 'السؤال ٦', 'السؤال ٧']);
  });

  it('6. leaves no trace of questions ٢ and ٤ in the student area', () => {
    render(<App />);
    openUnit2Review();

    for (let index = 0; index < stepButtons().length; index += 1) {
      fireEvent.click(stepButtons()[index]);
      expect(shellText()).not.toContain('أَضْبِطُ أَوَاخِرَ');
      expect(shellText()).not.toContain('أُكْمِلُ الْجَدْوَلَ');
      expect(shellText()).not.toContain('الْعَلَمُ مَرْفُوعٌ');
      expect(shellText()).not.toContain('الِاصْطِنَاعِيُّ');
    }
    expect(document.querySelectorAll('.u2r-shell table')).toHaveLength(0);
  });
});

describe('Unit 2 review — no grading, no hints', () => {
  it('7. offers no correctness buttons and no judgement widget for question ١', () => {
    render(<App />);
    openUnit2Review();
    fireEvent.click(screen.getByRole('button', { name: /الخطوة التالية/ }));

    expect(document.querySelectorAll('.u2r-shell input[type="radio"]')).toHaveLength(0);
    expect(document.querySelectorAll('.u2r-shell input[type="checkbox"]')).toHaveLength(0);
    const labels = Array.from(document.querySelectorAll('.u2r-shell button')).map(
      (button) => button.textContent?.trim() ?? '',
    );
    expect(labels.some((label) => /^(صحيحة|غير صحيحة|صح|خطأ)$/.test(label))).toBe(false);

    // The four printed statements get four empty answer spaces.
    const question = document.querySelector('.u2r-question-card')!;
    expect(question.querySelectorAll('.u2r-input')).toHaveLength(4);
  });

  it('8. renders completely empty fields with no placeholder and no guidance text', () => {
    render(<App />);
    openUnit2Review();

    for (let index = 0; index < stepButtons().length; index += 1) {
      fireEvent.click(stepButtons()[index]);
      const fields = Array.from(
        document.querySelectorAll('.u2r-shell input, .u2r-shell textarea'),
      ) as HTMLInputElement[];
      for (const field of fields) {
        expect(field.getAttribute('placeholder')).toBeNull();
        expect(field.value).toBe('');
        expect(field.getAttribute('aria-label')).toBeTruthy();
      }
      expect(shellText()).not.toMatch(/تلميح|مثال|اكتب هنا/);
    }
  });

  it('9. never exposes an answer key, a score or teacher solutions', () => {
    render(<App />);
    openUnit2Review();

    for (let index = 0; index < stepButtons().length; index += 1) {
      fireEvent.click(stepButtons()[index]);
      expect(shellText()).not.toMatch(/الحل النموذجي|درجتك|نتيجتك|مفتاح الإجابة|الإجابة الصحيحة:/);
    }
    expect(document.querySelectorAll('.u2r-shell [data-answer], .u2r-shell [data-correct]')).toHaveLength(0);

    // No assessment is registered for the review, and no teacher key exists.
    expect(ALL_ASSESSMENTS.some((assessment) => assessment.id.includes('review'))).toBe(false);
    expect(
      ALL_ASSESSMENTS.some((assessment) => assessment.unitId === 'unit2' && assessment.scope === 'unit'),
    ).toBe(false);
  });

  it('10. allows finishing without filling the two optional reflections', () => {
    render(<App />);
    openUnit2Review();

    for (let step = 0; step < stepButtons().length - 1; step += 1) {
      fireEvent.click(screen.getByRole('button', { name: /الخطوة التالية/ }));
    }
    expect(shellText()).toContain('مراجعة الإجابات');
    fireEvent.click(screen.getByRole('button', { name: 'إنهاء المراجعة' }));
    expect(screen.getByRole('status')).toHaveTextContent('تم إنهاء مراجعتك');
  });

  it('11. renders the audited wording verbatim for every implemented question', () => {
    render(<App />);
    openUnit2Review();

    const rendered: string[] = [];
    const renderedShared: string[] = [];
    for (let index = 0; index < stepButtons().length; index += 1) {
      fireEvent.click(stepButtons()[index]);
      const instruction = document.querySelector('.u2r-question-instruction');
      if (instruction) rendered.push(instruction.textContent?.trim() ?? '');
      const shared = document.querySelector('.u2r-shared-text');
      if (shared) renderedShared.push(shared.textContent?.trim() ?? '');
    }

    expect(rendered).toEqual(UNIT2_REVIEW_QUESTIONS.map((question) => question.instruction));
    expect(renderedShared).toEqual(
      UNIT2_REVIEW_QUESTIONS.flatMap((question) => (question.sharedText ? [question.sharedText] : [])),
    );
    for (const question of UNIT2_REVIEW_QUESTIONS) {
      expect(question.instruction).toBe(
        unit2ReviewRecord(`U2R-${question.page}-Q${question.printedNumber}`).text,
      );
    }
  });
});

describe('Unit 2 review — entry point, drafts and regression guard', () => {
  it('12. shows the review card on the unit page and keeps the unit test hidden', () => {
    render(<App />);
    openUnit2();

    expect(screen.getByRole('heading', { level: 1, name: UNIT2 })).toBeInTheDocument();
    expect(document.querySelector('.unit-page-assessments')).not.toBeNull();
    expect(screen.getByText('تقويم الوحدة الثانية')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ابدأ المراجعة' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ابدأ اختبار الوحدة' })).toBeNull();
  });

  it('13. saves the learner draft and restores both answers and position', () => {
    const first = render(<App />);
    openUnit2Review();
    fireEvent.click(screen.getByRole('button', { name: /الخطوة التالية/ }));

    const input = document.querySelector('.u2r-question-card .u2r-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'مسودة إجابة التقويم' } });
    expect(input).toHaveValue('مسودة إجابة التقويم');

    // Navigating away and back keeps the answer.
    fireEvent.click(screen.getByRole('button', { name: /الخطوة التالية/ }));
    fireEvent.click(screen.getByRole('button', { name: /الخطوة السابقة/ }));
    expect(
      (document.querySelector('.u2r-question-card .u2r-input') as HTMLInputElement).value,
    ).toBe('مسودة إجابة التقويم');

    // Re-mounting restores the draft and the last visited step.
    first.unmount();
    render(<App />);
    openUnit2Review();
    expect(shellText()).toContain('الخطوة ١ من ٥');
    expect(
      (document.querySelector('.u2r-question-card .u2r-input') as HTMLInputElement).value,
    ).toBe('مسودة إجابة التقويم');
  });

  it('14. leaves the pre-existing baseline untouched (unit 1 review, unit 2 assessments, audit)', () => {
    const unit1Review = getUnitReviewByUnitId('unit1')!;
    expect(unit1Review.metadata.printedQuestions).toBe(7);
    expect(unit1Review.metadata.printedBranches).toBe(23);
    expect(unit1Review.metadata.sourceRecords).toBe(10);
    expect(unit1Review.metadata.isCoverageVerified).toBe(true);

    const unit2 = getUnitById('unit2')!;
    expect(unit2.lessons).toHaveLength(3);
    expect(UNIT2_REVIEW_SOURCE_RECORDS.every((record) => record.source.readabilityVerified)).toBe(true);

    const unit2Assessments = ALL_ASSESSMENTS.filter((assessment) => assessment.unitId === 'unit2');
    expect(unit2Assessments.map((assessment) => assessment.id).sort()).toEqual([
      'unit2-lesson1-test',
      'unit2-lesson2-test',
    ]);

    const audit = auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, []);
    expect(audit.errorsCount).toBe(0);
  });
});
