import { profile } from "../data/profile";
import { contourSVG } from "../animations/contours";
import { arrow } from "../utils/dom";

const lensCode = `// engineer.config.ts
export const engineer = {
  name: "${profile.fullName}",
  base: "${profile.location}",
  stack: ["Flutter", "Dart", "NestJS", "PostgreSQL"],
  focus: ["full-stack", "cross-platform", "backend", "ai"],
};

@Controller('items')
export class ItemsController {
  constructor(private readonly items: ItemsService) {}
  @Get() findAll() { return this.items.findAll(); }
}

class SurveyStep extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text(t.household)),
    body: Form(key: _formKey, child: fields),
  );
}

SELECT id, title, status FROM reports
  WHERE status <> 'resolved' ORDER BY created_at DESC;

git commit -m "feat: role-based workflows"
`;

export const Hero = () => `
<section class="hero" id="home" data-theme="dark" data-progress="exit" aria-label="Introduction">
  ${contourSVG({
    seed: 7,
    className: "hero__contours",
    accentEvery: 6,
    centres: [
      { x: 1180, y: 430, rings: 18, r0: 26, step: 32 },
      { x: 120, y: 980, rings: 12, r0: 30, step: 42 },
    ],
  })}
  <div class="hero__lens" aria-hidden="true"><pre>${(lensCode + "\n" + lensCode + "\n" + lensCode).replace(/</g, "&lt;")}</pre></div>
  <canvas class="hero__canvas" id="sculpture" aria-hidden="true"></canvas>

  <div class="hero__inner">
    <div class="hero__top">
      <p class="eyebrow eyebrow--lime" data-hero-in style="--d:.1s"><span class="dot"></span>${profile.lookingFor}</p>
      <p class="hero__loc" data-hero-in style="--d:.2s">Based in ${profile.location}</p>
    </div>

    <h1 class="hero__title" aria-label="Sai Thiagarajan">
      <span class="hero__line hero__line--1"><span class="hero__word" data-hero-in style="--d:.15s">Sai</span><span class="hero__tag" data-hero-in style="--d:.6s">${profile.role}<br/>${profile.tagline}</span></span>
      <span class="hero__line hero__line--2"><span class="hero__word" data-hero-in style="--d:.28s">Thiagarajan</span></span>
    </h1>

    <div class="hero__bottom">
      <p class="hero__intro" data-hero-in style="--d:.7s">${profile.intro}</p>
      <div class="hero__ctas" data-hero-in style="--d:.82s">
        <a class="btn btn--lime" href="#projects" data-scroll data-magnetic>Explore my work ${arrow("s")}</a>
        <a class="btn btn--ghost" href="#contact" data-scroll data-magnetic>Let's connect ${arrow("e")}</a>
      </div>
      <a class="scroll-ind" href="#about" data-scroll aria-label="Scroll to About">
        <span class="scroll-ind__track"><span></span></span>
        <span>Scroll</span>
      </a>
    </div>
    <p class="hero__hint" aria-hidden="true">Move your cursor — reveal the system underneath</p>
  </div>
</section>`;
