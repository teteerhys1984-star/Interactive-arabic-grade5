import { AnswerDisclosureKind } from '../types/curriculum';
import type { DisclosureBearingRecord } from '../components/common/answerDisclosure';

/**
 * TEACHER GUIDANCE PROJECTION — link-only registry (PR #26 / U3L1 follow-up).
 *
 * WHY THIS EXISTS
 * A lesson whose source carries no approved answer key is registered in the
 * teacher portal as a `declared_absence` (PR #24). The student still sees
 * platform-authored suggestions (`guidance_only`) through the shared
 * «أظهر الجواب» mechanism — so the teacher had no counterpart view of what the
 * learner is being shown. This registry closes that asymmetry WITHOUT touching
 * the PR #24 model:
 *
 *   original record (data, unchanged)
 *        │  disclosure + text stay where they are
 *        ▼
 *   TeacherGuidanceLink  ← ids, classification, source reference, notice ONLY
 *        │
 *        ▼
 *   resolveAnswerReveal(record, 'teacher')   ← the single existing resolver
 *
 * HARD RULES
 *  - LINK-ONLY: a link never carries an answer, an explanation or any answer
 *    text, and this module never becomes a second source of pedagogical data.
 *    The text is read from the original record through `readRecord`.
 *  - NO MODEL CHANGE: nothing here alters `AnswerDisclosure`, `TeacherSolutionsModel`
 *    or `declared_absence`; a guidance link is not a solution and never becomes
 *    `approved_key` (audit A13 rejects that contradiction).
 *  - ONE DECISION SOURCE: a link's classification is copied from the record's own
 *    disclosure — never re-decided here. If the data says `guidance_only`, the
 *    link says `guidance_only`.
 *  - The teacher surface is the only consumer; the student surface is untouched.
 */

/** One source activity projected for the teacher, as a reference only. */
export interface TeacherGuidanceSourceItem {
  /** Lesson activity id (the original record's own id). */
  activityId: string;
  /** Source-lock activity id (e.g. `U3L1-73-01`), when the lesson has one. */
  sourceActivityId?: string;
  /** Printed page of the source activity. */
  pageNumber?: number;
  /** Printed section title (e.g. «الخط»). */
  section?: string;
  /** Printed number within the section, when the book prints one. */
  printedNumber?: string;
  /**
   * The ORIGINAL record, exactly as the single resolver consumes it. Held as a
   * reference for `readRecord`; no text is extracted, copied or normalized.
   */
  record: DisclosureBearingRecord;
  /**
   * Honesty notice displayed with this item (never the answer text). This is the
   * wording the student also sees, so teacher and learner read the same caveat.
   */
  notice: string;
  /** Why this item has no approved content at all (source gaps only). */
  gapReason?: string;
}

/** The link-only projection of one record — the registry stores nothing else. */
export interface TeacherGuidanceLink {
  activityId: string;
  sourceActivityId?: string;
  pageNumber?: number;
  section?: string;
  printedNumber?: string;
  /** Link target: the record's own declared source reference. */
  sourceRef: string;
  /** Copied from the record's disclosure — never re-decided in the registry. */
  classification: AnswerDisclosureKind;
  /** Per-item notice; the answer text is NOT here. */
  notice: string;
  /** Present only for declared source gaps (no approved content). */
  gapReason?: string;
}

export interface TeacherGuidanceCounts {
  total: number;
  approved_key: number;
  guidance_only: number;
  teacher_only: number;
  no_approved_content: number;
}

export interface TeacherGuidanceRegistry {
  lessonId: string;
  unitId: string;
  lessonTitle: string;
  /** Module that owns the original records — a link target, never content. */
  recordLocation: string;
  /** Number of source activities this registry is required to cover. */
  declaredActivityCount: number;
  /**
   * Ids of EVERY original record of the lesson (no text). Audit A13 uses them to
   * prove the registry is complete: a student-visible record can never exist
   * without a teacher counterpart.
   */
  activityIds: string[];
  /** Link-only entries, one per source activity. */
  links: TeacherGuidanceLink[];
  /** Derived from `links`; audit A13 re-derives and compares. */
  counts: TeacherGuidanceCounts;
  /** Reads the ORIGINAL record from its own module (header + text). */
  readRecord(activityId: string): DisclosureBearingRecord | null;
}

const emptyCounts = (): TeacherGuidanceCounts => ({
  total: 0,
  approved_key: 0,
  guidance_only: 0,
  teacher_only: 0,
  no_approved_content: 0,
});

/**
 * Builds a link-only registry from the lesson's own records.
 *
 * Nothing is inferred: the classification comes from `record.disclosure?.kind`
 * (an unknown/missing kind is recorded as `no_approved_content`, i.e. nothing is
 * revealed — fail closed — and audit A13 reports it as an invalid disclosure).
 */
export function buildTeacherGuidanceRegistry(input: {
  lessonId: string;
  unitId: string;
  lessonTitle: string;
  recordLocation: string;
  items: TeacherGuidanceSourceItem[];
}): TeacherGuidanceRegistry {
  const links: TeacherGuidanceLink[] = [];
  const byId = new Map<string, DisclosureBearingRecord>();
  const counts = emptyCounts();

  for (const item of input.items) {
    const kind = item.record.disclosure?.kind;
    const classification: AnswerDisclosureKind =
      kind === 'approved_key' ||
      kind === 'guidance_only' ||
      kind === 'teacher_only' ||
      kind === 'no_approved_content'
        ? kind
        : 'no_approved_content';

    byId.set(item.activityId, item.record);
    counts.total += 1;
    counts[classification] += 1;

    links.push({
      activityId: item.activityId,
      sourceActivityId: item.sourceActivityId,
      pageNumber: item.pageNumber,
      section: item.section,
      printedNumber: item.printedNumber,
      sourceRef:
        item.record.disclosure?.sourceRef?.trim() ||
        `${input.recordLocation}#${item.activityId}`,
      classification,
      notice: item.notice,
      gapReason: item.gapReason,
    });
  }

  return {
    lessonId: input.lessonId,
    unitId: input.unitId,
    lessonTitle: input.lessonTitle,
    recordLocation: input.recordLocation,
    declaredActivityCount: input.items.length,
    activityIds: input.items.map((item) => item.activityId),
    links,
    counts,
    readRecord: (activityId: string) => byId.get(activityId) ?? null,
  };
}

/** Entries the learner can actually reveal (the teacher needs a counterpart). */
export const studentVisibleGuidance = (registry: TeacherGuidanceRegistry): TeacherGuidanceLink[] =>
  registry.links.filter(
    (link) => link.classification === 'guidance_only' || link.classification === 'approved_key',
  );

/** Declared source gaps: no approved content, therefore no answer anywhere. */
export const declaredContentGaps = (registry: TeacherGuidanceRegistry): TeacherGuidanceLink[] =>
  registry.links.filter((link) => link.classification === 'no_approved_content');

/** Teacher-only material: reachable for the teacher, never for the learner. */
export const teacherOnlyGuidance = (registry: TeacherGuidanceRegistry): TeacherGuidanceLink[] =>
  registry.links.filter((link) => link.classification === 'teacher_only');

/** True when the registry has anything the learner can reveal. */
export const hasStudentVisibleGuidance = (registry: TeacherGuidanceRegistry): boolean =>
  registry.counts.guidance_only + registry.counts.approved_key > 0;
