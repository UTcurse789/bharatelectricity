import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium, expect} from '@playwright/test';

const origin = process.env.CHECK_ORIGIN || 'http://localhost:4173';
const browser = await chromium.launch({executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true});
const errors = [], passed = [];
const monitor = page => page.on('pageerror', error => errors.push(error.message));
const position = page => page.evaluate(() => scrollY);
const jump = (page, top) => page.evaluate(y => scrollTo({top: y, behavior: 'instant'}), top);
await fs.mkdir('research/qa/motion', {recursive: true});

try {
 const page = await browser.newPage({viewport: {width: 1440, height: 900}});
 monitor(page);
 await page.goto(origin, {waitUntil: 'networkidle'});
 await expect(page.locator('html')).toHaveClass(/lenis/);
 await page.getByRole('button', {name: 'Pause slideshow', exact: true}).click();
 await page.mouse.move(1400, 800);
 await page.screenshot({path: 'research/qa/motion/desktop.png'});

 await page.mouse.wheel(0, 700);
 const frames = await page.evaluate(() => new Promise(resolve => {
  const samples = [];
  const tick = () => {
   samples.push(scrollY);
   if (samples.length < 20) requestAnimationFrame(tick);
   else resolve(samples);
  };
  requestAnimationFrame(tick);
 }));
 assert(frames.some((y, index) => index && y > frames[index - 1]), 'Wheel movement should progress over multiple frames');
 assert(frames.every((y, index) => !index || y >= frames[index - 1]), 'Scroll should progress without backwards jitter');
 await expect.poll(() => position(page)).toBeGreaterThan(695);
 await expect.poll(() => page.locator('html').getAttribute('class')).not.toMatch(/lenis-scrolling/);
 const settled = await position(page);
 await page.waitForTimeout(150);
 assert(Math.abs(await position(page) - settled) < 2, 'Scroll must settle');
 passed.push('Wheel scrolling interpolates across frames and settles without reversal');

 // A real section link exercises smooth anchors, sticky-header offset and focus.
 await page.evaluate(() => {
  document.querySelector('.statistics').id = 'motion-statistics';
  const link = document.createElement('a');
  link.href = '#motion-statistics'; link.id = 'motion-anchor'; link.textContent = 'Statistics';
  link.style.cssText = 'position:fixed;right:10px;bottom:10px;z-index:100';
  document.body.append(link);
 });
 await page.locator('#motion-anchor').click();
 await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('motion-statistics');
 assert.equal(new URL(page.url()).hash, '#motion-statistics');
 const targetTop = await page.locator('#motion-statistics').evaluate(el => el.getBoundingClientRect().top);
 const headerBottom = await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().bottom);
 assert(targetTop >= headerBottom - 1 && targetTop <= headerBottom + 18, 'Anchor must clear sticky header');
 await page.locator('#motion-anchor').evaluate(el => el.remove());
 passed.push('Anchor URL, keyboard focus and responsive sticky-header clearance');

 // Keyboard scrolling interrupts a wheel animation instead of fighting it.
 await page.mouse.wheel(0, 500);
 await page.keyboard.press('Home');
 await expect.poll(() => position(page)).toBeLessThan(2);
 await page.waitForTimeout(200);
 assert(await position(page) < 2);
 passed.push('Keyboard navigation interrupts inertia');

 // Changing preferences during native scrolling must also cancel Lenis' queued reset.
 await jump(page, 450);
 await page.emulateMedia({reducedMotion: 'reduce'});
 await expect(page.locator('html')).not.toHaveClass(/lenis/);
 await page.waitForTimeout(500);
 await expect(page.locator('html')).not.toHaveClass(/lenis/);
 assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
 await expect(page.locator('.event-carousel canvas')).toHaveCount(0);
 await expect.poll(() => page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)).toBe(0);
 await page.mouse.wheel(0, 400);
 await expect.poll(() => position(page)).toBeGreaterThan(390);
 await page.emulateMedia({reducedMotion: 'no-preference'});
 await expect(page.locator('html')).toHaveClass(/lenis/);
 passed.push('Live reduced-motion changes disable smoothing and animated canvases');

 await page.goto(origin + '/exhibitors/', {waitUntil: 'networkidle'});
 await expect(page.locator('html')).toHaveClass(/lenis/);
 await page.evaluate(() => {
  window.__reveals = [];
  const animate = Element.prototype.animate;
  Element.prototype.animate = function(...args) {
   if (this.classList.contains('company-card')) window.__reveals.push(this.textContent);
   return animate.apply(this, args);
  };
 });
 await page.getByRole('button', {name: 'Show more companies', exact: true}).click();
 await expect(page.locator('.company-card')).toHaveCount(24);
 await page.locator('.company-card').nth(12).scrollIntoViewIfNeeded();
 await expect.poll(() => page.evaluate(() => window.__reveals.length)).toBeGreaterThan(0);
 await expect.poll(() => page.locator('.company-card').nth(12).evaluate(el => el.getAnimations().length)).toBe(0);
 passed.push('New directory cards receive reveals; finished animations are released');

 await page.goto(origin + '/media-hub/gallery/', {waitUntil: 'networkidle'});
 await page.locator('.photo-tile').first().click();
 await expect(page.locator('html')).toHaveClass(/lenis-stopped/);
 const beforeModal = await position(page);
 await page.mouse.move(1400, 700); await page.mouse.wheel(0, 500);
 await page.waitForTimeout(250);
 assert.equal(await position(page), beforeModal, 'Modal must lock background scroll');
 await page.getByRole('button', {name: 'Close photo', exact: true}).click();
 await expect(page.locator('html')).not.toHaveClass(/lenis-stopped/);
 passed.push('Gallery locks background scrolling and resumes on close');

 const mobile = await browser.newPage({viewport: {width: 375, height: 812}, hasTouch: true});
 monitor(mobile);
 await mobile.goto(origin, {waitUntil: 'networkidle'});
 await mobile.getByRole('button', {name: 'Open navigation', exact: true}).click();
 await expect(mobile.locator('html')).toHaveClass(/lenis-stopped/);
 for (const button of await mobile.locator('.mobile-group > button').all()) await button.click();
 await mobile.locator('.mobile-nav').evaluate(el => {el.style.maxHeight = '220px';});
 const menu = await mobile.locator('.mobile-nav').boundingBox();
 const beforeMenu = await position(mobile);
 await mobile.mouse.move(menu.x + 25, menu.y + 50); await mobile.mouse.wheel(0, 200);
 await expect.poll(() => mobile.locator('.mobile-nav').evaluate(el => el.scrollTop)).toBeGreaterThan(0);
 assert.equal(await position(mobile), beforeMenu);
 await mobile.keyboard.press('Escape');
 await expect(mobile.locator('html')).not.toHaveClass(/lenis-stopped/);
 await mobile.screenshot({path: 'research/qa/motion/mobile.png'});
 assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
 passed.push('Mobile menu scrolls independently, freezes page and closes with Escape');

 const touch = await mobile.context().newCDPSession(mobile);
 await touch.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: 350, y: 720}]});
 await touch.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: 350, y: 420}]});
 await touch.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: 350, y: 250}]});
 await touch.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
 await expect.poll(() => position(mobile)).toBeGreaterThan(100);
 passed.push('Native mobile touch scrolling remains available');

 const noJs = await browser.newPage({javaScriptEnabled: false, viewport: {width: 375, height: 812}});
 await noJs.goto(origin);
 await expect(noJs.locator('.hero h1')).toBeVisible();
 await noJs.mouse.wheel(0, 500);
 await expect.poll(() => position(noJs)).toBeGreaterThan(490);
 passed.push('Content and scrolling remain available without JavaScript');
 assert.deepEqual(errors, [], 'Browser runtime errors');
 console.log(JSON.stringify({passed, errors}, null, 2));
} finally {await browser.close();}
