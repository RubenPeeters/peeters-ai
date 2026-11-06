/* Copied from `RubenPeeters/design` at commit `087a9b9` (087a9b99b53e962039de2ed7bb6fa4df39e63d32). Do not edit here: change the design repo, then re-copy. */
/* Equation art: the single source for the six prints used by Jarvis and peeters.ai.
   Each function draws into an <svg viewBox="0 0 240 240" class="print"> and is deterministic:
   the same arguments always give the same picture. Colours come from the classes in
   components/bundle.css (ink0..ink3 follow the colourway). Ports (lib/art.ts in Jarvis) must
   keep the formulas and colouring rules exactly. */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const TAU = Math.PI * 2, C = 120, LINE = "#1f1d1a";
  const el = (parent, tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  const d = (pts, close = true) => "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L") + (close ? "Z" : "");
  const polar = (r, t) => [C + r * Math.cos(t), C - r * Math.sin(t)];
  const ink = (i) => "ink" + (((i % 4) + 4) % 4);
  let uid = 0;

  // each svg carries its own halftone pattern, so a print works anywhere
  function start(svg) {
    svg.replaceChildren();
    const id = "ht" + ++uid;
    const defs = el(svg, "defs", {});
    const p = el(defs, "pattern", { id, width: 5, height: 5, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
    el(p, "circle", { cx: 2.5, cy: 2.5, r: 1.15, fill: LINE });
    return { s: svg, ht: `url(#${id})` };
  }
  const shade = (c, pts) => el(c.s, "path", { d: d(pts), class: "ht", fill: c.ht });

  /** Rose r = cos 4θ: petal j takes ink j mod 3; odd petals get halftone. */
  function rose(svg) {
    const c = start(svg), R = 100;
    el(c.s, "circle", { cx: C, cy: C, r: 110, fill: "none", class: "ln", "stroke-dasharray": "2 7" });
    for (let j = 0; j < 8; j++) {
      const tc = (j * Math.PI) / 4, pts = [];
      for (let i = 0; i <= 48; i++) { const t = tc - Math.PI / 8 + (i / 48) * (Math.PI / 4); pts.push(polar(R * Math.cos(4 * (t - tc)), t)); }
      el(c.s, "path", { d: d(pts), class: ink(j % 3) + " ln" });
      if (j % 2) shade(c, pts);
    }
    el(c.s, "circle", { cx: C, cy: C, r: 15, class: "ink3 ln" });
  }

  /** Lissajous x = sin(3t+π/2), y = sin 2t: the stretch [kπ/3,(k+1)π/3) takes ink k mod 4, as a ribbon. */
  function lissajous(svg) {
    const c = start(svg), A = 92;
    for (let k = 0; k < 6; k++) {
      const pts = [];
      for (let i = 0; i <= 60; i++) { const t = ((k + i / 60) * Math.PI) / 3; pts.push([C + A * Math.sin(3 * t + Math.PI / 2), C - A * Math.sin(2 * t)]); }
      el(c.s, "path", { d: d(pts, false), fill: "none", stroke: LINE, "stroke-width": 15, "stroke-linecap": "round" });
      el(c.s, "path", { d: d(pts, false), fill: "none", style: `stroke: var(--${ink(k)})`, "stroke-width": 10, "stroke-linecap": "round" });
    }
  }

  /** Spiral staircase r = a·e^{0.12θ}: step i (from the centre out) takes ink i mod 3; steps beyond progress stay paper. */
  function spiral(svg, progress) {
    const c = start(svg), a = 10.5, b = 0.12, r = (t) => a * Math.exp(b * t);
    const core = [[C, C]];
    for (let i = 0; i <= 60; i++) { const t = (i / 60) * TAU; core.push(polar(r(t), t)); }
    el(c.s, "path", { d: d(core), class: "ink3 ln" });
    const N = 48, dt = (2 * TAU) / N, lit = Math.round(Math.max(0, Math.min(1, progress)) * N);
    for (let i = 0; i < N; i++) {
      const t0 = TAU + i * dt, inner = [], outer = [];
      for (let j = 0; j <= 4; j++) { const t = t0 + (j / 4) * dt; inner.push(polar(r(t - TAU), t)); outer.push(polar(r(t), t)); }
      const pts = [...inner, ...outer.reverse()];
      el(c.s, "path", { d: d(pts), class: (i < lit ? ink(i % 3) : "paper") + " ln" });
      if (i < lit && i % 3 === 2) shade(c, pts);
    }
  }

  /** Sunflower θₙ = n·137.508°, rₙ = c√n: seed n takes ink ⌊(n mod 21)/7⌋; the scale is fixed at 420 seeds. */
  function sunflower(svg, count) {
    const c = start(svg), k = 104 / Math.sqrt(420), GA = (137.508 * Math.PI) / 180, n = Math.max(0, Math.min(420, Math.floor(count)));
    for (let i = 1; i <= n; i++) {
      const [x, y] = polar(k * Math.sqrt(i), i * GA);
      el(c.s, "circle", { cx: x, cy: y, r: 2.2 + 2.6 * Math.sqrt(i / 420), class: ink(Math.floor((i % 21) / 7)), stroke: LINE, "stroke-width": 0.9 });
    }
  }

  /** Sine hills y_k = h_k + a_k sin(f_k x + φ_k): band k takes ink k mod 4, back to front; the sun is a disc in ink3. */
  function hills(svg) {
    const c = start(svg);
    el(c.s, "circle", { cx: 160, cy: 82, r: 44, class: "ink3 ln" });
    el(c.s, "circle", { cx: 160, cy: 82, r: 44, class: "ht", fill: c.ht });
    for (let k = 0; k < 5; k++) {
      const h = 118 + k * 25, a = 11 - k * 1.5, f = 1.2 + k * 0.55, ph = k * 1.3, pts = [[-4, 244]];
      for (let x = -4; x <= 244; x += 4) pts.push([x, h + a * Math.sin((TAU * f * x) / 240 + ph)]);
      pts.push([244, 244]);
      el(c.s, "path", { d: d(pts), class: ink(k) + " ln" });
      if (k % 2) shade(c, pts);
    }
  }

  /** FNV-1a + mulberry32: a seed string (Jarvis: the goal id) always gives the same parameters. */
  function superParams(seed) {
    let h = 2166136261;
    for (const ch of String(seed)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
    const R = () => { h |= 0; h = (h + 0x6d2b79f5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    return { m: 3 + Math.floor(R() * 7), n1: 0.4 + R() * 1.6, n2: 0.6 + R() * 2, n3: 0.6 + R() * 2 };
  }

  /** Superformula: copy k at scale 1 − 0.2k takes ink k mod 4; halftone on copy 1. */
  function superformula(svg, p) {
    const c = start(svg), raw = [];
    for (let i = 0; i < 480; i++) {
      const t = (i / 480) * TAU, q = (p.m * t) / 4;
      raw.push([Math.pow(Math.pow(Math.abs(Math.cos(q)), p.n2) + Math.pow(Math.abs(Math.sin(q)), p.n3), -1 / p.n1), t]);
    }
    const max = Math.max(...raw.map((v) => v[0]));
    for (let k = 0; k < 5; k++) {
      const sc = ((1 - 0.2 * k) * 102) / max, rot = (k * Math.PI) / (2 * p.m);
      const pts = raw.map(([rr, t]) => polar(rr * sc, t + rot));
      el(c.s, "path", { d: d(pts), class: ink(k) + " ln" });
      if (k === 1) shade(c, pts);
    }
  }

  window.PeetersArt = { rose, lissajous, spiral, sunflower, hills, superformula, superParams };
})();
