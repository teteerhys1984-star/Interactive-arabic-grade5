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

/**
 * Items that are IMPLEMENTED in the UI but NOT solved: they wait for an explicit
 * owner decision (or for missing source material such as the listening audio).
 * They are never counted as solved and never display an invented answer.
 */
export interface SourcePendingDecision {
  id: string;
  recordId: string;
  page: number;
  region: string;
  whatIsPending: string;
  uiBehaviour: string;
}

export const SOURCE_PENDING_DECISIONS: SourcePendingDecision[] = [
  {
    id: 'lpd-01',
    recordId: 'L1-036',
    page: 6,
    region: 'الفهم القرائي ١ — الفراغ الثاني',
    whatIsPending: 'معنى «قَصَّتْ»: الكلمة لا ترد في النصّ المطبوع المتاح، وسياقها في نصّ الاستماع غير المتوفّر',
    uiBehaviour: 'الفراغ قابل للكتابة لكنّه معلّم كمعلّق؛ لا مفتاح قبول ولا تصحيح ولا عرض إجابة',
  },
  {
    id: 'lpd-02',
    recordId: 'L1-080',
    page: 11,
    region: 'ألعب وأتعلّم ١ — صفّا الرموز',
    whatIsPending: 'مطابقة الرموز بالحروف والجملتان الناتجتان (المسودة: «الصدق منجاة» / «أحب بلادي»)',
    uiBehaviour: 'زرّ «تحقّق من إجاباتي» معطّل، والمسودة لا تُعرض للطالب ولا تُحتسب',
  },
];

/**
 * Readings adopted by explicit owner decision. Each entry keeps the exact adopted
 * wording plus the layer it belongs to, so the UI can badge it without inventing
 * a rule or presenting an unadopted alternative as settled.
 */
export interface AdoptedReading {
  id: string;
  recordId: string;
  page: number;
  adopted: string;
  decision: string;
  alternativeFacesLogged?: string;
}

export const APPROVED_READINGS: AdoptedReading[] = [
  {
    id: 'apr-01',
    recordId: 'L1-016',
    page: 5,
    adopted: 'رَوَتْ («جدّي رَوَتْ لي حين كنتُ صغيرًا»)',
    decision: 'تُحفظ كما قُرئت من الكتاب المطبوع بحرف الرواء، وتُعرض بشارة «قراءة معتمدة بقرار المالك» فقط.',
    alternativeFacesLogged: 'الوجهان «رَواها» و«روَتْ» مسجّلان في سجلّ الإشكالات (iri-01) بلا اعتماد.',
  },
  {
    id: 'apr-02',
    recordId: 'L1-036',
    page: 6,
    adopted: 'قَصَّتْ',
    decision: 'القراءة معتمدة؛ أمّا المعنى فمعلّق (lpd-01) ولا يُخترع له مفتاح.',
  },
  {
    id: 'apr-03',
    recordId: 'L1-062',
    page: 9,
    adopted: 'وامْنَحْني',
    decision: 'مثال همزة الوصل يُعرض كما قرأه المالك من الكتاب المطبوع.',
  },
  {
    id: 'apr-04',
    recordId: 'L1-068',
    page: 9,
    adopted: 'السَّببُ (رأس العمود الثالث)',
    decision: 'الجدول يُعرض بأعمدته الأربعة: همزةُ القطع | موقعُها بالنسبةِ إلى الألف | السَّببُ | همزةُ الوصل.',
  },
];

/**
 * Documented corrections. The printed wording is ALWAYS retained and displayed next
 * to the correction; nothing is silently overwritten.
 */
export interface DocumentedCorrection {
  id: string;
  recordId: string;
  page: number;
  printed: string;
  corrected: string;
  reason: string;
}

export const DOCUMENTED_CORRECTIONS: DocumentedCorrection[] = [
  {
    id: 'dcr-01',
    recordId: 'L1-057',
    page: 8,
    printed: 'ويقبضون على شاطئه أجملَ الأوقات',
    corrected: 'ويقضون على شاطئه أجملَ الأوقات',
    reason: 'السياق «يقضون الأوقات»؛ والمطبوع «يقبضون» محفوظ في سجلّ المصدر ويُعرض الفرق في الواجهة.',
  },
];
