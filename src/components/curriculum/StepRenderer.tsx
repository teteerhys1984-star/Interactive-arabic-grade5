import React, { useState } from 'react';
import { LessonStep } from '../../types/curriculum';
import { LESSON1_STEP_CONTENT, LessonBlock } from '../../data/lesson1/content';
import { TEXTBOOK_ACTIVITIES, TextbookActivity } from '../../data/lesson1/activities';
import { SourceBadge } from '../common/SourceBadge';
import { ArabicNumber } from '../common/BiDi';
import {
  Lesson1GrammarSupport,
  SpellingExplanation,
  VocabularyExplanation,
} from './Lesson1Explanations';
import { Lesson2StepRenderer } from './Lesson2StepRenderer';

/**
 * StepRenderer — renders a lesson step's content blocks.
 * Source-derived blocks are labelled «النص الأصلي من الكتاب»; platform-added
 * explanation is rendered under a distinct «شرح المنصة» heading.
 */

export const StepRenderer: React.FC<{ step: LessonStep }> = ({ step }) => {
  if (step.id.startsWith('l2-')) {
    return <Lesson2StepRenderer step={step} />;
  }

  const content = LESSON1_STEP_CONTENT[step.id];
  if (!content) {
    return <p className="step-empty-note">لا يوجد محتوى لهذه الخطوة بعد.</p>;
  }

  return (
    <div className="step-renderer">
      {content.blocks.map((block, idx) => (
        <React.Fragment key={`${step.id}-${idx}`}>
          <BlockView block={block} />
          {step.id === 'l1-s3' && block.kind === 'vocab' && <VocabularyExplanation />}
          {step.id === 'l1-s6' && block.kind === 'rule' && <Lesson1GrammarSupport />}
          {step.id === 'l1-s7' && block.kind === 'rule' && <SpellingExplanation />}
        </React.Fragment>
      ))}
    </div>
  );
};

const BlockView: React.FC<{ block: LessonBlock }> = ({ block }) => {
  switch (block.kind) {
    case 'source_passage':
      return (
        <section className="block-source-passage">
          <header className="block-source-head">
            <span className="source-label-original">النص الأصلي من الكتاب</span>
            <SourceBadge source={block.source} />
          </header>
          <h3 className="block-heading">{block.heading}</h3>
          <div className="passage-body">
            {block.paragraphs.map((p, i) => (
              <p key={i} className="passage-para">{p}</p>
            ))}
          </div>
        </section>
      );
    case 'source_sentences':
      return (
        <section className="block-source-sentences">
          <header className="block-source-head">
            <span className="source-label-original">النص الأصلي من الكتاب</span>
            <SourceBadge source={block.source} />
          </header>
          <h3 className="block-heading">{block.heading}</h3>
          <ul className="source-sentence-list">
            {block.sentences.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      );
    case 'vocab':
      return (
        <section className="block-vocab">
          <header className="block-source-head">
            <span className="source-label-original">معجم الكلمات (من الكتاب)</span>
            <SourceBadge source={block.source} />
          </header>
          <div className="vocab-grid">
            {block.items.map((v, i) => (
              <div key={i} className="vocab-card">
                <span className="vocab-term">{v.term}</span>
                <span className="vocab-meaning">{v.meaning}</span>
              </div>
            ))}
          </div>
        </section>
      );
    case 'rule':
      return (
        <section className="block-rule">
          <header className="block-source-head">
            <span className="source-label-original">القاعدة (من الكتاب)</span>
            <SourceBadge source={block.source} />
          </header>
          <h3 className="block-heading">{block.heading}</h3>
          <div className="rule-box">
            {block.lines.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
        </section>
      );
    case 'instruction':
      return (
        <section className="block-instruction">
          <header className="block-source-head">
            <span className="source-label-original">توجيه من الكتاب</span>
            <SourceBadge source={block.source} />
          </header>
          <p className="instruction-text">{block.text}</p>
        </section>
      );
    case 'explanation':
      return (
        <section className="block-explanation">
          <span className="source-label-explain">شرح المنصة</span>
          {block.lines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </section>
      );
    case 'activity': {
      const activity = TEXTBOOK_ACTIVITIES.find((a) => a.id === block.activityId);
      if (!activity) return null;
      return <ActivityWidget activity={activity} />;
    }
    default:
      return null;
  }
};

/* ------------------------------------------------------------------ */

const ActivityWidget: React.FC<{ activity: TextbookActivity }> = ({ activity }) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <section className="activity-widget" aria-label={`نشاط ${activity.printedNumber}`}>
      <header className="activity-head">
        <span className="activity-number">
          نشاط <ArabicNumber value={activity.printedNumber} />
        </span>
        <SourceBadge source={activity.source} />
      </header>
      <p className="activity-instruction">{activity.instruction}</p>
      {activity.uncertain && (
        <p className="activity-uncertain" role="note">
          ⚠ بَنْدٌ بِحاجَةٍ إلى قَصٍّ أَدَقَّ: {activity.uncertain}
        </p>
      )}

      <InteractionView activity={activity} />

      <button
        type="button"
        className="btn btn-ghost btn-small"
        onClick={() => setShowSolution((s) => !s)}
        aria-expanded={showSolution}
      >
        {showSolution ? 'إخفاء الإجابة النموذجية' : 'اعرض الإجابة النموذجية'}
      </button>
      {showSolution && (
        <div className="activity-solution">
          <p className="solution-answer">{activity.solution.answer}</p>
          <p className="solution-explain"><span className="source-label-explain">شرح المنصة</span> {activity.solution.explanation}</p>
        </div>
      )}
    </section>
  );
};

const InteractionView: React.FC<{ activity: TextbookActivity }> = ({ activity }) => {
  const it = activity.interaction;
  const [values, setValues] = useState<Record<string, string>>({});

  const setVal = (id: string, v: string) => setValues((p) => ({ ...p, [id]: v }));

  switch (it.kind) {
    case 'text_inputs':
      return (
        <div className="inter-text-inputs">
          {it.fields.map((f) => (
            <label key={f.id} className="inter-field">
              <span className="inter-label">{f.label}</span>
              <input
                type="text"
                className="inter-input"
                value={values[f.id] || ''}
                onChange={(e) => setVal(f.id, e.target.value)}
                placeholder="اكتُبْ إِجابَتَكَ هُنا"
              />
            </label>
          ))}
        </div>
      );
    case 'choose':
    case 'multi': {
      const correctIds = it.kind === 'choose' ? [it.correctId] : it.correctIds;
      return (
        <div className="inter-choices">
          {it.choices.map((c) => {
            const selected = it.kind === 'choose' ? values.sel === c.id : (values.sel || '').split('|').includes(c.id);
            const toggle = () => {
              if (it.kind === 'choose') setVal('sel', c.id);
              else {
                const cur = (values.sel || '').split('|').filter(Boolean);
                const next = cur.includes(c.id) ? cur.filter((x) => x !== c.id) : [...cur, c.id];
                setVal('sel', next.join('|'));
              }
            };
            return (
              <button key={c.id} type="button" className={`inter-choice ${selected ? 'selected' : ''}`} onClick={toggle} aria-pressed={selected}>
                {c.text}
              </button>
            );
          })}
          <span className="inter-hint">الإجاباتُ الصَّحيحَةُ: {correctIds.length}</span>
        </div>
      );
    }
    case 'classify':
      return (
        <div className="inter-classify">
          {it.items.map((item) => (
            <div key={item.id} className="inter-classify-row">
              <span className="inter-label">{item.text}</span>
              <div className="inter-classify-btns">
                {it.categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`inter-choice ${values[item.id] === cat.id ? 'selected' : ''}`}
                    onClick={() => setVal(item.id, cat.id)}
                    aria-pressed={values[item.id] === cat.id}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case 'write':
      return (
        <textarea
          className="inter-textarea"
          rows={4}
          value={values.write || ''}
          onChange={(e) => setVal('write', e.target.value)}
          placeholder="اكتُبْ إِجابَتَكَ هُنا..."
          aria-label="مساحة الكتابة"
        />
      );
    case 'speak':
      return <p className="inter-speak-note">🗣 نَشاطٌ شَفَوِيٌّ: أَجِبْ صَوْتِيّاً مَعَ زُملائِكَ أَوْ مُعَلِّمِكَ.</p>;
    case 'decode':
      return <p className="inter-speak-note">🧩 لُعبَةُ فُكِّ الرُّموزِ: اسْتَخْدِمْ لَوْحَةَ الحُروفِ أَعْلاهُ. (بانتظار قَصٍّ أَدَقَّ لِصَفَّي الرُّموزِ)</p>;
    default:
      return null;
  }
};
