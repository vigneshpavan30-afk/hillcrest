// HTML templates for every page of the redesign. Markup and inline styles follow design/Site Page.dc.html.
import * as C from './content/site.mjs';

const { PRACTICE: P, SERVICES, GROUPS, POSTS, TOPICS } = C;
const SANS = "'IBM Plex Sans',system-ui,sans-serif";
const MONO = "'IBM Plex Mono',monospace";

// --- helpers -----------------------------------------------------------------------

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const map = (list, fn) => list.map(fn).join('\n');
const svcById = (id) => SERVICES.find((s) => s.id === id);
const TEL = `tel:${P.phoneRaw}`;
const SMS = `sms:${P.phoneRaw}`;

let imageUrls = () => { throw new Error('setImageResolver() not called'); };
export function setImageResolver(fn) { imageUrls = fn; }

let logoRatio = 1;
export function setLogoRatio(r) { logoRatio = r; }

// Tooth mark shown beside the "Hillcrest / Dental Studio" wordmark.
function logoMark(height, white = false) {
  const width = Math.round(height * logoRatio);
  return `<img src="/images/logo-mark${white ? '-white' : ''}.png" width="${width}" height="${height}" alt="" aria-hidden="true" style="display:block;flex:0 0 auto;width:${width}px;height:${height}px;" />`;
}

function img(image, { sizes = '100vw', eager = false } = {}) {
  const { src, srcset } = imageUrls(image.src);
  const pos = image.position ? ` style="object-position:${image.position};"` : '';
  return `<img class="fill slot-bg" src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${esc(image.alt)}"${pos}${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'} />`;
}

function mapFrame(title) {
  return `<iframe class="fill slot-bg" src="${esc(P.mapEmbed)}" title="${esc(title)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
}

const eyebrow = (text, extra = '') =>
  `<div style="font:500 11px/1 ${MONO};letter-spacing:0.16em;text-transform:uppercase;color:#0B5C8A;${extra}">${text}</div>`;

const btnPrimary = (href, label, extra = '') =>
  `<a href="${href}" class="hv-btn-lift" style="display:inline-flex;align-items:center;gap:9px;background:#0B5C8A;color:#fff;padding:16px 24px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;transition:background-color .25s ease,transform .25s ease;${extra}">${label}</a>`;

function pageIntro({ label, title, lede, width = 820, h1Size = 46, h1Line = 1.1, wrap = true, ledeSize = 19, ledeLine = 1.7, ledeMargin = 22 }) {
  return `<div style="padding:66px 40px 0;">
<div style="max-width:${width}px;margin:0 auto;">
${eyebrow(label)}
<h1 style="font:300 ${h1Size}px/${h1Line} ${SANS};letter-spacing:-0.02em;margin:18px 0 0;color:#08405F;animation:dcUp .5s ease .05s both;${wrap ? 'text-wrap:pretty;' : ''}">${title}</h1>
${lede ? `<p style="font:400 ${ledeSize}px/${ledeLine} ${SANS};color:#4A5C6B;margin:${ledeMargin}px 0 0;">${lede}</p>` : ''}
</div>
</div>`;
}

const hoursRows = (pad, size, color, tColor) =>
  map(C.HOURS, (h) => `<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 14px;padding:${pad};font:400 ${size} ${SANS};color:${color};"><span style="white-space:nowrap;flex:0 0 auto;">${h.d}</span><span style="color:${tColor};white-space:nowrap;flex:0 0 auto;">${h.t}</span></div>`);

const honeypot = `<div class="hp-field" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>`;

// --- layout ------------------------------------------------------------------------

function header(current) {
  const navLink = (page, label) =>
    `<a href="${C.pagePath(page)}"${current === page ? ' aria-current="page"' : ''} class="hv-color" style="text-decoration:none;color:#16232E;font:400 16px/1 ${SANS};padding:28px 0;white-space:nowrap;">${label}</a>`;
  const practiceLinks = [['about', 'Who We Are'], ['doctors', 'Meet Dr. Skaf'], ['difference', 'The Difference'], ['gallery', 'Office Gallery'], ['testimonials', 'Patient Reviews'], ['insurance', 'Insurance &amp; Payment']];
  const mobileLink = (href, label, last = false) =>
    `<a href="${href}" style="text-decoration:none;color:#16232E;font:400 17px/1 ${SANS};padding:13px 0;${last ? '' : 'border-bottom:1px solid #EDF3F8;'}">${label}</a>`;

  return `<a class="skip-link" href="#main">Skip to content</a>
<div class="v-wide">
<div style="background:#08405F;color:#CFE3E3;padding:9px 40px;display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between;font:400 12px/1 ${MONO};letter-spacing:0.04em;">
<a href="${P.mapsUrl}" target="_blank" rel="noopener" style="color:#CFE3E3;text-decoration:none;">${P.street}, ${P.city}, ${P.region} ${P.zip}</a>
<span style="display:flex;gap:20px;align-items:center;"><span>Mon–Fri 10:00–6:00</span><a href="${TEL}" style="color:#fff;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.35);">${P.phone}</a><a href="${SMS}" style="color:#CFE3E3;text-decoration:none;">Text us</a></span>
</div>
</div>
<header class="v-wide" style="position:sticky;top:0;z-index:40;background:#FCFDFE;border-bottom:1px solid #D8E3EC;">
<nav aria-label="Main" style="max-width:1200px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:20px;height:78px;white-space:nowrap;">
<a href="/" aria-label="Hillcrest Dental Studio home" style="text-decoration:none;display:flex;align-items:center;gap:12px;">
${logoMark(44)}
<div>
<div style="font:400 23px/1 ${SANS};letter-spacing:0.02em;color:#08405F;">Hillcrest</div>
<div style="font:500 9.5px/1 ${MONO};letter-spacing:0.28em;text-transform:uppercase;color:#6F8494;margin-top:5px;">Dental Studio</div>
</div>
</a>
<div style="display:flex;align-items:center;gap:24px;flex:0 0 auto;">
<div class="dd" data-dropdown style="--dd-display:grid;">
<a href="${C.pagePath('services')}" aria-haspopup="true" aria-expanded="false"${current === 'services' || current === 'service' ? ' aria-current="page"' : ''} class="hv-color" style="text-decoration:none;color:#16232E;font:400 16px/1 ${SANS};display:flex;align-items:center;gap:7px;padding:28px 0;white-space:nowrap;">Services<span aria-hidden="true" style="font-size:9px;color:#6F8494;">▼</span></a>
<div class="dd-panel" style="position:absolute;top:78px;left:-24px;width:720px;background:#fff;border:1px solid #D8E3EC;box-shadow:0 24px 48px -24px rgba(8,64,95,.24);animation:dcDrop .22s ease both;padding:28px;grid-template-columns:repeat(2,1fr);gap:26px 34px;">
${map(GROUPS, (g) => `<div>
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.16em;text-transform:uppercase;color:#0B5C8A;padding-bottom:10px;border-bottom:1px solid #EAF2F8;">${esc(g.cat)}</div>
<div style="display:flex;flex-direction:column;gap:2px;margin-top:10px;">
${map(g.ids, (id) => `<a href="${C.servicePath(id)}" class="hv-menu" style="text-decoration:none;color:#16232E;font:400 15.5px/1.3 ${SANS};padding:6px 0;transition:color .2s ease,transform .2s ease;">${esc(svcById(id).name)}</a>`)}
</div>
</div>`)}
</div>
</div>
<div class="dd" data-dropdown style="--dd-display:flex;">
<a href="${C.pagePath('about')}" aria-haspopup="true" aria-expanded="false" class="hv-color" style="text-decoration:none;color:#16232E;font:400 16px/1 ${SANS};display:flex;align-items:center;gap:7px;padding:28px 0;white-space:nowrap;">Our Practice<span aria-hidden="true" style="font-size:9px;color:#6F8494;">▼</span></a>
<div class="dd-panel" style="position:absolute;top:78px;left:-24px;width:250px;background:#fff;border:1px solid #D8E3EC;box-shadow:0 24px 48px -24px rgba(8,64,95,.24);animation:dcDrop .22s ease both;padding:16px 24px;flex-direction:column;">
${map(practiceLinks, ([page, label]) => `<a href="${C.pagePath(page)}" class="hv-color" style="text-decoration:none;color:#16232E;font:400 15.5px/1 ${SANS};padding:9px 0;">${label}</a>`)}
</div>
</div>
${navLink('new-patients', 'New Patients')}
${navLink('blog', 'Learn')}
${navLink('contact', 'Contact')}
<a href="${C.pagePath('appointments')}" class="hv-btn" style="display:inline-flex;align-items:center;gap:9px;background:#0B5C8A;color:#fff;padding:14px 20px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;transition:background-color .25s ease;">Book a visit</a>
</div>
</nav>
</header>

<header class="v-narrow" style="position:sticky;top:0;z-index:40;background:#FCFDFE;border-bottom:1px solid #D8E3EC;">
<div style="padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
<a href="/" aria-label="Hillcrest Dental Studio home" style="text-decoration:none;display:flex;align-items:center;gap:10px;">
${logoMark(36)}
<div>
<div style="font:400 19px/1 ${SANS};color:#08405F;">Hillcrest</div>
<div style="font:500 8px/1 ${MONO};letter-spacing:0.24em;text-transform:uppercase;color:#6F8494;margin-top:4px;">Dental Studio</div>
</div>
</a>
<div style="display:flex;align-items:center;gap:8px;">
<a href="${TEL}" style="display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 14px;border:1px solid #D8E3EC;color:#08405F;text-decoration:none;font:500 11.5px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">Call</a>
<button type="button" data-mobile-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Menu" style="width:44px;height:44px;border:1px solid #D8E3EC;background:#fff;color:#08405F;font:500 11px/1 ${MONO};cursor:pointer;">☰</button>
</div>
</div>
<nav id="mobile-menu" aria-label="Mobile" hidden style="border-top:1px solid #D8E3EC;padding:14px 18px 22px;display:flex;flex-direction:column;gap:2px;max-height:calc(100vh - 74px);overflow:auto;animation:dcDrop .24s ease both;">
${mobileLink(C.pagePath('services'), 'All Services')}
${map(SERVICES, (s) => `<a href="${C.servicePath(s.id)}" style="text-decoration:none;color:#4A5C6B;font:400 15px/1 ${SANS};padding:11px 0 11px 16px;border-bottom:1px solid #F4F8FB;">${esc(s.name)}</a>`)}
${mobileLink(C.pagePath('new-patients'), 'New Patients')}
${mobileLink(C.pagePath('about'), 'Who We Are')}
${mobileLink(C.pagePath('doctors'), 'Meet Dr. Skaf')}
${mobileLink(C.pagePath('difference'), 'The Difference')}
${mobileLink(C.pagePath('gallery'), 'Office Gallery')}
${mobileLink(C.pagePath('testimonials'), 'Patient Reviews')}
${mobileLink(C.pagePath('insurance'), 'Insurance &amp; Payment')}
${mobileLink(C.pagePath('blog'), 'Learn')}
${mobileLink(C.pagePath('contact'), 'Contact', true)}
<a href="${C.pagePath('appointments')}" style="margin-top:14px;display:inline-flex;align-items:center;justify-content:center;background:#0B5C8A;color:#fff;padding:16px 20px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">Book a visit</a>
</nav>
</header>`;
}

function footer() {
  const link = (page, label) =>
    `<a href="${C.pagePath(page)}" class="hv-foot" style="color:#EAF2F8;text-decoration:none;font:400 16px/1.4 ${SANS};padding:7px 0;transition:color .2s ease,transform .2s ease;">${label}</a>`;
  return `<footer style="background:#08405F;padding:66px 40px 34px;">
<div style="max-width:1120px;margin:0 auto;">
<div style="display:flex;flex-wrap:wrap;gap:40px;">
<div style="flex:1.3 1 300px;">
<div style="display:flex;align-items:center;gap:14px;">
${logoMark(48, true)}
<div>
<div style="font:400 24px/1 ${SANS};color:#fff;">Hillcrest</div>
<div style="font:500 9.5px/1 ${MONO};letter-spacing:0.28em;text-transform:uppercase;color:#9CC4DD;margin-top:6px;">Dental Studio</div>
</div>
</div>
<p style="font:400 16.5px/1.65 ${SANS};color:#C4DAE9;margin:20px 0 0;max-width:38ch;">Our goal is for you to leave with a memorable, easy experience — which is why our team does everything it can to make you feel at home.</p>
<a href="${C.pagePath('appointments')}" style="display:inline-flex;margin-top:24px;background:#FCFDFE;color:#08405F;padding:15px 22px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">Request appointment</a>
</div>
<div style="flex:1 1 180px;">
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#9CC4DD;">Visit</div>
<address style="font:400 16.5px/1.7 ${SANS};font-style:normal;color:#EAF2F8;margin-top:14px;"><a href="${P.mapsUrl}" target="_blank" rel="noopener" style="color:#EAF2F8;text-decoration:none;">${P.street}<br />${P.city}, ${P.region} ${P.zip}</a></address>
<div style="font:400 16.5px/1.7 ${SANS};margin-top:12px;"><a href="${TEL}" style="color:#fff;text-decoration:none;">${P.phone}</a></div>
<div style="font:400 15px/1.7 ${SANS};margin-top:4px;"><a href="mailto:${P.email}" style="color:#C4DAE9;">${P.email}</a></div>
</div>
<div style="flex:1 1 180px;">
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#9CC4DD;">Hours</div>
<div style="margin-top:14px;">
${hoursRows('6px 0', '15.5px/1.4', '#EAF2F8', '#A9C9DE')}
</div>
</div>
<div style="flex:1 1 180px;">
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#9CC4DD;">Explore</div>
<div style="display:flex;flex-direction:column;align-items:flex-start;margin-top:10px;">
${link('services', 'Services')}
${link('new-patients', 'New patients')}
${link('insurance', 'Insurance')}
${link('blog', 'Patient library')}
${link('sitemap', 'Site map')}
${link('accessibility', 'Accessibility')}
</div>
</div>
</div>
<div style="margin-top:44px;padding-top:22px;border-top:1px solid rgba(255,255,255,.18);display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;font:400 13px/1.5 ${MONO};color:#A9C9DE;">
<span>© ${new Date().getFullYear()} Hillcrest Dental Studio</span>
<span>Dr. Rana Skaf, DDS · Chino Hills, California</span>
</div>
</div>
</footer>`;
}

const DENTIST_LD = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  name: P.name,
  url: C.SITE_URL + '/',
  logo: C.SITE_URL + '/images/logo-512.png',
  image: C.SITE_URL + '/images/logo-512.png',
  telephone: '+1-909-927-5333',
  email: P.email,
  address: { '@type': 'PostalAddress', streetAddress: P.street, addressLocality: P.city, addressRegion: P.region, postalCode: P.zip, addressCountry: 'US' },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '18:00' }],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '133' },
  sameAs: [P.facebook, P.instagram],
};

export function layout({ page, path, meta, body, jsonLd = [], ogImage }) {
  const canonical = C.SITE_URL + path;
  const ld = [...(page === 'home' || page === 'contact' ? [DENTIST_LD] : []), ...jsonLd];
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}" />
${meta.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${canonical}" />`}
<meta property="og:type" content="${page === 'post' ? 'article' : 'website'}" />
<meta property="og:site_name" content="${P.name}" />
<meta property="og:title" content="${esc(meta.title)}" />
<meta property="og:description" content="${esc(meta.description)}" />
<meta property="og:url" content="${canonical}" />
${ogImage ? `<meta property="og:image" content="${C.SITE_URL}${ogImage}" />` : ''}
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#08405F" />
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/favicon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/site.css" />
${map(ld, (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)}
<script src="/assets/site.js" defer></script>
</head>
<body>
<div class="page-root" style="background:#FCFDFE;color:#16232E;font-family:${SANS};min-height:100%;">
${header(page)}
<main id="main" tabindex="-1" data-screen="${page}">
${body}
</main>
${footer()}
</div>
</body>
</html>
`;
}

// --- pages -------------------------------------------------------------------------

function serviceGroupsGrid() {
  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(248px,1fr));gap:1px;background:#D8E3EC;border:1px solid #D8E3EC;animation:dcIn .6s ease .12s both;margin-top:38px;">
${map(GROUPS, (g) => `<div style="background:#FCFDFE;padding:28px 26px 30px;">
<h3 style="margin:0;font:500 11.5px/1 ${MONO};letter-spacing:0.16em;text-transform:uppercase;color:#0B5C8A;">${esc(g.cat)}</h3>
<p style="font:400 15px/1.55 ${SANS};color:#4A5C6B;margin:12px 0 18px;">${esc(g.blurb)}</p>
<div style="display:flex;flex-direction:column;">
${map(g.ids, (id) => `<a href="${C.servicePath(id)}" class="hv-row" style="text-decoration:none;color:#16232E;font:400 17px/1.3 ${SANS};padding:11px 0;border-top:1px solid #EDF3F8;display:flex;justify-content:space-between;gap:12px;transition:color .2s ease,padding-left .2s ease;"><span>${esc(svcById(id).name)}</span><span aria-hidden="true" style="color:#AEC2D2;">→</span></a>`)}
</div>
</div>`)}
</div>`;
}

export function home() {
  const title = "Unhurried dental care for every stage of your family's life.";
  return `<div data-screen-label="Home">
<div style="display:flex;flex-wrap:wrap;align-items:stretch;border-bottom:1px solid #D8E3EC;">
<div style="flex:1 1 480px;min-width:300px;padding:74px 40px 66px;display:flex;flex-direction:column;justify-content:center;max-width:720px;margin-left:auto;">
<div style="font:500 11px/1 ${MONO};letter-spacing:0.16em;text-transform:uppercase;color:#0B5C8A;animation:dcUp .5s ease both;">Family dentistry · Chino Hills, CA</div>
<h1 class="hero-title" style="font:300 58px/1.05 ${SANS};letter-spacing:-0.02em;margin:20px 0 0;color:#08405F;text-wrap:pretty;animation:dcUp .55s ease .06s both;">${title}</h1>
<p style="font:400 18.5px/1.6 ${SANS};color:#4A5C6B;margin:20px 0 0;max-width:52ch;animation:dcUp .55s ease .14s both;">Dr. Rana Skaf and team have cared for Chino Valley families for over twenty years. Same-week appointments, transparent pricing, and every option explained before anything begins.</p>
<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:32px;animation:dcUp .55s ease .22s both;">
<a href="${C.pagePath('appointments')}" class="hv-btn-lift" style="display:inline-flex;align-items:center;gap:9px;background:#0B5C8A;color:#fff;padding:16px 24px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;transition:background-color .25s ease,transform .25s ease;">Request an appointment</a>
<a href="${TEL}" class="hv-outline-lift" style="display:inline-flex;align-items:center;gap:9px;background:transparent;color:#08405F;border:1px solid #D8E3EC;padding:16px 24px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;transition:border-color .25s ease,background-color .25s ease,transform .25s ease;">Call ${P.phone}</a>
</div>
<div style="display:flex;flex-wrap:wrap;gap:8px 26px;margin-top:34px;padding-top:26px;border-top:1px solid #D8E3EC;animation:dcUp .55s ease .3s both;">
${map(C.TRUST_BAR, (t) => `<div style="font:400 14.5px/1.4 ${SANS};color:#4A5C6B;">${esc(t)}</div>`)}
</div>
</div>
<div style="flex:1 1 380px;min-width:280px;position:relative;border-left:1px solid #D8E3EC;min-height:460px;overflow:hidden;animation:dcWipe .7s ease both;">
${img(C.IMAGES.hero, { sizes: '(max-width: 1000px) 100vw, 50vw', eager: true })}
</div>
</div>

<div style="background:#08405F;padding:44px 40px;">
<div style="max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;gap:28px;align-items:center;justify-content:space-between;">
<div style="flex:1 1 300px;">
<div style="font:500 11px/1 ${MONO};letter-spacing:0.16em;text-transform:uppercase;color:#9CC4DD;">Start here</div>
<h2 style="font:300 27px/1.25 ${SANS};color:#fff;margin:12px 0 0;">What brings you in?</h2>
</div>
<div style="flex:2 1 520px;display:flex;flex-wrap:wrap;gap:10px;">
${map(C.QUICK_REASONS, (q) => `<a href="${C.servicePath(q.id)}" class="hv-chip" style="text-decoration:none;color:#fff;border:1px solid rgba(255,255,255,.28);padding:13px 18px;font:400 15.5px/1 ${SANS};transition:background-color .22s ease,border-color .22s ease,transform .22s ease;">${esc(q.label)}</a>`)}
</div>
</div>
</div>

<div style="padding:78px 40px;">
<div style="max-width:1120px;margin:0 auto;">
${eyebrow('Services')}
<h2 style="font:300 38px/1.15 ${SANS};letter-spacing:-0.01em;margin:14px 0 0;color:#08405F;animation:dcUp .5s ease both;">Everything your family needs, under one roof.</h2>
<p style="font:400 17px/1.65 ${SANS};color:#4A5C6B;margin:14px 0 0;max-width:62ch;">Thirteen services grouped the way patients actually think about them — so you can find what you need without scanning a menu of twenty links.</p>
${serviceGroupsGrid()}
</div>
</div>

<div style="background:#EEF4F9;padding:78px 40px;border-top:1px solid #D8E3EC;border-bottom:1px solid #D8E3EC;">
<div style="max-width:1120px;margin:0 auto;">
${eyebrow('The difference')}
<h2 style="font:300 38px/1.15 ${SANS};letter-spacing:-0.01em;margin:14px 0 40px;color:#08405F;animation:dcUp .5s ease both;">Four things we refuse to compromise on.</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:34px;">
${map(C.DIFFERENCES, (d) => `<div>
<div style="font:500 12px/1 ${MONO};color:#4C6980;">${d.num}</div>
<h3 style="font:400 21px/1.3 ${SANS};color:#08405F;margin:14px 0 0;">${esc(d.title)}</h3>
<p style="font:400 16px/1.6 ${SANS};color:#4A5C6B;margin:10px 0 0;">${esc(d.body)}</p>
</div>`)}
</div>
</div>
</div>

<div style="padding:78px 40px;">
<div style="max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;gap:48px;align-items:center;">
<div style="flex:1 1 300px;min-width:260px;position:relative;aspect-ratio:4/5;">
${img(C.IMAGES.doctor, { sizes: '(max-width: 700px) 100vw, 420px' })}
</div>
<div style="flex:1.5 1 420px;min-width:280px;">
${eyebrow('Your dentist')}
<h2 style="font:300 36px/1.15 ${SANS};letter-spacing:-0.01em;margin:14px 0 0;color:#08405F;animation:dcUp .5s ease both;">Dr. Rana Skaf, DDS</h2>
<p style="font:400 17.5px/1.7 ${SANS};color:#4A5C6B;margin:18px 0 0;">Twenty years in dentistry, a Doctorate of Dental Surgery from Loma Linda University, and a periodontal specialization from Damascus University. Dr. Skaf has lived in Chino Valley for fifteen years and now owns and leads the practice.</p>
<p style="font:400 17.5px/1.7 ${SANS};color:#4A5C6B;margin:14px 0 0;">“Every smile tells a story. My job is to help you protect yours — with knowledge first, then treatment.”</p>
<a href="${C.pagePath('doctors')}" class="hv-outline-lift" style="display:inline-flex;align-items:center;gap:9px;margin-top:26px;color:#08405F;border:1px solid #D8E3EC;padding:15px 22px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">Read her full story</a>
</div>
</div>
</div>

<div style="background:#08405F;padding:74px 40px;">
<div style="max-width:1120px;margin:0 auto;">
<div style="display:flex;flex-wrap:wrap;gap:20px;align-items:baseline;justify-content:space-between;">
<h2 style="font:300 34px/1.15 ${SANS};color:#fff;margin:0;">133 reviews. 4.9 stars.</h2>
<a href="${C.pagePath('testimonials')}" style="color:#A9C9DE;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">All reviews →</a>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;margin-top:38px;">
${map(C.HOME_REVIEWS, (r) => `<figure style="margin:0;border-top:1px solid rgba(255,255,255,.22);padding-top:20px;animation:dcUp .55s ease both;">
<blockquote style="margin:0;"><p style="font:400 18px/1.6 ${SANS};color:#EAF2F8;margin:0;">“${esc(r.quote)}”</p></blockquote>
<figcaption style="font:500 11px/1 ${MONO};letter-spacing:0.12em;text-transform:uppercase;color:#9CC4DD;margin-top:16px;">${esc(r.name)} · Google</figcaption>
</figure>`)}
</div>
</div>
</div>

<div style="padding:78px 40px;">
<div style="max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;gap:44px;">
<div style="flex:1 1 320px;min-width:270px;">
${eyebrow('Insurance')}
<h2 style="font:300 32px/1.2 ${SANS};margin:14px 0 0;color:#08405F;">We take almost every PPO — and Denti-Cal.</h2>
<p style="font:400 17px/1.65 ${SANS};color:#4A5C6B;margin:14px 0 0;">In network with Denti-Cal, Medi-Cal and IEHP. DeltaCare and DHS accepted on the HMO side. If your plan isn't listed, one phone call usually settles it.</p>
<a href="${C.pagePath('insurance')}" style="display:inline-flex;margin-top:22px;color:#08405F;border-bottom:1px solid #AEC2D2;text-decoration:none;font:400 16.5px/1.4 ${SANS};padding-bottom:3px;">Check your coverage</a>
</div>
<div style="flex:1 1 320px;min-width:270px;">
${eyebrow('Visit us')}
<h2 style="font:300 32px/1.2 ${SANS};margin:14px 0 0;color:#08405F;">Hillcrest Professional Center, Grand Ave.</h2>
<p style="font:400 17px/1.65 ${SANS};color:#4A5C6B;margin:14px 0 0;">Between Chino Hills Parkway and Peyton Drive, with free parking directly in front of the door. <a href="${P.mapsUrl}" target="_blank" rel="noopener" style="color:#08405F;">Get directions</a></p>
<div style="margin-top:22px;position:relative;height:190px;">
${mapFrame('Map — 2130 Grand Ave H, Chino Hills')}
</div>
</div>
</div>
</div>

<div style="background:#EEF4F9;padding:74px 40px;border-top:1px solid #D8E3EC;">
<div style="max-width:1120px;margin:0 auto;">
<div style="display:flex;flex-wrap:wrap;gap:20px;align-items:baseline;justify-content:space-between;">
<h2 style="font:300 34px/1.15 ${SANS};margin:0;color:#08405F;">Answers before you call</h2>
<a href="${C.pagePath('blog')}" style="color:#0B5C8A;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">Patient library →</a>
</div>
<div style="margin-top:32px;border-top:1px solid #D8E3EC;">
${map(C.HOME_FAQS, (f) => `<div class="hv-faq" style="border-bottom:1px solid #D8E3EC;padding:22px 0;display:flex;flex-wrap:wrap;gap:8px 40px;transition:background-color .2s ease;">
<h3 style="flex:1 1 240px;font:400 19px/1.35 ${SANS};color:#08405F;margin:0;">${esc(f.q)}</h3>
<p style="flex:1.6 1 320px;font:400 16.5px/1.65 ${SANS};color:#4A5C6B;margin:0;">${esc(f.a)}</p>
</div>`)}
</div>
</div>
</div>
</div>`;
}

export function about() {
  return `<div data-screen-label="Who We Are">
${pageIntro({ label: 'Who we are', title: 'A neighborhood practice that still runs on relationships.', lede: null })}
<div style="padding:0 40px;"><div style="max-width:820px;margin:0 auto;">
<p style="font:400 19px/1.7 ${SANS};color:#4A5C6B;margin:22px 0 0;">Hillcrest Dental Studio has served Chino Hills families since 2010. We are deliberately a general practice with a wide range — cleanings and sealants for a seven-year-old, implants and dentures for her grandfather — so one relationship covers the whole household.</p>
<p style="font:400 19px/1.7 ${SANS};color:#4A5C6B;margin:16px 0 0;">What we don't do is rush. Appointments are scheduled with room to talk. Treatment plans come with the cost written down before you agree to anything. And nobody on our team is paid to sell you dentistry.</p>
</div></div>
<div style="padding:52px 40px 0;">
<div style="max-width:1120px;margin:0 auto;position:relative;height:340px;">
${img(C.IMAGES.aboutWide, { sizes: '(max-width: 1200px) 100vw, 1120px' })}
</div>
</div>
<div style="padding:66px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1px;background:#D8E3EC;border:1px solid #D8E3EC;animation:dcIn .6s ease .12s both;">
${map(C.ABOUT_STATS, (s) => `<div style="background:#FCFDFE;padding:30px 26px;">
<div style="font:300 40px/1 ${SANS};color:#0B5C8A;">${s.n}</div>
<div style="font:400 16px/1.5 ${SANS};color:#4A5C6B;margin-top:12px;">${esc(s.l)}</div>
</div>`)}
</div>
</div>
</div>`;
}

export function doctors() {
  return `<div data-screen-label="Meet Dr. Skaf">
<div style="padding:66px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;gap:52px;">
<div style="flex:1 1 300px;min-width:260px;">
<div style="position:sticky;top:110px;aspect-ratio:3/4;">
${img(C.IMAGES.doctor, { sizes: '(max-width: 700px) 100vw, 420px', eager: true })}
</div>
</div>
<div style="flex:1.6 1 440px;min-width:280px;">
${eyebrow('Owner &amp; lead dentist')}
<h1 style="font:300 46px/1.1 ${SANS};letter-spacing:-0.02em;margin:18px 0 0;color:#08405F;animation:dcUp .5s ease .05s both;">Dr. Rana Skaf, DDS</h1>
<p style="font:400 19px/1.7 ${SANS};color:#4A5C6B;margin:22px 0 0;">For more than twenty years, dentistry has been my passion and my purpose. I earned my Doctorate of Dental Surgery from Loma Linda University, after completing my dental degree and periodontal specialization at Damascus University.</p>
<p style="font:400 19px/1.7 ${SANS};color:#4A5C6B;margin:16px 0 0;">I've cared for patients at every stage of life, and the thing that has never changed is how I work: gentle communication, thoughtful treatment planning, and a genuine commitment to each person's comfort and long-term oral health.</p>
<p style="font:400 19px/1.7 ${SANS};color:#4A5C6B;margin:16px 0 0;">My family and I have called Chino Valley home for more than fifteen years. When I'm not at the office you'll find me at local school events, in the parks with my husband and our three children, or talking to neighbors at community gatherings.</p>
<p style="font:400 19px/1.7 ${SANS};color:#4A5C6B;margin:16px 0 0;">Hillcrest has always been known for its caring team and patient-centered values. I'm proud to carry that legacy forward.</p>
<dl style="margin:36px 0 0;border-top:1px solid #D8E3EC;">
${map(C.CREDENTIALS, (c) => `<div style="display:flex;gap:24px;padding:16px 0;border-bottom:1px solid #EDF3F8;">
<dt style="flex:0 0 140px;font:500 11.5px/1.4 ${MONO};letter-spacing:0.12em;text-transform:uppercase;color:#4C6980;">${esc(c.k)}</dt>
<dd style="margin:0;font:400 16.5px/1.5 ${SANS};color:#16232E;">${esc(c.v)}</dd>
</div>`)}
</dl>
${btnPrimary(C.pagePath('appointments'), 'Book with Dr. Skaf', 'margin-top:32px;')}
</div>
</div>
</div>
</div>`;
}

export function difference() {
  return `<div data-screen-label="The Difference">
${pageIntro({ label: 'The difference', title: 'Why patients drive past four other offices to get here.' })}
<div style="padding:56px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;">
${map(C.DIFFERENCES, (d) => `<div style="display:flex;flex-wrap:wrap;gap:28px 48px;padding:38px 0;border-top:1px solid #D8E3EC;">
<div aria-hidden="true" style="flex:0 0 auto;font:300 44px/1 ${SANS};color:#AEC2D2;">${d.num}</div>
<div style="flex:1 1 380px;min-width:260px;">
<h2 style="font:400 27px/1.25 ${SANS};color:#08405F;margin:0;">${esc(d.title)}</h2>
<p style="font:400 17.5px/1.7 ${SANS};color:#4A5C6B;margin:14px 0 0;max-width:62ch;">${esc(d.long)}</p>
</div>
</div>`)}
</div>
</div>
</div>`;
}

export function gallery() {
  return `<div data-screen-label="Gallery">
${pageIntro({ label: 'Gallery', title: 'See the office before you sit in the chair.', wrap: false, lede: 'Nine rooms, a sterilization suite you can look into, and a TV in every operatory. Photos below; drop by any weekday for the real thing.', ledeSize: 18.5, ledeMargin: 20 })}
<div style="padding:52px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">
${map(C.GALLERY_SHOTS, (g) => `<figure style="margin:0;">
<div style="position:relative;aspect-ratio:4/3;">
${img(C.IMAGES.gallery[g.sid], { sizes: '(max-width: 700px) 100vw, 360px' })}
</div>
<figcaption style="font:400 15.5px/1.5 ${SANS};color:#4A5C6B;margin-top:10px;">${esc(g.caption)}</figcaption>
</figure>`)}
</div>
</div>
</div>`;
}

export function testimonials() {
  return `<div data-screen-label="Reviews">
${pageIntro({ label: 'Patient reviews', title: '133 Google reviews, unedited.', wrap: false })}
<div style="padding:48px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px;background:#D8E3EC;border:1px solid #D8E3EC;animation:dcIn .6s ease .12s both;">
${map(C.ALL_REVIEWS, (r) => `<figure style="margin:0;background:#FCFDFE;padding:30px 28px;">
<div role="img" aria-label="5 out of 5 stars" style="font:500 12px/1 ${MONO};color:#0B5C8A;letter-spacing:0.1em;">★★★★★</div>
<blockquote style="margin:0;"><p style="font:400 17.5px/1.65 ${SANS};color:#16232E;margin:16px 0 0;">“${esc(r.quote)}”</p></blockquote>
<figcaption style="font:500 11.5px/1 ${MONO};letter-spacing:0.12em;text-transform:uppercase;color:#4C6980;margin-top:18px;">${esc(r.name)} · Google</figcaption>
</figure>`)}
</div>
<div style="max-width:1120px;margin:34px auto 0;">
${btnPrimary(C.pagePath('appointments'), 'Become a patient')}
</div>
</div>
</div>`;
}

export function newPatients() {
  const openLink = (href, label) =>
    `<a href="${href}" class="hv-soft" style="display:flex;align-items:center;justify-content:space-between;gap:16px;border:1px solid #D8E3EC;padding:16px 20px;text-decoration:none;color:#08405F;font:400 16.5px/1 ${SANS};transition:border-color .25s ease,background-color .25s ease;"><span>${label}</span><span style="font:500 11.5px/1 ${MONO};letter-spacing:0.1em;">OPEN</span></a>`;
  return `<div data-screen-label="New Patients">
${pageIntro({ label: 'New patients', title: 'Your first visit, described in full so nothing is a surprise.', lede: "Plan on about seventy-five minutes. You'll meet Dr. Skaf, get a full set of digital X-rays, and leave with a written plan and its cost — not a treatment you didn't agree to." })}
<div style="padding:56px 40px 0;">
<ol style="list-style:none;padding:0;max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1px;background:#D8E3EC;border:1px solid #D8E3EC;animation:dcIn .6s ease .12s both;">
${map(C.FIRST_VISIT, (v) => `<li style="background:#FCFDFE;padding:30px 26px;">
<div style="font:500 11px/1 ${MONO};letter-spacing:0.14em;color:#4C6980;">${v.step}</div>
<h2 style="font:400 20px/1.3 ${SANS};color:#08405F;margin:14px 0 0;">${esc(v.title)}</h2>
<p style="font:400 15.5px/1.6 ${SANS};color:#4A5C6B;margin:10px 0 0;">${esc(v.body)}</p>
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.12em;text-transform:uppercase;color:#0B5C8A;margin-top:16px;">${v.mins}</div>
</li>`)}
</ol>
</div>
<div style="padding:66px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;gap:44px;">
<div style="flex:1 1 320px;min-width:270px;">
<h2 style="font:300 30px/1.2 ${SANS};margin:0;color:#08405F;">Bring these four things</h2>
<ul style="list-style:none;padding:0;margin:20px 0 0;border-top:1px solid #D8E3EC;">
${map(C.BRING_LIST, (b) => `<li style="padding:15px 0;border-bottom:1px solid #EDF3F8;font:400 17px/1.5 ${SANS};color:#16232E;">${esc(b)}</li>`)}
</ul>
</div>
<div style="flex:1 1 320px;min-width:270px;">
<h2 style="font:300 30px/1.2 ${SANS};margin:0;color:#08405F;">Save time — fill forms at home</h2>
<p style="font:400 17px/1.65 ${SANS};color:#4A5C6B;margin:14px 0 0;">Complete the health history and consent online and you'll walk straight into the operatory.</p>
<div style="display:flex;flex-direction:column;gap:10px;margin-top:22px;">
${openLink(C.pagePath('forms') + '#health-history', 'Patient health history')}
${openLink(C.pagePath('forms') + '#hipaa', 'HIPAA &amp; consent to treat')}
${openLink(C.pagePath('insurance'), 'Insurance &amp; payment options')}
</div>
</div>
</div>
</div>
</div>`;
}

export function insurance() {
  return `<div data-screen-label="Insurance">
${pageIntro({ label: 'Insurance &amp; payment', title: 'Coverage, in plain language.', wrap: false })}
<div style="padding:52px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;">
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:1px;background:#D8E3EC;border:1px solid #D8E3EC;animation:dcIn .6s ease .12s both;">
${map(C.COVERAGE, (c) => `<div style="background:#FCFDFE;padding:32px 28px;">
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#0B5C8A;">${c.kind}</div>
<h2 style="font:400 23px/1.25 ${SANS};color:#08405F;margin:14px 0 0;">${esc(c.title)}</h2>
<p style="font:400 16px/1.6 ${SANS};color:#4A5C6B;margin:12px 0 0;">${esc(c.body)}</p>
</div>`)}
</div>
<div style="margin-top:44px;background:#EEF4F9;border:1px solid #D8E3EC;padding:36px 32px;display:flex;flex-wrap:wrap;gap:28px;align-items:center;justify-content:space-between;">
<div style="flex:1 1 340px;">
<h2 style="font:400 25px/1.3 ${SANS};color:#08405F;margin:0;">Not sure whether we're in network?</h2>
<p style="font:400 16.5px/1.6 ${SANS};color:#4A5C6B;margin:10px 0 0;">Many plans sit under an umbrella policy with a major carrier. Call with your member ID and we'll check while you're on the line.</p>
</div>
${btnPrimary(TEL, `Call ${P.phone}`)}
</div>
<div style="margin-top:44px;">
<h2 style="font:300 28px/1.2 ${SANS};margin:0;color:#08405F;">No insurance?</h2>
<p style="font:400 17px/1.65 ${SANS};color:#4A5C6B;margin:14px 0 0;max-width:62ch;">Ask about our in-house membership: two cleanings, two exams, annual X-rays and a standing discount on treatment for a flat monthly fee. Third-party financing is available for larger plans.</p>
</div>
</div>
</div>
</div>`;
}

export function services() {
  return `<div data-screen-label="Services">
${pageIntro({ label: 'Services', title: 'Thirteen services, grouped the way patients ask for them.' })}
<div style="padding:52px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;">
${map(GROUPS, (g) => `<section style="padding:38px 0;border-top:1px solid #D8E3EC;">
<div style="display:flex;flex-wrap:wrap;gap:12px 40px;align-items:baseline;">
<h2 style="margin:0;flex:0 0 200px;font:500 11px/1.4 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#0B5C8A;">${esc(g.cat)}</h2>
<p style="flex:1 1 320px;font:400 17px/1.6 ${SANS};color:#4A5C6B;margin:0;">${esc(g.blurb)}</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:18px;margin-top:26px;">
${map(g.ids.map(svcById), (s) => `<a href="${C.servicePath(s.id)}" class="hv-card" style="text-decoration:none;border:1px solid #D8E3EC;padding:24px 22px;display:block;background:#fff;transition:border-color .25s ease,transform .25s ease,box-shadow .25s ease;">
<h3 style="margin:0;font:400 21px/1.25 ${SANS};color:#08405F;">${esc(s.name)}</h3>
<p style="font:400 15.5px/1.6 ${SANS};color:#4A5C6B;margin:10px 0 0;">${esc(s.dek)}</p>
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.12em;text-transform:uppercase;color:#0B5C8A;margin-top:16px;">Read more →</div>
</a>`)}
</div>
</section>`)}
</div>
</div>
</div>`;
}

function leadForm({ kind, service, fields, button, success, inputBg }) {
  const input = (type, name, placeholder, required) =>
    `<label style="display:block;"><span class="sr-only">${placeholder}</span><input type="${type}" name="${name}" placeholder="${placeholder}"${required ? ' required' : ''} autocomplete="${name === 'name' ? 'name' : name === 'phone' ? 'tel' : 'off'}" style="border:1px solid #D8E3EC;background:${inputBg};padding:${fields.pad};font-size:16px;color:#16232E;width:100%;" /></label>`;
  return `<form method="post" action="/api/messages" data-lead-form data-success="${esc(success)}" novalidate>
<input type="hidden" name="kind" value="${kind}" />
${service ? `<input type="hidden" name="service" value="${esc(service)}" />` : ''}
${honeypot}
<div style="display:flex;flex-direction:column;gap:${fields.gap}px;">
${input('text', 'name', fields.namePh, true)}
${input('tel', 'phone', 'Phone', true)}
<label style="display:block;"><span class="sr-only">${fields.notePh}</span><textarea name="note" placeholder="${fields.notePh}" rows="${fields.rows}"${fields.noteRequired ? ' required' : ''} style="border:1px solid #D8E3EC;background:${inputBg};padding:${fields.pad};font-size:16px;color:#16232E;width:100%;resize:vertical;display:block;"></textarea></label>
<button type="submit" class="hv-btn" style="background:#0B5C8A;color:#fff;border:0;padding:16px 20px;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;">${button}</button>
</div>
<div class="form-msg" data-form-msg role="status" aria-live="polite" hidden></div>
</form>`;
}

export function service(svc) {
  const related = SERVICES.filter((s) => s.cat === svc.cat && s.id !== svc.id).slice(0, 3);
  return `<div data-screen-label="Service detail">
<nav aria-label="Breadcrumb" style="padding:26px 40px 0;">
<div style="max-width:1120px;margin:0 auto;font:400 14.5px/1 ${SANS};color:#4C6980;display:flex;gap:10px;flex-wrap:wrap;">
<a href="/" style="color:#4C6980;text-decoration:none;white-space:nowrap;flex:0 0 auto;">Home</a><span aria-hidden="true" style="flex:0 0 auto;">/</span>
<a href="${C.pagePath('services')}" style="color:#4C6980;text-decoration:none;white-space:nowrap;flex:0 0 auto;">Services</a><span aria-hidden="true" style="flex:0 0 auto;">/</span>
<span aria-current="page" style="color:#4A5C6B;white-space:nowrap;flex:0 0 auto;">${esc(svc.name)}</span>
</div>
</nav>
<div style="padding:34px 40px 0;">
<div style="max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;gap:48px;">
<article style="flex:1.6 1 460px;min-width:280px;">
${eyebrow(esc(svc.cat))}
<h1 style="font:300 44px/1.1 ${SANS};letter-spacing:-0.02em;margin:16px 0 0;color:#08405F;text-wrap:pretty;animation:dcUp .5s ease .05s both;">${esc(svc.name)}</h1>
<p style="font:400 19.5px/1.65 ${SANS};color:#4A5C6B;margin:20px 0 0;max-width:58ch;">${esc(svc.dek)}</p>
<dl style="display:flex;flex-wrap:wrap;gap:1px;background:#D8E3EC;border:1px solid #D8E3EC;animation:dcIn .6s ease .12s both;margin:32px 0 0;">
${map(svc.facts, (f) => `<div style="flex:1 1 150px;background:#FCFDFE;padding:18px 20px;">
<dt style="font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#4C6980;">${esc(f.k)}</dt>
<dd style="margin:9px 0 0;font:400 17px/1.3 ${SANS};color:#16232E;">${esc(f.v)}</dd>
</div>`)}
</dl>
<div style="position:relative;height:300px;margin-top:32px;">
${img(C.IMAGES.services[svc.id], { sizes: '(max-width: 1000px) 100vw, 680px', eager: true })}
</div>
${map(svc.paras, (p) => `<p style="font:400 18px/1.75 ${SANS};color:#4A5C6B;margin:24px 0 0;max-width:64ch;">${esc(p)}</p>`)}
<div style="margin-top:38px;background:#EEF4F9;border:1px solid #D8E3EC;padding:30px 28px;">
<h2 style="margin:0;font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#0B5C8A;">What's included</h2>
<ul style="list-style:none;padding:0;margin:16px 0 0;">
${map(svc.includes, (i) => `<li style="display:flex;gap:14px;padding:11px 0;border-bottom:1px solid #DCE6EF;font:400 16.5px/1.5 ${SANS};color:#16232E;"><span aria-hidden="true" style="color:#0B5C8A;">—</span><span>${esc(i)}</span></li>`)}
</ul>
</div>
<div style="margin-top:44px;">
<h2 style="font:300 28px/1.2 ${SANS};margin:0;color:#08405F;">Common questions</h2>
<div style="margin-top:20px;border-top:1px solid #D8E3EC;">
${map(svc.faqs, (f) => `<div style="padding:20px 0;border-bottom:1px solid #D8E3EC;">
<h3 style="margin:0;font:400 19px/1.35 ${SANS};color:#08405F;">${esc(f.q)}</h3>
<p style="font:400 16.5px/1.65 ${SANS};color:#4A5C6B;margin:10px 0 0;max-width:64ch;">${esc(f.a)}</p>
</div>`)}
</div>
</div>
</article>
<aside style="flex:1 1 300px;min-width:265px;">
<div style="border:1px solid #D8E3EC;background:#fff;padding:28px 26px;position:sticky;top:110px;animation:dcUp .5s ease .1s both;">
<h2 style="margin:0;font:400 23px/1.25 ${SANS};color:#08405F;">Ask about ${esc(svc.short)}</h2>
<p style="font:400 15.5px/1.6 ${SANS};color:#4A5C6B;margin:10px 0 20px;">Send two lines and we'll call you back the same business day.</p>
${leadForm({ kind: 'callback', service: svc.name, button: 'Request a callback', success: "Thank you — we'll call you back today.", inputBg: '#FCFDFE', fields: { pad: '14px 14px', gap: 10, rows: 3, namePh: 'Your name', notePh: "What's going on? (optional)", noteRequired: false } })}
<div style="margin-top:22px;padding-top:20px;border-top:1px solid #EDF3F8;font:400 15px/1.6 ${SANS};color:#4A5C6B;">Prefer to talk now? <a href="${TEL}" style="color:#08405F;">${P.phone}</a></div>
</div>
</aside>
</div>
</div>
<div style="padding:70px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;border-top:1px solid #D8E3EC;padding-top:34px;">
${eyebrow('Related')}
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px;margin-top:22px;">
${map(related, (s) => `<a href="${C.servicePath(s.id)}" class="hv-card-flat" style="text-decoration:none;border:1px solid #D8E3EC;padding:22px 20px;display:block;transition:border-color .25s ease,transform .25s ease;">
<div style="font:400 19px/1.25 ${SANS};color:#08405F;">${esc(s.name)}</div>
<p style="font:400 15px/1.55 ${SANS};color:#4A5C6B;margin:9px 0 0;">${esc(s.dek)}</p>
</a>`)}
</div>
</div>
</div>
</div>`;
}

export function appointments() {
  const steps = [['1', 'Reason'], ['2', 'Time'], ['3', 'Details'], ['4', 'Confirm']];
  const backBtn = `<button type="button" data-bk-back style="border:1px solid #D8E3EC;background:transparent;color:#08405F;padding:15px 22px;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;">Back</button>`;
  const field = (label, type, name, autocomplete, required) => `<label style="display:block;">
<span style="font:500 11.5px/1 ${MONO};letter-spacing:0.12em;text-transform:uppercase;color:#4C6980;">${label}</span>
<input type="${type}" name="${name}" autocomplete="${autocomplete}"${required ? ' required' : ''} style="display:block;width:100%;margin-top:8px;border:1px solid #D8E3EC;background:#FCFDFE;padding:14px;font-size:16px;color:#16232E;" />
</label>`;
  const pane = 'role="group"';

  return `<div data-screen-label="Appointments">
<div style="padding:66px 40px 0;">
<div style="max-width:1120px;margin:0 auto;">
${eyebrow('Appointments')}
<h1 style="font:300 44px/1.1 ${SANS};letter-spacing:-0.02em;margin:18px 0 0;color:#08405F;animation:dcUp .5s ease .05s both;">Request a visit in four steps.</h1>
<ol aria-label="Progress" style="list-style:none;padding:0 0 6px;margin:30px 0 0;display:flex;flex-wrap:wrap;gap:20px;">
${map(steps, ([n, label], i) => `<li data-bk-indicator="${n}"${i === 0 ? ' aria-current="step"' : ''} style="display:flex;align-items:center;gap:10px;">
<div class="bk-step-dot" style="width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font:500 11px/1 ${MONO};background:${i === 0 ? '#0B5C8A' : 'transparent'};color:${i === 0 ? '#fff' : '#0B5C8A'};border:1px solid #0B5C8A;">${n}</div>
<div data-bk-label style="font:400 15.5px/1 ${SANS};color:${i === 0 ? '#08405F' : '#4C6980'};">${label}</div>
</li>`)}
</ol>
</div>
</div>
<div style="padding:34px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;gap:40px;">
<form data-booking method="post" action="/api/appointments" novalidate style="flex:1.7 1 460px;min-width:280px;border:1px solid #D8E3EC;background:#fff;padding:34px 32px;animation:dcUp .45s ease both;">
${honeypot}
<input type="hidden" name="reason" value="" />
<input type="hidden" name="day" value="" />
<input type="hidden" name="time" value="" />

<div data-bk-step="1" ${pane} aria-labelledby="bk1-title">
<h2 id="bk1-title" tabindex="-1" style="margin:0;font:400 26px/1.25 ${SANS};color:#08405F;">What do you need?</h2>
<p style="font:400 16px/1.6 ${SANS};color:#4A5C6B;margin:10px 0 24px;">Pick the closest match. We'll sort out the details when we call to confirm.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
${map(C.BOOKING_REASONS, (r) => `<button type="button" class="pill hv-border-lift" data-bk-reason="${esc(r.label)}" aria-pressed="false" style="text-align:left;border:1px solid #D8E3EC;background:#FCFDFE;padding:18px 18px;cursor:pointer;">
<div style="font:400 17.5px/1.25 ${SANS};color:#08405F;">${esc(r.label)}</div>
<div style="font:400 14px/1.4 ${SANS};color:#4A5C6B;margin-top:6px;">${esc(r.note)}</div>
</button>`)}
</div>
<div style="margin-top:26px;padding:18px 20px;background:#EEF4F9;border:1px solid #D8E3EC;font:400 16px/1.6 ${SANS};color:#4A5C6B;">In pain right now? Don't use this form — call <a href="${TEL}" style="color:#08405F;">${P.phone}</a> and we'll find you room today.</div>
</div>

<div data-bk-step="2" ${pane} aria-labelledby="bk2-title" hidden>
<h2 id="bk2-title" tabindex="-1" style="margin:0;font:400 26px/1.25 ${SANS};color:#08405F;">When works for you?</h2>
<p style="font:400 16px/1.6 ${SANS};color:#4A5C6B;margin:10px 0 24px;">Weekdays, 10:00 to 6:00. Choose a day and a window — availability is confirmed by phone.</p>
<div data-bk-days style="display:flex;flex-wrap:wrap;gap:8px;"></div>
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#0B5C8A;margin:30px 0 12px;">Time of day</div>
<div style="display:flex;flex-wrap:wrap;gap:8px;">
${map(C.BOOKING_TIMES, (t) => `<button type="button" class="pill hv-border" data-bk-time="${t}" aria-pressed="false" style="border:1px solid #D8E3EC;background:#FCFDFE;padding:14px 20px;cursor:pointer;font:400 16.5px/1 ${SANS};color:#08405F;">${t}</button>`)}
</div>
<div style="display:flex;gap:10px;margin-top:32px;">
${backBtn}
<button type="button" data-bk-next style="border:0;background:#0B5C8A;color:#fff;padding:15px 24px;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;">Continue</button>
</div>
</div>

<div data-bk-step="3" ${pane} aria-labelledby="bk3-title" hidden>
<h2 id="bk3-title" tabindex="-1" style="margin:0;font:400 26px/1.25 ${SANS};color:#08405F;">How do we reach you?</h2>
<p style="font:400 16px/1.6 ${SANS};color:#4A5C6B;margin:10px 0 24px;">A member of our staff confirms every request by phone. Please don't include health details here.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;">
${field('Full name', 'text', 'name', 'name', true)}
${field('Phone', 'tel', 'phone', 'tel', true)}
${field('Email', 'email', 'email', 'email', false)}
${field('Insurance (optional)', 'text', 'insurance', 'off', false)}
</div>
<div class="form-msg is-error" data-bk-error role="alert" hidden></div>
<div style="display:flex;gap:10px;margin-top:32px;">
${backBtn}
<button type="submit" data-bk-submit class="hv-btn" style="border:0;background:#0B5C8A;color:#fff;padding:15px 24px;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;">Send request</button>
</div>
</div>

<div data-bk-step="4" ${pane} aria-labelledby="bk4-title" hidden>
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#0B5C8A;">Request received</div>
<h2 id="bk4-title" tabindex="-1" style="font:300 32px/1.2 ${SANS};color:#08405F;margin:14px 0 0;animation:dcUp .5s ease .05s both;">Thank you, <span data-bk-out="name">friend</span>.</h2>
<p style="font:400 17px/1.7 ${SANS};color:#4A5C6B;margin:14px 0 0;">We'll call <span data-bk-out="phone">the number you gave us</span> within one business day to confirm. Nothing is booked until you hear from us.</p>
<dl style="margin:26px 0 0;border-top:1px solid #D8E3EC;">
${map([['Reason', 'reason'], ['Preferred day', 'day'], ['Time of day', 'time'], ['Insurance', 'insurance']], ([k, key]) => `<div style="display:flex;gap:24px;padding:14px 0;border-bottom:1px solid #EDF3F8;">
<dt style="flex:0 0 130px;font:500 11.5px/1.4 ${MONO};letter-spacing:0.12em;text-transform:uppercase;color:#4C6980;">${k}</dt>
<dd data-bk-summary="${key}" style="margin:0;font:400 16.5px/1.4 ${SANS};color:#16232E;"></dd>
</div>`)}
</dl>
<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:30px;">
<a href="${C.pagePath('forms')}" class="hv-btn-lift" style="background:#0B5C8A;color:#fff;padding:15px 22px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;transition:background-color .25s ease,transform .25s ease;">Fill forms now</a>
<button type="button" data-bk-reset style="border:1px solid #D8E3EC;background:transparent;color:#08405F;padding:15px 22px;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;">New request</button>
</div>
</div>
</form>
<aside style="flex:1 1 280px;min-width:250px;">
<div style="border:1px solid #D8E3EC;padding:26px 24px;">
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#0B5C8A;">Faster options</div>
<h2 style="font:400 20px/1.3 ${SANS};color:#08405F;margin:14px 0 0;">Call or text instead</h2>
<p style="font:400 15.5px/1.6 ${SANS};color:#4A5C6B;margin:10px 0 18px;">The front desk answers Monday to Friday, 10:00–6:00.</p>
<a href="${TEL}" class="hv-btn" style="display:block;text-align:center;background:#0B5C8A;color:#fff;padding:15px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">Call ${P.phone}</a>
<a href="${SMS}" class="hv-border" style="display:block;text-align:center;margin-top:8px;border:1px solid #D8E3EC;color:#08405F;padding:15px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">Text us</a>
</div>
<div style="border:1px solid #D8E3EC;padding:26px 24px;margin-top:16px;">
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#0B5C8A;">Office hours</div>
<div style="margin-top:14px;">
${map(C.HOURS, (h) => `<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 16px;padding:9px 0;border-bottom:1px solid #EDF3F8;font:400 16px/1.4 ${SANS};color:#16232E;"><span style="white-space:nowrap;flex:0 0 auto;">${h.d}</span><span style="color:#4A5C6B;white-space:nowrap;flex:0 0 auto;">${h.t}</span></div>`)}
</div>
</div>
</aside>
</div>
</div>
</div>`;
}

export function contact() {
  return `<div data-screen-label="Contact">
${pageIntro({ label: 'Contact', title: 'Grand Ave, between Chino Hills Pkwy and Peyton.', width: 1120, wrap: false })}
<div style="padding:44px 40px 0;">
<div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1px;background:#D8E3EC;border:1px solid #D8E3EC;animation:dcIn .6s ease .12s both;">
<div style="background:#FCFDFE;padding:28px 26px;">
<h2 style="margin:0;font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#4C6980;">Address</h2>
<address style="font:400 18px/1.5 ${SANS};font-style:normal;color:#16232E;margin-top:12px;">${P.street}<br />${P.city}, ${P.region} ${P.zip}</address>
<div style="font:400 15px/1.5 ${SANS};color:#4A5C6B;margin-top:10px;">Free parking in front of the door. <a href="${P.mapsUrl}" target="_blank" rel="noopener" style="color:#08405F;">Get directions</a></div>
</div>
<div style="background:#FCFDFE;padding:28px 26px;">
<h2 style="margin:0;font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#4C6980;">Phone &amp; email</h2>
<div style="font:400 18px/1.5 ${SANS};margin-top:12px;"><a href="${TEL}" style="color:#08405F;text-decoration:none;">${P.phone}</a></div>
<div style="font:400 16px/1.5 ${SANS};margin-top:6px;"><a href="mailto:${P.email}" style="color:#4A5C6B;">${P.email}</a></div>
</div>
<div style="background:#FCFDFE;padding:28px 26px;">
<h2 style="margin:0;font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#4C6980;">Hours</h2>
<div style="margin-top:12px;">
${hoursRows('7px 0', '15.5px/1.4', '#16232E', '#4A5C6B')}
</div>
</div>
</div>
</div>
<div style="padding:44px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;gap:40px;">
<div style="flex:1.2 1 380px;min-width:270px;position:relative;min-height:380px;">
${mapFrame('Map — Hillcrest Professional Center, Grand Ave')}
</div>
<div style="flex:1 1 320px;min-width:270px;">
<h2 style="font:300 30px/1.2 ${SANS};margin:0;color:#08405F;">Send a message</h2>
<p style="font:400 16px/1.6 ${SANS};color:#4A5C6B;margin:12px 0 22px;">General questions only, please — no personal health information.</p>
${leadForm({ kind: 'contact', button: 'Send message', success: 'Message sent — we reply within one business day.', inputBg: '#fff', fields: { pad: '15px', gap: 12, rows: 5, namePh: 'Name', notePh: 'How can we help?', noteRequired: true } })}
</div>
</div>
</div>
</div>`;
}

export function blog() {
  return `<div data-screen-label="Learn">
${pageIntro({ label: 'Patient library', title: 'Straight answers, written by the people who treat you.', lede: 'Six topics, organized so you can find the one that matches your situation instead of scrolling a reverse-chronological feed.', ledeSize: 18.5, ledeMargin: 20 })}
<div style="padding:44px 40px 0;">
<div role="toolbar" aria-label="Filter by topic" style="max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;gap:8px;">
${map(TOPICS, (t, i) => `<button type="button" class="topic hv-border${i === 0 ? ' is-on' : ''}" data-topic="${esc(t)}" aria-pressed="${i === 0}" style="border:1px solid #D8E3EC;background:#FCFDFE;color:#08405F;padding:11px 16px;font:400 15.5px/1 ${SANS};cursor:pointer;">${esc(t)}</button>`)}
</div>
</div>
<div style="padding:34px 40px 78px;">
<div data-post-grid style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:1px;background:#D8E3EC;border:1px solid #D8E3EC;animation:dcIn .6s ease .12s both;">
${map(POSTS, (p) => `<a href="${C.postPath(p.id)}" data-post-topic="${esc(p.topic)}" class="hv-tint" style="text-decoration:none;background:#FCFDFE;padding:0 0 30px;display:block;transition:background-color .25s ease;">
<div style="position:relative;height:170px;">
${img(C.IMAGES.posts[p.id], { sizes: '(max-width: 700px) 100vw, 370px' })}
</div>
<div style="font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#0B5C8A;margin:26px 28px 0;">${esc(p.topic)}</div>
<h2 style="font:400 22px/1.3 ${SANS};color:#08405F;margin:14px 28px 0;text-wrap:pretty;">${esc(p.title)}</h2>
<p style="font:400 16px/1.6 ${SANS};color:#4A5C6B;margin:10px 28px 0;">${esc(p.dek)}</p>
<div style="font:400 12px/1 ${MONO};color:#4C6980;margin:18px 28px 0;">${p.mins} min read · ${p.date}</div>
</a>`)}
</div>
</div>
</div>`;
}

export function post(p) {
  const related = POSTS.filter((x) => x.topic === p.topic && x.id !== p.id).concat(POSTS.filter((x) => x.topic !== p.topic)).slice(0, 2);
  return `<div data-screen-label="Article">
<nav aria-label="Breadcrumb" style="padding:26px 40px 0;">
<div style="max-width:760px;margin:0 auto;font:400 14.5px/1 ${SANS};color:#4C6980;display:flex;gap:10px;flex-wrap:wrap;">
<a href="${C.pagePath('blog')}" style="color:#4C6980;text-decoration:none;white-space:nowrap;flex:0 0 auto;">Patient library</a><span aria-hidden="true" style="flex:0 0 auto;">/</span><a href="${C.pagePath('blog')}?topic=${encodeURIComponent(p.topic)}" style="color:#4A5C6B;text-decoration:none;white-space:nowrap;flex:0 0 auto;">${esc(p.topic)}</a>
</div>
</nav>
<article style="padding:30px 40px 0;">
<div style="max-width:760px;margin:0 auto;">
${eyebrow(esc(p.topic))}
<h1 style="font:300 42px/1.12 ${SANS};letter-spacing:-0.02em;margin:18px 0 0;color:#08405F;animation:dcUp .5s ease .05s both;text-wrap:pretty;">${esc(p.title)}</h1>
<p style="font:400 20px/1.6 ${SANS};color:#4A5C6B;margin:18px 0 0;font-style:italic;">${esc(p.dek)}</p>
<div style="font:400 12px/1 ${MONO};color:#4C6980;margin-top:22px;padding-bottom:26px;border-bottom:1px solid #D8E3EC;">${p.mins} min read · ${p.date} · Reviewed by Dr. Rana Skaf, DDS</div>
<div style="position:relative;height:340px;margin-top:30px;">
${img(C.IMAGES.posts[p.id], { sizes: '(max-width: 840px) 100vw, 760px', eager: true })}
</div>
${map(p.sections, (s) => `<section>
<h2 style="font:400 27px/1.25 ${SANS};color:#08405F;margin:38px 0 0;animation:dcUp .5s ease both;">${esc(s.h)}</h2>
<p style="font:400 18.5px/1.8 ${SANS};color:#33454F;margin:14px 0 0;">${esc(s.p)}</p>
</section>`)}
<aside style="margin-top:44px;background:#EEF4F9;border:1px solid #D8E3EC;padding:30px 28px;">
<h2 style="margin:0;font:400 23px/1.3 ${SANS};color:#08405F;">${esc(p.ctaTitle)}</h2>
<p style="font:400 16.5px/1.6 ${SANS};color:#4A5C6B;margin:10px 0 20px;">Dr. Skaf sees new patients Monday through Friday. Same-week openings are common.</p>
<div style="display:flex;flex-wrap:wrap;gap:10px;">
<a href="${C.pagePath('appointments')}" class="hv-btn-lift" style="background:#0B5C8A;color:#fff;padding:15px 22px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;transition:background-color .25s ease,transform .25s ease;">Request an appointment</a>
<a href="${TEL}" class="hv-border" style="border:1px solid #C3D3E0;color:#08405F;padding:15px 22px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">Call the office</a>
</div>
</aside>
<div style="margin-top:50px;padding-top:30px;border-top:1px solid #D8E3EC;">
${eyebrow('Keep reading')}
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px;margin-top:20px;">
${map(related, (r) => `<a href="${C.postPath(r.id)}" class="hv-card-flat" style="text-decoration:none;border:1px solid #D8E3EC;padding:20px;display:block;transition:border-color .25s ease,transform .25s ease;">
<div style="font:400 18px/1.3 ${SANS};color:#08405F;">${esc(r.title)}</div>
<div style="font:400 12px/1 ${MONO};color:#4C6980;margin-top:12px;">${r.mins} min read</div>
</a>`)}
</div>
</div>
</div>
</article>
<div style="height:70px;"></div>
</div>`;
}

export function forms() {
  const request = (f, format) =>
    `mailto:${P.email}?subject=${encodeURIComponent(`${f.name} (${format})`)}&body=${encodeURIComponent(`Hello, please send me the ${f.name} form (${format}).\n\nName:\nPhone:\n`)}`;
  return `<div data-screen-label="Online Forms">
${pageIntro({ label: 'Online forms', title: 'Paperwork, done before you arrive.', wrap: false, lede: 'Each form takes two to five minutes and is transmitted over an encrypted connection.', ledeSize: 18.5, ledeMargin: 20 })}
<div style="padding:48px 40px 78px;">
<div style="max-width:820px;margin:0 auto;border-top:1px solid #D8E3EC;">
${map(C.FORMS_LIST, (f) => `<div id="${f.id}" style="display:flex;flex-wrap:wrap;gap:16px 32px;align-items:center;justify-content:space-between;padding:24px 0;border-bottom:1px solid #D8E3EC;scroll-margin-top:100px;">
<div style="flex:1 1 280px;">
<h2 style="margin:0;font:400 20px/1.3 ${SANS};color:#08405F;">${esc(f.name)}</h2>
<p style="font:400 15.5px/1.6 ${SANS};color:#4A5C6B;margin:8px 0 0;">${esc(f.note)}</p>
</div>
<div style="display:flex;gap:8px;">
<a href="${esc(f.online || request(f, 'online'))}"${f.online ? ' target="_blank" rel="noopener"' : ''} class="hv-soft" style="border:1px solid #D8E3EC;color:#08405F;padding:13px 18px;text-decoration:none;font:500 11px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">Fill online</a>
<a href="${esc(f.pdf || request(f, 'PDF'))}"${f.pdf ? ' target="_blank" rel="noopener"' : ''} class="hv-soft" style="border:1px solid #D8E3EC;color:#4A5C6B;padding:13px 18px;text-decoration:none;font:500 11px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">PDF</a>
</div>
</div>`)}
</div>
</div>
</div>`;
}

export function sitemap() {
  return `<div data-screen-label="Site Map">
${pageIntro({ label: 'Site map', title: 'Every page on this site.', width: 1120, h1Size: 42, wrap: false })}
<div style="padding:44px 40px 78px;">
<div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:34px;">
${map(C.SITEMAP_GROUPS, (g) => `<div>
<h2 style="margin:0;font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#0B5C8A;padding-bottom:12px;border-bottom:1px solid #D8E3EC;">${esc(g.cat)}</h2>
<div style="display:flex;flex-direction:column;align-items:flex-start;margin-top:6px;">
${map(g.links, ([label, page]) => `<a href="${C.pagePath(page)}" class="hv-menu" style="text-decoration:none;color:#16232E;font:400 16.5px/1.4 ${SANS};padding:8px 0;transition:color .2s ease,transform .2s ease;">${esc(label)}</a>`)}
${g.cat === 'Services' ? map(SERVICES, (s) => `<a href="${C.servicePath(s.id)}" class="hv-menu" style="text-decoration:none;color:#4A5C6B;font:400 15.5px/1.4 ${SANS};padding:6px 0 6px 14px;transition:color .2s ease,transform .2s ease;">${esc(s.name)}</a>`) : ''}
${g.cat === 'Library & Legal' ? map(POSTS, (p) => `<a href="${C.postPath(p.id)}" class="hv-menu" style="text-decoration:none;color:#4A5C6B;font:400 15.5px/1.4 ${SANS};padding:6px 0 6px 14px;transition:color .2s ease,transform .2s ease;">${esc(p.title)}</a>`) : ''}
</div>
</div>`)}
</div>
</div>
</div>`;
}

export function accessibility() {
  return `<div data-screen-label="Accessibility">
<div style="padding:66px 40px 78px;">
<div style="max-width:760px;margin:0 auto;">
${eyebrow('Accessibility')}
<h1 style="font:300 42px/1.1 ${SANS};letter-spacing:-0.02em;margin:18px 0 0;color:#08405F;animation:dcUp .5s ease .05s both;">Our commitment to an accessible practice.</h1>
<p style="font:400 18.5px/1.75 ${SANS};color:#4A5C6B;margin:22px 0 0;">Hillcrest Dental Studio works to meet WCAG 2.1 AA for this website and to make the office itself easy to use. The building has step-free entry from the parking lot, an accessible restroom, and operatories that accommodate wheelchairs.</p>
<p style="font:400 18.5px/1.75 ${SANS};color:#4A5C6B;margin:16px 0 0;">Every page here is keyboard navigable, honors text resizing to 200%, and maintains a contrast ratio of at least 4.5:1 for body text. Forms use visible labels rather than placeholder-only hints.</p>
<p style="font:400 18.5px/1.75 ${SANS};color:#4A5C6B;margin:16px 0 0;">If anything here is difficult to use, or you need a document in large print, call <a href="${TEL}" style="color:#08405F;">${P.phone}</a> and we'll provide it another way.</p>
<div style="margin-top:34px;border:1px solid #D8E3EC;padding:28px 26px;">
<h2 style="margin:0;font:500 11.5px/1 ${MONO};letter-spacing:0.14em;text-transform:uppercase;color:#0B5C8A;">Assistance in the office</h2>
<ul style="list-style:none;padding:0;margin:14px 0 0;">
${map(C.ACCESS_ITEMS, (a) => `<li style="display:flex;gap:14px;padding:10px 0;border-bottom:1px solid #EDF3F8;font:400 16.5px/1.5 ${SANS};color:#16232E;"><span aria-hidden="true" style="color:#0B5C8A;">—</span><span>${esc(a)}</span></li>`)}
</ul>
</div>
</div>
</div>
</div>`;
}

export function thanks() {
  return `<div data-screen-label="Thank You">
<div style="padding:100px 40px 120px;">
<div style="max-width:620px;margin:0 auto;text-align:center;">
${eyebrow('Received')}
<h1 style="font:300 44px/1.12 ${SANS};letter-spacing:-0.02em;margin:18px 0 0;color:#08405F;animation:dcUp .5s ease .05s both;">Thank you — we have your request.</h1>
<p style="font:400 18.5px/1.7 ${SANS};color:#4A5C6B;margin:18px 0 0;">A member of our staff will call within one business day to confirm your appointment. If it's urgent, please call us directly.</p>
<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:32px;">
${btnPrimary(TEL, `Call ${P.phone}`)}
<a href="${C.pagePath('forms')}" class="hv-border" style="border:1px solid #D8E3EC;color:#08405F;padding:16px 24px;text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:0.1em;text-transform:uppercase;">Fill your forms</a>
</div>
</div>
</div>
</div>`;
}

export function notFound() {
  const link = (page, label, last) =>
    `<a href="${C.pagePath(page)}" class="hv-color" style="text-decoration:none;color:#08405F;font:400 18px/1.4 ${SANS};padding:15px 0;${last ? '' : 'border-bottom:1px solid #EDF3F8;'}">${label}</a>`;
  return `<div data-screen-label="404">
<div style="padding:100px 40px 120px;">
<div style="max-width:620px;margin:0 auto;">
${eyebrow('404')}
<h1 style="font:300 44px/1.12 ${SANS};letter-spacing:-0.02em;margin:18px 0 0;color:#08405F;animation:dcUp .5s ease .05s both;">That page has moved.</h1>
<p style="font:400 18.5px/1.7 ${SANS};color:#4A5C6B;margin:18px 0 0;">We reorganized the site around services and topics. Here's where most people were headed:</p>
<div style="display:flex;flex-direction:column;margin-top:26px;border-top:1px solid #D8E3EC;">
${link('services', 'All services')}
${link('appointments', 'Request an appointment')}
${link('blog', 'Patient library')}
${link('contact', 'Contact &amp; directions', true)}
</div>
</div>
</div>
</div>`;
}
