// Loader, navigation, menu overlay and cursor.
import { navItems, profile } from "../data/profile";
import { arrow, monogram } from "../utils/dom";

export const Loader = () => `
<div class="loader" id="loader" aria-hidden="true">
  <div class="loader__inner">
    ${monogram("loader__mono")}
    <div class="loader__meta">
      <span>Compiling portfolio</span>
      <span class="loader__count"><span id="loaderCount">000</span>%</span>
    </div>
    <div class="loader__bar"><span id="loaderBar"></span></div>
  </div>
</div>`;

export const Nav = () => `
<a class="skip" href="#about">Skip to content</a>
<header class="nav" id="nav">
  <a class="nav__brand" href="#home" data-scroll aria-label="Sai Thiagarajan — back to top">
    ${monogram("nav__mono")}
    <span class="nav__name">Sai Thiagarajan<em>Software Engineer</em></span>
  </a>
  <nav class="nav__links" aria-label="Primary">
    ${navItems
      .map((n, i) => `<a href="#${n.id}" data-scroll data-nav="${n.id}"><sup>0${i + 1}</sup>${n.label}</a>`)
      .join("")}
  </nav>
  <div class="nav__actions">
    <a class="btn btn--lime btn--sm nav__cta" href="mailto:${profile.email}" data-cursor="Email">Let's talk</a>
    <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="menu">
      <span class="menu-btn__label">Menu</span>
      <span class="menu-btn__lines" aria-hidden="true"><i></i><i></i></span>
    </button>
  </div>
</header>

<div class="menu" id="menu" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Site menu">
  <div class="menu__bg"></div>
  <div class="menu__inner">
    <nav class="menu__links" aria-label="Menu">
      ${navItems
        .map(
          (n, i) => `<a href="#${n.id}" data-scroll data-menu-link style="--i:${i}">
            <span class="menu__num">0${i + 1}</span>
            <span class="menu__word"><span>${n.label}</span></span>
          </a>`
        )
        .join("")}
    </nav>
    <aside class="menu__side">
      <div>
        <p class="eyebrow">Get in touch</p>
        <a class="menu__mail" href="mailto:${profile.email}">${profile.email}</a>
        <a class="menu__mail" href="${profile.phoneHref}">${profile.phone}</a>
      </div>
      <div>
        <p class="eyebrow">Elsewhere</p>
        ${profile.socials
          .map((s) => `<a class="menu__social" href="${s.href}" target="_blank" rel="noopener">${s.label} ${arrow()}</a>`)
          .join("")}
      </div>
      <p class="menu__loc">${profile.location}</p>
    </aside>
  </div>
</div>

<div class="cursor" aria-hidden="true"><div class="cursor__ring"><span class="cursor__label"></span></div><div class="cursor__dot"></div></div>
<div class="progress" aria-hidden="true"><span id="progressBar"></span></div>`;
