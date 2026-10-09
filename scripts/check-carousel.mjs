import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin = process.env.CHECK_ORIGIN || 'http://localhost:3000';
const browser = await chromium.launch({executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true});
const errors = [], results = [];
await fs.mkdir('research/qa/carousel', {recursive: true});
try {
 for (const width of process.env.CHECK_FALLBACK_ONLY ? [] : process.env.CHECK_WIDTHS ? process.env.CHECK_WIDTHS.split(',').map(Number) : [1440, 768, 375, 320]) {
  const context = await browser.newContext({viewport: {width, height: 1000}});
  const page = await context.newPage();
  const imageRequests = [];
  page.on('request', request => {if (request.url().includes('/assets/carousel/')) imageRequests.push(request.url());});
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {if (message.type() === 'error') errors.push(message.text());});
  await page.goto(origin, {waitUntil: 'networkidle'});
  const carousel = page.getByRole('region', {name: 'Event highlights'});
  for (const button of await carousel.locator('.carousel-pagination button').all()) {
   const rect = await button.boundingBox();
   assert(rect.width >= 44 && rect.height >= 44, 'Slide selectors need usable touch targets');
  }
  await expect(carousel).toBeVisible();
  assert(imageRequests.every(url => /report-stack|earth-background|awards-background/.test(url)), 'Only the first slide and next background should load initially');
  assert(await page.evaluate(() => document.querySelector('.event-carousel').compareDocumentPosition(document.querySelector('.hero')) & Node.DOCUMENT_POSITION_FOLLOWING), 'Carousel must precede existing hero');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.intro-dialog')).toHaveCount(0);
  await carousel.getByRole('button', {name: 'Pause slideshow', exact: true}).click();
  const stageHeights = [];
  for (let index = 0; index < 5; index++) {
   await carousel.getByRole('button', {name: new RegExp('^Show slide ' + (index + 1) + ':')}).click();
   await expect(carousel.locator('#event-carousel-slide')).toHaveAttribute('aria-label', new RegExp('^' + (index + 1) + ' of 5:'));
   await carousel.locator('.carousel-slide').evaluate(async el => {await Promise.all(el.getAnimations().map(animation => animation.finished));});
   if (index === 0 || index === 2) await expect(carousel.locator('.is-painted')).toHaveCount(3);
   if (index === 3) await expect(carousel.locator('.is-painted')).toHaveCount(1);
   if (index === 1) {
    await expect(carousel.getByRole('heading', {name: 'Celebrating excellence in Indian energy'})).toBeVisible();
    await expect(carousel.locator('canvas')).toHaveCount(0);
    await expect(carousel.locator('.carousel-awards-title')).toHaveCSS('color', 'rgb(255, 255, 255)');
    const copy = await carousel.locator('.carousel-copy').boundingBox(), photo = await carousel.locator('.carousel-awards-photo').boundingBox();
    if(width >= 768) assert(Math.abs(photo.x - copy.x - copy.width) < 1, 'Awards photo beside the solid text panel');
    else assert(Math.abs(photo.y - copy.y - copy.height) < 1, 'Awards photo below the text panel');
    if(width === 1440) {
     const axe = await new AxeBuilder({page}).include('.event-carousel').analyze();
     assert.deepEqual(axe.violations, [], 'Awards panel accessibility and contrast');
    }
   }
   if (index === 4) {
    await carousel.locator('.carousel-proximity-heading').evaluate(el => scrollTo({top: el.getBoundingClientRect().top + scrollY - 200, behavior: 'instant'}));
    const letter = carousel.locator('.carousel-variable [aria-hidden="true"]').first();
    const rect = await letter.boundingBox();
    await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
    await expect.poll(() => letter.evaluate(el => parseFloat(el.style.fontVariationSettings.split(' ')[1]))).toBeGreaterThan(600);
   }
   for (const link of await carousel.getByRole('link').all()) {
    assert((await link.getAttribute('href')).startsWith('https://'), 'Expected supplied external link');
    await expect(link).toBeVisible();
   }
   const photograph = carousel.locator(index === 1 ? '.carousel-awards-image' : '.carousel-background-image');
   await expect(photograph).toHaveCount(1);
   await expect.poll(() => photograph.evaluate(image => image.complete && image.naturalWidth > 0), {message: `Photograph must load for slide ${index + 1} at ${width}px`}).toBe(true);
   const report = carousel.locator('.carousel-report-image');
   await expect(report).toHaveCount(index === 0 ? 1 : 0);
   if (index === 0) {
    await expect(report).toBeVisible();
    await expect.poll(() => report.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(report).toHaveAttribute('fetchpriority', 'high');
    if (width === 1440) {
     const content = await carousel.locator('.carousel-copy').boundingBox();
     const artwork = await carousel.locator('.carousel-report-art').boundingBox();
     assert(artwork.x > content.x + content.width * .85, 'Report should appear to the right of the copy');
    }
   }
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow at ' + width + ' on slide ' + (index + 1));
   await page.mouse.move(0, 0);
   await carousel.locator('.carousel-slide').evaluate(async el => {await Promise.all(el.getAnimations().map(animation => animation.finished));});
   stageHeights.push((await carousel.locator('.carousel-stage').boundingBox()).height);
   await page.screenshot({path: `research/qa/carousel/${width}-slide-${index + 1}.png`});
  }
  assert(Math.max(...stageHeights) - Math.min(...stageHeights) <= 1, 'Slide changes must not move the content below the carousel: ' + stageHeights.join(', '));
  await carousel.getByRole('button', {name: 'Next slide', exact: true}).click();
  await expect(carousel.locator('#event-carousel-slide')).toHaveAttribute('aria-label', /^1 of 5:/);
  await carousel.getByRole('button', {name: 'Previous slide', exact: true}).click();
  await expect(carousel.locator('#event-carousel-slide')).toHaveAttribute('aria-label', /^5 of 5:/);
  await page.keyboard.press('Home');
  await expect(carousel.locator('#event-carousel-slide')).toHaveAttribute('aria-label', /^1 of 5:/);
  await page.keyboard.press('ArrowRight');
  await expect(carousel.locator('#event-carousel-slide')).toHaveAttribute('aria-label', /^2 of 5:/);
  await page.keyboard.press('End');
  await expect(carousel.locator('#event-carousel-slide')).toHaveAttribute('aria-label', /^5 of 5:/);
  if (width === 1440) {
   const axe = await new AxeBuilder({page}).include('.event-carousel').analyze();
   assert.deepEqual(axe.violations, [], 'Carousel accessibility violations');
   await carousel.getByRole('button', {name: /^Show slide 1:/}).click();
   await carousel.getByRole('button', {name: 'Play slideshow', exact: true}).click();
   await page.locator('button:focus').evaluate(el => el.blur());
   await page.mouse.move(0, 0);
   await expect(carousel.locator('#event-carousel-slide')).toHaveAttribute('aria-label', /^2 of 5:/, {timeout: 15000});
   await carousel.getByRole('button', {name: 'Pause slideshow', exact: true}).click();
   results.push('Autoplay, pause/resume, keyboard, navigation wrap and accessibility');
  }
  if (width === 375) {
   const stage = carousel.locator('.carousel-stage');
   await stage.dispatchEvent('pointerdown', {pointerType: 'touch', clientX: 280, clientY: 220});
   await stage.dispatchEvent('pointerup', {pointerType: 'touch', clientX: 90, clientY: 225});
   await expect(carousel.locator('#event-carousel-slide')).toHaveAttribute('aria-label', /^1 of 5:/);
   results.push('Touch swipe');
  }
  results.push(`All five slides, effects, links and no overflow at ${width}px`);
  await context.close();
 }
 const reduced = await browser.newPage({reducedMotion: 'reduce'});
 reduced.on('pageerror', error => errors.push(error.message));
 reduced.on('console', message => {if (message.type() === 'error') errors.push(message.text());});
 await reduced.goto(origin, {waitUntil: 'networkidle'});
 const region = reduced.getByRole('region', {name: 'Event highlights'});
 await expect(region.getByRole('button', {name: /slideshow/})).toHaveCount(0);
 for (let index = 0; index < 5; index++) {
  await region.getByRole('button', {name: new RegExp('^Show slide ' + (index + 1) + ':')}).click();
  await expect(region.locator('canvas')).toHaveCount(0);
  await expect(region.locator('.carousel-title')).toBeVisible();
 }
 await reduced.screenshot({path: 'research/qa/carousel/reduced-motion.png'});
 results.push('Reduced motion: all five slides readable without animated canvases');
 const noJs = await browser.newPage({javaScriptEnabled: false, viewport: {width: 375, height: 900}});
 await noJs.goto(origin);
 await expect(noJs.locator('.carousel-text-fallback').first()).toBeVisible();
 assert(await noJs.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
 results.push('Server-rendered title and CTA without JavaScript');
 const fallbackBrowser = await chromium.launch({executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-webgl']});
 try {
  const fallback = await fallbackBrowser.newPage({viewport: {width: 375, height: 900}});
  await fallback.goto(origin, {waitUntil: 'networkidle'});
  await fallback.getByRole('button', {name: /^Show slide 4:/}).click();
  await expect(fallback.locator('.carousel-warp-fallback')).toHaveCSS('opacity', '1');
  await fallback.getByRole('button', {name: /^Show slide 2:/}).click();
  await expect(fallback.getByRole('heading', {name: 'Celebrating excellence in Indian energy'})).toBeVisible();
  await expect(fallback.getByRole('region', {name: 'Event highlights'}).getByRole('link', {name: 'Explore the gallery', exact: true})).toBeVisible();
  await fallback.screenshot({path: 'research/qa/carousel/webgl-fallback.png'});
  results.push('WarpText keeps readable text when WebGL is unavailable');
 } finally {await fallbackBrowser.close();}
 assert.deepEqual(errors, [], 'Browser console or hydration errors');
 console.log(JSON.stringify({passed: results, errors}));
} finally {await browser.close();}
