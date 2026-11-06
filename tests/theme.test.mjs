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

test('header has a Light/Dark switch in both languages', async () => {
  for (const [path, label, light, dark] of [['/research', 'Theme', 'Light', 'Dark'], ['/nl/onderzoek', 'Thema', 'Licht', 'Donker']]) {
    const html = await page(path);
    assert.match(html, new RegExp(`role="group" aria-label="${label}" class="theme-switch"`), path);
    assert.match(html, new RegExp(`data-theme-choice="light" aria-pressed="true"[^>]*>\\s*${light}\\s*<`), path);
    assert.match(html, new RegExp(`data-theme-choice="dark" aria-pressed="false"[^>]*>\\s*${dark}\\s*<`), path);
  }
});

test('code blocks carry github-dark colours for the dark theme', async () => {
  const html = await page('/blog/notebook-demo');
  assert.match(html, /class="astro-code astro-code-themes github-light github-dark"/);
  assert.match(html, /--shiki-dark-bg:/);
});
