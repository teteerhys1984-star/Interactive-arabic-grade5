import React, { useState } from 'react';
import { LessonStep } from '../../types/curriculum';
import { ArabicNumber } from '../common/BiDi';
import { SourceBadge } from '../common/SourceBadge';
import { getLesson2Activity, Lesson2Activity, Lesson2Interaction } from '../../data/lesson2/activities';
import { LESSON2_STEP_CONTENT, Lesson2Block } from '../../data/lesson2/content';

/**
 * Lesson 2 renderer.
 * It remains inside the established LessonShell → LessonFlow → StepRenderer flow.
 * Every activity is deliberately source-labelled; source gaps stay visible rather
 * than being replaced by a plausible-but-unverified activity or passage.
 */
export const Lesson2StepRenderer: React.FC<{ step: LessonStep }> = ({ step }) => {
  const content = LESSON2_STEP_CONTENT[step.id];
  if (!content) {
    return <p className="step-empty-note">لا يوجد محتوى موثق لهذه الخطوة.</p>;
  }

  return (
    <div className="step-renderer lesson2-step-renderer">
      {content.blocks.map((block, index) => (
        <Lesson2BlockView key={`${step.id}-${index}`} block={block} />
      ))}
    </div>
  );
};

const Lesson2BlockView: React.FC<{ block: Lesson2Block }> = ({ block }) => {
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
            {block.sentences.map((sentence) => <li key={sentence}>{sentence}</li>)}
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
      const activity = getLesson2Activity(block.activityId);
      return activity ? <Lesson2ActivityWidget activity={activity} /> : null;
    }
    default:
      return null;
  }
};

const Lesson2ActivityWidget: React.FC<{ activity: Lesson2Activity }> = ({ activity }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const update = (id: string, value: string) => {
    setSaved(false);
    setValues((current) => ({ ...current, [id]: value }));
  };

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
            {activity.subparts.map((part) => <li key={part}>{part}</li>)}
          </ul>
        </details>
      )}
      {activity.availability === 'gap' && (
        <aside className="l2-gap-notice" role="note">
          <strong>لا تُنشأ إجابة بديلة:</strong> {activity.teacher.explanation}
        </aside>
      )}
      <Lesson2InteractionView interaction={activity.interaction} values={values} update={update} />
      {activity.availability === 'available' && (
        <footer className="l2-activity-footer">
          <button type="button" className="btn btn-secondary btn-small" onClick={() => setSaved(true)}>
            حفظ مسودة إجابتي
          </button>
          {saved && <span className="l2-saved-status" role="status">حُفظت مسودتك في هذه الجلسة؛ راجعها مع معلمك.</span>}
        </footer>
      )}
    </section>
  );
};

interface InteractionProps {
  interaction: Lesson2Interaction;
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

const SourceGapInteraction: React.FC<{ reason: string; preservedPrompt?: string }> = ({ reason, preservedPrompt }) => (
  <div className="l2-interaction-gap">
    {preservedPrompt && <p className="l2-preserved-prompt">المطلوب المحفوظ: {preservedPrompt}</p>}
    <p>{reason}</p>
  </div>
);

const Lesson2InteractionView: React.FC<InteractionProps> = ({ interaction, values, update }) => {
  switch (interaction.kind) {
    case 'source_gap':
      return <SourceGapInteraction reason={interaction.reason} preservedPrompt={interaction.preservedPrompt} />;
    case 'text_fields':
      return (
        <div className="inter-text-inputs">
          {interaction.fields.map((field) => field.multiline ? (
            <DraftTextArea
              key={field.id}
              id={`l2-${field.id}`}
              label={field.label}
              value={values[field.id] || ''}
              onChange={(value) => update(field.id, value)}
              placeholder={field.placeholder}
            />
          ) : (
            <label className="inter-field" key={field.id} htmlFor={`l2-${field.id}`}>
              <span className="inter-label">{field.label}</span>
              <input
                id={`l2-${field.id}`}
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
    case 'single_choice':
      return (
        <div className="inter-choices" role="radiogroup" aria-label="خيارات النشاط">
          {interaction.disabledReason && <SourceGapInteraction reason={interaction.disabledReason} />}
          {interaction.choices.map((choice) => {
            const selected = values.choice === choice.id;
            return (
              <label key={choice.id} className={`l2-choice-label ${selected ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name={`l2-choice-${choice.id}`}
                  checked={selected}
                  disabled={Boolean(interaction.disabledReason)}
                  onChange={() => update('choice', choice.id)}
                />
                <span>{choice.text}</span>
              </label>
            );
          })}
        </div>
      );
    case 'multi_select':
      return (
        <div className="inter-choices" role="group" aria-label="خيارات النشاط المتعددة">
          {interaction.choices.map((choice) => {
            const selected = (values.multi || '').split('|').includes(choice.id);
            const selectedIds = (values.multi || '').split('|').filter(Boolean);
            const toggle = () => update(
              'multi',
              selected ? selectedIds.filter((id) => id !== choice.id).join('|') : [...selectedIds, choice.id].join('|'),
            );
            return (
              <label key={choice.id} className={`l2-choice-label ${selected ? 'selected' : ''}`}>
                <input type="checkbox" checked={selected} onChange={toggle} />
                <span>{choice.text}</span>
              </label>
            );
          })}
        </div>
      );
    case 'write':
      return (
        <DraftTextArea
          id="l2-write"
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
          {interaction.disabledReason ? (
            <SourceGapInteraction reason={interaction.disabledReason} />
          ) : (
            <>
              <p className="inter-speak-note">🗣 أداء شفهي: حضّر كلامك ثم نفّذه أمام زملائك أو معلمك.</p>
              {interaction.criteria && (
                <ul className="l2-performance-criteria">
                  {interaction.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
                </ul>
              )}
              <DraftTextArea
                id="l2-speech-prep"
                label={interaction.preparationLabel || 'مخطط أدائي'}
                value={values.speech || ''}
                onChange={(value) => update('speech', value)}
              />
            </>
          )}
        </div>
      );
    case 'matching':
      return (
        <div className="l2-matching-grid">
          <p className="l2-interaction-instruction">صل كل عنصر بما تراه مناسباً، ثم ناقش تعليلك مع المعلم.</p>
          {interaction.leftItems.map((left) => (
            <label className="l2-matching-row" key={left.id}>
              <span>{left.text}</span>
              <span aria-hidden="true">←</span>
              <select
                value={values[`match-${left.id}`] || ''}
                onChange={(event) => update(`match-${left.id}`, event.target.value)}
                aria-label={`مطابقة ${left.text}`}
              >
                <option value="">اختر المقابل</option>
                {interaction.rightItems.map((right) => <option key={right.id} value={right.id}>{right.text}</option>)}
              </select>
            </label>
          ))}
        </div>
      );
    case 'ordering': {
      if (interaction.disabledReason) return <SourceGapInteraction reason={interaction.disabledReason} />;
      const initialOrder = interaction.items.map((item) => item.id).join('|');
      const itemIds = (values.order || initialOrder).split('|').filter(Boolean);
      const move = (currentIndex: number, direction: -1 | 1) => {
        const destination = currentIndex + direction;
        if (destination < 0 || destination >= itemIds.length) return;
        const next = [...itemIds];
        [next[currentIndex], next[destination]] = [next[destination], next[currentIndex]];
        update('order', next.join('|'));
      };
      return (
        <div className="l2-ordering-list">
          <p className="l2-interaction-instruction">استخدم السهمين لتغيير ترتيب العناصر.</p>
          {itemIds.map((id, index) => {
            const item = interaction.items.find((candidate) => candidate.id === id);
            if (!item) return null;
            return (
              <div className="l2-ordering-row" key={item.id}>
                <span className="l2-ordering-number"><ArabicNumber value={index + 1} /></span>
                <span className="l2-ordering-text">{item.text}</span>
                <div className="l2-order-controls">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`رفع ${item.text}`}>↑</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === itemIds.length - 1} aria-label={`خفض ${item.text}`}>↓</button>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
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
    case 'balance':
      return (
        <div className="l2-balance-workspace">
          <p className="l2-interaction-instruction">{interaction.prompt}</p>
          <div className="l2-balance-columns">
            <section>
              <h4>حقوقي</h4>
              <ul>{interaction.rights.map((right) => <li key={right}>{right}</li>)}</ul>
              <DraftTextArea id="l2-right-1" label="حق أضيفه ١" value={values.right1 || ''} onChange={(value) => update('right1', value)} rows={2} />
              <DraftTextArea id="l2-right-2" label="حق أضيفه ٢" value={values.right2 || ''} onChange={(value) => update('right2', value)} rows={2} />
            </section>
            <section>
              <h4>واجباتي</h4>
              <ul>{interaction.duties.map((duty) => <li key={duty}>{duty}</li>)}</ul>
              <DraftTextArea id="l2-duty-1" label="واجب أضيفه ١" value={values.duty1 || ''} onChange={(value) => update('duty1', value)} rows={2} />
              <DraftTextArea id="l2-duty-2" label="واجب أضيفه ٢" value={values.duty2 || ''} onChange={(value) => update('duty2', value)} rows={2} />
            </section>
          </div>
          <DraftTextArea id="l2-balance-reason" label="كيف يصبح الميزان متوازناً؟" value={values.balanceReason || ''} onChange={(value) => update('balanceReason', value)} />
        </div>
      );
    case 'interview_plan':
      return (
        <div className="l2-interview-plan">
          <p className="l2-interaction-instruction">ضع خطة للمقابلة؛ لا تُنشأ أجوبة على لسان الضيف.</p>
          <ol className="l2-interview-criteria">
            {interaction.criteria.map((criterion, index) => (
              <li key={criterion}>
                <label>
                  <input
                    type="checkbox"
                    checked={(values.criteria || '').split('|').includes(String(index))}
                    onChange={() => {
                      const active = (values.criteria || '').split('|').filter(Boolean);
                      const id = String(index);
                      update('criteria', active.includes(id) ? active.filter((value) => value !== id).join('|') : [...active, id].join('|'));
                    }}
                  />
                  <span>{criterion}</span>
                </label>
              </li>
            ))}
          </ol>
          <div className="l2-interview-fields">
            <DraftTextArea id="l2-interview-topic" label="موضوع المقابلة" value={values.topic || ''} onChange={(value) => update('topic', value)} rows={2} />
            <DraftTextArea id="l2-interview-opening" label="عبارة الافتتاح والخاتمة" value={values.opening || ''} onChange={(value) => update('opening', value)} rows={2} />
            <DraftTextArea id="l2-interview-questions" label="أسئلتي القصيرة المباشرة" value={values.questions || ''} onChange={(value) => update('questions', value)} rows={4} />
          </div>
        </div>
      );
    case 'handwriting':
      return interaction.disabledReason ? (
        <SourceGapInteraction reason={interaction.disabledReason} />
      ) : (
        <div className="l2-handwriting-workspace">
          <p className="l2-interaction-instruction">{interaction.modelDescription}</p>
          {interaction.modelText && <p className="l2-calligraphy-model">{interaction.modelText}</p>}
          <DraftTextArea id="l2-handwriting" label="اكتب محاكاتك أو ملاحظتك عن الهمزة والمد والألف" value={values.handwriting || ''} onChange={(value) => update('handwriting', value)} rows={4} />
        </div>
      );
    default:
      return null;
  }
};
