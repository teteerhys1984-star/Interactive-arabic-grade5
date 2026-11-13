import React, { useState } from 'react';
import { LESSON2_PLATFORM_EXERCISES, PlatformExercise } from '../../data/lesson2/platformExplanations';
import { readDraft, writeDraft } from '../../utils/draftStorage';
import { ArabicNumber } from '../common/BiDi';

const SCOPE = 'lesson2-platform-checks';

/**
 * Lesson 2 platform panels (steps l2-s5 and l2-s6).
 *
 * PRESENTATION-ONLY POLISH (PR #17):
 *  - the panel introduction uses the same `.platform-panel-header` pattern as
 *    Lesson 1, so the title/lead no longer sit flush against the panel edge;
 *  - the exercise rows, the «تحقّق» button, and the feedback block follow one
 *    vertical rhythm (title → question → fields → action → feedback);
 *  - correctness is conveyed by an icon, an explicit word («صحيح» /
 *    «يحتاج مراجعة»), a border style, and a background tint — never by colour
 *    alone;
 *  - the feedback container is a polite, atomic live region, and each field is
 *    associated with its own feedback line through `aria-describedby`.
 *
 * NOTHING ELSE CHANGES: exercise content, prompts, options, answer keys, the
 * draft scope/keys (`lesson2-platform-checks` + exercise id), the flat
 * `Record<string, string>` payload, and the check protocol (feedback appears
 * only after «تحقّق»; changing an answer clears the previous verdict) are all
 * preserved exactly as delivered in the previous PR.
 */
const Exercise: React.FC<{ exercise: PlatformExercise }> = ({ exercise }) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const saved = readDraft(SCOPE, exercise.id);
    return Object.fromEntries(exercise.rows
      .filter((row) => row.options.some((option) => option.id === saved[row.id]))
      .map((row) => [row.id, saved[row.id]]));
  });
  const [checked, setChecked] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const complete = exercise.rows.every((row) => row.options.some((option) => option.id === values[row.id]));
  const correctCount = exercise.rows.filter((row) => values[row.id] === row.correctId).length;

  const update = (rowId: string, value: string) => {
    const next = { ...values, [rowId]: value };
    setValues(next);
    setChecked(false);
    setSaveFailed(!writeDraft(SCOPE, exercise.id, next));
  };

  return (
    <section
      className="platform-quick-check l2-platform-exercise"
      aria-labelledby={`${exercise.id}-title`}
    >
      <header className="l2-exercise-head">
        <span className="source-label-explain">تدريب من المنصة</span>
        <h4 id={`${exercise.id}-title`}>{exercise.title}</h4>
        <p className="l2-exercise-prompt">{exercise.prompt}</p>
      </header>

      <div className="l2-exercise-rows">
        {exercise.rows.map((row) => {
          const selectedId = values[row.id] || '';
          const verdict = checked && selectedId
            ? selectedId === row.correctId ? 'correct' : 'wrong'
            : null;
          return (
            <div className={`l2-exercise-row${verdict ? ` is-${verdict}` : ''}`} key={row.id}>
              {/* The label is a separate element rather than a wrapper, so the
                  select's accessible name stays the row label and never absorbs
                  the option texts. */}
              <div className="inter-field">
                <label className="inter-label" htmlFor={`${row.id}-select`}>{row.label}</label>
                <select
                  id={`${row.id}-select`}
                  className="inter-input l2-exercise-select"
                  value={selectedId}
                  onChange={(event) => update(row.id, event.target.value)}
                  aria-describedby={verdict ? `${row.id}-feedback` : undefined}
                >
                  <option value="">اختر إجابتك</option>
                  {row.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      <div className="l2-exercise-actions">
        <button
          type="button"
          className="btn btn-primary l2-check-button"
          disabled={!complete}
          onClick={() => setChecked(true)}
        >
          تحقّق
        </button>
        <p className="l2-exercise-hint">
          {complete
            ? 'يمكنك تعديل إجابتك ثم التحقّق مجدّدًا.'
            : 'أكمل جميع الحقول ليصبح زرّ التحقّق متاحًا.'}
        </p>
      </div>

      {saveFailed && (
        <p role="alert" className="l2-exercise-save-alert">
          تعذّر حفظ المسودة في هذه الجلسة؛ يمكنك متابعة الحل هنا.
        </p>
      )}

      {checked && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="quick-check-result l2-check-result"
        >
          <p className="l2-check-summary">
            <span className="source-label-explain">نتيجة التحقّق</span>{' '}
            <span className="l2-check-summary-text">
              الإجابات الصحيحة: <ArabicNumber value={correctCount} /> من <ArabicNumber value={exercise.rows.length} />.
            </span>
          </p>
          <ul className="l2-check-lines">
            {exercise.rows.map((row) => {
              const selected = row.options.find((option) => option.id === values[row.id]);
              const correct = row.options.find((option) => option.id === row.correctId);
              if (!selected || !correct) return null;
              const isCorrect = selected.id === correct.id;
              return (
                <li
                  key={row.id}
                  id={`${row.id}-feedback`}
                  className={`l2-check-line is-${isCorrect ? 'correct' : 'wrong'}`}
                >
                  <span className="l2-check-mark" aria-hidden="true">{isCorrect ? '✓' : '✗'}</span>
                  <span className="l2-check-verdict">{isCorrect ? 'صحيح' : 'يحتاج مراجعة'}</span>
                  <p className="l2-check-line-body">
                    <strong>{row.label}: {isCorrect ? 'أحسنت!' : 'حاول مجددًا.'}</strong>{' '}
                    {selected.reason}
                    {!isCorrect && <>{' '}الإجابة المناسبة: {correct.label}. {correct.reason}</>}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
};

const PANEL_COPY: Record<'l2-s5' | 'l2-s6', { label: string; heading: string; paragraphs: string[] }> = {
  'l2-s5': {
    label: 'شرح المنصة وتدريبات المصدر',
    heading: 'أفهم المصدر وأتدرّب',
    paragraphs: [
      'الفعل يدل على حدث ويرتبط بزمن. أمّا المصدر فهو اسم للحدث نفسه، ولا يحدّد زمن وقوعه.',
      'مثال من المنصة: في «أحبُّ القراءةَ»، القراءة اسم لحدث القراءة. نقارنها بالفعل «قرأَ» الذي يدل على حدث في الماضي. الكتاب اسم شيء، لا اسم الحدث في هذا المثال.',
      'لا يكفي أن تكون الكلمة اسمًا بلا زمن حتى تكون مصدرًا؛ نسأل أيضًا: هل تسمّي حدثًا؟',
    ],
  },
  'l2-s6': {
    label: 'شرح المنصة وتدريبات همزة القطع',
    heading: 'أتدرّب على همزة القطع',
    paragraphs: [
      'أحدّد نوع الكلمة وأرجع إلى مواضع همزة القطع في قاعدة الكتاب، ثم أطبّق على أمثلة جديدة من المنصة.',
    ],
  },
};

export const Lesson2Explanations: React.FC<{ stepId: 'l2-s5' | 'l2-s6' }> = ({ stepId }) => {
  const copy = PANEL_COPY[stepId];
  return (
    <section className="platform-teaching-panel l2-platform-panel" aria-label={copy.label}>
      <header className="platform-panel-header l2-platform-panel-header">
        <span className="source-label-explain">شرح المنصة</span>
        <h3 id={`${stepId}-platform-heading`}>{copy.heading}</h3>
      </header>
      <div className="l2-platform-body">
        <div className="l2-platform-lead">
          {copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        {LESSON2_PLATFORM_EXERCISES[stepId].map((exercise) => (
          <Exercise key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </section>
  );
};
