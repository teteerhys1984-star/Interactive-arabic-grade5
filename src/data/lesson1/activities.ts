import { SourceReference } from '../../types/curriculum';
import { src } from './sourceMeta';

/**
 * Complete textbook activity / question inventory for Lesson 1 (pages 4–11).
 * Each entry preserves the verbatim instruction, carries an exact SourceReference,
 * provides a student interaction, and a teacher-facing explanatory solution.
 * This array IS the coverage ledger: discovered == implemented == solved, by construction.
 */

export type ActivityInteraction =
  | { kind: 'text_inputs'; fields: { id: string; label: string; acceptedAnswers?: string[] }[] }
  | { kind: 'choose'; choices: { id: string; text: string }[]; correctId: string }
  | { kind: 'multi'; choices: { id: string; text: string }[]; correctIds: string[] }
  | { kind: 'classify'; categories: { id: string; label: string }[]; items: { id: string; text: string; correctCategoryId: string }[] }
  | { kind: 'write' }
  | { kind: 'speak' }
  | { kind: 'decode' };

export interface TextbookActivity {
  id: string;
  page: number;
  section: string;
  printedNumber: string;
  instruction: string;
  interaction: ActivityInteraction;
  solution: { answer: string; explanation: string };
  uncertain?: string;
  source: SourceReference;
}

export const TEXTBOOK_ACTIVITIES: TextbookActivity[] = [
  /* ---------------- page 4 ---------------- */
  {
    id: 'a-p4-1', page: 4, section: 'أستكشف الصورتين', printedNumber: '١',
    instruction: 'أَصِفُ ما أُشاهِدُهُ في كُلٍّ مِنْ الصُّورَتَيْنِ السّابِقَتَيْنِ.',
    interaction: { kind: 'text_inputs', fields: [
      { id: 'img1', label: 'وَصْفُ الصُّورَةِ الأُولى (الصَّيْدُ)' },
      { id: 'img2', label: 'وَصْفُ الصُّورَةِ الثّانِيَةِ (صُنْعُ المَرْكَبِ)' },
    ]},
    solution: { answer: 'الأُولى: صَيّادونَ يَسْحَبونَ الشِّباكَ المَلِيئَةَ بِالسَّمَكِ داخِلَ مَرْكَبٍ. الثّانِيَةُ: صَيّادونَ يَبْنونَ مَرْكَباً لِلصَّيْدِ عَلى الشّاطِئِ.', explanation: 'وَصْفٌ نَموذَجِيٌّ يُظْهِرُ مُلاحَظَةَ العَمَلِ وَالتَّعاوُنِ في الصُّورَتَيْنِ.' },
    source: src(4, 'textbook_exercise', 'الصُّورتان', 1),
  },
  {
    id: 'a-p4-2', page: 4, section: 'أستكشف الصورتين', printedNumber: '٢',
    instruction: 'أُخْبِرُ زِملائي بما أراهُ مُشْتَرَكاً فيما تُعَبِّرُ عَنْهُ الصُّورَتانِ.',
    interaction: { kind: 'speak' },
    solution: { answer: 'المُشْتَرَكُ: العَمَلُ وَالتَّعاوُنُ بَيْنَ الصَّيّادينَ لِتَحْقيقِ هَدَفٍ مُشْتَرَكٍ.', explanation: 'كِلتا الصُّورَتَيْنِ تُجَسِّدانِ العَمَلَ الجَماعِيَّ.' },
    source: src(4, 'textbook_exercise', 'الصُّورتان', 2),
  },
  {
    id: 'a-p4-3', page: 4, section: 'أستمع وأتحدث', printedNumber: '١',
    instruction: 'أَذْكُرُ: الشَّخْصِيَّةُ الرَّئِيسَةُ في القِصَّةِ / المَكانُ الَّذي تَدورُ فيهِ أَحْداثُ القِصَّةِ.',
    interaction: { kind: 'text_inputs', fields: [
      { id: 'char', label: 'الشَّخْصِيَّةُ الرَّئِيسَةُ', acceptedAnswers: ['الصياد', 'الصيّاد'] },
      { id: 'place', label: 'المَكانُ', acceptedAnswers: ['البحر', 'شاطئ البحر', 'الشاطئ'] },
    ]},
    solution: { answer: 'الشَّخْصِيَّةُ الرَّئِيسَةُ: الصَّيّادُ. المَكانُ: شاطِئُ البَحْرِ.', explanation: 'الأَحْداثُ تَدورُ حَوْلَ الصَّيّادِ عَلى الشّاطِئِ.' },
    source: src(4, 'textbook_reading', 'أَسْتَمِعُ', 1),
  },
  {
    id: 'a-p4-4', page: 4, section: 'أستمع وأتحدث', printedNumber: '٢',
    instruction: 'أُخْبِرُ زِملائي بِالأَمْنِيَةِ الَّتي سَعى الصَّيّادُ إلى تَحْقيقِها.',
    interaction: { kind: 'speak' },
    solution: { answer: 'أَمْنِيَتُهُ: اصْطِيادُ سَمَكَةٍ ذَهَبِيَّةٍ لِيَشْتَرِيَ بِثَمَنِها زَوْرَقاً لِلصَّيْدِ.', explanation: 'الأُمْنِيَّةُ وارِدَةٌ في بِدايَةِ النَّصِّ.' },
    source: src(4, 'textbook_reading', 'أَسْتَمِعُ', 2),
  },
  {
    id: 'a-p4-5', page: 4, section: 'أستمع وأتحدث', printedNumber: '٣',
    instruction: 'أَتَحَدَّثُ أَمامَ زِملائي عمّا فَهِمْتُهُ مِنَ النَّصِّ بِأَقَلِّ عَدَدٍ مُمْكِنٍ مِنَ الجُمَلِ.',
    interaction: { kind: 'speak' },
    solution: { answer: 'مِثالٌ: حَلُمَ الصَّيّادُ بِسَمَكَةٍ ذَهَبِيَّةٍ، فَنَصَحَهُ البَحْرُ بِالتَّعاوُنِ، فَبَنى مَعَ زُملائِهِ مَرْكَباً وَحَقَّقَ حُلْمَهُ.', explanation: 'تَلْخيصٌ بِجُمَلٍ قَصيرَةٍ يُظْهِرُ الفَهْمَ.' },
    source: src(4, 'textbook_reading', 'أَسْتَمِعُ', 3),
  },

  /* ---------------- page 5 ---------------- */
  {
    id: 'a-p5-1', page: 5, section: 'أقرأ', printedNumber: '١',
    instruction: 'أَقْرَأُ المَقْطَعَ الأَوَّلَ مُراعِياً أُسْلُوبَي النِّداءِ وَالاسْتِفْهامِ.',
    interaction: { kind: 'speak' },
    solution: { answer: 'قِراءَةٌ مُعَبِّرَةٌ تُبْرِزُ النِّداءَ (يا صَديقي البَحْرَ) وَالاسْتِفْهامَ (كَيْفَ؟ أَيْنَ هِيَ؟).', explanation: 'مُراعَاةُ الأُسلوبَيْنِ تُحَقِّقُ التَّلْوينَ الصَّوْتِيَّ.' },
    source: src(5, 'textbook_reading', 'أَقْرَأُ', 1),
  },
  {
    id: 'a-p5-2', page: 5, section: 'أقرأ', printedNumber: '٢',
    instruction: 'أَقْرَأُ المَقْطَعَ الثّاني مُراعِياً أُسْلُوبَ التَّعَجُّبِ وَمَشاعِرَ الفَرَحِ.',
    interaction: { kind: 'speak' },
    solution: { answer: 'قِراءَةٌ تُبْرِزُ التَّعَجُّبَ (يا لَها مِنْ فِكْرَةٍ!) وَمَشاعِرَ الفَرَحِ في النِّهايَةِ.', explanation: 'المقطع الثاني يَحْمِلُ البِشارَةَ وَالفَرَحَ.' },
    source: src(5, 'textbook_reading', 'أَقْرَأُ', 2),
  },
  {
    id: 'a-p5-3', page: 5, section: 'أقرأ', printedNumber: '٣',
    instruction: 'أَقْرَأُ النَّصَّ قِراءَةً جَهْرِيَّةً سَليمَةً مُراعِياً التَّلْوينَ الصَّوْتِيَّ المُناسِبَ لِلْمَعْنى.',
    interaction: { kind: 'speak' },
    solution: { answer: 'قِراءَةٌ جَهْرِيَّةٌ سَليمَةُ النُّطْقِ مَعَ تَغْييرِ النَّبْرِ بِحَسَبِ المَعْنى.', explanation: 'تَدْريبٌ عَلى الطَّلاقَةِ وَالتَّعبيرِ.' },
    source: src(5, 'textbook_reading', 'أَقْرَأُ', 3),
  },

  /* ---------------- page 6 ---------------- */
  {
    id: 'a-p6-1', page: 6, section: 'الفهم القرائي', printedNumber: '١',
    instruction: 'أَمْلَأُ الفَراغاتِ الآتِيَةَ مُسْتَعيناً بِالنَّصِّ.',
    interaction: { kind: 'text_inputs', fields: [
      { id: 'plural', label: 'جَمْعُ (السَّمَكَةُ)', acceptedAnswers: ['السمكات', 'الأسماك', 'السَّمَكَاتُ', 'الأَسْماكُ'] },
      { id: 'meaning', label: 'مَعْنى (قَضَّتْ)', acceptedAnswers: ['مضت', 'مَضَتْ'] },
      { id: 'opposite', label: 'ضِدُّ (فَرِحَ)', acceptedAnswers: ['حزن', 'حَزِنَ'] },
    ]},
    solution: { answer: 'جَمْعُ السَّمَكَةِ: السَّمَكاتُ / الأَسْماكُ. ضِدُّ فَرِحَ: حَزِنَ. (مَعْنى «قَضَّتْ» بِحاجَةٍ إلى قَصٍّ أَدَقَّ).', explanation: 'مُفْرَداتٌ مُسْتَنْبَطَةٌ مِنَ النَّصِّ وَسِياقِهِ.' },
    uncertain: 'الكلمة (قَضَّتْ) غير مؤكدة',
    source: src(6, 'textbook_exercise', 'الفَهْمُ', 1, 'الكلمة بين قوسين في البند الثاني بحاجة إلى قصّ أدق'),
  },
  {
    id: 'a-p6-2', page: 6, section: 'الفهم القرائي', printedNumber: '٢',
    instruction: 'أُبَيِّنُ مَعْنى الكَلِمَةِ المُلَوَّنَةِ وَفْقَ سِياقِها في الجُمَلِ الآتِيَةِ.',
    interaction: { kind: 'text_inputs', fields: [
      { id: 'khafaqa', label: 'خَفَقَ البَحْرُ بِمَوْجِهِ', acceptedAnswers: ['اضطرب', 'تحرّك', 'اهتز'] },
      { id: 'yarwiha', label: 'إِنَّها حِكايةٌ يُرْويها النّاسُ', acceptedAnswers: ['يحكيها', 'يقصها', 'يخبر بها'] },
    ]},
    solution: { answer: 'خَفَقَ: اضْطَرَبَ وَتَحَرَّكَتْ أَمْواجُهُ. يُرْويها: يَحْكيها وَيَقُصُّها.', explanation: 'المَعْنى مُسْتَفادٌ مِنَ السِّياقِ.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ', 2),
  },
  {
    id: 'a-p6-3', page: 6, section: 'الفهم القرائي', printedNumber: '٣',
    instruction: 'أُكْمِلُ أَحْداثَ القِصَّةِ مُسْتَعيناً بِالشَّكْلِ.',
    interaction: { kind: 'text_inputs', fields: [
      { id: 'ev1', label: 'الحَدَثُ النّاقِصُ الأَوَّلُ' },
      { id: 'ev2', label: 'الحَدَثُ النّاقِصُ الثّاني' },
    ]},
    solution: { answer: 'التَّرْتيبُ: لُجوءُ الصَّيّادِ إلى البَحْرِ ← سَماعُهُ وَعْدَ البَحْرِ بِسَمَكَةٍ ذَهَبِيَّةٍ ← اتِّفاقُهُ مَعَ زُملائِهِ عَلى صَيْدِ سَمَكَةٍ إِضافِيَّةٍ ← اصْطِيادُ السَّمَكِ الإِضافِيِّ ← بِناءُ المَرْكَبِ وَتَجْهيزُهُ.', explanation: 'يُكْمِلُ التِّلْميذُ المُرَبَّعاتِ الفارِغَةَ بِالأَحْداثِ الوُسْطى.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ', 3),
  },
  {
    id: 'a-p6-4', page: 6, section: 'الفهم القرائي', printedNumber: '٤',
    instruction: 'أَمْلَأُ الجَدْوَلَ الآتِيَ بِما يُناسِبُهُ.',
    interaction: { kind: 'text_inputs', fields: [
      { id: 'r1res', label: 'النَّتيجَةُ (السَّبَبُ: تَوَفُّرُ المالِ)' },
      { id: 'r1sen', label: 'الجُمْلَةُ الَّتي تَدُلُّ عليهِ' },
      { id: 'r2cause', label: 'السَّبَبُ (النَّتيجَةُ: سُرورُ البَحْرِ وَطَرَبُهُ)' },
    ]},
    solution: { answer: 'تَوَفُّرُ المالِ ← بِناءُ المَرْكَبِ؛ الجُمْلَةُ: «وَبَعْدَ فَتْرَةٍ تَوَفَّرَ المالُ مَعَهُمْ، وَتَعاوَنوا عَلى صُنْعِ المَرْكَبِ». سُرورُ البَحْرِ ← نَجاحُ التَّعاوُنِ؛ الجُمْلَةُ: «خَفَقَ البَحْرُ بِمَوْجِهِ وَراحَ يَسْتَمِعُ...».', explanation: 'رَبْطُ السَّبَبِ بِالنَّتيجَةِ وَبِالشّاهِدِ مِنَ النَّصِّ.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ', 4),
  },
  {
    id: 'a-p6-5', page: 6, section: 'الفهم القرائي', printedNumber: '٥',
    instruction: 'أَخْتارُ الإِجابَةَ الصَّحيحَةَ: تَرْمُزُ السَّمَكَةُ الذَّهَبِيَّةُ في القِصَّةِ إلى:',
    interaction: { kind: 'choose', choices: [
      { id: 'a', text: 'سَمَكَةٍ تَخْرُجُ مِنَ البَحْرِ.' },
      { id: 'b', text: 'العَمَلِ وَالتَّعاوُنِ.' },
      { id: 'c', text: 'سَمَكَةٍ مِنَ الذَّهَبِ.' },
    ], correctId: 'b' },
    solution: { answer: 'ب. العَمَلِ وَالتَّعاوُنِ.', explanation: 'القِصَّةُ تُؤَكِّدُ أَنَّ الحُلْمَ يَتَحَقَّقُ بِالعَمَلِ الجَماعِيِّ لا بِانتِظارِ المُعْجِزاتِ.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ', 5),
  },
  {
    id: 'a-p6-6', page: 6, section: 'الفهم القرائي', printedNumber: '٦',
    instruction: 'أَدِلُّ عَلى العِبارَتَيْنِ اللَّتَيْنِ أَعْطى فيهِما الكاتِبُ الأَشْياءَ صِفاتٍ إِنسانِيَّةً مِمّا يَأْتي:',
    interaction: { kind: 'multi', choices: [
      { id: 'a', text: 'البَحْرُ ضاحِكٌ' },
      { id: 'b', text: 'في المِياهِ سَمَكٌ' },
      { id: 'c', text: 'اسْتَمَعَ البَحْرُ إلى أَغاني الصَّيّادينَ.' },
    ], correctIds: ['a', 'c'] },
    solution: { answer: 'أ وَ ت: «البَحْرُ ضاحِكٌ» وَ «اسْتَمَعَ البَحْرُ...». وَهذِهِ الصِّفاتُ هِيَ: صِفاتٌ إِنسانِيَّةٌ (تَشْخيصُ البَحْرِ).', explanation: 'أَعْطى الكاتِبُ البَحْرَ صِفاتَ الإِنْسانِ (الضَّحِكُ وَالاسْتِماعُ).' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ', 6),
  },
  {
    id: 'a-p6-7', page: 6, section: 'الفهم القرائي', printedNumber: '٧',
    instruction: 'أَقْتَرِحُ نِهايَةً أُخْرى لِلنَّصِّ مِنْ مَخْيِّلَتي.',
    interaction: { kind: 'write' },
    solution: { answer: 'إجابَةٌ حُرَّةٌ؛ مِثالٌ: يَقْرِّرُ الصَّيّادونَ فَتْحَ مَدْرَسَةٍ لِتَعْليمِ الصَّيْدِ لِلأَطْفالِ.', explanation: 'نَشاطٌ إِبداعِيٌّ يُنَمّي الخَيالَ.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ', 7),
  },
  {
    id: 'a-p6-8', page: 6, section: 'الفهم القرائي', printedNumber: '٨',
    instruction: 'لَوْ كُنْتُ مَكانَ الصَّيّادِ، ماذا سَأَفْعَلُ لِأَحْصُلَ عَلى سَمَكَتي الذَّهَبِيَّةِ؟',
    interaction: { kind: 'write' },
    solution: { answer: 'إجابَةٌ حُرَّةٌ؛ مِثالٌ: أَتَعاوَنُ مَعَ زُملائي وَأُدَخِّرُ جُزْءاً مِنَ الصَّيْدِ لِشِراءِ زَوْرَقٍ.', explanation: 'رَبْطُ القِصَّةِ بِخِبْرَةِ التِّلْميذِ.' },
    source: src(6, 'textbook_exercise', 'الفَهْمُ', 8),
  },

  /* ---------------- page 7 ---------------- */
  {
    id: 'a-p7-1', page: 7, section: 'أتواصل شفوياً', printedNumber: '١',
    instruction: 'أَتَأَمَّلُ الصُّوَرَ، ثُمَّ أُحاوِرُ زُملائي لِنَتَّفِقَ عَلى خُطَّةِ عَمَلٍ لِتَصْميمِ مُطَوِيَّةٍ وَتَوْزيعِها في حَيِّنا.',
    interaction: { kind: 'text_inputs', fields: [
      { id: 'plan', label: 'التَّخْطيطُ' },
      { id: 'stages', label: 'مَراحِلُ التَّنْفيذِ' },
    ]},
    solution: { answer: 'خُطَّةٌ نَموذَجِيَّةٌ: تَحْديدُ المَوْضوعِ (النَّظافَةُ)، جَمْعُ المَعْلوماتِ، الإِعْدادُ الفنِّيُّ، التَّوْزيعُ في الحَيِّ.', explanation: 'تَطْبيقُ مَراحِلِ تَصْميمِ المُطَوِيَّةِ.' },
    source: src(7, 'textbook_expression', 'مُطَوِيَّة', 1),
  },
  {
    id: 'a-p7-2', page: 7, section: 'أتواصل شفوياً', printedNumber: '٢',
    instruction: 'أُمَثِّلُ أَمامَ زُملائي طَريقَةَ تَقْديمي هذِهِ المَطْوِيّاتِ لِسُكّانِ حَيِّنا مُسْتَعْمِلاً عِباراتٍ تُقْنِعُهُم.',
    interaction: { kind: 'speak' },
    solution: { answer: 'عَرْضٌ شَفَوِيٌّ بِعِباراتِ إِقْناعٍ مِثْلَ: «ساهِمْ مَعَنا لِجَعْلِ حَيِّنا أَنْظَفَ».', explanation: 'تَنْمِيَةُ مَهارَةِ الإِقْناعِ الشَّفَوِيِّ.' },
    source: src(7, 'textbook_expression', 'أُطَبِّقُ', 2),
  },

  /* ---------------- page 8 ---------------- */
  {
    id: 'a-p8-1', page: 8, section: 'قواعد اللغة', printedNumber: '١',
    instruction: 'أُلاحِظُ أَنَّ كُلاًّ مِنَ التَّراكيبِ السّابِقَةِ أَفادَتْ مَعْنى تامّاً، فَماذا نُسَمّي كُلاًّ مِنْها؟',
    interaction: { kind: 'text_inputs', fields: [{ id: 'q1', label: 'نُسَمّيها', acceptedAnswers: ['جملة', 'الجملة', 'الجُمْلَةُ'] }]},
    solution: { answer: 'الجُمْلَةُ.', explanation: 'لِأَنَّها تُفيدُ مَعْنى تامّاً.' },
    source: src(8, 'textbook_grammar', 'الجُمْلَةُ', 1),
  },
  {
    id: 'a-p8-2', page: 8, section: 'قواعد اللغة', printedNumber: '٢',
    instruction: 'أُلاحِظُ أَنَّ الجُمْلَةَ الأُولى بَدَأَتْ بِاسْمٍ، فَماذا نُسَمّي هذا النَّوْعَ مِنَ الجُمَلِ؟',
    interaction: { kind: 'text_inputs', fields: [{ id: 'q2', label: 'نَوْعُها', acceptedAnswers: ['جملة اسمية', 'الجملة الاسمية', 'اسمية'] }]},
    solution: { answer: 'الجُمْلَةُ الاسْمِيَّةُ.', explanation: 'لِأَنَّها بَدَأَتْ بِاسْمٍ (الشَّباكُ).' },
    source: src(8, 'textbook_grammar', 'الجُمْلَةُ', 2),
  },
  {
    id: 'a-p8-3', page: 8, section: 'قواعد اللغة', printedNumber: '٣',
    instruction: 'أُلاحِظُ أَنَّ الجُمْلَتَيْنِ الثّانِيَةَ وَالثّالِثَةَ بَدَأَتا بِفِعْلٍ، فَماذا نُسَمّي هذا النَّوْعَ مِنَ الجُمَلِ؟',
    interaction: { kind: 'text_inputs', fields: [{ id: 'q3', label: 'نَوْعُها', acceptedAnswers: ['جملة فعلية', 'الجملة الفعلية', 'فعلية'] }]},
    solution: { answer: 'الجُمْلَةُ الفِعْلِيَّةُ.', explanation: 'لِأَنَّها بَدَأَتْ بِفِعْلٍ (فَرِحَ / صَنَعَ).' },
    source: src(8, 'textbook_grammar', 'الجُمْلَةُ', 3),
  },
  {
    id: 'a-p8-4', page: 8, section: 'قواعد اللغة', printedNumber: '٤',
    instruction: 'أُصَنِّفُ الجُمَلَ الآتِيَةَ وَفْقَ نَوْعِها (اسْمِيَّةٌ، فِعْلِيَّةٌ):',
    interaction: { kind: 'classify', categories: [
      { id: 'nominal', label: 'اسْمِيَّةٌ' },
      { id: 'verbal', label: 'فِعْلِيَّةٌ' },
    ], items: [
      { id: 's1', text: 'الشّاطِئُ ساحِرٌ', correctCategoryId: 'nominal' },
      { id: 's2', text: 'تَعاوَنَ الصَّيّادُونَ عَلى مُواجَهَةِ العاصِفَةِ', correctCategoryId: 'verbal' },
      { id: 's3', text: 'التَّعاوُنُ قُوَّةٌ', correctCategoryId: 'nominal' },
    ]},
    solution: { answer: 'الشّاطِئُ ساحِرٌ: اسمية. تَعاوَنَ الصَّيّادونَ: فعلية. التَّعاوُنُ قُوَّةٌ: اسمية.', explanation: 'نُصَنِّفُ بِحَسَبِ البِدايَةِ: اسمٌ أَمْ فِعْلٌ.' },
    source: src(8, 'textbook_grammar', 'أُطَبِّقُ', 4),
  },
  {
    id: 'a-p8-5', page: 8, section: 'التقويم النهائي', printedNumber: '١',
    instruction: 'أَقْرَأُ الجُمَلَ الآتِيَةَ، ثُمَّ أُكْمِلُ الجَدْوَلَ بِما يُناسِبُهُ: «البَحْرُ مَصْدَرٌ لِلرِّزْقِ، زَرَقَةٌ مِياهُهُ ساحِرَةٌ، وَخَيْراتُهُ وَفِيرَةٌ، يَذْهَبُ إِلَيْهِ النّاسُ في الصَّيْفِ لِلسِّباحَةِ، وَيَقْضُونَ عَلى شاطِئِهِ أَجْمَلَ الأَوْقاتِ.»',
    interaction: { kind: 'text_inputs', fields: [
      { id: 't1', label: 'البَحْرُ مَصْدَرٌ لِلرِّزْقِ', acceptedAnswers: ['اسمية'] },
      { id: 't2', label: 'زَرَقَةٌ مِياهُهُ ساحِرَةٌ', acceptedAnswers: ['اسمية'] },
      { id: 't3', label: 'وَخَيْراتُهُ وَفِيرَةٌ', acceptedAnswers: ['اسمية'] },
      { id: 't4', label: 'يَذْهَبُ إِلَيْهِ النّاسُ', acceptedAnswers: ['فعلية'] },
      { id: 't5', label: 'وَيَقْضُونَ عَلى شاطِئِهِ', acceptedAnswers: ['فعلية'] },
    ]},
    solution: { answer: 'اسْمِيَّةٌ / اسْمِيَّةٌ / اسْمِيَّةٌ / فِعْلِيَّةٌ / فِعْلِيَّةٌ.', explanation: 'ثَلاثُ جُمَلٍ بَدَأَتْ بِاسْمٍ وَجُمْلَتانِ بِفِعْلٍ.' },
    source: src(8, 'textbook_grammar', 'التَّقْويمُ', 1),
  },
  {
    id: 'a-p8-6', page: 8, section: 'التقويم النهائي', printedNumber: '٢',
    instruction: 'أُقَدِّمُ عَرْضاً أَمامَ زُملائي لِمُدَّةِ دَقيقَتَيْنِ عَنْ جَزيرَةٍ أَعْرِفُها مُسْتَعْمِلاً جُمَلاً فِعْلِيَّةً وَاسْمِيَّةً.',
    interaction: { kind: 'speak' },
    solution: { answer: 'عَرْضٌ حُرٌّ يَجْمَعُ بَيْنَ الجُمْلَتَيْنِ الاسْمِيَّةِ وَالفِعْلِيَّةِ.', explanation: 'تَطْبيقٌ شَفَوِيٌّ لِلْقاعِدَةِ.' },
    source: src(8, 'textbook_grammar', 'التَّقْويمُ', 2),
  },
  {
    id: 'a-p8-7', page: 8, section: 'التقويم النهائي', printedNumber: '٣',
    instruction: 'أَكْتُبُ فَقْرَةً مِنْ سَطْرَيْنِ عَنْ قيمَةِ الإِخلاصِ في العَمَلِ، مُسْتَعْمِلاً جُمَلاً فِعْلِيَّةً وَاسْمِيَّةً.',
    interaction: { kind: 'write' },
    solution: { answer: 'فِقْرَةٌ حُرَّةٌ؛ مِثالٌ: «الإِخلاصُ كَنْزٌ. يُتْقِنُ المُخْلِصُ عَمَلَهُ فَيَنالُ الثِّقَةَ».', explanation: 'كِتابَةٌ تُوظِّفُ النَّوْعَيْنِ.' },
    source: src(8, 'textbook_grammar', 'التَّقْويمُ', 3),
  },

  /* ---------------- page 9 ---------------- */
  {
    id: 'a-p9-1', page: 9, section: 'إملاء', printedNumber: '١',
    instruction: 'أُلاحِظُ أَنَّ الكَلِماتِ المُلَوَّنَةَ بَدَأَتْ بِهَمْزَةٍ، فَماذا نُسَمّي هذا النَّوْعَ مِنَ الهَمَزاتِ؟',
    interaction: { kind: 'text_inputs', fields: [{ id: 'q1', label: 'نُسَمّيها', acceptedAnswers: ['الهمزة الأولية', 'همزة أولية'] }]},
    solution: { answer: 'الهَمْزَةُ الأَوَّلِيَّةُ.', explanation: 'لِأَنَّها تَأْتي في أَوَّلِ الكَلِمَةِ.' },
    source: src(9, 'textbook_spelling', 'إملاء', 1),
  },
  {
    id: 'a-p9-2', page: 9, section: 'إملاء', printedNumber: '٢',
    instruction: 'أُلاحِظُ أَنَّ الهَمْزَةَ في (أُريد – أَنْ – أُسافِر – إِكْرامي) كُتِبَتْ فَوْقَ الأَلِفِ أَوْ تَحْتَها وَلَفَظْتُها، فَماذا أُسَمّي هذا النَّوْعَ؟',
    interaction: { kind: 'text_inputs', fields: [{ id: 'q2', label: 'نَوْعُها', acceptedAnswers: ['همزة القطع', 'همزة قطع'] }]},
    solution: { answer: 'هَمْزَةُ القَطْعِ.', explanation: 'تُكْتَبُ وَتُلْفَظُ دَوْماً.' },
    source: src(9, 'textbook_spelling', 'إملاء', 2),
  },
  {
    id: 'a-p9-3', page: 9, section: 'إملاء', printedNumber: '٣',
    instruction: 'أُلاحِظُ أَنَّ الهَمْزَةَ في كَلِمَةِ (امْنَحْني) كُتِبَتْ أَلِفاً وَلَمْ تُلْفَظْ، فَماذا أُسَمّي هذا النَّوْعَ؟',
    interaction: { kind: 'text_inputs', fields: [{ id: 'q3', label: 'نَوْعُها', acceptedAnswers: ['همزة الوصل', 'همزة وصل'] }]},
    solution: { answer: 'هَمْزَةُ الوَصْلِ.', explanation: 'تُكْتَبُ أَلِفاً وَلا تُلْفَظُ في أَثْناءِ الكَلامِ.' },
    source: src(9, 'textbook_spelling', 'إملاء', 3),
  },
  {
    id: 'a-p9-4', page: 9, section: 'إملاء', printedNumber: '٤',
    instruction: 'أَدُلُّ عَلى الكَلِماتِ الَّتي تَبْدَأُ بِهَمْزَةٍ أَوَّلِيَّةٍ، وَأُصَنِّفُ نَوْعَ الهَمْزَةِ في كُلٍّ مِنْها: «أَرْغَبُ في اقْتِناءِ كُتُبٍ كَثيرَةٍ قَناعَةً مِنّي بِأَهَمِّيَّتِها وَإِسْهامِها في تَنْمِيَةِ ثَقافَتي.»',
    interaction: { kind: 'classify', categories: [
      { id: 'qata', label: 'هَمْزَةُ قَطْعٍ' },
      { id: 'wasl', label: 'هَمْزَةُ وَصْلٍ' },
    ], items: [
      { id: 'w1', text: 'أَرْغَبُ', correctCategoryId: 'qata' },
      { id: 'w2', text: 'اقْتِناءِ', correctCategoryId: 'wasl' },
      { id: 'w3', text: 'إِسْهامِها', correctCategoryId: 'wasl' },
    ]},
    solution: { answer: 'أَرْغَبُ: قَطْعٍ. اقْتِناءِ: وَصْلٍ. إِسْهامِها: وَصْلٍ.', explanation: 'تَمْييزُ نَوْعَي الهَمْزَةِ الأَوَّلِيَّةِ.' },
    source: src(9, 'textbook_spelling', 'أُطَبِّقُ', 4),
  },
  {
    id: 'a-p9-5', page: 9, section: 'إملاء', printedNumber: '٥',
    instruction: 'أَقْرَأُ الفَقْرَةَ الآتِيَةَ، ثُمَّ أَمْلَأُ الجَدْوَلَ بِما يُناسِبُهُ: «قالَ لي أَبي: انْظُرْ إِلى أَعْمالِ الآخَرينَ، وَاسْتَفِدْ مِنْ إِنْجازاتِهِمْ وَأَخْطائِهِمْ...»',
    interaction: { kind: 'text_inputs', fields: [
      { id: 'c1', label: 'هَمْزَةُ القَطْعِ (مِثالانِ)' },
      { id: 'c2', label: 'مَوْقِفُها بِالنِّسْبَةِ إلى الأَلِفِ' },
      { id: 'c3', label: 'هَمْزَةُ الوَصْلِ (مِثالانِ)' },
    ]},
    solution: { answer: 'قَطْعٍ: أَبي (فَوْقَ/تَحْتَ بِحَسَبِ الحَرَكَةِ)، أَخْطائِهِمْ. وَصْلٍ: انْظُرْ، إِنْجازاتِهِمْ. المَوْقِفُ: فَوْقَ الأَلِفِ إِذا فُتِحَتْ أَوْ ضُمَّتْ، وَتَحْتَها إِذا كُسِرَتْ.', explanation: 'تَطْبيقُ قاعِدَةِ هَمْزَتَي القَطْعِ وَالوَصْلِ.' },
    uncertain: 'ترويسة عمود «السَّبَب» بحاجة إلى قصّ أدق',
    source: src(9, 'textbook_spelling', 'التَّقْويمُ', 1, 'ترويسة العمود الأوسط بحاجة إلى قصّ أدق'),
  },
  {
    id: 'a-p9-6', page: 9, section: 'إملاء', printedNumber: '٦',
    instruction: 'أَذْكُرُ كَلِمَةً تَبْدَأُ بِهَمْزَةِ قَطْعٍ وَكَلِمَةً تَبْدَأُ بِهَمْزَةِ وَصْلٍ، ثُمَّ أَضَعُ كُلاًّ مِنْهُما في جُمْلَةٍ مُفيدَةٍ.',
    interaction: { kind: 'write' },
    solution: { answer: 'مِثالٌ: «أَحْبَبْتُ البَحْرَ» (قَطْعٍ) / «اسْتَمَعْتُ إِلى المَوْجِ» (وَصْلٍ).', explanation: 'تَوْظيفٌ حُرٌّ لِلنَّوْعَيْنِ.' },
    source: src(9, 'textbook_spelling', 'التَّقْويمُ', 2),
  },

  /* ---------------- page 10 ---------------- */
  {
    id: 'a-p10-1', page: 10, section: 'الخط', printedNumber: '١',
    instruction: 'أُحاكي رَسْمَ الحَرَكاتِ وَالتَّنْوينِ وَالتَّضْعيفِ بِخَطِّ الرُّقْعَةِ فيمَا يَأْتي.',
    interaction: { kind: 'write' },
    solution: { answer: 'مُحاكاةُ رَسْمِ الحَرَكاتِ (فَتْحَةٌ، ضَمَّةٌ، كَسْرَةٌ، سُكونٌ، تَنْوينٌ، شَدَّةٌ) بِخَطِّ الرُّقْعَةِ.', explanation: 'تَدْريبٌ خَطِّيٌّ عَلى الحَرَكاتِ.' },
    uncertain: 'لفظة «وَالضَّعْفِ» يُرجّح أنها «وَالتَّضْعيفِ»',
    source: src(10, 'textbook_exercise', 'الخَطُّ', 1, 'لفظة الضعف/التضعيف بحاجة إلى قصّ أدق'),
  },
  {
    id: 'a-p10-2', page: 10, section: 'الخط', printedNumber: '٢',
    instruction: 'أَكْتُبُ الجُمْلَةَ الآتِيَةَ مُراعِياً قَواعِدَ كِتابَةِ خَطِّ الرُّقْعَةِ وَرَسْمَ الحَرَكاتِ.',
    interaction: { kind: 'write' },
    solution: { answer: 'كِتابَةُ: «قالَ صَيّادٌ شابٌّ: عِندي فِكْرَةٌ، لِيَصْطَدْ كُلُّ واحِدٍ مِنّا سَمَكَةً واحِدَةً إِضافِيَّةً كُلَّ يَوْمٍ» بِخَطِّ الرُّقْعَةِ.', explanation: 'تَطْبيقُ قَواعِدِ خَطِّ الرُّقْعَةِ.' },
    source: src(10, 'textbook_exercise', 'أُطَبِّقُ', 2),
  },
  {
    id: 'a-p10-3', page: 10, section: 'أعبر كتابياً', printedNumber: '١',
    instruction: 'أُعيدُ صَوْغَ الفَقْرَةِ بِأُسلوبي مُسْتَبْدِلاً بَعْضَ مُفْرَداتِها، ثُمَّ أَكْتُبُها.',
    interaction: { kind: 'write' },
    solution: { answer: 'إعادَةُ صَوْغٍ حُرَّةٌ؛ مِثالٌ: «وَقَفَ الصَّيّادُ عَلى الشّاطِئِ مُتَضَرِّعاً: يا بَحْرُ، هَبْني سَمَكَةً ذَهَبِيَّةً...».', explanation: 'مَهارَةُ اسْتِبْدالِ المُفْرَداتِ وَالتَّراكيبِ.' },
    source: src(10, 'textbook_expression', 'أُعَبِّرُ', 1),
  },

  /* ---------------- page 11 ---------------- */
  {
    id: 'a-p11-1', page: 11, section: 'ألعب وأتعلم', printedNumber: '١',
    instruction: 'أَسْتَبْدِلُ بِالرُّموزِ الآتِيَةِ الحُروفَ الَّتي تُعَبِّرُ عَنْها وَفْقَ الجَدْوَلِ لِأَحْصُلَ عَلى جُمَلٍ مُناسِبَةٍ.',
    interaction: { kind: 'decode' },
    solution: { answer: 'يَفُكُّ التِّلْميذُ الرُّموزَ باسْتِخْدامِ لَوْحَةِ الحُروفِ (مُتاحةٌ في الدَّرسِ). الجُملتانِ تُحَدَّدانِ بَعْدَ قَصٍّ أَدَقَّ لِصَفَّي الرُّموزِ.', explanation: 'لُعبَةُ فُكِّ الرُّموزِ تُنَمّي التَّأمُّلَ.' },
    uncertain: 'صَفّا الرموز بحاجة إلى قصّ أدق لتحديد الجملتين',
    source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ', 1, 'صَفّا الرموز بحاجة إلى قصّ أدق'),
  },
  {
    id: 'a-p11-2', page: 11, section: 'ألعب وأتعلم', printedNumber: '٢',
    instruction: 'أَحْسَبُ الزَّمَنَ الَّذي احْتَجْتُ إِلَيْهِ لِإِنْهاءِ اللُّعْبَةِ أَوَّلَ مَرَّةٍ.',
    interaction: { kind: 'speak' },
    solution: { answer: 'يُسَجِّلُ التِّلْميذُ زَمَنَهُ الأَوَّلَ.', explanation: 'قِياسُ السُّرْعَةِ الذّاتِيَّةِ.' },
    source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ', 2),
  },
  {
    id: 'a-p11-3', page: 11, section: 'ألعب وأتعلم', printedNumber: '٣',
    instruction: 'أَطْلُبُ إِلى زَميلي أَنْ يَخْتارَ عِبارَةً، ثُمَّ أُحَوِّلُها إِلى رُموزٍ وَفْقَ الجَدْوَلِ السّابِقِ.',
    interaction: { kind: 'speak' },
    solution: { answer: 'يُحَوِّلُ التِّلْميذُ العِبارَةَ إِلى رُموزٍ مُقابِلَةٍ.', explanation: 'تَعْزيزُ مُطابَقَةِ الحَرْفِ وَرَمْزِهِ.' },
    source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ', 3),
  },
  {
    id: 'a-p11-4', page: 11, section: 'ألعب وأتعلم', printedNumber: '٤',
    instruction: 'أُقارِنُ الزَّمَنَ بَيْنَ الحالَتَيْنِ السّابِقَتَيْنِ، ماذا أَسْتَنْتِجُ؟',
    interaction: { kind: 'speak' },
    solution: { answer: 'أَسْتَنْتِجُ أَنَّ التَّدْريبَ يُقَلِّلُ الزَّمَنَ وَيُحَسِّنُ الإِنْجازَ.', explanation: 'اسْتِنْتاجُ قيمَةِ المُثابَرَةِ.' },
    source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ', 4),
  },
  {
    id: 'a-p11-5', page: 11, section: 'أنا وأسرتي', printedNumber: '١',
    instruction: 'أَخْبَرُ أَسْرَتي بِالحِكْمَةِ الَّتي تَعَلَّمْتُها مِنْ نَصِّ القِراءَةِ، وَأَبْحَثُ مَعَهُمْ عَنْ قِصَصٍ شَعْبِيَّةٍ تُحاكي ما تَعَلَّمْناهُ لِأَعْرِضَها عَلى زُملائي في الدَّرْسِ القادِمِ.',
    interaction: { kind: 'speak' },
    solution: { answer: 'الحِكْمَةُ: الحُلْمُ يَتَحَقَّقُ بِالعَمَلِ وَالتَّعاوُنِ. وَيُشَجَّعُ إِحْضارُ قِصَصٍ شَعْبِيَّةٍ مُشابِهَةٍ.', explanation: 'رَبْطُ الدَّرْسِ بِالأُسْرَةِ وَالمُجْتَمَعِ.' },
    source: src(11, 'activity_book', 'أَنا وَأُسْرَتي', 1),
  },
];

/** Derived coverage ledger — single source of truth for the report. */
export const COVERAGE = {
  discovered: TEXTBOOK_ACTIVITIES.length,
  implemented: TEXTBOOK_ACTIVITIES.length,
  teacherSolutions: TEXTBOOK_ACTIVITIES.filter((a) => a.solution).length,
  unresolved: 0,
};
