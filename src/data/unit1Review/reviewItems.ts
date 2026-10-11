import { SourceReference } from '../../types/curriculum';
import { reviewSrc, reviewUncertaintiesFor } from './sourceMeta';

/**
 * «تقويم الوحدة الأولى» — audited content inventory.
 *
 * ONE record per printed element (record) and ONE subpart per printed branch.
 * Every subpart carries both sides of the source→student→teacher chain:
 *  - the student side (what the learner sees and answers), and
 *  - the teacher side (model answer, solution steps, rule, examples, i‘rab,
 *    accepted alternatives, acceptance limits, declared ambiguity).
 *
 * Source of truth: docs/source-audits/unit-1-review-pages-36-38.md.
 * NOTHING here is invented: unclear regions stay declared as source limits.
 */

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type ReviewInteraction =
  | { kind: 'guidance' }
  | { kind: 'time_field'; label: string }
  | { kind: 'writing_field'; label: string; rows: number; placeholder?: string }
  | { kind: 'judgement'; correctionLabel: string }
  | { kind: 'single_choice'; choices: { id: string; text: string }[] }
  | { kind: 'paragraph'; requiredPhrases: string[]; rows: number; helperNote?: string }
  | {
      kind: 'pick_and_classify';
      words: string[];
      categories: { id: string; label: string }[];
      gapNote: string;
    }
  | { kind: 'short_field'; label: string; rows: number; placeholder?: string }
  | { kind: 'inline_blank'; before: string; after: string };

export interface ReviewIrabEntry {
  /** Word / segment being parsed. */
  segment: string;
  /** Full grammatical role, e.g. «فاعل مرفوع وعلامة رفعه الضمة الظاهرة». */
  role: string;
  /** Supporting hint for grade-5 learners. */
  note?: string;
}

export interface ReviewTeacherSolution {
  /** Stable teacher-solution ID, mapped 1:1 from the student subpart. */
  id: string;
  sourceRecordId: string;
  pageNumber: number;
  /** Printed reference, e.g. «السؤال ٤ — الجملة ١ (ص ٣٧)». */
  printedRef: string;
  /** The question text the solution answers (verbatim or clearly pointed at). */
  questionText: string;
  modelAnswer: string;
  solutionSteps: string[];
  rule?: string;
  ruleExamples?: string[];
  irab?: ReviewIrabEntry[];
  acceptedAlternatives?: string[];
  acceptanceLimits?: string;
  /** Declared source ambiguity — replaces an unsupported confident answer. */
  ambiguity?: string;
  commonMistakes?: string[];
}

export interface ReviewSubpart {
  /** Stable student-side element ID. */
  id: string;
  sourceRecordId: string;
  teacherSolutionId: string;
  /** Printed branch label, e.g. «العبارة ١» أو «فعلُها». */
  label: string;
  /** Printed text of the branch (verbatim where legible). */
  prompt?: string;
  /** Literal statement/sentence/option set to display, in order. */
  lines?: string[];
  interaction: ReviewInteraction;
  /** false for printed conduct/timing elements that are not graded. */
  graded: boolean;
  source: SourceReference;
  teacher: ReviewTeacherSolution;
}

export interface ReviewQuestion {
  id: string;
  sourceRecordId: string;
  /** Printed question number, in Arabic-Indic digits. */
  printedNumber: string;
  page: number;
  /** Printed section title reproduced as the card title. */
  section: string;
  /** Printed instruction verbatim. */
  instruction: string;
  /** Optional printed lead-in (ص ٣٦: «عزيزي التِّلميذ، أجِبْ…»). */
  leadIn?: string;
  /** Optional shared printed passage/sentence for all branches. */
  sharedText?: string;
  /** Rendering hint for grouping the branches. */
  layout: 'stack' | 'cause_result' | 'word_map';
  /**
   * true for long lists of independent branches (one branch per screen, with an
   * intra-question navigation): questions 1, 2 and 4.
   * false for compact/printed groups (the cause + two results of question 5,
   * the four-circle map of question 6, the three blanks of question 7).
   */
  paginateBranches: boolean;
  kindNote?: string;
  subparts: ReviewSubpart[];
  source: SourceReference;
}

export interface ReviewClosingRecord {
  id: string;
  instruction: string;
  intro?: string;
  subparts: ReviewSubpart[];
  source: SourceReference;
}

export interface ReviewTimingRecord {
  id: string;
  instructionLines: string[];
  clockLabels: { start: string; end: string };
  subparts: ReviewSubpart[];
  source: SourceReference;
  uncertaintyNote?: string;
}

export interface ReviewInstructionsRecord {
  id: string;
  heading: string;
  intro: string;
  leadIn: string;
  subparts: ReviewSubpart[];
  source: SourceReference;
}

/* ------------------------------------------------------------------ */
/* ص ٣٦ — مهمة ضبط الوقت                                              */
/* ------------------------------------------------------------------ */

const TIMING_PAGE = 36;

export const UNIT1_REVIEW_TIMING: ReviewTimingRecord = {
  id: 'U1R-36-01',
  instructionLines: [
    'أَرْسُمُ عَقارِبَ السَّاعَةِ عِنْدَ بَدْءِ تَنْفيذي التَّقْويمَ على السَّاعَةِ الأُولى، ثُمَّ أَرْسُمُ عَقارِبَ السَّاعَةِ عِنْدَ انْتِهائي على السَّاعَةِ الثَّانِيَةِ.',
    'أَحْسُبُ المُدَّةَ التي اسْتَغْرَقْتُها لِإِتْمامِ التَّقْويمِ................',
  ],
  clockLabels: {
    start: 'وقتُ البدا… (الساعة الأولى)',
    end: 'وقتُ الانتهاء (الساعة الثانية)',
  },
  source: reviewSrc(
    TIMING_PAGE,
    'textbook_exercise',
    'تقويم الوحدة — ضبط الوقت',
    1,
    reviewUncertaintiesFor('U1R-36-01')[0]?.issue,
  ),
  uncertaintyNote: reviewUncertaintiesFor('U1R-36-01')[0]?.issue,
  subparts: [
    {
      id: 'u1r-36-01-a',
      sourceRecordId: 'U1R-36-01',
      teacherSolutionId: 'u1r-teacher-36-01-a',
      label: 'زمن البداية',
      prompt: 'أَرْسُمُ عَقارِبَ السَّاعَةِ عِنْدَ بَدْءِ تَنْفيذي التَّقْويمَ على السَّاعَةِ الأُولى.',
      interaction: { kind: 'time_field', label: 'وقتُ البداية (الساعة الأولى)' },
      graded: false,
      source: reviewSrc(TIMING_PAGE, 'textbook_exercise', 'ضبط الوقت — الساعة الأولى', 1),
      teacher: {
        id: 'u1r-teacher-36-01-a',
        sourceRecordId: 'U1R-36-01',
        pageNumber: TIMING_PAGE,
        printedRef: 'مهمة ضبط الوقت — الساعة الأولى (ص ٣٦)',
        questionText: 'زمن البداية الذي يبدأ فيه المتعلم تنفيذ التقويم.',
        modelAnswer: 'لا إجابة موحّدة: يُدوَّن الوقت الفعلي لبدء التنفيذ. مثال صيغة مقبولة: «١٠:٤٥» أو «العاشرة والدقيقة الخامسة والأربعون».',
        solutionSteps: [
          'يُنظر إلى الساعة الأولى في الصفحة ويُرسم عقاربها على الكتاب بحسب الوقت الفعلي.',
          'يُدوَّن الزمن نفسه في المنصة بالصيغة (الساعة: الدقيقة) ليُستعمل في حساب المدّة.',
          'هذه مهمة تنظيمية غير مقوَّمة؛ غايتها أن يضبط المتعلم زمنه بإشراف المعلم.',
        ],
        acceptedAlternatives: ['أي كتابة زمنية سليمة بالعربية أو بالأرقام، صباحاً أو مساءً.'],
        acceptanceLimits: 'يُقبل الزمن إذا كان قابلاً للقراءة ومتسقاً مع وقت الانتهاء المدوَّن لاحقاً.',
        ambiguity: reviewUncertaintiesFor('U1R-36-01')[0]?.issue,
      },
    },
    {
      id: 'u1r-36-01-b',
      sourceRecordId: 'U1R-36-01',
      teacherSolutionId: 'u1r-teacher-36-01-b',
      label: 'زمن الانتهاء',
      prompt: 'ثُمَّ أَرْسُمُ عَقارِبَ السَّاعَةِ عِنْدَ انْتِهائي على السَّاعَةِ الثَّانِيَةِ.',
      interaction: { kind: 'time_field', label: 'وقتُ الانتهاء (الساعة الثانية)' },
      graded: false,
      source: reviewSrc(TIMING_PAGE, 'textbook_exercise', 'ضبط الوقت — الساعة الثانية', 2),
      teacher: {
        id: 'u1r-teacher-36-01-b',
        sourceRecordId: 'U1R-36-01',
        pageNumber: TIMING_PAGE,
        printedRef: 'مهمة ضبط الوقت — الساعة الثانية (ص ٣٦)',
        questionText: 'زمن الانتهاء من تنفيذ التقويم.',
        modelAnswer: 'لا إجابة موحّدة: يُدوَّن الوقت الفعلي لانتهاء التنفيذ حسب الساعة الثانية في الصفحة.',
        solutionSteps: [
          'يُرسم على الكتاب عقارب الساعة الثانية عند الانتهاء فعلاً من التقويم.',
          'يُدوَّن الزمن في المنصة لتُحسب المدّة المستغرقة.',
        ],
        acceptedAlternatives: ['أي كتابة زمنية سليمة، بشرط أن تكون لاحقةً لزمن البداية.'],
        acceptanceLimits: 'إذا كان زمن الانتهاء أصغر من زمن البداية فالتسجيل خطأ شكلي يُنبَّه إليه المتعلم.',
      },
    },
    {
      id: 'u1r-36-01-c',
      sourceRecordId: 'U1R-36-01',
      teacherSolutionId: 'u1r-teacher-36-01-c',
      label: 'المدّة المستغرقة',
      prompt: 'أَحْسُبُ المُدَّةَ التي اسْتَغْرَقْتُها لِإِتْمامِ التَّقْويمِ.',
      interaction: { kind: 'time_field', label: 'المدّة التي استغرقتها لإتمام التقويم' },
      graded: false,
      source: reviewSrc(TIMING_PAGE, 'textbook_exercise', 'ضبط الوقت — المدّة', 3),
      teacher: {
        id: 'u1r-teacher-36-01-c',
        sourceRecordId: 'U1R-36-01',
        pageNumber: TIMING_PAGE,
        printedRef: 'مهمة ضبط الوقت — حساب المدّة (ص ٣٦)',
        questionText: 'حساب المدّة التي استغرقها المتعلم لإتمام التقويم.',
        modelAnswer: 'المدّة = زمن الانتهاء − زمن البداية. مثال: من ١٠:٤٥ إلى ١١:٣٠ = ٤٥ دقيقة.',
        solutionSteps: [
          'يُطرح زمن البداية من زمن الانتهاء.',
          'إذا تجاوز الطرح الساعة يُؤخذ ذلك في الحساب (مثال: من ١١:٥٠ إلى ١٢:٢٠ = ٣٠ دقيقة).',
          'تُكتب المدّة بالدقائق أو بالساعات والدقائق.',
        ],
        rule: 'حساب المدّة الزمنية: المدّة = وقت الانتهاء − وقت البداية.',
        ruleExamples: ['٩:١٠ → ٩:٤٠ = ٣٠ دقيقة.', '١١:٤٥ → ١٢:١٥ = ٣٠ دقيقة.'],
        acceptedAlternatives: ['يُقبل «٤٥ دقيقة» أو «ثلاثة أرباع الساعة» أو «٠٠:٤٥» بحسب تسجيل المتعلم.'],
        acceptanceLimits: 'تُقبل المدّة إذا كان الحساب صحيحاً وفق الزمنين المسجَّلين للمتعلم نفسه.',
        commonMistakes: ['طرح الدقائق دون مراعاة انتقال الساعة.', 'كتابة مدّة أكبر من الوقت المتاح للحصة بلا سبب.'],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* ص ٣٦ — تعليمات التقويم                                             */
/* ------------------------------------------------------------------ */

export const UNIT1_REVIEW_INSTRUCTIONS: ReviewInstructionsRecord = {
  id: 'U1R-36-02',
  heading: 'تَعْليماتُ التَّقْويمِ',
  intro: 'عَزيزي المُتَعَلِّمُ، كُلِّي ثِقَةٌ أَنَّكَ سَتَنْفِّذُ التَّقْويمَ بِاِهْتِمامٍ، مُلْتَزِماً ما يَأْتي:',
  leadIn: 'عَزيزي التِّلْميذُ، أَجِبْ عن الأَسْئِلَةِ الآتيةِ:',
  source: reviewSrc(
    36,
    'textbook_exercise',
    'تقويم الوحدة — تعليمات التقويم',
    2,
    reviewUncertaintiesFor('U1R-36-02')[0]?.issue,
  ),
  subparts: [
    {
      id: 'u1r-36-02-a',
      sourceRecordId: 'U1R-36-02',
      teacherSolutionId: 'u1r-teacher-36-02-a',
      label: 'التعليمة ١',
      prompt: 'الإِجابةُ بِالقَلَمِ الأَزْرَقِ النّاشِفِ.',
      interaction: { kind: 'guidance' },
      graded: false,
      source: reviewSrc(36, 'textbook_exercise', 'تعليمات التقويم', 1),
      teacher: {
        id: 'u1r-teacher-36-02-a',
        sourceRecordId: 'U1R-36-02',
        pageNumber: 36,
        printedRef: 'تعليمات التقويم — البند ١ (ص ٣٦)',
        questionText: 'الإجابة بالقلم الأزرق الناشف.',
        modelAnswer: 'ليست سؤالاً مقوَّماً: تعليمة تنفيذية مطبوعة تنظّم طريقة الكتابة.',
        solutionSteps: [
          'يُنبَّه المتعلم إلى تدوين إجاباته كلّها بالقلم الأزرق الناشف على الكتاب.',
          'في المنصة تُكتب الإجابات نصّياً، ويُتابع المعلم التزام المتعلم بالقلم الأزرق في نسخته الورقية.',
        ],
        acceptanceLimits: 'تعليمة إجرائية لا تُحسب في الدرجة، ويُذكَّر المتعلم بها عند التصحيح.',
      },
    },
    {
      id: 'u1r-36-02-b',
      sourceRecordId: 'U1R-36-02',
      teacherSolutionId: 'u1r-teacher-36-02-b',
      label: 'التعليمة ٢',
      prompt: 'التَّفْكيرُ جَيّداً قَبْلَ الإِجابةِ عن كُلِّ سُؤالٍ.',
      interaction: { kind: 'guidance' },
      graded: false,
      source: reviewSrc(36, 'textbook_exercise', 'تعليمات التقويم', 2),
      teacher: {
        id: 'u1r-teacher-36-02-b',
        sourceRecordId: 'U1R-36-02',
        pageNumber: 36,
        printedRef: 'تعليمات التقويم — البند ٢ (ص ٣٦)',
        questionText: 'التفكير جيداً قبل الإجابة عن كل سؤال.',
        modelAnswer: 'ليست سؤالاً مقوَّماً: تعليمة تنفيذية تشجّع التروّي قبل الإجابة.',
        solutionSteps: [
          'يُذكَّر المتعلم بقراءة السؤال مرتين قبل الإجابة.',
          'يمكن للمعلم إعطاء وقت تأمّل قصير قبل الأسئلة الكتابية.',
        ],
      },
    },
    {
      id: 'u1r-36-02-c',
      sourceRecordId: 'U1R-36-02',
      teacherSolutionId: 'u1r-teacher-36-02-c',
      label: 'التعليمة ٣',
      prompt: 'الكِتابَةُ بِخَطٍّ واضِحٍ.',
      interaction: { kind: 'guidance' },
      graded: false,
      source: reviewSrc(36, 'textbook_exercise', 'تعليمات التقويم', 3),
      teacher: {
        id: 'u1r-teacher-36-02-c',
        sourceRecordId: 'U1R-36-02',
        pageNumber: 36,
        printedRef: 'تعليمات التقويم — البند ٣ (ص ٣٦)',
        questionText: 'الكتابة بخط واضح.',
        modelAnswer: 'ليست سؤالاً مقوَّماً: تعليمة تنفيذية عن وضوح الخط وعلامات الضبط.',
        solutionSteps: [
          'تُتابع وضوح الكتابة وعلامات الترقيم عند تصحيح النسخة الورقية.',
          'لا تُخصم درجات لغوية على الخط، ويُنصح المتعلم بتحسينه تدريجياً.',
        ],
      },
    },
    {
      id: 'u1r-36-02-d',
      sourceRecordId: 'U1R-36-02',
      teacherSolutionId: 'u1r-teacher-36-02-d',
      label: 'التعليمة ٤',
      prompt: 'الإِجابةُ عن الأَسْئِلَةِ التي أُتْقِنُ صِحَّتَها أَوَّلاً، ثُمَّ العَوْدَةُ إِلى الإِجابةِ عن الأَسْئِلَةِ التي أَحْتاجُ إِلى إِعادةِ التَّفْكيرِ فيها.',
      interaction: { kind: 'guidance' },
      graded: false,
      source: reviewSrc(
        36,
        'textbook_exercise',
        'تعليمات التقويم',
        4,
        reviewUncertaintiesFor('U1R-36-02')[0]?.issue,
      ),
      teacher: {
        id: 'u1r-teacher-36-02-d',
        sourceRecordId: 'U1R-36-02',
        pageNumber: 36,
        printedRef: 'تعليمات التقويم — البند ٤ (ص ٣٦)',
        questionText: 'البدء بالأسئلة المتقنة ثم العودة إلى الأسئلة التي تحتاج إعادة تفكير.',
        modelAnswer: 'ليست سؤالاً مقوَّماً: تعليمة إجرائية لتنظيم الوقت داخل التقويم.',
        solutionSteps: [
          'تُفسَّر التعليمة: يبدأ المتعلم بالأسئلة التي يثق بإجابتها، ثم يعود إلى ما يحتاج تأمّلاً.',
          'تشجّع المنصة هذا التنظيم بعرض قائمة الأسئلة والتنقل الحرّ بينها.',
        ],
        ambiguity: reviewUncertaintiesFor('U1R-36-02')[0]?.issue,
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* ص ٣٦ — السؤال ١                                                    */
/* ------------------------------------------------------------------ */

const Q1_PAGE = 36;

const q1Subpart = (
  index: number,
  statement: string,
  teacher: Omit<ReviewTeacherSolution, 'id' | 'sourceRecordId' | 'pageNumber' | 'printedRef' | 'questionText'>,
): ReviewSubpart => ({
  id: `u1r-q1-s${index}`,
  sourceRecordId: 'U1R-36-03',
  teacherSolutionId: `u1r-teacher-q1-s${index}`,
  label: `العبارة ${['١', '٢', '٣', '٤'][index - 1]}`,
  prompt: statement,
  interaction: { kind: 'judgement', correctionLabel: 'التصويب (إن كانت العبارة غير صحيحة)' },
  graded: true,
  source: reviewSrc(
    Q1_PAGE,
    'textbook_exercise',
    'السؤال ١ — تمييز العبارة الصحيحة من غير الصحيحة',
    index,
    reviewUncertaintiesFor('U1R-36-03')[index === 1 ? 0 : index === 3 ? 1 : -1]?.issue,
  ),
  teacher: {
    id: `u1r-teacher-q1-s${index}`,
    sourceRecordId: 'U1R-36-03',
    pageNumber: Q1_PAGE,
    printedRef: `السؤال ١ — العبارة ${['١', '٢', '٣', '٤'][index - 1]} (ص ٣٦)`,
    questionText: statement,
    ...teacher,
  },
});

export const UNIT1_REVIEW_Q1: ReviewQuestion = {
  id: 'u1r-q1',
  sourceRecordId: 'U1R-36-03',
  printedNumber: '١',
  page: Q1_PAGE,
  section: 'أُمَيِّزُ العِبارَةَ الصَّحيحةَ من العِبارَةِ غَيْرِ الصَّحيحةِ',
  instruction: 'أُمَيِّزُ العِبارَةَ الصَّحيحةَ من العِبارَةِ غَيْرِ الصَّحيحةِ مِمَّا يَأْتي، وأُصَحِّحُ الخَطَأَ:',
  leadIn: 'عَزيزي التِّلْميذُ، أَجِبْ عن الأَسْئِلَةِ الآتيةِ:',
  layout: 'stack',
  paginateBranches: true,
  source: reviewSrc(Q1_PAGE, 'textbook_exercise', 'السؤال ١', 1, reviewUncertaintiesFor('U1R-36-03')[0]?.issue),
  subparts: [
    q1Subpart(1, 'قِصَّةُ مَرْكَبِ السَّمَكَةِ الذَّهَبِيَّةِ قِصَّةٌ خَيالِيَّةٌ.', {
      modelAnswer: 'العِبارةُ صَحيحةٌ (✓)؛ ولا يُطلب لها تصويب.',
      solutionSteps: [
        'ننظر في أحداث النصّ: الصيّاد يخاطب البحر «يا صديقي البحر…»، والبحر يجيبه ويضحك: «وَهَلْ صَدَّقْتَ؟!».',
        'كلام البحر مع الصيّاد واستجابته له حدثٌ لا يقع في الواقع؛ وهذا هو مظهر الخيال في النصّ.',
        'وقد صرّح النصّ نفسه بأن الأمر حكاية: «إِنَّها حِكايَةٌ رَواها الصَّيّادُ لِيَتَعَلَّمَ مِنْها زُمَلاؤُهُ».',
        'لذلك توصف القصّة بأنها خيالية، والعبارة صحيحة.',
      ],
      rule: 'القصّة الخيالية: نصٌّ تقع فيه أحداث غير ممكنة في الواقع (كلام الحيوان أو الطبيعة…)، بخلاف القصّة الواقعية التي تقع أحداثها كما تحدث في الحياة.',
      ruleExamples: [
        'من الخيال في النصّ: حوار البحر مع الصيّاد وإجابته له.',
        'من الواقع في النصّ: تعاون الصيادين، وجمع المال، وصنع المركب، والصيد.',
      ],
      acceptedAlternatives: [
        'يُقبل أن يكتب المتعلم «صحيحة» دون تصويب.',
        'وإذا صحّح المتعلم العبارة فيُقبل أي تصويب سليم، مثل: «القصّة خيالية لأن البحر يتكلم فيها».',
      ],
      acceptanceLimits: 'الحقل المطلوب أساساً هو تحديد صحة العبارة؛ وتصويب العبارة الصحيحة غير مطلوب، وأي تصويب يُكتب لها لا يُخصم عليه.',
      ambiguity: reviewUncertaintiesFor('U1R-36-03')[0]?.issue,
      commonMistakes: [
        'الحكم بأن القصّة واقعية لأن الصيد والتعاون أمور واقعية، مع إغفال حوار البحر.',
        'الخلط بين «خيالية» و«غير معقولة»؛ فالخيال في القصّة وسيلة تعليمية لا خطأ.',
      ],
    }),
    q1Subpart(2, 'كانَتْ فِكْرَةُ الصَّيّادِ الشّابِّ واصْطِيادِ سَمَكَتَيْنِ إِضافِيَّتَيْنِ كُلَّ يَوْمٍ لِبِناءِ المَرْكَبِ.', {
      modelAnswer:
        'العِبارةُ غيرُ صَحيحةٍ (✗)؛ والتصويبُ: «سَمَكَةً إِضافِيَّةً واحِدَةً كُلَّ يَوْمٍ»؛ أي أنّ كلَّ صيّادٍ يصطاد سمكةً إضافيةً واحدةً في اليوم، لا سمكتين.',
      solutionSteps: [
        'نرجع إلى نصّ الدرس الأول (ص ٥): «يَصْطادُ كُلُّ واحِدٍ مِنّا سَمَكَةً إِضافِيَّةً كُلَّ يَوْمٍ، نَجْمَعُ ثَمَنَها وَنَبْدَأُ بِصُنْعِ المَرْكَبِ».',
        'النصّ يذكر «سمكةً إضافيةً» واحدة في اليوم لكلّ صيّاد، وليس «سمكتين».',
        'فالخطأ في العدد؛ فالعبارة غير صحيحة، ويُصوَّب العدد بالمفرد.',
      ],
      rule: 'الدقّة في نقل الأرقام والمقادير جزء من صحة الفهم: «سمكة إضافية واحدة» لا تساوي «سمكتين».',
      ruleExamples: ['«سَمَكَةً إِضافِيَّةً كُلَّ يَوْمٍ»: عدد مفرد.', '«سَمَكَتَيْنِ إِضافِيَّتَيْنِ»: مثنّى، وهو خلاف النصّ.'],
      acceptedAlternatives: [
        'سمكةً إضافيةً واحدةً كلَّ يومٍ.',
        'سمكةً واحدةً إضافيةً في اليوم.',
        'الصيد الإضافي سمكةٌ واحدة، لا سمكتان.',
      ],
      acceptanceLimits: 'يُقبل التصويب الذي يبيّن أن الصيد الإضافي سمكةٌ واحدة في اليوم؛ ولا يُشترط نقل الجملة كما هي.',
      commonMistakes: [
        'إغفال كلمة «إضافية» في التصويب فتختلط السمكة اليومية المعتادة بالسمكة الإضافية.',
        'تصويب العبارة بأن الفكرة كانت «بناء الزورق» مع أن النصّ يذكر بناء «المركب».',
      ],
    }),
    q1Subpart(3, 'مَعْنى كَلِمَةِ «رَوَتْ» في النَّصِّ: قَصَّتْ.', {
      modelAnswer: 'العِبارةُ صَحيحةٌ (✓)؛ فالفعلُ «رَوى» بمعنى حَكى وقَصَّ.',
      solutionSteps: [
        'نبحث في معنى الفعل: «رَوى يَرْوي»، ومصدره «الرِّواية»، ومعناه حكى وأخبر وقصّ.',
        'وفي نصّ الدرس الأول: «إِنَّها حِكايَةٌ رَواها الصَّيّادُ لِيَتَعَلَّمَ مِنْها زُمَلاؤُهُ»؛ فـ«رَواها» = قصّها وحكاها.',
        'إذن «رَوَتْ» = قصّت؛ فالعبارة صحيحة.',
      ],
      rule: '«رَوى» = حكى وأخبر وقصّ؛ ومنه «الرّاوي» و«الرِّواية».',
      ruleExamples: ['رَوى الجدُّ حكايةً = قصّها.', 'رَوَتِ الجدّةُ حكايةً = قصّتها.'],
      acceptedAlternatives: ['يُقبل في التصويب أي مرادف سليم للفعل: حكت، أخبرت، حدّثت.'],
      acceptanceLimits:
        'الموقف الصحيح هو الحكم بأن العبارة صحيحة. ومن كتب تصويباً لها فيجب أن يكون متوافقاً مع المعنى (مثل: حكت)؛ ولا تُقبل تصويبات تنفي المعنى مثل «كتمت» أو «أخفت».',
      ambiguity: reviewUncertaintiesFor('U1R-36-03')[1]?.issue,
      commonMistakes: ['الظن أن «روت» بمعنى «كتبت» أو «قرأت» لصلة الحكاية بالكتاب.'],
    }),
    q1Subpart(4, 'هَمْزَةُ القَطْعِ هِيَ هَمْزَةٌ تُكْتَبُ وَلا تُلْفَظُ.', {
      modelAnswer:
        'العِبارةُ غيرُ صَحيحةٍ (✗)؛ والتصويبُ: «هَمْزَةُ القَطْعِ تُكْتَبُ وتُلْفَظُ دائِماً»؛ والوصفُ المذكورُ في العبارةِ هو وصفُ همزةِ الوصلِ.',
      solutionSteps: [
        'نستحضر قاعدة الهمزة الأولية من الدرس الأول (ص ٩): الهمزة الأولية تقع في أول الكلمة، وقسمان: همزة قطع وهمزة وصل.',
        'همزة القطع: تُكتب وتُلفظ دائماً، وتُرسم فوق الألف إذا كانت مفتوحة أو مضمومة (أَ / أُ)، وتحته إذا كانت مكسورة (إِ).',
        'همزة الوصل: تُكتب ألفاً بلا رأس همزة، وتُلفظ إذا بُدئ بها الكلام، وتسقط من النطق عند وصلها بما قبلها.',
        'فالعبارة تنسب صفة همزة الوصل إلى همزة القطع؛ لذلك هي غير صحيحة.',
      ],
      rule: 'همزة القطع: تُكتب وتُلفظ دائماً. همزة الوصل: تُكتب ألفاً، تُلفظ ابتداءً ولا تُلفظ وصلاً.',
      ruleExamples: [
        'همزة قطع: أَرْغَبُ، أُريدُ، إِكْرامي، إِنْجازاتِهِمْ.',
        'همزة وصل: امْنَحْني، اقْتِناءِ، انْظُرْ، اسْتَفِدْ.',
      ],
      acceptedAlternatives: [
        'همزة القطع تُكتب وتُلفظ دائماً، وتُرسم فوق الألف أو تحته.',
        'الصفة المذكورة صفة همزة الوصل لا همزة القطع.',
      ],
      acceptanceLimits:
        'يُقبل كل تصويب يثبت أن همزة القطع تُلفظ (ولا تسقط من النطق عند وصل الكلام)، حتى لو لم يذكر المتعلم التفصيل الثلاثي (الكتابة + النطق + موضع الرسم).',
      commonMistakes: [
        'الخلط بين همزة القطع وهمزة الوصل.',
        'الظن أنّ همزة الوصل لا تُلفظ أبداً، مع أنها تُلفظ في أول الكلام.',
      ],
    }),
  ],
};

/* ------------------------------------------------------------------ */
/* ص ٣٧ — السؤال ٢                                                    */
/* ------------------------------------------------------------------ */

const Q2_PAGE = 37;
const LETTERS = ['١', '٢', '٣', '٤'];

const q2Subpart = (
  index: number,
  prompt: string,
  choices: { id: string; text: string }[],
  teacher: Omit<ReviewTeacherSolution, 'id' | 'sourceRecordId' | 'pageNumber' | 'printedRef' | 'questionText'>,
): ReviewSubpart => ({
  id: `u1r-q2-s${index}`,
  sourceRecordId: 'U1R-37-04',
  teacherSolutionId: `u1r-teacher-q2-s${index}`,
  label: `البند ${LETTERS[index - 1]}`,
  prompt,
  interaction: { kind: 'single_choice', choices },
  graded: true,
  source: reviewSrc(Q2_PAGE, 'textbook_exercise', 'السؤال ٢ — اختيار الإجابة الصحيحة', index),
  teacher: {
    id: `u1r-teacher-q2-s${index}`,
    sourceRecordId: 'U1R-37-04',
    pageNumber: Q2_PAGE,
    printedRef: `السؤال ٢ — البند ${LETTERS[index - 1]} (ص ٣٧)`,
    questionText: prompt,
    ...teacher,
  },
});

export const UNIT1_REVIEW_Q2: ReviewQuestion = {
  id: 'u1r-q2',
  sourceRecordId: 'U1R-37-04',
  printedNumber: '٢',
  page: Q2_PAGE,
  section: 'أَخْتارُ الإِجابةَ الصَّحيحةَ مِمّا بَينَ القَوْسَينِ',
  instruction: 'أَخْتارُ الإِجابةَ الصَّحيحةَ مِمّا بَينَ القَوْسَينِ في كُلِّ مِمّا يَأْتي:',
  layout: 'stack',
  paginateBranches: true,
  source: reviewSrc(Q2_PAGE, 'textbook_exercise', 'السؤال ٢', 2),
  subparts: [
    q2Subpart(
      1,
      'لَيْسَ من مُتَطَلَّباتِ إِجراءِ مُقابَلَةٍ صَحَفِيَّةٍ:',
      [
        { id: 'topic', text: 'اخْتِيارُ المَوْضوعِ' },
        { id: 'person', text: 'تَحْديدُ الشَّخْصِيَّةِ وَإِخْبارُها بِالزَّمانِ وَالمَكانِ' },
        { id: 'questions', text: 'تَحْضيرُ الأَسْئِلَةِ' },
        { id: 'agree_all', text: 'المُوافَقَةُ عَلى كُلِّ إِجاباتِ الشَّخْصِيَّةِ في أَثْناءِ اللِّقاءِ' },
      ],
      {
        modelAnswer: '«المُوافَقَةُ عَلى كُلِّ إِجاباتِ الشَّخْصِيَّةِ في أَثْناءِ اللِّقاءِ»؛ فهي ليست من متطلبات إجراء المقابلة الصحفية.',
        solutionSteps: [
          'نستعيد متطلبات المقابلة الصحفية كما وردت في الدرس الثاني (ص ١٦)، وهي ستة: اختيار الموضوع، تحديد الشخصية وإخبارها بالزمان والمكان، تحضير أسئلة قصيرة ومتعلقة مباشرة بالموضوع، اختيار عبارات مناسبة لافتتاح المقابلة، الترحيب بالضيف في بداية اللقاء وشكره في نهايته، إعطاء الوقت الكافي للضيف لإبداء رأيه.',
          'نقارن الخيارات الأربعة بهذه المتطلبات: الخيارات الثلاثة الأولى مطابقة للمتطلبات (اختيار الموضوع، تحديد الشخصية وإخبارها بالزمان والمكان، تحضير الأسئلة).',
          'الخيار الأخير «الموافقة على كل إجابات الشخصية في أثناء اللقاء» غير موجود في المتطلبات؛ فالمقابلة تقوم على الاستماع والتحاور، لا على الموافقة المسبقة على كل ما يُقال.',
          'ولأن السؤال منفيّ («ليس من متطلبات»)، فالإجابة هي هذا الخيار.',
        ],
        rule: 'المقابلة الصحفية: حوار منظَّم يستعدّ له الصحفي بتحديد الموضوع والشخصية والزمان والمكان، وبتحضير أسئلة قصيرة مرتبطة بالموضوع، ويقدّم فيه عبارات افتتاح مهذبة ووقتاً كافياً للضيف.',
        ruleExamples: [
          'من المتطلبات: «تَحْضيرُ أَسْئِلَةٍ قَصيرَةٍ وَمُتَعَلِّقَةٍ مُباشَرَةً بِالمَوْضوعِ».',
          'ليس من المتطلبات: مشاركة الضيف في رأيه أو الموافقة على كل ما يقوله.',
        ],
        acceptedAlternatives: ['يُقبل اختيار الخيار نصّاً أو الإشارة إليه ترتيباً: «الخيار الأخير» أو «عدم الموافقة على كل الإجابات».'],
        acceptanceLimits:
          'الموافقة على مسار اللقاء واحترام الضيف مطلوبان أدباً، لكنّ «الموافقة على كل الإجابات» ليست متطلّباً من متطلبات الإجراء؛ فمن فهمها هكذا فقد أخطأ فهم السؤال.',
        commonMistakes: [
          'إهمال كلمة «ليس» في السؤال فيُختار أحد المتطلبات الصحيحة.',
          'الخلط بين آداب الحوار (الاحترام والإنصات) ومتطلبات إجراء المقابلة.',
        ],
      },
    ),
    q2Subpart(
      2,
      'المَصْدَرُ هُوَ اسْمٌ من جِنْسِ الفِعْلِ يَدُلُّ عَلى حَدَثٍ:',
      [
        { id: 'abstract', text: 'مُجَرَّدٍ من الزَّمَنِ' },
        { id: 'past', text: 'مُقْتَرِنٍ بِزَمَنٍ ماضٍ' },
        { id: 'present', text: 'مُقْتَرِنٍ بِزَمَنٍ حاضِرٍ' },
      ],
      {
        modelAnswer: '«مُجَرَّدٍ من الزَّمَنِ».',
        solutionSteps: [
          'القاعدة المقفولة في الدرس الثاني (ص ١٧): «المصدرُ: اسمٌ من جنسِ الفعلِ يدلُّ على حدثٍ مجرَّدٍ من الزَّمنِ».',
          'المصدر والفعل يشتركان في الحدث نفسه: «كتَب» فعله الحدث، و«كتابة» المصدر الدال على الحدث نفسه.',
          'ويفترقان في الزمن: الفعل يدل على الحدث مقترناً بزمنه (ماضٍ أو مضارع أو أمر)، والمصدر يدل على الحدث دون زمن.',
          'لذلك الإجابة: «مجرَّد من الزمن».',
        ],
        rule: 'المصدر: اسم يدل على الحدث مجرداً من الزمن. الفعل: يدل على الحدث مقترناً بزمن.',
        ruleExamples: [
          'قراءة (مصدر) ← قرأ (فعل).',
          'كتابة (مصدر) ← كتب (فعل).',
          'عمَل (مصدر) ← عمل (فعل).',
        ],
        acceptedAlternatives: ['«مجرَّد من الزمن» أو «الخيار الأول».'],
        acceptanceLimits: 'يُردّ خيارا «المقترن بزمن ماضٍ» و«المقترن بزمن حاضر»، لأن الاقتران بالزمن من صفات الفعل لا المصدر.',
        commonMistakes: ['الخلط بين المصدر والفعل الماضي لاتحاد الحروف.'],
      },
    ),
    q2Subpart(
      3,
      'كَلِمَتا (تَقارُب) وَ(تَباعُد):',
      [
        { id: 'synonyms', text: 'مُتَرادِفَتانِ' },
        { id: 'antonyms', text: 'مُتَضادَّتانِ' },
        { id: 'verbs', text: 'أَفْعالٌ' },
      ],
      {
        modelAnswer: '«مُتَضادَّتانِ».',
        solutionSteps: [
          'ننظر في معنى الكلمتين: «التقارُب» قربٌ ودُنُوّ، و«التباعُد» افتراقٌ وبُعد.',
          'المعنيان متقابلان متضادّان لا مترادفان؛ فكلّ واحدة تقابل الأخرى.',
          'والكلمتان مطبوعتان على صيغة المصدر (تفاعُل): «تقارُب»، «تباعُد»، وهما اسمان لا فعلان.',
          'وقد وردتا في قصيدة «لُغَتي»: «وَتَقارُبُ الأَرواحِ لَيسَ يَضِيرُهُ / بَينَ الدِّيارِ تَباعُدُ الأَجسادِ».',
          'لذلك الإجابة: «متضادّتان».',
        ],
        rule: 'المترادفان: كلمتان تتفقان في المعنى (وفير = كثير). المتضادّان: كلمتان تتقابلان في المعنى (تقارُب × تباعُد).',
        ruleExamples: ['متضادّان: بعيد × قريب، أنجد (مرتفع) × وهاد (منخفض).', 'مترادفان: المَغزى = المقصَد، وفير = كثير.'],
        acceptedAlternatives: ['«مُتَضادَّتان» أو الإشارة إلى الخيار الثاني.'],
        acceptanceLimits:
          'يُردّ «مترادفتان» لتباين المعنيين. ويُردّ «أفعال»: الكلمتان المطبوعتان اسمان على صيغة «تفاعُل»، وإن كانت صيغتهما تشبه الفعل.',
        commonMistakes: ['اختيار «أفعال» لأن الكلمتين على بناء يشبه الفعل الماضي (تقاربَ/تباعدَ).'],
      },
    ),
    q2Subpart(
      4,
      'رُكْنا الجُمْلَةِ الفِعْلِيَّةِ:',
      [
        { id: 'verb_subject', text: 'الفِعْلُ وَالفاعِلُ' },
        { id: 'mubtada', text: 'المُبْتَدَأُ وَالخَبَرُ' },
        { id: 'verb_letter', text: 'الفِعْلُ وَالحَرْفُ' },
      ],
      {
        modelAnswer: '«الفِعْلُ وَالفاعِلُ».',
        solutionSteps: [
          'القاعدة المقفولة في الدرس الثالث (ص ٢٩): «تتألَّفُ الجُملَةُ الفِعليَّةُ مِنْ فِعْلٍ وفاعِلٍ، أَوْ مِنْ فِعْلٍ وفاعِلٍ ومَفْعولٍ بِهِ».',
          'فرُكنا الجملة الفعلية هما: الفعل والفاعل؛ وهما لا يُحذفان، ويأتي المفعول به عنصراً إضافياً عند تعدّي الفعل.',
          'أما «المبتدأ والخبر» فرُكنا الجملة الاسمية، و«الفعل والحرف» ليسا رُكنين للجملة الفعلية.',
          'لذلك الإجابة: «الفعل والفاعل».',
        ],
        rule: 'الجملة الفعلية: فعل + فاعل (ومفعول به إن كان الفعل متعدّياً). الجملة الاسمية: مبتدأ + خبر.',
        ruleExamples: ['«صَنَعَ العُمّالُ مَرْكَباً»: فعل وفاعل ومفعول به.', '«المالُ مُتَوَفِّرٌ»: مبتدأ وخبر.'],
        acceptedAlternatives: ['«الفعل والفاعل» أو الإشارة إلى الخيار الأول.'],
        acceptanceLimits: 'يُردّ «المبتدأ والخبر» لأنهما ركنا الجملة الاسمية، ويُردّ «الفعل والحرف» لعدم كونهما رُكنين.',
        commonMistakes: ['عدّ المفعول به ركناً أساسياً في كل جملة فعلية.'],
      },
    ),
  ],
};

/* ------------------------------------------------------------------ */
/* ص ٣٧ — السؤال ٣                                                    */
/* ------------------------------------------------------------------ */

export const UNIT1_REVIEW_Q3: ReviewQuestion = {
  id: 'u1r-q3',
  sourceRecordId: 'U1R-37-05',
  printedNumber: '٣',
  page: Q2_PAGE,
  section: 'أَسْتَعْمِلُ التَّراكيبَ في كِتابَةِ فِقْرَةٍ',
  instruction:
    'أَسْتَعْمِلُ التَّراكيبَ الآتيةَ في كِتابَةِ فِقْرَةٍ عن أَهَمِّيَّةِ الكِتابِ: (خير جليس – يُغني معارفي – يزيدني ثقةً)',
  layout: 'stack',
  paginateBranches: false,
  kindNote: 'المطلوب مساحة كتابة حرّة كما في صندوق الكتابة الأزرق في المصدر؛ لا خيارات ولا تصحيح آليّ.',
  source: reviewSrc(Q2_PAGE, 'textbook_expression', 'السؤال ٣ — أعبر كتابيًّا', 3),
  subparts: [
    {
      id: 'u1r-q3-s1',
      sourceRecordId: 'U1R-37-05',
      teacherSolutionId: 'u1r-teacher-q3-s1',
      label: 'الفقرة المطلوبة',
      prompt: 'فِقْرَةٌ عن أَهَمِّيَّةِ الكِتابِ تُسْتَعْمَلُ فيها التَّراكيبُ الثَّلاثَةُ.',
      interaction: {
        kind: 'paragraph',
        requiredPhrases: ['خير جليس', 'يُغني معارفي', 'يزيدني ثقةً'],
        rows: 7,
        helperNote: 'اكتب فقرة واحدة مترابطة، وأدخل التراكيب الثلاثة كما هي مطبوعة دون تغيير.',
      },
      graded: true,
      source: reviewSrc(Q2_PAGE, 'textbook_expression', 'السؤال ٣ — أعبر كتابيًّا', 3),
      teacher: {
        id: 'u1r-teacher-q3-s1',
        sourceRecordId: 'U1R-37-05',
        pageNumber: Q2_PAGE,
        printedRef: 'السؤال ٣ (ص ٣٧)',
        questionText: 'استعمال التراكيب: (خير جليس – يُغني معارفي – يزيدني ثقةً) في فقرة عن أهمية الكتاب.',
        modelAnswer:
          'نموذج استرشادي من إعداد المنصة (ليس نصّاً من الكتاب، ويُقدَّم للمعلم للمقارنة لا للنسخ): «أَحْرِصُ على قِراءةِ الكِتابِ لأنَّه خير جليس؛ فهو يُغني معارفي بِما فيهِ من عُلومٍ وأخبارٍ، ويزيدني ثقةً بِنَفسي كلَّما فَهِمتُ ما أقرأُ. وكُلَّما أنهيتُ كتاباً شَعَرتُ أنَّ وَقتي لم يَضِعْ، وأنَّ عَقلي صارَ أوسعَ».\n(التراكيب الثلاثة وردت كما هي: «خير جليس»، «يُغني معارفي»، «يزيدني ثقةً».)',
        solutionSteps: [
          'قراءة المطلوب: فقرة واحدة عن أهمية الكتاب، بشرط استعمال التراكيب الثلاثة المطبوعة كما هي.',
          'تحديد الفكرة الجامعة: الكتاب جليسٌ لا يملّ، ونافعٌ للعقل والثقة بالنفس.',
          'توزيع التراكيب داخل جمل الفقرة، فيكون التركيب جزءاً من معنى الجملة لا مقتطعاً منها.',
          'إضافة جملة افتتاحية وجملة خاتمة تربطان الفقرة بالموضوع (أهمية الكتاب).',
          'مراجعة الفقرة: وجود التراكيب الثلاثة، وترابط المعنى، وسلامة الإملاء وعلامات الترقيم.',
        ],
        rule: 'الفقرة: مجموعة جمل مترابطة في موضوع واحد، لها فكرة واحدة تتقدّم في الجمل من أولها إلى آخرها.',
        ruleExamples: [
          'تركيب مستعمل استعمالاً صحيحاً: «الكِتابُ خير جليس، فهو يُغني معارفي ويزيدني ثقةً».',
          'تركيب مقتطع من معناه: «خير جليس. يُغني معارفي. يزيدني ثقةً» بلا جملة تربطها.',
        ],
        acceptedAlternatives: [
          'يُقبل أي نصّ فقرة يشتمل التراكيب الثلاثة كما هي وموضوعها أهمية الكتاب.',
          'يجوز أن يقدّم المتعلم الفقرة أو يؤخّر ترتيب التراكيب داخلها.',
          'يجوز أن يزيد جملاً توضيحية أو مثالاً من حياته.',
        ],
        acceptanceLimits:
          'يُقبل النصّ فقرةَ متى وردت التراكيب الثلاثة بألفاظها المطبوعة ولم يتغيّر معناها، وكان النصّ متصلاً في موضوع أهمية الكتاب. ولا يُشترط عدد محدّد من الأسطر وإنما مساحة الكتابة في المصدر.',
        commonMistakes: [
          'استعمال تركيب واحد أو اثنين وإغفال الباقي.',
          'تغيير صيغة التركيب (مثل: «خير صديق» بدلاً من «خير جليس»).',
          'كتابة جمل منفصلة غير مترابطة بدلاً من فقرة.',
          'الخروج عن الموضوع إلى موضوع آخر (كالحاسوب أو الرياضة) دون ذكر أهمية الكتاب.',
        ],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* ص ٣٧ — السؤال ٤                                                    */
/* ------------------------------------------------------------------ */

const Q4_PAGE = 37;

const q4Subpart = (
  index: number,
  sentence: string,
  words: string[],
  teacher: Omit<ReviewTeacherSolution, 'id' | 'sourceRecordId' | 'pageNumber' | 'printedRef' | 'questionText'>,
): ReviewSubpart => ({
  id: `u1r-q4-s${index}`,
  sourceRecordId: 'U1R-37-06',
  teacherSolutionId: `u1r-teacher-q4-s${index}`,
  label: `الجملة ${LETTERS[index - 1]}`,
  prompt: sentence,
  interaction: {
    kind: 'pick_and_classify',
    words,
    categories: [
      { id: 'ism', label: 'اسمٌ' },
      { id: 'fil', label: 'فعلٌ' },
      { id: 'harf', label: 'حرفٌ' },
    ],
    gapNote:
      'لم يتيسّر التحقق من تمييز الكلمة الملوّنة في النسخة المتاحة من المصدر (ص ٣٧)، فلا تجزم المنصة بأيّ كلمة مقصودة. اختَرْ من الجملة الكلمةَ الملوّنةَ في كتابك ثم صنِّفها.',
  },
  graded: true,
  source: reviewSrc(
    Q4_PAGE,
    'textbook_grammar',
    'السؤال ٤ — تصنيف الكلمات الملوّنة',
    index,
    reviewUncertaintiesFor('U1R-37-06')[0]?.issue,
  ),
  teacher: {
    id: `u1r-teacher-q4-s${index}`,
    sourceRecordId: 'U1R-37-06',
    pageNumber: Q4_PAGE,
    printedRef: `السؤال ٤ — الجملة ${LETTERS[index - 1]} (ص ٣٧)`,
    questionText: sentence,
    ...teacher,
  },
});

export const UNIT1_REVIEW_Q4: ReviewQuestion = {
  id: 'u1r-q4',
  sourceRecordId: 'U1R-37-06',
  printedNumber: '٤',
  page: Q4_PAGE,
  section: 'أُصَنِّفُ الكَلِماتَ المُلَوَّنَةَ (اسمٌ وفعلٌ وحرفٌ)',
  instruction: 'أُصَنِّفُ الكَلِماتَ المُلَوَّنَةَ في الجُمَلِ الآتيةِ إِلى: (اسمٌ وَفِعْلٌ وَحَرْفٌ)',
  layout: 'stack',
  paginateBranches: true,
  kindNote:
    'تنبيه واجهة (لا سؤال جديد): لا يمكن التحقق من اللون في النسخة المتاحة، فتطلب المنصة من المتعلم تحديد الكلمة الملوّنة من جملته ثم تصنيفها؛ وفي دليل المعلم أنواع كلمات كل جملة كاملةً.',
  source: reviewSrc(Q4_PAGE, 'textbook_grammar', 'السؤال ٤', 4, reviewUncertaintiesFor('U1R-37-06')[0]?.issue),
  subparts: [
    q4Subpart(1, 'رَمى الصَّيّادُ الشِّباكَ في البَحْرِ.', ['رَمى', 'الصَّيّادُ', 'الشِّباكَ', 'في', 'البَحْرِ'], {
      modelAnswer:
        'الكلمة الملوّنة غير محسومة في النسخة المتاحة، وبيانُ أنواع كلمات الجملة كاملاً: «رَمى» فعلٌ، و«الصَّيّادُ» اسمٌ، و«الشِّباكَ» اسمٌ، و«في» حرفٌ، و«البَحْرِ» اسمٌ. فإن كانت الكلمة الملوّنة «في» فالإجابة: حرفٌ؛ وإن كانت «رَمى» فالإجابة: فعلٌ؛ وإن كانت أحد الأسماء («الصيّاد/الشباك/البحر») فالإجابة: اسمٌ.',
      solutionSteps: [
        'نحدّد نوع كل كلمة بالسؤال: هل تدلّ على حدث مقترن بزمن؟ فهي فعل. هل تدلّ على شيء أو شخص أو مكان؟ فهي اسم. هل تربط بين الكلمات ولا معنى لها وحدها؟ فهي حرف.',
        '«رَمى» تدلّ على حدث الصيد (فعل).',
        '«الصيّادُ/الشِّباكَ/البَحْرِ» تدلّ على أشخاص وأشياء وأماكن (أسماء).',
        '«في» تدلّ على معنى الظرفية داخل الجملة ولا تستقل بالمعنى (حرف جر).',
      ],
      rule: 'الفعل: ما دلّ على حدث مقترن بزمن. الاسم: ما دلّ على شخص أو شيء أو مكان أو معنى. الحرف: ما دلّ على معنى في غيره ولم يستقلّ بالمعنى.',
      ruleExamples: ['أسماء: الصيّاد، الشباك، البحر.', 'فعل: رَمى.', 'حرف: في (حرف جر).'],
      acceptedAlternatives: ['يُقبل التصنيف الصحيح للكلمة التي اختارها المتعلم من هذه الجملة.'],
      acceptanceLimits: 'تُقبل الإجابة إذا طابق التصنيف نوعَ الكلمة التي حدّدها المتعلم، ويُصحّح وفق الجدول الكامل أعلاه.',
      irab: [
        { segment: 'رَمى', role: 'فعل ماضٍ مبنيّ على الفتح المقدَّر على الألف (تعذُّر الظهور)، والفاعل بعده.', note: 'الفعل الماضي الناقص بالألف يُقدَّر آخرُه.' },
        { segment: 'الصَّيّادُ', role: 'فاعلٌ مرفوعٌ وعلامةُ رفعه الضمّةُ الظاهرةُ.' },
        { segment: 'الشِّباكَ', role: 'مفعولٌ به منصوبٌ وعلامةُ نصبه الفتحةُ الظاهرةُ.' },
        { segment: 'في', role: 'حرف جرٍّ مبنيّ على السكون لا محلّ له من الإعراب.' },
        { segment: 'البَحْرِ', role: 'اسمٌ مجرورٌ بـ«في» وعلامةُ جرّه الكسرةُ الظاهرةُ، والجار والمجرور متعلّقان بالفعل «رَمى».' },
      ],
      ambiguity: reviewUncertaintiesFor('U1R-37-06')[0]?.issue,
      commonMistakes: [
        'الظنّ أن «في» اسم لأنها تقع بعد الشباك.',
        'تصنيف «البيت/الحديقة/قمحاً» أفعالاً لتوسّطها في الجملة.',
      ],
    }),
    q4Subpart(2, 'سَقى الطِّفْلُ الحَديقةَ.', ['سَقى', 'الطِّفْلُ', 'الحَديقةَ'], {
      modelAnswer:
        'الكلمة الملوّنة غير محسومة في النسخة المتاحة، وبيانُ أنواع كلمات الجملة كاملاً: «سَقى» فعلٌ، و«الطِّفْلُ» اسمٌ، و«الحَديقةَ» اسمٌ. فإن كانت الملوّنة «سَقى» فالإجابة: فعلٌ، وإن كانت إحدى الكلمتين الأخريين فالإجابة: اسمٌ.',
      solutionSteps: [
        '«سَقى» تدلّ على حدث السقي في زمن ماضٍ (فعل ماضٍ).',
        '«الطِّفْلُ» يدلّ على شخص (اسم)، وهو فاعل السقي.',
        '«الحَديقةَ» تدلّ على مكان (اسم)، وهو ما وقع عليه السقي.',
        'ولا يوجد في الجملة حرف مستقلّ، فكلّ كلماتها إمّا فعل أو اسم.',
      ],
      rule: 'الفعل ما دلّ على حدث وزمن، والاسم ما دلّ على شخص أو شيء أو مكان؛ والحرف لا يستقلّ بالمعنى.',
      ruleExamples: ['اسم: الطِّفْل، الحديقة.', 'فعل: سَقى.'],
      acceptedAlternatives: ['يُقبل التصنيف الصحيح للكلمة التي اختارها المتعلم من هذه الجملة.'],
      acceptanceLimits: 'لا تُقبل إجابة «حرف» في هذه الجملة؛ فليس فيها حرف.',
      ambiguity: reviewUncertaintiesFor('U1R-37-06')[0]?.issue,
      irab: [
        { segment: 'سَقى', role: 'فعل ماضٍ مبنيّ على الفتح المقدَّر على الألف.' },
        { segment: 'الطِّفْلُ', role: 'فاعلٌ مرفوعٌ وعلامةُ رفعه الضمّةُ الظاهرةُ.' },
        { segment: 'الحَديقةَ', role: 'مفعولٌ به منصوبٌ وعلامةُ نصبه الفتحةُ الظاهرةُ.' },
      ],
      commonMistakes: ['الحكم على «سَقى» بأنها اسم لأنها كلمة طويلة أو لعدم وجود فعل ظاهر.', 'اختيار «حرف» في جملة لا حرف فيها.'],
    }),
    q4Subpart(3, 'زَرَعَ الفَلّاحُ قَمْحاً.', ['زَرَعَ', 'الفَلّاحُ', 'قَمْحاً'], {
      modelAnswer:
        'الكلمة الملوّنة غير محسومة في النسخة المتاحة، وبيانُ أنواع كلمات الجملة كاملاً: «زَرَعَ» فعلٌ، و«الفَلّاحُ» اسمٌ، و«قَمْحاً» اسمٌ. فإن كانت الملوّنة «زَرَعَ» فالإجابة: فعلٌ، وإن كانت إحدى الكلمتين الأخريين فالإجابة: اسمٌ.',
      solutionSteps: [
        '«زَرَعَ» فعل ماضٍ دلّ على حدث الزرع.',
        '«الفَلّاحُ» اسم يدلّ على من قام بالزرع (الفاعل).',
        '«قَمْحاً» اسم يدلّ على الشيء المزروع (المفعول به)، وهو اسم منوَّن بالفتح.',
        'ولا حرف مستقلّ في الجملة.',
      ],
      rule: 'الاسم يُعرَف بالتنوين، و«قَمْحاً» اسم منوَّن، وبدخول «ال» مثل «الفَلّاحُ».',
      ruleExamples: ['التنوين في «قَمْحاً» علامة اسمية.', '«ال» في «الفَلّاحُ» علامة اسمية.'],
      acceptedAlternatives: ['يُقبل التصنيف الصحيح للكلمة التي اختارها المتعلم من هذه الجملة.'],
      acceptanceLimits: 'لا تُقبل إجابة «حرف» في هذه الجملة؛ فليس فيها حرف.',
      ambiguity: reviewUncertaintiesFor('U1R-37-06')[0]?.issue,
      irab: [
        { segment: 'زَرَعَ', role: 'فعل ماضٍ مبنيّ على الفتح الظاهر على آخره.' },
        { segment: 'الفَلّاحُ', role: 'فاعلٌ مرفوعٌ وعلامةُ رفعه الضمّةُ الظاهرةُ.' },
        { segment: 'قَمْحاً', role: 'مفعولٌ به منصوبٌ وعلامةُ نصبه الفتحةُ الظاهرةُ (مع تنوين الفتح).' },
      ],
      commonMistakes: ['ظنّ أن المنوَّن فعلٌ.', 'إغفال الفاعل وحصر الجملة في الفعل والمفعول.'],
    }),
    q4Subpart(4, 'الحِكْمَةُ لا تُولَدُ إِلّا بِالرَّأْيِ وَالرَّأْيِ الآخَرِ.', ['الحِكْمَةُ', 'لا', 'تُولَدُ', 'إِلّا', 'بِالرَّأْيِ', 'وَالرَّأْيِ', 'الآخَرِ'], {
      modelAnswer:
        'الكلمة الملوّنة غير محسومة في النسخة المتاحة، وبيانُ أنواع كلمات الجملة كاملاً: «الحِكْمَةُ» اسمٌ، و«لا» حرفٌ، و«تُولَدُ» فعلٌ، و«إِلّا» حرفٌ، و«بِالرَّأْيِ» حرف جرّ (الباء) + اسم (الرأي)، و«وَالرَّأْيِ» حرف عطف (الواو) + اسم (الرأي)، و«الآخَرِ» اسمٌ. فإن كانت الملوّنة «تُولَدُ» فالإجابة: فعلٌ، وإن كانت «لا/إلّا» فالإجابة: حرفٌ، وإن كانت أحد الأسماء فالإجابة: اسمٌ.',
      solutionSteps: [
        'الفعل الوحيد في الجملة هو «تُولَدُ»: فعل مضارع يدلّ على حدث الولادة في زمن حاضر.',
        'الأسماء: «الحِكْمَةُ»، «الرَّأْيِ» (في الموضعين)، «الآخَرِ».',
        'الحروف: «لا» النافية، و«إِلّا» أداة الحصر، والباء في «بالرأي» حرف جر، والواو في «والرأي» حرف عطف.',
        'ولذلك إن كانت الكلمة الملوّنة كاملةً «بِالرَّأْيِ» فهي حرف واسم معاً (الباء حرف، والرأي اسم)؛ وإن كان اللون على «الرَّأْيِ» وحده فالإجابة: اسمٌ.',
      ],
      rule: 'قد تدخل الحروف على الأسماء فتختلط في كلمة واحدة: «بالرأي» = باء جر + اسم مجرور، و«والرأي» = واو عطف + اسم معطوف.',
      ruleExamples: ['«في البحر»: حرف + اسم.', '«والرأي الآخر»: واو عطف + اسم + نعت.'],
      acceptedAlternatives: [
        'يُقبل التصنيف الصحيح للكلمة التي اختارها المتعلم من هذه الجملة.',
        'أن يكتب المتعلم في «بِالرَّأْيِ»: حرفٌ واسمٌ معاً، مع بيان أنّ الباء حرف.',
      ],
      acceptanceLimits:
        'إذا كان اللون يشمل الباء فالإجابة الصحيحة «حرف واسم»؛ وإن كان على «الرأي» وحده فالإجابة «اسم». ولا يُقبل أن يُصنَّف «تُولَدُ» اسماً.',
      irab: [
        { segment: 'الحِكْمَةُ', role: 'مبتدأٌ مرفوعٌ وعلامةُ رفعه الضمّةُ الظاهرةُ.' },
        { segment: 'لا', role: 'حرف نفيٍ مبنيّ على السكون لا محلّ له من الإعراب.' },
        { segment: 'تُولَدُ', role: 'فعلٌ مضارعٌ مرفوعٌ وعلامةُ رفعه الضمّةُ الظاهرةُ، والفاعل مستتر تقديره «هي».' },
        { segment: 'إِلّا', role: 'أداة حصرٍ (حرف) مبنيّة على السكون لا محلّ لها من الإعراب.' },
        { segment: 'بِالرَّأْيِ', role: 'الباء حرف جرّ، و«الرَّأْيِ» اسمٌ مجرورٌ وعلامةُ جرّه الكسرةُ الظاهرةُ، والجار والمجرور متعلّقان بالفعل «تُولَدُ».' },
        { segment: 'وَالرَّأْيِ الآخَرِ', role: 'الواو حرفُ عطفٍ، و«الرَّأْيِ» اسمٌ معطوفٌ مجرورٌ وعلامةُ جرّه الكسرةُ، و«الآخَرِ» نعتٌ مجرورٌ وعلامةُ جرّه الكسرةُ الظاهرةُ.' },
      ],
      ambiguity: reviewUncertaintiesFor('U1R-37-06')[0]?.issue,
      commonMistakes: [
        'عدّ «لا» أو «إلّا» اسمين.',
        'إغفال أن الباء والواو حرفان عندما تكون الكلمة الملوّنة كاملة.',
        'تصنيف «الآخَرِ» فعلاً لأنها موصوفة بعلامة جرّ.',
      ],
    }),
  ],
};

/* ------------------------------------------------------------------ */
/* ص ٣٧ — السؤال ٥                                                    */
/* ------------------------------------------------------------------ */

const Q5_PAGE = 37;
const Q5_SENTENCE =
  'إِنَّ تَبادُلَنا الأَفْكارَ وَالإِصْغاءَ بِاِهْتِمامٍ يَصِلانِ بِنا إِلى تَحْقيقِ أَفْضَلِ النَّتائِجِ، وَالفَهْمِ الصَّحيحِ لِلأُمورِ.';

const q5Subpart = (
  field: 'cause' | 'result1' | 'result2',
  label: string,
  teacher: Omit<ReviewTeacherSolution, 'id' | 'sourceRecordId' | 'pageNumber' | 'printedRef' | 'questionText'>,
): ReviewSubpart => {
  const index = field === 'cause' ? 1 : field === 'result1' ? 2 : 3;
  return {
    id: `u1r-q5-s${index}`,
    sourceRecordId: 'U1R-37-07',
    teacherSolutionId: `u1r-teacher-q5-s${index}`,
    label,
    prompt: Q5_SENTENCE,
    interaction: { kind: 'short_field', label, rows: 2, placeholder: 'اكتب هنا' },
    graded: true,
    source: reviewSrc(
      Q5_PAGE,
      'textbook_grammar',
      'السؤال ٥ — السبب والنتيجتان',
      index,
      reviewUncertaintiesFor('U1R-37-07')[0]?.issue,
    ),
    teacher: {
      id: `u1r-teacher-q5-s${index}`,
      sourceRecordId: 'U1R-37-07',
      pageNumber: Q5_PAGE,
      printedRef: `السؤال ٥ — ${label} (ص ٣٧)`,
      questionText: Q5_SENTENCE,
      ...teacher,
    },
  };
};

export const UNIT1_REVIEW_Q5: ReviewQuestion = {
  id: 'u1r-q5',
  sourceRecordId: 'U1R-37-07',
  printedNumber: '٥',
  page: Q5_PAGE,
  section: 'في العِبارَةِ سَبَبٌ وَنَتيجَتانِ',
  instruction: 'في العِبارَةِ الآتيةِ سَبَبٌ وَنَتيجَتان:',
  sharedText: Q5_SENTENCE,
  layout: 'cause_result',
  paginateBranches: false,
  kindNote:
    'اللافتات المطبوعة في المصدر هي: «السَّبَبُ (١)» و«نتيجته (١)» و«نتيجته (٢)»، ونصّ السؤال يعلن سبباً واحداً ونتيجتين؛ فاعتُمدت ثلاث خانات مطابقة.',
  source: reviewSrc(Q5_PAGE, 'textbook_grammar', 'السؤال ٥', 5, reviewUncertaintiesFor('U1R-37-07')[0]?.issue),
  subparts: [
    q5Subpart('cause', 'السَّبَبُ (١)', {
      modelAnswer: '«تَبادُلُنا الأَفْكارَ وَالإِصْغاءُ بِاِهْتِمامٍ».',
      solutionSteps: [
        'نسأل: ما الذي يجعلنا نَصِل إلى أفضل النتائج؟ فنجد الجواب في أول الجملة: «تَبادُلُنا الأفكارَ والإصغاءُ باهتمام».',
        'وهو ما أُسند إليه الوصولُ؛ فسببه تبادل الأفكار والإصغاء معاً لا أحدهما وحده.',
        'وهو اسم «إنّ» في الجملة، منصوبٌ.',
      ],
      rule: 'السبب: ما يُؤدّي إلى النتيجة. والنتيجة: ما يحدث بسبب ذلك.',
      ruleExamples: ['سبب: تبادل الأفكار والإصغاء.', 'نتيجة: تحقيق أفضل النتائج.'],
      acceptedAlternatives: [
        'تبادلنا الأفكار والإصغاء باهتمام.',
        'تبادل الأفكار والإصغاء باهتمام.',
        'الأفكار والإصغاء باهتمام.',
      ],
      acceptanceLimits:
        'يُقبل ذكر العنصرين معاً (تبادل الأفكار + الإصغاء باهتمام) ولو بصياغة مختلفة. ويُنتبَّه إلى أن الاقتصار على «الإصغاء» وحده أو «تبادل الأفكار» وحده يقتطع السبب.',
      irab: [
        { segment: 'إِنَّ', role: 'حرفُ توكيدٍ ونصبٍ مبنيٌّ على الفتح لا محلّ له من الإعراب.' },
        { segment: 'تَبادُلَنا', role: 'اسمُ «إنّ» منصوبٌ وعلامةُ نصبه الفتحةُ الظاهرةُ، وهو مضاف، و«نا» ضميرٌ متّصلٌ مبنيٌّ في محلّ جرٍّ مضافاً إليه.' },
        { segment: 'الأَفْكارَ', role: 'مفعولٌ به لاسم المصدر «تبادل» منصوبٌ وعلامةُ نصبه الفتحةُ الظاهرةُ.' },
        { segment: 'وَالإِصْغاءَ', role: 'الواو حرفُ عطفٍ، و«الإصغاءَ» معطوفٌ على «تَبادُلَنا» منصوبٌ وعلامةُ نصبه الفتحةُ الظاهرةُ.' },
        { segment: 'بِاِهْتِمامٍ', role: 'الباء حرف جرّ، و«اهتمامٍ» اسمٌ مجرورٌ وعلامةُ جرّه الكسرةُ، والجار والمجرور متعلّقان بالمصدر «الإصغاء».' },
        { segment: 'يَصِلانِ', role: 'فعلٌ مضارعٌ مرفوعٌ وعلامةُ رفعه ثبوتُ النونِ؛ لأنه من الأفعال الخمسة، وألفُ الاثنين ضميرٌ متّصلٌ في محلّ رفعٍ فاعلٌ.' },
        { segment: 'بِنا', role: 'الباء حرف جرّ، و«نا» ضميرٌ متّصلٌ في محلّ جرٍّ، والجار والمجرور متعلّقان بالفعل «يَصِلانِ».' },
        { segment: 'إِلى تَحْقيقِ', role: '«إلى» حرف جرّ، و«تحقيقِ» اسمٌ مجرورٌ وعلامةُ جرّه الكسرةُ، والجار والمجرور متعلّقان بالفعل «يَصِلانِ».' },
        { segment: 'أَفْضَلِ النَّتائِجِ', role: '«أفضلِ» مضافٌ إليه مجرورٌ وعلامةُ جرّه الكسرةُ (وهو مضاف)، و«النَّتائِجِ» مضافٌ إليه مجرورٌ وعلامةُ جرّه الكسرةُ.' },
        { segment: 'وَالْفَهْمِ الصَّحيحِ', role: 'الواو حرفُ عطفٍ، و«الفَهْمِ» معطوفٌ على «تَحْقيقِ» مجرورٌ وعلامةُ جرّه الكسرةُ، و«الصَّحيحِ» نعتٌ مجرورٌ وعلامةُ جرّه الكسرةُ.' },
        { segment: 'لِلأُمورِ', role: 'اللام حرف جرّ، و«الأمورِ» اسمٌ مجرورٌ وعلامةُ جرّه الكسرةُ، والجار والمجرور متعلّقان بـ«الفهم» (أو بنعته «الصحيح»).' },
      ],
      ambiguity: reviewUncertaintiesFor('U1R-37-07')[0]?.issue,
      commonMistakes: ['ذكر «تحقيق أفضل النتائج» سبباً بدل النتيجة.', 'حصر السبب في الإصغاء وحده.'],
    }),
    q5Subpart('result1', 'نَتيجَتُهُ (١)', {
      modelAnswer: '«تَحْقيقُ أَفْضَلِ النَّتائِجِ».',
      solutionSteps: [
        'نسأل: إلى أي شيء أنتج تبادلُ الأفكار والإصغاء؟ الجواب الأول: «تحقيق أفضل النتائج».',
        'وهي النتيجة الأولى، وقد عُطفت عليها نتيجة ثانية في آخر الجملة.',
      ],
      rule: 'تُرتب النتائج بحسب ورودها في النصّ.',
      acceptedAlternatives: ['تحقيق أفضل النتائج.', 'الوصول إلى أفضل النتائج.'],
      acceptanceLimits: 'يُقبل المعنى نفسه ولو اختلف اللفظ اليسير (تحقيق/الوصول إلى)، مع بقاء «أفضل النتائج».',
      commonMistakes: ['الاقتصار على «النتائج» وحذف «أفضل» التي وردت في النصّ.'],
    }),
    q5Subpart('result2', 'نَتيجَتُهُ (٢)', {
      modelAnswer: '«الفَهْمُ الصَّحيحُ لِلأُمورِ».',
      solutionSteps: [
        'النتيجة الثانية معطوفة على الأولى بعد الفاصلة: «وَالْفَهْمِ الصَّحيحِ لِلأُمورِ».',
        'فالتبادل والإصغاء يُنتجان أيضاً الفهم الصحيح للأمور.',
      ],
      rule: 'تُعطف النتيجة الثانية على الأولى بحرف العطف «الواو»، وتبقى على إعرابها (مجرورةً هنا بالعطف على «تحقيق»).',
      acceptedAlternatives: ['الفهم الصحيح للأمور.', 'فهم الأمور فهماً صحيحاً.'],
      acceptanceLimits:
        'يُقبل المعنى نفسه. ومن اضطرّ إلى تعديل الإعراب جاز أن يعطف على «تحقيق» (والفهمِ) أو أن يجعلها معمولاً للفعل «يَصِلانِ» في المعنى؛ والمهم أن تُحدَّد النتيجة الثانية كما وردت في العبارة.',
      commonMistakes: ['إغفال النتيجة الثانية لوجود الفاصلة قبلها.', 'عكس الترتيب: جعل «الفهم الصحيح» النتيجة الأولى.'],
    }),
  ],
};

/* ------------------------------------------------------------------ */
/* ص ٣٨ — السؤال ٦                                                    */
/* ------------------------------------------------------------------ */

const Q6_PAGE = 38;
const Q6_CENTER_WORD = 'إعلان';

const q6Subpart = (
  index: number,
  label: string,
  teacher: Omit<ReviewTeacherSolution, 'id' | 'sourceRecordId' | 'pageNumber' | 'printedRef' | 'questionText'>,
  placeholder: string,
): ReviewSubpart => ({
  id: `u1r-q6-s${index}`,
  sourceRecordId: 'U1R-38-08',
  teacherSolutionId: `u1r-teacher-q6-s${index}`,
  label,
  prompt: `المُخَطَّط: كلمة «${Q6_CENTER_WORD}» — دائرة «${label}».`,
  interaction: { kind: 'short_field', label, rows: 1, placeholder },
  graded: true,
  source: reviewSrc(
    Q6_PAGE,
    'textbook_grammar',
    'السؤال ٦ — إكمال المخطط',
    index,
    reviewUncertaintiesFor('U1R-38-08')[0]?.issue,
  ),
  teacher: {
    id: `u1r-teacher-q6-s${index}`,
    sourceRecordId: 'U1R-38-08',
    pageNumber: Q6_PAGE,
    printedRef: `السؤال ٦ — دائرة «${label}» (ص ٣٨)`,
    questionText: `إكمال دائرة «${label}» في مخطط كلمة «${Q6_CENTER_WORD}».`,
    ...teacher,
  },
});

export const UNIT1_REVIEW_Q6: ReviewQuestion = {
  id: 'u1r-q6',
  sourceRecordId: 'U1R-38-08',
  printedNumber: '٦',
  page: Q6_PAGE,
  section: 'أُكْمِلُ المُخَطَّطَ',
  instruction: 'أُكْمِلُ المُخَطَّطَ الآتي:',
  layout: 'word_map',
  paginateBranches: false,
  kindNote:
    'الكلمة المركزية في المخطط تُقرأ «إعلان»، وهي المقصودة في الدوائر الأربع: فعلها، نوعها، معناها، ضدها.',
  source: reviewSrc(Q6_PAGE, 'textbook_grammar', 'السؤال ٦', 6, reviewUncertaintiesFor('U1R-38-08')[0]?.issue),
  subparts: [
    q6Subpart(1, 'فعلُها', {
      modelAnswer: '«أَعْلَنَ» فعل ماضٍ رباعي مبدوء بهمزة قطع.',
      solutionSteps: [
        '«إعلان» مصدرٌ على وزن «إفعال»، وفعله الرباعي: «أَعْلَنَ».',
        'ننطق الفعل ونحدّد زمنه: «أَعْلَنَ» فعل ماضٍ، ومضارعه «يُعْلِنُ»، وأمره «أَعْلِنْ»، ومصدره «إعلان».',
        'فالفعل المطلوب في الدائرة: «أَعْلَنَ».',
      ],
      rule: 'مصادر الأفعال الرباعية تكون على وزن «إفعال»: أعلنَ ← إعلان، أكرمَ ← إكرام، أنجزَ ← إنجاز.',
      ruleExamples: ['أَعْلَنَ ← إعلان.', 'أَكْرَمَ ← إكرام.', 'أَنْجَزَ ← إنجاز.'],
      acceptedAlternatives: ['أَعْلَنَ.', 'يُعْلِنُ (مع بيان أنه مضارع الفعل نفسه).'],
      acceptanceLimits: 'يُقبل الفعل «أعلن» بأي صيغة زمنية صحيحة مع تسمية الزمن، ويُردّ «عَلَنَ» أو «عَلَّنَ» لأنهما ليسا فعله.',
      ambiguity:
        'الكلمة المركزية في المخطط تُقرأ «إعلان»، ويحتمل رسمها قراءةً أخرى («إعلام»)؛ فإن كانت المطبوعة «إعلام» ففعلها «أَعْلَمَ» ونوعها اسم (مصدر) ومعناها الإخبار والتعريف بالأمر وضدّها الإخفاء أو التجهيل. طُلب قصّ مكبّر للدائرة لتثبيت إحدى القراءتين.',
      commonMistakes: ['كتابة «عَلَنَ» بحذف الهمزة.', 'كتابة الفعل الثلاثي «عَلِمَ» لالتباس المعنى.'],
    }, 'اكتب الفعل'),
    q6Subpart(2, 'نوعُها', {
      modelAnswer: 'اسمٌ (مصدرٌ رباعي على وزن «إفعال»)، وليس فعلاً ولا حرفاً.',
      solutionSteps: [
        'نسأل: هل تدلّ «إعلان» على حدث مقترن بزمن؟ لا؛ فهي لا تدلّ على زمن، بل على الحدث نفسه.',
        'هل هي حرف لا يستقلّ بالمعنى؟ لا؛ لها معنى مستقلّ.',
        'لذلك هي اسمٌ، وهي من نوع المصادر (مصدر الفعل الرباعي «أعلن»).',
      ],
      rule: 'الاسم ما دلّ على معنى في نفسه دون زمن. والمصدر اسمٌ يدلّ على الحدث مجرّداً من الزمن.',
      ruleExamples: ['إعلان ← إخبار وبيان.', 'إكرام ← تكريم.'],
      acceptedAlternatives: ['اسمٌ.', 'اسمٌ (مصدرٌ).'],
      acceptanceLimits: 'تُقبل «اسم» أو «مصدر» مع تسميته اسماً؛ ويُردّ «فعل» و«حرف».',
      ambiguity:
        'الكلمة المركزية في المخطط تُقرأ «إعلان»، ويحتمل رسمها قراءةً أخرى («إعلام»)؛ فإن كانت المطبوعة «إعلام» ففعلها «أَعْلَمَ» ونوعها اسم (مصدر) ومعناها الإخبار والتعريف بالأمر وضدّها الإخفاء أو التجهيل. طُلب قصّ مكبّر للدائرة لتثبيت إحدى القراءتين.',

      commonMistakes: ['الحكم بأنها فعل لوجود حروف الفعل «أعلن» داخلها.'],
    }, 'اسم / فعل / حرف'),
    q6Subpart(3, 'معناها', {
      modelAnswer: 'الإخبار عن أمرٍ وإظهارُه للناس؛ أي: البيان والإبلاغ.',
      solutionSteps: [
        'نستعمل الكلمة في جملة: «أعلن المديرُ نتائجَ المسابقة»؛ فالمعنى: أخبر الناس بها وأظهرها.',
        'فمعنى «الإعلان»: إخبار الجمهور بأمر وإظهاره لهم.',
        'وقد ورد في الدرس الأول «تَصميمُ المُطَوِّيَّةِ (الإعلانِ)»؛ فالمطويّة أداة إعلان تُخبر الناس بأمر.',
      ],
      rule: 'الإعلان: إخبار الناس بأمرٍ وإظهاره لهم. ومنه: أعلن، إعلان، مُعلَن، إعلانات.',
      ruleExamples: ['أعلنت المدرسة عن مسابقة القراءة.', 'إعلانٌ على جدار المدرسة.'],
      acceptedAlternatives: ['الإخبار.', 'الإبلاغ.', 'البيان.', 'الإعلام والإخبار عن أمر.'],
      acceptanceLimits: 'تُقبل أي صياغة تؤدّي معنى الإخبار والإظهار للناس؛ ويُردّ ما يخالف المعنى مثل «الكتابة» أو «القراءة» أو «الصمت».',
      ambiguity:
        'الكلمة المركزية في المخطط تُقرأ «إعلان»، ويحتمل رسمها قراءةً أخرى («إعلام»)؛ فإن كانت المطبوعة «إعلام» ففعلها «أَعْلَمَ» ونوعها اسم (مصدر) ومعناها الإخبار والتعريف بالأمر وضدّها الإخفاء أو التجهيل. طُلب قصّ مكبّر للدائرة لتثبيت إحدى القراءتين.',

      commonMistakes: ['الاقتصار على «الكلام» بلا معنى الإخبار.', 'الخلط بين الإعلان والإعلام في المعنى الدقيق.'],
    }, 'اكتب المعنى'),
    q6Subpart(4, 'ضدُّها', {
      modelAnswer: 'الإخفاءُ / الكِتمانُ (التكتّم)، فالإعلان إظهارٌ وإخبار، وضدّه إخفاءٌ وكتمان.',
      solutionSteps: [
        'نطلب معنى الإعلان: إظهار الأمر وإخبار الناس به.',
        'فما يقابله؟ إخفاؤه وستره وعدم إخبار الناس به.',
        'فتكون الأضداد: الإخفاء، الكِتمان، التكتّم، السِّرّ (على جهة المقابلة).',
      ],
      rule: 'الضدّ: كلمة تقابل الأخرى في المعنى تقابلًا تامًّا (إعلان × إخفاء).',
      ruleExamples: ['تقارب × تباعد.', 'الوفير × القليل.', 'الإعلان × الإخفاء.'],
      acceptedAlternatives: ['الإخفاء.', 'الكِتمان.', 'التكتّم.', 'الكتمان والإسرار.'],
      acceptanceLimits: 'تُقبل الأضداد التي تقابل معنى الإظهار والإخبار؛ ولا تُقبل كلمات في المعنى نفسه مثل «البيان» أو «الإعلام».',
      ambiguity:
        'الكلمة المركزية في المخطط تُقرأ «إعلان»، ويحتمل رسمها قراءةً أخرى («إعلام»)؛ فإن كانت المطبوعة «إعلام» ففعلها «أَعْلَمَ» ونوعها اسم (مصدر) ومعناها الإخبار والتعريف بالأمر وضدّها الإخفاء أو التجهيل. طُلب قصّ مكبّر للدائرة لتثبيت إحدى القراءتين.',

      commonMistakes: ['كتابة مرادف بدل الضدّ (مثل: الإبلاغ).', 'كتابة «الجهل» لأنها ضدّ المعرفة لا ضدّ الإعلان.'],
    }, 'اكتب الضدّ'),
  ],
};

/* ------------------------------------------------------------------ */
/* ص ٣٨ — السؤال ٧                                                    */
/* ------------------------------------------------------------------ */

const Q7_PAGE = 38;

const q7Subpart = (
  index: number,
  before: string,
  after: string,
  teacher: Omit<ReviewTeacherSolution, 'id' | 'sourceRecordId' | 'pageNumber' | 'printedRef' | 'questionText'>,
): ReviewSubpart => ({
  id: `u1r-q7-s${index}`,
  sourceRecordId: 'U1R-38-09',
  teacherSolutionId: `u1r-teacher-q7-s${index}`,
  label: `الفراغ ${LETTERS[index - 1]}`,
  prompt: `${before} ............... ${after}`,
  interaction: { kind: 'inline_blank', before, after },
  graded: true,
  source: reviewSrc(Q7_PAGE, 'textbook_spelling', 'السؤال ٧ — إكمال الفراغ', index),
  teacher: {
    id: `u1r-teacher-q7-s${index}`,
    sourceRecordId: 'U1R-38-09',
    pageNumber: Q7_PAGE,
    printedRef: `السؤال ٧ — الفراغ ${LETTERS[index - 1]} (ص ٣٨)`,
    questionText: `${before} ............... ${after}`,
    ...teacher,
  },
});

export const UNIT1_REVIEW_Q7: ReviewQuestion = {
  id: 'u1r-q7',
  sourceRecordId: 'U1R-38-09',
  printedNumber: '٧',
  page: Q7_PAGE,
  section: 'أُكْمِلُ الفَراغَ',
  instruction: 'أُكْمِلُ الفَراغَ في كُلٍّ مِمَّا يَأْتي:',
  layout: 'stack',
  paginateBranches: false,
  source: reviewSrc(Q7_PAGE, 'textbook_spelling', 'السؤال ٧', 7),
  subparts: [
    q7Subpart(1, 'الهَمْزَةُ', 'هَمْزَةٌ تَقَعُ أَوَّلَ الكَلِمَةِ.', {
      modelAnswer: '«الأُوَّلِيَّةُ»؛ فالتقدير: «الهمزةُ الأُوَّلِيَّةُ همزةٌ تقعُ أوَّلَ الكلمةِ».',
      solutionSteps: [
        'الفراغ يطلب صفة للهمزة، والجملة بعده تفسّرها: «همزةٌ تقعُ أوَّلَ الكلمةِ».',
        'والهمزة الواقعة في أول الكلمة تُسمّى: الهمزةَ الأوَّلِيَّةَ (وهو عنوان إملاء الدرس الأول ص ٩).',
        'وهي قسمان: همزة قطع وهمزة وصل.',
      ],
      rule: 'الهمزة الأولية: الهمزة الواقعة في أول الكلمة، وتنقسم إلى همزة قطع وهمزة وصل.',
      ruleExamples: ['همزة أولية قطع: أَرْغَبُ، إِكْرامي.', 'همزة أولية وصل: امْنَحْني، اقْتِناءِ.'],
      acceptedAlternatives: ['الأُوَّلِيَّةُ.', 'الأَوَّلِيَّةُ (بلا شدّة على الواو).', 'الهمزة الأولية.'],
      acceptanceLimits: 'تُقبل الكلمة بصورة «الأولية» أو «الأوّلية»؛ ولا يُقبل ما يخالف معنى «الواقعة في أول الكلمة».',
      commonMistakes: ['كتابة «القَطْع» أو «الوَصْل» في هذا الفراغ؛ فهاتان صفتان داخل الأولية لا مرادفتان لها.'],
    }),
    q7Subpart(2, 'هَمْزَةُ', 'هَمْزَةٌ أَوَّلِيَّةٌ تُكْتَبُ أَلِفاً وَتُلْفَظُ في أَوَّلِ الكَلامِ، وَتُكْتَبُ وَلا تُلْفَظُ في أَثْناءِ الكَلامِ.', {
      modelAnswer: '«الوَصْلِ»؛ فالتقدير: «همزةُ الوصلِ همزةٌ أوَّلِيَّةٌ…».',
      solutionSteps: [
        'نطابق الوصف المذكور: همزة تُكتب ألفاً، وتُلفظ إذا بدأنا بها الكلام، وتسقط من النطق إذا وصلناها بما قبلها.',
        'هذا الوصف هو وصف همزة الوصل بالإجماع في مادة الوحدة.',
        'من أمثلتها: «امْنَحْني»، «اقْتِناءِ»، «انْظُرْ»، «اسْتَفِدْ».',
      ],
      rule: 'همزة الوصل: تُكتب ألفاً بلا رأس همزة، وتُلفظ في أول الكلام، وتسقط من النطق عند وصل الكلام.',
      ruleExamples: ['«اسْتَفِدْ» تبدأ بألف وصل بلا همزة مرسومة.', '«اقْتِناءِ» تُلفظ عند الابتداء وتسقط عند الوصل.'],
      acceptedAlternatives: ['الوَصْلِ.', 'همزة الوصل.'],
      acceptanceLimits: 'تُقبل «الوصل» بكتابة صحيحة (وصل / الوصل)، ولا يُقبل «القطع» لأن همزة القطع تُلفظ دائماً.',
      commonMistakes: ['اختيار «القطع» لأن الصفة تذكر الكتابة بالألف.', 'الخطأ في كتابة الكلمة نفسها بإسقاط «ال» أو تغيير رسمها.'],
    }),
    q7Subpart(3, 'هَمْزَةُ', 'هَمْزَةٌ أَوَّلِيَّةٌ تُكْتَبُ وَتُلْفَظُ، وَتُرْسَمُ فَوْقَ الأَلِفِ أَوْ تَحْتَها.', {
      modelAnswer: '«القَطْعِ»؛ فالتقدير: «همزةُ القطعِ همزةٌ أوَّلِيَّةٌ…».',
      solutionSteps: [
        'الوصف يذكر أنها تُكتب وتُلفظ دائماً، وأنها تُرسم فوق الألف أو تحته.',
        'الهمزة التي تُلفظ دائماً هي همزة القطع، وتُرسم فوق الألف إذا كانت مفتوحة أو مضمومة (أَ / أُ)، وتحته إذا كانت مكسورة (إِ).',
        'ومن أمثلتها: «أُريدُ»، «أَرْغَبُ»، «إِكْرامي»، «إِنْجازاتِهِمْ»، وكذلك «إعلان» في السؤال السادس.',
      ],
      rule: 'همزة القطع: تُكتب وتُلفظ دائماً، ويُحدَّد موضع رسمها بالحركة: فوق الألف (أَ / أُ) وتحتها (إِ).',
      ruleExamples: ['أُريدُ، أَرْغَبُ (فوق الألف).', 'إِكْرامي، إِنْجازاتِهِمْ، إعلان (تحت الألف).'],
      acceptedAlternatives: ['القَطْعِ.', 'همزة القطع.'],
      acceptanceLimits: 'تُقبل «القطع»، ولا يُقبل «الوصل» لأن همزة الوصل تسقط من النطق عند الوصل.',
      commonMistakes: ['اختيار «الوصل» لأن العبارة تذكر الرسم فوق الألف وتحته.', 'عدم التمييز بين موضع الرسم وحركة الهمزة.'],
    }),
  ],
};

/* ------------------------------------------------------------------ */
/* ص ٣٨ — خاتمة الوحدة                                                */
/* ------------------------------------------------------------------ */

export const UNIT1_REVIEW_CLOSING: ReviewClosingRecord = {
  id: 'U1R-38-10',
  instruction: 'بَعْدَ اِنْتِهائي من دِراسَةِ الوَحْدَةِ',
  intro: 'بندان شخصيان مطبوعان في نهاية التقويم يمثّلان تقويم المتعلم لنفسه بعد دراسة الوحدة.',
  source: reviewSrc(
    38,
    'textbook_expression',
    'تقويم الوحدة — خاتمة الوحدة',
    8,
    reviewUncertaintiesFor('U1R-38-10')[0]?.issue,
  ),
  subparts: [
    {
      id: 'u1r-close-s1',
      sourceRecordId: 'U1R-38-10',
      teacherSolutionId: 'u1r-teacher-close-s1',
      label: 'ما أضيفه إلى معلوماتي',
      prompt: 'بَعْدَ اِنْتِهائي من دِراسَةِ الوَحْدَةِ أُضيفُ إِلى مَعلوماتي:',
      interaction: { kind: 'writing_field', label: 'أُضيفُ إلى مَعلوماتي', rows: 3 },
      graded: false,
      source: reviewSrc(38, 'textbook_expression', 'خاتمة الوحدة', 1),
      teacher: {
        id: 'u1r-teacher-close-s1',
        sourceRecordId: 'U1R-38-10',
        pageNumber: 38,
        printedRef: 'خاتمة الوحدة — البند ١ (ص ٣٨)',
        questionText: 'بعد انتهائي من دراسة الوحدة أضيف إلى معلوماتي: …',
        modelAnswer:
          'إجابة شخصية مفتوحة؛ لا يوجد جواب واحد. ويُتوقّع أن يذكر المتعلم معلومة تعلّمها في الوحدة الأولى، من مثل: التعاون أساس النجاح، أو أن المصدر اسم يدل على حدث مجرّد من الزمن، أو الفرق بين همزة القطع وهمزة الوصل، أو أركان الجملة الفعلية، أو الجملة الاسمية والفعلية.',
        solutionSteps: [
          'تُقرأ الإجابة وتُقارن بمحتوى دروس الوحدة الثلاثة (السمكة الذهبية، بالرأي والرأي الآخر، لغتي).',
          'تُقبل المعلومة الشخصية إذا كانت مستمدّة من الوحدة ولم تكن مخالفة لقواعدها.',
          'يمكن للمعلم أن يعرض جملة أو جملتين من إجابات المتعلمين المتميّزة لتحفيز البقية.',
        ],
        acceptedAlternatives: [
          'أي معلومة صحيحة من دروس الوحدة: قاعدة إملائية، أو قاعدة نحوية، أو قيمة تربوية، أو فكرة من نصّ.',
          'يجوز أن يذكر المتعلم أكثر من معلومة واحدة.',
        ],
        acceptanceLimits:
          'تُقبل الإجابة إذا كانت صحيحة ومن الوحدة؛ ويُناقش المتعلم بلطف إذا كتب معلومة غير دقيقة. ولا تُعطى درجة على هذه الخانة؛ فهي تقويم ذاتي.',
        commonMistakes: ['كتابة «لا أعرف» بلا محاولة.', 'ذكر معلومة من خارج الوحدة مع نسبتها إليها.'],
      },
    },
    {
      id: 'u1r-close-s2',
      sourceRecordId: 'U1R-38-10',
      teacherSolutionId: 'u1r-teacher-close-s2',
      label: 'المهارة التي أتقنها',
      prompt: 'المَهارَةُ التي أُتْقِنُها بَعْدَ دِراسَةِ هذه الوَحْدَةِ:',
      interaction: { kind: 'writing_field', label: 'المَهارَةُ التي أُتْقِنُها', rows: 3 },
      graded: false,
      source: reviewSrc(
        38,
        'textbook_expression',
        'خاتمة الوحدة',
        2,
        reviewUncertaintiesFor('U1R-38-10')[0]?.issue,
      ),
      teacher: {
        id: 'u1r-teacher-close-s2',
        sourceRecordId: 'U1R-38-10',
        pageNumber: 38,
        printedRef: 'خاتمة الوحدة — البند ٢ (ص ٣٨)',
        questionText: 'المهارة التي أتقنها بعد دراسة هذه الوحدة: …',
        modelAnswer:
          'إجابة شخصية مفتوحة؛ ويُتوقّع مهارة مما تدرب عليه المتعلم في الوحدة، من مثل: إجراء مقابلة صحفية، أو التمييز بين همزة القطع وهمزة الوصل، أو إعراب المفعول به، أو تعيين أركان الجملة الفعلية، أو استخراج الأضداد من النص.',
        solutionSteps: [
          'تُقرأ المهارة ويُتحقّق من أنها مهارة عملية مقيسة (يفعلها المتعلم) لا معلومة نظرية.',
          'يمكن للمعلم أن يطلب مثالاً واحداً يُظهر إتقان المهارة (جملة يعربها، أو كلمة يصنّف همزتها).',
          'تُستثمر الإجابات في تخطيط الدعم للأفراد.',
        ],
        acceptedAlternatives: ['أي مهارة من مهارات الوحدة ومهاراتها اللغوية والخطية والمحادثة.', 'يجوز ذكر أكثر من مهارة.'],
        acceptanceLimits: 'هذه خانة تقويم ذاتي لا تُعطى عليها درجة، وتُقبل المهارة إذا كانت من الوحدة وعبّر عنها المتعلم بوضوح.',
        ambiguity: reviewUncertaintiesFor('U1R-38-10')[0]?.issue,
        commonMistakes: ['كتابة موضوع نصّ بدلاً من مهارة.', 'ذكر مهارة عامة لا صلة لها بالوحدة (مثل: السباحة).'],
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Registries                                                         */
/* ------------------------------------------------------------------ */

/** The seven printed, numbered questions, in printed order. */
export const UNIT1_REVIEW_QUESTIONS: ReviewQuestion[] = [
  UNIT1_REVIEW_Q1,
  UNIT1_REVIEW_Q2,
  UNIT1_REVIEW_Q3,
  UNIT1_REVIEW_Q4,
  UNIT1_REVIEW_Q5,
  UNIT1_REVIEW_Q6,
  UNIT1_REVIEW_Q7,
];

/** All student-side elements of the review (every printed branch). */
export const UNIT1_REVIEW_ALL_SUBPARTS: ReviewSubpart[] = [
  ...UNIT1_REVIEW_TIMING.subparts,
  ...UNIT1_REVIEW_INSTRUCTIONS.subparts,
  ...UNIT1_REVIEW_QUESTIONS.flatMap((question) => question.subparts),
  ...UNIT1_REVIEW_CLOSING.subparts,
];

/** Number of printed question branches the learner answers (23). */
export const UNIT1_REVIEW_ANSWERABLE_BRANCHES = UNIT1_REVIEW_QUESTIONS.reduce(
  (total, question) => total + question.subparts.length,
  0,
);

export function getReviewQuestionByPrintedNumber(printedNumber: string): ReviewQuestion | undefined {
  return UNIT1_REVIEW_QUESTIONS.find((question) => question.printedNumber === printedNumber);
}

export function getReviewQuestionById(questionId: string): ReviewQuestion | undefined {
  return UNIT1_REVIEW_QUESTIONS.find((question) => question.id === questionId);
}

export function getReviewSubpartById(subpartId: string): ReviewSubpart | undefined {
  return UNIT1_REVIEW_ALL_SUBPARTS.find((subpart) => subpart.id === subpartId);
}

export const UNIT1_REVIEW_TOTAL_SOURCE_RECORDS =
  2 + UNIT1_REVIEW_QUESTIONS.length + 1; /* timing + instructions + 7 questions + closing = 10 */
