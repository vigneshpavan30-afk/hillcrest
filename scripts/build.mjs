// Builds the static site into ./public.  Usage: node scripts/build.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import * as C from '../src/content/site.mjs';
import * as R from '../src/render.mjs';

const ROOT = path.resolve('.');
const OUT = path.join(ROOT, 'public');
const IMG_OUT = path.join(OUT, 'images');
const IMG_CACHE = path.join(ROOT, '.cache', 'images');
const WIDTHS = [640, 1280];

async function write(rel, content) {
  const file = path.join(OUT, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}

// --- images --------------------------------------------------------------------------

function collectImageSources(node, out = new Set()) {
  if (!node || typeof node !== 'object') return out;
  if (typeof node.src === 'string') out.add(node.src);
  else Object.values(node).forEach((v) => collectImageSources(v, out));
  return out;
}

const slug = (file) => path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

async function buildImages() {
  const manifest = {};
  await fs.mkdir(IMG_OUT, { recursive: true });
  await fs.mkdir(IMG_CACHE, { recursive: true });
  const sources = [...collectImageSources(C.IMAGES)];

  await Promise.all(sources.map(async (src) => {
    const input = path.join(ROOT, src);
    const srcStat = await fs.stat(input).catch(() => null);
    if (!srcStat) throw new Error(`Image not found: ${src}`);
    const meta = await sharp(input).metadata();
    const name = slug(src);
    const variants = [];
    for (const target of WIDTHS) {
      const width = Math.min(target, meta.width);
      if (variants.some((v) => v.width === width)) continue;
      const fileName = `${name}-${width}.webp`;
      const cached = path.join(IMG_CACHE, fileName);
      const cacheStat = await fs.stat(cached).catch(() => null);
      if (!cacheStat || cacheStat.mtimeMs < srcStat.mtimeMs) {
        await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(cached);
      }
      await fs.copyFile(cached, path.join(IMG_OUT, fileName));
      variants.push({ width, url: `/images/${fileName}` });
    }
    manifest[src] = {
      src: variants[variants.length - 1].url,
      srcset: variants.map((v) => `${v.url} ${v.width}w`).join(', '),
    };
  }));

  return manifest;
}

// Tooth mark from the practice logo, recolored. Returns the mark's aspect ratio (width / height).
async function buildLogo() {
  const { data: alpha, info } = await sharp(path.join(ROOT, C.LOGO.src))
    .extract(C.LOGO.markCrop).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const tinted = (color) => sharp({ create: { width: info.width, height: info.height, channels: 3, background: color } })
    .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png().toBuffer()
    .then((buf) => sharp(buf).trim().png().toBuffer({ resolveWithObject: true }));

  const navy = await tinted('#08405F');
  const white = await tinted('#FFFFFF');
  const ratio = navy.info.width / navy.info.height;
  await fs.mkdir(path.join(OUT, 'images'), { recursive: true });
  await sharp(navy.data).resize({ height: 144 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'images/logo-mark.png'));
  await sharp(white.data).resize({ height: 144 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'images/logo-mark-white.png'));

  // Favicon / app icon / structured-data logo: white mark on a navy square.
  const icon = async (size, file) => {
    const inner = Math.round(size * 0.66);
    const mark = await sharp(white.data).resize({ width: inner, height: inner, fit: 'inside' }).png().toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: '#08405F' } })
      .composite([{ input: mark, gravity: 'center' }]).png().toFile(path.join(OUT, file));
  };
  await icon(180, 'favicon.png');
  await icon(512, 'images/logo-512.png');
  return ratio;
}

// --- pages ---------------------------------------------------------------------------

function pages(images) {
  const og = (image) => images[image.src].src;
  const list = [
    { page: 'home', path: '/', body: R.home(), ogImage: og(C.IMAGES.hero) },
    { page: 'services', path: C.pagePath('services'), body: R.services() },
    { page: 'appointments', path: C.pagePath('appointments'), body: R.appointments() },
    { page: 'new-patients', path: C.pagePath('new-patients'), body: R.newPatients() },
    { page: 'insurance', path: C.pagePath('insurance'), body: R.insurance() },
    { page: 'about', path: C.pagePath('about'), body: R.about(), ogImage: og(C.IMAGES.aboutWide) },
    { page: 'doctors', path: C.pagePath('doctors'), body: R.doctors(), ogImage: og(C.IMAGES.doctor) },
    { page: 'difference', path: C.pagePath('difference'), body: R.difference() },
    { page: 'gallery', path: C.pagePath('gallery'), body: R.gallery() },
    { page: 'testimonials', path: C.pagePath('testimonials'), body: R.testimonials() },
    { page: 'blog', path: C.pagePath('blog'), body: R.blog() },
    { page: 'contact', path: C.pagePath('contact'), body: R.contact() },
    { page: 'forms', path: C.pagePath('forms'), body: R.forms() },
    { page: 'sitemap', path: C.pagePath('sitemap'), body: R.sitemap() },
    { page: 'accessibility', path: C.pagePath('accessibility'), body: R.accessibility() },
    { page: 'thanks', path: C.pagePath('thanks'), body: R.thanks() },
  ].map((p) => ({ ...p, meta: C.PAGE_META[p.page] }));

  for (const svc of C.SERVICES) {
    const url = C.SITE_URL + C.servicePath(svc.id);
    list.push({
      page: 'service',
      path: C.servicePath(svc.id),
      body: R.service(svc),
      ogImage: og(C.IMAGES.services[svc.id]),
      meta: { title: `${svc.name} in Chino Hills, CA | Hillcrest Dental Studio`, description: svc.dek },
      jsonLd: [
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: C.SITE_URL + '/' },
          { '@type': 'ListItem', position: 2, name: 'Services', item: C.SITE_URL + C.pagePath('services') },
          { '@type': 'ListItem', position: 3, name: svc.name, item: url },
        ] },
        { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: svc.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      ],
    });
  }

  for (const post of C.POSTS) {
    list.push({
      page: 'post',
      path: C.postPath(post.id),
      body: R.post(post),
      ogImage: og(C.IMAGES.posts[post.id]),
      meta: { title: `${post.title} | Hillcrest Dental Studio`, description: post.dek },
      jsonLd: [{
        '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.dek,
        image: C.SITE_URL + og(C.IMAGES.posts[post.id]),
        author: { '@type': 'Person', name: 'Dr. Rana Skaf, DDS' },
        publisher: { '@type': 'Organization', name: C.PRACTICE.name },
        mainEntityOfPage: C.SITE_URL + C.postPath(post.id),
      }],
    });
  }
  return list;
}

// --- main ----------------------------------------------------------------------------

const started = Date.now();
await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const images = await buildImages();
R.setLogoRatio(await buildLogo());
R.setImageResolver((src) => {
  if (!images[src]) throw new Error(`Image not processed: ${src}`);
  return images[src];
});

const all = pages(images);
const seen = new Set();
for (const p of all) {
  if (seen.has(p.path)) throw new Error(`Duplicate path ${p.path}`);
  seen.add(p.path);
  if (C.REDIRECTS[p.path]) throw new Error(`Path ${p.path} is also a redirect source`);
  await write(path.join(p.path, 'index.html'), R.layout(p));
}
await write('404.html', R.layout({ page: '404', path: '/404/', meta: C.PAGE_META['404'], body: R.notFound() }));

for (const [from, to] of Object.entries(C.REDIRECTS)) {
  if (!seen.has(to)) throw new Error(`Redirect ${from} -> ${to} points at a page that does not exist`);
}

await fs.mkdir(path.join(OUT, 'assets'), { recursive: true });
for (const asset of ['site.css', 'site.js']) {
  await fs.copyFile(path.join(ROOT, 'src/assets', asset), path.join(OUT, 'assets', asset));
}

const today = new Date().toISOString().slice(0, 10);
const indexable = all.filter((p) => !p.meta.noindex);
await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${C.SITE_URL}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
await write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${C.SITE_URL}/sitemap.xml\n`);
await write('_redirects.json', JSON.stringify({ exact: C.REDIRECTS, prefix: C.REDIRECT_PREFIXES }, null, 2));

console.log(`Built ${all.length} pages + 404, ${Object.keys(images).length} images, ${Object.keys(C.REDIRECTS).length} redirects in ${Date.now() - started}ms`);
