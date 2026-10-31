// Lightweight Lenis-style smooth scroll.
// Wheel input is eased toward a target; touch, keyboard and scrollbar stay native.
// Uses real window scrolling, so position: sticky and anchors keep working.

type Listener = (y: number, velocity: number) => void;

export class SmoothScroll {
  private target = 0;
  private current = 0;
  private animating = false;
  private ease = 0.1;
  private listeners: Listener[] = [];
  private enabled: boolean;
  private lastY = 0;
  private tweenTo: { from: number; to: number; t0: number; dur: number } | null = null;
  private locked = false;

  constructor(enabled: boolean) {
    this.enabled = enabled;
    this.current = this.target = window.scrollY;
    if (enabled) {
      document.documentElement.classList.add("has-smooth");
      window.addEventListener("wheel", this.onWheel, { passive: false });
    }
    window.addEventListener("scroll", this.onNativeScroll, { passive: true });
    requestAnimationFrame(this.tick);
  }

  on(fn: Listener) {
    this.listeners.push(fn);
  }

  lock(v: boolean) {
    this.locked = v;
    document.documentElement.classList.toggle("is-locked", v);
  }

  private max() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  private onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return; // pinch-zoom
    if (this.locked) {
      // let scrollable overlays (drawer) handle it natively
      return;
    }
    const t = e.target as HTMLElement | null;
    if (t && t.closest("[data-native-scroll]")) return;
    e.preventDefault();
    let d = e.deltaY;
    if (e.deltaMode === 1) d *= 32;
    else if (e.deltaMode === 2) d *= window.innerHeight;
    if (!this.animating) this.current = this.target = window.scrollY;
    this.tweenTo = null;
    this.target = Math.max(0, Math.min(this.max(), this.target + d));
    this.animating = true;
  };

  private onNativeScroll = () => {
    if (!this.animating && !this.tweenTo) this.current = this.target = window.scrollY;
  };

  scrollTo(y: number, duration = 1.2) {
    const to = Math.max(0, Math.min(this.max(), y));
    if (!this.enabled || duration === 0) {
      window.scrollTo({ top: to, behavior: this.enabled ? "auto" : "smooth" });
      return;
    }
    this.animating = false;
    this.tweenTo = { from: window.scrollY, to, t0: performance.now(), dur: duration * 1000 };
  }

  scrollToEl(el: Element, offset = 0) {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    this.scrollTo(y, Math.min(2, 0.8 + Math.abs(y - window.scrollY) / 4000));
  }

  private tick = (now: number) => {
    if (this.tweenTo) {
      const { from, to, t0, dur } = this.tweenTo;
      const p = Math.min(1, (now - t0) / dur);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // easeInOutCubic
      const y = from + (to - from) * e;
      window.scrollTo(0, y);
      this.current = this.target = y;
      if (p >= 1) this.tweenTo = null;
    } else if (this.animating) {
      this.current += (this.target - this.current) * this.ease;
      if (Math.abs(this.target - this.current) < 0.4) {
        this.current = this.target;
        this.animating = false;
      }
      window.scrollTo(0, this.current);
    }
    const y = window.scrollY;
    const v = y - this.lastY;
    this.lastY = y;
    for (const fn of this.listeners) fn(y, v);
    requestAnimationFrame(this.tick);
  };
}
