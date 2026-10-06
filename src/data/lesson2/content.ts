import { LessonStep } from '../../types/curriculum';
import { lesson2Src, LISTENING_SOURCE_GAP, LOCKED_SOURCE_GAPS } from './sourceMeta';

/** Content and source presentations for Lesson 2.
 * Every source-labelled sentence below is present in the Source Lock; where the
 * lock records a missing model/text, the UI presents that fact rather than
 * reconstructing the missing material.
 */

export interface Lesson2VocabItem {
  term: string;
  meaning: string;
}

export type Lesson2Block =
  | { kind: 'source_info'; heading: string; lines: string[]; source: ReturnType<typeof lesson2Src>; availability?: 'available' | 'gap'; gapReason?: string }
  | { kind: 'source_sentences'; heading: string; sentences: string[]; source: ReturnType<typeof lesson2Src> }
  | { kind: 'vocab'; heading: string; items: Lesson2VocabItem[]; source: ReturnType<typeof lesson2Src> }
  | { kind: 'rule'; heading: string; lines: string[]; source: ReturnType<typeof lesson2Src> }
  | { kind: 'instruction'; heading: string; text: string; source: ReturnType<typeof lesson2Src> }
  | { kind: 'activity'; activityId: string }
  | { kind: 'explanation'; heading: string; lines: string[] };

export interface Lesson2StepContent {
  stepId: string;
  blocks: Lesson2Block[];
}

export const LESSON2_STEPS: LessonStep[] = [
  {
    id: 'l2-s1', stepNumber: 1, title: 'أستكشف الصور وأستمع', type: 'introduction',
    source: lesson2Src(12, 'textbook_exercise', 'أتأمل الصور وأستمع إلى النص'),
  },
  {
    id: 'l2-s2', stepNumber: 2, title: 'أقرأ النص الشعري', type: 'reading_passage',
    source: lesson2Src(13, 'textbook_poetry', 'أقرأ'),
  },
  {
    id: 'l2-s3', stepNumber: 3, title: 'الفهم القرائي', type: 'interactive_practice',
    source: lesson2Src(14, 'textbook_exercise', 'الفهم القرائي', undefined, undefined, 15),
  },
  {
    id: 'l2-s4', stepNumber: 4, title: 'أتواصل شفهياً: مقابلة صحفية', type: 'guided_exploration',
    source: lesson2Src(16, 'textbook_expression', 'أتواصل شفهياً: مقابلة صحفية', undefined, undefined, 17),
  },
  {
    id: 'l2-s5', stepNumber: 5, title: 'قواعد اللغة: المصادر', type: 'rule_formulation',
    source: lesson2Src(17, 'textbook_grammar', 'قواعد اللغة: المصادر', undefined, undefined, 18),
  },
  {
    id: 'l2-s6', stepNumber: 6, title: 'إملاء: همزة القطع', type: 'rule_formulation',
    source: lesson2Src(19, 'textbook_spelling', 'إملاء: همزة القطع', undefined, undefined, 20),
  },
  {
    id: 'l2-s7', stepNumber: 7, title: 'الخط: الهمزة والمد والألف', type: 'interactive_practice',
    source: lesson2Src(21, 'textbook_exercise', 'الخط: كتابة الهمزة والمد والألف', undefined, undefined, 22),
  },
  {
    id: 'l2-s8', stepNumber: 8, title: 'أعبر كتابياً: إضافة تراكيب جديدة', type: 'interactive_practice',
    source: lesson2Src(22, 'textbook_expression', 'أعبر كتابياً: إضافة تراكيب جديدة', undefined, undefined, 23),
  },
  {
    id: 'l2-s9', stepNumber: 9, title: 'ألعب وأتعلم', type: 'summary',
    source: lesson2Src(24, 'activity_book', 'ألعب وأتعلم'),
  },
];

const INTERVIEW_REQUIREMENTS = [
  'اختيار الموضوع.',
  'تحديد الشخصية وإخبارها بالزمان والمكان.',
  'تحضير أسئلة قصيرة ومتعلقة مباشرة بالموضوع.',
  'اختيار عبارات مناسبة لافتتاح المقابلة.',
  'الترحيب بالضيف في بداية اللقاء وشكره في نهايته.',
  'إعطاء الوقت الكافي للضيف لإبداء رأيه.',
];

export const SOURCE_RULES = {
  source: 'المصدر: اسم من جنس الفعل يدل على حدث مجرد من الزمن.',
  hamzatQat: 'تأتي همزة القطع في أول الحروف والأسماء والأفعال.',
  hamzatQatPlaces: [
    'الفعل الماضي الثلاثي المبدوء بهمزة ومصدره، والماضي الرباعي وأمره ومصدره.',
    'في كل الحروف والأسماء.',
  ],
};

export const LESSON2_STEP_CONTENT: Record<string, Lesson2StepContent> = {
  'l2-s1': {
    stepId: 'l2-s1',
    blocks: [
      {
        kind: 'source_info', heading: 'مثيرات الصفحة الافتتاحية',
        lines: [
          'ثلاث صور افتتاحية تربط الوطن/العلم، الحوار، وتعاون الأطفال.',
          'هذه مثيرات للمحادثة ولا تحمل نصاً ثابتاً يجب نسخه.',
        ],
        source: lesson2Src(12, 'textbook_exercise', 'أتأمل الصور'),
      },
      { kind: 'activity', activityId: 'l2-a-01' },
      { kind: 'activity', activityId: 'l2-a-02' },
      { kind: 'activity', activityId: 'l2-a-03' },
      {
        kind: 'source_info', heading: 'تنبيه المصدر: الاستماع', availability: 'gap',
        lines: ['تطلب الصفحة الاستماع إلى «النص».'],
        gapReason: LISTENING_SOURCE_GAP,
        source: lesson2Src(12, 'textbook_reading', 'أستمع إلى النص', undefined, LISTENING_SOURCE_GAP),
      },
      { kind: 'activity', activityId: 'l2-a-04' },
      { kind: 'activity', activityId: 'l2-a-05' },
      { kind: 'activity', activityId: 'l2-a-06' },
    ],
  },
  'l2-s2': {
    stepId: 'l2-s2',
    blocks: [
      {
        kind: 'source_info', heading: 'النص الشعري الموثق', availability: 'gap',
        lines: [
          'العنوان: «بالرأي والرأي الآخر».',
          'الشاعر: صالح هواري.',
          'النص مبني على ثلاثة مقاطع تفصل بينها علامات نجوم وردية.',
        ],
        gapReason: LOCKED_SOURCE_GAPS.poemFullText,
        source: lesson2Src(13, 'textbook_poetry', 'أقرأ', undefined, LOCKED_SOURCE_GAPS.poemFullText),
      },
      {
        kind: 'vocab', heading: 'معجم الكلمات (من المصدر)',
        items: [
          { term: 'تتصفّى', meaning: 'تنتقي' },
          { term: 'الحكمة', meaning: 'اعتماد العقل والعلم بحقائق الأمور' },
          { term: 'تاج محبتنا', meaning: 'عشقنا' },
        ],
        source: lesson2Src(13, 'textbook_poetry', 'معجم الكلمات'),
      },
      { kind: 'activity', activityId: 'l2-a-07' },
      { kind: 'activity', activityId: 'l2-a-08' },
      { kind: 'activity', activityId: 'l2-a-09' },
    ],
  },
  'l2-s3': {
    stepId: 'l2-s3',
    blocks: [
      {
        kind: 'instruction', heading: 'الفهم القرائي',
        text: 'الفهم القرائي.',
        source: lesson2Src(14, 'textbook_exercise', 'الفهم القرائي'),
      },
      { kind: 'activity', activityId: 'l2-a-10' },
      { kind: 'activity', activityId: 'l2-a-11' },
      { kind: 'activity', activityId: 'l2-a-12' },
      { kind: 'activity', activityId: 'l2-a-13' },
      { kind: 'activity', activityId: 'l2-a-14' },
      { kind: 'activity', activityId: 'l2-a-15' },
      { kind: 'activity', activityId: 'l2-a-16' },
      { kind: 'activity', activityId: 'l2-a-17' },
      { kind: 'activity', activityId: 'l2-a-18' },
      { kind: 'activity', activityId: 'l2-a-19' },
      { kind: 'activity', activityId: 'l2-a-20' },
      { kind: 'activity', activityId: 'l2-a-21' },
    ],
  },
  'l2-s4': {
    stepId: 'l2-s4',
    blocks: [
      {
        kind: 'source_info', heading: 'نموذج المقابلة الصحفية',
        lines: [
          'مقابلة صحفية بين صحفية وخبير توعية صحية عن مخلفات الحرب/المخلفات المتفجرة، وتعريفها وأنواعها وطرق الوقاية منها.',
          'يتضمن النموذج أدوار المتحدثين وافتتاح المقابلة وخاتمتها المهذبة.',
        ],
        source: lesson2Src(16, 'textbook_expression', 'أتواصل شفهياً: مقابلة صحفية'),
      },
      {
        kind: 'source_sentences', heading: 'متطلبات إجراء مقابلة صحفية (إرشادات داعمة لا أنشطة مستقلة)',
        sentences: INTERVIEW_REQUIREMENTS,
        source: lesson2Src(16, 'textbook_expression', 'أتعلم'),
      },
      { kind: 'activity', activityId: 'l2-a-22' },
    ],
  },
  'l2-s5': {
    stepId: 'l2-s5',
    blocks: [
      {
        kind: 'source_sentences', heading: 'أمثلة الاستقراء',
        sentences: ['عملاً', 'إتقان', 'تقديم'],
        source: lesson2Src(17, 'textbook_grammar', 'قواعد اللغة: المصادر'),
      },
      { kind: 'activity', activityId: 'l2-a-23' },
      { kind: 'activity', activityId: 'l2-a-24' },
      { kind: 'activity', activityId: 'l2-a-25' },
      { kind: 'activity', activityId: 'l2-a-26' },
      {
        kind: 'rule', heading: 'القاعدة (من المصدر)', lines: [SOURCE_RULES.source],
        source: lesson2Src(17, 'textbook_grammar', 'القاعدة'),
      },
      { kind: 'explanation', heading: 'كيف أتحقق؟', lines: [
        'إذا دلّت الكلمة على الحدث من غير أن تحدد ماضياً أو مضارعاً أو أمراً، فهي مصدر.',
        'أقارنها بالفعل الموافق لها: الفعل يرتبط بزمن، والمصدر لا يرتبط بزمن.',
      ]},
      { kind: 'activity', activityId: 'l2-a-27' },
      { kind: 'activity', activityId: 'l2-a-28' },
      { kind: 'activity', activityId: 'l2-a-29' },
      { kind: 'activity', activityId: 'l2-a-30' },
      { kind: 'activity', activityId: 'l2-a-31' },
      { kind: 'activity', activityId: 'l2-a-32' },
    ],
  },
  'l2-s6': {
    stepId: 'l2-s6',
    blocks: [
      {
        kind: 'source_sentences', heading: 'أمثلة الاستقراء',
        sentences: ['أقبل', 'إقبالاً', 'أخذ', 'أملاً', 'أساس', 'أن', 'إلى'],
        source: lesson2Src(19, 'textbook_spelling', 'أقرأ الأمثلة'),
      },
      { kind: 'activity', activityId: 'l2-a-33' },
      { kind: 'activity', activityId: 'l2-a-34' },
      { kind: 'activity', activityId: 'l2-a-35' },
      { kind: 'activity', activityId: 'l2-a-36' },
      { kind: 'activity', activityId: 'l2-a-37' },
      {
        kind: 'rule', heading: 'القاعدة (من المصدر)',
        lines: [SOURCE_RULES.hamzatQat, ...SOURCE_RULES.hamzatQatPlaces],
        source: lesson2Src(19, 'textbook_spelling', 'القاعدة'),
      },
      { kind: 'explanation', heading: 'طريقة فحص سريعة', lines: [
        'انظر إلى أول الكلمة: هل فيها همزة مرسومة فوق الألف أو تحته؟',
        'ارجع إلى مواضع القاعدة في المصدر قبل أن تحكم على النوع.',
        'هذا شرح المنصة يساعد على التفكير؛ القاعدة المعتمدة معروضة فوقه منفصلة.',
      ]},
      { kind: 'activity', activityId: 'l2-a-38' },
      { kind: 'activity', activityId: 'l2-a-39' },
      { kind: 'activity', activityId: 'l2-a-40' },
      { kind: 'activity', activityId: 'l2-a-41' },
      { kind: 'activity', activityId: 'l2-a-42' },
    ],
  },
  'l2-s7': {
    stepId: 'l2-s7',
    blocks: [
      {
        kind: 'source_info', heading: 'نموذجا الخط الموثقان', availability: 'gap',
        lines: [
          'مادة الخط هي رسم الهمزة والمد والألف بخط الرقعة، مع قاعدتين بصريتين لاتجاه الألف المفردة والمتصلة ورسمي الهمزة والمد.',
          'نموذج مقارنة بين خط النسخ وخط الرقعة لتحديد موضع الهمزة والألف؛ هذا نموذج كتابي، لا مادة نصية جديدة مستقلة.',
        ],
        gapReason: LOCKED_SOURCE_GAPS.handwritingModels,
        source: lesson2Src(21, 'textbook_exercise', 'الخط: كتابة الهمزة والمد والألف', undefined, LOCKED_SOURCE_GAPS.handwritingModels, 22),
      },
      { kind: 'activity', activityId: 'l2-a-43' },
      { kind: 'activity', activityId: 'l2-a-44' },
      { kind: 'activity', activityId: 'l2-a-45' },
      { kind: 'activity', activityId: 'l2-a-46' },
    ],
  },
  'l2-s8': {
    stepId: 'l2-s8',
    blocks: [
      {
        kind: 'source_info', heading: 'وصف المصدر للحوار', availability: 'gap',
        lines: [
          'حوار بين العشب وظل الشجرة يسمعه عصفور في يوم صيفي حار. الموضوع: العشب يضيق بحرارة الشمس وحركة الظل، والظل يوضح أن حركته مرتبطة بالوقت وبحركة أغصان الشجرة والريح.',
          'صورة أخ وأخته الصغيرة وفكرة زيارة الحديقة، وهي مثير لحوار كتابي.',
        ],
        gapReason: LOCKED_SOURCE_GAPS.grassDialogueFullText,
        source: lesson2Src(22, 'textbook_expression', 'أعبر كتابياً: إضافة تراكيب جديدة', undefined, LOCKED_SOURCE_GAPS.grassDialogueFullText, 23),
      },
      { kind: 'activity', activityId: 'l2-a-47' },
      { kind: 'activity', activityId: 'l2-a-48' },
      { kind: 'activity', activityId: 'l2-a-49' },
      { kind: 'activity', activityId: 'l2-a-50' },
    ],
  },
  'l2-s9': {
    stepId: 'l2-s9',
    blocks: [
      {
        kind: 'instruction', heading: 'ألعب وأتعلم',
        text: 'ألعب وأتعلم.',
        source: lesson2Src(24, 'activity_book', 'ألعب وأتعلم'),
      },
      { kind: 'activity', activityId: 'l2-a-51' },
      { kind: 'activity', activityId: 'l2-a-52' },
      { kind: 'activity', activityId: 'l2-a-53' },
    ],
  },
};
