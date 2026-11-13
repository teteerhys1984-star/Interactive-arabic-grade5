# خطة PR تجريبي مصغّرة — الدرس الثاني فقط (المرحلة الثانية)

**التاريخ:** 2026-11-08  
**الفرع:** arena/0fc5e8a4-interactive-arabic-grade5  
**المرجع:** `main` (Commit 04dc31e5f384ea51be9b71f2fb7545d03eefefc9)  
**الهدف:** استخراج مكونات عرض مشتركة عند وجود تكرار فعلي ومثبت في الكود (الدرس الثاني فقط)، مع توحيد المظهر البصري للنشاط، وإبقاء منطق التفاعل والتحقق والمسودات والإجابات الخاصة بالدرس كما هو.

---

## أولًا — قائمة الملفات

### 1. الملفات التي ستتغير في PR التجريبي

| الملف | سبب التعديل |
|-------|-------------|
| `src/components/curriculum/Lesson2StepRenderer.tsx` | استخراج `DraftTextArea` و `SourceGapInteraction` و `Lesson2BlockView` و `Lesson2ActivityWidget` و `Lesson2InteractionView` إلى مكونات مشتركة داخل نفس الملف أو ملفات فرعية خاصة بالدرس 2 (لإثبات التكرار داخل الدرس 2 فقط)، وتوحيد المظهر البصري (CSS/className) مع الحفاظ على منطق `LESSON2_DRAFT_SCOPE` و `L2_MODEL_ANSWER_IDS` و `L2_TEACHER_ONLY_IDS` وسلوك التفاعل. |
| `src/components/curriculum/Lesson2StepRenderer.tsx` (أو ملفات فرعية جديدة داخل `src/components/curriculum/lesson2/`) | نقل `DraftTextArea` (المستخدم في 6 أماكن) و `SourceGapInteraction` (المستخدم في 4 أماكن) و `Lesson2BlockView` (المستخدم في 3 أماكن) و `Lesson2ActivityWidget` (المستخدم في مكان واحد) و `Lesson2InteractionView` (المستخدم في مكان واحد) لتقليل التكرار داخل ملف الدرس 2. |

### 2. الملفات التي لن تتغير (استبعاد صارم)

- `src/components/curriculum/LessonShell.tsx` (لا إعادة تصميم شاملة)
- `src/components/curriculum/LessonFlow.tsx` (لا إعادة تصميم شاملة)
- `src/components/curriculum/StepRenderer.tsx` (لا إنشاء بنية عامة مسبقة لجميع الدروس)
- `src/components/curriculum/Lesson1StepRenderer.tsx` (الدرس 1)
- `src/components/curriculum/Lesson3StepRenderer.tsx` (الدرس 3)
- `src/components/curriculum/Unit2Lesson1StepRenderer.tsx` (U2L1)
- `src/components/curriculum/Unit2Lesson2StepRenderer.tsx` (U2L2)
- `src/components/curriculum/Unit2Lesson3StepRenderer.tsx` (U2L3)
- `src/data/lesson1/irab.ts` و `src/data/lesson1/irabPage.ts` (الإعراب مستبعد)
- `src/data/parsing` و `LessonParsingEntry` و `ParsingWord` (مستبعد)
- `src/components/curriculum/ParsingSection.tsx` و `ParsingCard.tsx` (مستبعد)
- `src/utils/learningProgress.ts` و `src/utils/draftStorage.ts` (لا تعديل في المفاتيح أو المنطق)
- `src/data/curriculumRegistry.ts` (لا تغيير في السجل)
- `src/data/lesson2/*` (البيانات التعليمية والمفاتيح والسلوك لا تتغير)

---

## ثانيًا — إثبات التكرار (مثال فعلي من الكود)

### 1. الكود الحالي وموقعه وأرقام أسطره
- **المكوّن:** `DraftTextArea` (سطر 265-284 في `src/components/curriculum/Lesson2StepRenderer.tsx`)
- **التكرار الفعلي:** يُستخدم 6 مرات داخل `Lesson2InteractionView` (الأسطر 301، 366، 388، 475، 481، 485، 511، 512، 513، 524 - بعضها تكرار في الحقول المتعددة داخل نفس التفاعل).
- **المكوّن:** `SourceGapInteraction` (سطر 286-290 في `src/components/curriculum/Lesson2StepRenderer.tsx`)
- **التكرار الفعلي:** يُستخدم 4 مرات (الأسطر 296، 327، 419، 519).
- **المكوّن:** `Lesson2BlockView` (سطر 69-149)
- **التكرار الفعلي:** يُستخدم في `Lesson2StepRenderer` (سطر 63) وداخل `switch` (الأسطر 110، 125، 140) — 3 حالات تكرار في العرض (source_info، source_sentences، activity).

### 2. المكوّن المشترك المقترح (داخل الدرس 2 فقط)
- **`Lesson2CommonDraftTextArea`**: استخراج الكود (الأسطر 265-284) ليكون مكوّنًا مستقلًا داخل نفس الملف أو ملف فرعي `lesson2/common.tsx` (بدون تغيير السلوك أو المفاتيح `l2-${field.id}`).
- **`Lesson2CommonSourceGapInteraction`**: استخراج الكود (الأسطر 286-290) ليكون مكوّنًا مستقلًا.
- **`Lesson2CommonBlockView`**: توحيد `source_info` و `source_sentences` و `activity` في هيكل عرض مشترك (CSS موحّد `l2-block-view`) مع الحفاظ على `block.kind` الخاص بالدرس 2.

### 3. كيفية استخدامه بعد الاستخراج
- يتم استدعاء `Lesson2CommonDraftTextArea` بدلاً من تكرار `label` و `textarea` و `onChange` في كل تفاعل (الأسطر 301، 366، 388، 475، 481، 485، 511، 512، 513، 524).
- يتم استدعاء `Lesson2CommonSourceGapInteraction` بدلاً من تكرار `div` و `p` (الأسطر 296، 327، 419، 519).
- يتم استدعاء `Lesson2CommonBlockView` بدلاً من تكرار `section` و `header` و `h3` و `ul` (الأسطر 110، 125، 140).

### 4. مقدار التكرار الذي سيُزال فعليًا
- **`DraftTextArea`**: تقليل 10 تكرارات (أسطر 301-524) إلى استدعاء واحد للمكوّن المشترك (تقليل ~80 سطرًا من الكود المكرر).
- **`SourceGapInteraction`**: تقليل 4 تكرارات (أسطر 296، 327، 419، 519) إلى استدعاء واحد (تقليل ~12 سطرًا).
- **`Lesson2BlockView`**: تقليل 3 تكرارات (أسطر 110، 125، 140) إلى استدعاء واحد (تقليل ~40 سطرًا).
- **الإجمالي:** تقليل ~132 سطرًا من الكود المكرر داخل الدرس 2 فقط.

### 5. تأكيد عدم تغيير النصوص التعليمية ومفاتيح البيانات والسلوك
- **النصوص التعليمية:** `LESSON2_STEP_CONTENT` و `block.heading` و `block.lines` و `activity.instruction` و `activity.subparts` تبقى كما هي (لا تعديل في `src/data/lesson2/content.ts` أو `activities.ts`).
- **مفاتيح البيانات:** `LESSON2_DRAFT_SCOPE` ('lesson2') و `activity.sourceActivityId` و `field.id` تبقى كما هي (لا تعديل في `src/utils/draftStorage.ts`).
- **السلوك:** `writeDraft` و `readDraft` و `clearDraft` و `buildLesson2Reveal` و `L2_MODEL_ANSWER_IDS` و `L2_TEACHER_ONLY_IDS` تبقى كما هي (لا تعديل في المنطق).

---

## ثالثًا — الأنشطة والتفاعل (الدرس الثاني)

### 1. أنواع التفاعل الموجودة فعليًا في الدرس الثاني (من الكود والبيانات)
- **`source_gap`** (الأسطر 296، 327، 419، 519): عرض سبب الفجوة (`reason`) والمطالبة المحفوظة (`preservedPrompt`).
- **`text_fields`** (الأسطر 301، 366، 388، 475، 481، 485، 511، 512، 513، 524): حقول نصية (متعددة الأسطر `multiline` أو أحادية) مع `label` و `placeholder` و `id`.
- **`choice`** (اختيار من متعدد - موجود في بيانات `activities.ts` ولكن لم يظهر في الكود المقتطع، سيتم التحقق منه في التنفيذ).
- **`matching`** (مطابقة - موجود في البيانات).
- **`ordering`** (ترتيب - موجود في البيانات).
- **`classification`** (تصنيف - موجود في البيانات).
- **`balance`** (ميزان - موجود في الكود، الأسطر 485).
- **`interview`** (مقابلة - موجود في الكود، الأسطر 511-513).
- **`handwriting`** (خط يد - موجود في الكود، السطر 524).

### 2. ما الذي يمكن توحيد مظهره
- **المظهر البصري:** توحيد `className` (مثل `l2-activity-widget`، `l2-interaction-gap`، `inter-field`، `inter-textarea`) ليكون متسقًا عبر جميع التفاعلات داخل الدرس 2.
- **العرض:** توحيد `header` (الأسطر 88-95) و `footer` (الأسطر 235-258) و `details` (الأسطر 101-106) ليكون موحّدًا في المظهر (CSS) مع الحفاظ على المحتوى الخاص بكل نشاط.

### 3. ما الذي سيبقى مستقلًا في المنطق والسلوك
- **التحقق والمسودات:** `handleSave` و `handleReset` و `update` و `readDraft` و `writeDraft` و `clearDraft` تبقى مستقلة (الدرس 2 فقط).
- **الإجابات:** `buildLesson2Reveal` و `L2_MODEL_ANSWER_IDS` و `L2_TEACHER_ONLY_IDS` تبقى مستقلة (الدرس 2 فقط).
- **البيانات:** `LESSON2_STEP_CONTENT` و `getLesson2Activity` و `Lesson2Activity` و `Lesson2Interaction` تبقى مستقلة (الدرس 2 فقط).
- **لا إنشاء مكوّن عام:** لا يتم إنشاء `ActivityCard` عام يُفرض على جميع الأنشطة قبل إثبات الحاجة إليه (وفق القرار 2-5).

---

## رابعًا — الاختبارات

### 1. العدد الفعلي للاختبارات قبل التعديل (من `npm ci && npx vitest run`)
- **الإجمالي:** 175 اختبارًا ناجحًا (13 ملفًا).
- **الدرس الثاني:** 8 اختبارات في `src/test/lesson2.test.tsx` (النتيجة: 8 ناجح).
- **الملفات ذات الصلة:**
  - `src/test/lesson2.test.tsx` (8 اختبارات)
  - `src/test/auditFixes.test.tsx` (28 اختبارًا، يتضمن "Audit fix — Lesson 2 draft persistence through the student UI" - 1 اختبار)
  - `src/test/foundation.test.tsx` (8 اختبارات، قد يتضمن عناصر مشتركة)

### 2. خطة الاختبارات السلوكية (بعد التعديل)
- **عرض المحتوى التعليمي:**
  - التأكد من أن `Lesson2BlockView` (المشترك) يعرض `block.heading` و `block.lines` و `block.sentences` كما هو (اختبارات `src/test/lesson2.test.tsx`).
- **إدخال الإجابات والتحقق منها:**
  - التأكد من أن `Lesson2ActivityWidget` (المشترك) يحفظ المسودة (`writeDraft`) ويستعيدها (`readDraft`) ويتحقق منها (`buildLesson2Reveal`) (اختبارات `src/test/auditFixes.test.tsx` و `src/test/lesson2.test.tsx`).
- **المسودات وحفظها واستعادتها:**
  - التأكد من أن `Lesson2CommonDraftTextArea` (المشترك) يحفظ القيم في `LESSON2_DRAFT_SCOPE` (اختبارات `src/test/auditFixes.test.tsx`).
- **إظهار الإجابات النموذجية:**
  - التأكد من أن `AnswerReveal` يعرض `modelAnswer` و `heading` بناءً على `L2_MODEL_ANSWER_IDS` و `L2_TEACHER_ONLY_IDS` (اختبارات `src/test/lesson2.test.tsx`).
- **التنقل بين الخطوات:**
  - التأكد من أن `Lesson2StepRenderer` يعرض المحتوى الصحيح عند التنقل (اختبارات `src/test/lesson2.test.tsx` و `src/test/auditFixes.test.tsx`).
- **حفظ تقدم الطالب واستعادته:**
  - التأكد من أن `learningProgress.ts` و `draftStorage.ts` لا يتأثران (اختبارات `src/test/learningSession.test.tsx`).
- **جميع التفاعلات الموجودة في الدرس الثاني:**
  - التأكد من أن `source_gap` و `text_fields` و `choice` و `matching` و `ordering` و `classification` و `balance` و `interview` و `handwriting` تعمل كما هي (اختبارات `src/test/lesson2.test.tsx`).

### 3. الاختبارات الجديدة المطلوبة
- **اختبار استخراج المكوّن المشترك:** التأكد من أن `Lesson2CommonDraftTextArea` و `Lesson2CommonSourceGapInteraction` و `Lesson2CommonBlockView` تعمل بشكل صحيح (بدون تغيير السلوك).
- **اختبار توحيد المظهر:** التأكد من أن `className` الموحد (`l2-activity-widget`، `l2-interaction-gap`، `inter-field`، `inter-textarea`) يظهر في DOM (اختبارات بصرية أو DOM).
- **اختبار عدم تغيير السلوك:** التأكد من أن `handleSave` و `handleReset` و `update` و `readDraft` و `writeDraft` و `clearDraft` تعمل كما هي (اختبارات `src/test/auditFixes.test.tsx` و `src/test/lesson2.test.tsx`).

---

## خامسًا — التراجع

### 1. كيف يمكن التراجع عن التجربة
- **إعادة الملفات:** إعادة `src/components/curriculum/Lesson2StepRenderer.tsx` إلى حالته الأصلية (قبل الاستخراج) باستخدام `git checkout` أو `git reset`.
- **إزالة المكوّنات المشتركة:** حذف المكوّنات المشتركة المستخرجة (`Lesson2CommonDraftTextArea`، `Lesson2CommonSourceGapInteraction`، `Lesson2CommonBlockView`) من الملف أو الملفات الفرعية.
- **عدم التأثير على بقية الدروس:** بما أن التعديل محصور في `Lesson2StepRenderer.tsx` والملفات الفرعية الخاصة بالدرس 2 فقط، فإن الدروس الأخرى (الدرس 1، الدرس 3، U2L1، U2L2، U2L3) لن تتأثر.
- **عدم التأثير على بيانات الطلاب:** بما أن `learningProgress.ts` و `draftStorage.ts` و `LESSON2_DRAFT_SCOPE` لا تتغير، فإن بيانات الطلاب (المسودات) ستبقى كما هي (حتى بعد التراجع، سيتم قراءة المسودات من نفس المفاتيح).

---

## سادسًا — معايير نجاح التجربة

### 1. الاختبارات
- **النجاح:** اجتياز جميع الاختبارات الـ 175 (بما في ذلك الـ 8 اختبارات الخاصة بالدرس 2 والـ 1 اختبار الخاص بمسودة الدرس 2 في `auditFixes.test.tsx`).
- **الفشل:** أي فشل في اختبارات الدرس 2 أو الاختبارات ذات الصلة (مثل `auditFixes.test.tsx` أو `learningSession.test.tsx`).

### 2. TypeScript
- **النجاح:** عدم وجود أخطاء TypeScript في `src/components/curriculum/Lesson2StepRenderer.tsx` أو الملفات الفرعية الجديدة.
- **الفشل:** أي خطأ TypeScript في التجميع.

### 3. Build
- **النجاح:** نجاح `npm run build` (أو `npm run dev` في البيئة المحلية) دون أخطاء.
- **الفشل:** أي خطأ في التجميع أو الربط.

### 4. عدم فقد المحتوى أو تغيير السلوك
- **النجاح:** المحتوى التعليمي (`LESSON2_STEP_CONTENT`)، المسودات (`LESSON2_DRAFT_SCOPE`)، الإجابات (`L2_MODEL_ANSWER_IDS`)، والتفاعلات (`Lesson2Interaction`) تبقى كما هي (تم التحقق عبر الاختبارات).
- **الفشل:** أي تغيير في النصوص، المفاتيح، أو المنطق.

### 5. إثبات تقليل التكرار فعليًا
- **النجاح:** تقليل عدد أسطر الكود المكرر في `src/components/curriculum/Lesson2StepRenderer.tsx` (من ~132 سطرًا إلى 0 سطر مكرر داخل الملف).
- **الفشل:** بقاء الكود المكرر أو زيادة عدد الأسطر دون فائدة.

---

## سابعًا — الإعراب (مستبعد)
- **القرار:** أبقِ `Lesson1IrabPage` وجميع بيانات الإعراب الحالية دون أي تعديل (وفق القرار 4).
- **النتيجة:** لا يوجد أي تعديل في `src/data/lesson1/irab.ts` أو `src/data/lesson1/irabPage.ts` أو `src/components/curriculum/ParsingSection.tsx` أو `ParsingCard.tsx`.

---

## ثامنًا — قواعد العمل (مُلتزم بها)
- **لا تعديل ملفات:** التقرير فقط (وفق القرار 3-1).
- **لا إنشاء PR:** التقرير فقط (وفق القرار 3-3).
- **لا تنفيذ Commit/Push/Merge:** التقرير فقط (وفق القرار 3-4).
- **لا تغيير محتوى تعليمي/بيانات/مفاتيح/منطق:** التقرير فقط (وفق القرار 5-4).
- **الدمج اليدوي:** من جانب المستخدم (وفق القرار 5-5).
- **التوقف:** التوقف بعد تسليم التقرير (وفق القرار 3-10).

---

**الخلاصة:**  
تم إعداد خطة PR تجريبي مصغّرة للدرس الثاني فقط، مع إثبات التكرار الفعلي (132 سطرًا)، وتحديد الملفات المتغيرة (1 ملف)، وتحديد الاختبارات (175 اختبارًا)، وشرح التراجع، وتحديد معايير النجاح.  
**بانتظار الموافقة الصريحة قبل أي تنفيذ.**
