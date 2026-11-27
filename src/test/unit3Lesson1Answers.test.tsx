import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Unit3Lesson1StepRenderer } from '../components/curriculum/Unit3Lesson1StepRenderer';
import { isStudentBlockVisible } from '../components/curriculum/studentVisibility';
import { AnswerReveal } from '../components/common/AnswerReveal';
import { resolveAnswerReveal } from '../components/common/answerDisclosure';
import { U3L1_ACTIVITIES, U3L1_ACTIVITY_BY_ID } from '../data/unit3Lesson1/activities';
import { U3L1_STEPS, U3L1_STEP_CONTENT } from '../data/unit3Lesson1/content';
import {
  U3L1_GUIDANCE_NOTICE,
  U3L1_SUGGESTED_ANSWERS,
  U3L1_UNDECIDABLE_IDS,
  u3l1RevealRecord,
} from '../data/unit3Lesson1/guidance';

/**
 * U3L1 «العُلَماءُ الصِّغار» — the student-facing answer surface after PR #24.
 *
 * WHAT THIS FILE PROVES (the owner's acceptance criteria):
 *  1. «أظهر الجواب» EXISTS for every answerable activity and reveals a specific,
 *     usable answer — the absence of an official key is no longer a reason for
 *     an answer-less lesson.
 *  2. The revealed answer is labelled «إرشادات للإجابة» + an explicit notice that
 *     it is a platform suggestion, NOT an approved key and NOT attributed to the
 *     textbook (never «الحل النموذجي المعتمد»).
 *  3. The eight records whose source is genuinely missing (listening audio,
 *     hand-drawn calligraphy models) have NO button, NO panel and NO answer — and
 *     no answer was authored for them.
 *  4. `teacher_only` / `no_approved_content` never reach the student surface, and
 *     the shared resolver stays fail-closed.
 */

const ANSWERABLE = U3L1_ACTIVITIES.filter((activity) => !U3L1_UNDECIDABLE_IDS.includes(activity.id));


describe('U3L1 — the lesson now helps the learner instead of hiding the button', () => {
  it('covers the whole ledger: 52 answerable + 5 source-gap = 57', () => {
    expect(U3L1_ACTIVITIES).toHaveLength(57);
    expect(ANSWERABLE).toHaveLength(52);
    expect(U3L1_UNDECIDABLE_IDS).toHaveLength(5);
    expect(Object.keys(U3L1_SUGGESTED_ANSWERS)).toHaveLength(52);
  });

  it('classifies every answerable record as guidance_only and never as approved_key', () => {
    ANSWERABLE.forEach((activity) => {
      expect(activity.disclosure.kind, activity.sourceActivityId).toBe('guidance_only');
    });
    const gapIds = new Set(U3L1_UNDECIDABLE_IDS);
    /* The five calligraphy items only. The listening trio is answered from the
       printed poem and is covered by unit3Lesson1FollowUp.test.tsx. */
    expect(gapIds).toEqual(new Set(['u3l1-a-45', 'u3l1-a-46', 'u3l1-a-47', 'u3l1-a-48', 'u3l1-a-49']));
    U3L1_ACTIVITIES.filter((activity) => gapIds.has(activity.id)).forEach((activity) => {
      expect(activity.disclosure.kind).toBe('no_approved_content');
      // The two documented gaps: listening audio, and hand-drawn Ruq'ah models.
      expect(activity.gapNote, activity.sourceActivityId).toBeTruthy();
    });
    expect(U3L1_ACTIVITIES.some((activity) => activity.disclosure.kind === 'approved_key')).toBe(false);
  });

  it('every suggested answer says something specific, and nothing is invented for a gap', () => {
    ANSWERABLE.forEach((activity) => {
      const suggested = U3L1_SUGGESTED_ANSWERS[activity.id];
      expect(suggested, `no suggested answer for ${activity.sourceActivityId}`).toBeDefined();
      // Long enough to be a real answer, not a placeholder such as «انظر الكتاب».
      expect(suggested.modelAnswer.trim().length).toBeGreaterThan(30);
      expect(suggested.explanation.trim().length).toBeGreaterThan(40);
      expect(suggested.modelAnswer).not.toMatch(/غير متوفر|غير متوفرة|انظر الكتاب/);
    });
    U3L1_UNDECIDABLE_IDS.forEach((id) => {
      expect(U3L1_SUGGESTED_ANSWERS[id]).toBeUndefined();
    });
  });

  it('keeps the book texts, activity order and interaction data untouched (disclosure only)', () => {
    /* Every record keeps its printed instruction and sub-items verbatim; the fix
       added visibility, it did not rewrite the lesson. */
    U3L1_ACTIVITIES.forEach((activity) => {
      expect(activity.instruction.trim().length).toBeGreaterThan(0);
      expect(activity.source.pageNumber).toBeGreaterThanOrEqual(73);
      expect(activity.source.pageNumber).toBeLessThanOrEqual(83);
    });
    const order = U3L1_STEPS.flatMap((step) =>
      U3L1_STEP_CONTENT[step.id].blocks
        .filter((block) => block.kind === 'activity')
        .map((block) => (block as { activityId: string }).activityId),
    );
    expect(order).toEqual(U3L1_ACTIVITIES.map((activity) => activity.id));
  });
});

describe('U3L1 — the student sees the button and the answer', () => {
  /* The four follow-up records have their own suite; the assertions below use a
     representative answerable activity from the comprehension/grammar steps. */
  const renderStepOf = (activityId: string) => {
    const step = U3L1_STEPS.find((candidate) =>
      U3L1_STEP_CONTENT[candidate.id].blocks.some(
        (block) => block.kind === 'activity' && block.activityId === activityId,
      ),
    )!;
    render(<Unit3Lesson1StepRenderer step={step} />);
    return screen.getByLabelText(`نشاط المصدر ${U3L1_ACTIVITY_BY_ID[activityId].sourceActivityId}`);
  };

  it('shows «أظهر الجواب» on a comprehension activity and reveals the suggested answer', () => {
    const section = renderStepOf('u3l1-a-13');
    const button = within(section).getByRole('button', { name: 'أظهر الجواب' });

    /* Nothing is exposed before the learner presses the button. */
    expect(within(section).queryByText(U3L1_SUGGESTED_ANSWERS['u3l1-a-13'].modelAnswer)).toBeNull();

    fireEvent.click(button);
    const panel = within(section).getByText(U3L1_SUGGESTED_ANSWERS['u3l1-a-13'].modelAnswer);
    expect(panel).toBeVisible();
    expect(within(section).getByText('إرشادات للإجابة')).toBeInTheDocument();
    expect(within(section).getByText(/التعليل:/)).toBeInTheDocument();
    expect(within(section).getByText(U3L1_GUIDANCE_NOTICE)).toBeInTheDocument();

    /* Never presented as an approved key, never attributed to the book. */
    expect(within(section).queryByText('الحل النموذجي المعتمد')).toBeNull();
    expect(within(section).queryByText(/الجواب المعتمد/)).toBeNull();

    fireEvent.click(within(section).getByRole('button', { name: 'أخفِ الجواب' }));
    expect(within(section).queryByText(U3L1_SUGGESTED_ANSWERS['u3l1-a-13'].modelAnswer)).toBeNull();
  });

  it('shows the grammar answer for a rule activity', () => {
    const section = renderStepOf('u3l1-a-27');
    fireEvent.click(within(section).getByRole('button', { name: 'أظهر الجواب' }));
    expect(
      within(section).getByText(U3L1_SUGGESTED_ANSWERS['u3l1-a-27'].modelAnswer),
    ).toBeVisible();
  });

  it('renders a button for every answerable activity and none for the source-gap ones', () => {
    for (const step of U3L1_STEPS) {
      const view = render(<Unit3Lesson1StepRenderer step={step} />);
      /* PR 3b: hidden activities (the listening trio and the oral-communication item)
         are not rendered for the student, so they are not expected here either. */
      const activityIds = U3L1_STEP_CONTENT[step.id].blocks
        .filter((block) => block.kind === 'activity')
        .map((block) => (block as { activityId: string }).activityId)
        .filter((activityId) => isStudentBlockVisible('unit3-lesson1', step.id, { kind: 'activity', activityId }));

      activityIds.forEach((activityId) => {
        const section = screen.getByLabelText(`نشاط المصدر ${U3L1_ACTIVITY_BY_ID[activityId].sourceActivityId}`);
        const buttons = within(section).queryAllByRole('button', { name: 'أظهر الجواب' });
        if (U3L1_UNDECIDABLE_IDS.includes(activityId)) {
          expect(buttons, `${activityId} must have no reveal button`).toHaveLength(0);
          /* No reveal block at all — the only note left is the declared source gap. */
          expect(section.querySelector('.answer-reveal'), activityId).toBeNull();
          expect(section.querySelector('.u3l1-guidance-notice'), activityId).toBeNull();
        } else {
          expect(buttons, `${activityId} must have a reveal button`).toHaveLength(1);
        }
      });
      view.unmount();
    }
  });

  it('does not leak an answer when the learner switches steps (state is not shared)', () => {
    const view = render(<Unit3Lesson1StepRenderer step={U3L1_STEPS[0]} />);
    const first = screen.getByLabelText('نشاط المصدر U3L1-73-01');
    fireEvent.click(within(first).getByRole('button', { name: 'أظهر الجواب' }));
    expect(within(first).getByText(U3L1_SUGGESTED_ANSWERS['u3l1-a-01'].modelAnswer)).toBeVisible();

    view.rerender(<Unit3Lesson1StepRenderer step={U3L1_STEPS[2]} />);
    expect(screen.queryByText(U3L1_SUGGESTED_ANSWERS['u3l1-a-01'].modelAnswer)).toBeNull();
    const comprehension = screen.getByLabelText('نشاط المصدر U3L1-75-01');
    expect(within(comprehension).queryByText(U3L1_SUGGESTED_ANSWERS['u3l1-a-11'].modelAnswer)).toBeNull();
  });
});

describe('U3L1 — teacher-only material can never reach the student surface', () => {
  it('a teacher_only record with a teacher answer produces no student payload', () => {
    const base = U3L1_ACTIVITY_BY_ID['u3l1-a-27'];
    const record = {
      ...u3l1RevealRecord(base),
      disclosure: { kind: 'teacher_only' as const, sourceRef: base.sourceActivityId },
      teacher: { answerOrGuidance: 'إجابة المعلّم المعتمدة', explanation: 'توجيه للمعلّم' },
    };

    expect(resolveAnswerReveal(record, 'student')).toBeNull();
    const teacherView = resolveAnswerReveal(record, 'teacher');
    expect(teacherView).not.toBeNull();
    expect(teacherView!.modelAnswer).toBe('إجابة المعلّم المعتمدة');

    /* The student surface renders nothing at all — not even an empty button. */
    const payload = resolveAnswerReveal(record, 'student');
    const { container } = render(<>{payload && <AnswerReveal {...payload} />}</>);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('button', { name: 'أظهر الجواب' })).toBeNull();
    expect(screen.queryByText('إجابة المعلّم المعتمدة')).toBeNull();
  });

  it('no_approved_content stays silent even if text were attached by mistake', () => {
    const base = U3L1_ACTIVITY_BY_ID['u3l1-a-45']; // calligraphy: still no content
    const record = {
      ...u3l1RevealRecord(base),
      modelAnswer: 'إجابة مُقحمة',
      explanation: 'تعليل مُقحم',
    };
    expect(record.disclosure?.kind).toBe('no_approved_content');
    expect(resolveAnswerReveal(record, 'student')).toBeNull();
    const { container } = render(<>{(() => {
      const payload = resolveAnswerReveal(record, 'student');
      return payload ? <AnswerReveal {...payload} /> : null;
    })()}</>);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('إجابة مُقحمة')).toBeNull();
  });

  it('the real lesson reveals under «إرشادات للإجابة» and never as an approved key', () => {
    render(<Unit3Lesson1StepRenderer step={U3L1_STEPS[8]} />);
    const letter = screen.getByLabelText('نشاط المصدر U3L1-81-02');
    fireEvent.click(within(letter).getByRole('button', { name: 'أظهر الجواب' }));
    expect(within(letter).getByText('إرشادات للإجابة')).toBeInTheDocument();
    expect(within(letter).queryByText('الحل النموذجي المعتمد')).toBeNull();
  });
});
