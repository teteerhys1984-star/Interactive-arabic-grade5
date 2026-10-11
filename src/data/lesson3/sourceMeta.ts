import { SourceReference, SourceType } from '../../types/curriculum';

/**
 * Lesson 3 source metadata.
 * Authoritative input: docs/source-locks/lesson-03-lughati.md
 * Pages 25–35 were verified during Source Lock. No other Lesson 3 draft is a source.
 */
export const LESSON3_DOCUMENT_TITLE = 'اللغة العربية — الصف الخامس الأساسي (الكتاب المدرسي الرسمي)';

export function lesson3Src(
  pageNumber: number,
  sourceType: SourceType,
  sectionName?: string,
  itemNumber?: number | string,
  uncertaintyNote?: string,
  pageEndNumber?: number,
): SourceReference {
  return {
    documentTitle: LESSON3_DOCUMENT_TITLE,
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
 * No audio recording ships with the scanned pages. Unlike Lesson 2, the task
 * wording on page 25 («لكلِّ بيتٍ من أبيات النصِّ») textually binds the
 * listening tasks to the printed poem on page 26, so the printed poem is the
 * declared task input while the absence of audio stays visible.
 */
export const LISTENING_AUDIO_GAP =
  'التسجيل الصوتي غير متوفر في المصدر المتاح؛ صياغة المهمة «أبيات النص» تربطها بالقصيدة المطبوعة ص٢٦، لذلك تُنجز المهمة من القصيدة المطبوعة مع إعلان غياب التسجيل.';

/** Declared locked source uncertainties (see Source Lock §٥). */
export const LOCKED_SOURCE_NOTES = {
  introPronoun:
    'الضمير المتصل بعد «إنّ» في العبارة التمهيدية غير محسوم بصرياً؛ القراءة المعتمدة «إنَّهُ يَجمعُنا» ولا يُبنى عليها سؤال تقييمي.',
  comprehensionVerb9:
    'فعل التكليف في البند ٩ ص٢٧ غير محسوم بصرياً (يرجّح «أُنْظِمُ»)؛ يُقيَّم البند كصياغة مفتوحة لمعنى البيت الخامس.',
  grammarCompletion3:
    'صيغة الإكمال الثالث في البند ٣ ص٢٩ مطبوعة «………… التلميذُ يخطُّ الرقعةَ.» وتُعامل كإكمال مفتوح ينتج جملة فعلية سليمة.',
  waslTableHeader:
    'رأس جدول ص٣٢ يظهر بعمودي «فعلٌ» في الطرفين مع «نوعُهُ/اسمٌ/مصدرٌ»؛ يُقبل أي فرز سليم للكلمات المبدوءة بهمزة وصل وفق أنواعها.',
  handwritingRow3:
    'الصف الثالث من كلمات الملاحظة ص٣٣ غير محسوم بصرياً؛ لا تُختلق كلمات بديلة ويُبنى النشاط على العبارة الملونة والقاعدة والنماذج المرقمة.',
  syriaHeading:
    'الكلمة الأولى في عنوان التطبيق ص٣٤ غير محسومة (ريادة/زيادة)؛ يُعرض العنوان «ريادةُ سوريّة» ولا يُبنى عليه سؤال.',
} as const;
