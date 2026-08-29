/**
 * ExamForge — app logic (TypeScript).
 *
 * Bundled by Vite. All progress lives in localStorage. No framework —
 * plain DOM manipulation with a minimal hash router for two views
 * (Practice / Progress), rendered into the persistent sidebar shell
 * defined in index.html.
 */

import { QUESTIONS } from "./data/questions";
import type { ConfidenceLevel, ProgressMap, Question } from "./types";

const STORAGE_KEY = "examforge:progress:v1";
const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

// One confident accent color per topic. Assigned round-robin over the
// sorted topic list for even spread across the fixed six-color palette.
const TOPIC_PALETTE = ["#FF6B4A", "#2F5EFF", "#2FAE66", "#F2A93B", "#E4568C", "#1FA6A0"] as const;

function buildTopicColorMap(questions: Question[]): Map<string, string> {
  const topics = Array.from(new Set(questions.map((q) => q.topic))).sort();
  const map = new Map<string, string>();
  topics.forEach((topic, i) => map.set(topic, TOPIC_PALETTE[i % TOPIC_PALETTE.length]));
  return map;
}

const topicColorMap = buildTopicColorMap(QUESTIONS);

function colorForTopic(topic: string): string {
  const known = topicColorMap.get(topic);
  if (known) return known;
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = (hash * 31 + topic.charCodeAt(i)) >>> 0;
  }
  return TOPIC_PALETTE[hash % TOPIC_PALETTE.length];
}

const TREND_ICON =
  '<svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline;vertical-align:-1px"><path d="M2 11L6.5 6.5L9.5 9.5L14 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 4H14V7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const CHECK_ICON =
  '<svg class="option__icon" width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const CROSS_ICON =
  '<svg class="option__icon" width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const STAR_ICON =
  '<svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 1.5L9.8 5.6L14.2 6.1L11 9.1L11.8 13.5L8 11.3L4.2 13.5L5 9.1L1.8 6.1L6.2 5.6L8 1.5Z"/></svg>';

const ARROW_LEFT_ICON =
  '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const ARROW_RIGHT_ICON =
  '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let progress: ProgressMap = loadProgress();
let activeTopic = "all";
let currentIndex = 0;

type Route = "practice" | "progress";
const DEFAULT_ROUTE: Route = "practice";

function requireEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`ExamForge: expected element #${id} to exist in index.html`);
  }
  return el as T;
}

const viewRoot = requireEl<HTMLElement>("view-root");
const sidebarNav = requireEl<HTMLElement>("sidebar-nav");

// ---------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch (err) {
    console.warn("ExamForge: could not read progress from localStorage.", err);
    return {};
  }
}

function saveProgress(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn("ExamForge: could not save progress to localStorage.", err);
  }
}

function setConfidence(id: string, confidence: ConfidenceLevel): void {
  const current = progress[id];
  if (current?.confidence === confidence) {
    delete progress[id];
  } else {
    progress[id] = { confidence };
  }
  saveProgress();
}

// ---------------------------------------------------------------
// Confetti + bounce feedback
// ---------------------------------------------------------------

function spawnConfetti(originEl: HTMLElement): void {
  const rect = originEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const pieceCount = 14;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const angle = (Math.PI * 2 * i) / pieceCount + Math.random() * 0.6;
    const distance = 60 + Math.random() * 50;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 20;
    const rotation = Math.random() * 360;
    const color = TOPIC_PALETTE[i % TOPIC_PALETTE.length];

    piece.style.setProperty("--dx", `${dx}px`);
    piece.style.setProperty("--dy", `${dy}px`);
    piece.style.setProperty("--rot", `${rotation}deg`);
    piece.style.background = color as string;
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;

    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
    setTimeout(() => piece.remove(), 900);
  }
}

// ---------------------------------------------------------------
// Router
// ---------------------------------------------------------------

function getRoute(): Route {
  const hash = location.hash.replace(/^#\/?/, "");
  return hash === "progress" ? "progress" : DEFAULT_ROUTE;
}

function setActiveNav(route: Route): void {
  sidebarNav.querySelectorAll<HTMLButtonElement>(".nav-link").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === route);
  });
}

function renderRoute(): void {
  const route = getRoute();
  setActiveNav(route);
  if (route === "progress") {
    renderProgressView(viewRoot);
  } else {
    renderPracticeView(viewRoot);
  }
}

// ---------------------------------------------------------------
// Practice view
// ---------------------------------------------------------------

function renderPracticeView(root: HTMLElement): void {
  const total = QUESTIONS.length;
  const mastered = QUESTIONS.filter((q) => progress[q.id]?.confidence === "mastered").length;
  const pct = total === 0 ? 0 : Math.round((mastered / total) * 100);
  const topics = Array.from(new Set(QUESTIONS.map((q) => q.topic))).sort();
  const visible = activeTopic === "all" ? QUESTIONS : QUESTIONS.filter((q) => q.topic === activeTopic);

  root.innerHTML = `
    <div class="view-inner">
      <div class="stat-card">
        <span class="stat-card__eyebrow">Practice</span>
        <h1 class="stat-card__title">Quant PYQs</h1>
        <p class="stat-card__subtitle">Previous-year quant questions, worked two ways.</p>
        <div class="stat-card__stat">
          <span class="stat-card__label">Your progress</span>
          <span class="stat-card__value font-tabular">${mastered} / ${total}</span>
          <span class="stat-card__delta">${TREND_ICON} ${pct}% mastered</span>
          <div class="stat-card__track"><div class="stat-card__fill" style="width:${pct}%"></div></div>
        </div>
      </div>
      <div class="filter-row" id="filter-row"></div>
      <div class="practice-nav" id="practice-nav-top"></div>
      <div class="cards-container" id="cards-container"></div>
      <div class="practice-nav practice-nav--bottom" id="practice-nav-bottom"></div>
    </div>
  `;

  const filterRowEl = root.querySelector<HTMLDivElement>("#filter-row")!;
  const cardsContainer = root.querySelector<HTMLDivElement>("#cards-container")!;
  const navTopEl = root.querySelector<HTMLDivElement>("#practice-nav-top")!;
  const navBottomEl = root.querySelector<HTMLDivElement>("#practice-nav-bottom")!;

  const chipFrag = document.createDocumentFragment();
  chipFrag.appendChild(makeChip("All topics", "all", root));
  topics.forEach((topic) => chipFrag.appendChild(makeChip(topic, topic, root)));
  filterRowEl.appendChild(chipFrag);

  if (currentIndex > visible.length - 1) {
    currentIndex = Math.max(0, visible.length - 1);
  }

  navTopEl.innerHTML = navBarHtml(currentIndex, visible.length);
  navBottomEl.innerHTML = navBarHtml(currentIndex, visible.length);

  if (visible.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No questions in this topic yet.";
    cardsContainer.appendChild(empty);
    return;
  }

  cardsContainer.appendChild(renderCard(visible[currentIndex], root));

  root.querySelectorAll<HTMLButtonElement>("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.nav === "prev" && currentIndex > 0) currentIndex--;
      if (btn.dataset.nav === "next" && currentIndex < visible.length - 1) currentIndex++;
      renderPracticeView(root);
    });
  });

  window.renderMathInElement?.(cardsContainer, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false }
    ],
    throwOnError: false
  });
}

function navBarHtml(index: number, total: number): string {
  const atStart = index <= 0;
  const atEnd = total === 0 || index >= total - 1;
  return `
    <button type="button" class="nav-arrow" data-nav="prev" ${atStart ? "disabled" : ""}>
      ${ARROW_LEFT_ICON} Prev
    </button>
    <span class="practice-nav__counter font-tabular">${total === 0 ? "0 / 0" : `${index + 1} / ${total}`}</span>
    <button type="button" class="nav-arrow" data-nav="next" ${atEnd ? "disabled" : ""}>
      Next ${ARROW_RIGHT_ICON}
    </button>
  `;
}

function makeChip(label: string, value: string, root: HTMLElement): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "filter-chip" + (value === activeTopic ? " is-active" : "");
  btn.textContent = label;
  btn.dataset.topic = value;
  if (value !== "all") {
    btn.style.setProperty("--topic-color", colorForTopic(value));
  }
  btn.addEventListener("click", () => {
    activeTopic = value;
    currentIndex = 0;
    renderPracticeView(root);
  });
  return btn;
}

function renderCard(q: Question, root: HTMLElement): HTMLElement {
  const state = progress[q.id];
  const isMastered = state?.confidence === "mastered";

  const card = document.createElement("article");
  card.className = "q-card" + (isMastered ? " is-mastered" : "");
  card.dataset.id = q.id;
  card.style.setProperty("--topic-color", colorForTopic(q.topic));

  card.innerHTML = `
    <div class="q-card__header">
      <div class="q-card__avatar" aria-hidden="true">${escapeHtml(q.topic.charAt(0))}</div>
      <div class="q-card__title-group">
        <span class="q-card__topic">${escapeHtml(q.topic)}</span>
        <span class="q-card__subline">${escapeHtml(q.exam)} · ${escapeHtml(q.tier)}</span>
      </div>
      <div class="q-card__stamp">
        ${STAR_ICON}
        Mastered
      </div>
    </div>

    <p class="q-card__question">${q.question}</p>

    <div class="q-card__options" role="list"></div>

    <div class="q-card__controls">
      <button type="button" class="btn-reveal">
        <span class="btn-reveal__label">Show solution</span>
        <svg class="btn-reveal__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="confidence-group" role="group" aria-label="Confidence rating">
        <button type="button" class="confidence-chip${state?.confidence === "again" ? " is-active" : ""}" data-conf="again">Shaky</button>
        <button type="button" class="confidence-chip${state?.confidence === "learning" ? " is-active" : ""}" data-conf="learning">Getting there</button>
        <button type="button" class="confidence-chip${state?.confidence === "mastered" ? " is-active" : ""}" data-conf="mastered">Mastered</button>
      </div>
    </div>

    <div class="solution-wrap">
      <div class="solution-wrap__inner">
        <div class="solution-wrap__inner-pad">
          <div class="solution basic-solution">
            <div class="solution__title">Basic solution</div>
            <div class="solution__body">${paragraphize(q.basicSolution)}</div>
          </div>
          <div class="solution shortcut-solution">
            <div class="solution__title">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L2 9.5H7L6 15L14 6H9L9 1Z" fill="currentColor"/>
              </svg>
              Exam shortcut
            </div>
            <div class="solution__body">${paragraphize(q.shortcutSolution)}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const optionsEl = card.querySelector<HTMLDivElement>(".q-card__options")!;
  q.options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.dataset.index = String(idx);
    btn.innerHTML = `<span class="option__letter">${OPTION_LETTERS[idx]}</span><span class="option__text">${optText}</span>`;
    btn.addEventListener("click", () => handleOptionClick(card, q, idx, btn));
    optionsEl.appendChild(btn);
  });

  const revealBtn = card.querySelector<HTMLButtonElement>(".btn-reveal")!;
  const revealLabel = card.querySelector<HTMLSpanElement>(".btn-reveal__label")!;
  revealBtn.addEventListener("click", () => {
    const isOpen = card.classList.toggle("is-open");
    revealLabel.textContent = isOpen ? "Hide solution" : "Show solution";
  });

  card.querySelectorAll<HTMLButtonElement>(".confidence-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const conf = chip.dataset.conf as ConfidenceLevel;
      const wasMastered = progress[q.id]?.confidence === "mastered";
      setConfidence(q.id, conf);
      renderPracticeView(root);
      if (conf === "mastered" && !wasMastered) {
        const refreshed = root.querySelector<HTMLElement>(`[data-id="${q.id}"] .q-card__stamp`);
        if (refreshed) spawnConfetti(refreshed);
      }
    });
  });

  return card;
}

function handleOptionClick(card: HTMLElement, q: Question, chosenIdx: number, chosenBtn: HTMLButtonElement): void {
  const optionButtons = card.querySelectorAll<HTMLButtonElement>(".option");
  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correctIndex) {
      btn.classList.add("is-correct");
      btn.insertAdjacentHTML("beforeend", CHECK_ICON);
    } else if (idx === chosenIdx) {
      btn.classList.add("is-incorrect");
      btn.insertAdjacentHTML("beforeend", CROSS_ICON);
    }
  });

  if (chosenIdx === q.correctIndex) {
    spawnConfetti(chosenBtn);
  }

  if (!card.classList.contains("is-open")) {
    card.querySelector<HTMLButtonElement>(".btn-reveal")!.click();
  }
}

// ---------------------------------------------------------------
// Progress view — mastery breakdown per topic
// ---------------------------------------------------------------

function renderProgressView(root: HTMLElement): void {
  const total = QUESTIONS.length;
  const masteredCount = QUESTIONS.filter((q) => progress[q.id]?.confidence === "mastered").length;
  const pct = total === 0 ? 0 : Math.round((masteredCount / total) * 100);

  const topics = Array.from(new Set(QUESTIONS.map((q) => q.topic))).sort();
  const topicRows = topics.map((topic) => {
    const topicQuestions = QUESTIONS.filter((q) => q.topic === topic);
    const topicMastered = topicQuestions.filter((q) => progress[q.id]?.confidence === "mastered").length;
    const topicPct = topicQuestions.length === 0 ? 0 : Math.round((topicMastered / topicQuestions.length) * 100);
    return { topic, mastered: topicMastered, total: topicQuestions.length, pct: topicPct };
  });

  root.innerHTML = `
    <div class="view-inner">
      <div class="stat-card">
        <span class="stat-card__eyebrow">Progress</span>
        <h1 class="stat-card__title">How you're doing</h1>
        <p class="stat-card__subtitle">Mastery across every topic you've practiced.</p>
        <div class="stat-card__stat">
          <span class="stat-card__label">Overall mastered</span>
          <span class="stat-card__value font-tabular">${masteredCount} / ${total}</span>
          <span class="stat-card__delta">${TREND_ICON} ${pct}% mastered</span>
          <div class="stat-card__track"><div class="stat-card__fill" style="width:${pct}%"></div></div>
        </div>
      </div>

      <div class="topic-list">
        ${topicRows
          .map(
            (r) => `
          <div class="topic-row" style="--topic-color:${colorForTopic(r.topic)}">
            <div class="topic-row__top">
              <span class="topic-row__dot" aria-hidden="true"></span>
              <span class="topic-row__name">${escapeHtml(r.topic)}</span>
              <span class="topic-row__stat font-tabular">${r.mastered} / ${r.total} mastered</span>
            </div>
            <div class="topic-row__track"><div class="topic-row__fill" style="width:${r.pct}%"></div></div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------

function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function paragraphize(text: string): string {
  return text
    .split("\n\n")
    .map((chunk) => `<p>${chunk}</p>`)
    .join("");
}

// ---------------------------------------------------------------
// Boot
// ---------------------------------------------------------------

export function initApp(): void {
  if (!Array.isArray(QUESTIONS)) {
    viewRoot.innerHTML =
      '<div class="empty-state">Question data failed to load — check src/data/questions.ts.</div>';
    return;
  }

  sidebarNav.querySelectorAll<HTMLButtonElement>(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const route = link.dataset.route as Route;
      location.hash = "/" + route;
    });
  });

  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}
