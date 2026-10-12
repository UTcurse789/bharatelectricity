import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const form='https://forms.zohopublic.in/itenmedia1/form/ITENMediaBharatElectricity/formperma/7yd-z5A5Z-NpJ5xZa0scRFP94W_P41_v2Qob4QIEW1w?QueryType=Post%20Show%20Report%20Download&gclid=undefined&utm_source=www.powergen-india.com&utm_medium=referral';
const folder='research/qa/media';await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const checks=[],errors=[];
try{
 for(const width of [1440,375,320]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://forms.zohopublic.in/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html><body>Hosted form placeholder for local layout checks.</body></html>'}));
  for(const [path,title] of [['/media-hub/media/','Media Enquiries'],['/media-hub/postshowreport/','2026 Post-show Report']]){
   const response=await page.goto(origin+path,{waitUntil:'networkidle'});assert.equal(response.status(),200);
   await expect(page.locator('main h1')).toHaveCount(1);await expect(page.locator('main h1')).toHaveText(title);
   await expect(page.locator('.media-navigation a[aria-current=page]')).toHaveAttribute('href',new RegExp('^'+path.replace(/\/$/,'')+'/?$'));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Page fits '+width);
   assert(await page.locator('main h1').evaluate(e=>getComputedStyle(e).fontFamily.includes('Montserrat')));
   const axe=await new AxeBuilder({page}).include('#main-content').exclude('iframe').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);
   if(title==='Media Enquiries'){
    await expect(page.locator('.media-partnerships li')).toHaveCount(4);
    await expect(page.getByRole('link',{name:'Discuss a media partnership'})).toHaveAttribute('href',/^mailto:siddhartha@encis\.in\?subject=/);
    await expect(page.getByRole('link',{name:'Request media accreditation'})).toHaveAttribute('href',/^mailto:hansika@itenmedia\.in\?subject=/);
    await expect(page.locator('main a[href^="tel:"]')).toHaveAttribute('href','tel:+919990401916');
    await expect(page.locator('main form')).toHaveCount(0);
   }else{
    const iframe=page.locator('#report-request iframe');await expect(iframe).toHaveCount(1);await expect(iframe).toHaveAttribute('src',form);assert.equal((await iframe.boundingBox()).height,1200);
    await expect(page.locator('#report-request a[target="_blank"]')).toHaveAttribute('href',form);
    await expect(page.locator('.media-report-cover img')).toHaveAttribute('src','/assets/homepage/post-show-report-2026.webp');
    await expect(page.locator('main form')).toHaveCount(0);
    await page.getByRole('link',{name:'Request the report',exact:true}).click();await expect(page).toHaveURL(/#report-request$/);
    await expect(iframe).toBeVisible();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   }
   await page.locator('main img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));await expect.poll(()=>page.locator('main img').evaluateAll(images=>images.every(i=>i.naturalWidth>0))).toBe(true);
   await page.evaluate(()=>{window.scrollTo(0,0);if(document.activeElement instanceof HTMLElement)document.activeElement.blur();});
   await page.screenshot({path:folder+'/'+title.toLowerCase().replace(/ /g,'-')+'-'+width+'.png',fullPage:true});checks.push({width,path,title});
  }
  if(width!==320){
   await page.goto(origin,{waitUntil:'networkidle'});if(width<1280)await page.getByRole('button',{name:'Open navigation'}).click();
   const nav=page.locator(width>=1280?'.desktop-nav':'.mobile-nav');await nav.getByRole('button',{name:'Media',exact:true}).click();
   await nav.getByRole('link',{name:'Media Enquiries',exact:true}).click();await expect(page).toHaveURL(/\/media-hub\/media\/?$/);await expect(page.locator('main h1')).toHaveText('Media Enquiries');
   await page.locator('.media-navigation').getByRole('link',{name:'Post Show Report',exact:true}).click();await expect(page).toHaveURL(/\/media-hub\/postshowreport\/?$/);
  }
  await context.close();
 }
 assert.deepEqual(errors,[]);await fs.writeFile(folder+'/results.json',JSON.stringify({checks,errors,formUrlPreserved:true,iframeHeight:1200},null,2));console.log(JSON.stringify({checks:checks.length,errors,formUrlPreserved:true,iframeHeight:1200}));
}finally{await browser.close();}
