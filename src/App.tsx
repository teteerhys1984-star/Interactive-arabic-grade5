import React, { useState } from 'react';
import { curriculumRegistry, getAllUnits, getLessonById } from './data/curriculumRegistry';
import { UnitCard } from './components/curriculum/UnitCard';
import { LessonShell } from './components/curriculum/LessonShell';
import { TeacherAreaShell } from './components/teacher/TeacherAreaShell';
import { LatinText } from './components/common/BiDi';

type NavigationRoute =
  | { view: 'home' }
  | { view: 'lesson'; lessonId: string }
  | { view: 'lesson_test'; lessonId: string }
  | { view: 'unit_test'; unitId: string }
  | { view: 'teacher' };

export const App: React.FC = () => {
  const [route, setRoute] = useState<NavigationRoute>({ view: 'home' });

  const units = getAllUnits();

  // Navigation handlers
  const handleGoHome = () => setRoute({ view: 'home' });
  const handleSelectLesson = (lessonId: string) => setRoute({ view: 'lesson', lessonId });
  const handleOpenTeacher = () => setRoute({ view: 'teacher' });

  return (
    <div className="app-root" dir="rtl" lang="ar">
      {/* Platform Header */}
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
              className={`nav-link ${route.view === 'teacher' ? 'active' : ''}`}
              onClick={handleOpenTeacher}
            >
              بوابة المعلم والإشراف
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="app-main" id="main-content">
        {route.view === 'home' && (
          <section className="units-section">
            {/* Foundation Status Banner */}
            <div className="foundation-status-banner" role="status">
              <span className="banner-icon" aria-hidden="true">🏛️</span>
              <div className="banner-content">
                <h2>مرحلة التأسيس الهيكلي والتقني (Foundation Phase)</h2>
                <p>
                  تم بناء وتأكيد البنية التحتية البرمجية، ونظام التحقق من المقروئية، ونظام الاختبارات (20 سؤالاً للدرس / 50-60 للوحدة)، وقواعد الاتجاه (RTL)، وهوية التصميم.
                </p>
                <ul className="banner-checklist">
                  <li>✓ لا يوجد أي محتوى دراسي أو وحدات مفبركة</li>
                  <li>✓ قاعدة اكتمال الوحدة الصريحة مشفرة بالكامل</li>
                  <li>✓ مسار النشر لـ GitHub Pages (<LatinText>/Interactive-arabic-grade5/</LatinText>) مفعّل</li>
                  <li>✓ بانتظار استلام صور ومسح صفحات الكتاب المدرسي الرسمي للبدء في تفريغ المحتوى</li>
                </ul>
              </div>
            </div>

            <div className="section-header">
              <h2>خطة وحدات المنهج الدراسي</h2>
              <p>سجل الوحدات الدراسية المعتمدة المستخرجة من الكتاب المدرسي الرسمي.</p>
            </div>

            {units.length === 0 ? (
              <div className="empty-state-card">
                <span className="empty-icon" aria-hidden="true">📚</span>
                <h3>في انتظار تزويد صفحات الكتاب المدرسي</h3>
                <p>
                  لم يتم إدراج أي دروس أو وحدات تخمينية أو وهمية التزاماً بالمعايير الصارمة لنزاهة المنهج. سيبدأ استخراج الهيكل الدراسي فور رفع صور الكتاب واعتماد تقرير المقروئية.
                </p>
              </div>
            ) : (
              <div className="units-grid">
                {units.map((unit) => (
                  <UnitCard
                    key={unit.metadata.id}
                    unit={unit}
                    onSelectLesson={handleSelectLesson}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {route.view === 'lesson' && (
          (() => {
            const result = getLessonById(route.lessonId);
            if (!result) {
              return (
                <div className="empty-state-card">
                  <h3>الدرس غير موجود</h3>
                  <button type="button" className="btn btn-primary" onClick={handleGoHome}>
                    العودة للقائمة
                  </button>
                </div>
              );
            }
            return (
              <LessonShell
                lesson={result.lesson}
                onExit={handleGoHome}
                onOpenTest={() => setRoute({ view: 'lesson_test', lessonId: route.lessonId })}
              />
            );
          })()
        )}

        {route.view === 'teacher' && (
          <TeacherAreaShell curriculum={curriculumRegistry} />
        )}
      </main>

      {/* Footer */}
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
