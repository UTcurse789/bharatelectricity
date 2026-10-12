import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const folder='research/qa/home-logo-loop';await fs.mkdir(folder,{recursive:true});
const mobileOnly=process.argv.includes('--mobile-only');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const checks=[],errors=[];
const readX=locator=>locator.evaluate(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).m41);
try{
 for(const width of mobileOnly?[375]:[1440,375,320]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'no-preference'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin,{waitUntil:'networkidle'});
  const region=page.locator('.home-partner-logo-loop'),track=region.locator('.logoloop__track');
  await expect(region).toHaveCount(1);await expect(page.locator('.home-edition-navigation')).toHaveCount(0);
  assert(await page.locator('.video-hero').evaluate(e=>e.nextElementSibling?.classList.contains('home-partner-logo-loop')),'Directly below video');
  await region.scrollIntoViewIfNeeded();await expect(region).toHaveAttribute('data-playing','true');
  const primary=region.locator('.logoloop__list').first();
  const count=await primary.locator('img').count();assert(count>80,'Real partner artwork across published roles');
  assert.equal(new Set(await primary.locator('img').evaluateAll(images=>images.map(i=>i.getAttribute('src')))).size,count,'Deduplicated partner images');
  assert(await primary.locator('img').evaluateAll(images=>images.every(i=>(i.getAttribute('src')||'').startsWith('/assets/')&&!!i.alt)));
  await primary.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));await expect.poll(()=>primary.locator('img').evaluateAll(images=>images.every(i=>i.naturalWidth>0)),{timeout:20000}).toBe(true);
  await page.waitForTimeout(1200);
  const startHeight=await region.evaluate(e=>e.offsetHeight);
  const before=await readX(track);await page.waitForTimeout(500);const after=await readX(track);assert(after<before-20,'Automatic leftward movement');
  const box=await region.locator('.logoloop').boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  const hoverBefore=await readX(track);await page.waitForTimeout(600);const hoverAfter=await readX(track);assert(hoverAfter<hoverBefore-25,'Continues on hover');
  await expect(region.locator('button,a')).toHaveCount(0);
  await expect(page.locator('.video-hero-media-controls,.video-hero-playback,.video-hero-open-film')).toHaveCount(0);
  await expect(page.locator('.video-hero').getByText('Archive footage',{exact:true})).toHaveCount(0);
  assert.equal(await region.evaluate(e=>e.offsetHeight),startHeight,'Stable section height');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow');
  const axe=await new AxeBuilder({page}).include('.home-partner-logo-loop').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);
  await page.screenshot({path:folder+'/loop-'+width+'.png'});
  await page.emulateMedia({reducedMotion:'reduce'});await expect(region).toHaveAttribute('data-reduced-motion','true');await expect(region.locator('.logoloop__list:visible')).toHaveCount(1);
  const reducedBefore=await readX(track);await page.waitForTimeout(500);assert.equal(await readX(track),reducedBefore,'Reduced motion is static');
  const viewport=region.locator('.logoloop');await viewport.focus();await page.keyboard.press('ArrowRight');await expect.poll(()=>viewport.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
  checks.push({width,partners:count,belowVideo:true,hoverKeepsMoving:true,stableHeight:true,reducedMotion:true});await context.close();
 }
 assert.deepEqual(errors,[]);await fs.writeFile(folder+(mobileOnly?'/final-mobile-results.json':'/results.json'),JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors}));
}finally{await browser.close();}
