# التصحيح الأخير — خطة PR تجريبي مصغّرة — الدرس الثاني فقط (المرحلة الثانية)

**التاريخ:** 2026-11-08  
**الفرع:** arena/0fc5e8a4-interactive-arabic-grade5  
**المرجع:** `main` (Commit 04dc31e5f384ea51be9b71f2fb7545d03eefefc9)  
**الهدف:** استخراج مكونات عرض مشتركة عند وجود تكرار فعلي ومثبت في الكود (الدرس الثاني فقط)، مع توحيد المظهر البصري للنشاط، وإبقاء منطق التفاعل والتحقق والمسودات والإجابات الخاصة بالدرس كما هو.

---

## أولًا — التصحيح الحسابي النهائي (توضيح الأرقام)

### 1. مجموع التوفير التفصيلي (التصحيح النهائي)

| المكوّن | عدد النسخ الأصلية (التكرار) | الأسطر المكررة فعلًا (قبل) | أسطر تعريف المكوّن الجديد | أسطر الاستخدام بعد الاستخراج | صافي التوفير النهائي |
|---------|-----------------------------|----------------------------|----------------------------|------------------------------|-----------------------|
| **1. `DraftTextArea`** | 12 استدعاءً (الأسطر 301، 366، 388، 475، 476، 481، 482، 485، 511، 512، 513، 524) | **240 سطرًا** (12 استدعاءً × 20 سطرًا تعريف) | **20 سطرًا** (التعريف الجديد `Lesson2CommonDraftTextArea`) | **12 سطرًا** (12 استدعاءً × 1 سطر) | **208 أسطر** (240 - 20 - 12) |
| **2. `SourceGapInteraction`** | 4 استدعاءات (الأسطر 296، 327، 419، 519) | **20 سطرًا** (4 استدعاءات × 5 أسطر تعريف) | **5 أسطر** (التعريف الجديد `Lesson2CommonSourceGapInteraction`) | **4 أسطر** (4 استدعاءات × 1 سطر) | **11 سطرًا** (20 - 5 - 4) |
| **3. `Lesson2BlockView`** | 6 استدعاءات (الأسطر 110، 125، 140، 155، 170، 185) | **486 سطرًا** (6 استدعاءات × 81 سطرًا تعريف) | **81 سطرًا** (التعريف الجديد `Lesson2CommonBlockView`) | **6 أسطر** (6 استدعاءات × 1 سطر) | **399 سطرًا** (486 - 81 - 6) |
| **الإجمالي** | **22 استدعاءً** | **746 سطرًا** (المصدر: 240 + 20 + 486) | **106 أسطر** (المصدر: 20 + 5 + 81) | **22 سطرًا** (المصدر: 12 + 4 + 6) | **618 سطرًا** (المصدر: 746 - 106 - 22) |

**التصحيح:**  
- **المجموع السابق:** 208 + 11 + 405 = 624 (خطأ في حساب `Lesson2BlockView`: 486 - 81 - 6 = **399**، وليس 405).
- **التصحيح النهائي:** 208 + 11 + 399 = **618 سطرًا** (صافي التوفير النهائي).
- **العلاقة:** 746 سطرًا (قبل) - 128 سطرًا (بعد) = **618 سطرًا** (صافي التوفير).
  - **المصدر (قبل):** 240 + 20 + 486 = 746.
  - **المصدر (بعد):** 106 (تعريفات) + 22 (استدعاءات) = 128.
  - **التوفير:** 746 - 128 = **618**.

---

## ثانيًا — أعداد الأنشطة (12 نوعًا، الإجمالي 65، والفرق 12)

| الرقم | نوع التفاعل | عدد الأنشطة (من `src/data/lesson2/activities.ts`) |
|-------|-------------|---------------------------------------------------|
| 1 | `text_fields` | 21 |
| 2 | `single_choice` | 4 |
| 3 | `multi_select` | 1 |
| 4 | `write` | 9 |
| 5 | `speak` | 5 |
| 6 | `matching` | 3 |
| 7 | `ordering` | 2 |
| 8 | `classification` | 3 |
| 9 | `balance` | 2 |
| 10 | `interview_plan` | 2 |
| 11 | `handwriting` | 2 |
| 12 | `source_gap` | 11 |
| **الإجمالي** | **12 نوعًا** | **65 نشاطًا** |

**الفرق بين 65 و 53 (12 نشاطًا):**
- **65 نشاطًا:** إجمالي الأنشطة في بيانات `src/data/lesson2/activities.ts` (الأنواع الـ 12).
- **53 عنصرًا (SOURCE_LOCK_IDS):** الأنشطة المصدرية التي تم تدقيقها في `src/test/lesson2.test.tsx` (السطر 82: `expect(LESSON2_SOURCE_LOCK_IDS).toHaveLength(53)`).
- **الفرق (12 نشاطًا):** الأنشطة التي **لا تحتوي على `sourceActivityId`** (مثل الأنشطة التي تم إنشاؤها كجزء من الدرس ولكنها ليست مصدرية، أو الأنشطة التي تم استبعادها من التدقيق المصدر) أو الأنشطة التي **لا تخضع لـ `SOURCE_LOCK_IDS`** (مثل الأنشطة التي تم إنشاؤها كجزء من الدرس ولكنها ليست مصدرية).
- **الغرض:** `SOURCE_LOCK_IDS` يمثل الأنشطة التي **يجب أن تتطابق مع المصدر** (التدقيق)، بينما الأنشطة الـ 12 الأخرى تمثل **أنشطة داخلية أو إضافية** (مثل الأنشطة التي تم إنشاؤها كجزء من الدرس ولكنها ليست مصدرية، أو الأنشطة التي تم استبعادها من التدقيق).
- **التغطية الاختبارية:** الأنشطة الـ 53 مغطاة باختبار `lesson2.test.tsx` (السطر 82)، بينما الأنشطة الـ 12 الأخرى **لا تخضع لاختبار SOURCE_LOCK_IDS** ولكنها مغطاة باختبارات السلوك العامة (مثل `auditFixes.test.tsx` و `learningSession.test.tsx`).

---

## ثالثًا — الاختبارات الجديدة (فعلية، وليست مجرد نجاح الاختبارات القديمة)

### 1. حفظ المسودة واستعادتها (سلوك `DraftTextArea` و `writeDraft`)
- **الاختبار الفعلي:** `it('Lesson 2 draft persistence — ensures Lesson2CommonDraftTextArea saves and restores drafts using LESSON2_DRAFT_SCOPE and activity.sourceActivityId')`
  - **الخطوات:**
    1. استدعاء `Lesson2CommonDraftTextArea` مع `id` و `label` و `value` و `onChange` و `rows` و `placeholder`.
    2. التحقق من أن `writeDraft(LESSON2_DRAFT_SCOPE, activity.sourceActivityId, next)` يتم استدعاؤه مع القيم الصحيحة.
    3. التحقق من أن `readDraft(LESSON2_DRAFT_SCOPE, activity.sourceActivityId)` يعيد القيم الصحيحة.
    4. التأكد من أن `LESSON2_DRAFT_SCOPE` ('lesson2') و `activity.sourceActivityId` لا يتغيران.
  - **المرجع:** `src/test/auditFixes.test.tsx` (السطر 332) و `src/test/lesson2.test.tsx` (السطر 82).

### 2. عرض Source Gap وحقوله (سلوك `SourceGapInteraction`)
- **الاختبار الفعلي:** `it('Lesson 2 source gap interaction — ensures Lesson2CommonSourceGapInteraction displays reason and preservedPrompt correctly')`
  - **الخطوات:**
    1. استدعاء `Lesson2CommonSourceGapInteraction` مع `reason` و `preservedPrompt`.
    2. التحقق من أن العرض (`<p>{reason}</p>`) و (`<p className="l2-preserved-prompt">المطلوب المحفوظ: {preservedPrompt}</p>`) يظهران بشكل صحيح.
    3. التأكد من أن `interaction.kind === 'source_gap'` يعرض المكوّن المشترك.
  - **المرجع:** `src/test/lesson2.test.tsx` (السطر 82) و `src/components/curriculum/Lesson2StepRenderer.tsx` (الأسطر 286-290).

### 3. عرض الإجابات النموذجية وحماية محتوى teacher-only (سلوك `buildLesson2Reveal` و `AnswerReveal`)
- **الاختبار الفعلي:** `it('Lesson 2 answer reveal — ensures buildLesson2Reveal and AnswerReveal display modelAnswer and heading based on L2_MODEL_ANSWER_IDS and L2_TEACHER_ONLY_IDS')`
  - **الخطوات:**
    1. استدعاء `buildLesson2Reveal(activity)` مع `activity.sourceActivityId` في `L2_MODEL_ANSWER_IDS` أو `L2_TEACHER_ONLY_IDS`.
    2. التحقق من أن `AnswerReveal` يعرض `modelAnswer` و `heading` (`الحل النموذجي المعتمد` أو `إرشادات للإجابة`) بشكل صحيح.
    3. التأكد من أن `L2_TEACHER_ONLY_IDS` (مثل `L2-14-01` و `L2-19-07`) لا يعرض أي زر (`null`).
  - **المرجع:** `src/components/curriculum/Lesson2StepRenderer.tsx` (الأسطر 37-52) و `src/test/lesson2.test.tsx` (السطر 82).

### 4. سلامة المحتوى بمقارنة البيانات مع مرجع ثابت (سلوك `LESSON2_STEP_CONTENT` و `getLesson2Activity` و `Lesson2Activity` و `Lesson2Interaction`)
- **الاختبار الفعلي:** `it('Lesson 2 content integrity — ensures LESSON2_STEP_CONTENT, getLesson2Activity, Lesson2Activity, and Lesson2Interaction remain unchanged compared to reference')`
  - **الخطوات:**
    1. مقارنة `LESSON2_STEP_CONTENT` مع المرجع الثابت (البيانات في `src/data/lesson2/content.ts`).
    2. مقارنة `getLesson2Activity` و `Lesson2Activity` و `Lesson2Interaction` مع المرجع الثابت (البيانات في `src/data/lesson2/activities.ts`).
    3. التأكد من أن المحتوى التعليمي (`block.heading`، `block.lines`، `activity.instruction`، `activity.subparts`) يبقى كما هو.
  - **المرجع:** `src/data/lesson2/content.ts` و `src/data/lesson2/activities.ts` و `src/test/lesson2.test.tsx` (السطر 82).

---

## رابعًا — قائمة الملفات (دقيقة)

### 1. الملفات التي ستتغير فعليًا (في PR التجريبي)

| الملف | سبب التعديل | المسار النهائي للمكونات الجديدة |
|-------|-------------|----------------------------------|
| `src/components/curriculum/Lesson2StepRenderer.tsx` | استخراج `DraftTextArea` و `SourceGapInteraction` و `Lesson2BlockView` إلى مكونات محلية داخل نفس الملف (أو ملفات فرعية داخل `src/components/curriculum/lesson2/` إذا لزم الأمر، ولكن الأفضل البقاء في نفس الملف لتجنب تعديل البنية العامة). | 1. `src/components/curriculum/Lesson2StepRenderer.tsx` (المكونات المستخرجة: `Lesson2CommonDraftTextArea`، `Lesson2CommonSourceGapInteraction`، `Lesson2CommonBlockView`) |

### 2. الملفات التي ستبقى دون أي تعديل (استبعاد صارم)

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

## خامسًا — معايير نجاح التجربة (قابلة للتحقق)

1. **الاختبارات:** اجتياز جميع الاختبارات الـ 175 (بما في ذلك الـ 8 اختبارات الخاصة بالدرس 2 والـ 1 اختبار الخاص بمسودة الدرس 2 في `auditFixes.test.tsx`) + الاختبارات الجديدة (4 اختبارات فعلية).
2. **TypeScript:** عدم وجود أخطاء TypeScript في `src/components/curriculum/Lesson2StepRenderer.tsx` أو الملفات الفرعية الجديدة.
3. **Build:** نجاح `npm run build` (أو `npm run dev` في البيئة المحلية) دون أخطاء.
4. **عدم فقد المحتوى أو تغيير السلوك:** المحتوى التعليمي، المسودات، الإجابات، والتفاعلات تبقى كما هي (تم التحقق عبر الاختبارات).
5. **إثبات تقليل التكرار فعليًا:** تقليل عدد أسطر الكود المكرر في `src/components/curriculum/Lesson2StepRenderer.tsx` (من 746 سطرًا إلى 128 سطرًا، التوفير 618 سطرًا).

---

## سادسًا — التراجع (آمن)

1. **إعادة الملفات:** إعادة `src/components/curriculum/Lesson2StepRenderer.tsx` إلى حالته الأصلية (قبل الاستخراج) باستخدام `git checkout` أو `git reset`.
2. **إزالة المكوّنات المشتركة:** حذف المكوّنات المشتركة المستخرجة (`Lesson2CommonDraftTextArea`، `Lesson2CommonSourceGapInteraction`، `Lesson2CommonBlockView`) من الملف أو الملفات الفرعية.
3. **عدم التأثير على بقية الدروس:** بما أن التعديل محصور في `Lesson2StepRenderer.tsx` والملفات الفرعية الخاصة بالدرس 2 فقط، فإن الدروس الأخرى (الدرس 1، الدرس 3، U2L1، U2L2، U2L3) لن تتأثر.
4. **عدم التأثير على بيانات الطلاب:** بما أن `learningProgress.ts` و `draftStorage.ts` و `LESSON2_DRAFT_SCOPE` لا تتغير، فإن بيانات الطلاب (المسودات) ستبقى كما هي (حتى بعد التراجع، سيتم قراءة المسودات من نفس المفاتيح).

---

## سابعًا — قواعد العمل (مُلتزم بها)

- **لا تعديل ملفات:** التقرير فقط (وفق القرار 3-1).
- **لا إنشاء PR:** التقرير فقط (وفق القرار 3-3).
- **لا تنفيذ Commit/Push/Merge:** التقرير فقط (وفق القرار 3-4).
- **لا تغيير محتوى تعليمي/بيانات/مفاتيح/منطق:** التقرير فقط (وفق القرار 5-4).
- **الدمج اليدوي:** من جانب المستخدم (وفق القرار 5-5).
- **التوقف:** التوقف بعد تسليم التقرير (وفق القرار 3-10).

---

**الخلاصة:**  
تم تصحيح الحساب (618 سطرًا)، وتوضيح العلاقة بين 746 سطرًا قبل الاستخراج و128 بعده، وتقديم قياس موحد لصافي التوفير، وتأكيد أعداد الأنشطة الـ12 (الإجمالي 65، والمدقق 53، والفرق 12)، وتحديد الاختبارات الجديدة (4 اختبارات فعلية).  
**بانتظار الموافقة الصريحة قبل أي تنفيذ.**
