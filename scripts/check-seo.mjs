import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
import sharp from 'sharp';

// Check the exported HTML that crawlers receive, without executing JavaScript.
const origin=new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://www.bharat-electricity.com').origin;
const root=path.resolve('out');
const records=new Map();
const types=new Map();
const assetPaths=new Set();
function localFile(url){
 const parsed=new URL(url,origin);
 assert.equal(parsed.origin,origin,'Unexpected site origin: '+url);
 const route=decodeURIComponent(parsed.pathname);
 return path.join(root,route.endsWith('/')?route+'index.html':route);
}
async function asset(url){
 const parsed=new URL(url,origin);
 assert.equal(parsed.origin,origin,'Sharing and icon assets must use the production site');
 const file=localFile(url);
 assert(await fs.stat(file).catch(()=>null),'Missing SEO asset: '+url);
 assetPaths.add(parsed.pathname);
}
async function scan(folder){
 for(const entry of await fs.readdir(folder,{withFileTypes:true})){
  const file=path.join(folder,entry.name);
  if(entry.isDirectory()){await scan(file);continue;}
  if(!entry.name.endsWith('.html'))continue;
  const html=await fs.readFile(file,'utf8'),$=load(html);
  if(['404.html','404/index.html','_not-found/index.html'].includes(path.relative(root,file).split(path.sep).join('/'))){
   assert.match($('meta[name="robots"]').attr('content')||'',/noindex/,'404 pages are not indexable');
   continue;
  }
  if(!$('main#main-content').length)continue;
  const route='/'+path.relative(root,path.dirname(file)).split(path.sep).filter(Boolean).join('/')+(path.dirname(file)===root?'':'/');
  const url=origin+route;
  assert.equal($('head title').length,1,file+' has one server-rendered title');
  assert.equal($('head meta[name="description"]').length,1,file+' has one description');
  const title=$('head title').text(),description=$('head meta[name="description"]').attr('content');
  assert(title.trim()&&description?.trim(),file+' has descriptive metadata');
  assert(description.length<=170,file+' description is concise');
  assert.equal($('h1').length,1,file+' has one primary heading');
  assert.equal($('html').attr('lang'),'en-IN');
  const canonicals=$('head link[rel="canonical"]');
  assert.equal(canonicals.length,1,file+' has one canonical');
  const canonical=canonicals.attr('href');
  assert.equal(new URL(canonical).origin,origin);
  assert(canonical.endsWith('/'),file+' uses a consistent trailing slash');
  for(const key of ['title','description','url','site_name','locale','image','image:alt','type'])assert($('head meta[property="og:'+key+'"]').attr('content'),file+' Open Graph '+key);
  assert.equal($('head meta[property="og:url"]').attr('content'),canonical);
  for(const key of ['card','title','description','image','image:alt'])assert($('head meta[name="twitter:'+key+'"]').attr('content'),file+' Twitter '+key);
  assert.equal($('head meta[name="twitter:card"]').attr('content'),'summary_large_image');
  for(const selector of ['meta[property="og:image"]','meta[name="twitter:image"]'])await asset($('head '+selector).attr('content'));
  assert($('head link[rel="icon"]').length>0);
  assert.equal($('head link[rel="apple-touch-icon"]').length,1);
  for(const icon of $('head link[rel="icon"],head link[rel="apple-touch-icon"]'))await asset($(icon).attr('href'));
  const robots=$('head meta[name="robots"]').attr('content')||'';
  const googlebot=$('head meta[name="googlebot"]').attr('content')||'';
  const noindex=/\bnoindex\b/.test(robots);
  assert.equal(noindex,['/welcome/','/thankyou-for-registrating-in-bharatelectricity2027/'].includes(route),file+' intentional indexability');
  assert.equal(/\bnoindex\b/.test(googlebot),noindex,file+' Googlebot agrees with robots');
  const nodes=[];
  for(const script of $('script[type="application/ld+json"]')){
   const text=$(script).text();
   assert(!text.includes('<'),file+' safely serializes structured data');
   assert(!text.includes('chatgpt.site'),file+' structured data uses no preview origin');
   const data=JSON.parse(text);
   assert.equal(data['@context'],'https://schema.org');
   for(const node of data['@graph']||[data]){
    assert(node['@type']&&node['@id'],file+' structured entities have types and stable IDs');
    nodes.push(node);types.set(node['@type'],(types.get(node['@type'])||0)+1);
   }
  }
  assert(nodes.some(node=>node['@type']==='WebSite'));
  const page=nodes.find(node=>['WebPage','ProfilePage'].includes(node['@type']));
  assert.equal(page?.url,canonical,file+' structured page URL agrees with canonical');
  assert(nodes.some(node=>node['@type']==='Organization'));
  if(route!=='/'&&route!=='/welcome/'){
   const breadcrumbs=nodes.find(node=>node['@type']==='BreadcrumbList');
   assert.equal(breadcrumbs?.itemListElement.at(-1).item,canonical,file+' canonical breadcrumb');
  }
  if(route.startsWith('/industry-news/')){
   const article=nodes.find(node=>node['@type']==='Article');
   assert(article?.headline&&article.url===canonical,file+' article schema');
  }
  records.set(url,{canonical,noindex,title,description,nodes});
 }
}
await scan(root);
assert(records.size>300,'Audit covers the complete exported site');
for(const [url,record] of records){
 const target=records.get(record.canonical);
 assert(target,url+' canonical target exists');
 assert.equal(target.canonical,record.canonical,url+' avoids canonical chains');
 if(!record.noindex)assert(!target.noindex,url+' canonical target is indexable');
}
const sitemap=load(await fs.readFile(path.join(root,'sitemap.xml'),'utf8'),{xmlMode:true});
const sitemapUrls=sitemap('url>loc').toArray().map(node=>sitemap(node).text());
assert.equal(new Set(sitemapUrls).size,sitemapUrls.length,'Sitemap has no duplicate canonical URLs');
const indexable=[...records].filter(([url,record])=>!record.noindex&&record.canonical===url).map(([url])=>url);
assert.deepEqual([...sitemapUrls].sort(),indexable.sort(),'Sitemap contains exactly the indexable canonical pages');
const robots=await fs.readFile(path.join(root,'robots.txt'),'utf8');
assert.match(robots,/User-Agent: \*/i);assert.match(robots,/Allow: \/(?:\r?\n|$)/i);
assert(!/Disallow:\s*\/\s*(?:\r?\n|$)/i.test(robots),'Crawlers can fetch public content and resources');
assert(robots.includes('Sitemap: '+origin+'/sitemap.xml'));
const homepage=load(await fs.readFile(path.join(root,'index.html'),'utf8'));
assert.equal(homepage('.event-faq details').length,6,'Questions and answers are present in initial HTML');
assert.match(homepage('.event-faq').text(),/1–3 September 2027/);
assert.match(homepage('.event-faq').text(),/Yashobhoomi/);
const event=records.get(origin+'/').nodes.find(node=>node['@type']==='Event');
assert.equal(event.startDate,'2027-09-01');assert.equal(event.endDate,'2027-09-03');
assert.equal(event.organizer.length,2);assert(event.location.address.addressCountry==='IN');
assert(!event.offers,'No unconfirmed ticket prices in structured data');
assert(!types.has('FAQPage'),'Visible FAQs do not claim deprecated FAQ rich results');
const og=await sharp(path.join(root,'opengraph-image.png')).metadata();
assert.deepEqual([og.width,og.height],[1200,630]);
const apple=await sharp(path.join(root,'apple-icon.png')).metadata();
assert.deepEqual([apple.width,apple.height],[180,180]);
const noindexPages=[...records.values()].filter(record=>record.noindex).length;
console.log(JSON.stringify({origin,htmlPages:records.size,canonicalPages:sitemapUrls.length,aliasPages:records.size-sitemapUrls.length-noindexPages,noindexPages,sharingAssets:assetPaths.size,structuredDataTypes:Object.fromEntries(types),serverRenderedFaqs:6}));
