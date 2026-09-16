// Browser checks against a running server (npm start).
// Usage: node tests/e2e.mjs [baseUrl]   Set BROWSER_PATH if Edge/Chrome is not in the default location.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

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

const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true });
const errors = [];

async function open(path, width = 1280, height = 900) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  page.on('pageerror', (e) => errors.push(`${path}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts|maps|google/i.test(m.text())) errors.push(`${path}: ${m.text()}`); });
  await page.goto(BASE + path, { waitUntil: 'networkidle2' });
  return page;
}
const visible = (page, sel) => page.$eval(sel, (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)).catch(() => false);

try {
  // Header dropdowns
  {
    const page = await open('/');
    const services = await page.$('[data-dropdown]');
    check('services dropdown hidden initially', !(await visible(page, '[data-dropdown] .dd-panel')));
    await services.hover();
    check('services dropdown opens on hover', await visible(page, '[data-dropdown] .dd-panel'));
    const count = await page.$eval('[data-dropdown]', (dd) => dd.querySelectorAll('.dd-panel a').length);
    check('services dropdown lists 13 services', count === 13, String(count));
    await page.mouse.move(5, 800);
    await page.focus('[data-dropdown] [aria-haspopup]');
    check('dropdown opens on keyboard focus', await visible(page, '[data-dropdown] .dd-panel'));
    await page.keyboard.press('Escape');
    check('Escape closes dropdown', !(await visible(page, '[data-dropdown] .dd-panel')));
    await page.close();
  }

  // Mobile menu + no horizontal overflow on every page
  {
    const page = await open('/', 390, 844);
    check('mobile header visible on phone', await visible(page, 'header.v-narrow'));
    check('desktop header hidden on phone', !(await visible(page, 'header.v-wide')));
    await page.click('[data-mobile-toggle]');
    check('mobile menu opens', await visible(page, '#mobile-menu'));
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
      const w = await phone.evaluate(() => document.documentElement.scrollWidth);
      if (w > 390) overflow.push(`${p} (${w}px)`);
    }
    await phone.close();
    check(`no horizontal scroll at 390px on ${paths.length} pages`, overflow.length === 0, overflow.join(', '));
  }

  // Library filter
  {
    const page = await open('/category/blog/');
    await page.click('[data-topic="Kids"]');
    const shown = await page.$$eval('[data-post-topic]', (cards) => cards.filter((c) => !c.hidden).map((c) => c.dataset.postTopic));
    check('topic filter shows only Kids articles', shown.length === 2 && shown.every((t) => t === 'Kids'), shown.join(','));
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
    await page.click(`${form} button[type="submit"]`);
    check('callback form rejects empty submit', await page.$eval(`${form} [data-form-msg]`, (m) => !m.hidden && m.classList.contains('is-error')));
    await page.type(`${form} input[name="name"]`, 'E2E Callback');
    await page.type(`${form} input[name="phone"]`, '(909) 555-0101');
    await page.click(`${form} button[type="submit"]`);
    await page.waitForFunction((f) => document.querySelector(`${f} [data-form-msg]`).classList.contains('is-ok'), {}, form);
    check('callback form sends', true);
    await page.close();
  }

  // Contact form
  {
    const page = await open('/contact/');
    const form = '[data-lead-form]';
    await page.type(`${form} input[name="name"]`, 'E2E Contact');
    await page.type(`${form} input[name="phone"]`, '909 555 0102');
    await page.type(`${form} textarea[name="note"]`, 'Do you take Delta PPO?');
    await page.click(`${form} button[type="submit"]`);
    await page.waitForFunction((f) => document.querySelector(`${f} [data-form-msg]`).classList.contains('is-ok'), {}, form);
    const msg = await page.$eval(`${form} [data-form-msg]`, (m) => m.textContent);
    check('contact form sends', msg.includes('Message sent'), msg);
    check('contact map embed present', !!(await page.$('iframe[src*="google.com/maps"]')));
    await page.close();
  }

  // Booking flow
  {
    const page = await open('/appointments/');
    const step = (n) => visible(page, `[data-bk-step="${n}"]`);
    check('booking starts on step 1', await step(1));
    await page.click('[data-bk-reason="Tooth pain"]');
    check('choosing a reason advances to step 2', await step(2));
    const days = await page.$$('[data-bk-day]');
    check('eight weekdays offered', days.length === 8, String(days.length));
    await days[1].click();
    await page.click('[data-bk-time="Afternoon"]');
    await page.click('[data-bk-step="2"] [data-bk-back]');
    check('back returns to step 1 with reason kept', (await step(1)) && (await page.$eval('[data-bk-reason="Tooth pain"]', (b) => b.classList.contains('is-on'))));
    await page.click('[data-bk-reason="Tooth pain"]');
    await page.click('[data-bk-next]');
    check('continue advances to step 3', await step(3));
    await page.click('[data-bk-submit]');
    check('step 3 requires name and phone', await page.$eval('[data-bk-error]', (e) => !e.hidden));
    await page.type('input[name="name"]', 'E2E Booking');
    await page.type('input[name="phone"]', '9095550103');
    await page.type('input[name="email"]', 'not-an-email');
    await page.click('[data-bk-submit]');
    check('invalid email is rejected', await step(3));
    await page.$eval('input[name="email"]', (el) => { el.value = ''; });
    await page.type('input[name="email"]', 'e2e@example.com');
    await page.type('input[name="insurance"]', 'Delta PPO');
    await page.click('[data-bk-submit]');
    await page.waitForFunction(() => !document.querySelector('[data-bk-step="4"]').hidden);
    const summary = await page.$$eval('[data-bk-summary]', (els) => Object.fromEntries(els.map((e) => [e.dataset.bkSummary, e.textContent])));
    check('confirmation shows the request', summary.reason === 'Tooth pain' && summary.time === 'Afternoon' && summary.insurance === 'Delta PPO' && /\w{3} \w{3} \d+/.test(summary.day), JSON.stringify(summary));
    check('confirmation greets by name', (await page.$eval('[data-bk-out="name"]', (e) => e.textContent)) === 'E2E Booking');
    await new Promise((r) => setTimeout(r, 400)); // dots animate their fill over .3s
    const dots = await page.$$eval('[data-bk-indicator] .bk-step-dot', (d) => d.map((x) => getComputedStyle(x).backgroundColor));
    check('all four progress dots filled', dots.every((c) => c === 'rgb(11, 92, 138)'), dots.join(' '));
    await page.click('[data-bk-reset]');
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
