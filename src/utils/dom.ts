export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);

export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

export const arrow = (dir: "ne" | "e" | "s" | "n" = "ne") => {
  const d = {
    ne: "M5 15 15 5M7 5h8v8",
    e: "M3 10h14M11 4l6 6-6 6",
    s: "M10 3v14M4 11l6 6 6-6",
    n: "M10 17V3M4 9l6-6 6 6",
  }[dir];
  return `<svg class="ico" viewBox="0 0 20 20" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>`;
};

/** Original "ST_" developer monogram — single-stroke so it can be drawn on. */
export const monogram = (cls = "") =>
  `<svg class="monogram ${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <path class="m-s" pathLength="1" d="M40 27C33 19 13 20 13 34c0 15 29 11 29 27 0 15-21 17-31 8"/>
    <path class="m-t" pathLength="1" d="M50 25h38M69 25v52"/>
    <path class="m-c" pathLength="1" d="M49 86h17"/>
  </svg>`;
