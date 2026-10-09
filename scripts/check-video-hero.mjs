import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:3000';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],passed=[];
await fs.mkdir('research/qa/video-hero',{recursive:true});
try {
 const probe=await browser.newContext();
 const videoUrl=origin+'/assets/bharat-electricity-2027.mp4';
 const head=await probe.request.head(videoUrl);
 assert.equal(head.headers()['content-type'],'video/mp4','Video MIME type');
 const range=await probe.request.get(videoUrl,{headers:{Range:'bytes=0-1023'}});
 assert.equal(range.status(),206,'Video supports partial streaming');
 assert.equal((await range.body()).length,1024,'Requested byte range');
 const suffix=await probe.request.get(videoUrl,{headers:{Range:'bytes=-1024'}});
 assert.equal(suffix.status(),206,'Video supports suffix ranges');
 assert.equal((await suffix.body()).length,1024,'Requested suffix range');
 const invalid=await probe.request.get(videoUrl,{headers:{Range:'bytes=999999999-'}});
 assert.equal(invalid.status(),416,'Out-of-bounds range is rejected');
 await probe.close();
 for(const width of [1440,768,375,320]) {
  const context=await browser.newContext({viewport:{width,height:1000}});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin,{waitUntil:'load'});
  const hero=page.locator('.video-hero'),video=hero.locator('video'),circle=hero.locator('.circular-text');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('Bharat Electricity\n2027Bharat Electricity2027');
  await expect(hero.getByText('WHERE ENERGY LEADERS POWER THE FUTURE')).toBeVisible();
  await expect(hero.getByRole('img',{name:'Announcing Soon',exact:true})).toBeVisible();
  assert(await hero.evaluate(el=>el.nextElementSibling.classList.contains('energy-introduction')&&el.nextElementSibling.nextElementSibling.classList.contains('event-carousel')),'Introduction sits between video and carousel');
  assert(await video.evaluate(el=>el.autoplay&&el.muted&&el.loop&&el.playsInline),'Muted inline autoplay loop');
  await expect.poll(()=>video.evaluate(el=>!el.paused&&el.currentTime>0&&el.videoWidth>0)).toBe(true);
  assert(await video.evaluate(el=>el.videoWidth===1280&&el.videoHeight===720&&el.duration>34&&el.duration<34.3),'Full-length 720p clip');
  const start=await video.evaluate(el=>el.currentTime);
  await page.waitForTimeout(250);
  assert(await video.evaluate(el=>el.currentTime)>start,'Footage plays');
  await hero.locator('.video-hero-announcement').scrollIntoViewIfNeeded();
  await expect.poll(()=>circle.evaluate(el=>getComputedStyle(el).transform),{timeout:10000}).not.toBe('none');
  const rotation=await circle.evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(250);
  assert.notEqual(await circle.evaluate(el=>getComputedStyle(el).transform),rotation,'Announcement circle spins');
  if(width===1440) {
   const angle=()=>circle.evaluate(el=>{const matrix=new DOMMatrix(getComputedStyle(el).transform);return Math.atan2(matrix.b,matrix.a)*180/Math.PI;});
   const delta=(from,to)=>(to-from+360)%360;
   const normal=await angle();await page.waitForTimeout(300);const normalTravel=delta(normal,await angle());
   await hero.locator('.video-hero-announcement').hover();await page.waitForTimeout(100);
   const hovered=await angle();await page.waitForTimeout(300);assert(delta(hovered,await angle())>normalTravel*2,'Circle speeds up on hover');
   await page.mouse.move(0,0);
  }
  await hero.getByRole('button',{name:'Pause background video',exact:true}).click();
  await expect.poll(()=>video.evaluate(el=>el.paused)).toBe(true);
  const pausedRotation=await circle.evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(200);
  assert.equal(await circle.evaluate(el=>getComputedStyle(el).transform),pausedRotation,'Pause stops circle too');
  const box=await hero.boundingBox(),badge=await hero.locator('.video-hero-announcement').boundingBox();
  assert(badge.x<box.width/2&&badge.y>box.y+box.height*.65,'Badge sits at bottom-left');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(150);
  await page.screenshot({path:`research/qa/video-hero/${width}-opening.png`});
  await hero.screenshot({path:`research/qa/video-hero/${width}-hero.png`});
  await hero.getByRole('button',{name:'Play background video',exact:true}).click();
  await expect.poll(()=>video.evaluate(el=>!el.paused)).toBe(true);
  const carousel=page.locator('.event-carousel');
  await carousel.scrollIntoViewIfNeeded();
  await carousel.evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY,behavior:'instant'}));
  await page.mouse.move(0,0);
  await page.locator('h1').evaluate(()=>document.activeElement?.blur());
  await page.waitForTimeout(100);
  const slide=carousel.locator('#event-carousel-slide');
  const before=await slide.getAttribute('aria-label');
  const began=Date.now();
  await expect(slide).not.toHaveAttribute('aria-label',before,{timeout:4200});
  assert(Date.now()-began<3600,'Carousel advances within three seconds plus rendering tolerance');
  await carousel.getByRole('button',{name:'Pause slideshow',exact:true}).click();
  await carousel.getByRole('button',{name:'Next slide',exact:true}).click();
  await expect(video).toHaveJSProperty('paused',true);
  if(width===1440) {
   const audit=await new AxeBuilder({page}).include('.video-hero').withTags(['wcag2a','wcag2aa']).analyze();
   assert.deepEqual(audit.violations,[],'Video hero accessibility');
  }
  await page.emulateMedia({reducedMotion:'reduce',colorScheme:'dark'});
  await hero.scrollIntoViewIfNeeded();
  await expect(video).toHaveJSProperty('paused',true);
  await expect(hero.getByRole('button',{name:'Play background video',exact:true})).toBeVisible();
  const reducedRotation=await circle.evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(200);
  assert.equal(await circle.evaluate(el=>getComputedStyle(el).transform),reducedRotation,'Reduced motion stops circle');
  passed.push(`${width}px: muted autoplay, video controls, spinning announcement, full title, three-second carousel and reduced motion`);
  await context.close();
 }
 assert.deepEqual(errors,[],'Browser runtime errors');
 console.log(JSON.stringify({passed,errors},null,2));
} finally {await browser.close();}
