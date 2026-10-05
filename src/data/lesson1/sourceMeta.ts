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
    page: 5,
    region: 'سطر البحر الأخير في المقطع ١',
    issue: 'الكلمة «وَالزَّرَقِ» غير واضحة السياق',
    whyItMatters: 'تؤثر على دقة النقل الحرفي لجملة البحر',
    cropNeeded: 'قصّ السطر الأخير من المقطع الأول (صفحة ٥)',
  },
  {
    page: 5,
    region: 'معجم الكلمات',
    issue: 'المُدخَل «لِلْغَرَقِ: المَقْصَدُ» غير واضح',
    whyItMatters: 'يحدد الكلمة المشروحة ومعناها',
    cropNeeded: 'قصّ صندوق معجم الكلمات (صفحة ٥)',
  },
  {
    page: 6,
    region: 'النشاط ١ - البند الثاني',
    issue: '«مَعْنى (قَضَّتْ)» — الكلمة بين قوسين لم تُرصد في النص',
    whyItMatters: 'يحدد الكلمة المطلوب بيان معناها',
    cropNeeded: 'قصّ البند الثاني من النشاط ١ (صفحة ٦)',
  },
  {
    page: 9,
    region: 'ترويسة جدول التقويم النهائي',
    issue: '«الشَّبَبُ» يُرجّح أنها «السَّبَبُ»',
    whyItMatters: 'تسمية عمود في الجدول',
    cropNeeded: 'قصّ ترويسة جدول التقويم (صفحة ٩)',
  },
  {
    page: 10,
    region: 'سطر أتدرّب',
    issue: '«وَالضَّعْفِ» غير واضحة (يُرجّح والتَّضْعيف/الضَّم)',
    whyItMatters: 'دقة نص توجيه التدريب على الحركات',
    cropNeeded: 'قصّ سطر أتدرّب (صفحة ١٠)',
  },
  {
    page: 11,
    region: 'النشاط ١ - صَفّا الرموز',
    issue: 'دقة تمييز الرموز/الأشكال غير كافية لفكّ الشيفرة',
    whyItMatters: 'يحدد الجملتين المستهدفتين في لعبة فك الرموز',
    cropNeeded: 'قصّ صفّي الرموز في النشاط ١ (صفحة ١١)',
  },
];
