import { profile } from "../data/profile";
import { contourSVG } from "../animations/contours";
import { monogram } from "../utils/dom";

const highlight = (s: string) =>
  s
    .replace("practical, scalable and user-focused", '<mark>practical, scalable and user-focused</mark>')
    .replace("AI-powered applications", "<strong>AI-powered applications</strong>")
    .replace("clean, reliable and intuitive", '<mark>clean, reliable and intuitive</mark>');

export const About = () => `
<section class="about" id="about" data-theme="light" aria-labelledby="about-title">
  ${contourSVG({
    seed: 21,
    className: "about__contours",
    centres: [{ x: 1450, y: 120, rings: 14, r0: 24, step: 36 }],
  })}
  <div class="wrap">
    <div class="sec-head">
      <span class="sec-num">02</span>
      <span class="sec-label">About — My story</span>
    </div>

    <h2 class="display about__title" id="about-title" data-split data-reveal>
      Engineering<br/><em>beyond</em> the code.
    </h2>

    <div class="about__grid">
      <figure class="about__portrait" data-reveal="clip">
        <div class="cp" id="codePortrait" data-cursor="Decode" role="img" aria-label="Portrait of Sai Thiagarajan A. Hover or tap to reveal it rendered as code.">
          <img class="cp-photo" alt="" width="800" height="1200" />
          <canvas class="cp-code" aria-hidden="true"></canvas>
          <span class="cp-tag">hover → decode</span>
        </div>
        <figcaption>
          <span>${profile.fullName}</span>
          <span>VIT Chennai · ${profile.location}</span>
        </figcaption>
      </figure>

      <div class="about__copy">
        <div class="about__mono" data-reveal="draw">${monogram("about__monogram")}</div>
        ${profile.about.map((p, i) => `<p class="${i === 0 ? "lead" : ""}" data-reveal style="--d:${i * 0.08}s">${highlight(p)}</p>`).join("")}
        <p class="about__statement" data-reveal>
          <span>${profile.aboutStatement}</span>
        </p>
        <dl class="about__facts" data-reveal>
          <div><dt>Studying</dt><dd>Integrated M.Tech, Software Engineering</dd></div>
          <div><dt>Building with</dt><dd>Flutter · NestJS · PostgreSQL</dd></div>
          <div><dt>Looking for</dt><dd>Entry-level Full Stack / SWE roles</dd></div>
        </dl>
      </div>
    </div>
  </div>
</section>`;
