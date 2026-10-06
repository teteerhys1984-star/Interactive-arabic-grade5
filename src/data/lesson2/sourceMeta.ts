import { SourceReference, SourceType } from '../../types/curriculum';

/**
 * Lesson 2 source metadata.
 * Authoritative input: docs/source-locks/lesson-02-bil-rayi-wal-rayi-al-akhar.md
 * Pages 12–24 were verified during Source Lock.  No other Lesson 2 draft is a source.
 */
export const LESSON2_DOCUMENT_TITLE = 'اللغة العربية — الصف الخامس الأساسي (الكتاب المدرسي الرسمي)';

export function lesson2Src(
  pageNumber: number,
  sourceType: SourceType,
  sectionName?: string,
  itemNumber?: number | string,
  uncertaintyNote?: string,
  pageEndNumber?: number,
): SourceReference {
  return {
    documentTitle: LESSON2_DOCUMENT_TITLE,
    term: 1,
    pageNumber,
    ...(pageEndNumber ? { pageEndNumber } : {}),
    sectionName,
    itemNumber,
    sourceType,
    readabilityVerified: true,
    ...(uncertaintyNote ? { uncertaintyNote } : {}),
  };
}

/**
 * The source lock expressly records this gap.  It is shown to learners and
 * teachers rather than being filled with an invented listening recording.
 */
export const LISTENING_SOURCE_GAP =
  'المادة السمعية غير متوفرة في المصدر المتاح. لا يوجد تسجيل أو نص استماع مستقل، ولا يثبت المصدر أن قصيدة ص١٣ هي التسجيل.';

/**
 * These visual/textual models are described by the Source Lock but their
 * full verbatim transcription is not contained in it.  They must remain
 * transparent source-gap presentations in the interface.
 */
export const LOCKED_SOURCE_GAPS = {
  poemFullText:
    'تسجل وثيقة القفل عنوان القصيدة ومؤلفها وتعليمات القراءة، لكنها لا تتضمن نسخاً حرفياً كاملاً لأبياتها؛ لذلك لا يُعاد بناء النص هنا.',
  poemDependentDetails:
    'لا يثبت القفل النص الكامل أو ترقيم الأبيات أو ترتيب الأفكار في القصيدة؛ لذا لا تُنشأ إجابة نموذجية لهذه العناصر غير المنسوخة.',
  handwritingModels:
    'تثبت الوثيقة وجود ستة نماذج كتابية في ص٢١ ونموذجين للمقارنة في ص٢٢، لكنها لا تنسخها حرفياً؛ لذلك لا تُعرض نماذج بديلة أو مصطنعة.',
  grassDialogueFullText:
    'يوثق القفل الشخصيات وموضوع الحوار في ص٢٢–٢٣، لا النص الحرفي الكامل للحوار؛ لذا يعرض التطبيق وصف المصدر الموثق ولا يعيد إنشاء الحوار المنقول.',
} as const;
