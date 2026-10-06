import { LessonStep } from '../../types/curriculum';
import { src } from './sourceMeta';

/**
 * Lesson 1 «السَّمَكَةُ الذَّهَبِيَّةُ» — step & block content.
 *
 * CONTENT BLOCK MODEL (kept local to the lesson layer so the foundation stays generic).
 * Every block that derives from the textbook carries an exact SourceReference.
 * Platform-added explanation is ALWAYS rendered under a clearly separated
 * «شرح تفاعلي» heading, distinct from «النص الأصلي من الكتاب».
 */

export interface VocabItem {
  term: string;
  meaning: string;
}

export type LessonBlock =
  | { kind: 'source_passage'; heading: string; paragraphs: string[]; source: ReturnType<typeof src> }
  | { kind: 'source_sentences'; heading: string; sentences: string[]; source: ReturnType<typeof src> }
  | { kind: 'vocab'; heading: string; items: VocabItem[]; source: ReturnType<typeof src> }
  | { kind: 'rule'; heading: string; lines: string[]; source: ReturnType<typeof src> }
  | { kind: 'instruction'; heading: string; text: string; source: ReturnType<typeof src> }
  | { kind: 'activity'; activityId: string }
  | { kind: 'explanation'; heading: string; lines: string[] };

export interface StepContent {
  stepId: string;
  blocks: LessonBlock[];
}

/* ------------------------------------------------------------------ */
/* Steps (derived from the actual textbook structure, pages 4–11)      */
/* ------------------------------------------------------------------ */

export const LESSON1_STEPS: LessonStep[] = [
  { id: 'l1-s1', stepNumber: 1, title: 'أستكشفُ الصُّورتَيْنِ', type: 'introduction', source: src(4, 'textbook_exercise', 'أَتَأَمَّلُ الصُّورَتَيْنِ', 1) },
  { id: 'l1-s2', stepNumber: 2, title: 'أَسْتَمِعُ وَأَتَحَدَّثُ', type: 'guided_exploration', source: src(4, 'textbook_reading', 'أَسْتَمِعُ إلى النَّصِّ', 1) },
  { id: 'l1-s3', stepNumber: 3, title: 'أَقْرَأُ النَّصَّ', type: 'reading_passage', source: src(5, 'textbook_reading', 'أَقْرَأُ') },
  { id: 'l1-s4', stepNumber: 4, title: 'الفَهْمُ القِرائِيُّ', type: 'interactive_practice', source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ') },
  { id: 'l1-s5', stepNumber: 5, title: 'أُتَواصَلُ شَفَوِيّاً', type: 'interactive_practice', source: src(7, 'textbook_expression', 'تَصْميمُ مُطَوِيَّةٍ') },
  { id: 'l1-s6', stepNumber: 6, title: 'قَواعِدُ اللُّغَةِ: الجُمْلَةُ', type: 'rule_formulation', source: src(8, 'textbook_grammar', 'الجُمْلَةُ') },
  { id: 'l1-s7', stepNumber: 7, title: 'إملاء: الهَمْزَةُ الأَوَّلِيَّةُ', type: 'rule_formulation', source: src(9, 'textbook_spelling', 'الهَمْزَةُ الأَوَّلِيَّةُ') },
  { id: 'l1-s8', stepNumber: 8, title: 'الخَطُّ: الحَرَكاتُ', type: 'interactive_practice', source: src(10, 'textbook_exercise', 'الخَطُّ') },
  { id: 'l1-s9', stepNumber: 9, title: 'أُعَبِّرُ كِتابِيّاً', type: 'interactive_practice', source: src(10, 'textbook_expression', 'اسْتِبْدالُ المُفْرَداتِ') },
  { id: 'l1-s10', stepNumber: 10, title: 'أَلْعَبُ وَأَتَعَلَّمُ', type: 'summary', source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ') },
];

/* ------------------------------------------------------------------ */
/* Verbatim source text                                                */
/* ------------------------------------------------------------------ */

export const READING_SECTION_1 = [
  'عَلى الشّاطِئِ يَعيشُ صَيّادٌ فَقيرٌ، يَذْهَبُ كُلَّ يَوْمٍ إلى البَحْرِ وَيَصْطادُ بَعْضَ سَمَكاتٍ، ثُمَّ يَبيعُها بِدَراهِمَ قَليلَةٍ. وَلكِنَّهُ ما زالَ يَحْلُمُ بِاصْطِيادِ سَمَكَةٍ ذَهَبِيَّةٍ لِيَشْتَرِيَ بِثَمَنِها زَوْرَقاً لِلصَّيْدِ.',
  'كانَ الصَّيّادُ يَقِفُ أَمامَ البَحْرِ وَيُخاطِبُهُ قائِلاً: يا صَديقي البَحْرَ، امْنَحْني - وَلَوْ مَرَّةً واحِدَةً - سَمَكَةً ذَهَبِيَّةً، فَعِنْدي خَمْسَةُ أَوْلادٍ وَزَوْجَةٌ يَحْتاجونَ إلى طَعامٍ كَثيرٍ وَثِيابٍ جَديدَةٍ... سَأَشْتَري بِثَمَنِ السَّمَكَةِ الذَّهَبِيَّةِ زَوْرَقاً لِلصَّيْدِ... لَقَدْ مَلِلْتُ الوُقوفَ كُلَّ يَوْمٍ... أُريدُ أَنْ أُسافِرَ عَلى أَمْواجِكَ بَعيداً لِأَحْصُلَ عَلى سَمَكٍ وَفيرٍ.',
  'ذاتَ يَوْمٍ قالَ البَحْرُ لِلصَّيّادِ: لَيْسَ في مِياهي سَمَكٌ ذَهَبِيٌّ، لَكِنّي سَأُعْطيكَ واحِدَةً كَبيرَةً.',
  'الصَّيّادُ: كَيْفَ؟ أَيْنَ هِيَ؟... إِلَى أَيْنَ ذَهَبَتْ؟... حينَ كُنْتُ صَغيراً أَعْطَيْتُ أَحَدَ الصَّيّادينَ سَمَكَةً ذَهَبِيَّةً كَبيرَةً.',
  'البَحْرُ (ضاحِكاً): وَهَلْ صَدَّقْتَ؟!',
  'إِنَّها حِكايَةٌ رَواها الصَّيّادُ لِيَتَعَلَّمَ مِنْها زُمَلاؤُهُ وَيَسْتَفيدوا مِنْ مَغْزاها.',
  'حَزِنَ الصَّيّادُ وَفَقَدَ الأَمَلَ وَقالَ (بائِساً): إِنّي سَأَبْقى صَيّاداً فَقيراً.',
  'البَحْرُ: لا تَحْزَنْ. وَبَدَلاً مِنْ أَنْ تَحْلُمَ بِالسَّمَكَةِ الذَّهَبِيَّةِ وَالزَّرَقِ، تَعاوَنْ أَنْتَ وَزُمَلاؤُكَ عَلى صُنْعِ مَرْكَبٍ لِلصَّيْدِ لَعَلَّ أُمورَكُمْ تَتَغَيَّرُ.',
];

export const READING_SECTION_2 = [
  'ذَهَبَ الصَّيّادُ إِلى زُمِلائِهِ وَقالَ: قَدْ عَرَفْتُ طَريقَةً يَسْتَطيعُ بِها كُلُّ صَيّادٍ أَنْ يَحْصُلَ عَلى سَمَكَةٍ ذَهَبِيَّةٍ.',
  'الصَّيّادونَ: وَكَيْفَ ذلِكَ؟',
  'الصَّيّادُ: نَتَعاوَنُ جَميعاً وَنَبْني مَرْكَباً لِلصَّيْدِ يَكونُ مِلْكاً لِلْجَميعِ.',
  'الصَّيّادونَ: يا لَها مِنْ فِكْرَةٍ!... لكِنَّنا فُقَراءُ! لا يَمْلِكُ أَحَدُنا شَيْئاً نَبْني بِهِ المَرْكَبَ.',
  'صَمَتَ الجَميعُ، وَفَجْأَةً نَهَضَ صَيّادٌ شابٌّ وَقالَ: عِنْدي فِكْرَةٌ... يَصْطادُ كُلُّ واحِدٍ مِنّا سَمَكَةً إِضافِيَّةً كُلَّ يَوْمٍ، نَجْمَعُ ثَمَنَها وَنَبْدَأُ بِصُنْعِ المَرْكَبِ. وَوافَقَ الجَميعُ وَبَدَؤوا العَمَلَ بِفِكْرَتِهِ وَلَمْ يَتَكاسَلْ أَحَدٌ في اصْطِيادِ السَّمَكَةِ الإِضافِيَّةِ.',
  'وَبَعْدَ فَتْرَةٍ تَوَفَّرَ المالُ مَعَهُمْ، وَتَعاوَنوا عَلى صُنْعِ المَرْكَبِ، ثُمَّ جَهَّزوهُ بِالشِّباكِ القَوِيَّةِ وَالمَعَدّاتِ وَأَنْزَلوهُ إِلى الماءِ، وَأَطْلَقوا عَلَيْهِ اسْمَ مَرْكَزِ السَّمَكَةِ الذَّهَبِيَّةِ.',
  'وَقَفَ الصَّيّادُ مُخاطِباً البَحْرَ: انْظُرْ أَيُّها البَحْرُ، لَقَدْ صارَ لِكُلِّ صَيّادٍ مِنّا سَمَكَتُهُ الذَّهَبِيَّةُ.',
  'خَفَقَ البَحْرُ بِمَوْجِهِ وَراحَ يَسْتَمِعُ إِلى أَغاني الصَّيّادينَ الجَميلَةِ.',
];

export const READING_AUTHOR = 'وليد معماري (بتصرف)';

/** Vocabulary box exactly as printed on page 5 (single entry). */
export const LESSON1_VOCAB: VocabItem[] = [
  { term: 'المَغْزى', meaning: 'المَقْصَدُ' },
];

export const GRAMMAR_RULE_LINES = [
  'الجُمْلَةُ: تَرْكِيبٌ يُفيدُ مَعْنى تامّاً، وَالْجُمْلَةُ نَوْعانِ: (اسْمِيَّةٌ وَفِعْلِيَّةٌ)',
  'الجُمْلَةُ الَّتي تَبْدَأُ بِاسْمٍ تُسَمّى الجُمْلَةَ الاسْمِيَّةَ،',
  'وَالْجُمْلَةُ الَّتي تَبْدَأُ بِفِعْلٍ تُسَمّى الجُمْلَةَ الفِعْلِيَّةَ.',
];

export const SPELLING_RULE_LINES = [
  'تُسَمَّى الهَمْزَةُ الَّتي تَأْتي في أَوَّلِ الكَلِمَةِ هَمْزَةً أَوَّلِيَّةً، وَهِيَ نَوْعانِ:',
  '١. هَمْزَةُ القَطْعِ: تُكْتَبُ وَتُلْفَظُ، وَتَأْتي فَوْقَ الأَلِفِ إِذا كانَتْ مَفْتوحَةً أَوْ مَضْمومَةً، وَتَأْتي تَحْتَ الأَلِفِ إِذا كانَتْ مَكْسورَةً.',
  '٢. هَمْزَةُ الوَصْلِ: تُكْتَبُ أَلِفاً وَتُلْفَظُ في أَوَّلِ الكَلامِ، وَلا تُلْفَظُ في أَثْنائِهِ.',
];

export const PAMPHLET_STAGES = [
  '١. تَحْديدُ مَوْضوعِ المُطَوِيَّةِ.',
  '٢. جَمْعُ المَعْلوماتِ الواجِبِ تَوَفُّرُها في المُطَوِيَّةِ.',
  '٣. الإِعْدادُ الفنِّيُّ لِلمُطَوِيَّةِ (رُسوم - أَلْوان - خَطّ).',
  '٤. الإِخْراجُ النِّهائِيُّ لِلْمُطَوِيَّةِ (ضَبْطٌ لُغَوِيٌّ - الشَّكْلُ العامُّ وَمُناسَبَتُهُ لِمَوْضوعِ المُطَوِيَّةِ).',
];

export const CALLIGRAPHY_SENTENCE =
  'قالَ صَيّادٌ شابٌّ: عِندي فِكْرَةٌ، لِيَصْطَدْ كُلُّ واحِدٍ مِنّا سَمَكَةً واحِدَةً إِضافِيَّةً كُلَّ يَوْمٍ';

export const EXPRESSION_PARAGRAPH = [
  'كانَ الصَّيّادُ يَقِفُ إِلى شاطِئِ البَحْرِ، وَيُخاطِبُهُ قائِلاً: يا صَديقي البَحْرَ، امْنَحْني وَلَوْ مَرَّةً واحِدَةً سَمَكَةً ذَهَبِيَّةً، عِنْدي خَمْسَةُ أَوْلادٍ وَزَوْجَةٌ يَحْتاجونَ إِلى طَعامٍ كَثيرٍ وَثِيابٍ جَديدَةٍ، سَأَشْتَري بِثَمَنِ السَّمَكَةِ الذَّهَبِيَّةِ زَوْرَقاً لِلصَّيْدِ، لَقَدْ مَلِلْتُ الوُقوفَ عَلى الشّاطِئِ كُلَّ يَوْمٍ، أُريدُ أَنْ أُسافِرَ عَلى أَمْواجِكَ بَعيداً لِأَحْصُلَ عَلى سَمَكٍ وَفيرٍ.',
];

/** p11 letter↔shape key (shape label -> letter), exactly as printed on the board. */
export const DECODE_KEY: { letter: string; shape: string }[] = [
  { letter: 'أ', shape: 'مُربَّع أزرق' },
  { letter: 'ب', shape: 'دائرة صفراء' },
  { letter: 'ج', shape: 'مُسدَّس وردي' },
  { letter: 'د', shape: 'نجمة خضراء' },
  { letter: 'هـ', shape: 'مثلث وردي' },
  { letter: 'و', shape: 'قلب بنفسجي' },
  { letter: 'ز', shape: 'مُعيَّن بنفسجي' },
  { letter: 'ح', shape: 'مستطيل أحمر' },
  { letter: 'ط', shape: 'قطع ناقدي وردي' },
  { letter: 'ي', shape: 'حرف V بنفسجي' },
  { letter: 'ك', shape: 'شبه منحرف بنفسجي' },
  { letter: 'ل', shape: 'هلال وردي' },
  { letter: 'م', shape: 'مربّع أحمر' },
  { letter: 'ن', shape: 'شكل X بنفسجي' },
  { letter: 'س', shape: 'نصف دائرة وردي' },
  { letter: 'ع', shape: 'حلقة وردية' },
  { letter: 'ف', shape: 'متوازي أضلاع أخضر' },
  { letter: 'ص', shape: 'مستطيل مخطط وردي' },
  { letter: 'ق', shape: 'سهم أصفر' },
  { letter: 'ر', shape: 'علامة قسمة زرقاء' },
  { letter: 'ش', shape: 'هلال أزرق' },
  { letter: 'ت', shape: 'زهرة صفراء' },
  { letter: 'ث', shape: 'نجمة وردية' },
  { letter: 'خ', shape: 'قارب أخضر' },
  { letter: 'ذ', shape: 'معيّن وردي' },
  { letter: 'ض', shape: 'سهم أرجواني' },
  { letter: 'غ', shape: 'مثلث بنفسجي' },
  { letter: 'ظ', shape: 'ثماني أحمر' },
  { letter: 'ئ', shape: 'شبه منحرف بنفسجي' },
  { letter: 'ة', shape: 'شبه منحرف رمادي' },
];

/* ------------------------------------------------------------------ */
/* Step content map                                                    */
/* ------------------------------------------------------------------ */

export const LESSON1_STEP_CONTENT: Record<string, StepContent> = {
  'l1-s1': {
    stepId: 'l1-s1',
    blocks: [
      {
        kind: 'instruction',
        heading: 'أَتَأَمَّلُ الصُّورَتَيْنِ الآتِيَتَيْنِ، ثُمَّ أُنَفِّذُ الأَنْشِطَةَ:',
        text: 'أَتَأَمَّلُ الصُّورَتَيْنِ الآتِيَتَيْنِ، ثُمَّ أُنَفِّذُ الأَنْشِطَةَ:',
        source: src(4, 'textbook_exercise', 'الصُّورتان', 1),
      },
      { kind: 'activity', activityId: 'a-p4-1' },
      { kind: 'activity', activityId: 'a-p4-2' },
    ],
  },
  'l1-s2': {
    stepId: 'l1-s2',
    blocks: [
      {
        kind: 'instruction',
        heading: 'أَسْتَمِعُ إلى النَّصِّ مُتَجَنِّباً المُشَتِّتاتِ، ثُمَّ أُنَفِّذُ النَّشاطَ:',
        text: 'أَسْتَمِعُ إلى النَّصِّ مُتَجَنِّباً المُشَتِّتاتِ، ثُمَّ أُنَفِّذُ النَّشاطَ:',
        source: src(4, 'textbook_reading', 'أَسْتَمِعُ', 1),
      },
      { kind: 'activity', activityId: 'a-p4-3' },
      { kind: 'activity', activityId: 'a-p4-4' },
      { kind: 'activity', activityId: 'a-p4-5' },
    ],
  },
  'l1-s3': {
    stepId: 'l1-s3',
    blocks: [
      { kind: 'source_passage', heading: 'النص الأصلي من الكتاب — المقطع ١', paragraphs: READING_SECTION_1, source: src(5, 'textbook_reading', 'أَقْرَأُ ١') },
      { kind: 'source_passage', heading: 'النص الأصلي من الكتاب — المقطع ٢', paragraphs: READING_SECTION_2, source: src(5, 'textbook_reading', 'أَقْرَأُ ٢') },
      { kind: 'explanation', heading: 'ملاحظة المصدر', lines: [`الكاتب: ${READING_AUTHOR}`] },
      { kind: 'vocab', heading: 'معجم الكلمات', items: LESSON1_VOCAB, source: src(5, 'textbook_reading', 'معجم الكلمات') },
      { kind: 'activity', activityId: 'a-p5-1' },
      { kind: 'activity', activityId: 'a-p5-2' },
      { kind: 'activity', activityId: 'a-p5-3' },
    ],
  },
  'l1-s4': {
    stepId: 'l1-s4',
    blocks: [
      { kind: 'instruction', heading: 'الفَهْمُ القِرائِيُّ', text: 'أَقْرَأُ النَّصَّ قِراءَةً صامِتَةً، ثُمَّ أُنَفِّذُ النَّشاطَ:', source: src(6, 'textbook_exercise', 'الفَهْمُ القِرائِيُّ') },
      { kind: 'activity', activityId: 'a-p6-1' },
      { kind: 'activity', activityId: 'a-p6-2' },
      { kind: 'activity', activityId: 'a-p6-3' },
      { kind: 'activity', activityId: 'a-p6-4' },
      { kind: 'activity', activityId: 'a-p6-5' },
      { kind: 'activity', activityId: 'a-p6-6' },
      { kind: 'activity', activityId: 'a-p6-7' },
      { kind: 'activity', activityId: 'a-p6-8' },
    ],
  },
  'l1-s5': {
    stepId: 'l1-s5',
    blocks: [
      { kind: 'instruction', heading: 'أُتَواصَلُ شَفَوِيّاً: تَصْميمُ مُطَوِيَّةٍ', text: 'أَتَأَمَّلُ الصُّوَرَ السّابِقَةَ، ثُمَّ أُحاوِرُ زُملائي لِنَتَّفِقَ عَلى خُطَّةِ عَمَلٍ لِتَصْميمِ مُطَوِيَّةٍ حَوْلَ المَوْضوعِ ذاتِهِ، وَتَوْزيعِ هذِهِ المَطْوِيّاتِ في حَيِّنا.', source: src(7, 'textbook_expression', 'مُطَوِيَّة') },
      { kind: 'source_sentences', heading: 'أَتَعَلَّمُ: مَراحِلُ تَصْميمِ المُطَوِيَّةِ (الإِعْلانِ)', sentences: PAMPHLET_STAGES, source: src(7, 'textbook_expression', 'أَتَعَلَّمُ') },
      { kind: 'activity', activityId: 'a-p7-1' },
      { kind: 'activity', activityId: 'a-p7-2' },
    ],
  },
  'l1-s6': {
    stepId: 'l1-s6',
    blocks: [
      { kind: 'instruction', heading: 'قَواعِدُ اللُّغَةِ: الجُمْلَةُ', text: 'أَقْرَأُ الأَمْثِلَةَ الآتِيَةَ، ثُمَّ أُنَفِّذُ الأَنْشِطَةَ:', source: src(7, 'textbook_grammar', 'الجُمْلَةُ') },
      { kind: 'source_sentences', heading: 'الأَمْثِلَةُ', sentences: ['الشَّباكُ قَوِيَّةٌ.', 'فَرِحَ الصَّيّادُ.', 'صَنَعَ العُمّالُ مَرْكَباً.'], source: src(7, 'textbook_grammar', 'الأَمْثِلَةُ') },
      { kind: 'activity', activityId: 'a-p8-1' },
      { kind: 'activity', activityId: 'a-p8-2' },
      { kind: 'activity', activityId: 'a-p8-3' },
      { kind: 'rule', heading: 'القاعِدَةُ', lines: GRAMMAR_RULE_LINES, source: src(8, 'textbook_grammar', 'القاعِدَةُ') },
      { kind: 'activity', activityId: 'a-p8-4' },
      { kind: 'activity', activityId: 'a-p8-5' },
      { kind: 'activity', activityId: 'a-p8-6' },
      { kind: 'activity', activityId: 'a-p8-7' },
    ],
  },
  'l1-s7': {
    stepId: 'l1-s7',
    blocks: [
      { kind: 'instruction', heading: 'إملاء: الهَمْزَةُ الأَوَّلِيَّةُ', text: 'أَقْرَأُ المِثالَيْنِ الآتِيَيْنِ، ثُمَّ أُنَفِّذُ الأَنْشِطَةَ:', source: src(9, 'textbook_spelling', 'الهَمْزَةُ الأَوَّلِيَّةُ') },
      { kind: 'source_sentences', heading: 'المِثالانِ', sentences: ['أُريدُ أَنْ أُسافِرَ عَلى أَمْواجِكَ راجِياً إِكْرامي بِصَيْدٍ وَفيرٍ.', 'يا صَديقي البَحْرَ، تَكَرَّمْ وَامْنَحْني سَمَكَةً ذَهَبِيَّةً.'], source: src(9, 'textbook_spelling', 'المِثالانِ') },
      { kind: 'activity', activityId: 'a-p9-1' },
      { kind: 'activity', activityId: 'a-p9-2' },
      { kind: 'activity', activityId: 'a-p9-3' },
      { kind: 'rule', heading: 'أَسْتَنْتِجُ', lines: SPELLING_RULE_LINES, source: src(9, 'textbook_spelling', 'أَسْتَنْتِجُ') },
      { kind: 'activity', activityId: 'a-p9-4' },
      { kind: 'activity', activityId: 'a-p9-5' },
      { kind: 'activity', activityId: 'a-p9-6' },
    ],
  },
  'l1-s8': {
    stepId: 'l1-s8',
    blocks: [
      { kind: 'instruction', heading: 'الخَطُّ: الحَرَكاتُ', text: 'أُلاحِظُ: (حَرَكاتُ الضَّبْطِ) في الجُمْلَةِ الآتِيَةِ: تَتَعاوَنُ جَميعاً وَنَبْني مَرْكَباً لِلصَّيْدِ يَكُونُ مِلْكاً لِلْجَميعِ.', source: src(10, 'textbook_exercise', 'الخَطُّ') },
      { kind: 'activity', activityId: 'a-p10-1' },
      { kind: 'activity', activityId: 'a-p10-2' },
    ],
  },
  'l1-s9': {
    stepId: 'l1-s9',
    blocks: [
      { kind: 'instruction', heading: 'أُعَبِّرُ كِتابِيّاً: اسْتِبْدالُ المُفْرَداتِ وَالتَّراكيبِ', text: 'أُعيدُ صَوْغَ الفَقْرَةِ الآتِيَةِ بِأُسلوبي، مُسْتَبْدِلاً بَعْضَ مُفْرَداتِ النَّصِّ مُفْرَداتٍ مِنْ ذاكِرَتي لِيُصْبِحَ النَّصُّ أَجْمَلَ في رَأْيي، ثُمَّ أَكْتُبُهُ:', source: src(10, 'textbook_expression', 'اسْتِبْدالُ المُفْرَداتِ') },
      { kind: 'source_passage', heading: 'النص الأصلي من الكتاب', paragraphs: EXPRESSION_PARAGRAPH, source: src(10, 'textbook_expression', 'الفَقْرَةُ') },
      { kind: 'activity', activityId: 'a-p10-3' },
    ],
  },
  'l1-s10': {
    stepId: 'l1-s10',
    blocks: [
      { kind: 'instruction', heading: 'أَلْعَبُ وَأَتَعَلَّمُ', text: 'أَسْتَبْدِلُ بِالرُّموزِ الآتِيَةِ الحُروفَ الَّتي تُعَبِّرُ عَنْها وَفْقَ الجَدْوَلِ لِأَحْصُلَ عَلى جُمَلٍ مُناسِبَةٍ:', source: src(11, 'activity_book', 'أَلْعَبُ وَأَتَعَلَّمُ', 1, 'صفّا الرموز بحاجة إلى قصّ أدق لفكّ الشيفرة') },
      { kind: 'activity', activityId: 'a-p11-1' },
      { kind: 'activity', activityId: 'a-p11-2' },
      { kind: 'activity', activityId: 'a-p11-3' },
      { kind: 'activity', activityId: 'a-p11-4' },
      { kind: 'activity', activityId: 'a-p11-5' },
    ],
  },
};
