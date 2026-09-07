import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import rehypeWriting from '../src/plugins/rehype-writing.mjs';

// Exercise the renderers already installed by Astro, without new dependencies.
const astroRequire = createRequire(import.meta.resolve('astro'));
const mdxRequire = createRequire(import.meta.resolve('@astrojs/mdx'));
const { createMarkdownProcessor } = await import(astroRequire.resolve('@astrojs/markdown-remark'));
const { evaluate } = await import(mdxRequire.resolve('@mdx-js/mdx'));
const markdown = await createMarkdownProcessor({ syntaxHighlight: false, rehypePlugins: [rehypeWriting] });

const jsx = (type, props) => ({ type, props });
function html(node) {
  if (node == null || node === false) return '';
  if (Array.isArray(node)) return node.map(html).join('');
  if (typeof node !== 'object') return String(node);
  if (typeof node.type === 'function') return html(node.type(node.props));
  if (node.type === 'fragment') return html(node.props.children);
  const attributes = Object.entries(node.props)
    .filter(([key, value]) => key !== 'children' && value !== false)
    .map(([key, value]) => ` ${key === 'className' ? 'class' : key}="${value === true ? '' : value}"`).join('');
  return `<${node.type}${attributes}>${html(node.props.children)}</${node.type}>`;
}

const renderers = {
  Markdown: async (source, locale = 'en') => (await markdown.render(source, { frontmatter: { locale } })).code,
  MDX: async (source, locale = 'en') => {
    const module = await evaluate({ value: source, data: { astro: { frontmatter: { locale } } } }, {
      jsx, jsxs: jsx, Fragment: 'fragment', rehypePlugins: [rehypeWriting],
    });
    return html(module.default({ components: { Probe: () => jsx('span', { children: 'Component works' }) } }));
  },
};

for (const [name, render] of Object.entries(renderers)) {
  test(`${name}: highlights text but preserves code and incomplete delimiters`, async () => {
    const result = await render('==remember== and **==important==** and ==unfinished\n\n`==literal==`\n\n```txt\n==code==\n> [!note] literal\n```');
    assert.match(result, /<mark>remember<\/mark>/);
    assert.match(result, /<strong><mark>important<\/mark><\/strong>/);
    assert.match(result, /==unfinished/);
    assert.match(result, /<code>==literal==<\/code>/);
    assert.doesNotMatch(result, /<mark>(literal|code)<\/mark>/);
  });

  test(`${name}: static callout preserves rich title, body, links, lists and nested quotes`, async () => {
    const result = await render('> [!NOTE] A **title**\n> First ==paragraph== with [a link](/about).\n>\n> - One\n> - Two\n>\n> > Ordinary quotation');
    assert.match(result, /<aside class="callout callout-note">/);
    assert.match(result, /<p class="callout-title">A <strong>title<\/strong><\/p>/);
    assert.match(result, /<mark>paragraph<\/mark>/);
    assert.match(result, /href="\/about"/);
    assert.match(result, /<ul>/);
    assert.match(result, /<blockquote>/);
    assert.doesNotMatch(result, /\[!NOTE\]/);
  });

  test(`${name}: collapse state and localized fallback titles`, async () => {
    const open = await render('> [!tip]+\n> Open body', 'nl');
    const closed = await render('> [!warning]-\n> Closed body', 'nl');
    assert.match(open, /<details class="callout callout-tip" open(?:="")?>/);
    assert.match(open, /<summary class="callout-title">Tip<\/summary>/);
    assert.match(closed, /<details class="callout callout-warning">/);
    assert.match(closed, /<summary class="callout-title">Waarschuwing<\/summary>/);
    assert.match(await render('> [!note]\n> Body', 'nl'), />Opmerking<\/p>/);
    assert.match(await render('> [!warning]'), />Warning<\/p>/);
  });

  test(`${name}: ordinary and unknown blockquotes remain blockquotes`, async () => {
    const result = await render('> A normal quotation\n\n> [!example] Unknown\n> Body\n\n> [!note]not-a-marker');
    assert.equal((result.match(/<blockquote>/g) || []).length, 3);
    assert.doesNotMatch(result, /class="callout/);
  });

  test(`${name}: nested callouts and blank paragraph after marker`, async () => {
    const result = await render('> [!note] Outer\n>\n> > [!tip]- Inner\n> > Nested body');
    assert.match(result, /<aside class="callout callout-note">/);
    assert.match(result, /<details class="callout callout-tip">/);
    assert.match(result, /<p>Nested body<\/p>/);
    assert.doesNotMatch(result, /<p><\/p>/);
  });
}

test('MDX: components and expressions still render alongside callouts', async () => {
  const result = await renderers.MDX('> [!tip] Works\n> A callout\n\n<Probe />\n\n{1 + 2}');
  assert.match(result, /Component works/);
  assert.match(result, /3$/);
});
