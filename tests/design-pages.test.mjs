import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';

// Reads the built site, so run `pnpm build` first.
const page = (path) => readFile(new URL(`../dist${path}/index.html`, import.meta.url), 'utf8');
const count = (html, pattern) => (html.match(pattern) ?? []).length;

const pages = {
  en: { research: '/research', projects: '/projects', blog: '/blog', cv: '/cv', about: '/about' },
  nl: { research: '/nl/onderzoek', projects: '/nl/projecten', blog: '/nl/blog', cv: '/nl/cv', about: '/nl/over-mij' },
};

for (const [locale, paths] of Object.entries(pages)) {
  test(`${locale}: header has the wordmark, at most one current pill and both language segments`, async () => {
    for (const path of Object.values(paths)) {
      const html = await page(path);
      assert.match(html, /class="brand display-m"[^>]*>Ruben Peeters</, path);
      assert.ok(count(html, /aria-current="page"/g) <= 1, path);
      assert.match(html, new RegExp(`<span aria-current="true"[^>]*>${locale.toUpperCase()}</span>`), path);
      assert.match(html, /aria-expanded="false" aria-controls="site-nav"/, path);
    }
  });

  test(`${locale}: at most one primary button per page, and it is on the CV`, async () => {
    for (const [key, path] of Object.entries(paths)) {
      assert.equal(count(await page(path), /btn-primary/g), key === 'cv' ? 1 : 0, path);
    }
  });

  test(`${locale}: list items are cards with chip metadata`, async () => {
    for (const key of ['research', 'projects', 'blog']) {
      const html = await page(paths[key]);
      if (html.includes('class="no-posts"')) continue;
      assert.match(html, /<li class="card (paper|project|post)[ "]/, key);
      assert.match(html, /class="chip chip-outline"/, key);
    }
  });

  test(`${locale}: reading pages use the reading column`, async () => {
    for (const key of ['research', 'cv', 'about']) {
      assert.match(await page(paths[key]), /<article class="container reading body/, key);
    }
  });
}

test('the page stays white: no element uses a tint class, and no stylesheet defines one', async () => {
  const dist = new URL('../dist/', import.meta.url);
  const files = (await readdir(dist, { recursive: true })).filter((f) => /\.(html|css)$/.test(f));
  assert.ok(files.length > 0);
  for (const f of files) {
    const text = await readFile(new URL(f, dist), 'utf8');
    assert.doesNotMatch(text, /class="[^"]*\btint\d|\.tint\d|--tint\d/, f);
  }
});
