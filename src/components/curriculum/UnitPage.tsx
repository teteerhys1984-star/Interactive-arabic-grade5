import React from 'react';
import { Unit, UnitReview } from '../../types/curriculum';
import { ArabicNumber, LatinText } from '../common/BiDi';
import { LearningLocation } from '../../utils/learningProgress';
import { toArabicDigits } from '../../utils/arabicDigits';

export interface UnitPageProps {
  unit: Unit;
  review?: UnitReview;
  savedLocation?: LearningLocation | null;
  onGoHome: () => void;
  onSelectLesson: (lessonId: string) => void;
  onOpenUnitTest?: () => void;
  onOpenReview?: () => void;
}

export const UnitPage: React.FC<UnitPageProps> = ({
  unit,
  review,
  savedLocation,
  onGoHome,
  onSelectLesson,
  onOpenUnitTest,
  onOpenReview,
}) => {
  const { metadata, lessons } = unit;
  const showTheme = metadata.theme && !metadata.title.includes(metadata.theme);

  return (
    <section className="unit-page" dir="rtl" aria-labelledby={`unit-page-title-${metadata.id}`}>
      <nav className="breadcrumbs" aria-label="مسار التنقل">
        <button type="button" className="breadcrumb-link" onClick={onGoHome}>الرئيسية</button>
        <span aria-hidden="true">←</span>
        <span aria-current="page">{metadata.title}</span>
      </nav>

      <header className="unit-page-header">
        <span className="unit-order-badge">الوحدة <ArabicNumber value={metadata.order} /></span>
        <h1 id={`unit-page-title-${metadata.id}`}>{metadata.title}</h1>
        {showTheme && <p className="unit-page-theme">المحور: {metadata.theme}</p>}
        {metadata.sourcePagesRange && (
          <p className="unit-page-source-range">
            صفحات الوحدة <ArabicNumber value={metadata.sourcePagesRange.startPage} />–
            <ArabicNumber value={metadata.sourcePagesRange.endPage} />
          </p>
        )}
      </header>

      <section className="unit-page-lessons" aria-labelledby={`unit-lessons-title-${metadata.id}`}>
        <div className="unit-page-section-heading">
          <h2 id={`unit-lessons-title-${metadata.id}`}>دروس الوحدة</h2>
          <span><ArabicNumber value={lessons.length} /> دروس</span>
        </div>
        {lessons.length === 0 ? (
          <p className="no-lessons-notice">لم تُسجّل دروس لهذه الوحدة بعد.</p>
        ) : (
          <ol className="unit-page-lesson-list">
            {lessons.map((lesson) => {
              const isSavedLesson = savedLocation?.unitId === metadata.id && savedLocation.lessonId === lesson.metadata.id;
              const savedStepIndex = isSavedLesson
                ? lesson.steps.findIndex((step) => step.id === savedLocation?.stepId)
                : -1;
              const hasValidSavedStep = savedStepIndex >= 0;

              return (
                <li key={lesson.metadata.id} className="unit-page-lesson-row">
                  <span className="unit-page-lesson-order" aria-hidden="true">
                    <ArabicNumber value={lesson.metadata.order} />
                  </span>
                  <div className="unit-page-lesson-copy">
                    <h3>{lesson.metadata.title}</h3>
                    {lesson.metadata.subtitle && <p>{lesson.metadata.subtitle}</p>}
                    {hasValidSavedStep && (
                      <p className="unit-page-resume-note">
                        آخر موضع وصلت إليه: الخطوة <ArabicNumber value={savedStepIndex + 1} /> من{' '}
                        <ArabicNumber value={lesson.steps.length} />
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`btn ${hasValidSavedStep ? 'btn-primary' : 'btn-secondary'} unit-page-lesson-action`}
                    onClick={() => onSelectLesson(lesson.metadata.id)}
                    aria-label={`${hasValidSavedStep ? 'تابع' : 'ابدأ'} الدرس ${lesson.metadata.order}: ${lesson.metadata.title}`}
                    aria-current={hasValidSavedStep ? 'location' : undefined}
                  >
                    {hasValidSavedStep ? 'تابع الدرس' : 'ابدأ الدرس'}
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {(review || onOpenUnitTest) && (
        <section className="unit-page-assessments" aria-labelledby={`unit-assessments-title-${metadata.id}`}>
          <h2 id={`unit-assessments-title-${metadata.id}`}>المراجعة والاختبار</h2>
          <div className="unit-page-assessment-list">
            {review && onOpenReview && (
              <article className="unit-page-assessment-item">
                <div>
                  <span className="unit-review-kicker">
                    مراجعة الوحدة · <LatinText>{review.metadata.englishLabel}</LatinText>
                  </span>
                  <h3>{review.metadata.title}</h3>
                  <p>{review.metadata.description}</p>
                  <p className="unit-page-assessment-meta">
                    صفحات الكتاب <ArabicNumber value={toArabicDigits(review.metadata.sourcePagesRange.startPage)} />–
                    <ArabicNumber value={toArabicDigits(review.metadata.sourcePagesRange.endPage)} />
                  </p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={onOpenReview}>
                  ابدأ المراجعة
                </button>
              </article>
            )}
            {onOpenUnitTest && (
              <article className="unit-page-assessment-item">
                <div>
                  <span className="unit-review-kicker">اختبار معتمد لهذه الوحدة</span>
                  <h3>اختبار الوحدة</h3>
                </div>
                <button type="button" className="btn btn-accent" onClick={onOpenUnitTest}>
                  ابدأ اختبار الوحدة
                </button>
              </article>
            )}
          </div>
        </section>
      )}
    </section>
  );
};
