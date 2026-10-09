import fs from 'node:fs/promises';
import sharp from 'sharp';
import {load} from 'cheerio';

const directory='public/assets/legacy-2025';
await fs.mkdir(directory,{recursive:true});
const screenshots={government:'174306',focus:'174319',statistics:'174340',demographics:'174353','feedback-1':'174407','feedback-2':'174418',voices:'174504'};
const references={};
for(const [key,time] of Object.entries(screenshots)){
 const source='C:/Users/ASUS/OneDrive/Pictures/Screenshots/Screenshot 2026-10-09 '+time+'.png';
 const src='/assets/legacy-2025/source-'+key+'.webp';
 const {width,height}=await sharp(source).metadata();
 await sharp(source).webp({quality:93}).toFile('public'+src);
 references[key]={src,width,height,source};
}
// Original chart pixels only: no reconstructed slices or missing values.
const crops={
 segments:{source:'feedback-1',left:2,top:90,width:298,height:224},
 aspects:{source:'feedback-1',left:314,top:90,width:300,height:224},
 registration:{source:'feedback-1',left:625,top:90,width:299,height:224},
 panels:{source:'feedback-1',left:305,top:338,width:297,height:224},
 locations:{source:'feedback-2',left:497,top:340,width:296,height:224}
};
for(const [key,{source,...crop}]of Object.entries(crops)){
 const src='/assets/legacy-2025/chart-'+key+'.webp';
 await sharp('public'+references[source].src).extract(crop).webp({lossless:true}).toFile('public'+src);
 references['chart-'+key]={src,width:crop.width,height:crop.height,source:references[source].source,crop};
}
// A genuine national emblem extracted from the existing official ministry asset.
await sharp('public/assets/homepage/mnre-government-support2-3e505f4936.webp').extract({left:128,top:0,width:178,height:285}).webp({lossless:true}).toFile(directory+'/national-emblem.webp');
const manifest=JSON.parse(await fs.readFile('src/content/speaker-artwork-sources.json','utf8'));
const portraits={};
for(const [id,personId]of Object.entries({bhalla:'shri-bhupinder-singh-bhalla-ias-retd',prasad:'shri-ghanshyam-prasad',kalirajan:'dr-kalirajan-s',kumar:'shri-ravindra-kumar'})){
 const artwork=manifest.records.find(record=>record.personId===personId);
 const src='/assets/legacy-2025/speaker-'+id+'.webp';
 await sharp('public'+artwork.src).extract({left:5,top:5,width:artwork.width-10,height:Math.min(430,artwork.height-120)}).webp({quality:90}).toFile('public'+src);
 portraits[id]={src,alt:artwork.name+' in the original 2025 speaker artwork',source:artwork.source};
}
const album='https://photos.app.goo.gl/B84DWBDPtEAD4tK57';
const $=load(await fs.readFile('research/legacy-2025-awards-album.html','utf8'));
if(!$('title').text().includes('Bharat Electricity 2025 - Awards & Gala'))throw new Error('Wrong awards album');
const urls=$('img.hKgQud').slice(0,12).map((i,image)=>$(image).attr('src').replace(/=w\d+-h\d+-no$/,'=w800-h800-no')).get();
const awardDescriptions=['Outstanding Product Showcase award recipients','Best Innovative Stall Design award recipients','Safety Partner of the Year award recipients','National digital skilling award recipients','Digital Transformation Partner award recipients','Decarbonisation Partner award recipients','EPC of the Year thermal power award recipients','EPC of the Year renewable energy award recipients','Power Exchange of the Year award recipients','State transmission company award recipients','Transmission company award recipients','Power Grid transmission award recipients'];
const awards=await Promise.all(urls.map(async(source,index)=>{
 const src='/assets/legacy-2025/awards-'+String(index+1).padStart(2,'0')+'.webp';
 if(!await fs.stat('public'+src).catch(()=>null)){
  const response=await fetch(source);
  if(!response.ok)throw new Error('Awards image HTTP '+response.status);
  await sharp(Buffer.from(await response.arrayBuffer())).resize({width:800,withoutEnlargement:true}).webp({quality:85}).toFile('public'+src);
 }
 return {src,alt:awardDescriptions[index]+' on the Bharat Electricity 2025 awards stage',source,album};
}));
await fs.writeFile('src/content/legacy-2025-assets.json',JSON.stringify({references,portraits,awards},null,2)+'\n');
console.log({references:Object.keys(references).length,portraits:Object.keys(portraits).length,awards:awards.length});
