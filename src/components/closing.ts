// Manifesto, Contact & Footer
import { profile, navItems } from "../data/profile";
import { contourSVG } from "../animations/contours";
import { arrow, monogram, esc } from "../utils/dom";

const manifestoWords = (s: string) => {
  const words = s.split(" ");
  return words
    .map((w, i) => {
      const accent = /INTENTION/.test(w);
      return `<span class="mw${accent ? " mw--accent" : ""}" style="--i:${i}">${esc(w)}</span>`;
    })
    .join(" ");
};

export const Manifesto = () => {
  const line = "Good software is built with INTENTION.";
  const n = line.split(" ").length;
  return `
<section class="manifesto" id="manifesto" data-theme="dark" data-progress="pin" aria-labelledby="man-title" style="--n:${n}">
  <div class="manifesto__sticky">
    ${contourSVG({ seed: 314, className: "manifesto__contours", accentEvery: 4, centres: [{ x: 800, y: 500, rings: 22, r0: 20, step: 30 }] })}
    <div class="wrap">
      <div class="sec-head sec-head--dark">
        <span class="sec-num">08</span>
        <span class="sec-label">Engineering manifesto</span>
      </div>
      <h2 class="manifesto__title" id="man-title">${manifestoWords(line)}</h2>
      <p class="manifesto__copy">From intuitive interfaces to reliable backend systems, I believe great engineering is about solving real problems and creating experiences that make technology useful.</p>
    </div>
  </div>
</section>`;
};

export const Contact = () => `
<section class="contact" id="contact" data-theme="light" aria-labelledby="contact-title">
  <div class="wrap">
    <div class="sec-head">
      <span class="sec-num">09</span>
      <span class="sec-label">Contact</span>
    </div>
    <h2 class="contact__title" id="contact-title" data-split data-reveal>Have a good<br/><em>idea?</em></h2>
    <p class="contact__sub" data-reveal>Let's build something meaningful.</p>

    <div class="contact__mail" data-reveal>
      <a href="mailto:${profile.email}?subject=Hello%20Sai" class="contact__email" data-cursor="Write">
        <span>${profile.email}</span>${arrow()}
      </a>
      <button class="copy copy--lime" data-open-chat>Chat with me</button>
      <button class="copy" id="copyEmail" data-email="${profile.email}" aria-live="polite">Copy email</button>
    </div>

    <ul class="channels">
      <li data-reveal><span class="channels__k">Phone</span><a href="${profile.phoneHref}">${profile.phone} ${arrow()}</a></li>
      ${profile.socials
        .map(
          (s, i) => `<li data-reveal style="--d:${(i + 1) * 0.06}s"><span class="channels__k">${s.label}</span><a href="${s.href}" target="_blank" rel="noopener">${esc(s.handle)} ${arrow()}</a></li>`
        )
        .join("")}
      <li data-reveal style="--d:.2s"><span class="channels__k">Location</span><span class="channels__v">${profile.location}</span></li>
    </ul>

    <a class="big-cta" href="mailto:${profile.email}?subject=Let's%20build%20something" data-magnetic data-reveal>
      <span class="big-cta__fill" aria-hidden="true"></span>
      <span class="big-cta__text">Start a conversation</span>
      <span class="big-cta__ico">${arrow()}</span>
    </a>
  </div>
</section>`;

export const Footer = () => `
<footer class="footer" data-theme="dark">
  ${contourSVG({ seed: 1150, className: "footer__contours", accentEvery: 7, centres: [{ x: 200, y: 100, rings: 14, r0: 30, step: 36 }, { x: 1500, y: 900, rings: 14, r0: 30, step: 34 }] })}
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__mono" data-reveal="draw">${monogram("footer__monogram")}</div>
      <nav class="footer__nav" aria-label="Footer">
        <p class="eyebrow eyebrow--grey">Sitemap</p>
        ${navItems.map((n) => `<a href="#${n.id}" data-scroll>${n.label}</a>`).join("")}
      </nav>
      <div class="footer__nav">
        <p class="eyebrow eyebrow--grey">Follow</p>
        ${profile.socials.map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${s.label} ${arrow()}</a>`).join("")}
        <a href="mailto:${profile.email}">Email ${arrow()}</a>
      </div>
      <button class="totop" id="toTop" data-magnetic aria-label="Back to top">${arrow("n")}<span>Back to top</span></button>
    </div>

    <p class="footer__statement" aria-label="Always building. Always learning.">
      <span class="fs-line" data-reveal><span>Always</span> <em>building.</em></span>
      <span class="fs-line" data-reveal style="--d:.1s"><span>Always</span> <em>learning.</em></span>
    </p>

    <div class="footer__bottom">
      <span>© ${new Date().getFullYear()} ${profile.fullName}. All rights reserved.</span>
      <span>Designed & engineered in ${profile.location}</span>
      <span class="footer__time">Local time <b id="localTime">--:--</b> IST</span>
    </div>
  </div>
</footer>`;
