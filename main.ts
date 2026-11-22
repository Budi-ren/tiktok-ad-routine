// Morning Routine — bring-the-humans-03 entry (Node 22, standard library only).
// Copies VIDEO.json from the repository root to /output/VIDEO.json, where the
// gate reads it. Validates that the address is a full TikTok video address
// (https://www.tiktok.com/@<handle>/video/<digits>) posted from this entry's
// account and prints a summary. TikTok renamed that account mid-upload from
// @Approximatelly6 to @approximatelly888, so both handles name the same
// account and either form of the video's address is accepted below.
// The placeholder VIDEO.json this repo ships still refuses to copy; replace it
// with the real posted video's address before submitting.
//
// Run locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
// The account's handle at posting time, and its handle after TikTok renamed
// it mid-upload: one account, two names, both accepted.
const HANDLES = ['@Approximatelly6', '@approximatelly888'];
const VIDEO_RE = /^https:\/\/www\.tiktok\.com\/@([A-Za-z0-9._]+)\/video\/([0-9]+)$/;

const src = join(BOT_DIR, 'VIDEO.json');
let video;
try {
  video = JSON.parse(readFileSync(src, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof video.url !== 'string') {
  console.error(`VIDEO.json url is not a string: ${JSON.stringify(video.url)}`);
  process.exit(1);
}
const match = VIDEO_RE.exec(video.url);
if (!match) {
  console.error(`VIDEO.json url is not a full TikTok video address: ${JSON.stringify(video.url)}`);
  process.exit(1);
}
if (!HANDLES.includes(`@${match[1]}`)) {
  console.error(`VIDEO.json url names @${match[1]} but this entry posts from ${HANDLES.join(' or ')}`);
  process.exit(1);
}
if (/^0+$/.test(match[2])) {
  console.error('VIDEO.json url still holds the placeholder video id; replace it with the posted video\'s address before submitting.');
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
