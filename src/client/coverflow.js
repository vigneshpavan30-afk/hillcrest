// Reviews coverflow: 3D perspective carousel with buttons, dots, keyboard, swipe and optional autoplay.
// Without JavaScript the reviews stay a horizontal scroll-snap row.
import { $, $$ } from './util.js';

export function initCoverflow({ autoplay = true } = {}) {
  const root = $('[data-coverflow]');
  if (!root) return;
  const track = $('[data-cf-track]', root);
  const slides = $$('[data-cf-slide]', root);
  const dots = $$('[data-cf-dot]', root);
  const controls = $('.cf-controls', root);
  const n = slides.length;
  if (n < 2) return;

  let active = 0;
  root.classList.add('is-3d');
  controls.hidden = false;

  const narrow = () => window.matchMedia('(max-width: 700px)').matches;

  function layout() {
    const spacing = narrow() ? 78 : 64; // percent of slide width between neighbours
    slides.forEach((slide, i) => {
      let o = i - active;
      if (o > n / 2) o -= n;
      if (o < -n / 2) o += n;
      const a = Math.abs(o);
      slide.style.transform = `translate3d(calc(-50% + ${o * spacing}%), ${a * 14}px, ${-a * 240}px) rotateY(${-o * 34}deg) scale(${1 - a * 0.04})`;
      slide.style.opacity = a > 2 ? '0' : String(1 - a * 0.28);
      slide.style.zIndex = String(10 - a);
      slide.style.pointerEvents = a > 2 ? 'none' : 'auto';
      slide.classList.toggle('is-active', a === 0);
      slide.setAttribute('aria-hidden', a === 0 ? 'false' : 'true');
    });
    dots.forEach((d, i) => d.classList.toggle('is-on', i === active));
  }

  function measure() {
    const tallest = Math.max(...slides.map((s) => s.offsetHeight));
    track.style.height = `${tallest + 30}px`;
  }

  const go = (i) => { active = (i + n) % n; layout(); };

  $('[data-cf-prev]', root).addEventListener('click', () => { go(active - 1); restart(); });
  $('[data-cf-next]', root).addEventListener('click', () => { go(active + 1); restart(); });
  dots.forEach((d) => d.addEventListener('click', () => { go(Number(d.dataset.cfDot)); restart(); }));
  slides.forEach((s, i) => s.addEventListener('click', () => { if (i !== active && !dragged) { go(i); restart(); } }));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { go(active - 1); restart(); }
    if (e.key === 'ArrowRight') { go(active + 1); restart(); }
  });

  // Swipe / drag.
  let startX = null;
  let dragged = false;
  track.addEventListener('pointerdown', (e) => { startX = e.clientX; dragged = false; track.classList.add('is-dragging'); });
  window.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    track.classList.remove('is-dragging');
    if (Math.abs(dx) > 50) { dragged = true; go(active + (dx < 0 ? 1 : -1)); restart(); setTimeout(() => { dragged = false; }, 0); }
  });

  // Autoplay, paused while hovered, focused or offscreen.
  let timer = 0;
  let paused = false;
  let onScreen = false;
  const tick = () => { if (!paused && onScreen && !document.hidden) go(active + 1); };
  function restart() {
    if (!autoplay) return;
    clearInterval(timer);
    timer = setInterval(tick, 5500);
  }
  root.addEventListener('pointerenter', () => { paused = true; });
  root.addEventListener('pointerleave', () => { paused = false; });
  root.addEventListener('focusin', () => { paused = true; });
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) paused = false; });
  new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }).observe(root);

  measure();
  layout();
  restart();
  window.addEventListener('resize', () => { measure(); layout(); });
  document.fonts?.ready.then(measure);
}
