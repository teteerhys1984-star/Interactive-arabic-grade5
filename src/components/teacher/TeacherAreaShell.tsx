import React, { useState } from 'react';
import { AssessmentTest, CurriculumRegistry, TeacherLessonGuide } from '../../types/curriculum';
import { auditCurriculum, AuditReport } from '../../utils/audit';
import { ArabicNumber, LatinText } from '../common/BiDi';

export interface TeacherAreaShellProps {
  curriculum: CurriculumRegistry;
  teacherGuides?: TeacherLessonGuide[];
  tests?: AssessmentTest[];
  /** Client-side access gate for the separate Teacher Area. */
  accessPassword?: string;
}

export const TeacherAreaShell: React.FC<TeacherAreaShellProps> = ({
  curriculum,
  teacherGuides = [],
  tests = [],
  accessPassword = 'somer173',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'solutions'>('overview');
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const auditReport: AuditReport = auditCurriculum(curriculum, tests, teacherGuides);

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === accessPassword) {
      setIsAuthorized(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  if (!isAuthorized) {
    return (
      <section className="teacher-login-card" dir="rtl" aria-label="دخول بوابة المعلم">
        <div className="teacher-header-badge">بوابة المعلم والإشراف</div>
        <h1 className="teacher-title">دخول منطقة المعلم</h1>
        <p>هذه المنطقة منفصلة عن مساحة الطالب وتضم الحلول والتدقيق التربوي.</p>
        <form className="teacher-login-form" onSubmit={handlePasswordSubmit}>
          <label htmlFor="teacher-password">كلمة مرور المعلم</label>
          <input
            id="teacher-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            aria-invalid={passwordError}
          />
          {passwordError && <p className="teacher-login-error" role="alert">كلمة المرور غير صحيحة.</p>}
          <button className="btn btn-primary" type="submit">دخول بوابة المعلم</button>
        </form>
      </section>
    );
  }

  return (
    <section className="teacher-area-container" dir="rtl" aria-label="بوابة المعلم والإشراف">
      {/* Header */}
      <header className="teacher-header">
        <div className="teacher-header-badge">لوحة المعلم والإشراف التربوي</div>
        <h1 className="teacher-title">بوابة المعلم ومنظومة التحقق والتفسيرات</h1>
        <p className="teacher-description">
          فضاء مستقل مخصص للأدلة التربوية، الحلول النموذجية المفصلة، ومطابقة مصادر الكتاب المدرسي وتدقيق جودة المحتوى.
        </p>

        {/* Navigation Tabs */}
        <nav className="teacher-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'overview'}
            className={`tab-btn ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            نظرة عامة على المنهج
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'solutions'}
            className={`tab-btn ${activeTab === 'solutions' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('solutions')}
          >
            الأدلة وحلول التدريبات
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'audit'}
            className={`tab-btn ${activeTab === 'audit' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            مدقق الجودة والنزاهة ({auditReport.issues.length})
          </button>
        </nav>
      </header>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="teacher-tab-content">
          <div className="teacher-info-grid">
            <div className="info-box">
              <h3>الصف الدراسي</h3>
              <p className="highlight-text">الصف الخامس الأساسي</p>
            </div>
            <div className="info-box">
              <h3>الوحدات المسجلة</h3>
              <p className="highlight-text">
                <ArabicNumber value={curriculum.units.length} /> وحدات
              </p>
            </div>
            <div className="info-box">
              <h3>حالة المحتوى الدراسي</h3>
              <p className="highlight-text">
                {curriculum.units.length === 0
                  ? 'في انتظار اعتماد أوراق الكتاب المدرسي'
                  : 'قيد التدريس المعتمد'}
              </p>
            </div>
          </div>

          <div className="policy-callout">
            <h4>قاعدة اكتمال الوحدة الرسمية:</h4>
            <p>
              لا يُعتبر أي درس هو الأخير تلقائياً، ولا يتم تفعيل اختبارات الوحدة الشاملة (50-60 سؤالاً) إلا بإعلان صريح ومعتمد من مالك المشروع بأن الوحدة قد اكتملت تماماً.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Solutions */}
      {activeTab === 'solutions' && (
        <div className="teacher-tab-content">
          {teacherGuides.length === 0 ? (
            <div className="empty-state-card">
              <span className="empty-icon" aria-hidden="true">📑</span>
              <h3>لا توجد حلول أو أدلة مدرجة حالياً</h3>
              <p>
                ستُدرج الحلول النموذجية المفصلة وشروحات القواعد وتصويبات الأخطاء الشائعة فور استلام صور وصفحات الكتاب المدرسي وتفريغها رسمياً.
              </p>
            </div>
          ) : (
            <div className="solutions-list">
              {teacherGuides.map((guide) => (
                <div key={guide.lessonId} className="teacher-guide">
                  <h3 className="guide-title">دليل الدرس: الحلول النموذجية المفصلة</h3>
                  <div className="guide-objectives">
                    <h4>الأهداف التربوية</h4>
                    <ul>
                      {guide.pedagogicalObjectives.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>
                  {guide.sourceCoverage && (
                    <details className="teacher-coverage-ledger">
                      <summary>
                        سجل تغطية المصدر: <ArabicNumber value={guide.sourceCoverage.length} /> نشاطاً
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
                                <td><ArabicNumber value={entry.pageNumber} /></td>
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
                  {guide.exerciseSolutions.map((sol, i) => (
                    <article key={i} className="guide-solution-card">
                      <header className="guide-solution-head">
                        <span className="guide-ex-name">{sol.sourceExercise}</span>
                        <span className="guide-page">صفحة <ArabicNumber value={sol.pageNumber} /></span>
                      </header>
                      <p className="guide-answer">الحل النموذجي: {sol.officialSolution}</p>
                      <p className="guide-explain">الشرح التربوي: {sol.didacticExplanation}</p>
                      {sol.commonStudentMistakes?.map((m, j) => (
                        <p key={j} className="guide-mistake">⚠ {m}</p>
                      ))}
                    </article>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Content Audit */}
      {activeTab === 'audit' && (
        <div className="teacher-tab-content">
          <div className="audit-header-panel">
            <h3>نتائج الفحص الآلي للمحتوى والنزاهة التعليمية</h3>
            <p className="audit-timestamp">
              آخر تدقيق: <LatinText>{auditReport.timestamp}</LatinText>
            </p>
          </div>

          <div className="audit-metrics-row">
            <div className="audit-metric-card">
              <span className="metric-num"><ArabicNumber value={auditReport.totalUnits} /></span>
              <span className="metric-txt">الوحدات</span>
            </div>
            <div className="audit-metric-card">
              <span className="metric-num"><ArabicNumber value={auditReport.totalLessons} /></span>
              <span className="metric-txt">الدروس</span>
            </div>
            <div className="audit-metric-card">
              <span className="metric-num"><ArabicNumber value={auditReport.errorsCount} /></span>
              <span className="metric-txt">أخطاء حرجة</span>
            </div>
            <div className="audit-metric-card">
              <span className="metric-num"><ArabicNumber value={auditReport.warningsCount} /></span>
              <span className="metric-txt">تنبيهات</span>
            </div>
          </div>

          {auditReport.status === 'empty_state' ? (
            <div className="audit-empty-banner">
              ✓ السجل خاوٍ حالياً ولا يحتوي على أي بيانات وهمية أو مناهج مفبركة. النظام جاهز لاستقبال صفحات الكتاب فور ورودها.
            </div>
          ) : auditReport.issues.length === 0 ? (
            <div className="audit-success-banner">
              ✓ كل عناصر المنهج والاختبارات ومصادر الصفحات مطابقة تماماً للقواعد المعتمدة.
            </div>
          ) : (
            <div className="audit-issues-list">
              {auditReport.issues.map((issue, idx) => (
                <div key={idx} className={`audit-issue-card issue-${issue.severity}`}>
                  <span className="issue-severity-badge">
                    {issue.severity === 'error' ? 'خطأ حرج' : 'تنبيه'}
                  </span>
                  <span className="issue-category">[{issue.category}]</span>
                  <p className="issue-msg">{issue.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
