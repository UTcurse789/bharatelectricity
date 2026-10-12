import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const directory='research/qa/navigation';
await fs.mkdir(directory,{recursive:true});
let exportedPages=0;
async function checkLinks(dir){
 for(const entry of await fs.readdir(dir,{withFileTypes:true})){
  const file=dir+'/'+entry.name;
  if(entry.isDirectory())await checkLinks(file);
  else if(entry.name.endsWith('.html')){
   const $=load(await fs.readFile(file,'utf8'));
   for(const anchor of $('a[href]')){const href=$(anchor).attr('href');const internationalPortfolio=file.replaceAll('\\','/').includes('/event/power--energy-series-a-global-portfolio/')&&href==='https://www.powergen.com/';assert(internationalPortfolio||!/^https?:\/\/(?:[^/]*\.)?powergen(?:-india)?\.com(?:\/|$)/i.test($(anchor).attr('href')),file+': outbound POWERGEN link');}
   exportedPages++;
  }
 }
}
await checkLinks('out');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],violations=[],verified=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();
 page.on('pageerror',error=>errors.push(error.message));
 const visit=async route=>{await page.goto(origin+route,{waitUntil:'networkidle'});await expect(page.locator('main h1')).toHaveCount(1);};
 await visit('/');
 await expect(page.locator('.desktop-nav .nav-group')).toHaveCount(6);
 await page.getByRole('button',{name:'About',exact:true}).click();
 await expect(page.getByRole('link',{name:'The Legacy',exact:true})).toBeVisible();
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Exhibition',exact:true}).click();
 await page.locator('.desktop-nav').getByRole('button',{name:'Participants List',exact:true}).click();
 await expect(page.locator('.desktop-nav').getByRole('link',{name:'Participants 2026',exact:true})).toBeVisible();
 await page.locator('.desktop-nav').getByRole('button',{name:'Visit',exact:true}).click();
 await expect(page.locator('.desktop-nav').getByRole('link',{name:'Register Now',exact:true})).toBeVisible();
 await page.keyboard.press('Escape');
 await visit('/about-events/');
 await expect(page.getByRole('heading',{name:'About the Events',exact:true})).toBeVisible();
 for(const name of ['Bharat Electricity','POWERGEN India','Indian Utility Week'])await expect(page.locator('.about-platforms').getByRole('heading',{name,exact:true})).toBeVisible();
 assert.equal(await page.getByRole('link',{name:'Official event source',exact:true}).count(),0);
 await page.screenshot({path:directory+'/about-desktop.png'});
 verified.push('Six navigation groups, renamed links and three co-located platforms on About');
 await visit('/new-initiatives/');
 for(const name of ['NuclearX','TransitionX','FinanceX','StorageX','Startups'])await expect(page.locator('.initiative-navigation').getByRole('link',{name,exact:true})).toBeVisible();
 await page.screenshot({path:directory+'/initiatives-desktop.png',fullPage:true});
 for(const slug of ['nuclearx','transitionx','financex','storagex','startups']){
  await visit('/new-initiatives/'+slug+'/');
  await expect(page.locator('.initiative-navigation [aria-current="page"]')).toHaveCount(1);
  await expect(page.locator('main form')).toHaveCount(1);
 }
 verified.push('All five initiative pages and their enquiry forms');
 for(const route of ['/speaking-opportunities/','/summit-overview/speaking-opportunities/','/summit-overview/speaking-opportunities-bharat-electricity/','/summit-overview/speaking-opportunities-indian-utility-week/']){
  await visit(route);await expect(page.getByRole('heading',{level:1,name:'Speaking Opportunities',exact:true})).toBeVisible();await expect(page.locator('main form')).toHaveCount(1);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',/\/speaking-opportunities\/?$/);
 }
 await visit('/become-sponsor-indian-utility-week/');
 await expect(page.getByRole('heading',{level:1,name:'Partnership Opportunities',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Indian Utility Week partnerships',exact:true})).toBeVisible();
 verified.push('Speaking and Utility Week partnership aliases render consolidated pages');
 await visit('/event/legacy/');
 const yearTabs=page.getByRole('tablist',{name:'Edition year'});
 await expect(yearTabs.getByRole('tab')).toHaveCount(2);
 await expect(page.locator('[role="tabpanel"][id^="legacy-year-panel"]:visible')).toHaveCount(1);
 await yearTabs.getByRole('tab').first().focus();await page.keyboard.press('ArrowRight');
 await expect(yearTabs.getByRole('tab').last()).toHaveAttribute('aria-selected','true');
 await expect(page.locator('#legacy-2024')).toBeVisible();
 await expect(page.locator('.legacy-bar')).toHaveCount(0);
 await page.screenshot({path:directory+'/legacy-desktop.png'});
 await visit('/event/legacy/#legacy-2024');await expect(page.locator('#legacy-2024')).toBeVisible();
 verified.push('Year tabs, keyboard navigation, archive hash links and no bar charts');
 await visit('/partners-2026-o1rs/');
 await expect(page.locator('.all-partners .partner-role')).toHaveCount(29);
 assert.equal(await page.locator('.all-partners [hidden],.all-partners details').count(),0);
 await page.screenshot({path:directory+'/partners-desktop.png'});
 verified.push('Complete partner directory without hidden categories');
 for(const width of [375,768,1440]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['/new-initiatives/','/speaking-opportunities/','/event/legacy/','/partners-2026-o1rs/','/event/co-located-events/']){
   await visit(route);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow at '+width+' '+route);
   const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   violations.push(...scan.violations.map(v=>({width,route,id:v.id,nodes:v.nodes.map(n=>n.target)})));
   if(width===375&&['/new-initiatives/','/event/legacy/'].includes(route))await page.screenshot({path:directory+'/'+(route.includes('legacy')?'legacy':'initiatives')+'-mobile.png'});
  }
  if(width===375){await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('button',{name:'New Initiatives',exact:true}).click();await page.getByRole('link',{name:'StorageX',exact:true}).click();await expect(page.getByRole('heading',{level:1,name:'StorageX',exact:true})).toBeVisible();}
 }
 verified.push('Responsive layout, mobile menu and accessibility at three widths');
 assert.deepEqual(errors,[],'Browser errors');assert.deepEqual(violations,[],'Accessibility violations');
 await fs.writeFile(directory+'/results.json',JSON.stringify({exportedPages,verified,errors,violations},null,2));
 console.log(JSON.stringify({exportedPages,verified,errors,violations}));
}finally{await browser.close();}
