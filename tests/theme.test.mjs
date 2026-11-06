import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import vm from 'node:vm';

// Reads the built site, so run `pnpm build` first.
const page = (path) => readFile(new URL(`../dist${path}/index.html`, import.meta.url), 'utf8');

const themeScript = (html) => html.match(/<head>\s*<script>([\s\S]*?)<\/script>/)[1];

// Runs the head script the way a browser would before first paint, then fires ClientRouter's after-swap.
function run(script, storage) {
  const listeners = {};
  const document = {
    documentElement: { dataset: {} },
    addEventListener: (type, fn) => { listeners[type] = fn; },
  };
  vm.runInNewContext(script, { document, localStorage: storage });
  return { document, swap: () => { document.documentElement.dataset = {}; listeners['astro:after-swap'](); } };
}

const memory = (theme) => ({ getItem: (k) => (k === 'theme' ? theme : null) });

for (const path of ['', '/nl/onderzoek', '/blog']) {
  test(`${path || '/'}: theme is set at the top of <head>, light unless dark was stored`, async () => {
    const script = themeScript(await page(path));
    assert.equal(run(script, memory(null)).document.documentElement.dataset.theme, 'light');
    assert.equal(run(script, memory('dark')).document.documentElement.dataset.theme, 'dark');
    const blocked = { getItem: () => { throw new Error('SecurityError'); } };
    assert.equal(run(script, blocked).document.documentElement.dataset.theme, 'light');
  });
}

test('a stored dark choice survives a client-side navigation', async () => {
  const { document, swap } = run(themeScript(await page('/research')), memory('dark'));
  swap();
  assert.equal(document.documentElement.dataset.theme, 'dark');
});

test('the OS colour scheme no longer decides the theme', async () => {
  const html = await page('/research');
  assert.match(html, /<meta name="color-scheme" content="light">/);
  assert.doesNotMatch(html, /media="\(prefers-color-scheme/);
});

test('header has one theme button with a sun and a moon in both languages', async () => {
  for (const [path, toDark, toLight] of [['/research', 'Switch to dark theme', 'Switch to light theme'], ['/nl/onderzoek', 'Schakel naar donker thema', 'Schakel naar licht thema']]) {
    const html = await page(path);
    const button = html.match(/<button type="button" class="theme-toggle"[\s\S]*?<\/button>/)?.[0] ?? '';
    assert.match(button, new RegExp(`aria-label="${toDark}" data-to-dark="${toDark}" data-to-light="${toLight}"`), path);
    assert.match(button, /<svg class="moon"/, path);
    assert.match(button, /<svg class="sun"/, path);
    assert.doesNotMatch(html, /aria-pressed|theme-switch/, path);
  }
});

test('code blocks carry github-dark colours for the dark theme', async () => {
  const html = await page('/blog/notebook-demo');
  assert.match(html, /class="astro-code astro-code-themes github-light github-dark"/);
  assert.match(html, /--shiki-dark-bg:/);
});
