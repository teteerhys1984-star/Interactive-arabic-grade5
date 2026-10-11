import { LessonStep } from '../../types/curriculum';
import { lesson3Src, LISTENING_AUDIO_GAP, LOCKED_SOURCE_NOTES } from './sourceMeta';

/** Content and source presentations for Lesson 3.
 * Every source-labelled sentence below is present in the Source Lock
 * (docs/source-locks/lesson-03-lughati.md); the poem was additionally
 * cross-verified with the poet's published text.
 */

export interface Lesson3VocabItem {
  term: string;
  meaning: string;
}

export type Lesson3Block =
  | { kind: 'source_info'; heading: string; lines: string[]; source: ReturnType<typeof lesson3Src>; availability?: 'available' | 'gap'; gapReason?: string }
  | { kind: 'source_sentences'; heading: string; sentences: string[]; source: ReturnType<typeof lesson3Src> }
  | { kind: 'vocab'; heading: string; items: Lesson3VocabItem[]; source: ReturnType<typeof lesson3Src> }
  | { kind: 'rule'; heading: string; lines: string[]; source: ReturnType<typeof lesson3Src> }
  | { kind: 'instruction'; heading: string; text: string; source: ReturnType<typeof lesson3Src> }
  | { kind: 'activity'; activityId: string }
  | { kind: 'explanation'; heading: string; lines: string[] };

export interface Lesson3StepContent {
  stepId: string;
  blocks: Lesson3Block[];
}

export const LESSON3_STEPS: LessonStep[] = [
  {
    id: 'l3-s1', stepNumber: 1, title: 'أستكشف الصور وأستمع', type: 'introduction',
    source: lesson3Src(25, 'textbook_exercise', 'أتأمل الصور وأستمع إلى النص'),
  },
  {
    id: 'l3-s2', stepNumber: 2, title: 'أقرأ النص الشعري «لغتي»', type: 'reading_passage',
    source: lesson3Src(26, 'textbook_poetry', 'أقرأ'),
  },
  {
    id: 'l3-s3', stepNumber: 3, title: 'الفهم القرائي', type: 'interactive_practice',
    source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي'),
  },
  {
    id: 'l3-s4', stepNumber: 4, title: 'أتواصل شفهياً: حوار عن الترجمة', type: 'guided_exploration',
    source: lesson3Src(28, 'textbook_expression', 'أتواصل شفهياً: إجراء حوار'),
  },
  {
    id: 'l3-s5', stepNumber: 5, title: 'قواعد اللغة: أركان الجملة الفعلية', type: 'rule_formulation',
    source: lesson3Src(28, 'textbook_grammar', 'قواعد اللغة: أركان الجملة الفعلية', undefined, undefined, 29),
  },
  {
    id: 'l3-s6', stepNumber: 6, title: 'إملاء: همزة الوصل', type: 'rule_formulation',
    source: lesson3Src(30, 'textbook_spelling', 'إملاء: همزة الوصل', undefined, undefined, 32),
  },
  {
    id: 'l3-s7', stepNumber: 7, title: 'الخط: رسم ب ت ث بخط الرقعة', type: 'interactive_practice',
    source: lesson3Src(33, 'textbook_exercise', 'الخط', undefined, undefined, 34),
  },
  {
    id: 'l3-s8', stepNumber: 8, title: 'أعبر كتابياً: التقديم والتأخير', type: 'interactive_practice',
    source: lesson3Src(34, 'textbook_expression', 'أعبر كتابياً: التقديم والتأخير'),
  },
  {
    id: 'l3-s9', stepNumber: 9, title: 'ألعب وأتعلم', type: 'summary',
    source: lesson3Src(35, 'activity_book', 'ألعب وأتعلم'),
  },
];

export const LESSON3_POEM = {
  title: 'لُغَتي',
  poet: 'حليم دموس',
  verses: [
    'لَو لَم تَكُن أُمُّ اللُّغاتِ هيَ المُنى / لَكَسَرتُ أَقلامي وَعِفتُ مِدادي',
    'لُغَةٌ إِذا وَقَعَت عَلى أَسماعِنا / كانَت لَنا بَرداً عَلى الأَكبادِ',
    'سَتَظَلُّ رابِطَةً تُؤَلِّفُ بَينَنا / فَهيَ الرَّجاءُ لِناطقٍ بِالضَّادِ',
    'وَتَقارُبُ الأَرواحِ لَيسَ يَضِيرُهُ / بَينَ الدِّيارِ تَباعُدُ الأَجسادِ',
    'أَفَما رَأَيتَ الشَّمسَ وَهيَ بَعِيدَةٌ / تُهدي الشُّعاعَ لِأَنجُدٍ وَوِهادِ',
    'أَنا كَيفَ سَرتُ أَرى الأَنامَ أَحِبَّتي / وَالقَومُ قَومي وَالبِلادُ بِلادي',
  ],
} as const;

export const SOURCE_RULES = {
  verbalSentence: 'تتألَّفُ الجُملَةُ الفِعليَّةُ مِنْ فِعْلٍ وفاعِلٍ، أَوْ مِنْ فِعْلٍ وفاعِلٍ ومَفْعولٍ بِهِ.',
  waslInduction1: 'تقعُ همزةُ الوصلِ في أمرِ الفعلِ الثلاثيِّ وماضي الخماسيِّ والسداسيِّ وأمرِهما.',
  waslInduction2: 'تقعُ همزةُ الوصلِ في مصادرِ الأفعالِ الخماسيةِ والسداسيةِ، وفي الأسماءِ: ابن، ابنة، امرؤ، امرأة، اثنتان، اثنان، اسم ...',
  waslRule: 'تقعُ همزةُ الوصلِ في: أمرِ الفعلِ الثلاثيِّ وماضي الخماسيِّ والسداسيِّ وأمرِهما ومصدرِهما. الأسماءِ: ابن، ابنة، امرؤٌ، امرأةٌ، اثنان، اثنتان، اسم ...',
  handwriting: 'تُكتَبُ الأحرفُ الثلاثةُ (ب - ت - ث) بشكلٍ مائلٍ قليلاً من اليمينِ إلى اليسارِ، بدايتُها أعلى من نهايتِها ومُرتكزةٌ على السطرِ.',
  taqdim: 'يمكنُ تغييرُ صياغةِ نصٍّ ما بتقديمِ بعضِ الكلماتِ (أسماء - أفعال - حروف) أو الجملِ وتأخيرِها، مع مراعاةِ المحافظةِ على المعنى.',
};

export const LESSON3_STEP_CONTENT: Record<string, Lesson3StepContent> = {
  'l3-s1': {
    stepId: 'l3-s1',
    blocks: [
      {
        kind: 'source_info', heading: 'العبارة التمهيدية والمثيرات البصرية',
        lines: [
          'لغةُ الضَّادِ... إنَّهُ يَجمعُنا... فما السَّبيلُ إلى الحِفاظِ عليها؟',
          'ثلاث صور: صفٌّ يجلس تلاميذه حول طاولة، شاعر يلقي في قرية، ولفافة كُتب عليها «اللغة العربية».',
        ],
        source: lesson3Src(25, 'textbook_exercise', 'أتأمل الصور', undefined, LOCKED_SOURCE_NOTES.introPronoun),
        availability: 'gap', gapReason: LOCKED_SOURCE_NOTES.introPronoun,
      },
      { kind: 'activity', activityId: 'l3-a-01' },
      { kind: 'activity', activityId: 'l3-a-02' },
      { kind: 'activity', activityId: 'l3-a-03' },
      { kind: 'activity', activityId: 'l3-a-04' },
      {
        kind: 'source_info', heading: 'تنبيه المصدر: الاستماع', availability: 'gap',
        lines: ['تطلب الصفحة الاستماع إلى «النص» وتنفيذ نشاطين.'],
        gapReason: LISTENING_AUDIO_GAP,
        source: lesson3Src(25, 'textbook_reading', 'أستمع إلى النص', undefined, LISTENING_AUDIO_GAP),
      },
      { kind: 'activity', activityId: 'l3-a-05' },
      { kind: 'activity', activityId: 'l3-a-06' },
    ],
  },
  'l3-s2': {
    stepId: 'l3-s2',
    blocks: [
      {
        kind: 'source_sentences', heading: `قصيدة «${LESSON3_POEM.title}» — ${LESSON3_POEM.poet} (من المصدر)`,
        sentences: [...LESSON3_POEM.verses],
        source: lesson3Src(26, 'textbook_poetry', 'أقرأ'),
      },
      {
        kind: 'vocab', heading: 'معجم الكلمات (من المصدر)',
        items: [
          { term: 'مِداد', meaning: 'سائلٌ يُكتَبُ بِهِ (حِبرٌ)' },
          { term: 'يَضِيرُهُ', meaning: 'يَضُرُّهُ' },
          { term: 'الأَنام', meaning: 'النَّاس' },
          { term: 'أَنجُد', meaning: 'جَمعٌ مُفرَدُهُ نَجدٌ، وهو المُرتَفِعُ من الأَرض' },
          { term: 'وِهاد', meaning: 'جَمعٌ مُفرَدُهُ وَهدَةٌ، وهو المُنخَفَضُ من الأَرض' },
        ],
        source: lesson3Src(26, 'textbook_poetry', 'معجم الكلمات'),
      },
      { kind: 'activity', activityId: 'l3-a-07' },
      { kind: 'activity', activityId: 'l3-a-08' },
      { kind: 'activity', activityId: 'l3-a-09' },
    ],
  },
  'l3-s3': {
    stepId: 'l3-s3',
    blocks: [
      {
        kind: 'instruction', heading: 'الفهم القرائي',
        text: 'أَقرَأُ النَّصَّ قِراءةً صامِتةً، ثُمَّ أُنَفِّذُ النَّشاطَ.',
        source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي'),
      },
      { kind: 'activity', activityId: 'l3-a-10' },
      { kind: 'activity', activityId: 'l3-a-11' },
      { kind: 'activity', activityId: 'l3-a-12' },
      { kind: 'activity', activityId: 'l3-a-13' },
      { kind: 'activity', activityId: 'l3-a-14' },
      { kind: 'activity', activityId: 'l3-a-15' },
      { kind: 'activity', activityId: 'l3-a-16' },
      { kind: 'activity', activityId: 'l3-a-17' },
      { kind: 'activity', activityId: 'l3-a-18' },
    ],
  },
  'l3-s4': {
    stepId: 'l3-s4',
    blocks: [
      {
        kind: 'source_info', heading: 'مثير الحوار: كتابا الرازي',
        lines: [
          'صورتا كتاب «الحاوي في الطب» لأبي بكر الرازي بالعربية وترجمته الإنجليزية «Kitab al-Hawi — Abu Bakr Al-Razi».',
          'الصورتان مثال موثق على نقل تراثنا العلمي إلى الشعوب الأخرى بالترجمة.',
        ],
        source: lesson3Src(28, 'textbook_expression', 'أتواصل شفهياً: إجراء حوار'),
      },
      { kind: 'activity', activityId: 'l3-a-19' },
      { kind: 'activity', activityId: 'l3-a-20' },
    ],
  },
  'l3-s5': {
    stepId: 'l3-s5',
    blocks: [
      {
        kind: 'source_sentences', heading: 'فقرة الاستقراء (من المصدر)',
        sentences: [
          'تحدَّثَ سميرٌ في الإذاعةِ المدرسيةِ عن اللغةِ فقالَ: تتطوَّرُ اللغةُ بتطوُّرِ العلومِ، وتزدادُ مفرداتُها لاستيعابِ الإنجازاتِ الحديثةِ، وفي الوقتِ نفسِهِ تحفظُ اللغةُ تراثَ الشعوبِ، وتنقلُ آثارَهم المكتوبةَ عبرَ العصورِ، لتُشكِّلَ بذلكَ سجلَّ الأمةِ وحافظَها الأمينِ.',
        ],
        source: lesson3Src(28, 'textbook_grammar', 'قواعد اللغة: أركان الجملة الفعلية'),
      },
      {
        kind: 'source_sentences', heading: 'المثالان (من المصدر)',
        sentences: ['تحدَّثَ سميرٌ.', 'تحفظُ اللغةُ التراثَ.'],
        source: lesson3Src(28, 'textbook_grammar', 'قواعد اللغة: أركان الجملة الفعلية'),
      },
      { kind: 'activity', activityId: 'l3-a-21' },
      { kind: 'activity', activityId: 'l3-a-22' },
      { kind: 'activity', activityId: 'l3-a-23' },
      { kind: 'activity', activityId: 'l3-a-24' },
      {
        kind: 'rule', heading: 'القاعدة (من المصدر)',
        lines: [SOURCE_RULES.verbalSentence],
        source: lesson3Src(29, 'textbook_grammar', 'القاعدة'),
      },
      {
        kind: 'source_sentences', heading: 'المثال المعرب (من المصدر)',
        sentences: [
          'يقدِّرُ العلماءُ أهميّةَ اللغةِ.',
          'يقدِّرُ: فعلٌ مضارعٌ مرفوعٌ، وعلامةُ رفعِهِ الضمَّةُ الظاهرةُ على آخرِهِ.',
          'العلماءُ: فاعلٌ مرفوعٌ، وعلامةُ رفعِهِ الضمَّةُ الظاهرةُ على آخرِهِ.',
          'أهميّةَ: مفعولٌ به منصوبٌ، وعلامةُ نصبِهِ الفتحةُ الظاهرةُ على آخرِهِ، وهو مضافٌ.',
          'اللغةِ: مضافٌ إليه مجرورٌ، وعلامةُ جرِّهِ الكسرةُ الظاهرةُ في آخرِهِ.',
        ],
        source: lesson3Src(29, 'textbook_grammar', 'مثال معرب'),
      },
      { kind: 'explanation', heading: 'كيف أتحقق من الأركان؟', lines: [
        'أبحث أولاً عن الفعل في بداية الجملة.',
        'أسأل: من قام بالفعل؟ لأجد الفاعل المرفوع.',
        'أسأل: ماذا وقع عليه الفعل؟ لأجد المفعول به المنصوب إن وجد.',
      ]},
      { kind: 'activity', activityId: 'l3-a-25' },
      { kind: 'activity', activityId: 'l3-a-26' },
      { kind: 'activity', activityId: 'l3-a-27' },
      { kind: 'activity', activityId: 'l3-a-28' },
      { kind: 'activity', activityId: 'l3-a-29' },
      { kind: 'activity', activityId: 'l3-a-30' },
    ],
  },
  'l3-s6': {
    stepId: 'l3-s6',
    blocks: [
      {
        kind: 'source_sentences', heading: 'فقرة الاستقراء الأولى (من المصدر)',
        sentences: [
          'أيُّها العربيُّ: عملَ أجدادُكَ على صونِ اللغةِ واستعملوا علومَها للكشفِ عن عبقريَّتِها، فحافظْ على نقائِها، واعلمْ أنَّ اللغةَ العربيةَ إحدى اللغاتِ العالميةِ التي ارتفعَ شأنُها في المحافلِ الدوليةِ بفضلِ ما قدَّمتْهُ من علومٍ إنسانيةٍ.',
        ],
        source: lesson3Src(30, 'textbook_spelling', 'إملاء: همزة الوصل'),
      },
      {
        kind: 'source_sentences', heading: 'أمثلة الاستقراء (من المصدر)',
        sentences: [
          'اعلمْ أنَّ اللغةَ العربيةَ إحدى اللغاتِ العالميةِ.',
          'تفوّقتْ لغتُنا وارتفعَ شأنُها في المحافلِ الدوليةِ.',
          'عملَ أجدادُكَ على صونِ لغتِنا واستعملوا علومَها.',
        ],
        source: lesson3Src(30, 'textbook_spelling', 'أقرأ الأمثلة'),
      },
      { kind: 'activity', activityId: 'l3-a-31' },
      { kind: 'activity', activityId: 'l3-a-32' },
      { kind: 'activity', activityId: 'l3-a-33' },
      {
        kind: 'rule', heading: 'أستنتج (من المصدر)',
        lines: [SOURCE_RULES.waslInduction1],
        source: lesson3Src(30, 'textbook_spelling', 'أستنتج'),
      },
      { kind: 'activity', activityId: 'l3-a-34' },
      {
        kind: 'source_sentences', heading: 'أمثلة الاستقراء الثانية (من المصدر)',
        sentences: [
          'الحفاظُ على لغتِنا يستوجبُ منّا ممارسةً واستعمالاً دقيقينِ لمهاراتِها.',
          'اهتمامُنا بلغتِنا دليلٌ على محبتِنا وإخلاصِنا.',
          'ينبغي لكلِّ ابنٍ وابنةٍ وكلِّ امرئٍ وامرأةٍ الحرصُ على هذه اللغةِ.',
          'ينبغي لكلِّ اثنتينِ أو اثنينِ أن يتحاورا بلغةٍ سليمةٍ.',
          'أنا حريصٌ على إعلاءِ اسمِ بلادي.',
        ],
        source: lesson3Src(31, 'textbook_spelling', 'أقرأ الأمثلة'),
      },
      { kind: 'activity', activityId: 'l3-a-35' },
      { kind: 'activity', activityId: 'l3-a-36' },
      {
        kind: 'rule', heading: 'أستنتج (من المصدر)',
        lines: [SOURCE_RULES.waslInduction2],
        source: lesson3Src(31, 'textbook_spelling', 'أستنتج'),
      },
      { kind: 'activity', activityId: 'l3-a-37' },
      {
        kind: 'rule', heading: 'القاعدة (من المصدر)',
        lines: [SOURCE_RULES.waslRule],
        source: lesson3Src(31, 'textbook_spelling', 'القاعدة'),
      },
      { kind: 'explanation', heading: 'طريقة فحص سريعة', lines: [
        'أرجع الكلمة إلى نوعها: فعل أمر ثلاثي؟ ماضي أو أمر خماسي أو سداسي؟ مصدر خماسي أو سداسي؟ أم من الأسماء السبعة؟',
        'إن كانت كذلك فهمزتها همزة وصل تُلفظ في أول الكلام وتسقط في درجه.',
        'هذا شرح المنصة يساعد على التفكير؛ القاعدة المعتمدة معروضة فوقه منفصلة.',
      ]},
      { kind: 'activity', activityId: 'l3-a-38' },
      { kind: 'activity', activityId: 'l3-a-39' },
      { kind: 'activity', activityId: 'l3-a-40' },
      { kind: 'activity', activityId: 'l3-a-41' },
      { kind: 'activity', activityId: 'l3-a-42' },
    ],
  },
  'l3-s7': {
    stepId: 'l3-s7',
    blocks: [
      {
        kind: 'rule', heading: 'قاعدة الخط (من المصدر)',
        lines: [SOURCE_RULES.handwriting],
        source: lesson3Src(33, 'textbook_exercise', 'الخط: قاعدة'),
      },
      {
        kind: 'source_info', heading: 'النماذج الخطية الموثقة',
        lines: [
          'أتعلّم يوثق أشكال الباء بخط الرقعة (بـ، ـبـ، ـب، ب) مرقمة ترتيبَ البدء، وخانات لأشكال التاء والثاء.',
          'أطبق: جدول مقارنة أشكال (ب ت ث) بين خطي النسخ والرقعة في ص٣٣–٣٤.',
          'الصف الثالث من كلمات الملاحظة غير محسوم بصرياً؛ لا تُعرض نماذج بديلة أو مصطنعة.',
        ],
        source: lesson3Src(33, 'textbook_exercise', 'أتعلّم وأطبق', undefined, LOCKED_SOURCE_NOTES.handwritingRow3, 34),
        availability: 'gap', gapReason: LOCKED_SOURCE_NOTES.handwritingRow3,
      },
      { kind: 'activity', activityId: 'l3-a-43' },
      { kind: 'activity', activityId: 'l3-a-44' },
      { kind: 'activity', activityId: 'l3-a-45' },
      { kind: 'activity', activityId: 'l3-a-46' },
    ],
  },
  'l3-s8': {
    stepId: 'l3-s8',
    blocks: [
      {
        kind: 'source_sentences', heading: 'النص قبل التقديم والتأخير (من المصدر)',
        sentences: [
          'يخاطبُ النهرُ الطبيعةَ قائلاً، بينَ مترقرقاً أسيرٌ، فتتمايلُ الأشجارُ، والطيورُ على أغصانِها تراقصُ، وعلى ضفتيَّ بساطٌ أخضرُ يمتدُّ فرحاً بلقائي. أُعلِّمُ العطاءَ، والخيرُ أينما اتجهتُ، ولا أنتظرُ الثناءَ من أحدٍ.',
        ],
        source: lesson3Src(34, 'textbook_expression', 'أعبر كتابياً: التقديم والتأخير'),
      },
      {
        kind: 'source_sentences', heading: 'النص بعد التقديم والتأخير (من المصدر)',
        sentences: [
          'يخاطبُ النهرُ الطبيعةَ قائلاً: أسيرٌ مترقرقاً بين الحقولِ، فتتمايلُ الأشجارُ، وتراقصُ الطيورُ على أغصانِها، ويمتدُّ على ضفتيَّ بساطٌ أخضرُ فرحاً بلقائي. أُعلِّمُ العطاءَ، وأحملُ الخيرَ أينما اتجهتُ، ولا أنتظرُ الثناءَ من أحدٍ.',
        ],
        source: lesson3Src(34, 'textbook_expression', 'النص بعد التقديم والتأخير'),
      },
      {
        kind: 'rule', heading: 'أتعلّم (من المصدر)',
        lines: [SOURCE_RULES.taqdim],
        source: lesson3Src(34, 'textbook_expression', 'أتعلّم'),
      },
      {
        kind: 'source_info', heading: 'فقرة التطبيق عن سورية (من المصدر)',
        lines: [
          'أثبتتْ مكتشفاتُ مواقعِ الآثارِ السوريةِ أنَّ أرضَ سوريةَ كانت مزدهرةً بالحضارةِ والفنونِ والإبداعاتِ البشريةِ، منذ استخدامِ الفأسِ الحجريِّ والأدواتِ الصوّانيةِ على الضفافِ العليا للنهرِ الكبيرِ الشماليِّ في محافظةِ اللاذقيةِ.',
          'الجزء الملون: وكان أهلُ سوريةَ أولُ من عمل بالتعدينِ وأولُ من عرفوا صهرَ النحاسِ، ثم البرونزَ، وبفضلِهم تقدّمتْ صناعةُ الحليِّ والخزفِ وبلغتْ مكانةً عالميةً.',
          'المصدر المطبوع: الدكتور علي القيم من كتاب «من كنوزنا السورية».',
        ],
        source: lesson3Src(34, 'textbook_expression', 'أطبق', undefined, LOCKED_SOURCE_NOTES.syriaHeading),
        availability: 'gap', gapReason: LOCKED_SOURCE_NOTES.syriaHeading,
      },
      { kind: 'activity', activityId: 'l3-a-47' },
      { kind: 'activity', activityId: 'l3-a-48' },
    ],
  },
  'l3-s9': {
    stepId: 'l3-s9',
    blocks: [
      {
        kind: 'instruction', heading: 'ألعب وأتعلم',
        text: 'ألعب وأتعلم. مدة التنفيذ: ١٥ دقيقة.',
        source: lesson3Src(35, 'activity_book', 'ألعب وأتعلم'),
      },
      {
        kind: 'source_sentences', heading: 'أبيات الأحجية (من المصدر)',
        sentences: [
          'تعتادُ ارتكابَها / والفعلُ فيها مستهلّ',
          'تماثلُ في اسمِها / يُدريكَ من أدّى العمل',
          'وسبعةٌ حروفُهُ / عليه من وقع العمل',
          'ثلاثةٌ أسماؤها / (فعلٌ) فهل حلٌّ وصل؟!',
        ],
        source: lesson3Src(35, 'activity_book', 'ألعب وأتعلم', 1),
      },
      { kind: 'activity', activityId: 'l3-a-49' },
      { kind: 'activity', activityId: 'l3-a-50' },
      { kind: 'activity', activityId: 'l3-a-51' },
    ],
  },
};
