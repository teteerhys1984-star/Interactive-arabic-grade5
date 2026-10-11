import React from 'react';
import { AssessmentQuestion, AssessmentTest } from '../../types/curriculum';
import { ArabicNumber, LatinText } from '../common/BiDi';

/**
 * Independent «حلول الاختبارات» section — NOT the Teacher Area.
 * Shows 20/20 solutions, each with the correct answer, explanation and the tested
 * concept, organised in groups (1–5, 6–10, 11–15, 16–20).
 */

function correctAnswerText(q: AssessmentQuestion): string {
  switch (q.type) {
    case 'single_choice':
    case 'true_false':
    case 'reading_comprehension':
    case 'grammar_application':
    case 'vocabulary_in_context': {
      const c = q.choices.find((ch) => ch.id === q.correctChoiceId);
      return c ? c.text : '';
    }
    case 'multi_select':
      return q.choices.filter((ch) => q.correctChoiceIds.includes(ch.id)).map((c) => c.text).join('، ');
    case 'fill_blank':
    case 'text_input':
    case 'sentence_correction':
      return q.acceptedAnswers[0] || '';
    case 'ordering':
      return q.correctOrderIds.map((id) => q.items.find((i) => i.id === id)?.text).filter(Boolean).join(' ← ');
    case 'matching':
      return q.pairs.map((p) => `${p.left} = ${p.right}`).join('، ');
    case 'classification':
      return q.items
        .map((i) => `${i.text} ← ${q.categories.find((c) => c.id === i.correctCategoryId)?.label}`)
        .join('، ');
    case 'error_analysis':
      return q.correctedSegment;
    default:
      return '';
  }
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
function toArabicDigits(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)]);
}

/** Lesson tests keep their 5-question groups; the 50-question unit test is grouped by tens. */
function buildGroups(test: AssessmentTest): { label: string; from: number; to: number }[] {
  const size = test.scope === 'unit' ? 10 : 5;
  const total = test.questions.length;
  const groups: { label: string; from: number; to: number }[] = [];
  for (let from = 1; from <= total; from += size) {
    const to = Math.min(from + size - 1, total);
    groups.push({ label: `الأسئلة ${toArabicDigits(from)}–${toArabicDigits(to)}`, from, to });
  }
  return groups;
}

export const TestSolutions: React.FC<{ test: AssessmentTest; onExit?: () => void }> = ({ test, onExit }) => {
  const sorted = [...test.questions].sort((a, b) => a.order - b.order);
  const GROUPS = buildGroups(test);

  return (
    <section className="test-solutions-container" dir="rtl" aria-label="حلول الاختبارات">
      <header className="test-solutions-header">
        <div className="teacher-header-badge">حلول الاختبارات</div>
        <h1 className="teacher-title">حلول {test.title}</h1>
        <p className="teacher-description">
          جميعُ الحلولِ (<ArabicNumber value={sorted.length} /> مِنْ <ArabicNumber value={sorted.length} />) مَعَ التَّعليلِ وَالمَفْهومِ المُخْتَبَرِ.
        </p>
        {onExit && (
          <button type="button" className="btn btn-ghost" onClick={onExit}>← العودة</button>
        )}
      </header>

      {GROUPS.map((g) => {
        const inGroup = sorted.filter((q) => q.order >= g.from && q.order <= g.to);
        if (inGroup.length === 0) return null;
        return (
          <div key={g.label} className="solutions-group">
            <h2 className="solutions-group-title">{g.label}</h2>
            {inGroup.map((q) => (
              <article key={q.id} className="solution-card">
                <header className="solution-card-head">
                  <span className="solution-order">
                    سؤال <ArabicNumber value={q.order} />
                  </span>
                  <span className="solution-skill">{q.testedSkill}</span>
                </header>
                <p className="solution-question">{q.prompt}</p>
                <p className="solution-answer">✔ الإجابَةُ الصَّحيحَةُ: {correctAnswerText(q)}</p>
                <p className="solution-explanation">التَّعليلُ: {q.explanation}</p>
                <p className="solution-source">
                  المَرْجِعُ: صفحة <ArabicNumber value={q.source.pageNumber} />
                  {q.source.sectionName ? ` — ${q.source.sectionName}` : ''} <LatinText>({q.id})</LatinText>
                </p>
              </article>
            ))}
          </div>
        );
      })}
    </section>
  );
};
