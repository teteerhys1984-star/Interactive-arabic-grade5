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
 * How an unverified printed region affects the teaching material.
 *
 * - `answer_and_solution`: it can change the correct answer and/or the model
 *   solution → the affected record must stay OUT of the "complete" state.
 * - `solution_evidence`: the verdict stands on stable linguistic knowledge, but
 *   the printed evidence behind it is not in our hands yet.
 * - `question_wording`: only the transcribed wording of the question is at stake.
 * - `label_wording`: only a printed label/heading of a non-graded element.
 * - `vocalisation_only`: only diacritics of a non-graded element.
 */
export type ReviewLimitImpact =
  | 'answer_and_solution'
  | 'solution_evidence'
  | 'question_wording'
  | 'label_wording'
  | 'vocalisation_only';

export interface ReviewSourceUncertainty {
  id: string;
  page: number;
  recordId: string;
  region: string;
  issue: string;
  impact: ReviewLimitImpact;
  /** true when the correct answer / model solution cannot be settled without the crop. */
  affectsAnswer: boolean;
  /** true when the affected record must not be treated as fully verified yet. */
  blocking: boolean;
  /** Student elements whose answer depends on this region (or [] when none). */
  pendingSubpartIds: string[];
  whyItMatters: string;
  /** Precise, minimal crop request addressed to the project owner. */
  cropNeeded: string;
  /**
   * 'open' = the printed region is still unverified; 'resolved' = the owner's
   * crop settled it and the recorded reading below governs the answers.
   */
  status: 'open' | 'resolved';
  /** What the owner's crop settled (only when status === 'resolved'). */
  resolution?: string;
  /** Which supplied crop settled it, with the exact region inside that crop. */
  evidence?: string;
  /**
   * Short, answer-neutral wording for the Student Area (no reading, no answer).
   * Used in the declared-limits panel so that the learner knows the spot is
   * declared while nothing about the missing content is asserted.
   */
  studentLabel?: string;
}

export const REVIEW_SOURCE_UNCERTAINTIES: ReviewSourceUncertainty[] = [
  {
    id: 'LIM-01',
    status: 'open',
    page: 36,
    recordId: 'U1R-36-01',
    region: 'لافتتا الساعتين',
    issue: 'آخر كلمة في لافتة الساعة اليمنى مقطوعة في النسخة المتاحة «وقتُ البدا…»، ولا تُحسم (البدء؟ البداية؟)، بينما لافتة «وقتُ الانتهاء» واضحة.',
    impact: 'label_wording',
    affectsAnswer: false,
    blocking: false,
    pendingSubpartIds: [],
    whyItMatters: 'تسمية اللافتة المطبوعة فقط؛ ومهمة ضبط الوقت إجرائية غير مقوَّمة ولا تمسّ أي إجابة.',
    cropNeeded: 'قصّ مكبّر للافتتين مع الساعتين في أعلى ص٣٦ (منطقة العنوان قبل السؤال ١).',
  },
  {
    id: 'LIM-02',
    status: 'open',
    page: 36,
    recordId: 'U1R-36-02',
    region: 'صندوق تعليمات التقويم — البند ٤',
    issue: 'التشكيل الكامل لبعض كلمات البند الرابع غير محسوم في النسخة المتاحة (المعنى واضح تماماً).',
    impact: 'vocalisation_only',
    affectsAnswer: false,
    blocking: false,
    pendingSubpartIds: [],
    whyItMatters: 'تعليمة تنفيذية غير مقوَّمة؛ الشكل لا يؤثر في أي إجابة أو حل.',
    cropNeeded: 'قصّ مكبّر لصندوق التعليمات كاملاً (الشكل التام فقط).',
  },
  {
    id: 'LIM-03',
    status: 'open',
    page: 36,
    recordId: 'U1R-36-03',
    region: 'السؤال ١ — العبارة ١',
    issue: 'الكلمة قبل «السَّمَكَةِ الذَّهَبِيَّةِ» غير محسومة بصرياً: «مركَب» أم «مركز»؛ والقراءة المقفولة في الدرس الأول (ص٥) تسجّل «مَرْكَزِ السَّمَكَةِ الذَّهَبِيَّةِ».',
    impact: 'question_wording',
    affectsAnswer: false,
    blocking: false,
    pendingSubpartIds: [],
    whyItMatters: 'صياغة العبارة المطبوعة فقط؛ حكمها (قصّة خيالية) لا يتغيّر بأي من القراءتين، ولا تصويب مطلوباً عليها.',
    cropNeeded: 'قصّ مكبّر للعبارة ١ (ص٣٦) مع السطر الأخير من نصّ الدرس الأول (ص٥) للمقارنة.',
  },
  {
    id: 'LIM-04',
    status: 'resolved',
    studentLabel: 'السؤال ١ — عبارة فيها كلمة مطبوعة لم يُتحقق من رسمها في النسخة المتاحة',
    page: 36,
    recordId: 'U1R-36-03',
    region: 'السؤال ١ — العبارة ٣',
    issue:
      'كلمة «رَوَتْ» لم تُعثر بنصّها في النصوص المقفولة المتاحة (الوارد في الدرس الأول: «رَواها»)، ويحتمل رسمها قراءةً أخرى («رَأَتْ») بفارق نقطة/رسم في النسخة الممسوحة.',
    impact: 'answer_and_solution',
    affectsAnswer: true,
    blocking: false,
    pendingSubpartIds: [],
    resolution:
      'الكلمة المطبوعة في العبارة ٣ هي «رَوَتْ» (راء‑واو‑تاء)، وليست «رَأَتْ»؛ فعبارة «مَعْنى كَلِمَةِ «رَوَتْ» في النَّصِّ: قَصَّتْ» صحيحة، والحكم والتصويب محسومان بذلك.',
    evidence:
      'قصّة ص٣٦ التي أرسلها المالك (٢٠٢٦-١٠-١٢) وتشمل تعليمات التقويم والسؤال ١ بتمامه؛ ويظهر في السطر الثالث من السؤال ١ رسم الكلمة كاملًا بحرف الواو وسطها.',
    whyItMatters:
      'لو كانت المطبوعة «رَوَتْ» فمعناها «قصّت» والعبارة صحيحة؛ ولو كانت «رَأَتْ» فمعناها «أبصرت» والعبارة غير صحيحة والتصويب مختلف تماماً.',
    cropNeeded: 'قصّ مكبّر عالي الدقة لكلمة العبارة ٣ وحدها (ص٣٦) + الصفحة التي وردت فيها الكلمة في النصّ (لتحديد موضعها).',
  },
  {
    id: 'LIM-05',
    status: 'resolved',
    studentLabel: 'السؤال ٤ — تمييزُ الكلمات الملوّنة (لا يمكن التحقق من اللون في النسخة المتاحة)',
    page: 37,
    recordId: 'U1R-37-06',
    region: 'السؤال ٤ — الكلمات الملوّنة في الجمل الأربع',
    issue:
      'لا يمكن التحقق من تمييز الكلمات الملوّنة في النسخة المتاحة، فلا يُجزم بأي كلمة مقصودة في كل جملة. المطلوب الأصلي يبقى كما هو: تصنيف الكلمة الملوّنة (اسم/فعل/حرف)، ولا يُستبدل بمهمة أخرى.',
    impact: 'answer_and_solution',
    affectsAnswer: true,
    blocking: false,
    pendingSubpartIds: [],
    resolution:
      'الكلمات الملوّنة (باللون الأخضر) هي: «في» في الجملة ١ ← حرفٌ، و«الطِّفْلُ» في الجملة ٢ ← اسمٌ، و«زَرَعَ» في الجملة ٣ ← فعلٌ، و«الحِكْمَةُ» في الجملة ٤ ← اسمٌ.',
    evidence:
      'قصّة ص٣٧ التي أرسلها المالك (٢٠٢٦-١٠-١٢) للسؤال ٤ بجمله الأربع، واللون الأخضر ظاهر في الكلمة المقصودة من كل جملة.',
    whyItMatters: 'يحدد الكلمة المطلوب تصنيفها، ومن ثمّ الإجابة الصحيحة في البنود الأربعة كلها.',
    cropNeeded: 'قصّ مكبّر عالي الدقة (طبعة ملوّنة أو ٦٠٠ نقطة/بوصة على الأقل) للجمل الأربع في السؤال ٤، مع ظهور اللون في كل جملة.',
  },
  {
    id: 'LIM-06',
    status: 'open',
    page: 37,
    recordId: 'U1R-37-07',
    region: 'السؤال ٥ — لافتتا السبب والنتيجة',
    issue: 'تسميات اللافتات المطبوعة («السَّبَبُ (١)» و«نتيجته (١)» و«نتيجته (٢)») وألوانها غير محسومة بثقة؛ ونصّ السؤال يعلن سبباً واحداً ونتيجتين.',
    impact: 'label_wording',
    affectsAnswer: false,
    blocking: false,
    pendingSubpartIds: [],
    whyItMatters:
      'التسميات والألوان فقط؛ فالسبب والنتيجتان مستخرجان من نصّ العبارة المطبوعة الواضحة، وعدد الخانات محسوم بنصّ السؤال نفسه.',
    cropNeeded: 'قصّ مكبّر لمنطقة اللافتتين أسفل ص٣٧ (مع اللونين الأصفر والوردي).',
  },
  {
    id: 'LIM-07',
    status: 'resolved',
    studentLabel: 'السؤال ٦ — الكلمة المطبوعة في مركز المخطط',
    page: 38,
    recordId: 'U1R-38-08',
    region: 'السؤال ٦ — الكلمة المركزية في المخطط',
    issue: 'الكلمة المركزية تُقرأ «إعلان»، ويحتمل رسمها قراءةً أخرى («إعلام»)؛ والكلمتان تختلفان في الفعل والمعنى والضدّ.',
    impact: 'answer_and_solution',
    affectsAnswer: true,
    blocking: false,
    pendingSubpartIds: [],
    resolution:
      'الكلمة المطبوعة في مركز المخطط هي «إعلان» (إ‑ع‑ل‑ا‑ن: همزة قطع مكسورة، ثم لام، ثم ألف، ثم نون) وليست «إعلام»؛ فـ«فعلُها» = «أَعْلَنَ»، و«نوعُها» = اسمٌ (مصدرٌ)، و«معناها» = الإخبار والإظهار، و«ضدُّها» = الإخفاء والكِتمان.',
    evidence:
      'قصّة ص٣٨ التي أرسلها المالك (٢٠٢٦-١٠-١٢) وتُظهر المخطط كاملًا مع الكلمة في الدائرة المركزية.',
    whyItMatters:
      'يحدد فعل الكلمة ومعناها وضدّها في دوائر المخطط؛ أما «نوعها» فيبقى «اسماً» في القراءتين، فلا يتوقف على القراءة.',
    cropNeeded: 'قصّ مكبّر عالي الدقة للدائرة المركزية وحدها في مخطط ص٣٨ (الكلمة فقط، بلا الدوائر الفرعية).',
  },
  {
    id: 'LIM-08',
    status: 'open',
    page: 38,
    recordId: 'U1R-38-10',
    region: 'بند خاتمة الوحدة الثاني',
    issue: 'تشكيل «أُتْقِنُها» غير محسوم تماماً في النسخة المتاحة.',
    impact: 'vocalisation_only',
    affectsAnswer: false,
    blocking: false,
    pendingSubpartIds: [],
    whyItMatters: 'بند تقويم ذاتي غير مقوَّم، والشكل لا يؤثر في أي إجابة.',
    cropNeeded: 'قصّ مكبّر لسطر «المهارة التي…» أسفل ص٣٨.',
  },
];

/** Limits whose printed region is still unverified (declared, not blocking answers). */
export const OPEN_SOURCE_LIMIT_IDS: string[] = REVIEW_SOURCE_UNCERTAINTIES
  .filter((entry) => entry.status === 'open')
  .map((entry) => entry.id);

/** Limits settled by the owner's crops. */
export const RESOLVED_SOURCE_LIMIT_IDS: string[] = REVIEW_SOURCE_UNCERTAINTIES
  .filter((entry) => entry.status === 'resolved')
  .map((entry) => entry.id);

/** Source records that must not be treated as fully verified yet. */
export const PENDING_SOURCE_RECORD_IDS: string[] = [
  ...new Set(REVIEW_SOURCE_UNCERTAINTIES.filter((entry) => entry.blocking).map((entry) => entry.recordId)),
];

/** Student elements whose answer depends on a pending crop. */
export const PENDING_SOURCE_SUBPART_IDS: string[] = [
  ...new Set(REVIEW_SOURCE_UNCERTAINTIES.flatMap((entry) => entry.pendingSubpartIds)),
];

export function isSubpartPendingSourceVerification(subpartId: string): boolean {
  return PENDING_SOURCE_SUBPART_IDS.includes(subpartId);
}

/** Helper: the uncertainty that keeps one student element pending (if any). */
export function reviewUncertaintyForSubpart(subpartId: string): ReviewSourceUncertainty | undefined {
  return REVIEW_SOURCE_UNCERTAINTIES.find((entry) => entry.pendingSubpartIds.includes(subpartId));
}

/**
 * Student-facing wording for a declared limit: states the unverified printed
 * region and keeps the printed requirement — never guesses the missing content
 * and never reveals a model answer.
 */
export function studentSourceLimitNotice(subpartId: string): string | undefined {
  const limit = reviewUncertaintyForSubpart(subpartId);
  if (!limit) return undefined;
  return `لم يُتحقَّق بعدُ في النسخة المتاحة من المنصة من: ${limit.studentLabel ?? limit.region}؛ فلا تجزم المنصة بمحتواه. اعتمد النصّ المطبوع في كتابك، والمطلوب المطبوع يبقى كما هو، ويبقى هذا الموضع مسجّلًا «قيد التحقق المصدري» حتى وصول قصّ واضح.`;
}

/**
 * The declared limit of a record that is STILL open, if any. Settled limits are
 * never turned into an uncertainty note again.
 */
export function openIssueNote(recordId: string): string | undefined {
  return REVIEW_SOURCE_UNCERTAINTIES.find((entry) => entry.recordId === recordId && entry.status === 'open')?.issue;
}

/** Helper: the uncertainty notes for one source record. */
export function reviewUncertaintiesFor(recordId: string): ReviewSourceUncertainty[] {
  return REVIEW_SOURCE_UNCERTAINTIES.filter((entry) => entry.recordId === recordId);
}
