import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],passed=[];
await fs.mkdir('research/qa/legacy',{recursive:true});
try{
 for(const width of [1440,768,375,320]){
  const context=await browser.newContext({viewport:{width,height:1000}});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  const remoteImages=[];
  page.on('request',request=>{if(request.resourceType()==='image'&&/unsplash|picsum/.test(request.url()))remoteImages.push(request.url());});
  await page.goto(origin+'/event/legacy/',{waitUntil:'domcontentloaded'});
  const legacy=page.locator('.legacy-page');
  await expect(legacy.getByRole('heading',{level:1,name:'Our legacy',exact:true})).toBeVisible();
  await expect(legacy.locator('.legacy-edition')).toHaveCount(1);
  assert(!/2025|2026/.test(await legacy.innerText()),'Only the 2024 edition is populated');
  assert((await legacy.textContent()).includes('in 2014.'),'Supplied quotation year preserved');
  await expect(legacy.locator('.legacy-numbers .legacy-metrics>div')).toHaveCount(10);
  await expect(legacy.locator('.legacy-demographics>div')).toHaveCount(4);
  await expect(legacy.locator('.legacy-feedback-charts .legacy-chart')).toHaveCount(6);
  await expect(legacy.locator('.legacy-source-reference')).toHaveCount(5);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow at '+width);
  if(width===1440){
   await expect(legacy.locator('.legacy-year-rail')).toHaveCSS('position','sticky');
   await legacy.locator('.legacy-intro').screenshot({path:'research/qa/legacy/1440-intro.png'});
  }
  const tabs=legacy.getByRole('tablist',{name:'2024 event highlights'});
  for(const [index,label]of ['Day 1','Day 2','Day 3'].entries()){
   await tabs.getByRole('tab',{name:label,exact:true}).click();
   await expect(tabs.getByRole('tab',{name:label,exact:true})).toHaveAttribute('aria-selected','true');
   await expect(legacy.getByRole('tabpanel')).toHaveCount(1);
   const panel=legacy.getByRole('tabpanel');
   if(index===0){
    await expect(panel.getByRole('heading',{name:'Day 1 Glimpse'})).toBeVisible();
    const carousel=panel.locator('.circular-carousel');
    await carousel.scrollIntoViewIfNeeded();
    await expect(carousel).toHaveAttribute('data-ready','');
    await expect(carousel.locator('.circular-carousel__card')).toHaveCount(6);
    await expect.poll(()=>carousel.locator('img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
    assert.equal(await carousel.locator('img').evaluateAll(images=>new Set(images.map(image=>new URL(image.src).pathname)).size),6);
    await page.mouse.move(0,0);
    await page.waitForTimeout(2000);
    const pose=carousel.locator('.circular-carousel__card').first();
    const moving=await pose.getAttribute('style');
    await expect(pose).not.toHaveAttribute('style',moving,{timeout:3000});
    await legacy.getByRole('button',{name:'Pause day gallery',exact:true}).click();
    await page.waitForTimeout(200);
    const paused=await pose.getAttribute('style');
    await page.waitForTimeout(400);
    await expect(pose).toHaveAttribute('style',paused);
    if(width===1440||width===375){
     await carousel.scrollIntoViewIfNeeded();
     await carousel.screenshot({path:`research/qa/legacy/${width}-day-1.png`});
    }
    await legacy.getByRole('button',{name:'Resume day gallery',exact:true}).click();
    await carousel.scrollIntoViewIfNeeded();
    await page.mouse.move(0,0);
    const resumed=await pose.getAttribute('style');
    await expect(pose).not.toHaveAttribute('style',resumed,{timeout:3000});
    await carousel.focus();
    await page.keyboard.press('Home');
    await expect(carousel.locator('.circular-carousel__live')).toContainText('1 of 6');
    await page.keyboard.press('ArrowRight');
    await expect(carousel.locator('.circular-carousel__live')).toContainText('2 of 6');
   }else{
    await expect(panel.getByRole('heading',{name:label+' photographs'})).toBeVisible();
    await expect(panel.locator('img')).toHaveCount(0);
   }
  }
  await tabs.getByRole('tab',{name:'Day 3',exact:true}).focus();
  await page.keyboard.press('Home');
  await expect(tabs.getByRole('tab',{name:'Day 1',exact:true})).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.getByRole('tab',{name:'Day 2',exact:true})).toHaveAttribute('aria-selected','true');
  await page.keyboard.press('End');
  await expect(tabs.getByRole('tab',{name:'Day 3',exact:true})).toBeFocused();
  const reference=legacy.locator('.legacy-source-reference').first();
  await reference.locator('summary').click();
  await expect.poll(()=>reference.locator('img').evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true);
  assert((await reference.innerText()).includes('19+ countries'),'Source country discrepancy remains readable');
  await reference.locator('summary').click();
  const awards=legacy.locator('.legacy-awards');
  await awards.scrollIntoViewIfNeeded();
  await expect(awards.locator('.infinite-spiral__item')).toHaveCount(12);
  await expect.poll(()=>awards.locator('.infinite-spiral__image').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
  await expect(awards.locator('.infinite-spiral__image').first()).toHaveCSS('filter','grayscale(1)');
  const item=awards.locator('.infinite-spiral__item').first();
  await page.mouse.move(0,0);
  const moving=await item.getAttribute('style');
  await expect(item).not.toHaveAttribute('style',moving,{timeout:3000});
  await awards.locator('.infinite-spiral').hover();
  await page.waitForTimeout(150);
  const hovered=await item.getAttribute('style');
  await page.waitForTimeout(300);
  await expect(item).toHaveAttribute('style',hovered);
  await page.mouse.move(0,0);
  await expect(item).not.toHaveAttribute('style',hovered,{timeout:3000});
  await awards.getByRole('button',{name:'Pause awards animation',exact:true}).click();
  await page.waitForTimeout(150);
  const paused=await item.getAttribute('style');
  await page.waitForTimeout(500);
  await expect(item).toHaveAttribute('style',paused);
  if(width===1440||width===375){
   await awards.screenshot({path:`research/qa/legacy/${width}-awards.png`,style:'.site-header,.skip-link{visibility:hidden!important}'});
   for(const section of ['legacy-numbers','legacy-audience','legacy-pavilion']){
    const target=legacy.locator('.'+section).first();await target.scrollIntoViewIfNeeded();await page.waitForTimeout(550);await target.screenshot({path:`research/qa/legacy/${width}-${section}.png`,style:'.site-header,.skip-link{visibility:hidden!important}'});
   }
  }
  await awards.getByRole('button',{name:'Resume awards animation',exact:true}).click();
  await awards.locator('.infinite-spiral').scrollIntoViewIfNeeded();
  await page.mouse.move(0,0);
  const resumed=await item.getAttribute('style');
  await expect(item).not.toHaveAttribute('style',resumed,{timeout:3000});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(200);
  const offscreen=await item.getAttribute('style');await page.waitForTimeout(500);await expect(item).toHaveAttribute('style',offscreen);
  if(width===1440){
   const audit=await new AxeBuilder({page}).include('.legacy-page').withTags(['wcag2a','wcag2aa']).analyze();
   assert.deepEqual(audit.violations,[],'Animated legacy page accessibility');
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(awards.locator('.infinite-spiral')).toHaveCount(0);
  await expect(awards.locator('.legacy-static-gallery img')).toHaveCount(12);
  await expect(awards.getByRole('button',{name:/awards animation/})).toHaveCount(0);
  await tabs.getByRole('tab',{name:'Day 1',exact:true}).click();
  await expect(legacy.getByRole('tabpanel').locator('.legacy-static-gallery img')).toHaveCount(6);
  await expect(legacy.getByRole('tabpanel').locator('.circular-carousel')).toHaveCount(0);
  if(width===1440){
   const audit=await new AxeBuilder({page}).include('.legacy-page').withTags(['wcag2a','wcag2aa']).analyze();
   assert.deepEqual(audit.violations,[],'Legacy page accessibility');
  }
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Reduced-motion layout overflow');
  assert.deepEqual(remoteImages,[],'No demo imagery requested');
  passed.push(`${width}px: timeline, statistics, source references, day tabs/keyboard/empty states, original awards photos, hover pause, pause/resume, off-screen pause and reduced motion`);
  console.log('Passed '+width+'px');
  await context.close();
 }
 const noJs=await browser.newPage({javaScriptEnabled:false,viewport:{width:375,height:900}});
 await noJs.goto(origin+'/event/legacy/',{waitUntil:'load'});
 await noJs.evaluate(()=>document.fonts.ready);
 await expect(noJs.locator('.legacy-recap')).toContainText('2024 conference');
 await expect(noJs.locator('.legacy-awards .legacy-static-gallery img')).toHaveCount(12);
 await expect(noJs.locator('.legacy-day-panel .legacy-static-gallery img')).toHaveCount(6);
 assert(await noJs.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No-JavaScript layout overflow');
 passed.push('Server-rendered text and usable photo fallback without JavaScript');
 assert.deepEqual(errors,[],'Browser errors');
 console.log(JSON.stringify({passed,errors},null,2));
}finally{await browser.close();}
