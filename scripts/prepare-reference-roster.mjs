import fs from 'node:fs/promises';import {load} from 'cheerio';
const $=load(await fs.readFile('research/site-refresh/exhibitor-list.html','utf8'));
const assets=JSON.parse(await fs.readFile('src/content/refresh-asset-sources.json','utf8'));
const rows=[];$('main h2').each((_,e)=>{const name=$(e).text().trim();const node=$(e).closest('li');const image=node.find('img').first().attr('src');const source=node.find('a[href]').first().attr('href');if(!image||!source)return;const art=assets.find(a=>a.source===image);rows.push({name,stand:node.text().match(/Stand:\s*([\w-]+)/)?.[1]||'',image:art?.src||'',source:new URL(source,'https://www.powergen-india.com').href});});
await fs.writeFile('src/content/reference-rosters.json',JSON.stringify(rows,null,2));console.log({rows:rows.length});
