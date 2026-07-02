/* =====================================================
   App logic — you shouldn't need to edit this file.
   Course content lives in content.js
===================================================== */

(function () {
  const STORAGE_KEY = "irg-handbook-progress";
  const WATCH_THRESHOLD = 0.9; // 90% watched unlocks the quiz

  const els = {
    railList: document.getElementById("railList"),
    railProgressFill: document.getElementById("railProgressFill"),
    railUser: document.getElementById("railUser"),
    railUserName: document.getElementById("railUserName"),
    startOverBtn: document.getElementById("startOverBtn"),
    screens: {
      welcome: document.getElementById("screen-welcome"),
      module: document.getElementById("screen-module"),
      final: document.getElementById("screen-final"),
      done: document.getElementById("screen-done"),
    },
    welcomeForm: document.getElementById("welcomeForm"),
    inputName: document.getElementById("inputName"),
    inputEmail: document.getElementById("inputEmail"),
    inputLocation: document.getElementById("inputLocation"),
    moduleEyebrow: document.getElementById("moduleEyebrow"),
    moduleTitle: document.getElementById("moduleTitle"),
    video: document.getElementById("moduleVideo"),
    videoHint: document.getElementById("videoHint"),
    unlockQuizBtn: document.getElementById("unlockQuizBtn"),
    quizPanel: document.getElementById("quizPanel"),
    quizForm: document.getElementById("quizForm"),
    quizFeedback: document.getElementById("quizFeedback"),
    submitQuizBtn: document.getElementById("submitQuizBtn"),
    finalHeading: document.getElementById("finalHeading"),
    finalBody: document.getElementById("finalBody"),
    portalLink: document.getElementById("portalLink"),
    finishBtn: document.getElementById("finishBtn"),
    finalNote: document.getElementById("finalNote"),
    doneName: document.getElementById("doneName"),
  };

  const modules = COURSE_CONFIG.modules;
  let state = loadState();
  let currentModuleIndex = 0;

  // ---------------- State persistence ----------------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { user: null, results: {}, completedAt: null };
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  // ---------------- Screen switching ----------------
  function showScreen(name) {
    Object.entries(els.screens).forEach(([key, el]) => {
      el.hidden = key !== name;
    });
  }

  // ---------------- Rail ----------------
  function renderRail() {
    els.railList.innerHTML = "";
    modules.forEach((m, i) => {
      const li = document.createElement("li");
      li.className = "rail-item";
      const passed = state.results[m.id] && state.results[m.id].passed;
      if (passed) li.classList.add("is-done");
      if (i === currentModuleIndex && !passed) li.classList.add("is-active");
      li.innerHTML = `
        <span class="rail-tag">${String(m.id).padStart(2, "0")}</span>
        <span class="rail-item-title">${escapeHtml(m.title)}</span>
      `;
      els.railList.appendChild(li);
    });
    const doneCount = modules.filter(m => state.results[m.id] && state.results[m.id].passed).length;
    els.railProgressFill.style.width = `${(doneCount / modules.length) * 100}%`;

    if (state.user && state.user.name) {
      els.railUser.hidden = false;
      els.railUserName.textContent = state.user.name;
    } else {
      els.railUser.hidden = true;
    }
  }

  // ---------------- Start over (shared-computer safety) ----------------
  els.startOverBtn.addEventListener("click", () => {
    const ok = window.confirm("Start over? This clears the current person's saved progress on this browser so the next person can begin fresh.");
    if (!ok) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state = { user: null, results: {}, completedAt: null };
    currentModuleIndex = 0;
    els.welcomeForm.reset();
    renderRail();
    showScreen("welcome");
  });

  // ---------------- Welcome ----------------
  els.welcomeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    state.user = {
      name: els.inputName.value.trim(),
      email: els.inputEmail.value.trim(),
      location: els.inputLocation.value.trim(),
      startedAt: new Date().toISOString(),
    };
    saveState();
    currentModuleIndex = 0;
    goToModule(0);
  });

  // ---------------- Module flow ----------------
  function goToModule(index) {
    currentModuleIndex = index;
    const m = modules[index];
    renderRail();
    showScreen("module");

    els.moduleEyebrow.textContent = `Module ${m.id} of ${modules.length}`;
    els.moduleTitle.textContent = m.title;

    // reset video
    els.video.src = m.video;
    els.video.currentTime = 0;
    els.videoHint.textContent = "Watch the full video to unlock the check-in questions.";
    els.videoHint.classList.remove("is-ready");
    els.unlockQuizBtn.disabled = true;
    els.unlockQuizBtn.textContent = "Watched it — Continue to check-in";

    els.quizPanel.hidden = true;
    els.quizFeedback.hidden = true;
    els.submitQuizBtn.style.display = "";
    els.submitQuizBtn.textContent = "Submit answers";

    let unlocked = false;
    function maybeUnlock() {
      if (unlocked) return;
      const pct = els.video.duration ? els.video.currentTime / els.video.duration : 0;
      if (pct >= WATCH_THRESHOLD) {
        unlocked = true;
        els.unlockQuizBtn.disabled = false;
        els.videoHint.textContent = "Nice — you're through the video. Continue when ready.";
        els.videoHint.classList.add("is-ready");
      }
    }
    els.video.ontimeupdate = maybeUnlock;
    els.video.onended = maybeUnlock;

    els.unlockQuizBtn.onclick = () => {
      renderQuiz(m);
      els.quizPanel.hidden = false;
      els.quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

  // ---------------- Quiz ----------------
  function renderQuiz(m) {
    els.quizForm.innerHTML = "";
    els.quizFeedback.hidden = true;
    els.submitQuizBtn.style.display = "";
    els.submitQuizBtn.textContent = "Submit answers";

    m.quiz.forEach((q, qi) => {
      const wrap = document.createElement("div");
      wrap.className = "quiz-question";
      wrap.dataset.qi = qi;
      const optionsHtml = q.options.map((opt, oi) => `
        <label class="quiz-option" data-oi="${oi}">
          <input type="radio" name="q${qi}" value="${oi}" required>
          <span>${escapeHtml(opt)}</span>
        </label>
      `).join("");
      wrap.innerHTML = `
        <p class="quiz-question-text">${qi + 1}. ${escapeHtml(q.question)}</p>
        <div class="quiz-options">${optionsHtml}</div>
      `;
      els.quizForm.appendChild(wrap);
    });
  }

  els.quizForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const m = modules[currentModuleIndex];
    let score = 0;
    const answers = [];

    m.quiz.forEach((q, qi) => {
      const selected = els.quizForm.querySelector(`input[name="q${qi}"]:checked`);
      const selectedIndex = selected ? parseInt(selected.value, 10) : -1;
      const correct = selectedIndex === q.correctIndex;
      if (correct) score++;
      answers.push(selectedIndex);

      const optionEls = els.quizForm.querySelectorAll(`.quiz-question[data-qi="${qi}"] .quiz-option`);
      optionEls.forEach((optEl) => {
        const oi = parseInt(optEl.dataset.oi, 10);
        optEl.classList.remove("is-correct", "is-incorrect");
        if (oi === q.correctIndex) optEl.classList.add("is-correct");
        else if (oi === selectedIndex) optEl.classList.add("is-incorrect");
      });
    });

    const passed = score >= COURSE_CONFIG.passingScore;
    const prevAttempts = (state.results[m.id] && state.results[m.id].attempts) || 0;

    state.results[m.id] = {
      attempts: prevAttempts + 1,
      lastScore: score,
      total: m.quiz.length,
      passed: passed || (state.results[m.id] && state.results[m.id].passed),
      completedAt: passed ? new Date().toISOString() : (state.results[m.id] && state.results[m.id].completedAt) || null,
    };
    saveState();
    renderRail();

    els.quizFeedback.hidden = false;
    if (passed) {
      els.quizFeedback.className = "quiz-feedback is-pass";
      els.quizFeedback.textContent = `${score}/${m.quiz.length} correct. Nice work.`;
      els.submitQuizBtn.textContent = currentModuleIndex === modules.length - 1 ? "Finish →" : "Continue →";
      els.submitQuizBtn.onclick = null;
      els.submitQuizBtn.type = "button";
      els.submitQuizBtn.onclick = (ev) => {
        ev.preventDefault();
        advance();
      };
    } else {
      els.quizFeedback.className = "quiz-feedback is-fail";
      els.quizFeedback.textContent = `${score}/${m.quiz.length} correct. Review the highlighted answers and try again.`;
      els.submitQuizBtn.type = "submit";
      els.submitQuizBtn.textContent = "Retry";
      els.submitQuizBtn.onclick = () => {
        setTimeout(() => renderQuiz(m), 0);
      };
    }
  });

  function advance() {
    if (currentModuleIndex < modules.length - 1) {
      goToModule(currentModuleIndex + 1);
    } else {
      showFinal();
    }
  }

  // ---------------- Final screen ----------------
  function showFinal() {
    renderRail();
    showScreen("final");
    els.finalHeading.textContent = COURSE_CONFIG.final.heading;
    els.finalBody.textContent = COURSE_CONFIG.final.body;
    els.portalLink.href = COURSE_CONFIG.final.portalUrl;
    els.portalLink.textContent = COURSE_CONFIG.final.portalLabel;
    els.finalNote.hidden = true;
    els.finishBtn.disabled = false;
    els.finishBtn.textContent = "Mark complete";
  }

  els.finishBtn.addEventListener("click", async () => {
    els.finishBtn.disabled = true;
    els.finalNote.hidden = false;
    els.finalNote.textContent = "Recording your completion…";

    state.completedAt = new Date().toISOString();
    saveState();

    try {
      await submitCompletion();
      els.finalNote.textContent = "Recorded.";
    } catch (err) {
      els.finalNote.textContent = "Recorded locally (couldn't reach the tracking sheet — check your connection).";
    }

    els.doneName.textContent = state.user ? state.user.name : "Manager";
    showScreen("done");
  });

  async function submitCompletion() {
    const url = COURSE_CONFIG.sheetWebhookUrl;
    if (!url || url.indexOf("PASTE_YOUR") === 0) return; // not configured yet

    const payload = {
      name: state.user.name,
      email: state.user.email,
      location: state.user.location,
      startedAt: state.user.startedAt,
      completedAt: state.completedAt,
      moduleScores: modules.map(m => {
        const r = state.results[m.id] || {};
        return `M${m.id}: ${r.lastScore ?? "-"}/${r.total ?? 3} (${r.attempts ?? 0} attempt${(r.attempts ?? 0) === 1 ? "" : "s"})`;
      }).join(" | "),
    };

    // text/plain avoids a CORS preflight against Apps Script web apps
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  }

  // ---------------- Utils ----------------
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------- Boot ----------------
  function boot() {
    // Visiting the link with ?reset=1 at the end clears saved progress
    // and starts fresh — e.g. https://irghospitality.github.io/manager-handbook/?reset=1
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1") {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      state = { user: null, results: {}, completedAt: null };
      window.history.replaceState({}, "", window.location.pathname);
    }

    renderRail();
    if (state.user && state.user.name) {
      els.inputName.value = state.user.name;
      els.inputEmail.value = state.user.email;
      els.inputLocation.value = state.user.location;
    }
    // Resume at the first not-yet-passed module if they already started
    if (state.user) {
      const firstIncomplete = modules.findIndex(m => !(state.results[m.id] && state.results[m.id].passed));
      if (firstIncomplete === -1) {
        showFinal();
      } else {
        goToModule(firstIncomplete);
      }
    } else {
      showScreen("welcome");
    }
  }

  boot();
})();
