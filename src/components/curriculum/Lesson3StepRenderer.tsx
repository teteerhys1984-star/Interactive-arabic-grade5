import React, { useState } from 'react';
import { LessonStep } from '../../types/curriculum';
import { SourceBadge } from '../common/SourceBadge';
import { AnswerReveal, AnswerRevealProps } from '../common/AnswerReveal';
import { getLesson3Activity, Lesson3Activity, Lesson3Interaction } from '../../data/lesson3/activities';
import { LESSON3_STEP_CONTENT, Lesson3Block } from '../../data/lesson3/content';
import { clearDraft, readDraft, writeDraft } from '../../utils/draftStorage';

const LESSON3_DRAFT_SCOPE = 'lesson3';

/* ---- Student/teacher content separation (owner directive) -----------------
 * Every available Lesson-3 `teacher.answerOrGuidance` was audited item by item
 * against the locked source record:
 *  - L3_MODEL_ANSWER_IDS: concrete approved answers, safe to present to the
 *    learner as the model answer («الحل النموذجي المعتمد»).
 *  - every other available activity carries honest open-task guidance (free
 *    performance, accepted-example lists, assessment criteria the learner can
 *    act on) → shown verbatim under «إرشادات للإجابة». No Lesson-3 guidance is
 *    pure teacher-only grading procedure, so no available activity is hidden.
 * `teacher.explanation` is a teacher note by definition (grading mechanics,
 * source administration) and is never rendered in the student panel.
 * No answer text is invented, rewritten, or paraphrased here. */
const L3_MODEL_ANSWER_IDS = new Set([
  'L3-25-02', 'L3-25-04', 'L3-25-05', 'L3-27-01', 'L3-27-03',
  'L3-27-04', 'L3-27-05', 'L3-27-06', 'L3-27-07', 'L3-28-03',
  'L3-28-04', 'L3-28-05', 'L3-28-06', 'L3-29-01', 'L3-29-02',
  'L3-30-01', 'L3-30-02', 'L3-30-03', 'L3-30-04', 'L3-31-01',
  'L3-31-02', 'L3-31-03', 'L3-31-04', 'L3-32-01', 'L3-32-02',
  'L3-34-01', 'L3-34-02',
]);

const buildLesson3Reveal = (activity: Lesson3Activity): AnswerRevealProps | null => {
  if (activity.availability !== 'available') return null;
  return {
    modelAnswer: activity.teacher.answerOrGuidance,
    heading: L3_MODEL_ANSWER_IDS.has(activity.sourceActivityId)
      ? 'الحل النموذجي المعتمد'
      : 'إرشادات للإجابة',
  };
};

/**
 * Lesson 3 renderer.
 * It remains inside the established LessonShell → LessonFlow → StepRenderer flow.
 * Every activity is source-labelled; declared locked uncertainties stay visible
 * rather than being replaced by invented wording or models.
 */
export const Lesson3StepRenderer: React.FC<{ step: LessonStep }> = ({ step }) => {
  const content = LESSON3_STEP_CONTENT[step.id];
  if (!content) {
    return <p className="step-empty-note">لا يوجد محتوى موثق لهذه الخطوة.</p>;
  }

  return (
    <div className="step-renderer lesson2-step-renderer lesson3-step-renderer">
      {content.blocks.map((block, index) => (
        <Lesson3BlockView key={`${step.id}-${index}`} block={block} />
      ))}
    </div>
  );
};

const Lesson3BlockView: React.FC<{ block: Lesson3Block }> = ({ block }) => {
  switch (block.kind) {
    case 'source_info':
      return (
        <section className={`l2-source-info ${block.availability === 'gap' ? 'l2-source-gap-panel' : ''}`}>
          <header className="block-source-head">
            <span className="source-label-original">مادة موثقة من المصدر</span>
            <SourceBadge source={block.source} />
          </header>
          <h3 className="block-heading">{block.heading}</h3>
          <ul className="l2-source-info-list">
            {block.lines.map((line) => <li key={line}>{line}</li>)}
          </ul>
          {block.availability === 'gap' && block.gapReason && (
            <aside className="l2-gap-notice" role="note">
              <strong>حدّ مصدر معلن:</strong> {block.gapReason}
            </aside>
          )}
        </section>
      );
    case 'source_sentences':
      return (
        <section className="block-source-sentences">
          <header className="block-source-head">
            <span className="source-label-original">النص الأصلي من المصدر</span>
            <SourceBadge source={block.source} />
          </header>
          <h3 className="block-heading">{block.heading}</h3>
          <ul className="source-sentence-list">
            {block.sentences.map((sentence, index) => <li key={`${index}-${sentence.slice(0, 12)}`}>{sentence}</li>)}
          </ul>
        </section>
      );
    case 'vocab':
      return (
        <section className="block-vocab">
          <header className="block-source-head">
            <span className="source-label-original">معجم الكلمات (من المصدر)</span>
            <SourceBadge source={block.source} />
          </header>
          <h3 className="block-heading">{block.heading}</h3>
          <div className="vocab-grid">
            {block.items.map((item) => (
              <article className="vocab-card" key={item.term}>
                <span className="vocab-term">{item.term}</span>
                <span className="vocab-meaning">{item.meaning}</span>
              </article>
            ))}
          </div>
        </section>
      );
    case 'rule':
      return (
        <section className="block-rule">
          <header className="block-source-head">
            <span className="source-label-original">القاعدة (من المصدر)</span>
            <SourceBadge source={block.source} />
          </header>
          <h3 className="block-heading">{block.heading}</h3>
          <div className="rule-box">
            {block.lines.map((line) => <p key={line}>{line}</p>)}
          </div>
        </section>
      );
    case 'instruction':
      return (
        <section className="block-instruction">
          <header className="block-source-head">
            <span className="source-label-original">توجيه من المصدر</span>
            <SourceBadge source={block.source} />
          </header>
          <h3 className="block-heading">{block.heading}</h3>
          <p className="instruction-text">{block.text}</p>
        </section>
      );
    case 'explanation':
      return (
        <section className="block-explanation l2-platform-explanation">
          <span className="source-label-explain">شرح المنصة</span>
          <h3 className="block-heading">{block.heading}</h3>
          {block.lines.map((line) => <p key={line}>{line}</p>)}
        </section>
      );
    case 'activity': {
      const activity = getLesson3Activity(block.activityId);
      return activity ? <Lesson3ActivityWidget activity={activity} /> : null;
    }
    default:
      return null;
  }
};

const Lesson3ActivityWidget: React.FC<{ activity: Lesson3Activity }> = ({ activity }) => {
  const [values, setValues] = useState<Record<string, string>>(() =>
    readDraft(LESSON3_DRAFT_SCOPE, activity.sourceActivityId),
  );
  const [saved, setSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [cleared, setCleared] = useState(false);

  const update = (id: string, value: string) => {
    setSaved(false);
    setSaveFailed(false);
    setCleared(false);
    setValues((current) => {
      const next = { ...current, [id]: value };
      writeDraft(LESSON3_DRAFT_SCOPE, activity.sourceActivityId, next);
      return next;
    });
  };

  const handleSave = () => {
    const persisted = writeDraft(LESSON3_DRAFT_SCOPE, activity.sourceActivityId, values);
    setSaved(persisted);
    setSaveFailed(!persisted);
    setCleared(false);
  };

  const handleReset = () => {
    clearDraft(LESSON3_DRAFT_SCOPE, activity.sourceActivityId);
    setValues({});
    setSaved(false);
    setSaveFailed(false);
    setCleared(true);
  };

  /* Owner directive: student-facing reveal payload, or null ⇒ no button. */
  const revealProps = buildLesson3Reveal(activity);

  return (
    <section className="activity-widget l2-activity-widget" aria-label={`نشاط المصدر ${activity.sourceActivityId}`}>
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
            {activity.subparts.map((part) => <li key={part}>{part}</li>)}
          </ul>
        </details>
      )}
      <Lesson3InteractionView interaction={activity.interaction} values={values} update={update} />
      {/* Owner-mandated «أظهر الجواب», student/teacher separated: concrete
          approved answers under «الحل النموذجي المعتمد», honest open-task
          guidance under «إرشادات للإجابة», and availability-gap activities
          (no approved answer) get no button. */}
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
            حُفظت مسودتك في هذا المتصفح وتُستعاد عند العودة إلى النشاط أو إعادة تحميل الصفحة.
          </span>
        )}
        {saveFailed && (
          <span className="l2-saved-status" role="alert">
            تعذّر حفظ المسودة في هذا المتصفح؛ انسخ إجابتك قبل مغادرة الصفحة.
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
  interaction: Lesson3Interaction;
  values: Record<string, string>;
  update: (id: string, value: string) => void;
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

const Lesson3InteractionView: React.FC<InteractionProps> = ({ interaction, values, update }) => {
  switch (interaction.kind) {
    case 'text_fields':
      return (
        <div className="inter-text-inputs">
          {interaction.fields.map((field) => field.multiline ? (
            <DraftTextArea
              key={field.id}
              id={`l3-${field.id}`}
              label={field.label}
              value={values[field.id] || ''}
              onChange={(value) => update(field.id, value)}
              placeholder={field.placeholder}
            />
          ) : (
            <label className="inter-field" key={field.id} htmlFor={`l3-${field.id}`}>
              <span className="inter-label">{field.label}</span>
              <input
                id={`l3-${field.id}`}
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
          id="l3-write"
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
              {interaction.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
            </ul>
          )}
          <DraftTextArea
            id="l3-speech-prep"
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
                {interaction.categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
              </select>
            </label>
          ))}
        </div>
      );
    case 'handwriting':
      return (
        <div className="l2-handwriting-workspace">
          <p className="l2-interaction-instruction">{interaction.modelDescription}</p>
          {interaction.modelText && <p className="l2-calligraphy-model">{interaction.modelText}</p>}
          <DraftTextArea id="l3-handwriting" label="اكتب محاكاتك أو ملاحظتك الخطية" value={values.handwriting || ''} onChange={(value) => update('handwriting', value)} rows={4} />
        </div>
      );
    default:
      return null;
  }
};
