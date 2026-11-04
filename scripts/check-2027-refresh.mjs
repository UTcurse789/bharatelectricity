import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {load} from 'cheerio';

const base=process.env.PREVIEW_URL||'http://127.0.0.1:4175';
const directory='research/qa/2027-refresh';
await fs.mkdir(directory,{recursive:true});
const imported=JSON.parse(await fs.readFile('src/content/imported.json','utf8'));
const council=JSON.parse(await fs.readFile('src/content/council-2026-order.json','utf8'));
const migrations=JSON.parse(await fs.readFile('src/content/url-migrations.json','utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-proxy-server']});
const context=await browser.newContext({reducedMotion:'reduce'});
// Third-party analytics and embedded forms are outside the local layout checks.
await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
const page=await context.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
const report={responsive:[],accessibility:[],checks:[]};
const routes=['/','/about-events','/event/legacy','/governing-council-2026','/participants','/summit-overview','/knowledge-hub','/partner/sponsor','/request-the-partnership-brochure','/exhibit-at-bharat-electricity/request-the-event-brochure','/visiting/networking','/venue','/partners-2026-o1rs','/media-hub/gallery'];
async function visit(route){await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);await page.locator('.site-footer').waitFor();}
async function overflow(){return page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));}
try{
 for(const width of [1440,768,375,320]){
  await page.setViewportSize({width,height:1000});
  for(const route of routes){
   await visit(route);
   const size=await overflow();
   assert(size.document<=size.viewport+1,route+' overflows at '+width+': '+JSON.stringify(size));
   assert.match(await page.locator('.footer-bottom').innerText(),/© 2027 BHARAT ELECTRICITY/);
   report.responsive.push({route,width});
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 await visit('/');
 const positions=await page.evaluate(()=>{const logo=document.querySelector('.header-identity .brand-link').getBoundingClientRect();const date=document.querySelector('.header-date').getBoundingClientRect();const register=document.querySelector('.header-registration').getBoundingClientRect();return {logo:logo.right,date:date.x,dateRight:date.right,register:register.x,navLeft:document.querySelector('.desktop-nav').getBoundingClientRect().left,navRight:document.querySelector('.desktop-nav').getBoundingClientRect().right};});
 assert(positions.date>=positions.logo&&positions.dateRight<positions.register,'Dates sit with the left logo');
 assert(positions.navLeft>=positions.dateRight+10&&positions.register>=positions.navRight,'Desktop navigation clears the left date and Register button');
 await page.locator('.site-header').screenshot({path:directory+'/desktop-header.png'});
 await page.locator('.home-partner-logo-loop').scrollIntoViewIfNeeded();
 await page.locator('.home-partner-logo-loop img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('.home-partner-logo-loop img')).every(image=>image.complete&&image.naturalWidth>0));
 assert(await page.locator('.home-featured-partners li').count()>=5);
 await page.locator('.home-partner-logo-loop').screenshot({path:directory+'/desktop-featured-partners.png'});
 await page.locator('.homepage-partners img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('.homepage-partners img')).every(image=>image.complete&&image.naturalWidth>0));
 await page.locator('.homepage-partners').screenshot({path:directory+'/desktop-valued-partners.png'});
 await visit('/governing-council-2026');
 assert.deepEqual(await page.locator('[data-council-person] h3').allTextContents(),council.people.map(id=>imported.people.find(person=>person.id===id).name));
 assert.equal(await page.locator('[data-council-group="leadership"] [data-council-person]').count(),3);
 assert.equal(await page.locator('[data-council-group="members"] [data-council-person]').count(),45);
 assert(!await page.locator('[data-council-person]').filter({hasText:'Alok Kumar'}).count());
 report.checks.push('All 48 council positions match the PDF order');
 await visit('/participants');
 await page.getByRole('searchbox').fill('Brainstem');
 assert.match(await page.locator('.exhibition-company-logo img').getAttribute('src'),/2027-refresh\/brainstem-technologies/);
 await page.getByRole('searchbox').fill('Tranter');
 assert.match(await page.locator('.exhibition-company-logo img').getAttribute('src'),/2027-refresh\/tranter-india/);
 for(const year of [2025,2024,2026]){
  await page.getByRole('link',{name:year+' Participants',exact:true}).click();
  assert.equal(new URL(page.url()).pathname,'/participants');
  assert.equal(new URL(page.url()).searchParams.get('year'),String(year));
  assert.match(await page.locator('h1').innerText(),new RegExp(String(year)));
 }
 await page.reload({waitUntil:'domcontentloaded'});
 await page.getByRole('searchbox').waitFor();
 report.checks.push('Correct participant logos, shared URL and edition switching');
 await visit('/event/legacy');
 await page.getByRole('tab',{name:/2026/}).click();
 assert(await page.locator('#legacy-2026').isVisible());
 assert.match(await page.locator('#legacy-2026 .legacy-awards-edition').innerText(),/2026/);
 await page.getByRole('tab',{name:/2025/}).click();
 await page.getByRole('tab',{name:'Day 2 Glimpse',exact:true}).click();
 const opener=page.locator('#legacy-panel-2025-day-2 .photo-tile').first();
 await opener.click();
 await page.locator('dialog[open]').waitFor();
 await page.keyboard.press('ArrowRight');
 await page.keyboard.press('Escape');
 assert(await opener.evaluate(element=>document.activeElement===element),'Lightbox restores keyboard focus');
 assert.equal(await page.locator('.legacy-day-gallery canvas,.legacy-awards-gallery canvas').count(),0);
 report.checks.push('2026 legacy edition and still day galleries with keyboard photo viewer');
 await visit('/media-hub/gallery');
 for(const year of [2025,2024,2026]){
  await page.getByRole('tab',{name:new RegExp(String(year))}).click();
  assert.match(await page.locator('#photo-previews-heading').innerText(),new RegExp(String(year)));
  assert(await page.locator('.gallery-album img').count()>0);
 }
 await page.locator('.photo-tile').first().click();
 await page.locator('dialog[open]').waitFor();
 await page.keyboard.press('Escape');
 for(const [old,target] of Object.entries(migrations)){
  const response=await context.request.get(base+old);
  assert(response.ok(),old+' is compatible');
  const $=load(await response.text());
  assert.equal(new URL($('link[rel="canonical"]').attr('href')).pathname,target+'/');
 }
 for(const route of ['/exhibitor-guide','/exhibitor-manual']){
  const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),404,route+' is hidden');
 }
 report.checks.push('Canonical route migrations and both manual URLs hidden');
 await visit('/partners-2026-o1rs');
 assert.equal(await page.getByRole('heading',{name:'Government Support',exact:true}).count(),0);
 await visit('/venue');
 assert.match(await page.locator('.exhibition-venue-facts').innerText(),/Gate No\. 6/);
 assert.match(await page.locator('.exhibition-venue-map iframe').getAttribute('src'),/Gate%20No\.%206/);
 assert(await page.locator('a[href="https://share.google/POUSKHDQPcww1YL6t"]').count());
 for(const width of [1440,375]){
  await page.setViewportSize({width,height:1000});
  for(const [route,name] of [['/event/legacy','legacy'],['/summit-overview','summit'],['/partner/sponsor','partnership'],['/media-hub/gallery','gallery'],['/visiting/networking','networking'],['/venue','venue']]){
   await visit(route);
   await page.locator('main img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
   await page.waitForFunction(()=>Array.from(document.querySelectorAll('main img')).every(image=>image.complete&&image.naturalWidth>0));
   await page.screenshot({path:directory+'/'+width+'-'+name+'.png',fullPage:true});
   const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   report.accessibility.push({route,width,violations:result.violations});
   assert.deepEqual(result.violations.map(violation=>violation.id),[],route+' accessibility');
  }
 }
 assert.deepEqual(errors,[],'Browser runtime errors');
 await fs.writeFile(directory+'/report.json',JSON.stringify({...report,runtimeErrors:errors},null,2)+'\n');
 console.log(JSON.stringify({responsiveChecks:report.responsive.length,accessibilityScans:report.accessibility.length,checks:report.checks,runtimeErrors:errors}));
}finally{await browser.close();}
