import { skillGroups } from "../data/skills";
import { esc } from "../utils/dom";

export const Expertise = () => {
  const all = skillGroups.flatMap((g) => g.items);
  const marquee = (cls: string) =>
    `<div class="marquee ${cls}" aria-hidden="true"><div class="marquee__track">${[...all, ...all]
      .map((s, i) => `<span class="${i % 2 ? "o" : ""}">${esc(s)}</span><i>✦</i>`)
      .join("")}</div></div>`;

  return `
<section class="expertise" id="expertise" data-theme="dark" aria-labelledby="exp-title">
  <div class="wrap">
    <div class="sec-head sec-head--dark">
      <span class="sec-num">03</span>
      <span class="sec-label">Technical expertise</span>
    </div>
    <h2 class="display display--light" id="exp-title" data-split data-reveal>
      The tools<br/><em>behind</em> the work.
    </h2>

    <div class="stack" data-reveal>
      <div class="stack__tabs" role="tablist" aria-label="Skill categories">
        ${skillGroups
          .map(
            (g, i) => `<button class="stack__tab${i === 0 ? " is-active" : ""}" role="tab" id="tab-${g.id}"
              aria-selected="${i === 0}" aria-controls="panel-${g.id}" data-skill="${g.id}" tabindex="${i === 0 ? 0 : -1}">
              <span class="stack__idx">${g.index}</span>
              <span class="stack__name">${g.title}</span>
              <span class="stack__count">${String(g.items.length).padStart(2, "0")}</span>
            </button>`
          )
          .join("")}
      </div>

      <div class="stack__panels">
        ${skillGroups
          .map(
            (g, i) => `<div class="stack__panel${i === 0 ? " is-active" : ""}" role="tabpanel" id="panel-${g.id}" aria-labelledby="tab-${g.id}" ${i === 0 ? "" : "hidden"}>
              <div class="term">
                <div class="term__bar"><i></i><i></i><i></i><span>~/sai/stack</span></div>
                <p class="term__cmd"><span class="term__prompt">$</span> stack --list <b>${g.command}</b><span class="caret"></span></p>
                <p class="term__out">// ${esc(g.blurb)}</p>
              </div>
              <ul class="stack__items">
                ${g.items
                  .map(
                    (s, j) => `<li style="--i:${j}"><span class="stack__j">${String(j + 1).padStart(2, "0")}</span><span class="stack__item">${esc(s)}</span></li>`
                  )
                  .join("")}
              </ul>
            </div>`
          )
          .join("")}
      </div>
    </div>
  </div>
  ${marquee("marquee--a")}
</section>`;
};
