import React, { useEffect, useRef, useState } from 'react';
import {
  ApprovedLessonSolutions,
  CurriculumRegistry,
  DeclaredAbsenceLessonSolutions,
  Lesson,
  TeacherSolutionsModel,
  Unit,
} from '../../types/curriculum';
import { ArabicNumber } from '../common/BiDi';
import { toArabicDigits } from '../../utils/arabicDigits';
import { Breadcrumbs } from '../ui/PageChrome';

/**
 * Teacher solutions browser — «الأدلة وحلول التدريبات» drill-down.
 *
 * Hierarchy enforced here: registered unit → registered lesson inside it →
 * that lesson's guide and solutions ONLY. Unit reviews («تقويم الوحدة») are
 * first-class, independent entries under their unit — never a lesson, and
 * never part of another lesson's solutions.
 *
 * Hard rules (approved spec):
 *  - no pedagogical content is created, rewritten or reordered here; the guide
 *    body renders the very same markup/class hooks as before;
 *  - lessons registered in the curriculum registry without a teacher guide
 *    render an explicit absence note — never invented solutions;
 *  - a registered unit review without an approved solutions entry renders the
 *    approved absence note — never invented solutions;
 *  - guides whose lessonId does NOT match a registered lesson are surfaced in a
 *    visible alert, never dropped silently.
 *
 * View state lives inside the Teacher Area (mounted tab), so password
 * authorization persists while navigating; leaving the teacher route still
 * re-locks the gate (state owned by TeacherAreaShell).
 */

export interface UnitReviewSolutionsEntry {
  /** Registry id of the unit this entry belongs to. */
  unitId: string;
  /** Visible and accessible label, e.g. «حلول تقويم الوحدة الأولى». */
  label: string;
  /** Pre-rendered solutions element; when present the entry opens its own view. */
  content?: React.ReactNode;
  /** Approved absence wording rendered as a static note when no content is registered. */
  absenceNote?: string;
}

export interface TeacherSolutionsBrowserProps {
  curriculum: CurriculumRegistry;
  teacherGuides: TeacherSolutionsModel[];
  unitReviewSolutions?: UnitReviewSolutionsEntry[];
}

type SolutionsView =
  | { level: 'units' }
  | { level: 'unit'; unitId: string }
  | { level: 'lesson'; lessonId: string }
  | { level: 'review'; unitId: string };

const UNIT_ORDINALS = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة'];
const LESSON_ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر'];

const unitOrdinal = (order: number): string => UNIT_ORDINALS[order - 1] ?? toArabicDigits(order);
const lessonOrdinal = (order: number): string => LESSON_ORDINALS[order - 1] ?? toArabicDigits(order);

const byOrder = <T extends { metadata: { order: number } }>(items: T[]): T[] =>
  [...items].sort((a, b) => a.metadata.order - b.metadata.order);

const lessonPageRange = (lesson: Lesson): { start: number; end: number } | null => {
  if (lesson.metadata.sources.length === 0) return null;
  const pages = lesson.metadata.sources.flatMap((source) => [
    source.pageNumber,
    source.pageEndNumber ?? source.pageNumber,
  ]);
  return { start: Math.min(...pages), end: Math.max(...pages) };
};

const LESSON_MISSING_NOTE =
  'لا توجد حلول معتمدة لهذا الدرس حاليًا، ولن تُعرض حلول تقريبية أو تخمينية.';
const DEFAULT_REVIEW_ABSENCE_NOTE =
  'لا توجد حلول معلم معتمدة حاليًا لتقويم هذه الوحدة، ولن تُعرض حلول تقريبية أو تخمينية.';

/* ------------------------------------------------------------------ */
/* Three honest states of a lesson in the teacher portal                */
/*  1. approved guide      → full solutions view (open button)          */
/*  2. declared absence    → documented gap, NO solutions, NO button    */
/*  3. not registered      → legacy missing note, NO button             */
/* ------------------------------------------------------------------ */

const LESSON_DECLARED_ABSENCE_NOTE =
  'لا توجد حلول معتمدة لهذا الدرس في المصدر المتاح، والغياب معلن وموثق أدناه: لن تُعرض حلول تقريبية أو تخمينية.';

const isApproved = (record: TeacherSolutionsModel): record is ApprovedLessonSolutions =>
  record.kind === 'approved';

const isDeclaredAbsence = (
  record: TeacherSolutionsModel,
): record is DeclaredAbsenceLessonSolutions => record.kind === 'declared_absence';

const ApprovedGuideBody: React.FC<{ guide: ApprovedLessonSolutions }> = ({ guide }) => (
  <GuideBody guide={guide} />
);

/**
 * DeclaredAbsenceBody — the documented-gap view.
 *
 * It renders the declaration (reason / source / date / deferred task) and the
 * audited source ledger, so the teacher can verify that the absence is real and
 * sourced. It NEVER renders an answer, a model solution or an empty solution
 * card: there is nothing approved to show, and no guess is offered instead.
 */
const DeclaredAbsenceBody: React.FC<{ record: DeclaredAbsenceLessonSolutions }> = ({ record }) => {
  const { declaration, sourceRecords } = record;
  return (
    <div className="teacher-guide teacher-declared-absence">
      <div className="guide-objectives teacher-absence-reason">
        <h4>إعلان غياب موثَّق</h4>
        <p>{declaration.reason}</p>
        <ul>
          <li>مستند الإثبات: <code>{declaration.sourceRef}</code></li>
          <li>تاريخ الإعلان: <ArabicNumber value={toArabicDigits(declaration.declaredOn)} /></li>
          <li>المهمة اللاحقة: {declaration.deferredContentTask}</li>
        </ul>
      </div>
      <div className="guide-objectives teacher-absence-source-limits">
        <h4>ما لا يمكن عرضه هنا</h4>
        <ul>
          <li>لا حلول تدريبات، ولا مفاتيح إجابة، ولا تصحيح آلي لهذا الدرس.</li>
          <li>لا أهداف تربوية، لأن استنتاجها من نصّ الدرس ممنوع بقرار المالك.</li>
          <li>لا تُملأ هذه الفجوة بالتخمين؛ تُملأ بمهمة محتوى لاحقة بمصدر معتمد.</li>
        </ul>
      </div>
      <details className="teacher-coverage-ledger teacher-absence-ledger">
        <summary>
          سجل المصادر المدقق: <ArabicNumber value={toArabicDigits(sourceRecords.length)} /> نشاطاً مطبوعاً
        </summary>
        <p>يثبت هذا السجل وجود الأنشطة المطبوعة وموضع كل واحد منها، ولا يمثل حلولاً.</p>
        <div className="teacher-coverage-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">نشاط المصدر</th>
                <th scope="col">الصفحة</th>
                <th scope="col">خطوة الدرس</th>
                <th scope="col">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {sourceRecords.map((record_) => (
                <tr key={record_.sourceActivityId}>
                  <td>{record_.sourceActivityId}</td>
                  <td><ArabicNumber value={toArabicDigits(record_.pageNumber)} /></td>
                  <td>{record_.lessonStepId}</td>
                  <td>غياب معلن للحل</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
};

/** One entry point for all three states — used by the lesson level view. */
const LessonSolutionsBody: React.FC<{ record: TeacherSolutionsModel | undefined }> = ({ record }) => {
  if (!record) return <p className="teacher-missing-note">{LESSON_MISSING_NOTE}</p>;
  if (isDeclaredAbsence(record)) return <DeclaredAbsenceBody record={record} />;
  if (isApproved(record)) return <ApprovedGuideBody guide={record} />;
  /* Unknown kind: fail closed — never render a solutions body. */
  return <p className="teacher-missing-note">{LESSON_MISSING_NOTE}</p>;
};

/* ------------------------------------------------------------------ */
/* Guide body — the exact pre-existing guide markup (content untouched) */
/* ------------------------------------------------------------------ */
const GuideBody: React.FC<{ guide: ApprovedLessonSolutions }> = ({ guide }) => (
  <div className="teacher-guide">
    <div className="guide-objectives">
      <h4>الأهداف التربوية</h4>
      <ul>
        {guide.pedagogicalObjectives.map((objective, index) => (
          <li key={index}>{objective}</li>
        ))}
      </ul>
    </div>
    {guide.grammarNotes && guide.grammarNotes.length > 0 && (
      <div className="guide-objectives">
        <h4>شروح القواعد التفصيلية</h4>
        <ul>
          {guide.grammarNotes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    )}
    {guide.spellingRules && guide.spellingRules.length > 0 && (
      <div className="guide-objectives">
        <h4>شروح الإملاء التفصيلية</h4>
        <ul>
          {guide.spellingRules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      </div>
    )}
    {guide.sourceAlerts && guide.sourceAlerts.length > 0 && (
      <div className="guide-objectives teacher-source-alerts">
        <h4>تنبيهات حدود المصدر</h4>
        <ul>
          {guide.sourceAlerts.map((alert, index) => (
            <li key={index}>{alert}</li>
          ))}
        </ul>
      </div>
    )}
    {guide.sourceCoverage && (
      <details className="teacher-coverage-ledger">
        <summary>
          سجل تغطية المصدر: <ArabicNumber value={toArabicDigits(guide.sourceCoverage.length)} /> نشاطاً
        </summary>
        <p>
          يثبت هذا السجل المسار: نشاط المصدر ← خطوة الدرس/نشاط الطالب ← حل المعلم.
        </p>
        <div className="teacher-coverage-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">المصدر</th>
                <th scope="col">الصفحة</th>
                <th scope="col">خطوة الدرس</th>
                <th scope="col">نشاط الطالب</th>
                <th scope="col">حل المعلم</th>
                <th scope="col">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {guide.sourceCoverage.map((entry) => (
                <tr key={entry.sourceActivityId}>
                  <td>{entry.sourceActivityId}</td>
                  <td><ArabicNumber value={toArabicDigits(entry.pageNumber)} /></td>
                  <td>{entry.lessonStepId}</td>
                  <td>{entry.lessonActivityId}</td>
                  <td>{entry.teacherSolutionId}</td>
                  <td>{entry.availability === 'available' ? 'ممثل' : 'فجوة مصدر معلنة'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    )}
    {guide.exerciseSolutions.map((solution, index) => (
      <article key={solution.id ?? index} className="guide-solution-card">
        <header className="guide-solution-head">
          <span className="guide-ex-name">{solution.sourceExercise}</span>
          <span className="guide-page">صفحة <ArabicNumber value={toArabicDigits(solution.pageNumber)} /></span>
        </header>
        <p className="guide-answer">الحل النموذجي: {solution.officialSolution}</p>
        <p className="guide-explain">الشرح التربوي: {solution.didacticExplanation}</p>
        {solution.commonStudentMistakes?.map((mistake, mistakeIndex) => (
          <p key={mistakeIndex} className="guide-mistake">⚠ {mistake}</p>
        ))}
      </article>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                          */
/* ------------------------------------------------------------------ */
const LessonChip: React.FC<{ order: number }> = ({ order }) => (
  <span className="teacher-order-badge">الدرس {lessonOrdinal(order)}</span>
);

const StatusPill: React.FC<{ tone: 'ok' | 'missing' | 'muted'; children: React.ReactNode }> = ({ tone, children }) => (
  <span className={`teacher-pill teacher-pill--${tone}`}>{children}</span>
);

const PageRangeMeta: React.FC<{ range: { start: number; end: number } | null }> = ({ range }) => {
  if (!range) return null;
  return (
    <p className="teacher-card-meta">
      صفحات الكتاب <ArabicNumber value={toArabicDigits(range.start)} />–<ArabicNumber value={toArabicDigits(range.end)} />
    </p>
  );
};

const BackBar: React.FC<{
  onBackToUnit: () => void;
  onBackToUnits: () => void;
  unitTitle: string;
}> = ({ onBackToUnit, onBackToUnits, unitTitle }) => (
  <div className="teacher-backbar">
    <button
      type="button"
      className="btn btn-primary"
      onClick={onBackToUnit}
      aria-label={`العودة إلى قائمة دروس ${unitTitle}`}
    >
      العودة إلى قائمة دروس الوحدة
    </button>
    <button type="button" className="btn btn-ghost" onClick={onBackToUnits}>
      الوحدات
    </button>
  </div>
);

export const TeacherSolutionsBrowser: React.FC<TeacherSolutionsBrowserProps> = ({
  curriculum,
  teacherGuides,
  unitReviewSolutions = [],
}) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [view, setView] = useState<SolutionsView>({ level: 'units' });

  // D11: move programmatic focus to the level heading on every level change.
  useEffect(() => {
    headingRef.current?.focus();
  }, [view]);

  const units = byOrder(curriculum.units);
  const lessonsOf = (unit: Unit): Lesson[] => byOrder(unit.lessons);
  const allLessons = units.flatMap((unit) => lessonsOf(unit));
  const lessonById = new Map(allLessons.map((lesson) => [lesson.metadata.id, lesson]));
  const unitById = new Map(units.map((unit) => [unit.metadata.id, unit]));

  // Join guides to the REGISTRY (source of truth for unit and order).
  const guidesByLessonId = new Map<string, TeacherSolutionsModel>();
  const unmatchedGuides: TeacherSolutionsModel[] = [];
  const unitMismatchedGuides: { guide: TeacherSolutionsModel; lesson: Lesson }[] = [];
  for (const guide of teacherGuides) {
    const lesson = lessonById.get(guide.lessonId);
    if (!lesson) {
      unmatchedGuides.push(guide);
      continue;
    }
    if (guide.unitId !== lesson.metadata.unitId) {
      unitMismatchedGuides.push({ guide, lesson });
    }
    guidesByLessonId.set(guide.lessonId, guide);
  }

  const reviewEntryFor = (unitId: string): UnitReviewSolutionsEntry | undefined =>
    unitReviewSolutions.find((entry) => entry.unitId === unitId);

  const openUnits = () => setView({ level: 'units' });
  const openUnit = (unitId: string) => setView({ level: 'unit', unitId });
  const openLesson = (lessonId: string) => setView({ level: 'lesson', lessonId });
  const openReview = (unitId: string) => setView({ level: 'review', unitId });

  const renderLinkAlert = () => {
    if (unmatchedGuides.length === 0 && unitMismatchedGuides.length === 0) return null;
    return (
      <div className="teacher-link-alert" role="alert">
        <strong>خلل في ربط الأدلة بدروس المنهج:</strong>
        <ul>
          {unmatchedGuides.map((guide) => (
            <li key={guide.lessonId}>
              الدليل <code>{guide.lessonId}</code> لا يطابق أي درس مسجل، ولن يظهر ضمن وحداته حتى يُصحّح الربط.
            </li>
          ))}
          {unitMismatchedGuides.map(({ guide, lesson }) => (
            <li key={guide.lessonId}>
              الدليل <code>{guide.lessonId}</code> يُسند إلى <code>{guide.unitId}</code> بينما الدرس المسجّل يقع في{' '}
              <code>{lesson.metadata.unitId}</code>؛ يُعرض ضمن وحدة الدرس المسجّل.
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderUnitsView = () => (
    <>
      <Breadcrumbs
        items={[{ label: 'بوابة المعلم', current: true }]}
        label="مسار التنقل داخل بوابة المعلم"
      />
      <p className="teacher-view-eyebrow">الأدلة وحلول التدريبات</p>
      <h2 ref={headingRef} tabIndex={-1} className="teacher-view-title">
        وحدات المنهج والأدلة والحلول
      </h2>
      <p className="teacher-view-subtitle">
        اختر وحدة لعرض دروسها المسجّلة وأدلة معلمها وحلولها المعتمدة فقط.
      </p>
      <div className="teacher-browse-grid">
        {units.map((unit) => {
          const lessons = lessonsOf(unit);
          const unitGuides = lessons
            .map((lesson) => guidesByLessonId.get(lesson.metadata.id))
            .filter((guide): guide is TeacherSolutionsModel => Boolean(guide));
          const solutionCount = unitGuides.reduce(
            (total, guide) => total + (isApproved(guide) ? guide.exerciseSolutions.length : 0),
            0,
          );
          const declaredAbsenceCount = unitGuides.filter(isDeclaredAbsence).length;
          const range = unit.metadata.sourcePagesRange;
          const reviewEntry = reviewEntryFor(unit.metadata.id);
          const unitTitle = `الوحدة ${unitOrdinal(unit.metadata.order)}`;
          return (
            <div key={unit.metadata.id} className="teacher-unit-card">
              <div className="teacher-card-top">
                <span className="teacher-order-badge">{unitTitle}</span>
                <StatusPill tone={unit.metadata.isComplete ? 'ok' : 'muted'}>
                  {unit.metadata.isComplete ? 'مكتملة رسميًا' : 'غير مكتملة'}
                </StatusPill>
              </div>
              <h3 className="teacher-card-title">{unit.metadata.title}</h3>
              {range && (
                <p className="teacher-card-meta">
                  صفحات الكتاب <ArabicNumber value={toArabicDigits(range.startPage)} />–
                  <ArabicNumber value={toArabicDigits(range.endPage)} />
                </p>
              )}
              <ul className="teacher-card-stats">
                <li><ArabicNumber value={toArabicDigits(lessons.length)} /> دروس</li>
                <li><ArabicNumber value={toArabicDigits(unitGuides.length)} />/<ArabicNumber value={toArabicDigits(lessons.length)} /> أدلة</li>
                <li><ArabicNumber value={toArabicDigits(solutionCount)} /> حلًا</li>
                {declaredAbsenceCount > 0 && (
                  <li>
                    <ArabicNumber value={toArabicDigits(declaredAbsenceCount)} /> غيابًا معلنًا وموثَّقًا
                  </li>
                )}
              </ul>
              {unit.reviewId && (
                <p className="teacher-card-meta">
                  {reviewEntry?.content
                    ? 'حلول تقويم الوحدة متوفرة'
                    : 'تقويم الوحدة: لا توجد حلول معلم معتمدة'}
                </p>
              )}
              <button
                type="button"
                className="btn btn-primary teacher-card-cta-btn"
                onClick={() => openUnit(unit.metadata.id)}
              >
                عرض دروس وحلول {unit.metadata.title}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );

  const renderUnitView = (unitId: string) => {
    const unit = unitById.get(unitId);
    if (!unit) {
      return (
        <>
          <Breadcrumbs
            items={[{ label: 'بوابة المعلم', onClick: openUnits }, { label: 'وحدة غير موجودة', current: true }]}
            label="مسار التنقل داخل بوابة المعلم"
          />
          <h2 ref={headingRef} tabIndex={-1} className="teacher-view-title">الوحدة غير موجودة</h2>
          <p className="teacher-view-subtitle">قد يكون المعرف قديمًا أو أن الوحدة غير مسجلة في المنهج.</p>
          <div className="teacher-backbar">
            <button type="button" className="btn btn-primary" onClick={openUnits}>العودة إلى الوحدات</button>
          </div>
        </>
      );
    }
    const lessons = lessonsOf(unit);
    const reviewEntry = reviewEntryFor(unit.metadata.id);
    return (
      <>
        <Breadcrumbs
          items={[
            { label: 'بوابة المعلم', onClick: openUnits },
            { label: unit.metadata.title, current: true },
          ]}
          label="مسار التنقل داخل بوابة المعلم"
        />
        <p className="teacher-view-eyebrow">الأدلة وحلول التدريبات</p>
        <h2 ref={headingRef} tabIndex={-1} className="teacher-view-title">
          {unit.metadata.title} — الأدلة والحلول
        </h2>
        <p className="teacher-view-subtitle">اختر درسًا لعرض دليله وحلوله المعتمدة وحده.</p>
        <div className="teacher-backbar">
          <button type="button" className="btn btn-secondary" onClick={openUnits}>
            العودة إلى الوحدات
          </button>
        </div>
        <div className="teacher-browse-grid">
          {lessons.map((lesson) => {
            const guide = guidesByLessonId.get(lesson.metadata.id);
            const range = lessonPageRange(lesson);
            if (!guide) {
              return (
                <div key={lesson.metadata.id} className="teacher-lesson-card teacher-lesson-card--missing">
                  <div className="teacher-card-top">
                    <LessonChip order={lesson.metadata.order} />
                    <StatusPill tone="missing">غير مسجل</StatusPill>
                  </div>
                  <h3 className="teacher-card-title">{lesson.metadata.title}</h3>
                  <PageRangeMeta range={range} />
                  <p className="teacher-missing-note">{LESSON_MISSING_NOTE}</p>
                </div>
              );
            }
            if (isDeclaredAbsence(guide)) {
              return (
                <div
                  key={lesson.metadata.id}
                  className="teacher-lesson-card teacher-lesson-card--declared-absence"
                >
                  <div className="teacher-card-top">
                    <LessonChip order={lesson.metadata.order} />
                    <StatusPill tone="muted">غياب معلن وموثَّق</StatusPill>
                  </div>
                  <h3 className="teacher-card-title">{lesson.metadata.title}</h3>
                  <PageRangeMeta range={range} />
                  <p className="teacher-missing-note teacher-declared-note">
                    {LESSON_DECLARED_ABSENCE_NOTE}
                  </p>
                  {/* The gap is documented IN the card: no open button, because
                      there is no solutions view to open and no answer to show. */}
                  <dl className="teacher-absence-inline">
                    <dt>سبب الغياب</dt>
                    <dd>{guide.declaration.reason}</dd>
                    <dt>مستند الإثبات</dt>
                    <dd><code>{guide.declaration.sourceRef}</code></dd>
                    <dt>تاريخ الإعلان</dt>
                    <dd><ArabicNumber value={toArabicDigits(guide.declaration.declaredOn)} /></dd>
                    <dt>المهمة اللاحقة</dt>
                    <dd>{guide.declaration.deferredContentTask}</dd>
                    <dt>سجل المصادر المدقق</dt>
                    <dd>
                      <ArabicNumber value={toArabicDigits(guide.sourceRecords.length)} /> نشاطاً مطبوعاً،
                      بلا أي حل معتمد.
                    </dd>
                  </dl>
                </div>
              );
            }
            return (
              <div key={lesson.metadata.id} className="teacher-lesson-card">
                <div className="teacher-card-top">
                  <LessonChip order={lesson.metadata.order} />
                  <StatusPill tone="ok">دليل وحلول متوفرة</StatusPill>
                </div>
                <h3 className="teacher-card-title">{lesson.metadata.title}</h3>
                <PageRangeMeta range={range} />
                <p className="teacher-card-meta">
                  <ArabicNumber value={toArabicDigits(guide.exerciseSolutions.length)} /> حلًا نموذجيًا
                </p>
                <button
                  type="button"
                  className="btn btn-secondary teacher-card-cta-btn"
                  onClick={() => openLesson(lesson.metadata.id)}
                >
                  عرض حلول الدرس {lessonOrdinal(lesson.metadata.order)}: {lesson.metadata.title}
                </button>
              </div>
            );
          })}
        </div>

        {unit.reviewId && (
          <section aria-labelledby="teacher-review-heading" className="teacher-review-section">
            <h3 id="teacher-review-heading" className="teacher-section-heading">
              تقويم الوحدة
            </h3>
            {reviewEntry?.content ? (
              <div className="teacher-review-entry">
                <div className="teacher-card-top">
                  <span className="teacher-order-badge">تقويم الوحدة</span>
                  <StatusPill tone="ok">حلول متوفرة</StatusPill>
                </div>
                <h4 className="teacher-card-title">{reviewEntry.label}</h4>
                <p className="teacher-card-meta">حلول كاملة لكل أسئلة وفروع التقويم الرسمي، في عرض مستقل عن دروس الوحدة.</p>
                <button
                  type="button"
                  className="btn btn-primary teacher-card-cta-btn"
                  onClick={() => openReview(unit.metadata.id)}
                >
                  عرض {reviewEntry.label}
                </button>
              </div>
            ) : (
              <div className="teacher-review-entry teacher-review-entry--missing" role="note">
                <div className="teacher-card-top">
                  <span className="teacher-order-badge">تقويم الوحدة</span>
                  <StatusPill tone="missing">غير متوفر</StatusPill>
                </div>
                <p className="teacher-missing-note">{reviewEntry?.absenceNote ?? DEFAULT_REVIEW_ABSENCE_NOTE}</p>
              </div>
            )}
          </section>
        )}
      </>
    );
  };

  const renderLessonView = (lessonId: string) => {
    const lesson = lessonById.get(lessonId);
    const unit = lesson ? unitById.get(lesson.metadata.unitId) : undefined;
    if (!lesson || !unit) {
      return (
        <>
          <Breadcrumbs
            items={[{ label: 'بوابة المعلم', onClick: openUnits }, { label: 'درس غير موجود', current: true }]}
            label="مسار التنقل داخل بوابة المعلم"
          />
          <h2 ref={headingRef} tabIndex={-1} className="teacher-view-title">الدرس غير موجود</h2>
          <p className="teacher-view-subtitle">لم يُعثر على هذا الدرس في سجلّ المنهج.</p>
          <div className="teacher-backbar">
            <button type="button" className="btn btn-primary" onClick={openUnits}>العودة إلى الوحدات</button>
          </div>
        </>
      );
    }
    const guide = guidesByLessonId.get(lesson.metadata.id);
    const range = lessonPageRange(lesson);
    return (
      <>
        <Breadcrumbs
          items={[
            { label: 'بوابة المعلم', onClick: openUnits },
            { label: unit.metadata.title, onClick: () => openUnit(unit.metadata.id) },
            { label: lesson.metadata.title, current: true },
          ]}
          label="مسار التنقل داخل بوابة المعلم"
        />
        <p className="teacher-view-eyebrow">دليل معلم — {unit.metadata.title}</p>
        <h2 ref={headingRef} tabIndex={-1} className="teacher-view-title">
          دليل الدرس {lessonOrdinal(lesson.metadata.order)}: {lesson.metadata.title}
        </h2>
        <p className="teacher-view-subtitle">
          {guide && isDeclaredAbsence(guide)
            ? 'غياب الحلول معلن وموثَّق لهذا الدرس وحده — لا حلول ولا مفاتيح.'
            : 'الحلول النموذجية المفصلة — لهذا الدرس وحده.'}
        </p>
        <PageRangeMeta range={range} />
        <BackBar
          onBackToUnit={() => openUnit(unit.metadata.id)}
          onBackToUnits={openUnits}
          unitTitle={unit.metadata.title}
        />
        <LessonSolutionsBody record={guide} />
      </>
    );
  };

  const renderReviewView = (unitId: string) => {
    const unit = unitById.get(unitId);
    const reviewEntry = reviewEntryFor(unitId);
    if (!unit || !reviewEntry?.content) {
      // Honest fallback: never render invented review solutions.
      return (
        <>
          <Breadcrumbs
            items={[
              { label: 'بوابة المعلم', onClick: openUnits },
              unit ? { label: unit.metadata.title, onClick: () => openUnit(unit.metadata.id) } : { label: 'وحدة غير موجودة', current: true },
              { label: 'تقويم الوحدة', current: true },
            ]}
            label="مسار التنقل داخل بوابة المعلم"
          />
          <h2 ref={headingRef} tabIndex={-1} className="teacher-view-title">لا توجد حلول معتمدة حاليًا</h2>
          <p className="teacher-missing-note" role="note">
            {reviewEntry?.absenceNote ?? DEFAULT_REVIEW_ABSENCE_NOTE}
          </p>
          <div className="teacher-backbar">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => (unit ? openUnit(unit.metadata.id) : openUnits())}
            >
              {unit ? 'العودة إلى دروس الوحدة' : 'العودة إلى الوحدات'}
            </button>
          </div>
        </>
      );
    }
    return (
      <>
        <Breadcrumbs
          items={[
            { label: 'بوابة المعلم', onClick: openUnits },
            { label: unit.metadata.title, onClick: () => openUnit(unit.metadata.id) },
            { label: reviewEntry.label, current: true },
          ]}
          label="مسار التنقل داخل بوابة المعلم"
        />
        <p className="teacher-view-eyebrow">تقويم الوحدة — {unit.metadata.title}</p>
        <h2 ref={headingRef} tabIndex={-1} className="teacher-view-title">
          {reviewEntry.label}
        </h2>
        <p className="teacher-view-subtitle">عرض مستقل عن دروس الوحدة — صفحات التقويم الرسمي وحدها.</p>
        <BackBar
          onBackToUnit={() => openUnit(unit.metadata.id)}
          onBackToUnits={openUnits}
          unitTitle={unit.metadata.title}
        />
        {reviewEntry.content}
      </>
    );
  };

  return (
    <div className="teacher-solutions-browser">
      {renderLinkAlert()}
      {view.level === 'units' && renderUnitsView()}
      {view.level === 'unit' && renderUnitView(view.unitId)}
      {view.level === 'lesson' && renderLessonView(view.lessonId)}
      {view.level === 'review' && renderReviewView(view.unitId)}
    </div>
  );
};
