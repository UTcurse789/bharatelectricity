import fs from 'node:fs/promises';
import sharp from 'sharp';

const width=1200,height=630;
const artwork=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="1200" height="630" fill="white"/><rect width="1200" height="10" fill="#f56a16"/><path d="M80 365H1120" stroke="#dce6df" stroke-width="2"/><text x="80" y="440" font-family="Arial,sans-serif" font-size="43" font-weight="700" fill="#123e2a">Connecting India's energy ecosystem</text><text x="80" y="505" font-family="Arial,sans-serif" font-size="27" fill="#4d5d53">Exhibition · Conference · Industry connections</text><rect y="620" width="1200" height="10" fill="#08752c"/></svg>`);
const logo=await sharp('public/assets/bharat-electricity-logo-compact.webp').resize({width:880}).png().toBuffer();
await sharp(artwork).composite([{input:logo,left:80,top:76}]).png({compressionLevel:9}).toFile('src/app/opengraph-image.png');
await fs.copyFile('public/favicon-180.png','src/app/apple-icon.png');
await sharp('public/assets/homepage/about-bharat-electricity.png').webp({quality:82,effort:6}).toFile('public/assets/homepage/about-bharat-electricity.webp');
const original=await fs.stat('public/assets/homepage/about-bharat-electricity.png');
const optimized=await fs.stat('public/assets/homepage/about-bharat-electricity.webp');
console.log(JSON.stringify({openGraph:{width,height},appleIcon:180,introductionPhoto:{originalBytes:original.size,optimizedBytes:optimized.size}}));
