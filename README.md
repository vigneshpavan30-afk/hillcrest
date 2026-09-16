# Hillcrest Dental Studio website

The production site built from the redesign in `design/` (open `design/Hillcrest Redesign.dc.html` to see the original mockups).

```bash
npm install
npm run build   # renders ./public (41 pages + 404, optimized images, sitemap, redirects)
npm start       # http://localhost:4321  (set PORT to change)
npm test        # browser checks against the running server (uses installed Edge/Chrome)
```

## What's where
| Path | Purpose |
|---|---|
| `src/content/design-data.mjs` | Services, articles and topics, copied verbatim from the design |
| `src/content/site.mjs` | Practice details, URLs, redirects, image choices, page copy lists, SEO titles |
| `src/render.mjs` | HTML templates for every page (markup and styles follow the design) |
| `src/assets/site.css`, `site.js` | Hover states, responsive header, menus, booking flow, forms, library filter |
| `scripts/build.mjs` | Static build into `public/` |
| `server.mjs` | Serves `public/`, applies redirects, handles form submissions |
| `tests/e2e.mjs` | End-to-end browser checks |
| `archive/wordpress-mirror/` | The earlier copy of the WordPress site; its photos are reused by the build |

## URLs and SEO
Every page keeps its current live URL (`/appointments/`, `/dental-implants/`, …). The 34 old blog posts and URL aliases
redirect (301) to the closest new article or service page (`REDIRECTS` in `src/content/site.mjs`). Pages include titles,
descriptions, canonical and Open Graph tags, and JSON-LD for the dentist, service FAQs, breadcrumbs and articles.

## Forms
- **Appointments** (4-step flow) → `POST /api/appointments` → `data/appointments.jsonl`
- **Callback** (service pages) and **Contact** messages → `POST /api/messages` → `data/messages.jsonl`

Both validate on the client and the server. They also use a honeypot field and a rate limit (8 posts per IP per 10 minutes),
and they still work with JavaScript turned off.

To get notified, set any of the following:

| Variable | Purpose |
|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | SMTP server for email notifications |
| `NOTIFY_TO`, `NOTIFY_FROM` | Who receives the emails, and the sender address |
| `NOTIFY_WEBHOOK_URL` | Each submission POSTed as JSON (Zapier, Make, CRM…) |
| `TRUST_PROXY=true` | Use `X-Forwarded-For` for the client IP when behind a proxy/CDN |

## Needs input from the practice
- **Online forms:** set `online` / `pdf` links in `FORMS_LIST` (`src/content/site.mjs`). Until then, both buttons open an
  email request to the office.
- **Gallery photos** are stand-ins taken from the old site, not photos of the actual office. Swap them in `IMAGES.gallery`.
- **Design copy to verify before launch:** the review count, credentials, insurance plans, technology (CT, microscope),
  membership plan and accessibility claims.
