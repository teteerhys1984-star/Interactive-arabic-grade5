import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../App';
import { TeacherAreaShell } from '../components/teacher/TeacherAreaShell';
import {
  curriculumRegistry,
  getUnitReviewByUnitId,
  getUnitReviews,
  isUnitReviewAvailable,
  isUnitTestAvailable,
} from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS } from '../data/assessments';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { LESSON2_TEACHER_GUIDE } from '../data/lesson2/teacherGuide';
import { LESSON3_TEACHER_GUIDE } from '../data/lesson3/teacherGuide';
import {
  UNIT1_REVIEW_ANSWERABLE_BRANCHES,
  UNIT1_REVIEW_CLOSING,
  UNIT1_REVIEW_INSTRUCTIONS,
  UNIT1_REVIEW_QUESTIONS,
  UNIT1_REVIEW_TIMING,
} from '../data/unit1Review/reviewItems';
import { UNIT1_REVIEW_SOURCE_LOCK, auditUnit1ReviewCoverage } from '../data/unit1Review/sourceAudit';
import { UNIT1_REVIEW_TEACHER_GUIDE } from '../data/unit1Review/teacherGuide';
import {
  PENDING_SOURCE_RECORD_IDS,
  PENDING_SOURCE_SUBPART_IDS,
  REVIEW_SOURCE_UNCERTAINTIES,
} from '../data/unit1Review/sourceMeta';
import { auditCurriculum } from '../utils/audit';
import { CurriculumRegistry } from '../types/curriculum';
import { toArabicDigits } from '../utils/arabicDigits';

const TEACHER_GUIDES = [LESSON1_TEACHER_GUIDE, LESSON2_TEACHER_GUIDE, LESSON3_TEACHER_GUIDE];

beforeEach(() => {
  try {
    window.sessionStorage.clear();
  } catch {
    /* storage unavailable in this environment */
  }
});

afterEach(cleanup);

const openTeacherArea = () => {
  fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'somer173' } });
  fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
};

describe('Unit 1 review (تقويم الوحدة الأولى) — structure and linkage', () => {
  it('is registered as a unit review linked to Unit 1, and is not a fourth lesson', () => {
    const unit1 = curriculumRegistry.units[0];
    expect(unit1.lessons.map((lesson) => lesson.metadata.id)).toEqual(['lesson1', 'lesson2', 'lesson3']);
    expect(unit1.lessons.map((lesson) => lesson.metadata.order)).toEqual([1, 2, 3]);
    expect(unit1.lessons).toHaveLength(3);
    expect(unit1.lessons.some((lesson) => lesson.metadata.id === 'unit1-review')).toBe(false);

    expect(unit1.reviewId).toBe('unit1-review');
    expect(isUnitReviewAvailable('unit1')).toBe(true);

    const review = getUnitReviewByUnitId('unit1');
    expect(review).toBeDefined();
    expect(review?.metadata.kind).toBe('unit_review');
    expect(review?.metadata.title).toBe('تقويم الوحدة الأولى');
    expect(review?.metadata.englishLabel).toBe('Unit 1 Review');
    expect(review?.metadata.unitId).toBe('unit1');
    expect(review?.metadata.sourcePagesRange).toEqual({ startPage: 36, endPage: 38 });
    expect(review?.metadata.printedQuestions).toBe(7);
    expect(review?.metadata.printedBranches).toBe(23);
    expect(review?.metadata.sourceRecords).toBe(10);
    expect(review?.metadata.isCoverageVerified).toBe(true);
    expect(getUnitReviews()).toHaveLength(1);
  });

  it('keeps the lesson tests and the 50-question unit test exactly as they were', () => {
    const unit1 = curriculumRegistry.units[0];
    expect(unit1.unitTestId).toBe('unit1-test');
    expect(isUnitTestAvailable('unit1')).toBe(true);
    // The review adds no assessment: 3 lesson tests + 1 unit test only.
    expect(ALL_ASSESSMENTS).toHaveLength(4);
    expect(ALL_ASSESSMENTS.some((assessment) => assessment.id.includes('review'))).toBe(false);
    expect(ALL_ASSESSMENTS.find((assessment) => assessment.id === 'unit1-test')?.questions).toHaveLength(50);

    const audit = auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, TEACHER_GUIDES);
    expect(audit.errorsCount).toBe(0);
    expect(audit.totalLessons).toBe(3);
  });

  it('flags a review that leaked into the lessons list as a critical audit error', () => {
    const broken: CurriculumRegistry = {
      ...curriculumRegistry,
      units: [
        {
          ...curriculumRegistry.units[0],
          lessons: [
            ...curriculumRegistry.units[0].lessons,
            {
              metadata: {
                id: 'unit1-review',
                unitId: 'unit1',
                order: 4,
                title: 'تقويم الوحدة الأولى',
                primarySkill: 'reading_comprehension',
                estimatedMinutes: 40,
                sources: [],
              },
              steps: [],
            },
          ],
        },
      ],
    };
    const audit = auditCurriculum(broken, [], []);
    expect(audit.errorsCount).toBeGreaterThan(0);
    expect(audit.issues.some((issue) => issue.category === 'curriculum_integrity')).toBe(true);
  });

  it('locks all ten printed source records of pages 36–38 with their branches', () => {
    expect(UNIT1_REVIEW_SOURCE_LOCK).toHaveLength(10);
    expect(UNIT1_REVIEW_SOURCE_LOCK.map((entry) => entry.id)).toEqual([
      'U1R-36-01',
      'U1R-36-02',
      'U1R-36-03',
      'U1R-37-04',
      'U1R-37-05',
      'U1R-37-06',
      'U1R-37-07',
      'U1R-38-08',
      'U1R-38-09',
      'U1R-38-10',
    ]);
    expect(UNIT1_REVIEW_SOURCE_LOCK.reduce((total, entry) => total + entry.branchCount, 0)).toBe(32);
    expect(UNIT1_REVIEW_SOURCE_LOCK.map((entry) => entry.page)).toEqual([36, 36, 36, 37, 37, 37, 37, 38, 38, 38]);
    expect(UNIT1_REVIEW_QUESTIONS.map((question) => question.printedNumber)).toEqual(['١', '٢', '٣', '٤', '٥', '٦', '٧']);
    expect(UNIT1_REVIEW_QUESTIONS.map((question) => question.page)).toEqual([36, 37, 37, 37, 37, 38, 38]);
    expect(UNIT1_REVIEW_ANSWERABLE_BRANCHES).toBe(23);
  });

  it('proves the source → student → teacher chain with a passed coverage audit', () => {
    const report = auditUnit1ReviewCoverage();
    expect(report.status).toBe('passed');
    expect(report.requiredRecords).toBe(10);
    expect(report.lockedBranches).toBe(32);
    expect(report.studentSubparts).toBe(32);
    expect(report.teacherSolutions).toBe(32);
    expect(report.gradedSubparts).toBe(23);
    expect(report.ungradedSubparts).toBe(9);
    expect(report.missingRecords).toEqual([]);
    expect(report.unexpectedRecords).toEqual([]);
    expect(report.branchCountMismatch).toEqual([]);
    expect(report.subpartsMissingTeacherSolution).toEqual([]);
    expect(report.teacherSolutionsMissingModelAnswer).toEqual([]);
    // Structural coverage passes, but the source is NOT fully verified yet.
    expect(report.sourceVerified).toBe(false);
    expect(report.pendingSourceRecords).toEqual(['U1R-36-03', 'U1R-37-06', 'U1R-38-08']);
    expect(report.pendingSubparts).toHaveLength(8);
    expect(report.teacherSolutionsMissingSteps).toEqual([]);
    expect(report.emptyStudentPrompts).toEqual([]);
    expect(UNIT1_REVIEW_TEACHER_GUIDE.audit.status).toBe('passed');
  });

  it('declares every source limit instead of inventing unreadable content', () => {
    expect(REVIEW_SOURCE_UNCERTAINTIES).toHaveLength(8);
    expect(REVIEW_SOURCE_UNCERTAINTIES.every((limit) => limit.cropNeeded.length > 0)).toBe(true);

    // The coloured words of ص٣٧ could not be verified. The printed requirement is
    // kept unchanged (classify the coloured word) and no word is invented for it.
    const q4 = UNIT1_REVIEW_QUESTIONS.find((question) => question.printedNumber === '٤')!;
    q4.subparts.forEach((subpart) => {
      expect(subpart.interaction.kind).toBe('single_choice');
      if (subpart.interaction.kind === 'single_choice') {
        expect(subpart.interaction.choices.map((choice) => choice.id)).toEqual(['ism', 'fil', 'harf']);
      }
      expect(q4.instruction).toContain('أُصَنِّفُ الكَلِماتَ المُلَوَّنَةَ');
      expect(subpart.teacher.ambiguity).toMatch(/لم يتيسّر التحقق|لا يمكن التحقق/);
    });
    expect(q4.kindNote ?? '').toContain('تصنيفُ الكلمةِ الملوّنةِ');
    expect(JSON.stringify(q4)).not.toContain('pick_and_classify');

    // The central word of ص٣٨ stays declared as unverified: the map is not settled.
    const q6 = UNIT1_REVIEW_QUESTIONS.find((question) => question.printedNumber === '٦')!;
    expect(q6.wordMap?.centerVerified).toBe(false);
    expect(q6.wordMap?.centerNote).toContain('إعلام');
    expect(q6.subparts.every((subpart) => (subpart.teacher.ambiguity || '').length > 0)).toBe(true);
    expect(q6.subparts[0].teacher.modelAnswer).toContain('أَعْلَمَ');

    // The clock label of ص٣٦ stays marked as a source limit.
    expect(UNIT1_REVIEW_TIMING.uncertaintyNote).toContain('البدا');
    expect(UNIT1_REVIEW_TIMING.subparts).toHaveLength(3);
    expect(UNIT1_REVIEW_INSTRUCTIONS.subparts).toHaveLength(4);
    expect(UNIT1_REVIEW_CLOSING.subparts).toHaveLength(2);
  });
});

describe('Unit 1 review — Student Area', () => {
  it('shows the review after the lessons on the home page, outside the lessons list', () => {
    const { container } = render(<App />);

    const lessonsList = container.querySelector('.lessons-list');
    expect(lessonsList).not.toBeNull();
    expect(within(lessonsList as HTMLElement).queryByText(/تقويم الوحدة الأولى/)).toBeNull();
    expect(within(lessonsList as HTMLElement).getAllByRole('button')).toHaveLength(3);

    const reviewSection = container.querySelector('.unit-review-section');
    expect(reviewSection).not.toBeNull();
    expect(within(reviewSection as HTMLElement).getByText('تقويم الوحدة الأولى')).toBeInTheDocument();
    expect(within(reviewSection as HTMLElement).getByText(/درساً رابعاً/)).toBeInTheDocument();

    // The lessons list precedes the review section in the DOM.
    const position = (lessonsList as HTMLElement).compareDocumentPosition(reviewSection as HTMLElement);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // The 50-question unit test entry is untouched.
    expect(screen.getByRole('button', { name: /اختبار الوحدة الأولى الشامل/ })).toBeInTheDocument();
  });

  it('opens a stepped, sectioned review with a clear question indicator and navigation', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /ابدأ تقويم الوحدة الأولى/ }));

    expect(container.querySelector('.u1r-shell')).not.toBeNull();
    expect(screen.getByText('تقويم الوحدة الأولى')).toBeInTheDocument();
    // Intro step: printed conduct instructions and the timing task.
    expect(screen.getByText(/مهمة ضبط الوقت/)).toBeInTheDocument();
    expect(screen.getByText(/تَعْليماتُ التَّقْويمِ/)).toBeInTheDocument();
    expect(container.querySelector('.u1r-progress-kicker')?.textContent).toContain('مقدمة التقويم');

    // The step menu lists every step (intro + 7 questions + closing + review).
    expect(screen.getAllByRole('button', { name: /السؤال [١-٧]:/ }).length).toBe(7);
    expect(screen.getByRole('button', { name: /مقدمة التقويم وتعليماته/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /خاتمة الوحدة/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /مراجعة إجاباتي والإنهاء/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /الخطوة التالية/ }));
    expect(container.querySelector('.u1r-progress-kicker')?.textContent).toContain('السؤال ١ من ٧');
    expect(screen.getAllByText(/أُمَيِّزُ العِبارَةَ الصَّحيحةَ/).length).toBeGreaterThan(0);
    // Long questions are split branch by branch instead of one long page.
    expect(container.querySelector('.u1r-branch-counter')?.textContent).toBe('البند ١ من ٤');
    expect(screen.getByRole('button', { name: 'عرض كل فروع السؤال' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'عرض كل فروع السؤال' }));
    expect(screen.getAllByText(/العبارة [١٢٣٤]/).length).toBe(4);

    // Free navigation: jump straight to question ٥ then back to question ١.
    fireEvent.click(screen.getByRole('button', { name: /السؤال ٥:/ }));
    expect(container.querySelector('.u1r-progress-kicker')?.textContent).toContain('السؤال ٥ من ٧');
    expect(screen.getAllByText(/السَّبَبُ \(١\)/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/نَتيجَتُهُ \(١\)/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /السؤال ١:/ }));
    expect(container.querySelector('.u1r-progress-kicker')?.textContent).toContain('السؤال ١ من ٧');
  });

  it('preserves learner answers while navigating between questions', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /ابدأ تقويم الوحدة الأولى/ }));
    fireEvent.click(screen.getByRole('button', { name: /السؤال ١:/ }));

    fireEvent.click(screen.getByRole('radio', { name: 'غير صحيحة ✗' }));
    const correction = container.querySelector('textarea') as HTMLTextAreaElement;
    fireEvent.change(correction, { target: { value: 'سمكة إضافية واحدة كل يوم' } });

    fireEvent.click(screen.getByRole('button', { name: /السؤال ٤:/ }));
    fireEvent.click(screen.getByRole('button', { name: /السؤال ١:/ }));

    expect(screen.getByRole('radio', { name: 'غير صحيحة ✗' })).toBeChecked();
    expect((container.querySelector('textarea') as HTMLTextAreaElement).value).toBe('سمكة إضافية واحدة كل يوم');

    // Prose answers are kept too (open writing task of question ٣).
    fireEvent.click(screen.getByRole('button', { name: /السؤال ٣:/ }));
    const paragraphBox = container.querySelector('.u1r-paragraph-box') as HTMLTextAreaElement;
    fireEvent.change(paragraphBox, { target: { value: 'الكتاب خير جليس ويُغني معارفي ويزيدني ثقةً.' } });
    fireEvent.click(screen.getByRole('button', { name: /السؤال ٥:/ }));
    fireEvent.click(screen.getByRole('button', { name: /السؤال ٣:/ }));
    expect((container.querySelector('.u1r-paragraph-box') as HTMLTextAreaElement).value).toContain('خير جليس');

    // Progress stays honest: one answered branch is reported, out of 23.
    const progressNote = container.querySelector('.u1r-progress-note')?.textContent || '';
    expect(progressNote).toContain('٢٣');
  });

  it('renders the printed branches (including the declared-gap branch) without any solution', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /ابدأ تقويم الوحدة الأولى/ }));

    // Question ٤ keeps the printed requirement (classify the coloured word) and
    // states the declared limit instead of naming any word.
    fireEvent.click(screen.getByRole('button', { name: /السؤال ٤:/ }));
    expect(screen.getAllByText(/حدّ مصدر معلن/).length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.u1r-subpart-pending-note')).toHaveLength(1);
    expect(screen.getAllByText(/قيد التحقق المصدري/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'عرض كل فروع السؤال' }));
    expect(container.querySelectorAll('.u1r-subpart-pending-note')).toHaveLength(4);
    expect(screen.getAllByRole('radio', { name: 'اسمٌ' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('radio', { name: 'فعلٌ' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('radio', { name: 'حرفٌ' }).length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.u1r-word-picker')).toHaveLength(0);

    // Question ٦ keeps the printed four-circle map but not an unverified word.
    fireEvent.click(screen.getByRole('button', { name: /السؤال ٦:/ }));
    expect(container.querySelector('.u1r-map-center')?.textContent).toBe('الكلمة المطبوعة في مركز المخطط');
    expect(container.querySelectorAll('.u1r-map-pending-note')).toHaveLength(1);
    expect(screen.getAllByText('فعلُها').length).toBeGreaterThan(0);
    expect(screen.getAllByText('نوعُها').length).toBeGreaterThan(0);
    expect(screen.getAllByText('معناها').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ضدُّها').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /السؤال ٧:/ }));
    expect(container.querySelectorAll('.u1r-blank-input')).toHaveLength(3);

    // No answer key, explanation, or teacher guidance leaks into the Student Area.
    const studentText = container.textContent || '';
    [
      'الإجابة النموذجية',
      'خطوات الحل',
      'القاعدة اللغوية',
      'حدود المقبول',
      'غموض مصدر معلن',
      'الإعراب الكامل',
      'نموذج استرشادي من إعداد المنصة',
      'أَعْلَنَ',
      'أَعْلَمَ',
      'التصويبُ:',
    ].forEach((teacherOnly) => {
      expect(studentText).not.toContain(teacherOnly);
    });
  });

  it('offers an editable answers review before finishing, without revealing correctness', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /ابدأ تقويم الوحدة الأولى/ }));
    fireEvent.click(screen.getByRole('button', { name: /مراجعة إجاباتي والإنهاء/ }));

    expect(screen.getByText(/لا تُعرض الإجابات الصحيحة في منطقة الطالب/)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /تعديل إجابات هذا السؤال/ })).toHaveLength(7);
    expect(screen.queryByText(/نتيجة التقييم/)).toBeNull();
    expect(screen.queryByText(/إجابة صحيحة/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'إنهاء المراجعة' }));
    expect(screen.getByText(/تم إنهاء مراجعتك/)).toBeInTheDocument();
    expect(screen.queryByText(/إجابة صحيحة/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'متابعة المراجعة والتعديل' }));
    expect(screen.getByRole('button', { name: 'إنهاء المراجعة' })).toBeInTheDocument();

    // Leaving and reopening the review keeps both answers and position.
    fireEvent.click(screen.getAllByRole('button', { name: /تعديل إجابات هذا السؤال/ })[0]);
    expect(container.querySelector('.u1r-progress-kicker')?.textContent).toContain('السؤال ١ من ٧');
  });
});

describe('Unit 1 review — Teacher Area', () => {
  it('keeps the teacher gate and adds an independent review-solutions section', () => {
    render(
      <TeacherAreaShell
        curriculum={curriculumRegistry}
        teacherGuides={TEACHER_GUIDES}
        tests={ALL_ASSESSMENTS}
        accessPassword="somer173"
        reviewSolutions={<div>قسم حلول التقويم</div>}
      />,
    );

    // Still gated: nothing is revealed before the password.
    expect(screen.queryByRole('tab', { name: 'حلول تقويم الوحدة الأولى' })).toBeNull();
    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: '173' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    expect(screen.getByRole('alert')).toHaveTextContent('كلمة المرور غير صحيحة');
    expect(screen.queryByRole('tab', { name: 'حلول تقويم الوحدة الأولى' })).toBeNull();

    openTeacherArea();
    const reviewTab = screen.getByRole('tab', { name: 'حلول تقويم الوحدة الأولى' });
    fireEvent.click(reviewTab);
    expect(screen.getByText('قسم حلول التقويم')).toBeInTheDocument();

    // Existing tabs still work as before.
    fireEvent.click(screen.getByRole('tab', { name: 'نظرة عامة على المنهج' }));
    expect(screen.getByText('الصف الدراسي')).toBeInTheDocument();
  });

  it('shows a full solution for every printed question and branch (pages 36–38)', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'بوابة المعلم والإشراف' }));
    openTeacherArea();
    fireEvent.click(screen.getByRole('tab', { name: 'حلول تقويم الوحدة الأولى' }));

    expect(screen.getAllByText('حلول تقويم الوحدة الأولى').length).toBeGreaterThan(0);
    // 10 printable source records (7 questions + timing + instructions + closing).
    expect(container.querySelectorAll('.u1r-teacher-question')).toHaveLength(10);
    // One full solution card per printed branch.
    expect(container.querySelectorAll('.u1r-solution-card')).toHaveLength(32);
    expect(screen.getAllByText(/الإجابة النموذجية:/)).toHaveLength(32);
    expect(screen.getAllByText('خطوات الحل والتعليل').length).toBe(32);

    // Complete i‘rab, accepted alternatives/limits and declared limits are present.
    expect(screen.getAllByText('الإعراب الكامل').length).toBeGreaterThanOrEqual(5);
    expect(screen.getAllByText('الإجابات البديلة وحدود المقبول').length).toBeGreaterThan(10);
    expect(screen.getAllByText('غموض مصدر معلن:').length).toBeGreaterThanOrEqual(6);
    expect(screen.getByText(/حدود المصدر المعلنة/)).toBeInTheDocument();

    // Coverage ledger rows = the ten locked records.
    const coverageTable = container.querySelector('.u1r-teacher-coverage table');
    expect(within(coverageTable as HTMLElement).getAllByRole('row')).toHaveLength(11);

    // Every question body carries its printed page reference.
    UNIT1_REVIEW_QUESTIONS.forEach((question) => {
      expect(screen.getAllByText(new RegExp(`صفحة ${toArabicDigits(question.page)}`)).length).toBeGreaterThan(0);
    });
  });

  it('never reports the pending source records as complete (pages 36–38 limits)', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'بوابة المعلم والإشراف' }));
    openTeacherArea();
    fireEvent.click(screen.getByRole('tab', { name: 'حلول تقويم الوحدة الأولى' }));

    // Eight student elements stay pending until the crops arrive.
    expect(PENDING_SOURCE_SUBPART_IDS).toHaveLength(8);
    expect(container.querySelectorAll('.u1r-solution-card-pending')).toHaveLength(8);
    expect(screen.getAllByText('قيد التحقق المصدري — غير مكتمل').length).toBe(8);

    // The audit banner says plainly that source verification is unfinished.
    expect(screen.getByText(/التحقق المصدري لم يكتمل/)).toBeInTheDocument();

    // The three answer-affecting records are marked in the coverage ledger.
    expect(PENDING_SOURCE_RECORD_IDS).toEqual(['U1R-36-03', 'U1R-37-06', 'U1R-38-08']);
    expect(container.querySelectorAll('.u1r-coverage-row-pending')).toHaveLength(3);
    expect(screen.getAllByText(/قيد التحقق المصدري — غير مكتمل \(بانتظار قصّ أوضح\)/).length).toBe(3);

    // The source-limits table states the effect on the answer, and Q4/Q6 keep the printed task.
    const limitsTable = container.querySelector('.u1r-limits-table');
    const limitRows = within(limitsTable as HTMLElement).getAllByRole('row');
    expect(limitRows).toHaveLength(REVIEW_SOURCE_UNCERTAINTIES.length + 1);
    expect(container.querySelectorAll('.u1r-limit-row-blocking')).toHaveLength(3);
    expect(within(limitsTable as HTMLElement).getAllByText(/معلَّق — لا يُعدّ/).length).toBe(3);

    // Q4 still asks for the classification of the coloured word, Q6 for the four circles.
    const q4Card = container.querySelector('[aria-label="حل الجملة ١"]') as HTMLElement;
    expect(q4Card.textContent).toContain('اسمٌ');
    expect(q4Card.textContent).toContain('قيد التحقق المصدري');
    const q6Card = container.querySelector('[aria-label="حل فعلُها"]') as HTMLElement;
    expect(q6Card.textContent).toContain('أَعْلَمَ');
    expect(q6Card.textContent).toContain('أَعْلَنَ');
  });
});
