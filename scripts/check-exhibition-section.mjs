import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const folder='research/qa/exhibition';await fs.mkdir(folder,{recursive:true});
const base='/exhibit-at-powergen-india';
const contact='/about-powergen-india/contact-us';
const routes=[
 [base,'Why Exhibit?'],[base+'/who-exhibits-at-powergen-india','Who Exhibits'],[base+'/previous-attendees','Previous Attendees'],[base+'/stand-options','Stand Options'],
 ['/exhibitors','Participants 2026'],['/participants-2025','Participants 2025'],['/2024-exhibitors','Participants 2024'],
 [base+'/make-a-stand-enquiry','Make a Stand Enquiry'],['/space-application-form','Reserve Your Space'],[base+'/view-the-floor-plan-92u6','Request the Floor Plan'],[base+'/request-the-event-prospectus','Request the Event Brochure'],['/request-the-partnership-brochure','Request the Partnership Brochure'],
 ['/exhibitor-guide','Exhibitor Manual'],['/why-visit','Why Visit?'],['/visiting/networking','Networking'],['/registration-options','Register'],['/venue','Venue & Travel'],[contact,'Contact Us']
];
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],checks=[],menusOnly=process.argv.includes('--menus-only');
try{
 for(const width of (menusOnly?[]:[1440,375,320])){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  const selected=width===320?routes.filter(([r])=>[base+'/who-exhibits-at-powergen-india',base+'/stand-options',base+'/request-the-event-prospectus','/participants-2025',contact].includes(r)):routes;
  for(const [route,title] of selected){
   const response=await page.goto(origin+route,{waitUntil:'networkidle'});assert.equal(response.status(),200);
   await expect(page.locator('main h1')).toHaveCount(1);await expect(page.locator('main h1')).toHaveText(title);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No overflow: '+route+' at '+width);
   assert(await page.locator('main h1').evaluate(e=>getComputedStyle(e).fontFamily.includes('Montserrat')));
   if(width!==320){const results=await new AxeBuilder({page}).include('#main-content').exclude('iframe').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],'Accessibility: '+route+' at '+width);}
   if(width!==320&&['Who Exhibits','Stand Options','Request the Event Brochure','Contact Us'].includes(title))await page.screenshot({path:folder+'/'+title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'-'+width+'.png'});
   checks.push({route,width,title});
  }
  await page.goto(origin+base+'/request-the-event-prospectus',{waitUntil:'networkidle'});
  const iframe=page.locator('.exhibition-form iframe');
  await expect(iframe).toHaveAttribute('src',/QueryType=Brochure%20Download&gclid=undefined&utm_source=www\.powergen-india\.com&utm_medium=referral$/);
  await expect(iframe).toHaveAttribute('title','Request the event brochure — Zoho enquiry form');assert.equal((await iframe.boundingBox()).height,600);
  await page.locator('.exhibition-form').scrollIntoViewIfNeeded();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Form fits at '+width);
  await page.goto(origin+base+'/stand-options',{waitUntil:'networkidle'});
  await page.getByRole('link',{name:'Enquire about Raw Space',exact:true}).click();
  await expect(page.locator('.exhibition-stand-preference')).toContainText('Raw Space');
  await expect(page.locator('.exhibition-form iframe')).toHaveAttribute('src',/QueryType=Exhibit&gclid=undefined&utm_source=www\.powergen-india\.com&utm_medium=referral$/);
  await page.goto(origin+'/participants-2025',{waitUntil:'networkidle'});
  await expect(page.getByRole('status')).toHaveText('99 companies');await expect(page.locator('.exhibition-company-card')).toHaveCount(24);
  await page.getByRole('button',{name:'Show more companies',exact:true}).click();await expect(page.locator('.exhibition-company-card')).toHaveCount(48);
  await page.getByRole('searchbox',{name:'Search Participants 2025'}).fill('63SATS Cybertech');await expect(page.locator('.exhibition-company-card')).toHaveCount(1);
  await page.getByRole('searchbox',{name:'Search Participants 2025'}).fill('no-match-company-12345');await expect(page.getByRole('heading',{name:'No matching companies'})).toBeVisible();
  await page.getByRole('button',{name:'Clear search',exact:true}).click();await expect(page.getByRole('status')).toHaveText('99 companies');
  await page.goto(origin+'/2024-exhibitors',{waitUntil:'networkidle'});await expect(page.getByRole('status')).toHaveText('104 published participant logos');
  await page.goto(origin+'/exhibitor-guide',{waitUntil:'networkidle'});await expect(page.locator('.exhibition-manual-section')).toHaveCount(7);await expect(page.locator('.exhibition-manual-section[open]')).toHaveCount(0);
  await page.locator('.exhibition-manual-section').nth(3).locator('summary').click();await expect(page.locator('.exhibition-manual-section').nth(3)).toHaveAttribute('open','');
  await page.goto(origin+contact,{waitUntil:'networkidle'});await expect(page.locator('.exhibition-contact-people article')).toHaveCount(3);await expect(page.locator('.exhibition-contact-people a[href^="mailto:"]')).toHaveCount(3);await expect(page.locator('.exhibition-contact-people a[href^="tel:"]')).toHaveCount(3);
  await context.close();
 }
 for(const viewport of [{width:1440,height:1000},{width:1280,height:768},{width:375,height:812}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'}),page=await context.newPage();
  await page.goto(origin+base,{waitUntil:'networkidle'});
  if(viewport.width<1280)await page.getByRole('button',{name:'Open navigation'}).click();
  const nav=page.locator(viewport.width>=1280?'.desktop-nav':'.mobile-nav');
  await nav.getByRole('button',{name:'Exhibition',exact:true}).click();
  const current=nav.getByRole('link',{name:'Why Exhibit?',exact:true});await expect(current).toHaveAttribute('aria-current','page');await current.click();await expect(page.locator('.nav-dropdown,.mobile-nav')).toHaveCount(0);assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');
  if(viewport.width<1280)await page.getByRole('button',{name:'Open navigation'}).click();
  await nav.getByRole('button',{name:'Exhibition',exact:true}).click();
  const why=nav.getByRole('button',{name:'Show Why Exhibit submenu',exact:true});await why.focus();await page.keyboard.press('ArrowRight');
  await expect(nav.getByRole('link',{name:'Who Exhibits',exact:true})).toBeFocused();
  await expect(nav.getByRole('link',{name:'View our Previous Attendees',exact:true})).toBeVisible();
  await expect(nav.getByRole('link',{name:'Stand Options',exact:true})).toBeVisible();
  await page.keyboard.press('Escape');await expect(why).toBeFocused();
  await nav.getByRole('button',{name:'Participants List',exact:true}).click();for(const year of [2026,2025,2024])await expect(nav.getByRole('link',{name:'Participants '+year,exact:true})).toBeVisible();
  await nav.getByRole('button',{name:'Visit',exact:true}).click();await expect(nav.getByRole('link',{name:'Register Now',exact:true})).toBeVisible();
  const menu=nav.locator(viewport.width>=1280?'.nav-dropdown':'.mobile-group');if(viewport.width>=1280){const box=await menu.boundingBox();assert(box.y+box.height<=viewport.height,'Desktop dropdown stays inside viewport');}
  const scan=await new AxeBuilder({page}).include('.site-header').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],'Expanded navigation accessibility');
  await page.screenshot({path:folder+'/menu-'+viewport.width+'.png'});
  await nav.getByRole('link',{name:'Register Now',exact:true}).click();await expect(page.locator('main h1')).toHaveText('Register');await expect(page.locator('.mobile-nav,.nav-dropdown')).toHaveCount(0);
  await context.close();
 }
 const context=await browser.newContext(),page=await context.newPage();
 for(const [alias,canonical,title] of [['/why-exhibit',base,'Why Exhibit?'],['/stand-options',base+'/stand-options','Stand Options'],['/contact',contact,'Contact Us']]){
  await page.goto(origin+alias,{waitUntil:'domcontentloaded'});await expect(page.locator('main h1')).toHaveText(title);await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',new RegExp(canonical+'/?$'));
 }
 assert.deepEqual(errors,[]);await fs.writeFile(folder+(menusOnly?'/menus-results.json':'/results.json'),JSON.stringify({pages:routes.length,checks,errors,menus:true,forms:true,directories:true,aliases:true},null,2));
 console.log(JSON.stringify({pages:routes.length,checks:checks.length,menusOnly,errors:errors.length,menus:true,forms:true,directories:true,aliases:true}));
}finally{await browser.close();}
