// Generates web-sized thumbnails for everything in public/contents and writes
// image dimensions to src/data/image-meta.json so layouts never shift.
// Originals are kept untouched and only loaded in the lightbox.
import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "public", "contents");
const OUT_DIR = path.join(ROOT, "public", "thumbs");
const META_FILE = path.join(ROOT, "src", "data", "image-meta.json");
const MAX_WIDTH = 1200;
const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg", ".gif"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

async function isFresh(src, out) {
  try {
    const [a, b] = await Promise.all([stat(src), stat(out)]);
    return b.mtimeMs >= a.mtimeMs;
  } catch {
    return false;
  }
}

const meta = {};
let generated = 0;

for await (const file of walk(SRC_DIR)) {
  const rel = path.relative(SRC_DIR, file).split(path.sep).join("/");
  const thumbRel = rel.replace(/\.[^.]+$/, ".webp");
  const out = path.join(OUT_DIR, thumbRel);
  const animated = file.toLowerCase().endsWith(".gif");

  const { width, height } = await sharp(file).metadata();
  // For animated GIFs metadata().height is a single frame's height (pageHeight).
  const info = await sharp(file, { animated }).metadata();
  const h = info.pageHeight ?? height;

  const tw = Math.min(width, animated ? 640 : MAX_WIDTH);
  const th = Math.round((h / width) * tw);

  if (!(await isFresh(file, out))) {
    await mkdir(path.dirname(out), { recursive: true });
    await sharp(file, { animated, limitInputPixels: false })
      .resize({ width: tw, withoutEnlargement: true })
      .webp({ quality: animated ? 60 : 78, effort: 5 })
      .toFile(out);
    generated++;
  }

  meta[`/contents/${rel}`] = {
    width,
    height: h,
    thumb: `/thumbs/${thumbRel}`,
    thumbWidth: tw,
    thumbHeight: th,
  };
}

await mkdir(path.dirname(META_FILE), { recursive: true });
await writeFile(META_FILE, JSON.stringify(meta, null, 2) + "\n");
console.log(`thumbs: ${Object.keys(meta).length} images, ${generated} regenerated`);
