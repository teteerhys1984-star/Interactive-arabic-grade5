import React from 'react';
import { LessonStep } from '../../types/curriculum';
import { SourceBadge } from '../common/SourceBadge';
import { ArabicNumber } from '../common/BiDi';
import {
  U2L3_ACTIVITY_BY_ID,
  U2L3Activity,
  U2L3Interaction,
} from '../../data/unit2Lesson3/activities';
import { U2L3Block, U2L3_POEM, U2L3_STEP_CONTENT } from '../../data/unit2Lesson3/content';
import { clearDraft, readDraft, writeDraft } from '../../utils/draftStorage';
import './unit2Lesson3.css';

/**
 * Unit 2 Lesson 3 renderer («بِالْعِلْمِ تَرْقَى», pp. 61–68).
 *
 * Uses the established LessonShell → LessonFlow → StepRenderer pipeline, the
 * shared SourceBadge / draftStorage / CSS design system, and no new storage
 * or navigation mechanism. Source blocks are labelled «من الكتاب»; platform
 * interface notes are labelled «ملاحظة المنصة» and never attributed to the
 * textbook. There is deliberately NO answer key, NO correctness feedback and
 * NO grading widget: the supplied source carries no approved key.
 */
const U2L3_DRAFT_SCOPE = 'unit2lesson3';

export const Unit2Lesson3StepRenderer: React.FC<{ step: LessonStep }> = ({ step }) => {
  const content = U2L3_STEP_CONTENT[step.id];
  if (!content) {
    return <p className="step-empty-note">لا يوجد محتوى موثق لهذه الخطوة.</p>;
  }
  return (
    <div className="step-renderer lesson2-step-renderer u2l3-step-renderer">
      {content.blocks.map((block, index) => (
        <U2L3BlockView key={`${step.id}-${index}`} block={block} />
      ))}
    </div>
  );
};

type SourceBlock = Extract<U2L3Block, { kind: 'source_info' | 'source_sentences' | 'vocab' | 'rule' | 'instruction' | 'source_table' | 'poem' }>;

const SourceSection: React.FC<{ label: string; block: SourceBlock; children: React.ReactNode }> = ({ label, block, children }) => (
  <section className={`l2-source-info ${block.kind === 'source_info' && block.gap ? 'l2-source-gap-panel' : ''}`}>
    <header className="block-source-head">
      <span className="source-label-original">{label}</span>
      <SourceBadge source={block.source} />
    </header>
    {'heading' in block && <h3 className="block-heading">{block.heading}</h3>}
    {children}
  </section>
);

const U2L3BlockView: React.FC<{ block: U2L3Block }> = ({ block }) => {
  switch (block.kind) {
    case 'source_info':
      return (
        <SourceSection label="مادة موثقة من الكتاب" block={block}>
          <ul className="l2-source-info-list">
            {block.lines.map((line, index) => <li key={index}>{line}</li>)}
          </ul>
          {block.gap && <aside className="l2-gap-notice" role="note"><strong>حدّ مصدر معلن:</strong> يلزم قصّ أدق؛ لم يُثبت النصّ غير المحسوم.</aside>}
        </SourceSection>
      );
    case 'source_sentences':
      return (
        <SourceSection label="الأمثلة من الكتاب" block={block}>
          <ul className="source-sentence-list">
            {block.sentences.map((sentence, index) => <li key={index}>{sentence}</li>)}
          </ul>
        </SourceSection>
      );
    case 'source_table':
      return (
        <SourceSection label="الجدول من الكتاب" block={block}>
          <div className="teacher-coverage-table-wrap">
            <table className="u2l3-source-table">
              <thead>
                <tr>{block.columns.map((column, index) => <th key={index} scope="col">{column}</th>)}</tr>
              </thead>
              <tbody>
                <tr>{block.columns.map((_, index) => <td key={index} aria-label="خانة فارغة في الكتاب">&nbsp;</td>)}</tr>
              </tbody>
            </table>
          </div>
        </SourceSection>
      );
    case 'poem':
      return (
        <SourceSection label="النص الأصلي من الكتاب" block={block}>
          <div className="u2l3-poem">
            {block.stanzas.map((line, index) => (
              <React.Fragment key={index}>
                <div className="u2l3-poem-line">
                  <span className="u2l3-poem-right">{line.right}</span>
                  <span className="u2l3-poem-left">{line.left}</span>
                </div>
                {index % 2 === 1 && <div className="u2l3-poem-separator" aria-hidden="true">{U2L3_POEM.stanzaSeparator}</div>}
              </React.Fragment>
            ))}
            <p className="u2l3-poem-poet">{block.poet}</p>
          </div>
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
        <SourceSection label="القاعدة / الفائدة (من الكتاب)" block={block}>
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
    case 'platform_note':
      return (
        <section className="block-explanation l2-platform-explanation">
          <span className="source-label-explain">ملاحظة المنصة</span>
          <h3 className="block-heading">{block.heading}</h3>
          {block.lines.map((line, index) => <p key={index}>{line}</p>)}
        </section>
      );
    case 'activity': {
      const activity = U2L3_ACTIVITY_BY_ID[block.activityId];
      return activity ? <U2L3ActivityWidget activity={activity} /> : null;
    }
    default:
      return null;
  }
};

/* ---------------- Source activity widget ---------------- */

const U2L3ActivityWidget: React.FC<{ activity: U2L3Activity }> = ({ activity }) => {
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    readDraft(U2L3_DRAFT_SCOPE, activity.sourceActivityId),
  );
  const [saved, setSaved] = React.useState(false);
  const [saveFailed, setSaveFailed] = React.useState(false);
  const [cleared, setCleared] = React.useState(false);

  const update = (id: string, value: string) => {
    setSaved(false);
    setSaveFailed(false);
    setCleared(false);
    setValues((current) => {
      const next = { ...current, [id]: value };
      writeDraft(U2L3_DRAFT_SCOPE, activity.sourceActivityId, next);
      return next;
    });
  };

  const handleSave = () => {
    const persisted = writeDraft(U2L3_DRAFT_SCOPE, activity.sourceActivityId, values);
    setSaved(persisted);
    setSaveFailed(!persisted);
    setCleared(false);
  };

  const handleReset = () => {
    clearDraft(U2L3_DRAFT_SCOPE, activity.sourceActivityId);
    setValues({});
    setSaved(false);
    setSaveFailed(false);
    setCleared(true);
  };

  return (
    <section
      className={`activity-widget l2-activity-widget ${activity.gapNote ? 'l2-activity-gap' : ''}`}
      aria-label={`نشاط المصدر ${activity.sourceActivityId}`}
    >
      <header className="activity-head l2-activity-head">
        <div>
          {activity.printedNumber !== '—' && <span className="activity-number">نشاط <ArabicNumber value={activity.printedNumber} /></span>}
          <span className="l2-activity-id">{activity.sourceActivityId}</span>
        </div>
        <SourceBadge source={activity.source} compact />
      </header>
      <p className="activity-instruction">{activity.instruction}</p>
      {activity.subparts.length > 0 && (
        <div className="u2l3-printed-parts">
          {activity.subparts.map((part, index) => <p key={index}>{part}</p>)}
        </div>
      )}
      {activity.gapNote && (
        <aside className="l2-gap-notice" role="note">
          <strong>حدّ مصدر معلن:</strong> {activity.gapNote}
        </aside>
      )}
      <U2L3InteractionView
        interaction={activity.interaction}
        values={values}
        update={update}
        activityId={activity.id}
      />
      <footer className="l2-activity-footer">
        <button type="button" className="btn btn-secondary btn-small" onClick={handleSave}>
          حفظ مسودة إجابتي
        </button>
        <button type="button" className="btn btn-ghost btn-small" onClick={handleReset}>
          مسح مسودتي
        </button>
        {saved && <span className="l2-saved-status" role="status">حُفظت مسودتك في جلسة التصفح الحالية، وتُستعاد عند العودة إلى النشاط خلال الجلسة.</span>}
        {saveFailed && <span className="l2-saved-status" role="alert">تعذّر حفظ المسودة في هذه الجلسة؛ انسخ إجابتك قبل مغادرة الصفحة.</span>}
        {cleared && <span className="l2-saved-status" role="status">مُسحت مسودة هذا النشاط.</span>}
      </footer>
    </section>
  );
};

interface InteractionProps {
  interaction: U2L3Interaction;
  values: Record<string, string>;
  update: (id: string, value: string) => void;
  activityId: string;
}

const DraftTextArea: React.FC<{
  id: string; label: string; value: string; onChange: (value: string) => void; rows?: number;
}> = ({ id, label, value, onChange, rows = 3 }) => (
  <label className="inter-field" htmlFor={id}>
    <span className="inter-label">{label}</span>
    <textarea
      id={id}
      className="inter-textarea"
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="اكتب إجابتك هنا…"
    />
  </label>
);

const U2L3InteractionView: React.FC<InteractionProps> = ({ interaction, values, update, activityId }) => {
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
                placeholder="اكتب إجابتك هنا"
              />
            </label>
          ))}
        </div>
      );
    case 'write':
      return (
        <DraftTextArea
          id={`${activityId}-write`}
          label={interaction.label || 'مساحة الكتابة (واجهة المنصة)'}
          rows={interaction.rows || 4}
          value={values.write || ''}
          onChange={(value) => update('write', value)}
        />
      );
    case 'choice_groups':
      return (
        <div className="u2l3-choice-groups">
          {interaction.groups.map((group) => (
            <div className="u2l3-choice-group" key={group.id}>
              <p className="inter-label">{group.label}</p>
              <div className="inter-choices u2l3-choices-row">
                {group.choices.map((choice) => {
                  const selected = values[`group-${group.id}`] === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      className={`inter-choice ${selected ? 'selected' : ''}`}
                      aria-pressed={selected}
                      onClick={() => update(`group-${group.id}`, choice.id)}
                    >
                      {choice.text}
                    </button>
                  );
                })}
              </div>
            </div>
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
    case 'table_rows':
      return (
        <div className="teacher-coverage-table-wrap">
          <table className="u2l3-work-table">
            <thead>
              <tr>{interaction.columns.map((column, index) => <th key={index} scope="col">{column}</th>)}</tr>
            </thead>
            <tbody>
              {Array.from({ length: interaction.rows }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  {interaction.columns.map((_, columnIndex) => (
                    <td key={columnIndex}>
                      <input
                        type="text"
                        className="inter-input"
                        aria-label={`صف ${rowIndex + 1}، ${interaction.columns[columnIndex]}`}
                        value={values[`row-${rowIndex}-col-${columnIndex}`] || ''}
                        onChange={(event) => update(`row-${rowIndex}-col-${columnIndex}`, event.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'speak':
      return (
        <div className="l2-speak-panel">
          <p className="inter-speak-note">🗣 أداء شفهي: حضّر كلامك ثم نفّذه أمام زملائك أو معلّمك.</p>
          {interaction.criteria && (
            <ul className="l2-performance-criteria">
              {interaction.criteria.map((criterion, index) => <li key={index}>{criterion}</li>)}
            </ul>
          )}
          <DraftTextArea
            id={`${activityId}-speech`}
            label="مخطط أدائي (مساحة من المنصة)"
            value={values.speech || ''}
            onChange={(value) => update('speech', value)}
          />
        </div>
      );
    case 'handwriting':
      return (
        <div className="l2-handwriting-workspace">
          {interaction.modelDescription && <p className="l2-interaction-instruction">{interaction.modelDescription}</p>}
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
    case 'cards': {
      const count = Math.max(interaction.initialCards, Number(values.cardCount) || 0);
      return (
        <div className="u2l3-cards">
          {Array.from({ length: count }, (_, index) => (
            <label className="inter-field" key={index} htmlFor={`${activityId}-card-${index}`}>
              <span className="inter-label">بطاقة <ArabicNumber value={index + 1} /></span>
              <input
                id={`${activityId}-card-${index}`}
                className="inter-input"
                type="text"
                value={values[`card-${index}`] || ''}
                onChange={(event) => update(`card-${index}`, event.target.value)}
                placeholder="اكتب الكلمة هنا"
              />
            </label>
          ))}
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => update('cardCount', String(count + 1))}
          >
            أضف بطاقة
          </button>
        </div>
      );
    }
    default:
      return null;
  }
};
