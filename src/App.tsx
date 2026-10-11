import React, { useState } from 'react';
import { curriculumRegistry, getAllUnits, getLessonById, isUnitTestAvailable } from './data/curriculumRegistry';
import { ALL_ASSESSMENTS, getLessonTestByLessonId, getUnitTestByUnitId } from './data/assessments';
import { LESSON1_TEACHER_GUIDE } from './data/lesson1/teacherGuide';
import { LESSON2_TEACHER_GUIDE } from './data/lesson2/teacherGuide';
import { LESSON3_TEACHER_GUIDE } from './data/lesson3/teacherGuide';
import { UnitCard } from './components/curriculum/UnitCard';
import { LessonFlow } from './components/curriculum/LessonFlow';
import { TeacherAreaShell } from './components/teacher/TeacherAreaShell';
import { AssessmentShell } from './components/assessment/AssessmentShell';
import { TestSolutions } from './components/assessment/TestSolutions';
import { LatinText } from './components/common/BiDi';

type NavigationRoute =
  | { view: 'home' }
  | { view: 'lesson'; lessonId: string }
  | { view: 'lesson_test'; lessonId: string }
  | { view: 'unit_test'; unitId: string }
  | { view: 'teacher' }
  | { view: 'solutions'; testId?: string };

const TEACHER_GUIDES = [LESSON1_TEACHER_GUIDE, LESSON2_TEACHER_GUIDE, LESSON3_TEACHER_GUIDE];

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

  const units = getAllUnits();

  const handleGoHome = () => setRoute({ view: 'home' });
  const handleSelectLesson = (lessonId: string) => setRoute({ view: 'lesson', lessonId });
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
              className={`nav-link ${route.view === 'home' ? 'active' : ''}`}
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
              <h2>خطة وحدات المنهج الدراسي</h2>
              <p>سجل الوحدات الدراسية المعتمدة المستخرجة من الكتاب المدرسي الرسمي.</p>
            </div>

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
                    onSelectLesson={handleSelectLesson}
                    onOpenUnitTest={
                      isUnitTestAvailable(unit.metadata.id)
                        ? () => setRoute({ view: 'unit_test', unitId: unit.metadata.id })
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}

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
            return (
              <LessonFlow
                lesson={result.lesson}
                onExit={handleGoHome}
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
                  <button type="button" className="btn btn-primary" onClick={handleGoHome}>العودة</button>
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
                  <button type="button" className="btn btn-primary" onClick={handleGoHome}>العودة</button>
                </div>
              );
            }
            const test = getUnitTestByUnitId(route.unitId);
            if (!test) {
              return (
                <div className="empty-state-card">
                  <h3>لا يتوفر اختبار لهذه الوحدة</h3>
                  <button type="button" className="btn btn-primary" onClick={handleGoHome}>العودة</button>
                </div>
              );
            }
            return <AssessmentShell test={test} onExit={handleGoHome} />;
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
