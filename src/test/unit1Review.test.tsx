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
import { REVIEW_SOURCE_UNCERTAINTIES } from '../data/unit1Review/sourceMeta';
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
    expect(report.teacherSolutionsMissingSteps).toEqual([]);
    expect(report.emptyStudentPrompts).toEqual([]);
    expect(UNIT1_REVIEW_TEACHER_GUIDE.audit.status).toBe('passed');
  });

  it('declares every source limit instead of inventing unreadable content', () => {
    expect(REVIEW_SOURCE_UNCERTAINTIES).toHaveLength(8);
    expect(REVIEW_SOURCE_UNCERTAINTIES.every((limit) => limit.cropNeeded.length > 0)).toBe(true);

    // The coloured words of ص٣٧ could not be verified: the student side asks the
    // learner to point at the coloured word instead of inventing one.
    const q4 = UNIT1_REVIEW_QUESTIONS.find((question) => question.printedNumber === '٤')!;
    q4.subparts.forEach((subpart) => {
      expect(subpart.interaction.kind).toBe('pick_and_classify');
      if (subpart.interaction.kind === 'pick_and_classify') {
        expect(subpart.interaction.gapNote).toContain('لم يتيسّر التحقق');
        expect(subpart.interaction.words.length).toBeGreaterThan(1);
      }
      expect(subpart.teacher.ambiguity).toBeDefined();
    });

    // The central word of ص٣٨ is declared with its alternative reading.
    const q6 = UNIT1_REVIEW_QUESTIONS.find((question) => question.printedNumber === '٦')!;
    expect(q6.subparts.every((subpart) => (subpart.teacher.ambiguity || '').length > 0)).toBe(true);

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

    // Question ٤: the learner points at the coloured word of their own book.
    fireEvent.click(screen.getByRole('button', { name: /السؤال ٤:/ }));
    expect(screen.getByText(/حدّ مصدر معلن/)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'في' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('radio', { name: 'اسمٌ' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'فعلٌ' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'حرفٌ' })).toBeInTheDocument();

    // Question ٦ keeps the printed four-circle map, question ٧ the inline blanks.
    fireEvent.click(screen.getByRole('button', { name: /السؤال ٦:/ }));
    expect(container.querySelector('.u1r-map-center')?.textContent).toBe('إعلان');
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
});
