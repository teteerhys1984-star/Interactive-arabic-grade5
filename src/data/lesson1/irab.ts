import { src } from './sourceMeta';

/**
 * I‘rab (الإعراب) records for Lesson 1.
 * ONLY sentences that actually appear on pages 4–11 are parsed.
 * Each record preserves the original sentence/word and explains role, case, sign, and reason.
 * Count is derived from the array; it is NOT forced to any previously reported number.
 */

export interface IrabRecord {
  id: string;
  sentence: string;
  focusWord: string;
  role: string;
  caseName: string;
  sign: string;
  reason: string;
  page: number;
}

export const LESSON1_IRAB: IrabRecord[] = [
  { id: 'irab-1', sentence: 'فَرِحَ الصَّيّادُ.', focusWord: 'الصَّيّادُ', role: 'فاعِلٌ', caseName: 'مَرْفوعٌ', sign: 'الضَّمَّةُ الظّاهِرَةُ', reason: 'الفاعِلُ يُرْفَعُ، وَهنا اسْمٌ مُفْرَدٌ فَعَلَامَتُهُ الضَّمَّةُ.', page: 7 },
  { id: 'irab-2', sentence: 'صَنَعَ العُمّالُ مَرْكَباً.', focusWord: 'مَرْكَباً', role: 'مَفْعولٌ بِهِ', caseName: 'مَنْصوبٌ', sign: 'الفَتْحَةُ الظّاهِرَةُ', reason: 'المَفْعولُ بِهِ يُنْصَبُ، وَهنا اسْمٌ مُفْرَدٌ فَعَلَامَتُهُ الفَتْحَةُ.', page: 7 },
  { id: 'irab-3', sentence: 'الشَّباكُ قَوِيَّةٌ.', focusWord: 'قَوِيَّةٌ', role: 'خَبَرٌ', caseName: 'مَرْفوعٌ', sign: 'الضَّمَّةُ الظّاهِرَةُ', reason: 'خَبَرُ الجُمْلَةِ الاسْمِيَّةِ يُرْفَعُ.', page: 7 },
  { id: 'irab-4', sentence: 'التَّعاوُنُ قُوَّةٌ.', focusWord: 'التَّعاوُنُ', role: 'مُبْتَدَأٌ', caseName: 'مَرْفوعٌ', sign: 'الضَّمَّةُ الظّاهِرَةُ', reason: 'المُبْتَدَأُ يُرْفَعُ، وَهوَ أَوَّلُ الجُمْلَةِ الاسْمِيَّةِ.', page: 8 },
  { id: 'irab-5', sentence: 'خَفَقَ البَحْرُ بِمَوْجِهِ.', focusWord: 'البَحْرُ', role: 'فاعِلٌ', caseName: 'مَرْفوعٌ', sign: 'الضَّمَّةُ الظّاهِرَةُ', reason: 'الفاعِلُ يُرْفَعُ.', page: 8 },
  { id: 'irab-6', sentence: 'البَحْرُ مَصْدَرٌ لِلرِّزْقِ.', focusWord: 'مَصْدَرٌ', role: 'خَبَرٌ', caseName: 'مَرْفوعٌ', sign: 'الضَّمَّةُ الظّاهِرَةُ', reason: 'خَبَرُ المُبْتَدَأِ يُرْفَعُ.', page: 8 },
  { id: 'irab-7', sentence: 'يَذْهَبُ إِلَيْهِ النّاسُ في الصَّيْفِ.', focusWord: 'النّاسُ', role: 'فاعِلٌ مُؤَخَّرٌ', caseName: 'مَرْفوعٌ', sign: 'الضَّمَّةُ الظّاهِرَةُ', reason: 'الفاعِلُ يُرْفَعُ وَإِنْ تَأَخَّرَ في الجُمْلَةِ.', page: 8 },
  { id: 'irab-8', sentence: 'لِيَصْطَدْ كُلُّ واحِدٍ مِنّا سَمَكَةً.', focusWord: 'سَمَكَةً', role: 'مَفْعولٌ بِهِ', caseName: 'مَنْصوبٌ', sign: 'الفَتْحَةُ الظّاهِرَةُ', reason: 'المَفْعولُ بِهِ يُنْصَبُ.', page: 10 },
];

export const irabSource = (page: number) => src(page, 'textbook_grammar', 'الإِعْرابُ');
