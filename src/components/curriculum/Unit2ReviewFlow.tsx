import React, { useEffect, useMemo, useState } from 'react';
import { UnitReview } from '../../types/curriculum';
import { ArabicNumber, LatinText } from '../common/BiDi';
import { SourceBadge } from '../common/SourceBadge';
import { clearDraft, readDraft, writeDraft } from '../../utils/draftStorage';
import {
  UNIT2_REVIEW_QUESTIONS,
  UNIT2_REVIEW_REFLECTIONS,
  Unit2ReviewField,
  Unit2ReviewQuestion,
  unit2AnswerKey,
} from '../../data/unit2Review/reviewItems';
import { toArabicDigits } from '../../utils/arabicDigits';

/**
 * Student Area flow for «تقويم الوحدة الثانية» (pages 69–70).
 *
 * UX contract (deliberate, mirrored from the Unit 1 review, not a scored exam):
 *  - Only the five approved printed questions are offered: ١، ٣، ٥، ٦، ٧.
 *    The step counter counts these five steps («الخطوة ٢ من ٥») while each step
 *    keeps its original textbook question number.
 *  - Questions ٢ and ٤ are excluded: they have no step, no field, and no notice.
 *  - Every field is completely empty: no placeholder, no hint, no helper text.
 *  - Answers are saved to the session draft and restored on return.
 *  - NO answer key, NO correctness feedback, NO score, NO model answer.
 *  - The two closing reflections are optional and never block finishing.
 */

const DRAFT_SCOPE = 'unit2-review';
const ANSWERS_RECORD = 'answers';
const PROGRESS_RECORD = 'progress';

type FlowStep =
  | { id: string; kind: 'intro'; title: string }
  | { id: string; kind: 'question'; title: string; question: Unit2ReviewQuestion }
  | { id: string; kind: 'reflections'; title: string }
  | { id: string; kind: 'finish'; title: string };

export interface Unit2ReviewFlowProps {
  review: UnitReview;
  onExit?: () => void;
}

export const Unit2ReviewFlow: React.FC<Unit2ReviewFlowProps> = ({ review, onExit }) => {
  const steps: FlowStep[] = useMemo(
    () => [
      { id: 'u2r-step-intro', kind: 'intro', title: 'مقدمة التقويم' },
      ...UNIT2_REVIEW_QUESTIONS.map((question) => ({
        id: `u2r-step-${question.id}`,
        kind: 'question' as const,
        title: question.section,
        question,
      })),
      { id: 'u2r-step-reflections', kind: 'reflections', title: 'تأمّل ختامي (اختياري)' },
      { id: 'u2r-step-finish', kind: 'finish', title: 'مراجعة إجاباتي والإنهاء' },
    ],
    [],
  );

  const [values, setValues] = useState<Record<string, string>>(() =>
    readDraft(DRAFT_SCOPE, ANSWERS_RECORD),
  );
  const [progress, setProgress] = useState<Record<string, string>>(() =>
    readDraft(DRAFT_SCOPE, PROGRESS_RECORD),
  );
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [storageNote, setStorageNote] = useState<'idle' | 'failed' | 'cleared'>('idle');
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  const isFinished = progress.finished === 'true';

  /* Restore the last visited step once, after mount, from the stored draft. */
  useEffect(() => {
    const storedStepId = progress.lastStepId;
    if (!storedStepId) return;
    const index = steps.findIndex((step) => step.id === storedStepId);
    if (index > 0) setStepIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;

  const persistAnswers = (next: Record<string, string>) => {
    setValues(next);
    const ok = writeDraft(DRAFT_SCOPE, ANSWERS_RECORD, next);
    setStorageNote(ok ? 'idle' : 'failed');
  };

  const update = (key: string, value: string) => {
    persistAnswers({ ...values, [key]: value });
  };

  const persistProgress = (next: Record<string, string>) => {
    setProgress(next);
    writeDraft(DRAFT_SCOPE, PROGRESS_RECORD, next);
  };

  const goToStep = (index: number) => {
    if (index < 0 || index >= totalSteps) return;
    setStepIndex(index);
    persistProgress({ ...progress, lastStepId: steps[index].id });
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinish = () => {
    persistProgress({ ...progress, finished: 'true', lastStepId: 'u2r-step-finish' });
  };

  const handleReopen = () => {
    persistProgress({ ...progress, finished: '', lastStepId: 'u2r-step-finish' });
  };

  const handleClearAll = () => {
    clearDraft(DRAFT_SCOPE, ANSWERS_RECORD);
    clearDraft(DRAFT_SCOPE, PROGRESS_RECORD);
    setValues({});
    setProgress({});
    setConfirmClear(false);
    setStorageNote('cleared');
    setStepIndex(0);
  };

  const questionStepNumber =
    currentStep.kind === 'question'
      ? UNIT2_REVIEW_QUESTIONS.findIndex((question) => question.id === currentStep.question.id) + 1
      : 0;

  const stepKicker = (() => {
    if (currentStep.kind === 'question') {
      return `الخطوة ${toArabicDigits(questionStepNumber)} من ${toArabicDigits(
        UNIT2_REVIEW_QUESTIONS.length,
      )}`;
    }
    if (currentStep.kind === 'intro') return 'مقدمة التقويم';
    if (currentStep.kind === 'reflections') return 'تأمّل ختامي';
    return 'مراجعة الإجابات';
  })();

  /* ------------------------------------------------------------------ */
  /* Field rendering — always empty, never hinted                        */
  /* ------------------------------------------------------------------ */

  const renderField = (field: Unit2ReviewField, extraClass = '') => {
    const key = unit2AnswerKey(field.id);
    const value = values[key] ?? '';
    const tone = field.tone ? ` u2r-tone-${field.tone}` : '';
    return (
      <div className={`u2r-field${tone}${extraClass ? ` ${extraClass}` : ''}`} key={field.id}>
        {field.printedText && <span className="u2r-field-printed">{field.printedText}</span>}
        {field.rows > 1 ? (
          <textarea
            className="u2r-input u2r-textarea"
            rows={field.rows}
            aria-label={field.label}
            value={value}
            onChange={(event) => update(key, event.target.value)}
          />
        ) : (
          <input
            type="text"
            className="u2r-input"
            aria-label={field.label}
            value={value}
            onChange={(event) => update(key, event.target.value)}
          />
        )}
      </div>
    );
  };

  /* ------------------------------------------------------------------ */
  /* Step bodies                                                        */
  /* ------------------------------------------------------------------ */

  const renderIntro = () => (
    <div className="u2r-intro">
      <section className="u2r-panel">
        <h2 className="u2r-panel-title">كيف أعمل في هذا التقويم؟</h2>
        <ul className="u2r-notes">
          <li>أسئلة هذا التقويم مطبوعة في كتابك في الصفحتين ٦٩–٧٠، وأعرضها هنا بنصّها المطبوع.</li>
          <li>أكتب إجاباتي في الخانات الفارغة، وتُحفظ تلقائياً وتُستعاد عند العودة.</li>
          <li>تقويم للتدريب الذاتي: لا تصحيح آلي، ولا درجة، ولا إجابة صحيحة تُعرض هنا.</li>
          <li>أعرض إجاباتي على معلّمي ليقيّمها.</li>
        </ul>
      </section>
    </div>
  );

  const renderQuestion = (question: Unit2ReviewQuestion) => (
    <article className="u2r-question-card">
      <header className="u2r-question-head">
        <div className="u2r-question-title-group">
          <span className="u2r-question-kicker">
            {question.section} · صفحة <ArabicNumber value={toArabicDigits(question.page)} />
          </span>
          <h2 className="u2r-question-title" aria-live="polite">
            {question.section}
          </h2>
        </div>
        <SourceBadge source={question.source} compact />
      </header>

      <p className="u2r-question-instruction">{question.instruction}</p>
      {question.sharedText && <p className="u2r-shared-text">{question.sharedText}</p>}

      {question.layout === 'dialogue' ? (
        <div className="u2r-dialogue">
          {question.fields.map((field) => (
            <div className="u2r-dialogue-bubble" key={field.id}>
              <span className="u2r-bubble-label">{field.label}</span>
              {renderField(field, 'u2r-bubble-field')}
            </div>
          ))}
        </div>
      ) : (
        <div className={`u2r-fields u2r-fields-${question.layout}`}>
          {question.fields.map((field) => renderField(field))}
        </div>
      )}
    </article>
  );

  const renderReflections = () => (
    <div className="u2r-reflections">
      <p className="u2r-panel-intro">
        بندان مطبوعان في خاتمة صفحة ٧٠، وهما اختياريان: لا يُشترطان لإتمام التقويم، ولا يُقيَّمان.
      </p>
      <div className="u2r-fields u2r-fields-statement_list">
        {UNIT2_REVIEW_REFLECTIONS.map((reflection) =>
          renderField({
            id: `${reflection.id}-value`,
            label: reflection.printedText,
            rows: 1,
            printedText: reflection.printedText,
          }),
        )}
      </div>
    </div>
  );

  const renderFinish = () => (
    <div className="u2r-finish">
      <p className="u2r-panel-intro">
        راجعْ إجاباتك هنا وعدّل ما تشاء قبل الإنهاء. لا تُعرض إجابة صحيحة ولا تصحيح في منطقة
        الطالب؛ واعرض إجاباتك على معلّمك.
      </p>

      <div className="u2r-summary-list">
        {UNIT2_REVIEW_QUESTIONS.map((question) => {
          const stepId = `u2r-step-${question.id}`;
          return (
            <section className="u2r-summary-card" key={question.id} aria-label={`ملخص ${question.section}`}>
              <header className="u2r-summary-head">
                <span className="u2r-branch-badge">{question.section}</span>
                <span className="u2r-summary-page">
                  صفحة <ArabicNumber value={toArabicDigits(question.page)} />
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={() => goToStep(steps.findIndex((step) => step.id === stepId))}
                >
                  تعديل إجابات هذا السؤال
                </button>
              </header>
              <ul className="u2r-summary-items">
                {question.fields.map((field) => {
                  const value = (values[unit2AnswerKey(field.id)] ?? '').trim();
                  return (
                    <li key={field.id}>
                      <span className="u2r-summary-label">{field.label}</span>
                      <p className="u2r-summary-value">{value || 'لم تكتب بعد'}</p>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="u2r-finish-actions">
        {!isFinished ? (
          <button type="button" className="btn btn-primary" onClick={handleFinish}>
            إنهاء المراجعة
          </button>
        ) : (
          <>
            <p className="u2r-finish-note" role="status">
              ✓ تم إنهاء مراجعتك وحفظ إجاباتك. اعرضها على معلّمك ليقيّمها.
            </p>
            <button type="button" className="btn btn-secondary" onClick={handleReopen}>
              متابعة المراجعة والتعديل
            </button>
          </>
        )}
        {!confirmClear ? (
          <button type="button" className="btn btn-ghost" onClick={() => setConfirmClear(true)}>
            مسح كل إجاباتي
          </button>
        ) : (
          <span className="u2r-confirm-clear" role="alert">
            سيُمسح كل ما كتبته. هل أنت متأكد؟
            <button type="button" className="btn btn-danger btn-small" onClick={handleClearAll}>
              نعم، امسح
            </button>
            <button type="button" className="btn btn-ghost btn-small" onClick={() => setConfirmClear(false)}>
              إلغاء
            </button>
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="u2r-shell" dir="rtl">
      <header className="u2r-header">
        <div className="u2r-header-top">
          <div className="u2r-title-block">
            <span className="u2r-kicker">
              مراجعة الوحدة الثانية · <LatinText>{review.metadata.englishLabel}</LatinText>
            </span>
            <h1 className="u2r-title">{review.metadata.title}</h1>
            <p className="u2r-description">{review.metadata.description}</p>
          </div>
          {onExit && (
            <button type="button" className="btn btn-ghost lesson-exit-button" onClick={onExit}>
              <span aria-hidden="true" dir="ltr">→</span>
              العودة إلى الوحدة
            </button>
          )}
        </div>
        <div className="u2r-meta-row">
          <SourceBadge source={review.metadata.source} compact />
          <span className="u2r-meta-chip">
            صفحات الكتاب{' '}
            <ArabicNumber value={toArabicDigits(review.metadata.sourcePagesRange.startPage)} />–
            <ArabicNumber value={toArabicDigits(review.metadata.sourcePagesRange.endPage)} />
          </span>
          <span className="u2r-meta-chip">ليست درساً ولا اختبار وحدة</span>
        </div>
      </header>

      <div className="u2r-progress-card">
        <div className="u2r-progress-head">
          {/* The counter counts the five implemented questions only; the original
              textbook question number stays in each step's title. */}
          <span className="u2r-progress-kicker">{stepKicker}</span>
        </div>
        <p className="u2r-progress-note">تُحفظ إجاباتك تلقائياً وتُستعاد عند العودة.</p>

        <details className="u2r-step-menu">
          <summary>قائمة الخطوات والأسئلة</summary>
          <ol className="u2r-step-list">
            {steps.map((step, index) => (
              <li key={step.id}>
                <button
                  type="button"
                  className={`u2r-step-button ${index === stepIndex ? 'is-current' : ''}`}
                  aria-current={index === stepIndex ? 'step' : undefined}
                  onClick={() => goToStep(index)}
                >
                  <span>{step.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </details>
      </div>

      <section className="u2r-content" aria-label="محتوى الخطوة">
        {currentStep.kind === 'intro' && renderIntro()}
        {currentStep.kind === 'question' && renderQuestion(currentStep.question)}
        {currentStep.kind === 'reflections' && renderReflections()}
        {currentStep.kind === 'finish' && renderFinish()}
      </section>

      <footer className="u2r-footer" aria-label="التنقل بين خطوات التقويم">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => goToStep(stepIndex - 1)}
          disabled={stepIndex === 0}
        >
          <span aria-hidden="true" dir="ltr">→</span> الخطوة السابقة
        </button>
        {stepIndex === totalSteps - 1 ? (
          <button type="button" className="btn btn-accent" onClick={() => goToStep(1)}>
            العودة إلى السؤال ١ للمراجعة
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => goToStep(stepIndex + 1)}>
            الخطوة التالية <span aria-hidden="true" dir="ltr">←</span>
          </button>
        )}
      </footer>

      {storageNote === 'failed' && (
        <p className="u2r-storage-alert" role="alert">
          تعذّر حفظ إجاباتك في جلسة التصفح الحالية؛ انسخ ما كتبته قبل مغادرة الصفحة.
        </p>
      )}
      {storageNote === 'cleared' && (
        <p className="u2r-storage-alert u2r-storage-cleared" role="status">
          مُسحت إجابات التقويم، وبدأت من جديد.
        </p>
      )}
    </div>
  );
};
