import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const source = (path) => readFile(new URL(`../src/${path}`, import.meta.url), 'utf8');

test('graph node types map to print inks', async () => {
  const tokens = await source('styles/tokens.css');
  const inks = {
    person: 'ink-orange',
    publication: 'ink-blue',
    project: 'ink-lime',
    topic: 'ink-pink',
    skill: 'ink-teal',
    organization: 'ink-yellow',
    section: 'ink-sky',
    value: 'paper',
    link: 'line',
  };
  for (const [type, ink] of Object.entries(inks)) {
    assert.match(tokens, new RegExp(`--color-graph-${type}: var\\(--${ink}\\);`), type);
  }
});

test('graph sits on a print ground with solid ink fills', async () => {
  const graph = await source('components/KnowledgeGraph.astro');
  assert.match(graph, /\.kg-stage \{[^}]*height: 100svh;[^}]*border-left: var\(--stroke-print\) solid var\(--line\);[^}]*border-radius: 0;[^}]*background: var\(--paper\);/);
  assert.match(graph, /\.kg-stage \{[^}]*border-left: 0;[^}]*border-top: var\(--stroke-print\) solid var\(--line\);/);
  assert.match(graph, /class="kg-intro"/);
  assert.match(graph, /\.kg-node circle \{[^}]*fill: currentColor;[^}]*stroke: var\(--line\);[^}]*stroke-width: var\(--stroke-line\);/);
  assert.doesNotMatch(graph, /fill: color-mix/);
});
