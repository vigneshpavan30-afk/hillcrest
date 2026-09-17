// HTML templates for every page: premium dark design (see docs/superpowers/specs/2026-09-16-premium-3d-redesign-design.md).
import * as C from './content/site.mjs';

const { PRACTICE: P, SERVICES, GROUPS, POSTS, TOPICS } = C;

// --- build-time hooks ------------------------------------------------------------------

let imageUrls = () => { throw new Error('setImageResolver() not called'); };
export function setImageResolver(fn) { imageUrls = fn; }

let logo = { d: '', viewBox: '0 0 100 100' };
let heroPoster = '/images/logo-mark-white.png';
let assetVersion = { css: '', js: '' };
// Content hashes appended to CSS/JS URLs so browsers fetch new builds instead of cached copies.
export function setAssetVersion(v) { assetVersion = v; }
export function setLogo(svgPath, viewBox) { logo = { d: svgPath, viewBox }; }
export function setHeroPoster(url) { heroPoster = url; }

// --- helpers ---------------------------------------------------------------------------

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const map = (list, fn) => list.map(fn).join('\n');
const svcById = (id) => SERVICES.find((s) => s.id === id);
const TEL = `tel:${P.phoneRaw}`;
const SMS = `sms:${P.phoneRaw}`;
const ARROW = '<span class="arrow" aria-hidden="true">→</span>';

let svgCount = 0;
function mark(cls = 'brand-mark', title = '') {
  const id = `lg${++svgCount}`;
  return `<svg class="${cls}" viewBox="${logo.viewBox}" ${title ? `role="img" aria-label="${esc(title)}"` : 'aria-hidden="true"'} focusable="false">
<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#08405F"/><stop offset=".6" stop-color="#1E8E93"/><stop offset="1" stop-color="#B08A4A"/></linearGradient></defs>
<path fill="url(#${id})" d="${logo.d}"/></svg>`;
}

function img(image, { sizes = '100vw', eager = false, parallax = false } = {}) {
  const { src, srcset } = imageUrls(image.src);
  const pos = image.position ? ` style="object-position:${image.position};"` : '';
  return `<img src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${esc(image.alt)}"${pos}${parallax ? ' data-parallax' : ''}${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'} />`;
}

const mapFrame = (title) =>
  `<iframe src="${esc(P.mapEmbed)}" title="${esc(title)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;

// Wraps each word in a masked span so headlines can rise word by word. Supports <em> for accent words.
function split(html) {
  const wrap = (text) => text.split(/(\s+)/).map((t) => (/^\s+$/.test(t) || !t ? t : `<span class="line"><span>${t}</span></span>`)).join('');
  return html.split(/(<em>.*?<\/em>)/).map((part) =>
    part.startsWith('<em>') ? `<em>${wrap(part.slice(4, -5))}</em>` : wrap(part)).join('');
}
const heading = (tag, cls, html, attrs = '') => `<${tag} class="${cls}" data-split${attrs}>${split(html)}</${tag}>`;
const eyebrow = (text, attrs = ' data-reveal="up"') => `<div class="eyebrow"${attrs}>${text}</div>`;

const btn = (href, label, kind = 'primary', extra = '') =>
  `<a href="${href}" class="btn btn-${kind}" data-magnetic${extra}>${label}${kind === 'primary' ? ARROW : ''}</a>`;

function pageHero({ label, title, lede, crumbs, actions, markOn = true }) {
  return `<section class="page-hero">
${markOn ? `<div class="page-hero-mark" data-float>${mark('', '')}</div>` : ''}
<div class="container">
${crumbs ? `<nav class="breadcrumb" aria-label="Breadcrumb" data-reveal="up">${crumbs}</nav>` : ''}
${eyebrow(label)}
${heading('h1', 'display-2', title)}
${lede ? `<p class="lede" data-reveal="up">${lede}</p>` : ''}
${actions ? `<div class="hero-actions" data-reveal="up">${actions}</div>` : ''}
</div>
</section>`;
}

const sectionHead = ({ label, title, lede, link, size = 'display-2' }) => `<div class="section-head">
<div>${eyebrow(label)}${heading('h2', size, title)}${lede ? `<p class="lede" data-reveal="up">${lede}</p>` : ''}</div>
${link ? `<div data-reveal="up">${link}</div>` : ''}
</div>`;

const hoursList = () => `<ul class="hours">${map(C.HOURS, (h) => `<li><span>${h.d}</span><span>${h.t}</span></li>`)}</ul>`;
const honeypot = `<div class="hp-field" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>`;

const ICONS = {
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
};

// --- layout ------------------------------------------------------------------------------

function header(current) {
  const link = (page, label) => `<a href="${C.pagePath(page)}" class="nav-link"${current === page ? ' aria-current="page"' : ''}>${label}</a>`;
  const practice = [['about', 'Who We Are'], ['doctors', 'Meet Dr. Skaf'], ['difference', 'The Difference'], ['gallery', 'Office Gallery'], ['testimonials', 'Patient Reviews'], ['insurance', 'Insurance &amp; Payment']];
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
<div class="container header-bar">
<a href="/" class="brand" aria-label="Hillcrest Dental Studio home">${mark()}<span><span class="brand-name">Hillcrest</span><span class="brand-sub">Dental Studio</span></span></a>
<nav class="nav" aria-label="Main">
<div class="dd" data-dropdown>
<a href="${C.pagePath('services')}" class="nav-link" aria-haspopup="true" aria-expanded="false"${current === 'services' || current === 'service' ? ' aria-current="page"' : ''}>Services<span class="caret" aria-hidden="true"></span></a>
<div class="dd-panel dd-services glass">
${map(GROUPS, (g) => `<div><div class="dd-group-title">${esc(g.cat)}</div>${map(g.ids, (id) => `<a href="${C.servicePath(id)}" class="dd-link">${esc(svcById(id).name)}</a>`)}</div>`)}
</div>
</div>
<div class="dd" data-dropdown>
<a href="${C.pagePath('about')}" class="nav-link" aria-haspopup="true" aria-expanded="false"${practice.some(([p]) => p === current) ? ' aria-current="page"' : ''}>Our Practice<span class="caret" aria-hidden="true"></span></a>
<div class="dd-panel dd-practice glass">
${map(practice, ([p, label]) => `<a href="${C.pagePath(p)}" class="dd-link">${label}</a>`)}
</div>
</div>
${link('new-patients', 'New Patients')}
${link('blog', 'Learn')}
${link('contact', 'Contact')}
</nav>
<div class="header-actions">
<a href="${TEL}" class="header-phone">${P.phone}</a>
<a href="${C.pagePath('appointments')}" class="btn btn-primary btn-sm" data-magnetic>Book a visit</a>
<button type="button" class="menu-toggle" data-mobile-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Menu"><span></span><span></span></button>
</div>
</div>
</header>
<nav id="mobile-menu" class="mobile-menu" aria-label="Mobile" hidden>
<details><summary class="m-link">Services</summary><div class="m-sub">
<a href="${C.pagePath('services')}">All services</a>
${map(SERVICES, (s) => `<a href="${C.servicePath(s.id)}">${esc(s.name)}</a>`)}
</div></details>
<details><summary class="m-link">Our Practice</summary><div class="m-sub">
${map(practice, ([p, label]) => `<a href="${C.pagePath(p)}">${label}</a>`)}
</div></details>
<a class="m-link" href="${C.pagePath('new-patients')}">New Patients</a>
<a class="m-link" href="${C.pagePath('blog')}">Learn</a>
<a class="m-link" href="${C.pagePath('contact')}">Contact</a>
<div class="m-actions">
<a href="${C.pagePath('appointments')}" class="btn btn-primary btn-block">Book a visit${ARROW}</a>
<a href="${TEL}" class="btn btn-ghost btn-block">Call ${P.phone}</a>
</div>
</nav>`;
}

function footer() {
  const link = (page, label) => `<a href="${C.pagePath(page)}">${label}</a>`;
  return `<section class="section-tight">
<div class="container">
<div class="cta-band glass" data-reveal="tilt">
${eyebrow('Same-week appointments', '')}
${heading('h2', 'display-2', 'Your healthiest <em>smile</em> starts with a conversation.')}
<p class="lede">Tell us what's going on and we'll call you back within one business day — or call the front desk now.</p>
<div class="hero-actions">${btn(C.pagePath('appointments'), 'Request an appointment')}${btn(TEL, `Call ${P.phone}`, 'ghost')}</div>
</div>
</div>
</section>
<footer class="site-footer">
<div class="container">
<div class="footer-grid">
<div>
<a href="/" class="brand" aria-label="Hillcrest Dental Studio home">${mark()}<span><span class="brand-name">Hillcrest</span><span class="brand-sub">Dental Studio</span></span></a>
<p class="muted mt-m" style="max-width:36ch;">Our goal is for you to leave with a memorable, easy experience — which is why our team does everything it can to make you feel at home.</p>
<div class="socials">
<a href="${P.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>
<a href="${P.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>
<a href="${P.mapsUrl}" target="_blank" rel="noopener" aria-label="Directions on Google Maps">${ICONS.map}</a>
</div>
</div>
<div>
<div class="footer-title">Visit</div>
<address class="footer-contact">
<a href="${P.mapsUrl}" target="_blank" rel="noopener">${P.street}<br />${P.city}, ${P.region} ${P.zip}</a>
<a href="${TEL}">${P.phone}</a>
<a href="mailto:${P.email}">${P.email}</a>
</address>
</div>
<div>
<div class="footer-title">Hours</div>
${hoursList()}
</div>
<div>
<div class="footer-title">Explore</div>
<div class="footer-links">
${link('services', 'Services')}
${link('new-patients', 'New patients')}
${link('insurance', 'Insurance')}
${link('blog', 'Patient library')}
${link('sitemap', 'Site map')}
${link('accessibility', 'Accessibility')}
</div>
</div>
</div>
<div class="footer-bottom">
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
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
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
<meta name="theme-color" content="#F5F8FA" />
<script>(function(d){var m=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(!m)d.documentElement.classList.add('motion');})(document);</script>
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/favicon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/site.css?v=${assetVersion.css}" />
${page === 'home' ? `<link rel="modulepreload" href="/assets/main.js?v=${assetVersion.js}" />` : ''}
${map(ld, (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)}
<script type="module" src="/assets/main.js?v=${assetVersion.js}"></script>
</head>
<body data-page="${page}">
${header(page)}
<div class="cursor-glow" aria-hidden="true" data-cursor-glow></div>
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
</body>
</html>
`;
}

// --- shared blocks -------------------------------------------------------------------------

function serviceGroupCards() {
  return `<div class="grid grid-4" data-stagger>
${map(GROUPS, (g, i) => `<div class="glass card tilt svc-group" data-reveal="tilt">
<div class="card-num">0${i + 1}</div>
<h3 class="card-title">${esc(g.cat)}</h3>
<p class="card-text">${esc(g.blurb)}</p>
<div class="svc-list">
${map(g.ids, (id) => `<a href="${C.servicePath(id)}">${esc(svcById(id).name)}</a>`)}
</div>
</div>`)}
</div>`;
}

function reviewsMarquee(list) {
  const card = (r, dup) => `<figure class="review glass"${dup ? ' aria-hidden="true" data-dup' : ''}>
<div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
<blockquote><p>“${esc(r.quote)}”</p></blockquote>
<figcaption class="mono">${esc(r.name)} · Google</figcaption>
</figure>`;
  return `<div class="marquee" data-reveal="up"><div class="marquee-track">${map(list, (r) => card(r, false))}${map(list, (r) => card(r, true))}</div></div>`;
}

function faqList(items) {
  return `<div class="faq" data-stagger>${map(items, (f) => `<details data-reveal="up"><summary>${esc(f.q)}<span class="plus" aria-hidden="true"></span></summary><p class="answer">${esc(f.a)}</p></details>`)}</div>`;
}

// --- pages ---------------------------------------------------------------------------------

export function home() {
  return `<section class="hero" data-hero>
<div class="container hero-grid">
<div class="hero-copy">
${heading('h1', 'display-1', 'Unhurried dental care for every <em>stage</em> of your family\'s life.')}
<p class="lede intro-fade">Dr. Rana Skaf and team have cared for Chino Valley families for over twenty years. Same-week appointments, transparent pricing, and every option explained before anything begins.</p>
<div class="hero-actions intro-fade">
${btn(C.pagePath('appointments'), 'Request an appointment')}
${btn(TEL, `Call ${P.phone}`, 'ghost')}
</div>
<ul class="hero-trust intro-fade">${map(C.TRUST_BAR, (t) => `<li>${esc(t)}</li>`)}</ul>
</div>
<div class="hero-visual intro-fade" data-hero-3d>
<div class="orbit orbit-1" aria-hidden="true"></div>
<div class="orbit orbit-2" aria-hidden="true"></div>
<img class="hero-poster" src="${heroPoster}" alt="Hillcrest Dental Studio tooth logo sculpture" fetchpriority="high" />
<canvas class="hero-canvas" aria-hidden="true"></canvas>
<div class="hero-chip hero-chip-1 glass" data-depth="0.6"><strong>4.9 ★</strong><span>133 Google reviews</span></div>
<div class="hero-chip hero-chip-2 glass" data-depth="1"><strong>20+ yrs</strong><span>Caring for Chino Valley</span></div>
</div>
</div>
<div class="scroll-cue" aria-hidden="true">Scroll</div>
</section>

<section class="section-tight">
<div class="container">
<div class="glass card" data-reveal="tilt" style="display:grid;gap:28px;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));align-items:center;">
<div>${eyebrow('Start here', '')}<h2 class="display-3" style="margin-top:14px;">What brings you <em>in?</em></h2></div>
<div class="reasons" data-stagger style="grid-column:span 2;">
${map(C.QUICK_REASONS, (q) => `<a href="${C.servicePath(q.id)}" class="reason" data-reveal="up">${esc(q.label)}</a>`)}
</div>
</div>
</div>
</section>

<section class="section">
<div class="container">
${sectionHead({ label: 'Services', title: 'Everything your family needs, under <em>one roof.</em>', lede: 'Thirteen services grouped the way patients actually think about them — so you can find what you need without scanning a menu of twenty links.', link: `<a class="link-arrow" href="${C.pagePath('services')}">All services</a>` })}
${serviceGroupCards()}
</div>
</section>

<section class="section section-alt">
<div class="container">
${sectionHead({ label: 'The difference', title: 'Four things we refuse to <em>compromise</em> on.', link: `<a class="link-arrow" href="${C.pagePath('difference')}">Our approach</a>` })}
<div class="grid grid-4" data-stagger>
${map(C.DIFFERENCES, (d) => `<div class="glass card tilt" data-reveal="tilt">
<div class="card-num">${d.num}</div>
<h3 class="card-title">${esc(d.title)}</h3>
<p class="card-text">${esc(d.body)}</p>
</div>`)}
</div>
</div>
</section>

<section class="section">
<div class="container split">
<div class="frame" data-reveal="scale">
<div class="media ratio-4-5">${img(C.IMAGES.doctor, { sizes: '(max-width: 900px) 100vw, 560px', parallax: true })}</div>
</div>
<div>
${eyebrow('Your dentist')}
${heading('h2', 'display-2', 'Dr. Rana Skaf')}
<div class="eyebrow credential" data-reveal="up">DDS</div>
<div class="prose mt-m" data-reveal="up">
<p>Twenty years in dentistry, a Doctorate of Dental Surgery from Loma Linda University, and a periodontal specialization from Damascus University. Dr. Skaf has lived in Chino Valley for fifteen years and now owns and leads the practice.</p>
</div>
<blockquote class="display-4 mt-m" data-reveal="up" style="font-style:italic;color:var(--navy);">“Every smile tells a story. My job is to help you protect yours — with knowledge first, then treatment.”</blockquote>
<div class="hero-actions" data-reveal="up">${btn(C.pagePath('doctors'), 'Read her full story', 'ghost')}</div>
</div>
</div>
</section>

<section class="section section-alt">
<div class="container">
<div class="section-head">
<div>
${eyebrow('Patient reviews')}
<div class="rating-big" data-reveal="up"><strong><span data-count="4.9" data-decimals="1">4.9</span></strong><div><div class="stars" style="font-size:20px;">★★★★★</div><div class="mono" style="margin-top:10px;"><span data-count="133">133</span> Google reviews</div></div></div>
</div>
<div data-reveal="up"><a class="link-arrow" href="${C.pagePath('testimonials')}">All reviews</a></div>
</div>
</div>
${reviewsMarquee(C.ALL_REVIEWS)}
</section>

<section class="section">
<div class="container grid grid-2" style="align-items:start;">
<div class="glass card tilt" data-reveal="tilt">
${eyebrow('Insurance', '')}
<h2 class="display-3 mt-s">We take almost every PPO — and <em>Denti-Cal.</em></h2>
<p class="card-text">In network with Denti-Cal, Medi-Cal and IEHP. DeltaCare and DHS accepted on the HMO side. If your plan isn't listed, one phone call usually settles it.</p>
<div class="card-foot"><a class="link-arrow" href="${C.pagePath('insurance')}">Check your coverage</a></div>
</div>
<div class="glass card" data-reveal="tilt">
${eyebrow('Visit us', '')}
<h2 class="display-3 mt-s">Hillcrest Professional Center, <em>Grand Ave.</em></h2>
<p class="card-text">Between Chino Hills Parkway and Peyton Drive, with free parking directly in front of the door.</p>
<div class="media media-map ratio-16-9 mt-m">${mapFrame('Map — 2130 Grand Ave H, Chino Hills')}</div>
<div class="card-foot"><a class="link-arrow" href="${P.mapsUrl}" target="_blank" rel="noopener">Get directions</a></div>
</div>
</div>
</section>

<section class="section section-alt">
<div class="container container-narrow">
${sectionHead({ label: 'Answers before you call', title: 'Common <em>questions</em>', size: 'display-2', link: `<a class="link-arrow" href="${C.pagePath('blog')}">Patient library</a>` })}
${faqList(C.HOME_FAQS)}
</div>
</section>`;
}

export function about() {
  return `${pageHero({ label: 'Who we are', title: 'A neighborhood practice that still runs on <em>relationships.</em>' })}
<section class="section-tight">
<div class="container split split-top">
<div class="prose" data-reveal="up">
<p>Hillcrest Dental Studio has served Chino Hills families since 2010. We are deliberately a general practice with a wide range — cleanings and sealants for a seven-year-old, implants and dentures for her grandfather — so one relationship covers the whole household.</p>
<p>What we don't do is rush. Appointments are scheduled with room to talk. Treatment plans come with the cost written down before you agree to anything. And nobody on our team is paid to sell you dentistry.</p>
<div class="hero-actions">${btn(C.pagePath('appointments'), 'Book a visit')}${btn(C.pagePath('doctors'), 'Meet Dr. Skaf', 'ghost')}</div>
</div>
<div class="frame" data-reveal="scale"><div class="media ratio-4-3">${img(C.IMAGES.aboutWide, { sizes: '(max-width: 900px) 100vw, 600px', eager: true, parallax: true })}</div></div>
</div>
</section>
<section class="section">
<div class="container">
<div class="stats" data-reveal="tilt">
${map(C.ABOUT_STATS, (s) => { const n = parseFloat(s.n); return `<div class="stat"><div class="stat-n"><span data-count="${n}">${n}</span>${s.n.replace(/[\d.]/g, '')}</div><div class="stat-l">${esc(s.l)}</div></div>`; })}
</div>
</div>
</section>`;
}

export function doctors() {
  return `<section class="page-hero">
<div class="container split split-top">
<div class="frame sticky" data-reveal="scale"><div class="media ratio-4-5">${img(C.IMAGES.doctor, { sizes: '(max-width: 900px) 100vw, 560px', eager: true })}</div></div>
<div>
${eyebrow('Owner &amp; lead dentist')}
${heading('h1', 'display-2', 'Dr. Rana Skaf')}
<div class="eyebrow credential" data-reveal="up">DDS</div>
<div class="prose mt-m" data-reveal="up">
<p>For more than twenty years, dentistry has been my passion and my purpose. I earned my Doctorate of Dental Surgery from Loma Linda University, after completing my dental degree and periodontal specialization at Damascus University.</p>
<p>I've cared for patients at every stage of life, and the thing that has never changed is how I work: gentle communication, thoughtful treatment planning, and a genuine commitment to each person's comfort and long-term oral health.</p>
<p>My family and I have called Chino Valley home for more than fifteen years. When I'm not at the office you'll find me at local school events, in the parks with my husband and our three children, or talking to neighbors at community gatherings.</p>
<p>Hillcrest has always been known for its caring team and patient-centered values. I'm proud to carry that legacy forward.</p>
</div>
<dl class="deflist glass card mt-l" data-reveal="tilt">
${map(C.CREDENTIALS, (c) => `<div><dt>${esc(c.k)}</dt><dd>${esc(c.v)}</dd></div>`)}
</dl>
<div class="hero-actions" data-reveal="up">${btn(C.pagePath('appointments'), 'Book with Dr. Skaf')}</div>
</div>
</div>
</section>`;
}

export function difference() {
  return `${pageHero({ label: 'The difference', title: 'Why patients drive past four other offices to get <em>here.</em>' })}
<section class="section-tight">
<div class="container grid grid-2" data-stagger>
${map(C.DIFFERENCES, (d) => `<article class="glass card tilt" data-reveal="tilt">
<div class="card-num">${d.num}</div>
<h2 class="card-title display-4">${esc(d.title)}</h2>
<p class="card-text">${esc(d.long)}</p>
</article>`)}
</div>
</section>`;
}

export function gallery() {
  return `${pageHero({ label: 'Gallery', title: 'See the office before you sit in the <em>chair.</em>', lede: 'Nine rooms, a sterilization suite you can look into, and a TV in every operatory. Photos below; drop by any weekday for the real thing.' })}
<section class="section-tight" style="padding-bottom:clamp(32px,3.5vw,56px);">
<div class="container gallery-grid" data-stagger>
${map(C.GALLERY_SHOTS, (g) => `<figure data-reveal="tilt">
<div class="media ratio-4-3">${img(C.IMAGES.gallery[g.sid], { sizes: '(max-width: 700px) 100vw, 400px', parallax: true })}</div>
<figcaption>${esc(g.caption)}</figcaption>
</figure>`)}
</div>
</section>`;
}

export function testimonials() {
  return `${pageHero({ label: 'Patient reviews', title: '133 Google reviews, <em>unedited.</em>' })}
<section class="section-tight">
<div class="container grid grid-3" data-stagger>
${map(C.ALL_REVIEWS, (r) => `<figure class="glass card tilt review" style="width:auto;" data-reveal="tilt">
<div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
<blockquote><p>“${esc(r.quote)}”</p></blockquote>
<figcaption class="mono">${esc(r.name)} · Google</figcaption>
</figure>`)}
</div>
<div class="container center mt-m" data-reveal="up">${btn(C.pagePath('appointments'), 'Book an appointment')}</div>
</section>`;
}

export function newPatients() {
  const openLink = (href, label) => `<a href="${href}" class="glass card card-link" style="display:flex;justify-content:space-between;align-items:center;padding:20px 24px;" data-reveal="up"><span>${label}</span><span class="link-arrow">Open</span></a>`;
  return `${pageHero({ label: 'New patients', title: 'Your first visit, described in full so nothing is a <em>surprise.</em>', lede: "Plan on about seventy-five minutes. You'll meet Dr. Skaf, get a full set of digital X-rays, and leave with a written plan and its cost — not a treatment you didn't agree to." })}
<section class="section-tight">
<div class="container">
<ol class="grid grid-4" data-stagger>
${map(C.FIRST_VISIT, (v, i) => `<li class="glass card tilt" data-reveal="tilt">
<div class="card-num">0${i + 1}</div>
<h2 class="card-title">${esc(v.title)}</h2>
<p class="card-text">${esc(v.body)}</p>
<div class="card-foot chip"><span class="dot"></span>${v.mins}</div>
</li>`)}
</ol>
</div>
</section>
<section class="section">
<div class="container grid grid-2">
<div>
${eyebrow('Checklist')}
${heading('h2', 'display-3', 'Bring these <em>four</em> things')}
<ul class="checklist mt-m" data-stagger>${map(C.BRING_LIST, (b) => `<li data-reveal="up">${esc(b)}</li>`)}</ul>
</div>
<div>
${eyebrow('Paperwork')}
${heading('h2', 'display-3', 'Save time — fill forms at <em>home</em>')}
<p class="lede mt-s" data-reveal="up">Complete the health history and consent online and you'll walk straight into the operatory.</p>
<div class="grid mt-m" data-stagger>
${openLink(C.pagePath('forms') + '#health-history', 'Patient health history')}
${openLink(C.pagePath('forms') + '#hipaa', 'HIPAA &amp; consent to treat')}
${openLink(C.pagePath('insurance'), 'Insurance &amp; payment options')}
</div>
</div>
</div>
</section>`;
}

export function insurance() {
  return `${pageHero({ label: 'Insurance &amp; payment', title: 'Coverage, in plain <em>language.</em>' })}
<section class="section-tight">
<div class="container grid grid-3" data-stagger>
${map(C.COVERAGE, (c) => `<div class="glass card tilt" data-reveal="tilt">
<span class="chip"><span class="dot"></span>${c.kind}</span>
<h2 class="card-title">${esc(c.title)}</h2>
<p class="card-text">${esc(c.body)}</p>
</div>`)}
</div>
</section>
<section class="section">
<div class="container grid grid-2">
<div class="glass card" data-reveal="tilt">
<h2 class="display-3">Not sure whether we're in <em>network?</em></h2>
<p class="card-text">Many plans sit under an umbrella policy with a major carrier. Call with your member ID and we'll check while you're on the line.</p>
<div class="hero-actions">${btn(TEL, `Call ${P.phone}`)}</div>
</div>
<div class="glass card" data-reveal="tilt">
<h2 class="display-3">No <em>insurance?</em></h2>
<p class="card-text">Ask about our in-house membership: two cleanings, two exams, annual X-rays and a standing discount on treatment for a flat monthly fee. Third-party financing is available for larger plans.</p>
<div class="hero-actions">${btn(C.pagePath('contact'), 'Ask about membership', 'ghost')}</div>
</div>
</div>
</section>`;
}

export function services() {
  return `${pageHero({ label: 'Services', title: 'Thirteen services, grouped the way patients <em>ask</em> for them.' })}
${map(GROUPS, (g, i) => `<section class="section-tight">
<div class="container">
<div class="section-head">
<div><div class="eyebrow" data-reveal="up">0${i + 1} · ${esc(g.cat)}</div><p class="lede mt-s" data-reveal="up">${esc(g.blurb)}</p></div>
</div>
<div class="grid grid-3" data-stagger>
${map(g.ids.map(svcById), (s) => `<a href="${C.servicePath(s.id)}" class="glass card card-link tilt svc-card" data-reveal="tilt">
<h3 class="card-title">${esc(s.name)}</h3>
<p class="card-text">${esc(s.dek)}</p>
<div class="card-foot"><span class="link-arrow">Read more</span></div>
</a>`)}
</div>
</div>
</section>`)}
<div style="height:clamp(20px,3vw,40px);"></div>`;
}

function leadForm({ kind, service, button, success, fields }) {
  const input = (type, name, label, required, autocomplete) =>
    `<label class="field"><span class="field-label">${label}</span><input class="input" type="${type}" name="${name}"${required ? ' required' : ''} autocomplete="${autocomplete}" /></label>`;
  return `<form method="post" action="/api/messages" data-lead-form data-success="${esc(success)}" novalidate>
<input type="hidden" name="kind" value="${kind}" />
${service ? `<input type="hidden" name="service" value="${esc(service)}" />` : ''}
${honeypot}
<div class="form-grid">
${input('text', 'name', fields.nameLabel, true, 'name')}
${input('tel', 'phone', 'Phone', true, 'tel')}
<label class="field"><span class="field-label">${fields.noteLabel}</span><textarea class="input" name="note" rows="${fields.rows}"${fields.noteRequired ? ' required' : ''}></textarea></label>
<button type="submit" class="btn btn-primary btn-block" data-magnetic>${button}${ARROW}</button>
</div>
<div class="form-msg" data-form-msg role="status" aria-live="polite" hidden></div>
</form>`;
}

export function service(svc) {
  const related = SERVICES.filter((s) => s.cat === svc.cat && s.id !== svc.id).slice(0, 3);
  const crumbs = `<a href="/">Home</a><span class="sep">/</span><a href="${C.pagePath('services')}">Services</a><span class="sep">/</span><span aria-current="page">${esc(svc.name)}</span>`;
  return `${pageHero({ label: esc(svc.cat), title: esc(svc.name), lede: esc(svc.dek), crumbs })}
<section class="section-tight">
<div class="container layout-main">
<article style="min-width:0;">
<dl class="facts" data-reveal="tilt">${map(svc.facts, (f) => `<div><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`)}</dl>
<div class="media ratio-16-9 mt-m" data-reveal="scale">${img(C.IMAGES.services[svc.id], { sizes: '(max-width: 900px) 100vw, 700px', eager: true, parallax: true })}</div>
<div class="prose mt-l" data-reveal="up">${map(svc.paras, (p) => `<p>${esc(p)}</p>`)}</div>
<div class="glass card mt-l" data-reveal="tilt">
${eyebrow("What's included", '')}
<ul class="checklist mt-s">${map(svc.includes, (i) => `<li>${esc(i)}</li>`)}</ul>
</div>
<div class="mt-l">
${heading('h2', 'display-3', 'Common <em>questions</em>')}
<div class="mt-m">${faqList(svc.faqs)}</div>
</div>
</article>
<aside class="sticky">
<div class="glass card" data-reveal="tilt">
<h2 class="display-4">Ask about ${esc(svc.short)}</h2>
<p class="card-text" style="margin-bottom:24px;">Send two lines and we'll call you back the same business day.</p>
${leadForm({ kind: 'callback', service: svc.name, button: 'Request a callback', success: "Thank you — we'll call you back today.", fields: { nameLabel: 'Your name', noteLabel: "What's going on? (optional)", rows: 3, noteRequired: false } })}
<p class="small mt-m">Prefer to talk now? <a class="text-link" href="${TEL}">${P.phone}</a></p>
</div>
</aside>
</div>
</section>
<section class="section">
<div class="container">
${sectionHead({ label: 'Related', title: 'You may also <em>need</em>', size: 'display-3' })}
<div class="grid grid-3" data-stagger>
${map(related, (s) => `<a href="${C.servicePath(s.id)}" class="glass card card-link tilt" data-reveal="tilt"><h3 class="card-title" style="margin-top:0;">${esc(s.name)}</h3><p class="card-text">${esc(s.dek)}</p><div class="card-foot"><span class="link-arrow">Read more</span></div></a>`)}
</div>
</div>
</section>`;
}

export function appointments() {
  const steps = [['1', 'Reason'], ['2', 'Time'], ['3', 'Details'], ['4', 'Confirm']];
  const back = '<button type="button" class="btn btn-ghost" data-bk-back>Back</button>';
  const field = (label, type, name, autocomplete, required) =>
    `<label class="field"><span class="field-label">${label}</span><input class="input" type="${type}" name="${name}" autocomplete="${autocomplete}"${required ? ' required' : ''} /></label>`;

  return `<section class="page-hero" style="padding-bottom:0;">
<div class="page-hero-mark" data-float>${mark('', '')}</div>
<div class="container">
${eyebrow('Appointments')}
${heading('h1', 'display-2', 'Request a visit in four <em>steps.</em>')}
<ol class="progress" aria-label="Progress" data-reveal="up">
${map(steps, ([n, label], i) => `<li data-bk-indicator="${n}"${i === 0 ? ' class="is-active" aria-current="step"' : ''}><span class="bk-step-dot">${n}</span><span data-bk-label>${label}</span></li>`)}
</ol>
<div class="progress-bar" aria-hidden="true"><span data-bk-bar></span></div>
</div>
</section>
<section class="section-tight">
<div class="container layout-main">
<form data-booking method="post" action="/api/appointments" novalidate class="glass booking" data-reveal="tilt">
${honeypot}
<input type="hidden" name="reason" value="" />
<input type="hidden" name="day" value="" />
<input type="hidden" name="time" value="" />

<div data-bk-step="1" role="group" aria-labelledby="bk1-title">
<h2 id="bk1-title" class="bk-title" tabindex="-1">What do you need?</h2>
<p class="muted mt-s">Pick the closest match. We'll sort out the details when we call to confirm.</p>
<div class="options">
${map(C.BOOKING_REASONS, (r) => `<button type="button" class="option" data-bk-reason="${esc(r.label)}" aria-pressed="false"><span class="option-title">${esc(r.label)}</span><span class="option-note">${esc(r.note)}</span></button>`)}
</div>
<p class="notice">In pain right now? Don't use this form — call <a class="text-link" href="${TEL}">${P.phone}</a> and we'll find you room today.</p>
</div>

<div data-bk-step="2" role="group" aria-labelledby="bk2-title" hidden>
<h2 id="bk2-title" class="bk-title" tabindex="-1">When works for you?</h2>
<p class="muted mt-s">Weekdays, 10:00 to 6:00. Choose a day and a window — availability is confirmed by phone.</p>
<div class="days" data-bk-days></div>
<div class="field-label mt-m" style="margin-bottom:12px;">Time of day</div>
<div class="times">${map(C.BOOKING_TIMES, (t) => `<button type="button" class="time" data-bk-time="${t}" aria-pressed="false">${t}</button>`)}</div>
<div class="bk-nav">${back}<button type="button" class="btn btn-primary" data-bk-next data-magnetic>Continue${ARROW}</button></div>
</div>

<div data-bk-step="3" role="group" aria-labelledby="bk3-title" hidden>
<h2 id="bk3-title" class="bk-title" tabindex="-1">How do we reach you?</h2>
<p class="muted mt-s">A member of our staff confirms every request by phone. Please don't include health details here.</p>
<div class="form-grid form-grid-2 mt-m">
${field('Full name', 'text', 'name', 'name', true)}
${field('Phone', 'tel', 'phone', 'tel', true)}
${field('Email', 'email', 'email', 'email', false)}
${field('Insurance (optional)', 'text', 'insurance', 'off', false)}
</div>
<div class="form-msg is-error" data-bk-error role="alert" hidden></div>
<div class="bk-nav">${back}<button type="submit" class="btn btn-primary" data-bk-submit data-magnetic>Send request${ARROW}</button></div>
</div>

<div data-bk-step="4" role="group" aria-labelledby="bk4-title" hidden>
<div class="success-mark" aria-hidden="true">✓</div>
<div class="eyebrow mt-m">Request received</div>
<h2 id="bk4-title" class="bk-title mt-s" tabindex="-1">Thank you, <span data-bk-out="name">friend</span>.</h2>
<p class="muted mt-s">We'll call <span data-bk-out="phone">the number you gave us</span> within one business day to confirm. Nothing is booked until you hear from us.</p>
<dl class="deflist mt-m">
${map([['Reason', 'reason'], ['Preferred day', 'day'], ['Time of day', 'time'], ['Insurance', 'insurance']], ([k, key]) => `<div><dt>${k}</dt><dd data-bk-summary="${key}"></dd></div>`)}
</dl>
<div class="bk-nav">${btn(C.pagePath('forms'), 'Fill forms now')}<button type="button" class="btn btn-ghost" data-bk-reset>New request</button></div>
</div>
</form>
<aside class="grid" style="align-content:start;">
<div class="glass card" data-reveal="tilt">
${eyebrow('Faster options', '')}
<h2 class="display-4 mt-s">Call or text instead</h2>
<p class="card-text">The front desk answers Monday to Friday, 10:00–6:00.</p>
<div class="grid mt-m" style="gap:10px;">${btn(TEL, `Call ${P.phone}`, 'primary', '')}<a href="${SMS}" class="btn btn-ghost">Text us</a></div>
</div>
<div class="glass card" data-reveal="tilt">
${eyebrow('Office hours', '')}
<div class="mt-s">${hoursList()}</div>
</div>
</aside>
</div>
</section>`;
}

export function contact() {
  return `${pageHero({ label: 'Contact', title: 'Grand Ave, between Chino Hills Pkwy and <em>Peyton.</em>' })}
<section class="section-tight">
<div class="container grid grid-3" data-stagger>
<div class="glass card tilt" data-reveal="tilt">
${eyebrow('Address', '')}
<address class="display-4 mt-s">${P.street}<br />${P.city}, ${P.region} ${P.zip}</address>
<p class="card-text">Free parking in front of the door.</p>
<div class="card-foot"><a class="link-arrow" href="${P.mapsUrl}" target="_blank" rel="noopener">Get directions</a></div>
</div>
<div class="glass card tilt" data-reveal="tilt">
${eyebrow('Phone &amp; email', '')}
<p class="display-4 mt-s"><a href="${TEL}">${P.phone}</a></p>
<p class="card-text"><a class="text-link" href="mailto:${P.email}">${P.email}</a></p>
</div>
<div class="glass card tilt" data-reveal="tilt">
${eyebrow('Hours', '')}
<div class="mt-s">${hoursList()}</div>
</div>
</div>
</section>
<section class="section">
<div class="container grid grid-2">
<div class="media media-map" style="min-height:440px;" data-reveal="scale">${mapFrame('Map — Hillcrest Professional Center, Grand Ave')}</div>
<div class="glass card" data-reveal="tilt">
${heading('h2', 'display-3', 'Send a <em>message</em>')}
<p class="card-text" style="margin-bottom:24px;">General questions only, please — no personal health information.</p>
${leadForm({ kind: 'contact', button: 'Send message', success: 'Message sent — we reply within one business day.', fields: { nameLabel: 'Name', noteLabel: 'How can we help?', rows: 5, noteRequired: true } })}
</div>
</div>
</section>`;
}

export function blog() {
  return `${pageHero({ label: 'Patient library', title: 'Straight answers, written by the people who <em>treat</em> you.', lede: 'Six topics, organized so you can find the one that matches your situation instead of scrolling a reverse-chronological feed.' })}
<section class="section-tight" style="padding-bottom:clamp(32px,3.5vw,56px);">
<div class="container">
<div class="filters" role="toolbar" aria-label="Filter by topic" data-reveal="up">
${map(TOPICS, (t, i) => `<button type="button" class="topic${i === 0 ? ' is-on' : ''}" data-topic="${esc(t)}" aria-pressed="${i === 0}">${esc(t)}</button>`)}
</div>
<div class="grid grid-3 mt-m" data-post-grid data-stagger>
${map(POSTS, (p) => `<a href="${C.postPath(p.id)}" data-post-topic="${esc(p.topic)}" class="glass post-card tilt" data-reveal="tilt">
<div class="media">${img(C.IMAGES.posts[p.id], { sizes: '(max-width: 700px) 100vw, 400px' })}</div>
<div class="post-card-body">
<span class="eyebrow">${esc(p.topic)}</span>
<h2 class="card-title">${esc(p.title)}</h2>
<p class="card-text">${esc(p.dek)}</p>
<span class="small">${p.mins} min read · ${p.date}</span>
</div>
</a>`)}
</div>
</div>
</section>`;
}

export function post(p) {
  const related = POSTS.filter((x) => x.topic === p.topic && x.id !== p.id).concat(POSTS.filter((x) => x.topic !== p.topic)).slice(0, 2);
  const crumbs = `<a href="${C.pagePath('blog')}">Patient library</a><span class="sep">/</span><a href="${C.pagePath('blog')}?topic=${encodeURIComponent(p.topic)}">${esc(p.topic)}</a>`;
  return `<article>
<section class="page-hero" style="padding-bottom:0;">
<div class="container container-narrow">
<nav class="breadcrumb" aria-label="Breadcrumb" data-reveal="up">${crumbs}</nav>
${eyebrow(esc(p.topic))}
${heading('h1', 'display-2', esc(p.title))}
<p class="article-dek" data-reveal="up">${esc(p.dek)}</p>
<p class="mono mt-m" data-reveal="up">${p.mins} min read · ${p.date} · Reviewed by Dr. Rana Skaf, DDS</p>
</div>
</section>
<div class="container mt-l" style="max-width:1100px;">
<div class="media ratio-wide" data-reveal="scale">${img(C.IMAGES.posts[p.id], { sizes: '(max-width: 1100px) 100vw, 1100px', eager: true, parallax: true })}</div>
</div>
<div class="container container-narrow article-body">
${map(p.sections, (s) => `<section data-reveal="up"><h2>${esc(s.h)}</h2><p>${esc(s.p)}</p></section>`)}
<aside class="glass card mt-l" data-reveal="tilt">
<h2 class="display-3">${esc(p.ctaTitle)}</h2>
<p class="card-text">Dr. Skaf sees new patients Monday through Friday. Same-week openings are common.</p>
<div class="hero-actions">${btn(C.pagePath('appointments'), 'Request an appointment')}${btn(TEL, 'Call the office', 'ghost')}</div>
</aside>
</div>
</article>
<section class="section">
<div class="container container-narrow">
${sectionHead({ label: 'Keep reading', title: 'More from the <em>library</em>', size: 'display-3' })}
<div class="grid grid-2" data-stagger>
${map(related, (r) => `<a href="${C.postPath(r.id)}" class="glass card card-link tilt" data-reveal="tilt"><span class="eyebrow">${esc(r.topic)}</span><h3 class="card-title">${esc(r.title)}</h3><p class="small mt-s">${r.mins} min read</p></a>`)}
</div>
</div>
</section>`;
}

export function forms() {
  const request = (f, format) =>
    `mailto:${P.email}?subject=${encodeURIComponent(`${f.name} (${format})`)}&body=${encodeURIComponent(`Hello, please send me the ${f.name} form (${format}).\n\nName:\nPhone:\n`)}`;
  return `${pageHero({ label: 'Online forms', title: 'Paperwork, done before you <em>arrive.</em>', lede: 'Each form takes two to five minutes and is transmitted over an encrypted connection.' })}
<section class="section-tight" style="padding-bottom:clamp(32px,3.5vw,56px);">
<div class="container container-narrow grid" data-stagger>
${map(C.FORMS_LIST, (f, i) => `<div id="${f.id}" class="glass card tilt" data-reveal="tilt" style="display:flex;flex-wrap:wrap;gap:20px 32px;align-items:center;justify-content:space-between;scroll-margin-top:120px;">
<div style="flex:1 1 280px;"><span class="mono">0${i + 1}</span><h2 class="card-title" style="margin-top:10px;">${esc(f.name)}</h2><p class="card-text">${esc(f.note)}</p></div>
<div style="display:flex;gap:10px;flex-wrap:wrap;">
<a href="${esc(f.online || request(f, 'online'))}"${f.online ? ' target="_blank" rel="noopener"' : ''} class="btn btn-primary btn-sm">Fill online</a>
<a href="${esc(f.pdf || request(f, 'PDF'))}"${f.pdf ? ' target="_blank" rel="noopener"' : ''} class="btn btn-ghost btn-sm">PDF</a>
</div>
</div>`)}
</div>
</section>`;
}

export function sitemap() {
  return `${pageHero({ label: 'Site map', title: 'Every page on this <em>site.</em>' })}
<section class="section-tight" style="padding-bottom:clamp(32px,3.5vw,56px);">
<div class="container grid grid-4" data-stagger>
${map(C.SITEMAP_GROUPS, (g) => `<div class="glass card" data-reveal="tilt">
<h2 class="dd-group-title" style="padding:0 0 14px;">${esc(g.cat)}</h2>
<div class="svc-list" style="margin-top:0;">
${map(g.links, ([label, page]) => `<a href="${C.pagePath(page)}">${esc(label)}</a>`)}
${g.cat === 'Services' ? map(SERVICES, (s) => `<a href="${C.servicePath(s.id)}">${esc(s.name)}</a>`) : ''}
${g.cat === 'Library & Legal' ? map(POSTS, (p) => `<a href="${C.postPath(p.id)}">${esc(p.title)}</a>`) : ''}
</div>
</div>`)}
</div>
</section>`;
}

export function accessibility() {
  return `${pageHero({ label: 'Accessibility', title: 'Our commitment to an accessible <em>practice.</em>' })}
<section class="section-tight" style="padding-bottom:clamp(32px,3.5vw,56px);">
<div class="container container-narrow">
<div class="prose" data-reveal="up">
<p>Hillcrest Dental Studio works to meet WCAG 2.1 AA for this website and to make the office itself easy to use. The building has step-free entry from the parking lot, an accessible restroom, and operatories that accommodate wheelchairs.</p>
<p>Every page here is keyboard navigable, honors text resizing to 200%, respects your device's reduced-motion setting, and maintains a contrast ratio of at least 4.5:1 for body text. Forms use visible labels rather than placeholder-only hints.</p>
<p>If anything here is difficult to use, or you need a document in large print, call <a class="text-link" href="${TEL}">${P.phone}</a> and we'll provide it another way.</p>
</div>
<div class="glass card mt-l" data-reveal="tilt">
${eyebrow('Assistance in the office', '')}
<ul class="checklist mt-s">${map(C.ACCESS_ITEMS, (a) => `<li>${esc(a)}</li>`)}</ul>
</div>
</div>
</section>`;
}

export function thanks() {
  return `<section class="page-hero center" style="min-height:70vh;display:grid;align-items:center;">
<div class="container container-narrow">
<div class="success-mark" style="margin:0 auto 28px;" aria-hidden="true">✓</div>
${eyebrow('Received')}
${heading('h1', 'display-2', 'Thank you — we have your <em>request.</em>', ' style="margin-inline:auto;"')}
<p class="lede" style="margin-inline:auto;" data-reveal="up">A member of our staff will call within one business day to confirm your appointment. If it's urgent, please call us directly.</p>
<div class="hero-actions" style="justify-content:center;" data-reveal="up">${btn(TEL, `Call ${P.phone}`)}${btn(C.pagePath('forms'), 'Fill your forms', 'ghost')}</div>
</div>
</section>`;
}

export function notFound() {
  const link = (page, label) => `<a href="${C.pagePath(page)}">${label}</a>`;
  return `<section class="page-hero" style="min-height:80vh;">
<div class="page-hero-mark" data-float>${mark('', '')}</div>
<div class="container container-narrow">
${eyebrow('404')}
${heading('h1', 'display-2', 'That page has <em>moved.</em>')}
<p class="lede" data-reveal="up">We reorganized the site around services and topics. Here's where most people were headed:</p>
<div class="svc-list mt-m" data-reveal="up" style="max-width:520px;">
${link('services', 'All services')}
${link('appointments', 'Request an appointment')}
${link('blog', 'Patient library')}
${link('contact', 'Contact &amp; directions')}
</div>
</div>
</section>`;
}
