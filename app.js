// Kawerify Learn Platform Core Application logic
// (C) 2026 Kawerify Tech (kawerifytech.com)

const appState = {
  theme: "dark",
  mode: "dev", // dev vs kid
  activeTab: "learn",
  curriculumLang: "react",
  generatorLang: "react",
  generatorTemplateIdx: 0,
  activeLicense: "mit",
  licenseYear: "2026",
  licenseOwner: "Kawerify Tech (kawerifytech.com)",
  legalDoc: "privacy",
  completedLessons: {} // maps lang_lesson => boolean
};


const DOM = {
  kidToggle: null,
  themeToggle: null,
  navBtns: [],
  tabContents: [],
  currLangSelect: null,
  lessonSearchInput: null,
  currViewTarget: null,
  genLangSelect: null,
  genOptsTarget: null,
  genFileName: null,
  genBtnCopy: null,
  genBtnPlayground: null,
  genCodeTarget: null,
  playBtnDownload: null,
  playBtnRun: null,
  playCodeEditor: null,
  playPreviewFrame: null,
  playTerminal: null,
  playTerminalBody: null,
  licSearchInput: null,
  licListTarget: null,
  licNameTitle: null,
  licBtnCopy: null,
  licTextTarget: null,
  licYearInput: null,
  licOwnerInput: null,
  legDocBtns: [],
  legContentTarget: null,
  resetProgressBtn: null,
  helpBtn: null,
  helpCard: null,
  helpCloseBtn: null
};

function cacheDOM() {
  DOM.kidToggle = document.getElementById("kid-toggle-btn");
  DOM.themeToggle = document.getElementById("theme-toggle-btn");
  DOM.navBtns = document.querySelectorAll(".nav-item");
  DOM.tabContents = document.querySelectorAll(".tab-content");
  DOM.currLangSelect = document.getElementById("curriculum-lang-select");
  DOM.lessonSearchInput = document.getElementById("lesson-search-input");
  DOM.currViewTarget = document.getElementById("curriculum-view-target");
  DOM.genLangSelect = document.getElementById("generator-lang-select");
  DOM.genOptsTarget = document.getElementById("generator-opts-target");
  DOM.genFileName = document.getElementById("generator-code-filename");
  DOM.genBtnCopy = document.getElementById("generator-btn-copy");
  DOM.genBtnPlayground = document.getElementById("generator-btn-playground");
  DOM.genCodeTarget = document.getElementById("generator-code-target");
  DOM.playBtnDownload = document.getElementById("playground-btn-download");
  DOM.playBtnRun = document.getElementById("playground-btn-run");
  DOM.playCodeEditor = document.getElementById("playground-code-editor");
  DOM.playPreviewFrame = document.getElementById("playground-preview-frame");
  DOM.playTerminal = document.getElementById("playground-terminal");
  DOM.playTerminalBody = document.getElementById("playground-terminal-body");
  DOM.licSearchInput = document.getElementById("license-search-input");
  DOM.licListTarget = document.getElementById("license-list-target");
  DOM.licNameTitle = document.getElementById("license-name-title");
  DOM.licBtnCopy = document.getElementById("license-btn-copy");
  DOM.licTextTarget = document.getElementById("license-text-target");
  DOM.licYearInput = document.getElementById("license-year-input");
  DOM.licOwnerInput = document.getElementById("license-owner-input");
  DOM.legDocBtns = document.querySelectorAll("[data-legal]");
  DOM.legContentTarget = document.getElementById("legal-content-target");
  DOM.resetProgressBtn = document.getElementById("reset-progress-btn");
  DOM.helpBtn = document.getElementById("help-popover-btn");
  DOM.helpCard = document.getElementById("help-popover-card");
  DOM.helpCloseBtn = document.getElementById("help-popover-close");
}

function initEventListeners() {
  DOM.navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      switchTab(tab);
    });
  });
  
  DOM.themeToggle.addEventListener("click", toggleTheme);
  DOM.kidToggle.addEventListener("click", toggleKidMode);
  DOM.currLangSelect.addEventListener("change", (e) => {
    appState.curriculumLang = e.target.value;
    renderCurriculum();
  });
  
  DOM.lessonSearchInput.addEventListener("input", renderCurriculum);
  
  DOM.genLangSelect.addEventListener("change", (e) => {
    appState.generatorLang = e.target.value;
    appState.generatorTemplateIdx = 0;
    renderGenerator();
  });
  
  DOM.genBtnCopy.addEventListener("click", () => {
    copyToClipboard(DOM.genCodeTarget.innerText);
  });
  
  DOM.genBtnPlayground.addEventListener("click", sendToPlayground);
  DOM.playBtnRun.addEventListener("click", runPlaygroundCode);
  DOM.playBtnDownload.addEventListener("click", downloadCodeFile);
  
  DOM.licSearchInput.addEventListener("input", renderLicenseList);
  DOM.licBtnCopy.addEventListener("click", () => {
    copyToClipboard(DOM.licTextTarget.innerText);
  });
  
  DOM.licYearInput.addEventListener("input", (e) => {
    appState.licenseYear = e.target.value;
    renderLicenseText();
  });
  
  DOM.licOwnerInput.addEventListener("input", (e) => {
    appState.licenseOwner = e.target.value;
    renderLicenseText();
  });
  
  DOM.legDocBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      DOM.legDocBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const doc = btn.getAttribute("data-legal");
      appState.legalDoc = doc;
      renderLegalDoc();
    });
  });
  
  DOM.resetProgressBtn.addEventListener("click", resetProgress);
  DOM.helpBtn.addEventListener("click", () => DOM.helpCard.style.display = "block");
  DOM.helpCloseBtn.addEventListener("click", () => DOM.helpCard.style.display = "none");
}

function switchTab(tab) {
  appState.activeTab = tab;
  DOM.navBtns.forEach(btn => {
    if (btn.getAttribute("data-tab") === tab) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  
  DOM.tabContents.forEach(content => {
    if (content.id === `tab-${tab}`) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });
  saveToLocalStorage();
}

function toggleTheme() {
  if (appState.theme === "dark") {
    appState.theme = "light";
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    DOM.themeToggle.innerText = "🌙 Dark Mode";
  } else {
    appState.theme = "dark";
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    DOM.themeToggle.innerText = "☀️ Light Mode";
  }
  saveToLocalStorage();
}

function toggleKidMode() {
  if (appState.mode === "dev") {
    appState.mode = "kid";
    document.body.classList.remove("dev-mode");
    document.body.classList.add("kid-mode");
    DOM.kidToggle.innerText = "👨‍💻 Dev Mode";
  } else {
    appState.mode = "dev";
    document.body.classList.remove("kid-mode");
    document.body.classList.add("dev-mode");
    DOM.kidToggle.innerText = "🧒 Kid Mode";
  }
  renderCurriculum();
  saveToLocalStorage();
}

function renderCurriculum() {
  const langKey = appState.curriculumLang;
  const lang = window.curriculum[langKey];
  if (!lang) return;
  
  const searchVal = DOM.lessonSearchInput.value.toLowerCase();
  
  let html = `
    <div class="mascot-banner">
      <div class="mascot-avatar">${lang.mascotEmoji}</div>
      <div>
        <h2 style="margin:0; color:${lang.color}">${lang.title} Lesson Space</h2>
        <p style="margin:5px 0 0 0; color:var(--text-muted);">Hi! I'm <strong>${lang.mascot}</strong>, and I will help you learn today!</p>
      </div>
    </div>
  `;
  
  // Progress Bar
  const totalLessons = lang.lessons.length;
  let completed = 0;
  for(let i=0; i<totalLessons; i++) {
    if (appState.completedLessons[`${langKey}_${i}`]) completed++;
  }
  const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  html += `
    <div style="background-color:var(--bg-panel); border:2px solid var(--border-color); border-radius:var(--border-radius); padding:10px 15px; margin-bottom:20px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-weight:bold; font-size:0.9rem;">
        <span>Progress Tracker</span>
        <span>${percent}% Completed (${completed}/${totalLessons})</span>
      </div>
      <div style="background:#475569; height:12px; border-radius:10px; overflow:hidden;">
        <div style="background:var(--accent-green); height:100%; width:${percent}%; transition:width 0.3s ease;"></div>
      </div>
    </div>
  `;
  
  // Lessons
  let renderedLessonsCount = 0;
  lang.lessons.forEach((lesson, index) => {
    if (searchVal && !lesson.title.toLowerCase().includes(searchVal) && !lesson.kid.toLowerCase().includes(searchVal) && !lesson.dev.toLowerCase().includes(searchVal)) {
      return;
    }
    renderedLessonsCount++;
    const isCompleted = appState.completedLessons[`${langKey}_${index}`];
    
    html += `
      <div class="lesson-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 class="lesson-title" style="color:${lang.color}">${index + 1}. ${lesson.title}</h3>
          <button class="btn-action" style="padding:4px 8px; font-size:0.75rem; background-color:${isCompleted ? 'var(--accent-green)' : '#64748b'}" onclick="toggleLessonComplete('${langKey}', ${index})">
            ${isCompleted ? '✅ Finished' : '📖 Mark Read'}
          </button>
        </div>
        <div class="explanation-box">
          <p><strong>${appState.mode === 'kid' ? '🧒 Simple analogy:' : '👨‍💻 Detailed definition:'}</strong></p>
          <p style="font-size:1.05rem;">${appState.mode === 'kid' ? lesson.kid : lesson.dev}</p>
        </div>
      </div>
    `;
  });
  
  if (renderedLessonsCount === 0) {
    html += `<p style="text-align:center; color:var(--text-muted);">No lessons matched your search.</p>`;
  }
  
  // Quiz
  html += `
    <div class="quiz-section">
      <h3 style="margin-top:0; color:var(--accent-yellow)">📝 Quiz Challenge</h3>
      <div id="quiz-container-target"></div>
    </div>
  `;
  
  DOM.currViewTarget.innerHTML = html;
  renderQuiz();
}

window.toggleLessonComplete = function(lang, index) {
  const key = `${lang}_${index}`;
  if (appState.completedLessons[key]) {
    delete appState.completedLessons[key];
  } else {
    appState.completedLessons[key] = true;
    triggerConfetti();
  }
  saveToLocalStorage();
  renderCurriculum();
}

let activeQuizAnswers = {};

function renderQuiz() {
  const langKey = appState.curriculumLang;
  const lang = window.curriculum[langKey];
  const qTarget = document.getElementById("quiz-container-target");
  if (!lang || !qTarget) return;
  
  let html = "";
  lang.quizzes.forEach((quiz, qIdx) => {
    const answeredIdx = activeQuizAnswers[`${langKey}_${qIdx}`];
    const isCorrect = answeredIdx === quiz.correct;
    
    html += `
      <div style="margin-bottom: 20px; border-bottom:1px solid var(--border-color); padding-bottom:15px;">
        <p style="font-weight:bold; font-size:1.05rem;">Question ${qIdx + 1}: ${quiz.q}</p>
        <div class="quiz-options">
    `;
    
    quiz.a.forEach((opt, oIdx) => {
      let extraStyle = "";
      if (answeredIdx !== undefined) {
        if (oIdx === quiz.correct) {
          extraStyle = "background-color:rgba(16, 185, 129, 0.2); border-color:var(--accent-green);";
        } else if (oIdx === answeredIdx) {
          extraStyle = "background-color:rgba(239, 68, 68, 0.2); border-color:#ef4444;";
        }
      }
      
      html += `
        <button class="option-btn" style="${extraStyle}" onclick="answerQuiz('${langKey}', ${qIdx}, ${oIdx})" ${answeredIdx !== undefined ? 'disabled' : ''}>
          ${opt}
        </button>
      `;
    });
    
    html += `</div>`;
    
    if (answeredIdx !== undefined) {
      html += `
        <div style="margin-top:10px; font-weight:500; color:${isCorrect ? 'var(--accent-green)' : '#ef4444'}">
          ${isCorrect ? '🎉 Correct! ' + (appState.mode === 'kid' ? quiz.kidFeedback : quiz.devFeedback) : '❌ Try again next time!'}
        </div>
      `;
    }
    
    html += `</div>`;
  });
  
  qTarget.innerHTML = html;
}

window.answerQuiz = function(langKey, qIdx, oIdx) {
  const lang = window.curriculum[langKey];
  const quiz = lang.quizzes[qIdx];
  activeQuizAnswers[`${langKey}_${qIdx}`] = oIdx;
  
  if (oIdx === quiz.correct) {
    triggerConfetti();
  }
  renderQuiz();
}

function triggerConfetti() {
  // Create quick visual animation bubble
  const box = document.createElement("div");
  box.style.position = "fixed";
  box.style.top = "50%";
  box.style.left = "50%";
  box.style.transform = "translate(-50%, -50%)";
  box.style.fontSize = "5rem";
  box.style.pointerEvents = "none";
  box.style.zIndex = "9999";
  box.innerText = "🎉✨🥳";
  box.style.animation = "float-away 1.5s forwards";
  
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    @keyframes float-away {
      0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
      100% { opacity: 0; transform: translate(-50%, -80%) scale(1.5); }
    }
  `;
  document.head.appendChild(styleEl);
  document.body.appendChild(box);
  setTimeout(() => {
    box.remove();
    styleEl.remove();
  }, 1500);
}

function renderGenerator() {
  const langKey = appState.generatorLang;
  const templatesList = window.templates[langKey];
  const target = DOM.genOptsTarget;
  if (!templatesList || !target) return;
  
  let html = `
    <h3 style="margin-top:0;">1. Choose Template</h3>
    <div style="display:flex; flex-direction:column; gap:8px;">
  `;
  
  templatesList.forEach((temp, index) => {
    html += `
      <button class="option-btn ${appState.generatorTemplateIdx === index ? 'active' : ''}" style="width:100%; font-weight:bold; ${appState.generatorTemplateIdx === index ? 'border-color:var(--accent-blue); background:rgba(14, 165, 233, 0.1);' : ''}" onclick="selectTemplate(${index})">
        ${temp.name}
        <div style="font-size:0.8rem; font-weight:normal; color:var(--text-muted); margin-top:2px;">${temp.description}</div>
      </button>
    `;
  });
  
  html += `
    </div>
    <h3 style="margin-top:20px;">2. Customize Variables</h3>
    <div style="display:flex; flex-direction:column; gap:12px;" id="generator-variables-target">
  `;
  
  const activeTemp = templatesList[appState.generatorTemplateIdx];
  if (activeTemp && activeTemp.params) {
    activeTemp.params.forEach(param => {
      const val = param.default;
      html += `
        <div class="input-field">
          <label>${param.name}</label>
          <input type="${param.type}" id="param-${param.id}" value="${val}" oninput="compileGeneratedCode()">
        </div>
      `;
    });
  }
  
  html += `</div>`;
  target.innerHTML = html;
  
  // Set Filename
  const ext = langKey === "react" ? "jsx" : langKey === "python" ? "py" : langKey === "c" ? "c" : langKey === "php" ? "php" : langKey === "javascript" ? "js" : "html";
  DOM.genFileName.innerText = `component.${ext}`;
  
  compileGeneratedCode();
}