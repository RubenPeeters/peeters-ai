# peeters.ai

Source for [peeters.ai](https://peeters.ai), the personal website of Ruben Peeters — PhD researcher at KU Leuven.

## Stack

- [Astro](https://astro.build/) — static site generator
- TypeScript
- Deployed to GitHub Pages via GitHub Actions
- Bilingual: Dutch and English

## Local development

```bash
pnpm install
pnpm dev
```

The site runs at `http://localhost:4321`.

## Project layout

```
src/
  pages/        # Routes (per language)
  layouts/      # Page shells
  components/   # Reusable UI
  content/      # Markdown content (papers, projects, copy)
  styles/       # Global styles + design tokens
public/         # Static assets served as-is
```

## Contributing

This is a personal site, so external contributions aren't expected. Internal workflow:

1. Branch from `main` (`git switch -c feat/<thing>`)
2. Open a PR
3. Tag `@codex review` in a PR comment
4. Address feedback, merge

See [CLAUDE.md](./CLAUDE.md) for the working agreement followed by AI assistants on this repo.
