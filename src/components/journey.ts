// Experience, Education, Achievements & Leadership
import { experience, education, achievements, leadership } from "../data/experience";
import { esc } from "../utils/dom";
import { contourSVG } from "../animations/contours";

export const Experience = () => `
<section class="experience" id="experience" data-theme="light" aria-labelledby="xp-title">
  <div class="wrap">
    <div class="sec-head">
      <span class="sec-num">05</span>
      <span class="sec-label">Experience</span>
    </div>
    <h2 class="display" id="xp-title" data-split data-reveal>The journey<br/><em>so far.</em></h2>

    ${experience
      .map(
        (x) => `
    <article class="xp" data-progress="cross">
      <div class="xp__rail" aria-hidden="true"><span></span></div>
      <div class="xp__when" data-reveal>
        <span class="xp__date">${x.start}</span>
        <span class="xp__arrow">→</span>
        <span class="xp__date xp__date--end">${x.end}</span>
        <p class="xp__period">${esc(x.period)} · ${esc(x.mode)}</p>
      </div>
      <div class="xp__body">
        <p class="xp__role" data-reveal>${esc(x.role)}</p>
        <h3 class="xp__company" data-reveal>${esc(x.company)}</h3>
        <ol class="xp__points">
          ${x.points.map((pt, i) => `<li data-reveal style="--d:${(i * 0.05).toFixed(2)}s"><span>${String(i + 1).padStart(2, "0")}</span>${esc(pt)}</li>`).join("")}
        </ol>
        <ul class="tags tags--light" data-reveal>${x.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </div>
    </article>`
      )
      .join("")}
  </div>
</section>

<section class="education" id="education" data-theme="light" aria-labelledby="edu-title">
  <div class="wrap">
    <div class="sec-head">
      <span class="sec-num">06</span>
      <span class="sec-label">Education</span>
    </div>
    <div class="edu">
      <h2 class="display display--md" id="edu-title" data-split data-reveal>Where it<br/><em>started.</em></h2>
      <ul class="edu__list">
        ${education
          .map(
            (e) => `<li class="edu__row" data-reveal>
              <span class="edu__period">${esc(e.period)}</span>
              <span class="edu__school">${esc(e.school)}${e.location ? `<em>, ${esc(e.location)}</em>` : ""}</span>
              <span class="edu__detail">${esc(e.detail)}</span>
            </li>`
          )
          .join("")}
      </ul>
    </div>
  </div>
</section>

<section class="achieve" id="achievements" data-theme="dark" aria-labelledby="ach-title">
  ${contourSVG({ seed: 99, className: "achieve__contours", accentEvery: 5, centres: [{ x: 1300, y: 900, rings: 16, r0: 30, step: 34 }] })}
  <div class="wrap">
    <div class="sec-head sec-head--dark">
      <span class="sec-num">07</span>
      <span class="sec-label">Achievements & leadership</span>
    </div>
    <h2 class="display display--light" id="ach-title" data-split data-reveal>Beyond<br/><em>engineering.</em></h2>

    <div class="ach">
      ${achievements
        .map(
          (a) => `<div class="ach__item" data-reveal>
            <p class="ach__prefix">${esc(a.prefix)}</p>
            <p class="ach__rank" data-count="${parseInt(a.rank, 10)}" data-pad="${a.rank.length}">${a.rank}</p>
            <div class="ach__meta"><h3>${esc(a.event)}</h3><p>${esc(a.scope)}</p></div>
          </div>`
        )
        .join("")}
    </div>

    <div class="leadership">
      <p class="eyebrow eyebrow--grey" data-reveal>Leadership & responsibility</p>
      <ul>
        ${leadership
          .map(
            (l, i) => `<li data-reveal style="--d:${i * 0.06}s"><span class="lead__n">0${i + 1}</span><span class="lead__t">${esc(l.title)}</span><span class="lead__o">${esc(l.org)}</span></li>`
          )
          .join("")}
      </ul>
    </div>
  </div>
</section>`;
