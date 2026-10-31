// Portrait with a "source code" lens: the photo is re-drawn as a field of code glyphs
// (brightness → glyph density) and revealed through a circular lens that follows the cursor.
// This is the developer reinterpretation of the reference site's helmet reveal.

const GLYPHS = " .:-=+*<>/{}[]()#01";

export function initCodePortrait(root: HTMLElement, src: string, reduced: boolean) {
  const photo = root.querySelector<HTMLImageElement>(".cp-photo");
  const codeCanvas = root.querySelector<HTMLCanvasElement>(".cp-code");
  if (!photo || !codeCanvas) return;

  const draw = () => {
    const r = root.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    codeCanvas.width = Math.round(r.width * dpr);
    codeCanvas.height = Math.round(r.height * dpr);
    const ctx = codeCanvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cell = Math.max(7, Math.round(r.width / 70));
    const cols = Math.ceil(r.width / cell);
    const rows = Math.ceil(r.height / (cell * 1.25));

    // sample with object-fit: cover semantics
    const off = document.createElement("canvas");
    off.width = cols;
    off.height = rows;
    const o = off.getContext("2d", { willReadFrequently: true });
    if (!o) return;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(r.width / iw, r.height / ih);
    const sw = r.width / scale, sh = r.height / scale;
    const sx = (iw - sw) / 2, sy = (ih - sh) * 0.2;
    o.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
    const data = o.getImageData(0, 0, cols, rows).data;

    ctx.fillStyle = "#111112";
    ctx.fillRect(0, 0, r.width, r.height);
    ctx.font = `600 ${cell}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textBaseline = "top";
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4;
        const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
        const inv = 1 - lum; // darker pixels → denser glyphs (hair, beard, eyes read clearly)
        const gi = Math.min(GLYPHS.length - 1, Math.floor(Math.pow(inv, 1.15) * GLYPHS.length));
        const ch = GLYPHS[gi];
        if (ch === " ") continue;
        const a = 0.25 + inv * 0.75;
        ctx.fillStyle = inv > 0.62 ? `rgba(210,255,0,${a.toFixed(2)})` : `rgba(244,244,237,${(a * 0.7).toFixed(2)})`;
        ctx.fillText(ch, x * cell, y * cell * 1.25);
      }
    }
  };

  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    draw();
    root.classList.add("is-ready");
  };
  img.src = src;

  let raf = 0;
  let tx = 0.5, ty = 0.35, x = 0.5, y = 0.35, over = false, size = 0, tsize = 0;
  const loop = () => {
    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;
    size += (tsize - size) * 0.12;
    root.style.setProperty("--lx", `${(x * 100).toFixed(2)}%`);
    root.style.setProperty("--ly", `${(y * 100).toFixed(2)}%`);
    root.style.setProperty("--ls", `${size.toFixed(1)}px`);
    if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(tsize - size) > 0.001) raf = requestAnimationFrame(loop);
    else raf = 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };
  root.addEventListener("pointermove", (e) => {
    const r = root.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width;
    ty = (e.clientY - r.top) / r.height;
    if (!over) {
      over = true;
      tsize = Math.max(r.width, r.height) * (e.pointerType === "touch" ? 0.28 : 0.22);
    }
    kick();
  });
  root.addEventListener("pointerleave", () => {
    over = false;
    tsize = 0;
    kick();
  });
  // tap toggles a full reveal on touch devices
  root.addEventListener("click", () => {
    root.classList.toggle("is-full");
  });

  let resizeT = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = window.setTimeout(() => img.complete && draw(), 200);
  });
  if (document.fonts) document.fonts.ready.then(() => img.complete && draw());
  if (reduced) root.classList.add("is-reduced");
}
