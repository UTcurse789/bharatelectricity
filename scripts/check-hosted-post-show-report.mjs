import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const folder='research/qa/media';await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
try{
 for(const width of [1440,375]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
  await page.goto(origin+'/media-hub/postshowreport/',{waitUntil:'domcontentloaded'});
  const iframe=page.locator('#report-request iframe');await iframe.scrollIntoViewIfNeeded();
  const frame=page.frameLocator('#report-request iframe');await frame.locator('input:visible').first().waitFor({timeout:45000});
  await page.waitForTimeout(2000);
  const metrics=await frame.locator('body').evaluate(body=>({visibleInputs:[...body.querySelectorAll('input')].filter(i=>i.getBoundingClientRect().width>0).length,innerWidth,scrollWidth:document.documentElement.scrollWidth}));
  assert(metrics.visibleInputs>0);assert(metrics.scrollWidth<=metrics.innerWidth,'Hosted report form fits at '+width);assert.equal((await iframe.boundingBox()).height,1200);
  const src=await iframe.getAttribute('src');assert(src.includes('QueryType=Post%20Show%20Report%20Download&gclid=undefined&utm_source=www.powergen-india.com&utm_medium=referral'));
  await page.screenshot({path:folder+'/hosted-report-'+width+'.png'});
  results.push({width,iframeHeight:1200,...metrics});console.log(JSON.stringify(results.at(-1)));await context.close();
 }
 await fs.writeFile(folder+'/hosted-report-results.json',JSON.stringify(results,null,2));
}finally{await browser.close();}
