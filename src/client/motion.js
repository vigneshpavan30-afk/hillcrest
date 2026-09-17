// Scroll-driven and pointer-driven animation: smooth scroll, reveals, parallax, 3D tilt, magnetic buttons, counters.
// Only loaded when the visitor has not asked for reduced motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { $, $$ } from './util.js';

gsap.registerPlugin(ScrollTrigger);
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const EASE = 'expo.out';
let lenis = null;

export function initMotion() {
  document.documentElement.classList.add('motion-ready');
  initSmoothScroll();
  initRing(); // before reveals: 3D ring cards are positioned by the ring, not revealed individually
  initDepthStack();
  initIntro();
  initReveals();
  initParallax();
  initCounters();
  if (finePointer) {
    initTilt();
    initMagnetic();
    initCursorGlow();
  }
  initFloatingMarks();
  // Fonts and lazy images change layout; keep trigger positions accurate.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function initSmoothScroll() {
  if (!finePointer) return; // native momentum scrolling is better on touch devices
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -100 });
    target.focus?.({ preventScroll: true });
  });
  const obs = new MutationObserver(() => (document.documentElement.classList.contains('menu-open') ? lenis.stop() : lenis.start()));
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

const words = (el) => $$('.line > span', el);

function initIntro() {
  const hero = $('[data-hero]');
  const tl = gsap.timeline({ defaults: { ease: EASE } });
  if (hero) {
    const title = $('h1[data-split]', hero);
    const fades = $$('.intro-fade', hero);
    tl.to(words(title), { y: 0, duration: 1.4, stagger: 0.06 }, 0.15)
      .fromTo(fades, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, 0.35);
    title.dataset.done = '1';
  }
}

function initReveals() {
  // Headlines rise word by word.
  $$('[data-split]').forEach((el) => {
    if (el.dataset.done) return;
    gsap.to(words(el), {
      y: 0, duration: 1.2, ease: EASE, stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Elements inside a [data-stagger] group enter in sequence; others individually.
  // No clearProps: these elements have CSS start states (see site.css) that would come back.
  const animateIn = (els, trigger) => gsap.to(els, {
    opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, duration: 1.3, ease: EASE, stagger: 0.09,
    scrollTrigger: { trigger, start: 'top 90%', once: true },
  });
  const grouped = new Set();
  $$('.ring-scene.is-3d [data-reveal]').forEach((el) => { grouped.add(el); gsap.set(el, { opacity: 1 }); });
  $$('[data-stagger]').forEach((group) => {
    const kids = $$(':scope > [data-reveal], :scope > * > [data-reveal]', group);
    kids.forEach((k) => grouped.add(k));
    if (kids.length) animateIn(kids, group);
  });
  $$('[data-reveal]').forEach((el) => { if (!grouped.has(el)) animateIn(el, el); });
}

function initParallax() {
  $$('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  const hero = $('[data-hero]');
  if (hero) {
    gsap.to($('.hero-copy', hero), {
      yPercent: -12, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
    $$('[data-depth]', hero).forEach((chip) => {
      gsap.to(chip, { y: -120 * Number(chip.dataset.depth), ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    });
  }
}

export function refreshLayout() { ScrollTrigger.refresh(); }

export function animateStep(pane, dir) {
  if (!pane) return;
  gsap.fromTo(pane, { opacity: 0, x: 40 * dir, rotateY: 6 * dir, transformPerspective: 1200 },
    { opacity: 1, x: 0, rotateY: 0, duration: 0.8, ease: EASE, clearProps: 'transform' });
  gsap.fromTo($$('.option, .day, .time, .field, .deflist > div', pane), { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.035, delay: 0.08 });
}

export function animateMenu(menu) {
  gsap.fromTo($$('.m-link, .m-actions > *', menu), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.05 });
}

export function animateCards(cards) {
  gsap.fromTo(cards, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: EASE, stagger: 0.05 });
  ScrollTrigger.refresh();
}

function initCounters() {
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const obj = { v: 0 };
    el.textContent = (0).toFixed(decimals);
    gsap.to(obj, {
      v: end, duration: 2.2, ease: 'power3.out',
      onUpdate: () => { el.textContent = obj.v.toFixed(decimals); },
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}

function initTilt() {
  $$('.tilt').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    gsap.set(card, { transformPerspective: 1000 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      rx((0.5 - py) * 8);
      ry((px - 0.5) * 10);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

function initMagnetic() {
  $$('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.25);
      y((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

function initCursorGlow() {
  const glow = $('[data-cursor-glow]');
  if (!glow) return;
  const x = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3.out' });
  const y = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3.out' });
  window.addEventListener('pointermove', (e) => { x(e.clientX); y(e.clientY); }, { passive: true });
}

function initFloatingMarks() {
  $$('[data-float]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, rotate: -8, scale: 0.9 }, { opacity: 0.5, rotate: 0, scale: 1, duration: 2, ease: EASE, delay: 0.2 });
    gsap.to(el, { yPercent: -10, rotate: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
  });
}

function scrollToY(y) {
  if (lenis) lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

// "Four things" as a 3D ring of cards, rotated by scrolling through a pinned section.
function initRing() {
  const scene = $('[data-ring]');
  if (!scene) return;
  const cards = $$('[data-ring-index]', scene);
  const n = cards.length;
  if (n < 3) return;
  scene.classList.add('is-3d');
  const controls = $('.ring-controls', scene);
  controls.hidden = false;
  const dots = $$('[data-ring-dot]', scene);
  const step = 360 / n;

  let rotation = 0;
  const render = () => {
    const width = cards[0].offsetWidth;
    const radius = Math.round(width * 0.78);
    let front = 0;
    let best = -2;
    cards.forEach((card, i) => {
      const angle = i * step + rotation;
      const facing = Math.cos((angle * Math.PI) / 180);
      if (facing > best) { best = facing; front = i; }
      card.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`;
      card.style.opacity = String(Math.max(0, (facing - 0.25) / 0.75)); // fully hidden once turned ~75deg away
      card.style.zIndex = String(Math.round((facing + 1) * 10));
      card.style.pointerEvents = facing > 0.9 ? 'auto' : 'none';
    });
    cards.forEach((c, i) => c.setAttribute('aria-hidden', i === front ? 'false' : 'true'));
    dots.forEach((d, i) => d.classList.toggle('is-on', i === front));
  };

  const track = $('[data-ring-track]', scene);
  const st = ScrollTrigger.create({
    trigger: scene,
    pin: scene,
    start: () => `center ${Math.round((window.innerHeight + 84) / 2)}px`, // centered below the fixed header
    end: () => `+=${window.innerHeight * (n - 1) * 0.7}`,
    scrub: 0.8,
    onUpdate: (self) => { rotation = -self.progress * (n - 1) * step; render(); },
  });
  // Gentle idle sway of the whole ring for depth.
  gsap.to(track, { rotationX: -4, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  const goTo = (i) => scrollToY(st.start + ((st.end - st.start) * i) / (n - 1));
  const current = () => Math.round(st.progress * (n - 1));
  $('[data-ring-prev]', scene).addEventListener('click', () => goTo(Math.max(0, current() - 1)));
  $('[data-ring-next]', scene).addEventListener('click', () => goTo(Math.min(n - 1, current() + 1)));
  dots.forEach((d) => d.addEventListener('click', () => goTo(Number(d.dataset.ringDot))));
  window.addEventListener('resize', render);
  render();
}

// Doctor photo: layers separate in depth on scroll and tilt toward the pointer.
function initDepthStack() {
  const stack = $('[data-depth-stack]');
  if (!stack) return;
  gsap.fromTo(stack, { '--spread': 0.25 }, {
    '--spread': 1.35, ease: 'none',
    scrollTrigger: { trigger: stack, start: 'top 90%', end: 'bottom 20%', scrub: true },
  });
  gsap.set(stack, { transformPerspective: 1400 });
  if (!finePointer) {
    gsap.fromTo(stack, { rotationY: 10, rotationX: 4 }, { rotationY: -8, rotationX: -3, ease: 'none', scrollTrigger: { trigger: stack, start: 'top bottom', end: 'bottom top', scrub: true } });
    return;
  }
  const area = stack.closest('section') || stack;
  const ry = gsap.quickTo(stack, 'rotationY', { duration: 1, ease: 'power3.out' });
  const rx = gsap.quickTo(stack, 'rotationX', { duration: 1, ease: 'power3.out' });
  area.addEventListener('pointermove', (e) => {
    const r = stack.getBoundingClientRect();
    ry(MathClamp(((e.clientX - (r.left + r.width / 2)) / r.width) * 22, -16, 16));
    rx(MathClamp(((r.top + r.height / 2 - e.clientY) / r.height) * 16, -12, 12));
  });
  area.addEventListener('pointerleave', () => { ry(0); rx(0); });
}
const MathClamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Services: sticky WebGL stage beside the cards; the card crossing the middle of the screen drives the 3D icon.
export function initServiceScene(api) {
  const scene = $('[data-svc-scene]');
  if (!scene) return;
  scene.classList.add('is-3d');
  const cards = $$('[data-svc-index]', scene);
  const num = $('[data-svc-num]', scene);
  const title = $('[data-svc-title]', scene);
  const dots = $$('.svc-stage-dots span', scene);

  const setActive = (i) => {
    cards.forEach((c, j) => c.classList.toggle('is-active', j === i));
    dots.forEach((d, j) => d.classList.toggle('is-on', j === i));
    api.setActive(i);
    const heading = cards[i].querySelector('.card-title');
    gsap.to(title, { opacity: 0, y: 8, duration: 0.2, onComplete: () => {
      num.textContent = String(i + 1).padStart(2, '0');
      title.textContent = heading ? heading.textContent : '';
      gsap.to(title, { opacity: 1, y: 0, duration: 0.5, ease: EASE });
    } });
  };
  cards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card, start: 'top 55%', end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) setActive(i); },
    });
  });
  ScrollTrigger.create({
    trigger: scene, start: 'top center', end: 'bottom center',
    onUpdate: (self) => api.setProgress(self.progress),
  });
  cards[0].classList.add('is-active');
  ScrollTrigger.refresh();
}
