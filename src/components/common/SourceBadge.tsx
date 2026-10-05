import React from 'react';
import { SourceReference } from '../../types/curriculum';
import { ArabicNumber } from '../common/BiDi';

export interface SourceBadgeProps {
  source: SourceReference;
  compact?: boolean;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, compact = false }) => {
  return (
    <div
      className={`source-badge ${compact ? 'source-badge-compact' : ''}`}
      title={`المرجع الرسمي: ${source.documentTitle} - ص ${source.pageNumber}`}
    >
      <span className="source-icon" aria-hidden="true">📖</span>
      <span className="source-doc">{source.documentTitle}</span>
      <span className="source-separator">·</span>
      <span className="source-page">
        صفحة <ArabicNumber value={source.pageNumber} />
        {source.pageEndNumber && (
          <>
            {' - '}
            <ArabicNumber value={source.pageEndNumber} />
          </>
        )}
      </span>
      {source.sectionName && (
        <>
          <span className="source-separator">·</span>
          <span className="source-section">{source.sectionName}</span>
        </>
      )}
      {source.readabilityVerified ? (
        <span className="source-verified-tag" title="تم التحقق من جودة ومقروئية الصفحة المصدرية">
          ✓ موثق
        </span>
      ) : (
        <span className="source-unverified-tag" title="قيد فحص المقروئية">
          قيد المراجعة
        </span>
      )}
    </div>
  );
};
