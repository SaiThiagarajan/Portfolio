// Generates topographic "data-flow" contour lines as SVG markup.
// Each set is a family of nested, organically warped closed curves around a few centres.

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ContourOptions {
  seed: number;
  width?: number;
  height?: number;
  centres?: { x: number; y: number; rings: number; r0: number; step: number }[];
  className?: string;
  /** mark every Nth ring as an accent path */
  accentEvery?: number;
}

export function contourSVG(o: ContourOptions): string {
  const W = o.width ?? 1600;
  const H = o.height ?? 1000;
  const rand = rng(o.seed);
  const centres = o.centres ?? [
    { x: W * 0.75, y: H * 0.35, rings: 16, r0: 30, step: 34 },
    { x: W * 0.15, y: H * 0.85, rings: 12, r0: 20, step: 40 },
  ];
  const paths: string[] = [];
  centres.forEach((c, ci) => {
    // per-centre harmonic signature so neighbouring rings share a shape (like real terrain)
    const harmonics = Array.from({ length: 4 }, (_, k) => ({
      f: k + 2,
      a: 0.06 + rand() * 0.12 / (k + 1),
      ph: rand() * Math.PI * 2,
      drift: (rand() - 0.5) * 0.6,
    }));
    for (let i = 0; i < c.rings; i++) {
      const r = c.r0 + i * c.step;
      const pts: [number, number][] = [];
      const N = 96;
      for (let j = 0; j < N; j++) {
        const t = (j / N) * Math.PI * 2;
        let k = 1;
        for (const h of harmonics) k += h.a * Math.sin(h.f * t + h.ph + i * h.drift * 0.25);
        const sx = 1.25;
        pts.push([c.x + Math.cos(t) * r * k * sx, c.y + Math.sin(t) * r * k]);
      }
      // Catmull-Rom → cubic Bézier for smooth closed curve
      let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
      for (let j = 0; j < N; j++) {
        const p0 = pts[(j - 1 + N) % N], p1 = pts[j], p2 = pts[(j + 1) % N], p3 = pts[(j + 2) % N];
        const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
      }
      const accent = o.accentEvery && i % o.accentEvery === o.accentEvery - 1;
      paths.push(
        `<path d="${d}Z" class="${accent ? "c-accent" : "c-line"}" style="--d:${(ci * 0.3 + i * 0.06).toFixed(2)}s" pathLength="1"/>`
      );
    }
  });
  return `<svg class="contours ${o.className ?? ""}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${paths.join("")}</svg>`;
}
