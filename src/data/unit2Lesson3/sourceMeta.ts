import { SourceReference, SourceType } from '../../types/curriculum';

/**
 * Unit 2, Lesson 3 («بِالْعِلْمِ تَرْقَى») source metadata.
 *
 * Authoritative input: the eight supplied scans (image-1.png = ص٦١ …
 * image-8.png = ص٦٨), transcribed in
 * docs/source-locks/unit2-lesson-03-bil-ilmi-tarqa.md.
 *
 * This lesson follows Unit 2 Lesson 2 (ص٥٠–٦٠) with no gap in the printed
 * page order. The unit divider/theme page was never supplied, so the unit
 * stays «الوحدة الثانية» with no invented theme, and it stays incomplete:
 * no owner declaration «هذا هو آخر درس في الوحدة» ⇒ no unit test.
 */
export const U2L3_DOCUMENT_TITLE = 'اللغة العربية — الصف الخامس الأساسي (الكتاب المدرسي الرسمي)';

export function u2l3Src(
  pageNumber: number,
  sourceType: SourceType,
  sectionName?: string,
  itemNumber?: number | string,
  uncertaintyNote?: string,
  pageEndNumber?: number,
): SourceReference {
  return {
    documentTitle: U2L3_DOCUMENT_TITLE,
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
 * ص٦١ يطلب الاستماع إلى نصّ، والمرفقات تحمل صفحات مصوّرة فقط بلا تسجيل
 * صوتي. النص المطبوع الوحيد المتاح هو قصيدة ص٦٢؛ يُعلَن غياب التسجيل ولا
 * يُستبدل بنصّ استماع مُخترع.
 */
export const U2L3_LISTENING_AUDIO_GAP =
  'التسجيل الصوتي غير متوفر في المصدر المتاح؛ المدخل المعلن هو نصّ القراءة المطبوع ص٦٢ يقرؤه المعلم أو المتعلم بصوت عالٍ، ثم تُنجز مهمتا الاستماع مع إعلان غياب التسجيل.';

/** Declared source limits — shown to the learner and recorded in the source lock. */
export const U2L3_LOCKED_SOURCE_NOTES = {
  listeningAudio: U2L3_LISTENING_AUDIO_GAP,
  openingRiddle:
    'اللفظان الواردان بعد النقط في الإطار الأزرق ص٦١ («خيرُ جَليسٍ ...») غير محسومين بصرياً؛ لم يُثبتا كنصّ من الكتاب، ويلزم قصّ أدق للإطار لتثبيتهما.',
  poemLastStanza:
    'الكلمة الأخيرة في الشطر الأول من البيت السادس للقصيدة ص٦٢ («لُغَةُ الضّادِ …») غير محسومة بصرياً؛ لم تُثبَت كنصّ من الكتاب، ويلزم قصّ أدق للبيت.',
  dictationAudio:
    'البند ٣ ص٦٦ «أَكْتُبُ ما يُمليهِ عَلَيَّ المُعَلِّمُ» أداء إملائي شفهي بلا تسجيل في المرفقات؛ النصّ المطبوع ص٦٦ هو المادة المتاحة، ويُنفَّذ الإملاء بقراءة المعلم.',
  handwritingWords:
    'الكلمات الأربع المكتوبة بخط الرقعة ص٦٦، وأشكال الحرفين ص٦٧، والجدول المقارن بين خطّي النسخ والرقعة ص٦٧ رسوم خطية ملوّنة مرقمة؛ لا يستطيع خطّ الحاسوب محاكاتها بأمانة، فتُنفَّذ يدوياً على ورقة مسطّرة ولا تُستبدل بحروف مطبعية.',
  finalEvaluationDiagram:
    'مخطّط التقويم النهائي ص٦٥ يحوي مجموعة المثال المطبوعة («يَكتُبُ» ← «كَتَبَ»، «كَتَبا»، «كَتَبَتْ») ومجموعتين أخريين فراغاتهما وبطاقة «اسْتَحَقَّ» مطبوعة؛ لا تُملأ الفراغات بإجابات من المنصة.',
  tashkeel:
    'التشكيل الدقيق حرفاً بحرف في النصوص الطويلة (فقرة ص٦٤، فقرة الإملاء ص٦٦، أبيات القصيدة ص٦٢، أسئلة ص٦٣) يحتاج قصّات عالية الدقة لتأكيده؛ النص المعروض قراءة ملتزمة بالحروف والتشكيل الظاهر، وهي قابلة للتصحيح عند وصول قصّات أدق.',
} as const;
