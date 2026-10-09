import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {load} from 'cheerio';

const source = 'https://www.powergen-india.com/';
const response = await fetch(source, {signal: AbortSignal.timeout(30000)});
if (!response.ok) throw new Error('Homepage source: ' + response.status);
const html = await response.text();
await fs.writeFile('research/home-redesign-source.html', html);
const dom = load(html);
const names = {
 'MNRE-Government-Support2.png': 'Ministry of New and Renewable Energy',
 'MOP-2026.png': 'Ministry of Power',
 'Government-Support-MHI-.png': 'Ministry of Heavy Industries',
 'MEA-Government-Support2.png': 'Ministry of External Affairs',
 'Government-Support-MEITY.png': 'Ministry of Electronics and Information Technology',
 'Government-Support-MOEFCC-.png': 'Ministry of Environment, Forest and Climate Change',
 'Government-Support-MOEFCC-1.png': 'Nature protects if she is protected',
 'Government-Support-MOEFCC-2.png': 'Mission LiFE: Lifestyle for Environment',
 'Bihar-2.png': 'Government of Bihar', 'Gujarat-33.png': 'Government of Gujarat',
 '5-Focus-State-Partner-2026.png': 'Government of Karnataka', 'maharstra-1.png': 'Government of Maharashtra',
 '3-Focus-State-Partner-2026.png': 'Government of Uttar Pradesh', 'bengal.png': 'Government of West Bengal',
 'Energy-Security-Partner-20261.png': 'Coal India', 'Cybersecurity-Partner2.png': '63SATS Cybertech',
 'WEB-TECHNOLOGY-PARTNER.png': 'Schneider Electric', 'HOST-UTILITY-2026-1-.png': 'BSES Rajdhani Power Limited',
 'HOST-UTILITY-2026-2-.png': 'BSES Yamuna Power Limited', 'CO-HOST-UTILITIES1.png': 'Tata Power-DDL',
 'Web-Partner-Utility3.png': 'CESC Limited', 'Web-Solar-Eco3.png': 'RPSG Solvanta',
 'RENEWABLE-ENERGY-PARTNER3333.png': 'Purvah Green', 'Lanyard-Partner-2026.png': '63SATS Cybertech',
 'Delaget-Kit-Partner.png': 'Schneider Electric', 'Web-Integrated-Energy-Security-Partner.png': 'NLC India',
 'Web-Rec.png': 'REC Limited', 'NTPC-Industry-Partner.png': 'NTPC', 'De.png': 'ReNew', 'Web.png': '.Kreate',
 'national-skilling-partner.png': 'Ministry of Skill Development and Entrepreneurship',
 'RPG.png': 'RPG Power Trading', 'WEB-2026-EXCHANGE-PARTNER-2.png': 'Multi Commodity Exchange of India',
 'HPX.png': 'Hindustan Power Exchange', 'IEX.png': 'Indian Energy Exchange', 'IGX.png': 'Indian Gas Exchange',
 'Investment-Facilitation-Partner2.png': 'Invest India', 'Digital-Skilling-Partner.png': 'nasscom FutureSkills Prime',
 'WEB-NuclearX-PARTNER-CE.png': 'CEI', 'WEB-NuclearX-PARTNER-EDF-2.png': 'EDF',
 'BELL-COOLING-TOWER-2026-1-.png': 'Bell Cooling Towers', 'Etapro.png': 'EtaPRO',
 'Grid-India-20261.png': 'Grid Controller of India', 'Green-Power.png': 'Green Power International',
 'KBL.png': 'Kirloskar Brothers', 'Toshiba2-2-.png': 'Toshiba', 'WOG-2026-1-.png': 'WOG',
 'WOG-Carbon.png': 'WOG Green Coal', 'WOG-GREEN-COIL.png': 'WOG Green Coal',
 'Host-Publication-4.png': 'ENERGDIVE', '5-Enlit-Asia.jpg': 'Enlit Asia',
 '6-Dtech-Northeast.jpg': 'DTECH Northeast', '7-Enlit-europe.jpg': 'Enlit Europe',
 'POWERGEN-INTERNATIONAL-2027.png': 'POWERGEN International', 'DTECH-2027.png': 'DTECH',
 'Enlit-Africa-2027.png': 'Enlit Africa', '3-Dtech-Data-Center.jpg': 'DTECH Data Centers & AI'
};
const groups = [];
dom('h3').each((_, heading) => {
 const title = dom(heading).text().trim().replace(/\s+/g, ' ');
 if (!/^(GOVERNMENT SUPPORT|Focus States|Global Footprint|Host Publication)$/.test(title) && !/Partner|Utilities|Utility/.test(title)) return;
 const images = dom(heading).closest('article').find('img').map((_, image) => {
  const url = dom(image).attr('src');
  if (!url?.startsWith('https://cdn.asp.events/')) return null;
  const file = decodeURIComponent(new URL(url).pathname.split('/').pop());
  const href = dom(image).closest('a').attr('href');
  return {file, source: url, name: names[file] || dom(image).attr('alt') || title + ' published artwork', href: href ? new URL(href, source).href : null};
 }).get();
 if (images.length) groups.push({title, logos: images});
});
await fs.mkdir('public/assets/homepage', {recursive: true});
await fs.mkdir('research/assets-candidates/homepage', {recursive: true});
const unique = new Map(groups.flatMap(group => group.logos).map(asset => [asset.source, asset]));
// Work in small batches so the CDN and image processing do not compete with the app.
const assets = [...unique.values()];
for (let offset = 0; offset < assets.length; offset += 6) {
 const results = await Promise.allSettled(assets.slice(offset, offset + 6).map(async asset => {
  const cached = path.join('research/assets-candidates/homepage', asset.file);
  let bytes = await fs.readFile(cached).catch(() => null);
  if (!bytes) {
   const result = await fetch(asset.source, {signal: AbortSignal.timeout(30000)});
   if (!result.ok) throw new Error(asset.file + ': ' + result.status);
   bytes = Buffer.from(await result.arrayBuffer());
   await fs.writeFile(cached, bytes);
  }
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 10);
  const slug = asset.file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
  const target = `${slug}-${hash}.webp`;
  const info = await sharp(bytes).trim({threshold: 8}).resize({width: 640, height: 400, fit: 'inside', withoutEnlargement: true}).webp({quality: 88}).toFile(path.join('public/assets/homepage', target));
  Object.assign(asset, {src: '/assets/homepage/' + target, width: info.width, height: info.height});
 }));
 const failure = results.find(result => result.status === 'rejected');
 if (failure) throw failure.reason;
}
for (const group of groups) group.logos = group.logos.map(asset => unique.get(asset.source));
await fs.writeFile('src/content/homepage-partners.json', JSON.stringify({source, edition: 2026, verifiedAt: '2026-10-09', groups}, null, 2) + '\n');
console.log(JSON.stringify({groups: groups.length, uniqueAssets: assets.length}));
