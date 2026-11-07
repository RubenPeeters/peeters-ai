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
const contact = { en: '/contact', nl: '/nl/contact' };

for (const [locale, paths] of Object.entries(pages)) {
  test(`${locale}: header has the wordmark, all six sections, at most one current pill and the other language`, async () => {
    const other = locale === 'en' ? { code: 'nl', name: 'Nederlands', home: '/nl/onderzoek' } : { code: 'en', name: 'English', home: '/research' };
    for (const path of [...Object.values(paths), contact[locale]]) {
      const html = await page(path);
      const header = html.match(/<header class="site-header"[\s\S]*?<\/header>/)?.[0] ?? '';
      assert.match(header, /class="brand display-m"[^>]*>Ruben Peeters</, path);
      const nav = [...header.matchAll(/<li[^>]*>\s*<a href="([^"]+)"/g)].map((m) => m[1]);
      assert.deepEqual(nav, ['blog', 'research', 'projects', 'about', 'cv', 'contact'].map((k) => ({ ...paths, contact: contact[locale] })[k]), path);
      assert.ok(count(header, /aria-current="page"/g) <= 1, path);
      const lang = header.match(/<a [^>]*class="lang-link"[^>]*>\s*([A-Z]+)\s*<\/a>/);
      assert.equal(lang?.[1], other.code.toUpperCase(), path);
      assert.match(lang[0], new RegExp(`lang="${other.code}" hreflang="${other.code}" aria-label="${other.name}"`), path);
      assert.doesNotMatch(header, /aria-current="true"|aria-pressed/, path);
      assert.match(header, /aria-expanded="false" aria-controls="site-nav"/, path);
    }
    assert.match(await page(paths.research), new RegExp(`href="${other.home}" class="lang-link"`));
  });

  test(`${locale}: every header link carries its section's ink, the same on every page`, async () => {
    const inks = { blog: 'orange', research: 'blue', projects: 'lime', about: 'pink', cv: 'yellow', contact: 'teal' };
    for (const path of [paths.research, contact[locale]]) {
      const header = (await page(path)).match(/<header class="site-header"[\s\S]*?<\/header>/)?.[0] ?? '';
      const links = [...header.matchAll(/<li[^>]*>\s*<a href="[^"]+"[^>]*style="--nav-ink: var\(--ink-([a-z]+)\)"[^>]*>/g)].map((m) => m[1]);
      assert.deepEqual(links, Object.values(inks), path);
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

  test(`${locale}: a project without repo or demo renders no empty link row`, async () => {
    const list = (await page(paths.projects)).match(/<ol class="projects"[\s\S]*?<\/ol>/)?.[0] ?? '';
    const jarvis = list.split('<li class="card project bleed"').find((card) => card.includes('>Jarvis</h3>')) ?? '';
    assert.ok(jarvis, 'Jarvis card');
    assert.doesNotMatch(jarvis, /class="links"|<a href/);
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
