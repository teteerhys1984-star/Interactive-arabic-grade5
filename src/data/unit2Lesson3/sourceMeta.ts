import { SourceReference, SourceType } from '../../types/curriculum';

/**
 * Unit 2, Lesson 3 («بِالْعِلْمِ تَرْقَى») source metadata.
 *
 * Authoritative input: the eight supplied scans (image-1.png = ص٦١ …
 * image-8.png = ص٦٨) plus the four owner-supplied tighter crops
 * (image-9.png … image-12.png) used only to confirm specific printed
 * positions. Transcribed in
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
    'لفظا الإطار الأزرق ص٦١ وترتيبهما والفاصلة بعدهما ثُبِتت من القصّة الإضافية image-9.png: «أُنْسٌ وَوَنِيسٌ،» ثم «فَمَنْ أنا؟» في السطر التالي؛ التشكيل الظاهر منسوخ كما يُقرأ، وبعض العلامات الدقيقة في الخطّ المزخرف (حركة النون والسين) لا تُجزم بقراءتها بانتظار قصّة أعلى دقة، ولم تُضف المنصة حركات من عندها.',
  poemLastStanza:
    'الكلمة الأخيرة في الشطر الأول من البيت السادس للقصيدة ص٦٢ («لُغَةُ الضّادِ …») لا تزال غير محسومة: القصّة الإضافية عالية الدقة image-10.png تؤكد بقية الشطرين «لُغَةُ الضّادِ» و«فاحْذَرُوا العُجْمَةَ دابا»، لكن الكلمة الأخيرة تُظهر شَدّةً ونقطاً ملتبسة تتعدد معها قراءات الحروف والحركات حتى بعد تكبيرها ١٢٠٠٪ ومطابقة قراءة OCR؛ لم تُثبَت كنصّ من الكتاب ولا تُخمَّن، ويلزم تثبيتها بكلمة صريحة من صاحب المشروع.',
  dictationAudio:
    'البند ٣ ص٦٦ «أَكْتُبُ ما يُمليهِ عَلَيَّ المُعَلِّمُ» أداء إملائي شفهي بلا تسجيل في المرفقات؛ النصّ المطبوع ص٦٦ هو المادة المتاحة، ويُنفَّذ الإملاء بقراءة المعلم.',
  handwritingWords:
    'الكلمات الأربع المكتوبة بخط الرقعة ص٦٦، وأشكال الحرفين ص٦٧، والجدول المقارن بين خطّي النسخ والرقعة ص٦٧ رسوم خطية ملوّنة مرقمة؛ لا يستطيع خطّ الحاسوب محاكاتها بأمانة، فتُنفَّذ يدوياً على ورقة مسطّرة ولا تُستبدل بحروف مطبعية.',
  finalEvaluationDiagram:
    'مخطّط التقويم النهائي ص٦٥ يحوي مجموعة المثال المطبوعة («يَكتُبُ» ← «كَتَبَ»، «كَتَبا»، «كَتَبَتْ») ومجموعتين أخريين فراغاتهما وبطاقة «اسْتَحَقَّ» مطبوعة؛ لا تُملأ الفراغات بإجابات من المنصة.',
  tashkeel:
    'توجيهات ص٦٧ («أتعلّم»، «أتدرّب»، بيت المحاكاة بخط الرقعة) وتوجيه ص٦٨ رُوجعت حرفاً بحرف على القصّتين الإضافيتين image-11.png وimage-12.png، وكذلك الشطر الثاني للبيت السادس ص٦٢ على image-10.png. أما التشكيل الدقيق حرفاً بحرف في النصوص الطويلة غير المشمولة بهذه القصّات (فقرة ص٦٤، فقرة الإملاء ص٦٦، أبيات القصيدة ص٦٢ الأخرى، أسئلة ص٦٣) فما زال يحتاج قصّات عالية الدقة؛ النص المعروض قراءة ملتزمة بالحروف والتشكيل الظاهر، وقابل للتصحيح عند وصولها.',
} as const;
