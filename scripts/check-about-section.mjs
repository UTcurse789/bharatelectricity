import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const directory='research/qa/about';
await fs.mkdir(directory,{recursive:true});
const routes=[
 ['/about-events','About the Events'],['/event/legacy','The Legacy'],
 ['/governing-council-2026','Governing Council 2026',49],['/governing-council-2025','Governing Council 2025',34],['/governing-council-2024','Governing Council 2024',27],
 ['/event/market-opportunities-in-india','Market Opportunities in India'],['/event/power--energy-series-a-global-portfolio','Global Series'],['/event/organiser','Organiser']
];
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],results=[];
try{
 for(const width of [1440,375,320]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  for(const [route,title,count] of routes){
   const response=await page.goto(origin+route,{waitUntil:'networkidle'});
   assert.equal(response.status(),200);
   await expect(page.locator('main h1')).toHaveCount(1);
   await expect(page.getByRole('heading',{level:1,name:title,exact:true})).toBeVisible();
   await expect(page.locator('.about-navigation [aria-current=page]')).toHaveCount(1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No horizontal overflow: ${route}, ${width}`);
   assert(await page.locator('main h1').evaluate(e=>getComputedStyle(e).fontFamily.includes('Montserrat')));
   if(count){await expect(page.locator('[data-council-person]')).toHaveCount(count);const chairs=route.includes('2026')?4:route.includes('2025')?3:1;await expect(page.locator('[data-council-group=leadership] [data-council-person]')).toHaveCount(chairs);await expect(page.locator('[data-council-group=members] [data-council-person]')).toHaveCount(count-chairs);}
   if(width!==320){
    const axe=await new AxeBuilder({page}).include('#main-content').exclude('iframe').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`Accessibility: ${route}, ${width}`);
   }
   if(width!==320){await page.locator('.about-hero').scrollIntoViewIfNeeded();await page.screenshot({path:directory+'/'+title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'-'+width+'.png'});}
   results.push({route,width,title,people:count||undefined});
  }
  await page.goto(origin+'/about-events',{waitUntil:'networkidle'});
  if(width<1280)await page.getByRole('button',{name:'Open navigation',exact:true}).click();
  const nav=page.locator(width>=1280?'.desktop-nav':'.mobile-nav');
  await nav.getByRole('button',{name:'About',exact:true}).click();
  const council=nav.getByRole('button',{name:'Meet our Governing Council',exact:true});
  await council.focus();await page.keyboard.press('ArrowRight');
  for(const year of [2026,2025,2024])await expect(nav.getByRole('link',{name:'Governing Council '+year,exact:true})).toBeVisible();
  await expect(nav.getByRole('link',{name:'Governing Council 2026',exact:true})).toBeFocused();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Nested menu fits viewport');
  await page.screenshot({path:directory+'/menu-'+width+'.png'});
  await page.keyboard.press('Escape');await expect(council).toBeFocused();await expect(council).toHaveAttribute('aria-expanded','false');
  await council.click();await nav.getByRole('link',{name:'Governing Council 2025',exact:true}).click();
  await expect(page.getByRole('heading',{level:1,name:'Governing Council 2025',exact:true})).toBeVisible();
  assert.equal(await page.locator('.nav-dropdown,.mobile-nav').count(),0,'Menus close on navigation');
  await page.goto(origin+'/event/power--energy-series-a-global-portfolio',{waitUntil:'networkidle'});
  await expect(page.locator('.about-global-event')).toHaveCount(7);
  const form=page.locator('.about-form iframe');
  await expect(form).toHaveAttribute('src','https://www.clarion-events-group.com/l/339341/2019-08-05/s9qlbj');
  await expect(form).toHaveAttribute('title','Clarion Energy international event participation enquiry');
  assert.equal((await form.boundingBox()).height,600);
  await context.close();
 }
 const context=await browser.newContext();const page=await context.newPage();
 for(const alias of ['/event','/about','/about-the-event','/about-the-events']){
  await page.goto(origin+alias,{waitUntil:'domcontentloaded'});
  await expect(page.locator('main h1')).toHaveText('About the Events');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',/\/about-events\/?$/);
 }
 await page.goto(origin+'/about-events',{waitUntil:'networkidle'});
 const headerAxe=await new AxeBuilder({page}).include('.site-header').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 assert.deepEqual(headerAxe.violations,[]);
 assert.deepEqual(errors,[],'No browser runtime errors');
 await fs.writeFile(directory+'/results.json',JSON.stringify({results,aliases:true,nestedMenus:true,form:true,errors},null,2));
 console.log(JSON.stringify({pages:routes.length,widths:[1440,375,320],browserErrors:errors.length,checks:results.length,aliases:true,nestedMenus:true,form:true}));
}finally{await browser.close();}
