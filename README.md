# ExamForge

A practice tool for SSC CGL Tier 1 Quantitative Aptitude previous-year
questions. No login, no backend. TypeScript + Vite for the build; the
output is still a static site you can host anywhere.

## Structure of the app

A persistent sidebar (like a real app shell, not a single scrolling
page) with two routes, switched by a minimal hash router in `app.ts`
— no router library, just `location.hash`:

- **`#/practice`** (default) — the question feed: live progress stat,
  topic filter chips, question cards.
- **`#/progress`** — a mastery breakdown: overall stat plus one row
  per topic with its own mini progress bar.

Both routes render into the single `#view-root` element; the sidebar
itself never re-renders.

## File structure

```
examforge/
├── index.html              # Vite entry (module script → src/main.ts)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts              # Boots the app
│   ├── app.ts                # Router, rendering, MCQ logic, confetti, localStorage progress
│   ├── types.ts               # Question / progress types — the schema source of truth
│   ├── global.d.ts            # Ambient type for the KaTeX CDN global
│   ├── styles.css              # All visual design
│   └── data/
│       └── questions.ts         # The question bank — edit this to add content
└── README.md
```

## How to run locally

This now needs Node.js (18+) and an internet connection for the first
install — that's the trade-off for TypeScript + a real dev server.

```bash
cd examforge
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`) with hot
reload — edit any file in `src/` and the browser updates instantly.

**Building for deployment:**

```bash
npm run build
```

This type-checks everything first (`tsc --noEmit`), then outputs a
static `dist/` folder. That folder is plain HTML/CSS/JS — upload it to
any static host (GitHub Pages, Netlify, S3, etc.) or serve it locally:

```bash
npm run preview
```

Note: unlike the original zero-build prototype, `dist/index.html` is
best opened via a local server rather than double-clicked directly —
some browsers block ES module loading over `file://`.

## How to add new questions

All content lives in `src/data/questions.ts`, in one array called
`QUESTIONS`, typed against the `Question` interface in `src/types.ts`.
The app never needs to change — just paste more objects in following
this shape:

```ts
{
  id: "unique-string-id",
  exam: "SSC CGL 2024",
  tier: "Tier 1",
  topic: "Algebra",
  question: "If $x + \\frac{1}{x} = 5$, find $x^2 + \\frac{1}{x^2}$.",
  options: ["21", "23", "25", "27"],
  correctIndex: 1,
  basicSolution: "Step 1: ...\n\nStep 2: ...",
  shortcutSolution: "Use the identity ...\n\n$$...$$"
}
```

Because this is now TypeScript, a malformed entry — a missing field, an
`options` array with the wrong length, a `correctIndex` outside 0–3 —
gets caught by `npm run build` (or your editor) before it ever reaches
a user, instead of silently breaking a card at runtime.

Rules for the data:
- `options` must have exactly 4 entries; `correctIndex` is 0–3.
- Inline math: `$...$`. Block/display math: `$$...$$`.
- Escape backslashes as `\\` inside the strings (e.g. `\\frac`, `\\sqrt`,
  `\\theta`).
- Use `\n\n` to separate steps into paragraphs inside `basicSolution` /
  `shortcutSolution` — the app splits on that automatically.
- This is a good shape to hand an LLM directly: "generate 10 more
  objects for topic X, following the `Question` type in types.ts" —
  then paste the resulting array entries straight into `QUESTIONS`.

If you paste in a **duplicate `id`**, the later one will just overwrite
the earlier one's progress record in localStorage (they share a key) —
keep ids unique per question.

## What's stubbed for later (not built yet)

- **Chapter/topic expansion beyond Quant** (Reasoning, English, GK) —
  the schema's `topic` field and the filter row already generalize to
  this; it would mainly need more data plus maybe a top-level subject
  switcher.
- **Spaced repetition / smart review queue** — "Shaky / Getting there /
  Mastered" is stored per question but doesn't drive any ordering or
  resurfacing logic yet.
- **Search across questions.**
- **Import/export of progress** (download/upload the localStorage
  JSON) — useful once people want to move progress between devices
  without an account.
- **Analytics/stats view** (accuracy by topic, time trends).

None of these require another architecture change to add later —
they're additive on top of the current data shape, types, and
localStorage usage.

## Notes on the design

- Warm cream page, white cards, one vivid violet accent, bright
  grass-green for "mastered"/correct, coral-pink for wrong — deliberately
  playful and a little gamified (Duolingo/Kahoot register) rather than
  the darker, more austere look from earlier drafts.
- Baloo 2 (rounded display font) for headings, hero numerals, and
  question text; Nunito for UI chrome; IBM Plex Mono used sparingly for
  small tabular bits.
- Correctness and "Mastered" status are always shown as **color + icon
  together**, never color alone.
- A correct answer or a fresh "Mastered" mark triggers a small confetti
  burst and a bounce animation — deliberate positive reinforcement, kept
  to that one moment so it stays a treat rather than becoming noise.
  Fully skipped under `prefers-reduced-motion`.
- The solution reveal uses a CSS grid-rows transition (no JS height
  measuring), so it animates smoothly regardless of content length.
