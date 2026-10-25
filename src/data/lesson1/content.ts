import { LessonStep } from '../../types/curriculum';
import { getSourceRecord } from './readingSource';
import { src } from './sourceMeta';

/**
 * Lesson 1 «السَّمَكَةُ الذَّهَبِيَّةُ» — step & block content.
 *
 * SOURCE FIDELITY: every printed string rendered here is pulled from the frozen
 * source layer (readingSource.ts) through `rs()` / `rsLines()` / `rsArr()`. No
 * textbook wording is retyped in this file, so the per-identifier verbatim test is
 * the only proof of fidelity needed.
 *
 * LAYERING: platform additions (scenes, summaries, notices, teacher notes) are
 * rendered as `explanation` blocks — visually separated from «النص الأصلي من الكتاب» —
 * and never replace or abbreviate a printed element.
 */

const rs = (id: string): string => {
  const record = getSourceRecord(id);
  if (!record) throw new Error(`Lesson 1: missing frozen source record ${id}`);
  return Array.isArray(record.text) ? record.text.join('\n') : record.text;
};

const rsArr = (id: string): string[] => {
  const record = getSourceRecord(id);
  if (!record) throw new Error(`Lesson 1: missing frozen source record ${id}`);
  return Array.isArray(record.text) ? record.text : [record.text];
};

const rsLines = (ids: string[]): string[] => ids.flatMap((id) => rsArr(id));

/** Split a printed rule into its own printed sentences/numbered items. */
const splitSentences = (text: string): string[] =>
  text.split(/(?<=\.)\s+/).map((line) => line.trim()).filter(Boolean);

const splitNumbered = (text: string): string[] =>
  text.split(/\s+(?=[١٢٣٤]\s)/).map((line) => line.trim()).filter(Boolean);

export interface VocabItem {
  term: string;
  meaning: string;
}

export type LessonBlock =
  | { kind: 'source_passage'; heading: string; paragraphs: string[]; source: ReturnType<typeof src> }
  | { kind: 'source_sentences'; heading: string; sentences: string[]; source: ReturnType<typeof src> }
  | { kind: 'vocab'; heading: string; items: VocabItem[]; source: ReturnType<typeof src> }
  | { kind: 'rule'; heading: string; lines: string[]; source: ReturnType<typeof src> }
  | { kind: 'instruction'; heading: string; text: string; source: ReturnType<typeof src> }
  | { kind: 'activity'; activityId: string }
  | { kind: 'explanation'; heading: string; lines: string[] };

export interface StepContent {
  stepId: string;
  blocks: LessonBlock[];
}

/* ------------------------------------------------------------------ */
/* Steps (derived from the actual textbook structure, pages 4–11)      */
/* ------------------------------------------------------------------ */

export const LESSON1_STEPS: LessonStep[] = [
  { id: 'l1-s1', stepNumber: 1, title: 'أستكشفُ الصُّورتَيْنِ', type: 'introduction', source: src(4, 'textbook_exercise', 'أَتَأَمَّلُ الصُّورَتَيْنِ', 1) },
  { id: 'l1-s2', stepNumber: 2, title: 'أَسْتَمِعُ وَأَتَحَدَّثُ', type: 'guided_exploration', source: src(4, 'textbook_reading', 'أَسْتَمِعُ إلى النَّصِّ', 1) },
  { id: 'l1-s3', stepNumber: 3, title: 'أَقْرَأُ النَّصَّ', type: 'reading_passage', source: src(5, 'textbook_reading', 'أَقْرَأُ') },
  { id: 'l1-s4', stepNumber: 4, title: 'الفَهْمُ القِرائِيُّ', type: 'interactive_practice', source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ') },
  { id: 'l1-s5', stepNumber: 5, title: 'أُتَواصَلُ شَفَوِيّاً', type: 'interactive_practice', source: src(7, 'textbook_expression', 'تَصْميمُ مُطَوِيَّةٍ') },
  { id: 'l1-s6', stepNumber: 6, title: 'قَواعِدُ اللُّغَةِ: الجُمْلَةُ', type: 'rule_formulation', source: src(8, 'textbook_grammar', 'الجُمْلَةُ') },
  { id: 'l1-s7', stepNumber: 7, title: 'إملاء: الهَمْزَةُ الأَوَّلِيَّةُ', type: 'rule_formulation', source: src(9, 'textbook_spelling', 'الهَمْزَةُ الأَوَّلِيَّةُ') },
  { id: 'l1-s8', stepNumber: 8, title: 'الخَطُّ: الحَرَكاتُ', type: 'interactive_practice', source: src(10, 'textbook_exercise', 'الخَطُّ') },
  { id: 'l1-s9', stepNumber: 9, title: 'أُعَبِّرُ كِتابِيّاً', type: 'interactive_practice', source: src(10, 'textbook_expression', 'اسْتِبْدالُ المُفْرَداتِ') },
  { id: 'l1-s10', stepNumber: 10, title: 'أَلْعَبُ وَأَتَعَلَّمُ', type: 'summary', source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ') },
];

/* ------------------------------------------------------------------ */
/* Verbatim source text (all derived from readingSource records)        */
/* ------------------------------------------------------------------ */

export const READING_TITLE = rs('L1-011');

/** المقطع الأوّل من النصّ المطبوع (L1-013 … L1-020). */
export const READING_SECTION_1 = rsLines(['L1-013', 'L1-014', 'L1-015', 'L1-016', 'L1-017', 'L1-018', 'L1-019', 'L1-020']);

/** المقطع الثاني من النصّ المطبوع (L1-022 … L1-029). */
export const READING_SECTION_2 = rsLines(['L1-022', 'L1-023', 'L1-024', 'L1-025', 'L1-026', 'L1-027', 'L1-028', 'L1-029']);

/** علامتا الفصل المطبوعتان بين المقطعين — محفوظتان كي لا يُفقد أي عنصر مطبوع. */
export const READING_SECTION_MARKS = rsLines(['L1-012', 'L1-021']);

export const READING_AUTHOR = rs('L1-030');

/** Vocabulary box exactly as printed on page 5 (single entry, L1-031). */
export const LESSON1_VOCAB: VocabItem[] = (() => {
  const [term, meaning] = rs('L1-031').split(':').map((part) => part.trim());
  return [{ term, meaning }];
})();

export const GRAMMAR_RULE_LINES = splitSentences(rs('L1-055'));

export const SPELLING_RULE_LINES = splitNumbered(rs('L1-066'));

/** مراحل تصميم المطويّة كما طُبعت (L1-048) بدون سطر العنوان. */
export const PAMPHLET_STAGES = rsArr('L1-048').slice(1);

/** جملة الخطّ المطبوعة (L1-074) بعد سطر التوجيه. */
export const CALLIGRAPHY_SENTENCE = rs('L1-074').split('الحركاتِ: ')[1] ?? rs('L1-074');

/** سطر الحركات والتنوين والتضعيف المعروض للمحاكاة (L1-072). */
export const CALLIGRAPHY_MARKS_LINE = rs('L1-072');

/** الفقرة المطبوعة في التعبير الكتابي (L1-077). */
export const EXPRESSION_PARAGRAPH = rsLines(['L1-077']);

/** صفوف لوحة الحروف↔الأشكال كما طُبعت (L1-079). */
export const DECODE_BOARD_ROWS: string[][] = (() => {
  const rows = [...rs('L1-079').matchAll(/ص[١٢٣]:\s*([^؛]+)/g)].map((match) => match[1]);
  return rows.map((row) => row.split(/\s+/).filter(Boolean).map((cell) => cell.replace(/[.\u06D4]+$/, '')));
})();

/**
 * DRAFT ONLY — the letter↔shape pairing inferred from the high-resolution crop.
 * It is NOT adopted: no check is enabled on the decode activity and this draft is
 * never presented to students as an answer (owner decision: keep pending).
 * Known open issues: the ك / ة trapezoid tint in row 3, and the row-1 separators.
 */
export const DECODE_SHAPE_DRAFT: { letter: string; shape: string }[] = [
  { letter: 'أ', shape: 'مُربَّع أزرق' },
  { letter: 'ب', shape: 'دائرة صفراء' },
  { letter: 'ج', shape: 'مُسدَّس وردي' },
  { letter: 'د', shape: 'نجمة خضراء' },
  { letter: 'هـ', shape: 'مثلث وردي' },
  { letter: 'و', shape: 'قلب بنفسجي' },
  { letter: 'ز', shape: 'مُعيَّن بنفسجي' },
  { letter: 'ح', shape: 'مستطيل أحمر' },
  { letter: 'ط', shape: 'قطع ناقدي وردي' },
  { letter: 'ي', shape: 'حرف V بنفسجي' },
  { letter: 'ك', shape: 'شبه منحرف بنفسجي (لونُه غير محسوم)' },
  { letter: 'ل', shape: 'هلال وردي' },
  { letter: 'م', shape: 'مربّع أحمر' },
  { letter: 'ن', shape: 'شكل X بنفسجي' },
  { letter: 'س', shape: 'نصف دائرة وردي' },
  { letter: 'ع', shape: 'حلقة وردية' },
  { letter: 'ف', shape: 'متوازي أضلاع أخضر' },
  { letter: 'ص', shape: 'مستطيل مخطط وردي' },
  { letter: 'ق', shape: 'سهم أصفر' },
  { letter: 'ر', shape: 'علامة قسمة زرقاء' },
  { letter: 'ش', shape: 'هلال أزرق' },
  { letter: 'ت', shape: 'زهرة صفراء' },
  { letter: 'ث', shape: 'نجمة وردية' },
  { letter: 'خ', shape: 'قارب أخضر' },
  { letter: 'ذ', shape: 'معيّن وردي' },
  { letter: 'ض', shape: 'سهم أرجواني' },
  { letter: 'غ', shape: 'مثلث بنفسجي' },
  { letter: 'ظ', shape: 'ثماني أحمر' },
  { letter: 'ئ', shape: 'شبه منحرف بنفسجي (مشترك مع ك — غير محسوم)' },
  { letter: 'ة', shape: 'شبه منحرف رمادي' },
];

/** Status flag for the decode key: draft, awaiting explicit owner approval. */
export const DECODE_KEY_STATUS = 'pending' as const;

/* ------------------------------------------------------------------ */
/* Step content map                                                    */
/* ------------------------------------------------------------------ */

export const LESSON1_STEP_CONTENT: Record<string, StepContent> = {
  'l1-s1': {
    stepId: 'l1-s1',
    blocks: [
      { kind: 'source_sentences', heading: 'عنوان الدرس ومحوره (كما طُبعا)', sentences: rsLines(['L1-001', 'L1-002']), source: src(4, 'textbook_reading', 'عُنْوانُ الدَّرْسِ') },
      { kind: 'instruction', heading: rs('L1-003'), text: rs('L1-003'), source: src(4, 'textbook_exercise', 'الصُّورتان', 1) },
      { kind: 'source_sentences', heading: 'الصُّورتان (وصفُهما المطبوع في سجلّ المصدر)', sentences: rsArr('L1-004'), source: src(4, 'textbook_exercise', 'الصُّورتان') },
      { kind: 'activity', activityId: 'a-p4-1' },
      { kind: 'activity', activityId: 'a-p4-2' },
    ],
  },
  'l1-s2': {
    stepId: 'l1-s2',
    blocks: [
      { kind: 'instruction', heading: rs('L1-007'), text: rs('L1-007'), source: src(4, 'textbook_reading', 'أَسْتَمِعُ', 1) },
      { kind: 'activity', activityId: 'a-p4-3' },
      { kind: 'activity', activityId: 'a-p4-4' },
      { kind: 'activity', activityId: 'a-p4-5' },
    ],
  },
  'l1-s3': {
    stepId: 'l1-s3',
    blocks: [
      { kind: 'instruction', heading: rs('L1-011'), text: rs('L1-011'), source: src(5, 'textbook_reading', 'أَقْرَأُ') },
      { kind: 'source_passage', heading: 'النص الأصلي من الكتاب — المقطع ١', paragraphs: READING_SECTION_1, source: src(5, 'textbook_reading', 'أَقْرَأُ ١') },
      { kind: 'source_passage', heading: 'النص الأصلي من الكتاب — المقطع ٢', paragraphs: READING_SECTION_2, source: src(5, 'textbook_reading', 'أَقْرَأُ ٢') },
      { kind: 'source_sentences', heading: 'علامتا الفصل بين المقطعين (مطبوعتان)', sentences: READING_SECTION_MARKS, source: src(5, 'textbook_reading', 'أَقْرَأُ') },
      { kind: 'explanation', heading: 'ملاحظة المصدر', lines: [`الكاتب كما طُبع: ${READING_AUTHOR}`] },
      { kind: 'explanation', heading: 'قراءة معتمدة بقرار صاحب المشروع', lines: [
        'السطر «الصّيّادُ: كيف أيُّها البحرُ؟! ... جدّي رَوَتْ لي حين كنتُ صغيرًا...» (L1-016) معروض كما قُرئ من الكتاب المطبوع بحرف الرواء في «رَوَتْ».',
        'الوجهان الآخران («رَواها» و«روَتْ») محفوظان في سجلّ الإشكالات دون اعتماد أحدهما، ولا يُعرضان للطالب كإجابة.',
      ] },
      { kind: 'vocab', heading: 'معجم الكلمات', items: LESSON1_VOCAB, source: src(5, 'textbook_reading', 'معجم الكلمات') },
      { kind: 'activity', activityId: 'a-p5-1' },
      { kind: 'activity', activityId: 'a-p5-2' },
      { kind: 'activity', activityId: 'a-p5-3' },
    ],
  },
  'l1-s4': {
    stepId: 'l1-s4',
    blocks: [
      { kind: 'instruction', heading: rs('L1-035'), text: rs('L1-035'), source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ') },
      { kind: 'explanation', heading: 'بندٌ معلّق (غير محلول)', lines: [
        'معنى «قَصَّتْ» في النشاط ١ معلّقٌ بانتظار اعتمادٍ صريح أو وصول نصّ الاستماع؛ القراءة «قَصَّتْ» نفسها معتمدة بقرار صاحب المشروع.',
        'لا تُعرض إجابة لهذا الفراغ ولا يُحتسب ضمن المحلول.',
      ] },
      { kind: 'activity', activityId: 'a-p6-1' },
      { kind: 'activity', activityId: 'a-p6-2' },
      { kind: 'activity', activityId: 'a-p6-3' },
      { kind: 'activity', activityId: 'a-p6-4' },
      { kind: 'activity', activityId: 'a-p6-5' },
      { kind: 'activity', activityId: 'a-p6-6' },
      { kind: 'activity', activityId: 'a-p6-7' },
      { kind: 'activity', activityId: 'a-p6-8' },
    ],
  },
  'l1-s5': {
    stepId: 'l1-s5',
    blocks: [
      { kind: 'instruction', heading: rs('L1-044'), text: rs('L1-046'), source: src(7, 'textbook_expression', 'مُطَوِيَّة') },
      { kind: 'source_sentences', heading: 'الصورة المطبوعة (وصفُها في سجلّ المصدر)', sentences: rsArr('L1-045'), source: src(7, 'textbook_expression', 'الصُّورة') },
      { kind: 'source_sentences', heading: 'الجدول المطبوع', sentences: rsArr('L1-047'), source: src(7, 'textbook_expression', 'الجَدْوَل') },
      { kind: 'source_sentences', heading: rsArr('L1-048')[0], sentences: PAMPHLET_STAGES, source: src(7, 'textbook_expression', 'أَتَعَلَّمُ') },
      { kind: 'activity', activityId: 'a-p7-1' },
      { kind: 'activity', activityId: 'a-p7-2' },
    ],
  },
  'l1-s6': {
    stepId: 'l1-s6',
    blocks: [
      { kind: 'instruction', heading: rs('L1-050'), text: rs('L1-050'), source: src(7, 'textbook_grammar', 'الجُمْلَةُ') },
      { kind: 'source_sentences', heading: 'الأَمْثِلَةُ', sentences: rsArr('L1-051'), source: src(8, 'textbook_grammar', 'الأَمْثِلَةُ') },
      { kind: 'activity', activityId: 'a-p8-1' },
      { kind: 'activity', activityId: 'a-p8-2' },
      { kind: 'activity', activityId: 'a-p8-3' },
      { kind: 'rule', heading: 'القاعِدَةُ', lines: GRAMMAR_RULE_LINES, source: src(8, 'textbook_grammar', 'القاعِدَةُ') },
      { kind: 'activity', activityId: 'a-p8-4' },
      { kind: 'explanation', heading: 'تصحيحٌ معتمد بقرار صاحب المشروع', lines: [
        'في التقويم النهائي ١ (L1-057) تُعرض الكلمة «يقضون» تصحيحًا معتمدًا، ويُعرض معها دائمًا النصّ المطبوع «يقبضون» والفرق بينهما.',
        'سبب التصحيح: سياق الجملة «ويقضون على شاطئه أجملَ الأوقات»؛ والمطبوع محفوظ في سجلّ المصدر بلا حذف.',
      ] },
      { kind: 'activity', activityId: 'a-p8-5' },
      { kind: 'activity', activityId: 'a-p8-6' },
      { kind: 'activity', activityId: 'a-p8-7' },
    ],
  },
  'l1-s7': {
    stepId: 'l1-s7',
    blocks: [
      { kind: 'instruction', heading: rs('L1-060'), text: rs('L1-060'), source: src(9, 'textbook_spelling', 'الهَمْزَةُ الأَوَّلِيَّةُ') },
      { kind: 'source_sentences', heading: 'المِثالانِ', sentences: rsLines(['L1-061', 'L1-062']), source: src(9, 'textbook_spelling', 'المِثالانِ') },
      { kind: 'explanation', heading: 'قراءات معتمدة بقرار صاحب المشروع', lines: [
        'المثال الثاني (L1-062) مكتوب «يا صديقي البحر: بكرمٍ وامْنَحْني سمكةً ذهبيّةً» كما قُرئ من الكتاب المطبوع.',
        'رأس العمود الثالث في التقويم النهائي (L1-068) هو «السَّببُ»، ويُعرض الجدول بأعمدته الأربعة كاملة.',
      ] },
      { kind: 'activity', activityId: 'a-p9-1' },
      { kind: 'activity', activityId: 'a-p9-2' },
      { kind: 'activity', activityId: 'a-p9-3' },
      { kind: 'rule', heading: 'القاعِدَةُ', lines: SPELLING_RULE_LINES, source: src(9, 'textbook_spelling', 'القاعِدَةُ') },
      { kind: 'activity', activityId: 'a-p9-4' },
      { kind: 'activity', activityId: 'a-p9-5' },
      { kind: 'activity', activityId: 'a-p9-6' },
    ],
  },
  'l1-s8': {
    stepId: 'l1-s8',
    blocks: [
      { kind: 'instruction', heading: rs('L1-070'), text: rs('L1-071'), source: src(10, 'textbook_exercise', 'الخَطُّ') },
      { kind: 'source_sentences', heading: 'سطرُ الحركاتِ والتنوينِ والتضعيف (للمحاكاة)', sentences: [CALLIGRAPHY_MARKS_LINE], source: src(10, 'textbook_exercise', 'الخَطُّ') },
      { kind: 'activity', activityId: 'a-p10-1' },
      { kind: 'activity', activityId: 'a-p10-2' },
    ],
  },
  'l1-s9': {
    stepId: 'l1-s9',
    blocks: [
      { kind: 'instruction', heading: rs('L1-075'), text: rs('L1-076'), source: src(10, 'textbook_expression', 'اسْتِبْدالُ المُفْرَداتِ') },
      { kind: 'source_passage', heading: 'النص الأصلي من الكتاب', paragraphs: EXPRESSION_PARAGRAPH, source: src(10, 'textbook_expression', 'الفَقْرَةُ') },
      { kind: 'activity', activityId: 'a-p10-3' },
    ],
  },
  'l1-s10': {
    stepId: 'l1-s10',
    blocks: [
      { kind: 'instruction', heading: rs('L1-078'), text: rs('L1-078'), source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ') },
      { kind: 'source_sentences', heading: 'لوحةُ الحروف ورموزها (مطبوعة)', sentences: rsArr('L1-079'), source: src(11, 'activity_book', 'اللَّوْحَة') },
      { kind: 'explanation', heading: 'بندٌ معلّق (غير محلول)', lines: [
        'مطابقة الرموز للحروف في النشاط ١ مسودةٌ بانتظار اعتمادٍ صريح من صاحب المشروع.',
        'زرّ «تحقّق من إجاباتي» معطّل في هذا النشاط، والمفتاح المقترح لا يُعرض ولا يُحتسب ضمن المحلول.',
        'مسألتان مفتوحتان لا يُفصل فيهما بالاجتهاد اللغوي: لون شبه المنحرف في الصف الثالث (ك أم ة)، ومواضع الفواصل بين كلمات الصف الأول.',
      ] },
      { kind: 'activity', activityId: 'a-p11-1' },
      { kind: 'activity', activityId: 'a-p11-2' },
      { kind: 'activity', activityId: 'a-p11-3' },
      { kind: 'activity', activityId: 'a-p11-4' },
      { kind: 'activity', activityId: 'a-p11-5' },
    ],
  },
};
