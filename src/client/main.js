// Entry point: core interactions everywhere, motion when allowed, the 3D hero when the device can handle it.
import { $, prefersReducedMotion } from './util.js';
import { initHeader, initDropdowns, initMobileMenu, initLeadForms, initLibraryFilter } from './ui.js';
import { initBooking } from './booking.js';
import { initCoverflow } from './coverflow.js';

const reduced = prefersReducedMotion();
let motion = null;

initHeader();
initDropdowns();
initLeadForms();

(async () => {
  if (!reduced) {
    try {
      motion = await import('./motion.js');
      motion.initMotion();
    } catch (err) {
      console.warn('Motion unavailable', err);
      document.documentElement.classList.remove('motion');
    }
  }
  initMobileMenu({ onOpen: (menu) => motion?.animateMenu(menu) });
  initLibraryFilter({ onChange: (cards) => motion?.animateCards(cards) });
  initBooking({ animateStep: (pane, dir) => motion?.animateStep(pane, dir) });
  initCoverflow({ autoplay: !reduced });
  initHero3d();
  initServices3d();
})();

function canRender3d() {
  if (reduced) return false;
  if (navigator.connection?.saveData) return false;
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return false;
  if (new URLSearchParams(location.search).has('no3d')) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function initHero3d() {
  const container = $('[data-hero-3d]');
  if (!container || !canRender3d()) return;
  const canvas = $('canvas', container);
  const load = () => import('./hero3d.js')
    .then(({ mountHero }) => mountHero(container, canvas))
    .catch((err) => console.warn('3D hero unavailable, showing poster', err));
  // Let the page paint and the intro start before loading three.js.
  if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 1200 });
  else setTimeout(load, 400);
}

// Services WebGL stage: desktop-width screens only; smaller screens keep the card grid.
function initServices3d() {
  const scene = $('[data-svc-scene]');
  if (!scene || !motion || !canRender3d() || !window.matchMedia('(min-width: 961px)').matches) return;
  const stage = $('.svc-stage-inner', scene);
  const canvas = $('.svc-canvas', scene);
  const load = () => import('./services3d.js')
    .then(({ mountServices }) => {
      scene.classList.add('is-3d'); // layout first so the canvas has a size
      const api = mountServices(stage, canvas);
      motion.initServiceScene(api);
    })
    .catch((err) => {
      scene.classList.remove('is-3d');
      console.warn('Services 3D unavailable', err);
    });
  if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 2000 });
  else setTimeout(load, 800);
}
