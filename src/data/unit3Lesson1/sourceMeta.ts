import { SourceReference, SourceType } from '../../types/curriculum';

/**
 * Unit 3, Lesson 1 («العُلَماءُ الصِّغار», pp. 73–83) source metadata.
 *
 * Authoritative input: the eleven supplied scans (image-1.png = ص٧٣ …
 * image-11.png = ص٨٣) plus the owner-supplied tighter crops
 * (image-12.png … image-27.png) used only to confirm specific printed
 * positions. Transcribed in
 * docs/source-locks/unit3-lesson-01-al-ulama-as-sighar.md.
 *
 * The printed "2" at the top-right of the first scan is fully excluded:
 * the lesson is registered as Unit 3 Lesson 1 («الوحدة الثالثة، الدرس
 * الأول») with no numbering inferred from that mark. The unit stays
 * incomplete: no owner declaration «هذا هو آخر درس في الوحدة» ⇒ no unit
 * test, no lesson test, no teacher guide and no answer key.
 */
export const U3L1_DOCUMENT_TITLE = 'اللغة العربية — الصف الخامس الأساسي (الكتاب المدرسي الرسمي)';

export function u3l1Src(
  pageNumber: number,
  sourceType: SourceType,
  sectionName?: string,
  itemNumber?: number | string,
  uncertaintyNote?: string,
  pageEndNumber?: number,
): SourceReference {
  return {
    documentTitle: U3L1_DOCUMENT_TITLE,
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
 * ص٧٣ يطلب الاستماع إلى نصّ، والمرفقات تحمل صفحات مصوّرة فقط بلا تسجيل
 * صوتي. لا يُنسب نصّ الاستماع إلى قصيدة ص٧٤ (العلاقة غير مثبتة في المصدر)،
 * ولا يُخترع نصّ استماع أو تسجيل. تُعرض الأسئلة كما طُبعت بلا حلول.
 */
export const U3L1_LISTENING_AUDIO_GAP =
  'التسجيل الصوتي غير متوفر في المصدر المتاح؛ لا يُعرض نصّ استماع مُخترع، وتُنفَّذ أسئلة الاستماع كما طُبعت في ص٧٣ بلا حلول أو مفاتيح تصحيح.';

/** Declared source limits — shown to the learner and recorded in the source lock. */
export const U3L1_LOCKED_SOURCE_NOTES = {
  listeningAudio: U3L1_LISTENING_AUDIO_GAP,
  poemListeningRelation:
    'لا تُنسب قصيدة ص٧٤ إلى نصّ الاستماع؛ العلاقة بينهما غير مثبتة في المصدر، فتُعرض القصيدة نصّ قراءة فقط، وتُعلَن الأسئلة الثلاثة ص٧٣ بلا حلول.',
  dictationAudio:
    'البند الإملائي ص٧٨ أداء إملائي شفهي بلا تسجيل في المرفقات؛ النصّ المطبوع ص٧٨ هو المادة المتاحة، ويُنفَّذ الإملاء بقراءة المعلم.',
  handwritingModels:
    'نماذج الخطّ بخطّ الرقعة ص٨٠–٨١ والورقة الصفراء والرسم المرقّم ص٨٠ رسوم خطية ملوّنة؛ لا يستطيع خطّ الحاسوب محاكاتها بأمانة، فتُنفَّذ يدوياً على ورقة مسطّرة ولا تُستبدل بحروف مطبعية.',
  printedDate:
    'التاريخ المطبوع في نموذج الرسالة ص٨١ «٢٠١٨/٢/٢٦» يُعرض كما طُبع دون تغيير.',
  images:
    'صور ص٧٣ وص٨٣ لا تُعاد إنتاجها؛ تُعرض ملاحظة منصة محايدة مختصرة لما يظهر فيها دون استنتاج معنى، ولا تُنسب إلى الكتاب.',
} as const;
