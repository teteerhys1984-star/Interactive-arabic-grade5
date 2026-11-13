import React, { useState } from 'react';
import { LESSON2_PLATFORM_EXERCISES, PlatformExercise } from '../../data/lesson2/platformExplanations';
import { readDraft, writeDraft } from '../../utils/draftStorage';

const SCOPE = 'lesson2-platform-checks';

const Exercise: React.FC<{ exercise: PlatformExercise }> = ({ exercise }) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const saved = readDraft(SCOPE, exercise.id);
    return Object.fromEntries(exercise.rows
      .filter((row) => row.options.some((option) => option.id === saved[row.id]))
      .map((row) => [row.id, saved[row.id]]));
  });
  const [checked, setChecked] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const complete = exercise.rows.every((row) => row.options.some((option) => option.id === values[row.id]));

  const update = (rowId: string, value: string) => {
    const next = { ...values, [rowId]: value };
    setValues(next);
    setChecked(false);
    setSaveFailed(!writeDraft(SCOPE, exercise.id, next));
  };

  return (
    <section className="platform-quick-check" aria-labelledby={`${exercise.id}-title`}>
      <span className="source-label-explain">تدريب من المنصة</span>
      <h4 id={`${exercise.id}-title`}>{exercise.title}</h4>
      <p>{exercise.prompt}</p>
      {exercise.rows.map((row) => (
        <label className="inter-field" key={row.id}>
          <span className="inter-label">{row.label}</span>
          <select className="inter-input" value={values[row.id] || ''} onChange={(event) => update(row.id, event.target.value)}>
            <option value="">اختر إجابتك</option>
            {row.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </label>
      ))}
      <button type="button" className="btn btn-primary btn-small" disabled={!complete} onClick={() => setChecked(true)}>تحقّق</button>
      {saveFailed && <p role="alert">تعذّر حفظ المسودة في هذه الجلسة؛ يمكنك متابعة الحل هنا.</p>}
      {checked && <div role="status" className="quick-check-result">
        {exercise.rows.map((row) => {
          const selected = row.options.find((option) => option.id === values[row.id])!;
          const correct = row.options.find((option) => option.id === row.correctId)!;
          const isCorrect = selected.id === correct.id;
          return <p key={row.id}><strong>{row.label}: {isCorrect ? 'أحسنت!' : 'حاول مجددًا.'}</strong>{' '}
            {selected.reason}{!isCorrect && <> الإجابة المناسبة: {correct.label}. {correct.reason}</>}
          </p>;
        })}
      </div>}
    </section>
  );
};

export const Lesson2Explanations: React.FC<{ stepId: 'l2-s5' | 'l2-s6' }> = ({ stepId }) => (
  <section className="platform-teaching-panel" aria-label={stepId === 'l2-s5' ? 'شرح المنصة وتدريبات المصدر' : 'شرح المنصة وتدريبات همزة القطع'}>
    <span className="source-label-explain">شرح المنصة</span>
    <h3>{stepId === 'l2-s5' ? 'أفهم المصدر وأتدرّب' : 'أتدرّب على همزة القطع'}</h3>
    {stepId === 'l2-s5' ? <>
      <p>الفعل يدل على حدث ويرتبط بزمن. أمّا المصدر فهو اسم للحدث نفسه، ولا يحدّد زمن وقوعه.</p>
      <p>مثال من المنصة: في «أحبُّ القراءةَ»، القراءة اسم لحدث القراءة. نقارنها بالفعل «قرأَ» الذي يدل على حدث في الماضي. الكتاب اسم شيء، لا اسم الحدث في هذا المثال.</p>
      <p>لا يكفي أن تكون الكلمة اسمًا بلا زمن حتى تكون مصدرًا؛ نسأل أيضًا: هل تسمّي حدثًا؟</p>
    </> : <p>أحدّد نوع الكلمة وأرجع إلى مواضع همزة القطع في قاعدة الكتاب، ثم أطبّق على أمثلة جديدة من المنصة.</p>}
    {LESSON2_PLATFORM_EXERCISES[stepId].map((exercise) => <Exercise key={exercise.id} exercise={exercise} />)}
  </section>
);
