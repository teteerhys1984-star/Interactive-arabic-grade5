import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Lesson2StepRenderer } from '../components/curriculum/Lesson2StepRenderer';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { getLessonById } from '../data/curriculumRegistry';
import { LESSON2_STEPS } from '../data/lesson2/content';
import { LESSON2_PLATFORM_EXERCISES } from '../data/lesson2/platformExplanations';
import { draftKey, readDraft, writeDraft } from '../utils/draftStorage';

const step = (id: string) => LESSON2_STEPS.find((item) => item.id === id)!;
const panel = (name: string) => screen.getByRole('region', { name });
const grammar = 'شرح المنصة وتدريبات المصدر';
const spelling = 'شرح المنصة وتدريبات همزة القطع';
const exercise = (title: string) => screen.getByRole('region', { name: title });
const select = (region: HTMLElement, label: string, value: string) =>
  fireEvent.change(within(region).getByLabelText(label), { target: { value } });

describe('Lesson 2 platform explanations', () => {
  it('shows one local panel after the source rule, without changing other steps or exposing teacher-only content', () => {
    const { rerender } = render(<Lesson2StepRenderer step={step('l2-s5')} />);
    expect(screen.getAllByRole('region', { name: grammar })).toHaveLength(1);
    expect(screen.getByText('المصدر: اسم من جنس الفعل يدل على حدث مجرد من الزمن.')).toBeInTheDocument();
    expect(screen.getByText('المصدر: اسم من جنس الفعل يدل على حدث مجرد من الزمن.').compareDocumentPosition(panel(grammar)) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole('region', { name: spelling })).not.toBeInTheDocument();
    rerender(<Lesson2StepRenderer step={step('l2-s6')} />);
    expect(screen.getAllByRole('region', { name: spelling })).toHaveLength(1);
    expect(screen.getByText('تأتي همزة القطع في أول الحروف والأسماء والأفعال.')).toBeInTheDocument();
    const protectedActivity = screen.getByLabelText('نشاط المصدر L2-19-07');
    expect(within(protectedActivity).queryByText('أظهر الجواب')).not.toBeInTheDocument();
    expect(within(protectedActivity).queryByText(/ينشئ جدول إجابات/)).not.toBeInTheDocument();
    expect(screen.queryByText('اقبالُ')).not.toBeInTheDocument();
    rerender(<Lesson2StepRenderer step={step('l2-s1')} />);
    expect(screen.queryByRole('region', { name: grammar })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: spelling })).not.toBeInTheDocument();
    expect(screen.getAllByText(/المادة السمعية غير متوفرة/).length).toBeGreaterThan(0);
  });

  it('checks each classification row, explains mistakes, and clears stale feedback', () => {
    render(<Lesson2StepRenderer step={step('l2-s5')} />);
    const task = exercise('أميّز الكلمات');
    const check = within(task).getByRole('button', { name: 'تحقّق' });
    expect(check).toBeDisabled();
    expect(within(task).queryByRole('status')).not.toBeInTheDocument();
    select(task, 'جَلَسَ', 'source'); select(task, 'جُلوس', 'source'); select(task, 'كُرسيّ', 'thing');
    expect(within(task).queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(check);
    expect(within(task).getByRole('status')).toHaveTextContent('الإجابة المناسبة: فعل');
    expect(within(task).getByRole('status')).toHaveTextContent('الفعل يدل على حدث ويرتبط بزمن');
    select(task, 'جَلَسَ', 'verb');
    expect(within(task).queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(check);
    expect(within(task).getByRole('status')).not.toHaveTextContent('حاول مجددًا');
  });

  it('explains reasoning and distinguishes a grammatical sentence from the required event', () => {
    render(<Lesson2StepRenderer step={step('l2-s5')} />);
    const reason = exercise('أفسّر السبب');
    select(reason, 'القراءة مصدر', 'thing'); select(reason, 'قرأَ فعل', 'past');
    fireEvent.click(within(reason).getByRole('button', { name: 'تحقّق' }));
    expect(within(reason).getByRole('status')).toHaveTextContent('القراءة تسمي حدثًا، لا شيئًا');
    expect(within(reason).getByRole('status')).toHaveTextContent('اسم للحدث دون زمن');
    const context = exercise('أطبّق في جملة');
    select(context, 'الكلمة المناسبة', 'book');
    fireEvent.click(within(context).getByRole('button', { name: 'تحقّق' }));
    expect(within(context).getByRole('status')).toHaveTextContent('أحب الكتاب جملة سليمة');
    expect(within(context).getByRole('status')).toHaveTextContent('القراءةَ');
  });

  it('checks spelling classification, explanation, and the authorized context', () => {
    render(<Lesson2StepRenderer step={step('l2-s6')} />);
    const classify = exercise('أتهيّأ للقاعدة');
    select(classify, 'أخذ', 'source'); select(classify, 'إقبال', 'source');
    fireEvent.click(within(classify).getByRole('button', { name: 'تحقّق' }));
    expect(within(classify).getByRole('status')).toHaveTextContent('أخذ هنا فعل ماضٍ');
    const reason = exercise('أعلّل همزة القطع');
    select(reason, 'السبب', 'past3');
    fireEvent.click(within(reason).getByRole('button', { name: 'تحقّق' }));
    expect(within(reason).getByRole('status')).toHaveTextContent('أقبل فعل رباعي وليس ثلاثيًا');
    expect(within(reason).getByRole('status')).toHaveTextContent('لأنها في فعل ماضٍ رباعي');
    select(reason, 'السبب', 'past4');
    expect(within(reason).queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(within(reason).getByRole('button', { name: 'تحقّق' }));
    expect(within(reason).getByRole('status')).toHaveTextContent('أحسنت');
    const context = exercise('أطبّق في جملة');
    select(context, 'الفعل المناسب', 'akhadha');
    fireEvent.click(within(context).getByRole('button', { name: 'تحقّق' }));
    expect(within(context).getByRole('status')).toHaveTextContent('فعل ماضٍ ثلاثي');
    select(context, 'الفعل المناسب', 'aqbala');
    fireEvent.click(within(context).getByRole('button', { name: 'تحقّق' }));
    expect(within(context).getByRole('status')).toHaveTextContent('أحسنت');
  });

  it('saves flat independent drafts and restores without verdict across unmounts', () => {
    writeDraft('lesson2', 'L2-17-02', { book: 'original' });
    const { unmount } = render(<Lesson2StepRenderer step={step('l2-s5')} />);
    const classification = exercise('أميّز الكلمات');
    select(classification, 'جَلَسَ', 'verb'); select(classification, 'جُلوس', 'source'); select(classification, 'كُرسيّ', 'thing');
    const context = exercise('أطبّق في جملة'); select(context, 'الكلمة المناسبة', 'book');
    fireEvent.click(within(context).getByRole('button', { name: 'تحقّق' }));
    expect(readDraft('lesson2-platform-checks', 'l2p-g-classify')).toEqual({ 'l2p-g-classify-jalasa': 'verb', 'l2p-g-classify-julus': 'source', 'l2p-g-classify-kursi': 'thing' });
    expect(readDraft('lesson2-platform-checks', 'l2p-g-context')).toEqual({ 'l2p-g-context-choice': 'book' });
    expect(readDraft('lesson2', 'L2-17-02')).toEqual({ book: 'original' });
    unmount(); render(<Lesson2StepRenderer step={step('l2-s5')} />);
    expect(within(exercise('أميّز الكلمات')).getByLabelText('جَلَسَ')).toHaveValue('verb');
    expect(within(exercise('أطبّق في جملة')).getByLabelText('الكلمة المناسبة')).toHaveValue('book');
    expect(within(exercise('أطبّق في جملة')).queryByRole('status')).not.toBeInTheDocument();
  });

  it('restores matching and spelling drafts after actual lesson navigation', () => {
    const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const lesson = getLessonById('lesson2')!.lesson;
    render(<LessonFlow lesson={lesson} />);
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 5:/ }));
    const reason = exercise('أفسّر السبب');
    select(reason, 'القراءة مصدر', 'event'); select(reason, 'قرأَ فعل', 'past');
    fireEvent.click(within(reason).getByRole('button', { name: 'تحقّق' }));
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 6:/ }));
    const spellingTask = exercise('أعلّل همزة القطع');
    select(spellingTask, 'السبب', 'past3');
    fireEvent.click(within(spellingTask).getByRole('button', { name: 'تحقّق' }));
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 5:/ }));
    expect(within(exercise('أفسّر السبب')).getByLabelText('القراءة مصدر')).toHaveValue('event');
    expect(within(exercise('أفسّر السبب')).getByLabelText('قرأَ فعل')).toHaveValue('past');
    expect(within(exercise('أفسّر السبب')).queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 6:/ }));
    expect(within(exercise('أعلّل همزة القطع')).getByLabelText('السبب')).toHaveValue('past3');
    expect(within(exercise('أعلّل همزة القطع')).queryByRole('status')).not.toBeInTheDocument();
    expect(readDraft('lesson2-platform-checks', 'l2p-g-reason')).toEqual({ 'l2p-g-reason-qiraa': 'event', 'l2p-g-reason-qaraa': 'past' });
    expect(readDraft('lesson2-platform-checks', 'l2p-s-reason')).toEqual({ 'l2p-s-reason-choice': 'past3' });
    scroll.mockRestore();
  });

  it('rejects invalid restored values and reports failed storage without claiming success', () => {
    sessionStorage.setItem(draftKey('lesson2-platform-checks', 'l2p-g-context'), JSON.stringify({ 'l2p-g-context-choice': 'invalid' }));
    render(<Lesson2StepRenderer step={step('l2-s5')} />);
    const context = exercise('أطبّق في جملة');
    expect(within(context).getByLabelText('الكلمة المناسبة')).toHaveValue('');
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    select(context, 'الكلمة المناسبة', 'reading');
    expect(within(context).getByRole('alert')).toHaveTextContent('تعذّر حفظ المسودة');
    expect(within(context).getByLabelText('الكلمة المناسبة')).toHaveValue('reading');
    spy.mockRestore();
  });

  it('uses unique exercise and row identifiers and one valid key per row', () => {
    const all = [...LESSON2_PLATFORM_EXERCISES['l2-s5'], ...LESSON2_PLATFORM_EXERCISES['l2-s6']];
    const ids = all.map((item) => item.id);
    const rowIds = all.flatMap((item) => item.rows.map((row) => row.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(rowIds).size).toBe(rowIds.length);
    all.flatMap((item) => item.rows).forEach((row) => {
      expect(row.options.filter((option) => option.id === row.correctId)).toHaveLength(1);
      expect(new Set(row.options.map((option) => option.id)).size).toBe(row.options.length);
    });
  });
});
