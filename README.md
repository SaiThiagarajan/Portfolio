# Sai Thiagarajan A — Portfolio

A single-page, art-directed portfolio. Zero runtime dependencies — everything (JS, CSS, portrait) is inlined into one `dist/index.html`.

## Run / build
```bash
npm install          # esbuild + typescript (dev only)
npm run build        # type-checks, then writes dist/index.html
npx serve dist       # or just open dist/index.html
```

## Edit content
All copy lives in `src/data/`:
- `profile.ts` — name, intro, email, phone, LinkedIn/GitHub, about text
- `skills.ts` — expertise categories (no proficiency scores, on purpose)
- `projects.ts` — the 4 projects. Add `repo` / `demo` URLs when they exist; UseIt has a `pendingNote` until its details are written
- `experience.ts` — internship, education, achievements, leadership

Portrait: `src/assets/portrait.ts` (base64 JPEG). Project visuals in `src/components/projectVisuals.ts` are illustrative mockups — swap in real screenshots when available.

## Structure
```
src/
  animations/  smoothScroll (Lenis-style), scrollFx (reveals, scroll progress), sculpture (3D canvas hero),
               codePortrait (code-lens portrait), contours (topographic SVG lines)
  components/  chrome (loader/nav/menu/cursor), hero, about, expertise, projects, projectVisuals, journey, closing
  data/        all content
  styles/      main.css — design tokens + every section
```

## Fonts
Display: Brier is commercial — Fraunces (Google Fonts) is used as the closest editorial serif. If you license Brier,
add an `@font-face` named "Brier" and it is picked up automatically (it's first in `--f-display`).
Functional: Mona Sans. Code: JetBrains Mono.
