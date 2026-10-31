// "Ask Sai" — a self-contained portfolio assistant. It answers from the data files only
// (no backend, no invented facts) and hands real conversations off to WhatsApp or email.
import { profile } from "../data/profile";
import { projects } from "../data/projects";
import { skillGroups } from "../data/skills";
import { experience, education, achievements, leadership } from "../data/experience";
import { esc, monogram } from "../utils/dom";

const WA = profile.phoneHref.replace("tel:+", "");
const waLink = (text: string) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
const mailLink = (text: string) =>
  `mailto:${profile.email}?subject=${encodeURIComponent("Hello Sai — from your portfolio")}&body=${encodeURIComponent(text)}`;

const QUICK = ["Projects", "Skills", "Experience", "Achievements", "Hire / contact", "Leave a message"];

export const Chat = () => `
<div class="chat" id="chat">
  <button class="chat__fab" id="chatFab" aria-expanded="false" aria-controls="chatPanel" data-magnetic>
    <span class="chat__fab-ico" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 10h.01M12 10h.01M16 10h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
    </span>
    <span class="chat__fab-label">Chat with Sai</span>
  </button>

  <section class="chat__panel" id="chatPanel" role="dialog" aria-label="Chat with Sai" aria-hidden="true">
    <header class="chat__head">
      <div class="chat__avatar">${monogram()}</div>
      <div class="chat__who">
        <strong>Ask Sai</strong>
        <span><i class="chat__live"></i>Portfolio assistant · replies instantly</span>
      </div>
      <button class="chat__close" id="chatClose" aria-label="Close chat"><span></span><span></span></button>
    </header>
    <div class="chat__log" id="chatLog" data-native-scroll aria-live="polite"></div>
    <div class="chat__quick" id="chatQuick">
      ${QUICK.map((q) => `<button type="button" data-q="${q}">${q}</button>`).join("")}
    </div>
    <form class="chat__form" id="chatForm" autocomplete="off">
      <label class="sr-only" for="chatInput">Type a message</label>
      <input id="chatInput" type="text" placeholder="Ask about projects, skills, hiring…" maxlength="500" />
      <button type="submit" aria-label="Send">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
      </button>
    </form>
  </section>
</div>`;

// ---------- answers (only from data files) ----------
type Reply = { html: string; chips?: string[] };

const handoff = (text: string) => `
  <div class="chat__handoff">
    <a href="${waLink(text)}" target="_blank" rel="noopener">WhatsApp ↗</a>
    <a href="${mailLink(text)}">Email ↗</a>
  </div>
  <p class="chat__small">Or write to ${esc(profile.email)} · ${esc(profile.phone)}</p>`;

function answer(raw: string, pending: { message: boolean }): Reply {
  const q = raw.toLowerCase().trim();
  const has = (...w: string[]) => w.some((x) => q.includes(x));

  if (pending.message) {
    pending.message = false;
    return {
      html: `Got it. Send it straight to Sai — it opens with your message filled in:${handoff(raw)}`,
      chips: ["Projects", "Skills"],
    };
  }

  if (has("leave a message", "message", "talk to sai", "speak", "real person", "human")) {
    pending.message = true;
    return { html: "Sure — type your message below (include your name and how to reach you), and I'll prepare it for WhatsApp or email." };
  }

  const p = projects.find(
    (x) => q.includes(x.name.toLowerCase()) || q.includes(x.id) || (x.id === "dcmp" && has("census")) || (x.id === "cityfix" && has("city fix", "urban")) || (x.id === "ownit" && has("lost", "found"))
  );
  if (p) {
    const built = p.features.filter((f) => f.status === "built").flatMap((f) => f.points).slice(0, 4);
    const planned = p.features.filter((f) => f.status === "planned").flatMap((f) => f.points);
    return {
      html: `<strong>${esc(p.name)}</strong> — ${esc(p.fullName)}<br>${esc(p.summary)}
        <ul>${built.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        ${planned.length ? `<p class="chat__planned">Planned, not built yet: ${planned.map(esc).join(" ")}</p>` : ""}
        ${p.pendingNote ? `<p class="chat__small">${esc(p.pendingNote)}</p>` : ""}
        <p class="chat__small">Stack: ${p.stack.map(esc).join(", ")}</p>
        <div class="chat__handoff"><button type="button" data-open-project="${p.id}">Open case details</button>${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener">GitHub ↗</a>` : ""}</div>`,
      chips: projects.filter((x) => x !== p).map((x) => x.name),
    };
  }

  if (has("project", "work", "built", "portfolio", "app")) {
    return {
      html: `Sai has four featured projects:<ul>${projects.map((x) => `<li><strong>${esc(x.name)}</strong> — ${esc(x.category)}</li>`).join("")}</ul>Which one should I tell you about?`,
      chips: projects.map((x) => x.name),
    };
  }

  if (has("skill", "stack", "tech", "language", "framework", "flutter", "react", "node", "nest", "java", "python", "database", "sql", "tool")) {
    return {
      html: skillGroups.map((g) => `<p><strong>${esc(g.title)}</strong> — ${g.items.map(esc).join(", ")}</p>`).join(""),
      chips: ["Projects", "Experience"],
    };
  }

  if (has("experience", "intern", "job", "viskamnix", "work history", "company")) {
    const x = experience[0];
    return {
      html: `<strong>${esc(x.role)}</strong> at ${esc(x.company)}<br><span class="chat__small">${esc(x.period)} · ${esc(x.mode)}</span>
        <ul>${x.points.slice(0, 4).map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>`,
      chips: ["DCMP", "Education"],
    };
  }

  if (has("educat", "study", "college", "vit", "degree", "school", "student")) {
    return {
      html: education.map((e) => `<p><strong>${esc(e.school)}${e.location ? `, ${esc(e.location)}` : ""}</strong><br>${esc(e.detail)} · ${esc(e.period)}</p>`).join(""),
      chips: ["Experience", "Achievements"],
    };
  }

  if (has("achiev", "hackathon", "award", "win", "rank", "leader", "lead", "club", "event")) {
    return {
      html: `<ul>${achievements.map((a) => `<li><strong>${esc(a.prefix)} ${esc(a.rank.replace(/^0/, ""))}</strong> — ${esc(a.event)} (${esc(a.scope)})</li>`).join("")}</ul>
        <p><strong>Leadership</strong></p><ul>${leadership.map((l) => `<li>${esc(l.title)} — ${esc(l.org)}</li>`).join("")}</ul>`,
      chips: ["Projects", "Hire / contact"],
    };
  }

  if (has("hire", "contact", "email", "phone", "call", "reach", "available", "opportunit", "role", "linkedin", "github", "resume", "cv")) {
    return {
      html: `${esc(profile.lookingFor)}.<br>
        <p class="chat__small">Email: ${esc(profile.email)}<br>Phone: ${esc(profile.phone)}</p>
        <div class="chat__handoff">${profile.socials.map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${s.label} ↗</a>`).join("")}</div>
        ${handoff("Hi Sai, I came across your portfolio and would like to connect.")}`,
      chips: ["Leave a message"],
    };
  }

  if (has("where", "location", "based", "chennai", "city")) {
    return { html: `Sai is based in ${esc(profile.location)}.`, chips: ["Hire / contact"] };
  }

  if (has("who", "about", "yourself", "sai")) {
    return { html: profile.about.map((x) => `<p>${esc(x)}</p>`).join(""), chips: ["Projects", "Skills"] };
  }

  if (has("hi", "hello", "hey", "vanakkam", "namaste")) {
    return { html: "Hey! I can tell you about Sai's projects, skills, internship or how to get in touch.", chips: QUICK };
  }

  if (has("thank", "thanks", "great", "cool", "nice")) {
    return { html: "Glad that helped! Anything else you'd like to know?", chips: ["Leave a message"] };
  }

  return {
    html: `I only know what's on this portfolio, so I'm not sure about that one. You can ask Sai directly:${handoff(raw)}`,
    chips: QUICK,
  };
}

export function initChat(onOpenChange: (open: boolean) => void) {
  const root = document.getElementById("chat");
  if (!root) return;
  const fab = root.querySelector<HTMLButtonElement>("#chatFab")!;
  const panel = root.querySelector<HTMLElement>("#chatPanel")!;
  const log = root.querySelector<HTMLElement>("#chatLog")!;
  const quick = root.querySelector<HTMLElement>("#chatQuick")!;
  const form = root.querySelector<HTMLFormElement>("#chatForm")!;
  const input = root.querySelector<HTMLInputElement>("#chatInput")!;
  const pending = { message: false };
  let greeted = false;

  const push = (who: "bot" | "me", html: string) => {
    const el = document.createElement("div");
    el.className = `chat__msg chat__msg--${who}`;
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  };
  const setChips = (chips?: string[]) => {
    if (!chips) return;
    quick.innerHTML = chips.map((c) => `<button type="button" data-q="${esc(c)}">${esc(c)}</button>`).join("");
  };
  const ask = (text: string) => {
    const t = text.trim();
    if (!t) return;
    push("me", esc(t));
    const typing = document.createElement("div");
    typing.className = "chat__msg chat__msg--bot chat__typing";
    typing.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;
    const q = t === "Hire / contact" ? "contact" : t;
    setTimeout(() => {
      typing.remove();
      const r = answer(q, pending);
      push("bot", r.html);
      setChips(r.chips);
    }, 450 + Math.random() * 350);
  };

  const open = (v: boolean) => {
    root.classList.toggle("is-open", v);
    fab.setAttribute("aria-expanded", String(v));
    panel.setAttribute("aria-hidden", String(!v));
    onOpenChange(v);
    if (v && !greeted) {
      greeted = true;
      push("bot", `Hi! I'm Sai's portfolio assistant. Ask me about his projects, skills, internship or how to reach him.`);
    }
    if (v && window.matchMedia("(hover: hover)").matches) setTimeout(() => input.focus(), 300);
    if (!v) fab.focus();
  };

  fab.addEventListener("click", () => open(!root.classList.contains("is-open")));
  root.querySelector("#chatClose")!.addEventListener("click", () => open(false));
  quick.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-q]");
    if (b) ask(b.dataset.q!);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
    input.value = "";
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("is-open")) open(false);
  });
  // any [data-open-chat] element on the page opens the chat
  document.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("[data-open-chat]")) {
      e.preventDefault();
      open(true);
    }
  });
}
