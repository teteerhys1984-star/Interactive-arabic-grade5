import React from 'react';
import { Unit } from '../../types/curriculum';
import { ArabicNumber } from '../common/BiDi';

export interface UnitCardProps {
  unit: Unit;
  onOpenUnit: () => void;
  hasSavedLocation?: boolean;
}

/** A concise curriculum entry. Lesson details, review, and tests live on UnitPage. */
export const UnitCard: React.FC<UnitCardProps> = ({ unit, onOpenUnit, hasSavedLocation = false }) => {
  const { metadata, lessons } = unit;
  const showTheme = metadata.theme && !metadata.title.includes(metadata.theme);

  return (
    <article className="unit-card unit-entry" dir="rtl" aria-labelledby={`unit-title-${metadata.id}`}>
      <div className="unit-entry-copy">
        <span className="unit-order-badge">الوحدة <ArabicNumber value={metadata.order} /></span>
        <h2 id={`unit-title-${metadata.id}`} className="unit-title">{metadata.title}</h2>
        {showTheme && <p className="unit-theme">المحور: {metadata.theme}</p>}
        <p className="unit-entry-count">
          <ArabicNumber value={lessons.length} /> دروس
          {hasSavedLocation && <span className="unit-saved-location">يوجد موضع محفوظ في هذه الوحدة</span>}
        </p>
      </div>
      <button
        type="button"
        className="btn btn-secondary unit-open-button"
        onClick={onOpenUnit}
        aria-label={`عرض دروس ${metadata.title}`}
      >
        عرض دروس الوحدة <span aria-hidden="true" className="lesson-btn-arrow">←</span>
      </button>
    </article>
  );
};
