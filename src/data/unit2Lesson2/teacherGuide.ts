import { TeacherLessonGuide } from '../../types/curriculum';
import { U2L2_ACTIVITIES } from './activities';
import { U2L2_SOURCE_RULES } from './content';
import { U2L2_TEST } from './lessonTest';
import { U2L2_LOCKED_SOURCE_NOTES, U2L2_LISTENING_AUDIO_GAP } from './sourceMeta';

/**
 * Unit 2, Lesson 2 teacher guide («الذَّكاءُ الاصطِناعيُّ», pp. 50–60).
 * Generated from the same 51-entry ledger used by the Student Area, so each
 * source activity has exactly one teacher record. `grammarNotes` and
 * `spellingRules` carry the full teachable reasoning for the two rule
 * domains, not only answer keys.
 */
/** Source limits the teacher must see before teaching this lesson. */
export const U2L2_TEACHER_SOURCE_ALERTS = [
  U2L2_LISTENING_AUDIO_GAP,
  U2L2_LOCKED_SOURCE_NOTES.mindMap,
  U2L2_LOCKED_SOURCE_NOTES.calligraphyShapes,
  U2L2_LOCKED_SOURCE_NOTES.drawingTasks,
] as const;

export const U2L2_TEACHER_GUIDE: TeacherLessonGuide = {
  lessonId: 'unit2-lesson2',
  unitId: 'unit2',
  pedagogicalObjectives: [
    'يصف الصورتين التمهيديتين (الدماغ ولوحة الدارات) ويربط بين الذكاء البشري والذكاء الاصطناعي، ويسمّي برامج حاسوبية يعرفها.',
    'يقرأ نص «الذكاء الاصطناعي» قراءة جهرية مراعياً الحروف المتقاربة لفظاً (س/ص، ت/ط)، ويمثّل الحوار مراعياً علامات التعجب والاستفهام.',
    'يحلّل الفهم القرائي: التحويل الصرفي بين المفرد والجمع، والحقل المعجمي للحاسوب، والشخصيات، واستبعاد الفكرة غير الواردة، ومخطط الأفكار، وإضافة مقطع حواري.',
    'يعدّ حديثاً إذاعياً صباحياً عن أهمية التلفاز وآداب مشاهدته بتحية ومحورين وختام، ويقدّمه بمعايير أداء شفهي.',
    'يحوّل الجملة الفعلية إلى اسمية بتقديم الفاعل على الفعل ويعكس التحويل، معللاً تغيّر نوع الجملة دون معناها.',
    'يميّز التاء المبسوطة من المربوطة تعليلاً: في الأفعال وجمع المؤنث السالم والاسم الثلاثي الساكن الوسط (مبسوطة) مقابل الاسم المفرد المؤنث (مربوطة تُلفظ هاءً وقفاً).',
    'يرسم حرفي الدال والذال بخط الرقعة وفق فائدة الكتاب (ميل يسار→يمين ثم أعلى→أسفل وارتكاز على السطر) ويقارن رسمهما بين النسخ والرقعة.',
    'يكتب حقيقة علمية ملتزماً خصائص الأسلوب العلمي الخمس (الدقة والثبات، البعد عن الخيال، الألفاظ الدقيقة، الأرقام والبيانات، حيادية الكاتب).',
  ],
  grammarNotes: [
    `القاعدة كما في الكتاب ص٥٤: ${U2L2_SOURCE_RULES.grammarConversion}`,
    'المدخل الاستقرائي (ص٥٤): جدولان (أ) جمل فعلية صدرها فعل (يحتاجُ الإبداعُ، يُواصِلُ المُبدِعُ) و(ب) الصوغ الاسمي نفسه بعد تقديم الفاعل (الإبداعُ يحتاج، المُبدِعُ يُواصِل). يُبنى النحو من الملاحظة: تحديد الفاعل ← تقديمه ← ملاحظة تحوّل كلمة الابتداء من فعل إلى اسم ← تسمية الجملة اسمية.',
    'التفسير الإعرابي: بعد التقديم يصير الفاعل مبتدأ مرفوعاً، وتبقى الجملة الفعلية بعده في محل رفع خبر؛ والمفعول به ومتعلقات الجملة لا تتغير أحكامها (الحاسِبَ يبقى منصوباً في «الخبيرُ يَبرمِجُ الحاسِبَ»).',
    'التحويل العكسي ص٥٤: إرجاع الفاعل بعد الفعل يعيد الجملة فعلية، مع بقاء أدوات النفي مثل «لن» قبل الفعل («لن يتفوق الحاسِب»)؛ فالقاعدة رتبة لا تغيير معنى ولا إعراب أركان.',
    'الأخطاء الشائعة المعالجة في الحلول: تغيير حركة الفاعل بعد تقديمه (يجب أن يبقى مرفوعاً)، وإعادة ترتيب المفعول مع الفاعل، ونقل أداة النفي من مكانها في التحويل العكسي.',
  ],
  spellingRules: [
    `قاعدة التاء المبسوطة (أستنتج ص٥٥–٥٦): ${U2L2_SOURCE_RULES.basita.join(' ')}`,
    `قاعدة التاء المربوطة (أستنتج ص٥٦): ${U2L2_SOURCE_RULES.marbuta.join(' ')}`,
    'الخوارزمية المعتمدة في التعليل: ١) أحدّد نوع الكلمة (فعل/اسم). ٢) إن كانت فعلاً فالتاء مبسوطة دائماً سواء أكانت أصلية (التفتَ) أم تاء تأنيث ساكنة (انبثقتْ) أم تاء فاعل متحركة (كتبتُ). ٣) إن كانت اسماً أفحص: جمع مؤنث سالم (أمنيات) أو ثلاثي ساكن الوسط (وقت، بيت) فمبسوطة، أم مفرد مؤنث (رسالة، مدرسة، شجرة) فمربوطة.',
    'الاختبار الصوتي الفارق (ص٥٦): الوقف بالساكن يُبقي المبسوطة تاءً ويقلب المربوطة هاءً؛ وهو يدقّق النتيجة المستنتجة من النوع والبنية.',
    'حدود المصدر المرتبطة بالإملاء والخط: فقرة الإملاء تُقرأ من الصفحة المصوّرة ولا يوجد تسجيل إملاء صوتي منفصل، والأشكال الخطية للدال والذال تُنفَّذ يدوياً على ورقة مسطّرة وفق الفائدة.',
  ],
  exerciseSolutions: U2L2_ACTIVITIES.map((activity) => ({
    id: activity.teacherSolutionId,
    sourceExercise: `${activity.sourceActivityId} — ${activity.section}${activity.printedNumber !== '—' ? ` (${activity.printedNumber})` : ''}`,
    pageNumber: activity.page,
    officialSolution: activity.teacher.answerOrGuidance,
    didacticExplanation: activity.teacher.explanation,
    commonStudentMistakes: activity.teacher.commonMistakes,
  })),
  sourceCoverage: U2L2_ACTIVITIES.map((activity) => ({
    sourceActivityId: activity.sourceActivityId,
    lessonStepId: activity.stepId,
    lessonActivityId: activity.id,
    teacherSolutionId: activity.teacherSolutionId,
    pageNumber: activity.page,
    availability: activity.availability,
  })),
  sourceAlerts: [...U2L2_TEACHER_SOURCE_ALERTS],
  lessonTestAnswerKeyRef: U2L2_TEST.id,
};
