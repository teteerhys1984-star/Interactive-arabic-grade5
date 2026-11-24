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
 *    in the source, but the poem IS printed on ص٧٤. These tests pin the exact
 *    line of the poem each answer rests on, the mandated notice, and the fact
 *    that the audio gap is still declared — nothing claims to transcribe audio.
 *
 * 2. U3L1-81-03, the sender's name position. The current answer picked a letter
 *    AND told the learner to follow the printed model if it differed. That is a
 *    contradiction. These tests pin that no option is presented as the answer,
 *    that the settled part (top / bottom) is stated, and that the ambiguity is
 *    named instead of guessed.
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

  it('every listening answer carries the mandated notice verbatim, not the generic one', () => {
    expect(U3L1_LISTENING_GUIDANCE_NOTICE).toBe(
      'إرشادات مقترحة استنادًا إلى القصيدة المطبوعة، وليست تفريغًا للتسجيل الصوتي أو إجابة مؤكدة لما ورد فيه.',
    );
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

  it('U3L1-73-05 answers are traceable to the printed poem, and the settled blank is literal', () => {
    const answer = U3L1_SUGGESTED_ANSWERS['u3l1-a-05'].modelAnswer;
    /* Part ب is printed verbatim in stanza 2 — this one is settled. */
    expect(answer).toContain('الجَهْلُ');
    expect(normalized(poemText)).toContain(normalized('كَلّا لَنْ يَغْلِبَنا الجَهْلُ'));
    /* Part أ is an inference from the poem's confident voice, and says so. */
    expect(answer).toContain('واثِقٌ');
    expect(answer).not.toContain('مُتَرَدِّدٌ');
    expect(U3L1_SUGGESTED_ANSWERS['u3l1-a-05'].explanation).toMatch(/استدلال|لا حكم على تسجيل/);
  });

  it('U3L1-73-06 fills both blanks with words printed in the poem', () => {
    const answer = U3L1_SUGGESTED_ANSWERS['u3l1-a-06'].modelAnswer;
    expect(answer).toContain('الحَلُّ');
    expect(answer).toContain('العَمَل');
    /* The poem holds both source lines. */
    expect(normalized(poemText)).toContain(
      normalized('نَبْحَثُ في أَيَّةِ مُشْكِلَةٍ وَسَرِيعاً يَأْتينا الحَلُّ!'),
    );
    expect(normalized(poemText)).toContain(normalized('وَسَعادَتُنا أَنَّا... نَعْمَلُ'));
    /* The stem's wording matches the printed line it completes. */
    const printed = U3L1_ACTIVITY_BY_ID['u3l1-a-06'].subparts.join(' ');
    expect(printed).toContain('نَبْحَثُ في أَيَّةِ مُشْكَلَةٍ وَسَرِيعاً يَأْتينا');
    expect(printed).toContain('تَتَحَقَّقُ سَعادَتُنا بِـ');
  });

  it('U3L1-73-07 titles are drawn from the poem and declared open', () => {
    const entry = U3L1_SUGGESTED_ANSWERS['u3l1-a-07'];
    expect(entry.modelAnswer).toContain('لَنْ يَغْلِبَنا الجَهْلُ');
    expect(entry.explanation).toMatch(/مفتوح|لا يوجد عنوان واحد/);
    /* Nothing presented as the single right title. */
    expect(entry.explanation).toMatch(/تُقبل/);
  });

  it('no listening answer claims to be a transcription or an approved key', () => {
    LISTENING.forEach((id) => {
      const text = `${U3L1_SUGGESTED_ANSWERS[id].modelAnswer} ${U3L1_SUGGESTED_ANSWERS[id].explanation}`;
      expect(text).not.toMatch(/تفريغ|نصّ الاستماع|قال المتحدث|التسجيل يقول/);
      expect(text).not.toMatch(/إجابة معتمدة|مفتاح إجابة/);
    });
  });

  it('the student sees the mandated notice next to the listening activity', () => {
    render(<Unit3Lesson1StepRenderer step={U3L1_STEPS[0]} />);

    const item05 = screen.getByLabelText('نشاط المصدر U3L1-73-05');
    fireEvent.click(within(item05).getByRole('button', { name: 'أظهر الجواب' }));
    expect(within(item05).getByText(U3L1_LISTENING_GUIDANCE_NOTICE)).toBeVisible();
    expect(within(item05).queryByText(U3L1_GUIDANCE_NOTICE)).toBeNull();
    expect(within(item05).getByText('إرشادات للإجابة')).toBeInTheDocument();
    expect(within(item05).queryByText('الحل النموذجي المعتمد')).toBeNull();
    /* The declared audio gap is still on screen for the same activity. */
    const notes = within(item05).getAllByRole('note').map((note) => note.textContent ?? '');
    expect(notes.some((note) => note.includes('التسجيل'))).toBe(true);
  });

  it('a listening item with no support in the printed poem would stay silent (guard)', () => {
    /* Documented boundary: only poem-supported inference is allowed. A record
       declared no_approved_content still yields nothing, whatever text it holds. */
    const audioOnly = {
      ...u3l1RevealRecord(U3L1_ACTIVITY_BY_ID['u3l1-a-45']),
      disclosure: { kind: 'no_approved_content' as const, sourceRef: 'U3L1-80-02' },
      modelAnswer: 'نصّ مُقحم',
    };
    expect(toStudentReveal(audioOnly)).toBeNull();
  });
});

describe('point 2 — U3L1-81-03 is not answered by a guess', () => {
  const record = U3L1_ACTIVITY_BY_ID['u3l1-a-51'];
  const entry = U3L1_SUGGESTED_ANSWERS['u3l1-a-51'];

  it('states the settled facts from the printed model: date at the top, sender at the bottom', () => {
    expect(entry.modelAnswer).toContain('أعلى');
    expect(entry.modelAnswer).toContain('أسفل');
    expect(entry.modelAnswer).toContain('دمشق ٢٠١٨/٢/٢٦');
    expect(entry.modelAnswer).toContain('صَديقُكَ مازِن');
    /* …and nothing about a right/left side presented as the answer. */
    expect(entry.modelAnswer).not.toMatch(/يمينها|يسارها/);
  });

  it('presents none of the four printed options as the answer', () => {
    expect(entry.modelAnswer).not.toMatch(/\(أ\)|\(ب\)|\(ت\)|\(ث\)/);
    expect(entry.modelAnswer).not.toMatch(/أعلى الصفحة ويسارها|أسفل الصفحة ويمينها|أسفل الصفحة ويسارها/);
    /* The explanation names which distinction stayed open. */
    expect(entry.explanation).toContain('لم يُحسم');
    expect(entry.explanation).toMatch(/يمين|يسار/);
  });

  it('keeps its own honest notice instead of the generic one', () => {
    expect(u3l1GuidanceNotice('u3l1-a-51')).toBe(entry.notice);
    expect(entry.notice).toBeDefined();
    expect(entry.notice).toContain('لم يُحسم موضع السطر');
    expect(entry.notice).not.toBe(U3L1_GUIDANCE_NOTICE);
  });

  it('the record is still guidance_only — an unsettled part is not promoted to a key', () => {
    expect(record.disclosure.kind).toBe('guidance_only');
    const payload = resolveAnswerReveal(u3l1RevealRecord(record), 'student');
    expect(payload).not.toBeNull();
    expect(payload!.heading).toBe('إرشادات للإجابة');
    expect(payload!.heading).not.toContain('المعتمد');
  });

  it('the learner sees the settled part and the open part side by side', () => {
    render(<Unit3Lesson1StepRenderer step={U3L1_STEPS[8]} />);
    const letter = screen.getByLabelText('نشاط المصدر U3L1-81-03');
    fireEvent.click(within(letter).getByRole('button', { name: 'أظهر الجواب' }));

    expect(within(letter).getByText(entry.modelAnswer)).toBeVisible();
    expect(within(letter).getByText(u3l1GuidanceNotice('u3l1-a-51'))).toBeVisible();
    expect(within(letter).queryByText(/\(ث\)/)).toBeNull();
  });
});

describe('scope guard — the other answers were not touched', () => {
  it('only the three listening records changed class, and the five gaps stayed gaps', () => {
    const gapIds = U3L1_ACTIVITIES.filter((activity) => activity.disclosure.kind === 'no_approved_content').map(
      (activity) => activity.id,
    );
    expect(gapIds).toEqual(['u3l1-a-45', 'u3l1-a-46', 'u3l1-a-47', 'u3l1-a-48', 'u3l1-a-49']);
    expect(U3L1_UNDECIDABLE_IDS).toEqual(gapIds);
    /* Every activity still has exactly one disclosure and a source reference. */
    U3L1_ACTIVITIES.forEach((activity) => {
      expect(activity.disclosure.sourceRef.trim().length).toBeGreaterThan(0);
    });
    /* No content was added to this suite's scope: the poem and stems unchanged. */
    expect(U3L1_POEM.stanzas).toHaveLength(8);
    expect(U3L1_STEP_CONTENT['u3l1-s1'].blocks.length).toBeGreaterThan(0);
  });
});
