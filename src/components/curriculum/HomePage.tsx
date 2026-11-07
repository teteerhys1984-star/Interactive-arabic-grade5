import React from 'react';
import { Lesson, Unit, UnitReview } from '../../types/curriculum';
import { ArabicNumber } from '../common/BiDi';
import { toArabicDigits } from '../../utils/arabicDigits';
import { Icon } from '../ui/Icon';
import { SectionHeading, StatusPill } from '../ui/PageChrome';
import { LearningLocation } from '../../utils/learningProgress';

/**
 * HomePage — the student's launch surface.
 *
 * CONTENT RULES ENFORCED HERE (owner-mandated):
 *  - Only real data is shown: unit title/theme/order, lesson order/title/subtitle,
 *    lesson step count, `estimatedMinutes`, printed page ranges, and the saved
 *    session location. Nothing is inferred, no completion ratio, no badge that
 *    claims work the learner did not do.
 *  - The "continue" card renders ONLY when a valid saved location exists
 *    (the caller already validated it against the registry).
 *  - Lesson availability is derived from the registry: every registered lesson
 *    is openable, so the pill says «متاح» honestly; a lesson with a saved
 *    position is additionally marked «آخر موضع».
 *  - Review / unit test live in their own strip under the lessons, never mixed
 *    into the lesson list, and the unit-test pill depends on
 *    `metadata.isComplete` only.
 */

export interface HomePageProps {
  units: Unit[];
  savedLocation: LearningLocation | null;
  savedLessonLabel: string | null;
  savedUnitLabel: string | null;
  savedStepNumber: number | null;
  savedStepTotal: number | null;
  getReview: (unitId: string) => UnitReview | undefined;
  isUnitTestAvailable: (unitId: string) => boolean;
  onOpenUnit: (unitId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onOpenReview: (unitId: string) => void;
  onOpenUnitTest: (unitId: string) => void;
}

/**
 * Numerals: every number a learner reads on this page is Arabic-Indic. Counts
 * that appear inside a sentence go through `toArabicDigits`; standalone numbers
 * are rendered by `<ArabicNumber>` so they stay LTR-isolated inside RTL text.
 */
const lessonStepLabel = (lesson: Lesson): string => `${toArabicDigits(lesson.steps.length)} خطوات`;

export const HomePage: React.FC<HomePageProps> = ({
  units,
  savedLocation,
  savedLessonLabel,
  savedUnitLabel,
  savedStepNumber,
  savedStepTotal,
  getReview,
  isUnitTestAvailable,
  onOpenUnit,
  onSelectLesson,
  onOpenReview,
  onOpenUnitTest,
}) => {
  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const firstLesson = units[0]?.lessons[0];

  return (
    <div className="home-page">
      {/* ---------------- welcome + resume ---------------- */}
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="home-hero-body">
          <span className="home-hero-kicker">
            الصف الخامس الأساسي · اللغة العربية
          </span>
          <h1 className="home-hero-title" id="home-hero-title">
            أهلاً بك في <span className="home-hero-accent">عربي خامس</span>
          </h1>
          <p className="home-hero-lede">
            منصّة تفاعلية تتبع كتاب اللغة العربية المقرّر: اقرأ النصّ، افهم القاعدة،
            ثم طبّق في أنشطة مرتبة خطوةً بخطوة.
          </p>

          <ul className="home-hero-stats" aria-label="ملخّص المحتوى المتاح">
            <li>
              <ArabicNumber value={toArabicDigits(units.length)} />
              <span>{units.length === 1 ? 'وحدة' : 'وحدتان'}</span>
            </li>
            <li>
              <ArabicNumber value={toArabicDigits(totalLessons)} />
              <span>دروس مسجّلة</span>
            </li>
            <li>
              <ArabicNumber value={toArabicDigits(units.filter((unit) => unit.metadata.isComplete).length)} />
              {/* The count is of units whose completion the curriculum owner has
                  declared. It must never read as work the learner finished, so it
                  uses the same «مُعلَن» wording as the unit page. */}
              <span>اكتمال مُعلَن رسميًا</span>
            </li>
          </ul>

          <div className="home-hero-actions">
            {savedLocation && savedLessonLabel ? (
              <button
                type="button"
                className="btn btn-accent home-hero-cta"
                onClick={() => onSelectLesson(savedLocation.lessonId)}
              >
                <Icon name="arrow-left" className="icon-flip" />
                متابعة التعلّم
              </button>
            ) : firstLesson ? (
              <button
                type="button"
                className="btn btn-accent home-hero-cta"
                onClick={() => onSelectLesson(firstLesson.metadata.id)}
              >
                ابدأ من أول درس
                <Icon name="arrow-left" className="icon-flip" />
              </button>
            ) : null}
            <a className="btn home-hero-secondary" href="#home-units">
              استعرض الوحدات
            </a>
          </div>
        </div>

        {/* The resume panel is rendered only when a real session position exists. */}
        {savedLocation && savedLessonLabel ? (
          <aside className="home-resume" aria-label="متابعة التعلّم">
            <span className="home-resume-kicker">
              <Icon name="target" size={16} />
              آخر موضع وصلت إليه
            </span>
            <h2 className="home-resume-title">{savedLessonLabel}</h2>
            <p className="home-resume-meta">
              {savedUnitLabel}
              {savedStepNumber !== null && savedStepTotal !== null && (
                <>
                  {' · '}
                  الخطوة <ArabicNumber value={toArabicDigits(savedStepNumber)} /> من{' '}
                  <ArabicNumber value={toArabicDigits(savedStepTotal)} />
                </>
              )}
            </p>
            <button
              type="button"
              className="btn btn-primary home-resume-btn"
              onClick={() => onSelectLesson(savedLocation.lessonId)}
            >
              تابع من حيث توقّفت
              <Icon name="arrow-left" className="icon-flip" />
            </button>
            <p className="home-resume-note">
              يبقى موضعك محفوظًا خلال الجلسة الحالية فقط، ولا يُسجَّل إتمام الدرس
              بمجرّد زيارته.
            </p>
          </aside>
        ) : (
          <aside className="home-resume home-resume--start" aria-label="بداية التعلّم">
            <span className="home-resume-kicker">
              <Icon name="target" size={16} />
              نقطة البداية
            </span>
            <h2 className="home-resume-title">
              {firstLesson ? firstLesson.metadata.title : 'لم تُسجَّل دروس بعد'}
            </h2>
            <p className="home-resume-meta">
              {firstLesson
                ? `الدرس الأول في الوحدة الأولى · ${lessonStepLabel(firstLesson)}`
                : 'ستظهر الدروس هنا بعد تسجيلها من المصدر المعتمد.'}
            </p>
            {firstLesson && (
              <button
                type="button"
                className="btn btn-primary home-resume-btn"
                onClick={() => onOpenUnit(units[0].metadata.id)}
              >
                افتح الوحدة الأولى
                <Icon name="arrow-left" className="icon-flip" />
              </button>
            )}
            <p className="home-resume-note">
              لا تُعرض نسب إنجاز أو شارات إكمال؛ يُعرض موضع التعلّم المحفوظ فقط.
            </p>
          </aside>
        )}
      </section>

      {/* ---------------- units ---------------- */}
      <section className="home-units" id="home-units" aria-labelledby="home-units-title">
        <SectionHeading
          id="home-units-title"
          title="الوحدات الدراسية"
          count={units.length}
          countLabel={units.length === 1 ? 'وحدة' : 'وحدتان'}
          hint="كل وحدة تجمع دروسها بترتيب المنهج، ثم المراجعة والاختبار في نهاية الوحدة."
        />

        {units.length === 0 ? (
          <div className="empty-state-card">
            <span className="empty-state-icon" aria-hidden="true">
              <Icon name="book" size={26} />
            </span>
            <h3>في انتظار تزويد صفحات الكتاب المدرسي</h3>
            <p>
              لم يتم إدراج أي دروس أو وحدات تخمينية أو وهمية التزاماً بالمعايير الصارمة
              لنزاهة المنهج.
            </p>
          </div>
        ) : (
          <ul className="unit-grid">
            {units.map((unit) => {
              const { metadata, lessons } = unit;
              const showTheme = Boolean(metadata.theme && !metadata.title.includes(metadata.theme as string));
              const unitHasSaved = savedLocation?.unitId === metadata.id;
              const unitTestReady = isUnitTestAvailable(metadata.id);
              const review = getReview(metadata.id);

              return (
                <li key={metadata.id}>
                  <article className="unit-panel" aria-labelledby={`unit-title-${metadata.id}`}>
                    <header className="unit-panel-head">
                      <div className="unit-panel-heading">
                        <span className="unit-panel-index">
                          <span className="unit-panel-index-label">الوحدة</span>
                          <ArabicNumber value={toArabicDigits(metadata.order)} />
                        </span>
                        <div className="unit-panel-title-block">
                          <h3 className="unit-title" id={`unit-title-${metadata.id}`}>
                            {metadata.title}
                          </h3>
                          {showTheme && <p className="unit-theme">المحور: {metadata.theme}</p>}
                        </div>
                      </div>
                      <div className="unit-panel-badges">
                        {unitHasSaved && (
                          <StatusPill tone="brand" icon={<Icon name="target" size={14} />} dotted>
                            موضع محفوظ
                          </StatusPill>
                        )}
                        <StatusPill
                          tone={unitTestReady ? 'teal' : 'neutral'}
                          icon={<Icon name={unitTestReady ? 'check' : 'lock'} size={14} />}
                        >
                          {unitTestReady ? 'اختبار الوحدة متاح' : 'اختبار الوحدة غير متاح بعد'}
                        </StatusPill>
                      </div>
                    </header>

                    <div className="unit-panel-meta">
                      <span className="meta-chip">
                        <Icon name="steps" size={16} />
                        <ArabicNumber value={toArabicDigits(lessons.length)} /> دروس
                      </span>
                      {metadata.sourcePagesRange && (
                        <span className="meta-chip">
                          <Icon name="book" size={16} />
                          صفحات{' '}
                          <ArabicNumber value={toArabicDigits(metadata.sourcePagesRange.startPage)} />–
                          <ArabicNumber value={toArabicDigits(metadata.sourcePagesRange.endPage)} />
                        </span>
                      )}
                    </div>

                    {lessons.length === 0 ? (
                      <p className="unit-panel-empty">لم تُسجّل دروس لهذه الوحدة بعد.</p>
                    ) : (
                      <ol className="unit-panel-lessons">
                        {lessons.map((lesson) => {
                          const isSaved =
                            savedLocation?.unitId === metadata.id &&
                            savedLocation.lessonId === lesson.metadata.id;
                          return (
                            <li key={lesson.metadata.id} className={`unit-lesson-row${isSaved ? ' is-saved' : ''}`}>
                              <span className="unit-lesson-order" aria-hidden="true">
                                <ArabicNumber value={toArabicDigits(lesson.metadata.order)} />
                              </span>
                              <div className="unit-lesson-copy">
                                <h4 className="unit-lesson-title">{lesson.metadata.title}</h4>
                                {lesson.metadata.subtitle && (
                                  <p className="unit-lesson-subtitle">{lesson.metadata.subtitle}</p>
                                )}
                                <div className="unit-lesson-meta">
                                  <span>{lessonStepLabel(lesson)}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>
                                    <Icon name="clock" size={14} />{' '}
                                    <ArabicNumber value={toArabicDigits(lesson.metadata.estimatedMinutes)} /> دقيقة
                                  </span>
                                  {isSaved && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="unit-lesson-saved">
                                        <Icon name="target" size={14} /> موضعك هنا
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                className={`btn btn-small ${isSaved ? 'btn-primary' : 'btn-secondary'} unit-lesson-action`}
                                onClick={() => onSelectLesson(lesson.metadata.id)}
                                aria-label={`${isSaved ? 'تابع' : 'افتح'} الدرس ${lesson.metadata.order}: ${lesson.metadata.title}`}
                              >
                                {isSaved ? 'تابع' : 'افتح'}
                                <Icon name="arrow-left" className="icon-flip" size={16} />
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    )}

                    <footer className="unit-panel-foot">
                      <button
                        type="button"
                        className="btn btn-secondary unit-open-button"
                        onClick={() => onOpenUnit(metadata.id)}
                        aria-label={`عرض دروس ${metadata.title}`}
                      >
                        عرض دروس الوحدة
                        <Icon name="arrow-left" className="icon-flip" size={16} />
                      </button>

                      <div className="unit-panel-assessments" aria-label="المراجعة والاختبار">
                        {review && (
                          <button
                            type="button"
                            className="unit-assessment-link"
                            onClick={() => onOpenReview(metadata.id)}
                          >
                            <Icon name="review" size={16} />
                            <span>
                              <strong>{review.metadata.title}</strong>
                              <small>
                                صفحات{' '}
                                <ArabicNumber value={toArabicDigits(review.metadata.sourcePagesRange.startPage)} />–
                                <ArabicNumber value={toArabicDigits(review.metadata.sourcePagesRange.endPage)} />
                              </small>
                            </span>
                          </button>
                        )}
                        {unitTestReady ? (
                          <button
                            type="button"
                            className="unit-assessment-link unit-assessment-link--exam"
                            onClick={() => onOpenUnitTest(metadata.id)}
                          >
                            <Icon name="exam" size={16} />
                            <span>
                              <strong>اختبار الوحدة</strong>
                              <small>معتمد لهذه الوحدة</small>
                            </span>
                          </button>
                        ) : (
                          <span className="unit-assessment-locked">
                            <Icon name="lock" size={16} />
                            <span>
                              <strong>اختبار الوحدة</strong>
                              <small>يُفتح بعد إعلان اكتمال الوحدة رسميًا</small>
                            </span>
                          </span>
                        )}
                      </div>
                    </footer>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default HomePage;
