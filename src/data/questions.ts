/**
 * ExamForge — Question bank
 * ---------------------------------------------------------------
 * FIXED SCHEMA (see ../types.ts — do not rename fields there without
 * updating this file and app.ts). To add new questions, paste more
 * objects into the QUESTIONS array below, following the `Question`
 * shape exactly:
 *
 * {
 *   id: "unique-string-id",
 *   exam: "SSC CGL 2024",
 *   tier: "Tier 1",
 *   topic: "Algebra",
 *   question: "LaTeX-ready string, e.g. If $x + \\frac{1}{x} = 5$ ...",
 *   options: ["opt A", "opt B", "opt C", "opt D"],   // exactly 4, LaTeX-ready
 *   correctIndex: 0,               // 0-3, index into options[]
 *   basicSolution: "LaTeX-ready string, full step-by-step walkthrough",
 *   shortcutSolution: "LaTeX-ready string, fast exam-hall method"
 * }
 *
 * LaTeX rules:
 *   - Inline math:  $ ... $
 *   - Block math:   $$ ... $$
 *   - Escape backslashes as \\ inside JS/TS strings (e.g. \\frac, \\sqrt).
 *
 * TypeScript will flag a malformed entry at build time (missing field,
 * options with != 4 items, correctIndex outside 0-3) instead of it
 * silently breaking a card at runtime.
 * ---------------------------------------------------------------
 */

import type { Question } from "../types";

export const QUESTIONS: Question[] = [
  {
    id: "q-alg-01",
    exam: "SSC CGL 2019",
    tier: "Tier 1",
    topic: "Algebra",
    question:
      "If $x + \\dfrac{1}{x} = 5$, find the value of $x^3 + \\dfrac{1}{x^3}$.",
    options: ["105", "110", "115", "100"],
    correctIndex: 1,
    basicSolution:
      "Step 1: Square both sides of $x + \\dfrac{1}{x} = 5$.\n\n$$\\left(x + \\dfrac{1}{x}\\right)^2 = 25 \\implies x^2 + \\dfrac{1}{x^2} + 2 = 25 \\implies x^2 + \\dfrac{1}{x^2} = 23$$\n\nStep 2: Use the identity $x^3 + \\dfrac{1}{x^3} = \\left(x + \\dfrac{1}{x}\\right)\\left(x^2 - 1 + \\dfrac{1}{x^2}\\right)$.\n\nStep 3: Substitute the known values.\n\n$$x^3 + \\dfrac{1}{x^3} = 5 \\times (23 - 1) = 5 \\times 22 = 110$$",
    shortcutSolution:
      "Memorise this as a direct formula, not a derivation: for $x + \\dfrac{1}{x} = a$,\n\n$$x^3 + \\dfrac{1}{x^3} = a^3 - 3a$$\n\nHere $a = 5$, so instantly:\n\n$$5^3 - 3(5) = 125 - 15 = 110$$\n\nOne line, no intermediate squaring step — this formula pays for itself if the same pattern appears with $x - \\dfrac{1}{x}$ too (there it's $a^3 + 3a$)."
  },
  {
    id: "q-per-01",
    exam: "SSC CGL 2021",
    tier: "Tier 1",
    topic: "Percentage",
    question:
      "In an election between two candidates, $20\\%$ of the total votes were declared invalid. The winning candidate got $60\\%$ of the valid votes. If the total number of votes polled was $10{,}000$, find the number of votes the winning candidate received.",
    options: ["4800", "5000", "4600", "5200"],
    correctIndex: 0,
    basicSolution:
      "Step 1: Find valid votes. $20\\%$ of $10{,}000$ are invalid, so valid votes are $80\\%$ of the total.\n\n$$\\text{Valid votes} = 0.80 \\times 10{,}000 = 8000$$\n\nStep 2: The winner got $60\\%$ of these valid votes.\n\n$$0.60 \\times 8000 = 4800$$",
    shortcutSolution:
      "Chain the percentages into one multiplication instead of two separate steps:\n\n$$10{,}000 \\times \\dfrac{80}{100} \\times \\dfrac{60}{100}$$\n\nCancel early: $10{,}000 \\times 0.8 = 8000$, and $8000 \\times 0.6$ is just $8000 - 40\\%\\text{ of }8000 = 8000 - 3200 = 4800$. Subtracting 40% mentally is faster than multiplying by 0.6 on paper."
  },
  {
    id: "q-pl-01",
    exam: "SSC CGL 2022",
    tier: "Tier 1",
    topic: "Profit & Loss",
    question:
      "A shopkeeper marks his goods $40\\%$ above the cost price and then allows a discount of $15\\%$ on the marked price. Find his profit percentage.",
    options: ["21%", "19%", "25%", "17%"],
    correctIndex: 1,
    basicSolution:
      "Step 1: Assume cost price $\\text{CP} = 100$.\n\nStep 2: Marked price is $40\\%$ above CP.\n\n$$\\text{MP} = 100 + 40 = 140$$\n\nStep 3: A $15\\%$ discount is given on MP.\n\n$$\\text{SP} = 140 \\times \\left(1 - \\dfrac{15}{100}\\right) = 140 \\times 0.85 = 119$$\n\nStep 4: Profit $= \\text{SP} - \\text{CP} = 119 - 100 = 19$, so profit $\\% = 19\\%$.",
    shortcutSolution:
      "Use the net successive-change formula directly, without picking CP = 100:\n\n$$\\text{Net }\\% = x + y + \\dfrac{xy}{100}, \\quad x = +40,\\ y = -15$$\n\n$$= 40 - 15 + \\dfrac{(40)(-15)}{100} = 25 - 6 = 19\\%$$\n\nThis single formula replaces mark-up + discount combos every time — just keep the signs correct ($+$ for markup, $-$ for discount)."
  },
  {
    id: "q-tw-01",
    exam: "SSC CGL 2020",
    tier: "Tier 1",
    topic: "Time & Work",
    question:
      "$A$ can complete a work in $12$ days and $B$ can complete it in $15$ days. They work together for $4$ days, after which $A$ leaves. In how many more days will $B$ alone finish the remaining work?",
    options: ["5 days", "6 days", "7 days", "8 days"],
    correctIndex: 1,
    basicSolution:
      "Step 1: One day's work of $A$ is $\\dfrac{1}{12}$ and of $B$ is $\\dfrac{1}{15}$.\n\nStep 2: Combined one day's work.\n\n$$\\dfrac{1}{12} + \\dfrac{1}{15} = \\dfrac{5 + 4}{60} = \\dfrac{9}{60} = \\dfrac{3}{20}$$\n\nStep 3: Work done together in $4$ days.\n\n$$4 \\times \\dfrac{3}{20} = \\dfrac{12}{20} = \\dfrac{3}{5}$$\n\nStep 4: Remaining work $= 1 - \\dfrac{3}{5} = \\dfrac{2}{5}$.\n\nStep 5: $B$ alone does $\\dfrac{1}{15}$ per day, so days needed $= \\dfrac{2/5}{1/15} = \\dfrac{2}{5} \\times 15 = 6$ days.",
    shortcutSolution:
      "Take total work as $\\text{LCM}(12, 15) = 60$ units instead of fractions.\n\n$A$'s rate $= 5$ units/day, $B$'s rate $= 4$ units/day. Together $= 9$ units/day.\n\nIn $4$ days: $4 \\times 9 = 36$ units done, leaving $60 - 36 = 24$ units.\n\n$B$ alone finishes at $4$ units/day, so time $= 24 \\div 4 = 6$ days. Whole numbers throughout — no fraction arithmetic under time pressure."
  },
  {
    id: "q-ci-01",
    exam: "SSC CGL 2018",
    tier: "Tier 1",
    topic: "Simple & Compound Interest",
    question:
      "Find the compound interest on $\\text{₹}8000$ at $10\\%$ per annum for $2$ years, compounded annually.",
    options: ["₹1600", "₹1680", "₹1760", "₹1800"],
    correctIndex: 1,
    basicSolution:
      "Step 1: Amount after $2$ years at compound interest.\n\n$$A = P\\left(1 + \\dfrac{r}{100}\\right)^n = 8000 \\times (1.1)^2$$\n\nStep 2: Compute $(1.1)^2 = 1.21$.\n\n$$A = 8000 \\times 1.21 = 9680$$\n\nStep 3: Compound interest $= A - P = 9680 - 8000 = 1680$.",
    shortcutSolution:
      "For $2$ years, use the direct CI formula on the principal instead of computing the full amount:\n\n$$\\text{CI} = P\\left[2r + \\dfrac{r^2}{100}\\right] \\div 100, \\quad r = 10$$\n\n$$= 8000 \\times \\dfrac{2(10) + \\dfrac{100}{100}}{100} = 8000 \\times \\dfrac{21}{100} = 1680$$\n\nEven faster for round rates like $10\\%$: CI for 2 years is always $P \\times (2r + r^2)\\% $. Here that's $P \\times 21\\% = 1680$ — one multiplication."
  },
  {
    id: "q-geo-01",
    exam: "SSC CGL 2023",
    tier: "Tier 1",
    topic: "Geometry",
    question:
      "The area of an equilateral triangle is $36\\sqrt{3}\\ \\text{cm}^2$. Find its perimeter.",
    options: ["32 cm", "40 cm", "36 cm", "30 cm"],
    correctIndex: 2,
    basicSolution:
      "Step 1: Area of an equilateral triangle with side $a$ is $\\dfrac{\\sqrt{3}}{4}a^2$.\n\n$$\\dfrac{\\sqrt{3}}{4}a^2 = 36\\sqrt{3}$$\n\nStep 2: Divide both sides by $\\sqrt{3}$.\n\n$$\\dfrac{a^2}{4} = 36 \\implies a^2 = 144 \\implies a = 12\\ \\text{cm}$$\n\nStep 3: Perimeter $= 3a = 3 \\times 12 = 36\\ \\text{cm}$.",
    shortcutSolution:
      "Skip solving for $a$ explicitly. Since Area $= \\dfrac{\\sqrt{3}}{4}a^2$, the coefficient of $\\sqrt{3}$ alone gives $\\dfrac{a^2}{4}$ directly.\n\nHere the coefficient is $36$, so $\\dfrac{a^2}{4} = 36 \\Rightarrow a^2=144 \\Rightarrow a=12$ — recognise perfect squares like $144$ on sight (it's $12^2$) to skip the square-root step entirely, then just triple it: $12 \\times 3 = 36\\ \\text{cm}$."
  },
  {
    id: "q-trig-01",
    exam: "SSC CGL 2021",
    tier: "Tier 1",
    topic: "Trigonometry",
    question:
      "If $\\sin\\theta + \\cos\\theta = \\sqrt{2}$ and $0^\\circ < \\theta < 90^\\circ$, find $\\theta$.",
    options: ["30°", "45°", "60°", "90°"],
    correctIndex: 1,
    basicSolution:
      "Step 1: Recall the identity $\\sin\\theta + \\cos\\theta = \\sqrt{2}\\sin(\\theta + 45^\\circ)$.\n\nStep 2: Substitute into the given equation.\n\n$$\\sqrt{2}\\sin(\\theta + 45^\\circ) = \\sqrt{2} \\implies \\sin(\\theta + 45^\\circ) = 1$$\n\nStep 3: $\\sin(\\theta + 45^\\circ) = 1$ means $\\theta + 45^\\circ = 90^\\circ$.\n\n$$\\theta = 45^\\circ$$",
    shortcutSolution:
      "Recognise $\\sqrt{2}$ as a signature value: whenever $\\sin\\theta + \\cos\\theta = \\sqrt{2}$, it can only happen at $\\theta = 45^\\circ$, because that's the unique angle where $\\sin\\theta = \\cos\\theta = \\dfrac{1}{\\sqrt{2}}$, giving a sum of $\\dfrac{2}{\\sqrt{2}} = \\sqrt{2}$.\n\nNo algebra needed — treat $\\sin\\theta+\\cos\\theta=\\sqrt2$ as a memorised trigger for $45^\\circ$, the same way $\\sin\\theta+\\cos\\theta=1$ should trigger $0^\\circ$ or $90^\\circ$."
  },
  {
    id: "q-avg-01",
    exam: "SSC CGL 2019",
    tier: "Tier 1",
    topic: "Average",
    question:
      "The average weight of $30$ students in a class is $45\\ \\text{kg}$. When the class teacher's weight is also included, the average increases by $1\\ \\text{kg}$. Find the teacher's weight.",
    options: ["75 kg", "80 kg", "76 kg", "70 kg"],
    correctIndex: 2,
    basicSolution:
      "Step 1: Total weight of $30$ students.\n\n$$30 \\times 45 = 1350\\ \\text{kg}$$\n\nStep 2: New average with $31$ people is $46\\ \\text{kg}$, so new total.\n\n$$31 \\times 46 = 1426\\ \\text{kg}$$\n\nStep 3: Teacher's weight $= 1426 - 1350 = 76\\ \\text{kg}$.",
    shortcutSolution:
      "Use the 'extra weight distributed' trick: the teacher contributes $1\\ \\text{kg}$ extra to each of the $31$ people's average, plus matches the old average themselves.\n\n$$\\text{Teacher's weight} = \\text{old average} + (\\text{new count} \\times \\text{rise})$$\n\n$$= 45 + (31 \\times 1) = 76\\ \\text{kg}$$\n\nOne addition, no need to compute either total explicitly."
  },
  {
    id: "q-ratio-01",
    exam: "SSC CGL 2022",
    tier: "Tier 1",
    topic: "Ratio & Proportion",
    question:
      "₹2400 is divided among $A$, $B$ and $C$ in the ratio $2:3:5$. Find $B$'s share.",
    options: ["₹600", "₹720", "₹800", "₹480"],
    correctIndex: 1,
    basicSolution:
      "Step 1: Total parts $= 2 + 3 + 5 = 10$.\n\nStep 2: Value of one part.\n\n$$\\dfrac{2400}{10} = 240$$\n\nStep 3: $B$'s share is $3$ parts.\n\n$$3 \\times 240 = 720$$",
    shortcutSolution:
      "Skip finding the unit value separately — write $B$'s share as a single fraction of the total and simplify before multiplying:\n\n$$B = \\dfrac{3}{10} \\times 2400 = 3 \\times 240 = 720$$\n\nFor round totals like $2400$, dividing by $10$ is instant (just move the decimal), so this collapses to one mental step."
  },
  {
    id: "q-num-01",
    exam: "SSC CGL 2023",
    tier: "Tier 1",
    topic: "Number System",
    question: "Find the remainder when $2^{100}$ is divided by $7$.",
    options: ["1", "2", "4", "6"],
    correctIndex: 1,
    basicSolution:
      "Step 1: Find the remainder cycle of powers of $2$ modulo $7$.\n\n$$2^1 \\equiv 2,\\quad 2^2 \\equiv 4,\\quad 2^3 \\equiv 1 \\pmod 7$$\n\nStep 2: The remainders repeat with a cycle length of $3$ (since $2^3 \\equiv 1$).\n\nStep 3: Divide the exponent $100$ by the cycle length $3$.\n\n$$100 = 3 \\times 33 + 1$$\n\nStep 4: So $2^{100} \\equiv (2^3)^{33} \\times 2^1 \\equiv 1^{33} \\times 2 \\equiv 2 \\pmod 7$.",
    shortcutSolution:
      "For 'remainder of $a^n$ divided by $m$' questions, only the exponent's remainder on division by the cycle length matters.\n\nHere the cycle length is $3$ (found instantly: keep multiplying by 2 mod 7 until you hit 1 — it takes 3 steps). Just take $100 \\bmod 3 = 1$, then read off the $1^{\\text{st}}$ term of the cycle $(2, 4, 1, 2, 4, 1, \\ldots)$, which is $2$. No large powers ever get computed."
  }
];

