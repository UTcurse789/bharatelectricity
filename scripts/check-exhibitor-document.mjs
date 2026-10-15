import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {load} from 'cheerio';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const source=JSON.parse((await fs.readFile('research/document-source/structured.json','utf8')).replace(/^\uFEFF/,''));
const data=JSON.parse(await fs.readFile('src/content/exhibitor-document.json','utf8'));
const origin=process.env.CHECK_ORIGIN||'http://localhost:4174';
const mobileOnly=process.argv.includes('--mobile-only');
const folder='research/qa/exhibitor-document';await fs.mkdir(folder,{recursive:true});
const html=load(await fs.readFile('out/exhibitor-guide/index.html','utf8'));
const normalize=text=>text.replace(/\s+/g,' ').trim().toLowerCase();
const body=normalize(html('main').text());
// Every substantive manual paragraph is present, including closed disclosures.
for(const p of source.paragraphs.filter(p=>p.index>=27&&p.index<=273&&p.text.trim()))assert(body.includes(normalize(p.index===73?p.text.replace('+9990401916','+91 9990401916'):p.text)),`Missing manual paragraph ${p.index}`);
assert.equal(html('.manual-order-forms>li').length,15);
const sourceLinks=source.paragraphs.flatMap(p=>p.links.map(l=>l.href));
assert.deepEqual(html('.manual-order-actions a').map((i,a)=>html(a).attr('href')).get(),sourceLinks);
assert.deepEqual(data.forms.slice(3).map(f=>f.src),["https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormDomestic2027N/formperma/N8WS6AKNb7lC2fp_92boIq_XrEL3AOsnIDebLPjOQ9k", "https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormInternational1/formperma/Lur470GtF_mm-smpo0Ud4RGxqiAxuw1DlPtpmmvh7H4", "https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormStartups2027/formperma/R7jFkslLomxLg705prhmySCq1jxhWzLQ3oUrIeMzPBg", "https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormDOMMSME2027NE/formperma/zqMXnmCJ_vEuHwq22o_4g1BbeoeCvBlV86DYsz3RSlQ"]);
for(const [index,type] of ['Brochure Download','Floor Plan Download','Exhibit'].entries())assert.equal(data.forms[index].src,'https://forms.zohopublic.in/itenmedia1/form/BharatElectricity2027/formperma/CaEO_SoMUJ1Tlv-mISKv8t9jJWMKdg-vXOfIhl2oLQk?QueryType='+encodeURIComponent(type));
assert.equal(html('.exhibition-manual-section').length,7);
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],checks=[];
try{
 for(const width of mobileOnly?[375]:[1440,375,320]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://forms.zohopublic.in/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html><body>Provider form placeholder for local layout QA.</body></html>'}));
  await page.goto(origin+'/exhibitor-guide/',{waitUntil:'networkidle'});
  await expect(page.locator('main h1')).toHaveText('Exhibitor Manual');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Manual fits '+width);
  await expect(page.locator('.manual-order-actions a')).toHaveCount(19);
  for(const section of data.construction){
   const detail=page.locator('#'+section.id);await detail.locator('summary').click();await expect(detail).toHaveAttribute('open','');
  }
  await expect(page.locator('.manual-inclusions tbody tr')).toHaveCount(9);
  await page.locator('.manual-stand-diagram').scrollIntoViewIfNeeded();
  await expect.poll(()=>page.locator('.manual-stand-diagram img').evaluate(img=>img.naturalWidth>0)).toBe(true);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Expanded guides fit '+width);
  const axe=await new AxeBuilder({page}).include('#main-content').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);
  await page.locator('#construction-2').screenshot({path:folder+'/shell-scheme-'+width+'.png'});
  await page.locator('#manual-order-forms').screenshot({path:folder+'/order-forms-'+width+'.png'});
  await page.locator('#manual-contacts').screenshot({path:folder+'/contacts-'+width+'.png'});
  await page.goto(origin+'/space-application-form/',{waitUntil:'networkidle'});
  const tabs=page.getByRole('tab');await expect(tabs).toHaveCount(4);
  for(let index=0;index<data.forms.length-3;index++){
   await tabs.nth(index).click();await expect(tabs.nth(index)).toHaveAttribute('aria-selected','true');
   await expect(page.locator('.space-applications iframe')).toHaveAttribute('src',data.forms[index+3].src);
   assert.equal((await page.locator('.space-applications iframe').boundingBox()).height,data.forms[index+3].height);
   await expect(page.locator('.space-applications a')).toHaveAttribute('href',data.forms[index+3].src);
  }
  await tabs.nth(2).press('Home');await expect(tabs.nth(0)).toBeFocused();await tabs.nth(0).press('ArrowRight');await expect(tabs.nth(1)).toBeFocused();await expect(tabs.nth(1)).toHaveAttribute('aria-selected','true');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Applications fit '+width);
  const applicationsAxe=await new AxeBuilder({page}).include('#main-content').exclude('iframe').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(applicationsAxe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);
  await page.locator('.exhibition-request').screenshot({path:folder+'/space-application-'+width+'.png'});
  await page.goto(origin+'/space-application-form-secondary/',{waitUntil:'networkidle'});await expect(page.getByRole('tab',{name:'International companies'})).toHaveAttribute('aria-selected','true');await expect(page.locator('.space-applications iframe')).toHaveAttribute('src',data.forms[4].src);
  await page.goto(origin+'/space-application-form-startups/',{waitUntil:'networkidle'});await expect(page.locator('.exhibition-form iframe')).toHaveAttribute('src',data.forms[5].src);
  for(const [route,index] of [['request-the-event-prospectus',0],['view-the-floor-plan-92u6',1],['make-a-stand-enquiry',2]]){
   await page.goto(origin+'/exhibit-at-powergen-india/'+route+'/',{waitUntil:'networkidle'});await expect(page.locator('.exhibition-form iframe')).toHaveAttribute('src',data.forms[index].src);
  }
  checks.push({width,manualParagraphs:'complete',orderForms:15,links:19,applicationCategories:4});await context.close();
 }
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({checks,errors,orderUrlsPreserved:true,currentApplicationCategories:4}));
 await fs.writeFile(folder+(mobileOnly?'/final-mobile-results.json':'/results.json'),JSON.stringify({checks,errors,orderUrlsPreserved:true,currentApplicationCategories:4},null,2));
}finally{await browser.close();}
