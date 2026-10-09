import fs from 'node:fs/promises';
import sharp from 'sharp';

const bannerPath = 'C:/Users/ASUS/OneDrive/Pictures/Screenshots/Screenshot 2026-10-09 111246.png';
const iconPath = 'C:/Users/ASUS/Downloads/Fevicon.png';
const banner = await fs.readFile(bannerPath);
const icon = await fs.readFile(iconPath);
const info = await sharp(banner).webp({quality: 95}).toFile('public/assets/government-support-banner.webp');
await sharp(icon).resize(64, 64).png().toFile('src/app/icon.png');
await Promise.all([16, 32, 48, 180].map(size => sharp(icon).resize(size, size).png().toFile('public/favicon-' + size + '.png')));
const icons = await Promise.all([16, 32, 48].map(size => sharp(icon).resize(size, size).png().toBuffer()));
const directory = Buffer.alloc(6 + icons.length * 16);
directory.writeUInt16LE(1, 2); directory.writeUInt16LE(icons.length, 4);
let offset = directory.length;
icons.forEach((bytes, index) => {
 const start = 6 + index * 16, size = [16, 32, 48][index];
 directory[start] = size; directory[start + 1] = size;
 directory.writeUInt16LE(1, start + 4); directory.writeUInt16LE(32, start + 6);
 directory.writeUInt32LE(bytes.length, start + 8); directory.writeUInt32LE(offset, start + 12);
 offset += bytes.length;
});
await fs.writeFile('src/app/favicon.ico', Buffer.concat([directory, ...icons]));
await fs.writeFile('src/content/header-assets.json', JSON.stringify({
 banner: {src: '/assets/government-support-banner.webp', width: info.width, height: info.height, source: 'User supplied government support banner: Screenshot 2026-10-09 111246.png'},
 favicon: {source: 'User supplied Fevicon.png', sizes: [16, 32, 48, 64, 180]}
}, null, 2) + '\n');
console.log(JSON.stringify({banner: {width: info.width, height: info.height}, icons: [16, 32, 48, 64, 180]}));
