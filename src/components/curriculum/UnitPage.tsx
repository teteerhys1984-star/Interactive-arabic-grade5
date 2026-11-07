import React from 'react';
import { Unit, UnitReview } from '../../types/curriculum';
import { ArabicNumber, LatinText } from '../common/BiDi';
import { toArabicDigits } from '../../utils/arabicDigits';
import { getLessonTestByLessonId } from '../../data/assessments';
import { Icon } from '../ui/Icon';
import { Breadcrumbs, PageHeader, SectionHeading, StatusPill } from '../ui/PageChrome';
import { LearningLocation } from '../../utils/learningProgress';

export interface UnitPageProps {
  unit: Unit;
  review?: UnitReview;
  savedLocation?: LearningLocation | null;
  onGoHome: () => void;
  onSelectLesson: (lessonId: string) => void;
  onOpenUnitTest?: () => void;
  onOpenReview?: () => void;
}

/**
 * UnitPage — one unit, its lessons in curriculum order, then the assessment strip.
 *
 * The DOM contract is intentionally preserved for the tests that already guard
 * this surface:
 *   .unit-page · .unit-page-lesson-list/.unit-page-lesson-row/.unit-page-lesson-copy
 *   .unit-page-resume-note · .unit-page-assessments · an <h1> carrying the unit title
 * and the review section still follows the lesson list.
 */
export const UnitPage: React.FC<UnitPageProps> = ({
  unit,
  review,
  savedLocation,
  onGoHome,
  onSelectLesson,
  onOpenUnitTest,
  onOpenReview,
}) => {
  const { metadata, lessons } = unit;
  const showTheme = Boolean(metadata.theme && !metadata.title.includes(metadata.theme as string));
  const savedInThisUnit = savedLocation?.unitId === metadata.id;

  const meta = [
    ...(metadata.sourcePagesRange
      ? [
          {
            icon: <Icon name="book" size={16} />,
            label: (
              <>
                صفحات الكتاب{' '}
                <ArabicNumber value={toArabicDigits(metadata.sourcePagesRange.startPage)} />–
                <ArabicNumber value={toArabicDigits(metadata.sourcePagesRange.endPage)} />
              </>
            ),
          },
        ]
      : []),
    {
      icon: <Icon name="steps" size={16} />,
      label: (
        <>
          <ArabicNumber value={toArabicDigits(lessons.length)} /> دروس بترتيب المنهج
        </>
      ),
    },
    {
      icon: <Icon name={metadata.isComplete ? 'check' : 'lock'} size={16} />,
      label: metadata.isComplete ? 'اكتمال الوحدة مُعلَن رسميًا' : 'اكتمال الوحدة غير مُعلَن بعد',
      emphasis: false,
    },
  ];

  return (
    <section className="unit-page" dir="rtl" aria-labelledby={`unit-page-title-${metadata.id}`}>
      <Breadcrumbs
        items={[
          { label: 'الرئيسية', onClick: onGoHome },
          { label: metadata.title, current: true },
        ]}
      />

      <PageHeader
        id={`unit-page-title-${metadata.id}`}
        kicker={
          <>
            <span className="unit-order-badge">
              الوحدة <ArabicNumber value={toArabicDigits(metadata.order)} />
            </span>
          </>
        }
        title={metadata.title}
        subtitle={showTheme ? <>المحور: {metadata.theme}</> : undefined}
        meta={meta}
        actions={
          <button type="button" className="btn btn-secondary" onClick={onGoHome}>
            <Icon name="home" size={18} />
            العودة إلى الرئيسية
          </button>
        }
        variant="hero"
      />

      <section className="unit-page-lessons" aria-labelledby={`unit-lessons-title-${metadata.id}`}>
        <SectionHeading
          id={`unit-lessons-title-${metadata.id}`}
          title="دروس الوحدة"
          hint="الترتيب مطابق لترتيب الكتاب المدرسي؛ افتح أي درس للبدء أو المتابعة."
        />

        {lessons.length === 0 ? (
          <p className="no-lessons-notice">لم تُسجّل دروس لهذه الوحدة بعد.</p>
        ) : (
          <ol className="unit-page-lesson-list">
            {lessons.map((lesson) => {
              const isSavedLesson =
                savedLocation?.unitId === metadata.id && savedLocation.lessonId === lesson.metadata.id;
              const savedStepIndex = isSavedLesson
                ? lesson.steps.findIndex((step) => step.id === savedLocation?.stepId)
                : -1;
              const hasValidSavedStep = savedStepIndex >= 0;
              // The question count is READ from the registered assessment, never
              // hard-coded: a lesson with no registered test shows no exam chip.
              const lessonTest = lesson.testId
                ? getLessonTestByLessonId(lesson.metadata.id)
                : undefined;
              const lessonTestQuestionCount = lessonTest ? lessonTest.questions.length : null;

              return (
                <li
                  key={lesson.metadata.id}
                  className={`unit-page-lesson-row${hasValidSavedStep ? ' is-saved' : ''}`}
                >
                  <span className="unit-page-lesson-order" aria-hidden="true">
                    <ArabicNumber value={toArabicDigits(lesson.metadata.order)} />
                  </span>

                  <div className="unit-page-lesson-copy">
                    <div className="lesson-card-heading">
                      <h3>{lesson.metadata.title}</h3>
                      {hasValidSavedStep ? (
                        <StatusPill tone="brand" icon={<Icon name="target" size={14} />} dotted>
                          موضع محفوظ
                        </StatusPill>
                      ) : (
                        <StatusPill tone="teal" icon={<Icon name="check" size={14} />}>
                          متاح
                        </StatusPill>
                      )}
                    </div>
                    {lesson.metadata.subtitle && (
                      <p className="lesson-card-subtitle">{lesson.metadata.subtitle}</p>
                    )}
                    <div className="lesson-card-meta">
                      <span>
                        <Icon name="steps" size={14} />{' '}
                        <ArabicNumber value={toArabicDigits(lesson.steps.length)} /> خطوات
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        <Icon name="clock" size={14} />{' '}
                        <ArabicNumber value={toArabicDigits(lesson.metadata.estimatedMinutes)} /> دقيقة
                      </span>
                      {lessonTestQuestionCount !== null && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>
                            <Icon name="exam" size={14} /> اختبار من{' '}
                            <ArabicNumber value={toArabicDigits(lessonTestQuestionCount)} /> سؤالًا
                          </span>
                        </>
                      )}
                    </div>
                    {hasValidSavedStep && (
                      <p className="unit-page-resume-note">
                        آخر موضع وصلت إليه: الخطوة{' '}
                        <ArabicNumber value={toArabicDigits(savedStepIndex + 1)} /> من{' '}
                        <ArabicNumber value={toArabicDigits(lesson.steps.length)} />
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`btn ${hasValidSavedStep ? 'btn-primary' : 'btn-secondary'} unit-page-lesson-action`}
                    onClick={() => onSelectLesson(lesson.metadata.id)}
                    aria-label={`${hasValidSavedStep ? 'تابع' : 'ابدأ'} الدرس ${lesson.metadata.order}: ${lesson.metadata.title}`}
                    aria-current={hasValidSavedStep ? 'location' : undefined}
                  >
                    {hasValidSavedStep ? 'تابع الدرس' : 'ابدأ الدرس'}
                    <Icon name="arrow-left" className="icon-flip" size={16} />
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {(review || onOpenUnitTest) && (
        <section className="unit-page-assessments" aria-labelledby={`unit-assessments-title-${metadata.id}`}>
          <SectionHeading
            id={`unit-assessments-title-${metadata.id}`}
            title="المراجعة والاختبار"
            hint="منطقة منفصلة عن الدروس: تُراجع ما تعلّمته ثم تُقيس مستواك."
          />
          <div className="unit-page-assessment-list">
            {review && onOpenReview && (
              <article className="unit-page-assessment-item assessment-card">
                <span className="assessment-card-icon" aria-hidden="true">
                  <Icon name="review" size={22} />
                </span>
                <div className="assessment-card-body">
                  <span className="unit-review-kicker">
                    مراجعة الوحدة · <LatinText>{review.metadata.englishLabel}</LatinText>
                  </span>
                  <h3>{review.metadata.title}</h3>
                  <p>{review.metadata.description}</p>
                  <p className="unit-page-assessment-meta">
                    صفحات الكتاب{' '}
                    <ArabicNumber value={toArabicDigits(review.metadata.sourcePagesRange.startPage)} />–
                    <ArabicNumber value={toArabicDigits(review.metadata.sourcePagesRange.endPage)} />
                  </p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={onOpenReview}>
                  ابدأ المراجعة
                  <Icon name="arrow-left" className="icon-flip" size={16} />
                </button>
              </article>
            )}
            {onOpenUnitTest && (
              <article className="unit-page-assessment-item assessment-card assessment-card--exam">
                <span className="assessment-card-icon" aria-hidden="true">
                  <Icon name="exam" size={22} />
                </span>
                <div className="assessment-card-body">
                  <span className="unit-review-kicker">اختبار معتمد لهذه الوحدة</span>
                  <h3>اختبار الوحدة</h3>
                  <p>
                    يُفتح هذا الاختبار فقط بعد إعلان اكتمال الوحدة رسميًا؛ والدرجة تظهر بعد
                    اعتماد الإجابات لا قبلها.
                  </p>
                </div>
                <button type="button" className="btn btn-accent" onClick={onOpenUnitTest}>
                  ابدأ اختبار الوحدة
                  <Icon name="arrow-left" className="icon-flip" size={16} />
                </button>
              </article>
            )}
          </div>
        </section>
      )}

      {savedInThisUnit && (
        <p className="unit-page-session-note">
          <Icon name="target" size={16} />
          موضع التعلّم محفوظ خلال هذه الجلسة فقط. فتح درس لا يعني إتمامه، ولا تُسجَّل
          نسب إنجاز.
        </p>
      )}
    </section>
  );
};

export default UnitPage;
