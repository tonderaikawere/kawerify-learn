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