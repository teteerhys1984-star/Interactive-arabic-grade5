import { TeacherLessonGuide } from '../../types/curriculum';
import { U2L1_ACTIVITIES } from './activities';
import { U2L1_SOURCE_RULES } from './content';
import { U2L1_TEST } from './lessonTest';
import { U2L1_LOCKED_SOURCE_NOTES, U2L1_LISTENING_AUDIO_GAP } from './sourceMeta';

/**
 * Unit 2, Lesson 1 teacher guide («مُخْتَرِعٌ مِنْ بِلَادِي», pp. 40–49).
 * Generated from the same 45-entry ledger used by the Student Area, so each
 * source activity has exactly one teacher record. `grammarNotes` and
 * `spellingRules` carry the full teachable reasoning for the two rule
 * domains, not only answer keys.
 */
/** Source limits the teacher must see before teaching this lesson. */
export const U2L1_TEACHER_SOURCE_ALERTS = [
  U2L1_LISTENING_AUDIO_GAP,
  U2L1_LOCKED_SOURCE_NOTES.unitTheme,
  U2L1_LOCKED_SOURCE_NOTES.readingSegments,
  U2L1_LOCKED_SOURCE_NOTES.handwritingWords,
  U2L1_LOCKED_SOURCE_NOTES.dictation,
] as const;

export const U2L1_TEACHER_GUIDE: TeacherLessonGuide = {
  lessonId: 'unit2-lesson1',
  unitId: 'unit2',
  pedagogicalObjectives: [
    'يصف المتعلم صورة مرتبطة بالدرس ويكتشف العلاقة الوظيفية التي تجمع وسائط قديمة باختراع حديث واحد.',
    'يلتقط من الاستماع/القراءة الجهرية للنص موضوعه وبعض اختراعات بطله ويقترح له أكثر من عنوان مناسب.',
    'يقرأ نص «مخترع من بلادي» قراءة جهرية مراعياً الوصل بين الكلمات ولفظ الأحرف اللثوية والتلوين الصوتي والسرعة المناسبة.',
    'يحلّل الفهم القرائي: المعنى والضد في سياق الجملة، وسِمات شخصية المخترع بدلائل نصية، والتركيب بمعنييه الحقيقي والمجازي، ومخطط أفكار النص، وتمييز الحقيقة والخيال الأدبي.',
    'يعدّ حديثاً إذاعياً مدرسياً كامل الخطوات (جمع، كتابة، مراجعة معلم وضبط، تدريب، تحية وشكر) ويقدّمه مقيماً بتقييم أقران موثّق.',
    'يحدّد ركني الجملة الاسمية (المبتدأ والخبر المرفوعين بالضمة) ويعربهما، ويفرّق الخبر من النعت داخل جملة أطول، ويكمل الركن الناقص وينشئ جملاً اسمية في كلامه وكتابته.',
    'يميّز الهمزة الأولية وصلاً من قطع بطريقة استدلالية (عدّ أحرف الفعل/معرفة نوع الكلمة ومواضع كل همزة) ويعلّل كتابة كل كلمة مبدوءة بالهمزة في فقرة الإملاء.',
    'يرسم (ج – ح – خ) بخط الرقعة وفق ميزان الفائدة (نقطتان فوق السطر ونقطة تحته عند الانفراد والختام، وشكلان ابتدائيان) ويقارن رسمها بين النسخ والرقعة.',
    'يوظّف أساليب التعبير الخمسة (ألا ترى أنْ، يا لروعةَ، لما لها من أثر كبير، ما أجملَ أنْ، يجب علينا أنْ) في مقطع مترابط عن أهمية الاختراع.',
  ],
  grammarNotes: [
    `القاعدة كما في الكتاب ص٤٥: ${U2L1_SOURCE_RULES.nominalSentence}`,
    'المدخل الاستقرائي (ص٤٤–٤٥): ثلاث جمل تبدأ بأسماء مرفوعة (العلم/الأخلاق/الحكيم) ثم أسماء تخبر عنها (أساس/مؤشّر/إنسان)؛ يُبنى النحو من الملاحظة لا من الحفظ: النوع (اسمية) ← اسم الركن الأول (المبتدأ) ← اسم الركن الثاني (الخبر) ← حكم الرفع وعلامته.',
    'التوظيف التعليمي للمبتدأ والخبر: علاقة إسناد بين مُسنَد إليه يفتتح به الكلام وحكم مرفوع يتمّ به الكلام. الاختبار الدلالي «ما خبر المبتدأ؟» يفرّق الخبر من النعت الذي يجيب عن «أيُّ؟» فقط، وهو الفارق المركزي في تقويم ص٤٥ («الاستعمال المفيد مرتبط»؛ المفيد نعت ومرتبط خبر).',
    'علامة الرفع عند مستوى الصف: الضمة الظاهرة على آخر الركنين؛ وتنوين الضم على الخبر النكرة صورة إملائية للرفع لا حكم جديد. نموذج الإعراب ثلاثي: وظيفة ← مرفوع ← وعلامة رفعِهِ الضمة الظاهرة على آخره.',
    'المطابقة: الخبر يطابق المبتدأ في التذكير والتأنيث بسند مثال الكتاب نفسه («العاملاتُ نشيطاتٌ»)، وبه يحكّم إكمالا «...... مفيدةٌ» (مبتدأ مؤنث) و«...... مرتّبٌ» (مبتدأ مذكر) ص٤٦.',
    'الأخطاء الشائعة المعالجة في حلول الأنشطة: نصب الخبر قياساً على المفعول به في الجملة الفعلية (درس لغتي)؛ اتخاذ أول صفة بعد المبتدأ خبراً؛ ونسيان «الظاهرة» في صيغة الإعراب اعتماداً على الحفظ المجزّأ.',
  ],
  spellingRules: [
    'مدخل الدرس تجميعي: همزة القطع من درس «بالرأي والرأي الآخر» (تأتي في الماضي الثلاثي المبدوء بهمزة ومصدره، والماضي الرباعي وأمره ومصدره، وفي عموم الأسماء والحروف) وهمزة الوصل من درس «لغتي» (أمر الثلاثي، وماضي الخماسي والسداسي وأمرهما ومصدرهما، والأسماء المعدودة).',
    'خوارزمية الاستخراج والتعليل المعتمدة ص٤٦: ١) حدّد نوع الكلمة (فعل/اسم/حرف) وعدد أحرف ماضيها إن كانت فعلاً. ٢) أسقطها على قائمتي المواضع. ٣) تحقق باختبار الوصل لفظاً (وصلٌ تسقط همزة الوصل لفظاً في درج الكلام، وقطع يثبت). ٤) ارسم الصورة: وصل = ألف مجردة، قطع = همزة فوق الألف أو تحتها بحسب حركتها.',
    'كلمات الفقرة مصنّفة ومعلَّلة في حلّ النشاط U2L1-46-05؛ ويحرص عند التصحيح على ملاحظتين: «يستثمر» ليست مبدوءة بالهمزة (بادئة بياء المضارعة)، وهمزة «أل» التعريف خارج الاستخراج بوصفها همزة الوصل المعروفة والمتكررة في كل كلمة معرفة.',
    `حد الإملاء السماعي: ${U2L1_LOCKED_SOURCE_NOTES.dictation}`,
  ],
  exerciseSolutions: U2L1_ACTIVITIES.map((activity) => ({
    id: activity.teacherSolutionId,
    sourceExercise: `${activity.sourceActivityId} — ${activity.section}${activity.printedNumber !== '—' ? ` (${activity.printedNumber})` : ''}`,
    pageNumber: activity.page,
    officialSolution: activity.teacher.answerOrGuidance,
    didacticExplanation: activity.teacher.explanation,
    commonStudentMistakes: activity.teacher.commonMistakes,
  })),
  sourceCoverage: U2L1_ACTIVITIES.map((activity) => ({
    sourceActivityId: activity.sourceActivityId,
    lessonStepId: activity.stepId,
    lessonActivityId: activity.id,
    teacherSolutionId: activity.teacherSolutionId,
    pageNumber: activity.page,
    availability: activity.availability,
  })),
  sourceAlerts: [...U2L1_TEACHER_SOURCE_ALERTS],
  lessonTestAnswerKeyRef: U2L1_TEST.id,
};
