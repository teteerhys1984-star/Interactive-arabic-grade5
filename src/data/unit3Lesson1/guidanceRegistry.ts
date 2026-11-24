import { U3L1_ACTIVITIES, U3L1Activity } from './activities';
import {
  U3L1_GUIDANCE_NOTICE,
  U3L1_SUGGESTED_ANSWERS,
  u3l1GuidanceNotice,
  u3l1RevealRecord,
} from './guidance';
import {
  buildTeacherGuidanceRegistry,
  TeacherGuidanceRegistry,
  TeacherGuidanceSourceItem,
} from '../guidanceRegistry';

/**
 * U3L1 teacher guidance projection — LINK-ONLY.
 *
 * The lesson's 57 printed activities are declared `guidance_only` (52, with
 * platform-authored suggestions) or `no_approved_content` (5 calligraphy items
 * whose hand-drawn models the source does not contain). The teacher portal shows
 * this registry as its own section, so the teacher can verify what the learner is
 * shown — while the solutions record stays `declared_absence` and no suggestion
 * becomes an approved key.
 *
 * This file adds NO pedagogical content: every entry is a reference to the
 * activity record in `./activities.ts` and the suggestion in `./guidance.ts`.
 */
export const U3L1_GUIDANCE_RECORD_LOCATION = 'src/data/unit3Lesson1/guidance.ts';

const toItem = (activity: U3L1Activity): TeacherGuidanceSourceItem => {
  const suggestion = U3L1_SUGGESTED_ANSWERS[activity.id];
  return {
    activityId: activity.id,
    sourceActivityId: activity.sourceActivityId,
    pageNumber: activity.page,
    section: activity.section,
    printedNumber: activity.printedNumber,
    record: u3l1RevealRecord(activity),
    notice: suggestion ? u3l1GuidanceNotice(activity.id) : U3L1_GUIDANCE_NOTICE,
    gapReason: suggestion ? undefined : activity.gapNote,
  };
};

export const U3L1_GUIDANCE_REGISTRY: TeacherGuidanceRegistry = buildTeacherGuidanceRegistry({
  lessonId: 'unit3-lesson1',
  unitId: 'unit3',
  lessonTitle: 'العُلَماءُ الصِّغارُ',
  recordLocation: U3L1_GUIDANCE_RECORD_LOCATION,
  items: U3L1_ACTIVITIES.map(toItem),
});
