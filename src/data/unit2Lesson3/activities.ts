import { u2l3Src, U2L3_LISTENING_AUDIO_GAP, U2L3_LOCKED_SOURCE_NOTES } from './sourceMeta';

/**
 * Unit 2, Lesson 3 («بِالْعِلْمِ تَرْقَى», pp. 61–68) — source activity ledger.
 *
 * Every entry reproduces one printed, numbered/delimited task from the eight
 * supplied scans, in printed order. `instruction` is verbatim book wording;
 * interaction data (choices, columns, field labels) is interface scaffolding,
 * never an answer key: this lesson deliberately carries NO answerKey, NO
 * correctChoiceId and NO teacher solution, because the supplied source has no
 * approved answer key and the owner forbids inventing one.
 *
 * Drafts are scoped by `sourceActivityId` through the existing
 * sessionStorage draftStorage utility, exactly like the previous lessons.
 */

export type U2L3Interaction =
  | { kind: 'text_fields'; fields: { id: string; label: string; multiline?: boolean }[] }
  | { kind: 'write'; label?: string; rows?: number }
  | { kind: 'choice_groups'; groups: { id: string; label: string; choices: { id: string; text: string }[] }[] }
  | { kind: 'matching'; leftItems: { id: string; text: string }[]; rightItems: { id: string; text: string }[] }
  | { kind: 'table_rows'; columns: string[]; rows: number }
  | { kind: 'speak'; criteria?: string[] }
  | { kind: 'handwriting'; modelDescription?: string; modelText?: string }
  | { kind: 'cards'; initialCards: number };

export interface U2L3Activity {
  id: string;
  sourceActivityId: string;
  printedNumber: string;
  section: string;
  page: number;
  /** Verbatim printed instruction. */
  instruction: string;
  /** Printed sub-items / options reproduced verbatim, when present. */
  subparts: string[];
  interaction: U2L3Interaction;
  source: ReturnType<typeof u2l3Src>;
  /** Declared source limit shown to the learner instead of a guessed replacement. */
  gapNote?: string;
}

export const U2L3_ACTIVITIES: U2L3Activity[] = [
  /* ============ ص٦١: التأمّل والاستماع ============ */
  {
    id: 'u2l3-a-01', sourceActivityId: 'U2L3-61-01', printedNumber: '١', section: 'أتأمّل الصورتين', page: 61,
    instruction: 'أَصِفُ ما أُشاهِدُهُ في الصُّورَتَيْنِ.', subparts: [],
    interaction: { kind: 'write', label: 'وصف الصورتين', rows: 3 },
    source: u2l3Src(61, 'textbook_exercise', 'أتأمل الصورتين الآتيتين', 1),
  },
  {
    id: 'u2l3-a-02', sourceActivityId: 'U2L3-61-02', printedNumber: '٢', section: 'أتأمّل الصورتين', page: 61,
    instruction: 'ما المُشْتَرَكُ بَيْنَ الصُّورَتَيْنِ؟', subparts: [],
    interaction: { kind: 'write', label: 'المشترك بين الصورتين', rows: 2 },
    source: u2l3Src(61, 'textbook_exercise', 'أتأمل الصورتين الآتيتين', 2),
  },
  {
    id: 'u2l3-a-03', sourceActivityId: 'U2L3-61-03', printedNumber: '٣', section: 'أتأمّل الصورتين', page: 61,
    instruction: 'أُضيفُ إلى الصُّورَةِ الأولى أَشْياءَ مِنْ خَيالي مُرْتَبِطَةً بِها.', subparts: [],
    interaction: { kind: 'write', label: 'ما أضيفه من خيالي', rows: 3 },
    source: u2l3Src(61, 'textbook_exercise', 'أتأمل الصورتين الآتيتين', 3),
  },
  {
    id: 'u2l3-a-04', sourceActivityId: 'U2L3-61-04', printedNumber: '١', section: 'أستمع إلى النص', page: 61,
    instruction: 'أَسْتَبْعِدُ الإِجابَةَ غَيْرَ الصَّحيحَةِ في كُلٍّ مِمّا يَأْتي:',
    subparts: [
      'أ. يَتَحَدَّثُ النَّصُّ عَنْ:',
      'دَعْوَةِ الأَجْيالِ إلى: (العِلْمِ – الصَّداقَةِ – الحِفاظِ على اللُّغَةِ العَرَبِيَّةِ)',
      'ب. بَدا الشّاعِرُ في النَّصِّ:',
      '(ناصِحاً – مُعْجَباً – مُتَرَدِّداً)',
    ],
    interaction: {
      kind: 'choice_groups',
      groups: [
        {
          id: 'g-a', label: 'أ. يَتَحَدَّثُ النَّصُّ عَنْ: دَعْوَةِ الأَجْيالِ إلى:',
          choices: [
            { id: 'ilm', text: 'العِلْمِ' },
            { id: 'sadaqa', text: 'الصَّداقَةِ' },
            { id: 'lugha', text: 'الحِفاظِ على اللُّغَةِ العَرَبِيَّةِ' },
          ],
        },
        {
          id: 'g-b', label: 'ب. بَدا الشّاعِرُ في النَّصِّ:',
          choices: [
            { id: 'nasih', text: 'ناصِحاً' },
            { id: 'mujab', text: 'مُعْجَباً' },
            { id: 'mutaraddid', text: 'مُتَرَدِّداً' },
          ],
        },
      ],
    },
    source: u2l3Src(61, 'textbook_exercise', 'أستمع إلى النص', 1, U2L3_LISTENING_AUDIO_GAP),
    gapNote: U2L3_LISTENING_AUDIO_GAP,
  },
  {
    id: 'u2l3-a-05', sourceActivityId: 'U2L3-61-05', printedNumber: '٢', section: 'أستمع إلى النص', page: 61,
    instruction: 'أُعَبِّرُ عَمّا سَمِعْتُهُ بِجُمْلَةٍ مُفيدَةٍ.', subparts: [],
    interaction: { kind: 'write', label: 'جملتي عمّا سمعته', rows: 2 },
    source: u2l3Src(61, 'textbook_exercise', 'أستمع إلى النص', 2, U2L3_LISTENING_AUDIO_GAP),
    gapNote: U2L3_LISTENING_AUDIO_GAP,
  },

  /* ============ ص٦٢: القراءة الجهرية ============ */
  {
    id: 'u2l3-a-06', sourceActivityId: 'U2L3-62-01', printedNumber: '١', section: 'أقرأ', page: 62,
    instruction: 'أَقْرَأُ المَقْطَعَيْنِ الأَوَّلَ والثّانِيَ مُراعِياً أُسْلوبَ النِّداءِ.', subparts: [],
    interaction: { kind: 'speak' },
    source: u2l3Src(62, 'textbook_poetry', 'أقرأ', 1),
  },
  {
    id: 'u2l3-a-07', sourceActivityId: 'U2L3-62-02', printedNumber: '٢', section: 'أقرأ', page: 62,
    instruction: 'أَقْرَأُ المَقْطَعَ الثّالِثَ مُراعِياً الأَداءَ الشِّعْرِيَّ المُناسِبَ.', subparts: [],
    interaction: { kind: 'speak' },
    source: u2l3Src(62, 'textbook_poetry', 'أقرأ', 2),
  },
  {
    id: 'u2l3-a-08', sourceActivityId: 'U2L3-62-03', printedNumber: '٣', section: 'أقرأ', page: 62,
    instruction: 'أَقْرَأُ النَّصَّ قِراءَةً جَهْرِيَّةً سَليمَةً مُراعِياً التَّلْوينَ الصَّوْتِيَّ المُناسِبَ لِلْمَعْنى.', subparts: [],
    interaction: { kind: 'speak' },
    source: u2l3Src(62, 'textbook_poetry', 'أقرأ', 3),
  },

  /* ============ ص٦٣: الفهم القرائي ١–٥ ============ */
  {
    id: 'u2l3-a-09', sourceActivityId: 'U2L3-63-01', printedNumber: '١', section: 'الفهم القرائي', page: 63,
    instruction: 'أُكْمِلُ الفَراغاتِ الآتِيَةَ بِما يُناسِبُها:',
    subparts: [
      '– ضِدُّ (العُجْمَةِ):',
      '– جَمْعُ (العُمْرِ):',
      '– مُثَنّى (مَجْدٍ):',
      '– مُفْرَدُ (الهِضابِ):',
    ],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'did', label: '– ضِدُّ (العُجْمَةِ):' },
        { id: 'jam', label: '– جَمْعُ (العُمْرِ):' },
        { id: 'muthanna', label: '– مُثَنّى (مَجْدٍ):' },
        { id: 'mufrad', label: '– مُفْرَدُ (الهِضابِ):' },
      ],
    },
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي', 1),
  },
  {
    id: 'u2l3-a-10', sourceActivityId: 'U2L3-63-02', printedNumber: '٢', section: 'الفهم القرائي', page: 63,
    instruction: 'أَصِلُ التَّرْكيبَ في العَمودِ الأَوَّلِ بِالْكَلِمَةِ المُعَبِّرَةِ عَنْهُ في العَمودِ الثّاني:',
    subparts: [],
    interaction: {
      kind: 'matching',
      leftItems: [
        { id: 'zana', text: 'زانَهُ خُلُقٌ أَصابَ' },
        { id: 'tajni', text: 'تَجْني شَهْداً مُسْتَطاباً' },
        { id: 'lugha', text: 'لُغَةُ الضّادِ' },
      ],
      rightItems: [
        { id: 'ulum', text: 'العُلومِ' },
        { id: 'arabiyya', text: 'العَرَبِيَّةِ' },
        { id: 'istaqama', text: 'اسْتَقامَ' },
      ],
    },
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي', 2),
  },
  {
    id: 'u2l3-a-11', sourceActivityId: 'U2L3-63-03', printedNumber: '٣', section: 'الفهم القرائي', page: 63,
    instruction: 'أَسْتَخْرِجُ مِنَ البَيْتِ الأَوَّلِ سَبَباً وَنَتيجَةً، ثُمَّ أُضيفُ نَتيجَةً أُخْرى مِنْ خِبْرَتي لِلسَّبَبِ نَفْسِهِ:',
    subparts: ['– السَّبَبُ:', '– النَّتيجَةُ:', 'نَتيجَةٌ أُخْرى مِنْ خِبْرَتي لِلسَّبَبِ نَفْسِهِ:'],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'sabab', label: '– السَّبَبُ:' },
        { id: 'natija', label: '– النَّتيجَةُ:' },
        { id: 'natija2', label: 'نَتيجَةٌ أُخْرى مِنْ خِبْرَتي لِلسَّبَبِ نَفْسِهِ:' },
      ],
    },
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي', 3),
  },
  {
    id: 'u2l3-a-12', sourceActivityId: 'U2L3-63-04', printedNumber: '٤', section: 'الفهم القرائي', page: 63,
    instruction: 'أَكْتُبُ رَقْمَ البَيْتِ الَّذي يَدُلُّ على كُلِّ فِكْرَةٍ مِنَ الفِكْرَتَيْنِ الآتِيَتَيْنِ:',
    subparts: [
      '– الدَّعْوَةُ لِلْعِلْمِ المُقْتَرِنِ بِالأَخْلاقِ',
      '– الدَّعْوَةُ لِلْحِفاظِ على نَقاءِ اللُّغَةِ العَرَبِيَّةِ',
    ],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 'fikra1', label: '– الدَّعْوَةُ لِلْعِلْمِ المُقْتَرِنِ بِالأَخْلاقِ' },
        { id: 'fikra2', label: '– الدَّعْوَةُ لِلْحِفاظِ على نَقاءِ اللُّغَةِ العَرَبِيَّةِ' },
      ],
    },
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي', 4),
  },
  {
    id: 'u2l3-a-13', sourceActivityId: 'U2L3-63-05', printedNumber: '٥', section: 'الفهم القرائي', page: 63,
    instruction: 'أُخْبِرُ زُمَلائي بِالْبَيْتِ الَّذي يَتَضَمَّنُ مَعْنى المَقُولَةِ الآتِيَةِ، مِنَ النَّصِّ. (الأنام: النّاسُ)',
    subparts: ['وَخَيْرُ جَليسٍ في الأَنامِ كِتابُ،'],
    interaction: { kind: 'write', label: 'البيت الذي يتضمّن معنى المقولة', rows: 2 },
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي', 5),
  },

  /* ============ ص٦٣: الفهم القرائي ٦–١٠ ============ */
  {
    id: 'u2l3-a-14', sourceActivityId: 'U2L3-63-06', printedNumber: '٦', section: 'الفهم القرائي', page: 63,
    instruction: 'أَخْتارُ مِنَ النَّصِّ بَيْتاً أَعْجَبَني، ثُمَّ أُبَيِّنُ سَبَبَ إِعْجابي بِهِ.', subparts: [],
    interaction: { kind: 'write', label: 'البيت وسبب إعجابي به', rows: 3 },
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي', 6),
  },
  {
    id: 'u2l3-a-15', sourceActivityId: 'U2L3-63-07', printedNumber: '٧', section: 'الفهم القرائي', page: 63,
    instruction: 'أَقْرَأُ البَيْتَ الآتي، ثُمَّ أَخْتارُ الشُّعورَ المُناسِبَ مِمّا بَيْنَ القَوْسَيْنِ:',
    subparts: [
      'فاسْتَرِدّوا مَجْدَ ماضٍ    نُورُهُ جَلَّلَ الهِضابا',
      'الشُّعورُ الَّذي يَتَجَلّى في البَيْتِ السّابِقِ هو:',
      '(الافْتِخارُ – الحُبُّ – السَّعادَةُ)',
    ],
    interaction: {
      kind: 'choice_groups',
      groups: [{
        id: 'shuur', label: 'الشُّعورُ الَّذي يَتَجَلّى في البَيْتِ السّابِقِ هو:',
        choices: [
          { id: 'iftikhar', text: 'الافْتِخارُ' },
          { id: 'hubb', text: 'الحُبُّ' },
          { id: 'saada', text: 'السَّعادَةُ' },
        ],
      }],
    },
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي', 7),
  },
  {
    id: 'u2l3-a-16', sourceActivityId: 'U2L3-63-08', printedNumber: '٨', section: 'الفهم القرائي', page: 63,
    instruction: 'أَقْتَرِحُ أنا وَزُمَلائي عِباراتٍ تَحُثُّ تَلاميذَ مَدْرَسَتِنا على المُطالَعَةِ، وَنَتَّفِقُ على العِباراتِ الثَّلاثِ الأَكْثَرِ جاذَبيَّةً، ثُمَّ نَعْرِضُها في لَوْحَةِ الإِعْلاناتِ:',
    subparts: [],
    interaction: { kind: 'write', label: 'العبارات الثلاث الأكثر جاذبية', rows: 5 },
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي', 8),
  },
  {
    id: 'u2l3-a-17', sourceActivityId: 'U2L3-63-09', printedNumber: '٩', section: 'الفهم القرائي', page: 63,
    instruction: 'هاتِ مِنَ النَّصِّ تَرْكيباً يَدُلُّ على مَكانَةِ اللُّغَةِ العَرَبِيَّةِ', subparts: [],
    interaction: { kind: 'write', label: 'التركيب من النص', rows: 2 },
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي', 9),
  },
  {
    id: 'u2l3-a-18', sourceActivityId: 'U2L3-63-10', printedNumber: '١٠', section: 'الفهم القرائي', page: 63,
    instruction: 'أَحْفَظُ الأَبْياتَ وَأُلْقيها أَمامَ زُمَلائي مُمَثِّلاً مَشاعِرَ النُّصْحِ وَالإِرْشادِ.', subparts: [],
    interaction: { kind: 'speak' },
    source: u2l3Src(63, 'textbook_exercise', 'الفهم القرائي', 10),
  },

  /* ============ ص٦٤: التواصل الشفهي وقواعد اللغة ============ */
  {
    id: 'u2l3-a-19', sourceActivityId: 'U2L3-64-01', printedNumber: '—', section: 'أتواصل شفوياً: سرد الحكاية', page: 64,
    instruction: 'أَتَذَكَّرُ قِصَّةً قَرَأْتُها وَرَسَمْتُها في خَيالي، وَأُحَدِّثُ زُمَلائي عَنْها مُراعِياً الأَداءَ المُناسِبَ.', subparts: [],
    interaction: { kind: 'speak' },
    source: u2l3Src(64, 'textbook_expression', 'أتواصل شفوياً: سرد الحكاية'),
  },
  {
    id: 'u2l3-a-20', sourceActivityId: 'U2L3-64-02', printedNumber: '١', section: 'قواعد اللغة: أقرأ الأمثلة', page: 64,
    instruction: 'أُلاحِظُ أَنَّ الفِعْلَ (عَدَّ) في المِثالِ الأَوَّلِ فِعْلٌ ماضٍ لَمْ يَتَّصِلْ بِآخِرِهِ شَيْءٌ، أُبَيِّنُ حَرَكَةَ آخِرِهِ.', subparts: [],
    interaction: { kind: 'write', label: 'ملاحظتي', rows: 2 },
    source: u2l3Src(64, 'textbook_grammar', 'قواعد اللغة', 1),
  },
  {
    id: 'u2l3-a-21', sourceActivityId: 'U2L3-64-03', printedNumber: '٢', section: 'قواعد اللغة: أقرأ الأمثلة', page: 64,
    instruction: 'أَدُلُّ على الحَرْفِ الأَصْلِيِّ الأَخيرِ في كُلٍّ مِنَ الفِعْلَيْنِ (عَمِلا – نالَتْ)، وَأَذْكُرُ حَرَكَةَ كُلٍّ مِنْهُما.', subparts: [],
    interaction: { kind: 'write', label: 'ملاحظتي', rows: 3 },
    source: u2l3Src(64, 'textbook_grammar', 'قواعد اللغة', 2),
  },
  {
    id: 'u2l3-a-22', sourceActivityId: 'U2L3-64-04', printedNumber: '٣', section: 'قواعد اللغة: أقرأ الأمثلة', page: 64,
    instruction: 'أُلاحِظُ أَنَّ الفِعْلَ (عَمِلا) لَمْ تَتَغَيَّرْ حَرَكَةُ آخِرِهِ عِنْدَ اتِّصالِهِ بِأَلِفِ الاثْنَيْنِ، فَهَلْ تَغَيَّرَتْ حَرَكَةُ آخِرِ الفِعْلِ (نالَ) عِنْدَ اتِّصالِهِ بِتاءِ التَّأْنيثِ السّاكِنَةِ؟', subparts: [],
    interaction: { kind: 'write', label: 'ملاحظتي', rows: 3 },
    source: u2l3Src(64, 'textbook_grammar', 'قواعد اللغة', 3),
  },
  {
    id: 'u2l3-a-23', sourceActivityId: 'U2L3-64-05', printedNumber: '٤', section: 'قواعد اللغة: أقرأ الأمثلة', page: 64,
    instruction: 'أُلاحِظُ أَنَّ كُلّاً مِنَ الأَفْعالِ (عَدَّ – عَمِلا – نالَ) بُنِيَ آخِرُها على حَرَكَةٍ واحِدَةٍ. أَذْكُرُها؟', subparts: [],
    interaction: { kind: 'write', label: 'ملاحظتي', rows: 2 },
    source: u2l3Src(64, 'textbook_grammar', 'قواعد اللغة', 4),
  },

  /* ============ ص٦٥: أطبّق والتقويم النهائي (١) ============ */
  {
    id: 'u2l3-a-24', sourceActivityId: 'U2L3-65-01', printedNumber: '—', section: 'أطبّق', page: 65,
    instruction: 'أَسْتَخْرِجُ مِنَ الفِقْرَةِ الآتِيَةِ الأَفْعالَ الماضِيَةَ، ثُمَّ أَمْلَأُ الجَدْوَلَ بِالمَطْلوبِ:',
    subparts: [],
    interaction: {
      kind: 'table_rows',
      columns: ['الفِعْلُ الماضي', 'الضَّميرُ أَوِ الحَرْفُ الَّذي اتَّصَلَ بِهِ', 'حَرَكَةُ بِنائِهِ'],
      rows: 4,
    },
    source: u2l3Src(65, 'textbook_grammar', 'أطبق'),
  },
  {
    id: 'u2l3-a-25', sourceActivityId: 'U2L3-65-02', printedNumber: '١', section: 'التقويم النهائي', page: 65,
    instruction: 'أَكْتُبُ فِعْلَيْنِ مُضارِعَيْنِ، ثُمَّ أُحَوِّلُهما إلى أَفْعالٍ ماضِيَةٍ مَبْنِيَّةٍ على الفَتْحِ مُسْتَعْمِلاً الحالاتِ الَّتي تَعَلَّمْتُها وَفْقَ المِثالِ.',
    subparts: [
      'المِثالُ المَطْبوعُ: يَكْتُبُ ← كَتَبَ، كَتَبا، كَتَبَتْ.',
      'البِطاقَةُ المَطْبوعَةُ في المَجْموعَةِ الأُخْرى: اسْتَحَقَّ.',
      'بَقِيَّةُ البِطاقاتِ والدَّوائِرِ فارِغَةٌ في الكِتاب.',
    ],
    interaction: { kind: 'write', label: 'عملي وفق المثال', rows: 5 },
    source: u2l3Src(65, 'textbook_grammar', 'التقويم النهائي', 1, U2L3_LOCKED_SOURCE_NOTES.finalEvaluationDiagram),
    gapNote: U2L3_LOCKED_SOURCE_NOTES.finalEvaluationDiagram,
  },

  /* ============ ص٦٦: التقويم النهائي (٢–٥)، الإملاء، الخط ============ */
  {
    id: 'u2l3-a-26', sourceActivityId: 'U2L3-66-01', printedNumber: '٢', section: 'التقويم النهائي', page: 66,
    instruction: 'أَمْلَأُ الفَراغَ بِفِعْلٍ ماضٍ مُناسِبٍ:',
    subparts: [
      '– اللُّغَةُ والعِلْمُ .......... في بِناءِ الحَضارَةِ.',
      '– الطّالِبَةُ المُجِدَّةُ .......... بِالجائِزَةِ.',
      '– .......... الطِّفْلُ أَمامَ المُعَلِّمِ بِاحْتِرامٍ.',
    ],
    interaction: {
      kind: 'text_fields',
      fields: [
        { id: 's1', label: '– اللُّغَةُ والعِلْمُ .......... في بِناءِ الحَضارَةِ.' },
        { id: 's2', label: '– الطّالِبَةُ المُجِدَّةُ .......... بِالجائِزَةِ.' },
        { id: 's3', label: '– .......... الطِّفْلُ أَمامَ المُعَلِّمِ بِاحْتِرامٍ.' },
      ],
    },
    source: u2l3Src(66, 'textbook_grammar', 'التقويم النهائي', 2),
  },
  {
    id: 'u2l3-a-27', sourceActivityId: 'U2L3-66-02', printedNumber: '٣', section: 'التقويم النهائي', page: 66,
    instruction: 'أُعْرِبُ ما تَحْتَهُ خَطٌّ مِنَ الجُمْلَةِ الآتِيَةِ: قَرَّرَ الأَوْلادُ إِقامَةَ احْتِفالٍ بِمُناسَبَةِ يَوْمِ اللُّغَةِ العَرَبِيَّةِ.',
    subparts: ['ما تَحْتَهُ خَطٌّ: «الأَوْلادُ»، «إِقامَةَ»', 'ثَلاثَةُ سُطُورٍ لِلإِعْرابِ في الكِتاب.'],
    interaction: { kind: 'write', label: 'الإعراب', rows: 3 },
    source: u2l3Src(66, 'textbook_grammar', 'التقويم النهائي', 3),
  },
  {
    id: 'u2l3-a-28', sourceActivityId: 'U2L3-66-03', printedNumber: '٤', section: 'التقويم النهائي', page: 66,
    instruction: 'أُحَدِّثُ زُمَلائي عَنْ أَهَمِّيَّةِ اللُّغَةِ في التَّعَلُّمِ لِمُدَّةِ دَقيقَةٍ مُسْتَعْمِلاً الفِعْلَ الماضِيَ المَبْنِيَّ على الفَتْحِ.', subparts: [],
    interaction: { kind: 'speak' },
    source: u2l3Src(66, 'textbook_grammar', 'التقويم النهائي', 4),
  },
  {
    id: 'u2l3-a-29', sourceActivityId: 'U2L3-66-04', printedNumber: '٥', section: 'التقويم النهائي', page: 66,
    instruction: 'أَكْتُبُ فِقْرَةً مِنْ خَمْسَ عَشْرَةَ كَلِمَةً عَنْ فِكْرَةِ قِصَّةٍ أَعْجَبَتْني مُسْتَعْمِلاً الفِعْلَ الماضِيَ المَبْنِيَّ على الفَتْحِ.', subparts: [],
    interaction: { kind: 'write', label: 'الفقرة', rows: 5 },
    source: u2l3Src(66, 'textbook_grammar', 'التقويم النهائي', 5),
  },
  {
    id: 'u2l3-a-30', sourceActivityId: 'U2L3-66-05', printedNumber: '١', section: 'إملاء: التاء المربوطة والمبسوطة', page: 66,
    instruction: 'أَقْرَأُ النَّصَّ السّابِقَ، ثُمَّ أَسْتَخْرِجُ الكَلِماتِ الَّتي تَحْوي تاءً مَرْبوطَةً أَوْ تاءً مَبْسوطَةً، وَأُعَلِّلُ كِتابَتَها.', subparts: [],
    interaction: { kind: 'write', label: 'الكلمات وتعليل كتابتها', rows: 4 },
    source: u2l3Src(66, 'textbook_spelling', 'إملاء', 1),
  },
  {
    id: 'u2l3-a-31', sourceActivityId: 'U2L3-66-06', printedNumber: '٢', section: 'إملاء: التاء المربوطة والمبسوطة', page: 66,
    instruction: 'أَتَدَرَّبُ على كِتابَةِ الكَلِماتِ الَّتي تَحْوي تاءً مَبْسوطَةً أَوْ مَرْبوطَةً.', subparts: [],
    interaction: { kind: 'write', label: 'التدريب على الكتابة', rows: 5 },
    source: u2l3Src(66, 'textbook_spelling', 'إملاء', 2),
  },
  {
    id: 'u2l3-a-32', sourceActivityId: 'U2L3-66-07', printedNumber: '٣', section: 'إملاء: التاء المربوطة والمبسوطة', page: 66,
    instruction: 'أَكْتُبُ ما يُمليهِ عَلَيَّ المُعَلِّمُ.', subparts: [],
    interaction: { kind: 'write', label: 'الإملاء', rows: 4 },
    source: u2l3Src(66, 'textbook_spelling', 'إملاء', 3, U2L3_LOCKED_SOURCE_NOTES.dictationAudio),
    gapNote: U2L3_LOCKED_SOURCE_NOTES.dictationAudio,
  },
  {
    id: 'u2l3-a-33', sourceActivityId: 'U2L3-66-08', printedNumber: '١', section: 'الخط', page: 66,
    instruction: 'أُلاحِظُ رَسْمَ الأَحْرُفِ (ر – ز) في الكَلِماتِ الآتِيَةِ:', subparts: [],
    interaction: { kind: 'handwriting', modelDescription: 'الكلمات المطبوعة بخط الرقعة ص٦٦ رسوم خطية ملوّنة؛ راقبها في صفحة الكتاب ثم نفّذ الرسم على ورقة مسطّرة.' },
    source: u2l3Src(66, 'textbook_exercise', 'الخط', 1, U2L3_LOCKED_SOURCE_NOTES.handwritingWords),
    gapNote: U2L3_LOCKED_SOURCE_NOTES.handwritingWords,
  },

  /* ============ ص٦٧: الخط والتعزيز الكتابي ============ */
  {
    id: 'u2l3-a-34', sourceActivityId: 'U2L3-67-01', printedNumber: '٢', section: 'الخط', page: 67,
    instruction: 'أُجَرِّدُ الأَحْرُفَ المَلونَةَ في الكَلِماتِ السّابِقَةِ مُنْتَبِهاً لِطَريقَةِ كِتابَتِها.', subparts: [],
    interaction: { kind: 'handwriting', modelDescription: 'تجريد الأحرف الملونة أداء خطي يدوي على ورقة مسطّرة.' },
    source: u2l3Src(67, 'textbook_exercise', 'الخط', 2, U2L3_LOCKED_SOURCE_NOTES.handwritingWords),
    gapNote: U2L3_LOCKED_SOURCE_NOTES.handwritingWords,
  },
  {
    id: 'u2l3-a-35', sourceActivityId: 'U2L3-67-02', printedNumber: '—', section: 'أتعلّم', page: 67,
    instruction: 'أُلاحِظُ كِتابَةَ أَشْكالِ الحَرْفِ فيما يَأْتي:', subparts: [],
    interaction: { kind: 'handwriting', modelDescription: 'شكلان خطيان مرسومان في إطار «أتعلّم» ص٦٧؛ يُلاحَظان في صفحة الكتاب ويُنفَّذ الرسم يدوياً.' },
    source: u2l3Src(67, 'textbook_exercise', 'أتعلّم', undefined, U2L3_LOCKED_SOURCE_NOTES.handwritingWords),
    gapNote: U2L3_LOCKED_SOURCE_NOTES.handwritingWords,
  },
  {
    id: 'u2l3-a-36', sourceActivityId: 'U2L3-67-03', printedNumber: '—', section: 'أتعلّم', page: 67,
    instruction: 'أَكْتُبُ أَشْكالَ حَرْفِ الزّايِ (ز) بِخَطِّ الرُّقْعَةِ', subparts: [],
    interaction: { kind: 'handwriting', modelDescription: 'أشكال حرف الزاي بخط الرقعة تُنفَّذ يدوياً على ورقة مسطّرة.' },
    source: u2l3Src(67, 'textbook_exercise', 'أتعلّم', undefined, U2L3_LOCKED_SOURCE_NOTES.handwritingWords),
    gapNote: U2L3_LOCKED_SOURCE_NOTES.handwritingWords,
  },
  {
    id: 'u2l3-a-37', sourceActivityId: 'U2L3-67-04', printedNumber: '—', section: 'أتدرّب', page: 67,
    instruction: 'أُحاكي رَسْمَ كَلِماتِ البَيْتِ الآتي بِخَطِّ الرُّقْعَةِ:',
    subparts: ['أَيُّهَا الطّالِبُ مَهْلًا    فُزْتَ لا تَطْوِ الكِتابا'],
    interaction: { kind: 'handwriting', modelText: 'أَيُّهَا الطّالِبُ مَهْلًا    فُزْتَ لا تَطْوِ الكِتابا', modelDescription: 'نموذج البيت بخط الرقعة ص٦٧؛ تُحاكى كتابته يدوياً على ورقة مسطّرة.' },
    source: u2l3Src(67, 'textbook_exercise', 'أتدرّب', undefined, U2L3_LOCKED_SOURCE_NOTES.handwritingWords),
    gapNote: U2L3_LOCKED_SOURCE_NOTES.handwritingWords,
  },
  {
    id: 'u2l3-a-38', sourceActivityId: 'U2L3-67-05', printedNumber: '—', section: 'أطبّق', page: 67,
    instruction: 'أُلاحِظُ الفَرْقَ في رَسْمِ الأَحْرُفِ بَيْنَ خَطَّيِ الرُّقْعَةِ والنَّسْخِ في الجَدْوَلِ الآتي:',
    subparts: ['خَطُّ النَّسْخِ', 'خَطُّ الرُّقْعَةِ'],
    interaction: { kind: 'handwriting', modelDescription: 'الجدول ص٦٧ رسوم خطية مرقمة لرَوزَي (ر – ز) في الخطّين؛ يُقارَن يدوياً ولا تُستبدل الأشكال بحروف مطبعية.' },
    source: u2l3Src(67, 'textbook_exercise', 'أطبّق', undefined, U2L3_LOCKED_SOURCE_NOTES.handwritingWords),
    gapNote: U2L3_LOCKED_SOURCE_NOTES.handwritingWords,
  },
  {
    id: 'u2l3-a-39', sourceActivityId: 'U2L3-67-06', printedNumber: '١', section: 'أعزّز كتابياً: حقيقة علمية', page: 67,
    instruction: 'أُعاوِنُ زُمَلائي على كِتابَةِ بَعْضِ الحَقائِقِ العِلْميَّةِ الَّتي أَعْرِفُها.', subparts: [],
    interaction: { kind: 'write', label: 'الحقائق العلمية', rows: 4 },
    source: u2l3Src(67, 'textbook_expression', 'أعزّز كتابياً: حقيقة علمية', 1),
  },
  {
    id: 'u2l3-a-40', sourceActivityId: 'U2L3-67-07', printedNumber: '٢', section: 'أعزّز كتابياً: حقيقة علمية', page: 67,
    instruction: 'أَعودُ إلى كِتابِ العُلومِ، وَأَجْمَعُ بَعْضاً مِنَ الحَقائِقِ العِلْميَّةِ مُلْتَرِماً خَصائِصَ كِتابَتِها.', subparts: [],
    interaction: { kind: 'write', label: 'ما جمعته من كتاب العلوم', rows: 4 },
    source: u2l3Src(67, 'textbook_expression', 'أعزّز كتابياً: حقيقة علمية', 2),
  },

  /* ============ ص٦٨: ألعب وأتعلّم، أنا وأسرتي ============ */
  {
    id: 'u2l3-a-41', sourceActivityId: 'U2L3-68-01', printedNumber: '١', section: 'ألعب وأتعلّم', page: 68,
    instruction: 'أُعاوِنُ زُمَلائي في المَجْموعَةِ على كِتابَةِ أَكْبَرِ عَدَدٍ مِنَ الكَلِماتِ تَبْدَأُ بِحَرْفِ الرّاءِ أَوِ الزّايِ وتَنْتَهي بِتاءٍ مَرْبوطَةٍ، وأُسَجِّلُ كُلّاً مِنْها على بِطاقَةٍ.',
    subparts: [],
    interaction: { kind: 'cards', initialCards: 4 },
    source: u2l3Src(68, 'activity_book', 'ألعب وأتعلّم', 1),
  },
  {
    id: 'u2l3-a-42', sourceActivityId: 'U2L3-68-02', printedNumber: '٢', section: 'ألعب وأتعلّم', page: 68,
    instruction: 'أُقارِنُ عَدَدَ بِطاقاتي مَعَ عَدَدِ بِطاقاتِ زُمَلائي.',
    subparts: ['مُدَّةُ التَّنْفيذِ: خَمْسُ دَقائِقَ'],
    interaction: { kind: 'write', label: 'نتيجة المقارنة', rows: 2 },
    source: u2l3Src(68, 'activity_book', 'ألعب وأتعلّم', 2),
  },
  {
    id: 'u2l3-a-43', sourceActivityId: 'U2L3-68-03', printedNumber: '—', section: 'أنا وأسرتي', page: 68,
    instruction: 'أَبْحَثُ بِمُساعَدَةِ أُسْرَتي وبِالاسْتِعانَةِ بِمَصادِرِ التَّعَلُّمِ عَنِ المُنْجَزاتِ العِلْميَّةِ في القَرْنِ الحادي والعِشْرينَ وَأُلْقيها أَمامَ زُمَلائي.',
    subparts: [],
    interaction: { kind: 'speak' },
    source: u2l3Src(68, 'activity_book', 'أنا وأسرتي'),
  },
];

export const U2L3_ACTIVITY_BY_ID: Record<string, U2L3Activity> = Object.fromEntries(
  U2L3_ACTIVITIES.map((activity) => [activity.id, activity]),
);

export const U2L3_COVERAGE = {
  discovered: U2L3_ACTIVITIES.length,
  pages: [...new Set(U2L3_ACTIVITIES.map((activity) => activity.page))],
  withDeclaredGap: U2L3_ACTIVITIES.filter((activity) => Boolean(activity.gapNote)).length,
} as const;
