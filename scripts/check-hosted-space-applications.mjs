import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[],folder='research/qa/exhibitor-document';
try{
 for(const width of [1440,375]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
  await page.goto((process.env.CHECK_ORIGIN||'http://localhost:4173')+'/space-application-form/',{waitUntil:'domcontentloaded'});
  for(let index=0;index<await page.getByRole('tab').count();index++){
   await page.getByRole('tab').nth(index).click();
   const iframe=page.locator('.space-applications iframe');await iframe.scrollIntoViewIfNeeded();
   const frame=page.frameLocator('.space-applications iframe');
   await frame.locator('input:visible').first().waitFor({timeout:45000});
   await page.waitForTimeout(2000);
   const metrics=await frame.locator('body').evaluate(body=>({visibleInputs:[...body.querySelectorAll('input')].filter(i=>i.getBoundingClientRect().width>0).length,innerWidth:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
   assert(metrics.visibleInputs>0,'Live form rendered');
   assert(metrics.scrollWidth<=metrics.innerWidth,'Hosted form fits at '+width);
   results.push({width,category:index,...metrics});
   await page.locator('.space-applications').screenshot({path:folder+'/hosted-application-'+index+'-'+width+'.png'});
   console.log(JSON.stringify(results.at(-1)));
  }
  await context.close();
 }
 await fs.writeFile(folder+'/hosted-applications.json',JSON.stringify(results,null,2));
}finally{await browser.close();}
