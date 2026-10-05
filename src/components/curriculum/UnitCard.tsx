import React from 'react';
import { Unit } from '../../types/curriculum';
import { ArabicNumber } from '../common/BiDi';

export interface UnitCardProps {
  unit: Unit;
  onSelectLesson: (lessonId: string) => void;
  onOpenUnitTest?: (unitId: string) => void;
}

export const UnitCard: React.FC<UnitCardProps> = ({
  unit,
  onSelectLesson,
  onOpenUnitTest,
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

      {/* Unit Test Action - STRICT: only enabled if isComplete is true */}
      <footer className="unit-card-footer">
        {isUnitComplete ? (
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => onOpenUnitTest && onOpenUnitTest(metadata.id)}
          >
            📋 اختبار الوحدة الشامل (50–60 سؤالاً)
          </button>
        ) : (
          <div className="unit-test-locked-notice">
            <span className="lock-icon">🔒</span>
            <span>اختبار الوحدة غير متاح حالياً (يتطلب إعلان المالك اكتمال دروس الوحدة).</span>
          </div>
        )}
      </footer>
    </article>
  );
};
