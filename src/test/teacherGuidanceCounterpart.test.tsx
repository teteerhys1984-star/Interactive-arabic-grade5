import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import {
  buildTeacherGuidanceRegistry,
  declaredContentGaps,
  studentVisibleGuidance,
  TeacherGuidanceSourceItem,
} from '../data/guidanceRegistry';
import { U3L1_GUIDANCE_REGISTRY } from '../data/unit3Lesson1/guidanceRegistry';
import { U3L1_ACTIVITIES } from '../data/unit3Lesson1/activities';
import { U3L1_SUGGESTED_ANSWERS, u3l1RevealRecord } from '../data/unit3Lesson1/guidance';
import { U3L1_SOLUTIONS_DECLARATION } from '../data/unit3Lesson1/solutions';
import { U2L2_ACTIVITIES } from '../data/unit2Lesson2/activities';
import { U2L3_SOLUTIONS_DECLARATION } from '../data/unit2Lesson3/solutions';
import { U2L3_ACTIVITIES } from '../data/unit2Lesson3/activities';
import { LESSON2_TEACHER_GUIDE } from '../data/lesson2/teacherGuide';
import { LESSON2_ACTIVITIES } from '../data/lesson2/activities';
import { curriculumRegistry } from '../data/curriculumRegistry';
import { ALL_ASSESSMENTS } from '../data/assessments';
import { TeacherSolutionsBrowser } from '../components/teacher/TeacherSolutionsBrowser';
import { TeacherAreaShell } from '../components/teacher/TeacherAreaShell';
import {
  TEACHER_GUIDANCE_HEADING,
  TeacherGuidanceSection,
} from '../components/teacher/TeacherGuidanceSection';
import { auditCurriculum } from '../utils/audit';
import { resolveAnswerReveal } from '../components/common/answerDisclosure';
import { LESSON1_TEACHER_GUIDE } from '../data/lesson1/teacherGuide';
import { LESSON3_TEACHER_GUIDE } from '../data/lesson3/teacherGuide';
import { U2L1_TEACHER_GUIDE } from '../data/unit2Lesson1/teacherGuide';
import { U2L2_TEACHER_GUIDE } from '../data/unit2Lesson2/teacherGuide';
import type { TeacherSolutionsModel } from '../types/curriculum';

/**
 * U3L1 teacher guidance — link-only counterpart of the student's suggestions.
 *
 * This suite covers the three surfaces (student, teacher, supervision) and the
 * THREE-GATE contract that every future lesson must satisfy:
 *
 *   GATE 1 (student)      : approved_key/guidance_only only, and only when the
 *                           record actually carries text; everything else null.
 *   GATE 2 (teacher)      : whatever the learner can reveal has a teacher
 *                           counterpart in the same lesson — never dropped.
 *   GATE 3 (supervision)  : counts, statuses and gaps are honest and add up,
 *                           and no suggestion is laundered into a solution.
 */

const SHIPPED_GUIDES: TeacherSolutionsModel[] = [
  LESSON1_TEACHER_GUIDE,
  LESSON2_TEACHER_GUIDE,
  LESSON3_TEACHER_GUIDE,
  U2L1_TEACHER_GUIDE,
  U2L2_TEACHER_GUIDE,
  U2L3_SOLUTIONS_DECLARATION,
  U3L1_SOLUTIONS_DECLARATION,
];

const SHIPPED_REGISTRIES = [U3L1_GUIDANCE_REGISTRY];

const audit = (
  guides: TeacherSolutionsModel[] = SHIPPED_GUIDES,
  registries = SHIPPED_REGISTRIES,
) => auditCurriculum(curriculumRegistry, ALL_ASSESSMENTS, guides, registries);

const errors = (report: ReturnType<typeof audit>) =>
  report.issues.filter((issue) => issue.severity === 'error');

afterEach(cleanup);

describe('U3L1 guidance registry — link-only, complete and pinned', () => {
  it('covers all 57 printed activities with links only (no copied answer text)', () => {
    expect(U3L1_GUIDANCE_REGISTRY.declaredActivityCount).toBe(57);
    expect(U3L1_GUIDANCE_REGISTRY.links).toHaveLength(57);
    expect(U3L1_GUIDANCE_REGISTRY.activityIds).toHaveLength(57);
    expect(new Set(U3L1_GUIDANCE_REGISTRY.activityIds).size).toBe(57);

    /* LINK-ONLY: no link carries the suggestion text. */
    const answerTexts = Object.values(U3L1_SUGGESTED_ANSWERS).map((entry) => entry.modelAnswer);
    expect(answerTexts).toHaveLength(52);
    for (const link of U3L1_GUIDANCE_REGISTRY.links) {
      const serialized = JSON.stringify(link);
      for (const text of answerTexts) {
        expect(serialized.includes(text)).toBe(false);
      }
    }
  });

  it('pins the audited classification: 0 approved / 52 guidance / 5 gaps', () => {
    const { counts } = U3L1_GUIDANCE_REGISTRY;
    expect(counts.total).toBe(57);
    expect(counts.approved_key).toBe(0);
    expect(counts.guidance_only).toBe(52);
    expect(counts.teacher_only).toBe(0);
    expect(counts.no_approved_content).toBe(5);
    expect(studentVisibleGuidance(U3L1_GUIDANCE_REGISTRY)).toHaveLength(52);
    expect(declaredContentGaps(U3L1_GUIDANCE_REGISTRY)).toHaveLength(5);
  });

  it('derives every classification from the record own disclosure, never from text', () => {
    for (const activity of U3L1_ACTIVITIES) {
      const link = U3L1_GUIDANCE_REGISTRY.links.find((entry) => entry.activityId === activity.id);
      expect(link).toBeDefined();
      expect(link!.classification).toBe(activity.disclosure.kind);
      expect(link!.sourceRef.trim().length).toBeGreaterThan(0);
      expect(link!.notice.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps the five calligraphy activities free of invented answers', () => {
    const calligraphy = U3L1_ACTIVITIES.filter((activity) => activity.disclosure.kind === 'no_approved_content');
    expect(calligraphy.map((activity) => activity.id)).toEqual([
      'u3l1-a-45',
      'u3l1-a-46',
      'u3l1-a-47',
      'u3l1-a-48',
      'u3l1-a-49',
    ]);
    for (const activity of calligraphy) {
      /* No suggestion entry, no student payload, and the gap states its reason. */
      expect(U3L1_SUGGESTED_ANSWERS[activity.id]).toBeUndefined();
      expect(resolveAnswerReveal(u3l1RevealRecord(activity), 'student')).toBeNull();
      const link = U3L1_GUIDANCE_REGISTRY.links.find((entry) => entry.activityId === activity.id);
      expect(link?.gapReason?.trim().length).toBeGreaterThan(0);
    }
  });

  it('does not change the PR #24 model: the lesson is still a declared absence', () => {
    expect(U3L1_SOLUTIONS_DECLARATION.kind).toBe('declared_absence');
    expect(
      (U3L1_SOLUTIONS_DECLARATION as unknown as Record<string, unknown>).exerciseSolutions,
    ).toBeUndefined();
    /* The registry is NOT a solutions record and is not registered as one. */
    expect(Object.keys(U3L1_GUIDANCE_REGISTRY)).not.toContain('exerciseSolutions');
    expect(Object.keys(U3L1_GUIDANCE_REGISTRY)).not.toContain('kind');
  });
});

describe('Audit A13 — student-visible guidance needs a teacher counterpart', () => {
  it('passes on the shipped configuration with three documented repairs', () => {
    const report = audit();
    expect(errors(report)).toEqual([]);
  });

  it('rejects a documented student guidance note with no teacher registry', () => {
    const report = audit(SHIPPED_GUIDES, []);
    expect(
      errors(report).some(
        (issue) =>
          issue.entityId === 'unit3-lesson1' && issue.message.includes('دون سجل إرشادات معلمي'),
      ),
    ).toBe(true);
  });

  it('rejects a registry with no registered solutions record', () => {
    const withoutU3L1 = SHIPPED_GUIDES.filter((guide) => guide.lessonId !== 'unit3-lesson1');
    const report = audit(withoutU3L1, SHIPPED_REGISTRIES);
    expect(
      errors(report).some(
        (issue) =>
          issue.entityId === 'unit3-lesson1' && issue.message.includes('بلا سجل حلول مسجل'),
      ),
    ).toBe(true);
  });

  it('rejects a link without a source reference or without a notice', () => {
    const items: TeacherGuidanceSourceItem[] = U3L1_ACTIVITIES.map((activity) => ({
      activityId: activity.id,
      sourceActivityId: activity.sourceActivityId,
      pageNumber: activity.page,
      section: activity.section,
      printedNumber: activity.printedNumber,
      record: u3l1RevealRecord(activity),
      notice: U3L1_SUGGESTED_ANSWERS[activity.id]?.notice ?? 'تنبيه',
    }));
    const broken = buildTeacherGuidanceRegistry({
      lessonId: 'unit3-lesson1',
      unitId: 'unit3',
      lessonTitle: 'العُلَماءُ الصِّغارُ',
      recordLocation: 'src/data/unit3Lesson1/guidance.ts',
      items,
    });
    broken.links[0] = { ...broken.links[0], sourceRef: '   ' };
    broken.links[1] = { ...broken.links[1], notice: '   ' };
    const report = audit(SHIPPED_GUIDES, [broken]);
    expect(errors(report).some((issue) => issue.message.includes('بلا مرجع مصدر'))).toBe(true);
    expect(errors(report).some((issue) => issue.message.includes('بلا تنبيه'))).toBe(true);
  });

  it('rejects counts that do not match the links (no silent drift)', () => {
    const drifted = {
      ...U3L1_GUIDANCE_REGISTRY,
      counts: { ...U3L1_GUIDANCE_REGISTRY.counts, guidance_only: 51 },
    };
    const report = audit(SHIPPED_GUIDES, [drifted]);
    expect(errors(report).some((issue) => issue.message.includes('غير مطابقة للروابط'))).toBe(true);
  });

  it('forbids laundering a guidance_only record into an approved key', () => {
    const laundered = {
      ...U3L1_GUIDANCE_REGISTRY,
      links: U3L1_GUIDANCE_REGISTRY.links.map((link, index) =>
        index === 0 ? { ...link, classification: 'approved_key' as const } : link,
      ),
      counts: { ...U3L1_GUIDANCE_REGISTRY.counts, approved_key: 1, guidance_only: 51 },
    };
    const report = audit(SHIPPED_GUIDES, [laundered]);
    expect(
      errors(report).some((issue) => issue.message.includes('لا يجوز تحويل إرشاد إلى مفتاح معتمد')),
    ).toBe(true);
  });

  it('rejects two guidance registries for one lesson (no ambiguous counterpart)', () => {
    const report = audit(SHIPPED_GUIDES, [U3L1_GUIDANCE_REGISTRY, U3L1_GUIDANCE_REGISTRY]);
    expect(
      errors(report).some((issue) => issue.message.includes('أكثر من سجل إرشادات معلمي')),
    ).toBe(true);
  });

  it('leaves every other lesson untouched: no new issue mentions them', () => {
    const messages = audit().issues.map((issue) => issue.message).join('\n');
    for (const otherLesson of [
      'lesson1',
      'lesson2',
      'lesson3',
      'unit2-lesson1',
      'unit2-lesson2',
      'unit2-lesson3',
    ]) {
      expect(messages.includes(`إرشادات (${otherLesson})`)).toBe(false);
      expect(messages.includes(`سجل إرشادات (${otherLesson})`)).toBe(false);
    }
  });
});

describe('Reusable triple gate — student / teacher / supervision', () => {
  /**
   * GATE CONTRACT (mandatory for every future lesson).
   *
   * Given the records of one lesson, the teacher counterpart registry and the
   * solutions record, ALL THREE gates must agree. The gate is deliberately
   * data-driven, so a new lesson only has to provide the same three pieces.
   */
  const expectTripleGate = (input: {
    label: string;
    records: { id: string; disclosure: { kind: string; sourceRef: string } }[];
    registry: typeof U3L1_GUIDANCE_REGISTRY;
    guide: TeacherSolutionsModel;
  }) => {
    const { label, registry, guide } = input;
    /* Revealability is decided by the SAME resolver the student surface uses,
       over the ORIGINAL records the registry points at. */
    const revealable = input.records.filter((record) => {
      const original = registry.readRecord(record.id);
      return original ? resolveAnswerReveal(original, 'student') !== null : false;
    }).length;

    /* GATE 1 — the student surface only reveals what the disclosure allows. */
    const visibleLinks = studentVisibleGuidance(registry);
    expect(visibleLinks.length, `${label}: student-visible guidance`).toBe(revealable);

    /* GATE 2 — every revealable record has a teacher link (completeness). */
    const linkIds = new Set(registry.links.map((link) => link.activityId));
    for (const record of input.records) {
      expect(linkIds.has(record.id), `${label}: ${record.id} has no teacher link`).toBe(true);
    }

    /* GATE 3 — supervision arithmetic must add up, and the record kind rules. */
    const { counts } = registry;
    expect(counts.total).toBe(registry.links.length);
    expect(counts.guidance_only + counts.approved_key + counts.teacher_only + counts.no_approved_content).toBe(
      counts.total,
    );
    expect(counts.total).toBe(input.records.length);

    if (guide.kind === 'declared_absence') {
      /* Nothing may be presented as an approved key inside a declared absence. */
      expect(counts.approved_key, `${label}: approved keys inside declared absence`).toBe(0);
      expect(counts.guidance_only + counts.approved_key).toBe(visibleLinks.length);
      expect(guide.declaration.studentGuidanceNote?.trim().length).toBeGreaterThan(0);
    }
  };

  it('U3L1 passes the triple gate', () => {
    expectTripleGate({
      label: 'unit3-lesson1',
      records: U3L1_ACTIVITIES,
      registry: U3L1_GUIDANCE_REGISTRY,
      guide: U3L1_SOLUTIONS_DECLARATION,
    });
  });

  it('a previously working lesson (unit 2 lesson 2) still matches the same contract', () => {
    /* The comparison lesson: approved guide, 51 records, its own solution texts.
       A registry built from ITS records must satisfy the same gates — proving the
       gate is reusable and that U3L1 was not special-cased. */
    const registry = buildTeacherGuidanceRegistry({
      lessonId: 'unit2-lesson2',
      unitId: 'unit2',
      lessonTitle: 'الذَّكاءُ الاصطِناعيُّ',
      recordLocation: 'src/data/unit2Lesson2/activities.ts',
      items: U2L2_TEACHER_GUIDE.sourceCoverage
        ? U2L2_ACTIVITIES.map((activity) => ({
            activityId: activity.id,
            sourceActivityId: activity.sourceActivityId,
            pageNumber: activity.page,
            section: activity.section,
            printedNumber: activity.printedNumber,
            record: {
              id: activity.id,
              sourceActivityId: activity.sourceActivityId,
              disclosure: activity.disclosure,
              modelAnswer: activity.teacher.answerOrGuidance,
              explanation: activity.checkExplanation,
              teacher: activity.teacher,
            },
            notice: 'إرشاد مقترح أعدّته المنصة، وليس إجابة معتمدة.',
          }))
        : [],
    });

    expect(registry.counts.total).toBe(51);
    expect(registry.counts.approved_key).toBe(22);
    expect(registry.counts.guidance_only).toBe(29);
    expect(registry.counts.no_approved_content).toBe(0);
    expect(studentVisibleGuidance(registry)).toHaveLength(51);

    /* GATE 2 alone: every record has a teacher link. */
    for (const activity of U2L2_ACTIVITIES) {
      expect(registry.links.some((link) => link.activityId === activity.id)).toBe(true);
    }
  });

  it('a lesson with zero student guidance needs no counterpart (unit 2 lesson 3)', () => {
    /* Contrast case: 43 records, all `no_approved_content` — the learner can
       reveal nothing, so no advisory section is required and A13 stays silent. */
    const registry = buildTeacherGuidanceRegistry({
      lessonId: 'unit2-lesson3',
      unitId: 'unit2',
      lessonTitle: 'بِالْعِلْمِ تَرْقَى',
      recordLocation: 'src/data/unit2Lesson3/activities.ts',
      items: U2L3_ACTIVITIES.map((activity) => ({
        activityId: activity.id,
        sourceActivityId: activity.sourceActivityId,
        pageNumber: activity.page,
        record: {
          id: activity.id,
          sourceActivityId: activity.sourceActivityId,
          disclosure: activity.disclosure,
        },
        notice: 'لا محتوى معتمد لهذا النشاط.',
      })),
    });
    expect(registry.counts.no_approved_content).toBe(43);
    expect(studentVisibleGuidance(registry)).toHaveLength(0);
    expect(U2L3_SOLUTIONS_DECLARATION.kind).toBe('declared_absence');
    expect(U2L3_SOLUTIONS_DECLARATION.declaration.studentGuidanceNote).toBeUndefined();
    /* The shipped audit must not require a counterpart here. */
    expect(
      audit().issues.some((issue) => issue.entityId === 'unit2-lesson3' && issue.category === 'answer_disclosure'),
    ).toBe(false);
  });

  it('lesson 2 (approved guide) shows no advisory section and gains no A13 issue', () => {
    const report = audit();
    expect(report.issues.some((issue) => issue.message.includes('lesson2'))).toBe(false);
    expect(LESSON2_ACTIVITIES.length).toBe(53);
    expect(LESSON2_TEACHER_GUIDE.exerciseSolutions).toHaveLength(53);
  });
});

describe('Teacher surface — the 52 suggestions are shown as a separate section', () => {
  it('renders every suggestion under the mandated heading, with source, class and notice', () => {
    render(<TeacherGuidanceSection registry={U3L1_GUIDANCE_REGISTRY} />);

    expect(
      screen.getByRole('heading', { name: TEACHER_GUIDANCE_HEADING }),
    ).toBeInTheDocument();
    expect(TEACHER_GUIDANCE_HEADING).toBe('إرشادات مقترحة من المنصة — ليست حلولًا معتمدة');

    const items = document.querySelectorAll('.teacher-guidance-item');
    /* 52 visible suggestions + the 5 declared gaps. */
    expect(items).toHaveLength(57);

    const firstItem = document.querySelector('.teacher-guidance-item') as HTMLElement;
    expect(firstItem.textContent).toContain('إرشاد مقترح (غير معتمد)'); // classification
    expect(firstItem.querySelector('code')?.textContent).toContain('U3L1-73-01'); // source
    expect(within(firstItem).getByRole('note').textContent).toContain('ليست إجابة معتمدة'); // notice

    /* No approved-solution marker anywhere in the advisory section. */
    expect(screen.queryByText(/الحل النموذجي:/)).toBeNull();
  });

  it('opens inside the declared-absence lesson without becoming a solutions view', () => {
    render(
      <TeacherSolutionsBrowser
        curriculum={curriculumRegistry}
        teacherGuides={SHIPPED_GUIDES}
        guidanceRegistries={SHIPPED_REGISTRIES}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /^عرض دروس وحلول الوحدة الثالثة/ }));
    fireEvent.click(screen.getByRole('button', { name: /^عرض الإرشادات المقترحة للدرس الأول/ }));

    expect(screen.getByRole('heading', { name: TEACHER_GUIDANCE_HEADING })).toBeInTheDocument();
    expect(document.querySelectorAll('.teacher-guidance-item')).toHaveLength(57);
    /* Still a declared absence: no solution card, no approved heading. */
    expect(document.querySelectorAll('.guide-solution-card')).toHaveLength(0);
    expect(screen.queryByText(/الحل النموذجي:/)).toBeNull();
    expect(screen.getByText(/غياب الحلول معلن وموثَّق/)).toBeInTheDocument();
    /* The suggestion text itself is present — as the teacher's counterpart. */
    const firstSuggestion = U3L1_SUGGESTED_ANSWERS['u3l1-a-01'].modelAnswer;
    expect(screen.getByText(firstSuggestion)).toBeInTheDocument();
  });

  it('keeps the approved lessons free of any advisory section', () => {
    render(
      <TeacherSolutionsBrowser
        curriculum={curriculumRegistry}
        teacherGuides={SHIPPED_GUIDES}
        guidanceRegistries={SHIPPED_REGISTRIES}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /^عرض دروس وحلول الوحدة الأولى: أحلامي وطموحاتي/ }));
    fireEvent.click(screen.getByRole('button', { name: /^عرض حلول الدرس الثاني: / }));
    expect(screen.getAllByText(/الحل النموذجي:/)).toHaveLength(53);
    expect(screen.queryByRole('heading', { name: TEACHER_GUIDANCE_HEADING })).toBeNull();
    expect(document.querySelectorAll('.teacher-guidance-item')).toHaveLength(0);
  });
});

describe('Supervision surface — status, counts and gaps only', () => {
  const openAuditTab = () => {
    fireEvent.change(screen.getByLabelText('كلمة مرور المعلم'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول بوابة المعلم' }));
    fireEvent.click(screen.getByRole('tab', { name: /^مدقق الجودة والنزاهة \(/ }));
  };

  it('shows lesson status and classification counts without duplicating guidance text', () => {
    render(
      <TeacherAreaShell
        curriculum={curriculumRegistry}
        teacherGuides={SHIPPED_GUIDES}
        tests={ALL_ASSESSMENTS}
        accessPassword="somer173"
        guidanceRegistries={SHIPPED_REGISTRIES}
      />,
    );
    openAuditTab();

    expect(
      screen.getByRole('heading', { name: 'الإشراف على الإرشادات — الحالة والأعداد' }),
    ).toBeInTheDocument();

    const row = document.querySelector('[data-lesson-id="unit3-lesson1"]') as HTMLElement;
    expect(row).not.toBeNull();
    expect(row.textContent).toContain('العُلَماءُ الصِّغارُ');
    expect(row.textContent).toContain('غياب معلن وموثَّق'); // status
    expect(row.textContent).toContain('٥٢'); // guidance_only
    expect(row.textContent).toContain('٥'); // no_approved_content
    expect(row.textContent).toContain('مقابل معلمي قائم');

    /* No guidance text is repeated in the supervision panel. */
    const panel = document.querySelector('.guidance-supervision') as HTMLElement;
    for (const entry of Object.values(U3L1_SUGGESTED_ANSWERS)) {
      expect(panel.textContent).not.toContain(entry.modelAnswer);
    }
  });

  it('surfaces an A13 mismatch in the audit list when the counterpart is missing', () => {
    render(
      <TeacherAreaShell
        curriculum={curriculumRegistry}
        teacherGuides={SHIPPED_GUIDES}
        tests={ALL_ASSESSMENTS}
        accessPassword="somer173"
        guidanceRegistries={[]}
      />,
    );
    openAuditTab();
    expect(
      screen.getByText(/دون سجل إرشادات معلمي/),
    ).toBeInTheDocument();
  });
});

describe('Student surface — unchanged by the teacher projection', () => {
  it('still reveals the suggestions and hides the five gaps', () => {
    const revealable = U3L1_ACTIVITIES.filter(
      (activity) => resolveAnswerReveal(u3l1RevealRecord(activity), 'student') !== null,
    );
    expect(revealable).toHaveLength(52);
    for (const activity of revealable) {
      const payload = resolveAnswerReveal(u3l1RevealRecord(activity), 'student');
      expect(payload?.heading).toBe('إرشادات للإجابة');
    }
    const hidden = U3L1_ACTIVITIES.filter(
      (activity) => resolveAnswerReveal(u3l1RevealRecord(activity), 'student') === null,
    );
    expect(hidden.map((activity) => activity.id)).toEqual([
      'u3l1-a-45',
      'u3l1-a-46',
      'u3l1-a-47',
      'u3l1-a-48',
      'u3l1-a-49',
    ]);
  });

  it('never exposes teacher-only material to the student scope', () => {
    for (const activity of U3L1_ACTIVITIES) {
      const student = resolveAnswerReveal(u3l1RevealRecord(activity), 'student');
      expect(student === null || !('kind' in student)).toBe(true);
    }
  });
});
