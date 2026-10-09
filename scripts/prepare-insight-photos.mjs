import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sources = JSON.parse(await fs.readFile('research/assets-candidates/selected-exhibition-2025-sources.json', 'utf8'));
const descriptions = {
 '029': 'Visitors and exhibitors discussing equipment at the 2025 exhibition',
 '046': 'Industry delegates walking through technology displays at the 2025 exhibition',
 '063': 'Visitors exploring stands across the 2025 exhibition hall',
 '087': 'A busy gathering of industry participants on the 2025 exhibition floor',
 '088': 'Attendees walking between energy technology stands at the 2025 exhibition'
};
const photos = [];
for (const source of sources) {
 const filename = path.basename(source.file);
 const id = filename.match(/(\d+)\.jpg$/)[1];
 const bytes = await fs.readFile('research/assets-candidates/' + filename);
 const name = 'exhibition-2025-' + id;
 const info = await sharp(bytes).resize({width: 1800, withoutEnlargement: true}).webp({quality: 83}).toFile('public/assets/' + name + '.webp');
 await Promise.all([160, 320, 480, 768, 1200, 1800].map(width => sharp(bytes).resize({width, withoutEnlargement: true}).webp({quality: 80}).toFile('public/assets/' + name + '-' + width + '.webp')));
 photos.push({src: '/assets/' + name + '.webp', width: info.width, height: info.height, alt: descriptions[id], edition: 2025, source: source.url, sourceAlbum: source.sourceAlbum, sourcePage: source.sourcePage});
}
await fs.writeFile('src/content/insight-photos.json', JSON.stringify({photos}, null, 2) + '\n');
console.log(JSON.stringify({photos: photos.length}));
