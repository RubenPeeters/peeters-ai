# Writing syntax

Posts in `src/content/posts/` can be Markdown (`.md`) or MDX (`.mdx`).
Both use the same highlighting and callout syntax. Existing Markdown blockquotes
and MDX components keep working.

## Highlighting

```md
This is ==the part to remember==.
```

Highlight delimiters must be in one plain-text span on one line. Put formatting
outside the highlight (`**==important==**`), rather than inside it.
Inline code and fenced code blocks stay literal; use inline code to show
`==delimiters==` without highlighting.

## Callouts

Use a blockquote starting with `[!note]`, `[!tip]`, or `[!warning]`
(case-insensitive). The rest of that line is the title. Content begins on the
next quoted line. Titles and bodies can contain normal Markdown.

```md
> [!note] A useful detail
> This is a blue note with ==highlighted text==.
>
> It can contain multiple paragraphs and [links](https://example.com).

> [!tip]+ Try this
> This green tip starts expanded and can be collapsed.
>
> - A list item
> - Another item

> [!warning]- Before running
> This amber warning starts collapsed.
> Check the input first.
```

No suffix means a static callout. `+` means initially open; `-` means
initially closed. Collapsible callouts use native `details` / `summary`,
so they work with a keyboard and without JavaScript.

A title is optional: `> [!note]` defaults to “Note” for English posts and
“Opmerking” for posts with `locale: nl` in their frontmatter. Tip and warning
labels are localized too. Write custom titles in the language of the post.

Unknown types (for example `[!example]`) remain ordinary blockquotes.
Nested blockquotes/callouts and code blocks are supported. Callout colors
supplement the visible title, so meaning does not depend on color alone.

## Checks

Run `node --test tests/writing.test.mjs`, `pnpm check`, and `pnpm build`
before submitting changes.
