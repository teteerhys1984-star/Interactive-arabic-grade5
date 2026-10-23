import { SourceReference, SourceType } from '../../types/curriculum';

/**
 * Unit 2, Lesson 1 («مُخْتَرِعٌ مِنْ بِلَادِي») source metadata.
 * Authoritative input: docs/source-locks/unit2-lesson-01-mukhtari-min-biladi.md
 * Pages 40–49 were verified during the Source Lock. Unit 2's title/theme page
 * was NOT supplied, so the unit is registered as «الوحدة الثانية» without an
 * invented theme, and it is NOT complete (no owner declaration, no unit test).
 */
export const U2L1_DOCUMENT_TITLE = 'اللغة العربية — الصف الخامس الأساسي (الكتاب المدرسي الرسمي)';

export function u2l1Src(
  pageNumber: number,
  sourceType: SourceType,
  sectionName?: string,
  itemNumber?: number | string,
  uncertaintyNote?: string,
  pageEndNumber?: number,
): SourceReference {
  return {
    documentTitle: U2L1_DOCUMENT_TITLE,
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
 * Page 40 asks the learner to listen to a spoken text, but the supplied scans
 * carry no audio. The only declared input is the printed reading text on page
 * 41 (read aloud by the teacher/learner). The gap stays visible instead of
 * being replaced by invented audio or a substitute listening passage.
 */
export const U2L1_LISTENING_AUDIO_GAP =
  'التسجيل الصوتي غير متوفر في المصدر المتاح؛ المدخل المعلن هو نص القراءة المطبوع ص٤١ يقرؤه المعلم أو المتعلم بصوت عالٍ، ثم تُنجز مهام الاستماع منه مع إعلان غياب التسجيل.';

/** Declared locked source uncertainties (see Source Lock §٥). */
export const U2L1_LOCKED_SOURCE_NOTES = {
  unitTheme:
    'صفحة فاصل الوحدة الثانية (عنوانها ومحورها) غير مدرجة في الصور المرفقة؛ تُسجّل الوحدة باسم «الوحدة الثانية» فقط دون اختراع محور.',
  readingSegments:
    'حدود «المقطع الأول/الثاني» في توجيهات القراءة ص٤١ غير معلّمة بصرياً بفاصل مطبوع (النص بأقسام مرقمة ١-٢-٣)؛ يحدّد المعلم حدّ كل قراءة تدريبية ولا يُبنى سؤال على الحدود.',
  radioWord:
    'كلمة في قصة «أتعلّم» ص٤٣ بعد «ما كتبتُ» تُقرأ «بلغتي» تقريباً وغير محسومة الرسم والوظيفة بصرياً؛ لا يُبنى عليها أي سؤال.',
  handwritingWords:
    'ثلاث كلمات في الطرف الأيسر من صفوف ملاحظة الخط ص٤٧ غير محسومة الرسم كاملاً في دقة الصورة الحالية؛ الأحرف الملونة (ج/ح/خ) ومواضعها واضحة وهي موضوع النشاط، ولا يُقيَّم رسم الكلمات الثلاث كاملة.',
  dictation:
    'نص ما يمليه المعلم (ص٤٦ بند ٤) غير مطبوع في الكتاب أصلاً؛ تُنفَّذ المهمة أداءً صفياً ولا تُخترع لها مادة بديلة.',
} as const;
