import fs from 'node:fs/promises';
import sharp from 'sharp';

// Transcripts were checked against the complete official speaker artwork.
// Keep the reviewed manifest so repeat runs do not depend on OCR or guess names.
const manifest = JSON.parse(await fs.readFile('src/content/speaker-artwork-sources.json', 'utf8'));
const data = JSON.parse(await fs.readFile('src/content/imported.json', 'utf8'));
await fs.mkdir('public/assets/speakers-2025', {recursive: true});
let cursor = 0;
await Promise.all(Array.from({length: 6}, async () => {
 while (cursor < manifest.records.length) {
  const record = manifest.records[cursor++];
  if (await fs.stat('public' + record.src).catch(() => null)) continue;
  const response = await fetch(record.source);
  if (!response.ok) throw new Error(`Speaker artwork: HTTP ${response.status}`);
  await sharp(Buffer.from(await response.arrayBuffer())).webp({quality: 90}).toFile('public' + record.src);
 }
}));
const unique = [...new Map(manifest.records.map(record => [record.personId, record])).values()];
for (const record of unique) {
 let person = data.people.find(item => item.id === record.personId);
 if (!person) {
  const photo = '/assets/speakers-2025/' + record.hash + '-portrait.webp';
  await sharp('public' + record.src).extract({left: 5, top: 5, width: record.width - 10, height: Math.min(430, record.height - 120)}).webp({quality: 90}).toFile('public' + photo);
  person = {id: record.personId, name: record.name, photo, source: manifest.source};
  data.people.push(person);
 }
 if (!person.photo) {
  const photo = '/assets/speakers-2025/' + record.hash + '-portrait.webp';
  await sharp('public' + record.src).extract({left: 5, top: 5, width: record.width - 10, height: Math.min(430, record.height - 120)}).webp({quality: 90}).toFile('public' + photo);
  person.photo = photo;
 }
 if (!data.appearances.some(item => item.personId === person.id && item.kind === 'speaker' && item.edition === manifest.edition)) {
  data.appearances.push({personId: person.id, edition: manifest.edition, kind: 'speaker', role: 'Speaker', designation: record.designation});
 }
}
await fs.writeFile('src/content/imported.json', JSON.stringify(data, null, 2) + '\n');
console.log({publishedCards: manifest.publishedCards, uniqueSpeakers: unique.length, speakerAppearances: data.appearances.filter(item => item.kind === 'speaker').length});
