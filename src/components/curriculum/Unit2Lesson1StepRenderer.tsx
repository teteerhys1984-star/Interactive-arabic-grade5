import React, { useState } from 'react';
import { LessonStep } from '../../types/curriculum';
import { SourceBadge } from '../common/SourceBadge';
import { AnswerReveal, AnswerRevealEntry, AnswerRevealProps } from '../common/AnswerReveal';
import { getU2L1Activity, U2L1Activity, U2L1Interaction } from '../../data/unit2Lesson1/activities';
import { U2L1_STEP_CONTENT, U2L1Block } from '../../data/unit2Lesson1/content';
import { clearDraft, readDraft, writeDraft } from '../../utils/draftStorage';

const U2L1_DRAFT_SCOPE = 'unit2lesson1';
const U2L1_CHECK_SCOPE = 'unit2lesson1-checks';

/**
 * Unit 2 Lesson 1 renderer.
 * Stays inside the established LessonShell → LessonFlow → StepRenderer flow.
 * Every source block is labelled «من الكتاب»; every platform teaching block
 * is labelled «شرح المنصة». Closed activities expose a post-attempt «تحقق»
 * control: correctness and explanations are never shown before the learner
 * tries, and learners may retry after feedback.
 */
export const Unit2Lesson1StepRenderer: React.FC<{ step: LessonStep }> = ({ step }) => {
  const content = U2L1_STEP_CONTENT[step.id];
  if (!content) {
    return <p className="step-empty-note">لا يوجد محتوى موثق لهذه الخطوة.</p>;
  }

  return (
    <div className="step-renderer lesson2-step-renderer u2l1-step-renderer">
      {content.blocks.map((block, index) => (
        <U2L1BlockView key={`${step.id}-${index}`} block={block} />
      ))}
    </div>
  );
};

type SourceBlock = Extract<U2L1Block, { kind: 'source_info' | 'source_sentences' | 'vocab' | 'rule' | 'instruction' }>;

const SourceSection: React.FC<{
  label: string;
  block: SourceBlock;
  children: React.ReactNode;
}> = ({ label, block, children }) => (
  <section className={`l2-source-info ${block.kind === 'source_info' && block.availability === 'gap' ? 'l2-source-gap-panel' : ''}`}>
    <header className="block-source-head">
      <span className="source-label-original">{label}</span>
      <SourceBadge source={block.source} />
    </header>
    {'heading' in block && <h3 className="block-heading">{block.heading}</h3>}
    {children}
    {block.kind === 'source_info' && block.availability === 'gap' && block.gapReason && (
      <aside className="l2-gap-notice" role="note">
        <strong>حدّ مصدر معلن:</strong> {block.gapReason}
      </aside>
    )}
  </section>
);

const U2L1BlockView: React.FC<{ block: U2L1Block }> = ({ block }) => {
  switch (block.kind) {
    case 'source_info':
      return (
        <SourceSection label="مادة موثقة من الكتاب" block={block}>
          <ul className="l2-source-info-list">
            {block.lines.map((line, index) => <li key={index}>{line}</li>)}
          </ul>
        </SourceSection>
      );
    case 'source_sentences':
      return (
        <SourceSection label="النص الأصلي من الكتاب" block={block}>
          <ul className="source-sentence-list">
            {block.sentences.map((sentence, index) => <li key={index}>{sentence}</li>)}
          </ul>
        </SourceSection>
      );
    case 'vocab':
      return (
        <SourceSection label="معجم الكلمات (من الكتاب)" block={block}>
          <div className="vocab-grid">
            {block.items.map((item) => (
              <article className="vocab-card" key={item.term}>
                <span className="vocab-term">{item.term}</span>
                <span className="vocab-meaning">{item.meaning}</span>
              </article>
            ))}
          </div>
        </SourceSection>
      );
    case 'rule':
      return (
        <SourceSection label="القاعدة (من الكتاب)" block={block}>
          <div className="rule-box">
            {block.lines.map((line, index) => <p key={index}>{line}</p>)}
          </div>
        </SourceSection>
      );
    case 'instruction':
      return (
        <SourceSection label="توجيه من الكتاب" block={block}>
          <p className="instruction-text">{block.text}</p>
        </SourceSection>
      );
    case 'explanation':
      return (
        <section className="block-explanation l2-platform-explanation">
          <span className="source-label-explain">شرح المنصة</span>
          <h3 className="block-heading">{block.heading}</h3>
          {block.lines.map((line, index) => <p key={index}>{line}</p>)}
        </section>
      );
    case 'worked_example':
      return <WorkedExample block={block} />;
    case 'comparison':
      return (
        <section className="u2l1-comparison" aria-label={`مقارنة: ${block.heading}`}>
          <span className="source-label-explain">شرح المنصة — مقارنة</span>
          <h3 className="block-heading">{block.heading}</h3>
          <div className="teacher-coverage-table-wrap">
            <table>
              <thead>
                <tr>{block.columns.map((column, index) => <th key={index} scope="col">{column}</th>)}</tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      cellIndex === 0 ? <th key={cellIndex} scope="row">{cell}</th> : <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && <p className="u2l1-comparison-note">{block.note}</p>}
        </section>
      );
    case 'common_errors':
      return (
        <section className="u2l1-common-errors" aria-label={`أخطاء شائعة: ${block.heading}`}>
          <span className="source-label-explain">شرح المنصة</span>
          <h3 className="block-heading">{block.heading}</h3>
          {block.items.map((item, index) => (
            <article className="u2l1-error-card" key={index}>
              <p><strong>الخطأ:</strong> {item.wrong}</p>
              <p><strong>الصواب:</strong> {item.correct}</p>
              <p><strong>لماذا؟</strong> {item.why}</p>
            </article>
          ))}
        </section>
      );
    case 'check':
      return <CheckWidget block={block} />;
    case 'activity': {
      const activity = getU2L1Activity(block.activityId);
      return activity ? <U2L1ActivityWidget activity={activity} /> : null;
    }
    default:
      return null;
  }
};

/* ---------------- Worked example (progressive reveal) ---------------- */

const WorkedExample: React.FC<{ block: Extract<U2L1Block, { kind: 'worked_example' }> }> = ({ block }) => {
  const [visibleSteps, setVisibleSteps] = useState(0);
  return (
    <section className="u2l1-worked" aria-label={`مثال محلول: ${block.heading}`}>
      <header className="block-source-head">
        <span className={block.origin === 'book' ? 'source-label-original' : 'source-label-explain'}>
          {block.origin === 'book' ? 'مثال محلول (من الكتاب)' : 'شرح المنصة — مثال محلول'}
        </span>
        {block.source && <SourceBadge source={block.source} compact />}
      </header>
      <h3 className="block-heading">{block.heading}</h3>
      <p className="u2l1-worked-example">{block.example}</p>
      <ol className="u2l1-worked-steps">
        {block.steps.slice(0, visibleSteps).map((step, index) => <li key={index}>{step}</li>)}
      </ol>
      <div className="u2l1-worked-controls">
        {visibleSteps < block.steps.length && (
          <button type="button" className="btn btn-secondary btn-small" onClick={() => setVisibleSteps((count) => count + 1)}>
            أظهر الخطوة التالية
          </button>
        )}
        {visibleSteps > 0 && (
          <button type="button" className="btn btn-ghost btn-small" onClick={() => setVisibleSteps(0)}>
            أعد عرض الخطوات
          </button>
        )}
      </div>
    </section>
  );
};

/* ---------------- Platform understanding check ---------------- */

const CheckWidget: React.FC<{ block: Extract<U2L1Block, { kind: 'check' }> }> = ({ block }) => {
  const [selectedRaw, setSelectedRaw] = useState<string>(() => readDraft(U2L1_CHECK_SCOPE, block.id).sel || '');
  const [verified, setVerified] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const selected = selectedRaw ? selectedRaw.split('|') : [];

  const toggle = (choiceId: string) => {
    const next = block.mode === 'single'
      ? [choiceId]
      : selected.includes(choiceId)
        ? selected.filter((id) => id !== choiceId)
        : [...selected, choiceId];
    const raw = next.join('|');
    setSelectedRaw(raw);
    setVerified(false);
    setShowExplanation(false);
    writeDraft(U2L1_CHECK_SCOPE, block.id, { sel: raw });
  };

  const isCorrect = selected.length === block.correctIds.length && block.correctIds.every((id) => selected.includes(id));

  return (
    <section className="u2l1-check" aria-label={`تحقق من الفهم: ${block.heading}`}>
      <span className="source-label-explain">شرح المنصة — تحقق</span>
      <h3 className="block-heading">{block.heading}</h3>
      <p className="u2l1-check-prompt">{block.prompt}</p>
      <div className="u2l1-check-choices">
        {block.choices.map((choice) => {
          const isSelected = selected.includes(choice.id);
          return (
            <button
              key={choice.id}
              type="button"
              className={`inter-choice ${isSelected ? 'selected' : ''}`}
              onClick={() => toggle(choice.id)}
              aria-pressed={isSelected}
            >
              {choice.text}
            </button>
          );
        })}
      </div>
      <div className="u2l1-worked-controls">
        <button
          type="button"
          className="btn btn-primary btn-small"
          onClick={() => { setVerified(true); if (isCorrect) setShowExplanation(true); }}
          disabled={selected.length === 0}
        >
          تحقق من إجابتي
        </button>
        {verified && !isCorrect && !showExplanation && (
          <button type="button" className="btn btn-ghost btn-small" onClick={() => setShowExplanation(true)}>
            اعرض التفسير التعليمي
          </button>
        )}
      </div>
      {/* Owner-mandated «أظهر الجواب»: the correct choice(s) are approved platform
          data; the panel stays out of the DOM until the learner presses it, so
          the gated «تحقق من إجابتي» protocol is unchanged. */}
      <AnswerReveal
        entries={[{
          label: block.correctIds.length > 1 ? 'الإجابات الصحيحة' : 'الإجابة الصحيحة',
          value: block.choices
            .filter((choice) => block.correctIds.includes(choice.id))
            .map((choice) => choice.text)
            .join(' + '),
        }]}
        explanation={block.explanation}
      />
      {verified && (
        <p className={isCorrect ? 'u2l1-feedback is-correct' : 'u2l1-feedback is-wrong'} role="status">
          {isCorrect
            ? 'أحسنت! إجابتك صحيحة.'
            : 'ليست صحيحة تماماً بعد. راجع الشرح الذي سبقها، أو اعرض التفسير التعليمي ثم حاول من جديد.'}
        </p>
      )}
      {verified && showExplanation && <p className="u2l1-check-explanation">{block.explanation}</p>}
    </section>
  );
};

/* ---------------- «أظهر الجواب» adapter (owner-mandated) ----------------
 * Builds the reveal payload from approved project data only:
 *  - the student-side `answerKey` of closed activities, with every internal id
 *    translated to the Arabic label the learner actually sees (category label /
 *    matched item text / field label). Unmappable keys are skipped — raw ids or
 *    internal values are never displayed.
 *  - the approved `teacher.answerOrGuidance`, audited item by item (owner
 *    directive on student/teacher separation): U2L1_MODEL_ANSWER_IDS carry a
 *    concrete approved answer → «الحل النموذجي المعتمد»; every other available
 *    activity carries honest open-task guidance (expected description, accepted
 *    examples, performance criteria) → shown verbatim under «إرشادات للإجابة».
 *    No Unit-2-Lesson-1 guidance is pure teacher-only grading procedure, so no
 *    available activity is hidden.
 * `teacher.explanation` is a teacher note by definition (grading mechanics,
 * source administration) and is never rendered in the student panel; the
 * student-facing `checkExplanation` — the note the learner already receives
 * after «تحقق من إجابتي» — is kept when present.
 * Gap activities (no approved answer) get no button at all. The panel renders
 * only after the learner presses the button, so the existing gated
 * «تحقق من إجابتي» behaviour (and its tests) stay intact.
 */
const U2L1_MODEL_ANSWER_IDS = new Set([
  'U2L1-40-01', 'U2L1-40-02', 'U2L1-40-04', 'U2L1-40-05',
  'U2L1-42-01', 'U2L1-42-03', 'U2L1-42-04', 'U2L1-43-01',
  'U2L1-44-01', 'U2L1-44-06', 'U2L1-45-01', 'U2L1-45-02',
  'U2L1-45-03', 'U2L1-45-04', 'U2L1-45-05', 'U2L1-45-06',
  'U2L1-46-05', 'U2L1-48-02',
]);

const buildU2L1Reveal = (activity: U2L1Activity): AnswerRevealProps | null => {
  if (activity.availability !== 'available') return null;

  const interaction = activity.interaction;
  const entries: AnswerRevealEntry[] = [];

  if (activity.answerKey) {
    Object.entries(activity.answerKey).forEach(([fieldId, expected]) => {
      if (interaction.kind === 'classification' && fieldId.startsWith('classify-')) {
        const item = interaction.items.find((entry) => `classify-${entry.id}` === fieldId);
        const category = interaction.categories.find((entry) => entry.id === expected);
        if (item && category) entries.push({ label: item.text, value: category.label });
        return;
      }
      if (interaction.kind === 'matching' && fieldId.startsWith('match-')) {
        const left = interaction.leftItems.find((entry) => `match-${entry.id}` === fieldId);
        const right = interaction.rightItems.find((entry) => entry.id === expected);
        if (left && right) entries.push({ label: left.text, value: right.text });
        return;
      }
      if (interaction.kind === 'text_fields') {
        const field = interaction.fields.find((entry) => entry.id === fieldId);
        if (field) entries.push({ label: field.label, value: expected });
        return;
      }
      if (interaction.kind === 'checklist' && fieldId.startsWith('check-')) {
        const item = interaction.items.find((entry) => `check-${entry.id}` === fieldId);
        if (item && expected === '1') entries.push({ label: item.label, value: 'عنصرٌ مطلوبٌ تحديده' });
        return;
      }
      /* Unmappable internal key: skipped — never shown raw to the learner. */
    });
  }

  return {
    entries,
    modelAnswer: activity.teacher.answerOrGuidance,
    /* Student-facing only: `checkExplanation` is already shown to the learner
       after «تحقق من إجابتي». `teacher.explanation` is a teacher note and
       stays in the password-protected teacher area. */
    explanation: activity.checkExplanation,
    heading: U2L1_MODEL_ANSWER_IDS.has(activity.sourceActivityId)
      ? 'الحل النموذجي المعتمد'
      : 'إرشادات للإجابة',
  };
};

/* ---------------- Source activity widget ---------------- */

const U2L1ActivityWidget: React.FC<{ activity: U2L1Activity }> = ({ activity }) => {
  const [values, setValues] = useState<Record<string, string>>(() =>
    readDraft(U2L1_DRAFT_SCOPE, activity.sourceActivityId),
  );
  const [saved, setSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const update = (id: string, value: string) => {
    setSaved(false);
    setSaveFailed(false);
    setCleared(false);
    setVerified(false);
    setShowExplanation(false);
    setValues((current) => {
      const next = { ...current, [id]: value };
      writeDraft(U2L1_DRAFT_SCOPE, activity.sourceActivityId, next);
      return next;
    });
  };

  const handleSave = () => {
    const persisted = writeDraft(U2L1_DRAFT_SCOPE, activity.sourceActivityId, values);
    setSaved(persisted);
    setSaveFailed(!persisted);
    setCleared(false);
  };

  const handleReset = () => {
    clearDraft(U2L1_DRAFT_SCOPE, activity.sourceActivityId);
    setValues({});
    setSaved(false);
    setSaveFailed(false);
    setCleared(true);
    setVerified(false);
    setShowExplanation(false);
  };

  const keyEntries = activity.answerKey ? Object.entries(activity.answerKey) : [];
  const answered = keyEntries.filter(([field]) => (values[field] || '').trim() !== '').length;
  const correctCount = keyEntries.filter(([field, expected]) => values[field] === expected).length;
  const allCorrect = keyEntries.length > 0 && correctCount === keyEntries.length;
  /** Owner-mandated «أظهر الجواب»: approved key only; null ⇒ button hidden. */
  const revealProps = buildU2L1Reveal(activity);

  return (
    <section
      className={`activity-widget l2-activity-widget ${activity.availability === 'gap' ? 'l2-activity-gap' : ''}`}
      aria-label={`نشاط المصدر ${activity.sourceActivityId}`}
    >
      <header className="activity-head l2-activity-head">
        <div>
          <span className="activity-number">نشاط {activity.printedNumber}</span>
          <span className="l2-activity-id">{activity.sourceActivityId}</span>
        </div>
        <SourceBadge source={activity.source} compact />
      </header>
      <p className="activity-instruction">{activity.instruction}</p>
      {activity.subparts.length > 0 && (
        <details className="l2-subparts-details">
          <summary>عناصر المهمة التي يجب إنجازها ({activity.subparts.length})</summary>
          <ul>
            {activity.subparts.map((part, index) => <li key={index}>{part}</li>)}
          </ul>
        </details>
      )}
      {activity.availability === 'gap' && activity.source.uncertaintyNote && (
        <aside className="l2-gap-notice" role="note">
          <strong>حدّ مصدر معلن:</strong> {activity.source.uncertaintyNote}
        </aside>
      )}
      <U2L1InteractionView interaction={activity.interaction} values={values} update={update} activityId={activity.id} />
      {activity.answerKey && (
        <div className="u2l1-verify-zone">
          <div className="u2l1-worked-controls">
            <button
              type="button"
              className="btn btn-primary btn-small"
              onClick={() => { setVerified(true); if (allCorrect) setShowExplanation(true); }}
              disabled={answered === 0}
            >
              تحقق من إجابتي
            </button>
            {verified && !allCorrect && activity.checkExplanation && !showExplanation && (
              <button type="button" className="btn btn-ghost btn-small" onClick={() => setShowExplanation(true)}>
                اعرض التفسير التعليمي
              </button>
            )}
          </div>
          {verified && (
            <p className={allCorrect ? 'u2l1-feedback is-correct' : 'u2l1-feedback is-wrong'} role="status">
              {allCorrect
                ? 'ممتاز! كل إجاباتك في هذا النشاط صحيحة.'
                : `أجبت بشكل صحيح عن ${correctCount} من ${keyEntries.length} عناصر. أكمل العناصر الناقصة وراجع غير الصحيحة، ثم حاول من جديد.`}
            </p>
          )}
          {verified && showExplanation && activity.checkExplanation && (
            <p className="u2l1-check-explanation">{activity.checkExplanation}</p>
          )}
        </div>
      )}
      {revealProps && <AnswerReveal {...revealProps} />}
      <footer className="l2-activity-footer">
        <button type="button" className="btn btn-secondary btn-small" onClick={handleSave}>
          حفظ مسودة إجابتي
        </button>
        <button type="button" className="btn btn-ghost btn-small" onClick={handleReset}>
          مسح مسودتي
        </button>
        {saved && (
          <span className="l2-saved-status" role="status">
            حُفظت مسودتك في جلسة التصفح الحالية، وتُستعاد عند العودة إلى النشاط خلال الجلسة.
          </span>
        )}
        {saveFailed && (
          <span className="l2-saved-status" role="alert">
            تعذّر حفظ المسودة في هذه الجلسة؛ انسخ إجابتك قبل مغادرة الصفحة.
          </span>
        )}
        {cleared && (
          <span className="l2-saved-status" role="status">
            مُسحت مسودة هذا النشاط.
          </span>
        )}
      </footer>
    </section>
  );
};

interface InteractionProps {
  interaction: U2L1Interaction;
  values: Record<string, string>;
  update: (id: string, value: string) => void;
  activityId: string;
}

const DraftTextArea: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}> = ({ id, label, value, onChange, rows = 3, placeholder = 'اكتب إجابتك هنا…' }) => (
  <label className="inter-field" htmlFor={id}>
    <span className="inter-label">{label}</span>
    <textarea
      id={id}
      className="inter-textarea"
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  </label>
);

const U2L1InteractionView: React.FC<InteractionProps> = ({ interaction, values, update, activityId }) => {
  switch (interaction.kind) {
    case 'text_fields':
      return (
        <div className="inter-text-inputs">
          {interaction.fields.map((field) => field.multiline ? (
            <DraftTextArea
              key={field.id}
              id={`${activityId}-${field.id}`}
              label={field.label}
              value={values[field.id] || ''}
              onChange={(value) => update(field.id, value)}
              placeholder={field.placeholder}
            />
          ) : (
            <label className="inter-field" key={field.id} htmlFor={`${activityId}-${field.id}`}>
              <span className="inter-label">{field.label}</span>
              <input
                id={`${activityId}-${field.id}`}
                className="inter-input"
                type="text"
                value={values[field.id] || ''}
                onChange={(event) => update(field.id, event.target.value)}
                placeholder={field.placeholder || 'اكتب إجابتك هنا'}
              />
            </label>
          ))}
        </div>
      );
    case 'write':
      return (
        <DraftTextArea
          id={`${activityId}-write`}
          label={interaction.label || 'مساحة الكتابة'}
          rows={interaction.rows || 4}
          value={values.write || ''}
          onChange={(value) => update('write', value)}
          placeholder={interaction.placeholder}
        />
      );
    case 'speak':
      return (
        <div className="l2-speak-panel">
          <p className="inter-speak-note">🗣 أداء شفهي: حضّر كلامك ثم نفّذه أمام زملائك أو معلمك.</p>
          {interaction.criteria && (
            <ul className="l2-performance-criteria">
              {interaction.criteria.map((criterion, index) => <li key={index}>{criterion}</li>)}
            </ul>
          )}
          <DraftTextArea
            id={`${activityId}-speech-prep`}
            label={interaction.preparationLabel || 'مخطط أدائي'}
            value={values.speech || ''}
            onChange={(value) => update('speech', value)}
          />
        </div>
      );
    case 'classification':
      return (
        <div className="l2-classification-list">
          {interaction.items.map((item) => (
            <label className="l2-classification-row" key={item.id}>
              <span>{item.text}</span>
              <select
                value={values[`classify-${item.id}`] || ''}
                onChange={(event) => update(`classify-${item.id}`, event.target.value)}
                aria-label={`تصنيف ${item.text}`}
              >
                <option value="">اختر التصنيف</option>
                {interaction.categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      );
    case 'matching':
      return (
        <div className="l2-classification-list">
          {interaction.leftItems.map((item) => (
            <label className="l2-classification-row" key={item.id}>
              <span>{item.text}</span>
              <select
                value={values[`match-${item.id}`] || ''}
                onChange={(event) => update(`match-${item.id}`, event.target.value)}
                aria-label={`وصل ${item.text}`}
              >
                <option value="">اختر الوصلة</option>
                {interaction.rightItems.map((right) => (
                  <option key={right.id} value={right.id}>{right.text}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      );
    case 'checklist':
      return (
        <div className="u2l1-checklist">
          {interaction.items.map((item) => (
            <label className="u2l1-checklist-row" key={item.id} htmlFor={`${activityId}-check-${item.id}`}>
              <input
                id={`${activityId}-check-${item.id}`}
                type="checkbox"
                checked={values[`check-${item.id}`] === '1'}
                onChange={(event) => update(`check-${item.id}`, event.target.checked ? '1' : '')}
              />
              <span>{item.label}</span>
            </label>
          ))}
          {interaction.noteLabel && (
            <DraftTextArea
              id={`${activityId}-peer-note`}
              label={interaction.noteLabel}
              value={values.note || ''}
              onChange={(value) => update('note', value)}
              rows={2}
            />
          )}
        </div>
      );
    case 'handwriting':
      return (
        <div className="l2-handwriting-workspace">
          <p className="l2-interaction-instruction">{interaction.modelDescription}</p>
          {interaction.modelText && <p className="l2-calligraphy-model">{interaction.modelText}</p>}
          <DraftTextArea
            id={`${activityId}-handwriting`}
            label="اكتب محاكاتك رقمياً أو ملاحظتك الخطية (الرسم الحقيقي على ورقة مسطّرة بقلمك)"
            value={values.handwriting || ''}
            onChange={(value) => update('handwriting', value)}
            rows={4}
          />
        </div>
      );
    default:
      return null;
  }
};
