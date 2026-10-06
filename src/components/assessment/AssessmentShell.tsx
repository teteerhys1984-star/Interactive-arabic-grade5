import React, { useState } from 'react';
import { AssessmentTest, UserAssessmentAttempt, UserAnswerValue } from '../../types/curriculum';
import { QuestionRenderer } from './QuestionRenderer';
import { evaluateAssessmentAttempt, createFreshAttempt } from '../../utils/testEvaluator';
import { ArabicNumber } from '../common/BiDi';

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
  const [attempt, setAttempt] = useState<UserAssessmentAttempt>(() =>
    createFreshAttempt(test.id)
  );

  const handleAnswerChange = (questionId: string, answer: UserAnswerValue) => {
    if (attempt.isSubmitted) return;
    setAttempt((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const handleSubmit = () => {
    const evalResult = evaluateAssessmentAttempt(test, attempt.answers);
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
