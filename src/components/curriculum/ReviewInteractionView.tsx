import React from 'react';
import { ReviewInteraction, ReviewSubpart } from '../../data/unit1Review/reviewItems';

/**
 * Student-side interaction views for «تقويم الوحدة الأولى».
 *
 * Contract:
 *  - Inputs only. No answer key, no correctness flag, no explanation is ever
 *    rendered here — the teacher solutions live in the Teacher Area only.
 *  - Keyboard accessible: buttons/inputs/selects, no drag-and-drop dependency.
 *  - Values are keyed by `${subpartId}:${field}` so answers survive navigation.
 */

export const answerKey = (subpartId: string, field: string): string => `${subpartId}:${field}`;

/** Answer fields a subpart exposes in the Student Area. */
export function answerFieldsOf(interaction: ReviewInteraction): string[] {
  switch (interaction.kind) {
    case 'guidance':
      return [];
    case 'judgement':
      return ['judge', 'correction'];
    case 'single_choice':
      return ['choice'];
    case 'pick_and_classify':
      return ['pick', 'type'];
    case 'time_field':
    case 'writing_field':
    case 'short_field':
    case 'inline_blank':
      return ['value'];
    case 'paragraph':
      return ['text'];
    default:
      return [];
  }
}

/** True when the learner has provided an answer for this subpart. */
export function isSubpartAnswered(
  subpart: ReviewSubpart,
  values: Record<string, string>,
  answeredFields?: Record<string, string[]>,
): boolean {
  const fields = answeredFields?.[subpart.id] ?? answerFieldsOf(subpart.interaction);
  if (fields.length === 0) return false;
  return fields.some((field) => (values[answerKey(subpart.id, field)] || '').trim().length > 0);
}

export interface ReviewInteractionViewProps {
  subpart: ReviewSubpart;
  values: Record<string, string>;
  update: (key: string, value: string) => void;
}

export const ReviewInteractionView: React.FC<ReviewInteractionViewProps> = ({ subpart, values, update }) => {
  const field = (name: string) => answerKey(subpart.id, name);
  const get = (name: string) => values[field(name)] || '';

  switch (subpart.interaction.kind) {
    case 'guidance':
      return (
        <p className="u1r-guidance-line" role="note">
          <span aria-hidden="true">◾ </span>
          {subpart.prompt}
        </p>
      );

    case 'time_field':
      return (
        <label className="u1r-field" htmlFor={field('value')}>
          <span className="u1r-field-label">{subpart.interaction.label}</span>
          <input
            id={field('value')}
            className="u1r-input"
            type="text"
            inputMode="text"
            value={get('value')}
            onChange={(event) => update(field('value'), event.target.value)}
            placeholder="مثال: ١٠:٤٥"
          />
        </label>
      );

    case 'writing_field':
    case 'short_field':
      return (
        <label className="u1r-field" htmlFor={field('value')}>
          <span className="u1r-field-label">{subpart.interaction.label}</span>
          <textarea
            id={field('value')}
            className="u1r-textarea"
            rows={subpart.interaction.kind === 'writing_field' ? subpart.interaction.rows : subpart.interaction.rows}
            value={get('value')}
            onChange={(event) => update(field('value'), event.target.value)}
            placeholder={subpart.interaction.placeholder || 'اكتب إجابتك هنا…'}
          />
        </label>
      );

    case 'judgement':
      return (
        <div className="u1r-judgement">
          <div className="u1r-options" role="radiogroup" aria-label={`حكمك على ${subpart.label}`}>
            {[
              { id: 'true', label: 'صحيحة ✓' },
              { id: 'false', label: 'غير صحيحة ✗' },
            ].map((option) => (
              <label
                key={option.id}
                className={`u1r-option ${get('judge') === option.id ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name={field('judge')}
                  value={option.id}
                  checked={get('judge') === option.id}
                  onChange={() => update(field('judge'), option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <label className="u1r-field" htmlFor={field('correction')}>
            <span className="u1r-field-label">{subpart.interaction.correctionLabel}</span>
            <textarea
              id={field('correction')}
              className="u1r-textarea"
              rows={2}
              value={get('correction')}
              onChange={(event) => update(field('correction'), event.target.value)}
              placeholder="إن كانت العبارة غير صحيحة فاكتب تصويبها هنا…"
            />
          </label>
        </div>
      );

    case 'single_choice':
      return (
        <div className="u1r-parentheses" role="radiogroup" aria-label={`إجابة ${subpart.label}`}>
          {subpart.interaction.choices.map((choice) => (
            <label
              key={choice.id}
              className={`u1r-choice ${get('choice') === choice.id ? 'is-selected' : ''}`}
            >
              <input
                type="radio"
                name={field('choice')}
                value={choice.id}
                checked={get('choice') === choice.id}
                onChange={() => update(field('choice'), choice.id)}
              />
              <span>{choice.text}</span>
            </label>
          ))}
        </div>
      );

    case 'paragraph':
      return (
        <div className="u1r-paragraph">
          <ul className="u1r-required-phrases" aria-label="التراكيب المطلوب استعمالها">
            {subpart.interaction.requiredPhrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
          {subpart.interaction.helperNote && <p className="u1r-helper">{subpart.interaction.helperNote}</p>}
          <label className="u1r-field" htmlFor={field('text')}>
            <span className="u1r-field-label">اكتب فقرتك هنا</span>
            <textarea
              id={field('text')}
              className="u1r-textarea u1r-paragraph-box"
              rows={subpart.interaction.rows}
              value={get('text')}
              onChange={(event) => update(field('text'), event.target.value)}
              placeholder="اكتب فقرة عن أهمية الكتاب…"
            />
          </label>
        </div>
      );

    case 'pick_and_classify': {
      const { words, categories, gapNote } = subpart.interaction;
      const picked = get('pick');
      return (
        <div className="u1r-classify">
          <aside className="u1r-gap-notice" role="note">
            <strong>حدّ مصدر معلن:</strong> {gapNote}
          </aside>
          <fieldset className="u1r-word-picker">
            <legend>١) أشيرُ إلى الكلمة الملوّنة في كتابي:</legend>
            <div className="u1r-word-grid">
              {words.map((word) => (
                <button
                  key={word}
                  type="button"
                  className={`u1r-word ${picked === word ? 'is-selected' : ''}`}
                  aria-pressed={picked === word}
                  onClick={() => update(field('pick'), picked === word ? '' : word)}
                >
                  {word}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="u1r-classify-choice">
            <legend>٢) أصنِّفُها:</legend>
            <div className="u1r-options" role="radiogroup" aria-label={`تصنيف ${subpart.label}`}>
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={`u1r-option ${get('type') === category.id ? 'is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={field('type')}
                    value={category.id}
                    checked={get('type') === category.id}
                    onChange={() => update(field('type'), category.id)}
                  />
                  <span>{category.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      );
    }

    case 'inline_blank':
      return (
        <p className="u1r-inline-blank">
          <span className="u1r-sentence-part">{subpart.interaction.before}</span>
          <label className="u1r-blank-field">
            <span className="u1r-visually-hidden">{`إجابة ${subpart.label}`}</span>
            <input
              className="u1r-blank-input"
              type="text"
              value={get('value')}
              onChange={(event) => update(field('value'), event.target.value)}
              placeholder="………"
            />
          </label>
          <span className="u1r-sentence-part">{subpart.interaction.after}</span>
        </p>
      );

    default:
      return null;
  }
};
