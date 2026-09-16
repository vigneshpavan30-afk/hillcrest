// Mirrors https://hillcrestdentalstudio.com into ./site as a static copy.
// Usage: node scripts/mirror.mjs
import fs from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = 'https://hillcrestdentalstudio.com';
const HOSTS = new Set(['hillcrestdentalstudio.com', 'www.hillcrestdentalstudio.com']);
const OUT = path.resolve('site');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const CONCURRENCY = 6;

const SKIP_PATH = /^\/(wp-admin|wp-json|xmlrpc\.php|wp-login\.php|comments\/feed|feed)(\/|$)|\/feed\/?$|\/embed\/?$/;
const ASSET_EXT = /\.(css|js|mjs|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot|pdf|mp4|webm|json|xml|txt)$/i;

const seenPages = new Set();
const seenAssets = new Set();
const redirects = {};
const failures = [];

const isOwn = (u) => HOSTS.has(u.hostname);

function normalize(raw, base) {
  if (!raw) return null;
  raw = raw.trim().replace(/&#0?38;|&amp;/g, '&').replace(/\\\//g, '/');
  if (/^(data:|mailto:|tel:|javascript:|#|about:)/i.test(raw)) return null;
  try {
    const u = new URL(raw, base);
    if (!/^https?:$/.test(u.protocol) || !isOwn(u)) return null;
    u.hash = '';
    u.hostname = 'hillcrestdentalstudio.com';
    u.protocol = 'https:';
    return u;
  } catch {
    return null;
  }
}

function localPath(u, isPage) {
  let p = decodeURIComponent(u.pathname);
  if (isPage) {
    if (!p.endsWith('/')) p += '/';
    p += 'index.html';
  }
  return path.join(OUT, ...p.split('/').filter(Boolean));
}

async function fetchWithRetry(url, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      return res;
    } catch (err) {
      if (i >= tries) throw err;
      await new Promise((r) => setTimeout(r, 500 * i));
    }
  }
}

async function save(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data);
}

function rewriteText(text) {
  return text
    .replace(/https?:\\\/\\\/(www\.)?hillcrestdentalstudio\.com/g, '')
    .replace(/(https?:)?\/\/(www\.)?hillcrestdentalstudio\.com(?=[/"'\s)?#]|$)/g, '')
    .replace(/(href|action)=(["'])(?=\2)/g, '$1=$2/');
}

// --- reference extraction -------------------------------------------------

function extractHtmlRefs(html) {
  const refs = [];
  const attr = /\s(?:href|src|data-src|data-lazy-src|data-bg|data-background|poster|action)\s*=\s*(["'])(.*?)\1/gis;
  for (const m of html.matchAll(attr)) refs.push(m[2]);
  const srcset = /\s(?:srcset|data-srcset|data-lazy-srcset)\s*=\s*(["'])(.*?)\1/gis;
  for (const m of html.matchAll(srcset)) {
    for (const part of m[2].split(',')) refs.push(part.trim().split(/\s+/)[0]);
  }
  refs.push(...extractCssRefs(html.replace(/&quot;/g, '"')));
  // Absolute own-domain URLs anywhere (inline JSON, scripts).
  for (const m of html.matchAll(/https?:(?:\\\/|\/){2}(?:www\.)?hillcrestdentalstudio\.com[^"'\s<>)\\]*(?:\\\/[^"'\s<>)\\]*)*/g)) {
    refs.push(m[0]);
  }
  return refs;
}

function extractCssRefs(css) {
  const refs = [];
  for (const m of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) refs.push(m[2]);
  for (const m of css.matchAll(/@import\s+(['"])(.*?)\1/gi)) refs.push(m[2]);
  return refs;
}

function classify(u) {
  if (SKIP_PATH.test(u.pathname)) return null;
  if (u.pathname.startsWith('/wp-content/') || u.pathname.startsWith('/wp-includes/') || ASSET_EXT.test(u.pathname)) {
    return 'asset';
  }
  if (u.search && !/^\?(page|paged)=/.test(u.search)) return null;
  return 'page';
}

// --- work queue -------------------------------------------------------------

const queue = [];
let active = 0;
let resolveDone;
const done = new Promise((r) => (resolveDone = r));

function enqueue(kind, u) {
  const key = kind === 'page' ? u.origin + u.pathname.replace(/\/?$/, '/') : u.origin + u.pathname;
  const set = kind === 'page' ? seenPages : seenAssets;
  if (set.has(key)) return;
  set.add(key);
  queue.push({ kind, url: new URL(key) });
  pump();
}

function pump() {
  while (active < CONCURRENCY && queue.length) {
    const job = queue.shift();
    active++;
    (job.kind === 'page' ? doPage(job.url) : doAsset(job.url))
      .catch((err) => failures.push(`${job.url.href} :: ${err.message}`))
      .finally(() => {
        active--;
        if (!queue.length && !active) resolveDone();
        else pump();
      });
  }
}

function discover(refs, base) {
  for (const r of refs) {
    const u = normalize(r, base);
    if (!u) continue;
    const kind = classify(u);
    if (kind) enqueue(kind, u);
  }
}

async function doPage(u) {
  const res = await fetchWithRetry(u.href);
  const finalUrl = new URL(res.url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  if (!type.includes('text/html')) {
    const buf = Buffer.from(await res.arrayBuffer());
    await save(localPath(u, false), buf);
    return;
  }
  const html = await res.text();
  if (finalUrl.pathname.replace(/\/?$/, '/') !== u.pathname.replace(/\/?$/, '/')) {
    // Stray relative refs (e.g. "r" inside inline scripts) hit WordPress' fuzzy redirect; not real URLs.
    if (/\/r\/$/.test(u.pathname)) return;
    if (!isOwn(finalUrl)) {
      redirects[u.pathname] = finalUrl.href;
      return;
    }
    redirects[u.pathname] = finalUrl.pathname;
    enqueue('page', finalUrl);
    return;
  }
  discover(extractHtmlRefs(html), u.href);
  await save(localPath(u, true), rewriteText(html));
  console.log('page ', u.pathname);
}

async function doAsset(u) {
  const res = await fetchWithRetry(u.href);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  const file = localPath(u, false);
  if (/\.css$/i.test(u.pathname) || type.includes('text/css')) {
    const css = await res.text();
    discover(extractCssRefs(css), u.href);
    await save(file, rewriteText(css));
  } else if (/\.(js|mjs|json|xml|txt|svg)$/i.test(u.pathname)) {
    const text = await res.text();
    if (/\.svg$/i.test(u.pathname)) discover(extractCssRefs(text), u.href);
    await save(file, rewriteText(text));
  } else {
    await save(file, Buffer.from(await res.arrayBuffer()));
  }
  console.log('asset', u.pathname);
}

// --- main -------------------------------------------------------------------

async function sitemapUrls() {
  const urls = [];
  for (const name of ['post-sitemap.xml', 'page-sitemap.xml', 'category-sitemap.xml']) {
    const xml = await (await fetchWithRetry(`${ORIGIN}/${name}`)).text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(m[1]);
  }
  return urls;
}

await fs.rm(OUT, { recursive: true, force: true });
for (const s of await sitemapUrls()) {
  const u = normalize(s, ORIGIN);
  if (u && classify(u) === 'page') enqueue('page', u);
}
for (const extra of ['/favicon.ico', '/robots.txt']) enqueue('asset', new URL(ORIGIN + extra));
if (!active && !queue.length) resolveDone();
await done;

// 404 template
{
  const res = await fetchWithRetry(`${ORIGIN}/this-page-does-not-exist-404/`);
  const html = await res.text();
  const before = seenAssets.size + seenPages.size;
  discover(extractHtmlRefs(html).filter((r) => !/^\/?[a-z0-9-]+\/?$/i.test(r)), ORIGIN);
  await save(path.join(OUT, '404.html'), rewriteText(html));
  if (seenAssets.size + seenPages.size > before) {
    let finish;
    const more = new Promise((r) => (finish = r));
    resolveDone = finish;
    if (!active && !queue.length) finish();
    await more;
  }
}

await save(path.join(OUT, '_redirects.json'), JSON.stringify(redirects, null, 2));
await save(path.join(OUT, '_mirror-report.json'), JSON.stringify({
  pages: seenPages.size,
  assets: seenAssets.size,
  redirects: Object.keys(redirects).length,
  failures,
}, null, 2));
console.log(`\nDone: ${seenPages.size} pages, ${seenAssets.size} assets, ${Object.keys(redirects).length} redirects, ${failures.length} failures`);
if (failures.length) console.log(failures.join('\n'));
