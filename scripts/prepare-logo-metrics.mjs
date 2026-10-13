import fs from 'node:fs/promises';
import sharp from 'sharp';
const read=async name=>JSON.parse(await fs.readFile('src/content/'+name+'.json','utf8'));
const [reference,imported,home,roster]=await Promise.all(['reference-pages','imported','homepage-partners','reference-rosters'].map(read));
const additions=await read('exhibitor-additions');
const sources=new Set(reference.flatMap(p=>p.sections.flatMap(s=>s.images.filter(i=>i.kind==='logo'&&!i.unavailable).map(i=>i.src))));
for(const company of [...imported.companies,...imported.partnerCompanies,...additions.companies])if(company.logo)sources.add(company.logo);
for(const row of roster)if(row.image)sources.add(row.image);
function collect(value){if(Array.isArray(value))value.forEach(collect);else if(value&&typeof value==='object'){if(value.src?.startsWith('/assets/'))sources.add(value.src);Object.values(value).forEach(collect);}}
collect(home);
const metrics={};
for(const src of [...sources].sort()){
 if(!src.startsWith('/assets/'))continue;
 const {data,info}=await sharp('public'+src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let left=info.width,top=info.height,right=-1,bottom=-1;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
  const offset=(y*info.width+x)*4;
  if(data[offset+3]>40&&Math.min(data[offset],data[offset+1],data[offset+2])<235){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
 }
 if(right<left)continue;
 // A little breathing room protects antialiased edges and light details.
 const padding=Math.max(3,Math.ceil(Math.max(right-left,bottom-top)*.025));
 left=Math.max(0,left-padding);top=Math.max(0,top-padding);right=Math.min(info.width-1,right+padding);bottom=Math.min(info.height-1,bottom+padding);
 metrics[src]={width:info.width,height:info.height,x:left,y:top,contentWidth:right-left+1,contentHeight:bottom-top+1};
}
await fs.writeFile('src/content/logo-metrics.json',JSON.stringify(metrics,null,2)+'\n');
console.log(JSON.stringify({logoBoundsMeasured:Object.keys(metrics).length}));
