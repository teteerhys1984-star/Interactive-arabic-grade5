import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../App';
import { getAllUnits, getLessonById, getUnitById } from '../data/curriculumRegistry';
import { getLessonTestByLessonId } from '../data/assessments';
import { readLearningLocation } from '../utils/learningProgress';
import { toArabicDigits } from '../utils/arabicDigits';

/**
 * PHASE 1 — behavioural coverage for the redesigned student entry points.
 *
 * WHY THIS FILE EXISTS
 * The 161 pre-existing tests were written against the previous home/unit
 * markup; they prove the lesson and assessment behaviour did not regress, but
 * they never exercised the six new affordances. Every test below asserts a
 * RESULT of the interaction (which screen replaced which, what was persisted in
 * sessionStorage, which heading is now on screen) — never merely that a button
 * exists in the DOM.
 *
 * SAFETY NOTE FOR THE READER
 * These tests only observe; they do not define behaviour. If one of them fails,
 * the product changed, not the test's expectations about the curriculum.
 */

const UNIT1 = 'الوحدة الأولى: أحلامي وطموحاتي';
const UNIT2 = 'الوحدة الثانية';

/** Collapses an element's text the way a learner reads it (spans inline). */
const textOf = (element: Element | null): string =>
  (element?.textContent ?? '').replace(/\s+/g, ' ').trim();

const currentUnitHeading = () => screen.queryByRole('heading', { level: 1, name: /الوحدة الأولى|الوحدة الثانية/ });
const lessonHeading = (title: string) => screen.queryByRole('heading', { level: 1, name: title });

beforeEach(() => {
  window.sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
});

describe('Phase 1 — home page lesson entry', () => {
  it('starts at the first registered lesson itself when the hero CTA is pressed', () => {
    render(<App />);

    const firstLesson = getLessonById('lesson1')!.lesson;

    // The label promises a lesson, so the button must open that lesson — not the
    // unit page that lists it.
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ من أول درس' }));

    // RESULT: lesson 1's own shell is on screen…
    expect(lessonHeading(firstLesson.metadata.title)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })).toHaveLength(
      firstLesson.steps.length,
    );
    // …the unit page it used to open never appeared…
    expect(currentUnitHeading()).toBeNull();
    expect(screen.queryByRole('button', { name: /^ابدأ الدرس \d+:/ })).toBeNull();
    // …and the session position was recorded at that lesson's first step.
    expect(readLearningLocation()).toEqual({
      unitId: 'unit1',
      lessonId: 'lesson1',
      stepId: firstLesson.steps[0].id,
    });
  });

  it('opens the exact lesson when its row button is pressed from the home page', () => {
    render(<App />);

    // The home page is showing the units overview, not a lesson.
    expect(screen.getByRole('heading', { level: 1, name: /أهلاً بك في/ })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'خطوات الدرس' })).toBeNull();

    // Press the second lesson's row button in the first unit panel.
    fireEvent.click(screen.getByRole('button', { name: 'افتح الدرس 2: بالرأي والرأي الآخر' }));

    // RESULT: the Lesson 2 shell is on screen (its own title + its 9 steps),
    // and no other lesson's shell is.
    expect(lessonHeading('بالرأي والرأي الآخر')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^الخطوة \d+:/ })).toHaveLength(9);
    expect(screen.queryByRole('heading', { level: 1, name: /أهلاً بك في/ })).toBeNull();

    // RESULT: the session position now points at that lesson's first step.
    expect(readLearningLocation()).toEqual({
      unitId: 'unit1',
      lessonId: 'lesson2',
      stepId: 'l2-s1',
    });
  });

  it('marks only the genuinely saved lesson and routes its button to the saved step', () => {
    render(<App />);

    // Nothing is saved yet: every row is an "open" action, none is "continue".
    expect(screen.queryAllByRole('button', { name: /^تابع الدرس \d+:/ })).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: 'افتح الدرس 3: لُغَتي' }));
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 5:/ }));
    expect(readLearningLocation()).toEqual({ unitId: 'unit1', lessonId: 'lesson3', stepId: 'l3-s5' });

    // Back to the home page through the brand button (top-left of the shell).
    fireEvent.click(screen.getByRole('button', { name: /اللغة العربية التفاعلية/ }));

    // RESULT: exactly one lesson row advertises a saved position — lesson 3.
    const continueButtons = screen.getAllByRole('button', { name: /^تابع الدرس \d+:/ });
    expect(continueButtons).toHaveLength(1);
    expect(continueButtons[0]).toHaveAccessibleName('تابع الدرس 3: لُغَتي');
    expect(screen.getByText('موضعك هنا')).toBeInTheDocument();

    // RESULT: pressing it re-enters that lesson and restores the saved step.
    fireEvent.click(continueButtons[0]);
    expect(screen.getByRole('button', { name: /^الخطوة 5:/ })).toHaveAttribute('aria-current', 'step');
  });
});

describe('Phase 1 — "continue learning" resume card', () => {
  it('is absent on a fresh session and replaces the start card once a position exists', () => {
    render(<App />);

    // Fresh session: only the start card, and the CTA starts the curriculum.
    expect(screen.queryByRole('button', { name: 'متابعة التعلّم' })).toBeNull();
    expect(screen.queryByRole('button', { name: /^تابع من حيث توقّفت$/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'ابدأ من أول درس' })).toBeInTheDocument();

    // Study two steps of lesson 1, then return home. The hero CTA opens the
    // lesson directly now, so the unit page is reached through its own button.
    fireEvent.click(screen.getByRole('button', { name: `عرض دروس ${UNIT1}` }));
    fireEvent.click(screen.getByRole('button', { name: /ابدأ الدرس 1:/ }));
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 4:/ }));
    fireEvent.click(screen.getByRole('button', { name: 'الرئيسية' }));

    // RESULT: the resume card now exists and names the real saved position.
    const resumeCard = screen.getByRole('complementary', { name: 'متابعة التعلّم' });
    expect(textOf(resumeCard.querySelector('.home-resume-meta'))).toContain('الخطوة ٤ من ١٠');
    expect(textOf(resumeCard.querySelector('.home-resume-meta'))).toContain(UNIT1);
    expect(textOf(resumeCard.querySelector('.home-resume-title'))).toBe('السَّمَكَةُ الذَّهَبِيَّةُ');
    expect(screen.queryByRole('button', { name: 'ابدأ من أول درس' })).toBeNull();

    // RESULT: pressing it returns to that step, not to the first step.
    fireEvent.click(within(resumeCard).getByRole('button', { name: /تابع من حيث توقّفت/ }));
    expect(screen.getByRole('button', { name: /^الخطوة 4:/ })).toHaveAttribute('aria-current', 'step');
    expect(readLearningLocation()).toEqual({ unitId: 'unit1', lessonId: 'lesson1', stepId: 'l1-s4' });
  });

  it('never advertises progress or completion percentages', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ من أول درس' }));
    fireEvent.click(screen.getByRole('button', { name: 'الرئيسية' }));

    // RESULT: no progress bar and no percentage text anywhere on the home page.
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(document.body.textContent).not.toMatch(/\d+\s?%/);
    expect(document.body.textContent).not.toMatch(/نسبة الإنجاز|درجة الإنجاز|مكتمل ١٠٠/);
  });
});

describe('Phase 1 — unit page round trip', () => {
  it('opens a lesson from the unit page and returns to the same unit page', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: `عرض دروس ${UNIT1}` }));
    expect(screen.getByRole('heading', { level: 1, name: UNIT1 })).toBeInTheDocument();

    // Open lesson 2 from the unit page card.
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ الدرس 2: بالرأي والرأي الآخر' }));
    expect(lessonHeading('بالرأي والرأي الآخر')).toBeInTheDocument();
    expect(currentUnitHeading()).toBeNull();

    // RESULT: the shell's exit control returns to the unit page of that lesson,
    // and the row for the lesson just visited now offers to resume it.
    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى صفحة الوحدة' }));
    expect(screen.getByRole('heading', { level: 1, name: UNIT1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /تابع الدرس 2:/ })).toBeInTheDocument();
    expect(textOf(document.querySelector('.unit-page-resume-note'))).toBe(
      'آخر موضع وصلت إليه: الخطوة ١ من ٩',
    );
  });

  it('keeps a lesson draft across the lesson → unit → lesson round trip', () => {
    const { container } = render(<App />);

    fireEvent.click(screen.getByRole('button', { name: `عرض دروس ${UNIT1}` }));
    fireEvent.click(screen.getByRole('button', { name: /ابدأ الدرس 1:/ }));
    fireEvent.click(screen.getByRole('button', { name: /^الخطوة 4:/ }));

    const input = container.querySelector('.l1-activity input') as HTMLInputElement;
    expect(input).toBeTruthy();
    fireEvent.change(input, { target: { value: 'مسودة تعبر رحلة الوحدة' } });
    expect(input).toHaveValue('مسودة تعبر رحلة الوحدة');

    // Leave to the unit page and come back through the unit card.
    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى صفحة الوحدة' }));
    fireEvent.click(screen.getByRole('button', { name: /تابع الدرس 1:/ }));

    // RESULT: same step, same draft text.
    expect(screen.getByRole('button', { name: /^الخطوة 4:/ })).toHaveAttribute('aria-current', 'step');
    const restored = container.querySelector('.l1-activity input') as HTMLInputElement;
    expect(restored).toHaveValue('مسودة تعبر رحلة الوحدة');
  });
});

describe('Phase 1 — assessment entries', () => {
  it('opens the unit review from the unit page and returns to that unit', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: `عرض دروس ${UNIT1}` }));
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ المراجعة' }));

    // RESULT: the review flow replaced the unit page.
    expect(screen.getByRole('heading', { level: 1, name: 'تقويم الوحدة الأولى' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: UNIT1 })).toBeNull();
    expect(document.querySelector('.u1r-shell')).not.toBeNull();

    // RESULT: exiting the review lands back on the unit page (not the home page).
    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى الوحدة' }));
    expect(screen.getByRole('heading', { level: 1, name: UNIT1 })).toBeInTheDocument();
    expect(document.querySelector('.u1r-shell')).toBeNull();
  });

  it('opens the unit test when the unit is declared complete', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: `عرض دروس ${UNIT1}` }));
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ اختبار الوحدة' }));

    // RESULT: the 50-question unit assessment shell is on screen, results hidden.
    expect(
      screen.getByRole('heading', { level: 1, name: 'اختبار الوحدة الأولى: أحلامي وطموحاتي' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'نتائج الاختبار' })).toBeNull();
    expect(document.querySelectorAll('.assessment-questions-container input').length).toBeGreaterThan(0);

    // RESULT: the attempt is genuinely fresh — nothing was pre-answered.
    expect(document.body.textContent).toMatch(/الأسئلة المجاب عنها:/);
    expect(screen.getAllByRole('button', { name: /اعتماد وإرسال الإجابات/ })).toHaveLength(1);
  });

  it('hides the unit test for the incomplete unit in both the home page and the unit page', () => {
    render(<App />);

    // Home page: Unit 2's panel states the locked condition instead of offering a button.
    const unit2Panel = screen.getByRole('article', { name: new RegExp(UNIT2) });
    expect(within(unit2Panel).queryByRole('button', { name: /اختبار الوحدة/ })).toBeNull();
    expect(within(unit2Panel).getByText('يُفتح بعد إعلان اكتمال الوحدة رسميًا')).toBeInTheDocument();

    // Unit 2 page: same rule, and the review entry does not appear either.
    fireEvent.click(screen.getByRole('button', { name: `عرض دروس ${UNIT2}` }));
    expect(screen.getByRole('heading', { level: 1, name: UNIT2 })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ابدأ اختبار الوحدة' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'ابدأ المراجعة' })).toBeNull();
    expect(document.querySelector('.unit-page-assessments')).toBeNull();

    // RESULT: the three lessons of Unit 2 are still listed in curriculum order.
    const rows = document.querySelectorAll('.unit-page-lesson-row .unit-page-lesson-copy h3');
    expect(Array.from(rows).map((row) => row.textContent)).toEqual(
      getUnitById('unit2')!.lessons.map((lesson) => lesson.metadata.title),
    );
  });

  it('opens the lesson test from the last step of a lesson and keeps the 20-question contract', () => {
    render(<App />);

    const lesson1 = getLessonById('lesson1')!.lesson;
    fireEvent.click(screen.getByRole('button', { name: `عرض دروس ${UNIT1}` }));
    fireEvent.click(screen.getByRole('button', { name: /ابدأ الدرس 1:/ }));
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^الخطوة ${lesson1.steps.length}:`) }));

    // Only the last step offers the lesson test.
    fireEvent.click(screen.getByRole('button', { name: /بدء اختبار الدرس/ }));

    // RESULT: a lesson-scoped shell with its own title and hidden results.
    expect(screen.getByRole('heading', { level: 1, name: /اختبار الدرس/ })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'نتائج الاختبار' })).toBeNull();
    expect(document.body.textContent).toMatch(/اختبار درس \(20 سؤالاً\)/);
  });
});

describe('Phase 1 — the completion count is an owner declaration, not learner progress', () => {
  it('labels the hero completion stat as a declared state, never as work the learner finished', () => {
    render(<App />);

    const stats = document.querySelector('.home-hero-stats')!;
    expect(stats).toBeTruthy();

    // RESULT: the third stat reads as an official declaration…
    expect(textOf(stats)).toContain('اكتمال مُعلَن رسميًا');

    // …and no phrasing anywhere on the home page can be read as the learner
    // having completed a unit or a lesson.
    const homeText = textOf(document.querySelector('.home-page'));
    expect(homeText).not.toContain('وحدة مكتملة');
    expect(homeText).not.toContain('أتممت');
    expect(homeText).not.toContain('أكملت');
    expect(homeText).not.toMatch(/إنجازك|تقدّمك/);

    // The count itself is still driven purely by metadata.isComplete.
    const expected = getAllUnits().filter((unit) => unit.metadata.isComplete).length;
    const thirdStat = stats.querySelectorAll('li')[2];
    expect(textOf(thirdStat.querySelector('.ar-number'))).toBe(toArabicDigits(expected));
  });
});

describe('Phase 1 — numerals on the Arabic surfaces', () => {
  /** Every `.ar-number` on screen must hold Arabic-Indic digits only. */
  const arabicNumeralText = () =>
    Array.from(document.querySelectorAll('.ar-number')).map((el) => (el.textContent ?? '').trim());

  it('renders home-page counts with Arabic-Indic digits and no bare latin digits', () => {
    render(<App />);

    const numerals = arabicNumeralText();
    expect(numerals.length).toBeGreaterThan(0);
    for (const value of numerals) {
      // RESULT: no western digit survives inside a rendered number.
      expect(value).toMatch(/^[٠-٩]+$/);
    }

    // The lesson rows carry step counts and durations as Arabic-Indic numbers.
    const lesson1 = getLessonById('lesson1')!.lesson;
    const firstRow = document.querySelector('.unit-lesson-row')!;
    expect(textOf(firstRow.querySelector('.unit-lesson-meta'))).toContain(
      toArabicDigits(lesson1.steps.length) + ' خطوات',
    );
    expect(textOf(firstRow.querySelector('.unit-lesson-meta'))).toContain(
      toArabicDigits(lesson1.metadata.estimatedMinutes) + ' دقيقة',
    );
  });

  it('renders unit-page counts, and the per-lesson question count read from the assessment', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: `عرض دروس ${UNIT1}` }));

    for (const value of arabicNumeralText()) {
      expect(value).toMatch(/^[٠-٩]+$/);
    }

    // RESULT: the question count is the real length of the registered test.
    const lesson1 = getLessonById('lesson1')!.lesson;
    const test = getLessonTestByLessonId(lesson1.metadata.id)!;
    const rows = Array.from(document.querySelectorAll('.unit-page-lesson-row'));
    expect(textOf(rows[0].querySelector('.lesson-card-meta'))).toContain(
      `اختبار من ${toArabicDigits(test.questions.length)} سؤالًا`,
    );

    // And a lesson with no registered assessment advertises no exam chip at all.
    const unit2 = getUnitById('unit2')!;
    const lessonWithoutTest = unit2.lessons.find((lesson) => !getLessonTestByLessonId(lesson.metadata.id));
    expect(lessonWithoutTest).toBeDefined();
  });
});
