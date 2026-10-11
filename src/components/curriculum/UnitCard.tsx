import React from 'react';
import { Unit, UnitReview } from '../../types/curriculum';
import { ArabicNumber, LatinText } from '../common/BiDi';
import { toArabicDigits } from '../../utils/arabicDigits';

export interface UnitCardProps {
  unit: Unit;
  onSelectLesson: (lessonId: string) => void;
  /** Offered only when the unit is explicitly complete and its test is available. */
  onOpenUnitTest?: () => void;
  /**
   * Official unit review (textbook «تقويم الوحدة»).
   * Shown in its own section AFTER the lessons list — never as a lesson and
   * never inside the lessons list, so lesson count and order stay untouched.
   */
  review?: UnitReview;
  onOpenReview?: () => void;
}

export const UnitCard: React.FC<UnitCardProps> = ({
  unit,
  onSelectLesson,
  onOpenUnitTest,
  review,
  onOpenReview,
}) => {
  const { metadata, lessons } = unit;
  const isUnitComplete = metadata.isComplete;

  return (
    <article className="unit-card" dir="rtl" aria-labelledby={`unit-title-${metadata.id}`}>
      <header className="unit-card-header">
        <div className="unit-meta-top">
          <span className="unit-order-badge">
            الوحدة <ArabicNumber value={metadata.order} />
          </span>
          <span
            className={`unit-completion-badge ${
              isUnitComplete ? 'badge-completed' : 'badge-in-progress'
            }`}
          >
            {isUnitComplete ? 'مكتملة رسمياً ✓' : 'قيد التدريس (غير مكتملة)'}
          </span>
        </div>
        <h2 id={`unit-title-${metadata.id}`} className="unit-title">
          {metadata.title}
        </h2>
        {metadata.theme && <p className="unit-theme">{metadata.theme}</p>}
      </header>

      {/* Unit test — offered only after the explicit completion declaration */}
      {isUnitComplete && onOpenUnitTest && (
        <div className="unit-test-section">
          <button type="button" className="btn btn-accent lesson-test-button" onClick={onOpenUnitTest}>
            اختبار الوحدة الأولى الشامل (٥٠ سؤالاً)
          </button>
        </div>
      )}

      {/* Lessons List in this Unit */}
      <div className="unit-lessons-section">
        <h3 className="section-subtitle">
          دروس الوحدة (<ArabicNumber value={lessons.length} />):
        </h3>
        {lessons.length === 0 ? (
          <p className="no-lessons-notice">
            لم تُسجّل دروس لهذه الوحدة بعد (في انتظار اعتماد الكتاب المدرسي).
          </p>
        ) : (
          <ul className="lessons-list">
            {lessons.map((lesson) => (
              <li key={lesson.metadata.id} className="lesson-list-item">
                <button
                  type="button"
                  className="lesson-select-btn"
                  onClick={() => onSelectLesson(lesson.metadata.id)}
                >
                  <span className="lesson-bullet">•</span>
                  <span className="lesson-btn-title">{lesson.metadata.title}</span>
                  <span className="lesson-btn-arrow">←</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Unit review section — separate from the lessons list on purpose */}
      {review && onOpenReview && (
        <section className="unit-review-section" aria-labelledby={`unit-review-title-${review.metadata.id}`}>
          <div className="unit-review-kicker">
            مراجعة الوحدة · <LatinText>{review.metadata.englishLabel}</LatinText>
          </div>
          <h3 id={`unit-review-title-${review.metadata.id}`} className="unit-review-title">
            {review.metadata.title}
          </h3>
          <p className="unit-review-description">{review.metadata.description}</p>
          <ul className="unit-review-facts">
            <li>
              الأسئلة المرقّمة: <ArabicNumber value={toArabicDigits(review.metadata.printedQuestions)} />
            </li>
            <li>
              الفروع: <ArabicNumber value={toArabicDigits(review.metadata.printedBranches)} />
            </li>
            <li>
              صفحات الكتاب <ArabicNumber value={toArabicDigits(review.metadata.sourcePagesRange.startPage)} />–
              <ArabicNumber value={toArabicDigits(review.metadata.sourcePagesRange.endPage)} />
            </li>
          </ul>
          <p className="unit-review-note">
            تقويم رسمي لمراجعة دروس الوحدة، وليس درساً رابعاً، ولا يُلغي اختبار الوحدة الشامل.
          </p>
          <button type="button" className="btn btn-secondary unit-review-button" onClick={onOpenReview}>
            ابدأ تقويم الوحدة الأولى <span aria-hidden="true" className="lesson-btn-arrow">←</span>
          </button>
        </section>
      )}

    </article>
  );
};
