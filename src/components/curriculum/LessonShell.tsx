import React, { useEffect, useRef, useState } from 'react';
import { Lesson, LessonStep, Unit } from '../../types/curriculum';
import { ArabicNumber } from '../common/BiDi';
import { SourceBadge } from '../common/SourceBadge';
import { readLearningLocation, writeLearningLocation } from '../../utils/learningProgress';

export interface LessonShellProps {
  lesson: Lesson;
  unit?: Unit;
  onOpenTest?: () => void;
  /** Returns to the current unit page. */
  onExit?: () => void;
  onGoHome?: () => void;
  onSelectLesson?: (lessonId: string) => void;
  /** Optional renderer injected by the lesson layer to draw step content. */
  renderStepContent?: (step: LessonStep) => React.ReactNode;
}

function initialStepIndex(lesson: Lesson): number {
  const location = readLearningLocation();
  if (!location || location.unitId !== lesson.metadata.unitId || location.lessonId !== lesson.metadata.id) return 0;
  const index = lesson.steps.findIndex((step) => step.id === location.stepId);
  return index >= 0 ? index : 0;
}

export const LessonShell: React.FC<LessonShellProps> = ({
  lesson,
  unit,
  onOpenTest,
  onExit,
  onGoHome,
  onSelectLesson,
  renderStepContent,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(() => initialStepIndex(lesson));
  const stepButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const steps = lesson.steps || [];
  const totalSteps = steps.length;
  const currentStep: LessonStep | undefined = steps[currentStepIndex];
  const currentStepNumber = currentStepIndex + 1;
  const lessonIndex = unit?.lessons.findIndex((item) => item.metadata.id === lesson.metadata.id) ?? -1;
  const nextLesson = lessonIndex >= 0 ? unit?.lessons[lessonIndex + 1] : undefined;

  const persistStep = (step: LessonStep) => {
    writeLearningLocation({
      unitId: lesson.metadata.unitId,
      lessonId: lesson.metadata.id,
      stepId: step.id,
    });
  };

  useEffect(() => {
    const activeStep = steps[currentStepIndex];
    if (activeStep) persistStep(activeStep);
    // The shell is keyed by lesson ID in the app; write only the initial location here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.metadata.id, lesson.metadata.unitId]);

  const selectStep = (index: number) => {
    if (index < 0 || index >= totalSteps) return;
    setCurrentStepIndex(index);
    const nextStep = steps[index];
    if (nextStep) persistStep(nextStep);
  };

  const handleStepKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let destination: number | undefined;
    if (event.key === 'ArrowDown') destination = Math.min(index + 1, totalSteps - 1);
    if (event.key === 'ArrowUp') destination = Math.max(index - 1, 0);
    if (event.key === 'Home') destination = 0;
    if (event.key === 'End') destination = totalSteps - 1;

    if (destination !== undefined) {
      event.preventDefault();
      selectStep(destination);
      stepButtonRefs.current[destination]?.focus();
    }
  };

  const navigateByControl = (index: number) => {
    selectStep(index);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderStepList = (className = '') => (
    <ol className={`lesson-nav-list ${className}`.trim()}>
      {steps.map((step, index) => {
        const isCurrent = index === currentStepIndex;
        return (
          <li key={step.id} className={`lesson-nav-item ${isCurrent ? 'is-current' : ''}`}>
            <button
              ref={(element) => { stepButtonRefs.current[index] = element; }}
              type="button"
              className="lesson-nav-button"
              tabIndex={isCurrent ? 0 : -1}
              onClick={() => selectStep(index)}
              onKeyDown={(event) => handleStepKeyDown(event, index)}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`الخطوة ${index + 1}: ${step.title}${isCurrent ? '، الخطوة الحالية' : '، انتقل إليها'}`}
            >
              <span className="lesson-step-number" aria-hidden="true">
                <ArabicNumber value={String(index + 1).padStart(2, '0')} />
              </span>
              <span className="lesson-step-name">{step.title}</span>
              {isCurrent && <span className="lesson-step-status status-current">الآن</span>}
              {isCurrent && <span className="lesson-step-current-marker" aria-hidden="true" />}
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <div className="lesson-shell" dir="rtl">
      {(unit || onGoHome) && (
        <nav className="lesson-breadcrumbs" aria-label="مسار التنقل">
          {onGoHome && <button type="button" className="breadcrumb-link" onClick={onGoHome}>الرئيسية</button>}
          {onGoHome && unit && <span aria-hidden="true">←</span>}
          {unit && onExit ? (
            <button type="button" className="breadcrumb-link" onClick={onExit}>{unit.metadata.title}</button>
          ) : unit ? (
            <span>{unit.metadata.title}</span>
          ) : null}
          {(unit || onGoHome) && <span aria-hidden="true">←</span>}
          <span aria-current="page">{lesson.metadata.title}</span>
        </nav>
      )}

      <header className="lesson-shell-header">
        <div className="lesson-header-top">
          <div className="lesson-title-meta">
            <span className="lesson-order-tag">
              الدرس <ArabicNumber value={lesson.metadata.order} />
              <span className="lesson-header-divider" aria-hidden="true" />
              الصف الخامس الأساسي
            </span>
            <h1 className="lesson-main-title">{lesson.metadata.title}</h1>
            {lesson.metadata.subtitle && <p className="lesson-subtitle">{lesson.metadata.subtitle}</p>}
          </div>
          {onExit && (
            <button
              type="button"
              className="btn btn-ghost lesson-exit-button"
              onClick={onExit}
              aria-label="العودة إلى صفحة الوحدة"
            >
              <span aria-hidden="true" dir="ltr">→</span>
              العودة إلى الوحدة
            </button>
          )}
        </div>
      </header>

      <div className="lesson-layout">
        {totalSteps > 0 && (
          <aside className="lesson-navigation-rail">
            <div className="lesson-navigation-card">
              <div className="lesson-nav-heading">
                <span className="lesson-nav-kicker">موضعك في الدرس</span>
                <h2>خطوات الدرس</h2>
                <p>اختر خطوة للانتقال إليها.</p>
              </div>

              <div className="lesson-step-position" aria-live="polite">
                الخطوة <ArabicNumber value={currentStepNumber} /> من <ArabicNumber value={totalSteps} />
              </div>

              <nav aria-label="خطوات الدرس">
                {renderStepList()}
              </nav>
            </div>
          </aside>
        )}

        <div className="lesson-content-column">
          {totalSteps > 0 && (
            <nav className="lesson-mobile-navigation" aria-label="التنقل بين خطوات الدرس">
              <div className="mobile-progress-heading">
                <span className="mobile-progress-kicker">الخطوة الحالية</span>
                <span className="mobile-progress-count">
                  <ArabicNumber value={currentStepNumber} /> من <ArabicNumber value={totalSteps} />
                </span>
              </div>
              <label className="mobile-step-select-label">
                <span>اختر خطوة للانتقال إليها</span>
                <select
                  className="mobile-step-select"
                  value={currentStepIndex}
                  onChange={(event) => selectStep(Number(event.target.value))}
                >
                  {steps.map((step, index) => (
                    <option key={step.id} value={index}>
                      {String(index + 1).padStart(2, '0')} · {step.title}
                    </option>
                  ))}
                </select>
              </label>
            </nav>
          )}

          <section
            className="lesson-step-content"
            aria-labelledby={currentStep ? `current-step-title-${lesson.metadata.id}` : undefined}
          >
            {currentStep ? (
              <article className="step-card">
                <header className="step-card-header">
                  <div className="step-title-group">
                    <span className="step-content-kicker">محتوى الخطوة</span>
                    <h2 id={`current-step-title-${lesson.metadata.id}`} className="step-title" aria-live="polite">
                      {currentStep.title}
                    </h2>
                  </div>
                  {currentStep.source && <SourceBadge source={currentStep.source} compact />}
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
          </section>

          <footer className="lesson-shell-footer" aria-label="التنقل بين الخطوات والدروس">
            <button
              type="button"
              className="btn btn-secondary lesson-footer-button"
              onClick={() => navigateByControl(currentStepIndex - 1)}
              disabled={currentStepIndex === 0 || totalSteps === 0}
              aria-label={currentStepIndex > 0 ? `العودة إلى الخطوة ${currentStepIndex}` : 'لا توجد خطوة سابقة'}
            >
              <span className="lesson-nav-arrow" aria-hidden="true" dir="ltr">→</span>
              الخطوة السابقة
            </button>

            {lesson.testId && currentStepIndex === totalSteps - 1 && totalSteps > 0 && (
              <button
                type="button"
                className="btn btn-accent lesson-test-button"
                onClick={onOpenTest}
                aria-label="بدء اختبار الدرس، عشرون سؤالاً"
              >
                بدء اختبار الدرس <span className="test-question-count">(20 سؤالاً)</span>
              </button>
            )}

            {currentStepIndex < totalSteps - 1 && (
              <button
                type="button"
                className="btn btn-primary lesson-footer-button"
                onClick={() => navigateByControl(currentStepIndex + 1)}
                aria-label={`الانتقال إلى الخطوة ${currentStepIndex + 2}`}
              >
                الخطوة التالية
                <span className="lesson-nav-arrow" aria-hidden="true" dir="ltr">←</span>
              </button>
            )}

            {nextLesson && currentStepIndex === totalSteps - 1 && onSelectLesson && (
              <button
                type="button"
                className="btn btn-secondary lesson-next-lesson-button"
                onClick={() => onSelectLesson(nextLesson.metadata.id)}
              >
                الدرس التالي: {nextLesson.metadata.title}
                <span className="lesson-nav-arrow" aria-hidden="true" dir="ltr">←</span>
              </button>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
};
