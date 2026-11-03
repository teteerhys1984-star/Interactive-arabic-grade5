import { LessonStep } from '../../types/curriculum';
import { u2l3Src, U2L3_LISTENING_AUDIO_GAP, U2L3_LOCKED_SOURCE_NOTES } from './sourceMeta';

/**
 * Content for Unit 2, Lesson 3 («بِالْعِلْمِ تَرْقَى», pp. 61–68).
 *
 * Layering contract (identical to Unit 2 Lessons 1–2):
 * - «من الكتاب» blocks reproduce ONLY wording verified in the eight scans,
 *   in printed order, with the visible tashkeel preserved as far as legible.
 * - «ملاحظة المنصة» / «شرح المنصة» blocks are platform interface notes
 *   (procedural guidance, descriptions of printed artwork, declared source
 *   limits). They are visually distinct and are NEVER attributed to the book.
 * - Unresolved printed tokens are NOT guessed: the position is marked in the
 *   text and declared in the source reference / source-lock document.
 * - No answer key, no correct choice, no invented question: the supplied
 *   source contains no approved key.
 */

export type U2L3Block =
  | { kind: 'source_info'; heading: string; lines: string[]; source: ReturnType<typeof u2l3Src>; gap?: boolean }
  | { kind: 'source_sentences'; heading: string; sentences: string[]; source: ReturnType<typeof u2l3Src> }
  | { kind: 'source_table'; heading: string; columns: string[]; source: ReturnType<typeof u2l3Src> }
  | { kind: 'poem'; heading: string; stanzas: { right: string; left: string }[]; poet: string; source: ReturnType<typeof u2l3Src> }
  | { kind: 'vocab'; heading: string; items: { term: string; meaning: string }[]; source: ReturnType<typeof u2l3Src> }
  | { kind: 'rule'; heading: string; lines: string[]; source: ReturnType<typeof u2l3Src> }
  | { kind: 'instruction'; heading: string; text: string; source: ReturnType<typeof u2l3Src> }
  | { kind: 'platform_note'; heading: string; lines: string[] }
  | { kind: 'activity'; activityId: string };

export interface U2L3StepContent {
  stepId: string;
  blocks: U2L3Block[];
}

export const U2L3_STEPS: LessonStep[] = [
  {
    id: 'u2l3-s1', stepNumber: 1, title: 'أتأمّل الصور وأستمع', type: 'introduction',
    source: u2l3Src(61, 'textbook_exercise', 'أتأمّل الصورتين وأستمع إلى النص', undefined, U2L3_LOCKED_SOURCE_NOTES.openingRiddle),
  },
  {
    id: 'u2l3-s2', stepNumber: 2, title: 'أقرأ: بالعلم ترقى', type: 'reading_passage',
    source: u2l3Src(62, 'textbook_poetry', 'أقرأ', undefined, U2L3_LOCKED_SOURCE_NOTES.poemLastStanza),
  },
  {
    id: 'u2l3-s3', stepNumber: 3, title: 'الفهم القرائي (١–٥)', type: 'interactive_practice',
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي (١–٥)'),
  },
  {
    id: 'u2l3-s4', stepNumber: 4, title: 'الفهم القرائي (٦–١٠)', type: 'interactive_practice',
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي (٦–١٠)'),
  },
  {
    id: 'u2l3-s5', stepNumber: 5, title: 'التواصل الشفهي وقواعد اللغة', type: 'rule_formulation',
    source: u2l3Src(64, 'textbook_grammar', 'أتواصل شفوياً وقواعد اللغة'),
  },
  {
    id: 'u2l3-s6', stepNumber: 6, title: 'أطبّق والمثالان المعربان', type: 'guided_exploration',
    source: u2l3Src(65, 'textbook_grammar', 'أطبق والتقويم النهائي'),
  },
  {
    id: 'u2l3-s7', stepNumber: 7, title: 'التقويم والإملاء والخط', type: 'interactive_practice',
    source: u2l3Src(66, 'textbook_spelling', 'التقويم النهائي والإملاء والخط'),
  },
  {
    id: 'u2l3-s8', stepNumber: 8, title: 'الخط والتعزيز الكتابي', type: 'interactive_practice',
    source: u2l3Src(67, 'textbook_exercise', 'الخط وأعزّز كتابياً'),
  },
  {
    id: 'u2l3-s9', stepNumber: 9, title: 'ألعب وأتعلّم وأنا وأسرتي', type: 'summary',
    source: u2l3Src(68, 'activity_book', 'ألعب وأتعلّم وأنا وأسرتي'),
  },
];

/** The poem on p. 62, transcribed in its printed two-column layout. */
export const U2L3_POEM = {
  title: 'بِالْعِلْمِ تَرْقَى',
  poet: 'فالح فلوج',
  stanzaSeparator: '*****',
  stanzas: [
    { right: 'أَيُّهَا الطّالِبُ مَهْلًا', left: 'فُزْتَ لا تَطْوِ الكِتابا' },
    { right: 'واتَّخِذْ مِنْهُ صَديقاً', left: 'تَجْنِ شَهْداً مُسْتَطابا' },
    { right: 'يا شَبابَ الغَدِ! عِلْماً', left: 'زانَهُ خُلُقٌ أَصابا' },
    { right: 'والفَتَى السّابِقُ فيكُمْ', left: 'مَنْ طَوى العُمْرَ اكْتِسابا' },
    { right: 'فاسْتَرِدّوا مَجْدَ ماضٍ', left: 'نُورُهُ جَلَّلَ الهِضابا' },
    /**
     * ص٦٢، البيت السادس: الشطر الثاني «فاحْذَرُوا العُجْمَةَ دابا» محسوم من
     * القصّة الإضافية (image-10.png). الكلمة الأخيرة من الشطر الأول تظل معلّمة:
     * القصّة عالية الدقة تُظهر شَدّة ونقطاً ملتبسة، ولا تُقرأ ككلمة واحدة مؤكدة.
     */
    { right: 'لُغَةُ الضّادِ [موضع غير محسوم بصرياً]', left: 'فاحْذَرُوا العُجْمَةَ دابا' },
  ],
} as const;

/** Verbatim book passages, rules and boxed knowledge. */
export const U2L3_SOURCE_TEXT = {
  /** ص٦١، الإطار الأزرق: اللفظان ثُبِتا من القصّة الإضافية image-9.png. */
  openingRiddle: 'خيرُ جَليسٍ ... أُنْسٌ وَوَنِيسٌ، فَمَنْ أنا؟',
  observePictures: 'أَتَأَمَّلُ الصُّورَتَيْنِ الآتِيَتَيْنِ، ثُمَّ أُنَفِّذُ النَّشاطَ:',
  listeningBar: 'أَسْتَمِعُ إِلى النَّصِّ مُراعِياً تَجَنُّبَ المُشَتِّتاتِ، ثُمَّ أُنَفِّذُ الأَنْشِطَةَ الآتِيَةَ:',
  readingHeader: 'أَقْرَأُ:',
  comprehensionHeader: 'الفَهْمُ القِرائِيُّ: أَقْرَأُ النَّصَّ قِراءَةً صامِتَةً في دَقيقَتَيْنِ، ثُمَّ أُنَفِّذُ النَّشاطَ:',
  oralHeader: 'أَتَواصَلُ شَفَوِيّاً: سَرْدُ الحِكايَةِ',
  grammarHeader: 'قَواعِدُ اللُّغَةِ: بِناءُ الفِعْلِ الماضي الصَّحيحِ على الفَتْحِ',
  grammarPassageIntro: 'أَقْرَأُ الفِقْرَةَ الآتِيَةَ قِراءَةً صامِتَةً مُتَأَنِّيَةً:',
  grammarPassage:
    'عَدَّ العُلَماءُ الكِتابَ مَصْدَرَ العِلْمِ، وعُدَّتِ اللُّغَةُ وَسيلَتُهُ الأَساسيَّةُ في نَقْلِ العُلومِ والمَعارِفِ؛ فالكِتابُ والتِّقْنيّاتُ الحَديثَةُ عَمِلا على تَسْهيلِ الحُصولِ على المَعْرِفَةِ. واللُّغاتُ مُعْظَمُها نالَتِ اهْتِمامَ الأُمَمِ الَّتي تَريدُ الاستِفادَةَ مِنْ تَجارِبِ الآخَرينَ، فَقامَ العُلَماءُ بِالتَّرْجَمَةِ بَيْنَ اللُّغاتِ المُخْتَلِفَةِ.',
  grammarExamplesIntro: 'أَقْرَأُ الأَمْثِلَةَ، ثُمَّ أُنَفِّذُ النَّشاطَ:',
  grammarExamples: [
    '– عَدَّ العُلَماءُ الكِتابَ مَصْدَرَ العِلْمِ.',
    '– الكِتابُ والتِّقْنيّاتُ الحَديثَةُ عَمَلا على تَسْهيلِ الحُصولِ على المَعْرِفَةِ.',
    '– نالَتْ لُغَتُنا اهْتِمامَ الأُمَمِ.',
  ],
  grammarRule: [
    '١. الفِعْلُ الماضي فِعْلٌ مَبْنِيٌّ دائِماً.',
    '٢. يُبْنى الفِعْلُ الماضي عَلَى الفَتْحِ إذا:',
    'لَمْ يَتَّصِلْ بِهِ شَيْءٌ.',
    'اتَّصَلَتْ بِهِ أَلِفُ الاثْنَيْنِ.',
    'اتَّصَلَتْ بِهِ تاءُ التَّأْنيثِ السّاكِنَةُ.',
  ],
  applyParagraph:
    'عَزَفَتْ رَنْدُ على القيثارَةِ، فَسَمِعَ مازِنٌ وَريمٌ أَلْحاناً عَذْبَةً، فَكَتَبا كَلِماتٍ مُعَبِّرَيْنِ عَنْ إِعْجابِهِما بِما سَمِعا.',
  applyTableColumns: ['الفِعْلُ الماضي', 'الضَّميرُ أَوِ الحَرْفُ الَّذي اتَّصَلَ بِهِ', 'حَرَكَةُ بِنائِهِ'],
  parsedExamples: [
    'مِثالانِ مُعْرَبانِ:',
    'نالَ المُتَفَوِّقُ جائِزَةً.',
    '– نالَ: فِعْلٌ ماضٍ مَبْنِيٌّ على الفَتْحَةِ الظّاهِرَةِ على آخِرِهِ.',
    '– المُتَفَوِّقُ: فاعِلٌ مَرْفوعٌ، وعَلامَةُ رَفْعِهِ الضَّمَّةُ الظّاهِرَةُ على آخِرِهِ.',
    '– جائِزَةً: مَفْعولٌ بِهِ مَنْصوبٌ، وعَلامَةُ نَصْبِهِ الفَتْحَةُ الظّاهِرَةُ على آخِرِهِ.',
    'قَرَأَتْ ريمُ قِصَّةً.',
    '– قَرَأَتْ: فِعْلٌ ماضٍ مَبْنِيٌّ على الفَتْحَةِ الظّاهِرَةِ على آخِرِهِ، والتّاءُ تاءُ التَّأْنيثِ السّاكِنَةُ حَرْفٌ لا مَحَلَّ لَهُ مِنَ الإِعْرابِ.',
    '– ريمُ: فاعِلٌ مَرْفوعٌ، وعَلامَةُ رَفْعِهِ الضَّمَّةُ الظّاهِرَةُ على آخِرِهِ.',
    '– قِصَّةً: مَفْعولٌ بِهِ مَنْصوبٌ، وعَلامَةُ نَصْبِهِ الفَتْحَةُ الظّاهِرَةُ على آخِرِهِ.',
  ],
  finalEvaluationHeader: 'التَّقْويمُ النِّهائيّ:',
  dictationHeader: 'إِمْلاء: التّاءُ المَرْبوطَةُ والمَبْسوطَةُ',
  dictationPassage:
    'عليكَ أيُّها الطّالِبُ أَلّا تُهْمِلَ الكِتابَ والقِراءَةَ، فإذا جَعَلْتَ مِنْهُما صَديقَيْنِ فَسَتَنالُ التَّفَوُّقَ والنَّجاحَ، وإذا كانَتْ قِراءَتُكَ جُزْءاً مِنْ حَياتِكَ حُزْتَ المَكانَةَ العُلْيا بَيْنَ زُمَلائِكَ، وعلى المُعَلِّمينَ والمُعَلِّماتِ أَنْ يُرْشِدوا تَلاميذَهُمْ إلى اتِّخاذِ المُطالَعَةِ سَبيلاً إلى المَعْرِفَةِ.',
  handwritingHeader: 'الخَطُّ:',
  faida: [
    'فائِدَةٌ:',
    'يُكْتَبُ حَرَفا (الرّاءِ والزّايِ) مِنَ اليَمينِ إلى اليَسارِ خَطّاً عُلْوِيّاً مُسْتَقيماً مائِلاً مُتَّصِلاً بِخَطٍّ سُفْلِيٍّ مَقَوَّسٍ، وإذا جاءَ كُلٌّ مِنْهُما مُتَّصِلاً فإنَّهُ يُكْتَبُ بِسِنٍّ أَوْ مِنْ دُونِ سِنٍّ.',
  ],
  writtenReinforcementHeader: 'أُعِزِّزُ كِتابيّاً: حَقيقَةٌ عِلْميَّةٌ',
  playHeader: 'أَلْعَبُ وَأَتَعَلَّمُ',
  familyHeader: 'أَنا وَأُسْرَتي',
} as const;

export const U2L3_VOCAB = [
  { term: 'مُسْتَطابٌ', meaning: 'طَيِّبٌ.' },
  { term: 'العُجْمَةُ', meaning: 'الكَلامُ غَيْرُ الفَصيحِ.' },
  { term: 'دابا', meaning: 'مُخَفَّفَةٌ مِنْ (دَأْباً): عادَةً.' },
  { term: 'جَلَّلَ الهِضابَ بِمَعْنى', meaning: 'أَضاءَ الكَوْنَ.' },
] as const;

export const U2L3_STEP_CONTENT: Record<string, U2L3StepContent> = {
  /* ================= الخطوة ١: ص٦١ ================= */
  'u2l3-s1': {
    stepId: 'u2l3-s1',
    blocks: [
      {
        kind: 'source_info', heading: 'افتتاح الدرس (من الكتاب)',
        lines: [
          '٣ — بِالْعِلْمِ تَرْقَى',
          U2L3_SOURCE_TEXT.openingRiddle,
          U2L3_SOURCE_TEXT.observePictures,
        ],
        source: u2l3Src(61, 'textbook_exercise', 'افتتاح الدرس', undefined, U2L3_LOCKED_SOURCE_NOTES.openingRiddle),
      },
      {
        kind: 'source_info', heading: 'حدّ مصدر معلن: الإطار الأزرق', gap: true,
        lines: [U2L3_LOCKED_SOURCE_NOTES.openingRiddle],
        source: u2l3Src(61, 'textbook_exercise', 'الإطار الأزرق', undefined, U2L3_LOCKED_SOURCE_NOTES.openingRiddle),
      },
      {
        kind: 'platform_note', heading: 'وصف الصورتين المطبوعتين',
        lines: [
          'الصورة الأولى: ثلاثة أطفال يبنون شكلاً بمكعّبات ملوّنة، وأحدهم يمسك ورقة كُتب عليها «التَّعْليمات».',
          'الصورة الثانية: كتاب مفتوح تعلوه قوس قزح وأشجار، وتخرج منه ورقة كُتب عليها «ض»، وفوقها شريط كُتب عليه «لغة الضاد».',
          'هذا الوصف من المنصة لما يظهر في الصورة المطبوعة، وليس نصّاً من الكتاب.',
        ],
      },
      { kind: 'activity', activityId: 'u2l3-a-01' },
      { kind: 'activity', activityId: 'u2l3-a-02' },
      { kind: 'activity', activityId: 'u2l3-a-03' },
      {
        kind: 'instruction', heading: 'أستمع إلى النص (من الكتاب)', text: U2L3_SOURCE_TEXT.listeningBar,
        source: u2l3Src(61, 'textbook_exercise', 'أستمع إلى النص', undefined, U2L3_LISTENING_AUDIO_GAP),
      },
      {
        kind: 'source_info', heading: 'حدّ مصدر معلن: الاستماع', gap: true,
        lines: ['يطلب الكتاب الاستماع إلى نصّ، وليس في الصفحات المصوّرة تسجيل صوتي.'],
        source: u2l3Src(61, 'textbook_exercise', 'أستمع إلى النص', undefined, U2L3_LISTENING_AUDIO_GAP),
      },
      {
        kind: 'platform_note', heading: 'تنفيذ مهمتَي الاستماع',
        lines: [
          'لا يوجد تسجيل صوتي في المرفقات؛ اقرأ نصّ ص٦٢ بصوت عالٍ، أو اطلب إلى معلّمك قراءته، ثم أجب عن البندين الآتيين.',
          'الخيارات المعروضة هي خيارات الكتاب كما طُبعت، ولا تضع المنصة إجابة صحيحة ولا مفتاح تصحيح.',
        ],
      },
      { kind: 'activity', activityId: 'u2l3-a-04' },
      { kind: 'activity', activityId: 'u2l3-a-05' },
    ],
  },

  /* ================= الخطوة ٢: ص٦٢ ================= */
  'u2l3-s2': {
    stepId: 'u2l3-s2',
    blocks: [
      {
        kind: 'instruction', heading: 'أقرأ (من الكتاب)', text: U2L3_SOURCE_TEXT.readingHeader,
        source: u2l3Src(62, 'textbook_poetry', 'أقرأ'),
      },
      {
        kind: 'poem', heading: `${U2L3_SOURCE_TEXT.readingHeader} «${U2L3_POEM.title}» (من الكتاب)`,
        stanzas: [...U2L3_POEM.stanzas], poet: U2L3_POEM.poet,
        source: u2l3Src(62, 'textbook_poetry', 'النص الشعري', undefined, U2L3_LOCKED_SOURCE_NOTES.poemLastStanza),
      },
      {
        kind: 'source_info', heading: 'حدّ مصدر معلن: البيت السادس', gap: true,
        lines: [U2L3_LOCKED_SOURCE_NOTES.poemLastStanza],
        source: u2l3Src(62, 'textbook_poetry', 'البيت السادس', undefined, U2L3_LOCKED_SOURCE_NOTES.poemLastStanza),
      },
      {
        kind: 'vocab', heading: 'مُعْجَمُ الكَلِماتِ (من الكتاب)',
        items: U2L3_VOCAB.map((item) => ({ term: item.term, meaning: item.meaning })),
        source: u2l3Src(62, 'textbook_poetry', 'معجم الكلمات'),
      },
      { kind: 'activity', activityId: 'u2l3-a-06' },
      { kind: 'activity', activityId: 'u2l3-a-07' },
      { kind: 'activity', activityId: 'u2l3-a-08' },
    ],
  },

  /* ================= الخطوة ٣: ص٦٣ (١–٥) ================= */
  'u2l3-s3': {
    stepId: 'u2l3-s3',
    blocks: [
      {
        kind: 'instruction', heading: 'الفهم القرائي (من الكتاب)', text: U2L3_SOURCE_TEXT.comprehensionHeader,
        source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي'),
      },
      { kind: 'activity', activityId: 'u2l3-a-09' },
      { kind: 'activity', activityId: 'u2l3-a-10' },
      { kind: 'activity', activityId: 'u2l3-a-11' },
      { kind: 'activity', activityId: 'u2l3-a-12' },
      { kind: 'activity', activityId: 'u2l3-a-13' },
    ],
  },

  /* ================= الخطوة ٤: ص٦٣ (٦–١٠) ================= */
  'u2l3-s4': {
    stepId: 'u2l3-s4',
    blocks: [
      {
        kind: 'platform_note', heading: 'تكملة بنود الصفحة نفسها',
        lines: ['البنود ٦–١٠ هي بقية بنود «الفهم القرائي» المطبوعة في ص٦٣، وتُعرض بترتيبها.'],
      },
      { kind: 'activity', activityId: 'u2l3-a-14' },
      { kind: 'activity', activityId: 'u2l3-a-15' },
      { kind: 'activity', activityId: 'u2l3-a-16' },
      { kind: 'activity', activityId: 'u2l3-a-17' },
      { kind: 'activity', activityId: 'u2l3-a-18' },
    ],
  },

  /* ================= الخطوة ٥: ص٦٤ ================= */
  'u2l3-s5': {
    stepId: 'u2l3-s5',
    blocks: [
      {
        kind: 'instruction', heading: 'أتواصل شفوياً (من الكتاب)', text: U2L3_SOURCE_TEXT.oralHeader,
        source: u2l3Src(64, 'textbook_expression', 'أتواصل شفوياً'),
      },
      { kind: 'activity', activityId: 'u2l3-a-19' },
      {
        kind: 'instruction', heading: 'قواعد اللغة (من الكتاب)', text: U2L3_SOURCE_TEXT.grammarHeader,
        source: u2l3Src(64, 'textbook_grammar', 'قواعد اللغة'),
      },
      {
        kind: 'instruction', heading: 'قراءة الفقرة (من الكتاب)', text: U2L3_SOURCE_TEXT.grammarPassageIntro,
        source: u2l3Src(64, 'textbook_grammar', 'أقرأ الفقرة'),
      },
      {
        kind: 'source_info', heading: 'الفقرة (من الكتاب)', lines: [U2L3_SOURCE_TEXT.grammarPassage],
        source: u2l3Src(64, 'textbook_grammar', 'الفقرة'),
      },
      {
        kind: 'instruction', heading: 'الأمثلة (من الكتاب)', text: U2L3_SOURCE_TEXT.grammarExamplesIntro,
        source: u2l3Src(64, 'textbook_grammar', 'أقرأ الأمثلة'),
      },
      {
        kind: 'source_sentences', heading: 'الأمثلة المطبوعة (من الكتاب)',
        sentences: [...U2L3_SOURCE_TEXT.grammarExamples],
        source: u2l3Src(64, 'textbook_grammar', 'الأمثلة'),
      },
      { kind: 'activity', activityId: 'u2l3-a-20' },
      { kind: 'activity', activityId: 'u2l3-a-21' },
      { kind: 'activity', activityId: 'u2l3-a-22' },
      { kind: 'activity', activityId: 'u2l3-a-23' },
      {
        kind: 'rule', heading: 'القاعِدَةُ (من الكتاب)', lines: [...U2L3_SOURCE_TEXT.grammarRule],
        source: u2l3Src(64, 'textbook_grammar', 'القاعدة'),
      },
    ],
  },

  /* ================= الخطوة ٦: ص٦٥ ================= */
  'u2l3-s6': {
    stepId: 'u2l3-s6',
    blocks: [
      {
        kind: 'instruction', heading: 'أَطَبِّقُ (من الكتاب)',
        text: 'أَسْتَخْرِجُ مِنَ الفِقْرَةِ الآتِيَةِ الأَفْعالَ الماضِيَةَ، ثُمَّ أَمْلَأُ الجَدْوَلَ بِالمَطْلوبِ:',
        source: u2l3Src(65, 'textbook_grammar', 'أطبق'),
      },
      {
        kind: 'source_info', heading: 'الفقرة (من الكتاب)', lines: [U2L3_SOURCE_TEXT.applyParagraph],
        source: u2l3Src(65, 'textbook_grammar', 'فقرة التطبيق'),
      },
      {
        kind: 'source_table', heading: 'الجدول المطبوع (من الكتاب)',
        columns: [...U2L3_SOURCE_TEXT.applyTableColumns],
        source: u2l3Src(65, 'textbook_grammar', 'جدول التطبيق'),
      },
      { kind: 'activity', activityId: 'u2l3-a-24' },
      {
        kind: 'source_info', heading: 'مثالان معربان (من الكتاب)',
        lines: [...U2L3_SOURCE_TEXT.parsedExamples],
        source: u2l3Src(65, 'textbook_grammar', 'مثالان معربان'),
      },
      {
        kind: 'instruction', heading: 'التقويم النهائي (من الكتاب)', text: U2L3_SOURCE_TEXT.finalEvaluationHeader,
        source: u2l3Src(65, 'textbook_grammar', 'التقويم النهائي'),
      },
      { kind: 'activity', activityId: 'u2l3-a-25' },
    ],
  },

  /* ================= الخطوة ٧: ص٦٦ ================= */
  'u2l3-s7': {
    stepId: 'u2l3-s7',
    blocks: [
      { kind: 'activity', activityId: 'u2l3-a-26' },
      { kind: 'activity', activityId: 'u2l3-a-27' },
      { kind: 'activity', activityId: 'u2l3-a-28' },
      { kind: 'activity', activityId: 'u2l3-a-29' },
      {
        kind: 'instruction', heading: 'إملاء (من الكتاب)', text: U2L3_SOURCE_TEXT.dictationHeader,
        source: u2l3Src(66, 'textbook_spelling', 'إملاء'),
      },
      {
        kind: 'source_info', heading: 'نصّ الإملاء (من الكتاب)', lines: [U2L3_SOURCE_TEXT.dictationPassage],
        source: u2l3Src(66, 'textbook_spelling', 'نص الإملاء'),
      },
      { kind: 'activity', activityId: 'u2l3-a-30' },
      { kind: 'activity', activityId: 'u2l3-a-31' },
      { kind: 'activity', activityId: 'u2l3-a-32' },
      {
        kind: 'instruction', heading: 'الخط (من الكتاب)', text: U2L3_SOURCE_TEXT.handwritingHeader,
        source: u2l3Src(66, 'textbook_exercise', 'الخط'),
      },
      { kind: 'activity', activityId: 'u2l3-a-33' },
      {
        kind: 'source_info', heading: 'حدّ مصدر معلن: الأشكال الخطية', gap: true,
        lines: [U2L3_LOCKED_SOURCE_NOTES.handwritingWords],
        source: u2l3Src(66, 'textbook_exercise', 'الخط', undefined, U2L3_LOCKED_SOURCE_NOTES.handwritingWords),
      },
    ],
  },

  /* ================= الخطوة ٨: ص٦٧ ================= */
  'u2l3-s8': {
    stepId: 'u2l3-s8',
    blocks: [
      {
        kind: 'rule', heading: 'فائدة (من الكتاب)', lines: [...U2L3_SOURCE_TEXT.faida],
        source: u2l3Src(67, 'textbook_exercise', 'فائدة'),
      },
      { kind: 'activity', activityId: 'u2l3-a-34' },
      { kind: 'activity', activityId: 'u2l3-a-35' },
      { kind: 'activity', activityId: 'u2l3-a-36' },
      { kind: 'activity', activityId: 'u2l3-a-37' },
      { kind: 'activity', activityId: 'u2l3-a-38' },
      {
        kind: 'instruction', heading: 'أعزّز كتابياً (من الكتاب)', text: U2L3_SOURCE_TEXT.writtenReinforcementHeader,
        source: u2l3Src(67, 'textbook_expression', 'أعزّز كتابياً'),
      },
      { kind: 'activity', activityId: 'u2l3-a-39' },
      { kind: 'activity', activityId: 'u2l3-a-40' },
    ],
  },

  /* ================= الخطوة ٩: ص٦٨ ================= */
  'u2l3-s9': {
    stepId: 'u2l3-s9',
    blocks: [
      {
        kind: 'instruction', heading: 'ألعب وأتعلّم (من الكتاب)', text: U2L3_SOURCE_TEXT.playHeader,
        source: u2l3Src(68, 'activity_book', 'ألعب وأتعلّم'),
      },
      { kind: 'activity', activityId: 'u2l3-a-41' },
      { kind: 'activity', activityId: 'u2l3-a-42' },
      {
        kind: 'instruction', heading: 'أنا وأسرتي (من الكتاب)', text: U2L3_SOURCE_TEXT.familyHeader,
        source: u2l3Src(68, 'activity_book', 'أنا وأسرتي'),
      },
      { kind: 'activity', activityId: 'u2l3-a-43' },
      {
        kind: 'platform_note', heading: 'حدّ مصدر معلن: اختبار الدرس',
        lines: [
          'انتهت مواد الدرس كما وردت في الصفحات ٦١–٦٨.',
          'لا يُسجَّل اختبار للدرس لأن المرفقات لا تتضمّن مفتاح إجابة معتمد؛ ولا تُنشئ المنصة أسئلة أو خيارات أو مفاتيح تصحيح من عندها.',
          U2L3_LOCKED_SOURCE_NOTES.tashkeel,
        ],
      },
    ],
  },
};
