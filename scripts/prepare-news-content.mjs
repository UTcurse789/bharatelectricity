import fs from 'node:fs/promises';import {load} from 'cheerio';
const imported=JSON.parse(await fs.readFile('src/content/imported.json','utf8'));
const results=[];
for(let i=0;i<imported.articles.length;i+=5)await Promise.all(imported.articles.slice(i,i+5).map(async article=>{
 try{
  const cached=await fs.readFile('research/site-refresh/news-'+article.id+'.html','utf8').catch(()=>null);
  const html=cached||await fetch(article.source,{signal:AbortSignal.timeout(25000)}).then(r=>{if(!r.ok)throw Error(r.status);return r.text();});const $=load(html);$('script,style,header,footer,nav').remove();
  const body=$('[class*=__item__body]').first().length?$('[class*=__item__body]').first():$('main article').first();
  const blocks=body.find('p,h2,h3,li').filter((_,e)=>!$(e).find('p,h2,h3,li').length).map((_,e)=>({type:/^h/.test(e.tagName)?'heading':e.tagName==='li'?'item':'paragraph',text:$(e).text().replace(/\s+/g,' ').trim()})).get().filter(x=>x.text);
  results.push({id:article.id,source:article.source,blocks});await fs.writeFile('research/site-refresh/news-'+article.id+'.html',html);
 }catch(e){results.push({id:article.id,source:article.source,blocks:[],error:String(e.message)});}
}));
await fs.writeFile('src/content/article-content.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({articles:results.length,fullBodies:results.filter(x=>x.blocks.length>1).length,unavailable:results.filter(x=>x.error).length}));
