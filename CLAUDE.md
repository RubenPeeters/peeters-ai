# CLAUDE.md

Working agreement for Claude (and other AI assistants) on this repo.

## What this repo is

Source for **peeters.ai**, Ruben Peeters' personal website.

- Stack: Astro + TypeScript, deployed to GitHub Pages
- Tone: formal, warm, approachable — signals expertise without being stiff
- Languages: Dutch (NL) and English (EN), with a toggle
- Design direction: "Claude design" — warm cream background, coral accent, serif headings, generous whitespace, content-centered, minimal chrome

## Working agreement

- **Never push directly to `main`.** Bootstrap commits are the only exception.
- For every change: branch → PR → request `@codex review` in a PR comment → address feedback → merge.
- Keep PRs **small and focused** — one concern per PR.
- Don't add features beyond what the current PR scope requires. No speculative abstractions.
- Don't write comments that explain *what* code does — only *why*, when the why is non-obvious.
- Bilingual copy: every visible string must exist in both NL and EN. Use the i18n system, never hardcode strings in components.
- Content (papers, projects, copy) lives in `src/content/` as Markdown so adding an item is a one-file change.

## CI

- On PR: typecheck + build must pass.
- On push to `main`: build and deploy to GitHub Pages.

## Things to ask before doing

- Adding a new top-level page or section
- Adding a dependency that isn't already in `package.json`
- Changing the visual identity (colors, fonts, layout system)
- Anything that touches the deploy workflow
