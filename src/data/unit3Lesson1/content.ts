import { LessonStep } from '../../types/curriculum';
import { u3l1Src, U3L1_LISTENING_AUDIO_GAP, U3L1_LOCKED_SOURCE_NOTES } from './sourceMeta';

/**
 * Content for Unit 3, Lesson 1 («العُلَماءُ الصِّغار», pp. 73–83).
 *
 * Layering contract (identical to Unit 2 Lessons 1–3):
 * - «من الكتاب» blocks reproduce ONLY wording verified in the eleven scans,
 *   in printed order, with the visible tashkeel preserved as far as legible.
 * - «ملاحظة المنصة» / «شرح المنصة» blocks are platform interface notes
 *   (procedural guidance, descriptions of printed artwork, declared source
 *   limits). They are visually distinct and are NEVER attributed to the book.
 * - No answer key, no correct choice, no invented question: the supplied
 *   source contains no approved key.
 */

export type U3L1Block =
  | { kind: 'source_info'; heading: string; lines: string[]; source: ReturnType<typeof u3l1Src>; gap?: boolean }
  | { kind: 'source_sentences'; heading: string; sentences: string[]; source: ReturnType<typeof u3l1Src> }
  | { kind: 'source_table'; heading: string; columns: string[]; source: ReturnType<typeof u3l1Src> }
  | { kind: 'poem'; heading: string; stanzas: { right: string; left: string }[]; poet: string; source: ReturnType<typeof u3l1Src> }
  | { kind: 'vocab'; heading: string; items: { term: string; meaning: string }[]; source: ReturnType<typeof u3l1Src> }
  | { kind: 'rule'; heading: string; lines: string[]; source: ReturnType<typeof u3l1Src> }
  | { kind: 'instruction'; heading: string; text: string; source: ReturnType<typeof u3l1Src> }
  | { kind: 'platform_note'; heading: string; lines: string[] }
  | { kind: 'activity'; activityId: string };

export interface U3L1StepContent {
  stepId: string;
  blocks: U3L1Block[];
}

export const U3L1_STEPS: LessonStep[] = [
  {
    id: 'u3l1-s1', stepNumber: 1, title: 'أتأمّل الصورتين وأستمع', type: 'introduction',
    source: u3l1Src(73, 'textbook_exercise', 'أتأمّل الصورتين وأستمع إلى النص'),
  },
  {
    id: 'u3l1-s2', stepNumber: 2, title: 'أقرأ: العلماء الصغار', type: 'reading_passage',
    source: u3l1Src(74, 'textbook_poetry', 'أقرأ'),
  },
  {
    id: 'u3l1-s3', stepNumber: 3, title: 'الفهم القرائي', type: 'interactive_practice',
    source: u3l1Src(75, 'textbook_exercise', 'الفهم القرائي'),
  },
  {
    id: 'u3l1-s4', stepNumber: 4, title: 'إعراب الفعل المضارع: الرفع', type: 'rule_formulation',
    source: u3l1Src(76, 'textbook_grammar', 'قواعد اللغة: إعراب الفعل المضارع'),
  },
  {
    id: 'u3l1-s5', stepNumber: 5, title: 'إعراب الفعل المضارع: النصب', type: 'guided_exploration',
    source: u3l1Src(76, 'textbook_grammar', 'قواعد اللغة: إعراب الفعل المضارع'),
  },
  {
    id: 'u3l1-s6', stepNumber: 6, title: 'إعراب الفعل المضارع: الجزم والقاعدة والتقويم', type: 'guided_exploration',
    source: u3l1Src(77, 'textbook_grammar', 'أطبّق والقاعدة والتقويم النهائي'),
  },
  {
    id: 'u3l1-s7', stepNumber: 7, title: 'الإملاء: الهمزة المتوسطة', type: 'interactive_practice',
    source: u3l1Src(78, 'textbook_spelling', 'إملاء: الهمزة المتوسطة'),
  },
  {
    id: 'u3l1-s8', stepNumber: 8, title: 'الخط: السين والشين', type: 'interactive_practice',
    source: u3l1Src(80, 'textbook_exercise', 'الخط'),
  },
  {
    id: 'u3l1-s9', stepNumber: 9, title: 'أعبّر كتابياً: الرسالة', type: 'interactive_practice',
    source: u3l1Src(81, 'textbook_expression', 'أعبّر كتابياً: الرسالة'),
  },
  {
    id: 'u3l1-s10', stepNumber: 10, title: 'ألعب وأتعلّم وأنا وأسرتي', type: 'summary',
    source: u3l1Src(83, 'activity_book', 'ألعب وأتعلّم وأنا وأسرتي'),
  },
  {
    id: 'u3l1-s11', stepNumber: 11, title: 'خلاصة الدرس', type: 'summary',
    source: u3l1Src(83, 'activity_book', 'خلاصة الدرس'),
  },
];

/** The poem on p. 74, transcribed in its printed two-column layout. */
export const U3L1_POEM = {
  title: 'العُلَماءُ الصِّغارُ',
  poet: 'إبراهيم فهد منصور',
  stanzaSeparator: '****',
  stanzas: [
    { right: 'نَسْمُو لِلأَقْمَارِ وَنَعْلُو', left: 'لِلنُّورِ، وَيَهْدينا العَقْلُ' },
    { right: 'نَنْهَلُ عِلْماً، لا نَتَوانَى', left: 'كَلّا لَنْ يَغْلِبَنا الجَهْلُ' },
    { right: 'نَبْحَثُ في أَيَّةِ مُشْكَلَةٍ', left: 'وَسَرِيعاً يَأْتينا الحَلُّ!' },
    { right: 'نَدْرُسُ في جِدٍّ وَنَشَاطٍ', left: 'نِعْمَ القَوْلُ، وَنِعْمَ الفِعْلُ' },
    { right: 'نَتَحَدَّى المَجْهُولَ وَنَمْضِي', left: 'لا تَخْشَى أَبَداً أَنْ تَفْشَلَ' },
    { right: 'ما دُمْنَا نَدْرُسُ خُطْوَتَنا', left: 'وَسَعَادَتُنا أَنَّا... نَعْمَلُ' },
    { right: 'نُدْرِكُ بِالأَرْقَامِ... عُلُوماً', left: 'وَنُهَنْدِسُ عِلْمَ المُسْتَقْبَلِ' },
    { right: 'فِينَا يَزْهُو الوَطَنُ الأَغْلَى', left: 'وَبِنَا يَغْدُو الحاضِرُ أَجْمَلَ!' },
  ],
} as const;

/** Verbatim book passages, rules and boxed knowledge. */
export const U3L1_SOURCE_TEXT = {
  lessonTitle: 'العُلَماءُ الصِّغارُ',
  subtitle: 'كيف يغدو بنا الحاضر أجمل؟',
  observeHeader: 'أَتَأَمَّلُ الصُّورَتَيْنِ الآتِيَتَيْنِ، ثُمَّ أُنَفِّذُ الأَنْشِطَةَ:',
  listeningBar: 'أَسْتَمِعُ إِلَى النَّصِّ مُراعِياً تَجَنُّبَ الانْصِرافِ عَنِ المُتَحَدِّثِ، ثُمَّ أُنَفِّذُ الأَنْشِطَةَ:',
  readingHeader: 'أَقْرَأُ:',
  comprehensionHeader: 'الفَهْمُ القِرائِيُّ: أَقْرَأُ النَّصَّ قِراءَةً صامِتَةً، ثُمَّ أُنَفِّذُ النَّشاطَ',
  oralHeader: 'أَتَواصَلُ شَفَوِيّاً:',
  grammarHeader: 'قَواعِدُ اللُّغَةِ: إِعْرابُ الفِعْلِ المُضارِعِ',
  grammarVerse: 'نُدْرِكُ بِالأَرْقَامِ... عُلُوماً وَنُهَنْدِسُ عِلْمَ المُسْتَقْبَلِ',
  grammarPassage:
    'نَحْنُ نَعْرِفُ تَماماً أَنَّهُ لَنْ يَسْتَطِيعَ الجَهْلُ أَنْ يَغْلِبَ المُتَعَلِّمَ الَّذي واظَبَ على دِراسَتِهِ كَيْ يُحَقِّقَ طُموحَهُ.',
  jazmPassage:
    'لَمْ يَصِلْ أَحَدٌ إِلى التَّمَيُّزِ مِنْ دونِ جُهْدٍ، فَلا تُضَيِّعْ وَقْتَكَ بِلا فائِدَةٍ، وَلْتَحْرِصْ على الاستِفادَةِ مِنْ كُلِّ دَقيقَةٍ مِنْهُ.',
  rafRule: [
    'الفِعْلُ المُضارِعُ: فِعْلٌ يَدُلُّ على حَدَثٍ في الزَّمَنِ الحاضِرِ أَوِ المُسْتَقْبَلِ.',
    'الفِعْلُ المُضارِعُ مَرْفوعٌ، وَعَلامَةُ رَفْعِهِ الضَّمَّةُ إِذا لَمْ يَسْبِقْهُ حَرْفُ ناصِبٍ أَوْ جازِمٍ.',
  ],
  nasbRule: [
    'أَنْ، لَنْ، كَيْ: أَحْرُفٌ ناصِبَةٌ تَسْبِقُ الفِعْلَ المُضارِعَ، وَتُغَيِّرُ حَرَكَةَ آخِرِهِ.',
    'عَلامَةُ نَصْبِ الفِعْلِ المُضارِعِ الفَتْحَةُ الظّاهِرَةُ.',
  ],
  jazmRule: [
    'لَمْ، لا النّاهِيَةِ، لامُ الأَمْرِ: أَحْرُفٌ جازِمَةٌ تَسْبِقُ الفِعْلَ المُضارِعَ، وَتُغَيِّرُ حَرَكَةَ آخِرِهِ.',
    'عَلامَةُ جَزْمِ الفِعْلِ المُضارِعِ السُّكونُ.',
  ],
  grammarRule: [
    '١. الفِعْلُ المُضارِعُ: فِعْلٌ يَدُلُّ على حَدَثٍ في الزَّمَنِ الحاضِرِ أَوِ المُسْتَقْبَلِ.',
    '٢. الفِعْلُ المُضارِعُ مَرْفوعٌ، وَعَلامَةُ رَفْعِهِ الضَّمَّةُ إِذا لَمْ يَسْبِقْهُ حَرْفُ ناصِبٍ أَوْ جازِمٍ.',
    '٣. الفِعْلُ المُضارِعُ مَنْصوبٌ، وَعَلامَةُ نَصْبِهِ الفَتْحَةُ إِذا سَبَقَهُ حَرْفُ ناصِبٍ.',
    '٤. مِنَ الأَحْرُفِ النّاصِبَةِ: أَنْ، لَنْ، كَيْ.',
    '٥. الفِعْلُ المُضارِعُ مَجْزومٌ، وَعَلامَةُ جَزْمِهِ السُّكونُ إِذا سَبَقَهُ حَرْفُ جازِمٍ.',
    '٦. مِنَ الأَحْرُفِ الجازِمَةِ: لَمْ، لامُ الأَمْرِ، لا النّاهِيَةُ.',
  ],
  parsedExample: [
    'مِثالٌ مُعْرَبٌ: يَدْرُسُ المُجِدُّ كَيْ يَتَفَوَّقَ.',
    '– يَدْرُسُ: فِعْلٌ مُضارِعٌ مَرْفوعٌ، وَعَلامَةُ رَفْعِهِ الضَّمَّةُ الظّاهِرَةُ على آخِرِهِ.',
    '– المُجِدُّ: فاعِلٌ مَرْفوعٌ، وَعَلامَةُ رَفْعِهِ الضَّمَّةُ الظّاهِرَةُ على آخِرِهِ.',
    '– كَيْ: حَرْفُ نَصْبٍ.',
    '– يَتَفَوَّقَ: فِعْلٌ مُضارِعٌ مَنْصوبٌ، وَعَلامَةُ نَصْبِهِ الفَتْحَةُ الظّاهِرَةُ على آخِرِهِ.',
  ],
  finalEvaluationPassage:
    'تَبْدَأُ رِحْلَةُ اكْتِشافِ الأَطْفالِ المَوْهوبينَ مِنْ سِنِّ الطُّفولَةِ، فَتَقومُ المُؤَسَّساتُ بِرِعايَتِهِمْ، وَلَنْ تَتَطَوَّرَ مَوْهِبَةٌ ما لَمْ تَجِدْ مَنْ يُشَجِّعُ على اسْتِمْرارِها. وَتَعَلُّقُ هَذِهِ المَوْهِبَةِ بِاهْتِمامِ الطِّفْلِ، وَعَلى المُؤَسَّساتِ أَنْ تُقابِلَ هَذَا الاهْتِمامَ بِاهْتِمامٍ أَكْبَرَ كَيْ تَسْتَفيدَ مِنْ هَذِهِ المَوْهِبَةِ، مَتَبَيِّنَةً الشُّعاعَ الَّتي لِتُشَجِّعَ مَواهِبَ أَبْنائِنا كَيْ تَتَحَوَّلَ إِلى إِبْداعٍ..',
  finalEvaluationTableColumns: ['المضارع المرفوع', 'علامة رفعه', 'المضارع المنصوب', 'الحرف الناصب', 'علامة النصب', 'المضارع المجزوم', 'الحرف الجازم', 'علامة الجزم'],
  dictationHeader: 'إِمْلاء: الهَمْزَةُ المُتَوَسِّطَةُ',
  dictationPassage:
    'أَطْفالُ اليَوْمِ رِجالُ المُسْتَقْبَلِ، يَجِبُ رِعايَتُهُمُ وَالاهْتِمامُ بِتَعْليمِهِمْ وَتَنْشِئَتُهُمْ تَنْشِئَةً سَليمَةً وَحِمايَتُهُمْ مِنْ تَأْثيرِ الأَفْكارِ السَّلْبِيَّةِ الَّتي قَدْ تُؤَثِّرُ فيهِمْ، وَقَدْ تَطَوَّرَ العالَمُ تَطَوُّراً هائِلاً في مَجالِ تَرْبِيَةِ الأَطْفالِ، لِهَذا يَجِبُ أَنْ نُؤْمِنَ بِدَوْرِ العُلومِ المُخْتَلِفَةِ في تَرْبِيَةِ الأَطْفالِ.',
  dictationExamples: [
    '– يَنْبَغي لَنا حِمايَةُ الأَطْفالِ مِنْ تَأْثيرِ الأَفْكارِ السَّلْبِيَّةِ الَّتي قَدْ تُؤَثِّرُ فيهِمْ.',
    '– يَجِبُ رِعايَةُ الأَطْفالِ وَتَنْشِئَتُهُمْ تَنْشِئَةً سَليمَةً.',
  ],
  dictationRemember:
    'أَتَذَكَّرُ: تَرْتِيبُ الحَرَكَاتِ مِنَ الأَقْوَى إِلَى الأَضْعَفِ: الكَسْرَةُ ثُمَّ الضَّمَّةُ ثُمَّ الفَتْحَةُ أَمّا السُّكونُ فَلا تُعَدُّ حَرَكَةً لِذَلِكَ فَهِيَ الأَضْعَفُ.',
  hamzaRule: [
    'الهَمْزَةُ المُتَوَسِّطَةُ: هَمْزَةٌ تَقَعُ في وَسَطِ الكَلِمَةِ.',
    'لِكِتابَةِ الهَمْزَةِ المُتَوَسِّطَةِ نَنْظُرُ إِلى حَرَكَتِها وَحَرَكَةِ الحَرْفِ الَّذي قَبْلَها، وَنَكْتُبُها عَلى الحَرْفِ الَّذي يُناسِبُ أَقْوَى الحَرَكَتَيْنِ.',
    'مُناسَبَةُ الحُروفِ لِلْحَرَكَاتِ: الكَسْرَةُ تُناسِبُها النَّبْرَةُ، وَالضَّمَّةُ تُناسِبُها الواوُ، وَالفَتْحَةُ تُناسِبُها الأَلِفُ.',
  ],
  handwritingHeader: 'الخَطُّ:',
  handwritingWords: 'نَدْرُسُ – سَعادَتُنا – نَسْمُو – شَمْسٌ – فَراشٌ – شَهيدٌ – نَحْيى – رِيشٌ',
  handwritingFaida: 'يُكْتَبُ حَرْفا السِّينِ وَالشِّينِ فَوْقَ السَّطْرِ.',
  handwritingVerse: 'نَبْحَثُ في أَيَّةِ مُشْكَلَةٍ وَسَرِيعاً يَأْتينا الحَلُّ!',
  letterHeader: 'أُعَبِّرُ كِتابِيّاً: الرِّسالَةُ',
  letterModel: [
    'دمشق ٢٠١٨/٢/٢٦',
    'صَديقي العَزيز عامِر',
    'تَحِيَّةٌ طَيِّبَةٌ مَعْطَرَةٌ بِعَبَقِ المَوَدَّةِ:',
    'سَرَّني فَوْزُكَ مُسابَقَةِ رُوّادِ الفَصاحَةِ وَالخَطابَةِ عَلى مُسْتَوى القُطْرِ، فَطالَما كُنْتَ صاحِبَ مَوْهِبَةٍ اسْتَطَعْتَ بِإِصْرارِكَ أَنْ تَصْقُلَها وَتُنَمِّيَها، وَتُدْرِكَ حُلْماً كُنْتَ تَعْمَلُ لِأَجْلِهِ، وَاجْتَهَدْتَ لِلْبُلوغِهِ. مُبارَكٌ لَكَ هَذَا النَّجاحُ.',
    'أَتَمَنَّى لَكَ التَّوْفيقَ وَالتَّمْييزَ دائِماً',
    'صَديقُكَ مازِن',
  ],
  letterDefinition: [
    'الرِّسالَةُ الشَّخْصِيَّةُ هِيَ: رِسالَةٌ بَيْنَ الأَصْدِقاءِ وَالأَقارِبِ تَكْشِفُ عَلاقاتِ المَوَدَّةِ وَالمَحَبَّةِ وَتُعالِجُ مَوْضوعاً مُحَدَّداً.',
    'عَناصِرُ الرِّسالَةِ: الجِهَةُ (المُرْسِلَةُ وَالمُرْسَلَةُ إِلَيْها)، التّاريخُ، المُقَدِّمَةُ، المَوْضوعُ، الخاتِمَةُ.',
  ],
  playHeader: 'أَلْعَبُ وَأَتَعَلَّمُ',
  familyHeader: 'أَنا وَأُسْرَتي',
} as const;

export const U3L1_STEP_CONTENT: Record<string, U3L1StepContent> = {
  /* ================= الخطوة ١: ص٧٣ ================= */
  'u3l1-s1': {
    stepId: 'u3l1-s1',
    blocks: [
      {
        kind: 'source_info', heading: 'افتتاح الدرس (من الكتاب)',
        lines: [U3L1_SOURCE_TEXT.lessonTitle, U3L1_SOURCE_TEXT.subtitle, U3L1_SOURCE_TEXT.observeHeader],
        source: u3l1Src(73, 'textbook_exercise', 'افتتاح الدرس'),
      },
      {
        kind: 'platform_note', heading: 'وصف الصورتين المطبوعتين',
        lines: [
          'الصورة الأولى: تلاميذ في مكتبة مدرسية يقرؤون ويكتبون، وأحدهم يمسك كتاباً أخضر.',
          'الصورة الثانية: تلميذان يعملان في مختبر مدرسي على طاولة تجارب.',
          'هذا الوصف من المنصة لما يظهر في الصورة المطبوعة، وليس نصّاً من الكتاب.',
        ],
      },
      { kind: 'activity', activityId: 'u3l1-a-01' },
      { kind: 'activity', activityId: 'u3l1-a-02' },
      { kind: 'activity', activityId: 'u3l1-a-03' },
      { kind: 'activity', activityId: 'u3l1-a-04' },
      {
        kind: 'instruction', heading: 'أستمع إلى النص (من الكتاب)', text: U3L1_SOURCE_TEXT.listeningBar,
        source: u3l1Src(73, 'textbook_exercise', 'أستمع إلى النص', undefined, U3L1_LISTENING_AUDIO_GAP),
      },
      {
        kind: 'source_info', heading: 'حدّ مصدر معلن: الاستماع', gap: true,
        lines: ['يطلب الكتاب الاستماع إلى نصّ، وليس في الصفحات المصوّرة تسجيل صوتي. تُعرض الأسئلة كما طُبعت بلا حلول.'],
        source: u3l1Src(73, 'textbook_exercise', 'أستمع إلى النص', undefined, U3L1_LISTENING_AUDIO_GAP),
      },
      {
        kind: 'platform_note', heading: 'تنفيذ أسئلة الاستماع',
        lines: [
          'التسجيل الصوتي غير متوفر؛ لا تُعرض المنصة نصّ استماع ولا إجابات. أجب عن الأسئلة الثلاثة الآتية وفق ما سمعته في الصف.',
          'الخيارات المعروضة هي خيارات الكتاب كما طُبعت، ولا تضع المنصة إجابة صحيحة ولا مفتاح تصحيح.',
        ],
      },
      { kind: 'activity', activityId: 'u3l1-a-05' },
      { kind: 'activity', activityId: 'u3l1-a-06' },
      { kind: 'activity', activityId: 'u3l1-a-07' },
    ],
  },

  /* ================= الخطوة ٢: ص٧٤ ================= */
  'u3l1-s2': {
    stepId: 'u3l1-s2',
    blocks: [
      {
        kind: 'instruction', heading: 'أقرأ (من الكتاب)', text: U3L1_SOURCE_TEXT.readingHeader,
        source: u3l1Src(74, 'textbook_poetry', 'أقرأ'),
      },
      {
        kind: 'poem', heading: `${U3L1_SOURCE_TEXT.readingHeader} «${U3L1_POEM.title}» (من الكتاب)`,
        stanzas: [...U3L1_POEM.stanzas], poet: U3L1_POEM.poet,
        source: u3l1Src(74, 'textbook_poetry', 'النص الشعري'),
      },
      {
        kind: 'platform_note', heading: 'ملاحظة عن القصيدة',
        lines: ['القصيدة نصّ قراءة فقط؛ لا تُنسب إلى نصّ الاستماع في ص٧٣، إذ العلاقة بينهما غير مثبتة في المصدر.'],
      },
      { kind: 'activity', activityId: 'u3l1-a-08' },
      { kind: 'activity', activityId: 'u3l1-a-09' },
      { kind: 'activity', activityId: 'u3l1-a-10' },
    ],
  },

  /* ================= الخطوة ٣: ص٧٥ ================= */
  'u3l1-s3': {
    stepId: 'u3l1-s3',
    blocks: [
      {
        kind: 'instruction', heading: 'الفهم القرائي (من الكتاب)', text: U3L1_SOURCE_TEXT.comprehensionHeader,
        source: u3l1Src(75, 'textbook_exercise', 'الفهم القرائي'),
      },
      { kind: 'activity', activityId: 'u3l1-a-11' },
      { kind: 'activity', activityId: 'u3l1-a-12' },
      { kind: 'activity', activityId: 'u3l1-a-13' },
      { kind: 'activity', activityId: 'u3l1-a-14' },
      { kind: 'activity', activityId: 'u3l1-a-15' },
      { kind: 'activity', activityId: 'u3l1-a-16' },
      { kind: 'activity', activityId: 'u3l1-a-17' },
      { kind: 'activity', activityId: 'u3l1-a-18' },
      { kind: 'activity', activityId: 'u3l1-a-19' },
      { kind: 'activity', activityId: 'u3l1-a-20' },
    ],
  },

  /* ================= الخطوة ٤: ص٧٦ (الرفع) ================= */
  'u3l1-s4': {
    stepId: 'u3l1-s4',
    blocks: [
      {
        kind: 'instruction', heading: 'أتواصل شفوياً (من الكتاب)', text: U3L1_SOURCE_TEXT.oralHeader,
        source: u3l1Src(76, 'textbook_expression', 'أتواصل شفوياً'),
      },
      { kind: 'activity', activityId: 'u3l1-a-21' },
      {
        kind: 'instruction', heading: 'قواعد اللغة (من الكتاب)', text: U3L1_SOURCE_TEXT.grammarHeader,
        source: u3l1Src(76, 'textbook_grammar', 'قواعد اللغة'),
      },
      {
        kind: 'source_info', heading: 'البيت (من الكتاب)', lines: [U3L1_SOURCE_TEXT.grammarVerse],
        source: u3l1Src(76, 'textbook_grammar', 'البيت'),
      },
      { kind: 'activity', activityId: 'u3l1-a-22' },
      { kind: 'activity', activityId: 'u3l1-a-23' },
      {
        kind: 'rule', heading: 'أَتَذَكَّرُ (من الكتاب)', lines: [...U3L1_SOURCE_TEXT.rafRule],
        source: u3l1Src(76, 'textbook_grammar', 'أتذكّر'),
      },
      { kind: 'activity', activityId: 'u3l1-a-24' },
    ],
  },

  /* ================= الخطوة ٥: ص٧٦ (النصب) ================= */
  'u3l1-s5': {
    stepId: 'u3l1-s5',
    blocks: [
      {
        kind: 'source_info', heading: 'الفقرة (من الكتاب)', lines: [U3L1_SOURCE_TEXT.grammarPassage],
        source: u3l1Src(76, 'textbook_grammar', 'أقرأ ما يأتي'),
      },
      { kind: 'activity', activityId: 'u3l1-a-25' },
      { kind: 'activity', activityId: 'u3l1-a-26' },
      { kind: 'activity', activityId: 'u3l1-a-27' },
      {
        kind: 'rule', heading: 'أَتَذَكَّرُ (من الكتاب)', lines: [...U3L1_SOURCE_TEXT.nasbRule],
        source: u3l1Src(77, 'textbook_grammar', 'أتذكّر'),
      },
      { kind: 'activity', activityId: 'u3l1-a-28' },
    ],
  },

  /* ================= الخطوة ٦: ص٧٧–٧٨ (الجزم والقاعدة والتقويم) ================= */
  'u3l1-s6': {
    stepId: 'u3l1-s6',
    blocks: [
      {
        kind: 'source_info', heading: 'الفقرة (من الكتاب)', lines: [U3L1_SOURCE_TEXT.jazmPassage],
        source: u3l1Src(77, 'textbook_grammar', 'أقرأ ما يأتي'),
      },
      { kind: 'activity', activityId: 'u3l1-a-29' },
      { kind: 'activity', activityId: 'u3l1-a-30' },
      {
        kind: 'rule', heading: 'أَسْتَنْتِجُ (من الكتاب)', lines: [...U3L1_SOURCE_TEXT.jazmRule],
        source: u3l1Src(77, 'textbook_grammar', 'أستنتج'),
      },
      { kind: 'activity', activityId: 'u3l1-a-31' },
      {
        kind: 'rule', heading: 'القاعِدَةُ (من الكتاب)', lines: [...U3L1_SOURCE_TEXT.grammarRule],
        source: u3l1Src(77, 'textbook_grammar', 'القاعدة'),
      },
      {
        kind: 'source_info', heading: 'مِثالٌ مُعْرَبٌ (من الكتاب)', lines: [...U3L1_SOURCE_TEXT.parsedExample],
        source: u3l1Src(78, 'textbook_grammar', 'مثال معرب'),
      },
      {
        kind: 'source_info', heading: 'نصّ التقويم (من الكتاب)', lines: [U3L1_SOURCE_TEXT.finalEvaluationPassage],
        source: u3l1Src(78, 'textbook_grammar', 'التقويم النهائي'),
      },
      {
        kind: 'source_table', heading: 'جدول التقويم (من الكتاب)',
        columns: [...U3L1_SOURCE_TEXT.finalEvaluationTableColumns],
        source: u3l1Src(78, 'textbook_grammar', 'جدول التقويم'),
      },
      { kind: 'activity', activityId: 'u3l1-a-32' },
      { kind: 'activity', activityId: 'u3l1-a-33' },
      { kind: 'activity', activityId: 'u3l1-a-34' },
      { kind: 'activity', activityId: 'u3l1-a-35' },
    ],
  },

  /* ================= الخطوة ٧: ص٧٨–٧٩ (الإملاء والهمزة) ================= */
  'u3l1-s7': {
    stepId: 'u3l1-s7',
    blocks: [
      {
        kind: 'instruction', heading: 'إملاء (من الكتاب)', text: U3L1_SOURCE_TEXT.dictationHeader,
        source: u3l1Src(78, 'textbook_spelling', 'إملاء'),
      },
      {
        kind: 'source_info', heading: 'فقرة الإملاء (من الكتاب)', lines: [U3L1_SOURCE_TEXT.dictationPassage],
        source: u3l1Src(78, 'textbook_spelling', 'فقرة الإملاء'),
      },
      {
        kind: 'source_sentences', heading: 'المثالان (من الكتاب)',
        sentences: [...U3L1_SOURCE_TEXT.dictationExamples],
        source: u3l1Src(78, 'textbook_spelling', 'المثالان'),
      },
      {
        kind: 'rule', heading: 'أَتَذَكَّرُ (من الكتاب)', lines: [U3L1_SOURCE_TEXT.dictationRemember],
        source: u3l1Src(78, 'textbook_spelling', 'أتذكّر'),
      },
      { kind: 'activity', activityId: 'u3l1-a-36' },
      { kind: 'activity', activityId: 'u3l1-a-37' },
      { kind: 'activity', activityId: 'u3l1-a-38' },
      { kind: 'activity', activityId: 'u3l1-a-39' },
      {
        kind: 'rule', heading: 'أَسْتَنْتِجُ (من الكتاب)', lines: [...U3L1_SOURCE_TEXT.hamzaRule],
        source: u3l1Src(79, 'textbook_spelling', 'أستنتج'),
      },
      { kind: 'activity', activityId: 'u3l1-a-40' },
      { kind: 'activity', activityId: 'u3l1-a-41' },
      { kind: 'activity', activityId: 'u3l1-a-42' },
      { kind: 'activity', activityId: 'u3l1-a-43' },
    ],
  },

  /* ================= الخطوة ٨: ص٨٠ (الخط) ================= */
  'u3l1-s8': {
    stepId: 'u3l1-s8',
    blocks: [
      {
        kind: 'instruction', heading: 'الخطّ (من الكتاب)', text: U3L1_SOURCE_TEXT.handwritingHeader,
        source: u3l1Src(80, 'textbook_exercise', 'الخطّ'),
      },
      {
        kind: 'source_info', heading: 'الكلمات (من الكتاب)', lines: [U3L1_SOURCE_TEXT.handwritingWords],
        source: u3l1Src(80, 'textbook_exercise', 'الكلمات'),
      },
      {
        kind: 'rule', heading: 'فائِدَةٌ (من الكتاب)', lines: [U3L1_SOURCE_TEXT.handwritingFaida],
        source: u3l1Src(80, 'textbook_exercise', 'فائدة'),
      },
      {
        kind: 'source_info', heading: 'حدّ مصدر معلن: نماذج الخطّ', gap: true,
        lines: [U3L1_LOCKED_SOURCE_NOTES.handwritingModels],
        source: u3l1Src(80, 'textbook_exercise', 'نماذج الخطّ', undefined, U3L1_LOCKED_SOURCE_NOTES.handwritingModels),
      },
      { kind: 'activity', activityId: 'u3l1-a-44' },
      { kind: 'activity', activityId: 'u3l1-a-45' },
      { kind: 'activity', activityId: 'u3l1-a-46' },
      { kind: 'activity', activityId: 'u3l1-a-47' },
      { kind: 'activity', activityId: 'u3l1-a-48' },
    ],
  },

  /* ================= الخطوة ٩: ص٨١–٨٢ (الرسالة) ================= */
  'u3l1-s9': {
    stepId: 'u3l1-s9',
    blocks: [
      { kind: 'activity', activityId: 'u3l1-a-49' },
      {
        kind: 'instruction', heading: 'أُعَبِّرُ كِتابِيّاً (من الكتاب)', text: U3L1_SOURCE_TEXT.letterHeader,
        source: u3l1Src(81, 'textbook_expression', 'أعبّر كتابياً'),
      },
      {
        kind: 'source_info', heading: 'نموذج الرسالة (من الكتاب)', lines: [...U3L1_SOURCE_TEXT.letterModel],
        source: u3l1Src(81, 'textbook_expression', 'نموذج الرسالة', undefined, U3L1_LOCKED_SOURCE_NOTES.printedDate),
      },
      { kind: 'activity', activityId: 'u3l1-a-50' },
      { kind: 'activity', activityId: 'u3l1-a-51' },
      { kind: 'activity', activityId: 'u3l1-a-52' },
      { kind: 'activity', activityId: 'u3l1-a-53' },
      { kind: 'activity', activityId: 'u3l1-a-54' },
      {
        kind: 'rule', heading: 'أَسْتَنْتِجُ (من الكتاب)', lines: [...U3L1_SOURCE_TEXT.letterDefinition],
        source: u3l1Src(82, 'textbook_expression', 'أستنتج'),
      },
      { kind: 'activity', activityId: 'u3l1-a-55' },
    ],
  },

  /* ================= الخطوة ١٠: ص٨٣ ================= */
  'u3l1-s10': {
    stepId: 'u3l1-s10',
    blocks: [
      {
        kind: 'instruction', heading: 'أَلْعَبُ وَأَتَعَلَّمُ (من الكتاب)', text: U3L1_SOURCE_TEXT.playHeader,
        source: u3l1Src(83, 'activity_book', 'ألعب وأتعلّم'),
      },
      {
        kind: 'platform_note', heading: 'وصف الصورة المطبوعة',
        lines: [
          'صورة لاعبين يلعبان كرة السلة، وأحدهما يستخدم كرسياً متحركاً.',
          'هذا الوصف من المنصة لما يظهر في الصورة المطبوعة، وليس نصّاً من الكتاب.',
        ],
      },
      { kind: 'activity', activityId: 'u3l1-a-56' },
      {
        kind: 'instruction', heading: 'أَنا وَأُسْرَتي (من الكتاب)', text: U3L1_SOURCE_TEXT.familyHeader,
        source: u3l1Src(83, 'activity_book', 'أنا وأسرتي'),
      },
      { kind: 'activity', activityId: 'u3l1-a-57' },
    ],
  },

  /* ================= الخطوة ١١: خلاصة مستقلة (شرح المنصة) ================= */
  'u3l1-s11': {
    stepId: 'u3l1-s11',
    blocks: [
      {
        kind: 'platform_note', heading: 'خلاصة الدرس',
        lines: [
          'هذا الملخّص شرح من المنصة، وليس نصّاً من الكتاب.',
          'قرأتَ قصيدة «العُلَماءُ الصِّغارُ» وتدرّبتَ على الفهم القرائي.',
          'تعرّفتَ إعراب الفعل المضارع: الرفع والنصب والجزم، وكتابة الهمزة المتوسطة.',
          'تدرّبتَ على خطّ السين والشين بخط الرقعة، وعلى كتابة الرسالة الشخصية وعناصرها.',
        ],
      },
    ],
  },
};
