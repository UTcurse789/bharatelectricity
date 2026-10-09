import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const cache = 'research/assets-candidates/carousel';
const output = 'public/assets/carousel';
const widths = [160, 320, 480, 768, 1200, 1800];
const cdn = 'https://cdn.asp.events/CLIENT_Synergy__560AF404_5056_B739_54C920F16E9738F6/sites/Powergen-India-2019/media/';
await fs.mkdir(cache, {recursive: true});
await fs.mkdir(output, {recursive: true});
const reportSource = path.join(cache, 'report-stack.png');
if (process.argv[2]) await fs.copyFile(path.resolve(process.argv[2]), reportSource);
if (!await fs.stat(reportSource).catch(() => null)) throw new Error('Pass the original report image path as the first argument.');

const sources = [
 {id: 'report', slug: 'report-stack', file: 'report-stack.png', quality: 83, source: 'User-supplied 2025 post-show report artwork'},
 {id: 'reportBackground', slug: 'earth-background', file: '2.2-26-SLIDER.png', quality: 73, source: cdn + '2.2-26-SLIDER.png'},
 {id: 'awardsBackground', slug: 'awards-background', file: '3-26-SLIDER.png', quality: 73, source: cdn + '3-26-SLIDER.png'},
 {id: 'powerBackground', slug: 'exhibition-background', file: '4-26-SLIDER.png', quality: 73, source: cdn + '4-26-SLIDER.png'},
 {id: 'opportunitiesBackground', slug: 'council-background', file: '5-26-SLIDER.png', quality: 73, source: cdn + '5-26-SLIDER.png'},
 {id: 'exhibitBackground', slug: 'summit-background', file: '6-26-SLIDER.png', quality: 73, source: cdn + '6-26-SLIDER.png'},
];
const images = {};
for (const asset of sources) {
 const input = path.join(cache, asset.file);
 if (!await fs.stat(input).catch(() => null)) {
  const response = await fetch(asset.source + '/fit-in/1800x9999/filters:no_upscale()', {signal: AbortSignal.timeout(30000)});
  if (!response.ok) throw new Error(asset.file + ': ' + response.status);
  await fs.writeFile(input, Buffer.from(await response.arrayBuffer()));
 }
 const bytes = await fs.readFile(input);
 const recipe = {quality: asset.quality, widths, version: 1};
 const hash = createHash('sha256').update(bytes).update(JSON.stringify(recipe)).digest('hex').slice(0, 10);
 const name = asset.slug + '-' + hash;
 const original = await sharp(bytes).metadata();
 const defaultWidth = asset.id === 'report' ? 1200 : 1800;
 const results = await Promise.allSettled([...widths, null].map(async width => {
  const file = name + (width ? '-' + width : '') + '.webp';
  const result = await sharp(bytes).rotate().resize({width: width || defaultWidth, withoutEnlargement: true}).webp({quality: asset.quality, effort: 5}).toFile(path.join(output, file));
  return {width: result.width, height: result.height, bytes: result.size};
 }));
 const failure = results.find(result => result.status === 'rejected');
 if (failure) throw failure.reason;
 const defaultImage = results.at(-1).value;
 images[asset.id] = {src: '/assets/carousel/' + name + '.webp', width: defaultImage.width, height: defaultImage.height, source: asset.source};
 console.log(JSON.stringify({asset: asset.id, originalBytes: bytes.length, desktopBytes: defaultImage.bytes, mobileBytes: results[2].value.bytes, originalWidth: original.width}));
}
await fs.writeFile('src/content/carousel-images.json', JSON.stringify(images, null, 2) + '\n');
