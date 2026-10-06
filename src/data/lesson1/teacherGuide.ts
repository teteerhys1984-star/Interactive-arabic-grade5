import { TeacherLessonGuide } from '../../types/curriculum';
import { TEXTBOOK_ACTIVITIES } from './activities';
import { LESSON1_TEST } from './lessonTest';
import { GRAMMAR_RULE_LINES, SPELLING_RULE_LINES } from './content';

/**
 * Independent Teacher Area guide for Lesson 1.
 * exerciseSolutions is DERIVED from the single coverage ledger (TEXTBOOK_ACTIVITIES),
 * guaranteeing a 1:1 mapping: every textbook activity has exactly one teacher solution.
 */
export const LESSON1_TEACHER_GUIDE: TeacherLessonGuide = {
  lessonId: 'lesson1',
  unitId: 'unit1',
  pedagogicalObjectives: [
    'يَقْرَأُ التِّلْميذُ نَصَّ «السَّمَكَةِ الذَّهَبِيَّةِ» قِراءَةً مُعَبِّرَةً.',
    'يَسْتَخْلِصُ قِيمَتَي العَمَلِ وَالتَّعاوُنِ مِنَ النَّصِّ.',
    'يُمَيِّزُ بَيْنَ الجُمْلَةِ الاسْمِيَّةِ وَالفِعْلِيَّةِ وَيُطَبِّقُ عَلَيْهِما.',
    'يُفَرِّقُ بَيْنَ هَمْزَتَي القَطْعِ وَالوَصْلِ وَيَكْتُبُهُما صَحيحاً.',
  ],
  grammarNotes: [...GRAMMAR_RULE_LINES],
  spellingRules: [...SPELLING_RULE_LINES],
  exerciseSolutions: TEXTBOOK_ACTIVITIES.map((a) => ({
    sourceExercise: `${a.section} — النَّشاطُ ${a.printedNumber}`,
    pageNumber: a.page,
    officialSolution: a.solution.answer,
    didacticExplanation: a.solution.explanation,
    commonStudentMistakes: a.uncertain ? ['يُراجَعُ هَذا البَنْدُ مَعَ قَصٍّ أَدَقَّ لِلْمَصْدَرِ.'] : undefined,
  })),
  lessonTestAnswerKeyRef: LESSON1_TEST.id,
};
