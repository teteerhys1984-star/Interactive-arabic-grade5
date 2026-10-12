import {
  OPEN_SOURCE_LIMIT_IDS,
  PENDING_SOURCE_RECORD_IDS,
  PENDING_SOURCE_SUBPART_IDS,
} from './sourceMeta';
import {
  UNIT1_REVIEW_ALL_SUBPARTS,
  UNIT1_REVIEW_ANSWERABLE_BRANCHES,
  UNIT1_REVIEW_CLOSING,
  UNIT1_REVIEW_INSTRUCTIONS,
  UNIT1_REVIEW_QUESTIONS,
  UNIT1_REVIEW_TIMING,
  ReviewSubpart,
} from './reviewItems';

/**
 * Source-lock ledger for «تقويم الوحدة الأولى» (pages 36–38).
 *
 * ONE entry per printed element in the audited source
 * (docs/source-audits/unit-1-review-pages-36-38.md), listing the exact number
 * of printed branches each element must expose in the Student Area and cover
 * with a full solution in the Teacher Area.
 */
export interface ReviewSourceLockEntry {
  /** Stable source record ID (order of appearance in the printed pages). */
  id: string;
  page: number;
  /** Descriptive label used in the coverage report. */
  label: string;
  role: 'timing' | 'instructions' | 'question' | 'closing';
  /** Printed question number when the record is a numbered question. */
  printedNumber?: string;
  branchCount: number;
  /**
   * `pending_source` = structurally covered, but at least one printed region of
   * this record could not be verified yet, so it must not be reported as fully
   * verified/complete. See REVIEW_SOURCE_UNCERTAINTIES.
   */
  verification: 'verified' | 'pending_source';
}

export const UNIT1_REVIEW_SOURCE_LOCK: ReviewSourceLockEntry[] = [
  { id: 'U1R-36-01', page: 36, label: 'مهمة ضبط الوقت (الساعتان)', role: 'timing', branchCount: 3 , verification: 'verified' },
  { id: 'U1R-36-02', page: 36, label: 'تعليمات التقويم', role: 'instructions', branchCount: 4 , verification: 'verified' },
  { id: 'U1R-36-03', page: 36, label: 'السؤال ١: تمييز العبارة الصحيحة من غير الصحيحة', role: 'question', printedNumber: '١', branchCount: 4 , verification: 'verified' },
  { id: 'U1R-37-04', page: 37, label: 'السؤال ٢: اختيار الإجابة الصحيحة', role: 'question', printedNumber: '٢', branchCount: 4 , verification: 'verified' },
  { id: 'U1R-37-05', page: 37, label: 'السؤال ٣: استعمال التراكيب في فقرة', role: 'question', printedNumber: '٣', branchCount: 1 , verification: 'verified' },
  { id: 'U1R-37-06', page: 37, label: 'السؤال ٤: تصنيف الكلمات الملوّنة', role: 'question', printedNumber: '٤', branchCount: 4 , verification: 'verified' },
  { id: 'U1R-37-07', page: 37, label: 'السؤال ٥: السبب والنتيجتان', role: 'question', printedNumber: '٥', branchCount: 3 , verification: 'verified' },
  { id: 'U1R-38-08', page: 38, label: 'السؤال ٦: إكمال المخطط (إعلان)', role: 'question', printedNumber: '٦', branchCount: 4 , verification: 'verified' },
  { id: 'U1R-38-09', page: 38, label: 'السؤال ٧: إكمال الفراغ (الهمزة)', role: 'question', printedNumber: '٧', branchCount: 3 , verification: 'verified' },
  { id: 'U1R-38-10', page: 38, label: 'خاتمة الوحدة (بندان)', role: 'closing', branchCount: 2 , verification: 'verified' },
];

export interface ReviewCoverageAuditReport {
  requiredRecords: number;
  lockedBranches: number;
  studentSubparts: number;
  teacherSolutions: number;
  gradedSubparts: number;
  ungradedSubparts: number;
  missingRecords: string[];
  unexpectedRecords: string[];
  branchCountMismatch: { recordId: string; expected: number; actual: number }[];
  duplicateSubpartIds: string[];
  duplicateTeacherSolutionIds: string[];
  subpartsMissingTeacherSolution: string[];
  teacherSolutionsMissingModelAnswer: string[];
  teacherSolutionsMissingSteps: string[];
  emptyStudentPrompts: string[];
  /**
   * true only when EVERY printed record is fully verified against the source.
   * Structural coverage can be complete while this stays false: see
   * pendingSourceRecords / pendingSubparts.
   */
  sourceVerified: boolean;
  pendingSourceRecords: string[];
  pendingSubparts: string[];
  /**
   * Printed regions still unverified but NOT bearing on any question wording,
   * answer or model solution (declared and left open on purpose).
   */
  openNonBlockingLimits: string[];
  status: 'passed' | 'failed';
}

function duplicates(values: string[]): string[] {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

/**
 * Proves the audited source → Student Area → Teacher Area chain for the review:
 * every printed record, every printed branch, and every full teacher solution.
 */
export function auditUnit1ReviewCoverage(
  subparts: ReviewSubpart[] = UNIT1_REVIEW_ALL_SUBPARTS,
): ReviewCoverageAuditReport {
  const lockedIds = UNIT1_REVIEW_SOURCE_LOCK.map((entry) => entry.id);
  const lockedSet = new Set(lockedIds);
  const recordIdsInData = [...new Set(subparts.map((subpart) => subpart.sourceRecordId))];

  const missingRecords = lockedIds.filter((id) => !recordIdsInData.includes(id));
  const unexpectedRecords = recordIdsInData.filter((id) => !lockedSet.has(id));

  const branchCountMismatch = UNIT1_REVIEW_SOURCE_LOCK.map((entry) => ({
    recordId: entry.id,
    expected: entry.branchCount,
    actual: subparts.filter((subpart) => subpart.sourceRecordId === entry.id).length,
  })).filter((row) => row.expected !== row.actual);

  const subpartIds = subparts.map((subpart) => subpart.id);
  const teacherSolutionIds = subparts.map((subpart) => subpart.teacher.id);

  const subpartsMissingTeacherSolution = subparts
    .filter((subpart) => !subpart.teacher || subpart.teacher.id !== subpart.teacherSolutionId)
    .map((subpart) => subpart.id);

  const teacherSolutionsMissingModelAnswer = subparts
    .filter((subpart) => !subpart.teacher.modelAnswer || subpart.teacher.modelAnswer.trim().length === 0)
    .map((subpart) => subpart.teacher.id);

  const teacherSolutionsMissingSteps = subparts
    .filter((subpart) => !subpart.teacher.solutionSteps || subpart.teacher.solutionSteps.length === 0)
    .map((subpart) => subpart.teacher.id);

  const emptyStudentPrompts = subparts
    .filter((subpart) => !subpart.prompt && !subpart.lines?.length)
    .map((subpart) => subpart.id);

  const gradedSubparts = subparts.filter((subpart) => subpart.graded).length;
  const lockedBranches = UNIT1_REVIEW_SOURCE_LOCK.reduce((total, entry) => total + entry.branchCount, 0);
  const pendingSourceRecords = UNIT1_REVIEW_SOURCE_LOCK
    .filter((entry) => entry.verification === 'pending_source')
    .map((entry) => entry.id);
  const pendingSubparts = subparts
    .filter((subpart) => PENDING_SOURCE_SUBPART_IDS.includes(subpart.id))
    .map((subpart) => subpart.id);

  const status =
    missingRecords.length === 0 &&
    unexpectedRecords.length === 0 &&
    branchCountMismatch.length === 0 &&
    duplicates(subpartIds).length === 0 &&
    duplicates(teacherSolutionIds).length === 0 &&
    subpartsMissingTeacherSolution.length === 0 &&
    teacherSolutionsMissingModelAnswer.length === 0 &&
    teacherSolutionsMissingSteps.length === 0 &&
    emptyStudentPrompts.length === 0 &&
    lockedBranches === subparts.length &&
    pendingSourceRecords.length === PENDING_SOURCE_RECORD_IDS.length &&
    UNIT1_REVIEW_ANSWERABLE_BRANCHES === 23 &&
    UNIT1_REVIEW_QUESTIONS.length === 7 &&
    UNIT1_REVIEW_TIMING.subparts.length === 3 &&
    UNIT1_REVIEW_INSTRUCTIONS.subparts.length === 4 &&
    UNIT1_REVIEW_CLOSING.subparts.length === 2
      ? 'passed'
      : 'failed';

  return {
    requiredRecords: UNIT1_REVIEW_SOURCE_LOCK.length,
    lockedBranches,
    studentSubparts: subparts.length,
    teacherSolutions: subparts.length,
    gradedSubparts,
    ungradedSubparts: subparts.length - gradedSubparts,
    missingRecords,
    unexpectedRecords,
    branchCountMismatch,
    duplicateSubpartIds: duplicates(subpartIds),
    duplicateTeacherSolutionIds: duplicates(teacherSolutionIds),
    subpartsMissingTeacherSolution,
    teacherSolutionsMissingModelAnswer,
    teacherSolutionsMissingSteps,
    emptyStudentPrompts,
    sourceVerified: pendingSourceRecords.length === 0,
    pendingSourceRecords,
    pendingSubparts,
    openNonBlockingLimits: OPEN_SOURCE_LIMIT_IDS,
    status,
  };
}
