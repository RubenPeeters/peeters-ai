import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import vm from 'node:vm';

// Built-page checks read dist, so run `pnpm build` first.
const page = (path) => readFile(new URL(`../dist${path}/index.html`, import.meta.url), 'utf8');
const source = await readFile(new URL('../public/design/equation-art.js', import.meta.url), 'utf8');

// Just enough DOM for the drawing functions, serialised so two runs can be compared.
function node(tag) {
  const attrs = {}, children = [];
  return {
    attrs, children,
    setAttribute: (k, v) => { attrs[k] = String(v); },
    appendChild: (c) => children.push(c),
    replaceChildren: () => { children.length = 0; },
    toString: () => `<${tag} ${JSON.stringify(attrs)}>${children.join('')}</${tag}>`,
  };
}
function load() {
  const window = {};
  vm.runInNewContext(source, { window, document: { createElementNS: (_, tag) => node(tag) } });
  return window.PeetersArt;
}
const badge = (art, slug) => {
  const svg = node('svg');
  art.superformula(svg, art.superParams(slug));
  return String(svg);
};

test('the copy carries the design repo comment', () => {
  assert.match(source.split('\n')[0], /^\/\* Copied from `RubenPeeters\/design` at commit `087a9b9` \(087a9b99b53e962039de2ed7bb6fa4df39e63d32\)\. Do not edit here/);
});

test('the same slug always gives the same badge, and slugs differ', () => {
  const [a, b] = [load(), load()];
  assert.equal(badge(a, 'fpl-optimizer'), badge(b, 'fpl-optimizer'));
  assert.notEqual(badge(a, 'fpl-optimizer'), badge(a, 'league-kg'));
  const p = a.superParams('fpl-optimizer');
  assert.ok(Number.isInteger(p.m) && p.m >= 3 && p.m <= 9);
});

test('every print draws without throwing', () => {
  const art = load();
  for (const [kind, arg] of [['rose'], ['lissajous'], ['hills'], ['sunflower', 9], ['spiral', 0.5]]) {
    const svg = node('svg');
    art[kind](svg, arg);
    assert.ok(svg.children.length > 1, kind);
  }
});

test('section pages open with one header art and no framed print', async () => {
  const projects = (await readdir(new URL('../src/content/projects', import.meta.url))).map((f) => f.replace('.yaml', ''));
  const placements = {
    research: 'data-print="lissajous"', 'nl/onderzoek': 'data-print="lissajous"',
    blog: 'data-print="rose"', 'nl/blog': 'data-print="rose"',
    projects: 'data-print="superformula" data-arg="projects"', 'nl/projecten': 'data-print="superformula" data-arg="projects"',
    about: 'data-print="spiral" data-arg="1"', 'nl/over-mij': 'data-print="spiral" data-arg="1"',
    contact: 'data-print="hills"', 'nl/contact': 'data-print="hills"',
  };
  for (const [path, print] of Object.entries(placements)) {
    const html = await page(`/${path}`);
    const header = html.match(/<header class="section-header bleed"[\s\S]*?<\/header>/)?.[0] ?? '';
    assert.ok(header.includes(print), path);
    const cards = path.endsWith('projects') || path.endsWith('projecten') ? projects.length : 0;
    assert.equal((html.match(/class="art"/g) ?? []).length, 1 + cards, path);
    assert.ok(!/class="print/.test(html), path);
    assert.ok(html.includes('/design/equation-art.js'), path);
  }
  for (const path of ['projects', 'nl/projecten']) {
    const html = await page(`/${path}`);
    const list = html.match(/<ol class="projects"[\s\S]*?<\/ol>/)?.[0] ?? '';
    assert.equal((list.match(/<li class="card project bleed"/g) ?? []).length, projects.length, path);
    const tiles = [...list.matchAll(/<span class="tile (ink[0-2])" aria-hidden="true"/g)].map((m) => m[1]);
    assert.deepEqual(tiles, projects.map((_, i) => `ink${i % 3}`), path);
    for (const slug of projects) assert.match(list, new RegExp(`class="art"[^>]*data-print="superformula" data-arg="${slug}"`), `${path}: ${slug}`);
    assert.ok(!/data-print="spiral"/.test(list), path);
  }
  assert.ok(!(await page('/cv')).includes('equation-art.js'));
});

test('a blog post opens with the hills horizon, its formula and reading time', async () => {
  const html = await page('/blog/why-kg-portfolio');
  assert.match(html, /data-colourway="orange"/);
  assert.match(html, /<div class="horizon bleed"[^>]*><svg[^>]*class="art"[^>]*data-print="hills"/);
  assert.match(html, /y = h \+ a·sin\(fx \+ φ\) · \d+ min read/);
});
