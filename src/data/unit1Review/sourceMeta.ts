import { SourceReference, SourceType } from '../../types/curriculum';

/**
 * «تقويم الوحدة الأولى» — source metadata.
 *
 * Authoritative input: the three printed pages of the official textbook that
 * carry the «تقويم الوحدة» badge (pages 36–38), audited in
 * docs/source-audits/unit-1-review-pages-36-38.md.
 *
 * This section is an assessment extension of Unit 1 that comes AFTER its three
 * locked lessons. It is NOT a fourth lesson and NOT a new unit.
 */
export const UNIT1_REVIEW_DOCUMENT_TITLE = 'اللغة العربية — الصف الخامس الأساسي (الكتاب المدرسي الرسمي)';

export const UNIT1_REVIEW_TITLE = 'تقويم الوحدة الأولى';
export const UNIT1_REVIEW_ID = 'unit1-review';
export const UNIT1_REVIEW_ENGLISH_LABEL = 'Unit 1 Review';
export const UNIT1_REVIEW_UNIT_ID = 'unit1';

export function reviewSrc(
  pageNumber: number,
  sourceType: SourceType,
  sectionName?: string,
  itemNumber?: number | string,
  uncertaintyNote?: string,
  pageEndNumber?: number,
): SourceReference {
  return {
    documentTitle: UNIT1_REVIEW_DOCUMENT_TITLE,
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
 * Declared source limits for this section.
 *
 * Every entry below is a region that could NOT be read with full confidence in
 * the available scan. The affected content is presented as a declared limit and
 * is neither invented nor silently normalized. Each limit lists the clearer crop
 * that is requested from the project owner.
 */
export interface ReviewSourceUncertainty {
  page: number;
  recordId: string;
  region: string;
  issue: string;
  whyItMatters: string;
  cropNeeded: string;
}

export const REVIEW_SOURCE_UNCERTAINTIES: ReviewSourceUncertainty[] = [
  {
    page: 36,
    recordId: 'U1R-36-01',
    region: 'لافتتا الساعتين',
    issue: 'آخر كلمة في لافتة الساعة اليمنى مقطوعة في النسخة المتاحة «وقتُ البدا…»، ولا تُحسم (البدء؟)، بينما لافتة «وقتُ الانتهاء» واضحة.',
    whyItMatters: 'يحدد التسمية المطبوعة لحقل زمن البداية في مهمة ضبط الوقت.',
    cropNeeded: 'قصّ مكبّر للافتتين مع الساعتين في أعلى الصفحة',
  },
  {
    page: 36,
    recordId: 'U1R-36-02',
    region: 'صندوق تعليمات التقويم — البند ٤',
    issue: 'التشكيل الكامل لبعض كلمات البند الرابع غير محسوم في النسخة المتاحة (المعنى واضح).',
    whyItMatters: 'لا يمسّ صحة أي إجابة؛ يمسّ ضبط الشكل فقط.',
    cropNeeded: 'قصّ مكبّر لصندوق التعليمات كاملاً',
  },
  {
    page: 36,
    recordId: 'U1R-36-03',
    region: 'السؤال ١ — العبارة ١',
    issue: 'الكلمة قبل «السَّمَكَةِ الذَّهَبِيَّةِ» غير محسومة بصرياً: «مركَب» أم «مركز»؛ والقراءة المقفولة في الدرس الأول تسجّل تسمية المركب «مركز السمكة الذهبية».',
    whyItMatters: 'يحدد تسمية فقط، ولا يغيّر حكم العبارة (خيالية) ولا تصويبها.',
    cropNeeded: 'قصّ مكبّر للعبارة الأولى',
  },
  {
    page: 36,
    recordId: 'U1R-36-03',
    region: 'السؤال ١ — العبارة ٣',
    issue: 'كلمة «رَوَتْ» لم تُعثر بنصّها في النصوص المقفولة المتاحة للدروس الثلاثة (الوارد في الدرس الأول «رَواها»).',
    whyItMatters: 'تقييم العبارة يعتمد على دلالة الفعل المعجمية المستقرة (روى = حكى وقصّ)، ويُسجَّل الموضع الأصلي بوصفه حدّاً مصدرياً.',
    cropNeeded: 'قصّ مكبّر للعبارة الثالثة مع نصّ الدرس الذي وردت فيه الكلمة',
  },
  {
    page: 37,
    recordId: 'U1R-37-06',
    region: 'السؤال ٤ — الكلمات الملوّنة',
    issue: 'لا يمكن التحقق من تمييز الكلمات الملوّنة في الجمل الأربع بثقة في النسخة المتاحة، فلا يُجزم بأي كلمة مقصودة.',
    whyItMatters: 'يحدد الكلمة المطلوب تصنيفها (اسم/فعل/حرف) في كل جملة.',
    cropNeeded: 'قصّ مكبّر عالي الدقة للجمل الأربع لأجل تحديد اللون في كل جملة',
  },
  {
    page: 37,
    recordId: 'U1R-37-07',
    region: 'السؤال ٥ — لافتات السبب والنتيجة',
    issue: 'تسميات اللافتات المطبوعة («السَّبَبُ (١)» و«نتيجته (١)» و«نتيجته (٢)») وألوانها غير محسومة بثقة؛ ونصّ السؤال يعلن سبباً واحداً ونتيجتين.',
    whyItMatters: 'يحدد عدد خانات الإجابة وتسميتها؛ اعتُمدت خانة للسبب وخانتان للنتيجتين وفق نصّ السؤال.',
    cropNeeded: 'قصّ مكبّر لمنطقة اللافتتين في أسفل الصفحة',
  },
  {
    page: 38,
    recordId: 'U1R-38-08',
    region: 'السؤال ٦ — الكلمة المركزية في المخطط',
    issue: 'الكلمة المركزية تُقرأ «إعلان»، ويحتمل رسمها قراءةً أخرى («إعلام»).',
    whyItMatters: 'يحدد فعل الكلمة ونوعها ومعناها وضدّها في فروع المخطط الأربعة.',
    cropNeeded: 'قصّ مكبّر للدائرة المركزية',
  },
  {
    page: 38,
    recordId: 'U1R-38-10',
    region: 'بند خاتمة الوحدة الثاني',
    issue: 'تشكيل «أُتْقِنُها» غير محسوم تماماً في النسخة المتاحة.',
    whyItMatters: 'لا يمسّ المعنى؛ يمسّ ضبط الشكل فقط.',
    cropNeeded: 'قصّ مكبّر لسطر «المهارة التي…»',
  },
];

/** Helper: the uncertainty notes for one source record. */
export function reviewUncertaintiesFor(recordId: string): ReviewSourceUncertainty[] {
  return REVIEW_SOURCE_UNCERTAINTIES.filter((entry) => entry.recordId === recordId);
}
