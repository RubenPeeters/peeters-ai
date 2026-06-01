# Style guide — peeters.ai

A design style guide for this site, grounded in **Jean-Luc Doumont's** approach to
visual communication (*Trees, Maps, and Theorems*). The aim is the same one he sets for
slides: **maximize the signal-to-noise ratio for the reader.** Every element earns its
place by helping the reader understand; anything else is noise and gets cut.

This is a reference for making pages, sections, and any visuals (diagrams, future slides,
social cards) feel coherent. The concrete values live in
[`src/styles/tokens.css`](../src/styles/tokens.css) — this doc says *why* and *when*.

## Governing principle

> Adapt to your audience, maximize signal/noise, use effective redundancy.

Reader-first, always. Before adding anything to a page, ask: *does this help the reader,
or is it decoration?* If it's decoration, it's noise.

## One message per unit

Doumont's signature move: each slide carries **one message**, and its title states that
message as a **full sentence**, not a label ("We entered Asia, so sales grew" — not "Q3
Sales").

Applied here:

- Each **section** of a page has one job. If you can't say its message in a sentence, the
  section is unfocused — split it or cut it.
- Prefer headings and taglines that **assert** something over headings that merely label.
  A label names a topic; a message says something about it.
- The reader should grasp a section's point in a few seconds, then read on for detail.

## Signal over noise

- **No decorative chrome.** No gratuitous borders, gradients, drop shadows, background
  patterns, or repeated logos. The accent color is never a fill or a gradient
  (`tokens.css` says this explicitly).
- **No bullet-point dumps.** Bullets are prose chopped into fragments. Replace a list with
  a short structured layout, a sentence, or a small visual whenever you can.
- **Cut, don't shrink.** When a section feels crowded, remove elements rather than
  reducing spacing. White space is structure, not waste.

## Layout

- **One narrow column, top to bottom.** `--measure: 40rem`; body copy capped at `68ch`.
  Long line lengths are noise — they slow reading.
- **Generous, deliberate white space.** Use the spacing scale
  (`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`). Don't invent off-scale gaps.
- **Alignment and grouping carry meaning.** Related things sit close and aligned; unrelated
  things are separated. Position is information (Gestalt proximity).
- Text is **left-aligned, ragged right.** No justified paragraphs, no centered body copy.

## Typography

- **Sans-serif throughout** (`Hanken Grotesk`), with **mono reserved for small
  labels/eyebrows** (`IBM Plex Mono`). Doumont's rule: one workhorse sans, chosen for
  legibility — serifs are avoided. Two families, used consistently.
- **Hierarchy from weight and size, not family.** Headings are the same sans as the body,
  set heavier (`500`) and larger; the page lede sits at body weight so it reads as a
  sentence, not a title.
- **Emphasis with weight, never italics or color.** Bold the word; don't slant or tint it.
  Italics survive only for genuine citation conventions (e.g. publication venues).
- Few sizes. Stick to the `--text-*` tokens; each maps to a role (h1/h2/h3, body, tagline,
  small, mono-label).
- High contrast, comfortable measure, `1.65` body leading for readability.

## Color

- **Warm paper background, deep-teal ink.** A neutral surface with dark text is the
  baseline — calm, low-noise.
- **One accent (azure `#0075ff`), used sparingly to direct attention** — links/hover, the
  eyebrow label, a status dot. Color is a *pointer*, never decoration.
- **Never rely on color alone** to carry meaning (effective redundancy + accessibility).
  Pair it with position, a label, or shape. The accent must survive a color-blind reader
  and still leave the meaning intact.

## Data & diagrams

When the site grows charts or schematics, apply the same rules:

- Strip non-data ink: no gridlines clutter, no 3-D effects, no heavy borders, no default
  spreadsheet styling.
- **Label directly** instead of using a separate legend.
- Annotate the takeaway *on* the visual — the graph should make the message obvious, the
  way a slide title does.

## Effective redundancy

Reinforce the key message through *complementary* channels — the heading asserts it, the
copy explains it, a visual shows it — but never pointless repetition. Don't restate the
same words in three places; restate the same *idea* in forms that reinforce each other.

## The test

Before shipping a page or section, ask:

1. **What's the one message?** Can I state it in a sentence?
2. **Does every element help the reader get that message?** If not, cut it.
3. **Could I remove anything and lose nothing?** If yes, remove it.

> Say one thing, assert it plainly, show it cleanly, cut everything else.
