import { SourceReference } from '../../types/curriculum';
import { lesson2Src, LISTENING_SOURCE_GAP, LOCKED_SOURCE_GAPS } from './sourceMeta';

/**
 * The Lesson 2 coverage ledger.
 * One entry exists for each of the 53 explicit source-lock records.  Each entry
 * carries: source activity ID → student activity → teacher guidance.
 * No legacy Lesson 2 draft contributes data to this file.
 */

export type SourceAvailability = 'available' | 'gap';

export type Lesson2Interaction =
  | {
      kind: 'text_fields';
      fields: { id: string; label: string; multiline?: boolean; placeholder?: string }[];
    }
  | {
      kind: 'single_choice';
      choices: { id: string; text: string }[];
      disabledReason?: string;
    }
  | {
      kind: 'multi_select';
      choices: { id: string; text: string }[];
    }
  | {
      kind: 'write';
      label?: string;
      rows?: number;
      placeholder?: string;
    }
  | {
      kind: 'speak';
      preparationLabel?: string;
      criteria?: string[];
      disabledReason?: string;
    }
  | {
      kind: 'matching';
      leftItems: { id: string; text: string }[];
      rightItems: { id: string; text: string }[];
    }
  | {
      kind: 'ordering';
      items: { id: string; text: string }[];
      disabledReason?: string;
    }
  | {
      kind: 'classification';
      categories: { id: string; label: string }[];
      items: { id: string; text: string }[];
    }
  | {
      kind: 'balance';
      rights: string[];
      duties: string[];
      prompt: string;
    }
  | {
      kind: 'interview_plan';
      criteria: string[];
    }
  | {
      kind: 'handwriting';
      modelText?: string;
      modelDescription: string;
      disabledReason?: string;
    }
  | {
      kind: 'source_gap';
      reason: string;
      preservedPrompt?: string;
    };

export interface Lesson2Activity {
  /** Stable student-side activity ID. */
  id: string;
  /** Stable Source Lock activity ID, e.g. L2-12-01. */
  sourceActivityId: string;
  /** Stable teacher-guide solution ID. */
  teacherSolutionId: string;
  stepId: string;
  page: number;
  section: string;
  printedNumber: string;
  instruction: string;
  subparts: string[];
  interaction: Lesson2Interaction;
  availability: SourceAvailability;
  source: SourceReference;
  /** Teacher-facing guidance; never presented as undisclosed textbook text. */
  teacher: {
    answerOrGuidance: string;
    explanation: string;
    commonMistakes?: string[];
  };
}

const sourceGapTeacher = (reason: string) => ({
  answerOrGuidance: 'لا يُعتمد جواب محدد؛ المادة اللازمة للإجابة غير متوفرة في مصدر الدرس المقفول.',
  explanation: reason,
  commonMistakes: ['لا تُكمّل المادة الناقصة بقصيدة أو تسجيل أو نص من إنشاء المنصة.'],
});

const interviewCriteria = [
  'اختيار الموضوع.',
  'تحديد الشخصية وإخبارها بالزمان والمكان.',
  'تحضير أسئلة قصيرة ومتعلقة مباشرة بالموضوع.',
  'اختيار عبارات مناسبة لافتتاح المقابلة.',
  'الترحيب بالضيف في بداية اللقاء وشكره في نهايته.',
  'إعطاء الوقت الكافي للضيف لإبداء رأيه.',
];

export const LESSON2_ACTIVITIES: Lesson2Activity[] = [
  /* ========================== ص١٢ ========================== */
  {
    id: 'l2-a-01', sourceActivityId: 'L2-12-01', teacherSolutionId: 'l2-teacher-L2-12-01',
    stepId: 'l2-s1', page: 12, section: 'أتأمل الصور', printedNumber: '١',
    instruction: 'أخبر زملائي بما أشاهده في الصور السابقة.',
    subparts: ['مثيرات المصدر البصرية: الوطن/العلم، الحوار، وتعاون الأطفال.'],
    interaction: { kind: 'speak', preparationLabel: 'دوّن نقاط الوصف التي ستشاركها شفهياً:' },
    availability: 'available', source: lesson2Src(12, 'textbook_exercise', 'أتأمل الصور', 1),
    teacher: {
      answerOrGuidance: 'إجابة شفوية مفتوحة؛ يقبل الوصف الذي يلتزم بالمثيرات البصرية الموثقة ولا يضيف تفاصيل غير مرئية.',
      explanation: 'يقوّم المعلم وضوح الوصف وربطه بما هو ظاهر: الوطن/العلم أو الحوار أو تعاون الأطفال، لا صحة لغوية وحيدة.',
    },
  },
  {
    id: 'l2-a-02', sourceActivityId: 'L2-12-02', teacherSolutionId: 'l2-teacher-L2-12-02',
    stepId: 'l2-s1', page: 12, section: 'أتأمل الصور', printedNumber: '٢',
    instruction: 'أصف علم وطني.',
    subparts: ['وصف شفهي مفتوح للعلم.'],
    interaction: { kind: 'speak', preparationLabel: 'حضّر كلماتك لوصف العلم:' },
    availability: 'available', source: lesson2Src(12, 'textbook_exercise', 'أتأمل الصور', 2),
    teacher: {
      answerOrGuidance: 'إجابة وصفية شفهية مفتوحة، لا نموذج نصي وحيد في المصدر.',
      explanation: 'يتحقق المعلم من أن المتعلم يصف العلم الذي يعرفه بعبارات واضحة؛ لا تُفرض تفاصيل غير مثبتة في القفل.',
    },
  },
  {
    id: 'l2-a-03', sourceActivityId: 'L2-12-03', teacherSolutionId: 'l2-teacher-L2-12-03',
    stepId: 'l2-s1', page: 12, section: 'أتأمل الصور', printedNumber: '٣',
    instruction: 'أسمي النشيد الذي يرتبط بخيالي عند تأمل هذه الصور.',
    subparts: ['تسمية نشيد مرتبط بالصور/الوطن.'],
    interaction: { kind: 'text_fields', fields: [{ id: 'anthem', label: 'اسم النشيد الذي اخترته', placeholder: 'اكتب الاسم كما تعرفه' }] },
    availability: 'available', source: lesson2Src(12, 'textbook_exercise', 'أتأمل الصور', 3),
    teacher: {
      answerOrGuidance: 'إجابة مفتوحة؛ يسجل المتعلم اسماً يربطه بالصور.',
      explanation: 'لا يسمي المصدر نشيداً بعينه، ولذلك يقبل المعلم الربط الشخصي المناسب ولا يفرض عنواناً غير وارد.',
    },
  },
  {
    id: 'l2-a-04', sourceActivityId: 'L2-12-04', teacherSolutionId: 'l2-teacher-L2-12-04',
    stepId: 'l2-s1', page: 12, section: 'أستمع إلى النص', printedNumber: '١',
    instruction: 'أكمل شفوياً: يخاطب الشاعر في النص …؛ العبارة التي كررها الشاعر …',
    subparts: ['فراغ: من يخاطب الشاعر.', 'فراغ: العبارة المكررة.'],
    interaction: { kind: 'source_gap', reason: LISTENING_SOURCE_GAP, preservedPrompt: 'يخاطب الشاعر في النص … / العبارة التي كررها الشاعر …' },
    availability: 'gap', source: lesson2Src(12, 'textbook_reading', 'أستمع إلى النص', 1, LISTENING_SOURCE_GAP),
    teacher: sourceGapTeacher(LISTENING_SOURCE_GAP),
  },
  {
    id: 'l2-a-05', sourceActivityId: 'L2-12-05', teacherSolutionId: 'l2-teacher-L2-12-05',
    stepId: 'l2-s1', page: 12, section: 'أستمع إلى النص', printedNumber: '٢',
    instruction: 'أختار الإجابة الصحيحة: يدعو الشاعر إلى:',
    subparts: ['تمجيد جيل الشباب.', 'الحوار الإيجابي.', 'الاستفادة من تجارب الماضي.'],
    interaction: {
      kind: 'single_choice',
      choices: [
        { id: 'youth', text: 'تمجيد جيل الشباب' },
        { id: 'dialogue', text: 'الحوار الإيجابي' },
        { id: 'past', text: 'الاستفادة من تجارب الماضي' },
      ],
      disabledReason: LISTENING_SOURCE_GAP,
    },
    availability: 'gap', source: lesson2Src(12, 'textbook_reading', 'أستمع إلى النص', 2, LISTENING_SOURCE_GAP),
    teacher: sourceGapTeacher(LISTENING_SOURCE_GAP),
  },
  {
    id: 'l2-a-06', sourceActivityId: 'L2-12-06', teacherSolutionId: 'l2-teacher-L2-12-06',
    stepId: 'l2-s1', page: 12, section: 'أستمع إلى النص', printedNumber: '٣',
    instruction: 'أخبر زملائي بقيمة تعلمتها من النص.',
    subparts: ['مشاركة شفهية بقيمة متعلمة.'],
    interaction: { kind: 'source_gap', reason: LISTENING_SOURCE_GAP, preservedPrompt: 'أخبر زملائي بقيمة تعلمتها من النص.' },
    availability: 'gap', source: lesson2Src(12, 'textbook_reading', 'أستمع إلى النص', 3, LISTENING_SOURCE_GAP),
    teacher: sourceGapTeacher(LISTENING_SOURCE_GAP),
  },

  /* ========================== ص١٣ ========================== */
  {
    id: 'l2-a-07', sourceActivityId: 'L2-13-01', teacherSolutionId: 'l2-teacher-L2-13-01',
    stepId: 'l2-s2', page: 13, section: 'أقرأ', printedNumber: '١',
    instruction: 'أقرأ المقطع الأول مراعياً استخدام الإشارات والإيماءات المناسبة لمشاعر الاعتزاز.',
    subparts: ['المقطع الأول من القصيدة.', 'إشارات وإيماءات مناسبة لمشاعر الاعتزاز.'],
    interaction: { kind: 'source_gap', reason: LOCKED_SOURCE_GAPS.poemFullText, preservedPrompt: 'قراءة المقطع الأول مع الإشارات والإيماءات المناسبة لمشاعر الاعتزاز.' },
    availability: 'gap', source: lesson2Src(13, 'textbook_poetry', 'أقرأ', 1, LOCKED_SOURCE_GAPS.poemFullText),
    teacher: sourceGapTeacher(LOCKED_SOURCE_GAPS.poemFullText),
  },
  {
    id: 'l2-a-08', sourceActivityId: 'L2-13-02', teacherSolutionId: 'l2-teacher-L2-13-02',
    stepId: 'l2-s2', page: 13, section: 'أقرأ', printedNumber: '٢',
    instruction: 'أقرأ المقطع الثاني مراعياً التلوين الصوتي المناسب.',
    subparts: ['المقطع الثاني من القصيدة.', 'التلوين الصوتي المناسب.'],
    interaction: { kind: 'source_gap', reason: LOCKED_SOURCE_GAPS.poemFullText, preservedPrompt: 'قراءة المقطع الثاني مع التلوين الصوتي المناسب.' },
    availability: 'gap', source: lesson2Src(13, 'textbook_poetry', 'أقرأ', 2, LOCKED_SOURCE_GAPS.poemFullText),
    teacher: sourceGapTeacher(LOCKED_SOURCE_GAPS.poemFullText),
  },
  {
    id: 'l2-a-09', sourceActivityId: 'L2-13-03', teacherSolutionId: 'l2-teacher-L2-13-03',
    stepId: 'l2-s2', page: 13, section: 'أقرأ', printedNumber: '٣',
    instruction: 'أقرأ النص قراءة جهرية سليمة مراعياً التلوين الصوتي المناسب للمعنى.',
    subparts: ['قراءة جهرية سليمة.', 'تلوين صوتي مناسب للمعنى.'],
    interaction: { kind: 'source_gap', reason: LOCKED_SOURCE_GAPS.poemFullText, preservedPrompt: 'قراءة النص قراءة جهرية سليمة مع التلوين الصوتي المناسب للمعنى.' },
    availability: 'gap', source: lesson2Src(13, 'textbook_poetry', 'أقرأ', 3, LOCKED_SOURCE_GAPS.poemFullText),
    teacher: sourceGapTeacher(LOCKED_SOURCE_GAPS.poemFullText),
  },

  /* ========================== ص١٤ ========================== */
  {
    id: 'l2-a-10', sourceActivityId: 'L2-14-01', teacherSolutionId: 'l2-teacher-L2-14-01',
    stepId: 'l2-s3', page: 14, section: 'الفهم القرائي', printedNumber: '١',
    instruction: 'أتعاون مع زملائي على إكمال مخططي الجمع والضد.',
    subparts: ['مخطط الجمع: تاج، الرأي، وخانتان مكملتان.', 'مخطط الضد: الفوضى، تخاصم، وخانتان مكملتان.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'plural-taj', label: 'جمع «تاج»' },
      { id: 'plural-ray', label: 'جمع «الرأي»' },
      { id: 'plural-extra-1', label: 'خانة جمع مكملة ١' },
      { id: 'plural-extra-2', label: 'خانة جمع مكملة ٢' },
      { id: 'opposite-fawda', label: 'ضد «الفوضى»' },
      { id: 'opposite-takhasum', label: 'ضد «تخاصم»' },
      { id: 'opposite-extra-1', label: 'خانة ضد مكملة ١' },
      { id: 'opposite-extra-2', label: 'خانة ضد مكملة ٢' },
    ]},
    availability: 'available', source: lesson2Src(14, 'textbook_exercise', 'الفهم القرائي', 1),
    teacher: {
      answerOrGuidance: 'يتحقق المعلم من إجابة «تاج» و«الرأي» ومن استكمال المخطط من النص؛ لا تعتمد خانات إضافية بعينها لأن القصيدة كاملة غير منسوخة في وثيقة القفل.',
      explanation: 'يظهر المصدر عناصر بداية المخطط والخانات المكملة، لكنه لا يحفظ نص القصيدة الكامل الذي يثبت بقية الألفاظ. لا تُخترع قائمة خانات بديلة.',
      commonMistakes: ['تحويل الخانات المكملة إلى إجابات ثابتة من خارج المصدر.'],
    },
  },
  {
    id: 'l2-a-11', sourceActivityId: 'L2-14-02', teacherSolutionId: 'l2-teacher-L2-14-02',
    stepId: 'l2-s3', page: 14, section: 'الفهم القرائي', printedNumber: '٢',
    instruction: 'أبين الفرق في معنى كلمة «تنضج» في الجملتين الآتيتين.',
    subparts: ['«فالحكمة تنضج بالرأي والرأي الآخر».', '«ثمرة التين تنضج في فصل الصيف».'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'wisdom', label: 'معنى «تنضج» في جملة الحكمة', multiline: true },
      { id: 'fig', label: 'معنى «تنضج» في جملة ثمرة التين', multiline: true },
    ]},
    availability: 'available', source: lesson2Src(14, 'textbook_exercise', 'الفهم القرائي', 2),
    teacher: {
      answerOrGuidance: 'في الحكمة: تنمو أو تكتمل فكرياً. وفي ثمرة التين: تبلغ طور النضج المناسب للأكل.',
      explanation: 'تتغير دلالة الكلمة بالسياق: الأولى معنوية والثانية حسية.',
    },
  },
  {
    id: 'l2-a-12', sourceActivityId: 'L2-14-03', teacherSolutionId: 'l2-teacher-L2-14-03',
    stepId: 'l2-s3', page: 14, section: 'الفهم القرائي', printedNumber: '٣',
    instruction: 'أختار المقصود بالتركيب «أرفع صوتي».',
    subparts: ['أعبر عن رأيي.', 'أصرخ.', 'أخاصم.'],
    interaction: { kind: 'single_choice', choices: [
      { id: 'opinion', text: 'أعبر عن رأيي' },
      { id: 'shout', text: 'أصرخ' },
      { id: 'quarrel', text: 'أخاصم' },
    ]},
    availability: 'available', source: lesson2Src(14, 'textbook_exercise', 'الفهم القرائي', 3),
    teacher: {
      answerOrGuidance: 'أعبر عن رأيي.',
      explanation: 'التركيب في سياق الرأي والحوار، لا في سياق الصراخ أو الخصام.',
    },
  },
  {
    id: 'l2-a-13', sourceActivityId: 'L2-14-04', teacherSolutionId: 'l2-teacher-L2-14-04',
    stepId: 'l2-s3', page: 14, section: 'الفهم القرائي', printedNumber: '٤',
    instruction: 'أرتب الأفكار الآتية وفق ورودها في النص.',
    subparts: ['الحكمة تنمو بتعدد الآراء.', 'كل حق يقابله واجب.', 'بالحوار الإيجابي نصنع مستقبلاً لوطننا.'],
    interaction: { kind: 'ordering', items: [
      { id: 'wisdom', text: 'الحكمة تنمو بتعدد الآراء.' },
      { id: 'right-duty', text: 'كل حق يقابله واجب.' },
      { id: 'future', text: 'بالحوار الإيجابي نصنع مستقبلاً لوطننا.' },
    ], disabledReason: LOCKED_SOURCE_GAPS.poemDependentDetails },
    availability: 'gap', source: lesson2Src(14, 'textbook_exercise', 'الفهم القرائي', 4, LOCKED_SOURCE_GAPS.poemDependentDetails),
    teacher: sourceGapTeacher(LOCKED_SOURCE_GAPS.poemDependentDetails),
  },
  {
    id: 'l2-a-14', sourceActivityId: 'L2-14-05', teacherSolutionId: 'l2-teacher-L2-14-05',
    stepId: 'l2-s3', page: 14, section: 'الفهم القرائي', printedNumber: '٥',
    instruction: 'أكتب إلى جانب كل معنى رقم البيت الدال عليه.',
    subparts: ['الاختلاف لا يصل إلى الخصام.', 'واجب السعي إلى مستقبل أجمل.'],
    interaction: { kind: 'source_gap', reason: LOCKED_SOURCE_GAPS.poemDependentDetails, preservedPrompt: 'أكتب رقم البيت الدال على كل من المعنيين.' },
    availability: 'gap', source: lesson2Src(14, 'textbook_exercise', 'الفهم القرائي', 5, LOCKED_SOURCE_GAPS.poemDependentDetails),
    teacher: sourceGapTeacher(LOCKED_SOURCE_GAPS.poemDependentDetails),
  },
  {
    id: 'l2-a-15', sourceActivityId: 'L2-14-06', teacherSolutionId: 'l2-teacher-L2-14-06',
    stepId: 'l2-s3', page: 14, section: 'الفهم القرائي', printedNumber: '٦',
    instruction: 'أصل كل نتيجة بسبب واحد على الأقل.',
    subparts: ['الأسباب: اتفاق، خصام (خلاف)، فهم، نجاح.', 'النتائج: جدال، حكمة، حوار، إصغاء.'],
    interaction: { kind: 'matching',
      leftItems: [
        { id: 'agreement', text: 'اتفاق' }, { id: 'conflict', text: 'خصام (خلاف)' },
        { id: 'understanding', text: 'فهم' }, { id: 'success', text: 'نجاح' },
      ],
      rightItems: [
        { id: 'argument', text: 'جدال' }, { id: 'wisdom', text: 'حكمة' },
        { id: 'dialogue', text: 'حوار' }, { id: 'listening', text: 'إصغاء' },
      ],
    },
    availability: 'available', source: lesson2Src(14, 'textbook_exercise', 'الفهم القرائي', 6),
    teacher: {
      answerOrGuidance: 'يقبل ربط معلل واحد على الأقل لكل نتيجة؛ لا يورد القفل مفتاح المطابقة المطبوع.',
      explanation: 'يتحقق المعلم من أن الطالب يبرر العلاقة التي وصلها باللغة والسياق، ولا يعرض ربطاً مصطنعاً كمفتاح كتابي رسمي.',
    },
  },

  /* ========================== ص١٥ ========================== */
  {
    id: 'l2-a-16', sourceActivityId: 'L2-15-01', teacherSolutionId: 'l2-teacher-L2-15-01',
    stepId: 'l2-s3', page: 15, section: 'الفهم القرائي', printedNumber: '٧',
    instruction: 'في رأيك بمَ كرر الشاعر عبارة «الحكمة لا تنضج إلا بالرأي والرأي الآخر»؟',
    subparts: ['تعليل شخصي مرتبط بالعبارة المكررة.'],
    interaction: { kind: 'write', label: 'اكتب تعليلك:', rows: 3 },
    availability: 'available', source: lesson2Src(15, 'textbook_exercise', 'الفهم القرائي', 7),
    teacher: {
      answerOrGuidance: 'إجابة معللة مفتوحة؛ تقبل إذا ربطت التكرار بتأكيد قيمة الرأي والرأي الآخر والحوار.',
      explanation: 'لا يقدم المصدر جواباً نموذجياً وحيداً؛ يقوّم المعلم وجود تعليل متصل بالفكرة المعلنة.',
    },
  },
  {
    id: 'l2-a-17', sourceActivityId: 'L2-15-02', teacherSolutionId: 'l2-teacher-L2-15-02',
    stepId: 'l2-s3', page: 15, section: 'الفهم القرائي', printedNumber: '٨',
    instruction: 'شبه الشاعر سورية بالتاج، أشبه أنا بـ …',
    subparts: ['تشبيه شخصي مكتمل.'],
    interaction: { kind: 'text_fields', fields: [{ id: 'simile', label: 'أكمل التشبيه' }] },
    availability: 'available', source: lesson2Src(15, 'textbook_exercise', 'الفهم القرائي', 8),
    teacher: {
      answerOrGuidance: 'إجابة تشبيهية مفتوحة.',
      explanation: 'يتحقق المعلم من اكتمال صيغة التشبيه وصلتها بمقصود المتعلم، ولا يثبت المصدر مشبهاً واحداً إلزامياً.',
    },
  },
  {
    id: 'l2-a-18', sourceActivityId: 'L2-15-03', teacherSolutionId: 'l2-teacher-L2-15-03',
    stepId: 'l2-s3', page: 15, section: 'الفهم القرائي', printedNumber: '٩',
    instruction: 'أكمل الشكل الآتي لتتساوى كفتا الميزان، ثم أعدل الرسم.',
    subparts: ['حقوق: التعليم، الصحة، وخانتان ناقصتان.', 'واجبات: التزام القوانين وخانتان ناقصتان.', 'تعديل رسم الميزان بعد الإكمال.'],
    interaction: { kind: 'balance', rights: ['التعليم', 'الصحة'], duties: ['التزام القوانين'], prompt: 'أضف الحقوق والواجبات التي تقترحها ثم اشرح كيف يصبح الميزان متوازناً.' },
    availability: 'available', source: lesson2Src(15, 'textbook_exercise', 'الفهم القرائي', 9),
    teacher: {
      answerOrGuidance: 'يقوم المتعلم بإكمال الخانات الناقصة ثم يوازن الرسم؛ لا يفرض القفل نص بطاقات الخانات الأربع الناقصة.',
      explanation: 'يتحقق المعلم من التمييز بين الحقوق والواجبات ومن محاولة تعديل الميزان، من دون اختراع بطاقات مصدرية ثابتة.',
    },
  },
  {
    id: 'l2-a-19', sourceActivityId: 'L2-15-04', teacherSolutionId: 'l2-teacher-L2-15-04',
    stepId: 'l2-s3', page: 15, section: 'الفهم القرائي', printedNumber: '١٠',
    instruction: 'أكتب من عندي عبارات للحوار الآتي.',
    subparts: ['عبارات «نعم».', 'عبارات «كلا».'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'yes', label: 'عبارات «نعم»', multiline: true },
      { id: 'no', label: 'عبارات «كلا»', multiline: true },
    ]},
    availability: 'available', source: lesson2Src(15, 'textbook_exercise', 'الفهم القرائي', 10),
    teacher: {
      answerOrGuidance: 'حوار مفتوح بين الشخصيتين «نعم» و«كلا».',
      explanation: 'يقيّم المعلم الترابط والاحترام في الحوار؛ لا يوجد نص حواري نموذجي ثابت في المصدر.',
    },
  },
  {
    id: 'l2-a-20', sourceActivityId: 'L2-15-05', teacherSolutionId: 'l2-teacher-L2-15-05',
    stepId: 'l2-s3', page: 15, section: 'الفهم القرائي', printedNumber: '١١',
    instruction: 'لو كانت الحكمة مشاركة في الحوار السابق، أكتب ما يمكن أن تخبرنا به.',
    subparts: ['قول/نصيحة منسوبة لشخصية الحكمة.'],
    interaction: { kind: 'write', label: 'ماذا يمكن أن تقول الحكمة؟', rows: 3 },
    availability: 'available', source: lesson2Src(15, 'textbook_exercise', 'الفهم القرائي', 11),
    teacher: {
      answerOrGuidance: 'استجابة مفتوحة تقدم رأياً أو نصيحة مرتبطة بالحوار واحترام الرأي الآخر.',
      explanation: 'يقبل المعلم جواباً متسقاً مع قيمة الحوار؛ لا ينسب إلى الكتاب عبارة غير منسوخة.',
    },
  },
  {
    id: 'l2-a-21', sourceActivityId: 'L2-15-06', teacherSolutionId: 'l2-teacher-L2-15-06',
    stepId: 'l2-s3', page: 15, section: 'الفهم القرائي', printedNumber: '١٢',
    instruction: 'أحفظ على الأقل أربعة أبيات أعجبتني من النص، ثم ألقيها أمام زملائي.',
    subparts: ['اختيار أربعة أبيات على الأقل.', 'حفظها.', 'إلقاؤها أمام الزملاء.'],
    interaction: { kind: 'source_gap', reason: LOCKED_SOURCE_GAPS.poemFullText, preservedPrompt: 'احفظ أربعة أبيات على الأقل ثم ألقها أمام زملائك.' },
    availability: 'gap', source: lesson2Src(15, 'textbook_poetry', 'الفهم القرائي', 12, LOCKED_SOURCE_GAPS.poemFullText),
    teacher: sourceGapTeacher(LOCKED_SOURCE_GAPS.poemFullText),
  },

  /* ========================== ص١٧ ========================== */
  {
    id: 'l2-a-22', sourceActivityId: 'L2-17-01', teacherSolutionId: 'l2-teacher-L2-17-01',
    stepId: 'l2-s4', page: 17, section: 'أتدرب بإشراف معلمي', printedNumber: '—',
    instruction: 'أتعاون مع زملائي على إجراء مقابلة صحفية مع رجل إطفاء حول مهنته اليومية وبطولاته في عمله.',
    subparts: ['موضوع المقابلة: مهنة رجل الإطفاء اليومية وبطولاته.', 'تطبيق متطلبات المقابلة الستة في ص١٦.'],
    interaction: { kind: 'interview_plan', criteria: interviewCriteria },
    availability: 'available', source: lesson2Src(17, 'textbook_expression', 'أتدرب بإشراف معلمي'),
    teacher: {
      answerOrGuidance: 'حل النشاط هو خطة مقابلة جماعية تفي بالمعايير الستة؛ لا يوجد في المصدر نص أسئلة أو أجوبة لرجل الإطفاء.',
      explanation: 'يتحقق المعلم من اختيار الموضوع والشخص، وضبط الزمان والمكان، ووجود افتتاح وأسئلة مختصرة وخاتمة ومساحة للرأي.',
      commonMistakes: ['كتابة أجوبة على لسان رجل الإطفاء من خارج المصدر.', 'عدّ معايير ص١٦ ستة أنشطة مستقلة.'],
    },
  },
  {
    id: 'l2-a-23', sourceActivityId: 'L2-17-02', teacherSolutionId: 'l2-teacher-L2-17-02',
    stepId: 'l2-s5', page: 17, section: 'قواعد اللغة: المصادر', printedNumber: '١',
    instruction: 'ألاحظ أن الكلمات «عملاً، إتقان، تقديم» دلت على أسماء، أذكر فعل كل منها.',
    subparts: ['عملاً.', 'إتقان.', 'تقديم.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'amal', label: 'فعل «عملاً»' }, { id: 'itqan', label: 'فعل «إتقان»' }, { id: 'taqdim', label: 'فعل «تقديم»' },
    ]},
    availability: 'available', source: lesson2Src(17, 'textbook_grammar', 'قواعد اللغة: المصادر', 1),
    teacher: {
      answerOrGuidance: 'عملاً ← عمل، إتقان ← أتقن، تقديم ← قدّم.',
      explanation: 'المطلوب استرجاع الفعل الذي ينتمي إليه كل اسم، تمهيداً لاستنتاج المصدر.',
    },
  },
  {
    id: 'l2-a-24', sourceActivityId: 'L2-17-03', teacherSolutionId: 'l2-teacher-L2-17-03',
    stepId: 'l2-s5', page: 17, section: 'قواعد اللغة: المصادر', printedNumber: '٢',
    instruction: 'ألاحظ أن الفعل «عمل» الذي أخذ من الاسم «عملاً» يدل على حدث وقع في الماضي، أرتبط اسم «عملاً» بزمن أم مجرد من الزمن؟',
    subparts: ['تمييز دلالة الفعل الزمنية.', 'تحديد ارتباط المصدر «عملاً» بالزمن.'],
    interaction: { kind: 'single_choice', choices: [
      { id: 'time', text: 'مرتبط بزمن' }, { id: 'timeless', text: 'مجرد من الزمن' },
    ]},
    availability: 'available', source: lesson2Src(17, 'textbook_grammar', 'قواعد اللغة: المصادر', 2),
    teacher: {
      answerOrGuidance: '«عملاً» مجرد من الزمن.',
      explanation: 'الفعل «عمل» يدل على حدث في زمن ماضٍ، أما المصدر فيدل على الحدث نفسه من غير زمن.',
    },
  },
  {
    id: 'l2-a-25', sourceActivityId: 'L2-17-04', teacherSolutionId: 'l2-teacher-L2-17-04',
    stepId: 'l2-s5', page: 17, section: 'قواعد اللغة: المصادر', printedNumber: '٣',
    instruction: 'أبين الفرق بين الاسمين «إتقان، تقديم» وفعليهما من حيث الارتباط بالزمن أو التجرد منه.',
    subparts: ['إتقان/أتقن.', 'تقديم/قدّم.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'itqan-diff', label: 'الفرق بين «إتقان» و«أتقن»', multiline: true },
      { id: 'taqdim-diff', label: 'الفرق بين «تقديم» و«قدّم»', multiline: true },
    ]},
    availability: 'available', source: lesson2Src(17, 'textbook_grammar', 'قواعد اللغة: المصادر', 3),
    teacher: {
      answerOrGuidance: '«إتقان» و«تقديم» مصدران مجردان من الزمن؛ «أتقن» و«قدّم» فعلان يدلان على حدث مرتبط بزمن.',
      explanation: 'يركز الحل على الفرق الدلالي الزمني لا على تغيير شكل الكلمة فقط.',
    },
  },
  {
    id: 'l2-a-26', sourceActivityId: 'L2-17-05', teacherSolutionId: 'l2-teacher-L2-17-05',
    stepId: 'l2-s5', page: 17, section: 'قواعد اللغة: المصادر', printedNumber: '٤',
    instruction: 'أسمي الأسماء من جنس الفعل الدالة على حدث مجرد من الزمن.',
    subparts: ['استنتاج اسم المصطلح النحوي.'],
    interaction: { kind: 'text_fields', fields: [{ id: 'term', label: 'اسمها' }] },
    availability: 'available', source: lesson2Src(17, 'textbook_grammar', 'قواعد اللغة: المصادر', 4),
    teacher: {
      answerOrGuidance: 'المصادر.',
      explanation: 'القاعدة المعروضة في المصدر: المصدر اسم من جنس الفعل يدل على حدث مجرد من الزمن.',
    },
  },

  /* ========================== ص١٨ ========================== */
  {
    id: 'l2-a-27', sourceActivityId: 'L2-18-01', teacherSolutionId: 'l2-teacher-L2-18-01',
    stepId: 'l2-s5', page: 18, section: 'أطبق', printedNumber: '—',
    instruction: 'ألوّن كل فعل ومصدره بلون مماثل.',
    subparts: ['صدّق/صدق.', 'رأى/رؤية.', 'اشترك/اشتراك.', 'انتشر/انتشار.', 'ذهب/ذهاب.'],
    interaction: { kind: 'matching', leftItems: [
      { id: 'saddaqa', text: 'صدّق' }, { id: 'raa', text: 'رأى' }, { id: 'ishtaraka', text: 'اشترك' },
      { id: 'intashara', text: 'انتشر' }, { id: 'dhahaba', text: 'ذهب' },
    ], rightItems: [
      { id: 'sidq', text: 'صدق' }, { id: 'ruya', text: 'رؤية' }, { id: 'ishtirak', text: 'اشتراك' },
      { id: 'intishar', text: 'انتشار' }, { id: 'dhahab', text: 'ذهاب' },
    ]},
    availability: 'available', source: lesson2Src(18, 'textbook_grammar', 'أطبق'),
    teacher: {
      answerOrGuidance: 'صدّق ← صدق؛ رأى ← رؤية؛ اشترك ← اشتراك؛ انتشر ← انتشار؛ ذهب ← ذهاب.',
      explanation: 'يطابق كل فعل بالمصدر الذي يدل على الحدث المجرد من الزمن.',
    },
  },
  {
    id: 'l2-a-28', sourceActivityId: 'L2-18-02', teacherSolutionId: 'l2-teacher-L2-18-02',
    stepId: 'l2-s5', page: 18, section: 'التقويم النهائي', printedNumber: '١',
    instruction: 'أذكر فعل كل من المصادر الآتية: نوم، قراءة، اعتماد، إعلام.',
    subparts: ['نوم.', 'قراءة.', 'اعتماد.', 'إعلام.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'nawm', label: 'فعل «نوم»' }, { id: 'qiraa', label: 'فعل «قراءة»' },
      { id: 'itimad', label: 'فعل «اعتماد»' }, { id: 'ilam', label: 'فعل «إعلام»' },
    ]},
    availability: 'available', source: lesson2Src(18, 'textbook_grammar', 'التقويم النهائي', 1),
    teacher: {
      answerOrGuidance: 'نوم ← نام؛ قراءة ← قرأ؛ اعتماد ← اعتمد؛ إعلام ← أعلم.',
      explanation: 'ننتقل من المصدر إلى الفعل الموافق له في المعنى.',
    },
  },
  {
    id: 'l2-a-29', sourceActivityId: 'L2-18-03', teacherSolutionId: 'l2-teacher-L2-18-03',
    stepId: 'l2-s5', page: 18, section: 'التقويم النهائي', printedNumber: '٢',
    instruction: 'أذكر مصدر كل من الأفعال الآتية: أسم، أخبر، زرع، حصد.',
    subparts: ['أسم.', 'أخبر.', 'زرع.', 'حصد.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'asma', label: 'مصدر «أسم»' }, { id: 'akhbara', label: 'مصدر «أخبر»' },
      { id: 'zaraa', label: 'مصدر «زرع»' }, { id: 'hasada', label: 'مصدر «حصد»' },
    ]},
    availability: 'available', source: lesson2Src(18, 'textbook_grammar', 'التقويم النهائي', 2),
    teacher: {
      answerOrGuidance: 'أخبر ← إخبار؛ زرع ← زراعة؛ حصد ← حصاد. أما «أسم» فمكتوبة بهذه الصورة في وثيقة القفل ولا تثبت الوثيقة مصدرها؛ لا يعتمد جواب مخمّن لها.',
      explanation: 'تحل العناصر الثلاثة ذات العلاقة المثبتة. تظل خانة «أسم» معلنة كفجوة لأن مصدر القفل لا يبين المقصود الصرفي منها.',
      commonMistakes: ['تخمين فعل أو مصدر مختلف لكلمة «أسم» رغم عدم ثبوت المقصود في القفل.'],
    },
  },
  {
    id: 'l2-a-30', sourceActivityId: 'L2-18-04', teacherSolutionId: 'l2-teacher-L2-18-04',
    stepId: 'l2-s5', page: 18, section: 'التقويم النهائي', printedNumber: '٣',
    instruction: 'أبادل زميلي الأدوار فأعطيه فعلاً ويعطيني مصدره وبالعكس، على أن يعطي كل منا ثلاثة أفعال أو مصادر على الأقل.',
    subparts: ['تبادل الأدوار.', 'ثلاثة أفعال أو مصادر على الأقل لكل متعلم.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'my-verbs', label: 'ثلاثة أفعال أعطيها لزميلي', multiline: true },
      { id: 'partner-sources', label: 'المصادر التي يجيب بها زميلي', multiline: true },
    ]},
    availability: 'available', source: lesson2Src(18, 'textbook_grammar', 'التقويم النهائي', 3),
    teacher: {
      answerOrGuidance: 'أداء ثنائي مفتوح؛ يتحقق المعلم من وجود ثلاثة تبادلات على الأقل لكل متعلم وصحة علاقة الفعل بالمصدر.',
      explanation: 'لا يحدد المصدر ثلاثة ألفاظ بعينها، لذلك يقوّم عدد التبادلات وصحة العلاقة لا قائمة محفوظة.',
    },
  },
  {
    id: 'l2-a-31', sourceActivityId: 'L2-18-05', teacherSolutionId: 'l2-teacher-L2-18-05',
    stepId: 'l2-s5', page: 18, section: 'التقويم النهائي', printedNumber: '٤',
    instruction: 'أتحدث أمام زملائي لمدة دقيقتين عن مهنة أحد أقاربي مستعملاً المصادر.',
    subparts: ['حديث شفهي عن مهنة قريب.', 'المدة: دقيقتان.', 'استعمال المصادر.'],
    interaction: { kind: 'speak', preparationLabel: 'اكتب مخطط حديثك مع مصادر ستستعملها:', criteria: ['مدة الأداء: دقيقتان.', 'يتناول مهنة أحد الأقارب.', 'يستعمل مصادر مناسبة.'] },
    availability: 'available', source: lesson2Src(18, 'textbook_grammar', 'التقويم النهائي', 4),
    teacher: {
      answerOrGuidance: 'أداء شفهي مفتوح لمدة دقيقتين يستعمل فيه المتعلم مصادر مناسبة.',
      explanation: 'يقيّم المعلم التزام المدة والموضوع واستعمال المصادر، ولا يفرض مهنة أو نصاً بعينه.',
    },
  },
  {
    id: 'l2-a-32', sourceActivityId: 'L2-18-06', teacherSolutionId: 'l2-teacher-L2-18-06',
    stepId: 'l2-s5', page: 18, section: 'التقويم النهائي', printedNumber: '٥',
    instruction: 'أكتب فقرة من خمس عشرة كلمة أصف فيها مهنة أفضلها مستعملاً المصادر في كتابتي.',
    subparts: ['فقرة من خمس عشرة كلمة.', 'وصف مهنة مفضلة.', 'استعمال المصادر.'],
    interaction: { kind: 'write', label: 'اكتب فقرتك (١٥ كلمة):', rows: 5 },
    availability: 'available', source: lesson2Src(18, 'textbook_grammar', 'التقويم النهائي', 5),
    teacher: {
      answerOrGuidance: 'فقرة مفتوحة من خمس عشرة كلمة تصف مهنة مفضلة وتستعمل مصادر.',
      explanation: 'يتحقق المعلم من عدد الكلمات، مناسبة الوصف، ووجود مصدر أو أكثر؛ لا يفرض المصدر فقرة نموذجية.',
    },
  },

  /* ========================== ص١٩–٢٠ ========================== */
  {
    id: 'l2-a-33', sourceActivityId: 'L2-19-01', teacherSolutionId: 'l2-teacher-L2-19-01',
    stepId: 'l2-s6', page: 19, section: 'إملاء: همزة القطع', printedNumber: '١',
    instruction: 'ألاحظ أن الكلمات الملونة بدأت بهمزة أولية، أهي همزة قطع أم همزة وصل؟',
    subparts: ['تصنيف الأمثلة الملونة في الاستقراء.'],
    interaction: { kind: 'classification', categories: [
      { id: 'qata', label: 'همزة قطع' }, { id: 'wasl', label: 'همزة وصل' },
    ], items: [
      { id: 'aqbala', text: 'أقبل' }, { id: 'iqbalan', text: 'إقبالاً' }, { id: 'akhadha', text: 'أخذ' }, { id: 'amalan', text: 'أملاً' },
    ]},
    availability: 'available', source: lesson2Src(19, 'textbook_spelling', 'أقرأ الأمثلة', 1),
    teacher: {
      answerOrGuidance: 'أقبل، إقبالاً، أخذ، أملاً: همزات قطع.',
      explanation: 'كلها تبدأ بهمزة مرسومة فوق الألف أو تحته، وتندرج ضمن أمثلة همزة القطع في المصدر.',
    },
  },
  {
    id: 'l2-a-34', sourceActivityId: 'L2-19-02', teacherSolutionId: 'l2-teacher-L2-19-02',
    stepId: 'l2-s6', page: 19, section: 'إملاء: همزة القطع', printedNumber: '٢',
    instruction: 'أبين نوع الكلمات «أقبل، إقبال، أخذ» من حيث عدد أحرفها ودلالتها الزمنية.',
    subparts: ['أقبل.', 'إقبال.', 'أخذ.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'aqbala', label: '«أقبل»: عدد الأحرف ودلالته الزمنية' },
      { id: 'iqbal', label: '«إقبال»: عدد الأحرف ودلالته الزمنية' },
      { id: 'akhadha', label: '«أخذ»: عدد الأحرف ودلالته الزمنية' },
    ]},
    availability: 'available', source: lesson2Src(19, 'textbook_spelling', 'أقرأ الأمثلة', 2),
    teacher: {
      answerOrGuidance: 'أقبل: فعل ماضٍ رباعي؛ إقبال: مصدر رباعي مجرد من الزمن؛ أخذ: فعل ماضٍ ثلاثي.',
      explanation: 'يربط الحل عدد الأحرف بنوع الكلمة ودلالتها الزمنية كما يطلب السؤال.',
    },
  },
  {
    id: 'l2-a-35', sourceActivityId: 'L2-19-03', teacherSolutionId: 'l2-teacher-L2-19-03',
    stepId: 'l2-s6', page: 19, section: 'إملاء: همزة القطع', printedNumber: '٣',
    instruction: 'ألاحظ كلاً من الكلمتين «إقبالاً، أملاً» يدل على مصدر، أذكر فعل كل منهما وعدد أحرفه.',
    subparts: ['إقبالاً: الفعل وعدد أحرفه.', 'أملاً: الفعل وعدد أحرفه.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'iqbal', label: 'فعل «إقبالاً» وعدد أحرفه' }, { id: 'amal', label: 'فعل «أملاً» وعدد أحرفه' },
    ]},
    availability: 'available', source: lesson2Src(19, 'textbook_spelling', 'أقرأ الأمثلة', 3),
    teacher: {
      answerOrGuidance: 'إقبالاً ← أقبل، أربعة أحرف. أملاً ← أمل، ثلاثة أحرف.',
      explanation: 'المطلوب وصل المصدر بالفعل وبيان عدد حروف الفعل، لا عد حروف المصدر فقط.',
    },
  },
  {
    id: 'l2-a-36', sourceActivityId: 'L2-19-04', teacherSolutionId: 'l2-teacher-L2-19-04',
    stepId: 'l2-s6', page: 19, section: 'إملاء: همزة القطع', printedNumber: '٤',
    instruction: 'أبين نوع الهمزة الأولية في كل من الفعلين الثلاثي والرباعي ومصدريهما.',
    subparts: ['الفعل الثلاثي المبدوء بهمزة ومصدره.', 'الفعل الرباعي وأمره ومصدره.'],
    interaction: { kind: 'write', label: 'اكتب بيانك:', rows: 4 },
    availability: 'available', source: lesson2Src(19, 'textbook_spelling', 'أقرأ الأمثلة', 4),
    teacher: {
      answerOrGuidance: 'همزة قطع في الماضي الثلاثي المبدوء بهمزة ومصدره، وفي الماضي الرباعي وأمره ومصدره.',
      explanation: 'هذا تطبيق مباشر لمواضع همزة القطع التي تسجلها قاعدة ص١٩.',
    },
  },
  {
    id: 'l2-a-37', sourceActivityId: 'L2-19-05', teacherSolutionId: 'l2-teacher-L2-19-05',
    stepId: 'l2-s6', page: 19, section: 'إملاء: همزة القطع', printedNumber: '٥',
    instruction: 'ألاحظ أن كلاً من الكلمات «أساس، أن، إلى» بدأ بهمزة، أهي همزة قطع أم همزة وصل؟',
    subparts: ['أساس.', 'أن.', 'إلى.'],
    interaction: { kind: 'classification', categories: [
      { id: 'qata', label: 'همزة قطع' }, { id: 'wasl', label: 'همزة وصل' },
    ], items: [
      { id: 'asas', text: 'أساس' }, { id: 'an', text: 'أن' }, { id: 'ila', text: 'إلى' },
    ]},
    availability: 'available', source: lesson2Src(19, 'textbook_spelling', 'أقرأ الأمثلة', 5),
    teacher: {
      answerOrGuidance: 'أساس، أن، إلى: همزات قطع.',
      explanation: 'تأتي همزة القطع في أول الأسماء والحروف، وهذه الألفاظ من أمثلة المصدر.',
    },
  },
  {
    id: 'l2-a-38', sourceActivityId: 'L2-19-06', teacherSolutionId: 'l2-teacher-L2-19-06',
    stepId: 'l2-s6', page: 19, section: 'أطبق', printedNumber: '—',
    instruction: 'أضع في الفراغات الآتية كلمات مناسبة تبدأ بهمزة قطع.',
    subparts: ['… الربيع بأزهاره الملونة.', '… التلميذ من زميله كتاباً.', 'كن صاحب … قوية لتحقق أهدافك.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'spring', label: '… الربيع بأزهاره الملونة.' },
      { id: 'student', label: '… التلميذ من زميله كتاباً.' },
      { id: 'strong', label: 'كن صاحب … قوية لتحقق أهدافك.' },
    ]},
    availability: 'available', source: lesson2Src(19, 'textbook_spelling', 'أطبق'),
    teacher: {
      answerOrGuidance: 'تقبل الكلمات المناسبة التي تبدأ بهمزة قطع وتستقيم بها الجملة؛ لا تسجل وثيقة القفل كلمات إجابة وحيدة.',
      explanation: 'يفحص المعلم شرطين: سلامة المعنى وبدء الكلمة بهمزة قطع.',
    },
  },
  {
    id: 'l2-a-39', sourceActivityId: 'L2-19-07', teacherSolutionId: 'l2-teacher-L2-19-07',
    stepId: 'l2-s6', page: 19, section: 'التقويم النهائي', printedNumber: '١',
    instruction: 'أقرأ الفقرة ثم أملأ الجدول بما يناسب وفق المثال.',
    subparts: ['تحديد المصدر المبدوء بهمزة قطع وفعله وزمنه وعدد أحرفه وحركة همزته.', 'تحديد الفعل المبدوء بهمزة قطع وزمنه وعدد أحرفه وحركة همزته.', 'الجدول يمتد من ص١٩ إلى ص٢٠.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'source', label: 'المصدر المبدوء بهمزة قطع' }, { id: 'source-verb', label: 'فعله وزمنه وعدد أحرفه وحركة همزته', multiline: true },
      { id: 'verb', label: 'الفعل المبدوء بهمزة قطع' }, { id: 'verb-details', label: 'زمنه وعدد أحرفه وحركة همزته', multiline: true },
    ]},
    availability: 'available', source: lesson2Src(19, 'textbook_spelling', 'التقويم النهائي', 1, undefined, 20),
    teacher: {
      answerOrGuidance: 'يحلل المعلم الكلمات ذات همزة القطع الواردة في الفقرة وفق حقول الجدول. لا يضيف ألفاظاً خارج الفقرة أو خارج الحقول الموثقة.',
      explanation: 'وثيقة القفل تحفظ بنية الجدول وحقوله، ولا تنسخ الفقرة أو صف المثال كاملاً؛ لذلك يقدم المعلم التصحيح على الورقة/المصدر المعتمد عند توفره ولا ينشئ جدول إجابات بديلاً.',
      commonMistakes: ['توليد صفوف أو أمثلة جديدة غير موجودة في المصدر المقفول.'],
    },
  },
  {
    id: 'l2-a-40', sourceActivityId: 'L2-20-01', teacherSolutionId: 'l2-teacher-L2-20-01',
    stepId: 'l2-s6', page: 20, section: 'التقويم النهائي', printedNumber: '٢',
    instruction: 'أنشئ ثلاث جمل، في كل منها همزة قطع.',
    subparts: ['الجملة الأولى.', 'الجملة الثانية.', 'الجملة الثالثة.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'one', label: 'الجملة الأولى' }, { id: 'two', label: 'الجملة الثانية' }, { id: 'three', label: 'الجملة الثالثة' },
    ]},
    availability: 'available', source: lesson2Src(20, 'textbook_spelling', 'التقويم النهائي', 2),
    teacher: {
      answerOrGuidance: 'ثلاث جمل من إنشاء المتعلم، تحتوي كل واحدة منها كلمة تبدأ بهمزة قطع.',
      explanation: 'يقيّم المعلم ثلاثة متطلبات منفصلة: عدد الجمل، سلامتها، ووجود همزة قطع في كل جملة.',
    },
  },
  {
    id: 'l2-a-41', sourceActivityId: 'L2-20-02', teacherSolutionId: 'l2-teacher-L2-20-02',
    stepId: 'l2-s6', page: 20, section: 'التقويم النهائي', printedNumber: '٣',
    instruction: 'أتحدث أمام زملائي لمدة دقيقتين عن التزامي أداء واجبي تجاه مجتمعي مستعملاً همزة القطع، وأشير بخطوط صغيرة إلى الأمام عند الكلمة التي تحوي همزة قطع.',
    subparts: ['حديث عن أداء الواجب تجاه المجتمع.', 'المدة: دقيقتان.', 'استعمال همزة القطع.', 'إشارة صغيرة عند الكلمة الحاوية همزة قطع.'],
    interaction: { kind: 'speak', preparationLabel: 'حضّر مخطط حديثك والكلمات التي ستشير إليها:', criteria: ['مدة الأداء: دقيقتان.', 'موضوع الحديث: أداء الواجب تجاه المجتمع.', 'استعمال همزة قطع وإشارة مصاحبة.'] },
    availability: 'available', source: lesson2Src(20, 'textbook_spelling', 'التقويم النهائي', 3),
    teacher: {
      answerOrGuidance: 'أداء شفهي مفتوح لمدة دقيقتين، مع استعمال همزة القطع وإشارة عند مواضعها.',
      explanation: 'يقيّم المعلم شروط الأداء جميعاً ولا يستبدلها بنص محفوظ.',
    },
  },
  {
    id: 'l2-a-42', sourceActivityId: 'L2-20-03', teacherSolutionId: 'l2-teacher-L2-20-03',
    stepId: 'l2-s6', page: 20, section: 'التقويم النهائي', printedNumber: '٤',
    instruction: 'أكتب فقرة من سطرين أعبر فيها عن انتمائي إلى أرضي مستعملاً همزة القطع.',
    subparts: ['فقرة من سطرين.', 'التعبير عن الانتماء إلى الأرض.', 'استعمال همزة القطع.'],
    interaction: { kind: 'write', label: 'اكتب فقرتك من سطرين:', rows: 4 },
    availability: 'available', source: lesson2Src(20, 'textbook_spelling', 'التقويم النهائي', 4),
    teacher: {
      answerOrGuidance: 'فقرة مفتوحة من سطرين عن الانتماء إلى الأرض تستخدم همزة القطع.',
      explanation: 'يتحقق المعلم من طول الفقرة وموضوعها واستخدام همزة القطع؛ لا توجد صياغة واحدة مفروضة.',
    },
  },

  /* ========================== ص٢١–٢٢ ========================== */
  {
    id: 'l2-a-43', sourceActivityId: 'L2-21-01', teacherSolutionId: 'l2-teacher-L2-21-01',
    stepId: 'l2-s7', page: 21, section: 'الخط: كتابة الهمزة والمد والألف', printedNumber: '١',
    instruction: 'ألاحظ رسم الهمزة والمد والألف في الكلمات النموذجية المطبوعة.',
    subparts: ['ملاحظة ستة أمثلة كتابية ظاهرة في المصدر.'],
    interaction: { kind: 'source_gap', reason: LOCKED_SOURCE_GAPS.handwritingModels, preservedPrompt: 'ألاحظ رسم الهمزة والمد والألف في الكلمات الآتية.' },
    availability: 'gap', source: lesson2Src(21, 'textbook_exercise', 'الخط: كتابة الهمزة والمد والألف', 1, LOCKED_SOURCE_GAPS.handwritingModels),
    teacher: sourceGapTeacher(LOCKED_SOURCE_GAPS.handwritingModels),
  },
  {
    id: 'l2-a-44', sourceActivityId: 'L2-21-02', teacherSolutionId: 'l2-teacher-L2-21-02',
    stepId: 'l2-s7', page: 21, section: 'الخط: كتابة الهمزة والمد والألف', printedNumber: '٢',
    instruction: 'أجرد الهمزة والمد والألف في الكلمات السابقة متتبعاً طريقة كتابتها.',
    subparts: ['تجريد الهمزة.', 'تجريد المد.', 'تجريد الألف.', 'اتباع طريقة الكتابة في النماذج السابقة.'],
    interaction: { kind: 'source_gap', reason: LOCKED_SOURCE_GAPS.handwritingModels, preservedPrompt: 'أجرد الهمزة والمد والألف في الكلمات السابقة متتبعاً طريقة كتابتها.' },
    availability: 'gap', source: lesson2Src(21, 'textbook_exercise', 'الخط: كتابة الهمزة والمد والألف', 2, LOCKED_SOURCE_GAPS.handwritingModels),
    teacher: sourceGapTeacher(LOCKED_SOURCE_GAPS.handwritingModels),
  },
  {
    id: 'l2-a-45', sourceActivityId: 'L2-21-03', teacherSolutionId: 'l2-teacher-L2-21-03',
    stepId: 'l2-s7', page: 21, section: 'أتدرب', printedNumber: '—',
    instruction: 'أحاكي رسم كلمات العبارة «أحافظ على آثار بلادي» بخط الرقعة، مميزاً الهمزة والمد والألف.',
    subparts: ['العبارة: «أحافظ على آثار بلادي».', 'المحاكاة بخط الرقعة.', 'تمييز الهمزة والمد والألف.'],
    interaction: { kind: 'handwriting', modelText: 'أحافظ على آثار بلادي', modelDescription: 'عبارة المصدر المكتوبة للتدريب بخط الرقعة.' },
    availability: 'available', source: lesson2Src(21, 'textbook_exercise', 'أتدرب'),
    teacher: {
      answerOrGuidance: 'ينسخ المتعلم العبارة نفسها بخط الرقعة مع تمييز الهمزة والمد والألف.',
      explanation: 'يصحح المعلم المحاكاة الخطية على الورقة/الإنتاج المرئي؛ لا يحول النشاط إلى سؤال لغوي مختلف.',
    },
  },
  {
    id: 'l2-a-46', sourceActivityId: 'L2-22-01', teacherSolutionId: 'l2-teacher-L2-22-01',
    stepId: 'l2-s7', page: 22, section: 'أطبق', printedNumber: '—',
    instruction: 'أكتب الهمزة والألف في مكانهما المناسب بخط الرقعة، منتبهاً للفرق في كتابتهما بخط النسخ.',
    subparts: ['الهمزة في موضعها المناسب.', 'الألف في موضعها المناسب.', 'خط الرقعة.', 'مقارنة بخط النسخ.'],
    interaction: { kind: 'source_gap', reason: LOCKED_SOURCE_GAPS.handwritingModels, preservedPrompt: 'أكتب الهمزة والألف في مكانهما المناسب بخط الرقعة.' },
    availability: 'gap', source: lesson2Src(22, 'textbook_exercise', 'أطبق', undefined, LOCKED_SOURCE_GAPS.handwritingModels),
    teacher: sourceGapTeacher(LOCKED_SOURCE_GAPS.handwritingModels),
  },

  /* ========================== ص٢٣ ========================== */
  {
    id: 'l2-a-47', sourceActivityId: 'L2-23-01', teacherSolutionId: 'l2-teacher-L2-23-01',
    stepId: 'l2-s8', page: 23, section: 'أضيف', printedNumber: '١',
    instruction: 'في رأيك: بماذا سيجيب العشب الظل؟',
    subparts: ['جواب شخصية العشب للظل.'],
    interaction: { kind: 'write', label: 'اكتب جواب العشب:', rows: 3 },
    availability: 'available', source: lesson2Src(23, 'textbook_expression', 'أضيف', 1),
    teacher: {
      answerOrGuidance: 'إجابة حوارية مفتوحة بصوت شخصية العشب.',
      explanation: 'يقبل المعلم جواباً متسقاً مع وصف المصدر للحوار، من دون ادعاء أنه نص الكتاب الحرفي.',
    },
  },
  {
    id: 'l2-a-48', sourceActivityId: 'L2-23-02', teacherSolutionId: 'l2-teacher-L2-23-02',
    stepId: 'l2-s8', page: 23, section: 'أضيف', printedNumber: '٢',
    instruction: 'لو كنت مكان العصفور الذي يستمع لهذا الحوار، ماذا سيكون رأيك؟',
    subparts: ['رأي مكتوب من موقع العصفور المستمع.'],
    interaction: { kind: 'write', label: 'اكتب رأي العصفور:', rows: 3 },
    availability: 'available', source: lesson2Src(23, 'textbook_expression', 'أضيف', 2),
    teacher: {
      answerOrGuidance: 'رأي مفتوح من منظور العصفور.',
      explanation: 'يقيّم المعلم صلة الرأي بالموقف الموثق في المصدر، لا تطابقه مع جملة نموذجية مصطنعة.',
    },
  },
  {
    id: 'l2-a-49', sourceActivityId: 'L2-23-03', teacherSolutionId: 'l2-teacher-L2-23-03',
    stepId: 'l2-s8', page: 23, section: 'أضيف', printedNumber: '٣',
    instruction: 'أضيف إلى ما سبق حواراً لشخصية جديدة أقترحها، ثم أعيد كتابة الحوار.',
    subparts: ['اقتراح شخصية جديدة.', 'إضافة حوارها.', 'إعادة كتابة الحوار كاملاً.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'character', label: 'الشخصية الجديدة التي أقترحها' },
      { id: 'dialogue', label: 'الحوار بعد الإضافة وإعادة الكتابة', multiline: true },
    ]},
    availability: 'available', source: lesson2Src(23, 'textbook_expression', 'أضيف', 3),
    teacher: {
      answerOrGuidance: 'إنتاج كتابي مفتوح يتضمن شخصية مقترحة وحوارها وإعادة كتابة الحوار.',
      explanation: 'يتحقق المعلم من إنجاز الأجزاء الثلاثة، ولا يحدد المصدر شخصية أو حواراً واحداً مقبولاً.',
    },
  },
  {
    id: 'l2-a-50', sourceActivityId: 'L2-23-04', teacherSolutionId: 'l2-teacher-L2-23-04',
    stepId: 'l2-s8', page: 23, section: 'أضيف', printedNumber: '٤',
    instruction: 'أتأمل الصورة السابقة، ثم أكتب حواراً بين الأخ وأخته الصغيرة حول دعوة أصدقائهما لزيارة الحديقة.',
    subparts: ['شخصيتا الحوار: الأخ والأخت الصغيرة.', 'موضوعه: دعوة الأصدقاء لزيارة الحديقة.', 'حوار مكتوب.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'brother', label: 'قول الأخ', multiline: true }, { id: 'sister', label: 'قول الأخت الصغيرة', multiline: true },
    ]},
    availability: 'available', source: lesson2Src(23, 'textbook_expression', 'أضيف', 4),
    teacher: {
      answerOrGuidance: 'حوار مفتوح بين الأخ والأخت الصغيرة حول دعوة الأصدقاء إلى الحديقة.',
      explanation: 'يتحقق المعلم من حضور الشخصيتين والموضوع والحوار المكتوب؛ لا يوجد نص إلزامي في المصدر.',
    },
  },

  /* ========================== ص٢٤ ========================== */
  {
    id: 'l2-a-51', sourceActivityId: 'L2-24-01', teacherSolutionId: 'l2-teacher-L2-24-01',
    stepId: 'l2-s9', page: 24, section: 'ألعب وأتعلم', printedNumber: '١',
    instruction: 'أضيف إلى الكلمات الآتية ما يناسبها من الأحرف «و، ة، ا» لتصبح مصادر.',
    subparts: ['كتب.', 'ذهب.', 'صعد.', 'جلس.', 'سبح.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'kataba', label: 'كتب ←' }, { id: 'dhahaba', label: 'ذهب ←' }, { id: 'saaada', label: 'صعد ←' },
      { id: 'jalasa', label: 'جلس ←' }, { id: 'sabaha', label: 'سبح ←' },
    ]},
    availability: 'available', source: lesson2Src(24, 'activity_book', 'ألعب وأتعلم', 1),
    teacher: {
      answerOrGuidance: 'كتب ← كتابة؛ ذهب ← ذهاب؛ صعد ← صعود؛ جلس ← جلوس؛ سبح ← سباحة.',
      explanation: 'تضاف الأحرف المبينة في المصدر لتتحول الألفاظ إلى مصادر.',
    },
  },
  {
    id: 'l2-a-52', sourceActivityId: 'L2-24-02', teacherSolutionId: 'l2-teacher-L2-24-02',
    stepId: 'l2-s9', page: 24, section: 'ألعب وأتعلم', printedNumber: '٢',
    instruction: 'أشطب من المصادر الآتية حرفاً لتصبح أفعالاً.',
    subparts: ['وجود.', 'لعباً.', 'زخرفة.', 'علماً.'],
    interaction: { kind: 'text_fields', fields: [
      { id: 'wujud', label: 'وجود ←' }, { id: 'laban', label: 'لعباً ←' },
      { id: 'zakharafa', label: 'زخرفة ←' }, { id: 'ilman', label: 'علماً ←' },
    ]},
    availability: 'available', source: lesson2Src(24, 'activity_book', 'ألعب وأتعلم', 2),
    teacher: {
      answerOrGuidance: 'وجود ← وجد؛ لعباً ← لعب؛ زخرفة ← زخرف؛ علماً ← علم.',
      explanation: 'يحذف المتعلم حرفاً من كل بطاقة ليصل إلى الفعل المقابل.',
    },
  },
  {
    id: 'l2-a-53', sourceActivityId: 'L2-24-03', teacherSolutionId: 'l2-teacher-L2-24-03',
    stepId: 'l2-s9', page: 24, section: 'أنا وأسرتي', printedNumber: '—',
    instruction: 'أكتب بمساعدة أسرتي جملاً تتضمن بعض قواعد السلامة والأمان في أثناء زيارة أماكن مختارة مثل مسبح أو مناطق مرتفعة.',
    subparts: ['الكتابة بمساعدة الأسرة.', 'جمل لقواعد السلامة والأمان.', 'زيارة أماكن مختارة.', 'الأمثلة المذكورة: مسبح أو مناطق مرتفعة.'],
    interaction: { kind: 'write', label: 'اكتب جملك الأسرية لقواعد السلامة والأمان:', rows: 5 },
    availability: 'available', source: lesson2Src(24, 'activity_book', 'أنا وأسرتي'),
    teacher: {
      answerOrGuidance: 'إنتاج كتابي أسري مفتوح يتضمن قواعد سلامة وأمان مرتبطة بمكان مختار.',
      explanation: 'يقيّم المعلم ارتباط الجمل بسلامة الزيارة ومشاركة الأسرة؛ المسبح والمناطق المرتفعة أمثلة مصدرية وليست قائمة حصرية.',
    },
  },
];

export const LESSON2_COVERAGE = {
  sourceLockPath: 'docs/source-locks/lesson-02-bil-rayi-wal-rayi-al-akhar.md',
  requiredSourceActivities: 53,
  discovered: LESSON2_ACTIVITIES.length,
  studentActivities: LESSON2_ACTIVITIES.length,
  teacherSolutions: LESSON2_ACTIVITIES.filter((activity) => activity.teacher.answerOrGuidance).length,
  explicitSourceGaps: LESSON2_ACTIVITIES.filter((activity) => activity.availability === 'gap').map((activity) => activity.sourceActivityId),
} as const;

export function getLesson2Activity(activityId: string): Lesson2Activity | undefined {
  return LESSON2_ACTIVITIES.find((activity) => activity.id === activityId);
}
