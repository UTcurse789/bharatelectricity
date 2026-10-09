import sharp from 'sharp';
import fs from 'node:fs/promises';

const source=process.argv[2];
if(!source) throw new Error('Pass the supplied energy artwork path.');
const image=sharp(source);
const metadata=await image.metadata();
const stats=await image.stats();
await fs.mkdir('public/assets/energy-introduction',{recursive:true});
for(const width of [160,320,480,768,1200,1800]) {
 await image.clone().resize({width}).webp({quality:86,alphaQuality:100}).toFile(`public/assets/energy-introduction/energy-landscape-${width}.webp`);
}
await image.clone().webp({quality:86,alphaQuality:100}).toFile('public/assets/energy-introduction/energy-landscape.webp');
console.log(JSON.stringify({width:metadata.width,height:metadata.height,hasAlpha:metadata.hasAlpha,alpha:metadata.hasAlpha?stats.channels.at(-1):null}));
