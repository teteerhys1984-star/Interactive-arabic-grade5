import { SourceReference, SourceType } from '../../types/curriculum';

/**
 * Unit 2, Lesson 2 («الذَّكاءُ الاصطِناعيّ») source metadata.
 * Authoritative input: docs/source-locks/unit2-lesson-02-aldhaka-al-istinaai.md
 * Pages 50–60 were verified directly from the eleven supplied scans
 * (image-1.png = ص٥٠ … image-11.png = ص٦٠). Unit 2's title/theme page was
 * not supplied for Lesson 1 either, so the unit stays «الوحدة الثانية» without
 * an invented theme, and it stays incomplete (no owner declaration, no unit test).
 */
export const U2L2_DOCUMENT_TITLE = 'اللغة العربية — الصف الخامس الأساسي (الكتاب المدرسي الرسمي)';

export function u2l2Src(
  pageNumber: number,
  sourceType: SourceType,
  sectionName?: string,
  itemNumber?: number | string,
  uncertaintyNote?: string,
  pageEndNumber?: number,
): SourceReference {
  return {
    documentTitle: U2L2_DOCUMENT_TITLE,
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
 * Page 50 asks the learner to listen to a spoken text, but the supplied scans
 * carry no audio. The only declared input is the printed reading text on page
 * 51 (read aloud by the teacher/learner). The gap stays visible instead of
 * being replaced by invented audio or a substitute listening passage.
 */
export const U2L2_LISTENING_AUDIO_GAP =
  'التسجيل الصوتي غير متوفر في المصدر المتاح؛ المدخل المعلن هو نص القراءة المطبوع ص٥١ يقرؤه المعلم أو المتعلم بصوت عالٍ، ثم تُنجز مهمتا الاستماع منه مع إعلان غياب التسجيل.';

/** Declared locked source limits (see Source Lock §٥). */
export const U2L2_LOCKED_SOURCE_NOTES = {
  listeningAudio: U2L2_LISTENING_AUDIO_GAP,
  mindMap:
    'مخطط الأفكار ص٥٢ دوائر فارغة بلا كلمات مرجعية مطبوعة؛ الإجابات استنباطية من النص ولا يُقيَّم كل فراغ بإجابة وحيدة مغلقة، ويُقبل أي تفريع منضبط تحت الفكرتين المعطاتين (الإنسان والحاسِب).',
  calligraphyShapes:
    'أشكال حرف الدال بخط الرقعة ص٥٨ رسوم خطية مرقمة لا يستطيع خط الحاسوب محاكاتها بأمانة؛ يُنفذ الرسم والتجريد على ورقة مسطرة بقلم المتعلم، ولا تُستبدل الأشكال المرسومة بحروف مطبعية.',
  drawingTasks:
    'مهمتا الرسم ص٥٣ (صور ملائمة لعبارات النصائح) أداء رسمي يدوي لا تُحاكَم عليه الكتابة الرقمية؛ يُحتفَظ بالشق الكتابي الموثق ويُعلَن أن الرسم يُنجز على الورق.',
} as const;
