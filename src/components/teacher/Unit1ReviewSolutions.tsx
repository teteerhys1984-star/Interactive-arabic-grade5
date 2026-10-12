import React from 'react';
import { ArabicNumber } from '../common/BiDi';
import { SourceBadge } from '../common/SourceBadge';
import { toArabicDigits } from '../../utils/arabicDigits';
import { UNIT1_REVIEW_TEACHER_GUIDE } from '../../data/unit1Review/teacherGuide';
import {
  ReviewQuestion,
  ReviewSubpart,
  ReviewTeacherSolution,
} from '../../data/unit1Review/reviewItems';
import { UNIT1_REVIEW_TIMING, UNIT1_REVIEW_INSTRUCTIONS, UNIT1_REVIEW_CLOSING } from '../../data/unit1Review/reviewItems';
import {
  PENDING_SOURCE_RECORD_IDS,
  RESOLVED_SOURCE_LIMIT_IDS,
  isSubpartPendingSourceVerification,
  reviewUncertaintyForSubpart,
} from '../../data/unit1Review/sourceMeta';

/**
 * Teacher Area section: «حلول تقويم الوحدة الأولى».
 *
 * Full solutions for every printed question and branch of pages 36–38:
 * model answer, solution steps, rule + examples, complete i‘rab when the task
 * requires analysis, accepted alternatives and their limits, and every declared
 * source ambiguity — organised as openable cards, never one long text block.
 */

const SolutionCard: React.FC<{ solution: ReviewTeacherSolution; label: string; subpartId?: string }> = ({
  solution,
  label,
  subpartId,
}) => {
  const pendingLimit =
    subpartId && isSubpartPendingSourceVerification(subpartId)
      ? reviewUncertaintyForSubpart(subpartId)
      : undefined;

  return (
  <article className={`u1r-solution-card ${pendingLimit ? 'u1r-solution-card-pending' : ''}`} aria-label={`حل ${label}`}>
    <header className="u1r-solution-head">
      <span className="u1r-solution-label">{label}</span>
      <span className="u1r-solution-ref">{solution.printedRef}</span>
      {pendingLimit && <span className="u1r-solution-pending-tag">قيد التحقق المصدري — غير مكتمل</span>}
    </header>

    {pendingLimit && (
      <aside className="u1r-gap-notice" role="note">
        <strong>لم يكتمل هذا الحلّ:</strong> {pendingLimit.issue} المطلوب المطبوع يبقى كما هو (لا يُستبدل ولا
        يُخمَّن). ولا يُعتمد هذا الحلّ نهائيًّا قبل: {pendingLimit.cropNeeded}
      </aside>
    )}

    <p className="u1r-solution-question">
      <strong>نصّ المطلوب:</strong> {solution.questionText}
    </p>

    <p className="u1r-solution-answer">
      <strong>الإجابة النموذجية:</strong> {solution.modelAnswer}
    </p>

    <details className="u1r-solution-details" open>
      <summary>خطوات الحل والتعليل</summary>
      <ol className="u1r-solution-steps">
        {solution.solutionSteps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </details>

    {(solution.rule || solution.ruleExamples) && (
      <details className="u1r-solution-details">
        <summary>القاعدة اللغوية وأمثلة توضيحية</summary>
        {solution.rule && <p className="u1r-solution-rule">{solution.rule}</p>}
        {solution.ruleExamples && (
          <ul className="u1r-solution-examples">
            {solution.ruleExamples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        )}
      </details>
    )}

    {solution.irab && solution.irab.length > 0 && (
      <details className="u1r-solution-details">
        <summary>الإعراب الكامل</summary>
        <div className="u1r-irab-table-wrap">
          <table className="u1r-irab-table">
            <thead>
              <tr>
                <th scope="col">الكلمة/التركيب</th>
                <th scope="col">الإعراب الكامل</th>
              </tr>
            </thead>
            <tbody>
              {solution.irab.map((entry, index) => (
                <tr key={index}>
                  <td className="u1r-irab-segment">{entry.segment}</td>
                  <td>
                    {entry.role}
                    {entry.note && <span className="u1r-irab-note"> {entry.note}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    )}

    {(solution.acceptedAlternatives || solution.acceptanceLimits) && (
      <details className="u1r-solution-details">
        <summary>الإجابات البديلة وحدود المقبول</summary>
        {solution.acceptedAlternatives && (
          <ul className="u1r-solution-alternatives">
            {solution.acceptedAlternatives.map((alternative, index) => (
              <li key={index}>{alternative}</li>
            ))}
          </ul>
        )}
        {solution.acceptanceLimits && (
          <p className="u1r-solution-limits">
            <strong>حدود المقبول:</strong> {solution.acceptanceLimits}
          </p>
        )}
      </details>
    )}

    {solution.ambiguity && (
      <aside className="u1r-solution-ambiguity" role="note">
        <strong>غموض مصدر معلن:</strong> {solution.ambiguity}
      </aside>
    )}

    {solution.commonMistakes && solution.commonMistakes.length > 0 && (
      <ul className="u1r-solution-mistakes">
        {solution.commonMistakes.map((mistake, index) => (
          <li key={index}>⚠ {mistake}</li>
        ))}
      </ul>
    )}
  </article>
  );
};

const QuestionSolutions: React.FC<{ question: ReviewQuestion }> = ({ question }) => (
  <details className="u1r-teacher-question" open>
    <summary>
      <span className="u1r-branch-badge">السؤال {question.printedNumber}</span>
      <span className="u1r-teacher-question-title">{question.section}</span>
      <span className="u1r-teacher-question-page">
        صفحة <ArabicNumber value={toArabicDigits(question.page)} /> · <ArabicNumber value={toArabicDigits(question.subparts.length)} /> فرعاً
      </span>
      {PENDING_SOURCE_RECORD_IDS.includes(question.sourceRecordId) && (
        <span className="u1r-solution-pending-tag">قيد التحقق المصدري</span>
      )}
    </summary>

    <p className="u1r-teacher-instruction">
      <strong>التعليم المطبوع:</strong> {question.instruction}
    </p>
    {question.sharedText && <p className="u1r-shared-text">{question.sharedText}</p>}
    <SourceBadge source={question.source} compact />

    <div className="u1r-teacher-subparts">
      {question.subparts.map((subpart: ReviewSubpart) => (
        <SolutionCard
          key={subpart.teacher.id}
          solution={subpart.teacher}
          label={subpart.label}
          subpartId={subpart.id}
        />
      ))}
    </div>
  </details>
);

export const Unit1ReviewSolutions: React.FC = () => {
  const guide = UNIT1_REVIEW_TEACHER_GUIDE;
  const audit = guide.audit;

  return (
    <div className="u1r-teacher-review" dir="rtl">
      <header className="u1r-teacher-header">
        <div className="teacher-header-badge">قسم مستقل: تقويم الوحدة الأولى</div>
        <h2 className="u1r-teacher-title">{guide.title}</h2>
        <p className="u1r-teacher-description">
          حلول كاملة لجميع أسئلة صفحات التقويم الثلاث (٣٦–٣٨) وجميع فروعها، مع خطوات الحل والتعليل
          والقواعد والأمثلة والإعراب الكامل وحدود قبول الإجابات البديلة، بدل مفتاح إجابات مختصر.
        </p>
        <SourceBadge source={{ ...UNIT1_REVIEW_TIMING.source, pageNumber: 36, pageEndNumber: 38 }} />
      </header>

      <div className="u1r-teacher-metrics">
        <div className="audit-metric-card">
          <span className="metric-num"><ArabicNumber value={toArabicDigits(guide.printedQuestions)} /></span>
          <span className="metric-txt">أسئلة مرقّمة</span>
        </div>
        <div className="audit-metric-card">
          <span className="metric-num"><ArabicNumber value={toArabicDigits(guide.printedBranches)} /></span>
          <span className="metric-txt">فرعاً مقوَّماً في الأسئلة</span>
        </div>
        <div className="audit-metric-card">
          <span className="metric-num"><ArabicNumber value={toArabicDigits(audit.studentSubparts)} /></span>
          <span className="metric-txt">عنصراً في منطقة الطالب</span>
        </div>
        <div className="audit-metric-card">
          <span className="metric-num"><ArabicNumber value={toArabicDigits(guide.records)} /></span>
          <span className="metric-txt">سجلاً مصدرياً مقفلاً</span>
        </div>
      </div>

      <div className={audit.status === 'passed' ? 'audit-success-banner' : 'audit-issues-list'}>
        {audit.status === 'passed' && audit.sourceVerified ? (
          <>
            ✓ تدقيق التغطية: كل سجل مصدري في الصفحات ٣٦–٣٨ ممثَّل في منطقة الطالب وله حل كامل في منطقة
            المعلم، و<strong>المواضع الثلاثة المؤثّرة في الإجابات محسومة</strong> ببيّنة المالك (
            {RESOLVED_SOURCE_LIMIT_IDS.join('، ')}). ويبقى{' '}
            <ArabicNumber value={toArabicDigits(audit.openNonBlockingLimits.length)} /> موضعًا معلنًا لا يمسّ
            الإجابات ({audit.openNonBlockingLimits.join('، ')}) مسجّلًا في جدول حدود المصدر أدناه.
          </>
        ) : audit.status === 'passed' ? (
          <div className="audit-issue-card issue-warning">
            <span className="issue-severity-badge">قيد التحقق المصدري</span>
            <p className="issue-msg">
              تدقيق البنية اجتاز: كل سجل مصدري في الصفحات ٣٦–٣٨ ممثَّل في منطقة الطالب وله حلٌّ في منطقة
              المعلم. لكن <strong>التحقق المصدري لم يكتمل</strong>: السجلات{' '}
              {audit.pendingSourceRecords.join('، ')} (و<ArabicNumber value={toArabicDigits(audit.pendingSubparts.length)} /> عناصر
              طالب) معلّقة على قصّ أوضح، والحلول المتصلة بها موسومة «قيد التحقق المصدري — غير مكتمل»، فالعنصر
              لا يُعدّ مكتملًا قبل التحقق من الصورة.
            </p>
          </div>
        ) : (
          <div className="audit-issue-card issue-error">
            <span className="issue-severity-badge">خطأ حرج</span>
            <p className="issue-msg">
              تدقيق التغطية لم يجتز: سجلات ناقصة ({audit.missingRecords.join(', ') || '—'}) أو فروع ناقصة في الحلول.
            </p>
          </div>
        )}
      </div>

      <details className="u1r-teacher-coverage">
        <summary>سجل تغطية المصدر: سجل ← فرع الطالب ← حل المعلم</summary>
        <p>
          يثبت هذا السجل المسار: عنصر المصدر المطبوع ← عنصر منطقة الطالب ← حل المعلم. الفروع غير المقوَّمة
          (تعليمات التقويم ومهمة ضبط الوقت وبندا خاتمة الوحدة) لها إرشاد معلم ولا تُحتسب في الدرجة.
        </p>
        <div className="teacher-coverage-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">الصفحة</th>
                <th scope="col">السجل المطبوع</th>
                <th scope="col">فروع الطالب</th>
                <th scope="col">حلول المعلم</th>
                <th scope="col">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {guide.pages.flatMap((page) =>
                [...page.questions.map((question) => ({
                  id: question.sourceRecordId,
                  label: `السؤال ${question.printedNumber}: ${question.section}`,
                  page: page.page,
                  count: question.subparts.length,
                })),
                ...page.records.map((record) => {
                  const count =
                    record.id === UNIT1_REVIEW_TIMING.id
                      ? UNIT1_REVIEW_TIMING.subparts.length
                      : record.id === UNIT1_REVIEW_INSTRUCTIONS.id
                      ? UNIT1_REVIEW_INSTRUCTIONS.subparts.length
                      : UNIT1_REVIEW_CLOSING.subparts.length;
                  return { id: record.id, label: record.title, page: page.page, count };
                })].map((row) => {
                  const pending = PENDING_SOURCE_RECORD_IDS.includes(row.id);
                  return (
                    <tr key={row.id} className={pending ? 'u1r-coverage-row-pending' : ''}>
                      <td><ArabicNumber value={toArabicDigits(row.page)} /></td>
                      <td>{row.label}</td>
                      <td><ArabicNumber value={toArabicDigits(row.count)} /></td>
                      <td><ArabicNumber value={toArabicDigits(row.count)} /></td>
                      <td>
                        {pending
                          ? 'قيد التحقق المصدري — غير مكتمل (بانتظار قصّ أوضح)'
                          : 'ممثل ومغطى بحل كامل'}
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      </details>

      <div className="u1r-teacher-objectives">
        <h3>الأهداف التربوية للتقويم</h3>
        <ul>
          {guide.pedagogicalObjectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </div>

      <div className="u1r-teacher-notes-grid">
        <details className="u1r-teacher-notes">
          <summary>قواعد نحوية يحتاجها التصحيح</summary>
          <ul>
            {guide.grammarNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </details>
        <details className="u1r-teacher-notes">
          <summary>قواعد إملائية (الهمزتان)</summary>
          <ul>
            {guide.spellingRules.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </details>
        <details className="u1r-teacher-notes">
          <summary>ملاحظات التعبير والتقويم الذاتي</summary>
          <ul>
            {guide.expressionNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </details>
        <details className="u1r-teacher-notes">
          <summary>مراجع داخل الوحدة تُستعمل في التعليل</summary>
          <ul>
            {guide.crossUnitReferences.map((reference) => (
              <li key={reference}>{reference}</li>
            ))}
          </ul>
        </details>
      </div>

      <details className="u1r-teacher-limits" open>
        <summary>حدود المصدر المعلنة ({guide.sourceLimits.length}) وطلبات القصّ الأوضح</summary>
        <div className="u1r-limits-table-wrap">
          <table className="u1r-limits-table">
            <thead>
              <tr>
                <th scope="col">الصفحة</th>
                <th scope="col">الموضع</th>
                <th scope="col">ما لم يُحسم</th>
                <th scope="col">أثره على الإجابة</th>
                <th scope="col">الحالة</th>
                <th scope="col">ما حُسم / المطلوب لرفع القيد</th>
              </tr>
            </thead>
            <tbody>
              {guide.sourceLimits.map((limit) => (
                <tr
                  key={`${limit.recordId}-${limit.region}`}
                  className={
                    limit.blocking ? 'u1r-limit-row-blocking' : limit.status === 'resolved' ? 'u1r-limit-row-settled' : ''
                  }
                >
                  <td><ArabicNumber value={toArabicDigits(limit.page)} /></td>
                  <td>{limit.region}</td>
                  <td>{limit.issue}</td>
                  <td>
                    {limit.affectsAnswer ? 'يمسّ نصّ السؤال أو الإجابة النموذجية. ' : 'لا يمسّ الإجابة. '}
                    {limit.whyItMatters}
                  </td>
                  <td>
                    {limit.status === 'resolved'
                      ? 'حُسم ببيّنة المالك'
                      : limit.blocking
                        ? `معلَّق — لا يُعدّ ${limit.recordId} مكتملًا`
                        : 'مسجَّل — لا يوقف الاعتماد'}
                  </td>
                  <td>
                    {limit.status === 'resolved' ? (
                      <>
                        <strong>{limit.resolution}</strong>
                        {limit.evidence && <span className="u1r-limit-evidence"> ({limit.evidence})</span>}
                      </>
                    ) : (
                      limit.cropNeeded
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <div className="u1r-teacher-pages">
        {guide.pages.map((page) => (
          <section className="u1r-teacher-page" key={page.page} aria-label={page.heading}>
            <h3 className="u1r-teacher-page-title">{page.heading}</h3>

            {page.records.map((record) => {
              const subparts =
                record.id === UNIT1_REVIEW_TIMING.id
                  ? UNIT1_REVIEW_TIMING.subparts
                  : record.id === UNIT1_REVIEW_INSTRUCTIONS.id
                  ? UNIT1_REVIEW_INSTRUCTIONS.subparts
                  : UNIT1_REVIEW_CLOSING.subparts;
              return (
                <details className="u1r-teacher-question" key={record.id}>
                  <summary>
                    <span className="u1r-branch-badge">{record.id}</span>
                    <span className="u1r-teacher-question-title">{record.title}</span>
                    <span className="u1r-teacher-question-page">
                      <ArabicNumber value={toArabicDigits(subparts.length)} /> عناصر
                    </span>
                  </summary>
                  <div className="u1r-teacher-subparts">
                    {subparts.map((subpart) => (
                      <SolutionCard
                        key={subpart.teacher.id}
                        solution={subpart.teacher}
                        label={subpart.label}
                        subpartId={subpart.id}
                      />
                    ))}
                  </div>
                </details>
              );
            })}

            {page.questions.map((question) => (
              <QuestionSolutions key={question.id} question={question} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};
