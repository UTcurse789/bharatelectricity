import fs from 'node:fs/promises';
import sharp from 'sharp';
import {createHash} from 'node:crypto';

const homepage = JSON.parse(await fs.readFile('src/content/homepage-partners.json', 'utf8'));
const reference = JSON.parse(await fs.readFile('src/content/reference-pages.json', 'utf8'));
const target = 'public/assets/partner-originals';
await fs.mkdir(target, {recursive: true});
const records = [];
const ministry = homepage.groups.find(group => group.title === 'GOVERNMENT SUPPORT').logos;
const main2025 = reference.find(page => page.path === '/partners-2025').sections[0].images;
for (const item of [...ministry, ...main2025]) {
 const response = await fetch(item.source);
 if (!response.ok) throw new Error(`Artwork source returned ${response.status}: ${item.source}`);
 const bytes = Buffer.from(await response.arrayBuffer());
 const original = await sharp(bytes).metadata();
 const id = createHash('sha256').update(item.source).digest('hex').slice(0, 14);
 const src = `/assets/partner-originals/${id}.webp`;
 // Native source pixels, with only external white margins removed. Never upscale artwork.
 await sharp(bytes).flatten({background: '#fff'}).trim({background: '#fff', threshold: 12}).webp({lossless: true}).toFile('public' + src);
 const output = await sharp('public' + src).metadata();
 records.push({previousSrc: item.src, source: item.source, src, width: output.width, height: output.height, originalWidth: original.width, originalHeight: original.height, name: item.name || 'Bharat Electricity 2025 main partner artwork'});
 console.log(JSON.stringify(records.at(-1)));
}
await fs.writeFile('src/content/partner-artwork-upgrades.json', JSON.stringify(records, null, 2) + '\n');
