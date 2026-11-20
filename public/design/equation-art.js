/* Copied from `RubenPeeters/design` at commit `1ea6d58` (1ea6d58fb6ea6ab71b7c1f3366a92e8f5bfaadde). Do not edit here: change the design repo, then re-copy. */
/* Equation art: the single source for the prints used by Jarvis and peeters.ai.
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
    // the drawing goes in one group, so the stylesheet can blur it without blurring the tile's edge
    return { s: el(svg, "g", { class: "layer" }), ht: `url(#${id})` };
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

  /* ---- 2026-11-07: fourteen more prints (Curve Tasting; Ruben liked all fourteen) ---- */

  /** Seeded pseudo-random numbers (FNV-1a + mulberry32, as superParams): the same seed, the same picture. */
  function seeded(seed) {
    let h = 2166136261;
    for (const ch of String(seed)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
    return () => { h |= 0; h = (h + 0x6d2b79f5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  /** Scale points (y up) into the print, centred, the longer side `size` units. */
  function fit(pts, size) {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const sc = size / Math.max(x1 - x0, y1 - y0 || 1), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return pts.map(([x, y]) => [C + (x - cx) * sc, C - (y - cy) * sc]);
  }
  // a line in ink k with a black edge, as the Lissajous ribbon
  function ribbon(c, pts, k, w) {
    el(c.s, "path", { d: d(pts, false), fill: "none", stroke: LINE, "stroke-width": w + 3.5, "stroke-linecap": "round", "stroke-linejoin": "round" });
    el(c.s, "path", { d: d(pts, false), fill: "none", style: `stroke: var(--${ink(k)})`, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round" });
  }
  const thin = (c, pts, k, w) => el(c.s, "path", { d: d(pts, false), fill: "none", style: `stroke: var(--${ink(k)})`, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round" });
  /** A grid of cells (n × n over the print), value 0..3 = ink, 4 = line, −1 = empty; drawn as one path per value, row runs merged. */
  function cells(c, grid, n, grow = 1) {
    const s = 240 / n, paths = ["", "", "", "", ""];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; ) {
      const v = grid[y * n + x];
      let e = x + 1; while (e < n && grid[y * n + e] === v) e++;
      if (v >= 0) paths[v] += `M${(x * s).toFixed(2)} ${(y * s).toFixed(2)}h${((e - x) * s * grow).toFixed(2)}v${(s * grow).toFixed(2)}h${(-(e - x) * s * grow).toFixed(2)}Z`;
      x = e;
    }
    paths.forEach((p, v) => { if (p) el(c.s, "path", v === 4 ? { d: p, fill: LINE } : { d: p, class: ink(v) }); });
  }
  /** Points of an attractor binned on a 160-cell grid: a cell takes the ink most of its points carry. */
  function stipple(c, pts, inks, size) {
    const n = 160, p = fit(pts, size), votes = new Uint16Array(n * n * 4), grid = new Int8Array(n * n).fill(-1);
    p.forEach(([x, y], i) => { const gx = Math.floor((x / 240) * n), gy = Math.floor((y / 240) * n); if (gx >= 0 && gx < n && gy >= 0 && gy < n) votes[(gy * n + gx) * 4 + inks[i]]++; });
    for (let i = 0; i < n * n; i++) { let best = -1, m = 0; for (let k = 0; k < 4; k++) if (votes[i * 4 + k] > m) { m = votes[i * 4 + k]; best = k; } grid[i] = best; }
    cells(c, grid, n);
  }

  /** Farris mystery curve z(t) = e^{it} + ½e^{6it} + (i/3)e^{−14it}: arc k of five takes ink k mod 4. */
  function farris(svg) {
    const c = start(svg), n = 1000, raw = [];
    for (let i = 0; i <= n; i++) { const t = (i / n) * TAU; raw.push([Math.cos(t) + Math.cos(6 * t) / 2 + Math.sin(14 * t) / 3, Math.sin(t) + Math.sin(6 * t) / 2 + Math.cos(14 * t) / 3]); }
    const p = fit(raw, 204);
    for (let a = 0; a < 5; a++) ribbon(c, p.slice((a * n) / 5, ((a + 1) * n) / 5 + 1), a, 4);
  }

  /** Guilloché r_j(θ) = 70 + 26 sin(9θ + jπ/12)(1 + ¼cos 3θ), j = 0…23: ring j takes ink ⌊j/6⌋; the boss is ink3. */
  function guilloche(svg) {
    const c = start(svg);
    for (let j = 0; j < 24; j++) {
      const pts = [];
      for (let i = 0; i <= 360; i++) { const t = (i / 360) * TAU; pts.push(polar(70 + 26 * Math.sin(9 * t + (j * Math.PI) / 12) * (1 + 0.25 * Math.cos(3 * t)), t)); }
      thin(c, pts, Math.floor(j / 6), 1.4);
    }
    el(c.s, "circle", { cx: C, cy: C, r: 18, class: "ink3 ln" });
  }

  /** Chladni cos(nπx)cos(mπy) − cos(mπx)cos(nπy) = 0 on [−1,1]²: nodal lines black, plate up ink0, down ink2. */
  function chladni(svg, n = 3, m = 5) {
    const c = start(svg), N = 160, grid = new Int8Array(N * N), P = Math.PI;
    for (let py = 0; py < N; py++) for (let px = 0; px < N; px++) {
      const x = ((px + 0.5) / N) * 2 - 1, y = ((py + 0.5) / N) * 2 - 1;
      const f = Math.cos(n * P * x) * Math.cos(m * P * y) - Math.cos(m * P * x) * Math.cos(n * P * y);
      grid[py * N + px] = Math.abs(f) < 0.07 ? 4 : f > 0 ? 0 : 2;
    }
    cells(c, grid, N);
  }

  /** Clifford x′ = sin(ay) + c cos(ax), y′ = sin(bx) + d cos(by): a point takes the ink of the compass quarter its jump points to. */
  function clifford(svg, a = -1.4, b = 1.6, cc = 1.0, dd = 0.7) {
    const c = start(svg), raw = [], inks = [];
    let x = 0.1, y = 0.1;
    for (let i = 0; i < 60000; i++) {
      const nx = Math.sin(a * y) + cc * Math.cos(a * x), ny = Math.sin(b * x) + dd * Math.cos(b * y);
      const q = Math.floor(((Math.atan2(ny - y, nx - x) + Math.PI) / TAU) * 4) % 4;
      x = nx; y = ny; if (i > 100) { raw.push([x, y]); inks.push(q); }
    }
    stipple(c, raw, inks, 210);
  }

  /** Hopalong x′ = y − sign(x)√|bx − c|, y′ = a − x (a=−11, b=0.05, c=0.5): point i of N takes ink ⌊4i/N⌋. */
  function hopalong(svg, N = 40000) {
    const c = start(svg), raw = [], inks = [], a = -11, b = 0.05, cc = 0.5;
    let x = 0, y = 0;
    for (let i = 0; i < N; i++) { const nx = y - Math.sign(x) * Math.sqrt(Math.abs(b * x - cc)), ny = a - x; x = nx; y = ny; raw.push([x, y]); inks.push(Math.floor((4 * i) / N)); }
    stipple(c, raw, inks, 214);
  }

  /** Ikeda t = 0.4 − 6/(1+x²+y²), x′ = 1 + u(x cos t − y sin t), y′ = u(x sin t + y cos t), u = 0.918: trail j of 400 takes ink j mod 4. */
  function ikeda(svg) {
    const c = start(svg), R = seeded("ikeda"), u = 0.918, raw = [], inks = [];
    for (let j = 0; j < 400; j++) {
      let x = R() * 20 - 10, y = R() * 20 - 10;
      for (let i = 0; i < 120; i++) {
        const t = 0.4 - 6 / (1 + x * x + y * y), nx = 1 + u * (x * Math.cos(t) - y * Math.sin(t)), ny = u * (x * Math.sin(t) + y * Math.cos(t));
        x = nx; y = ny; if (i > 8) { raw.push([x, y]); inks.push(j % 4); }
      }
    }
    stipple(c, raw, inks, 206);
  }

  /** Dragon curve, n folds (1…12): turn k is right when ((k & −k) << 1) & k = 0; segment i takes ink ⌊4i/2ⁿ⌋. */
  function dragon(svg, folds = 11) {
    const c = start(svg), n = Math.max(1, Math.min(12, Math.floor(folds))), N = 1 << n, raw = [[0, 0]];
    let x = 0, y = 0, dir = 0;
    for (let i = 1; i <= N; i++) { x += [1, 0, -1, 0][dir]; y += [0, 1, 0, -1][dir]; raw.push([x, y]); dir = (dir + ((((i & -i) << 1) & i) === 0 ? 3 : 1)) % 4; }
    const p = fit(raw, 196);
    for (let q = 0; q < 4; q++) { const a = Math.floor((q * N) / 4), b = Math.floor(((q + 1) * N) / 4); if (b > a) ribbon(c, p.slice(a, b + 1), q, n > 8 ? 1.6 : 4); }
  }

  /** Hilbert curve of order 5 (1024 cells): steps reached take ink ⌊4d/D⌋, the rest stay a faint line. */
  function hilbert(svg, progress) {
    const c = start(svg), order = 5, n = 1 << order, D = n * n, lit = Math.round(Math.max(0, Math.min(1, progress)) * D), raw = [];
    for (let k = 0; k < D; k++) {
      let rx, ry, t = k, x = 0, y = 0;
      for (let s = 1; s < n; s *= 2) { rx = 1 & (t / 2); ry = 1 & (t ^ rx); if (ry === 0) { if (rx === 1) { x = s - 1 - x; y = s - 1 - y; } [x, y] = [y, x]; } x += s * rx; y += s * ry; t = Math.floor(t / 4); }
      raw.push([x, y]);
    }
    const p = fit(raw, 200);
    el(c.s, "path", { d: d(p, false), fill: "none", stroke: LINE, "stroke-opacity": 0.25, "stroke-width": 1.2 });
    for (let q = 0; q < 4; q++) { const a = Math.floor((q * D) / 4), b = Math.min(lit - 1, Math.floor(((q + 1) * D) / 4)); if (b > a) ribbon(c, p.slice(a, b + 1), q, 2.2); }
  }

  /** Truchet tiles, 8 × 8, flipped by the seed: a region takes ink 0 or 1 by (i + j + flip) parity. */
  function truchet(svg, seed) {
    const c = start(svg), R = seeded(seed), n = 8, s = 240 / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const f = R() < 0.5, x = i * s, y = j * s, par = (i + j + (f ? 1 : 0)) % 2, h = s / 2;
      el(c.s, "rect", { x, y, width: s, height: s, class: ink(par ? 0 : 1) });
      // two quarter discs in opposite corners, as filled wedges with their arc edged
      const corners = f ? [[x + s, y, -1, 1], [x, y + s, 1, -1]] : [[x, y, 1, 1], [x + s, y + s, -1, -1]];
      for (const [cx, cy, sx, sy] of corners) {
        el(c.s, "path", { d: `M${cx} ${cy}L${cx + sx * h} ${cy}A${h} ${h} 0 0 ${sx * sy > 0 ? 1 : 0} ${cx} ${cy + sy * h}Z`, class: ink(par ? 1 : 0) });
        el(c.s, "path", { d: `M${cx + sx * h} ${cy}A${h} ${h} 0 0 ${sx * sy > 0 ? 1 : 0} ${cx} ${cy + sy * h}`, fill: "none", stroke: LINE, "stroke-width": 2 });
      }
    }
  }

  /** Apollonian gasket from curvatures −1, 2, 2, 3, 3 (Descartes' theorem): a circle of generation g takes ink g mod 4. */
  function apollonian(svg) {
    const c = start(svg), R = 108, out = [], mk = (k, x, y, g) => ({ k, x, y, g });
    const A = mk(-1, 0, 0, 0), B = mk(2, 0.5, 0, 0), Cc = mk(2, -0.5, 0, 0), D = mk(3, 0, 2 / 3, 1), E = mk(3, 0, -2 / 3, 1);
    out.push(B, Cc, D, E);
    const refl = (a, b, cc, o, g) => { const k = 2 * (a.k + b.k + cc.k) - o.k; return mk(k, (2 * (a.k * a.x + b.k * b.x + cc.k * cc.x) - o.k * o.x) / k, (2 * (a.k * a.y + b.k * b.y + cc.k * cc.y) - o.k * o.y) / k, g); };
    const rec = (a, b, cc, o, g) => { const m = refl(a, b, cc, o, g); if (1 / m.k < 0.012 || g > 9) return; out.push(m); rec(a, b, m, cc, g + 1); rec(a, cc, m, b, g + 1); rec(b, cc, m, a, g + 1); };
    for (const X of [D, E]) { rec(A, B, X, Cc, 2); rec(A, Cc, X, B, 2); rec(B, Cc, X, A, 2); }
    el(c.s, "circle", { cx: C, cy: C, r: R, class: "paper", stroke: LINE, "stroke-width": 2.5 });
    for (const q of out) el(c.s, "circle", { cx: C + q.x * R, cy: C - q.y * R, r: R / q.k, class: ink(q.g), stroke: LINE, "stroke-width": Math.max(0.6, Math.min(2, 8 / q.k)) });
  }

  /** Ulam spiral of 1…side²: a prime p > 3 takes the ink of p mod 12 (1, 5, 7, 11 → ink 0…3). */
  function ulam(svg, side = 79) {
    const c = start(svg), w = Math.max(9, Math.floor(side) | 1), N = w * w, cell = 240 / w, sieve = new Uint8Array(N + 1).fill(1), grid = new Int8Array(N).fill(-1), cls = { 1: 0, 5: 1, 7: 2, 11: 3 };
    sieve[0] = sieve[1] = 0;
    for (let i = 2; i * i <= N; i++) if (sieve[i]) for (let j = i * i; j <= N; j += i) sieve[j] = 0;
    let x = 0, y = 0, dx = 1, dy = 0, len = 1, run = 0, turns = 0;
    const h = (w - 1) / 2;
    for (let k = 1; k <= N; k++) {
      if (sieve[k] && k > 3) grid[(h - y) * w + (h + x)] = cls[k % 12];
      x += dx; y += dy; if (++run === len) { run = 0; [dx, dy] = [-dy, dx]; if (++turns % 2 === 0) len++; }
    }
    cells(c, grid, w, 1.3);
    el(c.s, "circle", { cx: C + cell * 0.15, cy: C + cell * 0.15, r: Math.max(2, cell * 0.6), fill: LINE });
  }

  /** Euler spiral x = ∫cos(πu²/2), y = ∫sin(πu²/2), −L ≤ s ≤ L (L 1…4, default 4): the stretch with ⌊|s|⌋ = j takes ink j. */
  function euler(svg, L = 4) {
    const c = start(svg), Lc = Math.max(1, Math.min(4, L)), n = 2000, ds = (2 * Lc) / n, half = [];
    let x = 0, y = 0;
    for (let i = 1; i <= n / 2; i++) { const s = i * ds - ds / 2; x += Math.cos((Math.PI * s * s) / 2) * ds; y += Math.sin((Math.PI * s * s) / 2) * ds; half.push([x, y, i * ds]); }
    const all = [...half.map(([a, b, s]) => [-a, -b, -s]).reverse(), [0, 0, 0], ...half];
    const p = fit(all.map(([a, b]) => [a, b]), 212), band = (j) => Math.min(3, Math.floor(Math.abs(all[j][2])));
    let st = 0;
    for (let i = 1; i <= all.length; i++) if (i === all.length || band(i) !== band(st)) { ribbon(c, p.slice(st, i + 1), band(st), 3.4); st = i; }
  }

  /** Weierstrass hills W(x) = Σ ½ⁿ cos(3ⁿπx), band k at 108 + 34k − 16W(x/120 + 0.37k): band k takes ink k; the sun is ink3. */
  function weierstrass(svg, bands = 4) {
    const c = start(svg), nb = Math.max(1, Math.min(4, Math.floor(bands)));
    const W = (x) => { let s = 0; for (let n = 0; n < 9; n++) s += Math.pow(0.5, n) * Math.cos(Math.pow(3, n) * Math.PI * x); return s; };
    el(c.s, "circle", { cx: 168, cy: 66, r: 30, class: "ink3 ln" });
    for (let b = 0; b < nb; b++) {
      const pts = [[-2, 242]];
      for (let px = -2; px <= 242; px += 0.5) pts.push([px, 108 + b * 34 - 16 * W(px / 120 + b * 0.37)]);
      pts.push([242, 242]);
      el(c.s, "path", { d: d(pts), class: ink(b), stroke: LINE, "stroke-width": 1.6, "stroke-linejoin": "round" });
    }
  }

  /** Astroid string art: threads from (t, 0) to (0, 1 − t), envelope x^{2/3} + y^{2/3} = 1; quadrant q takes ink q. */
  function astroid(svg) {
    const c = start(svg), R = 104;
    for (let q = 0; q < 4; q++) {
      const sx = q === 0 || q === 3 ? 1 : -1, sy = q < 2 ? 1 : -1;
      let p = "";
      for (let i = 0; i <= 26; i++) { const t = i / 26; p += `M${(C + sx * t * R).toFixed(2)} ${C}L${C} ${(C - sy * (1 - t) * R).toFixed(2)}`; }
      el(c.s, "path", { d: p, fill: "none", style: `stroke: var(--${ink(q)})`, "stroke-width": 1.5 });
    }
    el(c.s, "path", { d: `M${C - R} ${C}H${C + R}M${C} ${C - R}V${C + R}`, fill: "none", stroke: LINE, "stroke-width": 2 });
  }

  window.PeetersArt = { rose, lissajous, spiral, sunflower, hills, superformula, superParams,
    farris, guilloche, chladni, clifford, hopalong, ikeda, dragon, hilbert, truchet, apollonian, ulam, euler, weierstrass, astroid };
})();
