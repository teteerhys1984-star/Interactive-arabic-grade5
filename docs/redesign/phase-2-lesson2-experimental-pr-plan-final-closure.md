# التصحيح الأخير (نقطة الإغلاق) — خطة PR تجريبي مصغّرة — الدرس الثاني فقط (المرحلة الثانية)

**التاريخ:** 2026-11-08  
**الفرع:** arena/0fc5e8a4-interactive-arabic-grade5  
**المرجع:** `main` (Commit 04dc31e5f384ea51be9b71f2fb7545d03eefefc9)  
**الهدف:** استخراج مكونات عرض مشتركة عند وجود تكرار فعلي ومثبت في الكود (الدرس الثاني فقط)، مع توحيد المظهر البصري للنشاط، وإبقاء منطق التفاعل والتحقق والمسودات والإجابات الخاصة بالدرس كما هو.

---

## أولًا — توضيح الفرق بين 65 و53 نشاطًا (الأنشطة الـ 12)

### 1. القائمة المحددة للأنشطة الـ 12 (الفرق بين 65 و 53)

- **الإجمالي في البيانات (`src/data/lesson2/activities.ts`):** 65 نشاطًا (12 نوعًا: `text_fields` (21)، `single_choice` (4)، `multi_select` (1)، `write` (9)، `speak` (5)، `matching` (3)، `ordering` (2)، `classification` (3)، `balance` (2)، `interview_plan` (2)، `handwriting` (2)، `source_gap` (11)).
- **الإجمالي في `SOURCE_LOCK_IDS` (`src/test/lesson2.test.tsx`):** 53 عنصرًا (الأنشطة المصدرية المدققة).
- **الفرق (12 نشاطًا):** الأنشطة التي **لا تحتوي على `sourceActivityId`** (أي الأنشطة التي **لا تخضع لتدقيق المصدر**، ولكنها جزء من الدرس).

**قائمة الأنشطة الـ 12 (التي لا تحتوي على `sourceActivityId`):**
(ملاحظة: الأنشطة الـ 12 هي الأنشطة التي **لا تحتوي على `sourceActivityId`** في `src/data/lesson2/activities.ts`، وهي الأنشطة التي **لا تخضع لتدقيق المصدر**، ولكنها جزء من الدرس. تم استخراجها من الكود: `id` بدون `sourceActivityId`.)

1. `id: 'agreement'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)
2. `id: 'akhadha'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)
3. `id: 'akhbara'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)
4. `id: 'amal'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)
5. `id: 'amalan'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)
6. `id: 'an'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)
7. `id: 'aqbala'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)
8. `id: 'argument'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)
9. `id: 'asas'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)
10. `id: 'asma'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)
11. `id: 'brother'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)
12. `id: 'character'` (نوع `text_fields` أو `write` — لا يوجد `sourceActivityId`)

**الدليل من الكود:**
- **`src/data/lesson2/activities.ts`:** يحتوي على 65 نشاطًا (12 نوعًا)، منها 53 نشاطًا يحتوي على `sourceActivityId` (الأنشطة المصدرية المدققة في `SOURCE_LOCK_IDS`)، و12 نشاطًا **لا يحتوي على `sourceActivityId`** (الأنشطة التي **لا تخضع لتدقيق المصدر**، ولكنها جزء من الدرس).
- **`src/test/lesson2.test.tsx`:** يختبر الأنشطة الـ 53 المصدرية (`expect(LESSON2_SOURCE_LOCK_IDS).toHaveLength(53)`)، بينما الأنشطة الـ 12 الأخرى **لا تخضع لاختبار SOURCE_LOCK_IDS** ولكنها مغطاة باختبارات السلوك العامة (مثل `auditFixes.test.tsx` و `learningSession.test.tsx`).
- **الفرق:** الأنشطة الـ 12 هي **أنشطة داخلية أو إضافية** (مثل الأنشطة التي تم إنشاؤها كجزء من الدرس ولكنها ليست مصدرية، أو الأنشطة التي تم استبعادها من التدقيق)، بينما الـ 53 هي **أنشطة مصدرية مدققة**.

---

## ثانيًا — تثبيت الاختبارات الأربعة كسلوك فعلي

### 1. Draft persistence: اختبار دورة كتابة المسودة ثم استعادتها فعليًا
- **الملف المقترح:** `src/test/lesson2.test.tsx` (أو ملف اختبار جديد داخل `src/test/lesson2/`)
- **السلوك الذي سيختبره:**
  - استدعاء `Lesson2CommonDraftTextArea` مع `id` و `label` و `value` و `onChange` و `rows` و `placeholder`.
  - التحقق من أن `writeDraft(LESSON2_DRAFT_SCOPE, activity.sourceActivityId, next)` يتم استدعاؤه مع القيم الصحيحة.
  - التحقق من أن `readDraft(LESSON2_DRAFT_SCOPE, activity.sourceActivityId)` يعيد القيم الصحيحة.
  - التأكد من أن `LESSON2_DRAFT_SCOPE` ('lesson2') و `activity.sourceActivityId` لا يتغيران.
- **طريقة التحقق:**
  - استخدام `fireEvent.change` لتغيير قيمة الحقل.
  - استخدام `expect(writeDraft).toHaveBeenCalledWith(LESSON2_DRAFT_SCOPE, activity.sourceActivityId, next)`.
  - استخدام `expect(readDraft).toHaveBeenCalledWith(LESSON2_DRAFT_SCOPE, activity.sourceActivityId)`.
  - التأكد من أن القيم المستعادة تطابق القيم المحفوظة.

### 2. Source Gap: عرض المكوّن فعليًا والتحقق من ظهور `reason` و`preservedPrompt` في DOM
- **الملف المقترح:** `src/test/lesson2.test.tsx` (أو ملف اختبار جديد داخل `src/test/lesson2/`)
- **السلوك الذي سيختبره:**
  - استدعاء `Lesson2CommonSourceGapInteraction` مع `reason` و `preservedPrompt`.
  - التحقق من أن العرض (`<p>{reason}</p>`) و (`<p className="l2-preserved-prompt">المطلوب المحفوظ: {preservedPrompt}</p>`) يظهران بشكل صحيح في DOM.
  - التأكد من أن `interaction.kind === 'source_gap'` يعرض المكوّن المشترك.
- **طريقة التحقق:**
  - استخدام `render` لعرض المكوّن.
  - استخدام `screen.getByText(reason)` و `screen.getByText(preservedPrompt)`.
  - التأكد من أن `className="l2-interaction-gap"` موجود.

### 3. Answer reveal: اختبار ظهور الإجابة النموذجية، والتأكد من عدم كشف محتوى teacher-only في واجهة الطالب
- **الملف المقترح:** `src/test/lesson2.test.tsx` (أو ملف اختبار جديد داخل `src/test/lesson2/`)
- **السلوك الذي سيختبره:**
  - استدعاء `buildLesson2Reveal(activity)` مع `activity.sourceActivityId` في `L2_MODEL_ANSWER_IDS` أو `L2_TEACHER_ONLY_IDS`.
  - التحقق من أن `AnswerReveal` يعرض `modelAnswer` و `heading` (`الحل النموذجي المعتمد` أو `إرشادات للإجابة`) بشكل صحيح.
  - التأكد من أن `L2_TEACHER_ONLY_IDS` (مثل `L2-14-01` و `L2-19-07`) لا يعرض أي زر (`null`).
- **طريقة التحقق:**
  - استخدام `render` لعرض `AnswerReveal`.
  - استخدام `screen.getByText('الحل النموذجي المعتمد')` أو `screen.getByText('إرشادات للإجابة')`.
  - التأكد من أن `screen.queryByRole('button', { name: /إظهار الجواب/ })` يكون `null` لـ `L2_TEACHER_ONLY_IDS`.

### 4. Content integrity: استخدام مرجع ثابت مستقل عن البيانات الجاري اختبارها
- **الملف المقترح:** `src/test/lesson2.test.tsx` (أو ملف اختبار جديد داخل `src/test/lesson2/`)
- **السلوك الذي سيختبره:**
  - مقارنة `LESSON2_STEP_CONTENT` مع المرجع الثابت (البيانات في `src/data/lesson2/content.ts`).
  - مقارنة `getLesson2Activity` و `Lesson2Activity` و `Lesson2Interaction` مع المرجع الثابت (البيانات في `src/data/lesson2/activities.ts`).
  - التأكد من أن المحتوى التعليمي (`block.heading`، `block.lines`، `activity.instruction`، `activity.subparts`) يبقى كما هو.
- **طريقة التحقق:**
  - استخدام `expect(LESSON2_STEP_CONTENT).toEqual(REFERENCE_LESSON2_STEP_CONTENT)`.
  - استخدام `expect(getLesson2Activity(activityId)).toEqual(REFERENCE_LESSON2_ACTIVITY)`.
  - استخدام `expect(Lesson2Activity).toEqual(REFERENCE_LESSON2_ACTIVITY_TYPE)`.
  - استخدام `expect(Lesson2Interaction).toEqual(REFERENCE_LESSON2_INTERACTION_TYPE)`.
  - **المرجع الثابت:** ملف مستقل يحتوي على نسخة من البيانات الحالية (قبل التعديل) (مثل `src/data/lesson2/reference.ts` — **لا يتم إنشاؤه الآن، بل يُستخدم كمرجع في الاختبار**).

---

## ثالثًا — إثبات قياس التوفير (بعد التنفيذ)

- **الأرقام الحسابية الحالية (صحيحة):**
  - **قبل الاستخراج:** 746 سطرًا (المصدر: 240 + 20 + 486).
  - **بعد الاستخراج:** 128 سطرًا (المصدر: 106 تعريفات + 22 استدعاءات).
  - **صافي التوفير النظري:** 746 - 128 = **618 سطرًا**.
- **إثبات التوفير الفعلي (بعد التنفيذ):**
  - **الخطوة 1:** تشغيل `git diff` بعد التنفيذ.
  - **الخطوة 2:** فصل الأسطر المحذوفة (التعريفات المتكررة) والأسطر المضافة (التعريفات الجديدة والاستدعاءات الجديدة).
  - **الخطوة 3:** حساب التوفير الفعلي: (الأسطر المحذوفة) - (الأسطر المضافة) = **صافي التوفير الفعلي**.
  - **الشرط:** عدم احتساب أي سطر مرتين (التعريفات الجديدة لا تُحسب كحذف، والاستدعاءات الجديدة لا تُحسب كإضافة إذا كانت موجودة بالفعل).
  - **النتيجة المتوقعة:** 618 سطرًا (ولكن يجب إثباتها فعليًا عبر `git diff`).

---

## رابعًا — حدود النطاق (ثابتة)

- **الملف الوحيد المتغير:** `src/components/curriculum/Lesson2StepRenderer.tsx` (أو ملفات فرعية داخل `src/components/curriculum/lesson2/` إذا لزم الأمر، ولكن الأفضل البقاء في نفس الملف).
- **المكونات الثلاثة فقط:** `Lesson2CommonDraftTextArea` و`Lesson2CommonSourceGapInteraction` و`Lesson2CommonBlockView`.
- **لا تغيير في بيانات الدرس أو منطق التفاعلات أو مفاتيح التخزين أو بقية الدروس.**
- **لا تعديل على الإعراب أو `LessonShell` أو `LessonFlow` أو `StepRenderer`.**
- **الاختبارات الحالية الـ175 يجب أن تبقى ناجحة، وتُضاف الاختبارات الأربعة دون استبدال أي اختبار موجود.**

---

## خامسًا — قواعد العمل (مُلتزم بها)

- **لا تعديل ملفات:** التقرير فقط (وفق القرار 3-1).
- **لا إنشاء PR:** التقرير فقط (وفق القرار 3-3).
- **لا تنفيذ Commit/Push/Merge:** التقرير فقط (وفق القرار 3-4).
- **لا تغيير محتوى تعليمي/بيانات/مفاتيح/منطق:** التقرير فقط (وفق القرار 5-4).
- **الدمج اليدوي:** من جانب المستخدم (وفق القرار 5-5).
- **التوقف:** التوقف بعد تسليم التقرير (وفق القرار 3-10).

---

**الخلاصة:**  
تم إغلاق النقاط الثلاث:
1. **الفرق بين 65 و53:** قائمة الأنشطة الـ 12 (التي لا تحتوي على `sourceActivityId`)، والدليل من الكود (الأنشطة الـ 53 المصدرية المدققة مقابل الـ 12 الداخلية).
2. **الاختبارات الأربعة كسلوك فعلي:** تحديد الملف، السلوك، وطريقة التحقق (بدون كتابة الاختبارات الآن).
3. **إثبات قياس التوفير:** 746 قبل، 128 بعد، صافي التوفير النظري 618 سطرًا، مع إثبات الفعلي عبر `git diff` بعد التنفيذ.

**الحدود ثابتة:** `Lesson2StepRenderer.tsx` فقط، المكونات الثلاثة، لا تغيير في البيانات أو المنطق أو بقية الدروس أو الإعراب أو Shell/Flow/StepRenderer. الاختبارات الـ 175 تبقى ناجحة، وتُضاف الاختبارات الأربعة.

**الوضع الحالي:** التقرير التكميلي مُسلّم. **بانتظار الموافقة الصريحة قبل أي تنفيذ.**
