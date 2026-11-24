import React from 'react';
import { CurriculumRegistry, TeacherSolutionsModel } from '../../types/curriculum';
import {
  TeacherGuidanceRegistry,
  declaredContentGaps,
  studentVisibleGuidance,
} from '../../data/guidanceRegistry';
import { ArabicNumber } from '../common/BiDi';
import { toArabicDigits } from '../../utils/arabicDigits';

/**
 * GuidanceSupervisionPanel — «الإشراف على الإرشادات».
 *
 * WHY: the teacher portal shows the guidance itself; supervision needs the
 * STATUS, not the content. This panel answers three questions per lesson:
 *   1. What is the lesson's solutions status? (approved / declared absence / none)
 *   2. How are its records classified? (counts only)
 *   3. Is anything the learner sees missing a teacher counterpart — and does the
 *      declared/served/audited arithmetic match?
 *
 * HARD RULE: no guidance text is rendered here — counts, statuses and mismatches
 * only. The text stays in the lesson's own advisory section.
 */

const STATUS_LABELS = {
  approved: 'حلول معتمدة',
  declared_absence: 'غياب معلن وموثَّق',
  unregistered: 'غير مسجل',
} as const;

const statusOf = (guide: TeacherSolutionsModel | undefined): keyof typeof STATUS_LABELS => {
  if (!guide) return 'unregistered';
  if (guide.kind === 'approved') return 'approved';
  if (guide.kind === 'declared_absence') return 'declared_absence';
  return 'unregistered';
};

export interface GuidanceSupervisionPanelProps {
  curriculum: CurriculumRegistry;
  teacherGuides: TeacherSolutionsModel[];
  guidanceRegistries: TeacherGuidanceRegistry[];
}

export const GuidanceSupervisionPanel: React.FC<GuidanceSupervisionPanelProps> = ({
  curriculum,
  teacherGuides,
  guidanceRegistries,
}) => {
  const guidesById = new Map(teacherGuides.map((guide) => [guide.lessonId, guide]));
  const registriesById = new Map(guidanceRegistries.map((entry) => [entry.lessonId, entry]));

  const rows = curriculum.units.flatMap((unit) =>
    unit.lessons.map((lesson) => {
      const guide = guidesById.get(lesson.metadata.id);
      const registry = registriesById.get(lesson.metadata.id);
      const status = statusOf(guide);
      const visible = registry ? studentVisibleGuidance(registry).length : 0;
      const gaps = registry ? declaredContentGaps(registry).length : 0;

      /* Supervision findings — intentionally text-free. */
      const findings: string[] = [];
      if (!registry && visible === 0 && guide?.kind === 'declared_absence') {
        const note = guide.declaration?.studentGuidanceNote?.trim();
        if (note) findings.push('تنبيه الطالب موثق بلا سجل إرشادات معلمي.');
        else findings.push('غياب معلن بلا إرشادات — لا مقابل مطلوب.');
      }
      if (registry && guide?.kind === 'declared_absence' && registry.counts.approved_key > 0) {
        findings.push('سجل الإرشادات يعلن مفتاحًا معتمدًا مع غياب معلن.');
      }
      if (registry && registry.declaredActivityCount !== registry.counts.total) {
        findings.push('عدد الأنشطة المعلن لا يطابق أعداد التصنيف.');
      }
      if (registry && visible > 0 && guide?.kind === 'declared_absence') {
        findings.push('مقابل معلمي قائم — يُعرض في قسم مستقل ليس حلولًا.');
      }

      return {
        unitId: unit.metadata.id,
        lessonId: lesson.metadata.id,
        title: lesson.metadata.title,
        status,
        counts: registry?.counts,
        visible,
        gaps,
        findings,
      };
    }),
  );

  const lessonsWithGuidance = rows.filter((row) => row.counts).length;
  const mismatchCount = rows.filter((row) =>
    row.findings.some(
      (finding) =>
        finding.includes('بلا سجل') ||
        finding.includes('يعلن مفتاحًا') ||
        finding.includes('لا يطابق'),
    ),
  ).length;

  return (
    <section className="guidance-supervision" aria-labelledby="guidance-supervision-heading">
      <h4 id="guidance-supervision-heading" className="guidance-supervision-heading">
        الإشراف على الإرشادات — الحالة والأعداد
      </h4>
      <p className="guidance-supervision-lead">
        حالة الحلول لكل درس وأعداد تصنيف الإرشادات وأي نقص أو عدم تطابق. تُعرض الأعداد
        والحالات فقط؛ نصوص الإرشادات تبقى في قسم الدرس المستقل ولا تُكرَّر هنا.
      </p>

      <ul className="guidance-supervision-stats">
        <li>
          <ArabicNumber value={toArabicDigits(lessonsWithGuidance)} /> درسًا له سجل إرشادات
        </li>
        <li>
          <ArabicNumber value={toArabicDigits(mismatchCount)} /> درسًا فيه ملاحظة إشراف
        </li>
      </ul>

      <div className="teacher-coverage-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">الدرس</th>
              <th scope="col">حالة الحلول</th>
              <th scope="col">معتمد</th>
              <th scope="col">إرشاد مقترح</th>
              <th scope="col">بلا محتوى معتمد</th>
              <th scope="col">ظاهر للطالب</th>
              <th scope="col">ملاحظة الإشراف</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.lessonId} data-lesson-id={row.lessonId}>
                <td>{row.title}</td>
                <td>{STATUS_LABELS[row.status]}</td>
                <td>
                  {row.counts ? (
                    <ArabicNumber value={toArabicDigits(row.counts.approved_key)} />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  {row.counts ? (
                    <ArabicNumber value={toArabicDigits(row.counts.guidance_only)} />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  {row.counts ? (
                    <ArabicNumber value={toArabicDigits(row.counts.no_approved_content)} />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <ArabicNumber value={toArabicDigits(row.visible)} />
                </td>
                <td>{row.findings.length > 0 ? row.findings.join(' ') : 'مطابق'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
