/** Platform-only practice, authorized for Lesson 2 steps 5 and 6.
 * Book: docs/source-locks/lesson-02-bil-rayi-wal-rayi-al-akhar.md, pp. 17–19.
 * Supporting sources and owner decision: docs/redesign/pr-02-source-authorization.md.
 * These prompts and answers are not textbook activities or official test keys.
 */
export interface PlatformOption { id: string; label: string; reason: string }
export interface PlatformRow { id: string; label: string; options: PlatformOption[]; correctId: string }
export interface PlatformExercise { id: string; title: string; prompt: string; rows: PlatformRow[] }

const grammarTypes: PlatformOption[] = [
  { id: 'verb', label: 'فعل', reason: 'الفعل يدل على حدث ويرتبط بزمن.' },
  { id: 'source', label: 'مصدر', reason: 'المصدر اسم للحدث لا يحدد زمنه.' },
  { id: 'thing', label: 'اسم شيء', reason: 'اسم الشيء هنا لا يسمي الحدث.' },
];

export const LESSON2_PLATFORM_EXERCISES: Record<'l2-s5' | 'l2-s6', PlatformExercise[]> = {
  'l2-s5': [
    {
      id: 'l2p-g-classify', title: 'أميّز الكلمات', prompt: 'صنّف كل كلمة: فعل، أم مصدر، أم اسم شيء؟',
      rows: [
        { id: 'l2p-g-classify-jalasa', label: 'جَلَسَ', options: grammarTypes, correctId: 'verb' },
        { id: 'l2p-g-classify-julus', label: 'جُلوس', options: grammarTypes, correctId: 'source' },
        { id: 'l2p-g-classify-kursi', label: 'كُرسيّ', options: grammarTypes, correctId: 'thing' },
      ],
    },
    {
      id: 'l2p-g-reason', title: 'أفسّر السبب', prompt: 'صل كل حكم بالسبب المناسب له.',
      rows: [
        { id: 'l2p-g-reason-qiraa', label: 'القراءة مصدر', correctId: 'event', options: [
          { id: 'event', label: 'اسم للحدث دون زمن', reason: 'القراءة اسم للحدث دون زمن.' },
          { id: 'past', label: 'حدث مرتبط بالماضي', reason: 'القراءة لا تحدد زمنًا؛ هذه العبارة تصف فعلًا ماضيًا.' },
          { id: 'thing', label: 'اسم شيء', reason: 'القراءة تسمي حدثًا، لا شيئًا.' },
        ] },
        { id: 'l2p-g-reason-qaraa', label: 'قرأَ فعل', correctId: 'past', options: [
          { id: 'event', label: 'اسم للحدث دون زمن', reason: 'قرأَ فعل وليس اسمًا للحدث.' },
          { id: 'past', label: 'حدث مرتبط بالماضي', reason: 'قرأَ فعل يدل على حدث وقع في الماضي.' },
          { id: 'thing', label: 'اسم شيء', reason: 'قرأَ يدل على فعل وقع، لا على شيء.' },
        ] },
      ],
    },
    {
      id: 'l2p-g-context', title: 'أطبّق في جملة', prompt: 'أكمل الجملة بكلمة تسمّي الحدث نفسه، لا شيئًا، وتناسب موضعها: أحبُّ ___ قبل النوم.',
      rows: [{ id: 'l2p-g-context-choice', label: 'الكلمة المناسبة', correctId: 'reading', options: [
        { id: 'reading', label: 'القراءةَ', reason: 'القراءة اسم لحدث القراءة.' },
        { id: 'read', label: 'قرأَ', reason: 'قرأَ فعل ماضٍ وليس اسمًا للحدث، ولا يناسب الموضع هنا.' },
        { id: 'book', label: 'الكتابَ', reason: 'أحب الكتاب جملة سليمة، لكن الكتاب اسم شيء ولا يحقق طلب تسمية الحدث.' },
      ] }],
    },
  ],
  'l2-s6': [
    {
      id: 'l2p-s-classify', title: 'أتهيّأ للقاعدة', prompt: 'صنّف كل كلمة: فعل ماضٍ أم مصدر؟',
      rows: [
        { id: 'l2p-s-classify-akhadha', label: 'أخذ', correctId: 'verb', options: [
          { id: 'verb', label: 'فعل ماضٍ', reason: 'أخذ فعل ماضٍ ثلاثي مبدوء بهمزة قطع.' },
          { id: 'source', label: 'مصدر', reason: 'أخذ هنا فعل ماضٍ، وليس مصدرًا.' },
        ] },
        { id: 'l2p-s-classify-iqbal', label: 'إقبال', correctId: 'source', options: [
          { id: 'verb', label: 'فعل ماضٍ', reason: 'إقبال اسم الحدث، وليس الفعل الماضي أقبل.' },
          { id: 'source', label: 'مصدر', reason: 'إقبال مصدر الفعل الرباعي أقبل، وهمزته قطع.' },
        ] },
      ],
    },
    {
      id: 'l2p-s-reason', title: 'أعلّل همزة القطع', prompt: 'لماذا كُتبت الهمزة في كلمة أقبل همزة قطع؟',
      rows: [{ id: 'l2p-s-reason-choice', label: 'السبب', correctId: 'past4', options: [
        { id: 'past4', label: 'لأنها في فعل ماضٍ رباعي', reason: 'أقبل فعل ماضٍ رباعي، والماضي الرباعي من مواضع همزة القطع.' },
        { id: 'past3', label: 'لأنها في فعل ماضٍ ثلاثي', reason: 'أقبل فعل رباعي وليس ثلاثيًا.' },
        { id: 'noun', label: 'لأنها في مصدر فعل رباعي', reason: 'أقبل فعل ماضٍ، أما مصدره فهو إقبال.' },
      ] }],
    },
    {
      id: 'l2p-s-context', title: 'أطبّق في جملة', prompt: 'اختر الفعل الماضي الرباعي المبدوء بهمزة قطع الذي يناسب معنى الجملة: ___ الطفلُ إلى المدرسة.',
      rows: [{ id: 'l2p-s-context-choice', label: 'الفعل المناسب', correctId: 'aqbala', options: [
        { id: 'aqbala', label: 'أقبلَ', reason: 'أقبلَ فعل ماضٍ رباعي بهمزة قطع، ويناسب معنى الجملة.' },
        { id: 'akhadha', label: 'أخذَ', reason: 'أخذَ فعل ماضٍ ثلاثي لا يحقق شرط الفعل الرباعي ولا يناسب المعنى هنا.' },
        { id: 'qiraa', label: 'قراءةٌ', reason: 'قراءةٌ مصدر وليست فعلًا ماضيًا.' },
      ] }],
    },
  ],
};
