import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const directory='research/qa/speaking-opportunities';
const path='/summit-overview/speaking-opportunities-bharat-electricity/';
await fs.mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[],errors=[],providerAccessibility=[];
try {
 for(const width of [1440,768,375,320]) {
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin+path,{waitUntil:'domcontentloaded'});
  await expect(page.locator('main h1')).toHaveText('Speaking Opportunities');
  await expect(page.getByRole('heading',{name:'Be part of the summit',exact:true})).toBeVisible();
  const frame=page.locator('.speaking-page iframe');
  await expect(frame).toHaveCount(1);
  const url=new URL(await frame.getAttribute('src'));
  assert.equal(url.hostname,'forms.zohopublic.in');
  assert.equal(url.searchParams.get('QueryType'),'Speaking Opportunities');
  assert(url.pathname.endsWith('/CaEO_SoMUJ1Tlv-mISKv8t9jJWMKdg-vXOfIhl2oLQk'));
  await frame.scrollIntoViewIfNeeded();
  assert.equal((await frame.boundingBox()).height,600);
  await expect.poll(()=>page.locator('.speaking-copy img').evaluate(img=>img.naturalWidth)).toBeGreaterThan(0);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Speaking layout fits the viewport');
  await expect(page.getByRole('link',{name:'Open the form in a new tab'})).toHaveAttribute('href',url.href);
  if(width===1440||width===375) {
   await page.locator('.speaking-section').screenshot({path:`${directory}/speaking-${width}.png`});
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
   const issues=axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));
   providerAccessibility.push({width,issues:issues.map(issue=>({...issue,nodes:issue.nodes.filter(target=>target[0]==='iframe')})).filter(issue=>issue.nodes.length)});
   assert.deepEqual(issues.map(issue=>({...issue,nodes:issue.nodes.filter(target=>target[0]!=='iframe')})).filter(issue=>issue.nodes.length),[],'Local speaking page accessibility');
  }
  await page.goto(origin+'/speaking-opportunities/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.speaking-page iframe')).toHaveAttribute('src',url.href);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',new RegExp('/summit-overview/speaking-opportunities-bharat-electricity/?$'));
  results.push({width,alias:'works',form:'600px embedded Zoho form with direct fallback',layout:'no overflow'});
  await context.close();
 }
 assert.deepEqual(errors,[],'Local page JavaScript errors');
 await fs.writeFile(`${directory}/results.json`,JSON.stringify({results,errors,providerAccessibility},null,2));
 console.log(JSON.stringify({results,errors,providerAccessibility}));
} finally {await browser.close();}
