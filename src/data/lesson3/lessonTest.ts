import { AssessmentTest } from '../../types/curriculum';
import { lesson3Src } from './sourceMeta';

/**
 * Lesson 3 assessment — exactly 20 new questions.
 * Blueprint: Basic 6 (1–6), Medium 7 (7–13), Advanced 4 (14–17), Thinking 3 (18–20).
 * All questions rely only on the locked source (pages 25–35); the poem text was
 * cross-verified with the poet's published poem.
 */
export const LESSON3_TEST: AssessmentTest = {
  id: 'lesson3-test',
  scope: 'lesson',
  unitId: 'unit1',
  lessonId: 'lesson3',
  title: 'اختبار الدرس الثالث: لغتي',
  description: 'اختبار من ٢٠ سؤالاً في القصيدة ومعجمها، الجملة الفعلية وأركانها، همزة الوصل، الخط، والتقديم والتأخير.',
  timeLimitMinutes: 30,
  questions: [
    {
      id: 'l3-t-01', order: 1, type: 'vocabulary_in_context', difficulty: 'basic',
      prompt: 'ما معنى «مِداد» كما يورده معجم الدرس؟',
      choices: [
        { id: 'a', text: 'حبر' }, { id: 'b', text: 'ورق' }, { id: 'c', text: 'قلم' }, { id: 'd', text: 'سطر' },
      ],
      correctChoiceId: 'a', explanation: 'معجم الكلمات في ص٢٦ يسجل: «مِداد: سائلٌ يُكتَبُ بِهِ (حِبْرٌ)».',
      testedSkill: 'فهم المفردة', source: lesson3Src(26, 'textbook_poetry', 'معجم الكلمات'),
    },
    {
      id: 'l3-t-02', order: 2, type: 'true_false', difficulty: 'basic',
      prompt: 'قصيدة «لغتي» التي يقرؤها الدرس للشاعر حليم دموس.',
      choices: [{ id: 'true', text: 'صحيح' }, { id: 'false', text: 'خطأ' }],
      correctChoiceId: 'true', explanation: 'القصيدة مطبوعة في ص٢٦ باسم الشاعر حليم دموس.',
      testedSkill: 'هوية النص', source: lesson3Src(26, 'textbook_poetry', 'أقرأ'),
    },
    {
      id: 'l3-t-03', order: 3, type: 'single_choice', difficulty: 'basic',
      prompt: 'ما الحرف الذي تختص به اللغة العربية فتُلقّب بلغة الضاد؟',
      choices: [
        { id: 'a', text: 'الضاد' }, { id: 'b', text: 'الظاء' }, { id: 'c', text: 'العين' }, { id: 'd', text: 'الغين' },
      ],
      correctChoiceId: 'a', explanation: 'العبارة الافتتاحية وسؤال التأمل الرابع في ص٢٥ يربطان العربية بحرف الضاد الذي اختصت به.',
      testedSkill: 'الافتتاح والتهيئة', source: lesson3Src(25, 'textbook_exercise', 'أتأمل الصور', 4),
    },
    {
      id: 'l3-t-04', order: 4, type: 'single_choice', difficulty: 'basic',
      prompt: 'وفق قاعدة الدرس، ممّ تتألف الجملة الفعلية؟',
      choices: [
        { id: 'a', text: 'من فعلٍ وفاعلٍ، أو من فعلٍ وفاعلٍ ومفعولٍ به.' },
        { id: 'b', text: 'من مبتدأ وخبر فقط.' },
        { id: 'c', text: 'من فعلٍ ومفعولٍ به دون فاعل.' },
        { id: 'd', text: 'من اسمٍ وفعلٍ وخبر.' },
      ],
      correctChoiceId: 'a', explanation: 'نص القاعدة في ص٢٩: «تتألَّفُ الجُملَةُ الفِعليَّةُ مِنْ فِعْلٍ وفاعِلٍ، أَوْ مِنْ فِعْلٍ وفاعِلٍ ومَفْعولٍ بِهِ».',
      testedSkill: 'قاعدة الجملة الفعلية', source: lesson3Src(29, 'textbook_grammar', 'القاعدة'),
    },
    {
      id: 'l3-t-05', order: 5, type: 'fill_blank', difficulty: 'basic',
      prompt: 'أكمل: الفعل الماضي الذي الأمر منه «اعلمْ» هو …',
      acceptedAnswers: ['علم', 'عَلِمَ', 'علمَ'],
      explanation: 'أمر الثلاثي «اعلمْ» يبدأ بهمزة وصل، وماضيه الثلاثي «عَلِمَ».',
      testedSkill: 'همزة الوصل في أمر الثلاثي', source: lesson3Src(30, 'textbook_spelling', 'إملاء: همزة الوصل', 1),
    },
    {
      id: 'l3-t-06', order: 6, type: 'true_false', difficulty: 'basic',
      prompt: 'الأسماء «ابن، ابنة، اسم، امرأة» تبدأ جميعها بهمزة وصل.',
      choices: [{ id: 'true', text: 'صحيح' }, { id: 'false', text: 'خطأ' }],
      correctChoiceId: 'true', explanation: 'القاعدة في ص٣١ تعدّ هذه الأسماء من مواضع همزة الوصل.',
      testedSkill: 'مواضع همزة الوصل', source: lesson3Src(31, 'textbook_spelling', 'القاعدة'),
    },
    {
      id: 'l3-t-07', order: 7, type: 'single_choice', difficulty: 'medium',
      prompt: 'في جملة «تحفظُ اللغةُ التراثَ»، ما موقع كلمة «التراثَ»؟',
      choices: [
        { id: 'a', text: 'مفعول به' }, { id: 'b', text: 'فاعل' }, { id: 'c', text: 'خبر' }, { id: 'd', text: 'مضاف إليه' },
      ],
      correctChoiceId: 'a', explanation: 'التراث هو ما وقع عليه فعل الحفظ، فهو مفعول به منصوب.',
      testedSkill: 'تمييز المفعول به', source: lesson3Src(28, 'textbook_grammar', 'قواعد اللغة: أركان الجملة الفعلية', 4),
    },
    {
      id: 'l3-t-08', order: 8, type: 'matching', difficulty: 'medium',
      prompt: 'طابق كل مصدرٍ بفعله الماضي كما في جدول الدرس:',
      pairs: [
        { id: 'p1', left: 'استقبال', right: 'استقبلَ' },
        { id: 'p2', left: 'انكسار', right: 'انكسرَ' },
        { id: 'p3', left: 'استعلام', right: 'استعلمَ' },
        { id: 'p4', left: 'انتقال', right: 'انتقلَ' },
      ],
      explanation: 'جدول التقويم في ص٣٢ يردّ كل مصدر خماسي أو سداسي إلى فعله الماضي المبدوء بهمزة وصل.',
      testedSkill: 'رد المصدر إلى فعله', source: lesson3Src(32, 'textbook_spelling', 'التقويم النهائي', 3),
    },
    {
      id: 'l3-t-09', order: 9, type: 'fill_blank', difficulty: 'medium',
      prompt: 'أكمل بصيغة الأمر: الأمر من الفعل «نفعَ» هو …',
      acceptedAnswers: ['انفع', 'انفعْ'],
      explanation: 'أمر الثلاثي يبدأ بهمزة وصل: نفعَ ← انفعْ.',
      testedSkill: 'بناء أمر الثلاثي', source: lesson3Src(30, 'textbook_spelling', 'أطبق', 1),
    },
    {
      id: 'l3-t-10', order: 10, type: 'classification', difficulty: 'medium',
      prompt: 'صنّف الكلمات الآتية حسب نوع همزتها الأولية:',
      categories: [{ id: 'wasl', label: 'همزة وصل' }, { id: 'qat', label: 'همزة قطع' }],
      items: [
        { id: 'iqra', text: 'اقرأ', correctCategoryId: 'wasl' },
        { id: 'akhadha', text: 'أخذ', correctCategoryId: 'qat' },
        { id: 'istifham', text: 'استفهام', correctCategoryId: 'wasl' },
        { id: 'istajala', text: 'استعجل', correctCategoryId: 'wasl' },
      ],
      explanation: '«اقرأ» أمر ثلاثي و«استفهام» مصدر سداسي و«استعجل» ماضي سداسي فهمزتها وصل، أما «أخذ» فماضٍ ثلاثي مبدوء بهمزة قطع.',
      testedSkill: 'تمييز الهمزتين', source: lesson3Src(32, 'textbook_spelling', 'التقويم النهائي', 2),
    },
    {
      id: 'l3-t-11', order: 11, type: 'single_choice', difficulty: 'medium',
      prompt: 'في المثال المعرب «يقدِّرُ العلماءُ أهميّةَ اللغةِ»، ما إعراب «أهميّةَ»؟',
      choices: [
        { id: 'a', text: 'مفعول به منصوب بالفتحة الظاهرة وهو مضاف' },
        { id: 'b', text: 'فاعل مرفوع بالضمة' },
        { id: 'c', text: 'مضاف إليه مجرور بالكسرة' },
        { id: 'd', text: 'فعل مضارع مرفوع' },
      ],
      correctChoiceId: 'a', explanation: 'المثال المعرب في ص٢٩ ينص: «أهميّةَ: مفعولٌ به منصوبٌ، وعلامةُ نصبِهِ الفتحةُ الظاهرةُ على آخرِهِ، وهو مضافٌ».',
      testedSkill: 'الإعراب', source: lesson3Src(29, 'textbook_grammar', 'مثال معرب'),
    },
    {
      id: 'l3-t-12', order: 12, type: 'ordering', difficulty: 'medium',
      prompt: 'رتّب العناصر الآتية لتكوّن جملة فعلية كما في المثال المعرب:',
      items: [
        { id: 'obj', text: 'أهميّةَ اللغةِ' },
        { id: 'verb', text: 'يقدِّرُ' },
        { id: 'subj', text: 'العلماءُ' },
      ],
      correctOrderIds: ['verb', 'subj', 'obj'],
      explanation: 'الجملة الفعلية تبدأ بالفعل ثم الفاعل ثم المفعول به: يقدِّرُ العلماءُ أهميّةَ اللغةِ.',
      testedSkill: 'بناء الجملة الفعلية', source: lesson3Src(29, 'textbook_grammar', 'مثال معرب'),
    },
    {
      id: 'l3-t-13', order: 13, type: 'multi_select', difficulty: 'medium',
      prompt: 'اختر الكلمتين اللتين تبدأان بهمزة وصل على غرار «ارتفعَ»:',
      choices: [
        { id: 'intaqala', text: 'انتقلَ' },
        { id: 'inkasara', text: 'انكسرَ' },
        { id: 'akhadha', text: 'أخذَ' },
        { id: 'ikram', text: 'إكرام' },
      ],
      correctChoiceIds: ['intaqala', 'inkasara'],
      explanation: '«انتقل» و«انكسر» ماضيان خماسيان يبدأان بهمزة وصل، أما «أخذ» فهمزته قطع، و«إكرام» مصدر رباعي بهمزة قطع.',
      testedSkill: 'تطبيق مواضع الهمزتين', source: lesson3Src(30, 'textbook_spelling', 'إملاء: همزة الوصل', 2),
    },
    {
      id: 'l3-t-14', order: 14, type: 'multi_select', difficulty: 'advanced',
      prompt: 'اختر المواضع التي تقع فيها همزة الوصل وفق قاعدة الدرس:',
      choices: [
        { id: 'amr3', text: 'أمر الفعل الثلاثي' },
        { id: 'madi56', text: 'ماضي الخماسي والسداسي وأمرهما ومصدرهما' },
        { id: 'names', text: 'الأسماء: ابن، ابنة، امرؤ، امرأة، اثنان، اثنتان، اسم' },
        { id: 'madi3', text: 'ماضي الفعل الثلاثي' },
      ],
      correctChoiceIds: ['amr3', 'madi56', 'names'],
      explanation: 'القاعدة في ص٣١ تحصر مواضع همزة الوصل في هذه الثلاثة، ولا تشمل ماضي الثلاثي.',
      testedSkill: 'تحليل القاعدة', source: lesson3Src(31, 'textbook_spelling', 'القاعدة'),
    },
    {
      id: 'l3-t-15', order: 15, type: 'error_analysis', difficulty: 'advanced',
      prompt: 'صحّح رسم الكلمة المخطوطة في الجملة: «إستعلمَ الطالبُ عن نتيجتِهِ.»',
      originalSentence: 'إستعلمَ الطالبُ عن نتيجتِهِ.', errorSegment: 'إستعلمَ', correctedSegment: 'استعلمَ',
      correctionOptions: [
        { id: 'a', text: 'استعلمَ' }, { id: 'b', text: 'إستعلمَ' }, { id: 'c', text: 'استعَلَمَ بهمزة قطع' },
      ],
      correctOptionId: 'a', explanation: '«استعلم» فعل ماضٍ سداسي تبدأ همزته وصلاً، فلا تُرسم همزة قطع فوق الألف.',
      testedSkill: 'تصويب رسم همزة الوصل', source: lesson3Src(32, 'textbook_spelling', 'التقويم النهائي', 3),
    },
    {
      id: 'l3-t-16', order: 16, type: 'grammar_application', difficulty: 'advanced',
      prompt: 'أي الجمل الآتية فعلية مكتملة الأركان الثلاثة (فعل وفاعل ومفعول به)؟',
      choices: [
        { id: 'a', text: 'تجمعُ اللغةُ أبناءَها.' },
        { id: 'b', text: 'ازدهرتِ اللغةُ.' },
        { id: 'c', text: 'اللغةُ سجلُّ الأمةِ.' },
        { id: 'd', text: 'ما أجملَ اللغةَ!' },
      ],
      correctChoiceId: 'a', explanation: '«تجمعُ» فعل و«اللغةُ» فاعل و«أبناءَها» مفعول به؛ أما «ازدهرت» فبلا مفعول، والثالثة اسمية.',
      testedSkill: 'تحليل الأركان', source: lesson3Src(29, 'textbook_grammar', 'التقويم النهائي', 1),
    },
    {
      id: 'l3-t-17', order: 17, type: 'fill_blank', difficulty: 'advanced',
      prompt: 'أكمل: عدد أحرف الفعل «استعملَ» هو …',
      acceptedAnswers: ['ستة', '٦', '6'],
      explanation: 'أحرفه: ا، س، ت، ع، م، ل؛ وهو سداسي تبدأ همزته وصلاً.',
      testedSkill: 'تحليل بنية الفعل', source: lesson3Src(30, 'textbook_spelling', 'إملاء: همزة الوصل', 3),
    },
    {
      id: 'l3-t-18', order: 18, type: 'reading_comprehension', difficulty: 'thinking',
      passageContext: '«وَتَقارُبُ الأَرواحِ لَيسَ يَضِيرُهُ / بَينَ الدِّيارِ تَباعُدُ الأَجسادِ»',
      prompt: 'ما الفكرة التي يحملها هذا البيت؟',
      choices: [
        { id: 'a', text: 'رابطة اللغة والقلوب لا يضرّها بُعد المسافات بين الديار.' },
        { id: 'b', text: 'بُعد الديار يقطع الروابط بين الناس.' },
        { id: 'c', text: 'الأرواح تتباعد كلما تباعدت الأجساد.' },
        { id: 'd', text: 'الأجساد تتقارب والأرواح متنافرة.' },
      ],
      correctChoiceId: 'a', explanation: 'البيت يقرر أن تقارب الأرواح لا يضيره تباعد الأجساد بين الديار؛ فوحدة اللغة وحدة قلوب.',
      testedSkill: 'تأويل البيت', source: lesson3Src(26, 'textbook_poetry', 'أقرأ'),
    },
    {
      id: 'l3-t-19', order: 19, type: 'single_choice', difficulty: 'thinking',
      prompt: 'وفق نشاط التصنيف في الدرس، عبارة «كانت لنا برداً على الأكباد» تُعدّ:',
      choices: [
        { id: 'a', text: 'خيالاً وصورة جميلة' },
        { id: 'b', text: 'حقيقة حسية' },
        { id: 'c', text: 'قاعدة لغوية' },
        { id: 'd', text: 'اسماً من أسماء اللغة' },
      ],
      correctChoiceId: 'a', explanation: 'نشاط الفهم ص٢٧ يصنف العبارة خيالاً؛ فاللغة شبه أثرها بالبرد على الأكباد وليست برداً حسياً.',
      testedSkill: 'الحقيقة والخيال', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 7),
    },
    {
      id: 'l3-t-20', order: 20, type: 'single_choice', difficulty: 'thinking',
      prompt: 'أحجية «ألعب وأتعلم» في الدرس تصف:',
      choices: [
        { id: 'a', text: 'الجملة الفعلية' },
        { id: 'b', text: 'الجملة الاسمية' },
        { id: 'c', text: 'همزة الوصل' },
        { id: 'd', text: 'المصدر' },
      ],
      correctChoiceId: 'a', explanation: 'أبيات الأحجية تصف ما يبدأ بفعل وتدل أسماؤه الثلاثة على الفاعل والمفعول به: الجملة الفعلية.',
      testedSkill: 'حل الأحجية', source: lesson3Src(35, 'activity_book', 'ألعب وأتعلم', 1),
    },
  ],
};
