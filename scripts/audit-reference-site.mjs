import fs from 'node:fs/promises';
import {load} from 'cheerio';
await fs.mkdir('research/site-refresh',{recursive:true});
const origin='https://www.powergen-india.com';
const home=await fetch(origin,{signal:AbortSignal.timeout(25000)}).then(r=>r.text());
const $=load(home);
const links=$('header a,nav a').map((_,e)=>({label:$(e).text().replace(/\s+/g,' ').trim(),href:$(e).attr('href')})).get().filter(x=>x.label&&x.href);
await fs.writeFile('research/site-refresh/navigation.json',JSON.stringify(links,null,2));
console.log('NAVIGATION',JSON.stringify(links));
const routes=[...new Set(links.map(x=>x.href).filter(x=>!x.startsWith('#')&&!x.startsWith('mailto:')&&!x.startsWith('tel:')).map(x=>new URL(x,origin)).filter(x=>x.origin===origin).map(x=>x.pathname))];
const records=[];
for(let i=0;i<routes.length;i+=5){
 await Promise.all(routes.slice(i,i+5).map(async route=>{
  try{
   const res=await fetch(origin+route,{signal:AbortSignal.timeout(25000)});
   if(!res.ok)throw Error(String(res.status));
   const html=await res.text();const $=load(html);$('script,style,header,footer,nav,.breadcrumb').remove();
   const main=$('main').length?$('main'):$('body');
   const blocks=main.find('h1,h2,h3,h4,p,li').filter((_,e)=>!$(e).find('h1,h2,h3,h4,p,li').length).map((_,e)=>({tag:e.tagName,text:$(e).text().replace(/\s+/g,' ').trim()})).get().filter(x=>x.text);
   const assets=main.find('img,iframe,video,a').map((_,e)=>({tag:e.tagName,src:$(e).attr('src')||$(e).attr('href'),alt:$(e).attr('alt')||$(e).text().trim()})).get().filter(x=>x.src);
   await fs.writeFile('research/site-refresh/'+(route.slice(1).replaceAll('/','__')||'home')+'.html',html);
   records.push({route,title:$('title').text(),blocks,assets});
   console.log(route,blocks.length,assets.length);
  }catch(e){records.push({route,error:e.message});console.log('FAILED',route,e.message);}
 }));
}
await fs.writeFile('research/site-refresh/source.json',JSON.stringify(records,null,2));
