import { TeacherLessonGuide } from '../../types/curriculum';
import { LESSON3_ACTIVITIES } from './activities';
import { SOURCE_RULES } from './content';
import { LESSON3_TEST } from './lessonTest';

/**
 * Lesson 3 teacher guide.
 * Generated from the same 51-entry ledger used by the Student Area, so each
 * source activity has exactly one teacher guidance record, including the
 * declared locked uncertainties.
 */
export const LESSON3_TEACHER_GUIDE: TeacherLessonGuide = {
  lessonId: 'lesson3',
  unitId: 'unit1',
  pedagogicalObjectives: [
    'يقرأ المتعلم قصيدة «لغتي» قراءة معبّرة ويستخرج قيم الاعتزاز باللغة ودورها في وحدة أبنائها.',
    'يحدد أركان الجملة الفعلية (فعل، فاعل، مفعول به) ويعرب المثال النموذجي.',
    'يميز همزة الوصل من همزة القطع ويطبق مواضعها في الكتابة.',
    'يرسم الأحرف (ب ت ث) بخط الرقعة ويعيد صياغة نصوص بالتقديم والتأخير مع حفظ المعنى.',
  ],
  grammarNotes: [SOURCE_RULES.verbalSentence],
  spellingRules: [SOURCE_RULES.waslInduction1, SOURCE_RULES.waslInduction2, SOURCE_RULES.waslRule],
  exerciseSolutions: LESSON3_ACTIVITIES.map((activity) => ({
    id: activity.teacherSolutionId,
    sourceExercise: `${activity.sourceActivityId} — ${activity.section}${activity.printedNumber !== '—' ? ` (${activity.printedNumber})` : ''}`,
    pageNumber: activity.page,
    officialSolution: activity.teacher.answerOrGuidance,
    didacticExplanation: activity.teacher.explanation,
    commonStudentMistakes: activity.teacher.commonMistakes,
  })),
  sourceCoverage: LESSON3_ACTIVITIES.map((activity) => ({
    sourceActivityId: activity.sourceActivityId,
    lessonStepId: activity.stepId,
    lessonActivityId: activity.id,
    teacherSolutionId: activity.teacherSolutionId,
    pageNumber: activity.page,
    availability: activity.availability,
  })),
  lessonTestAnswerKeyRef: LESSON3_TEST.id,
};
