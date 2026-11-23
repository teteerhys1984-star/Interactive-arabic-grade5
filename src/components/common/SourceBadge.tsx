import React from 'react';
import { PlatformSourceReference, SourceReference } from '../../types/curriculum';
import { ArabicNumber } from '../common/BiDi';

export interface SourceBadgeProps {
  source: SourceReference | PlatformSourceReference;
  compact?: boolean;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, compact = false }) => {
  return (
    <div
      className={`source-badge ${compact ? 'source-badge-compact' : ''}`}
      title={
        'pageNumber' in source
          ? `المرجع الرسمي: ${source.documentTitle} - ص ${source.pageNumber}`
          : `المصدر: ${source.documentTitle}`
      }
    >
      <span className="source-icon" aria-hidden="true">{'pageNumber' in source ? '📖' : '💡'}</span>
      <span className="source-doc">{source.documentTitle}</span>
      {'pageNumber' in source && (
        <>
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
        </>
      )}
      {source.sectionName && (
        <>
          <span className="source-separator">·</span>
          <span className="source-section">{source.sectionName}</span>
        </>
      )}
      {'readabilityVerified' in source && (source.readabilityVerified ? (
        <span className="source-verified-tag" title="تم التحقق من جودة ومقروئية الصفحة المصدرية">
          ✓ موثق
        </span>
      ) : (
        <span className="source-unverified-tag" title="قيد فحص المقروئية">
          قيد المراجعة
        </span>
      ))}
    </div>
  );
};
