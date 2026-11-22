import { SourceReference, SourceType } from '../../types/curriculum';

/**
 * «تقويم الوحدة الثانية» — source metadata.
 *
 * Authoritative input: the two printed pages of the official textbook that carry
 * the «تقويم الوحدة» badge (pages 69–70). They come directly after Unit 2's
 * third lesson «بِالْعِلْمِ تَرْقَى» (pages 61–68) and are audited in
 * docs/source-locks/unit2-review-pages-69-70.md.
 *
 * This element is an assessment extension of Unit 2. It is NOT a fourth lesson,
 * NOT a unit test, and it never changes the unit's lesson count, lesson order or
 * completion state (`isComplete` stays false and no `unitTestId` is added).
 */
export const UNIT2_REVIEW_DOCUMENT_TITLE =
  'اللغة العربية — الصف الخامس الأساسي (الكتاب المدرسي الرسمي)';

export const UNIT2_REVIEW_ID = 'unit2-review';
export const UNIT2_REVIEW_TITLE = 'تقويم الوحدة الثانية';
export const UNIT2_REVIEW_ENGLISH_LABEL = 'Unit 2 Review';
export const UNIT2_REVIEW_UNIT_ID = 'unit2';

export function u2rSrc(
  pageNumber: number,
  sourceType: SourceType,
  sectionName?: string,
  itemNumber?: number | string,
  uncertaintyNote?: string,
): SourceReference {
  return {
    documentTitle: UNIT2_REVIEW_DOCUMENT_TITLE,
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
 * Printed questions kept OUT of the current implementation.
 *
 * Both are recorded in the source audit (so the printed page stays fully
 * documented) but they own no student element: no step, no field, no notice and
 * no paper substitute inside the platform. Nothing is guessed to fill the gap.
 */
export interface Unit2ReviewExclusion {
  /** Printed question number on page 69 (Arabic-Indic ٢ / ٤ in the textbook). */
  printedNumber: number;
  page: number;
  /** Short printed title, used in documentation only. */
  title: string;
  /** Why the question is out of scope — stated, never worked around. */
  reason: string;
}

export const UNIT2_REVIEW_EXCLUSIONS: Unit2ReviewExclusion[] = [
  {
    printedNumber: 2,
    page: 69,
    title: 'أَضْبِطُ أَوَاخِرَ كَلِمَاتِ الْجُمْلَةِ الْآتِيَةِ بِالْحَرَكَةِ الْمُنَاسِبَةِ',
    reason:
      'طريقة إدخال إجابة ضبط أواخر الكلمات (كتابة الحركات) لم تُحسم بعد، فبقي النشاط خارج التنفيذ. لم تُخترع له واجهة بديلة، ولا حقل تشكيل اختياري، ولا نسخة ورقية داخل المنصة.',
  },
  {
    printedNumber: 4,
    page: 69,
    title: 'أُكْمِلُ الْجَدْوَلَ الْآتِي بِمَا يُنَاسِبُهُ',
    reason:
      'منطق تعبئة الجدول (وظيفة الأعمدة «الاصطناعيُّ / تقليديٌّ / أمامَ» وعلاقتها بصفّ «ضِدُّهَا») غير محسوم تربويًا. لا تُنشأ خلايا ولا حقول، ولا تفسَّر العناوين من عند المنصة.',
  },
];
