import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import sharp from 'sharp';

// Match the name printed next to each portrait; never infer identity from filenames.
const source = 'https://www.powergen-india.com/';
const dom = load(await fs.readFile('research/home-redesign-source.html', 'utf8'));
const content = JSON.parse(await fs.readFile('src/content/imported.json', 'utf8'));
const normalize = name => name.replace(/\s+/g, ' ').trim().toLowerCase();
const article = dom('h3').filter((_, el) => dom(el).text().includes('Governing Council Members 2026')).closest('article');
const portraits = article.find('li').map((_, el) => {
 const caption = dom(el).find('.w-icatcher-carousel__list__item__body__caption');
 const role = caption.find('strong').text().trim();
 const lines = load((caption.html() || '').replace(/<br\s*\/?\s*>/gi, '\n')).text().split('\n').map(line => line.replace(/\s+/g, ' ').trim()).filter(line => line && line !== role);
 return {name: dom(el).find('h2').text().replace(/\s+/g, ' ').trim(), source: dom(el).find('img').attr('src'), role, designation: lines.join(', ')};
}).get();
const addedPeople = [];
for (const portrait of portraits) {
 if (content.people.some(person => normalize(person.name) === normalize(portrait.name))) continue;
 const id = normalize(portrait.name).replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
 content.people.push({id, name: portrait.name, photo: '', source});
 content.appearances.push({personId: id, edition: 2026, kind: 'council', role: portrait.role, designation: portrait.designation});
 addedPeople.push(portrait.name);
}
const matches = portraits.map(portrait => ({...portrait, person: content.people.find(person => normalize(person.name) === normalize(portrait.name))})).filter(item => item.person && !item.person.photo);
const previous = await fs.readFile('src/content/council-portrait-sources.json', 'utf8').then(JSON.parse).catch(() => ({portraits: []}));
const manifest = previous.portraits;
await fs.mkdir('research/assets-candidates/council', {recursive: true});
for (const item of matches) {
 const file = decodeURIComponent(new URL(item.source).pathname.split('/').pop());
 const cache = path.join('research/assets-candidates/council', file);
 let bytes = await fs.readFile(cache).catch(() => null);
 if (!bytes) {
  const response = await fetch(item.source, {signal: AbortSignal.timeout(30000)});
  if (!response.ok) throw new Error(item.name + ': ' + response.status);
  bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(cache, bytes);
 }
 const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 10);
 const target = item.person.id + '-' + hash + '.webp';
 const info = await sharp(bytes).resize({width: 640, height: 640, fit: 'inside', withoutEnlargement: true}).webp({quality: 88}).toFile('public/assets/homepage/' + target);
 item.person.photo = '/assets/homepage/' + target;
 manifest.push({personId: item.person.id, name: item.name, source: item.source, src: item.person.photo, width: info.width, height: info.height});
}
if (matches.length) {
 await fs.writeFile('src/content/imported.json', JSON.stringify(content, null, 2) + '\n');
 await fs.writeFile('src/content/council-portrait-sources.json', JSON.stringify({source, edition: 2026, verifiedAt: '2026-10-09', portraits: manifest}, null, 2) + '\n');
}
console.log(JSON.stringify({matchedMissingPortraits: matches.length, addedPeople}));
