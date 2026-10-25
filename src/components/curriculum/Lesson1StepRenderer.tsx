import React, { useMemo, useState } from 'react';
import './lesson1.css';
import { LessonStep } from '../../types/curriculum';
import { LESSON1_STEP_CONTENT, LessonBlock } from '../../data/lesson1/content';
import { TEXTBOOK_ACTIVITIES, TextbookActivity, ActivityInteraction } from '../../data/lesson1/activities';
import { getSourceRecord } from '../../data/lesson1/readingSource';
import { LESSON1_IRAB_PAGE, IRAB_ISSUE_REGISTER } from '../../data/lesson1/irabPage';
import { SourceBadge } from '../common/SourceBadge';
import { ArabicNumber } from '../common/BiDi';
import {
  Lesson1GrammarSupport,
  SpellingExplanation,
  VocabularyExplanation,
} from './Lesson1Explanations';

/**
 * Lesson1StepRenderer — the Lesson-1 render layer.
 *
 * WHY A LESSON-LOCAL RENDERER (documented comparison with editing the shared one):
 *  - Editing `StepRenderer.tsx` / `ActivityWidget` would change the behaviour of a
 *    shared component and would need re-verification of lessons 2, 3 and unit 2
 *    lesson 1, which are out of the approved scope.
 *  - Injecting this renderer from `App.tsx` (the only shared file touched) keeps the
 *    foundation untouched: `LessonShell.renderStepContent` already exists for exactly
 *    this purpose, and `StepRenderer` remains the default for every other lesson.
 *
 * ACTIVITY PROTOCOL (owner-mandated):
 *  attempt → «تحقّق من إجاباتي» → per-item result + explanation + why-wrong →
 *  edit & retry. Nothing about correctness is revealed on selection; the model
 *  answer unlocks only after the first check and is always labelled as such.
 *  Items pending an owner decision are never corrected and never show a key.
 */

export interface Lesson1StepRendererProps {
  step: LessonStep;
  /** Opens the standalone i‘rab page without unmounting the lesson (step state kept). */
  onOpenIrab?: () => void;
}

/* ------------------------------------------------------------------ */
/* Arabic answer normalisation (lesson-local; no shared helper touched) */
/* ------------------------------------------------------------------ */

const stripForMatch = (value: string): string =>
  value
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '') // harakat, superscript alef, tatweel
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Western digits → Arabic-Indic digits for display inside Arabic sentences. */
const toArabicDigits = (value: number): string =>
  String(value).replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);

const matchesAccepted = (value: string, accepted: string[] | undefined): boolean => {
  if (!accepted || accepted.length === 0) return false;
  const given = stripForMatch(value);
  if (!given) return false;
  return accepted.some((answer) => {
    const target = stripForMatch(answer);
    if (!target) return false;
    return given === target || (target.length >= 4 && given.includes(target));
  });
};

/* ------------------------------------------------------------------ */
/* Layer / status badges                                              */
/* ------------------------------------------------------------------ */

const LAYER_LABELS: Record<string, string> = {
  printed: 'مطابق للنصّ المطبوع',
  owner: 'قراءة معتمدة بقرار المالك',
  corrected: 'تصحيح معتمد (المطبوع محفوظ)',
  platform: 'إضافة المنصة',
};

const STATUS_LABELS: Record<TextbookActivity['status'], string> = {
  solved: 'منفّذ ومحلول',
  partial_pending: 'منفّذ — جزءٌ معلّق',
  pending: 'منفّذ — معلّق بانتظار الاعتماد',
};

const ActivityBadges: React.FC<{ activity: TextbookActivity }> = ({ activity }) => {
  const layers = useMemo(() => {
    const found = new Set<string>();
    activity.sourceRecordIds.forEach((id) => {
      const record = getSourceRecord(id);
      if (record) found.add(record.layer);
    });
    return Array.from(found);
  }, [activity.sourceRecordIds]);

  return (
    <div className="l1-badges">
      {layers.map((layer) => (
        <span
          key={layer}
          className={`l1-badge l1-badge--${layer === 'printed' ? 'printed' : layer === 'owner' ? 'owner' : layer === 'corrected' ? 'corrected' : 'platform'}`}
        >
          {LAYER_LABELS[layer] ?? layer}
        </span>
      ))}
      <span className={`l1-badge ${activity.status === 'solved' ? 'l1-badge--solved' : 'l1-badge--pending'}`}>
        {STATUS_LABELS[activity.status]}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Fields derived from the interaction                                */
/* ------------------------------------------------------------------ */

type FieldResult = 'correct' | 'review' | 'pending' | 'open';

interface FieldSpec {
  id: string;
  label: string;
  accepted?: string[];
  pending?: boolean;
}

const collectFields = (interaction: ActivityInteraction): FieldSpec[] => {
  switch (interaction.kind) {
    case 'text_inputs':
      return interaction.fields.map((field) => ({
        id: field.id,
        label: field.label,
        accepted: field.acceptedAnswers,
        pending: field.pending,
      }));
    case 'choose':
      return [{ id: 'sel', label: 'الاختيار الصحيح', accepted: [interaction.correctId] }];
    case 'multi':
      return [{ id: 'sel', label: 'الاختيارات الصحيحة', accepted: interaction.correctIds.join('|') ? [interaction.correctIds.join('|')] : [] }];
    case 'classify':
      return interaction.items.map((item) => ({
        id: item.id,
        label: item.text,
        accepted: [item.correctCategoryId],
      }));
    case 'table_fill':
      return interaction.rows.flatMap((row) =>
        row.cells.flatMap((cell) =>
          'fieldId' in cell
            ? [{ id: cell.fieldId, label: cell.fieldId, accepted: cell.acceptedAnswers, pending: cell.pending }]
            : [],
        ),
      );
    case 'diagram_fill':
      return interaction.boxes.flatMap((box) =>
        box.fieldId
          ? [{ id: box.fieldId, label: box.fieldId, accepted: box.acceptedAnswers, pending: box.pending }]
          : [],
      );
    default:
      return [];
  }
};

/** Answer keys used for checking, kept out of the DOM until the first check. */
const keyFor = (interaction: ActivityInteraction, fieldId: string): string[] | undefined => {
  switch (interaction.kind) {
    case 'choose':
      return [interaction.correctId];
    case 'multi':
      return [interaction.correctIds.slice().sort().join('|')];
    case 'classify':
      return [interaction.items.find((item) => item.id === fieldId)?.correctCategoryId ?? ''];
    default:
      return undefined;
  }
};

const isChoiceLike = (kind: ActivityInteraction['kind']): boolean =>
  kind === 'choose' || kind === 'multi' || kind === 'classify';

/* ------------------------------------------------------------------ */
/* The compliant activity widget                                      */
/* ------------------------------------------------------------------ */

const Lesson1ActivityWidget: React.FC<{ activity: TextbookActivity }> = ({ activity }) => {
  const interaction = activity.interaction;
  const fields = useMemo(() => collectFields(interaction), [interaction]);
  const [values, setValues] = useState<Record<string, string>>({});
  /** Verdicts of the LAST check are visible only while `checked` is true. */
  const [checked, setChecked] = useState(false);
  /** True once the learner has checked at least once (unlocks the model answer). */
  const [attempted, setAttempted] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  /**
   * Every answer edit keeps the new value and clears the previous verdict at once,
   * so a stale result is never left on screen and nothing is revealed about the new
   * answer until «تحقّق» is pressed again. Used by all interaction kinds (text inputs,
   * single/multi choice, classification, tables, diagram blanks, free-form boxes).
   */
  const setVal = (id: string, value: string) => {
    setValues((previous) => ({ ...previous, [id]: value }));
    setChecked(false);
  };

  const runCheck = () => {
    setChecked(true);
    setAttempted(true);
  };

  const isPendingInteraction = interaction.kind === 'decode' && interaction.checkDisabled === true;
  const isFreeForm = interaction.kind === 'write' || interaction.kind === 'speak' || interaction.kind === 'decode';

  const evaluate = (field: FieldSpec): FieldResult => {
    if (field.pending) return 'pending';
    const value = values[field.id] ?? '';
    const accepted = isChoiceLike(interaction.kind) ? keyFor(interaction, field.id) : field.accepted;
    if (isChoiceLike(interaction.kind)) {
      if (interaction.kind === 'multi') {
        const picked = (value || '').split('|').filter(Boolean).sort().join('|');
        return picked === (accepted?.[0] ?? '') ? 'correct' : 'review';
      }
      return matchesAccepted(value, accepted) ? 'correct' : 'review';
    }
    if (!value.trim()) return 'open';
    return matchesAccepted(value, accepted) ? 'correct' : 'review';
  };

  const results = useMemo(
    () => (checked ? fields.map((field) => ({ field, result: evaluate(field) })) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checked, values, fields],
  );

  const correctCount = results.filter((entry) => entry.result === 'correct').length;
  const pendingCount = results.filter((entry) => entry.result === 'pending').length;
  const reviewCount = results.filter((entry) => entry.result === 'review').length;

  const toggleMulti = (choiceId: string) => {
    const current = (values.sel || '').split('|').filter(Boolean);
    const next = current.includes(choiceId) ? current.filter((id) => id !== choiceId) : [...current, choiceId];
    setVal('sel', next.join('|'));
  };

  const renderResult = (field: FieldSpec, result: FieldResult) => {
    if (result === 'pending') {
      return (
        <p className="l1-result l1-result--pending" role="note">
          ⏸ هذا الفراغ معلّق بقرار صاحب المشروع: لا تُعرض له إجابة ولا يُحتسب ضمن المحلول.
        </p>
      );
    }
    if (result === 'open') {
      return (
        <p className="l1-result l1-result--open">
          ⟡ لم تُكتب إجابة بعد — اكتب إجابتك ثم تحقّق مجدّدًا.
        </p>
      );
    }
    if (result === 'correct') {
      return (
        <p className="l1-result l1-result--correct">
          ✔ إجابة صحيحة. {activity.solution.explanation}
        </p>
      );
    }
    const accepted = isChoiceLike(interaction.kind) ? undefined : field.accepted;
    return (
      <p className="l1-result l1-result--review">
        ⟳ تحتاج مراجعة.
        {accepted && accepted.length > 0 ? (
          <>
            {' '}
            لماذا لم تُقبل؟ إجابتك لا تطابق أيًّا من الإجابات المقبولة: {accepted.join(' / ')}.
          </>
        ) : (
          <> لماذا لم تُقبل؟ الاختيار لا يطابق الإجابة الصحيحة في المفتاح المعتمد بعد التحقّق.</>
        )}
      </p>
    );
  };

  const renderControl = (field: FieldSpec) => {
    if (field.pending) {
      return (
        <input
          className="l1-input"
          type="text"
          value={values[field.id] ?? ''}
          onChange={(event) => setVal(field.id, event.target.value)}
          placeholder="معلّق بانتظار الاعتماد — لا تصحيح آلي"
          aria-label={`${field.label} (معلّق)`}
        />
      );
    }
    return (
      <input
        className="l1-input"
        type="text"
        value={values[field.id] ?? ''}
        onChange={(event) => setVal(field.id, event.target.value)}
        placeholder="اكتب إجابتك هنا"
        aria-label={field.label}
        aria-invalid={checked && evaluate(field) === 'review' ? true : undefined}
      />
    );
  };

  /**
   * Choice rendering: selection paints NO correctness cue. Only after the check do
   * the classes appear (correct pick, wrong pick, or a missed correct option).
   */
  const choiceButtons = (
    choices: { id: string; text: string }[],
    selectedIds: string[],
    onPick: (id: string) => void,
    correctIds: string[],
  ) => (
    <div className="l1-choices">
      {choices.map((choice) => {
        const selected = selectedIds.includes(choice.id);
        const isCorrectChoice = correctIds.includes(choice.id);
        const stateClass = !checked
          ? ''
          : selected && isCorrectChoice
            ? ' is-correct'
            : selected && !isCorrectChoice
              ? ' is-wrong'
              : !selected && isCorrectChoice
                ? ' is-wrong'
                : '';
        return (
          <button
            key={choice.id}
            type="button"
            className={`l1-choice${stateClass}`}
            aria-pressed={selected}
            onClick={() => onPick(choice.id)}
          >
            {choice.text}
          </button>
        );
      })}
    </div>
  );

  /** Post-check feedback for a choice question (why-wrong included). */
  const choiceFeedback = (selectedIds: string[], correctIds: string[], choiceText: (id: string) => string) => {
    const picked = selectedIds.slice().sort().join('|');
    const expected = correctIds.slice().sort().join('|');
    if (picked === expected) {
      return (
        <p className="l1-result l1-result--correct" role="status">
          ✔ اختيار صحيح. {activity.solution.explanation}
        </p>
      );
    }
    const missed = correctIds.filter((id) => !selectedIds.includes(id)).map(choiceText);
    const extra = selectedIds.filter((id) => !correctIds.includes(id)).map(choiceText);
    return (
      <p className="l1-result l1-result--review" role="status">
        ⟳ يحتاج مراجعة. لماذا؟
        {extra.length > 0 && <> اخترتَ «{extra.join('، ')}» وليست من الإجابات الصحيحة.</>}
        {missed.length > 0 && <> فاتك «{missed.join('، ')}».</>}
        {' '}التعليل: {activity.solution.explanation}
      </p>
    );
  };

  return (
    <section
      className="l1-activity activity-widget"
      aria-label={`نشاط ${activity.printedNumber} (${activity.section})`}
    >
      <header className="activity-head">
        <span className="activity-number">
          نشاط <ArabicNumber value={activity.printedNumber} />
        </span>
        <SourceBadge source={activity.source} />
      </header>

      <ActivityBadges activity={activity} />

      <p className="l1-activity-instruction">{activity.instruction}</p>

      {activity.correctionNote && (
        <div className="l1-notice l1-notice--corrected" role="note">
          <strong>تصحيح معتمد</strong>
          {activity.correctionNote}
          {activity.printedVariant && (
            <div className="l1-printed-variant">النصّ المطبوع المحفوظ: {activity.printedVariant}</div>
          )}
        </div>
      )}

      {activity.pendingNote && (
        <div className="l1-notice l1-notice--pending" role="note">
          <strong>بندٌ معلّق (غير محلول)</strong>
          {activity.pendingNote}
        </div>
      )}

      {/* ---------------- interaction ---------------- */}
      {interaction.kind === 'text_inputs' && (
        <div className="inter-text-inputs">
          {fields.map((field) => {
            const result = checked ? evaluate(field) : undefined;
            return (
              <label key={field.id} className="l1-field inter-field">
                <span className="l1-field-label inter-label">{field.label}</span>
                {renderControl(field)}
                {result && renderResult(field, result)}
              </label>
            );
          })}
        </div>
      )}

      {interaction.kind === 'choose' && (
        <div className="l1-field">
          <span className="l1-field-label">اختر إجابة واحدة (لا يظهر التصحيح قبل التحقّق):</span>
          {choiceButtons(
            interaction.choices,
            values.sel ? [values.sel] : [],
            (id) => setVal('sel', id),
            [interaction.correctId],
          )}
          {checked &&
            choiceFeedback(
              values.sel ? [values.sel] : [],
              [interaction.correctId],
              (id) => interaction.choices.find((choice) => choice.id === id)?.text ?? id,
            )}
        </div>
      )}

      {interaction.kind === 'multi' && (
        <div className="l1-field">
          <span className="l1-field-label">اختر أكثر من إجابة (لا يظهر التصحيح قبل التحقّق):</span>
          {choiceButtons(
            interaction.choices,
            (values.sel || '').split('|').filter(Boolean),
            toggleMulti,
            interaction.correctIds,
          )}
          {checked &&
            choiceFeedback(
              (values.sel || '').split('|').filter(Boolean),
              interaction.correctIds,
              (id) => interaction.choices.find((choice) => choice.id === id)?.text ?? id,
            )}
        </div>
      )}

      {interaction.kind === 'classify' && (
        <div className="inter-classify">
          {interaction.items.map((item) => {
            const result = checked ? evaluate({ id: item.id, label: item.text, accepted: [item.correctCategoryId] }) : undefined;
            return (
              <div key={item.id} className="l1-classify-row inter-classify-row">
                <span className="l1-field-label inter-label">{item.text}</span>
                <div className="l1-choices inter-classify-btns">
                  {interaction.categories.map((category) => {
                    const selected = values[item.id] === category.id;
                    const stateClass = !checked
                      ? ''
                      : selected
                        ? category.id === item.correctCategoryId
                          ? ' is-correct'
                          : ' is-wrong'
                        : category.id === item.correctCategoryId
                          ? ' is-wrong'
                          : '';
                    return (
                      <button
                        key={category.id}
                        type="button"
                        className={`l1-choice${stateClass}`}
                        aria-pressed={selected}
                        onClick={() => setVal(item.id, category.id)}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>
                {result && (
                  <p
                    className={`l1-result ${result === 'correct' ? 'l1-result--correct' : 'l1-result--review'}`}
                    role="status"
                  >
                    {result === 'correct'
                      ? '✔ تصنيف صحيح.'
                      : `⟳ يحتاج مراجعة. لماذا؟ الصواب: «${interaction.categories.find((category) => category.id === item.correctCategoryId)?.label ?? ''}» لأنّ التصنيف يعتمد بداية الجملة/الكلمة.`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {interaction.kind === 'table_fill' && (
        <div className="l1-table-wrap">
          <table className="l1-table">
            <caption className="visually-hidden">جدول التمرين كما طُبع في الكتاب</caption>
            <thead>
              <tr>
                {interaction.columns.map((column) => (
                  <th key={column} scope="col">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {interaction.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      {'given' in cell ? (
                        <span>{cell.given}</span>
                      ) : (
                        <div className="l1-field">
                          <input
                            className="l1-input"
                            type="text"
                            value={values[cell.fieldId] ?? ''}
                            onChange={(event) => setVal(cell.fieldId, event.target.value)}
                            placeholder={cell.pending ? 'معلّق' : 'اكتب إجابتك'}
                            aria-label={`${interaction.columns[cellIndex]} — صف ${rowIndex + 1}`}
                            aria-invalid={checked && !cell.pending && !matchesAccepted(values[cell.fieldId] ?? '', cell.acceptedAnswers) ? true : undefined}
                          />
                          {checked &&
                            renderResult(
                              { id: cell.fieldId, label: interaction.columns[cellIndex], accepted: cell.acceptedAnswers, pending: cell.pending },
                              evaluate({ id: cell.fieldId, label: '', accepted: cell.acceptedAnswers, pending: cell.pending }),
                            )}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {interaction.kind === 'diagram_fill' && (
        <div className="l1-diagram" role="group" aria-label="مخطط أحداث القصّة">
          {interaction.boxes.map((box, index) => (
            <React.Fragment key={box.id}>
              <div className={`l1-diagram-box${box.tone === 'given' ? ' l1-diagram-box--given' : ''}`}>
                {box.text ? (
                  <span>{box.text}</span>
                ) : (
                  <div className="l1-field">
                    <span className="l1-field-label">
                      فارغ <ArabicNumber value={index === 1 ? '١' : '٢'} />
                    </span>
                    <input
                      className="l1-input"
                      type="text"
                      value={values[box.fieldId ?? ''] ?? ''}
                      onChange={(event) => setVal(box.fieldId ?? '', event.target.value)}
                      placeholder="أكمل الحدث"
                      aria-label={`فارغ ${index === 1 ? '١' : '٢'} في مخطط الأحداث`}
                    />
                    {checked &&
                      box.fieldId &&
                      (() => {
                        // Same evaluator as the activity summary: a blank is never
                        // «correct» just because something was typed.
                        const spec: FieldSpec = {
                          id: box.fieldId,
                          label: `فارغ ${index === 1 ? '١' : '٢'}`,
                          accepted: box.acceptedAnswers,
                          pending: box.pending,
                        };
                        return renderResult(spec, evaluate(spec));
                      })()}
                  </div>
                )}
              </div>
              {index < interaction.boxes.length - 1 && (
                <span className="l1-diagram-arrow" aria-hidden="true">←</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {interaction.kind === 'write' && (
        <div className="l1-field">
          <span className="l1-field-label">نشاطٌ كتابي حرّ (لا تصحيح آلي):</span>
          <textarea
            className="l1-textarea inter-textarea"
            rows={4}
            value={values.write ?? ''}
            onChange={(event) => setVal('write', event.target.value)}
            placeholder="اكتب إجابتك هنا..."
            aria-label="مساحة الكتابة"
          />
          {checked && (
            <p className="l1-result l1-result--open">
              ⟡ سجّلنا محاولتك. قارن إجابتك بالإجابة النموذجية بعد فتحها، أو عدّلها وأعد التحقّق.
            </p>
          )}
        </div>
      )}

      {interaction.kind === 'speak' && (
        <>
          <p className="inter-speak-note">
            🗣 نشاطٌ شفوي: أجب صوتيًّا مع زملائك أو معلّمك، ثم اضغط «تحقّق» لتسجيل محاولتك ومقارنتها بالإجابة النموذجية.
          </p>
          {checked && (
            <p className="l1-result l1-result--open" role="status">
              ⟡ سجّلنا محاولتك الشفوية. قارن أداءك بالإجابة النموذجية بعد فتحها، ثم أعد المحاولة إن أحببت.
            </p>
          )}
        </>
      )}

      {interaction.kind === 'decode' && (
        <>
          <div className="l1-notice l1-notice--pending" role="note">
            <strong>لعبة فكّ الرموز — التصحيح معطّل</strong>
            فكّ الرموز مستعينًا بلوحة الحروف المعروضة في هذه الخطوة، واكتب ما تصل إليه في المساحة أدناه.
            المطابقة لم تُعتمد بعد، لذلك لا يتحقّق النشاط من إجابتك ولا يعرض مفتاحًا.
          </div>
          <textarea
            className="l1-textarea inter-textarea"
            rows={3}
            value={values.decode ?? ''}
            onChange={(event) => setVal('decode', event.target.value)}
            placeholder="اكتب الجملة التي فككت رموزها (بلا تصحيح آلي)"
            aria-label="مساحة فك الرموز"
          />
        </>
      )}

      {/* ---------------- check / retry / model answer ---------------- */}
      <div className="l1-actions">
        <button
          type="button"
          className="btn btn-primary btn-small"
          onClick={runCheck}
          disabled={isPendingInteraction}
          title={isPendingInteraction ? 'التصحيح معطّل لأنّ المطابقة معلّقة بانتظار الاعتماد' : undefined}
        >
          {attempted ? 'تحقّق مجدّدًا' : 'تحقّق من إجاباتي'}
        </button>

        {checked && !isPendingInteraction && !isFreeForm && (
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => {
              setChecked(false);
              setShowModelAnswer(false);
            }}
          >
            عدّل إجاباتي
          </button>
        )}

        <button
          type="button"
          className="btn btn-ghost btn-small"
          onClick={() => setShowModelAnswer((previous) => !previous)}
          disabled={!attempted || isPendingInteraction}
          aria-expanded={showModelAnswer}
          title={attempted ? undefined : 'تظهر الإجابة النموذجية بعد المحاولة الأولى والتحقّق'}
        >
          {showModelAnswer ? 'إخفاء الإجابة النموذجية' : 'اعرض الإجابة النموذجية (بعد المحاولة)'}
        </button>
      </div>

      {checked && !isPendingInteraction && results.length > 0 && (
        <p className="l1-result l1-result--open" role="status">
          نتيجة التحقّق: <ArabicNumber value={toArabicDigits(correctCount)} /> صحيحة
          {reviewCount > 0 && <>، و<ArabicNumber value={toArabicDigits(reviewCount)} /> تحتاج مراجعة</>}
          {pendingCount > 0 && (
            <>، و<ArabicNumber value={toArabicDigits(pendingCount)} /> معلّقة بقرار صاحب المشروع</>
          )}
          .
        </p>
      )}

      {showModelAnswer && attempted && (
        <div className="l1-model-answer activity-solution">
          <p className="solution-answer">
            <span className="l1-model-label source-label-explain">الإجابة النموذجية (منصة):</span>
            {activity.solution.answer}
          </p>
          <p className="solution-explain">
            <span className="source-label-explain">شرح المنصة</span> {activity.solution.explanation}
          </p>
        </div>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Block rendering                                                    */
/* ------------------------------------------------------------------ */

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
            {block.paragraphs.map((paragraph, index) => (
              <p key={index} className="passage-para">{paragraph}</p>
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
            {block.sentences.map((sentence, index) => (
              <li key={index}>{sentence}</li>
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
            {block.items.map((item, index) => (
              <div key={index} className="vocab-card">
                <span className="vocab-term">{item.term}</span>
                <span className="vocab-meaning">{item.meaning}</span>
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
            {block.lines.map((line, index) => (
              <p key={index}>{line}</p>
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
          <p className="instruction-text" style={{ whiteSpace: 'pre-line' }}>{block.text}</p>
        </section>
      );
    case 'explanation':
      return (
        <section className="block-explanation">
          <span className="source-label-explain">شرح المنصة</span>
          <h3 className="block-heading">{block.heading}</h3>
          {block.lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </section>
      );
    case 'activity': {
      const activity = TEXTBOOK_ACTIVITIES.find((item) => item.id === block.activityId);
      if (!activity) return null;
      return <Lesson1ActivityWidget activity={activity} />;
    }
    default:
      return null;
  }
};

export const Lesson1StepRenderer: React.FC<Lesson1StepRendererProps> = ({ step, onOpenIrab }) => {
  const content = LESSON1_STEP_CONTENT[step.id];

  if (!content) {
    return <p className="step-empty-note">لا يوجد محتوى لهذه الخطوة بعد.</p>;
  }

  return (
    <div className="step-renderer l1-step">
      {content.blocks.map((block, index) => (
        <React.Fragment key={`${step.id}-${index}`}>
          <BlockView block={block} />
          {step.id === 'l1-s3' && block.kind === 'vocab' && <VocabularyExplanation />}
          {step.id === 'l1-s6' && block.kind === 'rule' && <Lesson1GrammarSupport />}
          {step.id === 'l1-s7' && block.kind === 'rule' && <SpellingExplanation />}
        </React.Fragment>
      ))}

      {step.id === 'l1-s6' && onOpenIrab && (
        <section className="l1-activity" aria-label="صفحة الإعراب التطبيقي">
          <h3 className="block-heading">صفحة الإعراب التطبيقي</h3>
          <p className="l1-activity-instruction">
            صفحةٌ مستقلّة تضمّ <ArabicNumber value={LESSON1_IRAB_PAGE.length} /> جملةً من جمل الدرس معربةً كلمةً كلمة،
            إضافةً إلى «سجلّ الإشكالات» الذي يضمّ <ArabicNumber value={IRAB_ISSUE_REGISTER.length} /> جملًا لم يُعتمد لها
            وجهٌ واحد، فلا يُعرض لها إعرابٌ محسوم.
          </p>
          <div className="l1-actions">
            <button type="button" className="btn btn-primary btn-small" onClick={onOpenIrab}>
              افتح صفحة الإعراب التطبيقي
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Lesson1StepRenderer;
