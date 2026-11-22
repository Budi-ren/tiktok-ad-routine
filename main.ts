// Morning Routine — bring-the-humans-03 entry (Node 22, standard library only).
// Copies VIDEO.json from the repository root to /output/VIDEO.json, where the
// gate reads it. Validates that the address is a full TikTok video address
// (https://www.tiktok.com/@<handle>/video/<digits>) and prints a summary.
// The placeholder VIDEO.json this repo ships still copies fine; replace it
// with the real posted video's address before submitting.
//
// Run locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const VIDEO_RE = /^https:\/\/www\.tiktok\.com\/@[A-Za-z0-9._-]+\/video\/\d+$/;

const src = join(BOT_DIR, 'VIDEO.json');
let video;
try {
  video = JSON.parse(readFileSync(src, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof video.url !== 'string' || !VIDEO_RE.test(video.url)) {
  console.error(`VIDEO.json url is not a full TikTok video address: ${JSON.stringify(video.url)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(src, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied to ${OUTPUT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`VIDEO.json copied to ${OUTPUT_DIR}/VIDEO.json`);
console.log(`video: ${video.url}`);
if (video.url.includes('/video/0000000000000000000')) {
  console.log('note: VIDEO.json still holds the placeholder address — replace it with the posted video before submitting.');
}
