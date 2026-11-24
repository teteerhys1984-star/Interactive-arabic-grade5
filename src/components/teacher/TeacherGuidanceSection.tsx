import React from 'react';
import {
  TeacherGuidanceLink,
  TeacherGuidanceRegistry,
  declaredContentGaps,
  studentVisibleGuidance,
  teacherOnlyGuidance,
} from '../../data/guidanceRegistry';
import { resolveAnswerReveal } from '../common/answerDisclosure';
import { ArabicNumber } from '../common/BiDi';
import { toArabicDigits } from '../../utils/arabicDigits';

/**
 * TeacherGuidanceSection — «إرشادات مقترحة من المنصة — ليست حلولًا معتمدة».
 *
 * WHY: a lesson with no approved key (declared absence) still shows the learner
 * platform suggestions. The teacher must be able to SEE that counterpart without
 * the portal pretending the suggestions are solutions. This section is rendered
 * INSIDE the declared-absence view but is a separate, explicitly-labelled block:
 *
 *   advisory section  ≠  approved solutions view
 *
 * HARD RULES
 *  - The heading names it exactly as approved and says it is not approved.
 *  - Every item carries its SOURCE, its CLASSIFICATION and its NOTICE.
 *  - The text itself is read from the ORIGINAL record through the single
 *    resolver (`resolveAnswerReveal(record, 'teacher')`); the registry stores
 *    links only. Nothing is copied, retyped or re-derived here.
 *  - `no_approved_content` items are listed as declared gaps with the reason —
 *    no answer is invented for them.
 *  - Counts are shown, so a mismatch between what the learner can reveal and what
 *    the teacher sees is visible rather than silent.
 */

export const TEACHER_GUIDANCE_HEADING =
  'إرشادات مقترحة من المنصة — ليست حلولًا معتمدة';

export const TEACHER_GUIDANCE_LEAD =
  'هذه الإرشادات أعدّتها المنصة لمساعدة المتعلم على بناء إجابته، وتظهر له في «أظهر الجواب» موسومةً بأنها ليست من الكتاب ولا من دليل المعلّم. لا يُعدّ أي منها حلًّا معتمدًا، ولا تصحيح آلي، ولا درجة.';

const CLASSIFICATION_LABELS: Record<string, string> = {
  approved_key: 'مفتاح معتمد',
  guidance_only: 'إرشاد مقترح (غير معتمد)',
  teacher_only: 'مادة للمعلم فقط',
  no_approved_content: 'لا محتوى معتمد',
};

const CountChip: React.FC<{ label: string; value: number; tone?: 'default' | 'muted' }> = ({
  label,
  value,
  tone = 'default',
}) => (
  <li className={`teacher-guidance-count teacher-guidance-count--${tone}`}>
    <span className="teacher-guidance-count-num">
      <ArabicNumber value={toArabicDigits(value)} />
    </span>
    <span className="teacher-guidance-count-label">{label}</span>
  </li>
);

/** One served item: source + classification + notice + the original record text. */
const GuidanceItem: React.FC<{ link: TeacherGuidanceLink; registry: TeacherGuidanceRegistry }> = ({
  link,
  registry,
}) => {
  const record = registry.readRecord(link.activityId);
  /* The text is read through the ONE resolver, in its teacher scope. */
  const teacherView = record ? resolveAnswerReveal(record, 'teacher') : null;

  return (
    <li className="teacher-guidance-item" data-guidance-id={link.activityId}>
      <div className="teacher-guidance-item-head">
        <span className="teacher-guidance-item-title">
          {link.section ? `${link.section}` : 'نشاط'}
          {link.printedNumber && link.printedNumber !== '—' ? ` — ${link.printedNumber}` : ''}
        </span>
        <span className={`teacher-guidance-kind teacher-guidance-kind--${link.classification}`}>
          {CLASSIFICATION_LABELS[link.classification] ?? link.classification}
        </span>
      </div>

      <dl className="teacher-guidance-meta">
        <dt>المصدر</dt>
        <dd>
          <code>{link.sourceActivityId ?? link.activityId}</code>
          {link.pageNumber ? (
            <>
              {' '}
              — صفحة <ArabicNumber value={toArabicDigits(link.pageNumber)} />
            </>
          ) : null}
        </dd>
        <dt>سجل الإرشاد</dt>
        <dd>
          <code>{link.sourceRef}</code>
        </dd>
      </dl>

      {teacherView ? (
        <div className="teacher-guidance-body">
          <p className="teacher-guidance-answer">{teacherView.modelAnswer}</p>
          {teacherView.explanation && (
            <p className="teacher-guidance-explain">{teacherView.explanation}</p>
          )}
        </div>
      ) : (
        link.gapReason && <p className="teacher-guidance-gap">{link.gapReason}</p>
      )}

      <p className="teacher-guidance-notice" role="note">
        <strong>تنبيه:</strong> {link.notice}
      </p>
    </li>
  );
};

export interface TeacherGuidanceSectionProps {
  registry: TeacherGuidanceRegistry;
}

export const TeacherGuidanceSection: React.FC<TeacherGuidanceSectionProps> = ({ registry }) => {
  const visible = studentVisibleGuidance(registry);
  const gaps = declaredContentGaps(registry);
  const teacherOnly = teacherOnlyGuidance(registry);
  const { counts } = registry;

  return (
    <section
      className="teacher-guidance-section"
      aria-labelledby="teacher-guidance-heading"
      data-lesson-id={registry.lessonId}
    >
      <h4 id="teacher-guidance-heading" className="teacher-guidance-heading">
        {TEACHER_GUIDANCE_HEADING}
      </h4>
      <p className="teacher-guidance-lead">{TEACHER_GUIDANCE_LEAD}</p>

      <ul className="teacher-guidance-counts" aria-label="أعداد تصنيف الإرشادات في هذا الدرس">
        <CountChip label="إجمالي الأنشطة المسجَّلة" value={counts.total} />
        <CountChip label="إرشاد مقترح (غير معتمد)" value={counts.guidance_only} />
        <CountChip label="مفتاح معتمد" value={counts.approved_key} tone={counts.approved_key === 0 ? 'muted' : 'default'} />
        <CountChip label="لا محتوى معتمد" value={counts.no_approved_content} tone="muted" />
        {counts.teacher_only > 0 && (
          <CountChip label="مادة للمعلم فقط" value={counts.teacher_only} tone="muted" />
        )}
      </ul>

      {visible.length === 0 ? (
        <p className="teacher-guidance-note">
          لا إرشادات ظاهرة للطالب في هذا الدرس؛ لا يوجد ما يعرضه «أظهر الجواب».
        </p>
      ) : (
        <ol className="teacher-guidance-list">
          {visible.map((link) => (
            <GuidanceItem key={link.activityId} link={link} registry={registry} />
          ))}
        </ol>
      )}

      {teacherOnly.length > 0 && (
        <details className="teacher-guidance-extras">
          <summary>
            مادة للمعلم فقط لا تظهر للطالب:{' '}
            <ArabicNumber value={toArabicDigits(teacherOnly.length)} /> نشاطاً
          </summary>
          <ul className="teacher-guidance-list">
            {teacherOnly.map((link) => (
              <GuidanceItem key={link.activityId} link={link} registry={registry} />
            ))}
          </ul>
        </details>
      )}

      {gaps.length > 0 && (
        <details className="teacher-guidance-gaps">
          <summary>
            فجوات معلنة بلا محتوى معتمد (لا إجابة مخترعة):{' '}
            <ArabicNumber value={toArabicDigits(gaps.length)} /> نشاطاً
          </summary>
          <ul className="teacher-guidance-list teacher-guidance-list--gaps">
            {gaps.map((link) => (
              <GuidanceItem key={link.activityId} link={link} registry={registry} />
            ))}
          </ul>
        </details>
      )}
    </section>
  );
};
