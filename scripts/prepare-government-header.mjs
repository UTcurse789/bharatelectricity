import fs from 'node:fs/promises';
import sharp from 'sharp';

// Preserve the supplied artwork; generate web-sized copies and its central mobile masthead.
const original = 'C:/Users/ASUS/Downloads/Header For BE.png';
const target = 'public/assets/government-header';
await fs.mkdir(target, {recursive: true});
const metadata = await sharp(original).metadata();
for (const width of [160, 320, 480, 768, 1200, 1800, 2400]) {
 await sharp(original).flatten({background: '#fff'}).resize({width}).webp({quality: 90}).toFile(`${target}/support-${width}.webp`);
}
await sharp(original).flatten({background: '#fff'}).resize({width: 2400}).webp({quality: 90}).toFile(`${target}/support.webp`);
await sharp(original).flatten({background: '#fff'}).extract({left: 5600, top: 0, width: 3200, height: 2020}).resize({width: 640}).webp({quality: 92}).toFile(`${target}/masthead-mobile.webp`);
const manifest = JSON.parse(await fs.readFile('src/content/header-assets.json', 'utf8'));
manifest.banner = {src: '/assets/government-header/support.webp', width: metadata.width, height: metadata.height, mobileSrc: '/assets/government-header/masthead-mobile.webp', mobileWidth: 640, mobileHeight: 404, source: 'User supplied Header For BE.png'};
await fs.writeFile('src/content/header-assets.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Prepared supplied header (${metadata.width} × ${metadata.height}) for desktop and mobile.`);
