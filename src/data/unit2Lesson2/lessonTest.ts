import { AssessmentTest } from '../../types/curriculum';
import { u2l2Src } from './sourceMeta';

/**
 * Unit 2, Lesson 2 assessment — exactly 20 new questions.
 * Blueprint: Basic 6 (1–6), Medium 7 (7–13), Advanced 4 (14–17), Thinking 3 (18–20).
 * Every question relies only on the locked source (pages 50–60); nothing is
 * built on declared limits (the missing listening audio, empty mind-map
 * circles, or drawn ruq'a shapes). No question is invented to reach 20: each
 * traces to a printed task, rule, fact or passage line with an answer key and
 * a rationale.
 */
export const U2L2_TEST: AssessmentTest = {
  id: 'unit2-lesson2-test',
  scope: 'lesson',
  unitId: 'unit2',
  lessonId: 'unit2-lesson2',
  title: 'اختبار الوحدة الثانية — الدرس الثاني: الذَّكاءُ الاصطِناعيُّ',
  description: 'اختبار من ٢٠ سؤالاً في نص «الذكاء الاصطناعي» وحوار سامي والحاسِب، والفهم القرائي، وتحويل الجملة الفعلية إلى اسمية، والتاء المبسوطة والمربوطة، وخط الدال والذال، والأسلوب العلمي.',
  timeLimitMinutes: 30,
  questions: [
    {
      id: 'u2l2-t-01', order: 1, type: 'vocabulary_in_context', difficulty: 'basic',
      prompt: 'وفق معجم كلمات النص، ما معنى الفعل «أَطْرَقَ» كما ورد في «أطرقَ الحاسِبُ حَزيناً»؟',
      choices: [
        { id: 'a', text: 'سَكَتَ' },
        { id: 'b', text: 'ضَحِكَ' },
        { id: 'c', text: 'هَرَبَ' },
        { id: 'd', text: 'تَكَلَّمَ بِصَوْتٍ عَالٍ' },
      ],
      correctChoiceId: 'a',
      explanation: 'معجم ص٥١ يثبّت: «أَطْرَقَ: سَكَتَ»، ومنه قول النص «أطرقَ الحاسِبُ حَزيناً» أي سكت خافضاً رأسه كالحزين.',
      testedSkill: 'معجم كلمات النص', source: u2l2Src(51, 'textbook_reading', 'معجم الكلمات'),
    },
    {
      id: 'u2l2-t-02', order: 2, type: 'true_false', difficulty: 'basic',
      prompt: 'جلس سامي أمام شاشة حاسبه الشخصي في صبيحة يوم العيد.',
      choices: [{ id: 'true', text: 'صحيح' }, { id: 'false', text: 'خطأ' }],
      correctChoiceId: 'true',
      explanation: 'تذكر الفقرة الأولى ص٥١: «جلَسَ سامي في صَبيحَةِ يومِ العيدِ» أمام شاشة حاسبه الشخصي بعد أشهر من بعثته الدراسية.',
      testedSkill: 'فهم أحداث النص', source: u2l2Src(51, 'textbook_reading', 'أقرأ'),
    },
    {
      id: 'u2l2-t-03', order: 3, type: 'single_choice', difficulty: 'basic',
      prompt: 'ماذا نُسمّي الجملة التي تبدأ بفعل مثل «يحتاجُ الإبداعُ إلى فِكْرٍ منطلقٍ»؟',
      choices: [
        { id: 'a', text: 'جملة فعلية' },
        { id: 'b', text: 'جملة اسمية' },
        { id: 'c', text: 'شبه جملة' },
        { id: 'd', text: 'جملة شرطية' },
      ],
      correctChoiceId: 'a',
      explanation: 'الجملة التي تبدأ بفعل تسمّى جملة فعلية ركناها فعل وفاعل، وهو ما لاحظه المتعلم في المجموعة (أ) ص٥٤ قبل تحويلها اسمية.',
      testedSkill: 'تمييز نوع الجملة', source: u2l2Src(54, 'textbook_grammar', 'أقرأ الأمثلة الآتية ثم أجيب', 1),
    },
    {
      id: 'u2l2-t-04', order: 4, type: 'single_choice', difficulty: 'basic',
      prompt: 'كُتبت تاء التأنيث الساكنة في الفعل «انبثَقَتْ»:',
      choices: [
        { id: 'a', text: 'مبسوطة' },
        { id: 'b', text: 'مربوطة' },
        { id: 'c', text: 'محذوفة' },
        { id: 'd', text: 'منقوطة نقطتين' },
      ],
      correctChoiceId: 'a',
      explanation: 'بحسب أستنتج ص٥٥، الأفعال المنتهية بتاء تأنيث ساكنة تُختم بتاء مبسوطة؛ والمربوطة خاصة بالاسم المفرد المؤنث.',
      testedSkill: 'صورة تاء التأنيث في الفعل', source: u2l2Src(55, 'textbook_spelling', 'أقرأ الأمثلة ثم أنفذ النشاط', 3),
    },
    {
      id: 'u2l2-t-05', order: 5, type: 'fill_blank', difficulty: 'basic',
      prompt: 'مفرد كلمة «أُمنيات» الواردة في جدول ص٥٢ هو:',
      acceptedAnswers: ['أمنية', 'أُمنية', 'أُمنِيَة', 'امنية'],
      explanation: '«أُمنيات» جمع مؤنث سالم مفرده «أُمنيَة»، وهو أحد تحويلات الجدول الصرفي ص٥٢.',
      testedSkill: 'المفرد والجمع', source: u2l2Src(52, 'textbook_exercise', 'الفهم القرائي: الجدول', 1),
    },
    {
      id: 'u2l2-t-06', order: 6, type: 'single_choice', difficulty: 'basic',
      prompt: 'بحسب «الفائدة» ص٥٨، كيف يُكتب حرف الدال أو الذال بخط الرقعة؟',
      choices: [
        { id: 'a', text: 'مائلاً من اليسار إلى اليمين ثم من الأعلى إلى الأسفل مرتكزاً على السطر' },
        { id: 'b', text: 'من الأسفل إلى الأعلى دون ملامسة السطر' },
        { id: 'c', text: 'بخط عمودي أطول من الأفقي دائماً' },
        { id: 'd', text: 'بدءاً من منتصف السطر نحو اليمين فقط' },
      ],
      correctChoiceId: 'a',
      explanation: 'نص الفائدة ص٥٨ يحدد الاتجاه (يسار→يمين ثم أعلى→أسفل) والارتكاز على السطر، وأن الخط الأفقي أطول قليلاً من العمودي.',
      testedSkill: 'فائدة رسم الدال والذال', source: u2l2Src(58, 'textbook_exercise', 'الخط: فائدة'),
    },
    {
      id: 'u2l2-t-07', order: 7, type: 'matching', difficulty: 'medium',
      prompt: 'طابق كل جمع بمفرده بحسب جدول ص٥٢:',
      pairs: [
        { id: 'p1', left: 'نَواقِلُ', right: 'ناقِلَةٌ' },
        { id: 'p2', left: 'داراتٌ', right: 'دارَةٌ' },
        { id: 'p3', left: 'حَواسِبُ', right: 'حاسِبٌ' },
        { id: 'p4', left: 'رَسائِلُ', right: 'رِسالَةٌ' },
      ],
      explanation: 'تحويلات الجدول الصرفي ص٥٢: نواقل على فواعل مفردها ناقلة، ودارات مفردها دارة، وحواسِب جمع حاسِب، ورسائِل جمع رسالة.',
      testedSkill: 'المفرد والجمع', source: u2l2Src(52, 'textbook_exercise', 'الفهم القرائي: الجدول', 1),
    },
    {
      id: 'u2l2-t-08', order: 8, type: 'matching', difficulty: 'medium',
      prompt: 'طابق كل كلمة بسبب كتابة تائها على صورتها (تقويم ص٥٧):',
      pairs: [
        { id: 'p1', left: 'شَجَرَة', right: 'اسم مفرد مؤنث (مربوطة)' },
        { id: 'p2', left: 'بَيْت', right: 'اسم ثلاثي ساكن الوسط (مبسوطة)' },
        { id: 'p3', left: 'قَرَأَتْ', right: 'تاء تأنيث ساكنة في فعل (مبسوطة)' },
        { id: 'p4', left: 'كاتِبات', right: 'جمع مؤنث سالم (مبسوطة)' },
      ],
      explanation: 'نشاط الوصل ص٥٧ يربط كل كلمة بسبب واحد: المفرد المؤنث مربوطة، والثلاثي الساكن الوسط وفعل التأنيث وجمع المؤنث السالم كلها مبسوطة بحسب قاعدتَي ص٥٥–٥٦.',
      testedSkill: 'تعليل صورة التاء', source: u2l2Src(57, 'textbook_spelling', 'التقويم النهائي: وصل التاء بسببها', 1),
    },
    {
      id: 'u2l2-t-09', order: 9, type: 'grammar_application', difficulty: 'medium',
      prompt: 'حوّل الجملة الفعلية «يَبرمِجُ الخَبيرُ الحاسِبَ» إلى جملة اسمية:',
      choices: [
        { id: 'a', text: 'الخَبيرُ يَبرمِجُ الحاسِبَ.' },
        { id: 'b', text: 'يَبرمِجُ الحاسِبَ الخَبيرُ.' },
        { id: 'c', text: 'الحاسِبَ يَبرمِجُ الخَبيرُ.' },
        { id: 'd', text: 'الخَبيرَ يَبرمِجُ الحاسِبُ.' },
      ],
      correctChoiceId: 'a',
      explanation: 'بتقديم الفاعل «الخَبيرُ» على فعله «يَبرمِجُ» يصير مبتدأ والجملة الفعلية بعده خبراً، مع بقاء المفعول «الحاسِبَ» منصوباً، تطبيقاً لقاعدة ص٥٤.',
      testedSkill: 'تحويل الفعلية إلى اسمية', source: u2l2Src(54, 'textbook_grammar', 'أطبق: التحويل', 1),
    },
    {
      id: 'u2l2-t-10', order: 10, type: 'classification', difficulty: 'medium',
      prompt: 'صنّف الكلمات الآتية بحسب صورة تائها:',
      categories: [
        { id: 'basita', label: 'تنتهي بتاء مبسوطة' },
        { id: 'marbuta', label: 'تنتهي بتاء مربوطة' },
      ],
      items: [
        { id: 'inbathaqat', text: 'انبثَقَتْ', correctCategoryId: 'basita' },
        { id: 'risala', text: 'رِسالَة', correctCategoryId: 'marbuta' },
        { id: 'umniyat', text: 'أُمنيات', correctCategoryId: 'basita' },
        { id: 'madrasa', text: 'مَدرَسَة', correctCategoryId: 'marbuta' },
      ],
      explanation: 'انبثقت فعل بتاء تأنيث مبسوطة، وأمنيات جمع مؤنث سالم مبسوط؛ أما رسالة ومدرسة فاسمان مفردان مؤنثان آخرهما تاء مربوطة تُلفظ هاءً وقفاً.',
      testedSkill: 'تصنيف التاء المبسوطة والمربوطة', source: u2l2Src(55, 'textbook_spelling', 'إملاء: التاء المبسوطة والمربوطة', undefined, undefined, 56),
    },
    {
      id: 'u2l2-t-11', order: 11, type: 'single_choice', difficulty: 'medium',
      prompt: 'الجمل الأربع في ص٥٩ (تمدد المعادن بالحرارة، الذهب لا يصدأ...) تُعدّ:',
      choices: [
        { id: 'a', text: 'حقائق علمية' },
        { id: 'b', text: 'آراء شخصية' },
        { id: 'c', text: 'خيالاً أدبياً' },
        { id: 'd', text: 'أساطير قديمة' },
      ],
      correctChoiceId: 'a',
      explanation: 'النشاط ص٥٩ يقرر أن المعلومات السابقة «حقائق» لأنها قابلة للتحقق، جاءت بألفاظ دقيقة، واستعمل الكاتب فيها الواقع لا الخيال.',
      testedSkill: 'طبيعة النص العلمي', source: u2l2Src(59, 'textbook_expression', 'أقرأ الحقائق العلمية ثم أنفذ النشاط', 1),
    },
    {
      id: 'u2l2-t-12', order: 12, type: 'multi_select', difficulty: 'medium',
      prompt: 'اختر ثلاث خصائص من خصائص الحقائق العلمية المذكورة في إطار «أتعلّم» ص٥٩:',
      choices: [
        { id: 'precision', text: 'الدقة والثبات واختيار الألفاظ الدقيقة' },
        { id: 'imagination', text: 'الاعتماد على الخيال وألفاظه' },
        { id: 'data', text: 'استعمال الأرقام والبيانات العلمية' },
        { id: 'neutrality', text: 'حيادية الكاتب فلا يعرض رأيه' },
      ],
      correctChoiceIds: ['precision', 'data', 'neutrality'],
      explanation: 'خصائص الإطار الخمس: الدقة والثبات، البعد عن الخيال، اختيار الألفاظ الدقيقة، استعمال الأرقام والبيانات، وحيادية الكاتب. فالخيال ليس خاصية بل ضدها.',
      testedSkill: 'خصائص الأسلوب العلمي', source: u2l2Src(59, 'textbook_expression', 'أتعلم: خصائص الحقائق العلمية'),
    },
    {
      id: 'u2l2-t-13', order: 13, type: 'reading_comprehension', difficulty: 'medium',
      prompt: 'ما الشخصيتان المتحاورتان في نص الدرس؟',
      choices: [
        { id: 'a', text: 'سامي والحاسِب' },
        { id: 'b', text: 'سامي وأبوه' },
        { id: 'c', text: 'المعلم والتلميذ' },
        { id: 'd', text: 'الحاسِب والشاشة' },
      ],
      correctChoiceId: 'a',
      explanation: 'النص حوار بين طرفين: سامي الإنسان، والحاسِب المتكلم الذي يجيبه؛ والعبارات الملونة في الكتاب تميّز كلام كل طرف (الفهم ص٥٢).',
      testedSkill: 'تحديد شخصيات النص', source: u2l2Src(52, 'textbook_exercise', 'الفهم القرائي', 3),
    },
    {
      id: 'u2l2-t-14', order: 14, type: 'error_analysis', difficulty: 'advanced',
      prompt: 'صحّح رسم التاء في الكلمة المكتوبة خطأً: «انبثَقَتْ رسالَةٌ في جانبِ الشاشةِ فانبثقَةْ أخرى».',
      originalSentence: 'انبثقَةْ رسالةٌ في جانب الشاشة.',
      errorSegment: 'انبثقَةْ', correctedSegment: 'انبثَقَتْ',
      correctionOptions: [
        { id: 'a', text: 'انبثَقَتْ' },
        { id: 'b', text: 'انبثَقَة' },
        { id: 'c', text: 'انبثَقَتة' },
      ],
      correctOptionId: 'a',
      explanation: '«انبثقت» فعل آخره تاء تأنيث ساكنة تُكتب مبسوطة لا مربوطة؛ فكتابتها «انبثقَة» بتاء مربوطة خطأ تقيسه على الأسماء المؤنثة.',
      testedSkill: 'تصويب تاء الفعل', source: u2l2Src(55, 'textbook_spelling', 'أقرأ الأمثلة ثم أنفذ النشاط', 3),
    },
    {
      id: 'u2l2-t-15', order: 15, type: 'grammar_application', difficulty: 'advanced',
      prompt: 'أعد الجملة الاسمية «الحاسِبُ يُحَوِّلُ الأرقامَ إلى بياناتٍ» إلى جملة فعلية:',
      choices: [
        { id: 'a', text: 'يُحَوِّلُ الحاسِبُ الأرقامَ إلى بياناتٍ.' },
        { id: 'b', text: 'الأرقامَ يُحَوِّلُ الحاسِبُ.' },
        { id: 'c', text: 'الحاسِبُ الأرقامَ يُحَوِّلُ.' },
        { id: 'd', text: 'يُحَوِّلُ الأرقامَ الحاسِبَ.' },
      ],
      correctChoiceId: 'a',
      explanation: 'بإرجاع الفاعل «الحاسِبُ» بعد الفعل «يُحَوِّلُ» تعود الجملة فعلية مع بقاء المعنى والأحكام الإعرابية، وهي عكس عملية التحويل في نشاط ص٥٤.',
      testedSkill: 'تحويل الاسمية إلى فعلية', source: u2l2Src(54, 'textbook_grammar', 'أطبق: التحويل', 2),
    },
    {
      id: 'u2l2-t-16', order: 16, type: 'multi_select', difficulty: 'advanced',
      prompt: 'اختر المواضع الثلاثة التي تُكتب فيها التاء مبسوطة بحسب قاعدتَي الدرس:',
      choices: [
        { id: 'verbs', text: 'آخر الأفعال (أصلية أو تأنيث ساكنة أو متحركة)' },
        { id: 'feminineSingular', text: 'آخر الاسم المفرد المؤنث' },
        { id: 'plural', text: 'جمع المؤنث السالم' },
        { id: 'threeLetter', text: 'الاسم الثلاثي الساكن الوسط' },
      ],
      correctChoiceIds: ['verbs', 'plural', 'threeLetter'],
      explanation: 'قاعدتا ص٥٥–٥٦ تضعان المبسوطة في الأفعال وجمع المؤنث السالم والاسم الثلاثي الساكن الوسط؛ أما الاسم المفرد المؤنث فموضع التاء المربوطة لا المبسوطة.',
      testedSkill: 'مواضع التاء المبسوطة', source: u2l2Src(55, 'textbook_spelling', 'أستنتج: التاء المبسوطة', undefined, undefined, 56),
    },
    {
      id: 'u2l2-t-17', order: 17, type: 'fill_blank', difficulty: 'advanced',
      prompt: 'اجمع كلمة «حاسِب» جمع تكسير كما في جدول ص٥٢:',
      acceptedAnswers: ['حواسب', 'حَواسِب', 'حواسِب', 'حواسيب'],
      explanation: 'جمع تكسير «حاسِب» هو «حَواسِب»، وهو تحويل مقابل في الجدول الصرفي ص٥٢.',
      testedSkill: 'جمع التكسير', source: u2l2Src(52, 'textbook_exercise', 'الفهم القرائي: الجدول', 1),
    },
    {
      id: 'u2l2-t-18', order: 18, type: 'reading_comprehension', difficulty: 'thinking',
      prompt: 'ما الرسالة المركزية التي ينتهي إليها حوار سامي والحاسِب؟',
      choices: [
        { id: 'a', text: 'الحاسِب أذكى منتَج أبدعه العقل البشري، لكن العقل البشري يبقى الأذكى' },
        { id: 'b', text: 'الحاسِب سيحل محل الإنسان تماماً' },
        { id: 'c', text: 'الآلة تملك مشاعر وإبداعاً كالإنسان' },
        { id: 'd', text: 'لا فائدة من الحواسيب في حياتنا' },
      ],
      correctChoiceId: 'a',
      explanation: 'يصرّح سامي أن الحاسِب «أذكى منتَج أبدَعَه العقل البشري» ويجيب عن سؤاله «أنا ذكي حقاً؟» بقوله «نعم، لكنَّني الأذكى»؛ فالآلة ثمرة العقل لا منافسة له.',
      testedSkill: 'الفكرة المحورية للنص', source: u2l2Src(51, 'textbook_reading', 'أقرأ'),
    },
    {
      id: 'u2l2-t-19', order: 19, type: 'single_choice', difficulty: 'thinking',
      prompt: 'بحسب رد سامي، لماذا لا يستطيع الحاسِب أن يُبدع؟',
      choices: [
        { id: 'a', text: 'لأنه لا يقدّم إلا ما أودعه الإنسان فيه من أفكار وغايات، والإبداع يحتاج عقلاً ومشاعر' },
        { id: 'b', text: 'لأنه لا يحفظ المعلومات بسرعة' },
        { id: 'c', text: 'لأنه يخلو من المعادن والنواقل' },
        { id: 'd', text: 'لأنه يرفض العمل في أيام العيد' },
      ],
      correctChoiceId: 'a',
      explanation: 'يقول سامي ص٥١ إن الآلة لا تُبدع لأن الإبداع يحتاج فكراً، و«أنتَ لا تقدِّمُ إلا ما أودَعَكَ الإنسانُ إيَّاه»، ووجود الحاسِب قائم بوجود العقل الإنساني.',
      testedSkill: 'الاستدلال من الحوار', source: u2l2Src(51, 'textbook_reading', 'أقرأ'),
    },
    {
      id: 'u2l2-t-20', order: 20, type: 'single_choice', difficulty: 'thinking',
      prompt: 'أيُّ جملة مما يأتي تصلح حقيقةً علمية بأسلوب علمي على طريقة ص٥٩؟',
      choices: [
        { id: 'a', text: 'يتجمّد الماء عند درجة صفر مئوية تحت الضغط الجوي المعياري.' },
        { id: 'b', text: 'الشتاء أجمل فصول السنة.' },
        { id: 'c', text: 'يا لروعة قطرات المطر!' },
        { id: 'd', text: 'أحب الجو البارد أكثر من الحار.' },
      ],
      correctChoiceId: 'a',
      explanation: 'الجملة الأولى معلومة قابلة للقياس بألفاظ دقيقة محايدة بلا رأي أو عاطفة، وهي صفات الأسلوب العلمي؛ أما البقية فذوق وتعجب وتفضيل شخصي تنتمي للتعبير الأدبي.',
      testedSkill: 'تمييز الأسلوب العلمي', source: u2l2Src(59, 'textbook_expression', 'أتعلم: الأسلوب العلمي في الكتابة'),
    },
  ],
};
