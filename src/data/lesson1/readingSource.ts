/**
 * Lesson 1 «السَّمَكَةُ الذَّهَبِيَّةُ» — frozen verbatim source layer (pages 4–11).
 *
 * SINGLE SOURCE OF TRUTH for every printed string of the lesson.
 * Each record carries:
 *  - id: lock identifier L1-001…L1-084 (docs/source-locks/lesson-01-…)
 *  - layer: 'printed'   = verbatim as printed in the textbook images;
 *           'owner'     = reading fixed by an explicit owner decision (kept as-is);
 *           'corrected' = documented pedagogical correction; `printedVariant`
 *                         ALWAYS holds the printed form and the difference is noted;
 *           'platform'  = platform-authored teaching addition (never textbook wording).
 *  - status: 'solved' | 'implemented' (implemented = present in UI; a pending item is
 *            implemented but NOT solved and must never expose an invented key).
 *
 * RULE: no record may be shortened, and no corrected record may exist without
 * printedVariant + note. Tests enforce both.
 */

export type SourceLayer = 'printed' | 'owner' | 'corrected' | 'platform';
export type SourceStatus = 'solved' | 'implemented';

export interface SourceRecord {
  id: string;
  page: number;
  kind:
    | 'header'
    | 'theme'
    | 'instruction'
    | 'visual'
    | 'activity'
    | 'passage'
    | 'separator'
    | 'author'
    | 'vocab'
    | 'rule'
    | 'examples'
    | 'table'
    | 'diagram'
    | 'board';
  layer: SourceLayer;
  status: SourceStatus;
  text: string | string[];
  printedVariant?: string;
  note?: string;
}

export const LESSON1_SOURCE_RECORDS: SourceRecord[] = [
  /* ---------------- page 4 ---------------- */
  { id: 'L1-001', page: 4, kind: 'header', layer: 'printed', status: 'solved', text: '١ — السَّمَكَةُ الذَّهَبِيَّةُ' },
  { id: 'L1-002', page: 4, kind: 'theme', layer: 'printed', status: 'solved', text: 'أحلامي الكبيرةُ... كيف أُحقِّقُها؟' },
  { id: 'L1-003', page: 4, kind: 'instruction', layer: 'printed', status: 'solved', text: 'أتأمّلُ الصّورتين الآتيتين، ثمّ أنفّذُ الأنشطة:' },
  {
    id: 'L1-004', page: 4, kind: 'visual', layer: 'printed', status: 'solved',
    text: [
      'صورة (١): ثلاثةُ صيادين في مركبٍ يسحبون شبكةً ممتلئةً بالسمك.',
      'صورة (٢): صيادون على الشاطئ يصنعون مركبًا (ألواحُ خشبٍ ومطرقةٌ وحبل).',
    ],
    note: 'عنصر بصري مطبوع؛ تعرض المنصة وصفًا مكافئًا موسومًا بوصفه تمثيلًا للمنصة لا نص كتاب.',
  },
  { id: 'L1-005', page: 4, kind: 'activity', layer: 'printed', status: 'solved', text: 'أصِفُ ما أُشاهِدُهُ في كلّ من الصّورتين السّابقتين.' },
  { id: 'L1-006', page: 4, kind: 'activity', layer: 'printed', status: 'solved', text: 'أُخبِرُ زملائي بما أراهُ مشتركًا فيما تعبِّرُ عنه الصّورتان.' },
  { id: 'L1-007', page: 4, kind: 'instruction', layer: 'printed', status: 'solved', text: 'أستمعُ إلى النصّ متجنّبًا المشتّتات، ثمّ أنفّذُ النشاط:' , note: 'النص الصوتي غير متاح؛ المتن المعروض هو نص القراءة ص٥، بوسم صادق.' },
  {
    id: 'L1-008', page: 4, kind: 'activity', layer: 'printed', status: 'solved',
    text: ['أذكرُ:', '- الشخصيّةُ الرّئيسةُ في القصّة.', '- المكانُ الذي تدورُ فيه أحداثُ القصّة.'],
  },
  { id: 'L1-009', page: 4, kind: 'activity', layer: 'printed', status: 'solved', text: 'أُخبِرُ زملائي بالأمنيّة التي سعى الصّيّادُ إلى تحقيقها.' },
  { id: 'L1-010', page: 4, kind: 'activity', layer: 'printed', status: 'solved', text: 'أتحدّثُ أمام زملائي عمّا فهمتُه من النصّ بأقلّ عددٍ ممكن من الجمل.' },

  /* ---------------- page 5 ---------------- */
  { id: 'L1-011', page: 5, kind: 'header', layer: 'printed', status: 'solved', text: 'أقرأ: السَّمَكَةُ الذَّهَبِيَّةُ' },
  { id: 'L1-012', page: 5, kind: 'separator', layer: 'printed', status: 'solved', text: '... ١ ...' },
  {
    id: 'L1-013', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'على الشّاطئِ يعيشُ صيّادٌ فقيرٌ، يذهبُ كلَّ يومٍ إلى البحرِ ويصطادُ بضعَ سمكاتٍ، ثمّ يبيعُها بدراهمَ قليلةٍ. ولكنّه ما زال يحلمُ باصطيادِ سمكةٍ ذهبيّةٍ ليشتريَ بثمنها زورقًا للصّيدِ.',
  },
  {
    id: 'L1-014', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'كان الصّيّادُ يقفُ أمام البحرِ ويخاطبُهُ قائلاً: يا صديقي، امنحني - ولو مرّةً واحدةً - سمكةً ذهبيّةً، فعندي خمسةُ أولادٍ وزوجةٌ يحتاجون إلى طعامٍ كثيرٍ وثيابٍ جديدةٍ... سأشتري بثمنِ السمكةِ الذهبيّةِ زورقًا للصّيدِ... لقد مللتُ الوقوفَ كلَّ يومٍ... أريدُ أنْ أسافرَ على أمواجِكَ بعيدًا لأحصلَ على سمكٍ وفيرٍ.',
  },
  {
    id: 'L1-015', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'ذات يومٍ ردّ البحرُ على الصّيّادِ: ليس في مياهي سمكٌ ذهبيٌّ لأُعطيكَ واحدًا.',
  },
  {
    id: 'L1-016', page: 5, kind: 'passage', layer: 'owner', status: 'solved',
    text: 'الصّيّادُ: كيف أيُّها البحرُ؟! ... جدّي رَوَتْ لي حين كنتُ صغيرًا أنّكَ أعطيتَ أحد الصيادين سمكةً ذهبيّةً كبيرةً.',
    note: 'قراءة «رَوَتْ» معتمدة بقرار صريح من صاحب المشروع وتُحفظ كما هي دون تصحيح تعليمي.',
  },
  { id: 'L1-017', page: 5, kind: 'passage', layer: 'printed', status: 'solved', text: 'البحرُ: (ضاحكًا)... وهل صدّقتَ?!' },
  {
    id: 'L1-018', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'إنّها حكايةٌ يرويها النّاسُ لِيَتسلّوا بها ويستفيدوا من مغْزاها.',
  },
  {
    id: 'L1-019', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'حزن الصّيّادُ وفقد الأملَ وقال (يائسًا): إذن سأبقى صيّادًا فقيرًا.',
  },
  {
    id: 'L1-020', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'البحرُ: لا تحزنْ. وبدلًا من أن تحلمَ بالسمكةِ الذهبيّةِ والرزقِ تعاونْ أنت وزملاؤك على صنع مركبٍ للصّيد لعلّ أموركم تتغيّر.',
  },
  { id: 'L1-021', page: 5, kind: 'separator', layer: 'printed', status: 'solved', text: '... ٢ ...' },
  {
    id: 'L1-022', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'ذهب الصّيّادُ إلى زملائه وقال: عرفتُ طريقةً يستطيع بها كلُّ صيّادٍ أن يحصل على سمكةٍ ذهبيّة.',
  },
  { id: 'L1-023', page: 5, kind: 'passage', layer: 'printed', status: 'solved', text: 'الصّيّادون: وكيف ذلك؟' },
  {
    id: 'L1-024', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'الصّيّادُ: نتعاونُ جميعًا ونبني مركبًا للصّيد يكون مركزًا للجميع.',
  },
  {
    id: 'L1-025', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'الصّيّادون: يا لها من فكرةٍ ...! لكنّا فقراءُ لا نملك شيئًا نبني به المركب.',
  },
  {
    id: 'L1-026', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'صمت الجميع، وفجأةً نهض صيّادٌ شابٌّ وقال: عندي فكرةٌ... يصطاد كلُّ واحدٍ منّا سمكةً إضافيّةً كلَّ يومٍ، نجمع ثمنها ونبدأ بصنع المركب. ووافق الجميع وبدأوا العمل بفكرته ولم يتكاسل أحدٌ في اصطياد السمكة الإضافيّة.',
  },
  {
    id: 'L1-027', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'وبعد فترةٍ توفّر المال معهم، وتعاونوا على صنع المركب، ثمّ جهّزوه بالشِّباكِ القويّة والمتينة وأنزلوه إلى الماء، وأطلقوا عليه اسم مركبُ السمكةُ الذهبيّةُ.',
    note: 'ضمة «مركبُ» محفوظة كما طُبعت؛ تُوثَّق ولا تُصحَّح.',
  },
  {
    id: 'L1-028', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'وقف الصّيّاد مخاطبًا البحر: انظرْ أيّها البحر، لقد صار لكلّ صيّادٍ منّا سمكتُه الذهبيّة.',
  },
  {
    id: 'L1-029', page: 5, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'خفق البحرُ بموجهِ وراح يستمع إلى أغاني الصيّادين الجميلة.',
  },
  { id: 'L1-030', page: 5, kind: 'author', layer: 'printed', status: 'solved', text: 'وليد محماري (يتصرف)' },
  { id: 'L1-031', page: 5, kind: 'vocab', layer: 'printed', status: 'solved', text: 'المغزى: المقصد' },
  { id: 'L1-032', page: 5, kind: 'activity', layer: 'printed', status: 'solved', text: 'أقرأُ المقطعَ الأوّلَ مراعيًا أسلوبيَ النداء والاستفهام.' },
  { id: 'L1-033', page: 5, kind: 'activity', layer: 'printed', status: 'solved', text: 'أقرأُ المقطعَ الثاني مراعيًا أسلوبَ التعجّبِ ومشاعرَ الفرح' },
  { id: 'L1-034', page: 5, kind: 'activity', layer: 'printed', status: 'solved', text: 'أقرأُ النصّ قراءةً جهريّةً سليمةً مراعيًا التلوينَ الصوتيّ المناسبَ للمعنى.' },

  /* ---------------- page 6 ---------------- */
  { id: 'L1-035', page: 6, kind: 'header', layer: 'printed', status: 'solved', text: 'الفهمُ القرائيّ: أقرأُ النصّ قراءةً صامتةً، ثمّ أنفّذُ النشاط:' },
  {
    id: 'L1-036', page: 6, kind: 'activity', layer: 'owner', status: 'implemented',
    text: [
      'أملأُ الفراغاتِ الآتيةَ مستعينًا بالنصّ:',
      '- جمع(الشَّبَكَة): …',
      '- معنى (قَصَّتْ): …',
      '- ضدّ (فرح): …',
    ],
    note: 'قراءة «قَصَّتْ» معتمدة بقرار صريح؛ معنى الكلمة ومفتاح هذا الفراغ معلّقان حتى اعتماد صريح أو وصول نص الاستماع؛ لا تُعرض إجابة مختلقة.',
  },
  {
    id: 'L1-037', page: 6, kind: 'activity', layer: 'printed', status: 'solved',
    text: ['أبيّنُ معنى الكلمةِ الملوّنةِ وفقَ سياقها في الجُملِ الآتية:', '- خفقَ البحرُ بموجهِ', '- إنّها حكايةٌ يرويها الناسُ'],
  },
  {
    id: 'L1-038', page: 6, kind: 'diagram', layer: 'printed', status: 'solved',
    text: [
      'أكملُ أحداثَ القصّة مستعينًا بالشكل (٥ صناديق وسهمان):',
      '[لجوءُ الصيّاد إلى البحر للحصول على سمكة ذهبيّة] ← [فارغ ١] ← [اتفاقُ الصياد مع زملائه على صيد سمكة إضافيّة] ← [اصطيادُ الصيّادين السمكَ الإضافيّ] ← [فارغ ٢]',
    ],
  },
  {
    id: 'L1-039', page: 6, kind: 'table', layer: 'printed', status: 'solved',
    text: [
      'أملأُ الجدولَ الآتي بما يناسبه (الأعمدة: السبب | النتيجة | العِبرة التي تدلّ عليه):',
      'صف١: توفّرُ المال مع الصيّادين | — | —',
      'صف٢: — | سرورُ البحرِ وطربُهُ. | —',
    ],
  },
  {
    id: 'L1-040', page: 6, kind: 'activity', layer: 'printed', status: 'solved',
    text: ['أختارُ الإجابةَ الصحيحة: ترمزُ السمكةُ الذهبيّةُ في القصّةِ إلى:', 'أ. سمكةٍ تخرجُ من البحر.', 'ب. العملِ والتّعاونِ.', 'ت. سمكةٍ من الذهب.'],
  },
  {
    id: 'L1-041', page: 6, kind: 'activity', layer: 'printed', status: 'solved',
    text: [
      'أدلُّ على العبارتين اللتين أعطى فيهما الكاتبُ الأشياءَ صفاتٍ إنسانيّةً ممّا يأتي:',
      'أ. البحرُ ضاحكٌ', 'ب. في المياه سمكٌ', 'ت. استمعَ البحرُ إلى أغاني الصيّادين.',
      'وهذه الصفاتُ هي: …',
    ],
  },
  { id: 'L1-042', page: 6, kind: 'activity', layer: 'printed', status: 'solved', text: 'أقترحُ نهايةً أخرى للنصّ من مخيلتي.' },
  { id: 'L1-043', page: 6, kind: 'activity', layer: 'printed', status: 'solved', text: 'لو كنتُ مكانَ الصيّادِ، ماذا سأفعلُ لأحصلَ على سمكتي الذهبيّة؟' },

  /* ---------------- page 7 ---------------- */
  { id: 'L1-044', page: 7, kind: 'header', layer: 'printed', status: 'solved', text: 'أتواصلُ شفويًا: تصميمُ مطويّة' },
  {
    id: 'L1-045', page: 7, kind: 'visual', layer: 'printed', status: 'solved',
    text: ['لوحة أربعة مشاهد لحملة نظافة: شارعٌ، شاطئٌ، مدرسةٌ، حديقةٌ، مع أكياس نفايات سوداء.'],
    note: 'عنصر بصري مطبوع؛ تمثيل المنصة وصف مكافئ موسوم.',
  },
  {
    id: 'L1-046', page: 7, kind: 'instruction', layer: 'printed', status: 'solved',
    text: 'أتدرّبُ بإشرافِ معلّمي: أتأمّلُ الصورةَ السابقةَ، ثمّ أُحاورُ زملائي لنتّفقَ على خطّةِ عملٍ لتصميمِ مطويّةٍ حولَ الموضوعِ ذاتِهِ، وتوزيعِ هذه المطويّاتِ في حيّنا.',
  },
  { id: 'L1-047', page: 7, kind: 'table', layer: 'printed', status: 'solved', text: ['جدول: التخطيط | مراحل التنفيذ (صفّان فارغان).'] },
  {
    id: 'L1-048', page: 7, kind: 'examples', layer: 'printed', status: 'solved',
    text: [
      'أتعلّم: مراحلُ تصميمِ المطويّةِ (الإعلانِ):',
      '١ تحديدُ موضوعِ المطويّة.', '٢ جمعُ المعلوماتِ الواجبِ توفّرها في المطويّة.',
      '٣ الإعدادُ الفنّيُّ للمطويّةِ (رسوم - ألوان - خط).',
      '٤ الإخراجُ النهائيُّ للمطويّةِ (ضبطٌ لغويٌّ - الشكلُ العامُّ ومناسبتُهُ لموضوعِ المطويّةِ).',
    ],
  },
  {
    id: 'L1-049', page: 7, kind: 'activity', layer: 'printed', status: 'solved',
    text: 'أطبّقُ: أمثّلُ أمام زملائي طريقةَ تقديمي هذه المطويّاتِ لسكّانِ حيّنا مستعملاً عباراتٍ تُقنعهم بالمساهمةِ معنا في هذه الفعّاليّة.',
  },
  { id: 'L1-050', page: 7, kind: 'instruction', layer: 'printed', status: 'solved', text: 'قواعدُ اللغة: الجملةُ — أقرأُ الأمثلةَ الآتيةَ، ثمّ أنفّذُ الأنشطة:' },
  { id: 'L1-051', page: 7, kind: 'examples', layer: 'printed', status: 'solved', text: ['الشِّباكُ قويةٌ.', 'فرحَ الصيّادُ.', 'صنعَ العمّالُ مركبًا.'] },

  /* ---------------- page 8 ---------------- */
  { id: 'L1-052', page: 8, kind: 'activity', layer: 'printed', status: 'solved', text: 'ألاحظُ أنّ كلًّا من التراكيبِ السابقةِ أفادت معنى تامًّا، فماذا نسمّي كلًّا منها؟' },
  { id: 'L1-053', page: 8, kind: 'activity', layer: 'printed', status: 'solved', text: 'ألاحظُ أنّ الجملةَ الأولى بدأت باسمٍ، فماذا نسمّي هذا النوعَ من الجُملِ؟' },
  { id: 'L1-054', page: 8, kind: 'activity', layer: 'printed', status: 'solved', text: 'ألاحظُ أنّ الجملتين الثانيةَ والثالثةَ بدأتا بفعلٍ، فماذا نسمّي هذا النوعَ من الجُملِ؟' },
  {
    id: 'L1-055', page: 8, kind: 'rule', layer: 'printed', status: 'solved',
    text: 'الجملةُ: تركيبٌ يفيد معنى تامًّا. والجملةُ نوعان: (اسميّةٌ وفعليّةٌ). الجملةُ التي تبدأ باسمٍ تُسمّى الجملةَ الاسميّةَ، والجملةُ التي تبدأ بفعلٍ تُسمّى الجملةَ الفعليّةَ.',
  },
  {
    id: 'L1-056', page: 8, kind: 'activity', layer: 'printed', status: 'solved',
    text: ['أطبّقُ: أصنّفُ الجملَ الآتيةَ وفقَ نوعها (اسميّة، فعليّة):', 'الشاطئُ ساحرٌ', 'تعاونَ الصيّادون على مواجهةِ العاصفةِ', 'التعاونُ قوّةٌ'],
  },
  {
    id: 'L1-057', page: 8, kind: 'table', layer: 'corrected', status: 'solved',
    text: [
      'التقويمُ النهائيُّ ١: أقرأُ الجملَ الآتية، ثمّ أكملُ الجدولَ بما يناسبه: البحرُ مصدرٌ للرزقِ، زُرقةُ مائهِ ساحرةٌ، وخيراتُه وفيرةٌ، يذهب إليه الناس في الصيف للسباحةِ، ويقضون على شاطئه أجملَ الأوقات. + جدول (الجملة | نوعها) خمسة صفوف.',
    ],
    printedVariant: 'البحرُ مصدرٌ للرزقِ، زُرقةُ مائهِ ساحرةٌ، وخيراتُه وفيرةٌ، يذهب إليه الناس في الصيف للسباحةِ، ويقبضون على شاطئه أجملَ الأوقات.',
    note: 'تصحيح معتمد بقرار صريح: العرض التعليمي «يقضون»؛ المطبوع «يقبضون» محفوظ هنا ويُعرض الفرق في الواجهة وسجل المصدر.',
  },
  { id: 'L1-058', page: 8, kind: 'activity', layer: 'printed', status: 'solved', text: 'أُقدّمُ عرضًا أمام زملائي لمدّة دقيقتين عن حرفةٍ أعرفها مستعملاً جملاً فعليّةً واسميّةً.' },
  { id: 'L1-059', page: 8, kind: 'activity', layer: 'printed', status: 'solved', text: 'أكتبُ فقرةً من سطرين عن قيمةِ الإخلاصِ في العملِ، مستعملاً جملاً فعليّةً واسميّةً.' },

  /* ---------------- page 9 ---------------- */
  { id: 'L1-060', page: 9, kind: 'instruction', layer: 'printed', status: 'solved', text: 'إملاء: الهمزةُ الأوّليّةُ — أقرأُ المثالين الآتيين، ثمّ أنفّذُ الأنشطة:' },
  { id: 'L1-061', page: 9, kind: 'examples', layer: 'printed', status: 'solved', text: 'أريدُ أنْ أسافرَ على أمواجِكَ راجيًا إكرامي بصيدٍ وفيرٍ.' },
  {
    id: 'L1-062', page: 9, kind: 'examples', layer: 'owner', status: 'solved',
    text: 'يا صديقي البحر: بكرمٍ وامْنَحْني سمكةً ذهبيّةً.',
    note: 'قراءة «وامْنَحْني» معتمدة بقرار صريح.',
  },
  { id: 'L1-063', page: 9, kind: 'activity', layer: 'printed', status: 'solved', text: 'ألاحظُ أنّ الكلماتِ الملوّنةَ تبدأُ بهمزةٍ، فماذا نسمّي هذا النوعَ من الهمزاتِ؟' },
  {
    id: 'L1-064', page: 9, kind: 'activity', layer: 'printed', status: 'solved',
    text: 'أقرأُ الجملةَ الأولى، وألاحظُ أنّ الهمزةَ الأوّليّةَ في الكلمات (أريد – أن – أسافر – إكرامي) كُتبت فوق الألف أو تحتها وحينها لُفظت، فماذا نسمّي هذا النوعَ من الهمزةِ الأوّليّة؟',
  },
  {
    id: 'L1-065', page: 9, kind: 'activity', layer: 'printed', status: 'solved',
    text: 'أقرأُ الجملةَ الأولى، وألاحظُ أنّ الهمزةَ الأوّليّةَ في كلمة (امنحني) كُتبت ألفًا ولم تُلفظ، فماذا نسمّي هذا النوعَ من الهمزةِ الأوّليّة؟',
  },
  {
    id: 'L1-066', page: 9, kind: 'rule', layer: 'printed', status: 'solved',
    text: 'تُسمّى الهمزةُ التي تأتي في أول الكلمة همزةً أوليّةً، وهي نوعان: ١ همزةُ القطع: تُكتب وتُلفظ، وتأتي فوق الألف إذا كانت مفتوحةً أو مضمومةً، وتأتي تحت الألف إذا كانت مكسورةً. ٢ همزةُ الوصل: تُكتب ألفًا وتُلفظ في أول الكلام، ولا تُلفظ في أثناءه.',
  },
  {
    id: 'L1-067', page: 9, kind: 'activity', layer: 'printed', status: 'solved',
    text: 'أطبّقُ: أدلّ على الكلماتِ التي تبدأُ بهمزةٍ أوليّةٍ، وأسمّي نوعَ الهمزةِ في كلٍّ منها: أرغبُ في اقتناءِ كتبٍ كثيرةٍ قناعةً منّي بأهميّتها وإسهامها في تنميةِ ثقافتي.',
  },
  {
    id: 'L1-068', page: 9, kind: 'table', layer: 'owner', status: 'solved',
    text: [
      'التقويمُ النهائيُّ ١: أقرأُ الفقرةَ الآتيةَ، ثمّ أملأُ الجدولَ بما يناسبه: قال لي أبي: انظرْ إلى أعمالِ الآخرين، واستفدْ من إنجازِهم وأخطائهم، واحرصْ على الإفادةِ من الإنجازِ وتجنّبِ الأخطاء.',
      'أعمدة الجدول: همزةُ القطع | موقعُها بالنسبةِ إلى الألف | السَّببُ | همزةُ الوصل',
    ],
    note: 'عنوان العمود الثالث «السَّببُ» معتمد بقرار صريح.',
  },
  { id: 'L1-069', page: 9, kind: 'activity', layer: 'printed', status: 'solved', text: 'أذكرُ كلمةً تبدأُ بهمزةِ قطعٍ وكلمةً تبدأُ بهمزةِ وصلٍ، ثمّ أضَعُ كلًّا منهما في جملةٍ مفيدةٍ.' },

  /* ---------------- page 10 ---------------- */
  { id: 'L1-070', page: 10, kind: 'header', layer: 'printed', status: 'solved', text: 'الخطّ: الحركات' },
  {
    id: 'L1-071', page: 10, kind: 'instruction', layer: 'printed', status: 'solved',
    text: 'ألاحظُ: (حركاتُ الضبط) في الجملةِ الآتية: نتعاونُ جميعًا ونبني مركبًا للصيدِ يكونُ مركزًا للجميع.',
  },
  { id: 'L1-072', page: 10, kind: 'visual', layer: 'printed', status: 'solved', text: ['سطرُ الحركاتِ المعزولة للمحاكاة: فَتحة، ضمة، كسرة، سكون، تنوينُ فتحٍ، تنوينُ ضمٍّ، تنوينُ كسرٍ، شدة.'], note: 'عنصر مطبوع بصري/خطّي؛ يعرض تفاعليًا للرسم والمحاكاة.' },
  { id: 'L1-073', page: 10, kind: 'activity', layer: 'printed', status: 'solved', text: 'أتدرّبُ: أحاكي رسمَ الحركاتِ والتنوينِ والتضعيفِ بخطِّ رقعةٍ فيما يأتي:' },
  {
    id: 'L1-074', page: 10, kind: 'activity', layer: 'printed', status: 'solved',
    text: 'أطبّقُ: أكتبُ الجملةَ الآتيةَ مراعيًا قواعدَ كتابةِ خطِّ الرقعةِ ورسمَ الحركاتِ: قال صيّادٌ شابٌّ: عندي فكرةٌ، يصطادُ كلُّ واحدٍ منّا سمكةً واحدةً إضافيّةً كلَّ يومٍ',
  },
  {
    id: 'L1-075', page: 10, kind: 'instruction', layer: 'printed', status: 'solved',
    text: 'أعبّرُ كتابيًا: استبدالُ المفرداتِ والتراكيب — أتذكّرُ: من مهاراتِ التعبيرِ استبدالُ مفرداتٍ وتراكيب ببعضِ مفرداتِ وتراكيبِ النصّ',
    note: 'صياغة صندوق «أتذكّر» محفوظة كما طُبعت حرفيًا.',
  },
  {
    id: 'L1-076', page: 10, kind: 'activity', layer: 'printed', status: 'solved',
    text: 'أعيدُ صوغَ الفقرةِ الآتيةِ بأسلوبي، مستبدلاً بعضَ مفرداتِ النصّ مفرداتٍ من ذاكرتي ليصبحَ النصُّ أجملَ في رأيي، ثمّ أكتبُهُ:',
  },
  {
    id: 'L1-077', page: 10, kind: 'passage', layer: 'printed', status: 'solved',
    text: 'كان الصيّادُ يقفُ إلى شاطئِ البحرِ، ويخاطبُهُ قائلاً: يا صديقي البحرُ امنحني ولو مرّةً واحدةً سمكةً ذهبيّةً، عندي خمسةُ أولادٍ وزوجةٌ يحتاجون إلى طعامٍ كثيرٍ وثيابٍ جديدةٍ، سأشتري بثمنِ السمكةِ الذهبيّةِ زورقًا للصيدِ، لقد مللتُ الوقوفَ كلَّ يومٍ، أريدُ أن أسافرَ على أمواجِكَ بعيدًا لأحصلَ على سمكٍ وفيرٍ.',
  },

  /* ---------------- page 11 ---------------- */
  { id: 'L1-078', page: 11, kind: 'header', layer: 'printed', status: 'solved', text: 'ألعبُ وأتعلّمُ' },
  {
    id: 'L1-079', page: 11, kind: 'board', layer: 'printed', status: 'solved',
    text: ['لوحة حرف↔شكل (٣٠ خلية): ص١: أ ب ج د هـ و ز ح ط ي؛ ص٢: ك ل م ن س ع ف ص ق ر؛ ص٣: ش ت ث خ ذ ض غ ظ ئ ة.'],
  },
  {
    id: 'L1-080', page: 11, kind: 'activity', layer: 'printed', status: 'implemented',
    text: ['أستبدلُ بالرموزِ الآتيةِ الحروفَ التي تعبّرُ عنها وفقَ الجدولِ لأحصلَ على جملٍ مناسبةٍ (صفّان من الرموز).'],
    note: 'المطابقة المقترحة (الصدق منجاة / أحب بلادي) مسودة بانتظار اعتماد صريح؛ زر التحقق معطّل والنشاط غير محلول.',
  },
  { id: 'L1-081', page: 11, kind: 'activity', layer: 'printed', status: 'solved', text: 'أحسبُ الزمنَ الذي احتجتُ إليه لإنهاءِ اللعبةِ أولَ مرة.' },
  { id: 'L1-082', page: 11, kind: 'activity', layer: 'printed', status: 'solved', text: 'أطلبُ إلى زميلٍ أن يختارَ عبارةً، ثمّ نحوّلُها إلى رموزٍ وفقَ الجدولِ السابقِ.' },
  { id: 'L1-083', page: 11, kind: 'activity', layer: 'printed', status: 'solved', text: 'أُقارنُ الزمنَ بين الحالتين السابقتين، ماذا أستنتجُ؟' },
  {
    id: 'L1-084', page: 11, kind: 'activity', layer: 'printed', status: 'solved',
    text: 'أنا وأسرتي: أُخبرُ أسرتي بالحكمةِ التي تعلّمتُها من نصِّ القراءةِ، وأبحثُ معهم عن قصصٍ شعبيّةٍ تُحاكي ما تعلّمناهُ لأعرضَها على زملائي في الدرسِ القادمِ.',
  },
];

export function getSourceRecord(id: string): SourceRecord | undefined {
  return LESSON1_SOURCE_RECORDS.find((record) => record.id === id);
}

/** Identifiers whose solution key is pending an explicit owner decision. */
export const PENDING_SOURCE_IDS = ['L1-036', 'L1-080'] as const;
