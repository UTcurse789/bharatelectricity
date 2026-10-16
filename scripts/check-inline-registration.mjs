import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const folder='research/qa/inline-registration';
const formId='CaEO_SoMUJ1Tlv-mISKv8t9jJWMKdg-vXOfIhl2oLQk';
const thanks='/thankyou-for-registrating-in-bharatelectricity2027/';
const categories=['Domestic delegate','International delegate','Domestic student delegate','International student delegate'];
await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],checks=[];
try{
 for(const width of [1440,768,375,320]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
  // Exercise the real cross-origin message contract without submitting a registration.
  await page.route('https://forms.zohopublic.in/**',route=>route.fulfill({contentType:'text/html',body:`<!doctype html><html lang="en"><head><title>Registration sizing fixture</title><style>body{margin:0;font:16px Arial;color:#334139}main{height:1200px;padding:24px;box-sizing:border-box}label,input,button{display:block;margin-bottom:20px}</style></head><body><main><label>Name<input aria-label="Name"></label><button type="button" onclick="document.querySelector('main').style.height='1850px';parent.postMessage('${formId}|1850','*')">Show additional fields</button></main><script>parent.postMessage('${formId}|1200','*')</script></body></html>`}));
  await page.goto(origin+'/registration-options/',{waitUntil:'networkidle'});
  assert(await page.locator('.registration-navigation').evaluate(el=>el.previousElementSibling?.classList.contains('registration-hero')),'Registration shortcuts immediately follow the title');
  await expect(page.locator('.registration-bottom')).toHaveCount(0);
  await page.getByRole('navigation',{name:'Registration',exact:true}).getByRole('link',{name:'Delegate registration',exact:true}).click();
  await expect(page.locator('main h1')).toHaveText('Delegate Registration');
  await expect(page.locator('main iframe')).toHaveCount(0);
  const buttons=page.locator('.registration-audience button');
  await expect(buttons).toHaveCount(4);
  for(const [index,name] of categories.entries()){
   if(index===0){await buttons.nth(index).focus();await buttons.nth(index).press('Enter');}
   else{
    await buttons.nth(index).scrollIntoViewIfNeeded();
    // Let Chrome commit the parent scroll after a cross-origin frame was focused.
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await buttons.nth(index).click();
   }
   await expect(page.locator('.registration-selected-category')).toContainText(name);
   await expect(buttons.nth(index)).toHaveAttribute('aria-expanded','true');
   await expect(page.locator('.registration-enquiry')).toBeFocused();
   const iframe=page.locator('.registration-enquiry iframe');
   await expect(iframe).toHaveCount(1);
   await expect(iframe).toHaveAttribute('src',/^https:\/\/forms\.zohopublic\.in\//);
   const url=new URL(await iframe.getAttribute('src'));
   assert.equal(url.searchParams.get('QueryType'),'Delegate Registration');
   assert.equal(url.searchParams.get('zf_rszfm'),'1');
   await expect(iframe).toHaveAttribute('scrolling','no');
   await iframe.scrollIntoViewIfNeeded();
   const provider=page.frameLocator('.registration-enquiry iframe');
   if(index===0){
    await expect(iframe).toHaveAttribute('height','1220');
    await provider.getByRole('textbox',{name:'Name',exact:true}).fill('Retained registration details');
    await provider.getByRole('button',{name:'Show additional fields'}).click();
    await expect(iframe).toHaveAttribute('height','1870');
    const frame=page.frames().find(f=>f.url().includes('/formperma/'));
    await frame.evaluate(()=>parent.postMessage('another-form|500','*'));
    await expect(iframe).toHaveAttribute('height','1870');
    await frame.evaluate(id=>{for(const n of ['NaN','Infinity','-2','999999'])parent.postMessage(id+'|'+n,'*');},formId);
    await expect(iframe).toHaveAttribute('height','1870');
    await page.evaluate(id=>window.dispatchEvent(new MessageEvent('message',{origin:'https://forms.zohopublic.in',source:window,data:id+'|200'})),formId);
    await expect(iframe).toHaveAttribute('height','1870');
    await frame.evaluate(id=>{document.querySelector('main').style.height='1200px';parent.postMessage(id+'|1200','*');},formId);
    await expect(iframe).toHaveAttribute('height','1220');
   }
   await expect(provider.getByRole('textbox',{name:'Name',exact:true})).toHaveValue('Retained registration details');
   assert.equal(context.pages().length,1,'Choosing a form opens no tab');
   assert.equal(new URL(page.url()).pathname,'/summit-overview/register/');
  }
  await expect(page.getByRole('link',{name:'Open the form in a new tab'})).toHaveCount(0);
  await page.locator('.registration-enquiry iframe').hover();
  const beforeWheel=await page.evaluate(()=>scrollY);
  await page.mouse.wheel(0,250);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(beforeWheel);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow at '+width);
  if([1440,375].includes(width)){
   await page.locator('.registration-audiences').screenshot({path:folder+'/delegate-options-'+width+'.png'});
   const axe=await new AxeBuilder({page}).include('#main-content').exclude('iframe').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],'Delegate accessibility');
  }
  await page.goto(origin+'/visitor-registration/',{waitUntil:'networkidle'});
  const visitor=page.locator('#visitor-registration-form iframe');
  await visitor.scrollIntoViewIfNeeded();
  await expect(visitor).toHaveAttribute('height','1220');
  await expect(visitor).toHaveAttribute('scrolling','no');
  assert.equal(new URL(await visitor.getAttribute('src')).searchParams.get('QueryType'),'Visit');
  assert.equal((await page.goto(origin+thanks,{waitUntil:'networkidle'})).status(),200);
  await expect(page.locator('main h1')).toHaveText('Thank you for registering');
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Thank-you page fits '+width);
  if([1440,375].includes(width)){
   await page.screenshot({path:folder+'/thankyou-'+width+'.png',fullPage:true});
   const axe=await new AxeBuilder({page}).include('#main-content').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],'Thank-you accessibility');
  }
  await page.getByRole('link',{name:'Back to home',exact:true}).click();
  await expect(page).toHaveURL(origin+'/');
  checks.push({width,inlineCategories:4,retainedDetails:true,growsAndShrinks:true,untrustedMessagesIgnored:true,noNewTabs:true,thankYouPage:true});
  await context.close();
 }
 assert.deepEqual(errors,[]);
 await fs.writeFile(folder+'/results.json',JSON.stringify({checks,errors,providerFramesMocked:true},null,2));
 console.log(JSON.stringify({checks,errors,providerFramesMocked:true}));
}finally{await browser.close();}
