import React, { useState } from 'react';
import { curriculumRegistry, getAllUnits, getLessonById, isUnitTestAvailable } from './data/curriculumRegistry';
import { ALL_ASSESSMENTS, getLessonTestByLessonId } from './data/assessments';
import { LESSON1_TEACHER_GUIDE } from './data/lesson1/teacherGuide';
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
  | { view: 'solutions' };

const TEACHER_GUIDES = [LESSON1_TEACHER_GUIDE];

export const App: React.FC = () => {
  const [route, setRoute] = useState<NavigationRoute>({ view: 'home' });

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
                  <UnitCard key={unit.metadata.id} unit={unit} onSelectLesson={handleSelectLesson} />
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
                  <h3>اختبار الوحدة غير مفعّل</h3>
                  <p>لا يُتاح اختبار الوحدة إلا بعد إعلان المالك صراحةً أن الوحدة مكتملة.</p>
                  <button type="button" className="btn btn-primary" onClick={handleGoHome}>العودة</button>
                </div>
              );
            }
            return null;
          })()}

        {route.view === 'solutions' &&
          (() => {
            const test = getLessonTestByLessonId('lesson1');
            if (!test) return null;
            return <TestSolutions test={test} onExit={handleGoHome} />;
          })()}

        {route.view === 'teacher' && (
          <TeacherAreaShell
            curriculum={curriculumRegistry}
            teacherGuides={TEACHER_GUIDES}
            tests={ALL_ASSESSMENTS}
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
