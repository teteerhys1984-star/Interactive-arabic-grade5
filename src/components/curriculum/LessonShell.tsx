import React, { useState } from 'react';
import { Lesson, LessonStep } from '../../types/curriculum';
import { ArabicNumber } from '../common/BiDi';
import { SourceBadge } from '../common/SourceBadge';

export interface LessonShellProps {
  lesson: Lesson;
  onOpenTest?: () => void;
  onExit?: () => void;
  /** Optional renderer injected by the lesson layer to draw step content. */
  renderStepContent?: (step: LessonStep) => React.ReactNode;
}

export const LessonShell: React.FC<LessonShellProps> = ({
  lesson,
  onOpenTest,
  onExit,
  renderStepContent,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = lesson.steps || [];
  const totalSteps = steps.length;
  const currentStep: LessonStep | undefined = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="lesson-shell" dir="rtl">
      {/* Lesson Header Navigation */}
      <header className="lesson-shell-header">
        <div className="lesson-header-top">
          <div className="lesson-title-meta">
            <span className="lesson-order-tag">
              الدرس <ArabicNumber value={lesson.metadata.order} />
            </span>
            <h1 className="lesson-main-title">{lesson.metadata.title}</h1>
          </div>
          {onExit && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onExit}
              aria-label="الرجوع إلى قائمة الوحدات"
            >
              ← العودة للقائمة
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {totalSteps > 0 && (
          <nav className="lesson-step-stepper" aria-label="شريط مراحل الدرس">
            <ol className="stepper-list">
              {steps.map((step, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;
                return (
                  <li
                    key={step.id}
                    className={`stepper-item ${isCurrent ? 'is-active' : ''} ${
                      isPassed ? 'is-completed' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => setCurrentStepIndex(idx)}
                      aria-current={isCurrent ? 'step' : undefined}
                    >
                      <span className="step-circle">
                        {isPassed ? '✓' : <ArabicNumber value={idx + 1} />}
                      </span>
                      <span className="step-label">{step.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
      </header>

      {/* Main Step Content Area */}
      <main className="lesson-step-content" role="main">
        {currentStep ? (
          <article className="step-card">
            <header className="step-card-header">
              <div className="step-type-pill">
                الخطوة <ArabicNumber value={currentStepIndex + 1} /> من{' '}
                <ArabicNumber value={totalSteps} />
              </div>
              <h2 className="step-title">{currentStep.title}</h2>
              {currentStep.source && <SourceBadge source={currentStep.source} />}
            </header>

            <div className="step-body-container">
              {renderStepContent ? renderStepContent(currentStep) : null}
            </div>
          </article>
        ) : (
          <div className="empty-step-state">
            <p>لا توجد خطوات متاحة لهذا الدرس حالياً.</p>
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <footer className="lesson-shell-footer">
        <div className="footer-nav-left">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
          >
            ← الخطوة السابقة
          </button>
        </div>

        <div className="footer-nav-middle">
          {lesson.testId && currentStepIndex === totalSteps - 1 && (
            <button
              type="button"
              className="btn btn-accent"
              onClick={onOpenTest}
            >
              📝 بدء اختبار الدرس (20 سؤالاً)
            </button>
          )}
        </div>

        <div className="footer-nav-right">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
            disabled={currentStepIndex >= totalSteps - 1}
          >
            الخطوة التالية →
          </button>
        </div>
      </footer>
    </div>
  );
};
