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

/**
 * The lesson's ORIGINAL activity ledger, exposed as data.
 *
 * A13 must compare the registry against the source, not trust the registry's own
 * claims. `activityIds` alone cannot prove anything (a registry could omit an id
 * and still list it as covered), so every registry carries a live adapter back to
 * the authoritative records. A13 calls it with the ids it derived from the
 * curriculum and compares ids, classifications and `sourceRef`s one by one.
 */
export interface TeacherGuidanceSource {
  /** Ids of the lesson's own answer records, in printed order. */
  activityIds(): string[];
  /** The ORIGINAL record for an id, exactly as the single resolver consumes it. */
  record(activityId: string): DisclosureBearingRecord | null;
  /**
   * Source-lock activity id (`U3L1-73-01`) for a lesson activity id, so the audit
   * can verify each link points at the right printed activity.
   */
  sourceActivityId(activityId: string): string | undefined;
}

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
  /**
   * LIVE handle on the lesson's original records. Never text, never a copy — it
   * is the authority A13 compares the links against.
   */
  source: TeacherGuidanceSource;
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
  source: TeacherGuidanceSource;
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
    source: input.source,
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

/* ------------------------------------------------------------------ */
/* A13 helpers — pure comparisons against the ORIGINAL records          */
/* ------------------------------------------------------------------ */

/** The classification the record's own disclosure declares, fail-closed. */
export function declaredClassification(record: DisclosureBearingRecord | null): AnswerDisclosureKind {
  const kind = record?.disclosure?.kind;
  return kind === 'approved_key' ||
    kind === 'guidance_only' ||
    kind === 'teacher_only' ||
    kind === 'no_approved_content'
    ? kind
    : 'no_approved_content';
}

/** The reference the record's own disclosure declares, or an empty string. */
export function declaredSourceRef(record: DisclosureBearingRecord | null): string {
  return record?.disclosure?.sourceRef?.trim() ?? '';
}

/** Structural result of comparing one registry against its original records. */
export interface GuidanceSourceComparison {
  /** Records whose link is missing entirely. */
  missing: string[];
  /** Links that point at an id the lesson does not have. */
  extra: string[];
  /** Links whose classification disagrees with the record's disclosure. */
  classificationDrift: { activityId: string; declared: AnswerDisclosureKind; linked: AnswerDisclosureKind }[];
  /** Links whose sourceRef disagrees with the record's disclosure. */
  sourceRefDrift: { activityId: string; declared: string; linked: string }[];
  /** Links whose source-lock id disagrees with the record's own source id. */
  sourceIdDrift: { activityId: string; declared?: string; linked?: string }[];
  /** Ids the learner can reveal (record declares a text-bearing kind with text). */
  studentVisible: string[];
  /** Student-visible ids that have no usable teacher counterpart. */
  withoutTeacherCounterpart: string[];
  /** Records that cannot be resolved through the module's own adapter. */
  unresolved: string[];
}

/**
 * Compares a registry's links against the ORIGINAL records of the lesson.
 *
 * LINK-ONLY: this reads ids, classifications, `sourceRef`s and source-lock ids.
 * It never reads or compares answer text, so it cannot become a second data
 * source for answers.
 */
export function compareGuidanceToSource(
  registry: TeacherGuidanceRegistry,
  isStudentRevealable: (record: DisclosureBearingRecord) => boolean,
): GuidanceSourceComparison {
  const sourceIds = registry.source.activityIds();
  const sourceIdSet = new Set(sourceIds);
  const byId = new Map(registry.links.map((link) => [link.activityId, link]));

  const comparison: GuidanceSourceComparison = {
    missing: [],
    extra: [],
    classificationDrift: [],
    sourceRefDrift: [],
    sourceIdDrift: [],
    studentVisible: [],
    withoutTeacherCounterpart: [],
    unresolved: [],
  };

  for (const activityId of sourceIds) {
    const link = byId.get(activityId);
    if (!link) {
      comparison.missing.push(activityId);
      continue;
    }
    const record = registry.source.record(activityId);
    if (!record) {
      comparison.unresolved.push(activityId);
      continue;
    }

    const declared = declaredClassification(record);
    if (link.classification !== declared) {
      comparison.classificationDrift.push({
        activityId,
        declared,
        linked: link.classification,
      });
    }

    const declaredRef = declaredSourceRef(record);
    if (declaredRef.length > 0 && link.sourceRef.trim() !== declaredRef) {
      comparison.sourceRefDrift.push({
        activityId,
        declared: declaredRef,
        linked: link.sourceRef.trim(),
      });
    }

    /*
     * The printed source id is mandatory whenever the original record has one:
     * an OMITTED `sourceActivityId` is drift exactly like a wrong one. Without
     * this, a link could drop the id and remain unattributable to its printed
     * task while still passing the audit.
     */
    const declaredSourceId = registry.source.sourceActivityId(activityId);
    if (declaredSourceId && link.sourceActivityId !== declaredSourceId) {
      comparison.sourceIdDrift.push({
        activityId,
        declared: declaredSourceId,
        linked: link.sourceActivityId,
      });
    }

    if (isStudentRevealable(record)) {
      comparison.studentVisible.push(activityId);
      /* A counterpart exists only if the link is the very record the learner sees. */
      if (!link.sourceRef.trim() || link.classification !== declared) {
        comparison.withoutTeacherCounterpart.push(activityId);
      }
    }
  }

  for (const link of registry.links) {
    if (!sourceIdSet.has(link.activityId)) comparison.extra.push(link.activityId);
  }

  return comparison;
}
