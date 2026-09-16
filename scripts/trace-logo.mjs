// Traces the tooth mark from the practice logo PNG into an SVG (src/assets/logo-mark.svg).
// The SVG drives the crisp header logo and the extruded 3D hero sculpture.
// Usage: node scripts/trace-logo.mjs   (only needed when the logo artwork changes)
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import potrace from 'potrace';
import { LOGO } from '../src/content/site.mjs';

const OUT = path.resolve('src/assets/logo-mark.svg');
const SIZE = 1200;

// Mark pixels (white with alpha in the source) become black on white, which potrace expects.
const { data: alpha, info } = await sharp(path.resolve(LOGO.src))
  .extract(LOGO.markCrop).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
const inverted = alpha.map((a) => 255 - a);
const gray = await sharp(inverted, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
const trimmed = await sharp(gray).toColourspace('srgb')
  .trim({ background: '#ffffff', threshold: 10 })
  .extend({ top: 20, bottom: 20, left: 20, right: 20, background: '#ffffff' })
  .resize({ width: SIZE, height: SIZE, fit: 'inside', background: '#ffffff' })
  .flatten({ background: '#ffffff' })
  .png().toBuffer();

const svg = await new Promise((resolve, reject) =>
  potrace.trace(trimmed, { threshold: 128, turdSize: 40, optTolerance: 0.4, color: '#08405F', background: 'transparent' }, (err, out) =>
    err ? reject(err) : resolve(out)));

await fs.writeFile(OUT, svg);
const d = svg.match(/ d="([^"]+)"/)?.[1] || '';
console.log(`Wrote ${path.relative('.', OUT)} (${svg.length} bytes, ${(d.match(/M/g) || []).length} subpaths)`);
