import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Lesson2StepRenderer } from '../components/curriculum/Lesson2StepRenderer';
import { LESSON2_STEPS } from '../data/lesson2/content';
import { LESSON2_STEP_CONTENT } from '../data/lesson2/content';
import { clearDraft, readDraft } from '../utils/draftStorage';
import { getLesson2Activity } from '../data/lesson2/activities';

// Helper: get the LessonStep for a given step key in LESSON2_STEP_CONTENT
const getStep = (stepKey: string) => {
  const content = LESSON2_STEP_CONTENT[stepKey];
  if (!content) throw new Error(`Step ${stepKey} not found`);
  return LESSON2_STEPS.find((s) => s.id === stepKey)!;
};

// 1. Draft persistence: real cycle — write, save, unmount, re-render, verify restoration from storage
describe('Lesson 2 Experimental — Draft persistence', () => {
  it('saves, isolates, and restores Lesson 2 activity drafts when navigating steps', () => {
    // Start clean: remove any draft from prior runs.
    clearDraft('lesson2', 'L2-14-02');

    const step = getStep('l2-s3');

    // --- Phase 1: write and save a draft ---
    const { unmount } = render(<Lesson2StepRenderer step={step} />);

    const widget = screen.getByLabelText(/نشاط المصدر L2-14-02/);
    const textareas = within(widget).getAllByPlaceholderText('اكتب إجابتك هنا…');
    const wisdomTextarea = textareas[0]; // first textarea is the 'wisdom' field
    fireEvent.change(wisdomTextarea, { target: { value: 'تنمو وتزداد' } });

    // Save explicitly.
    const saveBtn = within(widget).getByText('حفظ مسودة إجابتي');
    fireEvent.click(saveBtn);

    // Verify the draft is in storage.
    const draft = readDraft('lesson2', 'L2-14-02');
    expect(draft).toEqual({ wisdom: 'تنمو وتزداد' });

    // --- Phase 2: unmount and re-render — the draft must be restored from storage ---
    unmount();

    const { unmount: unmount2 } = render(<Lesson2StepRenderer step={step} />);

    // The widget should be re-created with the draft restored from sessionStorage.
    const restoredWidget = screen.getByLabelText(/نشاط المصدر L2-14-02/);
    const restoredTextareas = within(restoredWidget).getAllByPlaceholderText('اكتب إجابتك هنا…');
    const restoredWisdomTextarea = restoredTextareas[0] as HTMLTextAreaElement;
    expect(restoredWisdomTextarea.value).toBe('تنمو وتزداد');

    // Also verify the storage still holds the value after restoration.
    expect(readDraft('lesson2', 'L2-14-02')).toEqual({ wisdom: 'تنمو وتزداد' });

    unmount2();

    // Clean up so the draft does not leak into other tests.
    clearDraft('lesson2', 'L2-14-02');
  });
});

// 2. Source Gap: verify exact reason and preservedPrompt texts in DOM
describe('Lesson 2 Experimental — Source Gap', () => {
  it('renders source_info gap block with exact gapReason text', () => {
    // Step l2-s1 has a source_info block with availability: 'gap' and
    // gapReason: LISTENING_SOURCE_GAP.
    const step = getStep('l2-s1');
    render(<Lesson2StepRenderer step={step} />);

    // Fixed reference text for the listening source gap reason.
    // Written independently here — not imported from the data under test.
    const LISTENING_GAP_TEXT = 'المادة السمعية غير متوفرة في المصدر المتاح';

    // Find the gap notice that carries this exact text.
    const notes = screen.getAllByRole('note');
    const gapNotice = notes.find(
      (el) => el.textContent && el.textContent.includes(LISTENING_GAP_TEXT),
    );
    expect(gapNotice).toBeDefined();
    expect(gapNotice!.textContent).toContain('حدّ مصدر معلن:');
    expect(gapNotice!.textContent).toContain(LISTENING_GAP_TEXT);
  });

  it('renders source_gap activity with exact reason and preservedPrompt texts', () => {
    // Activity L2-14-05 on step l2-s3 has interaction: source_gap
    // with reason: LOCKED_SOURCE_GAPS.poemDependentDetails
    // and preservedPrompt: 'أكتب رقم البيت الدال على كل من المعنيين.'
    const step = getStep('l2-s3');
    render(<Lesson2StepRenderer step={step} />);

    const widget = screen.getByLabelText(/نشاط المصدر L2-14-05/);

    // Fixed reference texts — written independently, not imported from data.
    const REASON_TEXT = 'لا يثبت القفل النص الكامل أو ترقيم الأبيات';
    const PRESERVED_PROMPT_TEXT = 'أكتب رقم البيت الدال على كل من المعنيين';

    // The exact reason text must appear in the widget's DOM.
    expect(widget.textContent).toContain(REASON_TEXT);
    // The exact preserved prompt text must appear in the widget's DOM.
    expect(widget.textContent).toContain(PRESERVED_PROMPT_TEXT);
  });
});

// 3. Answer reveal: model answer appearance, teacher-only protection for both activities
describe('Lesson 2 Experimental — Answer reveal', () => {
  it('shows model answer for L2-14-02 when reveal button is clicked', () => {
    const step = getStep('l2-s3');
    render(<Lesson2StepRenderer step={step} />);

    // The AnswerReveal panel is NOT rendered until the button is clicked.
    const widget = screen.getByLabelText(/نشاط المصدر L2-14-02/);
    const revealBtn = within(widget).getByText('أظهر الجواب');
    fireEvent.click(revealBtn);

    // The model answer heading should now appear.
    const heading = within(widget).getByText('الحل النموذجي المعتمد');
    expect(heading).toBeTruthy();
  });

  it('protects teacher-only content for L2-14-01 from student DOM', () => {
    const step = getStep('l2-s3');
    render(<Lesson2StepRenderer step={step} />);

    const teacherOnlyWidget = screen.getByLabelText(/نشاط المصدر L2-14-01/);

    // No reveal button at all.
    expect(within(teacherOnlyWidget).queryByText('أظهر الجواب')).toBeNull();

    // Fixed reference strings for the protected teacher-only content.
    // Written independently here — not imported from the data under test.
    // If any of this text leaks into the student UI, the test fails.
    expect(within(teacherOnlyWidget).queryByText(/يتحقق المعلم من إجابة/)).toBeNull();
    expect(within(teacherOnlyWidget).queryByText(/لا تُخترع قائمة خانات بديلة/)).toBeNull();
    expect(within(teacherOnlyWidget).queryByText(/تحويل الخانات المكملة إلى إجابات ثابتة/)).toBeNull();
  });

  it('protects teacher-only content for L2-19-07 from student DOM', () => {
    const step = getStep('l2-s6');
    render(<Lesson2StepRenderer step={step} />);

    const teacherOnlyWidget = screen.getByLabelText(/نشاط المصدر L2-19-07/);

    // No reveal button at all.
    expect(within(teacherOnlyWidget).queryByText('أظهر الجواب')).toBeNull();

    // Fixed reference strings for the protected teacher-only content.
    // Written independently here — not imported from the data under test.
    expect(within(teacherOnlyWidget).queryByText(/يحلل المعلم/)).toBeNull();
    expect(within(teacherOnlyWidget).queryByText(/لا ينشئ جدول إجابات بديلاً/)).toBeNull();
    expect(within(teacherOnlyWidget).queryByText(/توليد صفوف أو أمثلة جديدة/)).toBeNull();
  });
});

// 4. Content integrity: compare activity data against independently authored fixed values
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
