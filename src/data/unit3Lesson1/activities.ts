import { AnswerDisclosure } from '../../types/curriculum';
import { u3l1Src, U3L1_LISTENING_AUDIO_GAP, U3L1_LOCKED_SOURCE_NOTES } from './sourceMeta';

/**
 * Unit 3, Lesson 1 («العُلَماءُ الصِّغار», pp. 73–83) — source activity ledger.
 *
 * Every entry reproduces one printed, numbered/delimited task from the eleven
 * supplied scans, in printed order. `instruction` is verbatim book wording;
 * interaction data (choices, columns, field labels) is interface scaffolding,
 * never an answer key: this lesson deliberately carries NO answerKey, NO
 * correctChoiceId and NO teacher solution, because the supplied source has no
 * approved answer key and the owner forbids inventing one.
 *
 * Counting rule: each specific directive requesting an independent
 * response/production/performance is one record; introductory directives with
 * no independent performance are instruction blocks, not activities.
 *
 * Drafts are scoped by `sourceActivityId` through the existing sessionStorage
 * draftStorage utility, exactly like the previous lessons.
 */

export type U3L1Interaction =
  | { kind: 'text_fields'; fields: { id: string; label: string; multiline?: boolean }[] }
  | { kind: 'write'; label?: string; rows?: number }
  | { kind: 'choice_groups'; groups: { id: string; label: string; choices: { id: string; text: string }[] }[] }
  | { kind: 'matching'; leftItems: { id: string; text: string }[]; rightItems: { id: string; text: string }[] }
  | { kind: 'table_rows'; columns: string[]; rows: number }
  | { kind: 'speak'; criteria?: string[] }
  | { kind: 'handwriting'; modelDescription?: string; modelText?: string }
  | { kind: 'cards'; initialCards: number };

export interface U3L1Activity {
  id: string;
  sourceActivityId: string;
  printedNumber: string;
  section: string;
  page: number;
  /** Verbatim printed instruction. */
  instruction: string;
  /** Printed sub-items / options reproduced verbatim, when present. */
  subparts: string[];
  interaction: U3L1Interaction;
  source: ReturnType<typeof u3l1Src>;
  /** Declared source limit shown to the learner instead of a guessed replacement. */
  gapNote?: string;
  /**
   * Explicit, mandatory disclosure decision.
   *
   * This lesson still has NO approved answer key, so `approved_key` is never
   * used and nothing here is attributed to the book. Educational answers are
   * platform-authored and live in `./guidance.ts`, one entry per answerable
   * activity, and every such record declares `guidance_only`.
   *
   * The five records that depend on an artifact the source does not contain (the
   * calligraphy items on ص٨٠–٨١, whose Ruq'ah models are hand-drawn and cannot be
   * replaced by a machine font) keep `no_approved_content`: no answer is invented
   * for them and no «أظهر الجواب» button is rendered.
   *
   * The three listening items on ص٧٣ carry `guidance_only` too — but ONLY for
   * what the poem printed on ص٧٤ supports, and each shows the mandated notice
   * «إرشادات مقترحة استنادًا إلى القصيدة المطبوعة، وليست تفريغًا للتسجيل الصوتي
   * أو إجابة مؤكدة لما ورد فيه». The audio gap itself stays declared on screen:
   * nothing here claims to transcribe a recording the source does not contain.
   */
  disclosure: AnswerDisclosure;
}

export const U3L1_ACTIVITIES: U3L1Activity[] = [
  /* ============ ص٧٣: أتأمّل الصورتين ============ */
  {
    id: 'u3l1-a-01', sourceActivityId: 'U3L1-73-01', printedNumber: '١', section: 'أتأمّل الصورتين', page: 73,
    instruction: 'أَعُدُّ عَناصِرَ الصُّورَتَيْنِ.', subparts: [],
    interaction: { kind: 'write', label: 'عناصر الصورتين', rows: 3 },
    source: u3l1Src(73, 'textbook_exercise', 'أتأمّل الصورتين', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-73-01' },
  },
  {
    id: 'u3l1-a-02', sourceActivityId: 'U3L1-73-02', printedNumber: '٢', section: 'أتأمّل الصورتين', page: 73,
    instruction: 'أَذْكُرُ الرَّابِطَ بَيْنَ الصُّورَتَيْنِ.', subparts: [],
    interaction: { kind: 'write', label: 'الرابط بين الصورتين', rows: 2 },
    source: u3l1Src(73, 'textbook_exercise', 'أتأمّل الصورتين', 2),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-73-02' },
  },
  {
    id: 'u3l1-a-03', sourceActivityId: 'U3L1-73-03', printedNumber: '٣', section: 'أتأمّل الصورتين', page: 73,
    instruction: 'أَشْرَحُ ما يَقومُ بِهِ التَّلاميذُ في الصُّورَتَيْنِ.', subparts: [],
    interaction: { kind: 'write', label: 'ما يقوم به التلاميذ', rows: 3 },
    source: u3l1Src(73, 'textbook_exercise', 'أتأمّل الصورتين', 3),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-73-03' },
  },
  {
    id: 'u3l1-a-04', sourceActivityId: 'U3L1-73-04', printedNumber: '٤', section: 'أتأمّل الصورتين', page: 73,
    instruction: 'أُخْبِرُ زُمَلائي بِالصُّورَةِ الَّتي تُعَبِّرُ عَنِ المَجالِ الدِّراسِيِّ الَّذي أَهْتَمُّ بِهِ، مُبَيِّناً سَبَبَ اهْتِمامي.', subparts: [],
    interaction: { kind: 'speak' },
    source: u3l1Src(73, 'textbook_exercise', 'أتأمّل الصورتين', 4),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-73-04' },
  },

  /* ============ ص٧٣: أستمع إلى النص ============ */
  {
    id: 'u3l1-a-05', sourceActivityId: 'U3L1-73-05', printedNumber: '١', section: 'أستمع إلى النص', page: 73,
    instruction: 'أَخْتارُ الإِجابَةَ الصَّحيحَةَ مِمّا بَيْنَ القَوْسَيْنِ:',
    subparts: [
      'أ. الكاتِبُ في النَّصِّ: (مُتَرَدِّدٌ – واثِقٌ – واثِقٌ حِيناً مُتَرَدِّدٌ حِيناً)',
      'ب. لَنْ يَغْلِبَنا: (الجَهْلُ – الفَشَلُ – الكَذِبُ)',
    ],
    interaction: {
      kind: 'choice_groups',
      groups: [
        {
          id: 'g-katib', label: 'أ. الكاتِبُ في النَّصِّ:',
          choices: [
            { id: 'mutaraddid', text: 'مُتَرَدِّدٌ' },
            { id: 'wathiq', text: 'واثِقٌ' },
            { id: 'wathiq-hina', text: 'واثِقٌ حِيناً مُتَرَدِّدٌ حِيناً' },
          ],
        },
        {
          id: 'g-yaghlibana', label: 'ب. لَنْ يَغْلِبَنا:',
          choices: [
            { id: 'jahl', text: 'الجَهْلُ' },
            { id: 'fashal', text: 'الفَشَلُ' },
            { id: 'kathib', text: 'الكَذِبُ' },
          ],
        },
      ],
    },
    source: u3l1Src(73, 'textbook_exercise', 'أستمع إلى النص', 1, U3L1_LISTENING_AUDIO_GAP),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-73-05' },
    gapNote: U3L1_LISTENING_AUDIO_GAP,
  },
  {
    id: 'u3l1-a-06', sourceActivityId: 'U3L1-73-06', printedNumber: '٢', section: 'أستمع إلى النص', page: 73,
    instruction: 'أُكْمِلُ الفَراغاتِ الآتِيَةَ بِما يُناسِبُها:',
    subparts: [
      'أ. نَبْحَثُ في أَيَّةِ مُشْكَلَةٍ وَسَرِيعاً يَأْتينا .............',
      'ب. تَتَحَقَّقُ سَعادَتُنا بِـ .............',
    ],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'blank-a', label: 'أ. نَبْحَثُ في أَيَّةِ مُشْكَلَةٍ وَسَرِيعاً يَأْتينا', multiline: true },
        { id: 'blank-b', label: 'ب. تَتَحَقَّقُ سَعادَتُنا بِـ', multiline: true },
      ],
    },
    source: u3l1Src(73, 'textbook_exercise', 'أستمع إلى النص', 2, U3L1_LISTENING_AUDIO_GAP),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-73-06' },
    gapNote: U3L1_LISTENING_AUDIO_GAP,
  },
  {
    id: 'u3l1-a-07', sourceActivityId: 'U3L1-73-07', printedNumber: '٣', section: 'أستمع إلى النص', page: 73,
    instruction: 'أَقْتَرِحُ عَناوينَ أُخْرى لِلنَّصِّ.', subparts: [],
    interaction: { kind: 'write', label: 'عناوين أخرى أقترحها', rows: 3 },
    source: u3l1Src(73, 'textbook_exercise', 'أستمع إلى النص', 3, U3L1_LISTENING_AUDIO_GAP),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-73-07' },
    gapNote: U3L1_LISTENING_AUDIO_GAP,
  },

  /* ============ ص٧٤: أقرأ ============ */
  {
    id: 'u3l1-a-08', sourceActivityId: 'U3L1-74-01', printedNumber: '١', section: 'أقرأ', page: 74,
    instruction: 'أَقْرَأُ المَقْطَعَ الأَوَّلَ قِراءَةً جَهْرِيَّةً مُراعِياً التَّلْوينَ الصَّوْتِيَّ بَيْنَ النَّفْيِ وَالإِثْباتِ.', subparts: [],
    interaction: { kind: 'speak' },
    source: u3l1Src(74, 'textbook_poetry', 'أقرأ', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-74-01' },
  },
  {
    id: 'u3l1-a-09', sourceActivityId: 'U3L1-74-02', printedNumber: '٢', section: 'أقرأ', page: 74,
    instruction: 'أَقْرَأُ المَقْطَعَ الثّاني قِراءَةً جَهْرِيَّةً مُراعِياً الضَّبْطَ السَّليمَ.', subparts: [],
    interaction: { kind: 'speak' },
    source: u3l1Src(74, 'textbook_poetry', 'أقرأ', 2),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-74-02' },
  },
  {
    id: 'u3l1-a-10', sourceActivityId: 'U3L1-74-03', printedNumber: '٣', section: 'أقرأ', page: 74,
    instruction: 'أَقْرَأُ النَّصَّ قِراءَةً جَهْرِيَّةً سَليمَةً مُراعِياً التَّلْوينَ الصَّوْتِيَّ المُناسِبَ لِلْمَعْنى. في دَقيقَتَيْنِ.', subparts: [],
    interaction: { kind: 'speak' },
    source: u3l1Src(74, 'textbook_poetry', 'أقرأ', 3),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-74-03' },
  },

  /* ============ ص٧٥: الفهم القرائي (١–١٠) ============ */
  {
    id: 'u3l1-a-11', sourceActivityId: 'U3L1-75-01', printedNumber: '١', section: 'الفهم القرائي', page: 75,
    instruction: 'أُعاوِنُ زُمَلائي على إِكْمالِ الفَراغاتِ الآتِيَةِ:',
    subparts: [
      '– مَعْنى (نَتَوانَى) .............',
      '– ضِدُّ (الجَهْلِ) .............',
      '– مَعْنى (نَسْمُو) .............',
      '– مُفْرَدُ (أَقْمَار) .............',
      '– جَمْعُ (الحَلِّ) .............',
    ],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'v-natwana', label: 'مَعْنى (نَتَوانَى)', multiline: true },
        { id: 'v-jahl', label: 'ضِدُّ (الجَهْلِ)', multiline: true },
        { id: 'v-nasmu', label: 'مَعْنى (نَسْمُو)', multiline: true },
        { id: 'v-aqmar', label: 'مُفْرَدُ (أَقْمَار)', multiline: true },
        { id: 'v-hall', label: 'جَمْعُ (الحَلِّ)', multiline: true },
      ],
    },
    source: u3l1Src(75, 'textbook_exercise', 'الفهم القرائي', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-75-01' },
  },
  {
    id: 'u3l1-a-12', sourceActivityId: 'U3L1-75-02', printedNumber: '٢', section: 'الفهم القرائي', page: 75,
    instruction: 'أَسْتَنْتِجُ الفِكْرَةَ العامَّةَ.', subparts: [],
    interaction: { kind: 'write', label: 'الفكرة العامة', rows: 3 },
    source: u3l1Src(75, 'textbook_exercise', 'الفهم القرائي', 2),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-75-02' },
  },
  {
    id: 'u3l1-a-13', sourceActivityId: 'U3L1-75-03', printedNumber: '٣', section: 'الفهم القرائي', page: 75,
    instruction: 'أَسْتَبْعِدُ الفِكْرَةَ الَّتي لا تَنْتَمي إِلَى النَّصِّ:',
    subparts: [
      '– العَمَلُ طَريقُ السُّمُوِّ.',
      '– تَجاوُزُ الصِّعابِ بِالتَّعاوُنِ.',
      '– العَمَلُ يُحَقِّقُ السَّعادَةَ.',
      '– بِناءُ الوَطَنِ عِلْمٌ فَحَسْبُ.',
    ],
    interaction: { kind: 'write', label: 'الفكرة المستبعدة', rows: 3 },
    source: u3l1Src(75, 'textbook_exercise', 'الفهم القرائي', 3),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-75-03' },
  },
  {
    id: 'u3l1-a-14', sourceActivityId: 'U3L1-75-04', printedNumber: '٤', section: 'الفهم القرائي', page: 75,
    instruction: 'أَسْتَخْرِجُ مِنَ البَيْتَيْنِ الخامِسِ وَالسّادِسِ سَبَباً وَنَتيجَةً:',
    subparts: ['– السَّبَبُ: .............', '– النَّتيجَةُ: .............'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'cause', label: 'السَّبَبُ', multiline: true },
        { id: 'result', label: 'النَّتيجَةُ', multiline: true },
      ],
    },
    source: u3l1Src(75, 'textbook_exercise', 'الفهم القرائي', 4),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-75-04' },
  },
  {
    id: 'u3l1-a-15', sourceActivityId: 'U3L1-75-05', printedNumber: '٥', section: 'الفهم القرائي', page: 75,
    instruction: 'أَيُّ التَّعْبِيرَيْنِ أَجْمَلُ في رَأْيِكَ، وَلِماذا؟',
    subparts: ['نَنْهَلُ عِلْماً، لا نَتَوانَى.', 'نَأْخُذُ عِلْماً، لا نَتَكاسَلُ.'],
    interaction: { kind: 'write', label: 'التعبير الأجمل ولماذا', rows: 3 },
    source: u3l1Src(75, 'textbook_exercise', 'الفهم القرائي', 5),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-75-05' },
  },
  {
    id: 'u3l1-a-16', sourceActivityId: 'U3L1-75-06', printedNumber: '٦', section: 'الفهم القرائي', page: 75,
    instruction: 'أَسْتَخْرِجُ المَشاعِرَ الوارِدَةَ في المَقْطَعِ الأَوَّلِ مِنَ النَّصِّ.', subparts: [],
    interaction: { kind: 'write', label: 'المشاعر في المقطع الأول', rows: 3 },
    source: u3l1Src(75, 'textbook_exercise', 'الفهم القرائي', 6),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-75-06' },
  },
  {
    id: 'u3l1-a-17', sourceActivityId: 'U3L1-75-07', printedNumber: '٧', section: 'الفهم القرائي', page: 75,
    instruction: 'أَكْتُبُ خُطَّةَ عَمَلٍ أَعْتَمِدُها في حَياتي لَأَكونَ عالِماً في المُسْتَقْبَلِ.', subparts: [],
    interaction: { kind: 'write', label: 'خطة العمل', rows: 4 },
    source: u3l1Src(75, 'textbook_exercise', 'الفهم القرائي', 7),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-75-07' },
  },
  {
    id: 'u3l1-a-18', sourceActivityId: 'U3L1-75-08', printedNumber: '٨', section: 'الفهم القرائي', page: 75,
    instruction: 'لَوْ كُنْتَ مَكانَ الكاتِبِ لَأَضَفْتَ عُنْصُراً آخَرَ يُتَمِّمُ بِناءَ شَخْصِيَّةِ الإِنْسانِ هُوَ: ............. لِأَنَّهُ: .............', subparts: [],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'element', label: 'العنصر الذي أضيفه', multiline: true },
        { id: 'reason', label: 'لأنه', multiline: true },
      ],
    },
    source: u3l1Src(75, 'textbook_exercise', 'الفهم القرائي', 8),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-75-08' },
  },
  {
    id: 'u3l1-a-19', sourceActivityId: 'U3L1-75-09', printedNumber: '٩', section: 'الفهم القرائي', page: 75,
    instruction: 'أُثْرِي البَيْتَ الرّابِعَ بِأُسْلوبي مُوَضِّحاً مَعْناهُ.', subparts: [],
    interaction: { kind: 'write', label: 'إثرائي للبيت الرابع', rows: 3 },
    source: u3l1Src(75, 'textbook_exercise', 'الفهم القرائي', 9),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-75-09' },
  },
  {
    id: 'u3l1-a-20', sourceActivityId: 'U3L1-75-10', printedNumber: '١٠', section: 'الفهم القرائي', page: 75,
    instruction: 'أَحْفَظُ أَرْبَعَةَ أَبْياتٍ أَعْجَبَتْني مِنَ النَّصِّ، وَأُرَدِّدُها بِالتَّناوُبِ مَعَ زَميلي.', subparts: [],
    interaction: { kind: 'speak' },
    source: u3l1Src(75, 'textbook_poetry', 'الفهم القرائي', 10),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-75-10' },
  },

  /* ============ ص٧٦: أتواصل شفوياً + إعراب الفعل المضارع (أ) ============ */
  {
    id: 'u3l1-a-21', sourceActivityId: 'U3L1-76-01', printedNumber: '—', section: 'أتواصل شفوياً', page: 76,
    instruction: 'أُعاوِنُ زَميلي على إِجْراءِ مُقابَلَةٍ صَحَفِيَّةٍ مَعَ عالِمٍ مِنْ بِلادي نَتَحَدَّثُ فيها عَنْ إِنْجازاتِهِ وَأَثَرِها في بِناءِ الوَطَنِ.', subparts: [],
    interaction: { kind: 'speak' },
    source: u3l1Src(76, 'textbook_expression', 'أتواصل شفوياً'),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-76-01' },
  },
  {
    id: 'u3l1-a-22', sourceActivityId: 'U3L1-76-02', printedNumber: '١', section: 'أقرأ البيت', page: 76,
    instruction: 'أُلاحِظُ أَنَّ الفِعْلَ (نُدْرِكُ – نُهَنْدِسُ) فِعْلٌ يَدُلُّ على حَدَثٍ وَقَعَ في الزَّمَنِ الحاضِرِ، ما حَرَكَةُ آخِرِ كُلٍّ مِنْهُما؟', subparts: [],
    interaction: { kind: 'write', label: 'حركة آخر كل منهما', rows: 2 },
    source: u3l1Src(76, 'textbook_grammar', 'أقرأ البيت', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-76-02' },
  },
  {
    id: 'u3l1-a-23', sourceActivityId: 'U3L1-76-03', printedNumber: '٢', section: 'أقرأ البيت', page: 76,
    instruction: 'أُسَمِّي الفِعْلَ الَّذي يَدُلُّ على حَدَثٍ وَقَعَ في الزَّمَنِ الحاضِرِ فِعْلاً مُضارِعاً، ما عَلَامَةُ إِعْرابِ كُلٍّ مِنْ (نُدْرِكُ – نُهَنْدِسُ)؟', subparts: [],
    interaction: { kind: 'write', label: 'علامة إعراب كل منهما', rows: 2 },
    source: u3l1Src(76, 'textbook_grammar', 'أقرأ البيت', 2),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-76-03' },
  },
  {
    id: 'u3l1-a-24', sourceActivityId: 'U3L1-76-04', printedNumber: '—', section: 'أطبّق', page: 76,
    instruction: 'أَسْتَخْرِجُ مِنْ كُلٍّ مِنَ الجُمْلَتَيْنِ الآتِيَتَيْنِ فِعْلاً مُضارِعاً، ثُمَّ أُبَيِّنُ نَوْعَهُ وَفِقَ حَرَكَةِ إِعْرابِهِ:',
    subparts: ['– نَبْحَثُ في أَيَّةِ مُشْكَلَةٍ.', '– وَنُهَنْدِسُ عِلْمَ المُسْتَقْبَلِ.'],
    interaction: { kind: 'write', label: 'الفعلان ونوع كل منهما', rows: 3 },
    source: u3l1Src(76, 'textbook_grammar', 'أطبّق'),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-76-04' },
  },

  /* ============ ص٧٦: (ب) النصب ============ */
  {
    id: 'u3l1-a-25', sourceActivityId: 'U3L1-76-05', printedNumber: '١', section: 'أقرأ ما يأتي', page: 76,
    instruction: 'أُلاحِظُ أَنَّ الفِعْلَ (نَعْرِفُ) جاءَ مَرْفوعاً، وَأُبَيِّنُ السَّبَبَ.', subparts: [],
    interaction: { kind: 'write', label: 'سبب رفع «نعرف»', rows: 2 },
    source: u3l1Src(76, 'textbook_grammar', 'أقرأ ما يأتي', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-76-05' },
  },
  {
    id: 'u3l1-a-26', sourceActivityId: 'U3L1-76-06', printedNumber: '٢', section: 'أقرأ ما يأتي', page: 76,
    instruction: 'أُلاحِظُ أَنَّ الأَفْعالَ (يَسْتَطِيعَ – يَغْلِبَ – يُحَقِّقَ) جاءَتْ مَنْصوبَةً، أُبَيِّنُ السَّبَبَ مُنْتَبِهاً لِلْأَحْرُفِ الَّتي سَبَقَتْها.', subparts: [],
    interaction: { kind: 'write', label: 'سبب نصب الأفعال', rows: 3 },
    source: u3l1Src(76, 'textbook_grammar', 'أقرأ ما يأتي', 2),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-76-06' },
  },
  {
    id: 'u3l1-a-27', sourceActivityId: 'U3L1-76-07', printedNumber: '٣', section: 'أقرأ ما يأتي', page: 76,
    instruction: 'أُسَمِّي الأَحْرُفَ (أَنْ – لَنْ – كَيْ) أَحْرُفَ نَصْبٍ، أُبَيِّنُ عَلَامَةَ إِعْرابِ الأَفْعالِ الَّتي جاءَتْ بَعْدَها.', subparts: [],
    interaction: { kind: 'write', label: 'علامة إعراب الأفعال بعدها', rows: 2 },
    source: u3l1Src(76, 'textbook_grammar', 'أقرأ ما يأتي', 3),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-76-07' },
  },

  /* ============ ص٧٧: النصب (أطبّق) والجزم (ج) ============ */
  {
    id: 'u3l1-a-28', sourceActivityId: 'U3L1-77-01', printedNumber: '١', section: 'أطبّق', page: 77,
    instruction: 'أُدْخِلْ على الفِعْلِ المُضارِعِ الوارِدِ في كُلٍّ مِنَ الجُمْلَتَيْنِ الآتِيَتَيْنِ حَرْفاً ناصِباً، ثُمَّ أَضْبِطُ الفِعْلَ بِالشَّكْلِ:',
    subparts: ['– عَلَيْكَ ............. تُجاوِزَ زُمَلاءَكَ ............. تَصِلَ إِلى القَرارِ الصّائِبِ.'],
    interaction: { kind: 'write', label: 'إدخال حرف ناصب وضبط الفعل', rows: 3 },
    source: u3l1Src(77, 'textbook_grammar', 'أطبّق', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-77-01' },
  },
  {
    id: 'u3l1-a-29', sourceActivityId: 'U3L1-77-02', printedNumber: '١', section: 'أقرأ ما يأتي', page: 77,
    instruction: 'أُلاحِظُ أَنَّ الأَفْعالَ (يَصِلْ – تُضَيِّعْ – تَحْرِصْ) مَجْزومَةٌ، أُبَيِّنُ السَّبَبَ مُنْتَبِهاً لِلْأَحْرُفِ الَّتي سَبَقَتْها.', subparts: [],
    interaction: { kind: 'write', label: 'سبب جزم الأفعال', rows: 3 },
    source: u3l1Src(77, 'textbook_grammar', 'أقرأ ما يأتي', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-77-02' },
  },
  {
    id: 'u3l1-a-30', sourceActivityId: 'U3L1-77-03', printedNumber: '٢', section: 'أقرأ ما يأتي', page: 77,
    instruction: 'أُسَمِّي الأَحْرُفَ (لَمْ – لا – لامُ الأَمْرِ) أَحْرُفَ جَزْمٍ، أُبَيِّنُ عَلَامَةَ إِعْرابِ الأَفْعالِ الَّتي جاءَتْ بَعْدَها.', subparts: [],
    interaction: { kind: 'write', label: 'علامة إعراب الأفعال بعدها', rows: 2 },
    source: u3l1Src(77, 'textbook_grammar', 'أقرأ ما يأتي', 2),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-77-03' },
  },
  {
    id: 'u3l1-a-31', sourceActivityId: 'U3L1-77-04', printedNumber: '—', section: 'أطبّق', page: 77,
    instruction: 'أُدْخِلْ على الفِعْلِ المُضارِعِ الوارِدِ في كُلٍّ مِنَ الجُمْلَتَيْنِ الآتِيَتَيْنِ حَرْفاً جازِماً، ثُمَّ أَضْبِطُ الفِعْلَ بِالشَّكْلِ:',
    subparts: ['– ............. تَعْبُرَ شارِعاً إِلّا مِنْ مَمَرِّ المُشاةِ وَ ............. تَحْتَرِمَ قَوانينَ السَّيْرِ.'],
    interaction: { kind: 'write', label: 'إدخال حرف جازم وضبط الفعل', rows: 3 },
    source: u3l1Src(77, 'textbook_grammar', 'أطبّق'),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-77-04' },
  },

  /* ============ ص٧٨: التقويم النهائي ============ */
  {
    id: 'u3l1-a-32', sourceActivityId: 'U3L1-78-01', printedNumber: '١', section: 'التقويم النهائي', page: 78,
    instruction: 'أَقْرَأُ النَّصَّ، ثُمَّ أَمْلَأُ الجَدْوَلَ الآتي بِما يُناسِبُهُ:', subparts: [],
    interaction: {
      kind: 'table_rows',
      columns: ['المضارع المرفوع', 'علامة رفعه', 'المضارع المنصوب', 'الحرف الناصب', 'علامة النصب', 'المضارع المجزوم', 'الحرف الجازم', 'علامة الجزم'],
      rows: 3,
    },
    source: u3l1Src(78, 'textbook_grammar', 'التقويم النهائي', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-78-01' },
  },
  {
    id: 'u3l1-a-33', sourceActivityId: 'U3L1-78-02', printedNumber: '٢', section: 'التقويم النهائي', page: 78,
    instruction: 'أُنْشِئُ ثَلاثَ جُمَلٍ تَحْتَوي أَفْعالاً مُضارِعَةً (في الأُولى مَرْفوعٌ وَفي الثّانِيَةِ مَنْصوبٌ وَفي الثّالِثَةِ مَجْزومٌ).', subparts: [],
    interaction: { kind: 'write', label: 'الجمل الثلاث', rows: 4 },
    source: u3l1Src(78, 'textbook_grammar', 'التقويم النهائي', 2),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-78-02' },
  },
  {
    id: 'u3l1-a-34', sourceActivityId: 'U3L1-78-03', printedNumber: '٣', section: 'التقويم النهائي', page: 78,
    instruction: 'أَكْتُبُ فَقْرَةً مِنْ عَشْرِ كَلِماتٍ عَنْ أَهَمِّيَّةِ العِلْمِ بِالنِّسْبَةِ إِلى الإِنْسانِ مُسْتَعْمِلاً الفِعْلَ المُضارِعَ.', subparts: [],
    interaction: { kind: 'write', label: 'فقرتي عن أهمية العلم', rows: 4 },
    source: u3l1Src(78, 'textbook_expression', 'التقويم النهائي', 3),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-78-03' },
  },
  {
    id: 'u3l1-a-35', sourceActivityId: 'U3L1-78-04', printedNumber: '٤', section: 'التقويم النهائي', page: 78,
    instruction: 'أَتَحَدَّثُ مَعَ مَجْموعَةٍ مِنْ زُمَلائي لِمُدَّةِ دَقيقَتَيْنِ عَنْ شَخْصِيَّةٍ مُمَيَّزَةٍ في بَلَدي مُسْتَعْمِلاً الفِعْلَ المُضارِعَ.', subparts: [],
    interaction: { kind: 'speak' },
    source: u3l1Src(78, 'textbook_expression', 'التقويم النهائي', 4),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-78-04' },
  },

  /* ============ ص٧٩: الهمزة المتوسطة ============ */
  {
    id: 'u3l1-a-36', sourceActivityId: 'U3L1-79-01', printedNumber: '١', section: 'أكتشف', page: 79,
    instruction: 'أُسَمِّي نَوْعَ الهَمْزَةِ الوارِدَةِ في الكَلِماتِ المُلَوَّنَةِ وَفْقَ مَوْقِعِها في الكَلِمَةِ.', subparts: [],
    interaction: { kind: 'write', label: 'نوع الهمزة', rows: 2 },
    source: u3l1Src(79, 'textbook_spelling', 'أكتشف', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-79-01' },
  },
  {
    id: 'u3l1-a-37', sourceActivityId: 'U3L1-79-02', printedNumber: '٢', section: 'أكتشف', page: 79,
    instruction: 'أُلاحِظُ أَنَّ الهَمْزَةَ في كَلِمَةِ (تُؤَثِّرُ) حَرَكَتُها الفَتْحَةُ وَحَرَكَةُ الحَرْفِ الَّذي قَبْلَها الضَّمَّةُ، أُبَيِّنُ كِتابَتَها عَلى الحَرْفِ الَّذي يُناسِبُ الحَرَكَةَ الأَقْوَى.', subparts: [],
    interaction: { kind: 'write', label: 'كتابتها على الحرف المناسب', rows: 2 },
    source: u3l1Src(79, 'textbook_spelling', 'أكتشف', 2),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-79-02' },
  },
  {
    id: 'u3l1-a-38', sourceActivityId: 'U3L1-79-03', printedNumber: '٣', section: 'أكتشف', page: 79,
    instruction: 'أُلاحِظُ أَنَّ الهَمْزَةَ في كَلِمَةِ (تَأْثيرٌ) ساكِنَةٌ، وَأَنَّ الحَرْفَ الَّذي قَبْلَها مَفْتوحٌ، أُبَيِّنُ سَبَبَ كِتابَةِ الهَمْزَةِ المُتَوَسِّطَةِ عَلى الأَلِفِ.', subparts: [],
    interaction: { kind: 'write', label: 'سبب الكتابة على الألف', rows: 2 },
    source: u3l1Src(79, 'textbook_spelling', 'أكتشف', 3),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-79-03' },
  },
  {
    id: 'u3l1-a-39', sourceActivityId: 'U3L1-79-04', printedNumber: '٤', section: 'أكتشف', page: 79,
    instruction: 'أُلاحِظُ أَنَّ الهَمْزَةَ في كَلِمَةِ (تَنْشِئَةٌ) كُتِبَتْ عَلى نَبْرَةٍ، أُبَيِّنُ سَبَبَ كِتابَتِها وَفْقَ حَرَكَتِها وَحَرَكَةِ الحَرْفِ الَّذي قَبْلَها.', subparts: [],
    interaction: { kind: 'write', label: 'سبب الكتابة على نبرة', rows: 2 },
    source: u3l1Src(79, 'textbook_spelling', 'أكتشف', 4),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-79-04' },
  },
  {
    id: 'u3l1-a-40', sourceActivityId: 'U3L1-79-05', printedNumber: '—', section: 'أطبّق', page: 79,
    instruction: 'أُعَلِّلُ كِتابَةَ الهَمْزَةِ المُتَوَسِّطَةِ عَلى صُورَتِها في الكَلِماتِ الآتِيَةِ: فُؤادٌ، يَنْشَأُ، سُئِلَ.', subparts: [],
    interaction: { kind: 'write', label: 'تعليل كتابة الهمزة', rows: 4 },
    source: u3l1Src(79, 'textbook_spelling', 'أطبّق'),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-79-05' },
  },
  {
    id: 'u3l1-a-41', sourceActivityId: 'U3L1-79-06', printedNumber: '١', section: 'التقويم النهائي', page: 79,
    instruction: 'أَمْلَأُ الفَراغَ في كُلٍّ مِمّا يَأْتي بِما يُناسِبُ:',
    subparts: ['– أَدَّبَ فِعْلٌ ماضٍ، مُضارِعُهُ .............', '– دُؤُوبٌ اسْمُ فِعْلِهِ .............'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'adaba', label: 'أَدَّبَ فِعْلٌ ماضٍ، مُضارِعُهُ', multiline: true },
        { id: 'duub', label: 'دُؤُوبٌ اسْمُ فِعْلِهِ', multiline: true },
      ],
    },
    source: u3l1Src(79, 'textbook_grammar', 'التقويم النهائي', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-79-06' },
  },
  {
    id: 'u3l1-a-42', sourceActivityId: 'U3L1-79-07', printedNumber: '٢', section: 'التقويم النهائي', page: 79,
    instruction: 'أُعَلِّلُ كِتابَةَ الهَمْزَةِ المُتَوَسِّطَةِ في الكَلِماتِ الآتِيَةِ: قَصائِدُ – يُؤَخِّرُ – كَأْسٌ.', subparts: [],
    interaction: { kind: 'write', label: 'تعليل كتابة الهمزة المتوسطة', rows: 4 },
    source: u3l1Src(79, 'textbook_spelling', 'التقويم النهائي', 2),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-79-07' },
  },
  {
    id: 'u3l1-a-43', sourceActivityId: 'U3L1-79-08', printedNumber: '٣', section: 'التقويم النهائي', page: 79,
    instruction: 'أَتَحَدَّثُ أَمامَ زُمَلائي لِمُدَّةِ دَقيقَتَيْنِ عَنْ أَهَمِّيَّةِ العِلْمِ في الإِبْداعِ وَالاخْتِراعِ مُسْتَعْمِلاً كَلِماتٍ تَحْوي هَمْزَةً مُتَوَسِّطَةً.', subparts: [],
    interaction: { kind: 'speak' },
    source: u3l1Src(79, 'textbook_expression', 'التقويم النهائي', 3),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-79-08' },
  },

  /* ============ ص٨٠: الخط (س – ش) ============ */
  {
    id: 'u3l1-a-44', sourceActivityId: 'U3L1-80-01', printedNumber: '١', section: 'الخط', page: 80,
    instruction: 'أُلاحِظُ رَسْمَ الأَحْرُفِ (س – ش) في الكَلِماتِ الآتِيَةِ:',
    subparts: ['نَدْرُسُ – سَعادَتُنا – نَسْمُو – شَمْسٌ – فَراشٌ – شَهيدٌ – نَحْيى – رِيشٌ'],
    interaction: { kind: 'write', label: 'ملاحظتي على رسم الأحرف', rows: 3 },
    source: u3l1Src(80, 'textbook_exercise', 'الخط', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-80-01' },
  },
  {
    id: 'u3l1-a-45', sourceActivityId: 'U3L1-80-02', printedNumber: '٢', section: 'الخط', page: 80,
    instruction: 'أُجَرِّدُ الأَحْرُفَ المُلَوَّنَةَ في الكَلِماتِ السّابِقَةِ مُنْتَبِهاً لِطَريقَةِ كِتابَتِها:', subparts: [],
    interaction: { kind: 'handwriting', modelDescription: 'الأحرف الملونة ص٨٠؛ تُجرَّد يدوياً على ورقة مسطّرة.' },
    source: u3l1Src(80, 'textbook_exercise', 'الخط', 2, U3L1_LOCKED_SOURCE_NOTES.handwritingModels),
    disclosure: { kind: 'no_approved_content', sourceRef: 'U3L1-80-02' },
    gapNote: U3L1_LOCKED_SOURCE_NOTES.handwritingModels,
  },
  {
    id: 'u3l1-a-46', sourceActivityId: 'U3L1-80-03', printedNumber: '—', section: 'أتعلّم', page: 80,
    instruction: 'أُلاحِظُ كِتابَةَ أَشْكالِ الحَرْفِ فيما يَأْتي: تُكْتَبُ أَشْكالُ حَرْفِ السِّينِ (س) في خَطِّ الرُّقْعَةِ', subparts: [],
    interaction: { kind: 'handwriting', modelDescription: 'أشكال حرف السين بخط الرقعة ص٨٠؛ تُلاحَظ وتُكتب يدوياً على ورقة مسطّرة.' },
    source: u3l1Src(80, 'textbook_exercise', 'أتعلّم', undefined, U3L1_LOCKED_SOURCE_NOTES.handwritingModels),
    disclosure: { kind: 'no_approved_content', sourceRef: 'U3L1-80-03' },
    gapNote: U3L1_LOCKED_SOURCE_NOTES.handwritingModels,
  },
  {
    id: 'u3l1-a-47', sourceActivityId: 'U3L1-80-04', printedNumber: '—', section: 'أتعلّم', page: 80,
    instruction: 'أَكْتُبُ أَشْكالَ حَرْفِ الشِّينِ (ش) بِخَطِّ الرُّقْعَةِ', subparts: [],
    interaction: { kind: 'handwriting', modelDescription: 'أشكال حرف الشين بخط الرقعة ص٨٠؛ تُكتب يدوياً على ورقة مسطّرة.' },
    source: u3l1Src(80, 'textbook_exercise', 'أتعلّم', undefined, U3L1_LOCKED_SOURCE_NOTES.handwritingModels),
    disclosure: { kind: 'no_approved_content', sourceRef: 'U3L1-80-04' },
    gapNote: U3L1_LOCKED_SOURCE_NOTES.handwritingModels,
  },
  {
    id: 'u3l1-a-48', sourceActivityId: 'U3L1-80-05', printedNumber: '—', section: 'أتدرب', page: 80,
    instruction: 'أُحاكي رَسْمَ كَلِماتِ البَيْتِ الآتي بِخَطِّ الرُّقْعَةِ:',
    subparts: ['نَبْحَثُ في أَيَّةِ مُشْكَلَةٍ وَسَرِيعاً يَأْتينا الحَلُّ!'],
    interaction: { kind: 'handwriting', modelText: 'نَبْحَثُ في أَيَّةِ مُشْكَلَةٍ وَسَرِيعاً يَأْتينا الحَلُّ!', modelDescription: 'نموذج البيت بخط الرقعة ص٨٠؛ تُحاكى كتابته يدوياً على ورقة مسطّرة.' },
    source: u3l1Src(80, 'textbook_exercise', 'أتدرب', undefined, U3L1_LOCKED_SOURCE_NOTES.handwritingModels),
    disclosure: { kind: 'no_approved_content', sourceRef: 'U3L1-80-05' },
    gapNote: U3L1_LOCKED_SOURCE_NOTES.handwritingModels,
  },

  /* ============ ص٨١: أطبّق + أعبّر كتابياً: الرسالة ============ */
  {
    id: 'u3l1-a-49', sourceActivityId: 'U3L1-81-01', printedNumber: '—', section: 'أطبّق', page: 81,
    instruction: 'أَكْتُبُ البَيْتَ الآتي بِخَطِّ الرُّقْعَةِ، وَأُلاحِظُ الفَرْقَ بَيْنَ خَطِّ الرُّقْعَةِ وَخَطِّ النَّسْخِ:',
    subparts: ['نَدْرُسُ في جِدٍّ وَنَشاطٍ', 'نِعْمَ القَوْلُ، وَنِعْمَ الفِعْلُ'],
    interaction: { kind: 'handwriting', modelText: 'نَدْرُسُ في جِدٍّ وَنَشاطٍ — نِعْمَ القَوْلُ، وَنِعْمَ الفِعْلُ', modelDescription: 'البيت بخطي النسخ والرقعة ص٨١؛ يُكتب يدوياً على ورقة مسطّرة.' },
    source: u3l1Src(81, 'textbook_exercise', 'أطبّق', undefined, U3L1_LOCKED_SOURCE_NOTES.handwritingModels),
    disclosure: { kind: 'no_approved_content', sourceRef: 'U3L1-81-01' },
    gapNote: U3L1_LOCKED_SOURCE_NOTES.handwritingModels,
  },
  {
    id: 'u3l1-a-50', sourceActivityId: 'U3L1-81-02', printedNumber: '١', section: 'أقرأ الرسالة', page: 81,
    instruction: 'أَذْكُرُ مُناسَبَةَ الرِّسالَةِ؟', subparts: [],
    interaction: { kind: 'write', label: 'مناسبة الرسالة', rows: 2 },
    source: u3l1Src(81, 'textbook_expression', 'أقرأ الرسالة', 1),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-81-02' },
  },
  {
    id: 'u3l1-a-51', sourceActivityId: 'U3L1-81-03', printedNumber: '٢', section: 'أقرأ الرسالة', page: 81,
    instruction: 'أَخْتارُ الإِجابَةَ الصَّحيحَةَ مِمّا بَيْنَ القَوْسَيْنِ:',
    subparts: [
      '– يُكْتَبُ مَكانُ إِرْسالِ الرِّسالَةِ وَزَمانُ كِتابَتِها في الرِّسالَةِ الشَّخْصِيَّةِ: أ. أَعْلى الصَّفْحَةِ وَيَمينَها / ب. أَسْفَلَ الصَّفْحَةِ وَيَمينَها / ت. أَعْلى الصَّفْحَةِ وَيَسارِها / ث. أَسْفَلَ الصَّفْحَةِ وَيَسارِها',
      '– يُكْتَبُ اسْمُ المُرْسِلِ في الرِّسالَةِ الشَّخْصِيَّةِ: أ. أَعْلى الصَّفْحَةِ وَيَمينَها / ب. أَسْفَلَ الصَّفْحَةِ وَيَمينَها / ت. أَعْلى الصَّفْحَةِ وَيَسارِها / ث. أَسْفَلَ الصَّفْحَةِ وَيَسارِها',
    ],
    interaction: {
      kind: 'choice_groups',
      groups: [
        {
          id: 'g-place', label: 'يُكْتَبُ مَكانُ إِرْسالِ الرِّسالَةِ وَزَمانُ كِتابَتِها:',
          choices: [
            { id: 'a', text: 'أ. أَعْلى الصَّفْحَةِ وَيَمينَها' },
            { id: 'b', text: 'ب. أَسْفَلَ الصَّفْحَةِ وَيَمينَها' },
            { id: 't', text: 'ت. أَعْلى الصَّفْحَةِ وَيَسارِها' },
            { id: 'th', text: 'ث. أَسْفَلَ الصَّفْحَةِ وَيَسارِها' },
          ],
        },
        {
          id: 'g-sender', label: 'يُكْتَبُ اسْمُ المُرْسِلِ:',
          choices: [
            { id: 'a', text: 'أ. أَعْلى الصَّفْحَةِ وَيَمينَها' },
            { id: 'b', text: 'ب. أَسْفَلَ الصَّفْحَةِ وَيَمينَها' },
            { id: 't', text: 'ت. أَعْلى الصَّفْحَةِ وَيَسارِها' },
            { id: 'th', text: 'ث. أَسْفَلَ الصَّفْحَةِ وَيَسارِها' },
          ],
        },
      ],
    },
    source: u3l1Src(81, 'textbook_expression', 'أقرأ الرسالة', 2),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-81-03' },
  },

  /* ============ ص٨٢: تكملة الرسالة + أطبّق ============ */
  {
    id: 'u3l1-a-52', sourceActivityId: 'U3L1-82-01', printedNumber: '٣', section: 'أقرأ الرسالة', page: 82,
    instruction: 'أُكْمِلُ الفَراغاتِ الآتِيَةَ بِما يُناسِبُها:',
    subparts: ['عَناصِرُ الرِّسالَةِ الشَّخْصِيَّةِ السّابِقَةِ: المُرْسِلُ وَالمُرْسَلُ إِلَيْهِ، وَمَكانُ مُرْسِلِ الرِّسالَةِ، وَزَمانُ كِتابَةِ الرِّسالَةِ، وَ ............. وَ ............. وَ .............'],
    interaction: { kind: 'write', label: 'إكمال الفراغات', rows: 3 },
    source: u3l1Src(82, 'textbook_expression', 'أقرأ الرسالة', 3),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-82-01' },
  },
  {
    id: 'u3l1-a-53', sourceActivityId: 'U3L1-82-02', printedNumber: '٤', section: 'أقرأ الرسالة', page: 82,
    instruction: 'تَضَمَّنَتِ الرِّسالَةُ مَشاعِرَ المُرْسِلِ .............', subparts: [],
    interaction: { kind: 'write', label: 'مشاعر المرسل', rows: 2 },
    source: u3l1Src(82, 'textbook_expression', 'أقرأ الرسالة', 4),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-82-02' },
  },
  {
    id: 'u3l1-a-54', sourceActivityId: 'U3L1-82-03', printedNumber: '٥', section: 'أقرأ الرسالة', page: 82,
    instruction: 'أُكْمِلُ ما يَأْتي: اخْتَتَمَتِ الرِّسالَةُ بِـ .............', subparts: [],
    interaction: { kind: 'write', label: 'بم اختتمت الرسالة', rows: 2 },
    source: u3l1Src(82, 'textbook_expression', 'أقرأ الرسالة', 5),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-82-03' },
  },
  {
    id: 'u3l1-a-55', sourceActivityId: 'U3L1-82-04', printedNumber: '—', section: 'أطبّق', page: 82,
    instruction: 'أَكْتُبُ رِسالَةً إِلى صَديقي أَدْعوهُ فيها إِلى زِيارَةِ المُتْحَفِ التَّرْبَوِيِّ، مُسْتَوْفِياً عَناصِرَ الرِّسالَةِ.', subparts: [],
    interaction: { kind: 'write', label: 'رسالتي إلى صديقي', rows: 6 },
    source: u3l1Src(82, 'textbook_expression', 'أطبّق'),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-82-04' },
  },

  /* ============ ص٨٣: ألعب وأتعلّم، أنا وأسرتي ============ */
  {
    id: 'u3l1-a-56', sourceActivityId: 'U3L1-83-01', printedNumber: '—', section: 'ألعب وأتعلّم', page: 83,
    instruction: 'أَكْتُبُ فَقْرَةً مِنْ ثَلاثَةِ أَسْطُرٍ أُعَبِّرُ مِنْ خِلالِها عَنْ نَشاطٍ وَمَشاعِرَ الفَريقِ في الصُّورَةِ الآتِيَةِ مُوَظِّفاً ما تَعَلَّمْتُهُ مِنْ قَواعِدِ اللُّغَةِ العَرَبِيَّةِ (تَحْتَوي الجُمَلُ فِعْلَ مُضارِعٍ بِحالَاتٍ إِعْرابِيَّةٍ مُخْتَلِفَةٍ)', subparts: [],
    interaction: { kind: 'write', label: 'فقرتي من ثلاثة أسطر', rows: 4 },
    source: u3l1Src(83, 'activity_book', 'ألعب وأتعلّم'),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-83-01' },
  },
  {
    id: 'u3l1-a-57', sourceActivityId: 'U3L1-83-02', printedNumber: '—', section: 'أنا وأسرتي', page: 83,
    instruction: 'أَبْحَثُ بِمُساعَدَةِ أُسْرَتي وَبِالاسْتِعانَةِ بِمَصادِرِ التَّعَلُّمِ عَنْ حِكايَةِ عالِمٍ كانَ لَهُ أَثَرٌ في تَطْويرِ بَعْضِ البَرْمَجِيّاتِ الحَديثَةِ، وَأَقْرَؤُها أَمامَ زُمَلائي في الصَّفِّ.', subparts: [],
    interaction: { kind: 'speak' },
    source: u3l1Src(83, 'activity_book', 'أنا وأسرتي'),
    disclosure: { kind: 'guidance_only', sourceRef: 'U3L1-83-02' },
  },
];

export const U3L1_ACTIVITY_BY_ID: Record<string, U3L1Activity> = Object.fromEntries(
  U3L1_ACTIVITIES.map((activity) => [activity.id, activity]),
);

export const U3L1_COVERAGE = {
  discovered: U3L1_ACTIVITIES.length,
  pages: [...new Set(U3L1_ACTIVITIES.map((activity) => activity.page))],
  withDeclaredGap: U3L1_ACTIVITIES.filter((activity) => Boolean(activity.gapNote)).length,
} as const;
