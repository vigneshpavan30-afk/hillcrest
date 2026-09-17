// Browser checks against a running server (npm start).
// Usage: node tests/e2e.mjs [baseUrl]   Set BROWSER_PATH if Edge/Chrome is not in the default location.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const BASE = process.argv[2] || 'http://localhost:4321';
const BROWSER = process.env.BROWSER_PATH || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => fs.existsSync(p));

let failures = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
  if (!ok) failures++;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// SwiftShader gives headless browsers a software WebGL implementation so the 3D hero can be tested.
const browser = await puppeteer.launch({
  executablePath: BROWSER, headless: 'new',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const errors = [];

async function open(path, { width = 1280, height = 900, reducedMotion = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  page.on('pageerror', (e) => errors.push(`${path}: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/fonts|maps|google|favicon/i.test(m.text())) errors.push(`${path}: ${m.text()}`);
  });
  await page.goto(BASE + path, { waitUntil: 'networkidle2' });
  return page;
}
// Visible = rendered, not visibility:hidden, and not faded out.
const shown = (page, sel) => page.$eval(sel, (el) => {
  const s = getComputedStyle(el);
  return !!(el.offsetWidth || el.getClientRects().length) && s.visibility !== 'hidden' && Number(s.opacity) > 0.5;
}).catch(() => false);
const waitShown = (page, sel, want = true) => page.waitForFunction((s, w) => {
  const el = document.querySelector(s);
  if (!el) return !w;
  const st = getComputedStyle(el);
  const vis = !!(el.offsetWidth || el.getClientRects().length) && st.visibility !== 'hidden' && Number(st.opacity) > 0.5;
  return vis === w;
}, { timeout: 4000 }, sel, want).then(() => true).catch(() => false);

try {
  // 3D hero renders
  {
    const page = await open('/');
    const rendered = await page.waitForSelector('[data-hero-3d].is-3d', { timeout: 20000 }).then(() => true).catch(() => false);
    check('3D hero renders with WebGL', rendered);
    const size = await page.$eval('.hero-canvas', (c) => [c.width, c.height]);
    check('3D canvas is sized', size[0] > 200 && size[1] > 200, size.join('x'));
    // WebGL buffers are cleared after presenting, so inspect a screenshot instead of reading the canvas.
    await sleep(2500);
    const shot = await (await page.$('.hero-canvas')).screenshot();
    const { data } = await sharp(shot).resize(64, 64).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let pixels = 0;
    // The navy-pearl sculpture is strongly blue against the pale page.
    for (let i = 0; i < data.length; i += 3) if (data[i + 2] - data[i] > 50 && data[i] < 150) pixels++;
    check('3D sculpture draws visible pixels', pixels > 40, `${pixels} sculpture px`);
    await page.close();
  }

  // Poster fallback when 3D is skipped
  {
    const page = await open('/?no3d');
    await sleep(2500);
    check('?no3d keeps the poster', !(await page.$('[data-hero-3d].is-3d')) && (await shown(page, '.hero-poster')));
    const posterOk = await page.$eval('.hero-poster', (i) => i.complete && i.naturalWidth > 0);
    check('poster image loads', posterOk);
    await page.close();
  }

  // Reduced motion: no motion class, no 3D, content fully visible
  {
    const page = await open('/', { reducedMotion: true });
    await sleep(1500);
    const state = await page.evaluate(() => ({
      motion: document.documentElement.classList.contains('motion'),
      hidden: [...document.querySelectorAll('[data-reveal], .line > span, .intro-fade')].filter((el) => Number(getComputedStyle(el).opacity) < 0.99).length,
      is3d: !!document.querySelector('[data-hero-3d].is-3d'),
    }));
    check('reduced motion disables animation', !state.motion && !state.is3d, JSON.stringify(state));
    check('reduced motion shows all content', state.hidden === 0, `${state.hidden} faded elements`);
    await page.close();
  }

  // Scroll reveals eventually show everything
  {
    const page = await open('/services/'.replace('/services/', '/dental-services-chino-hills/'));
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    });
    await sleep(2200);
    const faded = await page.$$eval('[data-reveal]', (els) => els.filter((el) => Number(getComputedStyle(el).opacity) < 0.99).length);
    check('scroll reveals finish', faded === 0, `${faded} still hidden`);
    await page.close();
  }

  // Header dropdowns
  {
    const page = await open('/');
    const panel = '[data-dropdown] .dd-panel';
    check('services dropdown hidden initially', !(await shown(page, panel)));
    await page.hover('[data-dropdown] > .nav-link');
    check('services dropdown opens on hover', await waitShown(page, panel, true));
    const count = await page.$eval('[data-dropdown]', (dd) => dd.querySelectorAll('.dd-panel a').length);
    check('services dropdown lists 13 services', count === 13, String(count));
    await page.mouse.move(5, 800);
    check('dropdown closes when pointer leaves', await waitShown(page, panel, false));
    await page.focus('[data-dropdown] > .nav-link');
    check('dropdown opens on keyboard focus', await waitShown(page, panel, true));
    await page.keyboard.press('Escape');
    check('Escape closes dropdown', await waitShown(page, panel, false));
    await page.close();
  }

  // Mobile menu + no horizontal overflow on every page
  {
    const page = await open('/', { width: 390, height: 844 });
    check('menu button visible on phone', await shown(page, '[data-mobile-toggle]'));
    check('desktop nav hidden on phone', !(await shown(page, '.nav')));
    await page.click('[data-mobile-toggle]');
    check('mobile menu opens', await waitShown(page, '#mobile-menu', true));
    await sleep(900);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.click('#mobile-menu a[href="/contact/"]'),
    ]);
    check('mobile menu link navigates', page.url().endsWith('/contact/'));
    await page.close();

    const xml = await (await fetch(BASE + '/sitemap.xml')).text();
    const paths = [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]);
    const overflow = [];
    const phone = await browser.newPage();
    await phone.setViewport({ width: 390, height: 844 });
    for (const p of paths) {
      await phone.goto(BASE + p, { waitUntil: 'domcontentloaded' });
      await sleep(150);
      const w = await phone.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
      if (w > 390) overflow.push(`${p} (${w}px)`);
    }
    await phone.close();
    check(`no horizontal scroll at 390px on ${paths.length} pages`, overflow.length === 0, overflow.join(', '));
  }

  // Library filter
  {
    const page = await open('/category/blog/');
    await page.click('[data-topic="Kids"]');
    const visibleTopics = await page.$$eval('[data-post-topic]', (cards) => cards.filter((c) => !c.hidden).map((c) => c.dataset.postTopic));
    check('topic filter shows only Kids articles', visibleTopics.length === 2 && visibleTopics.every((t) => t === 'Kids'), visibleTopics.join(','));
    check('topic filter updates URL', page.url().includes('topic=Kids'));
    await page.goto(BASE + '/category/blog/?topic=Cosmetic', { waitUntil: 'networkidle2' });
    const deep = await page.$$eval('[data-post-topic]', (cards) => cards.filter((c) => !c.hidden).length);
    check('topic deep link filters on load', deep === 2, String(deep));
    await page.close();
  }

  // Callback form on a service page
  {
    const page = await open('/veneers-chino-hills/');
    const form = '[data-lead-form]';
    await page.$eval(`${form} button[type="submit"]`, (b) => b.click());
    check('callback form rejects empty submit', await page.$eval(`${form} [data-form-msg]`, (m) => !m.hidden && m.classList.contains('is-error')));
    await page.type(`${form} input[name="name"]`, 'E2E Callback');
    await page.type(`${form} input[name="phone"]`, '(909) 555-0101');
    await page.$eval(`${form} button[type="submit"]`, (b) => b.click());
    const ok = await page.waitForFunction((f) => document.querySelector(`${f} [data-form-msg]`).classList.contains('is-ok'), { timeout: 8000 }, form).then(() => true).catch(() => false);
    check('callback form sends', ok);
    await page.close();
  }

  // Contact form
  {
    const page = await open('/contact/');
    const form = '[data-lead-form]';
    await page.type(`${form} input[name="name"]`, 'E2E Contact');
    await page.type(`${form} input[name="phone"]`, '909 555 0102');
    await page.type(`${form} textarea[name="note"]`, 'Do you take Delta PPO?');
    await page.$eval(`${form} button[type="submit"]`, (b) => b.click());
    const ok = await page.waitForFunction((f) => document.querySelector(`${f} [data-form-msg]`).classList.contains('is-ok'), { timeout: 8000 }, form).then(() => true).catch(() => false);
    const msg = await page.$eval(`${form} [data-form-msg]`, (m) => m.textContent);
    check('contact form sends', ok && msg.includes('Message sent'), msg);
    check('contact map embed present', !!(await page.$('iframe[src*="google.com/maps"]')));
    await page.close();
  }

  // Booking flow
  {
    const page = await open('/appointments/');
    const step = (n) => page.$eval(`[data-bk-step="${n}"]`, (el) => !el.hidden);
    const click = (sel) => page.$eval(sel, (b) => b.click());
    check('booking starts on step 1', await step(1));
    await click('[data-bk-reason="Tooth pain"]');
    check('choosing a reason advances to step 2', await step(2));
    const days = await page.$$('[data-bk-day]');
    check('eight weekdays offered', days.length === 8, String(days.length));
    await page.$$eval('[data-bk-day]', (d) => d[1].click());
    await click('[data-bk-time="Afternoon"]');
    await click('[data-bk-step="2"] [data-bk-back]');
    check('back returns to step 1 with reason kept', (await step(1)) && (await page.$eval('[data-bk-reason="Tooth pain"]', (b) => b.classList.contains('is-on'))));
    await click('[data-bk-reason="Tooth pain"]');
    await click('[data-bk-next]');
    check('continue advances to step 3', await step(3));
    await click('[data-bk-submit]');
    check('step 3 requires name and phone', await page.$eval('[data-bk-error]', (e) => !e.hidden));
    await page.type('input[name="name"]', 'E2E Booking');
    await page.type('input[name="phone"]', '9095550103');
    await page.type('input[name="email"]', 'not-an-email');
    await click('[data-bk-submit]');
    check('invalid email is rejected', await step(3));
    await page.$eval('input[name="email"]', (el) => { el.value = ''; });
    await page.type('input[name="email"]', 'e2e@example.com');
    await page.type('input[name="insurance"]', 'Delta PPO');
    await click('[data-bk-submit]');
    await page.waitForFunction(() => !document.querySelector('[data-bk-step="4"]').hidden, { timeout: 8000 });
    const summary = await page.$$eval('[data-bk-summary]', (els) => Object.fromEntries(els.map((e) => [e.dataset.bkSummary, e.textContent])));
    check('confirmation shows the request', summary.reason === 'Tooth pain' && summary.time === 'Afternoon' && summary.insurance === 'Delta PPO' && /\w{3} \w{3} \d+/.test(summary.day), JSON.stringify(summary));
    check('confirmation greets by name', (await page.$eval('[data-bk-out="name"]', (e) => e.textContent)) === 'E2E Booking');
    const active = await page.$$eval('[data-bk-indicator].is-active', (l) => l.length);
    check('all four progress steps active', active === 4, String(active));
    await click('[data-bk-reset]');
    check('new request resets to step 1', (await step(1)) && (await page.$eval('input[name="name"]', (i) => i.value)) === '');
    await page.close();
  }

  // Redirects from the old site
  {
    const page = await open('/are-you-aware-of-emergency-dentistry/');
    check('old post redirects to new article', page.url().endsWith('/what-counts-as-a-dental-emergency/'), page.url());
    await page.close();
  }

  check('no JavaScript errors', errors.length === 0, errors.join(' | '));
} finally {
  await browser.close();
}

console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
