import { AssessmentTest } from '../../types/curriculum';
import { lesson2Src } from './sourceMeta';

/**
 * Lesson 2 assessment — exactly 20 new questions.
 * Blueprint: Basic 6 (1–6), Medium 7 (7–13), Advanced 4 (14–17), Thinking 3 (18–20).
 * The questions assess concepts taught in the source-lock coverage without relying
 * on the unavailable listening material or on untranscribed poem text.
 */
export const LESSON2_TEST: AssessmentTest = {
  id: 'lesson2-test',
  scope: 'lesson',
  unitId: 'unit1',
  lessonId: 'lesson2',
  title: 'اختبار الدرس الثاني: بالرأي والرأي الآخر',
  description: 'اختبار من ٢٠ سؤالاً في مفردات الدرس، المصدر، همزة القطع، الحوار، والتعبير.',
  timeLimitMinutes: 30,
  questions: [
    {
      id: 'l2-t-01', order: 1, type: 'vocabulary_in_context', difficulty: 'basic',
      prompt: 'ما المعنى الذي يورده معجم الدرس لكلمة «تتصفّى»؟',
      choices: [
        { id: 'a', text: 'تنتقي' }, { id: 'b', text: 'تخاصم' }, { id: 'c', text: 'تتوقف' }, { id: 'd', text: 'تتراجع' },
      ],
      correctChoiceId: 'a', explanation: 'يسجل معجم الكلمات في المصدر: «تتصفّى: تنتقي».',
      testedSkill: 'فهم المفردة', source: lesson2Src(13, 'textbook_poetry', 'معجم الكلمات'),
    },
    {
      id: 'l2-t-02', order: 2, type: 'true_false', difficulty: 'basic',
      prompt: 'المصدر اسم يدل على حدث مجرد من الزمن.',
      choices: [{ id: 'true', text: 'صحيح' }, { id: 'false', text: 'خطأ' }],
      correctChoiceId: 'true', explanation: 'هذه هي القاعدة المقررة للمصدر في ص١٧.',
      testedSkill: 'قاعدة المصدر', source: lesson2Src(17, 'textbook_grammar', 'القاعدة'),
    },
    {
      id: 'l2-t-03', order: 3, type: 'single_choice', difficulty: 'basic',
      prompt: 'أي كلمة من الآتية تمثل مصدراً في أمثلة الدرس؟',
      choices: [
        { id: 'a', text: 'إتقان' }, { id: 'b', text: 'أتقن' }, { id: 'c', text: 'أقبل' }, { id: 'd', text: 'أخذ' },
      ],
      correctChoiceId: 'a', explanation: '«إتقان» اسم يدل على الحدث من غير زمن، أما «أتقن» ففعل.',
      testedSkill: 'تمييز المصدر من الفعل', source: lesson2Src(17, 'textbook_grammar', 'قواعد اللغة: المصادر'),
    },
    {
      id: 'l2-t-04', order: 4, type: 'fill_blank', difficulty: 'basic',
      prompt: 'أكمل: مصدر الفعل «ذهب» هو …',
      acceptedAnswers: ['ذهاب'],
      explanation: 'وردت المطابقة «ذهب/ذهاب» ضمن تطبيق المصادر.',
      testedSkill: 'تحويل الفعل إلى مصدر', source: lesson2Src(18, 'textbook_grammar', 'أطبق'),
    },
    {
      id: 'l2-t-05', order: 5, type: 'single_choice', difficulty: 'basic',
      prompt: 'كيف ترسم همزة القطع المكسورة في المثال «إقبالاً»؟',
      choices: [
        { id: 'a', text: 'تحت الألف' }, { id: 'b', text: 'فوق الألف' }, { id: 'c', text: 'بلا علامة همزة' }, { id: 'd', text: 'في آخر الكلمة' },
      ],
      correctChoiceId: 'a', explanation: 'المثال «إقبالاً» يبدأ بهمزة قطع مكسورة مرسومة تحت الألف.',
      testedSkill: 'رسم همزة القطع', source: lesson2Src(19, 'textbook_spelling', 'أقرأ الأمثلة'),
    },
    {
      id: 'l2-t-06', order: 6, type: 'true_false', difficulty: 'basic',
      prompt: 'يعرض ميزان ص١٥ التعليم والصحة ضمن كفة الواجبات.',
      choices: [{ id: 'true', text: 'صحيح' }, { id: 'false', text: 'خطأ' }],
      correctChoiceId: 'false', explanation: 'يسجل المصدر «التعليم» و«الصحة» ضمن الحقوق، ويورد «التزام القوانين» ضمن الواجبات.',
      testedSkill: 'حقوق وواجبات', source: lesson2Src(15, 'textbook_exercise', 'الفهم القرائي', 9),
    },
    {
      id: 'l2-t-07', order: 7, type: 'multi_select', difficulty: 'medium',
      prompt: 'اختر الكلمتين اللتين تبدأان بهمزة قطع من أمثلة الدرس:',
      choices: [
        { id: 'asas', text: 'أساس' }, { id: 'ila', text: 'إلى' }, { id: 'intishar', text: 'انتشار' }, { id: 'dhahaba', text: 'ذهب' },
      ],
      correctChoiceIds: ['asas', 'ila'], explanation: '«أساس» و«إلى» من أمثلة همزة القطع، أما «انتشار» فلا يبدأ بهمزة قطع مرسومة و«ذهب» لا يبدأ بهمزة.',
      testedSkill: 'تطبيق همزة القطع', source: lesson2Src(19, 'textbook_spelling', 'أقرأ الأمثلة'),
    },
    {
      id: 'l2-t-08', order: 8, type: 'classification', difficulty: 'medium',
      prompt: 'صنّف الألفاظ الآتية إلى فعل أو مصدر:',
      categories: [{ id: 'verb', label: 'فعل' }, { id: 'source', label: 'مصدر' }],
      items: [
        { id: 'akhbara', text: 'أخبر', correctCategoryId: 'verb' },
        { id: 'ikhbar', text: 'إخبار', correctCategoryId: 'source' },
        { id: 'zaraa', text: 'زرع', correctCategoryId: 'verb' },
        { id: 'ziraa', text: 'زراعة', correctCategoryId: 'source' },
      ],
      explanation: 'الفعل يرتبط بزمن، والمصدر يدل على الحدث مجرداً من الزمن.',
      testedSkill: 'تصنيف الفعل والمصدر', source: lesson2Src(18, 'textbook_grammar', 'التقويم النهائي'),
    },
    {
      id: 'l2-t-09', order: 9, type: 'error_analysis', difficulty: 'medium',
      prompt: 'صحح رسم الهمزة في الكلمة الآتية: «اقبالاً».',
      originalSentence: 'اقبالاً', errorSegment: 'اقبالاً', correctedSegment: 'إقبالاً',
      correctionOptions: [
        { id: 'a', text: 'إقبالاً' }, { id: 'b', text: 'أقبالاً' }, { id: 'c', text: 'اقبالاً' },
      ],
      correctOptionId: 'a', explanation: '«إقبالاً» مصدر يبدأ بهمزة قطع مكسورة، فتكتب الهمزة تحت الألف.',
      testedSkill: 'تصويب همزة القطع', source: lesson2Src(19, 'textbook_spelling', 'أقرأ الأمثلة'),
    },
    {
      id: 'l2-t-10', order: 10, type: 'matching', difficulty: 'medium',
      prompt: 'طابق كل فعل بما كوّنه نشاط اللعبة من مصدر:',
      pairs: [
        { id: 'p1', left: 'كتب', right: 'كتابة' },
        { id: 'p2', left: 'ذهب', right: 'ذهاب' },
        { id: 'p3', left: 'صعد', right: 'صعود' },
      ],
      explanation: 'التمرين يحول الأفعال المعطاة إلى مصادر بإضافة الحروف المناسبة.',
      testedSkill: 'بناء المصدر', source: lesson2Src(24, 'activity_book', 'ألعب وأتعلم', 1),
    },
    {
      id: 'l2-t-11', order: 11, type: 'ordering', difficulty: 'medium',
      prompt: 'رتّب هذه الأعمال الثلاثة في مسار مقابلة صحفية من الإعداد إلى الختام:',
      items: [
        { id: 'topic', text: 'اختيار الموضوع' },
        { id: 'questions', text: 'تحضير أسئلة قصيرة ومباشرة' },
        { id: 'closing', text: 'الترحيب بالضيف وشكره في النهاية' },
      ],
      correctOrderIds: ['topic', 'questions', 'closing'],
      explanation: 'يبدأ العمل باختيار الموضوع، ثم إعداد الأسئلة، وتظهر عبارات الترحيب والشكر في اللقاء وختامه.',
      testedSkill: 'تنظيم المقابلة الصحفية', source: lesson2Src(16, 'textbook_expression', 'أتعلم'),
    },
    {
      id: 'l2-t-12', order: 12, type: 'single_choice', difficulty: 'medium',
      prompt: 'وفق القاعدة، تأتي همزة القطع في أول أي مجموعة؟',
      choices: [
        { id: 'a', text: 'الحروف والأسماء' }, { id: 'b', text: 'الأفعال المضارعة فقط' }, { id: 'c', text: 'الأسماء الموصولة فقط' }, { id: 'd', text: 'كل الكلمات بلا استثناء' },
      ],
      correctChoiceId: 'a', explanation: 'تصرح القاعدة بأن همزة القطع تأتي في أول الحروف والأسماء والأفعال، ومن مواضعها الحروف والأسماء كلها.',
      testedSkill: 'مواضع همزة القطع', source: lesson2Src(19, 'textbook_spelling', 'القاعدة'),
    },
    {
      id: 'l2-t-13', order: 13, type: 'fill_blank', difficulty: 'medium',
      prompt: 'أكمل: الفعل الذي يؤخذ منه المصدر «إعلام» هو …',
      acceptedAnswers: ['أعلم'],
      explanation: 'في التقويم يطلب المصدر والفعل المقابلان؛ «إعلام» مصدر الفعل «أعلم».',
      testedSkill: 'استخراج الفعل من المصدر', source: lesson2Src(18, 'textbook_grammar', 'التقويم النهائي', 1),
    },
    {
      id: 'l2-t-14', order: 14, type: 'multi_select', difficulty: 'advanced',
      prompt: 'اختر العبارتين المطابقتين لمواضع همزة القطع في القاعدة:',
      choices: [
        { id: 'triple', text: 'الفعل الماضي الثلاثي المبدوء بهمزة ومصدره' },
        { id: 'quad', text: 'الماضي الرباعي وأمره ومصدره' },
        { id: 'present', text: 'الفعل المضارع فقط' },
        { id: 'all-words', text: 'كل الكلمات بلا استثناء' },
      ],
      correctChoiceIds: ['triple', 'quad'], explanation: 'هاتان العبارتان مذكورتان في مواضع همزة القطع؛ لا تنص القاعدة على المضارع فقط أو على كل الكلمات.',
      testedSkill: 'تحليل قاعدة همزة القطع', source: lesson2Src(19, 'textbook_spelling', 'القاعدة'),
    },
    {
      id: 'l2-t-15', order: 15, type: 'classification', difficulty: 'advanced',
      prompt: 'وفق أمثلة الدرس، صنّف الكلمات بحسب نوعها:',
      categories: [
        { id: 'triple', label: 'فعل ماضٍ ثلاثي' }, { id: 'quad', label: 'فعل ماضٍ رباعي' }, { id: 'source', label: 'مصدر' },
      ],
      items: [
        { id: 'aqbala', text: 'أقبل', correctCategoryId: 'quad' },
        { id: 'iqbal', text: 'إقبال', correctCategoryId: 'source' },
        { id: 'akhadha', text: 'أخذ', correctCategoryId: 'triple' },
        { id: 'amalan', text: 'أملاً', correctCategoryId: 'source' },
      ],
      explanation: '«أقبل» رباعي و«أخذ» ثلاثي، أما «إقبال» و«أملاً» فقد وردا في المصدر بوصفهما مصدرين.',
      testedSkill: 'تحليل نوع الكلمة', source: lesson2Src(19, 'textbook_spelling', 'أقرأ الأمثلة'),
    },
    {
      id: 'l2-t-16', order: 16, type: 'sentence_correction', difficulty: 'advanced',
      prompt: 'صحح رسم الكلمة التالية لتوافق مثال الدرس: «الى».',
      acceptedAnswers: ['إلى'],
      explanation: '«إلى» تبدأ بهمزة قطع مكسورة، ولذلك ترسم الهمزة تحت الألف.',
      testedSkill: 'تطبيق إملائي', source: lesson2Src(19, 'textbook_spelling', 'أقرأ الأمثلة'),
    },
    {
      id: 'l2-t-17', order: 17, type: 'single_choice', difficulty: 'advanced',
      prompt: 'أي خطة تلتزم بمعايير المقابلة الصحفية الواردة في الدرس؟',
      choices: [
        { id: 'a', text: 'أحدد الموضوع والضيف والزمان والمكان، وأعد أسئلة قصيرة، وأرحب بالضيف وأمنحه وقتاً ثم أشكره.' },
        { id: 'b', text: 'أبدأ بالأسئلة الطويلة من دون تحديد الموضوع أو الضيف.' },
        { id: 'c', text: 'أكتب جواب الضيف قبل أن ألتقيه.' },
        { id: 'd', text: 'أنهي المقابلة من دون افتتاح أو شكر.' },
      ],
      correctChoiceId: 'a', explanation: 'الخطة الأولى تجمع الموضوع والشخص والزمان والمكان والأسئلة المختصرة والافتتاح وإتاحة الرأي والشكر.',
      testedSkill: 'تحليل خطة مقابلة', source: lesson2Src(16, 'textbook_expression', 'أتعلم'),
    },
    {
      id: 'l2-t-18', order: 18, type: 'multi_select', difficulty: 'thinking',
      prompt: 'اختر العبارات التي توافق عناصر ميزان الحقوق والواجبات الموثقة:',
      choices: [
        { id: 'education', text: 'التعليم حق' }, { id: 'health', text: 'الصحة حق' },
        { id: 'laws', text: 'التزام القوانين واجب' }, { id: 'no-duty', text: 'يتحقق الميزان بالحقوق من دون واجبات' },
      ],
      correctChoiceIds: ['education', 'health', 'laws'], explanation: 'يعرض المصدر التعليم والصحة ضمن الحقوق والتزام القوانين ضمن الواجبات، وفكرة المهمة تحقيق التوازن بين الكفتين.',
      testedSkill: 'ربط الحقوق بالواجبات', source: lesson2Src(15, 'textbook_exercise', 'الفهم القرائي', 9),
    },
    {
      id: 'l2-t-19', order: 19, type: 'single_choice', difficulty: 'thinking',
      prompt: 'أي اختيار يساعد شخصيتي «نعم» و«كلا» على تحويل الحوار إلى موقف بنّاء؟',
      choices: [
        { id: 'a', text: 'الخصام' }, { id: 'b', text: 'الحوار الإيجابي' }, { id: 'c', text: 'الفوضى' }, { id: 'd', text: 'إلغاء الرأي الآخر' },
      ],
      correctChoiceId: 'b', explanation: 'الأفكار الموثقة في الدرس تؤكد الحوار الإيجابي وقبول الرأي والرأي الآخر لا الخصام أو الفوضى.',
      testedSkill: 'تطبيق قيمة الحوار', source: lesson2Src(15, 'textbook_exercise', 'الفهم القرائي', 10),
    },
    {
      id: 'l2-t-20', order: 20, type: 'reading_comprehension', difficulty: 'thinking',
      passageContext: '«فالحكمة تنضج بالرأي والرأي الآخر» / «ثمرة التين تنضج في فصل الصيف».',
      prompt: 'أي تفسير يوضح اختلاف دلالة «تنضج» في العبارتين؟',
      choices: [
        { id: 'a', text: 'في الأولى نمو معنوي، وفي الثانية نضج حسي للثمرة.' },
        { id: 'b', text: 'الكلمة تدل على المعنى الحسي نفسه في العبارتين.' },
        { id: 'c', text: 'الكلمة لا معنى لها في العبارة الأولى.' },
        { id: 'd', text: 'المقصود في العبارة الثانية هو تعدد الآراء.' },
      ],
      correctChoiceId: 'a', explanation: 'الحكمة تنمو فكرياً بالرأي والرأي الآخر، أما ثمرة التين فتنضج نضجاً حسياً في فصل الصيف.',
      testedSkill: 'تحليل المعنى بالسياق', source: lesson2Src(14, 'textbook_exercise', 'الفهم القرائي', 2),
    },
  ],
};
