import { SourceReference } from '../../types/curriculum';
import { lesson3Src, LISTENING_AUDIO_GAP, LOCKED_SOURCE_NOTES } from './sourceMeta';

/**
 * The Lesson 3 coverage ledger.
 * One entry exists for each of the 51 explicit source-lock records in
 * docs/source-locks/lesson-03-lughati.md. Each entry carries:
 * source activity ID → student activity → teacher guidance.
 */

export type SourceAvailability = 'available' | 'gap';

export type Lesson3Interaction =
  | {
      kind: 'text_fields';
      fields: { id: string; label: string; multiline?: boolean; placeholder?: string }[];
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
    }
  | {
      kind: 'classification';
      categories: { id: string; label: string }[];
      items: { id: string; text: string }[];
    }
  | {
      kind: 'handwriting';
      modelText?: string;
      modelDescription: string;
    };

export interface Lesson3Activity {
  /** Stable student-side activity ID. */
  id: string;
  /** Stable Source Lock activity ID, e.g. L3-25-01. */
  sourceActivityId: string;
  /** Stable teacher-guide solution ID. */
  teacherSolutionId: string;
  stepId: string;
  page: number;
  section: string;
  printedNumber: string;
  instruction: string;
  subparts: string[];
  interaction: Lesson3Interaction;
  availability: SourceAvailability;
  source: SourceReference;
  /** Teacher-facing guidance; never presented as undisclosed textbook text. */
  teacher: {
    answerOrGuidance: string;
    explanation: string;
    commonMistakes?: string[];
  };
}

export const LESSON3_ACTIVITIES: Lesson3Activity[] = [
  /* ========================== ص٢٥ ========================== */
  {
    id: 'l3-a-01', sourceActivityId: 'L3-25-01', teacherSolutionId: 'l3-teacher-L3-25-01',
    stepId: 'l3-s1', page: 25, section: 'أتأمل الصور', printedNumber: '١',
    instruction: 'أَصِفُ ما شاهَدتُهُ في الصُّوَرِ السَّابِقَةِ.',
    subparts: ['وصف شفهي مفتوح.', 'المثيرات: صفّ حول طاولة، شاعر يلقي في قرية، لفافة كُتب عليها «اللغة العربية».'],
    interaction: { kind: 'speak', preparationLabel: 'دوّن نقاط وصفك للصور الثلاث:' },
    availability: 'available', source: lesson3Src(25, 'textbook_exercise', 'أتأمل الصور', 1),
    teacher: {
      answerOrGuidance: 'إجابة شفوية مفتوحة؛ يقبل الوصف الذي يلتزم بالمثيرات البصرية الموثقة ولا يضيف تفاصيل غير مرئية.',
      explanation: 'يقوّم المعلم وضوح الوصف وربطه بالصور الثلاث: جلسة تعلم جماعية، إلقاء الشعر، ولفافة اللغة العربية.',
    },
  },
  {
    id: 'l3-a-02', sourceActivityId: 'L3-25-02', teacherSolutionId: 'l3-teacher-L3-25-02',
    stepId: 'l3-s1', page: 25, section: 'أتأمل الصور', printedNumber: '٢',
    instruction: 'ما اللُّغَةُ المكتوبةُ في الصُّورَةِ الأَخيرةِ؟',
    subparts: ['قراءة الكتابة الظاهرة على اللفافة: «اللغة العربية».'],
    interaction: { kind: 'text_fields', fields: [{ id: 'language', label: 'اللغة المكتوبة في الصورة الأخيرة', placeholder: 'اكتب اسم اللغة' }] },
    availability: 'available', source: lesson3Src(25, 'textbook_exercise', 'أتأمل الصور', 2),
    teacher: {
      answerOrGuidance: 'اللغة العربية؛ فهي المكتوبة على اللفافة في الصورة الأخيرة.',
      explanation: 'الصورة الأخيرة درج/لفافة تظهر عليه عبارة «اللغة العربية».',
    },
  },
  {
    id: 'l3-a-03', sourceActivityId: 'L3-25-03', teacherSolutionId: 'l3-teacher-L3-25-03',
    stepId: 'l3-s1', page: 25, section: 'أتأمل الصور', printedNumber: '٣',
    instruction: 'أُعَدِّدُ بعضَ اللُّغاتِ التي أعرِفُها.',
    subparts: ['تعداد مفتوح للغات يعرفها المتعلم.'],
    interaction: { kind: 'write', label: 'أعدد اللغات التي أعرفها:', rows: 3, placeholder: 'مثال: العربية، …' },
    availability: 'available', source: lesson3Src(25, 'textbook_exercise', 'أتأمل الصور', 3),
    teacher: {
      answerOrGuidance: 'تعداد مفتوح؛ يقبل أي لغات يعرفها المتعلم مثل الإنجليزية والفرنسية والسريانية.',
      explanation: 'الهدف ربط الدرس بتنوع اللغات تمهيداً لاختصاص العربية بحرف الضاد.',
    },
  },
  {
    id: 'l3-a-04', sourceActivityId: 'L3-25-04', teacherSolutionId: 'l3-teacher-L3-25-04',
    stepId: 'l3-s1', page: 25, section: 'أتأمل الصور', printedNumber: '٤',
    instruction: 'أَيُّ الحروفِ يُنسَبُ لِلُّغَةِ العَرَبِيَّةِ فقط؟',
    subparts: ['إجابة واحدة: الحرف المختص بالعربية.'],
    interaction: { kind: 'text_fields', fields: [{ id: 'letter', label: 'الحرف الذي يُنسب للعربية فقط', placeholder: 'اكتب الحرف' }] },
    availability: 'available', source: lesson3Src(25, 'textbook_exercise', 'أتأمل الصور', 4),
    teacher: {
      answerOrGuidance: 'حرف الضاد؛ ولذلك تُلقّب العربية بلغة الضاد.',
      explanation: 'الضاد الحرف الذي اختصت به العربية دون سائر اللغات، ومنه تسمية «لغة الضاد» في العبارة التمهيدية.',
    },
  },
  {
    id: 'l3-a-05', sourceActivityId: 'L3-25-05', teacherSolutionId: 'l3-teacher-L3-25-05',
    stepId: 'l3-s1', page: 25, section: 'أستمع إلى النص', printedNumber: '١',
    instruction: 'أُخبِرُ زَميلاتي بِالحَرفِ الأَخِيرِ لِكُلِّ بَيتٍ من أَبياتِ النَّصِّ.',
    subparts: ['ستة أبيات.', 'المدخل المعتمد: القصيدة المطبوعة ص٢٦ (التسجيل الصوتي غير متوفر).'],
    interaction: {
      kind: 'speak',
      preparationLabel: 'أكتب الحرف الأخير لكل بيت من أبيات القصيدة الستة:',
      criteria: ['بيت ١', 'بيت ٢', 'بيت ٣', 'بيت ٤', 'بيت ٥', 'بيت ٦'],
    },
    availability: 'available', source: lesson3Src(25, 'textbook_reading', 'أستمع إلى النص', 1, LISTENING_AUDIO_GAP),
    teacher: {
      answerOrGuidance: 'حروف القوافي في القصيدة المطبوعة: ي، د، د، د، د، ي (مدادي، الأكباد، بالضاد، الأجساد، وهاد، بلادي).',
      explanation: `${LISTENING_AUDIO_GAP} كلمة «أبيات» تربط المهمة بقصيدة «لغتي» ص٢٦، لذا تعتمد الحروف الأخيرة لأبياتها المطبوعة.`,
      commonMistakes: ['عدم الانتباه إلى أن الحرف الأخير هو حرف الروي في صدر/عجز البيت.'],
    },
  },
  {
    id: 'l3-a-06', sourceActivityId: 'L3-25-06', teacherSolutionId: 'l3-teacher-L3-25-06',
    stepId: 'l3-s1', page: 25, section: 'أستمع إلى النص', printedNumber: '٢',
    instruction: 'أَذكُرُ صفتَينِ لِلُّغَةِ العربيةِ وردَتَا في النَّصِّ.',
    subparts: ['صفتان من نص القصيدة المطبوع ص٢٦.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'trait1', label: 'الصفة الأولى' },
        { id: 'trait2', label: 'الصفة الثانية' },
      ],
    },
    availability: 'available', source: lesson3Src(25, 'textbook_reading', 'أستمع إلى النص', 2, LISTENING_AUDIO_GAP),
    teacher: {
      answerOrGuidance: 'يقبل أي صفتين من القصيدة: أمُّ اللغات، بردٌ على الأكباد، رابطةٌ تؤلف بيننا، الرجاء لناطق بالضاد.',
      explanation: 'الصفات مستمدة من أبيات القصيدة المطبوعة؛ يتحقق المعلم من ورود الصفة في النص.',
    },
  },

  /* ========================== ص٢٦ ========================== */
  {
    id: 'l3-a-07', sourceActivityId: 'L3-26-01', teacherSolutionId: 'l3-teacher-L3-26-01',
    stepId: 'l3-s2', page: 26, section: 'أقرأ', printedNumber: '١',
    instruction: 'أَقرَأُ المقطَعَ الأَوَّلَ مُراعِياً استخدامَ الإشاراتِ والإيماءاتِ المُناسِبَةَ لِمَشاعِرِ الاعتزازِ.',
    subparts: ['المقطع الأول: الأبيات ١–٣.', 'إيماءات مشاعر الاعتزاز.'],
    interaction: { kind: 'speak', preparationLabel: 'أتدرب على قراءة المقطع الأول بأداء الاعتزاز:', criteria: ['إشارات وإيماءات مناسبة', 'مشاعر اعتزاز ظاهرة'] },
    availability: 'available', source: lesson3Src(26, 'textbook_poetry', 'أقرأ', 1),
    teacher: {
      answerOrGuidance: 'أداء قراءة للمقطع الأول (الأبيات ١–٣) مع إيماءات اعتزاز؛ يقوّم الأداء لا الحفظ.',
      explanation: 'المقطع الأول يعبر عن اعتزاز الشاعر بلغته؛ المناسب نبرة فخر وإيماءات اعتزاز.',
    },
  },
  {
    id: 'l3-a-08', sourceActivityId: 'L3-26-02', teacherSolutionId: 'l3-teacher-L3-26-02',
    stepId: 'l3-s2', page: 26, section: 'أقرأ', printedNumber: '٢',
    instruction: 'أَقرَأُ المقطَعَ الثَّانيَ مُراعِياً التَّلوينَ الصَّوتِيَّ المُناسِبَ.',
    subparts: ['المقطع الثاني: الأبيات ٤–٦.', 'تلوين صوتي مناسب.'],
    interaction: { kind: 'speak', preparationLabel: 'أحدد مواضع التلوين الصوتي في المقطع الثاني:', criteria: ['تلوين صوتي مناسب'] },
    availability: 'available', source: lesson3Src(26, 'textbook_poetry', 'أقرأ', 2),
    teacher: {
      answerOrGuidance: 'أداء قراءة للمقطع الثاني (الأبيات ٤–٦) مع تلوين صوتي؛ مثال: ارتفاع النبرة عند «أفما رأيت الشمس».',
      explanation: 'المقطع الثاني يقرّب المعنى بصورة الشمس؛ يناسبه تلوين صوتي يبرز الاستفهام والصورة.',
    },
  },
  {
    id: 'l3-a-09', sourceActivityId: 'L3-26-03', teacherSolutionId: 'l3-teacher-L3-26-03',
    stepId: 'l3-s2', page: 26, section: 'أقرأ', printedNumber: '٣',
    instruction: 'أَقرَأُ النَّصَّ قِراءةً جَهريَّةً سليمةً مُراعِياً الإيماءاتِ والتَّلوينَ الصَّوتِيَّ المُناسبَ لِلمَعنى.',
    subparts: ['قراءة جهرية سليمة للنص كاملاً.', 'إيماءات وتلوين صوتي مناسبان للمعنى.'],
    interaction: { kind: 'speak', preparationLabel: 'أتدرب على القراءة الجهرية للنص كاملاً:', criteria: ['سلامة القراءة', 'إيماءات وتلوين مناسبان'] },
    availability: 'available', source: lesson3Src(26, 'textbook_poetry', 'أقرأ', 3),
    teacher: {
      answerOrGuidance: 'قراءة جهرية سليمة للقصيدة كاملة مع أداء مناسب للمعنى.',
      explanation: 'يقيّم المعلم سلامة الضبط ووضوح الأداء وملاءمة الإيماءات والتلوين.',
    },
  },

  /* ========================== ص٢٧ ========================== */
  {
    id: 'l3-a-10', sourceActivityId: 'L3-27-01', teacherSolutionId: 'l3-teacher-L3-27-01',
    stepId: 'l3-s3', page: 27, section: 'الفهم القرائي', printedNumber: '١',
    instruction: 'أَكتُبُ مِنَ النَّصِّ ثلاثَ كَلِماتٍ تَدُلُّ على المكانِ.',
    subparts: ['ثلاث كلمات مكان من القصيدة.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'place1', label: 'كلمة المكان الأولى' },
        { id: 'place2', label: 'كلمة المكان الثانية' },
        { id: 'place3', label: 'كلمة المكان الثالثة' },
      ],
    },
    availability: 'available', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 1),
    teacher: {
      answerOrGuidance: 'من كلمات المكان في القصيدة: الديار، أنجد، وهاد (ويقبل: البلاد).',
      explanation: '«بين الديار تباعد الأجساد» و«تهدي الشعاع لأنجد وهاد»؛ الديار والأنجد والوهاد ألفاظ دالة على المكان.',
    },
  },
  {
    id: 'l3-a-11', sourceActivityId: 'L3-27-02', teacherSolutionId: 'l3-teacher-L3-27-02',
    stepId: 'l3-s3', page: 27, section: 'الفهم القرائي', printedNumber: '٢',
    instruction: 'أَحفَظُ عَلى الأَقَلِّ مَقطَعاً أَعجَبَني مِنَ النَّصِّ، ثُمَّ أُلقيهِ أَمامَ زَملائي.',
    subparts: ['حفظ مقطع واحد على الأقل.', 'إلقاء أمام الزملاء.'],
    interaction: { kind: 'speak', preparationLabel: 'أكتب المقطع الذي اخترت حفظه:', criteria: ['حفظ مقطع على الأقل', 'إلقاء أمام الزملاء'] },
    availability: 'available', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 2),
    teacher: {
      answerOrGuidance: 'إلقاء مقطع من ثلاثة أبيات على الأقل من القصيدة؛ يقوّم الحفظ ووضوح الإلقاء.',
      explanation: 'المقطع في القصيدة ثلاثة أبيات؛ يختار المتعلم ما أعجبه ويلقيه.',
    },
  },
  {
    id: 'l3-a-12', sourceActivityId: 'L3-27-03', teacherSolutionId: 'l3-teacher-L3-27-03',
    stepId: 'l3-s3', page: 27, section: 'الفهم القرائي', printedNumber: '٣',
    instruction: 'أُكْمِلُ الفَراغاتِ الآتِيَةَ: مَعنى كُلٍّ مِن: عَفَتُّ، ناطِقٍ بِالضَّادِ. مُفْرَدُ كُلٍّ مِن: أَسْماعِ، أَجسادِ.',
    subparts: ['معنى عفتُّ.', 'معنى ناطق بالضاد.', 'مفرد أسماع.', 'مفرد أجساد.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'afattu', label: 'معنى «عَفَتُّ»' },
        { id: 'natiq', label: 'معنى «ناطقٍ بالضاد»' },
        { id: 'asmaa', label: 'مفرد «أسماع»' },
        { id: 'ajsad', label: 'مفرد «أجساد»' },
      ],
    },
    availability: 'available', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 3),
    teacher: {
      answerOrGuidance: 'عفتُّ: تركتُ وأعرضتُ. ناطق بالضاد: متحدث باللغة العربية. مفرد أسماع: سَمْع. مفرد أجساد: جَسَد.',
      explanation: '«عفت مدادي» أي تركته وأعرضت عنه؛ والناطق بالضاد هو المتحدث بالعربية؛ وأسماع جمع سمع وأجساد جمع جسد.',
      commonMistakes: ['اعتبار «سميع» مفرد أسماع والصواب «سَمْع».'],
    },
  },
  {
    id: 'l3-a-13', sourceActivityId: 'L3-27-04', teacherSolutionId: 'l3-teacher-L3-27-04',
    stepId: 'l3-s3', page: 27, section: 'الفهم القرائي', printedNumber: '٤',
    instruction: 'أُبَيِّنُ أَثَرَ اللُّغَةِ في أَبنائِها، مِمَّا وَرَدَ في البَيْتِ الثَّاني.',
    subparts: ['أثر اللغة في أبنائها من البيت الثاني.'],
    interaction: { kind: 'write', label: 'أبين أثر اللغة في أبنائها من البيت الثاني:', rows: 3 },
    availability: 'available', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 4),
    teacher: {
      answerOrGuidance: 'أثر اللغة في أبنائها أنها «كانت لنا برداً على الأكباد»، أي سكينة وراحة وسروراً يطمئن له السامعون.',
      explanation: 'البيت الثاني يشبه أثر اللغة بالبرد على الأكباد؛ المطلوب بيان هذا الأثر بمعنى الراحة والطمأنينة.',
    },
  },
  {
    id: 'l3-a-14', sourceActivityId: 'L3-27-05', teacherSolutionId: 'l3-teacher-L3-27-05',
    stepId: 'l3-s3', page: 27, section: 'الفهم القرائي', printedNumber: '٥',
    instruction: 'أَسْتَخْرِجُ مِنَ البَيْتَيْنِ الرَّابِعِ والخامِسِ كَلِماتٍ مُتَضادَّةً في المَعنى، وأُعْطي كَلِماتٍ أُخرى مُتَضادَّةً مِن عِندي.',
    subparts: ['أضداد من البيتين الرابع والخامس.', 'أضداد من عند المتعلم.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'pair1', label: 'ضدان من البيتين (٤–٥)' },
        { id: 'pair2', label: 'ضدان آخران من البيتين (٤–٥)' },
        { id: 'own', label: 'ضدان من عندي' },
      ],
    },
    availability: 'available', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 5),
    teacher: {
      answerOrGuidance: 'من البيتين: تقارب × تباعد، أنجد × وهاد، بعيدة × قريبة (ضمن صورة البيت). ومن عندي يقبل أي ضدّين سليمين مثل: الليل × النهار.',
      explanation: '«تقارب الأرواح» و«تباعد الأجساد» ضدان في البيت الرابع، و«أنجد» المرتفع و«وهاد» المنخفض ضدان في البيت الخامس.',
    },
  },
  {
    id: 'l3-a-15', sourceActivityId: 'L3-27-06', teacherSolutionId: 'l3-teacher-L3-27-06',
    stepId: 'l3-s3', page: 27, section: 'الفهم القرائي', printedNumber: '٦',
    instruction: 'أُكْمِلُ المُخَطَّطَ الآتي: الفكرة العامة، فكرة رئيسة (٢)، فكرة البيت الثالث، فكرة البيت الرابع.',
    subparts: [
      'معطى: فكرة رئيسة (١) مكانة اللغة ودورها في توحيد الأمة.',
      'معطى: فكرة البيت الأول أهمية اللغة بالنسبة إلى الشاعر.',
      'معطى: فكرة البيت السادس اجتماع أبناء اللغة العربية على محبتها.',
      'مطلوب: الفكرة العامة، فكرة رئيسة (٢)، فكرة البيت الثالث، فكرة البيت الرابع.',
    ],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'general', label: 'الفكرة العامة', multiline: true },
        { id: 'main2', label: 'فكرة رئيسة (٢)', multiline: true },
        { id: 'bayt3', label: 'فكرة البيت الثالث', multiline: true },
        { id: 'bayt4', label: 'فكرة البيت الرابع', multiline: true },
      ],
    },
    availability: 'available', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 6),
    teacher: {
      answerOrGuidance: 'الفكرة العامة: الاعتزاز باللغة العربية ودورها في وحدة أبنائها. فكرة رئيسة (٢): قرب أبناء اللغة بقلوبهم رغم تباعد الأماكن. فكرة البيت الثالث: اللغة رابطة تؤلف بين أبنائها وهي رجاء الناطق بالضاد. فكرة البيت الرابع: تقارب الأرواح لا يضر به تباعد الأجساد.',
      explanation: 'يكمل المتعلم الخانات الأربع بما ينسجم مع المعطيات الثلاثة المطبوعة في المخطط.',
    },
  },
  {
    id: 'l3-a-16', sourceActivityId: 'L3-27-07', teacherSolutionId: 'l3-teacher-L3-27-07',
    stepId: 'l3-s3', page: 27, section: 'الفهم القرائي', printedNumber: '٧',
    instruction: 'أُصَنِّفُ العِبارَةَ بِما يُناسِبُها: «كانَتْ لَنا بَرْداً عَلى الأَكْبادِ» / «رَأَيْتُ الشَّمْسَ وهي بَعيدَةٌ».',
    subparts: ['تصنيف عبارتين: حقيقة أو خيال.'],
    interaction: {
      kind: 'classification',
      categories: [{ id: 'real', label: 'حقيقة' }, { id: 'imag', label: 'خيال' }],
      items: [
        { id: 'bard', text: 'كانت لنا برداً على الأكباد' },
        { id: 'shams', text: 'رأيت الشمس وهي بعيدة' },
      ],
    },
    availability: 'available', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 7),
    teacher: {
      answerOrGuidance: '«كانت لنا برداً على الأكباد» خيال (صورة جميلة تصور أثر اللغة)، و«رأيت الشمس وهي بعيدة» حقيقة.',
      explanation: 'اللغة ليست برداً حسياً بل شبه الشاعر أثرها بالبرد؛ أما رؤية الشمس البعيدة فأمر حسي واقعي.',
    },
  },
  {
    id: 'l3-a-17', sourceActivityId: 'L3-27-08', teacherSolutionId: 'l3-teacher-L3-27-08',
    stepId: 'l3-s3', page: 27, section: 'الفهم القرائي', printedNumber: '٨',
    instruction: 'شَبَّهَ الشَّاعِرُ اللُّغَةَ بِالرَّابِطَةِ، أُشَبِّهُها أَنا بِـ ….',
    subparts: ['تشبيه شخصي مفتوح.'],
    interaction: { kind: 'write', label: 'أشبّه اللغة أنا بـ:', rows: 2 },
    availability: 'available', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 8),
    teacher: {
      answerOrGuidance: 'تشبيه شخصي مفتوح؛ يقبل كل تشبيه مبرر مثل: الأم، الجسر، البيت الذي يجمعنا.',
      explanation: 'المطلوب قدرة المتعلم على بناء تشبيه خاص مع تعليل بسيط يربطه بوظيفة اللغة.',
    },
  },
  {
    id: 'l3-a-18', sourceActivityId: 'L3-27-09', teacherSolutionId: 'l3-teacher-L3-27-09',
    stepId: 'l3-s3', page: 27, section: 'الفهم القرائي', printedNumber: '٩',
    instruction: 'أُعيدُ صياغةَ البيتِ الخامسِ بأسلوبي الخاصِّ.',
    subparts: ['صياغة مفتوحة لمعنى البيت الخامس.', 'نص البيت: أفما رأيت الشمس وهي بعيدة / تهدي الشعاع لأنجد وهاد.'],
    interaction: { kind: 'write', label: 'أعبر عن معنى البيت الخامس بأسلوبي:', rows: 3 },
    availability: 'available', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 9, LOCKED_SOURCE_NOTES.comprehensionVerb9),
    teacher: {
      answerOrGuidance: 'يقبل كل تعبير يؤدي المعنى: كما ترسل الشمس البعيدة ضوءها إلى المرتفعات والمنخفضات، تصل اللغة أبناءها رغم البعد.',
      explanation: 'البيت يشبه عطاء اللغة بعطاء الشمس الذي يبلغ كل مكان؛ الفعل المطبوع في الكتاب غير محسوم بصرياً فلذلك تُقيَّم الصياغة المفتوحة.',
    },
  },

  /* ========================== ص٢٨ ========================== */
  {
    id: 'l3-a-19', sourceActivityId: 'L3-28-01', teacherSolutionId: 'l3-teacher-L3-28-01',
    stepId: 'l3-s4', page: 28, section: 'أتواصل شفهياً', printedNumber: '١',
    instruction: 'أُحاوِرُ زُملائي في المجموعَةِ عَنْ أَهَمِّيَّةِ تَرْجَمَةِ اللُّغَةِ العَرَبِيَّةِ إِلى لغاتٍ أُخرى في نَقْلِ ثقافَتِنا وتُراثِنا إِلى الشُّعوبِ الأُخرى.',
    subparts: ['حوار جماعي عن أهمية الترجمة.', 'المثير: صورتا كتاب «الحاوي في الطب» وترجمته.'],
    interaction: {
      kind: 'speak',
      preparationLabel: 'أجهز أفكار الحوار عن أهمية الترجمة:',
      criteria: ['الربط بنقل الثقافة والتراث', 'الاستئناس بمثال كتابي الرازي'],
    },
    availability: 'available', source: lesson3Src(28, 'textbook_expression', 'أتواصل شفهياً: إجراء حوار', 1),
    teacher: {
      answerOrGuidance: 'حوار مفتوح؛ يقبل الذي يربط الترجمة بنقل علوم العرب وتراثهم كما يمثله كتاب «الحاوي في الطب» المترجم.',
      explanation: 'الصورتان تريان كتاب الرازي بالعربية وترجمته؛ منهما يستنتج المتعلم دور الترجمة في نقل العلم والحضارة.',
    },
  },
  {
    id: 'l3-a-20', sourceActivityId: 'L3-28-02', teacherSolutionId: 'l3-teacher-L3-28-02',
    stepId: 'l3-s4', page: 28, section: 'أتواصل شفهياً', printedNumber: '٢',
    instruction: 'أُسَجِّلُ أَهَمَّ ما خَلَصْتُ إِلَيْهِ مِنَ الحِوارِ السَّابِقِ، وأُضيفُ رَأيي في مَهَمَّةِ التَّرجَمَةِ، ودورِها في الحَياةِ والعَلْمِ.',
    subparts: ['تسجيل خلاصة الحوار.', 'رأي شخصي في مهمة الترجمة ودورها.'],
    interaction: { kind: 'write', label: 'أسجل خلاصة الحوار ورأيي في الترجمة:', rows: 4 },
    availability: 'available', source: lesson3Src(28, 'textbook_expression', 'أتواصل شفهياً: إجراء حوار', 2),
    teacher: {
      answerOrGuidance: 'تسجيل مفتوح؛ يتحقق المعلم من وجود خلاصة الحوار ورأي شخصي في دور الترجمة في الحياة والعلم.',
      explanation: 'المهمة مركبة من جزأين: الخلاصة ثم الرأي الشخصي؛ يقيّم المعلم وضوح الجزأين معاً.',
    },
  },
  {
    id: 'l3-a-21', sourceActivityId: 'L3-28-03', teacherSolutionId: 'l3-teacher-L3-28-03',
    stepId: 'l3-s5', page: 28, section: 'قواعد اللغة', printedNumber: '١',
    instruction: 'أُبَيِّنُ نَوْعَ الجُملَتَيْنِ السَّابِقَتَيْنِ وَفْقَ الفِعْلِيَّةِ والاسمِيَّةِ. («تحدَّثَ سميرٌ.» / «تحفظُ اللغةُ التراثَ.»)',
    subparts: ['تصنيف الجملتين: فعلية أم اسمية.'],
    interaction: {
      kind: 'classification',
      categories: [{ id: 'verbal', label: 'جملة فعلية' }, { id: 'nominal', label: 'جملة اسمية' }],
      items: [
        { id: 's1', text: 'تحدَّثَ سميرٌ.' },
        { id: 's2', text: 'تحفظُ اللغةُ التراثَ.' },
      ],
    },
    availability: 'available', source: lesson3Src(28, 'textbook_grammar', 'قواعد اللغة: أركان الجملة الفعلية', 1),
    teacher: {
      answerOrGuidance: 'كلتا الجملتين فعلية لأن كل واحدة بدأت بفعل: تحدثَ، تحفظُ.',
      explanation: 'معيار التمييز هو البداية: ما بدأ بفعل فعلية وما بدأ باسم اسمية.',
    },
  },
  {
    id: 'l3-a-22', sourceActivityId: 'L3-28-04', teacherSolutionId: 'l3-teacher-L3-28-04',
    stepId: 'l3-s5', page: 28, section: 'قواعد اللغة', printedNumber: '٢',
    instruction: 'أَذكُرُ الفِعْلَ الذي بَدَأَتْ بِهِ كُلٌّ مِنَ الجُملَتَيْنِ السَّابِقَتَيْنِ.',
    subparts: ['فعل الجملة الأولى.', 'فعل الجملة الثانية.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'v1', label: 'فعل الجملة الأولى' },
        { id: 'v2', label: 'فعل الجملة الثانية' },
      ],
    },
    availability: 'available', source: lesson3Src(28, 'textbook_grammar', 'قواعد اللغة: أركان الجملة الفعلية', 2),
    teacher: {
      answerOrGuidance: 'الجملة الأولى بدأت بالفعل «تحدَّثَ» والثانية بالفعل «تحفظُ».',
      explanation: 'خطوة تمهيدية لتحديد أركان الجملة الفعلية.',
    },
  },
  {
    id: 'l3-a-23', sourceActivityId: 'L3-28-05', teacherSolutionId: 'l3-teacher-L3-28-05',
    stepId: 'l3-s5', page: 28, section: 'قواعد اللغة', printedNumber: '٣',
    instruction: 'أُلاحِظُ أَنَّ (سمير) في الجُملَةِ الأولى هو مَنْ قامَ بِالفِعْلِ، لِماذا نُسَمِّي مَنْ يَقومُ بِالفِعْلِ؟',
    subparts: ['تعليل تسمية من يقوم بالفعل.'],
    interaction: { kind: 'text_fields', fields: [{ id: 'doer', label: 'نسمي من يقوم بالفعل…', placeholder: 'اكتب المصطلح' }] },
    availability: 'available', source: lesson3Src(28, 'textbook_grammar', 'قواعد اللغة: أركان الجملة الفعلية', 3),
    teacher: {
      answerOrGuidance: 'نسميه فاعلاً؛ لأنه الذي قام بالفعل وأحدثه.',
      explanation: 'سمير هو الذي تحدث، فمن قام بالفعل يسمى فاعلاً ويكون مرفوعاً.',
    },
  },
  {
    id: 'l3-a-24', sourceActivityId: 'L3-28-06', teacherSolutionId: 'l3-teacher-L3-28-06',
    stepId: 'l3-s5', page: 28, section: 'قواعد اللغة', printedNumber: '٤',
    instruction: 'أُلاحِظُ أَنَّ (التُّراث) في الجُملَةِ الثانيَةِ هو ما وَقَعَ عَلَيْهِ الفِعْلُ، فَماذا نُسَمِّي ما يَقَعُ عَلَيْهِ الفِعْلُ؟',
    subparts: ['استنتاج مصطلح المفعول به.'],
    interaction: { kind: 'text_fields', fields: [{ id: 'object', label: 'نسمي ما يقع عليه الفعل…', placeholder: 'اكتب المصطلح' }] },
    availability: 'available', source: lesson3Src(28, 'textbook_grammar', 'قواعد اللغة: أركان الجملة الفعلية', 4),
    teacher: {
      answerOrGuidance: 'نسميه المفعول به؛ لأنه الذي وقع عليه فعل الفاعل، ويكون منصوباً.',
      explanation: 'التراث هو الذي حُفظ، فما وقع عليه الفعل يسمى مفعولاً به.',
    },
  },

  /* ========================== ص٢٩ ========================== */
  {
    id: 'l3-a-25', sourceActivityId: 'L3-29-01', teacherSolutionId: 'l3-teacher-L3-29-01',
    stepId: 'l3-s5', page: 29, section: 'أطبق', printedNumber: '—',
    instruction: 'أَدُلُّ على الفِعْلِ والفاعِلِ والمَفْعولِ بِهِ في الجُملَتَيْنِ الآتِيَتَيْنِ: «تَنقُلُ اللُّغَةُ آثارَ الشُّعوبِ.» / «أَحَبَّ التَّلاميذُ اللُّغَةَ العَربيَّةَ.»',
    subparts: ['جملة ١: فعل/فاعل/مفعول به.', 'جملة ٢: فعل/فاعل/مفعول به.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 's1v', label: 'جملة ١: الفعل' },
        { id: 's1f', label: 'جملة ١: الفاعل' },
        { id: 's1m', label: 'جملة ١: المفعول به' },
        { id: 's2v', label: 'جملة ٢: الفعل' },
        { id: 's2f', label: 'جملة ٢: الفاعل' },
        { id: 's2m', label: 'جملة ٢: المفعول به' },
      ],
    },
    availability: 'available', source: lesson3Src(29, 'textbook_grammar', 'أطبق'),
    teacher: {
      answerOrGuidance: 'جملة ١: تنقلُ (فعل) اللغةُ (فاعل) آثارَ (مفعول به). جملة ٢: أحبَّ (فعل) التلاميذُ (فاعل) اللغةَ (مفعول به).',
      explanation: 'تطبيق مباشر للقاعدة: فعل + فاعل مرفوع + مفعول به منصوب.',
      commonMistakes: ['نسيان علامة النصب في المفعول به عند الكتابة.'],
    },
  },
  {
    id: 'l3-a-26', sourceActivityId: 'L3-29-02', teacherSolutionId: 'l3-teacher-L3-29-02',
    stepId: 'l3-s5', page: 29, section: 'التقويم النهائي', printedNumber: '١',
    instruction: 'أَقرَأُ الفِقرَةَ الآتِيَةَ، ثُمَّ أَسْتَخْرِجُ الجُمَلَ الفِعلِيَّةَ الوارِدَةَ فيها، وأَملَأُ الجَدولَ بِالمَطلوبِ (الجملة/الفعل/الفاعل/المفعول به).',
    subparts: ['الفقرة: تجمعُ اللغةُ العربيةُ أبناءَها، وتفتحُ لهم أبوابَ الجمالِ بعذوبة ألفاظِها، وقد عرف العالمُ دقةَ اللغةِ العربيةِ في الدلالةِ على المعاني، وازدهرتِ اللغةُ العربيةُ فأخذت مكانةً متميزةً بين لغاتِ العالمِ جميعِها.'],
    interaction: { kind: 'write', label: 'أستخرج الجمل الفعلية وأحللها في الجدول:', rows: 6 },
    availability: 'available', source: lesson3Src(29, 'textbook_grammar', 'التقويم النهائي', 1),
    teacher: {
      answerOrGuidance: 'الجمل الفعلية: تجمعُ اللغةُ أبناءَها (تجمع/اللغة/أبناءها)، تفتحُ لهم أبواب الجمال (تفتح/اللغة مقدرة/أبواب)، عرف العالمُ دقةَ اللغة (عرف/العالم/دقة)، ازدهرت اللغة (فعل وفاعل فقط)، أخذت مكانةً (فعل وفاعل مقدرواللغة/مكانة مفعول به).',
      explanation: 'يقبل المعلم أي تحليل سليم؛ يلاحظ أن «لهم» جار ومجرور لا مفعول به، وأن بعض الجمل بلا مفعول.',
      commonMistakes: ['عدّ الجار والمجرور «لهم» مفعولاً به.'],
    },
  },
  {
    id: 'l3-a-27', sourceActivityId: 'L3-29-03', teacherSolutionId: 'l3-teacher-L3-29-03',
    stepId: 'l3-s5', page: 29, section: 'التقويم النهائي', printedNumber: '٢',
    instruction: 'أَسْتَبْدِلُ بِالأَفعالِ الوارِدَةِ في الفِقرَةِ السَّابِقَةِ أَفعالاً بِمَعْناها.',
    subparts: ['تجمع.', 'تفتح.', 'عرف.', 'ازدهرت.', 'أخذت.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'r1', label: 'بمعنى «تجمع»' },
        { id: 'r2', label: 'بمعنى «تفتح»' },
        { id: 'r3', label: 'بمعنى «عرف»' },
        { id: 'r4', label: 'بمعنى «ازدهرت»' },
        { id: 'r5', label: 'بمعنى «أخذت»' },
      ],
    },
    availability: 'available', source: lesson3Src(29, 'textbook_grammar', 'التقويم النهائي', 2),
    teacher: {
      answerOrGuidance: 'أمثلة مقبولة: تجمع ← تلمّ/تضم، تفتح ← تتيح/تبيح، عرف ← عَلِمَ، ازدهرت ← تقدّمت/نمت، أخذت ← نالت.',
      explanation: 'المطلوب مرادفات فعلية تحافظ على معنى الجملة وبنيتها الفعلية.',
    },
  },
  {
    id: 'l3-a-28', sourceActivityId: 'L3-29-04', teacherSolutionId: 'l3-teacher-L3-29-04',
    stepId: 'l3-s5', page: 29, section: 'التقويم النهائي', printedNumber: '٣',
    instruction: 'أُكْمِلُ الجُمَلَ الفِعْلِيَّةَ الآتِيَةَ بِما يُناسِبُها: تُزَيِّنُ … الإِنْسانَ. / يَقْدِرُ التِّلميذُ … العَربيَّةَ لِجَمالِها. / … التَّلميذُ يَخُطُّ الرُّقعَةَ.',
    subparts: ['ثلاثة إكمالات.', 'الإكمال الثالث بصيغة مطبوعة غير محسومة؛ يقبل أي صياغة فعلية سليمة.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'c1', label: 'تزيِّنُ … الإنسانَ' },
        { id: 'c2', label: 'يقدِّرُ التلميذُ … العربيةَ لجمالها' },
        { id: 'c3', label: '… التلميذُ يخطُّ الرقعةَ' },
      ],
    },
    availability: 'available', source: lesson3Src(29, 'textbook_grammar', 'التقويم النهائي', 3, LOCKED_SOURCE_NOTES.grammarCompletion3),
    teacher: {
      answerOrGuidance: 'أمثلة: تزيِّنُ الأخلاقُ الإنسانَ. يقدِّرُ التلميذُ اللغةَ العربيةَ لجمالها. الإكمال الثالث يقبل أي صياغة تنتج جملة فعلية سليمة مثل: يشاهدُ المعلمُ التلميذَ يخطُّ الرقعةَ.',
      explanation: LOCKED_SOURCE_NOTES.grammarCompletion3,
    },
  },
  {
    id: 'l3-a-29', sourceActivityId: 'L3-29-05', teacherSolutionId: 'l3-teacher-L3-29-05',
    stepId: 'l3-s5', page: 29, section: 'التقويم النهائي', printedNumber: '٤',
    instruction: 'أُحادِثُ زَميلي لِمُدَّةِ دَقيقَةٍ عَنْ طَريقَةِ دِراسَتي لِلُغَةِ العربِيَّةِ مُستَعمِلاً الجُملَةَ الفِعْلِيَّةَ.',
    subparts: ['حديث لمدة دقيقة.', 'استعمال الجمل الفعلية.'],
    interaction: { kind: 'speak', preparationLabel: 'أجهز حديثي عن طريقة دراستي بجمل فعلية:', criteria: ['مدة دقيقة', 'جمل فعلية'] },
    availability: 'available', source: lesson3Src(29, 'textbook_grammar', 'التقويم النهائي', 4),
    teacher: {
      answerOrGuidance: 'أداء شفهي؛ يتحقق المعلم من توظيف جمل فعلية مثل: أقرأُ النصَّ، أحفظُ القاعدةَ، أكتبُ الفقرةَ.',
      explanation: 'الهدف توظيف الجملة الفعلية في كلام طبيعي لا في جمل معزولة.',
    },
  },
  {
    id: 'l3-a-30', sourceActivityId: 'L3-29-06', teacherSolutionId: 'l3-teacher-L3-29-06',
    stepId: 'l3-s5', page: 29, section: 'التقويم النهائي', printedNumber: '٥',
    instruction: 'أَكتُبُ فِقرَةً مِنْ خَمسَ عَشرَةَ كَلِمَةً أُبَيِّنُ فيها فَوائِدَ اللُّغَةِ العربيَّةِ لي مُستَعمِلاً الجُملَةَ الفِعْلِيَّةَ.',
    subparts: ['فقرة من ١٥ كلمة.', 'تبيين فوائد اللغة.', 'استعمال الجمل الفعلية.'],
    interaction: { kind: 'write', label: 'أكتب فقرتي (١٥ كلمة تقريباً):', rows: 4 },
    availability: 'available', source: lesson3Src(29, 'textbook_grammar', 'التقويم النهائي', 5),
    teacher: {
      answerOrGuidance: 'فقرة مفتوحة من نحو خمس عشرة كلمة؛ يتحقق المعلم من ذكر فوائد اللغة وتوظيف جمل فعلية.',
      explanation: 'يقاس الالتزام بعدد الكلمات تقريباً وبوجود جمل فعلية سليمة.',
    },
  },

  /* ========================== ص٣٠ ========================== */
  {
    id: 'l3-a-31', sourceActivityId: 'L3-30-01', teacherSolutionId: 'l3-teacher-L3-30-01',
    stepId: 'l3-s6', page: 30, section: 'إملاء: همزة الوصل', printedNumber: '١',
    instruction: 'أُلاحِظُ أَنَّ فِعلَ الأَمرِ (اعلم) بَدَأَ بِهَمزَةِ وَصْلٍ، فَما الماضي مِنْهُ؟ وما عَدَدُ حُروفِ الماضي؟',
    subparts: ['ماضي الفعل.', 'عدد حروف الماضي.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'past', label: 'ماضي «اعلم»' },
        { id: 'count', label: 'عدد حروف الماضي' },
      ],
    },
    availability: 'available', source: lesson3Src(30, 'textbook_spelling', 'إملاء: همزة الوصل', 1),
    teacher: {
      answerOrGuidance: 'الماضي «عَلِمَ» وعدد حروفه ثلاثة؛ فهمزة الأمر فيه همزة وصل.',
      explanation: 'أمر الثلاثي يبدأ بهمزة وصل تسقط في درج الكلام، وماضيه ثلاثي مجرد.',
    },
  },
  {
    id: 'l3-a-32', sourceActivityId: 'L3-30-02', teacherSolutionId: 'l3-teacher-L3-30-02',
    stepId: 'l3-s6', page: 30, section: 'إملاء: همزة الوصل', printedNumber: '٢',
    instruction: 'أُلاحِظُ أَنَّ الفِعْلَ الماضي (ارتفع) بَدَأَ بِهَمزَةِ وَصْلٍ، ما عَدَدُ أَحْرُفِهِ؟',
    subparts: ['عدد أحرف «ارتفع».'],
    interaction: { kind: 'text_fields', fields: [{ id: 'count', label: 'عدد أحرف «ارتفع»' }] },
    availability: 'available', source: lesson3Src(30, 'textbook_spelling', 'إملاء: همزة الوصل', 2),
    teacher: {
      answerOrGuidance: 'خمسة أحرف: ا، ر، ت، ف، ع؛ وهو فعل ماضٍ خماسي يبدأ بهمزة وصل.',
      explanation: 'الماضي الخماسي يبدأ بهمزة وصل وفق القاعدة.',
    },
  },
  {
    id: 'l3-a-33', sourceActivityId: 'L3-30-03', teacherSolutionId: 'l3-teacher-L3-30-03',
    stepId: 'l3-s6', page: 30, section: 'إملاء: همزة الوصل', printedNumber: '٣',
    instruction: 'أُلاحِظُ أَنَّ الفِعْلَ (استعمل) فِعْلٌ ماضٍ، ما عَدَدُ أَحرفِهِ؟ وأُسَمِّي الأَمرَ مِنْهُ، ثُمَّ أُبَيِّنُ نَوعَ الهَمزَةِ الأَولِيَّةِ في الماضي والأَمرِ.',
    subparts: ['عدد أحرف استعمل.', 'الأمر منه.', 'نوع الهمزة الأولية في الماضي والأمر.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'count', label: 'عدد أحرف «استعمل»' },
        { id: 'imperative', label: 'الأمر منه' },
        { id: 'hamza', label: 'نوع الهمزة الأولية في الماضي والأمر' },
      ],
    },
    availability: 'available', source: lesson3Src(30, 'textbook_spelling', 'إملاء: همزة الوصل', 3),
    teacher: {
      answerOrGuidance: 'عدد أحرفه ستة؛ الأمر منه «استعمِلْ»؛ والهمزة الأولية في الماضي والأمر معاً همزة وصل.',
      explanation: 'استعمل فعل سداسي؛ ماضي السداسي وأمره يبدأان بهمزة وصل.',
    },
  },
  {
    id: 'l3-a-34', sourceActivityId: 'L3-30-04', teacherSolutionId: 'l3-teacher-L3-30-04',
    stepId: 'l3-s6', page: 30, section: 'أطبق', printedNumber: '١',
    instruction: 'أَملَأُ الفَراغَ في كُلٍّ مِمَّا يَأتي مُنتَبِهاً إِلى كِتابَةِ الهَمزَةِ الأَولِيَّةِ: كتبَ (الأمر)، يستخرجُ (الماضي والأمر)، ينفعُ (الماضي والأمر).',
    subparts: ['٥ فراغات: أمر كتب، ماضي يستخرج وأمره، ماضي ينفع وأمره.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'kataba', label: 'كتبَ: الأمر منه' },
        { id: 'yastakhrij-past', label: 'يستخرجُ: الماضي منه' },
        { id: 'yastakhrij-imp', label: 'يستخرجُ: الأمر منه' },
        { id: 'yanfa-past', label: 'ينفعُ: الماضي منه' },
        { id: 'yanfa-imp', label: 'ينفعُ: الأمر منه' },
      ],
    },
    availability: 'available', source: lesson3Src(30, 'textbook_spelling', 'أطبق', 1),
    teacher: {
      answerOrGuidance: 'كتبَ ← اكتبْ (وصل). يستخرجُ ← استخرجَ (وصل) والأمر استخرجْ (وصل). ينفعُ ← نفعَ (بلا همزة) والأمر انفعْ (وصل).',
      explanation: 'أمر الثلاثي يبدأ بهمزة وصل؛ وماضي الخماسي والسداسي وأمرهما كذلك؛ أما ماضي الثلاثي فبلا همزة أولية.',
      commonMistakes: ['رسم همزة قطع في «اكتبْ» و«انفعْ».'],
    },
  },

  /* ========================== ص٣١ ========================== */
  {
    id: 'l3-a-35', sourceActivityId: 'L3-31-01', teacherSolutionId: 'l3-teacher-L3-31-01',
    stepId: 'l3-s6', page: 31, section: 'إملاء: همزة الوصل', printedNumber: '١',
    instruction: 'أُلاحِظُ أَنَّ الكَلِمَتَيْنِ (استعمال، اهتمام) مَصْدَرانِ: أَذْكُرُ الفِعْلَ الماضي لِكُلٍّ مِنْهُما، وعَدَدَ حُروفِهِ.',
    subparts: ['فعل «استعمال» وعدده.', 'فعل «اهتمام» وعدده.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'istimal', label: 'ماضي «استعمال»' },
        { id: 'istimal-n', label: 'عدد حروفه' },
        { id: 'ihtimam', label: 'ماضي «اهتمام»' },
        { id: 'ihtimam-n', label: 'عدد حروفه' },
      ],
    },
    availability: 'available', source: lesson3Src(31, 'textbook_spelling', 'إملاء: همزة الوصل', 1),
    teacher: {
      answerOrGuidance: 'استعمال ← استعملَ (ستة أحرف). اهتمام ← اهتمَّ (خمسة أحرف).',
      explanation: 'مصدر السداسي من استعمل والخماسي من اهتم؛ وكلا المصدرين يبدأ بهمزة وصل.',
    },
  },
  {
    id: 'l3-a-36', sourceActivityId: 'L3-31-02', teacherSolutionId: 'l3-teacher-L3-31-02',
    stepId: 'l3-s6', page: 31, section: 'إملاء: همزة الوصل', printedNumber: '٢',
    instruction: 'أُلاحِظُ أَنَّ الأَسماءَ (ابن، ابنة، اثنتان، اثنان، امرؤ، امرأة، اسم) بَدَأَتْ بِهَمزَةٍ. أَهَمزَةُ قَطعٍ هَمزتُها أَم هَمزَةُ وَصْلٍ؟',
    subparts: ['تصنيف سبعة أسماء حسب نوع الهمزة.'],
    interaction: {
      kind: 'classification',
      categories: [{ id: 'wasl', label: 'همزة وصل' }, { id: 'qat', label: 'همزة قطع' }],
      items: [
        { id: 'ibn', text: 'ابن' },
        { id: 'ibna', text: 'ابنة' },
        { id: 'ithnatan', text: 'اثنتان' },
        { id: 'ithnan', text: 'اثنان' },
        { id: 'imru', text: 'امرؤ' },
        { id: 'imraa', text: 'امرأة' },
        { id: 'ism', text: 'اسم' },
      ],
    },
    availability: 'available', source: lesson3Src(31, 'textbook_spelling', 'إملاء: همزة الوصل', 2),
    teacher: {
      answerOrGuidance: 'همزة الأسماء السبعة كلها همزة وصل؛ وهي الأسماء المنصوص عليها في القاعدة.',
      explanation: 'القاعدة تحصر هذه الأسماء في مواضع همزة الوصل؛ تُلفظ في أول الكلام وتسقط في درجه.',
    },
  },
  {
    id: 'l3-a-37', sourceActivityId: 'L3-31-03', teacherSolutionId: 'l3-teacher-L3-31-03',
    stepId: 'l3-s6', page: 31, section: 'أطبق', printedNumber: '—',
    instruction: 'أَملَأُ الفَراغَ بِأَسماءٍ مَبْدوءَةٍ بِهَمزَةِ وَصْلٍ: استقبلنا الفائزَ بجائزةِ الفصاحةِ … رائعاً. / صفّقَ الجمهورُ عندَ … المسرحيةِ. / رافقَ الأبُ … و … لحضورِ حفلةٍ موسيقيةٍ.',
    subparts: ['٤ فراغات بأسماء مبدوءة بهمزة وصل.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'f1', label: 'استقبلنا الفائزَ بجائزة الفصاحةِ … رائعاً' },
        { id: 'f2', label: 'صفّق الجمهورُ عندَ … المسرحيةِ' },
        { id: 'f3', label: 'رافق الأبُ …' },
        { id: 'f4', label: 'و …' },
      ],
    },
    availability: 'available', source: lesson3Src(31, 'textbook_spelling', 'أطبق'),
    teacher: {
      answerOrGuidance: 'أمثلة معتمدة: استقبالاً، انتهاءِ (أو اختتام)، ابنَهُ، ابنتَهُ.',
      explanation: 'الفراغات تتطلب مصدراً خماسياً أو اسماً من أسماء همزة الوصل ليستقيم المعنى.',
    },
  },
  {
    id: 'l3-a-38', sourceActivityId: 'L3-31-04', teacherSolutionId: 'l3-teacher-L3-31-04',
    stepId: 'l3-s6', page: 31, section: 'التقويم النهائي', printedNumber: '١',
    instruction: 'أَقرَأُ الفِقرَةَ الآتِيَةَ، ثُمَّ أَملَأُ الجَدولَ بِما يُناسِبُهُ (جدول «الكلمات التي بدأت بهمزة وصل» ص٣٢).',
    subparts: ['الفقرة: استمعْ إلى نصائحِ معلمِكَ استماعاً دقيقاً، وانتبِهْ إلى توجيهاتِه، فمن استمعَ إلى معلمِه نالَ التفوقَ والنجاحَ، واحفظْ قواعدَ لغتِكَ واستنتجْ منها طرائقَ الكتابةِ الصحيحةِ، وكُنْ واحداً من اثنين: إما عالماً أو متعلماً فلا مكانةَ لغيرِ المتعلمين في هذه الحياة.', 'الجدول يتابع ص٣٢ بأعمدة: فعل/نوعه/اسم/مصدر/فعل.'],
    interaction: { kind: 'write', label: 'أملأ جدول الكلمات المبدوءة بهمزة وصل من الفقرة:', rows: 6 },
    availability: 'available', source: lesson3Src(31, 'textbook_spelling', 'التقويم النهائي', 1, LOCKED_SOURCE_NOTES.waslTableHeader, 32),
    teacher: {
      answerOrGuidance: 'من كلمات الهمزة الوصل في الفقرة: استمعْ (فعل أمر خماسي)، استماعاً (مصدر خماسي)، انتبهْ (أمر خماسي)، استنتجْ (أمر سداسي)، اثنين (اسم)، متعلماً/عالماً ليستا من همزة الوصل. يقبل أي فرز سليم وفق الأعمدة المطبوعة.',
      explanation: LOCKED_SOURCE_NOTES.waslTableHeader,
    },
  },

  /* ========================== ص٣٢ ========================== */
  {
    id: 'l3-a-39', sourceActivityId: 'L3-32-01', teacherSolutionId: 'l3-teacher-L3-32-01',
    stepId: 'l3-s6', page: 32, section: 'التقويم النهائي', printedNumber: '٢',
    instruction: 'أُمَيِّزُ هَمزَةَ الوَصْلِ مِنْ هَمزَةِ القَطْعِ في الكَلِماتِ الآتِيَةِ، وأُعَلِّلُ كِتابَتَها عَلى صورَتِها: اقرأ، استفهام، اشتراك، أخذ، استعجل.',
    subparts: ['تمييز خمس كلمات.', 'تعليل الكتابة.'],
    interaction: {
      kind: 'classification',
      categories: [{ id: 'wasl', label: 'همزة وصل' }, { id: 'qat', label: 'همزة قطع' }],
      items: [
        { id: 'iqra', text: 'اقرأ' },
        { id: 'istifham', text: 'استفهام' },
        { id: 'ishtirak', text: 'اشتراك' },
        { id: 'akhadha', text: 'أخذ' },
        { id: 'istajala', text: 'استعجل' },
      ],
    },
    availability: 'available', source: lesson3Src(32, 'textbook_spelling', 'التقويم النهائي', 2),
    teacher: {
      answerOrGuidance: 'همزة وصل: اقرأ (أمر ثلاثي)، استفهام (مصدر سداسي)، اشتراك (مصدر خماسي)، استعجل (ماضي سداسي). همزة قطع: أخذ (ماضي ثلاثي مبدوء بهمزة).',
      explanation: 'المعيار مواضع القاعدة: أمر الثلاثي وماضي الخماسي والسداسي وأمرهما ومصدرهما وأسماء مخصوصة للوصل، وما عدا الثلاثي المبدوء بهمزة في الماضي فقطع.',
      commonMistakes: ['عدّ «اقرأ» همزة قطع لأن فعله مبدوء بالهمزة؛ والصواب أن أمر الثلاثي همزته وصل.'],
    },
  },
  {
    id: 'l3-a-40', sourceActivityId: 'L3-32-02', teacherSolutionId: 'l3-teacher-L3-32-02',
    stepId: 'l3-s6', page: 32, section: 'التقويم النهائي', printedNumber: '٣',
    instruction: 'أُكْمِلُ الجَدولَ الآتي بِالأَفعالِ المُناسِبَةِ: المصدر/فعلُهُ الماضي/عددُ أحرفِ فعلِهِ الماضي (استقبال، انكسار، استعلام، انتقال).',
    subparts: ['٤ صفوف: فعل الماضي وعدد أحرفه لكل مصدر.'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'istiqbal', label: 'استقبال: فعله الماضي وعدد أحرفه' },
        { id: 'inkisar', label: 'انكسار: فعله الماضي وعدد أحرفه' },
        { id: 'istilam', label: 'استعلام: فعله الماضي وعدد أحرفه' },
        { id: 'intiqal', label: 'انتقال: فعله الماضي وعدد أحرفه' },
      ],
    },
    availability: 'available', source: lesson3Src(32, 'textbook_spelling', 'التقويم النهائي', 3),
    teacher: {
      answerOrGuidance: 'استقبال ← استقبلَ (٥). انكسار ← انكسرَ (٥). استعلام ← استعلمَ (٦). انتقال ← انتقلَ (٥).',
      explanation: 'يعيد المتعلم كل مصدر إلى فعله الماضي ويحسب أحرفه؛ الخماسي والسداسي يبدأان بهمزة وصل.',
    },
  },
  {
    id: 'l3-a-41', sourceActivityId: 'L3-32-03', teacherSolutionId: 'l3-teacher-L3-32-03',
    stepId: 'l3-s6', page: 32, section: 'التقويم النهائي', printedNumber: '٤',
    instruction: 'أُحاوِرُ زُملائي لِمُدَّةِ دَقيقَةٍ عَنِ الوَسائِلِ التي اتَّبَعُها لِزِيادَةِ مَعارِفي في لُغَتي العَربيَّةِ مُستَعمِلاً هَمزَةَ الوَصْلِ.',
    subparts: ['حوار لمدة دقيقة.', 'توظيف كلمات فيها همزة وصل.'],
    interaction: { kind: 'speak', preparationLabel: 'أجهز وسائلي لتعلم اللغة بكلمات فيها همزة وصل:', criteria: ['مدة دقيقة', 'كلمات بهمزة وصل'] },
    availability: 'available', source: lesson3Src(32, 'textbook_spelling', 'التقويم النهائي', 4),
    teacher: {
      answerOrGuidance: 'أداء شفهي؛ يتحقق المعلم من توظيف كلمات مثل: استمع، استفهم، انتبه، استعمل.',
      explanation: 'يربط النشاط الإملاء بالاستعمال الشفهي الطبيعي.',
    },
  },
  {
    id: 'l3-a-42', sourceActivityId: 'L3-32-04', teacherSolutionId: 'l3-teacher-L3-32-04',
    stepId: 'l3-s6', page: 32, section: 'التقويم النهائي', printedNumber: '٥',
    instruction: 'أَكتُبُ فِقرَةً مِنْ سَطرَيْنِ أُبَيِّنُ فيها فَوائِدَ تَعَلُّمِ اللُّغَةِ مُستَعمِلاً كَلِماتٍ تَحوي هَمزَةَ وَصْلٍ.',
    subparts: ['فقرة من سطرين.', 'كلمات تحوي همزة وصل.'],
    interaction: { kind: 'write', label: 'أكتب فقرتي من سطرين:', rows: 4 },
    availability: 'available', source: lesson3Src(32, 'textbook_spelling', 'التقويم النهائي', 5),
    teacher: {
      answerOrGuidance: 'فقرة مفتوحة من سطرين؛ يتحقق المعلم من ذكر فوائد تعلم اللغة ورسم كلمات همزة الوصل رسماً صحيحاً.',
      explanation: 'يراقب المعلم رسم همزات الوصل في أثناء الكتابة لا في اختبار معزول.',
    },
  },

  /* ========================== ص٣٣ ========================== */
  {
    id: 'l3-a-43', sourceActivityId: 'L3-33-01', teacherSolutionId: 'l3-teacher-L3-33-01',
    stepId: 'l3-s7', page: 33, section: 'الخط', printedNumber: '١',
    instruction: 'أُلاحِظُ رَسمَ الأَحرُفِ (ب - ت - ث) في الكَلِماتِ الآتِيَةِ.',
    subparts: ['كلمات الملاحظة المطبوعة.', 'الصف الثالث من الكلمات غير محسوم بصرياً (مسألة المصدر ٥).'],
    interaction: {
      kind: 'handwriting',
      modelDescription: 'ملاحظة رسم الأحرف (ب ت ث) في الكلمات المطبوعة في الصفحة: تقارب، اللغات، تولف، برداً، عفوت، الأكباد… مع الانتباه إلى الميل والارتكاز على السطر.',
    },
    availability: 'available', source: lesson3Src(33, 'textbook_exercise', 'الخط', 1, LOCKED_SOURCE_NOTES.handwritingRow3),
    teacher: {
      answerOrGuidance: 'ملاحظة بصرية؛ يتحقق المعلم من انتباه المتعلم لميل الأحرف الثلاثة وبدايتها الأعلى وارتكازها على السطر.',
      explanation: LOCKED_SOURCE_NOTES.handwritingRow3,
    },
  },
  {
    id: 'l3-a-44', sourceActivityId: 'L3-33-02', teacherSolutionId: 'l3-teacher-L3-33-02',
    stepId: 'l3-s7', page: 33, section: 'الخط', printedNumber: '٢',
    instruction: 'أُجَرِّدُ الحُروفَ المُلَوَّنَةَ في الكَلِماتِ السَّابِقَةِ مُنتَبِهاً لِطَريقَةِ كِتابَتِها.',
    subparts: ['تجريد الحروف الملونة (ب ت ث).', 'أتعلّم يوثق أشكال الباء مرقمة وخانات التاء والثاء.'],
    interaction: {
      kind: 'handwriting',
      modelDescription: 'تجريد الحروف الملونة: كتابة أشكال الباء (بـ، ـبـ، ـب، ب) كما في النماذج المرقمة، ثم أشكال التاء والثاء على الطريقة نفسها بخط الرقعة.',
    },
    availability: 'available', source: lesson3Src(33, 'textbook_exercise', 'الخط', 2),
    teacher: {
      answerOrGuidance: 'ممارسة خطية؛ يتحقق المعلم من محاكاة الأشكال الأربعة لكل حرف وفق قاعدة الميل والارتكاز.',
      explanation: 'أتعلّم في المصدر يوثق أشكال الباء بترقيمها؛ والتاء والثاء على المنوال نفسه بنقاطها.',
    },
  },
  {
    id: 'l3-a-45', sourceActivityId: 'L3-33-03', teacherSolutionId: 'l3-teacher-L3-33-03',
    stepId: 'l3-s7', page: 33, section: 'أتدرب', printedNumber: '—',
    instruction: 'أُحاكِي رَسمَ كَلِماتِ العِبارَةِ الآتِيَةِ بِخَطِّ الرُّقعَةِ مُنتَبِهاً لِلأَحرُفِ المُلَوَّنَةِ.',
    subparts: ['العبارة الملونة: تزيّنت اللغة العربية بعدد كلماتها وثرائها بالمفردات فتفوّقت على كل اللغات الأخرى.'],
    interaction: {
      kind: 'handwriting',
      modelText: 'تَزَيَّنَتِ اللُّغَةُ العَرَبِيَّةُ بِعَدَدِ كَلِماتِها وَثَرائِها بِالمُفْرَداتِ فَتَفَوَّقَتْ عَلى كُلِّ اللُّغاتِ الأُخْرى.',
      modelDescription: 'محاكاة رسم العبارة الملونة بخط الرقعة مع الانتباه للأحرف الملونة (ب ت ث).',
    },
    availability: 'available', source: lesson3Src(33, 'textbook_exercise', 'أتدرب'),
    teacher: {
      answerOrGuidance: 'محاكاة خطية لعبارة المصدر نفسها؛ يقوّم المعلم ميل الأحرف الثلاثة وارتكازها.',
      explanation: 'العبارة موثقة في القفل نصاً وتلويناً؛ لا تستبدل بعبارة أخرى.',
    },
  },

  /* ========================== ص٣٤ ========================== */
  {
    id: 'l3-a-46', sourceActivityId: 'L3-34-01', teacherSolutionId: 'l3-teacher-L3-34-01',
    stepId: 'l3-s7', page: 34, section: 'الخط: أطبق', printedNumber: '—',
    instruction: 'أُلاحِظُ الفَرْقَ في رَسمِ الأَحرُفِ بَيْنَ خَطَّيِ الرُّقعَةِ والنَّسخِ في الجَدولِ الآتي.',
    subparts: ['جدول المقارنة: خط النسخ وخط الرقعة للأحرف (ب ت ث).'],
    interaction: {
      kind: 'handwriting',
      modelDescription: 'مقارنة بصريّة بين سطري الجدول: أشكال (ب ت ث) بخط النسخ في السطر الأول وأشكالها بخط الرقعة في السطر الثاني، ورصد فروقات الميل والنقاط.',
    },
    availability: 'available', source: lesson3Src(33, 'textbook_exercise', 'أطبق', undefined, undefined, 34),
    teacher: {
      answerOrGuidance: 'ملاحظة مقارنة؛ من فروقاتها: الرقعة أميل وأقصر وأبسط في النقاط، والنسخ أوضح استدارة.',
      explanation: 'الجدول نموذج بصري موثق في ص٣٣–٣٤؛ الهدف إدراك الفرق لا حفظ مصطلحات جديدة.',
    },
  },
  {
    id: 'l3-a-47', sourceActivityId: 'L3-34-02', teacherSolutionId: 'l3-teacher-L3-34-02',
    stepId: 'l3-s8', page: 34, section: 'أعبر كتابياً', printedNumber: '—',
    instruction: 'أَقرَأُ النَّصَّ الآتي، وَأُلاحِظُ التَّعْدِيلَ الذي طَرَأَ عَلَيْهِ بَعْدَ التَّقْديمِ والتَّأْخيرِ (نصّا النهر قبل التعديل وبعده).',
    subparts: ['النص قبل: يخاطبُ النهرُ الطبيعةَ قائلاً، بينَ مترقرقاً أسيرٌ، فتتمايلُ الأشجارُ، والطيورُ على أغصانها تراقصُ، وعلى ضفتيَّ بساطٌ أخضرُ يمتدُّ فرحاً بلقائي. أُعلِّمُ العطاءَ، والخيرُ أينما اتجهتُ، ولا أنتظرُ الثناءَ من أحدٍ.', 'النص بعد: أسيرٌ مترقرقاً بين الحقولِ، فتتمايلُ الأشجارُ، وتراقصُ الطيورُ على أغصانها، ويمتدُّ على ضفتيَّ بساطٌ أخضرُ فرحاً بلقائي. أُعلِّمُ العطاءَ، وأحملُ الخيرَ أينما اتجهتُ، ولا أنتظرُ الثناءَ من أحدٍ.'],
    interaction: { kind: 'write', label: 'أسجل التعديلات التي لاحظتها بين النصين:', rows: 5 },
    availability: 'available', source: lesson3Src(34, 'textbook_expression', 'أعبر كتابياً: التقديم والتأخير'),
    teacher: {
      answerOrGuidance: 'من التعديلات: «بين مترقرقاً أسير» ← «أسير مترقرقاً بين الحقول»، «والطيور على أغصانها تراقص» ← «وتراقص الطيور على أغصانها»، «وعلى ضفتي بساط أخضر يمتد فرحاً» ← «ويمتد على ضفتي بساط أخضر فرحاً»، «والخير أينما اتجهت» ← «وأحمل الخير أينما اتجهت».',
      explanation: 'الهدف رصد أن التقديم والتأخير يغيّر الصياغة ويحافظ على المعنى.',
    },
  },
  {
    id: 'l3-a-48', sourceActivityId: 'L3-34-03', teacherSolutionId: 'l3-teacher-L3-34-03',
    stepId: 'l3-s8', page: 34, section: 'أعبر كتابياً: أطبق', printedNumber: '—',
    instruction: 'أُعيدُ كِتابَةَ النَّصِّ السَّابِقِ بَعْدَ تَقْديمٍ وتَأْخيرِ بَعْضِ الكَلِماتِ أَوِ الجُمَلِ المُلَوَّنَةِ.',
    subparts: ['الجزء الملون: وكان أهلُ سوريةَ أولُ من عمل بالتعدين وأولُ من عرفوا صهرَ النحاسِ، ثم البرونزَ، وبفضلهم تقدّمت صناعةُ الحلي والخزف وبلغت مكانةً عالميةً.', 'المصدر: الدكتور علي القيم من كتاب «من كنوزنا السورية».'],
    interaction: { kind: 'write', label: 'أعيد كتابة الجزء الملون مع التقديم والتأخير:', rows: 4 },
    availability: 'available', source: lesson3Src(34, 'textbook_expression', 'أعبر كتابياً: أطبق', undefined, LOCKED_SOURCE_NOTES.syriaHeading),
    teacher: {
      answerOrGuidance: 'يقبل أي إعادة صياغة تقدم وتؤخر مع سلامة المعنى، مثل: أول من عمل بالتعدين وأول من عرفوا صهر النحاس ثم البرونز أهلُ سوريةَ، وبفضلهم تقدّمت صناعة الحلي والخزف حتى بلغت مكانة عالمية.',
      explanation: 'المعيار محافظة المعنى مع تغيير مواضع الكلمات الملونة.',
    },
  },

  /* ========================== ص٣٥ ========================== */
  {
    id: 'l3-a-49', sourceActivityId: 'L3-35-01', teacherSolutionId: 'l3-teacher-L3-35-01',
    stepId: 'l3-s9', page: 35, section: 'ألعب وأتعلم', printedNumber: '١',
    instruction: 'أَتَعاوَنُ مَعَ زُملائي في حَلِّ الأُحْجِيَّةِ الآتِيَةِ لِنَعْرِفَ ما المَقصودُ في كُلِّ بَيْتٍ مِنْ أَبياتِ الأُحْجِيَّةِ.',
    subparts: [
      'بيت ١: تعتادُ ارتكابَها / والفعلُ فيها مستهلّ.',
      'بيت ٢: تماثلُ في اسمِها / يُدريكَ من أدّى العمل.',
      'بيت ٣: وسبعةٌ حروفُهُ / عليه من وقع العمل.',
      'بيت ٤: ثلاثةٌ أسماؤها / (فعلٌ) فهل حلٌّ وصل؟!',
    ],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'b1', label: 'مقصود البيت الأول', multiline: true },
        { id: 'b2', label: 'مقصود البيت الثاني', multiline: true },
        { id: 'b3', label: 'مقصود البيت الثالث', multiline: true },
        { id: 'b4', label: 'مقصود البيت الرابع', multiline: true },
      ],
    },
    availability: 'available', source: lesson3Src(35, 'activity_book', 'ألعب وأتعلم', 1),
    teacher: {
      answerOrGuidance: 'حل الأحجية: الجملة الفعلية. البيت ١: نستعملها كثيراً في كلامنا وتبدأ بفعل. البيت ٢: من أسمائها الفاعل الذي يدل على من أدى العمل. البيت ٣: من أسمائها المفعول به الذي يقع عليه العمل. البيت ٤: أسماؤها ثلاثة: فعل وفاعل ومفعول به، وحروفها المميزة سبعة (شرح المنصة).',
      explanation: 'الأحجية تربط مكونات الجملة الفعلية بصفات لغوية playful؛ يقبل المعلم أي صياغة تصل إلى الجملة الفعلية ومكوناتها الثلاثة.',
    },
  },
  {
    id: 'l3-a-50', sourceActivityId: 'L3-35-02', teacherSolutionId: 'l3-teacher-L3-35-02',
    stepId: 'l3-s9', page: 35, section: 'ألعب وأتعلم', printedNumber: '٢',
    instruction: 'أُقَدِّرُ الزَّمَنَ الذي احْتَجْتُ إِلَيْهِ في حَلِّ الأُحْجِيَّةِ.',
    subparts: ['تقدير زمن واحد.'],
    interaction: { kind: 'text_fields', fields: [{ id: 'time', label: 'الزمن الذي احتجت إليه', placeholder: 'مثال: ١٠ دقائق' }] },
    availability: 'available', source: lesson3Src(35, 'activity_book', 'ألعب وأتعلم', 2),
    teacher: {
      answerOrGuidance: 'تقدير شخصي مفتوح؛ يراعي أن مدة النشاط المعتمدة في الكتاب ١٥ دقيقة.',
      explanation: 'النشاط يقدر الزمن ولا يقيسه بدقة؛ يربط المعلم التقدير بالمدة المطبوعة (١٥ دقيقة).',
    },
  },
  {
    id: 'l3-a-51', sourceActivityId: 'L3-35-03', teacherSolutionId: 'l3-teacher-L3-35-03',
    stepId: 'l3-s9', page: 35, section: 'أنا وأسرتي', printedNumber: '—',
    instruction: 'أَبحَثُ بِمُساعَدَةِ أُسْرَتي والاسْتِعانَةِ بِمَصادِرِ التَّعَلُّمِ عَنْ أَوَّلِ أَبْجَدِيَّةٍ في التَّاريخِ، وَمَكانِها، وَعَدَدِ أَحْرُفِها، وَمَعلوماتٍ أُخْرى.',
    subparts: ['بحث أسري موثق.', 'المطلوب: أول أبجدية، مكانها، عدد أحرفها، معلومات أخرى.'],
    interaction: { kind: 'write', label: 'أسجل نتائج بحثي الأسري:', rows: 5 },
    availability: 'available', source: lesson3Src(35, 'activity_book', 'أنا وأسرتي'),
    teacher: {
      answerOrGuidance: 'بحث مفتوح يوثقه المتعلم مع أسرته؛ يتحقق المعلم من ذكر المكان وعدد الأحرف ومصدر البحث. الشائع في المصادر البحثية الإشارة إلى الأبجديتين الأوغاريتية والفينيقية (شرح المنصة لا الكتاب).',
      explanation: 'الكتاب لا يحدد إجابة؛ يقبل أي نتائج موثقة من مصدر تعلم مناسب.',
    },
  },
];

export const LESSON3_COVERAGE = {
  sourceLockPath: 'docs/source-locks/lesson-03-lughati.md',
  requiredSourceActivities: 51,
  discovered: LESSON3_ACTIVITIES.length,
  studentActivities: LESSON3_ACTIVITIES.length,
  teacherSolutions: LESSON3_ACTIVITIES.filter((activity) => activity.teacher.answerOrGuidance).length,
  explicitSourceGaps: LESSON3_ACTIVITIES.filter((activity) => activity.availability === 'gap').map((activity) => activity.sourceActivityId),
} as const;

export function getLesson3Activity(activityId: string): Lesson3Activity | undefined {
  return LESSON3_ACTIVITIES.find((activity) => activity.id === activityId);
}
