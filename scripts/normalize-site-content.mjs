import fs from 'node:fs/promises';
import {brandCopy} from '../src/lib/brand-copy.mjs';
const protectedKeys=new Set(['id','companyId','personId','path','sourcePath','source','src','href','url','website','file','logo','thumbnail','image']);
let changed=0,logos=0;
function normalize(value,key='') {
 if(protectedKeys.has(key))return value;
 if(Array.isArray(value))return value.map(v=>normalize(v,key));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,normalize(v,k)]));
 if(typeof value==='string'&&!/^https?:|^\/|^[^\s@]+@/.test(value)) {
  const next=brandCopy(value);if(next!==value)changed++;return next;
 }
 return value;
}
for(const file of await fs.readdir('src/content')) {
 // Authoritative, archived Word content keeps its original wording and URLs.
 if(!file.endsWith('.json')||file==='exhibitor-document.json')continue;
 const filename='src/content/'+file;const original=await fs.readFile(filename,'utf8');
 const content=normalize(JSON.parse(original));
 if(file==='reference-pages.json')for(const page of content)for(const section of page.sections){
  // Obsolete event wordmarks are removed; actual exhibitors and archive photographs remain.
  section.images=section.images.filter(image=>!/\/(?:PGID_Logo|POWERGEN_Intl-4c_Lg|PSR-2025)\./i.test(image.source));
  for(const image of section.images){
   const logo=/logo|enlit|dtech/i.test(image.source+' '+image.alt)||/^\/partner\/partner|^\/2024-exhibitors$/.test(page.path)||(image.width<=350&&image.height<=260);
   if(logo){image.kind='logo';logos++;}
   if(/Bharat-Electricity-LOGo/i.test(image.source))image.alt='BHARAT ELECTRICITY';
   // Original alt labels were reused for unrelated portfolio logos.
   if(/\/Enlit-Asia/i.test(image.source))image.alt='Enlit Asia';
   if(/\/Enlit-Europe/i.test(image.source))image.alt='Enlit Europe';
   if(/\/DTECH/i.test(image.source))image.alt='DTECH';
  }
 }
 const next=JSON.stringify(content,null,2)+'\n';
 if(next!==original)await fs.writeFile(filename,next);
}
console.log(JSON.stringify({copyFieldsUpdated:changed,logoImagesClassified:logos}));
await import('./prepare-logo-metrics.mjs');
