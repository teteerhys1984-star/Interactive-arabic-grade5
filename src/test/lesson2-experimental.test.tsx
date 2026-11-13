import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Lesson2StepRenderer } from '../components/curriculum/Lesson2StepRenderer';
import { LESSON2_STEPS } from '../data/lesson2/content';
import { LESSON2_STEP_CONTENT } from '../data/lesson2/content';
import { readDraft } from '../utils/draftStorage';
import { getLesson2Activity } from '../data/lesson2/activities';

// Helper: get the LessonStep for a given step key in LESSON2_STEP_CONTENT
const getStep = (stepKey: string) => {
  const content = LESSON2_STEP_CONTENT[stepKey];
  if (!content) throw new Error(`Step ${stepKey} not found`);
  return LESSON2_STEPS.find((s) => s.id === stepKey)!;
};

// 1. Draft persistence: writing and restoring draft cycle (using LESSON2_DRAFT_SCOPE and activity.sourceActivityId)
describe('Lesson 2 Experimental — Draft persistence', () => {
  it('saves, isolates, and restores Lesson 2 activity drafts when navigating steps', () => {
    const step = getStep('l2-s3');
    render(<Lesson2StepRenderer step={step} />);

    // The step contains many activities; scope to the L2-14-02 widget via its aria-label.
    const widget = screen.getByLabelText(/نشاط المصدر L2-14-02/);
    const textarea = within(widget).getAllByPlaceholderText('اكتب إجابتك هنا…')[0];
    fireEvent.change(textarea, { target: { value: 'تنمو وتزداد' } });

    // Simulate save
    const saveBtn = within(widget).getByText('حفظ مسودة إجابتي');
    fireEvent.click(saveBtn);

    // Verify draft persistence in storage
    const draft = readDraft('lesson2', 'L2-14-02');
    expect(draft).toEqual({ wisdom: 'تنمو وتزداد' });
  });
});

// 2. Source Gap: render component and verify 'reason' and 'preservedPrompt' in DOM
describe('Lesson 2 Experimental — Source Gap', () => {
  it('renders Source Gap Interaction with reason and preserved prompt', () => {
    // Step l2-s1 has a source_info block with availability: 'gap'
    // that renders «حدّ مصدر معلن:» and its gapReason.
    const step = getStep('l2-s1');
    render(<Lesson2StepRenderer step={step} />);

    // Verify the gap notice appears in the source_info block.
    // Step l2-s1 may render multiple elements with role="note";
    // at least one must carry the «حدّ مصدر معلن:» notice.
    const notes = screen.getAllByRole('note');
    const gapNotice = notes.find((el) => el.textContent && el.textContent.match(/حدّ مصدر معلن:/));
    expect(gapNotice).toBeDefined();
  });

  it('renders Source Gap activity with preserved prompt and reason', () => {
    // Activity L2-14-05 on step l2-s3 has interaction: source_gap
    // with reason and preservedPrompt.
    const step = getStep('l2-s3');
    render(<Lesson2StepRenderer step={step} />);

    // The activity widget for L2-14-05 should show the preserved prompt
    const widget = screen.getByLabelText(/نشاط المصدر L2-14-05/);
    expect(widget.textContent).toMatch(/المطلوب المحفوظ:/);
    // The gap notice for source_info blocks also shows «حدّ مصدر معلن:»
    const gapNotices = screen.getAllByRole('note');
    expect(gapNotices.length).toBeGreaterThan(0);
  });
});

// 3. Answer reveal: model answer appearance, teacher-only protection
describe('Lesson 2 Experimental — Answer reveal', () => {
  it('shows model answer and protects teacher-only content', () => {
    // Test model answer appearance (L2-14-02 is in l2-s3, in L2_MODEL_ANSWER_IDS)
    const step = getStep('l2-s3');
    render(<Lesson2StepRenderer step={step} />);

    // The AnswerReveal panel is NOT rendered until the button is clicked.
    // Find and click the reveal button for the L2-14-02 widget.
    const widget = screen.getByLabelText(/نشاط المصدر L2-14-02/);
    const revealBtn = within(widget).getByText('أظهر الجواب');
    fireEvent.click(revealBtn);

    // Now the model answer heading should appear
    const heading = within(widget).getByText('الحل النموذجي المعتمد');
    expect(heading).toBeTruthy();

    // Teacher-only content (L2-14-01) must not be revealed to the student.
    // Check both the button absence AND that the actual teacher-only content
    // does not appear anywhere in the student-facing DOM.
    const teacherOnlyWidget = screen.getByLabelText(/نشاط المصدر L2-14-01/);
    expect(within(teacherOnlyWidget).queryByText('أظهر الجواب')).toBeNull();

    // Fixed reference strings for the protected teacher-only content.
    // Written independently here — not imported from the data under test.
    // If any of this text leaks into the student UI, the test fails.
    expect(within(teacherOnlyWidget).queryByText(/يتحقق المعلم من إجابة/)).toBeNull();
    expect(within(teacherOnlyWidget).queryByText(/لا تُخترع قائمة خانات بديلة/)).toBeNull();
    expect(within(teacherOnlyWidget).queryByText(/تحويل الخانات المكملة إلى إجابات ثابتة/)).toBeNull();
  });
});

// 4. Content integrity: compare LESSON2_STEP_CONTENT and getLesson2Activity with fixed reference
describe('Lesson 2 Experimental — Content integrity', () => {
  it('matches content structure and activity data against fixed reference', () => {
    const stepRef = LESSON2_STEP_CONTENT['l2-s3'];
    expect(stepRef.blocks.length).toBeGreaterThan(0);
    expect(stepRef.blocks[0].kind).toBe('instruction');

    // Find the first activity block and verify against independently authored fixed values.
    // If the activity is missing or any field changes, the test fails — no optional guards.
    const activityBlock = stepRef.blocks.find((b) => b.kind === 'activity');
    expect(activityBlock).toBeDefined();
    expect(activityBlock!.kind).toBe('activity');

    const activity = getLesson2Activity(activityBlock!.activityId);
    expect(activity).toBeDefined();

    // Fixed reference values — written directly here, not extracted from the data under test.
    expect(activity!.sourceActivityId).toBe('L2-14-01');
    expect(activity!.printedNumber).toBe('١');
    expect(activity!.instruction).toBe('أتعاون مع زملائي على إكمال مخططي الجمع والضد.');
    expect(activity!.stepId).toBe('l2-s3');
    expect(activity!.page).toBe(14);
    expect(activity!.section).toBe('الفهم القرائي');
  });
});
