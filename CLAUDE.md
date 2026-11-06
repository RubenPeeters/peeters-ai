# CLAUDE.md

Working agreement for Claude (and other AI assistants) on this repo.

## What this repo is

Source for **peeters.ai**, Ruben Peeters' personal website.

- Stack: Astro + TypeScript, deployed to GitHub Pages
- Tone: formal, warm, approachable. Signals expertise without being stiff.
- Copy: avoid em dashes in both languages; use natural sentence punctuation instead.
- Languages: Dutch (NL) and English (EN), with a toggle
- Design: the Peeters Design System (RubenPeeters/design), copied into src/styles/design/. Preserve the interactive RDF graph as the homepage entrance.

## Working agreement (forge)

This repo is managed by forge (`~/projects/dev-workflow`): approved GitHub issues become PRs.

- `main` is the live site, `dev` is integration. Neither is pushed to directly.
- Every change is one issue -> one branch (`feat/<n>-slug`, `fix/<n>-slug`, ...) -> one PR into `dev`.
- forge's reviewers review every PR; blocking findings must be fixed or rebutted.
- `make check` must pass before a commit is pushed. It runs exactly what CI runs.
- Keep PRs **small and focused**: one concern per PR. No speculative abstractions, no drive-by refactors.
- Don't write comments that explain *what* code does, only *why*, when the why is non-obvious.
- Conventional Commit messages.
- Bilingual copy: every visible string must exist in both NL and EN. Use the i18n system, never hardcode strings in components.
- Content (papers, projects, copy) lives in `src/content/` as Markdown so adding an item is a one-file change.

## CI

- On PRs and pushes to `dev`: the `check` job runs `make check` (astro check + build).
- On push to `main` (a release merged from `dev`): build and deploy to GitHub Pages.

## Things to ask before doing

- Adding a new top-level page or section
- Adding a dependency that isn't already in `package.json`
- Changing the visual identity (colors, fonts, layout system)
- Changing CI, deployment, or anything under `.github/`
