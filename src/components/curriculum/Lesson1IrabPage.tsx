import React from 'react';
import './lesson1.css';
import { LESSON1_IRAB_PAGE, IRAB_ISSUE_REGISTER } from '../../data/lesson1/irabPage';
import { SourceBadge } from '../common/SourceBadge';
import { ArabicNumber } from '../common/BiDi';

/**
 * Lesson1IrabPage — the standalone i‘rab page for Lesson 1.
 *
 * OWNER DECISIONS ENCODED HERE:
 *  - The core set is exactly the 19 documented sentences; each carries its textbook
 *    source reference, and the analysis itself is labelled platform teaching support.
 *  - «عندي خمسةُ أولادٍ وزوجةٌ يحتاجون إلى طعامٍ كثيرٍ» is NOT in the core set: it
 *    sits in «سجلّ الإشكالات» with the reason for exclusion, and no settled analysis
 *    is shown for it (the uncontested morphology stays in the data layer for audit).
 *  - Non-adopted readings/attachments are listed as notes, never as answers.
 */

export interface Lesson1IrabPageProps {
  onBack: () => void;
}

export const Lesson1IrabPage: React.FC<Lesson1IrabPageProps> = ({ onBack }) => (
  <div className="lesson1-irab" dir="rtl">
    <header className="irab-head">
      <div>
        <h2>الإعراب التطبيقي — الدرس الأول «السَّمَكَةُ الذَّهَبِيَّةُ»</h2>
        <p>
          <ArabicNumber value={LESSON1_IRAB_PAGE.length} /> جملةً من جمل الدرس، معربةً كلمةً كلمة.
          الجملُ من الكتاب، والإعرابُ شرحُ المنصة التعليمي.
        </p>
      </div>
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        ← العودة إلى خطوات الدرس
      </button>
    </header>

    <div className="l1-badges">
      <span className="l1-badge l1-badge--printed">الجمل: من النصّ المطبوع</span>
      <span className="l1-badge l1-badge--platform">الإعراب: شرح المنصة</span>
      <span className="l1-badge l1-badge--pending">
        سجلّ الإشكالات: <ArabicNumber value={IRAB_ISSUE_REGISTER.length} /> جمل مستبعدة
      </span>
    </div>

    {LESSON1_IRAB_PAGE.map((sentence) => (
      <section key={sentence.id} className="irab-sentence" aria-labelledby={`${sentence.id}-text`}>
        <header className="block-source-head">
          <span className="source-label-original">الجملة من الكتاب</span>
          <SourceBadge source={sentence.source} />
        </header>
        <h3 className="irab-sentence-text" id={`${sentence.id}-text`}>
          <ArabicNumber value={sentence.id.replace('irp-', '')} />. {sentence.sentence}
        </h3>
        <p className="irab-teaching">
          <strong>الهدف التعليمي:</strong> {sentence.teachingPoint}
        </p>
        <div className="l1-table-wrap">
          <table className="l1-table">
            <caption className="visually-hidden">إعراب الجملة كلمةً كلمة</caption>
            <thead>
              <tr>
                <th scope="col">الكلمة</th>
                <th scope="col">الوظيفة</th>
                <th scope="col">الإعراب</th>
                <th scope="col">العلامة وسببها</th>
              </tr>
            </thead>
            <tbody>
              {sentence.words.map((word) => (
                <tr key={word.w}>
                  <td>{word.w}</td>
                  <td>{word.fn}</td>
                  <td>{word.ir}</td>
                  <td>{word.sg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sentence.note && (
          <p className="irab-note">
            <strong>ملاحظة تدقيقية (أوجه غير معتمدة):</strong> {sentence.note}
          </p>
        )}
      </section>
    ))}

    <section className="irab-register" aria-labelledby="irab-register-title">
      <h3 id="irab-register-title">سجلّ الإشكالات — جمل مستبعدة من الإعراب الأساسي</h3>
      <p>
        هذه الجمل واردة في الكتاب، لكنّ لها أوجهًا لم يُعتمد واحدٌ منها بقرارٍ صريح أو بتوثيقٍ
        متخصص، لذلك لا يُعرض لها إعرابٌ محسوم للطالب. السجلّ للمعلّم والتدقيق فقط.
      </p>
      {IRAB_ISSUE_REGISTER.map((entry) => (
        <article key={entry.id} className="irab-register-item">
          <div className="l1-badges">
            <span className="l1-badge l1-badge--pending">
              {entry.id} — صفحة <ArabicNumber value={entry.page} />
            </span>
          </div>
          <p className="irab-register-sentence">{entry.sentence}</p>
          <p className="irab-register-reason">
            <strong>سبب الاستبعاد:</strong> {entry.reason}
          </p>
        </article>
      ))}
      <p className="irab-note">
        إعادة إدراج أيّ جملة من هذا السجلّ تتطلّب اعتمادًا صريحًا من صاحب المشروع أو توثيقًا
        متخصصًا للوجه المختار، وعندها تُضاف جملةٌ جديدة إلى الصفحة الأساسية.
      </p>
    </section>

    <div className="l1-actions">
      <button type="button" className="btn btn-primary" onClick={onBack}>
        ← العودة إلى خطوات الدرس
      </button>
    </div>
  </div>
);

export default Lesson1IrabPage;
