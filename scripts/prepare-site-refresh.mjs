import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {load} from 'cheerio';
import sharp from 'sharp';
const origin='https://www.powergen-india.com';
const records=JSON.parse(await fs.readFile('research/site-refresh/source.json','utf8'));
const extra=['/visiting/networking','/exhibit-at-powergen-india/make-stand-enquiry-indian-utility-week','/privacy-policy','/terms--conditions'];
for(const route of extra){
 const cache='research/site-refresh/'+route.slice(1).replaceAll('/','__')+'.html';
 if(await fs.stat(cache).catch(()=>null)){records.push({route});continue;}
 try{const res=await fetch(origin+route,{signal:AbortSignal.timeout(25000)});if(!res.ok)throw Error(res.status);await fs.writeFile('research/site-refresh/'+route.slice(1).replaceAll('/','__')+'.html',await res.text());records.push({route});}catch(e){console.log('Unavailable',route,e.message);}
}
const aliases={'/exhibit-at-powergen-india':'/why-exhibit','/exhibit-at-powergen-india/stand-options':'/stand-options','/visiting':'/why-visit','/bharat-electricity-awards-2026':'/awards','/about-powergen-india/contact-us':'/contact','/register':'/registration-options'};
const clean=s=>s.replace(/\s+/g,' ').trim().replace(/\u2014/g,', ');
const assets=new Map();
function asset(src,alt){if(!src)return null;try{src=new URL(src,origin).href;}catch{return null;}if(!/^https:\/\/cdn\.asp\.events\//.test(src))return null;const id=crypto.createHash('sha256').update(src).digest('hex').slice(0,14);if(!assets.has(src))assets.set(src,{source:src,src:'/assets/site-refresh/'+id+'.webp',alt:clean(alt||'Published event artwork'),width:0,height:0});return assets.get(src);}
function url(href){try{const u=new URL(href,origin);if(!['http:','https:','mailto:','tel:'].includes(u.protocol))return null;if(u.origin===origin){const route=u.pathname.replace(/\/$/,'')||'/';return aliases[route]||route;}return u.href;}catch{return null;}}
const pages=[];
for(const record of records){
 if(record.error)continue;
 const html=await fs.readFile('research/site-refresh/'+(record.route.slice(1).replaceAll('/','__')||'home')+'.html','utf8');
 const $=load(html);$('script,style,form,nav,header,footer').remove();
 const main=$('main');const title=clean(main.find('h1').first().text());if(!title)continue;
 const sections=[];
 const articles=main.find('article');const nodes=articles.length?articles:main;
 nodes.each((index,element)=>{
  const node=$(element);const blocks=[];const seen=new Set();
  node.find('h2,h3,h4,p,ul,ol,table').each((_,e)=>{
   const layoutTable=table=>$(table).find('img').length>0||clean($(table).text()).length>1000;
   if($(e).parentsUntil(element,'ul,ol').length||$(e).parentsUntil(element,'table').toArray().some(t=>!layoutTable(t)))return;
   if(e.tagName==='table'&&layoutTable(e))return;
   if(e.tagName==='p'&&$(e).find('p,ul,ol,table').length)return;
   const text=clean($(e).text());if(!text||seen.has(text)||/^Loading|^GET INVOLVED$/.test(text))return;
   if($(e).find('a').length&&$(e).text().replace(/\s/g,'')===$(e).find('a').text().replace(/\s/g,''))return;
   seen.add(text);
   if(e.tagName==='table'){const rows=[];$(e).find('tr').each((_,tr)=>{const cells=$(tr).find('th,td').map((_,td)=>clean($(td).text())).get();if(cells.length)rows.push(cells);});if(rows.length)blocks.push({type:'table',rows});}
   else if(['ul','ol'].includes(e.tagName)){const items=$(e).children('li').map((_,li)=>clean($(li).text())).get().filter(Boolean);if(items.length)blocks.push({type:'list',items,ordered:e.tagName==='ol'});}
   else blocks.push({type:/^h/.test(e.tagName)?'heading':'paragraph',text});
  });
  const images=node.find('img').map((_,e)=>asset($(e).attr('src'),$(e).attr('alt'))).get().filter(Boolean);
  const links=node.find('a[href]').map((_,e)=>({label:clean($(e).text()),href:url($(e).attr('href'))})).get().filter(x=>x.label&&x.href&&!/^Entry link|^Read More|^More$/i.test(x.label));
  const uniqueLinks=[...new Map(links.map(x=>[x.href,x])).values()];
  if(!blocks.length&&!images.length&&!uniqueLinks.length)return;
  const first=blocks[0];const heading=first?.type==='heading'?blocks.shift().text:'';
  sections.push({id:'section-'+index,title:heading,blocks,images,links:uniqueLinks,collapsible:/accordion/.test(node.attr('class')||'')});
 });
 const videos=main.find('iframe[src]').map((_,e)=>{const src=$(e).attr('src');const id=src?.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/)?.[1];if(!id)return null;const container=$(e).closest('article');return {id,title:clean(container.find('p,h2,h3,h4').text())||'Event film'};}).get().filter(Boolean);
 pages.push({source:origin+record.route,sourcePath:record.route,path:aliases[record.route]||record.route,title,sections,videos});
}
await fs.mkdir('public/assets/site-refresh',{recursive:true});
const all=[...assets.values()];let failed=0;
for(let i=0;i<all.length;i+=10){await Promise.all(all.slice(i,i+10).map(async a=>{
 try{const file='public'+a.src;let bytes=await fs.readFile(file).catch(()=>null);if(!bytes){const res=await fetch(a.source,{signal:AbortSignal.timeout(30000)});if(!res.ok)throw Error(res.status);const original=Buffer.from(await res.arrayBuffer());bytes=await sharp(original).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:84}).toBuffer();await fs.writeFile(file,bytes);}const meta=await sharp(bytes).metadata();a.width=meta.width;a.height=meta.height;}catch(e){failed++;a.unavailable=true;console.log('Asset unavailable',a.source,e.message);}
 }));if(i%100===0)console.log('Assets',Math.min(i+10,all.length),all.length);}
// The user's stand photographs are the authoritative local files.
for(const [name,file] of [['shell-scheme','IMG_3597.webp'],['raw-space','IMG_3788.webp']]){
 await sharp(await fs.readFile('C:/Users/ASUS/Downloads/'+file)).resize({width:1600,withoutEnlargement:true}).webp({quality:88}).toFile('public/assets/site-refresh/'+name+'.webp');
}
const available=new Set(pages.map(p=>p.path));for(const p of ['/exhibitors','/contact','/registration-options','/privacy-policy','/terms--conditions','/stand-options','/2025-speakers'])available.add(p);
for(const page of pages)for(const section of page.sections)for(const link of section.links)if(link.href.startsWith('/')&&!available.has(link.href.replace(/\/$/,'')))link.href=origin+link.href;
await fs.writeFile('src/content/reference-pages.json',JSON.stringify(pages,null,2));
await fs.writeFile('src/content/refresh-asset-sources.json',JSON.stringify(all,null,2));
console.log(JSON.stringify({pages:pages.length,assets:all.length,failed}));
