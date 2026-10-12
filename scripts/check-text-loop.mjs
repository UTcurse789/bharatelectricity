import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],passed=[];await fs.mkdir('research/qa/text-loop',{recursive:true});
const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
try{
 for(const width of [1440,768,375,320]){
  const context=await browser.newContext({viewport:{width,height:1000}});const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));await page.goto(origin,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Pause slideshow',exact:true}).click();
  await expect(page.locator('.section-ribbon')).toHaveCount(4);
  await expect(page.locator('.section-ribbon button,.government-section,.organiser-section,.site-footer .organiser-logos,.site-footer .footer-partner')).toHaveCount(0);
  await expect(page.locator('.government-banner')).toBeVisible();
  for(const section of ['.homepage-partners','.participating-section','.council-section','.speaker-section']){
   const region=page.locator(section),heading=region.locator('.directory-section-heading');await region.scrollIntoViewIfNeeded();await page.waitForTimeout(650);
   const ribbon=region.locator(':scope>.section-ribbon'),svg=ribbon.locator('.text-loop-svg'),contour=svg.locator(':scope>path');
   assert(['#f56a16','#08752c'].includes(await contour.getAttribute('stroke')),'Brand colour');
   assert((await contour.getAttribute('d')).includes('T 320'),'Original repeating wave design');
   assert(await svg.evaluate(el=>{const m=new DOMMatrix(getComputedStyle(el).transform);const angle=Math.atan2(m.b,m.a)*180/Math.PI;return angle>-9&&angle<-7}),'Upward tilt');
   await expect(region).toHaveCSS('position','relative');await expect(region).toHaveCSS('overflow','clip');await expect(region).toHaveCSS('opacity','1');
   await expect(ribbon).toHaveCSS('position','absolute');await expect(ribbon).toHaveCSS('opacity','0.11');await expect(ribbon).toHaveCSS('pointer-events','none');await expect(ribbon).toHaveAttribute('aria-hidden','true');
   await expect(region.locator(':scope>.wrap')).toHaveCSS('opacity','1');await expect(region.locator(':scope>.wrap')).toHaveCSS('z-index','1');await expect(ribbon).toHaveCSS('z-index','0');
   const bounds=await ribbon.boundingBox(),area=await region.boundingBox(),wave=await svg.boundingBox();
   assert(Math.abs(area.width-width)<2,'Full-width section');assert(Math.abs(bounds.x-area.x)<2&&Math.abs(bounds.width-area.width)<2,'Ribbon spans the section');
   assert(wave.x<area.x&&wave.x+wave.width>area.x+area.width,'Wave covers both section edges');
   const offset=()=>ribbon.locator('textPath').first().getAttribute('startOffset').then(Number);
   const initial=await offset();await page.waitForTimeout(200);assert.equal(await offset(),initial,'Decorative ribbon stays static');
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);const reduced=await offset();await page.waitForTimeout(150);assert.equal(await offset(),reduced,'System reduced motion');
   await region.screenshot({path:`research/qa/text-loop/${width}-${section.slice(1)}.png`,style:'.site-header,.skip-link{visibility:hidden!important}'});
   await page.emulateMedia({reducedMotion:'no-preference'});
  }
  const partners=page.locator('.homepage-partners');await expect(partners.getByRole('heading',{name:'Investment Facilitation Partner',exact:true})).toBeVisible();
  const search=page.getByRole('searchbox',{name:'Search companies',exact:true});await search.fill('WOG');await expect(page.locator('.company-rail .company-card')).toHaveCount(1);await search.fill('');await expect(page.locator('.company-rail .company-card')).toHaveCount(99);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow');
  if(width===1440){const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();assert.deepEqual(audit.violations,[],'Accessibility');}
  passed.push(`${width}px: full-width decorative wave behind content, 11% ribbon opacity, upward tilt, clipped overflow, static background and working search`);await context.close();
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed,errors},null,2));
}finally{await browser.close()}
