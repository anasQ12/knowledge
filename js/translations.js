/* ============================================================
   translations.js — كل نصوص الواجهة. لتعديل أي عبارة عدّل هنا فقط.
   ============================================================ */

const TEXT = {
  "site.name": "معرفة",
  "nav.home": "الرئيسية",
  "nav.test": "اعرف نفسك",
  "hero.eyebrow": "معرفة الذات والتطوير",
  "hero.title": "تعرّف على الشخص الذي <em>أنت عليه فعلًا</em>.",
  "hero.subtitle": "معرفة ركن هادئ على الإنترنت لفهم نفسك بشكل أفضل — يبدأ باختبار بسيط يعكس لك أقوى جانبين في شخصيتك.",
  "hero.cta": "ابدأ اختبار اعرف نفسك",
  "pages.title": "استكشف",
  "card.test.title": "اعرف نفسك",
  "card.test.desc": "أربعة أقسام، ٥٦ سؤالًا بنعم أو لا. أعلى نتيجتين تكشفان مزيج شخصيتك.",
  "card.soon.title": "المزيد قريبًا",
  "card.soon.desc": "ستظهر هنا صفحات جديدة عن تطوير الذات والعادات والتأمل مع نمو الموقع.",
  "footer.text": "صُنع بعناية · معرفة",

  "quiz.title": "اعرف نفسك",
  "quiz.intro": "يتكوّن الاختبار من ٤ أقسام — A ،B ،C ،D — في كل قسم ١٤ سؤالًا بنعم أو لا. أجب بصدق؛ لا توجد إجابات صحيحة. في النهاية، القسمان الأعلى نتيجة يشكّلان مزيج شخصيتك.",
  "quiz.start": "ابدأ الاختبار",
  "quiz.continue": "متابعة",
  "quiz.yes": "نعم",
  "quiz.no": "لا",
  "quiz.back": "→ العودة إلى السؤال السابق",
  "quiz.question": "سؤال",
  "quiz.of": "من",
  "result.heading": "شخصيتك هي",
  "result.scores": "نتائجك",
  "result.retake": "أعد الاختبار",
  "result.home": "العودة إلى الرئيسية",

  "section.A": "القسم A",
  "section.B": "القسم B",
  "section.C": "القسم C",
  "section.D": "القسم D"
};

const SECTION_LETTERS = { A: "A", B: "B", C: "C", D: "D" };

function t(key) {
  return TEXT[key] || key;
}

function applyText() {
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.innerHTML = t(el.getAttribute("data-i18n"));
  });
}

document.addEventListener("DOMContentLoaded", applyText);
