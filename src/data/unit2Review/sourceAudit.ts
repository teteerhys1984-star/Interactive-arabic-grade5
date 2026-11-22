import { SourceReference } from '../../types/curriculum';
import { UNIT2_REVIEW_EXCLUSIONS, u2rSrc } from './sourceMeta';

/**
 * «تقويم الوحدة الثانية» — printed source audit (pages 69–70).
 *
 * ONE record per printed element: one for every numbered question stem and one
 * for every printed branch under it. That is 7 question records + 12 branch
 * records = 19 records, matching the printed page exactly.
 *
 * Two questions (٢ and ٤ on page 69) are recorded here as `excluded`: their
 * printed text stays documented, while their student element is intentionally
 * absent. Nothing is inferred from the page, and no printed region was filled
 * in from context.
 *
 * Un-numbered printed elements (the timing activity with the two alarm clocks on
 * page 69, and the two reflective closing lines on page 70) are NOT counted as
 * records: they are documented in docs/coverage/unit2-review-coverage.md.
 */

export type Unit2ReviewRecordKind = 'question' | 'branch';
export type Unit2ReviewRecordStatus = 'implemented' | 'excluded';

export interface Unit2ReviewSourceRecord {
  /** Stable audit id, e.g. `U2R-69-Q1-A`. */
  id: string;
  /** Printed textbook page. */
  page: number;
  /** Printed question number (١…٧ across the two pages). */
  printedNumber: number;
  kind: Unit2ReviewRecordKind;
  /** Short printed designation used by the platform («السؤال ١»، «الفرع ١-أ»). */
  label: string;
  /** Verbatim printed text: the instruction for a stem, the printed item for a branch. */
  text: string;
  source: SourceReference;
  status: Unit2ReviewRecordStatus;
  /** Present only for `excluded` records. */
  exclusionReason?: string;
}

const exclusionReason = (printedNumber: number): string =>
  UNIT2_REVIEW_EXCLUSIONS.find((entry) => entry.printedNumber === printedNumber)?.reason ??
  'خارج نطاق التنفيذ الحالي بقرار المالك.';

export const UNIT2_REVIEW_SOURCE_RECORDS: Unit2ReviewSourceRecord[] = [
  /* ------------------------------ page 69 ------------------------------ */
  {
    id: 'U2R-69-Q1',
    page: 69,
    printedNumber: 1,
    kind: 'question',
    label: 'السؤال ١',
    text:
      'أُمَيِّزُ الْعِبَارَةَ الصَّحِيحَةَ مِنْ غَيْرِ الصَّحِيحَةِ فِي كُلِّ مِمَّا يَأْتِي، وَأُصَحِّحُ الْخَطَأَ:',
    source: u2rSrc(69, 'textbook_exercise', 'تقويم الوحدة — السؤال ١', 1),
    status: 'implemented',
  },
  {
    id: 'U2R-69-Q1-A',
    page: 69,
    printedNumber: 1,
    kind: 'branch',
    label: 'الفرع ١-أ',
    text: 'التَّاءُ الْمَبْسُوطَةُ هِيَ الَّتِي لَا يَتَغَيَّرُ لَفْظُهَا عِنْدَ الْوَقْفِ عَلَيْهَا.',
    source: u2rSrc(69, 'textbook_exercise', 'تقويم الوحدة — السؤال ١', 'أ'),
    status: 'implemented',
  },
  {
    id: 'U2R-69-Q1-B',
    page: 69,
    printedNumber: 1,
    kind: 'branch',
    label: 'الفرع ١-ب',
    text: 'لَتَحْوِيلِ الْجُمْلَةِ الْفِعْلِيَّةِ إِلَى جُمْلَةٍ اسْمِيَّةٍ تُقَدِّمُ الْفَاعِلَ عَلَى الْفِعْلِ.',
    source: u2rSrc(69, 'textbook_exercise', 'تقويم الوحدة — السؤال ١', 'ب'),
    status: 'implemented',
  },
  {
    id: 'U2R-69-Q1-C',
    page: 69,
    printedNumber: 1,
    kind: 'branch',
    label: 'الفرع ١-ج',
    text: 'مِنْ مَوَاضِعِ كِتَابَةِ التَّاءِ الْمَبْسُوطَةِ فِي الْأَسْمَاءِ: الِاسْمُ الثُّلَاثِيُّ السَّاكِنُ الْوَسَطِ.',
    source: u2rSrc(69, 'textbook_exercise', 'تقويم الوحدة — السؤال ١', 'ج'),
    status: 'implemented',
  },
  {
    id: 'U2R-69-Q1-D',
    page: 69,
    printedNumber: 1,
    kind: 'branch',
    label: 'الفرع ١-د',
    text: 'الْفِعْلُ الْمَاضِي فِعْلٌ مَبْنِيٌّ دَائِمًا.',
    source: u2rSrc(69, 'textbook_exercise', 'تقويم الوحدة — السؤال ١', 'د'),
    status: 'implemented',
  },
  {
    id: 'U2R-69-Q2',
    page: 69,
    printedNumber: 2,
    kind: 'question',
    label: 'السؤال ٢',
    text: 'أَضْبِطُ أَوَاخِرَ كَلِمَاتِ الْجُمْلَةِ الْآتِيَةِ بِالْحَرَكَةِ الْمُنَاسِبَةِ:',
    source: u2rSrc(69, 'textbook_grammar', 'تقويم الوحدة — السؤال ٢', 2),
    status: 'excluded',
    exclusionReason: exclusionReason(2),
  },
  {
    id: 'U2R-69-Q2-A',
    page: 69,
    printedNumber: 2,
    kind: 'branch',
    label: 'الفرع ٢-أ',
    text: 'الْعَلَمُ مَرْفُوعٌ فِي سَمَاءِ الْوَطَنِ.',
    source: u2rSrc(69, 'textbook_grammar', 'تقويم الوحدة — السؤال ٢', 'أ'),
    status: 'excluded',
    exclusionReason: exclusionReason(2),
  },
  {
    id: 'U2R-69-Q3',
    page: 69,
    printedNumber: 3,
    kind: 'question',
    label: 'السؤال ٣',
    text: 'أُكْمِلُ الْجُمْلَةَ بِالْخَبَرِ الْمُنَاسِبِ فِي كُلِّ مِمَّا يَأْتِي:',
    source: u2rSrc(69, 'textbook_grammar', 'تقويم الوحدة — السؤال ٣', 3),
    status: 'implemented',
  },
  {
    id: 'U2R-69-Q3-A',
    page: 69,
    printedNumber: 3,
    kind: 'branch',
    label: 'الفرع ٣-أ',
    text: 'الصَّفُّ',
    source: u2rSrc(69, 'textbook_grammar', 'تقويم الوحدة — السؤال ٣', 'أ'),
    status: 'implemented',
  },
  {
    id: 'U2R-69-Q3-B',
    page: 69,
    printedNumber: 3,
    kind: 'branch',
    label: 'الفرع ٣-ب',
    text: 'الْمَلْعَبُ',
    source: u2rSrc(69, 'textbook_grammar', 'تقويم الوحدة — السؤال ٣', 'ب'),
    status: 'implemented',
  },
  {
    id: 'U2R-69-Q3-C',
    page: 69,
    printedNumber: 3,
    kind: 'branch',
    label: 'الفرع ٣-ج',
    text: 'السِّبَاحَةُ',
    source: u2rSrc(69, 'textbook_grammar', 'تقويم الوحدة — السؤال ٣', 'ج'),
    status: 'implemented',
  },
  {
    id: 'U2R-69-Q4',
    page: 69,
    printedNumber: 4,
    kind: 'question',
    label: 'السؤال ٤',
    text: 'أُكْمِلُ الْجَدْوَلَ الْآتِي بِمَا يُنَاسِبُهُ:',
    source: u2rSrc(69, 'textbook_grammar', 'تقويم الوحدة — السؤال ٤', 4),
    status: 'excluded',
    exclusionReason: exclusionReason(4),
  },
  {
    id: 'U2R-69-Q4-A',
    page: 69,
    printedNumber: 4,
    kind: 'branch',
    label: 'الفرع ٤-أ',
    text: 'الْكَلِمَةُ / الِاصْطِنَاعِيُّ / تَقْلِيدِيٌّ / أَمَامَ — صفّ «ضِدُّهَا» وثلاث خلايا فارغة',
    source: u2rSrc(69, 'textbook_grammar', 'تقويم الوحدة — السؤال ٤', 'أ'),
    status: 'excluded',
    exclusionReason: exclusionReason(4),
  },

  /* ------------------------------ page 70 ------------------------------ */
  {
    id: 'U2R-70-Q5',
    page: 70,
    printedNumber: 5,
    kind: 'question',
    label: 'السؤال ٥',
    text:
      'أَكْتُبُ حِوَارًا بَيْنَ شَخْصِيَّتَيِ الصُّورَةِ الْآتِيَةِ مُسْتَعْمِلًا جُمَلًا اسْمِيَّةً وَجُمَلًا فِعْلِيَّةً فِعْلُهَا مَاضٍ مَبْنِيٌّ عَلَى الْفَتْحِ بِالْحَالَاتِ الَّتِي تَعَلَّمْتُهَا:',
    source: u2rSrc(70, 'textbook_expression', 'تقويم الوحدة — السؤال ٥', 5),
    status: 'implemented',
  },
  {
    id: 'U2R-70-Q5-A',
    page: 70,
    printedNumber: 5,
    kind: 'branch',
    label: 'الفرع ٥-أ',
    text: 'حِوَارٌ بَيْنَ شَخْصِيَّتَيْنِ: فُقَّاعَةٌ زَرْقَاءُ (ثلاثة أسطر) وفُقَّاعَةٌ خَضْرَاءُ (ثلاثة أسطر)',
    source: u2rSrc(70, 'textbook_expression', 'تقويم الوحدة — السؤال ٥', 'أ'),
    status: 'implemented',
  },
  {
    id: 'U2R-70-Q6',
    page: 70,
    printedNumber: 6,
    kind: 'question',
    label: 'السؤال ٦',
    text: 'أَحْوِّلُ الْجُمْلَةَ الْفِعْلِيَّةَ الْآتِيَةَ إِلَى جُمْلَةٍ اسْمِيَّةٍ:',
    source: u2rSrc(70, 'textbook_grammar', 'تقويم الوحدة — السؤال ٦', 6),
    status: 'implemented',
  },
  {
    id: 'U2R-70-Q6-A',
    page: 70,
    printedNumber: 6,
    kind: 'branch',
    label: 'الفرع ٦-أ',
    text: 'يَجْلِسُ الطِّفْلُ عَلَى الْمَقْعَدِ',
    source: u2rSrc(70, 'textbook_grammar', 'تقويم الوحدة — السؤال ٦', 'أ'),
    status: 'implemented',
  },
  {
    id: 'U2R-70-Q7',
    page: 70,
    printedNumber: 7,
    kind: 'question',
    label: 'السؤال ٧',
    text: 'أَحْوِّلُ الْجُمْلَةَ الِاسْمِيَّةَ الْآتِيَةَ إِلَى جُمْلَةٍ فِعْلِيَّةٍ:',
    source: u2rSrc(70, 'textbook_grammar', 'تقويم الوحدة — السؤال ٧', 7),
    status: 'implemented',
  },
  {
    id: 'U2R-70-Q7-A',
    page: 70,
    printedNumber: 7,
    kind: 'branch',
    label: 'الفرع ٧-أ',
    text: 'التِّلْمِيذُ يَحُلُّ الْمَسْأَلَةَ',
    source: u2rSrc(70, 'textbook_grammar', 'تقويم الوحدة — السؤال ٧', 'أ'),
    status: 'implemented',
  },
];

/** Read one audited record by id; fails loudly instead of silently returning undefined. */
export function unit2ReviewRecord(id: string): Unit2ReviewSourceRecord {
  const record = UNIT2_REVIEW_SOURCE_RECORDS.find((entry) => entry.id === id);
  if (!record) throw new Error(`سجل مصدر غير موجود في تدقيق تقويم الوحدة الثانية: ${id}`);
  return record;
}
