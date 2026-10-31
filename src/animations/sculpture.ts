// "System Core" — an original 3D wireframe sculpture drawn with Canvas 2D (no WebGL needed).
// Outer shell = the product surface; inner core = the architecture beneath it.
// Cursor proximity pulls the shell apart to reveal labelled system layers (UI, API, AUTH, DB…),
// and scrolling unfolds the sphere into a layered architecture diagram.

type V3 = [number, number, number];

const LIME = "210,255,0";
const IVORY = "244,244,237";

function icosphere(): { v: V3[]; e: [number, number][] } {
  const t = (1 + Math.sqrt(5)) / 2;
  let v: V3[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  let f: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  const norm = (p: V3): V3 => {
    const l = Math.hypot(p[0], p[1], p[2]);
    return [p[0] / l, p[1] / l, p[2] / l];
  };
  v = v.map(norm);
  const cache = new Map<string, number>();
  const mid = (a: number, b: number) => {
    const k = a < b ? `${a}_${b}` : `${b}_${a}`;
    const hit = cache.get(k);
    if (hit !== undefined) return hit;
    const p = norm([(v[a][0] + v[b][0]) / 2, (v[a][1] + v[b][1]) / 2, (v[a][2] + v[b][2]) / 2]);
    v.push(p);
    cache.set(k, v.length - 1);
    return v.length - 1;
  };
  const nf: typeof f = [];
  for (const [a, b, c] of f) {
    const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
    nf.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
  }
  f = nf;
  const es = new Set<string>();
  const e: [number, number][] = [];
  for (const [a, b, c] of f) {
    for (const [x, y] of [[a, b], [b, c], [c, a]] as [number, number][]) {
      const k = x < y ? `${x}_${y}` : `${y}_${x}`;
      if (!es.has(k)) {
        es.add(k);
        e.push([x, y]);
      }
    }
  }
  return { v, e };
}

interface Packet {
  edge: number;
  t: number;
  speed: number;
  inner: boolean;
}

export interface SculptureHandle {
  setScroll(p: number): void;
  destroy(): void;
}

export function createSculpture(canvas: HTMLCanvasElement, reduced: boolean): SculptureHandle {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { setScroll() {}, destroy() {} };

  const shell = icosphere();
  const N = shell.v.length;

  // Layered target positions (scroll morph): 3 tiers — Interface / Services / Data
  const tiers = [-0.78, 0, 0.78];
  const layered: V3[] = shell.v.map((_, i) => {
    const tier = i % 3;
    const idx = Math.floor(i / 3);
    const perTier = Math.ceil(N / 3);
    const cols = 7;
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    const rows = Math.ceil(perTier / cols);
    return [(col / (cols - 1) - 0.5) * 2.0, tiers[tier], (row / Math.max(1, rows - 1) - 0.5) * 1.1];
  });

  const coreLabels = ["UI", "API", "AUTH", "DB", "CACHE", "AI"];
  const core: V3[] = [
    [0, 0.42, 0], [0.42, 0, 0], [0, 0, 0.42], [-0.42, 0, 0], [0, 0, -0.42], [0, -0.42, 0],
  ];
  const coreEdges: [number, number][] = [
    [0, 1], [0, 2], [0, 3], [0, 4], [5, 1], [5, 2], [5, 3], [5, 4], [1, 2], [2, 3], [3, 4], [4, 1],
  ];

  // Orbit ring (data bus)
  const ringN = 64;
  const ring: V3[] = Array.from({ length: ringN }, (_, i) => {
    const a = (i / ringN) * Math.PI * 2;
    return [Math.cos(a) * 1.32, Math.sin(a * 3) * 0.04, Math.sin(a) * 1.32];
  });

  const packets: Packet[] = Array.from({ length: 18 }, (_, i) => ({
    edge: Math.floor(Math.random() * (i % 3 === 0 ? coreEdges.length : shell.e.length)),
    t: Math.random(),
    speed: 0.004 + Math.random() * 0.01,
    inner: i % 3 === 0,
  }));

  let w = 0, h = 0, dpr = 1, R = 100, cx = 0, cy = 0;
  const pos: V3[] = shell.v.map((p) => [...p] as V3);
  const proj = new Float32Array(N * 3); // x, y, depth
  const pushAmt = new Float32Array(N);
  const coreProj = new Float32Array(core.length * 3);
  const ringProj = new Float32Array(ringN * 3);

  let mx = -9999, my = -9999, hasPointer = false;
  let rotY = 0.6, rotX = -0.25, tgtX = -0.25, tgtYOff = 0, yOff = 0;
  let scrollP = 0, scrollS = 0;
  let reveal = 0;
  let running = true, visible = true, raf = 0;
  let autoT = 0;

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const narrow = w < 760;
    R = Math.min(w, h) * (narrow ? 0.34 : 0.3);
    cx = narrow ? w * 0.5 : w * 0.66;
    cy = narrow ? h * 0.42 : h * 0.47;
  };

  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
    hasPointer = true;
    tgtYOff = ((mx / w) - 0.5) * 0.9;
    tgtX = -0.25 + ((my / h) - 0.5) * 0.5;
  };
  const onLeave = () => {
    hasPointer = false;
    mx = my = -9999;
  };

  const rotate = (p: V3, ry: number, rx: number): V3 => {
    const cyr = Math.cos(ry), syr = Math.sin(ry);
    const x1 = p[0] * cyr - p[2] * syr;
    const z1 = p[0] * syr + p[2] * cyr;
    const cxr = Math.cos(rx), sxr = Math.sin(rx);
    const y2 = p[1] * cxr - z1 * sxr;
    const z2 = p[1] * sxr + z1 * cxr;
    return [x1, y2, z2];
  };

  const project = (p: V3, out: Float32Array, i: number, scale: number) => {
    const f = 3.2 / (3.2 + p[2]);
    out[i * 3] = cx + p[0] * R * scale * f;
    out[i * 3 + 1] = cy + p[1] * R * scale * f;
    out[i * 3 + 2] = p[2];
  };

  const frame = () => {
    raf = 0;
    if (!running || !visible) return;
    autoT += reduced ? 0 : 0.0022;
    scrollS += (scrollP - scrollS) * 0.08;
    yOff += (tgtYOff - yOff) * 0.05;
    rotX += (tgtX - rotX) * 0.05;
    rotY = autoT + yOff;

    // touch / no-pointer: a slow wandering focus point keeps the reveal alive
    let fx = mx, fy = my;
    if (!hasPointer) {
      fx = cx + Math.cos(autoT * 2.1) * R * 0.75;
      fy = cy + Math.sin(autoT * 1.7) * R * 0.55;
    }

    const m = Math.min(1, scrollS * 1.6);
    const em = m * m * (3 - 2 * m);
    const scale = 1 - scrollS * 0.15;

    // centre distance drives the global reveal of the inner core
    const dc = Math.hypot(fx - cx, fy - cy);
    const tgtReveal = Math.max(0, 1 - dc / (R * 1.15)) * (hasPointer ? 1 : 0.55);
    reveal += (Math.max(tgtReveal, em) - reveal) * 0.06;

    for (let i = 0; i < N; i++) {
      const s = shell.v[i];
      const l = layered[i];
      const base: V3 = [s[0] + (l[0] - s[0]) * em, s[1] + (l[1] - s[1]) * em, s[2] + (l[2] - s[2]) * em];
      const pr = rotate(base, rotY * (1 - em * 0.85) + em * 0.55, rotX * (1 - em) + em * -0.42);
      // temp projection for cursor distance
      project(pr, proj, i, scale);
      const dx = proj[i * 3] - fx, dy = proj[i * 3 + 1] - fy;
      const d = Math.hypot(dx, dy);
      const rad = R * 0.95;
      const tgt = d < rad ? Math.pow(1 - d / rad, 1.6) : 0;
      pushAmt[i] += (tgt * (1 - em) - pushAmt[i]) * 0.12;
      const k = 1 + pushAmt[i] * 0.55 + reveal * 0.12 * (1 - em);
      pos[i] = [pr[0] * k, pr[1] * k, pr[2] * k];
      project(pos[i], proj, i, scale);
    }
    for (let i = 0; i < core.length; i++) {
      const c = core[i];
      const sc = 1 + em * 0.6;
      project(rotate([c[0] * sc, c[1] * sc, c[2] * sc], -autoT * 1.6 + yOff, rotX), coreProj, i, scale);
    }
    for (let i = 0; i < ringN; i++) {
      project(rotate(ring[i], -autoT * 0.7, rotX + 0.35), ringProj, i, scale * (1 + em * 0.2));
    }

    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";

    // orbit ring — dashed bus
    ctx.lineWidth = 1;
    for (let i = 0; i < ringN; i += 2) {
      const j = (i + 1) % ringN;
      const z = ringProj[i * 3 + 2];
      const a = (0.1 + (1 - (z + 1.4) / 2.8) * 0.3) * (1 - em * 0.7);
      ctx.strokeStyle = `rgba(${IVORY},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(ringProj[i * 3], ringProj[i * 3 + 1]);
      ctx.lineTo(ringProj[j * 3], ringProj[j * 3 + 1]);
      ctx.stroke();
    }

    // core
    const coreA = Math.min(1, reveal * 1.25);
    if (coreA > 0.02) {
      ctx.lineWidth = 1.2;
      for (const [a, b] of coreEdges) {
        ctx.strokeStyle = `rgba(${LIME},${(0.55 * coreA).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(coreProj[a * 3], coreProj[a * 3 + 1]);
        ctx.lineTo(coreProj[b * 3], coreProj[b * 3 + 1]);
        ctx.stroke();
      }
    }

    // shell edges — sorted back to front by simple depth alpha
    for (let k = 0; k < shell.e.length; k++) {
      const [a, b] = shell.e[k];
      const za = proj[a * 3 + 2], zb = proj[b * 3 + 2];
      const depth = 1 - ((za + zb) / 2 + 1.3) / 2.6; // 0 back → 1 front
      const push = (pushAmt[a] + pushAmt[b]) / 2;
      const alpha = 0.08 + depth * 0.42;
      if (push > 0.12) {
        ctx.strokeStyle = `rgba(${LIME},${Math.min(0.95, alpha + push * 0.6).toFixed(3)})`;
        ctx.lineWidth = 1.1;
      } else {
        ctx.strokeStyle = `rgba(${IVORY},${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.8;
      }
      ctx.beginPath();
      ctx.moveTo(proj[a * 3], proj[a * 3 + 1]);
      ctx.lineTo(proj[b * 3], proj[b * 3 + 1]);
      ctx.stroke();
    }

    // vertices
    for (let i = 0; i < N; i++) {
      const z = proj[i * 3 + 2];
      const depth = 1 - (z + 1.3) / 2.6;
      const s = 1.2 + depth * 1.6 + pushAmt[i] * 2.4;
      ctx.fillStyle = pushAmt[i] > 0.15 ? `rgba(${LIME},0.95)` : `rgba(${IVORY},${(0.25 + depth * 0.6).toFixed(3)})`;
      ctx.fillRect(proj[i * 3] - s / 2, proj[i * 3 + 1] - s / 2, s, s);
    }

    // packets
    for (const p of packets) {
      p.t += reduced ? 0 : p.speed;
      if (p.t > 1) {
        p.t = 0;
        p.edge = Math.floor(Math.random() * (p.inner ? coreEdges.length : shell.e.length));
      }
      let x: number, y: number, a: number;
      if (p.inner) {
        if (coreA < 0.05) continue;
        const [ea, eb] = coreEdges[p.edge];
        x = coreProj[ea * 3] + (coreProj[eb * 3] - coreProj[ea * 3]) * p.t;
        y = coreProj[ea * 3 + 1] + (coreProj[eb * 3 + 1] - coreProj[ea * 3 + 1]) * p.t;
        a = coreA;
      } else {
        const [ea, eb] = shell.e[p.edge];
        x = proj[ea * 3] + (proj[eb * 3] - proj[ea * 3]) * p.t;
        y = proj[ea * 3 + 1] + (proj[eb * 3 + 1] - proj[ea * 3 + 1]) * p.t;
        a = 0.9;
      }
      ctx.fillStyle = `rgba(${LIME},${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // core nodes + labels
    if (coreA > 0.02) {
      ctx.font = `500 ${Math.max(10, Math.round(R * 0.055))}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = "middle";
      for (let i = 0; i < core.length; i++) {
        const x = coreProj[i * 3], y = coreProj[i * 3 + 1];
        ctx.fillStyle = `rgba(${LIME},${coreA.toFixed(3)})`;
        ctx.fillRect(x - 3.5, y - 3.5, 7, 7);
        ctx.strokeStyle = `rgba(${LIME},${(coreA * 0.5).toFixed(3)})`;
        ctx.strokeRect(x - 8, y - 8, 16, 16);
        ctx.fillStyle = `rgba(${IVORY},${(coreA * 0.9).toFixed(3)})`;
        ctx.fillText(coreLabels[i], x + 13, y);
      }
    }

    // tier labels when unfolded into the architecture diagram
    if (em > 0.25) {
      const labels = ["INTERFACE", "SERVICES", "DATA"];
      ctx.font = `500 ${Math.max(10, Math.round(R * 0.05))}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.fillStyle = `rgba(${LIME},${((em - 0.25) / 0.75).toFixed(3)})`;
      tiers.forEach((ty, i) => {
        const p = rotate([-1.15, ty, 0], 0.55, -0.42);
        const f = 3.2 / (3.2 + p[2]);
        ctx.fillText(`0${i + 1} / ${labels[i]}`, cx + p[0] * R * scale * f - R * 0.55, cy + p[1] * R * scale * f);
      });
    }

    if (!reduced || hasPointer) raf = requestAnimationFrame(frame);
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  resize();
  window.addEventListener("resize", resize);
  const host = canvas.closest("section") || canvas;
  host.addEventListener("pointermove", onMove as EventListener);
  host.addEventListener("pointermove", kick);
  host.addEventListener("pointerleave", onLeave);

  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible) kick();
  });
  io.observe(canvas);
  const onVis = () => {
    running = !document.hidden;
    if (running) kick();
  };
  document.addEventListener("visibilitychange", onVis);
  kick();

  return {
    setScroll(p: number) {
      scrollP = p;
      if (reduced) {
        scrollS = p;
        kick();
      }
    },
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    },
  };
}
