import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Unit3Lesson1StepRenderer } from '../components/curriculum/Unit3Lesson1StepRenderer';
import { resolveAnswerReveal, toStudentReveal } from '../components/common/answerDisclosure';
import { U3L1_ACTIVITIES, U3L1_ACTIVITY_BY_ID } from '../data/unit3Lesson1/activities';
import { U3L1_POEM, U3L1_STEPS, U3L1_STEP_CONTENT } from '../data/unit3Lesson1/content';
import { U3L1_LISTENING_AUDIO_GAP } from '../data/unit3Lesson1/sourceMeta';
import {
  U3L1_GUIDANCE_NOTICE,
  U3L1_LISTENING_GUIDANCE_NOTICE,
  U3L1_SUGGESTED_ANSWERS,
  U3L1_UNDECIDABLE_IDS,
  u3l1GuidanceNotice,
  u3l1RevealRecord,
} from '../data/unit3Lesson1/guidance';

/**
 * Owner review of PR #25 — the two points only.
 *
 * 1. The three listening items (U3L1-73-05/06/07). The recording does not exist
 *    in the source and the printed poem is NEVER assumed to be its text. The
 *    guidance is conditional («إذا كان النص المقصود بالاستماع هو القصيدة
 *    المطبوعة — وهذا غير مثبت —»): these tests pin the printed line each item is
 *    tied to, the mandated notice with its explicit condition, the fact that the
 *    guidance does NOT settle the listening questions (U3L1-73-05.أ stays open),
 *    and that the audio gap is still declared — nothing claims to transcribe
 *    audio and nothing claims a settled answer.
 *
 * 2. U3L1-81-03, the sender's name position. The transcribed `letterModel`
 *    proves only the ORDER of the lines (place+date first, signature last); it
 *    does not prove any visual position (top/bottom, right/left). These tests pin
 *    that the order alone is stated, that NO visual position is asserted, that
 *    the missing evidence (the scanned page 81) is named, and that none of the
 *    four printed options is presented as the answer.
 */

const poemText = U3L1_POEM.stanzas
  .map((stanza) => `${stanza.right} ${stanza.left}`)
  .join('\n');

/**
 * Compare Arabic text without depending on the exact tashkeel of the printed
 * poem: the assertion is "these words come from the poem", not "these vowels".
 */
const normalized = (value: string) =>
  value
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

describe('point 1 — listening items answered from the PRINTED poem, never from audio', () => {
  const LISTENING = ['u3l1-a-05', 'u3l1-a-06', 'u3l1-a-07'] as const;

  it('they are now guidance_only, and the approved key stays at zero', () => {
    LISTENING.forEach((id) => {
      expect(U3L1_ACTIVITY_BY_ID[id].disclosure.kind).toBe('guidance_only');
    });
    expect(U3L1_ACTIVITIES.some((activity) => activity.disclosure.kind === 'approved_key')).toBe(false);
  });

  it('every listening answer carries the mandated conditional notice', () => {
    /* The owner's sentence is kept verbatim… */
    expect(U3L1_LISTENING_GUIDANCE_NOTICE).toContain(
      'إرشادات مقترحة استنادًا إلى القصيدة المطبوعة، وليست تفريغًا للتسجيل الصوتي أو إجابة مؤكدة لما ورد فيه.',
    );
    /* …and the condition is stated explicitly, not left to inference. */
    expect(U3L1_LISTENING_GUIDANCE_NOTICE).toContain('إذا كان النص المقصود');
    expect(U3L1_LISTENING_GUIDANCE_NOTICE).toContain('لا تحسم إجابات أسئلة الاستماع');
    LISTENING.forEach((id) => {
      expect(U3L1_SUGGESTED_ANSWERS[id].notice).toBe(U3L1_LISTENING_GUIDANCE_NOTICE);
      expect(u3l1GuidanceNotice(id)).toBe(U3L1_LISTENING_GUIDANCE_NOTICE);
      expect(u3l1GuidanceNotice(id)).not.toBe(U3L1_GUIDANCE_NOTICE);
    });
    /* …while the other answers keep the generic notice. */
    expect(u3l1GuidanceNotice('u3l1-a-13')).toBe(U3L1_GUIDANCE_NOTICE);
  });

  it('the audio gap is still declared on the three activities', () => {
    LISTENING.forEach((id) => {
      expect(U3L1_ACTIVITY_BY_ID[id].gapNote).toBe(U3L1_LISTENING_AUDIO_GAP);
    });
    expect(U3L1_LISTENING_AUDIO_GAP).toContain('لا يُعرض نصّ استماع');
  });

  it('every listening answer is phrased CONDITIONALLY: the poem is never assumed to be the recording', () => {
    LISTENING.forEach((id) => {
      const entry = U3L1_SUGGESTED_ANSWERS[id];
      expect(entry.modelAnswer, id).toContain('إذا كان النص المقصود');
      expect(entry.modelAnswer, id).toContain('غير مثبت');
      /* No flat assertion that this IS the listening text. */
      expect(`${entry.modelAnswer} ${entry.explanation}`, id).not.toMatch(
        /نصّ الاستماع هو القصيدة|القصيدة هي نصّ الاستماع|الكاتب في القصيدة/,
      );
    });
  });

  it('U3L1-73-05 does NOT present «واثق» as an answer to the recording', () => {
    const entry = U3L1_SUGGESTED_ANSWERS['u3l1-a-05'];
    /* The literal part is still tied to the printed verse, conditionally. */
    expect(entry.modelAnswer).toContain('لَنْ يَغْلِبَنا الجَهْلُ');
    expect(normalized(poemText)).toContain(normalized('كَلّا لَنْ يَغْلِبَنا الجَهْلُ'));
    /* «واثق» survives only as a conditional inference, never as a settled key. */
    expect(entry.modelAnswer).toContain('واثِقٌ');
    expect(entry.modelAnswer).toMatch(/إن كان السؤال عنها/);
    expect(entry.explanation).toContain('لا تحسم');
    /* Part أ is declared unsettled: the poem does not contain «الكاتب». */
    expect(entry.modelAnswer).toContain('لا يمكن حسمه');
    expect(entry.explanation).toContain('الشطر «أ» فيبقى دون حسم');
    expect(normalized(poemText)).not.toContain(normalized('الكاتب'));
  });

  it('U3L1-73-06 ties both blanks to printed verses without claiming the recording', () => {
    const entry = U3L1_SUGGESTED_ANSWERS['u3l1-a-06'];
    expect(entry.modelAnswer).toContain('الحَلُّ');
    expect(entry.modelAnswer).toContain('العَمَل');
    expect(normalized(poemText)).toContain(
      normalized('نَبْحَثُ في أَيَّةِ مُشْكَلَةٍ وَسَرِيعاً يَأْتينا الحَلُّ!'),
    );
    expect(normalized(poemText)).toContain(normalized('وَسَعادَتُنا أَنَّا... نَعْمَلُ'));
    expect(entry.modelAnswer).toContain('إذا كان النص المقصود');
    expect(entry.explanation).toContain('لا يُدّعى أنها محسومة');
    /* The stem's wording matches the printed line it completes. */
    const printed = U3L1_ACTIVITY_BY_ID['u3l1-a-06'].subparts.join(' ');
    expect(printed).toContain('نَبْحَثُ في أَيَّةِ مُشْكَلَةٍ وَسَرِيعاً يَأْتينا');
    expect(printed).toContain('تَتَحَقَّقُ سَعادَتُنا بِـ');
  });

  it('U3L1-73-07 titles are conditional suggestions, not answers to the recording', () => {
    const entry = U3L1_SUGGESTED_ANSWERS['u3l1-a-07'];
    expect(entry.modelAnswer).toContain('إذا كان النص المقصود');
    expect(entry.modelAnswer).toContain('لا إجابات عن التسجيل');
    expect(entry.explanation).toMatch(/مفتوح|لا يوجد عنوان واحد/);
    expect(entry.explanation).toContain('ولا تُقدَّم هذه العناوين جوابًا مؤكدًا');
  });

  it('no listening answer claims to be a transcription, an approved key or a settled listening answer', () => {
    LISTENING.forEach((id) => {
      const text = `${U3L1_SUGGESTED_ANSWERS[id].modelAnswer} ${U3L1_SUGGESTED_ANSWERS[id].explanation}`;
      expect(text).not.toMatch(/تفريغ|قال المتحدث|التسجيل يقول/);
      expect(text).not.toMatch(/إجابة معتمدة|مفتاح إجابة/);
      expect(text).not.toMatch(/فلا شكّ فيه|جواب مؤكد/);
    });
  });

  it('the student sees the conditional notice next to the listening activity', () => {
    render(<Unit3Lesson1StepRenderer step={U3L1_STEPS[0]} />);

    const item05 = screen.getByLabelText('نشاط المصدر U3L1-73-05');
    fireEvent.click(within(item05).getByRole('button', { name: 'أظهر الجواب' }));
    expect(within(item05).getByText(U3L1_LISTENING_GUIDANCE_NOTICE)).toBeVisible();
    expect(within(item05).queryByText(U3L1_GUIDANCE_NOTICE)).toBeNull();
    expect(within(item05).getByText('إرشادات للإجابة')).toBeInTheDocument();
    expect(within(item05).queryByText('الحل النموذجي المعتمد')).toBeNull();
    expect(within(item05).getByText(U3L1_SUGGESTED_ANSWERS['u3l1-a-05'].modelAnswer)).toHaveTextContent(
      'إذا كان النص المقصود',
    );
    /* The declared audio gap is still on screen for the same activity. */
    const notes = within(item05).getAllByRole('note').map((note) => note.textContent ?? '');
    expect(notes.some((note) => note.includes('التسجيل'))).toBe(true);
  });

  it('a record declared no_approved_content still yields nothing (guard)', () => {
    const gapRecord = {
      ...u3l1RevealRecord(U3L1_ACTIVITY_BY_ID['u3l1-a-45']),
      disclosure: { kind: 'no_approved_content' as const, sourceRef: 'U3L1-80-02' },
      modelAnswer: 'نصّ مُقحم',
    };
    expect(toStudentReveal(gapRecord)).toBeNull();
  });
});

describe('point 2 — U3L1-81-03 is not answered by a guess', () => {
  const record = U3L1_ACTIVITY_BY_ID['u3l1-a-51'];
  const entry = U3L1_SUGGESTED_ANSWERS['u3l1-a-51'];

  it('states only what the transcribed model proves: the ORDER of the lines', () => {
    expect(entry.modelAnswer).toContain('ترتيب الأسطر');
    expect(entry.modelAnswer).toContain('دمشق ٢٠١٨/٢/٢٦');
    expect(entry.modelAnswer).toContain('صَديقُكَ مازِن');
    expect(entry.modelAnswer).toContain('أوّلًا');
    expect(entry.modelAnswer).toContain('آخرًا');
  });

  it('does NOT claim a visual position (top/bottom, right/left) anywhere', () => {
    const text = `${entry.modelAnswer} ${entry.explanation} ${entry.notice ?? ''}`;
    /* No settled positional assertion… */
    expect(entry.modelAnswer).not.toMatch(/في أعلى (الرسالة|الصفحة)|في أسفل (الرسالة|الصفحة)/);
    expect(entry.modelAnswer).not.toMatch(/أعلى الرسالة|أسفل الرسالة/);
    /* …and the needed evidence is named instead. */
    expect(entry.modelAnswer).toContain('لا يثبته النصّ المنقول');
    expect(entry.explanation).toContain('صورة الصفحة المطبوعة');
    expect(entry.explanation).toContain('الموضع البصري');
    expect(text).toContain('لم يُخمَّن');
  });

  it('presents none of the four printed options as the answer', () => {
    expect(entry.modelAnswer).not.toMatch(/\(أ\)|\(ب\)|\(ت\)|\(ث\)/);
    expect(entry.modelAnswer).not.toMatch(/أعلى الصفحة ويسارها|أسفل الصفحة ويمينها|أسفل الصفحة ويسارها/);
    expect(entry.modelAnswer).toContain('ولا تُعرض أي من الخيارات الأربعة إجابةً محسومة');
    expect(entry.notice).toContain('فلم تُقدَّم إجابة عن أي من الخيارات الأربعة');
  });

  it('keeps its own honest notice instead of the generic one', () => {
    expect(u3l1GuidanceNotice('u3l1-a-51')).toBe(entry.notice);
    expect(entry.notice).toBeDefined();
    expect(entry.notice).toContain('لا يثبت الموضع البصري');
    expect(entry.notice).not.toBe(U3L1_GUIDANCE_NOTICE);
  });

  it('the record is still guidance_only — an unsettled part is not promoted to a key', () => {
    expect(record.disclosure.kind).toBe('guidance_only');
    const payload = resolveAnswerReveal(u3l1RevealRecord(record), 'student');
    expect(payload).not.toBeNull();
    expect(payload!.heading).toBe('إرشادات للإجابة');
    expect(payload!.heading).not.toContain('المعتمد');
  });

  it('the learner sees the settled order and the open position side by side', () => {
    render(<Unit3Lesson1StepRenderer step={U3L1_STEPS[8]} />);
    const letter = screen.getByLabelText('نشاط المصدر U3L1-81-03');
    fireEvent.click(within(letter).getByRole('button', { name: 'أظهر الجواب' }));

    expect(within(letter).getByText(entry.modelAnswer)).toBeVisible();
    expect(within(letter).getByText(u3l1GuidanceNotice('u3l1-a-51'))).toBeVisible();
    expect(within(letter).queryByText(/\(ث\)/)).toBeNull();
  });
});

describe('scope guard — the other answers were not touched', () => {
  it('only the five calligraphy records stay without content, and nothing became a key', () => {
    const gapIds = U3L1_ACTIVITIES.filter((activity) => activity.disclosure.kind === 'no_approved_content').map(
      (activity) => activity.id,
    );
    expect(gapIds).toEqual(['u3l1-a-45', 'u3l1-a-46', 'u3l1-a-47', 'u3l1-a-48', 'u3l1-a-49']);
    expect(U3L1_UNDECIDABLE_IDS).toEqual(gapIds);
    expect(U3L1_ACTIVITIES.some((activity) => activity.disclosure.kind === 'approved_key')).toBe(false);
    expect(U3L1_ACTIVITIES.filter((activity) => activity.disclosure.kind === 'guidance_only')).toHaveLength(52);
    U3L1_ACTIVITIES.forEach((activity) => {
      expect(activity.disclosure.sourceRef.trim().length).toBeGreaterThan(0);
    });
  });

  it('the book text, the poem and the activity order are unchanged', () => {
    expect(U3L1_POEM.stanzas).toHaveLength(8);
    expect(U3L1_POEM.stanzas[5].left).toContain('نَعْمَلُ');
    expect(U3L1_STEP_CONTENT['u3l1-s1'].blocks.length).toBeGreaterThan(0);
    const order = U3L1_STEPS.flatMap((step) =>
      U3L1_STEP_CONTENT[step.id].blocks
        .filter((block) => block.kind === 'activity')
        .map((block) => (block as { activityId: string }).activityId),
    );
    expect(order).toEqual(U3L1_ACTIVITIES.map((activity) => activity.id));
  });
});
