import "./styles/main.css";
import { Loader, Nav } from "./components/chrome";
import { Hero } from "./components/hero";
import { About } from "./components/about";
import { Expertise } from "./components/expertise";
import { Projects, projectDetail } from "./components/projects";
import { Experience } from "./components/journey";
import { Manifesto, Contact, Footer } from "./components/closing";
import { SmoothScroll } from "./animations/smoothScroll";
import { splitText, initReveals, ScrollProgress } from "./animations/scrollFx";
import { createSculpture } from "./animations/sculpture";
import { initCodePortrait } from "./animations/codePortrait";
import { PORTRAIT_SRC } from "./assets/portrait";
import { $, $$ } from "./utils/dom";
import { Chat, initChat } from "./components/chat";
import { drawOwnitLinks } from "./components/projectVisuals";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// ---------- render ----------
const app = document.getElementById("app")!;
app.innerHTML = `${Loader()}${Nav()}<main id="main">${Hero()}${About()}${Expertise()}${Projects()}${Experience()}${Manifesto()}${Contact()}</main>${Footer()}${Chat()}`;
document.documentElement.classList.toggle("reduced", reduced);
document.documentElement.classList.toggle("fine", finePointer);

splitText();

// ---------- core systems ----------
const smooth = new SmoothScroll(!reduced && finePointer);
const progress = new ScrollProgress(reduced);
const sculptCanvas = $<HTMLCanvasElement>("#sculpture");
const sculpture = sculptCanvas ? createSculpture(sculptCanvas, reduced) : null;
const hero = $("#home")!;
const nav = $("#nav")!;
const progressBar = $("#progressBar")!;
const pcards = $$(".pcard");

// theme-aware nav: invert colours over light sections
const themed = $$("[data-theme]");
let lastY = 0;
smooth.on((y) => {
  progress.update();
  const max = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  const hp = parseFloat(hero.style.getPropertyValue("--p") || "0");
  sculpture?.setScroll(hp);

  // project stack: each card dims/scales as the next one slides over it
  for (let i = 0; i < pcards.length - 1; i++) {
    const nt = pcards[i + 1].getBoundingClientRect().top;
    const cover = Math.max(0, Math.min(1, 1 - nt / innerHeight));
    pcards[i].style.setProperty("--cover", cover.toFixed(3));
  }

  // nav: hide on scroll down, show on scroll up
  if (Math.abs(y - lastY) > 4) {
    nav.classList.toggle("is-hidden", y > lastY && y > innerHeight * 0.6 && !document.body.classList.contains("menu-open"));
    lastY = y;
  }
  nav.classList.toggle("is-scrolled", y > 40);
  const probe = 36;
  let theme = "dark";
  for (const s of themed) {
    const r = s.getBoundingClientRect();
    if (r.top <= probe && r.bottom > probe) {
      theme = s.dataset.theme || "dark";
      break;
    }
  }
  nav.dataset.on = theme;
});

// ---------- active nav link ----------
const sectionIds = ["home", "about", "expertise", "projects", "experience", "contact"];
const navIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const id = en.target.id === "education" || en.target.id === "achievements" ? "experience" : en.target.id;
        $$("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === id));
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
[...sectionIds, "education", "achievements"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) navIO.observe(el);
});

// ---------- anchor scrolling ----------
document.addEventListener("click", (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-scroll]");
  if (!a) return;
  const id = a.getAttribute("href")!.slice(1);
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  closeMenu();
  const offset = el.classList.contains("pcard") ? 0 : 0;
  smooth.scrollToEl(el, offset);
  // sandboxed previews (srcdoc iframes) forbid history writes — never let that break navigation
  try {
    if (location.protocol.startsWith("http")) history.replaceState(null, "", `#${id}`);
  } catch {
    /* ignore */
  }
});

// ---------- menu overlay ----------
const menu = $("#menu")!;
const menuBtn = $<HTMLButtonElement>("#menuBtn")!;
function openMenu() {
  document.body.classList.add("menu-open");
  menu.setAttribute("aria-hidden", "false");
  menuBtn.setAttribute("aria-expanded", "true");
  menuBtn.querySelector(".menu-btn__label")!.textContent = "Close";
  smooth.lock(true);
  setTimeout(() => menu.querySelector<HTMLElement>("a")?.focus(), 400);
}
function closeMenu() {
  if (!document.body.classList.contains("menu-open")) return;
  document.body.classList.remove("menu-open");
  menu.setAttribute("aria-hidden", "true");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.querySelector(".menu-btn__label")!.textContent = "Menu";
  smooth.lock(false);
}
menuBtn.addEventListener("click", () =>
  document.body.classList.contains("menu-open") ? closeMenu() : openMenu()
);

// ---------- project drawer ----------
const drawer = $("#drawer")!;
const drawerContent = $("#drawerContent")!;
const drawerPanel = $<HTMLElement>(".drawer__panel", drawer)!;
let drawerReturn: HTMLElement | null = null;
function openDrawer(id: string, from?: HTMLElement) {
  drawerContent.innerHTML = projectDetail(id);
  drawerPanel.scrollTop = 0;
  setTimeout(() => drawOwnitLinks(drawerContent), 850);
  if (!document.body.classList.contains("drawer-open")) drawerReturn = from || null;
  document.body.classList.add("drawer-open");
  drawer.setAttribute("aria-hidden", "false");
  smooth.lock(true);
  setTimeout(() => drawerPanel.focus(), 50);
}
function closeDrawer() {
  if (!document.body.classList.contains("drawer-open")) return;
  document.body.classList.remove("drawer-open");
  drawer.setAttribute("aria-hidden", "true");
  smooth.lock(false);
  drawerReturn?.focus();
}
document.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  const opener = t.closest<HTMLElement>("[data-open-project]");
  if (opener) {
    openDrawer(opener.dataset.openProject!, opener);
    return;
  }
  if (t.closest("[data-close-drawer]")) closeDrawer();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDrawer();
    closeMenu();
  }
  const t = e.target as HTMLElement;
  if ((e.key === "Enter" || e.key === " ") && t.matches("[role=button][data-open-project]")) {
    e.preventDefault();
    openDrawer(t.dataset.openProject!, t);
  }
});

// ---------- expertise tabs ----------
const tabs = $$<HTMLButtonElement>(".stack__tab");
function selectTab(btn: HTMLButtonElement, focus = false) {
  const id = btn.dataset.skill!;
  tabs.forEach((t) => {
    const on = t === btn;
    t.classList.toggle("is-active", on);
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
  });
  $$(".stack__panel").forEach((p) => {
    const on = p.id === `panel-${id}`;
    p.classList.toggle("is-active", on);
    p.hidden = !on;
  });
  if (focus) btn.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => selectTab(t));
  if (finePointer) t.addEventListener("mouseenter", () => selectTab(t));
  t.addEventListener("keydown", (e) => {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (dir) {
      e.preventDefault();
      selectTab(tabs[(i + dir + tabs.length) % tabs.length], true);
    }
  });
});

// ---------- portrait ----------
const cp = $("#codePortrait");
if (cp) {
  $<HTMLImageElement>(".cp-photo", cp)!.src = PORTRAIT_SRC;
  initCodePortrait(cp, PORTRAIT_SRC, reduced);
}

// ---------- hero cursor lens ----------
if (!reduced) {
  let lx = innerWidth * 0.7, ly = innerHeight * 0.45, tx = lx, ty = ly, active = false, t = 0;
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    active = true;
  });
  hero.addEventListener("pointerleave", () => (active = false));
  const lensLoop = () => {
    t += 0.006;
    if (!active) {
      tx = hero.clientWidth * (0.66 + Math.cos(t) * 0.12);
      ty = hero.clientHeight * (0.45 + Math.sin(t * 1.3) * 0.15);
    }
    lx += (tx - lx) * 0.12;
    ly += (ty - ly) * 0.12;
    hero.style.setProperty("--mx", `${lx.toFixed(1)}px`);
    hero.style.setProperty("--my", `${ly.toFixed(1)}px`);
    requestAnimationFrame(lensLoop);
  };
  requestAnimationFrame(lensLoop);
}

// ---------- custom cursor + magnetic buttons ----------
if (finePointer && !reduced) {
  const cur = $(".cursor")!;
  const ring = $(".cursor__ring")!;
  const dot = $(".cursor__dot")!;
  const label = $(".cursor__label")!;
  let x = -100, y = -100, rx = -100, ry = -100;
  window.addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    cur.classList.add("is-on");
  });
  document.addEventListener("pointerleave", () => cur.classList.remove("is-on"));
  document.addEventListener("pointerover", (e) => {
    const t = e.target as HTMLElement;
    const lab = t.closest<HTMLElement>("[data-cursor]");
    const link = t.closest("a, button, [role=button]");
    cur.classList.toggle("is-link", !!link && !lab);
    cur.classList.toggle("is-label", !!lab);
    label.textContent = lab?.dataset.cursor || "";
    cur.classList.toggle("on-light", !!t.closest('[data-theme="light"]'));
  });
  const loop = () => {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  $$("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
}

// ---------- project visual tilt ----------
if (finePointer && !reduced) {
  $$(".pcard__visual").forEach((v) => {
    v.addEventListener("pointermove", (e) => {
      const r = v.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      v.style.setProperty("--rx", `${(-py * 5).toFixed(2)}deg`);
      v.style.setProperty("--ry", `${(px * 7).toFixed(2)}deg`);
    });
    v.addEventListener("pointerleave", () => {
      v.style.setProperty("--rx", "0deg");
      v.style.setProperty("--ry", "0deg");
    });
  });
}

// ---------- achievement counters ----------
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    countIO.unobserve(en.target);
    const el = en.target as HTMLElement;
    const end = parseInt(el.dataset.count || "0", 10);
    const pad = parseInt(el.dataset.pad || "2", 10);
    if (reduced) return;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 1400);
      const e = 1 - Math.pow(1 - p, 4);
      // count down from 99 toward the rank — "climbing the leaderboard"
      const v = Math.round(99 - (99 - end) * e);
      el.textContent = String(v).padStart(pad, "0");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.5 });
$$("[data-count]").forEach((el) => countIO.observe(el));

// ---------- contact: copy email ----------
const copyBtn = $<HTMLButtonElement>("#copyEmail");
copyBtn?.addEventListener("click", async () => {
  const email = copyBtn.dataset.email!;
  try {
    await navigator.clipboard.writeText(email);
    copyBtn.textContent = "Copied ✓";
  } catch {
    window.location.href = `mailto:${email}`;
  }
  setTimeout(() => (copyBtn.textContent = "Copy email"), 1800);
});

// ---------- footer ----------
$("#toTop")?.addEventListener("click", () => smooth.scrollTo(0, 1.6));
const clock = $("#localTime");
const tick = () => {
  if (clock)
    clock.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date());
};
tick();
setInterval(tick, 30_000);

// ---------- loader → intro ----------
function startIntro() {
  document.documentElement.classList.add("is-loaded");
  initReveals(reduced);
  progress.update();
}
(function runLoader() {
  const loader = $("#loader")!;
  const count = $("#loaderCount")!;
  const bar = $("#loaderBar")!;
  if (reduced || sessionStorageSafe("seenIntro")) {
    loader.remove();
    startIntro();
    return;
  }
  const dur = 1500;
  const t0 = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    count.textContent = String(Math.round(e * 100)).padStart(3, "0");
    bar.style.transform = `scaleX(${e})`;
    if (p < 1) requestAnimationFrame(step);
    else {
      loader.classList.add("is-done");
      setTimeout(startIntro, 150);
      setTimeout(() => loader.remove(), 1200);
    }
  };
  requestAnimationFrame(step);
})();

function sessionStorageSafe(key: string): boolean {
  try {
    const seen = sessionStorage.getItem(key) === "1";
    sessionStorage.setItem(key, "1");
    return seen;
  } catch {
    return false;
  }
}

// keep scroll-linked values correct after fonts/images settle
window.addEventListener("load", () => {
  progress.update();
  drawOwnitLinks();
});
let rT = 0;
window.addEventListener("resize", () => {
  progress.update();
  clearTimeout(rT);
  rT = window.setTimeout(() => drawOwnitLinks(), 150);
});
if (document.fonts) document.fonts.ready.then(() => drawOwnitLinks());
drawOwnitLinks();
initChat(() => {});
