import { SourceReference, SourceType } from '../../types/curriculum';

/**
 * Lesson 1 — official textbook source metadata.
 * Source of truth: الوحدة الأولى / الدرس الأول «السَّمَكَةُ الذَّهَبِيَّةُ», pages 4–11.
 * Every SourceReference built here carries readabilityVerified = true because each
 * page was individually inspected; items that could not be read with confidence are
 * flagged with uncertaintyNote and surfaced as audit warnings (never silently fixed).
 */

export const DOCUMENT_TITLE = 'اللغة العربية — الصف الخامس الأساسي (الكتاب المدرسي الرسمي)';

export function src(
  pageNumber: number,
  sourceType: SourceType,
  sectionName?: string,
  itemNumber?: number | string,
  uncertaintyNote?: string
): SourceReference {
  return {
    documentTitle: DOCUMENT_TITLE,
    term: 1,
    pageNumber,
    sectionName,
    itemNumber,
    sourceType,
    readabilityVerified: true,
    ...(uncertaintyNote ? { uncertaintyNote } : {}),
  };
}

/**
 * The exact regions that could not be read with full confidence during inspection.
 * These are reported (not guessed) and require higher-resolution crops.
 */
export interface SourceUncertainty {
  page: number;
  region: string;
  issue: string;
  whyItMatters: string;
  cropNeeded: string;
}

export const SOURCE_UNCERTAINTIES: SourceUncertainty[] = [
  {
    page: 11,
    region: 'النشاط ١ - صَفّا الرموز',
    issue: 'حتى مع القصّ العالي الدقة، لا يمكن فكّ تسلسل الرموز في الصفّين إلى جملتين بثقة',
    whyItMatters: 'يحدد الجملتين المستهدفتين في لعبة فك الرموز (وحلّ المعلم لهما)',
    cropNeeded: 'قصّ مكبّر إضافي لصفّي الرموز في النشاط ١ (صفحة ١١)',
  },
];
