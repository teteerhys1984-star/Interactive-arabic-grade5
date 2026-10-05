/**
 * Interactive Arabic Grade 5 - Core Types & Schema
 * 
 * Strict curriculum and assessment type specifications.
 * Note: ZERO textbook curriculum is hardcoded here.
 */

// ==========================================
// 1. SOURCE TRACEABILITY
// ==========================================

export type SourceType =
  | 'textbook_reading'
  | 'textbook_grammar'
  | 'textbook_spelling'
  | 'textbook_expression'
  | 'textbook_poetry'
  | 'textbook_exercise'
  | 'activity_book'
  | 'enrichment';

export interface SourceReference {
  /** Title of the official textbook or document */
  documentTitle: string;
  /** Semester / Term if split (e.g. 1 or 2) */
  term?: 1 | 2;
  /** Exact page number in the physical/scanned textbook */
  pageNumber: number;
  /** Optional secondary page for spreads */
  pageEndNumber?: number;
  /** Title or number of the section on that page */
  sectionName?: string;
  /** Exercise or line number if applicable */
  itemNumber?: number | string;
  /** Pedagogical source category */
  sourceType: SourceType;
  /** Verification flag confirming this page was reviewed for readability */
  readabilityVerified: boolean;
}

// ==========================================
// 2. CURRICULUM HIERARCHY
// ==========================================

export interface LessonStep {
  id: string;
  stepNumber: number;
  title: string;
  type:
    | 'introduction'
    | 'reading_passage'
    | 'guided_exploration'
    | 'rule_formulation'
    | 'interactive_practice'
    | 'summary';
  source?: SourceReference;
}

export interface LessonMetadata {
  id: string;
  unitId: string;
  order: number;
  title: string;
  subtitle?: string;
  primarySkill:
    | 'reading_comprehension'
    | 'grammar'
    | 'spelling_dictation'
    | 'literary_appreciation'
    | 'writing_expression';
  estimatedMinutes: number;
  sources: SourceReference[];
}

export interface Lesson {
  metadata: LessonMetadata;
  steps: LessonStep[];
  /** Exactly 20 questions when created from official curriculum */
  testId?: string;
}

export interface UnitMetadata {
  id: string;
  order: number;
  title: string;
  theme?: string;
  /**
   * CRITICAL PROJECT RULE:
   * A unit is incomplete until the project owner explicitly declares:
   * "This is the last lesson in the unit."
   * Do NOT infer completion from lesson count.
   */
  isComplete: boolean;
  completionDeclarationDate?: string;
  sourcePagesRange?: {
    startPage: number;
    endPage: number;
  };
}

export interface Unit {
  metadata: UnitMetadata;
  lessons: Lesson[];
  /**
   * Unit Test ID - strictly only defined and enabled when metadata.isComplete === true.
   * Target: 50-60 questions.
   */
  unitTestId?: string;
}

export interface CurriculumRegistry {
  grade: 5;
  subject: 'اللغة العربية';
  academicYear?: string;
  units: Unit[];
}

// ==========================================
// 3. ASSESSMENT / TEST SYSTEM
// ==========================================

export type QuestionType =
  | 'single_choice'
  | 'true_false'
  | 'multi_select'
  | 'fill_blank'
  | 'text_input'
  | 'ordering'
  | 'matching'
  | 'classification'
  | 'sentence_correction'
  | 'error_analysis'
  | 'reading_comprehension'
  | 'grammar_application'
  | 'vocabulary_in_context';

export interface QuestionChoice {
  id: string;
  text: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface ClassificationCategory {
  id: string;
  label: string;
}

export interface ClassificationItem {
  id: string;
  text: string;
  correctCategoryId: string;
}

export interface BaseQuestion {
  id: string;
  order: number;
  type: QuestionType;
  prompt: string;
  passageContext?: string;
  source: SourceReference;
  /** Detailed educational explanation / solution reasoning */
  explanation: string;
  /** Target skill tested */
  testedSkill: string;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single_choice' | 'true_false' | 'reading_comprehension' | 'grammar_application' | 'vocabulary_in_context';
  choices: QuestionChoice[];
  correctChoiceId: string;
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: 'multi_select';
  choices: QuestionChoice[];
  correctChoiceIds: string[];
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill_blank' | 'text_input' | 'sentence_correction';
  acceptedAnswers: string[];
  caseSensitive?: boolean;
}

export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  items: { id: string; text: string }[];
  correctOrderIds: string[];
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: MatchingPair[];
}

export interface ClassificationQuestion extends BaseQuestion {
  type: 'classification';
  categories: ClassificationCategory[];
  items: ClassificationItem[];
}

export interface ErrorAnalysisQuestion extends BaseQuestion {
  type: 'error_analysis';
  originalSentence: string;
  errorSegment: string;
  correctedSegment: string;
  correctionOptions?: QuestionChoice[];
  correctOptionId?: string;
}

export type AssessmentQuestion =
  | SingleChoiceQuestion
  | MultiSelectQuestion
  | FillBlankQuestion
  | OrderingQuestion
  | MatchingQuestion
  | ClassificationQuestion
  | ErrorAnalysisQuestion;

export type AssessmentScope = 'lesson' | 'unit';

export interface AssessmentTest {
  id: string;
  scope: AssessmentScope;
  unitId: string;
  lessonId?: string;
  title: string;
  description: string;
  /**
   * Expected counts:
   * - lesson: exactly 20 questions
   * - unit: 50-60 questions (only when unit is explicitly complete)
   */
  questions: AssessmentQuestion[];
  timeLimitMinutes?: number;
}

// ==========================================
// 4. TEST RUNTIME / UX CONTRACT
// ==========================================

export type UserAnswerValue =
  | string // for single_choice, text_input, fill_blank
  | string[] // for multi_select, ordering
  | Record<string, string>; // for matching (leftId -> rightId) or classification (itemId -> categoryId)

export interface UserAssessmentAttempt {
  testId: string;
  startedAt: string;
  completedAt?: string;
  answers: Record<string, UserAnswerValue>;
  isSubmitted: boolean;
  score?: number;
  totalPossible?: number;
  percentage?: number;
  correctCount?: number;
  incorrectCount?: number;
}

// ==========================================
// 5. TEACHER AREA / SOLUTIONS MODEL
// ==========================================

export interface TeacherLessonGuide {
  lessonId: string;
  unitId: string;
  pedagogicalObjectives: string[];
  grammarNotes?: string[];
  spellingRules?: string[];
  exerciseSolutions: {
    sourceExercise: string;
    pageNumber: number;
    officialSolution: string;
    didacticExplanation: string;
    commonStudentMistakes?: string[];
  }[];
  lessonTestAnswerKeyRef: string;
}

export interface TeacherUnitSummary {
  unitId: string;
  unitTitle: string;
  isUnitComplete: boolean;
  unitTestRef?: string;
  curriculumCoverageNotes: string;
}
