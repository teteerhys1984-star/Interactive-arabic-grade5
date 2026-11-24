import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../App';
import { TeacherAreaShell } from '../components/teacher/TeacherAreaShell';
import {
  curriculumRegistry,
  getLessonById,
} from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS } from '../data/assessments';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { LESSON2_TEACHER_GUIDE } from '../data/lesson2/teacherGuide';
import { LESSON3_TEACHER_GUIDE } from '../data/lesson3/teacherGuide';
import { U2L1_TEACHER_GUIDE } from '../data/unit2Lesson1/teacherGuide';
import { U2L2_TEACHER_GUIDE } from '../data/unit2Lesson2/teacherGuide';
import { U2L3_SOLUTIONS_DECLARATION } from '../data/unit2Lesson3/solutions';
import { U3L1_SOLUTIONS_DECLARATION } from '../data/unit3Lesson1/solutions';
import { auditCurriculum } from '../utils/audit';
import { ApprovedLessonSolutions, TeacherSolutionsModel } from '../types/curriculum';

const TEACHER_GUIDES: TeacherSolutionsModel[] = [
  LESSON1_TEACHER_GUIDE,
  LESSON2_TEACHER_GUIDE,
  LESSON3_TEACHER_GUIDE,
  U2L1_TEACHER_GUIDE,
  U2L2_TEACHER_GUIDE,
  U2L3_SOLUTIONS_DECLARATION,
  U3L1_SOLUTIONS_DECLARATION,
];
const UNIT2_REVIEW_ABSENCE =
  'لا توجد حلول معلم معتمدة لتقويم الوحدة الثانية حاليًا، ولن تُعرض حلول تقريبية أو تخمينية.';
const UNIT1_UNIT_TITLE = 'الوحدة الأولى: أحلامي وطموحاتي';
const UNIT2_UNIT_TITLE = 'الوحدة الثانية';
const UNIT3_UNIT_TITLE = 'الوحدة الثالثة';
const UNIT1_TAB_NAME = `عرض دروس وحلول ${UNIT1_UNIT_TITLE}`;
const UNIT2_TAB_NAME = `عرض دروس وحلول ${UNIT2_UNIT_TITLE}`;

const openTeacherArea = () => {
  fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'somer173' } });
  fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
};

const openSolutionsTab = () => {
  fireEvent.click(screen.getByRole('tab', { name: 'الأدلة وحلول التدريبات' }));
};

const renderTeacherShell = (overrides: Partial<React.ComponentProps<typeof TeacherAreaShell>> = {}) =>
  render(
    <TeacherAreaShell
      curriculum={curriculumRegistry}
      teacherGuides={TEACHER_GUIDES}
      tests={ALL_ASSESSMENTS}
      accessPassword="somer173"
      unitReviewSolutions={[
        { unitId: 'unit1', label: 'حلول تقويم الوحدة الأولى', content: <div>قسم حلول التقويم</div> },
        { unitId: 'unit2', label: 'تقويم الوحدة الثانية', absenceNote: UNIT2_REVIEW_ABSENCE },
      ]}
      {...overrides}
    />,
  );

afterEach(cleanup);

describe('Teacher Area — solutions drill-down (units → lessons)', () => {
  it('keeps the gate and shows no review tab; authorization persists across tabs and levels', () => {
    renderTeacherShell();

    // Gate: nothing before the password.
    expect(screen.queryByRole('tab', { name: 'الأدلة وحلول التدريبات' })).toBeNull();
    openTeacherArea();

    // No independent review tab remains (D2); the other tabs are unchanged.
    expect(screen.queryByRole('tab', { name: 'حلول تقويم الوحدة الأولى' })).toBeNull();
    expect(screen.getByRole('tab', { name: 'نظرة عامة على المنهج' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^مدقق الجودة والنزاهة \(/ })).toBeInTheDocument();

    // Drill into unit 1 and back — the password is never re-asked.
    openSolutionsTab();
    fireEvent.click(screen.getByRole('button', { name: UNIT1_TAB_NAME }));
    fireEvent.click(screen.getByRole('button', { name: /^عرض حلول الدرس .*: بالرأي والرأي الآخر$/ }));
    expect(screen.queryByLabelText('كلمة مرور المعلم')).toBeNull();

    // Switching to the audit tab and back keeps the gate open too.
    fireEvent.click(screen.getByRole('tab', { name: /^مدقق الجودة والنزاهة \(/ }));
    expect(screen.queryByLabelText('كلمة مرور المعلم')).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: 'الأدلة وحلول التدريبات' }));
    expect(screen.queryByLabelText('كلمة مرور المعلم')).toBeNull();
  });

  it('lists only the registered units and loads zero solutions at the units level', () => {
    const { container } = renderTeacherShell();
    openTeacherArea();
    openSolutionsTab();

    expect(screen.getByRole('heading', { level: 2, name: 'وحدات المنهج والأدلة والحلول' })).toBeInTheDocument();
    // Exactly the three registered units, in order.
    const unitButtons = screen.getAllByRole('button', { name: /^عرض دروس وحلول / });
    expect(unitButtons.map((button) => button.textContent)).toEqual([
      `عرض دروس وحلول ${UNIT1_UNIT_TITLE}`,
      `عرض دروس وحلول ${UNIT2_UNIT_TITLE}`,
      `عرض دروس وحلول ${UNIT3_UNIT_TITLE}`,
    ]);

    // Every registered lesson now has exactly one solutions record:
    // unit 1 → 3/3 approved (39+53+51=143), unit 2 → 3/3 (96 approved + 1 declared
    // absence), unit 3 → 1/1 (declared absence, zero solutions).
    const stats = Array.from(container.querySelectorAll('.teacher-card-stats')).map((node) => node.textContent);
    expect(stats).toHaveLength(3);
    expect(stats[0]).toContain('٣/٣');
    expect(stats[0]).toContain('١٤٣');
    expect(stats[1]).toContain('٣/٣');
    expect(stats[1]).toContain('٩٦');
    expect(stats[1]).toContain('غيابًا معلنًا');
    expect(stats[2]).toContain('١/١');
    expect(stats[2]).toContain('غيابًا معلنًا');

    // No solution content or unit-review content is mounted at this level.
    expect(screen.queryByText(/الحل النموذجي:/)).toBeNull();
    expect(container.querySelectorAll('.u1r-solution-card')).toHaveLength(0);

    // Breadcrumb shows the teacher's current location.
    const nav = screen.getByRole('navigation', { name: 'مسار التنقل داخل بوابة المعلم' });
    expect(within(nav).getByText('بوابة المعلم')).toHaveAttribute('aria-current', 'page');
  });

  it('unit view: shows the registered lessons plus the independent review entry, lessons of the other unit absent', () => {
    const { container } = renderTeacherShell();
    openTeacherArea();
    openSolutionsTab();
    fireEvent.click(screen.getByRole('button', { name: UNIT1_TAB_NAME }));

    const heading = screen.getByRole('heading', { level: 2, name: `${UNIT1_UNIT_TITLE} — الأدلة والحلول` });
    expect(heading).toBeInTheDocument();
    expect(document.activeElement).toBe(heading); // D11: focus moved to the level heading

    // Three registered lessons — and nothing from unit 2.
    expect(screen.getAllByRole('button', { name: /^عرض حلول الدرس / })).toHaveLength(3);
    expect(screen.queryByText('مُخْتَرِعٌ مِنْ بِلَادِي')).toBeNull();
    expect(screen.queryByText('الذَّكاءُ الاصطِناعيُّ')).toBeNull();
    expect(screen.queryByText('بِالْعِلْمِ تَرْقَى')).toBeNull();

    // Independent «تقويم الوحدة» entry — not rendered as a lesson, not loaded yet.
    expect(screen.getByRole('heading', { level: 3, name: 'تقويم الوحدة' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'عرض حلول تقويم الوحدة الأولى' })).toBeInTheDocument();
    expect(screen.queryByText('قسم حلول التقويم')).toBeNull();
    expect(screen.queryByText(/الحل النموذجي:/)).toBeNull();
    expect(container.querySelectorAll('.guide-solution-card')).toHaveLength(0);

    // Breadcrumb: البوابة → الوحدة الأولى (current).
    const nav = screen.getByRole('navigation', { name: 'مسار التنقل داخل بوابة المعلم' });
    expect(within(nav).getByText(UNIT1_UNIT_TITLE)).toHaveAttribute('aria-current', 'page');
  });

  it('lesson view: renders ONLY that lesson\'s guide and solutions; other lessons\' content is absent from the DOM', () => {
    renderTeacherShell();
    openTeacherArea();
    openSolutionsTab();
    fireEvent.click(screen.getByRole('button', { name: UNIT1_TAB_NAME }));
    fireEvent.click(screen.getByRole('button', { name: /^عرض حلول الدرس .*: بالرأي والرأي الآخر$/ }));

    const heading = screen.getByRole('heading', { level: 2, name: 'دليل الدرس الثاني: بالرأي والرأي الآخر' });
    expect(document.activeElement).toBe(heading); // D11

    // This lesson's 53 solutions — and no other guide's markers anywhere.
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(53);
    expect(screen.getAllByText(/L2-12-01/).length).toBeGreaterThan(0); // lesson 2 ledger id
    expect(screen.queryByText(/يَقْرَأُ التِّلْميذُ نَصَّ/)).toBeNull(); // lesson 1 objective absent
    expect(screen.queryByText(/U2L1-49-02/)).toBeNull(); // unit 2 marker absent
    expect(screen.queryByRole('heading', { name: /دليل الدرس الأول/ })).toBeNull();
    expect(screen.queryByRole('heading', { name: /دليل الدرس الثالث/ })).toBeNull();
    expect(screen.queryByText('مُخْتَرِعٌ مِنْ بِلَادِي')).toBeNull();

    // Unit 1 page-range pages that belong to this lesson (12–24) are shown.
    expect(screen.getByText(/صفحات الكتاب/)).toBeInTheDocument();

    // Back to lessons of the unit → the unit view heading receives focus.
    fireEvent.click(screen.getByRole('button', { name: `العودة إلى قائمة دروس ${UNIT1_UNIT_TITLE}` }));
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { level: 2, name: `${UNIT1_UNIT_TITLE} — الأدلة والحلول` }),
    );
    expect(screen.getAllByRole('button', { name: /^عرض حلول الدرس / })).toHaveLength(3);

    // Back to units → the units heading receives focus.
    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى الوحدات' }));
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { level: 2, name: 'وحدات المنهج والأدلة والحلول' }),
    );
  });

  it('review view: the unit-1 review is independent — opens only from its entry, loaded only there', () => {
    renderTeacherShell();
    openTeacherArea();
    openSolutionsTab();

    // Not visible from the units level.
    expect(screen.queryByText('قسم حلول التقويم')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: UNIT1_TAB_NAME }));
    expect(screen.queryByText('قسم حلول التقويم')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'عرض حلول تقويم الوحدة الأولى' }));
    const heading = screen.getByRole('heading', { level: 2, name: 'حلول تقويم الوحدة الأولى' });
    expect(document.activeElement).toBe(heading);
    expect(screen.getByText('قسم حلول التقويم')).toBeInTheDocument();
    // The stub carries no lesson solutions.
    expect(screen.queryByText(/الحل النموذجي:/)).toBeNull();

    const nav = screen.getByRole('navigation', { name: 'مسار التنقل داخل بوابة المعلم' });
    expect(within(nav).getByText('حلول تقويم الوحدة الأولى')).toHaveAttribute('aria-current', 'page');

    // Back to the unit's lessons, then unit-1 breadcrumb crumb returns to the unit view.
    fireEvent.click(screen.getByRole('button', { name: `العودة إلى قائمة دروس ${UNIT1_UNIT_TITLE}` }));
    expect(screen.getByRole('button', { name: 'عرض حلول تقويم الوحدة الأولى' })).toBeInTheDocument();
  });

  it('unit 2: missing lesson 3 has no solutions and no open button; unit 2 review shows the approved absence note verbatim', () => {
    const { container } = renderTeacherShell();
    openTeacherArea();
    openSolutionsTab();
    fireEvent.click(screen.getByRole('button', { name: UNIT2_TAB_NAME }));

    // Only lessons 1 and 2 of unit 2 offer an approved solutions view.
    expect(screen.getAllByRole('button', { name: /^عرض حلول الدرس / })).toHaveLength(2);

    // Lesson 3 «بِالْعِلْمِ تَرْقَى»: registered with a DECLARED ABSENCE — the third
    // state. Documented inline, and deliberately NOT an open button (no solutions
    // view exists to open).
    const lessonThreeTitle = screen.getByText('بِالْعِلْمِ تَرْقَى');
    const lessonThreeCard = lessonThreeTitle.closest('.teacher-lesson-card') as HTMLElement;
    expect(lessonThreeCard).not.toBeNull();
    expect(within(lessonThreeCard).queryByRole('button')).toBeNull();
    expect(lessonThreeCard.className).toContain('teacher-lesson-card--declared-absence');
    expect(lessonThreeCard.textContent).toContain('غياب معلن وموثَّق');
    expect(lessonThreeCard.textContent).toContain('لا توجد حلول معتمدة لهذا الدرس');
    expect(lessonThreeCard.textContent).toContain('docs/source-locks/unit2-lesson-03-bil-ilmi-tarqa.md');
    expect(lessonThreeCard.textContent).toContain('٤٣'); // 43 audited source records
    // No solution text of any kind may appear in the declared-absence card.
    expect(within(lessonThreeCard).queryByText(/الحل النموذجي:/)).toBeNull();

    // The unit-2 review: approved absence note, verbatim (D5), not interactive.
    expect(screen.getByRole('note')).toHaveTextContent(UNIT2_REVIEW_ABSENCE);
    expect(screen.queryByRole('button', { name: /تقويم الوحدة الثانية/ })).toBeNull();

    // Nothing of unit 2 leaks unit 1 / 2 content: no solution cards at all here.
    expect(screen.queryByText(/الحل النموذجي:/)).toBeNull();
    expect(container.querySelectorAll('.u1r-solution-card')).toHaveLength(0);

    // Drilling into unit 2 lesson 1 shows ITS solutions only.
    fireEvent.click(screen.getByRole('button', { name: /^عرض حلول الدرس .*: مُخْتَرِعٌ مِنْ بِلَادِي$/ }));
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(45);
    expect(screen.getByRole('heading', { level: 2, name: /مُخْتَرِعٌ مِنْ بِلَادِي/ })).toBeInTheDocument();
  });

  it('guides that match no registered lesson surface a visible link alert and are never silently dropped', () => {
    const ghostGuide: ApprovedLessonSolutions = {
      kind: 'approved',
      lessonId: 'ghost-lesson-99',
      unitId: 'unit1',
      pedagogicalObjectives: ['هدف اختباري'],
      exerciseSolutions: [
        {
          sourceExercise: 'تمرين وهمي',
          pageNumber: 99,
          officialSolution: 'حل تخميني لا يجوز أن يظهر',
          didacticExplanation: 'شرح تخميني',
        },
      ],
      lessonTestAnswerKeyRef: 'ghost-test',
    };
    renderTeacherShell({ teacherGuides: [...TEACHER_GUIDES, ghostGuide] });
    openTeacherArea();
    openSolutionsTab();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('ghost-lesson-99');
    // The ghost content is never rendered; the real guides still work.
    expect(screen.queryByText('حل تخميني لا يجوز أن يظهر')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: UNIT1_TAB_NAME }));
    fireEvent.click(screen.getByRole('button', { name: /^عرض حلول الدرس .*: بالرأي والرأي الآخر$/ }));
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(53);
  });

  it('a guide whose unitId disagrees with the registry lesson is shown under the registry lesson with a visible alert', () => {
    const mismatchedGuide: ApprovedLessonSolutions = { ...LESSON2_TEACHER_GUIDE, unitId: 'unit2' };
    renderTeacherShell({ teacherGuides: [mismatchedGuide] });
    openTeacherArea();
    openSolutionsTab();

    expect(screen.getByRole('alert')).toHaveTextContent('lesson2');
    // Registry is the source of truth: the guide renders under unit 1
    // (the unit that owns the lesson), never under unit 2.
    fireEvent.click(screen.getByRole('button', { name: UNIT1_TAB_NAME }));
    fireEvent.click(screen.getByRole('button', { name: /^عرض حلول الدرس .*: بالرأي والرأي الآخر$/ }));
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(53);
  });

  it('audit tab count matches auditCurriculum regardless of drill-down; overview tab untouched', () => {
    const expected = auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, TEACHER_GUIDES);
    renderTeacherShell();
    openTeacherArea();

    fireEvent.click(screen.getByRole('tab', { name: `مدقق الجودة والنزاهة (${expected.issues.length})` }));
    expect(screen.getByRole('heading', { name: 'نتائج الفحص الآلي للمحتوى والنزاهة التعليمية' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'نظرة عامة على المنهج' }));
    expect(screen.getByText('الصف الدراسي')).toBeInTheDocument();
    expect(screen.getByText('قاعدة اكتمال الوحدة الرسمية:')).toBeInTheDocument();
  });

  it('the separate test-solutions gateway is unchanged and still gated', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'حلول الاختبارات' }));
    expect(screen.getByRole('heading', { name: 'بوابة حلول الاختبارات' })).toBeInTheDocument();
    expect(screen.queryByText(/الحل النموذجي:/)).toBeNull();
  });

  it('registry ordering guard: every registered teacher guide links to a registered lesson', () => {
    for (const guide of TEACHER_GUIDES) {
      expect(getLessonById(guide.lessonId), `guide ${guide.lessonId} has no registered lesson`).not.toBeNull();
    }
  });
});
