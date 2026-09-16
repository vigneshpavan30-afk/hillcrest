// Captures the live 3D sculpture (transparent background) as src/assets/hero-poster.png.
// The build turns it into the fallback shown without WebGL, with reduced motion, and while three.js loads.
// Usage: npm start (in another terminal), then: node scripts/render-poster.mjs [baseUrl]
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:4321';
const OUT = path.resolve('src/assets/hero-poster.png');
const BROWSER = process.env.BROWSER_PATH || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => fs.existsSync(p));

const browser = await puppeteer.launch({
  executablePath: BROWSER, headless: 'new',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 1100, deviceScaleFactor: 1 });
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-hero-3d].is-3d', { timeout: 30000 });
  // Keep only the canvas: no page chrome, glow, orbits or chips; transparent page background.
  await page.addStyleTag({ content: `
    html, body, main, .hero { background: transparent !important; }
    body::before, body::after, .site-header, .hero-copy, .scroll-cue, .orbit, .hero-chip, .hero-poster, .cursor-glow, main ~ *, main > :not(.hero) { display: none !important; }
    .hero { padding: 0 !important; min-height: 0 !important; }
    .hero-grid { display: block !important; padding: 0 !important; max-width: none !important; }
    .hero-visual { position: fixed !important; inset: 0 !important; width: 1000px !important; height: 1000px !important; max-width: none !important; margin: 0 !important; opacity: 1 !important; transform: none !important; }
    .hero-visual::before { display: none !important; }
  ` });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 5000)); // let the intro finish and the sculpture settle
  const el = await page.$('.hero-canvas');
  await el.screenshot({ path: OUT, omitBackground: true });
  console.log(`Wrote ${path.relative('.', OUT)}`);
} finally {
  await browser.close();
}
