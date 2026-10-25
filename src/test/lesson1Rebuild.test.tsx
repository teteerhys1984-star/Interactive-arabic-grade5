import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../App';
import { LessonShell } from '../components/curriculum/LessonShell';
import { Lesson1StepRenderer } from '../components/curriculum/Lesson1StepRenderer';
import { Lesson1IrabPage } from '../components/curriculum/Lesson1IrabPage';
import { getLessonById } from '../data/curriculumRegistry';
import {
  LESSON1_SOURCE_RECORDS,
  PENDING_SOURCE_IDS,
} from '../data/lesson1/readingSource';
import {
  LESSON1_STEPS,
  LESSON1_STEP_CONTENT,
  LessonBlock,
} from '../data/lesson1/content';
import { COVERAGE, PENDING_ACTIVITY_IDS, TEXTBOOK_ACTIVITIES } from '../data/lesson1/activities';
import { IRAB_ISSUE_REGISTER, LESSON1_IRAB_PAGE } from '../data/lesson1/irabPage';
import {
  APPROVED_READINGS,
  DOCUMENTED_CORRECTIONS,
  SOURCE_PENDING_DECISIONS,
} from '../data/lesson1/sourceMeta';

/**
 * Lesson 1 rebuild — source-fidelity, pending-item, interaction and navigation tests.
 *
 * COMPLETENESS IS PROVED TEXTUALLY, NOT BY COUNTS: every frozen source record must
 * appear verbatim (diacritics/whitespace-insensitive) in what the lesson renders.
 * Counts are asserted only as metadata.
 */

const lesson1 = getLessonById('lesson1')!.lesson;
const lesson2 = getLessonById('lesson2')!.lesson;
const stepById = (id: string) => LESSON1_STEPS.find((step) => step.id === id)!;

/** Diacritics/whitespace/punctuation-insensitive comparison form. */
const norm = (value: string): string =>
  value
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '')
    .trim();

const textOf = (value: string | string[]): string =>
  Array.isArray(value) ? value.join('') : value;

const blockText = (block: LessonBlock): string => {
  switch (block.kind) {
    case 'source_passage':
      return `${block.heading}${block.paragraphs.join('')}`;
    case 'source_sentences':
      return `${block.heading}${block.sentences.join('')}`;
    case 'vocab':
      return `${block.heading}${block.items.map((item) => `${item.term}:${item.meaning}`).join('')}`;
    case 'rule':
      return `${block.heading}${block.lines.join('')}`;
    case 'instruction':
      return `${block.heading}${block.text}`;
    case 'explanation':
      return `${block.heading}${block.lines.join('')}`;
    default:
      return '';
  }
};

/** Everything the lesson layer puts in front of the learner, concatenated in render order. */
const renderedCorpus = (): string =>
  LESSON1_STEPS.map((step) => LESSON1_STEP_CONTENT[step.id])
    .flatMap((content) => content.blocks)
    .map((block) => {
      if (block.kind === 'activity') {
        const activity = TEXTBOOK_ACTIVITIES.find((item) => item.id === block.activityId);
        if (!activity) return '';
        return [
          activity.instruction,
          activity.printedVariant ?? '',
          activity.correctionNote ?? '',
          activity.pendingNote ?? '',
        ].join('');
      }
      return blockText(block);
    })
    .join('');

const CORPUS = norm(renderedCorpus());

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Lesson 1 — per-identifier source fidelity', () => {
  it('renders all 84 frozen source records verbatim (textual proof, not counts)', () => {
    expect(LESSON1_SOURCE_RECORDS).toHaveLength(84);

    const missing = LESSON1_SOURCE_RECORDS.filter(
      (record) => !CORPUS.includes(norm(textOf(record.text))),
    );

    expect(missing.map((record) => `${record.id} (p${record.page})`)).toEqual([]);
  });

  it('keeps every record traceable to its page, layer and status', () => {
    LESSON1_SOURCE_RECORDS.forEach((record) => {
      expect(record.id).toMatch(/^L1-\d{3}$/);
      expect(record.page).toBeGreaterThanOrEqual(4);
      expect(record.page).toBeLessThanOrEqual(11);
      expect(['printed', 'owner', 'corrected', 'platform']).toContain(record.layer);
      expect(['solved', 'implemented']).toContain(record.status);
      expect(textOf(record.text).length).toBeGreaterThan(0);
    });

    // counting method (published metadata only): 84 identifiers, pages 4–11
    const perPage = LESSON1_SOURCE_RECORDS.reduce<Record<number, number>>((acc, record) => {
      acc[record.page] = (acc[record.page] ?? 0) + 1;
      return acc;
    }, {});
    expect(perPage).toEqual({ 4: 10, 5: 24, 6: 9, 7: 8, 8: 8, 9: 10, 10: 8, 11: 7 });
  });

  it('keeps the pending set exact and never counts pending items as solved', () => {
    expect(PENDING_SOURCE_IDS).toEqual(['L1-036', 'L1-080']);
    expect(
      LESSON1_SOURCE_RECORDS.filter((record) => record.status !== 'solved').map((record) => record.id),
    ).toEqual(PENDING_SOURCE_IDS);
    expect(SOURCE_PENDING_DECISIONS.map((item) => item.recordId)).toEqual(PENDING_SOURCE_IDS);

    expect(COVERAGE.discovered).toBe(39);
    expect(COVERAGE.implemented).toBe(39);
    expect(COVERAGE.solved).toBe(37);
    expect(COVERAGE.pending).toBe(2);
    expect(COVERAGE.unresolved).toBe(0);
    expect(PENDING_ACTIVITY_IDS).toEqual(['a-p6-1', 'a-p11-1']);
    expect(
      TEXTBOOK_ACTIVITIES.filter((activity) => activity.status !== 'solved').map((activity) => activity.id),
    ).toEqual(PENDING_ACTIVITY_IDS);
  });

  it('retains the printed wording beside every documented correction', () => {
    const corrected = LESSON1_SOURCE_RECORDS.filter((record) => record.layer === 'corrected');
    expect(corrected.map((record) => record.id)).toEqual(['L1-057']);
    corrected.forEach((record) => {
      expect(record.printedVariant).toBeTruthy();
      expect(record.note).toBeTruthy();
      expect(textOf(record.printedVariant as string | string[])).toContain('يقبضون');
    });

    expect(DOCUMENTED_CORRECTIONS).toHaveLength(1);
    expect(DOCUMENTED_CORRECTIONS[0].printed).toContain('يقبضون');
    expect(DOCUMENTED_CORRECTIONS[0].corrected).toContain('يقضون');

    const activity = TEXTBOOK_ACTIVITIES.find((item) => item.id === 'a-p8-5')!;
    expect(activity.instruction).toContain('يقضون');
    expect(activity.printedVariant).toContain('يقبضون');
    expect(activity.correctionNote).toBeTruthy();
  });

  it('badges owner-adopted readings without presenting unadopted faces as settled', () => {
    const ownerRecords = LESSON1_SOURCE_RECORDS.filter((record) => record.layer === 'owner');
    expect(ownerRecords.map((record) => record.id)).toEqual(['L1-016', 'L1-036', 'L1-062', 'L1-068']);
    expect(APPROVED_READINGS.map((reading) => reading.recordId)).toEqual([
      'L1-016',
      'L1-036',
      'L1-062',
      'L1-068',
    ]);
    APPROVED_READINGS.forEach((reading) => {
      expect(reading.adopted.length).toBeGreaterThan(0);
      expect(reading.decision.length).toBeGreaterThan(0);
    });

    // The adopted p5 reading stays verbatim; the rejected faces live only in the issue register.
    expect(CORPUS).toContain(norm('جدّي رَوَتْ لي'));
    expect(CORPUS).toContain(norm('وامْنَحْني'));
    expect(CORPUS).toContain(norm('السَّببُ'));
  });

  it('keeps the lesson metadata aligned with the printed title and theme', () => {
    expect(lesson1.steps).toHaveLength(LESSON1_STEPS.length);
    expect(lesson1.steps.map((step) => step.id)).toEqual(LESSON1_STEPS.map((step) => step.id));
    expect(CORPUS).toContain(norm(lesson1.metadata.title));
    expect(CORPUS).toContain(norm('السَّمَكَةُ الذَّهَبِيَّةُ'));
    expect(CORPUS).toContain(norm('أحلامي الكبيرةُ'));
  });

  it('keeps all 39 textbook activities present exactly once in the step content', () => {
    const activityIds = LESSON1_STEPS.flatMap((step) =>
      LESSON1_STEP_CONTENT[step.id].blocks
        .filter((block) => block.kind === 'activity')
        .map((block) => (block.kind === 'activity' ? block.activityId : '')),
    );
    expect(activityIds).toHaveLength(39);
    expect(new Set(activityIds).size).toBe(39);
    expect(new Set(activityIds)).toEqual(new Set(TEXTBOOK_ACTIVITIES.map((activity) => activity.id)));

    // every activity instruction is derived from the frozen source records
    TEXTBOOK_ACTIVITIES.forEach((activity) => {
      expect(activity.sourceRecordIds.length).toBeGreaterThan(0);
      activity.sourceRecordIds.forEach((id) => {
        expect(LESSON1_SOURCE_RECORDS.some((record) => record.id === id)).toBe(true);
      });
      expect(norm(activity.instruction).length).toBeGreaterThan(0);
    });
  });
});

describe('Lesson 1 — pending items never expose an unapproved answer', () => {
  it('disables the check on the decode activity and never prints the draft key', () => {
    const { container } = render(<Lesson1StepRenderer step={stepById('l1-s10')} />);
    const decodeActivity = screen.getByLabelText('نشاط ١ (ألعب وأتعلم)');
    const checkButton = within(decodeActivity).getByRole('button', { name: 'تحقّق من إجاباتي' });

    expect(checkButton).toBeDisabled();
    expect(within(decodeActivity).getByText(/بندٌ معلّق \(غير محلول\)/)).toBeInTheDocument();

    const bodyText = container.textContent ?? '';
    expect(bodyText).not.toContain('الصدق منجاة');
    expect(bodyText).not.toContain('أحب بلادي');
    expect(bodyText).not.toContain('مُربَّع أزرق'); // draft shape key stays out of the student UI
  });

  it('marks the «قَصَّتْ» meaning field as pending with no invented key', () => {
    const { container } = render(<Lesson1StepRenderer step={stepById('l1-s4')} />);
    const firstActivity = screen.getByLabelText('نشاط ١ (الفهم القرائي)');
    const pendingInput = within(firstActivity).getByLabelText('معنى (قَصَّتْ) (معلّق)');

    expect(pendingInput).toBeInTheDocument();
    fireEvent.click(within(firstActivity).getByRole('button', { name: 'تحقّق من إجاباتي' }));

    expect(within(firstActivity).getByText(/معلّق بقرار صاحب المشروع/)).toBeInTheDocument();
    const bodyText = container.textContent ?? '';
    ['مَضَتْ', 'حَكَتْ', 'قَصَّتْ بمعنى', 'روت'].forEach((invented) => {
      expect(bodyText).not.toContain(invented);
    });
    // the solved fields of the same activity are still checked normally
    expect(within(firstActivity).getAllByText(/لم تُكتب إجابة بعد/)).toHaveLength(2);
  });
});

describe('Lesson 1 — activity interaction protocol', () => {
  it('reveals nothing on selection, then gives per-item feedback, explanation and retry', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s4')} />);
    const choiceActivity = screen.getByLabelText('نشاط ٥ (الفهم القرائي)');
    const wrongChoice = within(choiceActivity).getByRole('button', { name: 'سمكةٍ من الذهب.' });
    const modelAnswerButton = within(choiceActivity).getByRole('button', {
      name: 'اعرض الإجابة النموذجية (بعد المحاولة)',
    });

    // 1) selection alone reveals nothing
    fireEvent.click(wrongChoice);
    expect(wrongChoice).toHaveAttribute('aria-pressed', 'true');
    expect(choiceActivity.textContent).not.toContain('✔');
    expect(choiceActivity.textContent).not.toContain('⟳');
    expect(choiceActivity.textContent).not.toContain('نتيجة التحقّق');
    expect(modelAnswerButton).toBeDisabled();

    // 2) check → per-item result + why-wrong
    fireEvent.click(within(choiceActivity).getByRole('button', { name: 'تحقّق من إجاباتي' }));
    expect(choiceActivity.textContent).toContain('⟳ يحتاج مراجعة');
    expect(choiceActivity.textContent).toContain('العملِ والتّعاونِ');
    expect(choiceActivity.textContent).toContain('نتيجة التحقّق');

    // 3) model answer unlocks only after the first check, and is labelled
    expect(modelAnswerButton).toBeEnabled();
    fireEvent.click(modelAnswerButton);
    expect(choiceActivity.textContent).toContain('الإجابة النموذجية (منصة)');

    // 4) edit & retry
    fireEvent.click(within(choiceActivity).getByRole('button', { name: 'عدّل إجاباتي' }));
    expect(choiceActivity.textContent).not.toContain('⟳');
    fireEvent.click(within(choiceActivity).getByRole('button', { name: 'العملِ والتّعاونِ.' }));
    // the verdict of the previous attempt is gone until the learner checks again
    expect(choiceActivity.textContent).not.toContain('⟳');
    fireEvent.click(within(choiceActivity).getByRole('button', { name: 'تحقّق مجدّدًا' }));
    expect(choiceActivity.textContent).toContain('✔ اختيار صحيح');
  });

  it('checks written fields against the approved key and explains why an answer was not accepted', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s4')} />);
    const firstActivity = screen.getByLabelText('نشاط ١ (الفهم القرائي)');

    fireEvent.change(within(firstActivity).getByLabelText('جمع(الشَّبَكَة)'), {
      target: { value: 'الشباك' },
    });
    fireEvent.change(within(firstActivity).getByLabelText('ضدّ (فرح)'), { target: { value: 'فرح' } });
    fireEvent.click(within(firstActivity).getByRole('button', { name: 'تحقّق من إجاباتي' }));

    expect(firstActivity.textContent).toContain('✔ إجابة صحيحة');
    expect(firstActivity.textContent).toContain('لماذا لم تُقبل؟');
    expect(firstActivity.textContent).toContain('حزن');

    // retry after editing
    fireEvent.change(within(firstActivity).getByLabelText('ضدّ (فرح)'), { target: { value: 'حزن' } });
    fireEvent.click(within(firstActivity).getByRole('button', { name: 'تحقّق مجدّدًا' }));
    expect(firstActivity.textContent).not.toContain('لماذا لم تُقبل؟');
  });

  it('renders the printed table and diagram widgets with their given cells', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s4')} />);

    const diagram = screen.getByLabelText('نشاط ٣ (الفهم القرائي)');
    expect(within(diagram).getByText('لجوءُ الصيّاد إلى البحر للحصول على سمكة ذهبيّة')).toBeInTheDocument();
    expect(within(diagram).getByText('اصطيادُ الصيّادين السمكَ الإضافيّ')).toBeInTheDocument();
    expect(within(diagram).getByLabelText('فارغ ١ في مخطط الأحداث')).toBeInTheDocument();
    expect(within(diagram).getByLabelText('فارغ ٢ في مخطط الأحداث')).toBeInTheDocument();

    const table = screen.getByLabelText('نشاط ٤ (الفهم القرائي)');
    expect(within(table).getByRole('table')).toBeInTheDocument();
    expect(within(table).getAllByRole('columnheader').map((head) => head.textContent)).toEqual([
      'السّبب',
      'النّتيجة',
      'العِبرة التي تدلّ عليه',
    ]);
    expect(within(table).getByText('توفّرُ المال مع الصيّادين')).toBeInTheDocument();
    expect(within(table).getByText('سرورُ البحرِ وطربُهُ.')).toBeInTheDocument();
  });

  it('shows the four-column spelling table including the owner-adopted «السَّببُ» header', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s7')} />);
    const activity = screen.getByLabelText('نشاط ٥ (إملاء)');
    expect(within(activity).getAllByRole('columnheader').map((head) => head.textContent)).toEqual([
      'همزةُ القطع',
      'موقعُها بالنسبةِ إلى الألف',
      'السَّببُ',
      'همزةُ الوصل',
    ]);
    expect(activity.textContent).toContain('قال لي أبي: انظرْ إلى أعمالِ الآخرين');
  });

  it('shows the documented correction with the printed variant in the grammar step', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s6')} />);
    const activity = screen.getByLabelText('نشاط ١ (التقويم النهائي)');
    expect(activity.textContent).toContain('يقضون');
    expect(activity.textContent).toContain('يقبضون');
    expect(activity.textContent).toContain('تصحيح معتمد (المطبوع محفوظ)');
    expect(activity.textContent).toContain('النصّ المطبوع المحفوظ');
  });
});

describe('Lesson 1 — standalone i‘rab page', () => {
  it('holds 19 core sentences and a separate 5-entry issue register', () => {
    expect(LESSON1_IRAB_PAGE).toHaveLength(19);
    expect(IRAB_ISSUE_REGISTER).toHaveLength(5);
    expect(new Set(LESSON1_IRAB_PAGE.map((sentence) => sentence.id)).size).toBe(19);

    LESSON1_IRAB_PAGE.forEach((sentence) => {
      expect(sentence.words.length).toBeGreaterThanOrEqual(2);
      expect(sentence.source.readabilityVerified).toBe(true);
      expect(sentence.teachingPoint.length).toBeGreaterThan(0);
      sentence.words.forEach((word) => {
        expect(word.w.length).toBeGreaterThan(0);
        expect(word.fn.length).toBeGreaterThan(0);
        expect(word.ir.length).toBeGreaterThan(0);
        expect(word.sg.length).toBeGreaterThan(0);
      });
    });

    // the excluded sentence must not appear in the core set
    expect(
      LESSON1_IRAB_PAGE.some((sentence) => sentence.sentence.includes('يحتاجون')),
    ).toBe(false);
    expect(IRAB_ISSUE_REGISTER.some((entry) => entry.sentence.includes('يحتاجون'))).toBe(true);
  });

  it('renders RTL, keeps the contested sentence in the register with no settled analysis', () => {
    const { container } = render(<Lesson1IrabPage onBack={() => undefined} />);

    expect(container.querySelector('.lesson1-irab')).toHaveAttribute('dir', 'rtl');
    expect(screen.getByRole('heading', { level: 2, name: /الإعراب التطبيقي/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /سجلّ الإشكالات/ })).toBeInTheDocument();

    const register = container.querySelector('.irab-register') as HTMLElement;
    expect(within(register).getByText(/عندي خمسةُ أولادٍ وزوجةٌ يحتاجون إلى طعامٍ كثيرٍ/)).toBeInTheDocument();
    expect(register.textContent).toContain('غير محسوم');

    // no word-by-word table for any register entry, and no settledParts leaked to the UI
    const tables = Array.from(container.querySelectorAll('table'));
    expect(tables).toHaveLength(LESSON1_IRAB_PAGE.length);
    tables.forEach((table) => expect(table.textContent).not.toContain('يحتاجون'));
    // the uncontested morphology of the excluded sentence stays in the data layer only
    expect(container.textContent).not.toContain('ضمن تركيب العدد');
    expect(container.textContent).not.toContain('بانتظار اعتماد');
  });

  it('keeps the round trip lesson → i‘rab → back with the learner on the same step', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /السَّمَكَةُ الذَّهَبِيَّةُ/ }));
    const stepButtons = screen.getAllByRole('button', { name: /^الخطوة \d+:/ });
    expect(stepButtons).toHaveLength(10);
    fireEvent.click(stepButtons[5]);
    expect(stepButtons[5]).toHaveAttribute('aria-current', 'step');

    fireEvent.click(screen.getByRole('button', { name: 'افتح صفحة الإعراب التطبيقي' }));
    expect(screen.getByRole('heading', { level: 2, name: /الإعراب التطبيقي/ })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /العودة إلى خطوات الدرس/ })[0]);
    expect(screen.queryByRole('heading', { level: 2, name: /الإعراب التطبيقي/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })[5]).toHaveAttribute('aria-current', 'step');
  });

  it('does not expose the Lesson-1 i‘rab page from other lessons', () => {
    render(
      <LessonShell lesson={lesson2} renderStepContent={(step) => <p>{step.title}</p>} />,
    );
    expect(screen.queryByRole('button', { name: /الإعراب التطبيقي/ })).not.toBeInTheDocument();
  });
});

describe('Lesson 1 — unified attempt → check protocol (platform drills and activities)', () => {
  const grammarPrompt = 'ما نوع المثال الإضافي «يَبْني الصَّيّادُ مَرْكَباً»؟';
  const hamzaPrompt = 'ما نوع الهمزة في الكلمة الواردة في الكتاب «امْنَحْني»؟';

  /** The drill section (options + «تحقّق» + feedback live in one panel). */
  const drillPanel = (container: HTMLElement): HTMLElement => {
    const panel = container.querySelector('.platform-quick-check');
    expect(panel).not.toBeNull();
    return panel as HTMLElement;
  };

  it('reveals nothing on selection in the grammar drill, and allows changing the answer before checking', () => {
    const { container } = render(<Lesson1StepRenderer step={stepById('l1-s6')} />);
    const drill = drillPanel(container);

    expect(screen.getByRole('group', { name: grammarPrompt })).toBeInTheDocument();
    const verbal = within(drill).getByRole('button', { name: 'جملة فعلية' });
    const nominal = within(drill).getByRole('button', { name: 'جملة اسمية' });

    // 1) attempt — no verdict of any kind
    fireEvent.click(verbal);
    expect(verbal).toHaveAttribute('aria-pressed', 'true');
    expect(within(drill).queryByRole('status')).not.toBeInTheDocument();
    expect(drill.querySelector('.quick-check-answer')).toBeNull();
    expect(drill.textContent).not.toContain('صحيح:');
    expect(drill.textContent).not.toContain('جرّب مرة أخرى');
    expect(container.querySelectorAll('.is-answer-correct, .is-answer-wrong, .is-answer-missed')).toHaveLength(0);
    expect(container.innerHTML).not.toContain('is-answer-');

    // 2) the answer can still be changed before checking
    fireEvent.click(nominal);
    expect(nominal).toHaveAttribute('aria-pressed', 'true');
    expect(verbal).toHaveAttribute('aria-pressed', 'false');
    expect(within(drill).queryByRole('status')).not.toBeInTheDocument();

    // 3) check → correctness + the correct answer + the explanation
    fireEvent.click(within(drill).getByRole('button', { name: 'تحقّق' }));
    expect(within(drill).getByRole('status')).toHaveTextContent('جرّب مرة أخرى');
    expect(drill.textContent).toContain('الإجابة الصحيحة');
    expect(drill.textContent).toContain('جملة فعلية');
    expect(drill.textContent).toContain('الجملة التي تبدأ بفعلٍ فعليةٌ');
    expect(nominal.className).toContain('is-answer-wrong');
    expect(verbal.className).toContain('is-answer-missed');

    // 4) edit & retry: a new choice clears the verdict until the next check
    fireEvent.click(within(drill).getByRole('button', { name: 'عدّل إجابتي' }));
    expect(within(drill).queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(verbal);
    expect(within(drill).queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(within(drill).getByRole('button', { name: 'تحقّق' }));
    expect(within(drill).getByRole('status')).toHaveTextContent('صحيح: أول كلمة أساسية');
    expect(verbal.className).toContain('is-answer-correct');
  });

  it('applies the same protocol to the spelling drill', () => {
    const { container } = render(<Lesson1StepRenderer step={stepById('l1-s7')} />);
    const drill = drillPanel(container);

    expect(screen.getByRole('group', { name: hamzaPrompt })).toBeInTheDocument();
    const checkButton = within(drill).getByRole('button', { name: 'تحقّق' });
    expect(checkButton).toBeDisabled(); // nothing chosen yet
    expect(container.querySelectorAll('.is-answer-correct, .is-answer-wrong')).toHaveLength(0);

    const cut = within(drill).getByRole('button', { name: 'همزة قطع' });
    const wasl = within(drill).getByRole('button', { name: 'همزة وصل' });

    fireEvent.click(cut);
    expect(within(drill).queryByRole('status')).not.toBeInTheDocument();

    fireEvent.click(checkButton);
    expect(within(drill).getByRole('status')).toHaveTextContent('لاحظ شكل البداية');
    expect(drill.textContent).toContain('الإجابة الصحيحة');
    expect(drill.textContent).toContain('همزة وصل');
    expect(cut.className).toContain('is-answer-wrong');

    // changing the answer clears the verdict; re-checking grades the new choice
    fireEvent.click(wasl);
    expect(within(drill).queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(within(drill).getByRole('button', { name: 'تحقّق' }));
    expect(within(drill).getByRole('status')).toHaveTextContent('أحسنت');
    expect(wasl.className).toContain('is-answer-correct');
  });

  it('grades the latest written answer and explains why an earlier one was not accepted', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s4')} />);
    const activity = screen.getByLabelText('نشاط ١ (الفهم القرائي)');
    const pluralField = within(activity).getByLabelText('جمع(الشَّبَكَة)');

    // attempt without checking → no result, no key, no model answer
    fireEvent.change(pluralField, { target: { value: 'الشباك' } });
    expect(activity.textContent).not.toContain('✔');
    expect(activity.textContent).not.toContain('⟳');
    expect(activity.textContent).not.toContain('نتيجة التحقّق');
    expect(
      within(activity).getByRole('button', { name: 'اعرض الإجابة النموذجية (بعد المحاولة)' }),
    ).toBeDisabled();

    // change the answer before checking — the check grades the newest value
    fireEvent.change(pluralField, { target: { value: 'السمكات' } });
    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق من إجاباتي' }));
    expect(activity.textContent).toContain('⟳ تحتاج مراجعة');
    expect(activity.textContent).toContain('لماذا لم تُقبل؟');
    expect(activity.textContent).toContain('الشِّباك');

    // edit & retry with an accepted answer
    fireEvent.change(pluralField, { target: { value: 'الشِّباك' } });
    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق مجدّدًا' }));
    expect(activity.textContent).toContain('✔ إجابة صحيحة');
    expect(activity.textContent).not.toContain('لماذا لم تُقبل؟');
  });

  it('keeps the classify drill silent until the check, then shows the right category', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s7')} />);
    const activity = screen.getByLabelText('نشاط ٤ (إملاء)');
    const row = within(activity).getByText('أرغبُ').closest('.l1-classify-row') as HTMLElement;

    fireEvent.click(within(row).getByRole('button', { name: 'همزةُ وصلٍ' }));
    expect(activity.textContent).not.toContain('✔');
    expect(activity.textContent).not.toContain('⟳');
    expect(activity.textContent).not.toContain('الصواب');

    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق من إجاباتي' }));
    expect(within(row).getByText(/⟳ يحتاج مراجعة/)).toBeInTheDocument();
    expect(row.textContent).toContain('الصواب: «همزةُ قطعٍ»');
  });
});

describe('Lesson 1 — event-diagram grading and stale-verdict clearing', () => {
  const countMarks = (text: string, mark: string): number => (text.match(new RegExp(mark, 'g')) ?? []).length;

  it('does not accept arbitrary text in the diagram blanks and keeps item results equal to the summary', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s4')} />);
    const activity = screen.getByLabelText('نشاط ٣ (الفهم القرائي)');
    const blank1 = within(activity).getByLabelText('فارغ ١ في مخطط الأحداث');
    const blank2 = within(activity).getByLabelText('فارغ ٢ في مخطط الأحداث');

    // the printed instruction, diagram order, given boxes and arrows stay intact
    expect(activity.textContent).toContain('أكملُ أحداثَ القصّة مستعينًا بالشكل (٥ صناديق وسهمان):');
    expect(within(activity).getAllByRole('textbox')).toHaveLength(2);
    expect(activity.querySelectorAll('.l1-diagram-arrow')).toHaveLength(4);
    [
      'لجوءُ الصيّاد إلى البحر للحصول على سمكة ذهبيّة',
      'اتفاقُ الصياد مع زملائه على صيد سمكة إضافيّة',
      'اصطيادُ الصيّادين السمكَ الإضافيّ',
    ].forEach((given) => expect(within(activity).getByText(given)).toBeInTheDocument());

    // 1) arbitrary text is NOT correct
    fireEvent.change(blank1, { target: { value: 'أيّ كلام عشوائي' } });
    fireEvent.change(blank2, { target: { value: '١٢٣' } });
    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق من إجاباتي' }));
    expect(activity.textContent).not.toContain('✔');
    expect(countMarks(activity.textContent ?? '', '⟳')).toBe(2);
    expect(activity.textContent).toContain('نتيجة التحقّق: ٠ صحيحة، و٢ تحتاج مراجعة');

    // 2) editing clears the previous verdict immediately (nothing about the new value)
    fireEvent.change(blank1, { target: { value: 'نصيحة البحر بالتعاون مع زملائه' } });
    expect(activity.textContent).not.toContain('✔');
    expect(activity.textContent).not.toContain('⟳');
    expect(activity.textContent).not.toContain('نتيجة التحقّق');
    expect(blank1).toHaveValue('نصيحة البحر بالتعاون مع زملائه');

    // 3) source-backed answers are accepted; per-item marks match the summary counts
    fireEvent.change(blank2, { target: { value: 'توفّر المال وبناء المركب' } });
    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق مجدّدًا' }));
    expect(countMarks(activity.textContent ?? '', '✔')).toBe(2);
    expect(activity.textContent).not.toContain('⟳');
    expect(activity.textContent).toContain('نتيجة التحقّق: ٢ صحيحة');

    // 4) empty blanks are never marked correct
    fireEvent.change(blank1, { target: { value: '' } });
    fireEvent.change(blank2, { target: { value: '' } });
    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق مجدّدًا' }));
    expect(activity.textContent).not.toContain('✔');
    expect(countMarks(activity.textContent ?? '', '⟡')).toBe(2);
    expect(activity.textContent).toContain('نتيجة التحقّق: ٠ صحيحة');
  });

  it('reports a pending blank as pending in both the item result and the summary', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s4')} />);
    const activity = screen.getByLabelText('نشاط ١ (الفهم القرائي)');

    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق من إجاباتي' }));
    expect(activity.textContent).toContain('⏸ هذا الفراغ معلّق بقرار صاحب المشروع');
    expect(activity.textContent).not.toContain('✔');
    expect(activity.textContent).toContain('نتيجة التحقّق: ٠ صحيحة، و١ معلّقة بقرار صاحب المشروع');
  });

  it('clears the stale verdict at once when a written answer is edited, then grades the new value', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s4')} />);
    const activity = screen.getByLabelText('نشاط ٢ (الفهم القرائي)');
    const field = within(activity).getByLabelText('خفقَ البحرُ بموجهِ');

    fireEvent.change(field, { target: { value: 'طائرٌ صغير' } });
    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق من إجاباتي' }));
    expect(activity.textContent).toContain('⟳ تحتاج مراجعة');
    expect(activity.textContent).toContain('لماذا لم تُقبل؟');

    fireEvent.change(field, { target: { value: 'اضطرب' } });
    expect(activity.textContent).not.toContain('⟳');
    expect(activity.textContent).not.toContain('✔');
    expect(activity.textContent).not.toContain('نتيجة التحقّق');
    expect(field).toHaveValue('اضطرب');

    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق مجدّدًا' }));
    expect(activity.textContent).toContain('✔ إجابة صحيحة');
    expect(activity.textContent).not.toContain('لماذا لم تُقبل؟');
  });

  it('clears the stale verdict when a single choice is changed before checking again', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s4')} />);
    const activity = screen.getByLabelText('نشاط ٥ (الفهم القرائي)');

    fireEvent.click(within(activity).getByRole('button', { name: 'سمكةٍ من الذهب.' }));
    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق من إجاباتي' }));
    expect(activity.textContent).toContain('⟳ يحتاج مراجعة');

    fireEvent.click(within(activity).getByRole('button', { name: 'العملِ والتّعاونِ.' }));
    expect(activity.textContent).not.toContain('⟳');
    expect(activity.textContent).not.toContain('✔');
    expect(activity.textContent).not.toContain('نتيجة التحقّق');

    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق مجدّدًا' }));
    expect(activity.textContent).toContain('✔ اختيار صحيح');
  });

  it('clears the stale verdict when a multi-select answer is changed', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s4')} />);
    const activity = screen.getByLabelText('نشاط ٦ (الفهم القرائي)');

    fireEvent.click(within(activity).getByRole('button', { name: 'البحرُ ضاحكٌ' }));
    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق من إجاباتي' }));
    expect(activity.textContent).toContain('⟳ يحتاج مراجعة');
    expect(activity.textContent).toContain('فاتك');

    fireEvent.click(within(activity).getByRole('button', { name: 'استمعَ البحرُ إلى أغاني الصيّادين.' }));
    expect(activity.textContent).not.toContain('⟳');
    expect(activity.textContent).not.toContain('✔');

    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق مجدّدًا' }));
    expect(activity.textContent).toContain('✔ اختيار صحيح');
    expect(activity.textContent).toContain('نتيجة التحقّق: ١ صحيحة');
  });

  it('clears the stale verdict when a classification choice is changed', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s7')} />);
    const activity = screen.getByLabelText('نشاط ٤ (إملاء)');
    const row = within(activity).getByText('أرغبُ').closest('.l1-classify-row') as HTMLElement;

    fireEvent.click(within(row).getByRole('button', { name: 'همزةُ وصلٍ' }));
    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق من إجاباتي' }));
    expect(row.textContent).toContain('⟳ يحتاج مراجعة');

    fireEvent.click(within(row).getByRole('button', { name: 'همزةُ قطعٍ' }));
    expect(activity.textContent).not.toContain('⟳');
    expect(activity.textContent).not.toContain('✔');

    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق مجدّدًا' }));
    expect(row.textContent).toContain('✔ تصنيف صحيح');
  });

  it('clears the stale verdict when a table cell is edited', () => {
    render(<Lesson1StepRenderer step={stepById('l1-s6')} />);
    const activity = screen.getByLabelText('نشاط ١ (التقويم النهائي)');
    const cell = within(activity).getByLabelText('نوعُها — صف 1');

    fireEvent.change(cell, { target: { value: 'اسمية' } });
    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق من إجاباتي' }));
    expect(activity.textContent).toContain('✔ إجابة صحيحة');

    fireEvent.change(cell, { target: { value: 'فعلية' } });
    expect(activity.textContent).not.toContain('✔');
    expect(activity.textContent).not.toContain('⟳');
    expect(activity.textContent).not.toContain('نتيجة التحقّق');

    fireEvent.click(within(activity).getByRole('button', { name: 'تحقّق مجدّدًا' }));
    expect(activity.textContent).toContain('⟳ تحتاج مراجعة');
    expect(activity.textContent).toContain('اسمية');
  });

  it('keeps every Lesson-1 activity silent before the first check (regression sweep)', () => {
    LESSON1_STEPS.forEach((step) => {
      const { container } = render(<Lesson1StepRenderer step={step} />);
      const activities = screen.queryAllByLabelText(/^نشاط /);
      expect(activities.length).toBeGreaterThan(0);

      activities.forEach((activity) => {
        // before any check: no verdict, no key, model answer locked
        expect(activity.textContent).not.toContain('✔');
        expect(activity.textContent).not.toContain('⟳');
        expect(activity.textContent).not.toContain('نتيجة التحقّق');
        const modelAnswer = within(activity).queryByRole('button', {
          name: 'اعرض الإجابة النموذجية (بعد المحاولة)',
        });
        if (modelAnswer) expect(modelAnswer).toBeDisabled();

        const check = within(activity).queryByRole('button', { name: 'تحقّق من إجاباتي' });
        if (!check) return; // the pending decode activity has its check disabled
        if (check.hasAttribute('disabled')) {
          expect(activity.textContent).toContain('معلّق');
          return;
        }

        fireEvent.click(check);
        const afterCheck = activity.textContent ?? '';
        // after the check something is always reported: a verdict, a summary or an attempt note
        expect(
          afterCheck.includes('✔') ||
            afterCheck.includes('⟳') ||
            afterCheck.includes('⟡') ||
            afterCheck.includes('⏸') ||
            afterCheck.includes('نتيجة التحقّق') ||
            afterCheck.includes('سجّلنا محاولتك'),
        ).toBe(true);
        expect(modelAnswer).toBeEnabled();
      });

      cleanup();
      expect(container).toBeTruthy();
    });
  });
});
