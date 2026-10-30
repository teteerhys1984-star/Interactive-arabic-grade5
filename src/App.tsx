import React, { useState } from 'react';
import {
  curriculumRegistry,
  getAllUnits,
  getLessonById,
  getUnitById,
  getUnitReviewByUnitId,
  getUnitReviews,
  isUnitTestAvailable,
} from './data/curriculumRegistry';
import { ALL_ASSESSMENTS, getLessonTestByLessonId, getUnitTestByUnitId } from './data/assessments';
import { LESSON1_TEACHER_GUIDE } from './data/lesson1/teacherGuide';
import { LESSON2_TEACHER_GUIDE } from './data/lesson2/teacherGuide';
import { LESSON3_TEACHER_GUIDE } from './data/lesson3/teacherGuide';
import { U2L1_TEACHER_GUIDE } from './data/unit2Lesson1/teacherGuide';
import { U2L2_TEACHER_GUIDE } from './data/unit2Lesson2/teacherGuide';
import { UnitCard } from './components/curriculum/UnitCard';
import { UnitPage } from './components/curriculum/UnitPage';
import { LessonFlow } from './components/curriculum/LessonFlow';
import { LessonShell } from './components/curriculum/LessonShell';
import { Lesson1StepRenderer } from './components/curriculum/Lesson1StepRenderer';
import { Lesson1IrabPage } from './components/curriculum/Lesson1IrabPage';
import { Unit1ReviewFlow } from './components/curriculum/Unit1ReviewFlow';
import { Unit1ReviewSolutions } from './components/teacher/Unit1ReviewSolutions';
import { TeacherAreaShell } from './components/teacher/TeacherAreaShell';
import { AssessmentShell } from './components/assessment/AssessmentShell';
import { TestSolutions } from './components/assessment/TestSolutions';
import { ArabicNumber, LatinText } from './components/common/BiDi';
import { clearLearningLocation, LearningLocation, readLearningLocation } from './utils/learningProgress';

type NavigationRoute =
  | { view: 'home' }
  | { view: 'unit'; unitId: string }
  | { view: 'lesson'; lessonId: string }
  | { view: 'lesson_test'; lessonId: string }
  | { view: 'unit_test'; unitId: string }
  | { view: 'unit_review'; unitId: string }
  | { view: 'teacher' }
  | { view: 'solutions'; testId?: string };

function getValidLearningLocation(): LearningLocation | null {
  const location = readLearningLocation();
  if (!location) return null;
  const result = getLessonById(location.lessonId);
  const valid =
    result?.unit.metadata.id === location.unitId &&
    result.lesson.steps.some((step) => step.id === location.stepId);
  if (!valid) {
    clearLearningLocation();
    return null;
  }
  return location;
}

const TEACHER_GUIDES = [LESSON1_TEACHER_GUIDE, LESSON2_TEACHER_GUIDE, LESSON3_TEACHER_GUIDE, U2L1_TEACHER_GUIDE, U2L2_TEACHER_GUIDE];

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toArabicDigits = (value: number | string): string =>
  String(value).replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)]);

/**
 * Test-solutions gateway.
 *
 * SECURITY LIMIT (documented honestly): this is a static app published on
 * GitHub Pages. The password check below is a front-end gate only — anyone
 * with access to the JavaScript bundle can still read every answer key. It
 * keeps casual browsing away from the solutions UI; it is NOT a security
 * boundary. The teacher area (`somer173`) is a separate gate with its own key.
 */
const SOLUTIONS_ACCESS_PASSWORD = 'st12';
const SOLUTIONS_UNLOCK_KEY = 'arabic-grade5-solutions-unlocked-v1';

function readSolutionsUnlock(): boolean {
  try {
    return typeof window !== 'undefined' && window.sessionStorage.getItem(SOLUTIONS_UNLOCK_KEY) === 'true';
  } catch {
    return false;
  }
}

function persistSolutionsUnlock(unlocked: boolean): void {
  try {
    if (unlocked) window.sessionStorage.setItem(SOLUTIONS_UNLOCK_KEY, 'true');
    else window.sessionStorage.removeItem(SOLUTIONS_UNLOCK_KEY);
  } catch {
    /* storage unavailable — gate stays per-render */
  }
}

const SolutionsGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleEnter = () => {
    if (password === SOLUTIONS_ACCESS_PASSWORD) {
      persistSolutionsUnlock(true);
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <section className="teacher-login-card" dir="rtl" aria-label="دخول منطقة الحلول">
      <div className="teacher-header-badge">منطقة الحلول</div>
      <h1 className="teacher-title">بوابة حلول الاختبارات</h1>
      <p>أدخل كلمة المرور لعرض حلول اختبارات الدروس واختبار الوحدة.</p>
      <form
        className="teacher-login-form"
        onSubmit={(event) => { event.preventDefault(); handleEnter(); }}
      >
        <label htmlFor="solutions-password">كلمة مرور الحلول</label>
        <input
          id="solutions-password"
          type="password"
          value={password}
          onChange={(event) => { setPassword(event.target.value); setError(false); }}
          autoComplete="off"
          aria-invalid={error}
        />
        {error && <p className="teacher-login-error" role="alert">كلمة المرور غير صحيحة</p>}
        <button className="btn btn-primary" type="submit">دخول منطقة الحلول</button>
      </form>
      <p role="note">
        تنبيه: هذه حماية واجهية فقط في تطبيق ثابت؛ فالمفاتيح موجودة في ملفات
        جافاسكربت المنشورة ويمكن لشخص تقني استخراجها، ولا تُعد حماية أمنية حقيقية.
      </p>
    </section>
  );
};

export const App: React.FC = () => {
  const [route, setRoute] = useState<NavigationRoute>({ view: 'home' });
  const [solutionsUnlocked, setSolutionsUnlocked] = useState<boolean>(() => readSolutionsUnlock());
  /**
   * Lesson 1 only: whether the standalone i‘rab page is shown on top of the lesson.
   * Implemented as an overlay (not a route swap) so the lesson step state survives
   * the round trip lesson → i‘rab → back.
   */
  const [lesson1IrabOpen, setLesson1IrabOpen] = useState<boolean>(false);

  const units = getAllUnits();
  const savedLocation = getValidLearningLocation();

  const handleGoHome = () => {
    setLesson1IrabOpen(false);
    setRoute({ view: 'home' });
  };
  const handleOpenUnit = (unitId: string) => {
    setLesson1IrabOpen(false);
    setRoute({ view: 'unit', unitId });
  };
  const handleSelectLesson = (lessonId: string) => {
    setLesson1IrabOpen(false);
    if (getLessonById(lessonId)) setRoute({ view: 'lesson', lessonId });
  };
  const handleReturnToUnit = (unitId: string) => () => handleOpenUnit(unitId);
  const handleOpenTeacher = () => setRoute({ view: 'teacher' });
  const handleOpenSolutions = () => setRoute({ view: 'solutions' });

  return (
    <div className="app-root" dir="rtl" lang="ar">
      <header className="app-header">
        <div className="header-container">
          <div className="brand-area" onClick={handleGoHome} style={{ cursor: 'pointer' }}>
            <div className="brand-emblem" aria-hidden="true">ض</div>
            <div className="brand-text-block">
              <span className="brand-title">اللغة العربية التفاعلية</span>
              <span className="brand-subtitle">الصف الخامس الأساسي · المنظومة التعليمية</span>
            </div>
          </div>

          <nav className="main-navigation" aria-label="التنقل الرئيسي">
            <button
              type="button"
              className={`nav-link ${['home', 'unit', 'lesson'].includes(route.view) ? 'active' : ''}`}
              onClick={handleGoHome}
            >
              الوحدات والدروس
            </button>
            <button
              type="button"
              className={`nav-link ${route.view === 'solutions' ? 'active' : ''}`}
              onClick={handleOpenSolutions}
            >
              حلول الاختبارات
            </button>
            <button
              type="button"
              className={`nav-link ${route.view === 'teacher' ? 'active' : ''}`}
              onClick={handleOpenTeacher}
            >
              بوابة المعلم والإشراف
            </button>
          </nav>
        </div>
      </header>

      <main className={`app-main ${route.view === 'lesson' ? 'app-main-lesson' : ''}`} id="main-content">
        {route.view === 'home' && (
          <section className="units-section">
            <div className="section-header">
              <h1>الوحدات الدراسية</h1>
              <p>اختر وحدة لعرض دروسها بترتيب المنهج.</p>
            </div>

            {savedLocation ? (
              <section className="learning-resume" aria-label="متابعة التعلّم">
                <div>
                  <span className="learning-resume-kicker">آخر موضع وصلت إليه</span>
                  <h2>{getLessonById(savedLocation.lessonId)?.lesson.metadata.title}</h2>
                  <p>
                    {getUnitById(savedLocation.unitId)?.metadata.title}
                    {' · '}
                    الخطوة{' '}
                    <ArabicNumber
                      value={(getLessonById(savedLocation.lessonId)?.lesson.steps.findIndex((step) => step.id === savedLocation.stepId) ?? -1) + 1}
                    />
                    {' من '}
                    <ArabicNumber value={getLessonById(savedLocation.lessonId)?.lesson.steps.length ?? 0} />
                  </p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => handleSelectLesson(savedLocation.lessonId)}>
                  متابعة التعلّم
                </button>
              </section>
            ) : units[0]?.lessons[0] ? (
              <section className="learning-resume learning-start" aria-label="بداية التعلّم">
                <div>
                  <span className="learning-resume-kicker">بداية واضحة</span>
                  <h2>{units[0].lessons[0].metadata.title}</h2>
                  <p>ابدأ من أول درس مسجل في المنهج.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => handleOpenUnit(units[0].metadata.id)}>
                  ابدأ من أول درس
                </button>
              </section>
            ) : null}

            {units.length === 0 ? (
              <div className="empty-state-card">
                <span className="empty-icon" aria-hidden="true">📚</span>
                <h3>في انتظار تزويد صفحات الكتاب المدرسي</h3>
                <p>لم يتم إدراج أي دروس أو وحدات تخمينية أو وهمية التزاماً بالمعايير الصارمة لنزاهة المنهج.</p>
              </div>
            ) : (
              <div className="units-grid">
                {units.map((unit) => (
                  <UnitCard
                    key={unit.metadata.id}
                    unit={unit}
                    onOpenUnit={() => handleOpenUnit(unit.metadata.id)}
                    hasSavedLocation={savedLocation?.unitId === unit.metadata.id}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {route.view === 'unit' &&
          (() => {
            const unit = getUnitById(route.unitId);
            if (!unit) {
              return (
                <div className="empty-state-card">
                  <h2>الوحدة غير موجودة</h2>
                  <button type="button" className="btn btn-primary" onClick={handleGoHome}>العودة إلى الوحدات</button>
                </div>
              );
            }
            const review = getUnitReviewByUnitId(unit.metadata.id);
            return (
              <UnitPage
                unit={unit}
                review={review}
                savedLocation={savedLocation}
                onGoHome={handleGoHome}
                onSelectLesson={handleSelectLesson}
                onOpenUnitTest={
                  isUnitTestAvailable(unit.metadata.id)
                    ? () => setRoute({ view: 'unit_test', unitId: unit.metadata.id })
                    : undefined
                }
                onOpenReview={
                  review ? () => setRoute({ view: 'unit_review', unitId: unit.metadata.id }) : undefined
                }
              />
            );
          })()}

        {route.view === 'lesson' &&
          (() => {
            const result = getLessonById(route.lessonId);
            if (!result) {
              return (
                <div className="empty-state-card">
                  <h3>الدرس غير موجود</h3>
                  <button type="button" className="btn btn-primary" onClick={handleGoHome}>العودة للقائمة</button>
                </div>
              );
            }
            // Lesson 1 keeps its dedicated source-fidelity renderer while sharing
            // the same lesson shell and unit-level navigation as the other lessons.
            if (result.lesson.metadata.id === 'lesson1') {
              return (
                <>
                  <div hidden={lesson1IrabOpen}>
                    <LessonShell
                      key={result.lesson.metadata.id}
                      lesson={result.lesson}
                      unit={result.unit}
                      onGoHome={handleGoHome}
                      onExit={handleReturnToUnit(result.unit.metadata.id)}
                      onSelectLesson={handleSelectLesson}
                      onOpenTest={() => setRoute({ view: 'lesson_test', lessonId: route.lessonId })}
                      renderStepContent={(step) => (
                        <Lesson1StepRenderer step={step} onOpenIrab={() => setLesson1IrabOpen(true)} />
                      )}
                    />
                  </div>
                  {/* The i‘rab page is an overlay route: LessonShell stays mounted
                      (hidden), so the learner keeps the step they were on when
                      returning from the i‘rab page. */}
                  {lesson1IrabOpen && <Lesson1IrabPage onBack={() => setLesson1IrabOpen(false)} />}
                </>
              );
            }
            return (
              <LessonFlow
                key={result.lesson.metadata.id}
                lesson={result.lesson}
                unit={result.unit}
                onGoHome={handleGoHome}
                onExit={handleReturnToUnit(result.unit.metadata.id)}
                onSelectLesson={handleSelectLesson}
                onOpenTest={() => setRoute({ view: 'lesson_test', lessonId: route.lessonId })}
              />
            );
          })()}

        {route.view === 'lesson_test' &&
          (() => {
            const test = getLessonTestByLessonId(route.lessonId);
            if (!test) {
              return (
                <div className="empty-state-card">
                  <h3>لا يتوفر اختبار لهذا الدرس</h3>
                  <button type="button" className="btn btn-primary" onClick={() => {
                    const lesson = getLessonById(route.lessonId)?.lesson;
                    if (lesson) handleOpenUnit(lesson.metadata.unitId);
                    else handleGoHome();
                  }}>العودة إلى الوحدة</button>
                </div>
              );
            }
            return (
              <AssessmentShell
                test={test}
                onExit={() => setRoute({ view: 'lesson', lessonId: route.lessonId })}
              />
            );
          })()}

        {route.view === 'unit_test' &&
          (() => {
            if (!isUnitTestAvailable(route.unitId)) {
              return (
                <div className="empty-state-card">
                  <h3>اختبار الوحدة غير متاح قبل اكتمال الوحدة رسمياً</h3>
                  <button type="button" className="btn btn-primary" onClick={handleReturnToUnit(route.unitId)}>العودة إلى الوحدة</button>
                </div>
              );
            }
            const test = getUnitTestByUnitId(route.unitId);
            if (!test) {
              return (
                <div className="empty-state-card">
                  <h3>لا يتوفر اختبار لهذه الوحدة</h3>
                  <button type="button" className="btn btn-primary" onClick={handleReturnToUnit(route.unitId)}>العودة إلى الوحدة</button>
                </div>
              );
            }
            return <AssessmentShell test={test} onExit={handleReturnToUnit(route.unitId)} />;
          })()}

        {route.view === 'unit_review' &&
          (() => {
            const review = getUnitReviewByUnitId(route.unitId);
            if (!review) {
              return (
                <div className="empty-state-card">
                  <h3>لا يتوفر تقويم رسمي مسجَّل لهذه الوحدة</h3>
                  <button type="button" className="btn btn-primary" onClick={handleReturnToUnit(route.unitId)}>العودة إلى الوحدة</button>
                </div>
              );
            }
            return <Unit1ReviewFlow review={review} onExit={handleReturnToUnit(route.unitId)} />;
          })()}

        {route.view === 'solutions' &&
          (() => {
            if (!solutionsUnlocked) {
              return <SolutionsGate onUnlock={() => setSolutionsUnlocked(true)} />;
            }
            const lessonTests = ALL_ASSESSMENTS.filter((assessment) => assessment.scope === 'lesson');
            const unitTests = ALL_ASSESSMENTS.filter(
              (assessment) => assessment.scope === 'unit' && isUnitTestAvailable(assessment.unitId),
            );
            const handleLock = () => {
              persistSolutionsUnlock(false);
              setSolutionsUnlocked(false);
            };
            if (!route.testId) {
              return (
                <section className="test-solutions-hub" dir="rtl" aria-label="اختيار حلول اختبار الدرس">
                  <header className="test-solutions-hub-header">
                    <div className="teacher-header-badge">حلول الاختبارات</div>
                    <h1>اختر اختبار الدرس</h1>
                    <p>الحلول تفسيرية ومنفصلة عن واجهة الاختبار، ولا تظهر اختبارات الوحدة قبل اكتمال الوحدة رسمياً. الحماية واجهية فقط في تطبيق ثابت.</p>
                    <button type="button" className="btn btn-ghost" onClick={handleLock}>
                      🔒 قفل منطقة الحلول
                    </button>
                  </header>
                  <div className="test-solutions-hub-list">
                    {lessonTests.map((test) => (
                      <button
                        key={test.id}
                        type="button"
                        className="test-solutions-hub-card"
                        onClick={() => setRoute({ view: 'solutions', testId: test.id })}
                      >
                        <span>حلول اختبار الدرس</span>
                        <strong>{test.title}</strong>
                        <small>{toArabicDigits(test.questions.length)} سؤالاً مع تعليل</small>
                      </button>
                    ))}
                  </div>
                  {unitTests.length > 0 && (
                    <div className="test-solutions-hub-list">
                      <h2 className="solutions-group-title">منطقة مستقلة: حلول اختبار الوحدة</h2>
                      {unitTests.map((test) => (
                        <button
                          key={test.id}
                          type="button"
                          className="test-solutions-hub-card"
                          onClick={() => setRoute({ view: 'solutions', testId: test.id })}
                        >
                          <span>حلول اختبار الوحدة الأولى</span>
                          <strong>{test.title}</strong>
                          <small>{toArabicDigits(test.questions.length)} سؤالاً مع تعليل ومرجع الدرس</small>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              );
            }
            const test = ALL_ASSESSMENTS.find(
              (assessment) =>
                assessment.id === route.testId &&
                (assessment.scope === 'lesson' || (assessment.scope === 'unit' && isUnitTestAvailable(assessment.unitId))),
            );
            if (!test) return null;
            return <TestSolutions test={test} onExit={() => setRoute({ view: 'solutions' })} />;
          })()}

        {route.view === 'teacher' && (
          <TeacherAreaShell
            curriculum={curriculumRegistry}
            teacherGuides={TEACHER_GUIDES}
            tests={ALL_ASSESSMENTS}
            accessPassword="somer173"
            reviewSolutions={getUnitReviews().length > 0 ? <Unit1ReviewSolutions /> : undefined}
            reviewSectionLabel="حلول تقويم الوحدة الأولى"
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2026 اللغة العربية التفاعلية - الصف الخامس الأساسي. جميع الحقوق محفوظة للمنهج المعتمد.</p>
          <p>
            بيئة العمل: <LatinText>React 18 + TypeScript + Vite</LatinText> | نشر على <LatinText>GitHub Pages</LatinText>
          </p>
        </div>
      </footer>
    </div>
  );
};
