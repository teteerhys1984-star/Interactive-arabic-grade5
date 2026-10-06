import React, { useState } from 'react';
import {
  GRAMMAR_EXAMPLE_GROUPS,
  GRAMMAR_PLATFORM_EXPLANATION,
  HAMZA_EXAMPLES,
  LESSON1_VOCABULARY_EXPLANATIONS,
  SPELLING_PLATFORM_EXPLANATION,
} from '../../data/lesson1/platformExplanations';
import { LESSON1_IRAB } from '../../data/lesson1/irab';
import { ArabicNumber } from '../common/BiDi';
import { SourceBadge } from '../common/SourceBadge';

const PlatformLabel: React.FC<{ children?: React.ReactNode }> = ({ children = 'شرح المنصة' }) => (
  <span className="source-label-explain">{children}</span>
);

const QuickCheck: React.FC<{
  id: string;
  prompt: string;
  options: { id: string; label: string; correct: boolean }[];
  feedbackCorrect: string;
  feedbackIncorrect: string;
}> = ({ id, prompt, options, feedbackCorrect, feedbackIncorrect }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedOption = options.find((option) => option.id === selected);

  return (
    <section className="platform-quick-check" aria-labelledby={`${id}-title`}>
      <div className="quick-check-heading">
        <span className="quick-check-icon" aria-hidden="true">؟</span>
        <div>
          <span className="source-label-explain">تطبيق سريع من المنصة</span>
          <h4 id={`${id}-title`}>تحقّق من فهمك</h4>
        </div>
      </div>
      <p className="quick-check-prompt">{prompt}</p>
      <div className="quick-check-options" role="group" aria-label={prompt}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`quick-check-option ${selected === option.id ? 'is-selected' : ''}`}
            onClick={() => setSelected(option.id)}
            aria-pressed={selected === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
      {selectedOption && (
        <p className={`quick-check-feedback ${selectedOption.correct ? 'is-correct' : 'is-try-again'}`} role="status">
          {selectedOption.correct ? feedbackCorrect : feedbackIncorrect}
        </p>
      )}
    </section>
  );
};

export const GrammarExplanation: React.FC = () => {
  const guide = GRAMMAR_PLATFORM_EXPLANATION;

  return (
    <section className="platform-teaching-panel grammar-explanation" aria-labelledby="grammar-platform-heading">
      <header className="platform-panel-header">
        <PlatformLabel>شرح المنصة — القواعد</PlatformLabel>
        <h3 id="grammar-platform-heading">كيف أميّز الجملة الاسمية من الفعلية؟</h3>
        <p>{guide.concept}</p>
      </header>

      <div className="grammar-type-grid">
        <article className="grammar-type-card nominal-type">
          <span className="grammar-type-kicker">تبدأ باسم</span>
          <h4>جملة اسمية</h4>
          <p>تخبرنا عن شخص أو شيء أو معنى، ثم قد تصفه أو تخبرنا عنه.</p>
          <p className="grammar-question"><strong>اسأل:</strong> عن مَن أو ماذا نتحدث؟ ماذا نقول عنه؟</p>
          <p className="grammar-type-example">من أمثلة الكتاب: <b>التَّعاوُنُ قُوَّةٌ.</b></p>
        </article>
        <article className="grammar-type-card verbal-type">
          <span className="grammar-type-kicker">تبدأ بفعل</span>
          <h4>جملة فعلية</h4>
          <p>تخبرنا عن حدث أو عمل، وقد تذكر من قام به وما وقع عليه.</p>
          <p className="grammar-question"><strong>اسأل:</strong> ماذا حدث أو فُعِل؟ مَن قام بالفعل؟</p>
          <p className="grammar-type-example">من أمثلة الكتاب: <b>صَنَعَ العُمّالُ مَرْكَباً.</b></p>
        </article>
      </div>

      <p className="grammar-purpose-note">
        <strong>لماذا نحتاج هذا التصنيف؟</strong> يساعدنا على فهم طريقة بناء الفكرة في الجملة. الحكم يكون على أول كلمة أساسية، لا على طول الجملة ولا على وجود اسم في وسطها.
      </p>

      <details className="platform-accordion">
        <summary>طريقة التعرّف خطوة بخطوة والأسئلة المساعدة</summary>
        <div className="accordion-content">
          <ol className="teaching-steps-list">
            {guide.identificationSteps.map((step, index) => (
              <li key={step}>
                <span className="teaching-step-number"><ArabicNumber value={index + 1} /></span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="question-prompts-grid">
            {guide.questionPrompts.map((item) => (
              <div key={item.title} className="question-prompt-card">
                <strong>{item.title}</strong>
                <p>{item.prompt}</p>
              </div>
            ))}
          </div>
        </div>
      </details>

      <details className="platform-accordion">
        <summary>أمثلة محلولة من الكتاب — أطبّق القاعدة على الكلمات</summary>
        <div className="accordion-content grammar-example-groups">
          {GRAMMAR_EXAMPLE_GROUPS.map((group) => (
            <section key={group.id} className="grammar-example-group">
              <header className="example-group-header">
                <div>
                  <span className="source-label-original">أمثلة أصلية من الكتاب</span>
                  <h4>{group.title}</h4>
                </div>
                <SourceBadge source={group.source} compact />
              </header>
              <div className="worked-examples-list">
                {group.examples.map((example) => (
                  <details key={example.id} className="worked-example">
                    <summary>
                      <span className="worked-example-sentence">{example.sentence}</span>
                      <span className={`sentence-kind-tag ${example.kind === 'اسمية' ? 'kind-nominal' : 'kind-verbal'}`}>
                        جملة {example.kind}
                      </span>
                    </summary>
                    <ol className="worked-example-steps">
                      <li><strong>الكلمة الأولى:</strong> {example.firstMeaningfulWord}.</li>
                      <li><strong>السؤال الذي أطرحه:</strong> {example.recognition}</li>
                      <li><strong>كيف عرفنا؟</strong> {example.reasoning}</li>
                      <li><strong>النتيجة:</strong> هذه جملة {example.kind} وفق قاعدة الدرس.</li>
                    </ol>
                  </details>
                ))}
              </div>
            </section>
          ))}
          <aside className="platform-note">
            <strong>ملاحظة عن واو الربط:</strong> في أمثلة الكتاب مثل «وَخَيْراتُهُ» و«وَيَقْضُونَ»، نلاحظ الواو التي تصل الكلام بما قبله، ثم ننظر إلى الاسم أو الفعل الذي يأتي بعدها.
          </aside>
        </div>
      </details>

      <details className="platform-accordion">
        <summary>ما وظيفة الكلمة؟ وما علامة الإعراب في أمثلة الدرس؟</summary>
        <div className="accordion-content">
          <p className="grammar-case-intro">
            نوع الجملة يحدّد كيف بدأت، أمّا الإعراب فيشرح وظيفة كل كلمة. في الجمل الاسمية نبحث عن المبتدأ والخبر؛ وفي الفعلية نبحث عن الفعل والفاعل، وقد نجد مفعولاً به.
          </p>
          <div className="grammar-role-grid">
            {guide.sentenceParts.map((part) => (
              <article key={part.title} className="grammar-role-card">
                <h4>{part.title}</h4>
                <p>{part.text}</p>
              </article>
            ))}
          </div>
          <div className="case-marker-list">
            {guide.caseMarkers.map((marker) => (
              <article key={marker.title} className="case-marker-row">
                <h4>{marker.title}</h4>
                <p>{marker.text}</p>
              </article>
            ))}
          </div>
          <p className="grammar-case-footnote">
            لا نضع حركة عشوائية: اسأل أولاً عن وظيفة الكلمة، ثم اربط الوظيفة بالعلامة التي يبيّنها المثال.
          </p>
        </div>
      </details>

      <details className="platform-accordion common-mistakes-accordion">
        <summary>أخطاء شائعة — كيف أتجنبها؟</summary>
        <div className="accordion-content mistake-list">
          {guide.commonMistakes.map((mistake) => (
            <article key={mistake.title} className="common-mistake-item">
              <span className="source-label-mistake">خطأ شائع</span>
              <h4>{mistake.title}</h4>
              <p>{mistake.text}</p>
            </article>
          ))}
        </div>
      </details>

      <div className="platform-example-callout">
        <span className="source-label-example">مثال إضافي من إنشاء المنصة</span>
        <p className="platform-example-sentence">{guide.platformExample.sentence}</p>
        <p>{guide.platformExample.explanation}</p>
      </div>

      <QuickCheck id="grammar-quick-check" {...guide.quickCheck} />
    </section>
  );
};

export const SpellingExplanation: React.FC = () => {
  const guide = SPELLING_PLATFORM_EXPLANATION;
  const cutExamples = HAMZA_EXAMPLES.filter((example) => example.type === 'قطع');
  const waslExamples = HAMZA_EXAMPLES.filter((example) => example.type === 'وصل');

  return (
    <section className="platform-teaching-panel spelling-explanation" aria-labelledby="spelling-platform-heading">
      <header className="platform-panel-header">
        <PlatformLabel>شرح المنصة — الإملاء</PlatformLabel>
        <h3 id="spelling-platform-heading">الهمزة الأولية: أقطع أم أصل؟</h3>
        <p>{guide.concept}</p>
      </header>

      <div className="spelling-rule-summary">
        <article className="spelling-rule-card">
          <span className="spelling-form" aria-hidden="true">أ / إ</span>
          <div>
            <h4>همزة القطع</h4>
            <p>تُكتب الهمزة فوق الألف أو تحتها، وتُنطق عند البدء وعند وصل الكلام.</p>
          </div>
        </article>
        <article className="spelling-rule-card">
          <span className="spelling-form spelling-wasl-form" aria-hidden="true">ا</span>
          <div>
            <h4>همزة الوصل</h4>
            <p>تُكتب ألفاً بلا علامة همزة؛ تُنطق في بداية الكلام، وتسقط من النطق عند الوصل.</p>
          </div>
        </article>
      </div>
      <p className="spelling-purpose-note"><strong>لماذا أميّز بينهما؟</strong> حتى أكتب شكل الألف الأولى صحيحاً وأقرأ الكلمة بالطريقة المناسبة في أول الكلام ووسطه.</p>

      <details className="platform-accordion">
        <summary>خطوات فحص الهمزة — الشكل ثم النطق</summary>
        <div className="accordion-content">
          <ol className="teaching-steps-list">
            {guide.recognitionSteps.map((step, index) => (
              <li key={step}>
                <span className="teaching-step-number"><ArabicNumber value={index + 1} /></span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="spelling-position-note">
            <strong>علامة الهمزة:</strong> همزة القطع المكسورة تُكتب تحت الألف «إِ»، والمفتوحة أو المضمومة في أمثلة الدرس فوقها «أَ / أُ». ألف الوصل لا تحمل رسم الهمزة «ا».
          </div>
        </div>
      </details>

      <details className="platform-accordion">
        <summary>أمثلة الهمزة كما وردت في صفحات الدرس</summary>
        <div className="accordion-content hamza-examples-content">
          <HamzaExampleGroup title="همزة القطع" examples={cutExamples} kind="قطع" />
          <HamzaExampleGroup title="همزة الوصل" examples={waslExamples} kind="وصل" />
        </div>
      </details>

      <aside className="spelling-correction-note" role="note">
        <PlatformLabel>تنبيه تعليمي من المنصة</PlatformLabel>
        <p>
          الكلمتان «إِسْهامِها» و«إِنْجازاتِهِمْ» تبدآن بهمزة قطع مكسورة مكتوبة تحت الألف، وليستا همزتي وصل. لذلك صُحّح تصنيفهما في مفتاح النشاط والتعليل المرتبط بسؤال الإملاء، مع إبقاء نصَّي نشاطَي الكتاب وكلماتهما كما وردا.
        </p>
      </aside>

      <details className="platform-accordion common-mistakes-accordion">
        <summary>أخطاء شائعة — وما الطريقة الأسهل لتجنبها؟</summary>
        <div className="accordion-content mistake-list">
          {guide.commonMistakes.map((mistake) => (
            <article key={mistake.title} className="common-mistake-item">
              <span className="source-label-mistake">خطأ شائع</span>
              <h4>{mistake.title}</h4>
              <p>{mistake.text}</p>
            </article>
          ))}
        </div>
      </details>

      <div className="platform-example-callout spelling-sound-test">
        <span className="source-label-example">مثال إضافي من إنشاء المنصة</span>
        <h4>أقارن الصوت عند الوصل</h4>
        <div className="sound-pair">
          <p><b>{guide.soundTest.cut}</b><span>تظل الهمزة مسموعة</span></p>
          <p><b>{guide.soundTest.connect}</b><span>تسقط همزة الوصل من النطق المتصل</span></p>
        </div>
        <p>{guide.soundTest.explanation}</p>
      </div>

      <QuickCheck id="hamza-quick-check" {...guide.quickCheck} />
    </section>
  );
};

const HamzaExampleGroup: React.FC<{
  title: string;
  examples: typeof HAMZA_EXAMPLES;
  kind: 'قطع' | 'وصل';
}> = ({ title, examples, kind }) => {
  const bySourceSection = examples.reduce<Record<string, typeof HAMZA_EXAMPLES>>((groups, example) => {
    const key = example.source.sectionName || 'أمثلة الدرس';
    groups[key] = [...(groups[key] || []), example];
    return groups;
  }, {});

  return (
    <section className="hamza-example-group">
      <header className="hamza-example-group-header">
        <span className="source-label-original">ألفاظ من الكتاب</span>
        <h4>{title}</h4>
      </header>
      {Object.entries(bySourceSection).map(([sectionName, sectionExamples]) => (
        <div key={sectionName} className="hamza-source-group">
          <header className="hamza-source-group-header">
            <span>{sectionName}</span>
            <SourceBadge source={sectionExamples[0].source} compact />
          </header>
          <ul className="hamza-example-list">
            {sectionExamples.map((example) => (
              <li key={example.word} className="hamza-example-row">
                <span className="hamza-word">{example.word}</span>
                <span className="hamza-type-label">همزة {kind}</span>
                <p>{example.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export const VocabularyExplanation: React.FC = () => (
  <section className="platform-teaching-panel vocabulary-explanation" aria-labelledby="vocabulary-platform-heading">
    <header className="platform-panel-header">
      <PlatformLabel>شرح المنصة — المفردات</PlatformLabel>
      <h3 id="vocabulary-platform-heading">أفهم الكلمة من معناها وسياقها</h3>
      <p>الكلمة قد يتضح معناها أكثر عندما نقرأ الكلمات المحيطة بها. افتح المفردة لتعرف معناها الأساسي، ثم معناها في هذا الدرس، وما قد يلتبس بها.</p>
    </header>
    <div className="vocabulary-accordion-list">
      {LESSON1_VOCABULARY_EXPLANATIONS.map((item, index) => (
        <details key={item.id} className="vocabulary-entry">
          <summary>
            <span className="vocabulary-entry-number"><ArabicNumber value={index + 1} /></span>
            <span className="vocabulary-entry-term">{item.term}</span>
            <span className="vocabulary-entry-hint">عرض الشرح</span>
          </summary>
          <div className="vocabulary-entry-content">
            <div className="vocabulary-source-reference">
              <span className="source-label-original">لفظ أو موضع من الكتاب</span>
              <SourceBadge source={item.source} compact />
            </div>
            {item.sourceContext && (
              <blockquote className="vocabulary-source-quote">
                <span className="source-label-original">النص الأصلي من الكتاب</span>
                <p>{item.sourceContext}</p>
              </blockquote>
            )}
            {item.sourceMeaning && (
              <div className="vocabulary-source-quote">
                <span className="source-label-original">النص الأصلي من الكتاب</span>
                <p><strong>{item.term}:</strong> {item.sourceMeaning}</p>
              </div>
            )}
            <div className="vocabulary-platform-details">
              <span className="source-label-explain">شرح المنصة</span>
              <p><strong>المعنى الأساسي:</strong> {item.basicMeaning}</p>
              <p><strong>المعنى في السياق:</strong> {item.contextualMeaning}</p>
              {item.relatedWords && (
                <p><strong>كلمات قريبة تساعدني:</strong> {item.relatedWords.join('، ')}.</p>
              )}
              {item.confusion && (
                <p className="vocabulary-confusion"><strong>قد تختلط بـ:</strong> {item.confusion}</p>
              )}
              {item.platformExample && (
                <p className="vocabulary-added-example">
                  <span className="source-label-example">مثال إضافي من إنشاء المنصة</span>
                  <span>{item.platformExample}</span>
                </p>
              )}
            </div>
          </div>
        </details>
      ))}
    </div>
  </section>
);

const IrabSection: React.FC = () => (
  <section className="irab-section" aria-labelledby="irab-platform-heading">
    <header className="platform-panel-header irab-section-header">
      <PlatformLabel>شرح المنصة — الإعراب</PlatformLabel>
      <h3 id="irab-platform-heading">إعراب الجمل الواردة في الدرس، كلمةً كلمة</h3>
      <p>
        في الإعراب نحدّد نوع الكلمة وموقعها؛ ثم نذكر علامتها الإعرابية إذا كانت معربة، أو حركة بنائها إذا كانت مبنية، ونشرح السبب. الجمل أدناه من مواضع الدرس؛ افتح كل جملة لقراءة التحليل المرتب. هذا التحليل شرح تعليمي أضافته المنصة، وليس نصاً من الكتاب.
      </p>
    </header>
    <ol className="irab-list">
      {LESSON1_IRAB.map((record, index) => (
        <li key={record.id}>
          <details className="irab-card">
            <summary className="irab-card-summary">
              <span className="irab-card-number"><ArabicNumber value={index + 1} /></span>
              <div className="irab-summary-text">
                <span className="source-label-original">النص الأصلي من الكتاب</span>
                <span className="irab-sentence">{record.sentence}</span>
                <span className="irab-focus">الكلمة المستهدفة: «{record.focusWord}» — {record.role} {record.caseName}</span>
              </div>
              <span className="irab-open-hint">عرض الإعراب</span>
            </summary>
            <div className="irab-card-content">
              <SourceBadge source={record.source} compact />
              <div className="irab-focus-analysis">
                <span className="source-label-explain">تحليل الكلمة المستهدفة</span>
                <p><strong>الكلمة:</strong> {record.focusWord}</p>
                <p><strong>موقعها:</strong> {record.role}</p>
                <p><strong>إعرابها:</strong> {record.role} {record.caseName}</p>
                <p><strong>علامتها:</strong> {record.sign}</p>
                <p><strong>لماذا؟</strong> {record.reason}</p>
              </div>
              <h4 className="irab-breakdown-heading">خطوات الإعراب — بالترتيب</h4>
              <ol className="irab-word-list">
                {record.wordBreakdown.map((word, wordIndex) => (
                  <li key={`${record.id}-${wordIndex}`} className="irab-word-row">
                    <div className="irab-word-heading">
                      <span className="irab-word-order"><ArabicNumber value={wordIndex + 1} /></span>
                      <strong className="irab-word">{word.word}</strong>
                      <span className="irab-word-type">نوعها: {word.type}</span>
                    </div>
                    <dl className="irab-word-details">
                      <div><dt>موقعها في الجملة</dt><dd>{word.position}</dd></div>
                      <div><dt>كيف عرفنا؟</dt><dd>{word.recognition}</dd></div>
                      <div><dt>إعرابها</dt><dd>{word.irab}</dd></div>
                      <div><dt>علامتها</dt><dd>{word.sign}</dd></div>
                      <div><dt>سبب العلامة</dt><dd>{word.signReason}</dd></div>
                    </dl>
                  </li>
                ))}
              </ol>
            </div>
          </details>
        </li>
      ))}
    </ol>
  </section>
);

export const Lesson1GrammarSupport: React.FC = () => (
  <>
    <GrammarExplanation />
    <IrabSection />
  </>
);
