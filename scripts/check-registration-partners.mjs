import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const directory='research/qa/registration-partners';
await fs.mkdir(directory,{recursive:true});
const imported=JSON.parse(await fs.readFile('src/content/imported.json','utf8'));
const historical=JSON.parse(await fs.readFile('src/content/participants-2025.json','utf8'));
const upgrades=JSON.parse(await fs.readFile('src/content/partner-artwork-upgrades.json','utf8'));
const main=JSON.parse(await fs.readFile('src/content/main-partners-2025.json','utf8'));
for(const logo of [...imported.companies.map(item=>item.logo),...historical.records.map(item=>item.image),...main.map(item=>item.src),...upgrades.map(item=>item.src)]) {
 assert(logo,'Every published exhibitor/partner entry has artwork');
 const image=await sharp('public'+logo).metadata();
 assert(image.width>0&&image.height>0,'Artwork is decodable: '+logo);
}
for(const item of upgrades.filter(item=>/Ministry/.test(item.name)))assert(item.width>=1200&&item.height>=1000,'Native ministry artwork resolution');
assert.equal(main.length,21,'All main 2025 partner placements');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],results=[];
try {
 for(const width of [1440,768,375,320]) {
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  // Test the local UI without opening or submitting a provider-owned booking form.
  await page.route('https://forms.zohopublic.in/**',route=>route.abort());
  await page.goto(origin,{waitUntil:'networkidle'});
  let register=page.locator('.header-cta');
  if(!await register.isVisible()) {
   await page.getByRole('button',{name:'Open navigation',exact:true}).click();
   register=page.locator('.mobile-nav').getByRole('link',{name:'Register',exact:true});
  }
  await expect(register).toHaveAttribute('href',/^\/registration-options\/?$/);
  await register.click();
  await expect(page.locator('main h1')).toHaveText('Register');
  await expect(page.locator('.registration-highlight-grid article')).toHaveCount(4);
  await expect(page.locator('.registration-help-grid article')).toHaveCount(3);
  await expect(page.locator('.registration-navigation').getByRole('link',{name:'Make a stand enquiry',exact:true})).toHaveAttribute('href',/^\/exhibit-at-powergen-india\/make-a-stand-enquiry\/?$/);
  await page.locator('.registration-help').scrollIntoViewIfNeeded();
  await expect.poll(()=>page.locator('.registration-help-grid img').evaluateAll(images=>images.every(img=>img.naturalWidth>0))).toBe(true);
  if(width===1440||width===375)await page.locator('.registration-page').screenshot({path:`${directory}/register-${width}.png`,style:'.site-header,.skip-link{visibility:hidden!important}'});

  for(const [path,noun,title] of [['/visitor-registration/','visitor','Visitor Registration 2026'],['/summit-overview/register/','delegate','Delegate Registration']]) {
   await page.goto(origin+path,{waitUntil:'domcontentloaded'});
   await expect(page.locator('main h1')).toHaveText(title);
   await expect(page.locator('.registration-audience')).toHaveCount(noun==='visitor'?2:4);
   if(noun==='visitor') {
    await page.locator('.registration-audience').last().getByRole('link',{name:'View visitor form'}).click();
    const widget=page.locator('#konfhub-widget');
    await expect(widget).toHaveAttribute('allow','payment');
    await expect(widget).toHaveAttribute('height','700');
    const src=new URL(await widget.getAttribute('src'));
    assert.equal(src.hostname,'konfhub.com');
    assert.equal(src.searchParams.get('tickets'),'114966');
    assert.equal(src.searchParams.get('ticketId'),'114966|0');
    await expect(page.getByRole('link',{name:'Open visitor form in a new tab'})).toHaveAttribute('href',src.href);
    await expect(page.frameLocator('#konfhub-widget').getByText('Expired',{exact:true})).toBeVisible({timeout:25000});
   } else {
    await page.locator('.registration-audience').last().getByRole('link',{name:'Enquire about this pass'}).click();
    await expect(page.getByRole('combobox',{name:'Delegate category'})).toHaveValue('International student delegate');
    const form=page.locator('.registration-enquiry form');
    await form.getByRole('button',{name:'Check enquiry'}).click();
    await expect(form.getByRole('alert')).toBeVisible();
    await form.getByRole('textbox',{name:'Full name'}).fill('Registration QA');
    await form.getByRole('textbox',{name:'Email address'}).fill('registration@example.com');
    await form.getByRole('textbox',{name:'Organisation'}).fill('QA Organisation');
    await form.getByRole('textbox',{name:'Your enquiry'}).fill('Please share approved registration information for the next edition.');
    await form.getByRole('checkbox').check();
    await form.getByRole('button',{name:'Check enquiry'}).click();
    const email=form.getByRole('link',{name:'Prepare email'});
    await expect(email).toHaveAttribute('href',/^mailto:/);
    assert(decodeURIComponent(await email.getAttribute('href')).includes('International student delegate registration enquiry'),'Pass category included in prepared email');
    await expect(form.getByRole('status')).toContainText('has not been sent');
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path+' fits '+width+'px');
   if(width===1440||width===375) {
    await page.locator('.registration-audiences').screenshot({path:`${directory}/${noun}-options-${width}.png`});
    if(noun==='visitor')await page.locator('.registration-widget').screenshot({path:`${directory}/visitor-widget-${width}.png`});
    const scan=await new AxeBuilder({page}).exclude('#konfhub-widget').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    assert.deepEqual(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],title+' local accessibility');
   }
  }

  if(process.argv.includes('--registration-only')) {
   results.push({width,registrationNavigation:true,visitorWidget:'loads; 2026 ticket expired',delegateCategories:4,preparedEmails:true});
   await context.close();
   continue;
  }
  for(const year of [2026,2025]) {
   await page.goto(origin+(year===2026?'/partners-2026-o1rs/':'/partners-2025/'),{waitUntil:'networkidle'});
   await expect(page.locator('main h1')).toHaveText('Partners '+year);
   await expect(page.locator('.all-partners details')).toHaveCount(0);
   const first=page.locator('.partner-role img').first();
   await expect.poll(()=>first.evaluate(img=>img.naturalWidth)).toBeGreaterThan(0);
   assert((await first.boundingBox()).y<1000,'Primary partner artwork is visible on opening');
   if(year===2025) {
    await expect(page.getByRole('img',{name:'GE Vernova',exact:true})).toHaveCount(2);
    await expect(page.getByRole('img',{name:'ISGEC',exact:true})).toHaveCount(1);
    await expect(page.getByRole('img',{name:'Suzlon',exact:true})).toHaveCount(1);
    await expect(page.locator('.all-partners img')).toHaveCount(147);
   } else {
    await expect(page.locator('.partner-government img')).toHaveCount(8);
    assert(await page.locator('.all-partners img').count()>=100,'All 2026 supporting organisations');
    await page.locator('.partner-government img').first().scrollIntoViewIfNeeded();
    await expect.poll(()=>page.locator('.partner-government img').first().evaluate(img=>img.naturalWidth)).toBeGreaterThanOrEqual(1200);
   }
   await page.locator('.all-partners img').evaluateAll(images=>images.forEach(img=>{img.loading='eager';}));
   await expect.poll(()=>page.locator('.all-partners img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0)),{timeout:20000}).toBe(true);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Partner directory fits '+width+'px');
   if(width===1440||width===375) {
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:`${directory}/partners-${year}-${width}.png`});
    const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    assert.deepEqual(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],'Partners '+year+' accessibility');
   }
  }

  await page.goto(origin+'/space-application-form/',{waitUntil:'networkidle'});
  await expect(page.locator('main iframe')).toHaveCount(1);
  await expect(page.getByRole('link',{name:'Open the form in a new tab'})).toHaveAttribute('href',/^https:\/\/forms.zohopublic.in\//);
  for(const route of ['/exhibitors/','/participants-2025/']) {
   await page.goto(origin+route,{waitUntil:'networkidle'});
   while(await page.getByRole('button',{name:'Show more companies'}).count())await page.getByRole('button',{name:'Show more companies'}).click();
   await expect(page.locator('.exhibition-company-logo img')).toHaveCount(99);
   await page.locator('.exhibition-company-logo img').evaluateAll(images=>images.forEach(img=>{img.loading='eager';}));
   await expect.poll(()=>page.locator('.exhibition-company-logo img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0)),{timeout:20000}).toBe(true);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' fits '+width+'px');
  }
  results.push({width,registrationNavigation:true,audienceForms:true,preparedEmails:true,partnerLogosLoaded:true,exhibitorLogos:198});
  await context.close();
 }
 assert.deepEqual(errors,[],'No browser exceptions');
 await fs.writeFile(`${directory}/results.json`,JSON.stringify({results,errors},null,2));
 console.log(JSON.stringify({results,errors}));
} finally {await browser.close();}
