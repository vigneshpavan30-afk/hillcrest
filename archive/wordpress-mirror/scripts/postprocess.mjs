// Replaces WordPress-only behaviour in the mirrored HTML with local equivalents.
// Usage: node scripts/postprocess.mjs   (safe to run repeatedly)
import fs from 'node:fs/promises';
import path from 'node:path';

const SITE = path.resolve('site');

async function* htmlFiles(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'wp-content' && entry.name !== 'wp-includes') yield* htmlFiles(full);
    } else if (entry.name.endsWith('.html')) {
      yield full;
    }
  }
}

let changed = 0;
for await (const file of htmlFiles(SITE)) {
  const original = await fs.readFile(file, 'utf8');
  let html = original
    // Gravity Forms reCAPTCHA is bound to the WordPress backend; the local form uses a honeypot instead.
    .replace(/<script[^>]*id="gforms_recaptcha_recaptcha-js-extra"[^>]*>[\s\S]*?<\/script>\s*/g, '')
    .replace(/<script[^>]*id="gforms_recaptcha_recaptcha-js"[^>]*>[\s\S]*?<\/script>\s*/g, '');

  if (html.includes("id='gform_1'")) {
    html = html
      .replace(
        /<form method='post' enctype='multipart\/form-data'\s+id='gform_1'\s+action='[^']*'/,
        "<form method='post' enctype='application/x-www-form-urlencoded' id='gform_1' action='/api/appointments'"
      )
      .replace(/ onclick='gform\.submission\.handleButtonClick\(this\);'/, '');
    if (!html.includes('/local/appointment-form.js')) {
      html = html.replace('</body>', '<script src="/local/appointment-form.js" defer></script>\n</body>');
    }
  }

  if (html !== original) {
    await fs.writeFile(file, html);
    changed++;
  }
}

await fs.mkdir(path.join(SITE, 'local'), { recursive: true });
await fs.copyFile(path.resolve('src/appointment-form.js'), path.join(SITE, 'local/appointment-form.js'));
console.log(`Post-processed ${changed} HTML files.`);
