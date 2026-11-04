import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const output='public/assets/2027-refresh';
await fs.mkdir(output,{recursive:true});
const assets=[
 ['IMG 1-On-the-exhibition-floor.png','exhibition-floor',1200],
 ['IMG 2-Across-the-community.png','community-conversations',1200],
 ['IMG-3--Across-the-community.png','community-performance',1200],
 ['2027-Event-Brochure-Cover-image.png','event-brochure-2027',1500],
 ['Partnership-Brochure-–-Cover-image.png','partnership-brochure-2027',1500],
 ['Brainstem Technologies Logo.png','brainstem-technologies',1000],
 ['Transter Logo.png','tranter-india',1600],
];
const manifest=[];
for(const [file,name,width] of assets){
 const source=path.join('C:/Users/ASUS/Downloads',file);
 const target=path.join(output,name+'.webp');
 const info=await sharp(source).rotate().resize({width,withoutEnlargement:true}).webp({quality:88}).toFile(target);
 manifest.push({src:'/assets/2027-refresh/'+name+'.webp',source:file,width:info.width,height:info.height});
 if(!/brainstem|tranter/.test(name))for(const size of [160,320,480,768,1200,1800])await sharp(source).rotate().resize({width:size,withoutEnlargement:true}).webp({quality:85}).toFile(path.join(output,name+'-'+size+'.webp'));
}
await fs.writeFile('src/content/refresh-2027-assets.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Prepared '+manifest.length+' supplied images and responsive variants.');
