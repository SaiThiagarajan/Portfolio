import { projects } from "../data/projects";
import { esc, arrow } from "../utils/dom";
import { projectVisual } from "./projectVisuals";

export const Projects = () => `
<section class="projects" id="projects" data-theme="dark" aria-labelledby="proj-title">
  <div class="wrap projects__head">
    <div class="sec-head sec-head--dark">
      <span class="sec-num">04</span>
      <span class="sec-label">Selected projects</span>
    </div>
    <div class="projects__intro">
      <h2 class="display display--light" id="proj-title" data-split data-reveal>Built with<br/><em>purpose.</em></h2>
      <p class="projects__sub" data-reveal>A selection of applications, platforms and engineering experiments.</p>
    </div>
    <ol class="projects__index" data-reveal>
      ${projects
        .map((p) => `<li><a href="#p-${p.id}" data-scroll><span>${p.number}</span>${esc(p.name)}<em>${esc(p.category)}</em></a></li>`)
        .join("")}
    </ol>
  </div>

  <div class="pstack">
    ${projects
      .map(
        (p, i) => `
    <article class="pcard" id="p-${p.id}" style="--k:${i}" aria-labelledby="pt-${p.id}">
      <div class="pcard__inner">
        <header class="pcard__head">
          <span class="pcard__num">${p.number}<sup>/0${projects.length}</sup></span>
          <span class="pcard__cat">${esc(p.category)}</span>
        </header>
        <div class="pcard__body">
          <div class="pcard__text">
            <h3 class="pcard__title" id="pt-${p.id}">${esc(p.name)}</h3>
            <p class="pcard__full">${esc(p.fullName)}</p>
            <p class="pcard__sum">${esc(p.summary)}</p>
            <ul class="tags">${p.stack
              .map((s) => `<li class="${/planned/i.test(s) ? "is-planned" : ""}">${esc(s)}</li>`)
              .join("")}</ul>
            <div class="pcard__actions">
              <button class="btn btn--lime btn--sm" data-open-project="${p.id}" data-magnetic>Case details ${arrow("e")}</button>
              ${p.repo ? `<a class="btn btn--ghost btn--sm" href="${p.repo}" target="_blank" rel="noopener">GitHub ${arrow()}</a>` : ""}
              ${p.demo ? `<a class="btn btn--ghost btn--sm" href="${p.demo}" target="_blank" rel="noopener">Live demo ${arrow()}</a>` : ""}
              ${p.pendingNote ? `<span class="pcard__pending">${esc(p.pendingNote)}</span>` : ""}
            </div>
          </div>
          <div class="pcard__visual" role="button" tabindex="0" data-open-project="${p.id}" data-cursor="Open" aria-label="Open ${esc(p.name)} case details">
            <span class="pcard__corner" aria-hidden="true"></span>
            ${projectVisual(p.visual)}
          </div>
        </div>
      </div>
    </article>`
      )
      .join("")}
  </div>
</section>

<div class="drawer" id="drawer" aria-hidden="true">
  <div class="drawer__scrim" data-close-drawer></div>
  <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawerTitle" data-native-scroll tabindex="-1">
    <button class="drawer__close" data-close-drawer aria-label="Close details"><span></span><span></span></button>
    <div class="drawer__content" id="drawerContent"></div>
  </aside>
</div>`;

export const projectDetail = (id: string) => {
  const p = projects.find((x) => x.id === id);
  if (!p) return "";
  const idx = projects.indexOf(p);
  const next = projects[(idx + 1) % projects.length];
  return `
  <p class="drawer__k"><span>${p.number}</span> ${esc(p.category)}</p>
  <h3 class="drawer__title" id="drawerTitle">${esc(p.name)}</h3>
  <p class="drawer__full">${esc(p.fullName)}</p>
  <div class="drawer__visual">${projectVisual(p.visual)}</div>
  <p class="drawer__sum">${esc(p.summary)}</p>
  ${p.features
    .map(
      (f) => `<div class="drawer__group drawer__group--${f.status}">
      <h4>${f.status === "planned" ? '<span class="badge badge--planned">Planned</span>' : '<span class="badge">Implemented</span>'}${esc(f.label)}</h4>
      <ul>${f.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>
    </div>`
    )
    .join("")}
  <div class="drawer__group">
    <h4>Technology</h4>
    <ul class="tags tags--dark">${p.stack.map((s) => `<li class="${/planned/i.test(s) ? "is-planned" : ""}">${esc(s)}</li>`).join("")}</ul>
    ${p.stackNote ? `<p class="drawer__note">${esc(p.stackNote)}</p>` : ""}
  </div>
  ${p.pendingNote ? `<p class="drawer__note">${esc(p.pendingNote)}</p>` : ""}
  <div class="drawer__links">
    ${p.repo ? `<a class="btn btn--lime btn--sm" href="${p.repo}" target="_blank" rel="noopener">View on GitHub ${arrow()}</a>` : ""}
    ${p.demo ? `<a class="btn btn--ghost btn--sm" href="${p.demo}" target="_blank" rel="noopener">Live demo ${arrow()}</a>` : ""}
    <button class="btn btn--ghost btn--sm" data-open-project="${next.id}">Next: ${esc(next.name)} ${arrow("e")}</button>
  </div>`;
};
