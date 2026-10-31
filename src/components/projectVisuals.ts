// Illustrative, hand-built mockups for each project. They are NOT production screenshots —
// every visual carries an "Illustrative mockup" label. Replace with real screenshots when available.
import type { VisualKind } from "../data/projects";

const sk = (w: number, cls = "") => `<i class="sk ${cls}" style="width:${w}%"></i>`;

const census = () => `
<div class="pv pv-census">
  <div class="dev dev--tablet">
    <div class="scr">
      <div class="ui-top"><b>DCMP</b><span class="ui-pill">Super Admin</span><span class="ui-pill ui-pill--ghost">Admin</span><span class="ui-pill ui-pill--ghost">Enumerator</span></div>
      <div class="ui-dash">
        <div class="ui-side">${sk(80)}${sk(60)}${sk(70)}${sk(50)}${sk(65)}</div>
        <div class="ui-main">
          <div class="ui-cards"><div>${sk(50)}${sk(80, "sk--lg")}</div><div>${sk(40)}${sk(70, "sk--lg")}</div><div>${sk(60)}${sk(55, "sk--lg")}</div></div>
          <div class="ui-table">
            ${Array.from({ length: 5 }, (_, i) => `<div class="ui-row">${sk(28)}${sk(22)}<span class="ui-status ${i % 3 === 0 ? "is-ok" : i % 3 === 1 ? "is-wait" : ""}">${i % 3 === 0 ? "Approved" : i % 3 === 1 ? "Pending" : "Draft"}</span></div>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="dev dev--phone">
    <div class="scr">
      <div class="ph-bar"><span>Household survey</span><span class="ph-lang"><b>EN</b>|<span>தமிழ்</span></span></div>
      <div class="ph-steps"><i class="on"></i><i class="on"></i><i></i><i></i><i></i></div>
      <p class="ph-step">Step 2 · Members</p>
      <label class="ph-field"><span>Head of household</span><span>குடும்பத் தலைவர்</span><i></i></label>
      <label class="ph-field"><span>Relationship</span><i class="sel"></i></label>
      <label class="ph-field"><span>Occupation</span><i></i></label>
      <div class="ph-btn">Next step →</div>
    </div>
  </div>
</div>`;

const cityfix = () => {
  // a stylised city map: river, blocks, roads, issue pins
  const pins = [
    [22, 30, "lime"], [58, 22, "ivory"], [70, 60, "lime"], [36, 68, "ivory"], [84, 34, "ivory"], [46, 44, "lime"],
  ] as const;
  return `
<div class="pv pv-cityfix">
  <svg class="map" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><pattern id="blocks" width="8" height="8" patternUnits="userSpaceOnUse"><rect x="1" y="1" width="6" height="6" rx=".6" class="blk"/></pattern></defs>
    <rect width="100" height="80" fill="url(#blocks)"/>
    <path class="river" d="M-5 58 C 20 48, 30 70, 52 58 S 85 40, 105 52"/>
    <path class="road" d="M0 18 H100 M0 40 H100 M30 0 V80 M66 0 V80 M0 74 L100 6"/>
    <path class="route" d="M22 30 C 30 36, 40 40, 46 44 S 62 56, 70 60"/>
    ${pins
      .map(
        ([x, y, c], i) => `<g class="pin pin--${c}" style="--i:${i}" transform="translate(${x} ${y})"><circle r="4.5" class="pulse"/><path d="M0 0 C -2.6 -3, -2.6 -6.6, 0 -6.6 S 2.6 -3, 0 0Z" transform="scale(.9)"/></g>`
      )
      .join("")}
  </svg>
  <div class="cf-card">
    <p class="cf-k">Issue · Pothole</p>
    <div class="cf-photo"></div>
    <ol class="cf-life"><li class="done">Reported</li><li class="done">Assigned</li><li class="now">In progress</li><li>Resolved</li></ol>
  </div>
  <div class="cf-obs">
    <p class="cf-k"><span class="live"></span>Observability</p>
    <svg viewBox="0 0 120 40" aria-hidden="true"><path class="sp sp-a" d="M0 30 L10 28 L20 31 L30 22 L40 25 L50 12 L60 26 L70 24 L80 27 L90 18 L100 22 L110 20 L120 23"/><path class="sp sp-b" d="M0 36 L15 35 L30 36 L45 34 L50 20 L55 35 L75 36 L90 35 L105 36 L120 35"/></svg>
    <p class="cf-legend"><span><i class="a"></i>latency</span><span><i class="b"></i>chaos test</span><span><i class="c"></i>rollback</span></p>
  </div>
</div>`;
};

const ownit = () => {
  const lost = ["Wallet", "Keys", "ID card", "Bottle"];
  const found = ["Card holder", "Keyring", "Student ID", "Flask"];
  return `
<div class="pv pv-ownit">
  <svg class="ow-links" aria-hidden="true"></svg>
  <ul class="ow-col ow-col--lost"><li class="ow-h">Lost reports</li>${lost.map((l, i) => `<li data-lost="${i}"><i></i>${l}</li>`).join("")}</ul>
  <div class="ow-core"><span class="ow-core__k">NestJS API</span><span>PostgreSQL · TypeORM</span></div>
  <ul class="ow-col ow-col--found"><li class="ow-h">Found reports</li>${found.map((l, i) => `<li data-found="${i}"><i></i>${l}</li>`).join("")}</ul>
  <div class="ow-legend"><span class="b">— Built: REST + persistence</span><span class="p">- - Planned: vector similarity match</span></div>
</div>`;
};

const useit = () => `
<div class="pv pv-useit">
  <div class="ui-orbit" aria-hidden="true"><i></i><i></i><i></i><b></b></div>
  <div class="dev dev--phone dev--center">
    <div class="scr">
      <div class="ph-bar"><span>UseIt</span><span class="ph-dot"></span></div>
      <div class="ue-orb"><i></i><i></i><i></i></div>
      <div class="ue-lines">${sk(80)}${sk(64)}${sk(72)}</div>
      <div class="ue-input"><span>${sk(60)}</span><b>↑</b></div>
    </div>
  </div>
</div>`;

export const projectVisual = (k: VisualKind) =>
  ({ census, cityfix, ownit, useit })[k]() + `<span class="pv-note">Illustrative mockup</span>`;

/** Draws OWNIT connectors from measured positions so they line up at every size. */
export function drawOwnitLinks(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>(".pv-ownit").forEach((pv) => {
    const svg = pv.querySelector("svg.ow-links");
    const core = pv.querySelector<HTMLElement>(".ow-core");
    if (!svg || !core) return;
    const b = pv.getBoundingClientRect();
    if (!b.width) return;
    const rel = (r: DOMRect) => ({ l: r.left - b.left, r: r.right - b.left, cy: r.top - b.top + r.height / 2 });
    const c = rel(core.getBoundingClientRect());
    const cTop = core.getBoundingClientRect().top - b.top, cBot = core.getBoundingClientRect().bottom - b.top;
    let d = "";
    const lost = Array.from(pv.querySelectorAll<HTMLElement>("[data-lost]")).map((e) => rel(e.getBoundingClientRect()));
    const found = Array.from(pv.querySelectorAll<HTMLElement>("[data-found]")).map((e) => rel(e.getBoundingClientRect()));
    lost.forEach((p) => {
      const mx = (p.r + c.l) / 2;
      d += `<path class="ow-solid" d="M${p.r} ${p.cy} C${mx} ${p.cy} ${mx} ${c.cy} ${c.l} ${c.cy}"/>`;
    });
    found.forEach((p) => {
      const mx = (p.l + c.r) / 2;
      d += `<path class="ow-solid" d="M${p.l} ${p.cy} C${mx} ${p.cy} ${mx} ${c.cy} ${c.r} ${c.cy}"/>`;
    });
    // planned: direct lost → found similarity arcs that bypass the core (above / below it)
    const pairs = [[0, 0], [1, 1], [2, 2], [3, 3]];
    pairs.forEach(([li, fi], k) => {
      const a = lost[li], z = found[fi];
      if (!a || !z) return;
      const above = k < 2;
      const y = above ? cTop - 18 - (1 - k) * 22 : cBot + 18 + (k - 2) * 22;
      d += `<path class="ow-plan" style="--i:${k}" d="M${a.r} ${a.cy} C${c.l} ${y} ${c.r} ${y} ${z.l} ${z.cy}"/>`;
    });
    svg.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);
    svg.innerHTML = d;
  });
}
