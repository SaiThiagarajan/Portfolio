// Scroll-driven effects without a library:
//  • [data-reveal] elements get .is-in once they enter the viewport (CSS does the motion)
//  • [data-progress] elements get a --p custom property (0 → 1) while they cross the viewport
//  • [data-parallax="0.2"] elements translate with scroll
//  • [data-split] text is split into words/lines for staggered reveals

export function splitText(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    if (el.dataset.splitDone) return;
    const mode = el.dataset.split || "words";
    const walk = (node: Node, out: DocumentFragment, counter: { i: number }) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = (child.textContent || "").split(/(\s+)/);
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              out.appendChild(document.createTextNode(" "));
              return;
            }
            const w = document.createElement("span");
            w.className = "w";
            const inner = document.createElement("span");
            inner.className = "wi";
            inner.style.setProperty("--i", String(counter.i++));
            inner.textContent = part;
            w.appendChild(inner);
            out.appendChild(w);
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const elc = child as HTMLElement;
          if (elc.tagName === "BR") {
            out.appendChild(elc.cloneNode());
            return;
          }
          const clone = elc.cloneNode(false) as HTMLElement;
          const frag = document.createDocumentFragment();
          walk(elc, frag, counter);
          clone.appendChild(frag);
          out.appendChild(clone);
        }
      });
    };
    const frag = document.createDocumentFragment();
    walk(el, frag, { i: 0 });
    el.textContent = "";
    el.appendChild(frag);
    el.dataset.splitDone = mode;
  });
}

export function initReveals(reduced: boolean) {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
  );
  els.forEach((e) => io.observe(e));
}

interface Tracked {
  el: HTMLElement;
  kind: "progress" | "parallax";
  speed: number;
  mode: string;
  last: number;
}

export class ScrollProgress {
  private items: Tracked[] = [];
  private reduced: boolean;

  constructor(reduced: boolean) {
    this.reduced = reduced;
    document.querySelectorAll<HTMLElement>("[data-progress]").forEach((el) =>
      this.items.push({ el, kind: "progress", speed: 0, mode: el.dataset.progress || "cross", last: -1 })
    );
    if (!reduced) {
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) =>
        this.items.push({ el, kind: "parallax", speed: parseFloat(el.dataset.parallax || "0.1"), mode: "", last: -999 })
      );
    }
  }

  update() {
    const vh = window.innerHeight;
    for (const it of this.items) {
      const r = it.el.getBoundingClientRect();
      if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) continue;
      if (it.kind === "progress") {
        let p: number;
        if (it.mode === "pin") {
          // 0 when the element's top hits the viewport top, 1 when its bottom hits the viewport bottom
          const total = r.height - vh;
          p = total > 0 ? -r.top / total : r.top < 0 ? 1 : 0;
        } else if (it.mode === "enter") {
          // 0 when top enters from below, 1 when top reaches 35% of the viewport
          p = (vh - r.top) / (vh * 0.65);
        } else if (it.mode === "exit") {
          // 0 at rest, 1 when the element has scrolled fully out the top
          p = -r.top / r.height;
        } else {
          p = (vh - r.top) / (vh + r.height);
        }
        p = Math.max(0, Math.min(1, p));
        if (this.reduced) p = it.mode === "exit" ? 0 : 1;
        if (Math.abs(p - it.last) > 0.0005) {
          it.el.style.setProperty("--p", p.toFixed(4));
          it.last = p;
        }
      } else {
        const center = r.top + r.height / 2 - vh / 2;
        const y = -center * it.speed;
        if (Math.abs(y - it.last) > 0.1) {
          it.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
          it.last = y;
        }
      }
    }
  }
}
