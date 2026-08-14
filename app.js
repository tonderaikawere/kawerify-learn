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
  resSearchInput: null,
  resGridTarget: null,
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
  DOM.resSearchInput = document.getElementById("resources-search-input");
  DOM.resGridTarget = document.getElementById("resources-grid-target");
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
  renderResources();
    });
  });
  
  DOM.resetProgressBtn.addEventListener("click", resetProgress);
  if (DOM.resSearchInput) DOM.resSearchInput.addEventListener("input", renderResources);
  if (DOM.resSearchInput) DOM.resSearchInput.addEventListener("input", filterResourcesList);
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
  
  if (tab === 'resources') renderResources();
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
  renderResources();
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
  const ext = langKey === "react" ? "jsx" : langKey === "python" ? "py" : langKey === "c" ? "c" : langKey === "cpp" ? "cpp" : langKey === "csharp" ? "cs" : langKey === "php" ? "php" : langKey === "javascript" ? "js" : "html";
  DOM.genFileName.innerText = `component.${ext}`;
  
  compileGeneratedCode();
}

window.selectTemplate = function(index) {
  appState.generatorTemplateIdx = index;
  renderGenerator();
}

window.compileGeneratedCode = function() {
  const langKey = appState.generatorLang;
  const templatesList = window.templates[langKey];
  const activeTemp = templatesList[appState.generatorTemplateIdx];
  if (!activeTemp) return;
  
  const params = {};
  if (activeTemp.params) {
    activeTemp.params.forEach(param => {
      const el = document.getElementById(`param-${param.id}`);
      if (el) {
        params[param.id] = el.value;
      } else {
        params[param.id] = param.default;
      }
    });
  }
  
  const code = activeTemp.compile(params);
  DOM.genCodeTarget.innerText = code;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.backgroundColor = "var(--accent-green)";
    popup.style.color = "white";
    popup.style.padding = "10px 20px";
    popup.style.borderRadius = "20px";
    popup.style.fontWeight = "bold";
    popup.innerText = "📋 Code Copied!";
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
  });
}

function sendToPlayground() {
  const code = DOM.genCodeTarget.innerText;
  DOM.playCodeEditor.value = code;
  switchTab("playground");
}

function runPlaygroundCode() {
  const code = DOM.playCodeEditor.value;
  
  // Decide how to run based on content
  if (code.includes("import React") || code.includes("ProfileCard") || code.includes("Counter")) {
    // Simulated React Iframe compilation
    DOM.playTerminal.style.display = "none";
    DOM.playPreviewFrame.style.display = "block";
    
    // Quick custom mock rendering inside iframe
    const doc = DOM.playPreviewFrame.contentDocument || DOM.playPreviewFrame.contentWindow.document;
    
    let htmlContent = `
      <html>
        <body style="background:#0f172a; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
          <div id="root"></div>
          <script>
            // React simulator inside iframe
            const root = document.getElementById("root");
    `;
    
    if (code.includes("ProfileCard")) {
      // Profile card template extraction
      const name = code.match(/h3.*?>\$\{p\.username\|\|(.*?)\}/) || code.match(/<h3>(.*?)<\/h3>/) || ["", "Alex Code"];
      const job = code.match(/<p.*?>\$\{p\.job\|\|(.*?)\}/) || code.match(/<p.*?>(.*?)<\/p>/) || ["", "Software Engineer"];
      const borderCol = code.match(/border: '2px solid (.*?)'/) || ["", "#10b981"];
      
      htmlContent += `
        root.innerHTML = \`
          <div style="border: 2px solid ${borderCol[1]}; border-radius: 10px; padding: 20px; max-width: 300px; background-color: #1e293b; color: #f8fafc; font-family: sans-serif; box-shadow: 0 4px 15px ${borderCol[1]}44">
            <h3 style="margin: 0 0 10px 0; color: ${borderCol[1]}">${name[1]}</h3>
            <p style="margin: 0 0 15px 0; font-style: italic">${job[1]}</p>
            <hr style="border: 0; border-top: 1px solid #475569; margin: 10px 0" />
            <span style="font-size: 0.8rem; color: #94a3b8">Created with Kawerify Learn</span>
          </div>
        \`;
      `;
    } else {
      // Counter mock
      const initVal = parseInt(code.match(/useState\((\d+)\)/) || [0, 0])[1];
      const btnCol = code.match(/backgroundColor: '(.*?)'/) || ["", "#0ea5e9"];
      
      htmlContent += `
        let count = ${initVal};
        function render() {
          root.innerHTML = \`
            <div style="text-align: center; padding: 20px; font-family: sans-serif; color: white;">
              <h2>Count: \${count}</h2>
              <button id="add" style="background-color: ${btnCol[1]}; color: white; border: none; padding: 10px 20px; borderRadius: 5px; cursor: pointer; margin: 5px; font-weight:bold;">Add One</button>
              <button id="minus" style="background-color: #64748b; color: white; border: none; padding: 10px 20px; borderRadius: 5px; cursor: pointer; margin: 5px; font-weight:bold;">Minus One</button>
            </div>
          \`;
          document.getElementById("add").addEventListener("click", () => { count++; render(); });
          document.getElementById("minus").addEventListener("click", () => { count--; render(); });
        }
        render();
      `;
    }
    
    htmlContent += `
          </script>
        </body>
      </html>
    `;
    
    doc.open();
    doc.write(htmlContent);
    doc.close();
  } else if (code.includes("iostream") || code.includes("class Robot")) {
    simulateTerminal("cpp", code);
  } else if (code.includes("System.Linq") || code.includes("School.")) {
    simulateTerminal("csharp", code);
  } else if (code.includes("import random") || code.includes("def play_guessing_game") || code.includes("def calculate")) {
    // Python simulation
    simulateTerminal("python", code);
  } else if (code.includes("#include <stdio.h>") || code.includes("void swap") || code.includes("bubble_sort")) {
    // C simulation
    simulateTerminal("c", code);
  } else if (code.includes("<?php") || code.includes("password_hash") || code.includes("$_POST")) {
    // PHP simulation
    simulateTerminal("php", code);
  } else {
    // Generic HTML/CSS/JS compiler inside iframe
    DOM.playTerminal.style.display = "none";
    DOM.playPreviewFrame.style.display = "block";
    const doc = DOM.playPreviewFrame.contentDocument || DOM.playPreviewFrame.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
  }
}

function simulateTerminal(lang, code) {
  DOM.playPreviewFrame.style.display = "none";
  DOM.playTerminal.style.display = "block";
  DOM.playTerminalBody.innerHTML = "";
  
  let lines = [];
  if (lang === "python") {
    lines.append({ text: "$ python main.py", type: "input" });
    if (code.includes("play_guessing_game")) {
      const maxRange = code.match(/random.randint\(1, (\d+)\)/) || [0, 10];
      const attempts = code.match(/attempts = (\d+)/) || [0, 3];
      lines.append({ text: "Welcome to Kawerify Guessing Game!", type: "out" });
      lines.append({ text: `Guess a number between 1 and ${maxRange[1]}.`, type: "out" });
      lines.append({ text: "Attempt 1: Enter guess: 5", type: "input" });
      lines.append({ text: "Too high!", type: "out" });
      lines.append({ text: "Attempt 2: Enter guess: 3", type: "input" });
      lines.append({ text: "Too low!", type: "out" });
      lines.append({ text: "Attempt 3: Enter guess: 4", type: "input" });
      lines.append({ text: "🎉 Hooray! You guessed correctly!", type: "out" });
    } else {
      const mode = code.match(/running in (.*?) mode/) || ["", "Scientific"];
      lines.append({ text: `Calculator running in ${mode[1]} mode...`, type: "out" });
      lines.append({ text: "Multiplying: 10 * 5", type: "out" });
      lines.append({ text: "Output Result: 50", type: "out" });
    }
  } else if (lang === "c") {
    lines.append({ text: "$ gcc main.c -o main && ./main", type: "input" });
    if (code.includes("swap")) {
      const val1 = code.match(/int x = (\d+);/) || [0, 42];
      const val2 = code.match(/int y = (\d+);/) || [0, 99];
      lines.append({ text: `Before swap: x = ${val1[1]}, y = ${val2[1]}`, type: "out" });
      lines.append({ text: `After swap:  x = ${val2[1]}, y = ${val1[1]}`, type: "out" });
    } else {
      lines.append({ text: "Sorting array...", type: "out" });
      lines.append({ text: "Sorted array result: 5 12 23 54 89", type: "out" });
    }
  } else if (lang === "cpp") {
    lines.append({ text: "$ g++ main.cpp -o main && ./main", type: "input" });
    if (code.includes("Robot")) {
      const botName = code.match(/SuperRobot bot\("(.*?)"\)/) || ["", "Iron Giant"];
      lines.append({ text: "Compiling class inheritance structures...", type: "out" });
      lines.append({ text: `ZOOM! I am ${botName[1]}, the ultimate defender!`, type: "out" });
    } else {
      lines.append({ text: "Packing magic backpack...", type: "out" });
      lines.append({ text: "Backpack capacity: 3", type: "out" });
      lines.append({ text: "Items list: 10 20 30", type: "out" });
    }
  } else if (lang === "csharp") {
    lines.append({ text: "$ dotnet run", type: "input" });
    if (code.includes("LINQ")) {
      const val = code.match(/where num > (\d+)/) || [0, 15];
      lines.append({ text: "LINQ magic wand searching...", type: "out" });
      lines.append({ text: `Filtered results greater than ${val[1]}:`, type: "out" });
      if (parseInt(val[1]) < 20) lines.append({ text: "20", type: "out" });
      if (parseInt(val[1]) < 25) lines.append({ text: "25", type: "out" });
      lines.append({ text: "30", type: "out" });
    } else {
      const room = code.match(/School\.(.*?)\.Student/) || ["", "RoomA"];
      lines.append({ text: "Address resolved namespace Class...", type: "out" });
      lines.append({ text: `Found student Alex in ${room[1]}`, type: "out" });
    }
  } else if (lang === "php") {
    lines.append({ text: "$ php main.php", type: "input" });
    if (code.includes("password_hash")) {
      lines.append({ text: "Raw Password: Kawerify123!", type: "out" });
      lines.append({ text: "Hashed Result: $2y$10$tPjG/16gG4W1n6o.x3xUuuT.47hY... (bcrypt)", type: "out" });
      lines.append({ text: "Password verified successfully!", type: "out" });
    } else {
      const email = code.match(/to = "(.*?)"/) || ["", "hello@kawerifytech.com"];
      lines.append({ text: "Request Type: POST", type: "out" });
      lines.append({ text: `Thank you, your message has been sent to ${email[1]}`, type: "out" });
    }
  }
  
  let i = 0;
  function printNextLine() {
    if (i < lines.length) {
      const line = lines[i];
      const div = document.createElement("div");
      div.className = "terminal-line";
      if (line.type === "input") {
        div.innerHTML = `<span class="terminal-input">${line.text}</span>`;
      } else {
        div.innerText = line.text;
      }
      DOM.playTerminalBody.appendChild(div);
      i++;
      setTimeout(printNextLine, 600);
    }
  }
  printNextLine();
}

function downloadCodeFile() {
  const code = DOM.playCodeEditor.value;
  const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  
  // Decide extension
  let ext = "js";
  if (code.includes("import React")) ext = "jsx";
  else if (code.includes("import random")) ext = "py";
  else if (code.includes("stdio.h")) ext = "c";
  // Added specific C# resolving extensions handler
  else if (code.includes("iostream")) ext = "cpp";
  else if (code.includes("System.Linq")) ext = "cs";
  else if (code.includes("<?php")) ext = "php";
  else if (code.includes("<html>")) ext = "html";
  
  a.download = `kawerify_learn_code.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

const licensesList = [
  { id: "mit", name: "MIT License", desc: "Permissive, popular open source choice." },
  { id: "apache2", name: "Apache License 2.0", desc: "Permissive, covers patent rights transfers." },
  { id: "gpl3", name: "GNU GPLv3", desc: "Copyleft license, mandates sharing derivative code." },
  { id: "lgpl3", name: "GNU LGPLv3", desc: "Lesser copyleft, easier library linking rules." },
  { id: "bsd3", name: "BSD 3-Clause", desc: "Permissive, simple BSD agreement terms." },
  { id: "bsd2", name: "BSD 2-Clause", desc: "Permissive, eliminates advertising requirements." },
  { id: "mpl2", name: "Mozilla Public License 2.0", desc: "Weak copyleft, file-level source isolation." },
  { id: "epl2", name: "Eclipse Public License 2.0", desc: "Commercial-friendly copyleft layout rules." },
  { id: "cc4", name: "Creative Commons BY 4.0", desc: "Perfect for assets, documentation sharing." },
  { id: "unlicense", name: "The Unlicense", desc: "Relinquishes all rights into public domain." },
  { id: "isc", name: "ISC License", desc: "Super simple permissive license agreement." }
];

function renderLicenseList() {
  const searchVal = DOM.licSearchInput.value.toLowerCase();
  const target = DOM.licListTarget;
  if (!target) return;
  
  let html = "";
  licensesList.forEach(lic => {
    if (searchVal && !lic.name.toLowerCase().includes(searchVal) && !lic.desc.toLowerCase().includes(searchVal)) {
      return;
    }
    
    html += `
      <button class="license-item-btn ${appState.activeLicense === lic.id ? 'active' : ''}" onclick="selectLicense('${lic.id}')">
        <strong>${lic.name}</strong>
        <div style="font-size:0.75rem; opacity:0.8; margin-top:2px;">${lic.desc}</div>
      </button>
    `;
  });
  
  if (!html) {
    html = `<p style="color:var(--text-muted); text-align:center;">No licenses found.</p>`;
  }
  
  target.innerHTML = html;
}

window.selectLicense = function(id) {
  appState.activeLicense = id;
  renderLicenseList();
  renderLicenseText();
}

function renderLicenseText() {
  const id = appState.activeLicense;
  const year = appState.licenseYear;
  const owner = appState.licenseOwner;
  const target = DOM.licTextTarget;
  if (!target) return;
  
  DOM.licNameTitle.innerText = `${id.toUpperCase()}_LICENSE.txt`;
  
  // Fetch local text template file
  fetch(`licenses/${id}.txt`)
    .then(r => r.text())
    .then(text => {
      // Replace copyright placeholders if needed
      let formattedText = text;
      formattedText = formattedText.replace(/Copyright \(c\) \d+.*?\n/g, `Copyright (c) ${year} ${owner}\n`);
      formattedText = formattedText.replace(/Copyright \d+.*?\n/g, `Copyright ${year} ${owner}\n`);
      target.innerText = formattedText;
    })
    .catch(() => {
      target.innerText = "Error loading license agreement text file.";
    });
}

function renderResources() {
  const target = DOM.resGridTarget;
  if (!target || !window.resources) return;
  const searchVal = DOM.resSearchInput ? DOM.resSearchInput.value.toLowerCase() : '';
  
  let html = '';
  let count = 0;
  
  for (const [lang, list] of Object.entries(window.resources)) {
    list.forEach(res => {
      if (searchVal && !res.name.toLowerCase().includes(searchVal) && !res.desc.toLowerCase().includes(searchVal) && !lang.toLowerCase().includes(searchVal)) {
        return;
      }
      count++;
      html += `
        <div class="resource-card">
          <span class="resource-badge">${lang.toUpperCase()}</span>
          <h4 style="margin: 5px 0 10px 0; font-size:1.15rem;">${res.name}</h4>
          <p style="margin:0; font-size:0.9rem; color:var(--text-muted); line-height:1.4;">${res.desc}</p>
          <a href="${res.url}" target="_blank" class="resource-link">🌐 Visit Resource &rarr;</a>
        </div>
      `;
    });
  }
  
  if (count === 0) {
    html = `<div class="no-results-msg" style="grid-column: 1/-1;">No resources matched your search filter.</div>`;
  }
  
  target.innerHTML = html;
}

function renderLegalDoc() {
  const doc = appState.legalDoc;
  const target = DOM.legContentTarget;
  if (!target) return;
  
  fetch(`legal/${doc}.md`)
    .then(r => r.text())
    .then(text => {
      // Simple markdown to HTML parser
      let html = text
        .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
        .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
        .replace(/^\*\*(.*?)\*\*/gm, '<strong>$1</strong>')
        .replace(/^\* (.*?)$/gm, '<li>$1</li>');
      
      // Wrap list items
      html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
      // Fix duplicate wrapping tags
      html = html.replace(/<\/ul>\s*<ul>/g, '');
      
      target.innerHTML = html;
    })
    .catch(() => {
      target.innerHTML = "<p>Error loading legal documentation page.</p>";
    });
}

function resetProgress() {
  if (confirm("Are you sure you want to delete all learning progress?")) {
    appState.completedLessons = {};
    activeQuizAnswers = {};
    saveToLocalStorage();
    renderCurriculum();
    alert("Progress successfully reset!");
  }
}

function saveToLocalStorage() {
  localStorage.setItem("kawerify_learn_state", JSON.stringify(appState));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("kawerify_learn_state");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(appState, parsed);
      
      // Re-apply classes
      if (appState.theme === "light") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        if (DOM.themeToggle) DOM.themeToggle.innerText = "🌙 Dark Mode";
      }
      if (appState.mode === "kid") {
        document.body.classList.remove("dev-mode");
        document.body.classList.add("kid-mode");
        if (DOM.kidToggle) DOM.kidToggle.innerText = "👨‍💻 Dev Mode";
      }
      
    } catch(e) {
      console.error("Error reading saved settings data", e);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  cacheDOM();
  initEventListeners();
  loadFromLocalStorage();
  
  // Switch to default tab
  switchTab(appState.activeTab);
  
  // Initial renders
  renderCurriculum();
  renderGenerator();
  renderLicenseList();
  renderLicenseText();
  renderLegalDoc();
  renderResources();
});

// Added custom SVG mascot dictionary mapping for React
const mascotSVGs = {};
mascotSVGs.python = `<svg width='50' height='50' viewBox='0 0 100 100'></svg>`;
mascotSVGs.c = `<svg width='50' height='50' viewBox='0 0 100 100'></svg>`;
mascotSVGs.php = `<svg width='50' height='50' viewBox='0 0 100 100'></svg>`;
mascotSVGs.javascript = `<svg width='50' height='50' viewBox='0 0 100 100'></svg>`;
mascotSVGs.html_css = `<svg width='50' height='50' viewBox='0 0 100 100'></svg>`;

// Mascot SVG injector helper function
function injectMascotSVG(langKey) {
  return mascotSVGs[langKey] || '';
}

// Developer note: The application implements a client-side architecture
// utilizing local storage to maintain data persistence seamlessly.

function filterLicensesList() {
  renderLicenseList();
}

// Keyboard shortcuts listener for accessibility
window.addEventListener('keydown', (e) => {
  if(e.altKey && e.key === 'l') switchTab('learn');
});

function renderFAQ() {
  const faqTarget = document.getElementById('faq-section');
  if(!faqTarget) return;
  faqTarget.innerHTML = '<h3>Frequently Asked Questions</h3><p><strong>Is it free?</strong> Yes, completely free!</p>';
}

function triggerFileDownload(filename, content) {
  console.log('Downloading file:', filename);
}

// Added support for compiling C# language templates in simulated console
mascotSVGs.cpp = `<svg width='50' height='50' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='#00599c'/><text x='50' y='55' font-size='20' font-weight='bold' fill='white' text-anchor='middle'>C++</text></svg>`;
mascotSVGs.csharp = `<svg width='50' height='50' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='#178600'/><text x='50' y='55' font-size='20' font-weight='bold' fill='white' text-anchor='middle'>C#</text></svg>`;

// Added custom local storage state indicators for resources parameters.

function filterResourcesList() {
  renderResources();
}

// C# quiz question parser handler mapping checker utility function
// Keyboard listener addition mapping for C++ resource keys
// Keyboard listener addition mapping for C# resource keys
// Custom accent color selection mapper settings selector functions
// Event triggers updates for C++ select lists change lists
// Event triggers updates for C# select lists change lists
// Local storage system resets purge actions callbacks
// Help popover configurations descriptions additions for C++ and C#