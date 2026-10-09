import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:3000';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],passed=[];
await fs.mkdir('research/qa/energy-introduction',{recursive:true});
try {
 for(const width of process.env.CHECK_WIDTHS?process.env.CHECK_WIDTHS.split(',').map(Number):[1440,768,375,320]) {
  const context=await browser.newContext({viewport:{width,height:1000}});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin,{waitUntil:'load'});
  const intro=page.locator('.energy-introduction'),artwork=intro.locator('img'),carousel=page.locator('.event-carousel');
  assert(await intro.evaluate(el=>el.previousElementSibling.classList.contains('video-hero')&&el.nextElementSibling.classList.contains('event-carousel')),'Correct section order');
  await intro.scrollIntoViewIfNeeded();
  await expect.poll(()=>artwork.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  await expect(intro.getByRole('heading',{name:'Where energy leaders Power the future'})).toBeVisible();
  const content=await intro.locator('.energy-introduction-copy').boundingBox(),image=await artwork.boundingBox();
  if(width>900) assert(image.x>content.x+content.width*.8,'Artwork beside the copy');
  else assert(image.y>content.y+content.height-2,'Artwork below the copy');
  assert(await intro.evaluate(el=>{const style=getComputedStyle(el);return parseFloat(style.marginTop)===0&&parseFloat(style.marginBottom)===0&&parseFloat(style.paddingTop)>0&&parseFloat(style.paddingBottom)>0; }),'Internal breathing room without external gaps');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal page overflow');
  await intro.screenshot({path:`research/qa/energy-introduction/${width}-section.png`,style:'.site-header,.skip-link{visibility:hidden!important}'});
  await carousel.scrollIntoViewIfNeeded();
  await carousel.evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY,behavior:'instant'}));
  await page.mouse.move(width/2,650);
  await page.waitForTimeout(500);
  const slide=carousel.locator('#event-carousel-slide');
  const before=await slide.getAttribute('aria-label');
  const began=Date.now();
  await expect(slide).not.toHaveAttribute('aria-label',before,{timeout:4000});
  assert(Date.now()-began<3600,'Three-second autoplay with pointer over the carousel');
  await expect(slide).toHaveCSS('animation-name','carousel-enter');
  if(await carousel.locator('.carousel-background').count()) await expect(carousel.locator('.carousel-background')).toHaveCSS('animation-name','carousel-background-enter');
  await carousel.getByRole('button',{name:'Next slide',exact:true}).click();
  await expect(carousel.getByRole('button',{name:'Pause slideshow',exact:true})).toBeVisible();
  const selected=await slide.getAttribute('aria-label');
  await expect(slide).not.toHaveAttribute('aria-label',selected,{timeout:4000});
  await carousel.getByRole('button',{name:'Pause slideshow',exact:true}).click();
  const paused=await slide.getAttribute('aria-label');
  await page.waitForTimeout(3200);
  await expect(slide).toHaveAttribute('aria-label',paused);
  if(width===1440) {
   const audit=await new AxeBuilder({page}).include('.energy-introduction').withTags(['wcag2a','wcag2aa']).analyze();
   assert.deepEqual(audit.violations,[],'New section accessibility');
   await page.getByRole('button',{name:'Play slideshow',exact:true}).focus();
   await page.keyboard.press('Enter');
   const focused=await slide.getAttribute('aria-label');
   await page.waitForTimeout(3200);
   await expect(slide).toHaveAttribute('aria-label',focused);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(slide).toHaveCSS('animation-name','none');
  passed.push(`${width}px: reference section, responsive artwork, spacing, three-second animated autoplay, manual navigation and pause`);
  await context.close();
 }
 assert.deepEqual(errors,[],'Browser runtime errors');
 console.log(JSON.stringify({passed,errors},null,2));
} finally {await browser.close();}
