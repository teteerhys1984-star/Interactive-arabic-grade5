import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AssessmentTest, UserAssessmentAttempt, UserAnswerValue } from '../../types/curriculum';
import { QuestionRenderer } from './QuestionRenderer';
import { evaluateAssessmentAttempt, createFreshAttempt } from '../../utils/testEvaluator';
import { ArabicNumber } from '../common/BiDi';
import { clearDraft, readDraftValue, writeDraftValue } from '../../utils/draftStorage';
import { AssessmentDraftGuardContext } from './AssessmentDraftGuardContext';

const ASSESSMENT_DRAFT_SCOPE = 'assessment-answers';

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function readValidAnswers(test: AssessmentTest): Record<string, UserAnswerValue> {
  const raw = readDraftValue(ASSESSMENT_DRAFT_SCOPE, test.id);
  if (!isPlainRecord(raw)) return {};
  const valid: Record<string, UserAnswerValue> = {};

  for (const question of test.questions) {
    const value = raw[question.id];
    if (value === undefined) continue;
    if (question.type === 'multi_select' || question.type === 'ordering') {
      if (Array.isArray(value) && value.every((item) => typeof item === 'string')) valid[question.id] = value;
    } else if (question.type === 'matching' || question.type === 'classification') {
      if (isPlainRecord(value) && Object.values(value).every((item) => typeof item === 'string')) {
        valid[question.id] = value as Record<string, string>;
      }
    } else if (typeof value === 'string') {
      valid[question.id] = value;
    }
  }

  return valid;
}

export interface AssessmentShellProps {
  test: AssessmentTest;
  onExit?: () => void;
}

/**
 * Enforces the strict Assessment UX Contract:
 * - During test: ZERO correct/incorrect indicators, score hidden.
 * - After submit: Displays score, correct/incorrect count, percentage, and detailed answer review.
 * - Restart: Initiates a genuinely fresh attempt.
 */
export const AssessmentShell: React.FC<AssessmentShellProps> = ({ test, onExit }) => {
  const [attempt, setAttempt] = useState<UserAssessmentAttempt>(() => ({
    ...createFreshAttempt(test.id),
    answers: readValidAnswers(test),
  }));

  /**
   * PR1 — honest draft-failure handling. `saveFailed` is set ONLY when a real
   * write returned false, and cleared ONLY when a real write succeeds. The
   * answers themselves always live in component state, so a failed write never
   * costs the learner their in-progress work and never claims a save that did
   * not happen.
   */
  const [saveFailed, setSaveFailed] = useState(false);
  const [retryFailedNotice, setRetryFailedNotice] = useState(false);
  const guardRegistry = useContext(AssessmentDraftGuardContext);

  const retrySave = useCallback((): boolean => {
    const persisted = writeDraftValue(ASSESSMENT_DRAFT_SCOPE, test.id, attempt.answers);
    setSaveFailed(!persisted);
    setRetryFailedNotice(!persisted);
    return persisted;
  }, [test.id, attempt.answers]);

  /* Let the app shell intercept navigation while unsaved answers exist. */
  useEffect(() => {
    if (!guardRegistry) return;
    guardRegistry.register({
      hasUnsavedAnswers: () => saveFailed,
      retrySave,
    });
    return () => guardRegistry.register(null);
  }, [guardRegistry, retrySave, saveFailed]);

  /* Best-effort only: browser close/reload warnings are not guaranteed, so the
     dependable protection is the in-app navigation guard in App.tsx. */
  useEffect(() => {
    if (!saveFailed) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [saveFailed]);

  const handleAnswerChange = (questionId: string, answer: UserAnswerValue) => {
    if (attempt.isSubmitted) return;
    const answers = { ...attempt.answers, [questionId]: answer };
    const persisted = writeDraftValue(ASSESSMENT_DRAFT_SCOPE, test.id, answers);
    setSaveFailed(!persisted);
    setRetryFailedNotice(false);
    setAttempt((prev) => ({ ...prev, answers }));
  };

  const handleSubmit = () => {
    const evalResult = evaluateAssessmentAttempt(test, attempt.answers);
    clearDraft(ASSESSMENT_DRAFT_SCOPE, test.id);
    setSaveFailed(false);
    setRetryFailedNotice(false);
    setAttempt((prev) => ({
      ...prev,
      isSubmitted: true,
      completedAt: new Date().toISOString(),
      score: evalResult.score,
      totalPossible: evalResult.totalPossible,
      percentage: evalResult.percentage,
      correctCount: evalResult.correctCount,
      incorrectCount: evalResult.incorrectCount,
    }));
  };

  const handleRestart = () => {
    clearDraft(ASSESSMENT_DRAFT_SCOPE, test.id);
    setSaveFailed(false);
    setRetryFailedNotice(false);
    setAttempt(createFreshAttempt(test.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredCount = Object.keys(attempt.answers).length;
  const totalQuestions = test.questions.length;
  const evalResult = attempt.isSubmitted
    ? evaluateAssessmentAttempt(test, attempt.answers)
    : null;

  return (
    <div className="assessment-shell" dir="rtl">
      {/* Header */}
      <header className="assessment-hero">
        <div className="assessment-hero-content">
          <div className="test-meta-badge">
            {test.scope === 'lesson' ? 'اختبار درس (20 سؤالاً)' : 'اختبار وحدة شامل'}
          </div>
          <h1 className="assessment-title">{test.title}</h1>
          <p className="assessment-description">{test.description}</p>
        </div>

        {/* Progress bar during test */}
        {!attempt.isSubmitted && (
          <div className="assessment-progress-bar-card" role="region" aria-label="شريط تقدم الإجابة">
            <div className="progress-label-row">
              <span>الأسئلة المجاب عنها:</span>
              <span>
                <ArabicNumber value={answeredCount} /> / <ArabicNumber value={totalQuestions} />
              </span>
            </div>
            <div className="progress-track" aria-hidden="true">
              <div
                className="progress-fill"
                style={{
                  width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* PR1 — honest warning: the draft did NOT persist. It stays visible
          until a write actually succeeds, and offers an explicit retry. */}
      {saveFailed && !attempt.isSubmitted && (
        <div className="assessment-save-warning" role="alert">
          <p className="assessment-save-warning-text">
            تعذّر حفظ مسودّة إجاباتك في هذه الجلسة؛ إجاباتك لم تُحفظ، وهي موجودة في ذاكرة هذه الصفحة
            فقط وستضيع بمغادرة الصفحة. انسخ إجابتك قبل المغادرة.
          </p>
          <div className="assessment-save-warning-actions">
            <button type="button" className="btn btn-secondary btn-small" onClick={retrySave}>
              إعادة محاولة الحفظ
            </button>
            {retryFailedNotice && (
              <span className="assessment-save-retry-note" role="status">
                لم تنجح إعادة المحاولة الأخيرة.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Results Summary banner after submit */}
      {attempt.isSubmitted && evalResult && (
        <section
          className="assessment-result-summary"
          role="region"
          aria-label="نتائج الاختبار"
        >
          <h2 className="summary-title">نتيجة التقييم</h2>
          <div className="summary-metrics-grid">
            <div className="metric-card score-metric">
              <span className="metric-label">النسبة المئوية</span>
              <span className="metric-value">
                <ArabicNumber value={evalResult.percentage} />%
              </span>
            </div>

            <div className="metric-card correct-metric">
              <span className="metric-label">الإجابات الصحيحة</span>
              <span className="metric-value">
                <ArabicNumber value={evalResult.correctCount} />
              </span>
            </div>

            <div className="metric-card incorrect-metric">
              <span className="metric-label">الإجابات غير الصحيحة</span>
              <span className="metric-value">
                <ArabicNumber value={evalResult.incorrectCount} />
              </span>
            </div>

            <div className="metric-card total-metric">
              <span className="metric-label">الدرجة</span>
              <span className="metric-value">
                <ArabicNumber value={evalResult.score} /> / <ArabicNumber value={evalResult.totalPossible} />
              </span>
            </div>
          </div>

          <div className="summary-actions-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRestart}
            >
              🔄 إعادة المحاولة باختبار جديد
            </button>
            {onExit && (
              <button type="button" className="btn btn-secondary" onClick={onExit}>
                العودة للدرس
              </button>
            )}
          </div>
        </section>
      )}

      {/* Questions list */}
      <section className="assessment-questions-container" aria-label="قائمة الأسئلة">
        {test.questions.map((question) => {
          const isCorrect = evalResult
            ? evalResult.questionResults[question.id]
            : false;

          return (
            <QuestionRenderer
              key={question.id}
              question={question}
              userAnswer={attempt.answers[question.id]}
              onAnswerChange={(val) => handleAnswerChange(question.id, val)}
              showReview={attempt.isSubmitted}
              isCorrect={isCorrect}
            />
          );
        })}
      </section>

      {/* Footer Submission Action */}
      {!attempt.isSubmitted && (
        <footer className="assessment-footer">
          <div className="footer-status-text">
            أجبت عن <ArabicNumber value={answeredCount} /> من أصل{' '}
            <ArabicNumber value={totalQuestions} /> أسئلة.
          </div>
          <button
            type="button"
            className="btn btn-primary btn-submit-test"
            onClick={handleSubmit}
            disabled={totalQuestions === 0}
          >
            ✓ اعتماد وإرسال الإجابات
          </button>
        </footer>
      )}
    </div>
  );
};
