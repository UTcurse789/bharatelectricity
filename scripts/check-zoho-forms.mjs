import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {load} from 'cheerio';

const formBase='https://forms.zohopublic.in/itenmedia1/form/BharatElectricity2027/formperma/CaEO_SoMUJ1Tlv-mISKv8t9jJWMKdg-vXOfIhl2oLQk';
const routes=[
 ['/exhibit-at-powergen-india/request-the-event-prospectus','Brochure Download'],
 ['/media-hub/postshowreport','Post Show Report Download'],
 ['/request-the-partnership-brochure','Partnership Brochure Download'],
 ['/exhibit-at-powergen-india/view-the-floor-plan-92u6','Floor Plan Download'],
 ['/exhibit-at-powergen-india/make-a-stand-enquiry','Exhibit'],
 ['/request_a_call_back','Request a call back'],
 ['/summit-overview/register','Delegate Registration'],
 ['/summit-overview/speaking-opportunities-bharat-electricity','Speaking Opportunities'],
 ['/partner/sponsor','Partnership Opportunities'],
 ['/visitor-registration','Visit'],
 ['/about-powergen-india/contact-us','Request a call back'],
 ['/contact','Request a call back'],
 ['/become-a-sponsor','Partnership Opportunities'],
 ['/become-sponsor-indian-utility-week','Partnership Opportunities'],
 ['/speaking-opportunities','Speaking Opportunities'],
 ['/summit-overview/speaking-opportunities','Speaking Opportunities'],
 ['/summit-overview/speaking-opportunities-indian-utility-week','Speaking Opportunities']
];
const urlFor=type=>formBase+'?QueryType='+encodeURIComponent(type);
const spaceApplications=[
 ['Indian companies','https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormDomestic2027N/formperma/N8WS6AKNb7lC2fp_92boIq_XrEL3AOsnIDebLPjOQ9k'],
 ['International companies','https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormInternational1/formperma/Lur470GtF_mm-smpo0Ud4RGxqiAxuw1DlPtpmmvh7H4'],
 ['Startups','https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormStartups2027/formperma/R7jFkslLomxLg705prhmySCq1jxhWzLQ3oUrIeMzPBg'],
 ['MSMEs','https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormDOMMSME2027NE/formperma/zqMXnmCJ_vEuHwq22o_4g1BbeoeCvBlV86DYsz3RSlQ']
];
for(const [route,type] of routes){
 const $=load(await fs.readFile('out'+route+'/index.html','utf8'));
 const url=urlFor(type);
 assert.equal($('main iframe').length,1,route+' has one hosted form');
 assert.equal($('main iframe').attr('src'),url,route+' enquiry type');
 assert($('main a[target="_blank"]').toArray().some(link=>$(link).attr('href')===url),route+' direct fallback');
 if(type==='Visit'){assert.equal($('main h1').text(),'Visitor Registration 2027');assert.equal($('.registration-audience').length,0);}
 if(type==='Delegate Registration'){
  assert.equal($('.registration-audience a').length,4);
  assert($('.registration-audience a').toArray().every(link=>$(link).attr('href')===url));
 }
 assert.equal($('main form').length,0,route+' uses the hosted submission form');
}
const booking=load(await fs.readFile('out/space-application-form/index.html','utf8'));
assert.deepEqual(booking('.space-application-tabs button').toArray().map(button=>booking(button).text()),spaceApplications.map(([category])=>category));
assert.equal(booking('.space-applications iframe').attr('src'),spaceApplications[0][1]);
for(const route of ['/new-initiatives/startups','/space-application-form-startups']){
 const $=load(await fs.readFile('out'+route+'/index.html','utf8'));
 assert.equal($('main iframe').attr('src'),spaceApplications[2][1],route+' startup application');
 assert($('main a[target="_blank"]').toArray().some(link=>$(link).attr('href')===spaceApplications[2][1]));
}
let htmlPages=0;
async function scan(dir){
 for(const entry of await fs.readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())await scan(file);
  else if(entry.name.endsWith('.html')){
   const $=load(await fs.readFile(file,'utf8'));htmlPages++;
   for(const el of $('iframe[src],a[href]')){
    const url=$(el).attr('src')||$(el).attr('href');
    assert(!url?.includes('/ITENMediaBharatElectricity/'),file+' has an old enquiry URL');
    assert(!url?.includes('konfhub.com/widget'),file+' has the old visitor widget');
    for(const oldId of ['33wuOjGw7kOE_3AZRiHT-8-e2mZtEb0QAGqGagtLeg8','BwQAtt-xJxbF6mukw4y_FZizeMgC5Y1KVNv6IULlo6o','6E7E2hoFz218JCc_TrZFwdNNxLWRxHQtO1fhjXktBh4'])assert(!url?.includes(oldId),file+' has an old space application URL');
   }
  }
 }
}
await scan('out');
console.log(JSON.stringify({routes:routes.length,uniqueEnquiryTypes:10,spaceApplicationCategories:4,htmlPages,oldEnquiryLinks:0}));

if(process.argv.includes('--browser')){
 const {chromium,expect}=await import('@playwright/test');
 const {default:AxeBuilder}=await import('@axe-core/playwright');
 const folder='research/qa/zoho-2027';await fs.mkdir(folder,{recursive:true});
 const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:'4175'},stdio:'pipe',windowsHide:true});
 let browser;const errors=[],checks=[];
 try{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
  browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  for(const width of [1440,375,320]){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
   page.on('pageerror',error=>errors.push(error.message));
   await page.route('https://forms.zohopublic.in/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html lang="en"><head><title>Form layout check</title></head><body>Hosted form placeholder for local layout checks.</body></html>'}));
   for(const [route,type] of process.argv.includes('--space-only')?[]:routes.slice(0,10)){
    assert.equal((await page.goto('http://127.0.0.1:4175'+route+'/',{waitUntil:'networkidle'})).status(),200);
    const iframe=page.locator('main iframe');await expect(iframe).toHaveAttribute('src',urlFor(type));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' fits '+width);
    const scan=await new AxeBuilder({page}).include('#main-content').exclude('iframe').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    assert.deepEqual(scan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],route+' accessibility');
    if(['Visit','Delegate Registration','Request a call back'].includes(type)&&width!==320){
     await iframe.scrollIntoViewIfNeeded();
     await iframe.locator('..').screenshot({path:folder+'/'+type.replaceAll(' ','-').toLowerCase()+'-'+width+'.png'});
    }
    checks.push({width,route,type});
   }
   await page.goto('http://127.0.0.1:4175/space-application-form/',{waitUntil:'networkidle'});
   const tabs=page.getByRole('tab');await expect(tabs).toHaveCount(4);
   for(const [index,[category,url]] of spaceApplications.entries()){
    await tabs.nth(index).click();await expect(tabs.nth(index)).toHaveAttribute('aria-selected','true');
    await expect(page.locator('.space-applications iframe')).toHaveAttribute('src',url);
    await expect(page.locator('.space-applications a[target="_blank"]')).toHaveAttribute('href',url);
    await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby',await tabs.nth(index).getAttribute('id'));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),category+' fits '+width);
    checks.push({width,category,embedAndFallback:true});
   }
   await tabs.nth(3).press('ArrowRight');await expect(tabs.nth(0)).toBeFocused();
   await tabs.nth(0).press('ArrowLeft');await expect(tabs.nth(3)).toBeFocused();
   await tabs.nth(3).press('Home');await expect(tabs.nth(0)).toBeFocused();
   await tabs.nth(0).press('End');await expect(tabs.nth(3)).toBeFocused();
   await expect(tabs.nth(3)).toHaveAttribute('aria-selected','true');
   const applicationAxe=await new AxeBuilder({page}).include('#main-content').exclude('iframe').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(applicationAxe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],'Space application accessibility');
   if(width!==320)await page.locator('.space-applications').screenshot({path:folder+'/space-applications-'+width+'.png'});
   await page.goto('http://127.0.0.1:4175/space-application-form-secondary/',{waitUntil:'networkidle'});
   await expect(page.getByRole('tab',{name:'International companies',exact:true})).toHaveAttribute('aria-selected','true');
   await expect(page.locator('.space-applications iframe')).toHaveAttribute('src',spaceApplications[1][1]);
   checks.push({width,alias:'international',correctForm:true});
   await page.goto('http://127.0.0.1:4175/space-application-form-startups/',{waitUntil:'networkidle'});
   await expect(page.locator('main iframe')).toHaveAttribute('src',spaceApplications[2][1]);
   checks.push({width,alias:'startup',correctForm:true});
   await context.close();
  }
  assert.deepEqual(errors,[]);await fs.writeFile(folder+'/results.json',JSON.stringify({checks,errors,providerFramesMocked:true},null,2));
  console.log(JSON.stringify({browserChecks:checks.length,errors,providerFramesMocked:true}));
 }finally{await browser?.close();server.kill();}
}
