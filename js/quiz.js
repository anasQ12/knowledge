/* ============================================================
   quiz.js — منطق الاختبار. لا حاجة لتعديل هذا الملف؛
   الأسئلة والنتائج في questions.js.
   ============================================================ */

(function () {
  const ORDER = ["A", "B", "C", "D"];

  /* قائمة مسطّحة بكل الأسئلة مع قسم كل سؤال */
  const FLAT = [];
  ORDER.forEach((sec) => {
    QUESTIONS[sec].forEach((q, i) => FLAT.push({ sec, index: i, q }));
  });
  const TOTAL = FLAT.length;

  /* الحالة */
  let screen = "intro";      // intro | section | question | result
  let pos = 0;
  const answers = new Array(TOTAL).fill(null); // true = نعم, false = لا

  const root = document.getElementById("quiz");

  function sectionOf(p) { return FLAT[p].sec; }
  function letter(sec) { return SECTION_LETTERS[sec]; }
  function sectionSize(sec) { return QUESTIONS[sec].length; }

  function arNum(n) {
    return String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  }

  function render() {
    if (screen === "intro") return renderIntro();
    if (screen === "section") return renderSection();
    if (screen === "question") return renderQuestion();
    if (screen === "result") return renderResult();
  }

  /* ---------- الشاشات ---------- */

  function renderIntro() {
    root.innerHTML = `
      <div class="quiz-card">
        <div class="result-badge" aria-hidden="true">
          <i class="fill-a"></i><i class="fill-b"></i>
        </div>
        <h1>${t("quiz.title")}</h1>
        <p class="lead">${t("quiz.intro")}</p>
        <button class="btn btn-primary" id="startBtn">${t("quiz.start")}</button>
      </div>`;
    document.getElementById("startBtn").addEventListener("click", () => {
      screen = "section";
      render();
    });
  }

  function renderSection() {
    const sec = sectionOf(pos);
    root.innerHTML = `
      <div class="quiz-card">
        ${progressBar()}
        <div class="section-intro-mark sec-${sec.toLowerCase()}">${letter(sec)}</div>
        <h1>${t("section." + sec)}</h1>
        <button class="btn btn-primary" id="contBtn">${t("quiz.continue")}</button>
      </div>`;
    document.getElementById("contBtn").addEventListener("click", () => {
      screen = "question";
      render();
    });
  }

  function renderQuestion() {
    const item = FLAT[pos];
    const sec = item.sec;
    root.innerHTML = `
      <div class="quiz-card">
        ${progressBar()}
        <span class="section-chip sec-${sec.toLowerCase()}">${t("section." + sec)}</span>
        <div class="q-count">${t("quiz.question")} ${arNum(item.index + 1)} ${t("quiz.of")} ${arNum(sectionSize(sec))}</div>
        <div class="q-text">${item.q}</div>
        <div class="answer-row">
          <button class="btn-answer btn-yes" id="yesBtn">${t("quiz.yes")}</button>
          <button class="btn-answer btn-no" id="noBtn">${t("quiz.no")}</button>
        </div>
        <div class="quiz-footer">
          <button class="btn-back" id="backBtn" ${pos === 0 ? "hidden" : ""}>${t("quiz.back")}</button>
        </div>
      </div>`;

    document.getElementById("yesBtn").addEventListener("click", () => answer(true));
    document.getElementById("noBtn").addEventListener("click", () => answer(false));
    const back = document.getElementById("backBtn");
    if (back) back.addEventListener("click", goBack);
  }

  function answer(val) {
    answers[pos] = val;
    if (pos === TOTAL - 1) {
      screen = "result";
      render();
      return;
    }
    const prevSec = sectionOf(pos);
    pos += 1;
    if (sectionOf(pos) !== prevSec) {
      screen = "section"; /* فاصل قبل القسم الجديد */
    }
    render();
  }

  function goBack() {
    if (pos === 0) return;
    pos -= 1;
    screen = "question";
    render();
  }

  function progressBar() {
    const done = answers.filter((a) => a !== null).length;
    const pct = Math.round((done / TOTAL) * 100);
    return `<div class="progress-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-fill" style="width:${pct}%"></div>
            </div>`;
  }

  /* ---------- النتائج ---------- */

  function computeScores() {
    const scores = { A: 0, B: 0, C: 0, D: 0 };
    FLAT.forEach((item, i) => { if (answers[i] === true) scores[item.sec] += 1; });
    return scores;
  }

  function topTwo(scores) {
    /* الترتيب حسب النتيجة تنازليًا؛ وعند التعادل حسب ترتيب الأقسام (A قبل B).
       القسمان A و C متضادان، وكذلك B و D؛ فإذا كان الثاني ضد الأول
       يُتجاوز ويُؤخذ القسم الثالث (لا توجد نتائج AC/CA/BD/DB). */
    const OPPOSITE = { A: "C", C: "A", B: "D", D: "B" };
    const sorted = [...ORDER].sort((x, y) => scores[y] - scores[x] || x.localeCompare(y));
    const first = sorted[0];
    const second = sorted[1] === OPPOSITE[first] ? sorted[2] : sorted[1];
    return [first, second];
  }

  function renderResult() {
    const scores = computeScores();
    const [first, second] = topTwo(scores);
    const code = first + second;
    const p = PERSONALITIES[code];

    const bars = ORDER.map((sec) => `
      <div class="score-row">
        <span>${t("section." + sec)}</span>
        <span class="bar"><b class="fill-${sec.toLowerCase()}" style="width:${(scores[sec] / sectionSize(sec)) * 100}%"></b></span>
        <span>${arNum(scores[sec])}</span>
      </div>`).join("");

    root.innerHTML = `
      <div class="quiz-card">
        <p class="result-code">${t("result.heading")}</p>
        <div class="result-badge" aria-hidden="true">
          <i class="fill-${first.toLowerCase()}">${letter(first)}</i>
          <i class="fill-${second.toLowerCase()}">${letter(second)}</i>
        </div>
        <h1 class="result-title"><bdi dir="ltr">${letter(first)}${letter(second)}</bdi> — ${p.title}</h1>
        <p class="result-desc">${p.desc}</p>
        <h2 style="font-size:1.1rem;margin-bottom:1rem;">${t("result.scores")}</h2>
        <div class="score-list">${bars}</div>
        <div class="answer-row">
          <button class="btn btn-primary" id="retakeBtn">${t("result.retake")}</button>
          <a class="btn btn-ghost" href="index.html">${t("result.home")}</a>
        </div>
      </div>`;

    document.getElementById("retakeBtn").addEventListener("click", () => {
      answers.fill(null);
      pos = 0;
      screen = "intro";
      render();
    });
  }

  document.addEventListener("DOMContentLoaded", render);
})();
