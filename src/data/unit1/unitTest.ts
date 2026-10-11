import { AssessmentTest } from '../../types/curriculum';
import { src as l1Src } from '../lesson1/sourceMeta';
import { lesson2Src } from '../lesson2/sourceMeta';
import { lesson3Src } from '../lesson3/sourceMeta';

/**
 * Unit 1 comprehensive assessment — 50 questions.
 * Distribution follows the actual content weight of the three lessons:
 * Lesson 1 (pages 4–11): 15 questions (1–15).
 * Lesson 2 (pages 12–24): 18 questions (16–33).
 * Lesson 3 (pages 25–35): 17 questions (34–50).
 * Every question is worded distinctly from the lesson tests and relies only on
 * locked/registered source material.
 */
export const UNIT1_TEST: AssessmentTest = {
  id: 'unit1-test',
  scope: 'unit',
  unitId: 'unit1',
  title: 'اختبار الوحدة الأولى: أحلامي وطموحاتي',
  description: 'اختبار شامل يغطي الدروس الثلاثة: السمكة الذهبية، بالرأي والرأي الآخر، لغتي (٥٠ سؤالاً).',
  timeLimitMinutes: 60,
  questions: [
    /* ================= الدرس الأول (١–١٥) ================= */
    {
      id: 'u1-t-01', order: 1, type: 'single_choice', difficulty: 'basic',
      prompt: 'كيف وفّر الصيادون المال اللازم لصنع مركب الصيد في قصة «السمكة الذهبية»؟',
      choices: [
        { id: 'a', text: 'ادّخروا ثمن سمكة إضافية كان يصطادها كل واحد منهم يومياً' },
        { id: 'b', text: 'وجدوا كنزاً غارقاً قرب الشاطئ' },
        { id: 'c', text: 'باعوا الشبكة القديمة لتاجر' },
        { id: 'd', text: 'اقترضوا المال من أهل القرية' },
      ],
      correctChoiceId: 'a', explanation: 'اقترح الصياد الشاب أن يصطاد كل واحد سمكة إضافية يومياً فيجمعون ثمنها ويبدأون صنع المركب؛ وبهذه الفكرة توفّر المال بعد فترة.',
      testedSkill: 'استرجاع تفاصيل القصة', source: l1Src(5, 'textbook_reading', 'النَّصُّ'),
    },
    {
      id: 'u1-t-02', order: 2, type: 'true_false', difficulty: 'basic',
      prompt: 'في قصة «السمكة الذهبية» نصح البحرُ الصيادَ بالتعاون مع زملائه وصنع مركب للصيد.',
      choices: [{ id: 'true', text: 'صحيح' }, { id: 'false', text: 'خطأ' }],
      correctChoiceId: 'true', explanation: 'نصيحة البحر كانت التعاون وصنع مركب، لا انتظار السمكة دون عمل.',
      testedSkill: 'فهم الحدث', source: l1Src(5, 'textbook_reading', 'النَّصُّ'),
    },
    {
      id: 'u1-t-03', order: 3, type: 'fill_blank', difficulty: 'basic',
      prompt: 'اكتب ضد كلمة «فقير» كما تفهمها من سياق القصة:',
      acceptedAnswers: ['غني', 'غنيّ', 'الغني'],
      explanation: 'ضد الفقير قليل المال هو الغني.',
      testedSkill: 'المفردات والأضداد', source: l1Src(5, 'textbook_reading', 'معجم الكلمات'),
    },
    {
      id: 'u1-t-04', order: 4, type: 'single_choice', difficulty: 'basic',
      prompt: 'ما المقصود بكلمة «الشِّباك» كما وردت في سياق القصة؟',
      choices: [
        { id: 'a', text: 'شباك الصيد التي يُصاد بها السمك' },
        { id: 'b', text: 'نوافذ المركب' },
        { id: 'c', text: 'حبال المرساة' },
        { id: 'd', text: 'أشرعة القارب' },
      ],
      correctChoiceId: 'a', explanation: 'في النص جهّز الصيادون المركب «بالشِّباك القوية والمعدات»؛ فالشباك أدوات الصيد.',
      testedSkill: 'معجم الكلمات', source: l1Src(5, 'textbook_reading', 'النَّصُّ'),
    },
    {
      id: 'u1-t-05', order: 5, type: 'classification', difficulty: 'basic',
      prompt: 'صنّف الجمل الآتية حسب نوعها:',
      categories: [{ id: 'nom', label: 'اسمية' }, { id: 'ver', label: 'فعلية' }],
      items: [
        { id: 's1', text: 'البحرُ صديقُ الصيادين.', correctCategoryId: 'nom' },
        { id: 's2', text: 'باعَ الصيادُ سمكَهُ.', correctCategoryId: 'ver' },
        { id: 's3', text: 'الرزقُ قليلٌ أحياناً.', correctCategoryId: 'nom' },
      ],
      explanation: 'ما بدأ باسم فاسمية وما بدأ بفعل ففعلية.',
      testedSkill: 'نوع الجملة', source: l1Src(8, 'textbook_grammar', 'الجُمْلَةُ'),
    },
    {
      id: 'u1-t-06', order: 6, type: 'true_false', difficulty: 'basic',
      prompt: 'كلمة «اسْتَفِدْ» تبدأ بهمزة وصل.',
      choices: [{ id: 'true', text: 'صحيح' }, { id: 'false', text: 'خطأ' }],
      correctChoiceId: 'true', explanation: '«استفد» أمر من فعل سداسي، وأمر الخماسي والسداسي يبدأ بهمزة وصل وفق مادة الهمزة الأولية المقررة في الوحدة.',
      testedSkill: 'الهمزة الأولية', source: l1Src(9, 'textbook_spelling', 'الهَمْزَةُ'),
    },
    {
      id: 'u1-t-07', order: 7, type: 'single_choice', difficulty: 'medium',
      prompt: 'ماذا نتعلم من مبادرة الصياد الشاب في قصة «السمكة الذهبية»؟',
      choices: [
        { id: 'a', text: 'أن المبادرة بفكرة عملية قابلة للتنفيذ تساعد المجموعة على تجاوز مشكلتها.' },
        { id: 'b', text: 'أن الصمت أفضل من اقتراح الحلول.' },
        { id: 'c', text: 'أن العمل الفردي أسرع من عمل المجموعة.' },
        { id: 'd', text: 'أن انتظار الحلول الجاهزة أضمن من التفكير.' },
      ],
      correctChoiceId: 'a', explanation: 'عندما صمت الجميع، نهض الصياد الشاب واقترح فكرة السمكة الإضافية، فوافق الجميع وبدأوا العمل بها حتى تحقق هدفهم.',
      testedSkill: 'الاستنتاج من الأحداث', source: l1Src(5, 'textbook_reading', 'النَّصُّ'),
    },
    {
      id: 'u1-t-08', order: 8, type: 'fill_blank', difficulty: 'medium',
      prompt: 'ما نوع الجملة «البحرُ واسعٌ»؟',
      acceptedAnswers: ['اسمية', 'الجملة الاسمية', 'جملة اسمية'],
      explanation: 'بدأت باسم «البحر» فهي جملة اسمية.',
      testedSkill: 'نوع الجملة', source: l1Src(8, 'textbook_grammar', 'الجُمْلَةُ'),
    },
    {
      id: 'u1-t-09', order: 9, type: 'single_choice', difficulty: 'medium',
      prompt: 'مع من نصح البحرُ الصيادَ أن يتعاون لصنع مركب الصيد؟',
      choices: [
        { id: 'a', text: 'مع زملائه الصيادين' }, { id: 'b', text: 'مع التجار' }, { id: 'c', text: 'وحده دون أحد' }, { id: 'd', text: 'مع المسافرين' },
      ],
      correctChoiceId: 'a', explanation: 'النصيحة كانت التعاون مع الزملاء الصيادين لصنع مركب يحقق صيداً وفيراً.',
      testedSkill: 'فهم التفاصيل', source: l1Src(5, 'textbook_reading', 'النَّصُّ'),
    },
    {
      id: 'u1-t-10', order: 10, type: 'single_choice', difficulty: 'medium',
      prompt: 'ما الاسم الذي يُطلق على الجملة التي تبدأ باسم؟',
      choices: [
        { id: 'a', text: 'الجملة الاسمية' }, { id: 'b', text: 'الجملة الفعلية' }, { id: 'c', text: 'الجملة الشرطية' }, { id: 'd', text: 'الجملة الخبرية فقط' },
      ],
      correctChoiceId: 'a', explanation: 'الجملة الاسمية تبدأ باسم، والفعلية تبدأ بفعل.',
      testedSkill: 'مصطلحات الجملة', source: l1Src(8, 'textbook_grammar', 'الجُمْلَةُ'),
    },
    {
      id: 'u1-t-11', order: 11, type: 'multi_select', difficulty: 'medium',
      prompt: 'اختر الجملتين الفعليتين مما يأتي:',
      choices: [
        { id: 'a', text: 'جَمَعَ الصيادون ثمنَ السمك.' },
        { id: 'b', text: 'الشِّباكُ قويَّةٌ.' },
        { id: 'c', text: 'أَنزَلَ الصيادون المركبَ إلى الماء.' },
        { id: 'd', text: 'الحلمُ قريبٌ من العاملين.' },
      ],
      correctChoiceIds: ['a', 'c'], explanation: '«جمع» و«أنزل» فعلان بدأت بهما الجملتان، والباقيتان اسميتان.',
      testedSkill: 'تمييز نوع الجملة', source: l1Src(8, 'textbook_grammar', 'الجُمْلَةُ'),
    },
    {
      id: 'u1-t-12', order: 12, type: 'single_choice', difficulty: 'advanced',
      prompt: 'أي الكلمات الآتية تبدأ بهمزة قطع؟',
      choices: [
        { id: 'a', text: 'إنجازات' }, { id: 'b', text: 'انظر' }, { id: 'c', text: 'استفد' }, { id: 'd', text: 'انتظار' },
      ],
      correctChoiceId: 'a', explanation: '«إنجازات» تبدأ بهمزة قطع مكسورة، أما انظر واستفد وانتظار فمبدوءة بهمزة وصل.',
      testedSkill: 'الهمزتان في كلمات الوحدة', source: l1Src(9, 'textbook_spelling', 'الهَمْزَةُ'),
    },
    {
      id: 'u1-t-13', order: 13, type: 'sentence_correction', difficulty: 'advanced',
      prompt: 'حوّل الجملة الاسمية الآتية إلى جملة فعلية محافظة على المعنى: «الصيّادون متعاونون على صنع المركب.»',
      acceptedAnswers: [
        'تعاون الصيادون على صنع المركب',
        'تعاون الصيادون على صنع المركب.',
        'يتعاون الصيادون على صنع المركب',
        'يتعاون الصيادون على صنع المركب.',
      ],
      explanation: 'ببدء الجملة بالفعل «تعاون» أو «يتعاون» تصبح فعلية ويبقى المعنى؛ كلا التحويلين صحيح نحوياً ودلالياً.',
      testedSkill: 'تحويل نوع الجملة', source: l1Src(8, 'textbook_grammar', 'الجُمْلَةُ'),
    },
    {
      id: 'u1-t-14', order: 14, type: 'single_choice', difficulty: 'thinking',
      prompt: 'أي موقف عملي يجسّد قيمة التعاون كما وردت في القصة؟',
      choices: [
        { id: 'a', text: 'أن نجمع معاً مصروفنا لشراء هدية مشتركة لصديق.' },
        { id: 'b', text: 'أن أنتظر قيام الآخرين بما أريد.' },
        { id: 'c', text: 'أن أنجز العمل كله وحدي لأضمن إتقانه.' },
        { id: 'd', text: 'أن أعتمد على الحظ في تحقيق هدفي.' },
      ],
      correctChoiceId: 'a', explanation: 'قيمة القصة أن الهدف المشترك يتحقق بجمع الجهود، كما جمع الصيادون ثمن سمكهم الإضافي لصنع المركب.',
      testedSkill: 'تطبيق قيمة القصة', source: l1Src(5, 'textbook_reading', 'النَّصُّ'),
    },
    {
      id: 'u1-t-15', order: 15, type: 'multi_select', difficulty: 'thinking',
      prompt: 'اختر القيمتين اللتين تعزّزهما قصة «السمكة الذهبية»:',
      choices: [
        { id: 'work', text: 'العمل' },
        { id: 'coop', text: 'التعاون' },
        { id: 'greed', text: 'الطمع' },
        { id: 'luck', text: 'انتظار الحظ' },
      ],
      correctChoiceIds: ['work', 'coop'], explanation: 'القصة تجعل تحقيق الحلم ثمرة للعمل والتعاون، لا للطمع أو انتظار الحظ.',
      testedSkill: 'استخلاص القيم', source: l1Src(5, 'textbook_reading', 'النَّصُّ'),
    },

    /* ================= الدرس الثاني (١٦–٣٣) ================= */
    {
      id: 'u1-t-16', order: 16, type: 'single_choice', difficulty: 'basic',
      prompt: 'من شاعر قصيدة «بالرأي والرأي الآخر» المقررة في الوحدة؟',
      choices: [
        { id: 'a', text: 'صالح هواري' }, { id: 'b', text: 'حليم دموس' }, { id: 'c', text: 'حافظ إبراهيم' }, { id: 'd', text: 'أحمد شوقي' },
      ],
      correctChoiceId: 'a', explanation: 'القفل المصدري للدرس الثاني يسجل القصيدة باسم الشاعر صالح هواري.',
      testedSkill: 'هوية النص', source: lesson2Src(13, 'textbook_poetry', 'أقرأ'),
    },
    {
      id: 'u1-t-17', order: 17, type: 'single_choice', difficulty: 'basic',
      prompt: 'وردت كلمة «قراءة» ضمن تقويم المصادر في الدرس الثاني. لماذا تُعَدّ مصدرا؟',
      choices: [
        { id: 'a', text: 'لأنها اسم يدل على حدث مجرد من الزمن' },
        { id: 'b', text: 'لأنها فعل ماض مرتبط بزمن' },
        { id: 'c', text: 'لأنها اسم مكان للحدث' },
        { id: 'd', text: 'لأنها حرف جاء في أول الجملة' },
      ],
      correctChoiceId: 'a', explanation: 'القاعدة الموثقة ص١٧: المصدر اسم من جنس الفعل يدل على حدث مجرد من الزمن؛ وكلمة «قراءة» واردة ضمن المصادر في تقويم ص١٨، فهي اسم لحدث القراءة المجرد من الزمن.',
      testedSkill: 'تطبيق قاعدة المصدر', source: lesson2Src(18, 'textbook_grammar', 'التقويم النهائي'),
    },
    {
      id: 'u1-t-18', order: 18, type: 'fill_blank', difficulty: 'basic',
      prompt: 'حوّل الفعل «سَبَحَ» إلى مصدر كما في لعبة الدرس:',
      acceptedAnswers: ['سباحة', 'السباحة', 'سباحةً'],
      explanation: 'في لعبة ص٢٤ تتحول الأفعال إلى مصادر بإضافة الأحرف: سبح ← سباحة.',
      testedSkill: 'بناء المصدر', source: lesson2Src(24, 'activity_book', 'ألعب وأتعلم', 1),
    },
    {
      id: 'u1-t-19', order: 19, type: 'single_choice', difficulty: 'basic',
      prompt: 'ما معنى «الحكمة» في معجم كلمات الدرس الثاني؟',
      choices: [
        { id: 'a', text: 'اعتماد العقل والعلم بحقائق الأمور' },
        { id: 'b', text: 'كثرة الكلام في النقاش' },
        { id: 'c', text: 'الفوز في الجدال' },
        { id: 'd', text: 'تجنب الرأي الآخر' },
      ],
      correctChoiceId: 'a', explanation: 'معجم ص١٣ يسجل: الحكمة اعتماد العقل والعلم بحقائق الأمور.',
      testedSkill: 'معجم الكلمات', source: lesson2Src(13, 'textbook_poetry', 'معجم الكلمات'),
    },
    {
      id: 'u1-t-20', order: 20, type: 'single_choice', difficulty: 'basic',
      prompt: 'من الضيف الذي تُجري الصحفيةُ المقابلةَ معه في نموذج ص١٦؟',
      choices: [
        { id: 'a', text: 'خبير توعية صحية' },
        { id: 'b', text: 'رجل إطفاء' },
        { id: 'c', text: 'معلم مدرسة' },
        { id: 'd', text: 'طبيب مستشفى' },
      ],
      correctChoiceId: 'a', explanation: 'النموذج الموثق مقابلة مع خبير توعية صحية عن مخلفات الحرب/المخلفات المتفجرة.',
      testedSkill: 'فهم النموذج', source: lesson2Src(16, 'textbook_expression', 'أتواصل شفهياً: مقابلة صحفية'),
    },
    {
      id: 'u1-t-21', order: 21, type: 'fill_blank', difficulty: 'basic',
      prompt: 'حوّل الفعل «حَصَدَ» إلى مصدر كما في تطبيق المصادر:',
      acceptedAnswers: ['حصاد', 'الحصاد', 'حصداً'],
      explanation: 'أزواج التطبيق في ص١٨ تشمل حصد/حصاد.',
      testedSkill: 'بناء المصدر', source: lesson2Src(18, 'textbook_grammar', 'التقويم النهائي', 2),
    },
    {
      id: 'u1-t-22', order: 22, type: 'true_false', difficulty: 'basic',
      prompt: 'المقابلة النموذجية في الدرس الثاني تدور حول مخلفات الحرب/المخلفات المتفجرة وطرق الوقاية منها.',
      choices: [{ id: 'true', text: 'صحيح' }, { id: 'false', text: 'خطأ' }],
      correctChoiceId: 'true', explanation: 'القفل يسجل موضوع المقابلة النموذجية: مخلفات الحرب/المخلفات المتفجرة وأنواعها والوقاية منها.',
      testedSkill: 'فهم النموذج', source: lesson2Src(16, 'textbook_expression', 'أتواصل شفهياً: مقابلة صحفية'),
    },
    {
      id: 'u1-t-23', order: 23, type: 'classification', difficulty: 'medium',
      prompt: 'صنّف الكلمات الآتية إلى فعل أو مصدر:',
      categories: [{ id: 'verb', label: 'فعل' }, { id: 'masdar', label: 'مصدر' }],
      items: [
        { id: 'ishtarak', text: 'اشترك', correctCategoryId: 'verb' },
        { id: 'ishtirak', text: 'اشتراك', correctCategoryId: 'masdar' },
        { id: 'intashar', text: 'انتشر', correctCategoryId: 'verb' },
        { id: 'intishar', text: 'انتشار', correctCategoryId: 'masdar' },
      ],
      explanation: 'اشترك وانتشر فعلان، واشتراك وانتشار مصدران مجردان من الزمن.',
      testedSkill: 'تمييز المصدر من الفعل', source: lesson2Src(18, 'textbook_grammar', 'أطبق'),
    },
    {
      id: 'u1-t-24', order: 24, type: 'single_choice', difficulty: 'medium',
      prompt: 'في المقابلة النموذجية ص١٦، ماذا يشرح خبير التوعية الصحية؟',
      choices: [
        { id: 'a', text: 'تعريف مخلفات الحرب وأنواعها وطرق الوقاية منها.' },
        { id: 'b', text: 'خطوات كتابة الخبر الصحفي.' },
        { id: 'c', text: 'طريقة اختيار ضيوف البرامج الإذاعية.' },
        { id: 'd', text: 'قواعد رسم همزة القطع.' },
      ],
      correctChoiceId: 'a', explanation: 'القفل يوثق المقابلة النموذجية ص١٦: صحفية تحاور خبير التوعية الصحية عن مخلفات الحرب/المخلفات المتفجرة: تعريفها وأنواعها وطرق الوقاية منها؛ وبقية الخيارات ليست من محتوى المقابلة.',
      testedSkill: 'استخراج تفاصيل النموذج', source: lesson2Src(16, 'textbook_expression', 'أتواصل شفهياً: مقابلة صحفية'),
    },
    {
      id: 'u1-t-25', order: 25, type: 'multi_select', difficulty: 'medium',
      prompt: 'اختر الكلمتين المبدوءتين بهمزة قطع:',
      choices: [
        { id: 'asma', text: 'أسمى' },
        { id: 'ikhbar', text: 'إخبار' },
        { id: 'intishar', text: 'انتشار' },
        { id: 'ishtirak', text: 'اشتراك' },
      ],
      correctChoiceIds: ['asma', 'ikhbar'], explanation: '«أسمى» فعل رباعي و«إخبار» مصدره فهمزتهما قطع، أما انتشار واشتراك فبهمزة وصل.',
      testedSkill: 'تطبيق الهمزتين', source: lesson2Src(19, 'textbook_spelling', 'القاعدة'),
    },
    {
      id: 'u1-t-26', order: 26, type: 'fill_blank', difficulty: 'medium',
      prompt: 'اذكر فعل المصدر «رؤية» كما في أزواج المطابقة:',
      acceptedAnswers: ['رأى', 'راى', 'رَأَى'],
      explanation: 'أزواج المطابقة في ص١٨: رأى/رؤية.',
      testedSkill: 'رد المصدر إلى فعله', source: lesson2Src(18, 'textbook_grammar', 'أطبق'),
    },
    {
      id: 'u1-t-27', order: 27, type: 'single_choice', difficulty: 'medium',
      prompt: 'بماذا ترشدنا القصيدةُ للوصول إلى الحق، كما تفهم من أفكار الدرس؟',
      choices: [
        { id: 'a', text: 'بأن نصغي للرأي والرأي الآخر بحكمة دون تعصب.' },
        { id: 'b', text: 'بأن يتمسك كل طرف برأيه دون نقاش.' },
        { id: 'c', text: 'بأن نأخذ رأي الأكثر عدداً دائماً.' },
        { id: 'd', text: 'بأن نتجنب الحوار حتى لا نختلف.' },
      ],
      correctChoiceId: 'a', explanation: 'فكرة الدرس الموثقة أن الحكمة تنمو بالحوار وقبول الرأي والرأي الآخر، لا بالتعصب أو تجنب النقاش.',
      testedSkill: 'فهم الفكرة', source: lesson2Src(14, 'textbook_exercise', 'الفهم القرائي', 2),
    },
    {
      id: 'u1-t-28', order: 28, type: 'error_analysis', difficulty: 'advanced',
      prompt: 'صحّح رسم الكلمة المخطوطة: «إشتركَ التلميذُ في الحوارِ.»',
      originalSentence: 'إشتركَ التلميذُ في الحوارِ.', errorSegment: 'إشتركَ', correctedSegment: 'اشترك',
      correctionOptions: [
        { id: 'a', text: 'اشترك' }, { id: 'b', text: 'إشترك' }, { id: 'c', text: 'ئشترك' },
      ],
      correctOptionId: 'a', explanation: '«اشترك» فعل خماسي تبدأ همزته وصلاً فلا ترسم همزة قطع.',
      testedSkill: 'تصويب الهمزة', source: lesson2Src(19, 'textbook_spelling', 'القاعدة'),
    },
    {
      id: 'u1-t-29', order: 29, type: 'reading_comprehension', difficulty: 'thinking',
      passageContext: '«حوار + حب = حياة»',
      prompt: 'ما العلاقة التي تختصرها عبارة الدرس الافتتاحية؟',
      choices: [
        { id: 'a', text: 'الحوار القائم على الحب يصنع الحياة.' },
        { id: 'b', text: 'الحياة تستغني عن الحوار.' },
        { id: 'c', text: 'الحب بديل عن الحوار.' },
        { id: 'd', text: 'الحوار بلا حب أجمل.' },
      ],
      correctChoiceId: 'a', explanation: 'العبارة التمهيدية الموثقة تجعل الحوار والحب معاً أساس الحياة.',
      testedSkill: 'تأويل العبارة', source: lesson2Src(12, 'textbook_exercise', 'افتتاح الدرس'),
    },
    {
      id: 'u1-t-30', order: 30, type: 'matching', difficulty: 'thinking',
      prompt: 'طابق كل متطلب من متطلبات المقابلة بوظيفته:',
      pairs: [
        { id: 'p1', left: 'الترحيب بالضيف وشكره', right: 'افتتاح مهذب وخاتمة لائقة' },
        { id: 'p2', left: 'تحضير أسئلة قصيرة مباشرة', right: 'إبقاء الحوار في الموضوع' },
        { id: 'p3', left: 'إعطاء الضيف وقتاً كافياً', right: 'إتاحة الرأي للضيف' },
      ],
      explanation: 'المتطلبات الستة في ص١٦ تربط كل إجراء بوظيفته في نجاح المقابلة.',
      testedSkill: 'تحليل المتطلبات', source: lesson2Src(16, 'textbook_expression', 'أتعلم'),
    },
    {
      id: 'u1-t-31', order: 31, type: 'single_choice', difficulty: 'thinking',
      prompt: 'أي سلوك يجسد قيمة قبول الرأي الآخر أثناء النقاش؟',
      choices: [
        { id: 'a', text: 'الإصغاء للآخر والرد بأدب دون خصام.' },
        { id: 'b', text: 'مقاطعة المتحدث لإثبات الخطأ.' },
        { id: 'c', text: 'إنهاء النقاش عند أول خلاف.' },
        { id: 'd', text: 'فرض الرأي الأعلى صوتاً.' },
      ],
      correctChoiceId: 'a', explanation: 'قيم الدرس الموثقة: الحوار الإيجابي وقبول الاختلاف دون خصام.',
      testedSkill: 'تطبيق القيمة', source: lesson2Src(15, 'textbook_exercise', 'الفهم القرائي', 10),
    },
    {
      id: 'u1-t-32', order: 32, type: 'true_false', difficulty: 'basic',
      prompt: 'نص قصيدة «بالرأي والرأي الآخر» مبني على ثلاثة مقاطع تفصل بينها علامات نجوم.',
      choices: [{ id: 'true', text: 'صحيح' }, { id: 'false', text: 'خطأ' }],
      correctChoiceId: 'true', explanation: 'القفل المصدري يسجل بنية النص على ثلاثة مقاطع تفصل بينها علامات نجوم وردية.',
      testedSkill: 'بنية النص', source: lesson2Src(13, 'textbook_poetry', 'أقرأ'),
    },
    {
      id: 'u1-t-33', order: 33, type: 'fill_blank', difficulty: 'medium',
      prompt: 'استخرج المصدر من الجملة: «اشترك التلاميذُ في الإذاعةِ المدرسيةِ.»',
      acceptedAnswers: ['الإذاعة', 'إذاعة'],
      explanation: '«الإذاعة» مصدر الفعل أَذاعَ، وهي المصدر الوحيد الوارد في الجملة؛ أما «اشترك» الوارد فيها فهو فعل لا مصدر، فلا يُقبل استخراجاً.',
      testedSkill: 'استخراج المصدر', source: lesson2Src(17, 'textbook_grammar', 'قواعد اللغة: المصادر'),
    },

    /* ================= الدرس الثالث (٣٤–٥٠) ================= */
    {
      id: 'u1-t-34', order: 34, type: 'single_choice', difficulty: 'basic',
      prompt: 'ما معنى «يضيرُهُ» في معجم قصيدة «لغتي»؟',
      choices: [
        { id: 'a', text: 'يضرُّه' }, { id: 'b', text: 'ينفعه' }, { id: 'c', text: 'يسعده' }, { id: 'd', text: 'يجمعه' },
      ],
      correctChoiceId: 'a', explanation: 'معجم ص٢٦ يسجل: يضيره يضره.',
      testedSkill: 'معجم الكلمات', source: lesson3Src(26, 'textbook_poetry', 'معجم الكلمات'),
    },
    {
      id: 'u1-t-35', order: 35, type: 'fill_blank', difficulty: 'basic',
      prompt: 'ما جمع الكلمة التي مفردها «وهدة» كما في معجم الدرس؟',
      acceptedAnswers: ['وهاد', 'الوهاد', 'وهادٍ'],
      explanation: 'المعجم: وهاد جمع مفرده وهدة وهو المنخفض من الأرض.',
      testedSkill: 'المفرد والجمع', source: lesson3Src(26, 'textbook_poetry', 'معجم الكلمات'),
    },
    {
      id: 'u1-t-36', order: 36, type: 'true_false', difficulty: 'basic',
      prompt: 'الحرف الأخير المنطوق (حرف القافية) في البيت الأول من قصيدة «لغتي» هو الياء.',
      choices: [{ id: 'true', text: 'صحيح' }, { id: 'false', text: 'خطأ' }],
      correctChoiceId: 'true', explanation: 'ينتهي عجز البيت الأول بكلمة «مِدادي»، وحرفها الأخير ياء المد؛ فهي الحرف الأخير كتابةً ونطقاً، وهو حرف روي القصيدة كما في مفتاح مهمة الاستماع عن حروف أواخر الأبيات.',
      testedSkill: 'قوافي النص', source: lesson3Src(25, 'textbook_reading', 'أستمع إلى النص', 1),
    },
    {
      id: 'u1-t-37', order: 37, type: 'single_choice', difficulty: 'basic',
      prompt: 'ما الفاعل في جملة «تنقلُ اللغةُ آثارَ الشعوبِ»؟',
      choices: [
        { id: 'a', text: 'اللغةُ' }, { id: 'b', text: 'تنقلُ' }, { id: 'c', text: 'آثارَ' }, { id: 'd', text: 'الشعوبِ' },
      ],
      correctChoiceId: 'a', explanation: 'اللغة هي التي قامت بنقل الآثار فهي الفاعل المرفوع.',
      testedSkill: 'تمييز الفاعل', source: lesson3Src(29, 'textbook_grammar', 'أطبق'),
    },
    {
      id: 'u1-t-38', order: 38, type: 'fill_blank', difficulty: 'basic',
      prompt: 'أكمل: في الجملة الموثقة «تنقلُ اللغةُ آثارَ الشعوبِ» تُعرب كلمة «آثارَ» …',
      acceptedAnswers: ['مفعول به', 'المفعول به', 'مفعولاً به', 'مفعولا به', 'مفعول به منصوب', 'مفعول به منصوب بالفتحة'],
      explanation: '«تنقلُ» فعل مضارع و«اللغةُ» فاعل و«آثارَ» مفعول به منصوب بالفتحة وهو مضاف، و«الشعوبِ» مضاف إليه؛ والجملة من أمثلة التطبيق الموثقة في الدرس.',
      testedSkill: 'الإعراب', source: lesson3Src(29, 'textbook_grammar', 'أطبق'),
    },
    {
      id: 'u1-t-39', order: 39, type: 'true_false', difficulty: 'basic',
      prompt: 'تُكتب الأحرف (ب - ت - ث) بخط الرقعة مائلة قليلاً بدايتها أعلى من نهايتها ومرتكَزة على السطر.',
      choices: [{ id: 'true', text: 'صحيح' }, { id: 'false', text: 'خطأ' }],
      correctChoiceId: 'true', explanation: 'هذا نص قاعدة الخط في ص٣٣.',
      testedSkill: 'قاعدة الخط', source: lesson3Src(33, 'textbook_exercise', 'الخط: قاعدة'),
    },
    {
      id: 'u1-t-40', order: 40, type: 'multi_select', difficulty: 'medium',
      prompt: 'اختر كلمتين تدلان على المكان من أبيات القصيدة:',
      choices: [
        { id: 'diyar', text: 'الديار' },
        { id: 'anjud', text: 'أنجد' },
        { id: 'lughat', text: 'اللغات' },
        { id: 'aqalam', text: 'أقلامي' },
      ],
      correctChoiceIds: ['diyar', 'anjud'], explanation: 'الديار وأنجد (ووهاد) ألفاظ مكان في القصيدة، أما اللغات وأقلامي فليست أماكن.',
      testedSkill: 'استخراج ألفاظ المكان', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 1),
    },
    {
      id: 'u1-t-41', order: 41, type: 'multi_select', difficulty: 'medium',
      prompt: 'اختر زوجي التضاد الواردين في البيتين الرابع والخامس:',
      choices: [
        { id: 'taqarub', text: 'تقارب × تباعد' },
        { id: 'anjud', text: 'أنجد × وهاد' },
        { id: 'shams', text: 'الشمس × الشعاع' },
        { id: 'arwah', text: 'الأرواح × القوم' },
      ],
      correctChoiceIds: ['taqarub', 'anjud'], explanation: 'تقارب/تباعد في البيت الرابع وأنجد/وهاد في الخامس؛ والباقي ليست أضداداً.',
      testedSkill: 'الأضداد', source: lesson3Src(27, 'textbook_exercise', 'الفهم القرائي', 5),
    },
    {
      id: 'u1-t-42', order: 42, type: 'fill_blank', difficulty: 'medium',
      prompt: 'أكمل: عدد أحرف الفعل «ارتفعَ» هو …',
      acceptedAnswers: ['خمسة', '٥', '5'],
      explanation: 'أحرفه: ا، ر، ت، ف، ع؛ وهو خماسي مبدوء بهمزة وصل.',
      testedSkill: 'تحليل بنية الفعل', source: lesson3Src(30, 'textbook_spelling', 'إملاء: همزة الوصل', 2),
    },
    {
      id: 'u1-t-43', order: 43, type: 'classification', difficulty: 'medium',
      prompt: 'صنّف الكلمات حسب نوع همزتها الأولية:',
      categories: [{ id: 'wasl', label: 'همزة وصل' }, { id: 'qat', label: 'همزة قطع' }],
      items: [
        { id: 'istima', text: 'استماع', correctCategoryId: 'wasl' },
        { id: 'ilan', text: 'إعلان', correctCategoryId: 'qat' },
        { id: 'intibah', text: 'انتباه', correctCategoryId: 'wasl' },
        { id: 'ilam', text: 'إعلام', correctCategoryId: 'qat' },
      ],
      explanation: 'استماع وانتباه مصدرا خماسي بوصل، وإعلان وإعلام مصدرا رباعي بقطع.',
      testedSkill: 'تمييز الهمزتين في المصادر', source: lesson3Src(31, 'textbook_spelling', 'القاعدة'),
    },
    {
      id: 'u1-t-44', order: 44, type: 'single_choice', difficulty: 'medium',
      prompt: 'ماذا نسمي من يقوم بالفعل في الجملة الفعلية؟',
      choices: [
        { id: 'a', text: 'الفاعل' }, { id: 'b', text: 'المفعول به' }, { id: 'c', text: 'المبتدأ' }, { id: 'd', text: 'الخبر' },
      ],
      correctChoiceId: 'a', explanation: 'من قام بالفعل يسمى فاعلاً ويكون مرفوعاً.',
      testedSkill: 'مصطلحات الأركان', source: lesson3Src(28, 'textbook_grammar', 'قواعد اللغة: أركان الجملة الفعلية', 3),
    },
    {
      id: 'u1-t-45', order: 45, type: 'error_analysis', difficulty: 'advanced',
      prompt: 'صحّح رسم الكلمة المخطوطة: «إنتقلَ التلميذُ إلى الصفِّ الخامسِ.»',
      originalSentence: 'إنتقلَ التلميذُ إلى الصفِّ الخامسِ.', errorSegment: 'إنتقلَ', correctedSegment: 'انتقل',
      correctionOptions: [
        { id: 'a', text: 'انتقل' }, { id: 'b', text: 'إنتقل' }, { id: 'c', text: 'ءانتقل' },
      ],
      correctOptionId: 'a', explanation: '«انتقل» ماضي خماسي همزته وصل فلا ترسم فوق الألف.',
      testedSkill: 'تصويب همزة الوصل', source: lesson3Src(32, 'textbook_spelling', 'التقويم النهائي', 3),
    },
    {
      id: 'u1-t-46', order: 46, type: 'single_choice', difficulty: 'advanced',
      prompt: 'همزة «امرؤ» همزة وصل لأن الكلمة:',
      choices: [
        { id: 'a', text: 'من الأسماء المنصوص عليها في القاعدة' },
        { id: 'b', text: 'فعل ماضٍ ثلاثي' },
        { id: 'c', text: 'مصدر فعل رباعي' },
        { id: 'd', text: 'حرف من الحروف' },
      ],
      correctChoiceId: 'a', explanation: 'القاعدة تعدّ «امرؤ» ضمن الأسماء المبدوءة بهمزة وصل.',
      testedSkill: 'مواضع همزة الوصل', source: lesson3Src(31, 'textbook_spelling', 'القاعدة'),
    },
    {
      id: 'u1-t-47', order: 47, type: 'fill_blank', difficulty: 'advanced',
      prompt: 'ما مصدر الفعل «اهتمَّ» الوارد في استقراء الدرس؟',
      acceptedAnswers: ['اهتمام', 'الاهتمام', 'اهتماماً'],
      explanation: 'المثالان الملونان في ص٣١: استعمال مصدر استعمل، واهتمام مصدر اهتمَّ.',
      testedSkill: 'المصادر الخماسية والسداسية', source: lesson3Src(31, 'textbook_spelling', 'إملاء: همزة الوصل', 1),
    },
    {
      id: 'u1-t-48', order: 48, type: 'reading_comprehension', difficulty: 'thinking',
      passageContext: '«أنا حريصٌ على إعلاءِ اسمِ بلادي.»',
      prompt: 'ما القيمة التي تحملها هذه العبارة من أمثلة همزة الوصل؟',
      choices: [
        { id: 'a', text: 'الحرص على رفع اسم الوطن والاعتزاز به.' },
        { id: 'b', text: 'تفضيل البلاد الأخرى على الوطن.' },
        { id: 'c', text: 'الاكتفاء بالفخر دون عمل.' },
        { id: 'd', text: 'الانشغال عن الوطن بأشياء أخرى.' },
      ],
      correctChoiceId: 'a', explanation: 'العبارة المدوّنة من مرحلة قراءة المصدر في أمثلة الدرس تجسد الحرص على إعلاء اسم البلاد، وهي قيمة الاعتزاز بالوطن.',
      testedSkill: 'استخلاص القيمة', source: lesson3Src(31, 'textbook_spelling', 'أقرأ الأمثلة'),
    },
    {
      id: 'u1-t-49', order: 49, type: 'single_choice', difficulty: 'thinking',
      prompt: 'ماذا أحدث التقديمُ والتأخيرُ في نص النهر بعد التعديل؟',
      choices: [
        { id: 'a', text: 'غيّر الصياغة وحافظ على المعنى.' },
        { id: 'b', text: 'غيّر المعنى كلياً.' },
        { id: 'c', text: 'حذف أجزاء من النص.' },
        { id: 'd', text: 'أضاف شخصيات جديدة.' },
      ],
      correctChoiceId: 'a', explanation: 'قاعدة الدرس: التقديم والتأخير يغيّر الصياغة مع مراعاة المحافظة على المعنى، ومقارنة النصين تثبت ذلك.',
      testedSkill: 'تحليل التقديم والتأخير', source: lesson3Src(34, 'textbook_expression', 'أعبر كتابياً: التقديم والتأخير'),
    },
    {
      id: 'u1-t-50', order: 50, type: 'fill_blank', difficulty: 'thinking',
      prompt: 'في أحجية «ألعب وأتعلم»، يصف بيتٌ ركناً من أركان الجملة الفعلية بقوله: «وسبعةٌ حروفُهُ / عليهِ من وقعِ العمل». ما هذا الركن؟',
      acceptedAnswers: ['المفعول به', 'مفعول به', 'المفعول', 'مفعولاً به'],
      explanation: 'ما يقع عليه العمل هو المفعول به؛ وعدُّ الأحرف السبعة في البيت يخص صيغة «مفعول به» بدون أداة التعريف (م-ف-ع-و-ل-ب-ه)، وهي سبعة أحرف، وهو ما تشير إليه الأحجية في هذا البيت.',
      testedSkill: 'حل الأحجية', source: lesson3Src(35, 'activity_book', 'ألعب وأتعلم', 1),
    },
  ],
};
