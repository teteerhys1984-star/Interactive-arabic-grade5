import { SourceReference } from '../../types/curriculum';
import { getSourceRecord } from './readingSource';
import { src } from './sourceMeta';

/**
 * Complete textbook activity / question inventory for Lesson 1 (pages 4–11).
 *
 * SOURCE FIDELITY: every `instruction` is derived from the frozen source layer
 * (readingSource.ts) through `instr()` — no activity text is retyped here, so the
 * per-identifier match test is the single proof of fidelity.
 *
 * STATUS MODEL (owner-approved):
 *  - 'solved'          : an approved key exists; it may be revealed after the first check.
 *  - 'partial_pending' : some fields solved, at least one field pending an explicit
 *                        owner decision (pending fields carry `pending: true`, have NO
 *                        acceptedAnswers and are never counted or auto-corrected).
 *  - 'pending'         : implemented in the UI but with no approved key; the check
 *                        button is disabled and no invented answer is ever displayed.
 *
 * INTERACTION CYCLE: attempt → «تحقّق من إجاباتي» → per-field result + explanation +
 * why-wrong → edit & retry. The full model answer unlocks only after the first check.
 */

/** Verbatim instruction text of a source record (arrays are joined with newlines). */
const instr = (id: string): string => {
  const record = getSourceRecord(id);
  if (!record) throw new Error(`Lesson 1: missing frozen source record ${id}`);
  return Array.isArray(record.text) ? record.text.join('\n') : record.text;
};

/** Printed variant retained for a documented correction (always shown in the UI). */
const variant = (id: string): string | undefined => {
  const stored = getSourceRecord(id)?.printedVariant;
  return Array.isArray(stored) ? stored.join('\n') : stored;
};

export type ActivityInteraction =
  | { kind: 'text_inputs'; fields: { id: string; label: string; acceptedAnswers?: string[]; pending?: boolean }[] }
  | { kind: 'choose'; choices: { id: string; text: string }[]; correctId: string }
  | { kind: 'multi'; choices: { id: string; text: string }[]; correctIds: string[] }
  | { kind: 'classify'; categories: { id: string; label: string }[]; items: { id: string; text: string; correctCategoryId: string }[] }
  | {
      kind: 'table_fill';
      columns: string[];
      rows: { cells: ({ given: string } | { fieldId: string; acceptedAnswers?: string[]; pending?: boolean })[] }[];
    }
  | {
      kind: 'diagram_fill';
      boxes: {
        id: string;
        text?: string;
        fieldId?: string;
        tone?: 'given' | 'blank';
        /**
         * Accepted answers for a blank box. Added ONLY where the printed source
         * states the event explicitly (see the comment on each use). A blank with
         * no source-backed key must carry `pending: true` instead, so it is never
         * graded as correct.
         */
        acceptedAnswers?: string[];
        pending?: boolean;
      }[];
      arrows: [string, string][];
    }
  | { kind: 'write' }
  | { kind: 'speak' }
  | { kind: 'decode'; checkDisabled?: boolean };

export type ActivityStatus = 'solved' | 'partial_pending' | 'pending';

export interface TextbookActivity {
  id: string;
  page: number;
  section: string;
  printedNumber: string;
  instruction: string;
  /** Identifier(s) of the frozen source record(s) this activity is built from. */
  sourceRecordIds: string[];
  interaction: ActivityInteraction;
  solution: { answer: string; explanation: string };
  status: ActivityStatus;
  /** Shown to student and teacher whenever something is not settled yet. */
  pendingNote?: string;
  /** Shown next to a documented correction (printed variant always displayed too). */
  correctionNote?: string;
  printedVariant?: string;
  uncertain?: string;
  source: SourceReference;
}

export const TEXTBOOK_ACTIVITIES: TextbookActivity[] = [
  /* ---------------- page 4 ---------------- */
  {
    id: 'a-p4-1', page: 4, section: 'أستكشف الصورتين', printedNumber: '١', status: 'solved',
    instruction: instr('L1-005'), sourceRecordIds: ['L1-003', 'L1-004', 'L1-005'],
    interaction: { kind: 'text_inputs', fields: [
      { id: 'img1', label: 'وصف الصورة الأولى (الصّيد)' },
      { id: 'img2', label: 'وصف الصورة الثانية (صنع المركب)' },
    ]},
    solution: { answer: 'الأولى: ثلاثةُ صيادين في مركبٍ يسحبون شبكةً ممتلئةً بالسمك. الثانية: صيادون على الشاطئ يصنعون مركبًا (ألواحُ خشبٍ ومطرقةٌ وحبل).', explanation: 'وصف نموذجي مطابق لمحتوى الصورتين كما وردا في سجلّ المصدر (L1-004)، ويُظهر ملاحظة العمل والتعاون.' },
    source: src(4, 'textbook_exercise', 'الصُّورتان', 1),
  },
  {
    id: 'a-p4-2', page: 4, section: 'أستكشف الصورتين', printedNumber: '٢', status: 'solved',
    instruction: instr('L1-006'), sourceRecordIds: ['L1-006'],
    interaction: { kind: 'speak' },
    solution: { answer: 'المشترك: العمل والتعاون بين الصيادين لتحقيق هدفٍ مشترك.', explanation: 'كلتا الصورتين تجسّدان العمل الجماعي: سحب الشبكة وصنع المركب.' },
    source: src(4, 'textbook_exercise', 'الصُّورتان', 2),
  },
  {
    id: 'a-p4-3', page: 4, section: 'أستمع وأتحدث', printedNumber: '١', status: 'solved',
    instruction: instr('L1-008'), sourceRecordIds: ['L1-007', 'L1-008'],
    interaction: { kind: 'text_inputs', fields: [
      { id: 'char', label: 'الشخصيّةُ الرّئيسةُ في القصّة', acceptedAnswers: ['الصياد', 'الصيّاد', 'الصيّاد الفقير'] },
      { id: 'place', label: 'المكانُ الذي تدورُ فيه أحداثُ القصّة', acceptedAnswers: ['البحر', 'شاطئ البحر', 'الشاطئ'] },
    ]},
    solution: { answer: 'الشخصيّة الرّئيسة: الصيّاد. المكان: شاطئ البحر.', explanation: 'الأحداث تدور حول الصيّاد على الشاطئ أمام البحر (L1-013).' },
    source: src(4, 'textbook_reading', 'أَسْتَمِعُ', 1),
  },
  {
    id: 'a-p4-4', page: 4, section: 'أستمع وأتحدث', printedNumber: '٢', status: 'solved',
    instruction: instr('L1-009'), sourceRecordIds: ['L1-009'],
    interaction: { kind: 'speak' },
    solution: { answer: 'أمنيّته: اصطياد سمكةٍ ذهبيّةٍ ليشتري بثمنها زورقًا للصّيد.', explanation: 'الأمنيّة واردة حرفيًّا في مطلع النص (L1-013).' },
    source: src(4, 'textbook_reading', 'أَسْتَمِعُ', 2),
  },
  {
    id: 'a-p4-5', page: 4, section: 'أستمع وأتحدث', printedNumber: '٣', status: 'solved',
    instruction: instr('L1-010'), sourceRecordIds: ['L1-010'],
    interaction: { kind: 'speak' },
    solution: { answer: 'مثال: حلم الصيّاد بسمكةٍ ذهبيّة، فنصحه البحر بالتعاون، فبنى مع زملائه مركبًا وتحقّق حلمه.', explanation: 'تلخيص بأقلّ عددٍ من الجمل يُظهر فهم تسلسل الأحداث.' },
    source: src(4, 'textbook_reading', 'أَسْتَمِعُ', 3),
  },

  /* ---------------- page 5 ---------------- */
  {
    id: 'a-p5-1', page: 5, section: 'أقرأ', printedNumber: '١', status: 'solved',
    instruction: instr('L1-032'), sourceRecordIds: ['L1-032'],
    interaction: { kind: 'speak' },
    solution: { answer: 'قراءةٌ معبّرة تُبرز النداء في «يا صديقي، امنحني» والاستفهام في «كيف أيُّها البحرُ؟!».', explanation: 'النداء والاستفهام واردان في المقطع الأوّل (L1-014، L1-016)؛ مراعاتهما تحقق التلوين الصوتي.' },
    source: src(5, 'textbook_reading', 'أَقْرَأُ', 1),
  },
  {
    id: 'a-p5-2', page: 5, section: 'أقرأ', printedNumber: '٢', status: 'solved',
    instruction: instr('L1-033'), sourceRecordIds: ['L1-033'],
    interaction: { kind: 'speak' },
    solution: { answer: 'قراءةٌ تُبرز التعجّب في «يا لها من فكرةٍ ...!» ومشاعر الفرح في ختام النص.', explanation: 'التعجّب وارد في L1-025 والفرح في L1-028/L1-029.' },
    source: src(5, 'textbook_reading', 'أَقْرَأُ', 2),
  },
  {
    id: 'a-p5-3', page: 5, section: 'أقرأ', printedNumber: '٣', status: 'solved',
    instruction: instr('L1-034'), sourceRecordIds: ['L1-034'],
    interaction: { kind: 'speak' },
    solution: { answer: 'قراءةٌ جهريّة سليمة النطق مع تلوينٍ صوتيٍّ مناسب للمعنى.', explanation: 'تدريب على الطلاقة والتعبير الصوتي.' },
    source: src(5, 'textbook_reading', 'أَقْرَأُ', 3),
  },

  /* ---------------- page 6 ---------------- */
  {
    id: 'a-p6-1', page: 6, section: 'الفهم القرائي', printedNumber: '١', status: 'partial_pending',
    pendingNote: 'معنى «قَصَّتْ» معلّق بانتظار اعتمادٍ صريح أو وصول نصّ الاستماع؛ لا تُعرض له إجابة ولا يُحتسب.',
    instruction: instr('L1-036'), sourceRecordIds: ['L1-035', 'L1-036'],
    interaction: { kind: 'text_inputs', fields: [
      { id: 'plural', label: 'جمع(الشَّبَكَة)', acceptedAnswers: ['الشباك', 'الشِّباك', 'الشَّبَكات', 'الشبكات', 'الشَّبَكَة'] },
      { id: 'meaning', label: 'معنى (قَصَّتْ)', pending: true },
      { id: 'opposite', label: 'ضدّ (فرح)', acceptedAnswers: ['حزن', 'حَزِنَ', 'الحزن'] },
    ]},
    solution: { answer: 'جمع الشَّبَكَة: الشِّباك / الشَّبَكات. ضدّ فرح: حزن. معنى «قَصَّتْ»: معلّق بانتظار الاعتماد.', explanation: 'القراءة «قَصَّتْ» معتمدة بقرار صريح من صاحب المشروع، لكنّ الكلمة لا ترد في النصّ المطبوع المتاح (سياقها في نصّ الاستماع)، لذا يُترك مفتاح معناها معلّقًا بلا تخمين ولا اشتقاق.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ', 1),
  },
  {
    id: 'a-p6-2', page: 6, section: 'الفهم القرائي', printedNumber: '٢', status: 'solved',
    instruction: instr('L1-037'), sourceRecordIds: ['L1-037'],
    interaction: { kind: 'text_inputs', fields: [
      { id: 'khafaqa', label: 'خفقَ البحرُ بموجهِ', acceptedAnswers: ['اضطرب', 'تحرّك', 'تحرك', 'اهتز'] },
      { id: 'yarwiha', label: 'إنّها حكايةٌ يرويها الناسُ', acceptedAnswers: ['يحكيها', 'يقصها', 'يخبر بها', 'يحكيها ويقصها'] },
    ]},
    solution: { answer: 'خفقَ: اضطرب وتحرّكت أمواجه. يرويها: يحكيها ويقصّها.', explanation: 'المعنيان مستفادان من سياقي الجملتين (L1-029، L1-018).' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ', 2),
  },
  {
    id: 'a-p6-3', page: 6, section: 'الفهم القرائي', printedNumber: '٣', status: 'solved',
    instruction: instr('L1-038'), sourceRecordIds: ['L1-038'],
    // Both blanks are graded against events the printed text states explicitly:
    //  - الفراغ ١ ← L1-020 «البحرُ: لا تحزنْ. وبدلًا من أن تحلمَ بالسمكةِ الذهبيّةِ والرزقِ
    //    تعاونْ أنت وزملاؤك على صنع مركبٍ للصّيد لعلّ أموركم تتغيّر.»
    //  - الفراغ ٢ ← L1-027 «وبعد فترةٍ توفّر المال معهم، وتعاونوا على صنع المركب، ثمّ
    //    جهّزوه بالشِّباكِ القويّة والمتينة وأنزلوه إلى الماء…»
    // The variants below are accepted phrasings of those two printed events only —
    // no invented event, and a blank without such support would be marked pending.
    interaction: { kind: 'diagram_fill', boxes: [
      { id: 'b1', text: 'لجوءُ الصيّاد إلى البحر للحصول على سمكة ذهبيّة', tone: 'given' },
      { id: 'b2', fieldId: 'ev1', tone: 'blank', acceptedAnswers: [
        'نصيحة البحر للصيّاد بالتعاون مع زملائه على صنع مركب للصّيد',
        'نصيحة البحر بالتعاون مع زملائه',
        'نصيحة البحر بالتعاون',
        'نصيحة البحر له بالتعاون',
        'نصيحة البحر له بصنع مركب للصّيد بالتعاون',
        'نصيحة البحر بالصبر والتعاون على صنع مركب للصّيد',
        'البحر ينصحه بالتعاون مع زملائه',
        'التعاون على صنع مركب للصّيد',
        'صنع مركب للصّيد بالتعاون مع الزملاء',
        'تعاون الصيّاد مع زملائه على صنع مركب',
        'تعاونْ أنت وزملاؤك على صنع مركبٍ للصّيد',
      ] },
      { id: 'b3', text: 'اتفاقُ الصياد مع زملائه على صيد سمكة إضافيّة', tone: 'given' },
      { id: 'b4', text: 'اصطيادُ الصيّادين السمكَ الإضافيّ', tone: 'given' },
      { id: 'b5', fieldId: 'ev2', tone: 'blank', acceptedAnswers: [
        'توفّر المال وتعاونهم على صنع المركب وتجهيزه وإنزاله إلى الماء',
        'توفّر المال وصنع المركب',
        'توفّر المال وتعاونهم على صنع المركب',
        'توفّر المال وبناء المركب',
        'صنع المركب وتجهيزه وإنزاله إلى الماء',
        'تجهيز المركب بالشباك وإنزاله إلى الماء',
        'بناء المركب وتجهيزه وإنزاله إلى الماء',
        'صنع المركب وتجهيزه',
        'تجهيز المركب وإنزاله إلى الماء',
        'بناء المركب',
        'صنع المركب',
        'توفّر المال',
      ] },
    ], arrows: [['b1', 'b2'], ['b2', 'b3'], ['b3', 'b4'], ['b4', 'b5']] },
    solution: { answer: 'الفراغ ١: نصيحة البحر للصيّاد بالتعاون مع زملائه على صنع مركبٍ للصّيد (L1-020). الفراغ ٢: توفّر المال وتعاونهم على صنع المركب وتجهيزه وإنزاله إلى الماء (L1-027).', explanation: 'المخطط يتتبّع تسلسل الأحداث المطبوع: اللجوء ← نصيحة البحر ← الاتفاق ← الاصطياد ← بناء المركب.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ', 3),
  },
  {
    id: 'a-p6-4', page: 6, section: 'الفهم القرائي', printedNumber: '٤', status: 'solved',
    instruction: instr('L1-039'), sourceRecordIds: ['L1-039'],
    // Matching is exact after normalisation (see matchesAccepted), so every accepted
    // phrasing is listed explicitly; each one restates a printed event (L1-027/L1-028)
    // or the lesson's own moral — no invented content.
    interaction: { kind: 'table_fill', columns: ['السّبب', 'النّتيجة', 'العِبرة التي تدلّ عليه'], rows: [
      { cells: [
        { given: 'توفّرُ المال مع الصيّادين' },
        { fieldId: 'r1res', acceptedAnswers: ['بناء المركب وتجهيزه وإنزاله إلى الماء', 'صنع المركب وتجهيزه وإنزاله إلى الماء', 'صنع المركب وتجهيزه', 'بناء المركب وتجهيزه', 'إنزال المركب إلى الماء', 'بناء المركب', 'صنع المركب'] },
        { fieldId: 'r1ib', acceptedAnswers: ['التعاون يحقق الهدف', 'التعاون سبيل النجاح', 'التعاون سبيل إنجاز العمل الكبير', 'بالعمل الجماعي تتحقق الأحلام', 'بالعمل الجماعي ينجز العمل الكبير'] },
      ]},
      { cells: [
        { fieldId: 'r2cause', acceptedAnswers: ['نجاح التعاون وحصول كل صياد على سمكته', 'حصول كلّ صيّاد على سمكته الذهبيّة', 'نجاح التعاون وصيرورة سمكة ذهبيّة لكلّ صيّاد', 'تحقّق ثمرة التعاون', 'نجاح الصيّادين في التعاون'] },
        { given: 'سرورُ البحرِ وطربُهُ.' },
        { fieldId: 'r2ib', acceptedAnswers: ['ثمرة التعاون تظهر أثرها', 'ثمرة التعاون تظهر في أثرها', 'التعاون يجلب السرور', 'العمل الجماعي يجلب السرور', 'النجاح المشترك يسعد الجميع'] },
      ]},
    ]},
    solution: { answer: 'صف١: النتيجة = بناء المركب وتجهيزه وإنزاله إلى الماء؛ العبرة = التعاون يحقق الهدف. صف٢: السبب = نجاح التعاون وحصول كلّ صيّادٍ على سمكته؛ العبرة = ثمرة التعاون تظهر أثرها.', explanation: 'الربط بين السبب والنتيجة مستمدٌّ من L1-027 وL1-028 وL1-029، ثم تُستخرج العبرة.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ', 4),
  },
  {
    id: 'a-p6-5', page: 6, section: 'الفهم القرائي', printedNumber: '٥', status: 'solved',
    instruction: instr('L1-040'), sourceRecordIds: ['L1-040'],
    interaction: { kind: 'choose', choices: [
      { id: 'a', text: 'سمكةٍ تخرجُ من البحر.' },
      { id: 'b', text: 'العملِ والتّعاونِ.' },
      { id: 'c', text: 'سمكةٍ من الذهب.' },
    ], correctId: 'b' },
    solution: { answer: 'ب. العملِ والتّعاونِ.', explanation: 'القصة تؤكد أنّ الحلم يتحقّق بالعمل الجماعي لا بانتظار المعجزات؛ والخياران الآخران قراءةٌ حرفيّة تناقض رمز السمكة (L1-028).' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ', 5),
  },
  {
    id: 'a-p6-6', page: 6, section: 'الفهم القرائي', printedNumber: '٦', status: 'solved',
    instruction: instr('L1-041'), sourceRecordIds: ['L1-041'],
    interaction: { kind: 'multi', choices: [
      { id: 'a', text: 'البحرُ ضاحكٌ' },
      { id: 'b', text: 'في المياه سمكٌ' },
      { id: 'c', text: 'استمعَ البحرُ إلى أغاني الصيّادين.' },
    ], correctIds: ['a', 'c'] },
    solution: { answer: 'أ و ت: «البحرُ ضاحكٌ» و«استمعَ البحرُ إلى أغاني الصيّادين»، وهذه الصفات هي: التشخيص (إعطاءُ البحر صفاتٍ إنسانيّةً كالضحك والاستماع).', explanation: 'أعطى الكاتب البحر صفات الإنسان؛ وأمّا «في المياه سمكٌ» فجملةٌ خبريّة مجرّدة لا تشخيص فيها. وحقل «وهذه الصفات هي» جزءٌ من التمرين المطبوع فلا يُهمل.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ', 6),
  },
  {
    id: 'a-p6-7', page: 6, section: 'الفهم القرائي', printedNumber: '٧', status: 'solved',
    instruction: instr('L1-042'), sourceRecordIds: ['L1-042'],
    interaction: { kind: 'write' },
    solution: { answer: 'إجابة حرّة؛ مثال: يقرّر الصيّادون فتح مدرسةٍ لتعليم الصيد أطفالَ الحيّ.', explanation: 'نشاطٌ إبداعي ينمّي الخيال دون مساس بالنص.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ', 7),
  },
  {
    id: 'a-p6-8', page: 6, section: 'الفهم القرائي', printedNumber: '٨', status: 'solved',
    instruction: instr('L1-043'), sourceRecordIds: ['L1-043'],
    interaction: { kind: 'write' },
    solution: { answer: 'إجابة حرّة؛ مثال: أتعاون مع زملائي وأدّخر جزءًا من الصيد لشراء زورق.', explanation: 'ربطُ قيمة النصّ بخبرة التلميذ.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ', 8),
  },

  /* ---------------- page 7 ---------------- */
  {
    id: 'a-p7-1', page: 7, section: 'أتواصل شفوياً', printedNumber: '١', status: 'solved',
    instruction: instr('L1-046'), sourceRecordIds: ['L1-045', 'L1-046', 'L1-047'],
    interaction: { kind: 'table_fill', columns: ['التّخطيط', 'مراحل التنفيذ'], rows: [
      { cells: [{ fieldId: 'plan1' }, { fieldId: 'stages1' }] },
      { cells: [{ fieldId: 'plan2' }, { fieldId: 'stages2' }] },
    ]},
    solution: { answer: 'خطة نموذجية: التخطيط = تحديد موضوع المطويّة (النظافة) وجمع المعلومات؛ مراحل التنفيذ = الإعداد الفنّيّ (رسوم - ألوان - خط) ثم الإخراج النهائيّ والتوزيع في الحيّ.', explanation: 'تطبيق مراحل تصميم المطويّة الأربع المطبوعة في L1-048 على صورة حملة النظافة (L1-045).' },
    source: src(7, 'textbook_expression', 'مُطَوِيَّة', 1),
  },
  {
    id: 'a-p7-2', page: 7, section: 'أتواصل شفوياً', printedNumber: '٢', status: 'solved',
    instruction: instr('L1-049'), sourceRecordIds: ['L1-049'],
    interaction: { kind: 'speak' },
    solution: { answer: 'عرضٌ شفوي بعبارات إقناع مثل: «ساهم معنا لجعل حيّنا أنظف».', explanation: 'تنمية مهنة الإقناع الشفوي باستعمال عباراتٍ تُقنع السكّان بالمساهمة في الفعّاليّة كما يطلب التمرين المطبوع كاملًا.' },
    source: src(7, 'textbook_expression', 'أُطَبِّقُ', 2),
  },

  /* ---------------- page 8 ---------------- */
  {
    id: 'a-p8-1', page: 8, section: 'قواعد اللغة', printedNumber: '١', status: 'solved',
    instruction: instr('L1-052'), sourceRecordIds: ['L1-050', 'L1-051', 'L1-052'],
    interaction: { kind: 'text_inputs', fields: [{ id: 'q1', label: 'ماذا نسمّي كلًّا منها؟', acceptedAnswers: ['جملة', 'الجملة', 'الجُمْلَة'] }]},
    solution: { answer: 'الجملة.', explanation: 'لأنّ كلّ تركيبٍ من الأمثلة الثلاثة (L1-051) أفاد معنى تامًّا.' },
    source: src(8, 'textbook_grammar', 'الجُمْلَةُ', 1),
  },
  {
    id: 'a-p8-2', page: 8, section: 'قواعد اللغة', printedNumber: '٢', status: 'solved',
    instruction: instr('L1-053'), sourceRecordIds: ['L1-053'],
    interaction: { kind: 'text_inputs', fields: [{ id: 'q2', label: 'ماذا نسمّي هذا النوع من الجُمل؟', acceptedAnswers: ['جملة اسمية', 'الجملة الاسمية', 'اسمية'] }]},
    solution: { answer: 'الجملة الاسمية.', explanation: 'لأنّها بدأت باسمٍ: «الشِّباكُ قويةٌ».' },
    source: src(8, 'textbook_grammar', 'الجُمْلَةُ', 2),
  },
  {
    id: 'a-p8-3', page: 8, section: 'قواعد اللغة', printedNumber: '٣', status: 'solved',
    instruction: instr('L1-054'), sourceRecordIds: ['L1-054'],
    interaction: { kind: 'text_inputs', fields: [{ id: 'q3', label: 'ماذا نسمّي هذا النوع من الجُمل؟', acceptedAnswers: ['جملة فعلية', 'الجملة الفعلية', 'فعلية'] }]},
    solution: { answer: 'الجملة الفعلية.', explanation: 'لأنّهما بدأتا بفعلٍ: «فرحَ الصيّادُ» و«صنعَ العمّالُ مركبًا».' },
    source: src(8, 'textbook_grammar', 'الجُمْلَةُ', 3),
  },
  {
    id: 'a-p8-4', page: 8, section: 'قواعد اللغة', printedNumber: '٤', status: 'solved',
    instruction: instr('L1-056'), sourceRecordIds: ['L1-056'],
    interaction: { kind: 'classify', categories: [
      { id: 'nominal', label: 'اسميّة' },
      { id: 'verbal', label: 'فعليّة' },
    ], items: [
      { id: 's1', text: 'الشاطئُ ساحرٌ', correctCategoryId: 'nominal' },
      { id: 's2', text: 'تعاونَ الصيّادون على مواجهةِ العاصفةِ', correctCategoryId: 'verbal' },
      { id: 's3', text: 'التعاونُ قوّةٌ', correctCategoryId: 'nominal' },
    ]},
    solution: { answer: 'الشاطئُ ساحرٌ: اسمية. تعاونَ الصيّادون على مواجهةِ العاصفةِ: فعلية. التعاونُ قوّةٌ: اسمية.', explanation: 'التصنيف بحسب بداية الجملة: اسم أم فعل.' },
    source: src(8, 'textbook_grammar', 'أُطَبِّقُ', 4),
  },
  {
    id: 'a-p8-5', page: 8, section: 'التقويم النهائي', printedNumber: '١', status: 'solved',
    correctionNote: 'تصحيحٌ معتمد بقرار صريح: العرض التعليمي «يقضون»؛ والنصّ المطبوع «يقبضون» محفوظ ويظهر دائمًا إلى جانب التصحيح.',
    printedVariant: variant('L1-057'),
    instruction: instr('L1-057'), sourceRecordIds: ['L1-057'],
    interaction: { kind: 'table_fill', columns: ['الجملة', 'نوعُها'], rows: [
      { cells: [{ given: 'البحرُ مصدرٌ للرزقِ' }, { fieldId: 't1', acceptedAnswers: ['اسمية', 'الجملة الاسمية', 'جملة اسمية'] }] },
      { cells: [{ given: 'زُرقةُ مائهِ ساحرةٌ' }, { fieldId: 't2', acceptedAnswers: ['اسمية', 'الجملة الاسمية', 'جملة اسمية'] }] },
      { cells: [{ given: 'وخيراتُه وفيرةٌ' }, { fieldId: 't3', acceptedAnswers: ['اسمية', 'الجملة الاسمية', 'جملة اسمية'] }] },
      { cells: [{ given: 'يذهب إليه الناس في الصيف للسباحةِ' }, { fieldId: 't4', acceptedAnswers: ['فعلية', 'الجملة الفعلية', 'جملة فعلية'] }] },
      { cells: [{ given: 'ويقضون على شاطئه أجملَ الأوقات' }, { fieldId: 't5', acceptedAnswers: ['فعلية', 'الجملة الفعلية', 'جملة فعلية'] }] },
    ]},
    solution: { answer: 'اسمية / اسمية / اسمية / فعلية / فعلية.', explanation: 'ثلاث جملٍ بدأت باسمٍ وجملتان بدأتا بفعلٍ؛ والواو في الأخيرتين حرف عطفٍ وبداية التركيب بعدها فعلٌ (يقضون/يقبضون).' },
    source: src(8, 'textbook_grammar', 'التَّقويمُ النَّهائيُّ', 1),
  },
  {
    id: 'a-p8-6', page: 8, section: 'التقويم النهائي', printedNumber: '٢', status: 'solved',
    instruction: instr('L1-058'), sourceRecordIds: ['L1-058'],
    interaction: { kind: 'speak' },
    solution: { answer: 'عرضٌ حرّ لمدّة دقيقتين يجمع بين الجملتين الاسمية والفعلية عن حرفةٍ يعرفها التلميذ.', explanation: 'تطبيقٌ شفوي للقاعدة على موضوع النصّ المطبوع: «حرفةٍ أعرفها».' },
    source: src(8, 'textbook_grammar', 'التَّقويمُ النَّهائيُّ', 2),
  },
  {
    id: 'a-p8-7', page: 8, section: 'التقويم النهائي', printedNumber: '٣', status: 'solved',
    instruction: instr('L1-059'), sourceRecordIds: ['L1-059'],
    interaction: { kind: 'write' },
    solution: { answer: 'فقرة حرّة من سطرين؛ مثال: «الإخلاصُ كنزٌ. يُتقنُ المخلصُ عملَهُ فينالُ الثّقة».', explanation: 'كتابةٌ توظّف النوعين معًا كما يطلب التمرين.' },
    source: src(8, 'textbook_grammar', 'التَّقويمُ النَّهائيُّ', 3),
  },

  /* ---------------- page 9 ---------------- */
  {
    id: 'a-p9-1', page: 9, section: 'إملاء', printedNumber: '١', status: 'solved',
    instruction: instr('L1-063'), sourceRecordIds: ['L1-060', 'L1-061', 'L1-062', 'L1-063'],
    interaction: { kind: 'text_inputs', fields: [{ id: 'q1', label: 'ماذا نسمّي هذا النوع من الهمزات؟', acceptedAnswers: ['الهمزة الأولية', 'همزة أولية', 'الهمزة الأوليّة'] }]},
    solution: { answer: 'الهمزة الأوّليّة.', explanation: 'لأنّها تأتي في أول الكلمة (L1-066).' },
    source: src(9, 'textbook_spelling', 'إملاء', 1),
  },
  {
    id: 'a-p9-2', page: 9, section: 'إملاء', printedNumber: '٢', status: 'solved',
    instruction: instr('L1-064'), sourceRecordIds: ['L1-064'],
    interaction: { kind: 'text_inputs', fields: [{ id: 'q2', label: 'ماذا نسمّي هذا النوع من الهمزة الأوّليّة؟', acceptedAnswers: ['همزة القطع', 'همزة قطع', 'الهمزة القطع'] }]},
    solution: { answer: 'همزة القطع.', explanation: 'تُكتب وتُلفظ دائمًا، فوق الألف إذا فُتحت أو ضُمّت وتحتها إذا كُسرت (L1-066).' },
    source: src(9, 'textbook_spelling', 'إملاء', 2),
  },
  {
    id: 'a-p9-3', page: 9, section: 'إملاء', printedNumber: '٣', status: 'solved',
    instruction: instr('L1-065'), sourceRecordIds: ['L1-065'],
    interaction: { kind: 'text_inputs', fields: [{ id: 'q3', label: 'ماذا نسمّي هذا النوع من الهمزة الأوّليّة؟', acceptedAnswers: ['همزة الوصل', 'همزة وصل', 'الهمزة الوصل'] }]},
    solution: { answer: 'همزة الوصل.', explanation: 'تُكتب ألفًا وتُلفظ في أول الكلام ولا تُلفظ في أثناءه (L1-066)؛ ومثالها المطبوع «وامْنَحْني» (L1-062).' },
    source: src(9, 'textbook_spelling', 'إملاء', 3),
  },
  {
    id: 'a-p9-4', page: 9, section: 'إملاء', printedNumber: '٤', status: 'solved',
    instruction: instr('L1-067'), sourceRecordIds: ['L1-067'],
    interaction: { kind: 'classify', categories: [
      { id: 'qata', label: 'همزةُ قطعٍ' },
      { id: 'wasl', label: 'همزةُ وصلٍ' },
    ], items: [
      { id: 'w1', text: 'أرغبُ', correctCategoryId: 'qata' },
      { id: 'w2', text: 'اقتناءِ', correctCategoryId: 'wasl' },
      { id: 'w3', text: 'إسهامها', correctCategoryId: 'qata' },
    ]},
    solution: { answer: 'أرغبُ: قطع. اقتناءِ: وصل. إسهامها: قطع.', explanation: '«إسهامها» همزة قطعٍ مكسورة تُرسم تحت الألف وتبقى منطوقة؛ و«اقتناءِ» مصدرٌ سداسيٌّ همزته وصل.' },
    source: src(9, 'textbook_spelling', 'أُطَبِّقُ', 4),
  },
  {
    id: 'a-p9-5', page: 9, section: 'إملاء', printedNumber: '٥', status: 'solved',
    instruction: instr('L1-068'), sourceRecordIds: ['L1-068'],
    interaction: { kind: 'table_fill', columns: ['همزةُ القطع', 'موقعُها بالنسبةِ إلى الألف', 'السَّببُ', 'همزةُ الوصل'], rows: [
      { cells: [
        { fieldId: 'c1', acceptedAnswers: ['أبي', 'أعمال', 'أخطاءهم', 'إنجازهم'] },
        { fieldId: 'c2', acceptedAnswers: ['فوق الألف', 'تحت الألف'] },
        { fieldId: 'c3', acceptedAnswers: ['لأنها مفتوحة', 'لأنها مكسورة', 'لأنّها مفتوحة', 'لأنّها مكسورة', 'مفتوحة أو مكسورة'] },
        { fieldId: 'c4', acceptedAnswers: ['انظر', 'استفد', 'احرص', 'انظرْ', 'استفدْ', 'احرصْ'] },
      ]},
    ]},
    solution: { answer: 'همزة قطع: «أبي» (فوق الألف لأنّها مفتوحة) أو «إنجازِهم» (تحت الألف لأنّها مكسورة)؛ السَّببُ: حركة الهمزة؛ همزة وصل: «انظرْ» أو «استفدْ» أو «احرصْ».', explanation: 'في الفقرة «إنجازِهم» همزة قطع مكسورة تُرسم تحت الألف، و«أبي» همزة قطع مفتوحة فوق الألف؛ وهمزة القطع تُرسم فوق الألف إذا فُتحت أو ضُمّت وتحتها إذا كُسرت، أما همزة الوصل فتُكتب ألفًا بلا رسم همزة كما في «انظرْ» و«استفدْ» و«احرصْ» (L1-066). وعنوان العمود الثالث «السَّببُ» معتمد بقرار صريح.' },
    source: src(9, 'textbook_spelling', 'التَّقويمُ النَّهائيُّ', 1),
  },
  {
    id: 'a-p9-6', page: 9, section: 'إملاء', printedNumber: '٦', status: 'solved',
    instruction: instr('L1-069'), sourceRecordIds: ['L1-069'],
    interaction: { kind: 'write' },
    solution: { answer: 'مثال: «أحببتُ البحرَ» (همزة قطع) / «استمعتُ إلى الموجِ» (همزة وصل).', explanation: 'توظيفٌ حرّ للنوعين في جملتين مفيدتين.' },
    source: src(9, 'textbook_spelling', 'التَّقويمُ النَّهائيُّ', 2),
  },

  /* ---------------- page 10 ---------------- */
  {
    id: 'a-p10-1', page: 10, section: 'الخط', printedNumber: '١', status: 'solved',
    instruction: instr('L1-073'), sourceRecordIds: ['L1-070', 'L1-071', 'L1-072', 'L1-073'],
    interaction: { kind: 'write' },
    solution: { answer: 'محاكاة رسم الحركات والتنوين والتضعيف (فتحة، ضمة، كسرة، سكون، تنوين الفتح والضمّ والكسر، شدّة) بخطّ الرقعة وفق السطر المعروض في L1-072.', explanation: 'تدريبٌ خطّي على عناصر الضبط المعروضة في الصفحة.' },
    source: src(10, 'textbook_exercise', 'الخَطُّ', 1),
  },
  {
    id: 'a-p10-2', page: 10, section: 'الخط', printedNumber: '٢', status: 'solved',
    instruction: instr('L1-074'), sourceRecordIds: ['L1-074'],
    interaction: { kind: 'write' },
    solution: { answer: 'كتابة الجملة كما طُبعت («يَصْطادُ») بخطّ الرقعة مع رسم الحركات.', explanation: 'تطبيق قواعد خطّ الرقعة؛ والقراءة المعتمدة «يصطادُ» كما في الكتاب المطبوع.' },
    source: src(10, 'textbook_exercise', 'أُطَبِّقُ', 2),
  },
  {
    id: 'a-p10-3', page: 10, section: 'أعبر كتابياً', printedNumber: '١', status: 'solved',
    instruction: instr('L1-076'), sourceRecordIds: ['L1-075', 'L1-076', 'L1-077'],
    interaction: { kind: 'write' },
    solution: { answer: 'إعادة صوغٍ حرّة؛ مثال: «وقفَ الصيّادُ على الشاطئ متضرّعًا: يا بحرُ، هبني سمكةً ذهبيّةً…»، مع إبقاء المعنى واستبدال بعض المفردات.', explanation: 'مهارة استبدال المفردات والتراكيب المطبوعة في L1-077.' },
    source: src(10, 'textbook_expression', 'أُعَبِّرُ كِتابِيّاً', 1),
  },

  /* ---------------- page 11 ---------------- */
  {
    id: 'a-p11-1', page: 11, section: 'ألعب وأتعلم', printedNumber: '١', status: 'pending',
    pendingNote: 'المطابقة المقترحة لصفّي الرموز مسودةٌ بانتظار اعتمادٍ صريح من صاحب المشروع؛ زرّ «تحقّق من إجاباتي» معطّل، ولا تُعرض إجابة ولا يُحتسب النشاط محلولًا.',
    instruction: instr('L1-080'), sourceRecordIds: ['L1-078', 'L1-079', 'L1-080'],
    interaction: { kind: 'decode', checkDisabled: true },
    solution: { answer: 'بانتظار اعتماد المطابقة النهائية من صاحب المشروع.', explanation: 'يفكّ التلميذ الرموز مستعينًا بلوحة الحروف↔الأشكال المطبوعة (L1-079)؛ والتصحيح الآلي معطّل لأنّ المطابقة لم تُعتمد بعد.' },
    uncertain: 'المطابقة مسودةٌ بانتظار الاعتماد',
    source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ', 1, 'المطابقة المقترحة لصفّي الرموز مسودة بانتظار اعتماد صريح؛ لا تُعرض إجابة'),
  },
  {
    id: 'a-p11-2', page: 11, section: 'ألعب وأتعلم', printedNumber: '٢', status: 'solved',
    instruction: instr('L1-081'), sourceRecordIds: ['L1-081'],
    interaction: { kind: 'speak' },
    solution: { answer: 'يسجّل التلميذ الزمن الذي احتاج إليه أول مرّة.', explanation: 'قياس السرعة الذاتية قبل التدريب وبعده.' },
    source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ', 2),
  },
  {
    id: 'a-p11-3', page: 11, section: 'ألعب وأتعلم', printedNumber: '٣', status: 'solved',
    instruction: instr('L1-082'), sourceRecordIds: ['L1-082'],
    interaction: { kind: 'speak' },
    solution: { answer: 'يحوّل التلميذ العبارة التي اختارها زميله إلى رموزٍ مقابلةٍ وفق الجدول.', explanation: 'تعزيز مطابقة الحرف ورمزه في الاتجاه المعاكس.' },
    source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ', 3),
  },
  {
    id: 'a-p11-4', page: 11, section: 'ألعب وأتعلم', printedNumber: '٤', status: 'solved',
    instruction: instr('L1-083'), sourceRecordIds: ['L1-083'],
    interaction: { kind: 'speak' },
    solution: { answer: 'أستنتج أنّ التدريب يقلّل الزمن ويحسّن الإنجاز.', explanation: 'استنتاج قيمة المثابرة والمران.' },
    source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ', 4),
  },
  {
    id: 'a-p11-5', page: 11, section: 'أنا وأسرتي', printedNumber: '١', status: 'solved',
    instruction: instr('L1-084'), sourceRecordIds: ['L1-084'],
    interaction: { kind: 'speak' },
    solution: { answer: 'الحكمة: الحلم يتحقّق بالعمل والتعاون لا بانتظار المعجزات، مع البحث عن قصصٍ شعبيّةٍ مشابهة لعرضها في الدرس القادم.', explanation: 'ربطُ الدرس بالأسرة والمجتمع كما يطلب النشاط المطبوع.' },
    source: src(11, 'activity_book', 'أَنا وَأُسْرَتي', 1),
  },
];

/** Activities implemented but NOT solved: awaiting an explicit owner decision. */
export const PENDING_ACTIVITY_IDS = TEXTBOOK_ACTIVITIES
  .filter((activity) => activity.status !== 'solved')
  .map((activity) => activity.id);

/**
 * Coverage ledger. `unresolved` stays 0 because every discovered activity is
 * implemented; `pending` separates the implemented-but-not-solved items so they
 * are never counted as solved.
 */
export const COVERAGE = {
  discovered: TEXTBOOK_ACTIVITIES.length,
  implemented: TEXTBOOK_ACTIVITIES.length,
  solved: TEXTBOOK_ACTIVITIES.filter((a) => a.status === 'solved').length,
  pending: TEXTBOOK_ACTIVITIES.filter((a) => a.status !== 'solved').length,
  teacherSolutions: TEXTBOOK_ACTIVITIES.length,
  unresolved: 0,
};
