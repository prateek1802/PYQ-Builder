/**
 * ExamForge — shared domain types.
 *
 * Question data (src/data/questions.ts) and app logic (src/app.ts) both
 * depend on this file, so it's the single source of truth for the schema.
 * Adding a field here makes it required (or optional) everywhere at once.
 */

export type ConfidenceLevel = "again" | "learning" | "mastered";

export interface Question {
  /** Unique, stable id. Also the localStorage progress key — never reuse. */
  id: string;
  /**
   * The exam family this question belongs to, e.g. "SSC CGL" or "SSC CHSL".
   * This is what the sidebar groups and navigates by — one nav link per
   * distinct examName found in the data, no code changes needed to add
   * a new exam beyond adding questions with a new examName.
   */
  examName: string;
  /** Specific sitting/year label shown on the card, e.g. "SSC CGL 2019". */
  exam: string;
  tier: string;
  topic: string;
  /** LaTeX-ready: $inline$ or $$block$$. */
  question: string;
  /** Exactly 4 options, LaTeX-ready. */
  options: readonly [string, string, string, string];
  /** Index (0-3) into `options` of the correct answer. */
  correctIndex: 0 | 1 | 2 | 3;
  /** LaTeX-ready. Use \n\n between steps — the app splits on that. */
  basicSolution: string;
  /** LaTeX-ready. Use \n\n between steps — the app splits on that. */
  shortcutSolution: string;
}

export interface ProgressEntry {
  confidence: ConfidenceLevel;
}

export type ProgressMap = Record<string, ProgressEntry>;
