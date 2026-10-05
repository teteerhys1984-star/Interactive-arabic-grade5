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

        {question.type === 'ordering' && (
          <div className="ordering-view">
            <p className="instruction-hint">الترتيب الصحيح:</p>
            <div className="ordering-items">
              {question.items.map((item, idx) => (
                <div key={item.id} className="order-item-row">
                  <span className="order-number"><ArabicNumber value={idx + 1} /></span>
                  <span className="order-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === 'matching' && (
          <div className="matching-view">
            <p className="instruction-hint">أزواج المقابلة والمطابقة:</p>
            <div className="matching-grid">
              {question.pairs.map((pair) => (
                <div key={pair.id} className="matching-pair-row">
                  <span className="matching-left">{pair.left}</span>
                  <span className="matching-arrow">←</span>
                  <span className="matching-right">{pair.right}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === 'classification' && (
          <div className="classification-view">
            <p className="instruction-hint">التصنيف حسب الفئات المحددة:</p>
            <div className="categories-list">
              {question.categories.map((cat) => (
                <div key={cat.id} className="category-card">
                  <h4>{cat.label}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === 'error_analysis' && (
          <div className="error-analysis-view">
            <div className="original-sentence-box">
              <span className="tag-label">الجملة الأصلية:</span>
              <p>{question.originalSentence}</p>
            </div>
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
