import React from 'react';
import { AssessmentQuestion, UserAnswerValue } from '../../types/curriculum';
import { ArabicNumber } from '../common/BiDi';
import { SourceBadge } from '../common/SourceBadge';

export interface QuestionRendererProps {
  question: AssessmentQuestion;
  userAnswer?: UserAnswerValue;
  onAnswerChange?: (answer: UserAnswerValue) => void;
  showReview?: boolean;
  isCorrect?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  showReview = false,
  isCorrect = false,
}) => {
  const isDisabled = showReview || !onAnswerChange;

  return (
    <article
      className={`question-card ${
        showReview ? (isCorrect ? 'question-correct' : 'question-incorrect') : ''
      }`}
      aria-labelledby={`q-title-${question.id}`}
    >
      <header className="question-header">
        <div className="question-badge-row">
          <span className="question-order-badge">
            السؤال <ArabicNumber value={question.order} />
          </span>
          <span className="question-skill-badge">{question.testedSkill}</span>
          <SourceBadge source={question.source} compact />
        </div>

        {showReview && (
          <div
            className={`review-status-tag ${
              isCorrect ? 'status-correct' : 'status-incorrect'
            }`}
            role="status"
          >
            {isCorrect ? '✓ إجابة صحيحة' : '✗ إجابة غير صحيحة'}
          </div>
        )}
      </header>

      {question.passageContext && (
        <blockquote className="question-passage-context" lang="ar">
          {question.passageContext}
        </blockquote>
      )}

      <h3 id={`q-title-${question.id}`} className="question-prompt">
        {question.prompt}
      </h3>

      {/* RENDER BY TYPE */}
      <div className="question-body">
        {(question.type === 'single_choice' ||
          question.type === 'true_false' ||
          question.type === 'reading_comprehension' ||
          question.type === 'grammar_application' ||
          question.type === 'vocabulary_in_context') && (
          <div className="choice-list" role="radiogroup" aria-label={question.prompt}>
            {question.choices.map((choice) => {
              const isSelected = userAnswer === choice.id;
              const isTheCorrectChoice = showReview && choice.id === question.correctChoiceId;
              let choiceClass = 'choice-option';
              if (isSelected) choiceClass += ' choice-selected';
              if (showReview) {
                if (isTheCorrectChoice) choiceClass += ' choice-review-correct';
                else if (isSelected && !isCorrect) choiceClass += ' choice-review-wrong';
              }

              return (
                <label key={choice.id} className={choiceClass}>
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value={choice.id}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => onAnswerChange && onAnswerChange(choice.id)}
                    aria-checked={isSelected}
                  />
                  <span className="choice-text">{choice.text}</span>
                  {showReview && isTheCorrectChoice && (
                    <span className="choice-correct-mark" aria-label="الإجابة الصحيحة">
                      ✓ (الإجابة المعتمدة)
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}

        {question.type === 'multi_select' && (
          <div className="choice-list" role="group" aria-label={question.prompt}>
            <p className="instruction-hint">اختر كل الإجابات الصحيحة المنطبقة:</p>
            {question.choices.map((choice) => {
              const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
              const isChecked = currentAnswers.includes(choice.id);
              const isTargetChoice = showReview && question.correctChoiceIds.includes(choice.id);

              return (
                <label key={choice.id} className={`choice-option ${isChecked ? 'choice-selected' : ''}`}>
                  <input
                    type="checkbox"
                    name={`q-${question.id}`}
                    value={choice.id}
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={(e) => {
                      if (!onAnswerChange) return;
                      if (e.target.checked) {
                        onAnswerChange([...currentAnswers, choice.id]);
                      } else {
                        onAnswerChange(currentAnswers.filter((id) => id !== choice.id));
                      }
                    }}
                  />
                  <span className="choice-text">{choice.text}</span>
                  {showReview && isTargetChoice && (
                    <span className="choice-correct-mark">✓ خيار صحيح</span>
                  )}
                </label>
              );
            })}
          </div>
        )}

        {(question.type === 'fill_blank' ||
          question.type === 'text_input' ||
          question.type === 'sentence_correction') && (
          <div className="text-answer-group">
            <label htmlFor={`input-${question.id}`} className="input-label">
              اكتب الإجابة المطلوبة:
            </label>
            <input
              id={`input-${question.id}`}
              type="text"
              className="text-input-field"
              value={typeof userAnswer === 'string' ? userAnswer : ''}
              disabled={isDisabled}
              placeholder="اكتب هنا..."
              onChange={(e) => onAnswerChange && onAnswerChange(e.target.value)}
              dir="auto"
            />
            {showReview && (
              <div className="review-accepted-answers">
                <strong>الإجابة المقبولة: </strong>
                <span>{question.acceptedAnswers.join(' / ')}</span>
              </div>
            )}
          </div>
        )}

        {question.type === 'ordering' && (() => {
          const currentOrder = Array.isArray(userAnswer) && userAnswer.length > 0
            ? userAnswer
            : question.items.map((item) => item.id);
          const moveItem = (index: number, direction: -1 | 1) => {
            if (!onAnswerChange) return;
            const destination = index + direction;
            if (destination < 0 || destination >= currentOrder.length) return;
            const next = [...currentOrder];
            [next[index], next[destination]] = [next[destination], next[index]];
            onAnswerChange(next);
          };

          return (
            <div className="ordering-view">
              <p className="instruction-hint">رتّب العناصر باستعمال السهمين، ثم أكّد ترتيبك.</p>
              <div className="ordering-items">
                {currentOrder.map((id, idx) => {
                  const item = question.items.find((candidate) => candidate.id === id);
                  if (!item) return null;
                  return (
                    <div key={item.id} className="order-item-row">
                      <span className="order-number"><ArabicNumber value={idx + 1} /></span>
                      <span className="order-text">{item.text}</span>
                      <span className="question-order-controls">
                        <button type="button" onClick={() => moveItem(idx, -1)} disabled={isDisabled || idx === 0} aria-label={`رفع ${item.text}`}>↑</button>
                        <button type="button" onClick={() => moveItem(idx, 1)} disabled={isDisabled || idx === currentOrder.length - 1} aria-label={`خفض ${item.text}`}>↓</button>
                      </span>
                    </div>
                  );
                })}
              </div>
              {!isDisabled && (
                <button type="button" className="btn btn-secondary btn-small" onClick={() => onAnswerChange && onAnswerChange(currentOrder)}>
                  تأكيد الترتيب
                </button>
              )}
              {showReview && (
                <div className="review-accepted-answers">
                  <strong>الترتيب المعتمد: </strong>
                  {question.correctOrderIds.map((id) => question.items.find((item) => item.id === id)?.text).filter(Boolean).join(' ← ')}
                </div>
              )}
            </div>
          );
        })()}

        {question.type === 'matching' && (() => {
          const selections = typeof userAnswer === 'object' && !Array.isArray(userAnswer)
            ? userAnswer as Record<string, string>
            : {};
          const rightOptions = [...new Set(question.pairs.map((pair) => pair.right))];
          return (
            <div className="matching-view">
              <p className="instruction-hint">اختر المقابل المناسب لكل عنصر.</p>
              <div className="matching-grid">
                {question.pairs.map((pair) => (
                  <label key={pair.id} className="matching-pair-row" htmlFor={`match-${question.id}-${pair.id}`}>
                    <span className="matching-left">{pair.left}</span>
                    <span className="matching-arrow" aria-hidden="true">←</span>
                    <select
                      id={`match-${question.id}-${pair.id}`}
                      value={selections[pair.left] || ''}
                      disabled={isDisabled}
                      onChange={(event) => onAnswerChange && onAnswerChange({ ...selections, [pair.left]: event.target.value })}
                    >
                      <option value="">اختر المقابل</option>
                      {rightOptions.map((right) => <option key={right} value={right}>{right}</option>)}
                    </select>
                  </label>
                ))}
              </div>
              {showReview && (
                <div className="review-accepted-answers">
                  <strong>الأزواج المعتمدة: </strong>
                  {question.pairs.map((pair) => `${pair.left} = ${pair.right}`).join('، ')}
                </div>
              )}
            </div>
          );
        })()}

        {question.type === 'classification' && (() => {
          const selections = typeof userAnswer === 'object' && !Array.isArray(userAnswer)
            ? userAnswer as Record<string, string>
            : {};
          return (
            <div className="classification-view">
              <p className="instruction-hint">اختر الفئة المناسبة لكل عنصر.</p>
              <div className="classification-interaction-list">
                {question.items.map((item) => (
                  <label key={item.id} className="classification-interaction-row" htmlFor={`classification-${question.id}-${item.id}`}>
                    <span>{item.text}</span>
                    <select
                      id={`classification-${question.id}-${item.id}`}
                      value={selections[item.id] || ''}
                      disabled={isDisabled}
                      onChange={(event) => onAnswerChange && onAnswerChange({ ...selections, [item.id]: event.target.value })}
                    >
                      <option value="">اختر الفئة</option>
                      {question.categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                    </select>
                  </label>
                ))}
              </div>
              {showReview && (
                <div className="review-accepted-answers">
                  <strong>التصنيف المعتمد: </strong>
                  {question.items.map((item) => `${item.text} ← ${question.categories.find((category) => category.id === item.correctCategoryId)?.label}`).join('، ')}
                </div>
              )}
            </div>
          );
        })()}

        {question.type === 'error_analysis' && (
          <div className="error-analysis-view">
            <div className="original-sentence-box">
              <span className="tag-label">النص قبل التصويب:</span>
              <p>{question.originalSentence}</p>
            </div>
            {question.correctionOptions ? (
              <div className="choice-list" role="radiogroup" aria-label={question.prompt}>
                {question.correctionOptions.map((choice) => {
                  const selected = userAnswer === choice.id;
                  const correct = showReview && choice.id === question.correctOptionId;
                  return (
                    <label key={choice.id} className={`choice-option ${selected ? 'choice-selected' : ''} ${correct ? 'choice-review-correct' : ''}`}>
                      <input
                        type="radio"
                        name={`q-${question.id}`}
                        value={choice.id}
                        checked={selected}
                        disabled={isDisabled}
                        onChange={() => onAnswerChange && onAnswerChange(choice.id)}
                      />
                      <span className="choice-text">{choice.text}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <label className="text-answer-group" htmlFor={`error-${question.id}`}>
                <span className="input-label">اكتب التصويب:</span>
                <input
                  id={`error-${question.id}`}
                  className="text-input-field"
                  type="text"
                  value={typeof userAnswer === 'string' ? userAnswer : ''}
                  disabled={isDisabled}
                  onChange={(event) => onAnswerChange && onAnswerChange(event.target.value)}
                />
              </label>
            )}
            {showReview && (
              <div className="corrected-segment-box">
                <span className="tag-label">التصويب الدقيق:</span>
                <p>{question.correctedSegment}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showReview && (
        <footer className="question-explanation-panel">
          <h4 className="explanation-title">💡 التوجيه والتعليل التعليمي:</h4>
          <p className="explanation-text">{question.explanation}</p>
        </footer>
      )}
    </article>
  );
};
