import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const origin=process.env.CHECK_ORIGIN||'http://localhost:3000';
const reference=JSON.parse(await fs.readFile('src/content/reference-pages.json','utf8'));
const routes=reference.filter(p=>p.sections.some(s=>s.images.some(i=>i.kind==='logo'))).map(p=>p.path+'/');
routes.push('/exhibitors/','/partners-2025/','/');
const imported=JSON.parse(await fs.readFile('src/content/imported.json','utf8'));
routes.push('/exhibitors/'+imported.companies.find(c=>c.logo).id+'/');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];const errors=[];
await fs.mkdir('research/qa/logo-layouts',{recursive:true});
try{
 const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [375,1440,1902]){
  await page.setViewportSize({width,height:1000});
  for(const route of [...new Set(routes)]){
   const response=await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:20000});assert.equal(response.status(),200,route);
   await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(async()=>{const images=[...document.querySelectorAll('img')].filter(e=>e.getBoundingClientRect().width>0);images.forEach(e=>e.loading='eager');await Promise.all(images.map(e=>e.decode()));});
   const report=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,oldBrand:/powergen|\bpgid\b/i.test(document.body.innerText),logos:[...document.querySelectorAll('.reference-logo img,.partner-logo img,.company-logo img,.detail-logo img')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const viewport=e.closest('.logo-viewport')||e;const box=viewport.getBoundingClientRect();return {src:e.getAttribute('src'),w:box.width,h:box.height,cropped:viewport!==e};})}));
   assert(!report.overflow,'Overflow '+width+' '+route);assert(!report.oldBrand,'Old brand '+route);
   for(const logo of report.logos){assert(logo.w<=320.5,'Logo width '+JSON.stringify({route,width,logo}));assert(logo.h<=180.5,'Logo height '+JSON.stringify({route,width,logo}));if(logo.cropped)assert(Math.max(logo.w,logo.h)>=65,'Unreadably small logo '+JSON.stringify({route,width,logo}));}
   results.push({width,route,logos:report.logos.length});
   console.log('Checked',width,route);
   if([375,1902].includes(width)&&['/partner/partner-e6vb/','/event/power--energy-series-a-global-portfolio/'].includes(route))await page.screenshot({path:'research/qa/logo-layouts/'+width+'-'+(route.includes('e6vb')?'partners':'portfolio')+'.png',fullPage:true});
  }
 }
 assert.deepEqual(errors,[]);await fs.writeFile('research/qa/logo-layouts/results.json',JSON.stringify({results,errors},null,2));
 console.log(JSON.stringify({pages:new Set(routes).size,viewports:3,checks:results.length,errors}));
}finally{await browser.close();}
