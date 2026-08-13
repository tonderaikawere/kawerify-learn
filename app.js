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