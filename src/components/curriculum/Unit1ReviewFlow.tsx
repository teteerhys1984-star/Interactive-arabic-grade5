import React, { useEffect, useMemo, useState } from 'react';
import { UnitReview } from '../../types/curriculum';
import { ArabicNumber, LatinText } from '../common/BiDi';
import { SourceBadge } from '../common/SourceBadge';
import { clearDraft, readDraft, writeDraft } from '../../utils/draftStorage';
import {
  UNIT1_REVIEW_ANSWERABLE_BRANCHES,
  UNIT1_REVIEW_CLOSING,
  UNIT1_REVIEW_INSTRUCTIONS,
  UNIT1_REVIEW_QUESTIONS,
  UNIT1_REVIEW_TIMING,
  ReviewQuestion,
  ReviewSubpart,
} from '../../data/unit1Review/reviewItems';
import { ReviewInteractionView, answerKey, isSubpartAnswered } from './ReviewInteractionView';
import {
  REVIEW_SOURCE_UNCERTAINTIES,
  isSubpartPendingSourceVerification,
  studentSourceLimitNotice,
} from '../../data/unit1Review/sourceMeta';
import { toArabicDigits } from '../../utils/arabicDigits';

/**
 * Student Area flow for «تقويم الوحدة الأولى» (pages 36–38).
 *
 * UX contract (deliberate, not a lesson and not a scored exam):
 *  - One printed question (or a short related group) per step, with a clear
 *    «السؤال N من ٧» indicator and free navigation back and forth.
 *  - Answers are preserved while navigating and restored from session storage.
 *  - NO answer key, NO correctness feedback, NO model answer on this side.
 *  - Finishing shows the learner's own answers for review/editing only.
 */

const DRAFT_SCOPE = 'unit1-review';
const ANSWERS_RECORD = 'answers';
const PROGRESS_RECORD = 'progress';

type FlowStep =
  | { id: string; kind: 'intro'; title: string }
  | { id: string; kind: 'question'; title: string; question: ReviewQuestion }
  | { id: string; kind: 'closing'; title: string }
  | { id: string; kind: 'finish'; title: string };

interface AnswerLine {
  label: string;
  value: string;
}

const JUDGEMENT_LABEL: Record<string, string> = {
  true: 'صحيحة ✓',
  false: 'غير صحيحة ✗',
};

/** Readable rendering of the learner's own answer — never a correctness check. */
function describeAnswer(subpart: ReviewSubpart, values: Record<string, string>): AnswerLine[] {
  const get = (name: string) => (values[answerKey(subpart.id, name)] || '').trim();
  const interaction = subpart.interaction;

  switch (interaction.kind) {
    case 'guidance':
      return [];
    case 'judgement': {
      const judge = JUDGEMENT_LABEL[get('judge')] || 'لم تُحدَّد بعد';
      const correction = get('correction');
      const lines: AnswerLine[] = [{ label: 'حكمك على العبارة', value: judge }];
      if (correction) lines.push({ label: 'تصويبك', value: correction });
      return lines;
    }
    case 'single_choice': {
      const chosen = interaction.choices.find((choice) => choice.id === get('choice'));
      return [{ label: 'اختيارك', value: chosen ? chosen.text : 'لم تختر بعد' }];
    }
    case 'paragraph':
      return [{ label: 'فقرتك', value: get('text') || 'لم تكتب بعد' }];
    case 'inline_blank':
      return [
        {
          label: `إجابة ${subpart.label}`,
          value: get('value') || 'لم تُكمل بعد',
        },
      ];
    case 'time_field':
    case 'writing_field':
    case 'short_field':
      return [{ label: interaction.label, value: get('value') || 'لم تكتب بعد' }];
    default:
      return [];
  }
}

export interface Unit1ReviewFlowProps {
  review: UnitReview;
  onExit?: () => void;
}

export const Unit1ReviewFlow: React.FC<Unit1ReviewFlowProps> = ({ review, onExit }) => {
  const steps: FlowStep[] = useMemo(
    () => [
      { id: 'u1r-step-intro', kind: 'intro', title: 'مقدمة التقويم وتعليماته' },
      ...UNIT1_REVIEW_QUESTIONS.map((question) => ({
        id: `u1r-step-${question.id}`,
        kind: 'question' as const,
        title: `السؤال ${question.printedNumber}: ${question.section}`,
        question,
      })),
      { id: 'u1r-step-closing', kind: 'closing', title: 'خاتمة الوحدة' },
      { id: 'u1r-step-finish', kind: 'finish', title: 'مراجعة إجاباتي والإنهاء' },
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
  const [subIndex, setSubIndex] = useState<number>(0);
  const [showAllSubparts, setShowAllSubparts] = useState<boolean>(false);
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

  const questionSubparts = useMemo(
    () => UNIT1_REVIEW_QUESTIONS.flatMap((question) => question.subparts),
    [],
  );
  const answeredCount = questionSubparts.filter((subpart) => isSubpartAnswered(subpart, values)).length;

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
    setSubIndex(0);
    setShowAllSubparts(false);
    persistProgress({ ...progress, lastStepId: steps[index].id });
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinish = () => {
    persistProgress({ ...progress, finished: 'true', lastStepId: 'u1r-step-finish' });
  };

  const handleReopen = () => {
    persistProgress({ ...progress, finished: '', lastStepId: 'u1r-step-finish' });
  };

  const handleClearAll = () => {
    clearDraft(DRAFT_SCOPE, ANSWERS_RECORD);
    clearDraft(DRAFT_SCOPE, PROGRESS_RECORD);
    setValues({});
    setProgress({});
    setConfirmClear(false);
    setStorageNote('cleared');
    setStepIndex(0);
    setSubIndex(0);
  };

  const stepKicker = (() => {
    if (currentStep.kind === 'question') {
      return `السؤال ${currentStep.question.printedNumber} من ${toArabicDigits(UNIT1_REVIEW_QUESTIONS.length)}`;
    }
    if (currentStep.kind === 'intro') return 'مقدمة التقويم';
    if (currentStep.kind === 'closing') return 'خاتمة الوحدة';
    return 'مراجعة الإجابات';
  })();

  /* ------------------------------------------------------------------ */
  /* Subpart card                                                       */
  /* ------------------------------------------------------------------ */

  const renderSubpartCard = (
    subpart: ReviewSubpart,
    index: number,
    total: number,
    options: { suppressPendingNotice?: boolean } = {},
  ) => {
    const pendingNotice = options.suppressPendingNotice
      ? undefined
      : isSubpartPendingSourceVerification(subpart.id)
        ? studentSourceLimitNotice(subpart.id)
        : undefined;
    const coloured = subpart.colouredWord;

    return (
      <article className="u1r-branch-card" key={subpart.id} aria-label={subpart.label}>
        <header className="u1r-branch-head">
          <span className="u1r-branch-badge">{subpart.label}</span>
          {total > 1 && (
            <span className="u1r-branch-counter">
              البند <ArabicNumber value={toArabicDigits(index + 1)} /> من <ArabicNumber value={toArabicDigits(total)} />
            </span>
          )}
          {!subpart.graded && <span className="u1r-branch-tag">تعليمة تنفيذية غير مقوَّمة</span>}
          {pendingNotice && <span className="u1r-branch-pending-tag">قيد التحقق المصدري</span>}
        </header>
        {pendingNotice && (
          <aside className="u1r-gap-notice u1r-subpart-pending-note" role="note">
            <strong>حدّ مصدر معلن:</strong> {pendingNotice}
          </aside>
        )}
        {coloured ? (
          <>
            <p className="u1r-branch-prompt u1r-coloured-sentence">
              {coloured.before && <span>{coloured.before} </span>}
              <span className="u1r-coloured-word">{coloured.word}</span>
              {coloured.after && <span> {coloured.after}</span>}
            </p>
            <p className="u1r-colour-legend">
              الكلمة الملوّنة في الكتاب معروضة هنا بالأخضر: «{coloured.word}» — المطلوب تصنيفها.
            </p>
          </>
        ) : (
          subpart.prompt &&
          subpart.interaction.kind !== 'inline_blank' && <p className="u1r-branch-prompt">{subpart.prompt}</p>
        )}
        <ReviewInteractionView subpart={subpart} values={values} update={update} />
      </article>
    );
  };

  const renderQuestionBody = (question: ReviewQuestion) => {
    const subparts = question.subparts;
    const isPaged = question.paginateBranches && !showAllSubparts;

    /* The four-circle map of question 6 is one printed diagram: it stays whole. */
    if (question.layout === 'word_map') {
      const map = question.wordMap;
      const centerSettled = Boolean(map?.centerVerified);
      return (
        <div className="u1r-word-map">
          <div
            className={`u1r-map-center ${centerSettled ? '' : 'u1r-map-center-pending'}`}
            aria-label={centerSettled ? `الكلمة المركزية: ${map?.centerReading}` : 'الكلمة المركزية غير محسومة في النسخة المتاحة'}
          >
            {centerSettled ? map?.centerReading : 'الكلمة المطبوعة في مركز المخطط'}
          </div>
          <div className="u1r-map-nodes">
            {subparts.map((subpart, index) =>
              renderSubpartCard(subpart, index, subparts.length, { suppressPendingNotice: true }),
            )}
          </div>
          {!centerSettled && map && (
            <aside className="u1r-gap-notice u1r-map-pending-note" role="note">
              <strong>حدّ مصدر معلن:</strong> {map.centerNote}
            </aside>
          )}
        </div>
      );
    }

    /* The cause + two results of question 5 keep the printed banner layout. */
    if (question.layout === 'cause_result') {
      return (
        <div className="u1r-cause-result">
          {subparts.map((subpart, index) => (
            <div
              className={`u1r-cause-card ${index === 0 ? 'u1r-cause-card-cause' : 'u1r-cause-card-result'}`}
              key={subpart.id}
            >
              {renderSubpartCard(subpart, index, subparts.length)}
            </div>
          ))}
        </div>
      );
    }

    if (isPaged) {
      const subpart = subparts[subIndex];
      return (
        <div className="u1r-paged-subparts">
          {renderSubpartCard(subpart, subIndex, subparts.length)}
          <div className="u1r-subpart-nav">
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => setSubIndex((index) => Math.max(0, index - 1))}
              disabled={subIndex === 0}
            >
              البند السابق
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={() => setShowAllSubparts(true)}
            >
              عرض كل فروع السؤال
            </button>
            <button
              type="button"
              className="btn btn-primary btn-small"
              onClick={() => setSubIndex((index) => Math.min(subparts.length - 1, index + 1))}
              disabled={subIndex >= subparts.length - 1}
            >
              البند التالي
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="u1r-subparts-stack">
        {showAllSubparts && question.paginateBranches && (
          <div className="u1r-subparts-toolbar">
            <button type="button" className="btn btn-ghost btn-small" onClick={() => setShowAllSubparts(false)}>
              عرض الفروع بنداً بنداً
            </button>
          </div>
        )}
        {subparts.map((subpart, index) => renderSubpartCard(subpart, index, subparts.length))}
      </div>
    );
  };

  /* ------------------------------------------------------------------ */
  /* Step bodies                                                        */
  /* ------------------------------------------------------------------ */

  const renderIntro = () => (
    <div className="u1r-intro">
      <section className="u1r-panel">
        <h3 className="u1r-panel-title">مهمة ضبط الوقت (كما في الصفحة ٣٦)</h3>
        <ul className="u1r-printed-lines">
          {UNIT1_REVIEW_TIMING.instructionLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="u1r-helper">
          تُرسم عقارب الساعتين على الكتاب، ثم يُسجَّل الزمن هنا لحساب المدّة. هذه المهمة تنظيمية لا تُحتسب في الدرجة.
        </p>
        <div className="u1r-timing-grid">
          {UNIT1_REVIEW_TIMING.subparts.map((subpart, index) =>
            renderSubpartCard(subpart, index, UNIT1_REVIEW_TIMING.subparts.length),
          )}
        </div>
      </section>

      <section className="u1r-panel">
        <h3 className="u1r-panel-title">{UNIT1_REVIEW_INSTRUCTIONS.heading}</h3>
        <p className="u1r-panel-intro">{UNIT1_REVIEW_INSTRUCTIONS.intro}</p>
        <ol className="u1r-guidance-list">
          {UNIT1_REVIEW_INSTRUCTIONS.subparts.map((subpart) => (
            <li key={subpart.id}>{subpart.prompt}</li>
          ))}
        </ol>
        <p className="u1r-lead-in">{UNIT1_REVIEW_INSTRUCTIONS.leadIn}</p>
      </section>

      {REVIEW_SOURCE_UNCERTAINTIES.some((limit) => limit.blocking) && (
      <details className="u1r-panel u1r-student-limits">
        <summary>حدود مصدر معلنة في هذا التقويم ({REVIEW_SOURCE_UNCERTAINTIES.length})</summary>
        <p className="u1r-helper">
          بعض التفاصيل المطبوعة في الصفحات ٣٦–٣٨ لم تُحسم في النسخة المتاحة من المصدر (خاصّةً تمييز
          الكلمة الملوّنة في السؤال ٤، والكلمة المطبوعة في مركز مخطط السؤال ٦). لا تخمّن المنصة هذه
          التفاصيل: اقرأها من كتابك. وتفصيل المواضع وحلولها في منطقة المعلم.
        </p>
        <ul className="u1r-student-limits-list">
          {REVIEW_SOURCE_UNCERTAINTIES.filter((limit) => limit.blocking).map((limit) => (
            <li key={limit.id}>
              <span className="u1r-branch-badge">ص <ArabicNumber value={toArabicDigits(limit.page)} /></span>
              <span className="u1r-limit-region">{limit.studentLabel ?? limit.region}</span>
              <span className="u1r-limit-impact">قيد التحقق المصدري — يبقى المطلوب المطبوع كما هو.</span>
            </li>
          ))}
        </ul>
      </details>
      )}
    </div>
  );

  const renderClosing = () => (
    <div className="u1r-closing">
      <p className="u1r-panel-intro">{UNIT1_REVIEW_CLOSING.instruction}</p>
      <div className="u1r-subparts-stack">
        {UNIT1_REVIEW_CLOSING.subparts.map((subpart, index) =>
          renderSubpartCard(subpart, index, UNIT1_REVIEW_CLOSING.subparts.length),
        )}
      </div>
      <p className="u1r-helper">
        بندان شخصيان يمثّلان تقويمك لنفسك بعد دراسة الوحدة، ولا تُحتسب عليهما درجة.
      </p>
    </div>
  );

  const renderFinish = () => (
    <div className="u1r-finish">
      <p className="u1r-panel-intro">
        راجعْ إجاباتك هنا وعدّل ما تشاء قبل الإنهاء. لا تُعرض الإجابات الصحيحة في منطقة الطالب؛
        والحلول النموذجية المفصلة محفوظة في منطقة المعلم.
      </p>

      <div className="u1r-summary-list">
        {UNIT1_REVIEW_QUESTIONS.map((question) => {
          const answers = question.subparts
            .map((subpart) => ({ subpart, lines: describeAnswer(subpart, values) }))
            .filter((entry) => entry.lines.length > 0);
          const stepId = `u1r-step-${question.id}`;
          return (
            <section className="u1r-summary-card" key={question.id} aria-label={`ملخص السؤال ${question.printedNumber}`}>
              <header className="u1r-summary-head">
                <span className="u1r-branch-badge">السؤال {question.printedNumber}</span>
                <span className="u1r-summary-page">صفحة <ArabicNumber value={toArabicDigits(question.page)} /></span>
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={() => goToStep(steps.findIndex((step) => step.id === stepId))}
                >
                  تعديل إجابات هذا السؤال
                </button>
              </header>
              <ul className="u1r-summary-items">
                {answers.map(({ subpart, lines }) => (
                  <li key={subpart.id}>
                    <span className="u1r-summary-label">{subpart.label}</span>
                    <dl>
                      {lines.map((line) => (
                        <div className="u1r-summary-line" key={`${subpart.id}-${line.label}`}>
                          <dt>{line.label}:</dt>
                          <dd>{line.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="u1r-finish-actions">
        {!isFinished ? (
          <button type="button" className="btn btn-primary" onClick={handleFinish}>
            إنهاء المراجعة
          </button>
        ) : (
          <>
            <p className="u1r-finish-note" role="status">
              ✓ تم إنهاء مراجعتك وحفظ إجاباتك. اعرضها على معلّمك ليقيّمها بالحلول النموذجية.
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
          <span className="u1r-confirm-clear" role="alert">
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
    <div className="u1r-shell" dir="rtl">
      <header className="u1r-header">
        <div className="u1r-header-top">
          <div className="u1r-title-block">
            <span className="u1r-kicker">
              مراجعة الوحدة الأولى · <LatinText>{review.metadata.englishLabel}</LatinText>
            </span>
            <h1 className="u1r-title">{review.metadata.title}</h1>
            <p className="u1r-description">{review.metadata.description}</p>
          </div>
          {onExit && (
            <button type="button" className="btn btn-ghost lesson-exit-button" onClick={onExit}>
              <span aria-hidden="true" dir="ltr">→</span>
              العودة إلى الوحدة
            </button>
          )}
        </div>
        <div className="u1r-meta-row">
          <SourceBadge source={review.metadata.source} compact />
          <span className="u1r-meta-chip">
            الأسئلة المرقّمة: <ArabicNumber value={toArabicDigits(review.metadata.printedQuestions)} />
          </span>
          <span className="u1r-meta-chip">
            الفروع: <ArabicNumber value={toArabicDigits(review.metadata.printedBranches)} />
          </span>
          <span className="u1r-meta-chip">ليست درساً ولا اختبار وحدة · مراجعة شاملة للوحدة الأولى</span>
        </div>
      </header>

      <div className="u1r-progress-card">
        <div className="u1r-progress-head">
          <span className="u1r-progress-kicker">{stepKicker}</span>
          <span className="u1r-progress-count">
            الخطوة <ArabicNumber value={toArabicDigits(stepIndex + 1)} /> من <ArabicNumber value={toArabicDigits(totalSteps)} />
          </span>
        </div>
        <p className="u1r-progress-note">
          أجبتَ عن <ArabicNumber value={toArabicDigits(answeredCount)} /> من <ArabicNumber value={toArabicDigits(UNIT1_REVIEW_ANSWERABLE_BRANCHES)} /> فرعاً
          من أسئلة التقويم. تُحفظ إجاباتك تلقائياً وتُستعاد عند العودة.
        </p>

        <details className="u1r-step-menu">
          <summary>قائمة الخطوات والأسئلة</summary>
          <ol className="u1r-step-list">
            {steps.map((step, index) => (
              <li key={step.id}>
                <button
                  type="button"
                  className={`u1r-step-button ${index === stepIndex ? 'is-current' : ''}`}
                  aria-current={index === stepIndex ? 'step' : undefined}
                  onClick={() => goToStep(index)}
                >
                  <span className="u1r-step-index">
                    <ArabicNumber value={toArabicDigits(index + 1)} />
                  </span>
                  <span>{step.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </details>
      </div>

      <section className="u1r-content" aria-label="محتوى الخطوة">
        {currentStep.kind === 'intro' && renderIntro()}

        {currentStep.kind === 'question' && (
          <article className="u1r-question-card">
            <header className="u1r-question-head">
              <div className="u1r-question-title-group">
                <span className="u1r-question-kicker">
                  السؤال <ArabicNumber value={currentStep.question.printedNumber} /> · صفحة{' '}
                  <ArabicNumber value={toArabicDigits(currentStep.question.page)} />
                </span>
                <h2 className="u1r-question-title" aria-live="polite">
                  {currentStep.question.section}
                </h2>
              </div>
              <SourceBadge source={currentStep.question.source} compact />
            </header>

            {currentStep.question.leadIn && <p className="u1r-lead-in">{currentStep.question.leadIn}</p>}
            <p className="u1r-question-instruction">{currentStep.question.instruction}</p>
            {currentStep.question.kindNote && (
              <aside className="u1r-gap-notice" role="note">
                <strong>تنبيه:</strong> {currentStep.question.kindNote}
              </aside>
            )}
            {currentStep.question.sharedText && (
              <p className="u1r-shared-text">{currentStep.question.sharedText}</p>
            )}

            <div className="u1r-question-body">{renderQuestionBody(currentStep.question)}</div>
          </article>
        )}

        {currentStep.kind === 'closing' && renderClosing()}
        {currentStep.kind === 'finish' && renderFinish()}
      </section>

      <footer className="u1r-footer" aria-label="التنقل بين خطوات التقويم">
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
        <p className="u1r-storage-alert" role="alert">
          تعذّر حفظ إجاباتك في جلسة التصفح الحالية؛ انسخ ما كتبته قبل مغادرة الصفحة.
        </p>
      )}
      {storageNote === 'cleared' && (
        <p className="u1r-storage-alert u1r-storage-cleared" role="status">
          مُسحت إجابات التقويم، وبدأت من جديد.
        </p>
      )}
    </div>
  );
};
