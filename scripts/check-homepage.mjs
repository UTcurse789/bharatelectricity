import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin = process.env.CHECK_ORIGIN || 'http://localhost:4173';
const browser = await chromium.launch({executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true});
const errors = [], passed = [];
await fs.mkdir('research/qa/homepage', {recursive: true});
try {
 for (const width of [1440, 768, 375, 320]) {
  const context = await browser.newContext({viewport: {width, height: 1000}, hasTouch: width < 768});
  const page = await context.newPage();
  const captureSection = async (locator, path) => {
   await locator.scrollIntoViewIfNeeded();
   await page.waitForTimeout(650); // Let the 560ms reveal finish before judging the composition.
   await locator.screenshot({path, style: '.site-header,.skip-link{visibility:hidden!important}'});
  };
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {if (message.type() === 'error') errors.push(message.text());});
  await page.goto(origin, {waitUntil: 'networkidle'});
  await expect(page.locator('.government-banner')).toBeVisible();
  await expect.poll(() => page.locator('.government-banner img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  assert(await page.locator('.government-banner').evaluate(el => !el.closest('.site-header')), 'Support banner must be outside sticky header');
  const headerHeight = (await page.locator('.site-header').boundingBox()).height;
  const favicon = page.locator('link[rel=icon][href^="/favicon-32.png"]');
  await expect(favicon).toHaveCount(1);
  for (const href of ['/favicon.ico', '/favicon-32.png', '/favicon-48.png', '/favicon-180.png']) assert((await page.request.get(origin + href)).ok(), 'Favicon: ' + href);
  await expect(page.locator('.home-page')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  assert(await page.evaluate(() => document.fonts.check('600 24px Outfit')), 'Outfit must load');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCSS('color', 'rgb(255, 248, 241)');
  assert((await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily)).startsWith('Outfit'));
  await expect(page.locator('.government-section,.organiser-section,.ribbon-pause')).toHaveCount(0);
  await expect(page.locator('.state-logos img')).toHaveCount(6);
  await expect(page.locator('.speaker-rail .person-card')).toHaveCount(72);
  await expect(page.locator('.company-rail .company-card')).toHaveCount(99);
  await expect(page.locator('.council-rail .person-card')).toHaveCount(49);
  for (const [label, query, selector, count] of [['Search companies', 'WOG', '.company-rail .company-card', 99], ['Search speakers', 'Vishrov', '.speaker-rail .person-card', 72], ['Search council members', 'Praveena', '.council-rail .person-card', 49]]) {
   const input = page.getByRole('searchbox', {name: label, exact: true});
   await input.fill(query);
   await expect(page.locator(selector)).toHaveCount(1);
   await input.fill('no-match-123');
   await expect(page.locator('.home-directory-empty')).toBeVisible();
   await page.getByRole('button', {name: 'Clear search', exact: true}).click();
   await expect(page.locator(selector)).toHaveCount(count);
  }
  await expect(page.locator('.council-section .portrait-missing')).toHaveCount(0);
  await expect(page.locator('.speaker-section .portrait-missing')).toHaveCount(0);
  await expect(page.getByText(/Approved, attributed testimonials/)).toHaveCount(0);
  const brand = await page.locator('.site-header .brand-crop').boundingBox();
  assert.equal(Math.round(brand.width), width === 320 ? 190 : width < 768 ? 210 : width < 1280 ? 240 : 260);
  assert(headerHeight < (width < 768 ? 115 : 135), 'Compact navbar height');
  await expect(page.locator('.section-ribbon')).toHaveCount(4);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No overflow at ' + width);
  await page.getByRole('button', {name: 'Pause slideshow', exact: true}).click();
  await page.mouse.move(0, 0);
  await page.screenshot({path: `research/qa/homepage/${width}-opening.png`});
  if (width < 1280) {
   await page.getByRole('button', {name: 'Open navigation', exact: true}).click();
   const menu = await page.locator('.mobile-nav').boundingBox();
   assert(menu.y + menu.height <= 1000, 'Menu must fit below the navbar with the banner visible');
   await page.keyboard.press('Escape');
  }
  await page.evaluate(() => scrollTo({top: 1200, behavior: 'instant'}));
  await expect.poll(() => page.locator('.site-header').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(0);
  assert(Math.abs((await page.locator('.site-header').boundingBox()).height - headerHeight) < 1, 'Sticky navbar must keep its original height');
  assert(await page.locator('.government-banner').evaluate(el => el.getBoundingClientRect().bottom < 0), 'Government banner must scroll out of view');
  await page.screenshot({path: `research/qa/homepage/${width}-sticky-navbar.png`});
  await expect(page.locator('.moments-photos img')).toHaveCount(3);
  await expect(page.locator('.insights-layout img')).toHaveCount(3);
  await captureSection(page.locator('.floor-moments'), `research/qa/homepage/${width}-moments.png`);
  await captureSection(page.locator('.insights-section'), `research/qa/homepage/${width}-insights.png`);
  await page.locator('.insights-layout img').evaluateAll(images => images.forEach(img => {img.loading = 'eager';}));
  await expect.poll(() => page.locator('.insights-layout img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  await captureSection(page.locator('.hero'), `research/qa/homepage/${width}-hero.png`);

  const partnerRegion = page.locator('.homepage-partners');
  await partnerRegion.scrollIntoViewIfNeeded();
  await expect(partnerRegion.getByRole('tab', {name: 'Energy & utilities', exact: true})).toHaveAttribute('aria-selected', 'true');
  await expect(partnerRegion.getByRole('heading', {name: 'Energy Security Partner', exact: true})).toBeVisible();
  await expect(partnerRegion.getByRole('heading', {name: 'Technology Partner', exact: true})).toBeVisible();
  await partnerRegion.getByRole('tab', {name: 'Energy & utilities', exact: true}).focus();
  await page.keyboard.press('ArrowRight');
  await expect(partnerRegion.getByRole('tab', {name: 'Investment, markets & skills', exact: true})).toBeFocused();
  await expect(partnerRegion.getByRole('heading', {name: 'Investment Facilitation Partner', exact: true})).toBeVisible();
  await expect(partnerRegion.getByRole('heading', {name: 'Nuclear-X Partner', exact: true})).toBeVisible();
  await page.keyboard.press('End');
  await expect(partnerRegion.getByRole('heading', {name: 'Strategic Partners', exact: true})).toBeVisible();
  await expect(partnerRegion.getByRole('heading', {name: 'Host Publication', exact: true})).toBeVisible();
  for (const tab of await partnerRegion.getByRole('tab').all()) {
   await tab.click();
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Partner overflow at ' + width);
   await partnerRegion.locator('[role=tabpanel]:not([hidden]) img').evaluateAll(images => images.forEach(image => {image.loading = 'eager';}));
   await expect.poll(() => partnerRegion.locator('[role=tabpanel]:not([hidden]) img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  }
  await partnerRegion.getByRole('tab', {name: 'Energy & utilities', exact: true}).click();
  await captureSection(partnerRegion, `research/qa/homepage/${width}-partners.png`);

  for (const [region, next] of [['.company-rail', 'Next participating companies'], ['.council-rail', 'Next governing council members'], ['.global-rail', 'Next international events'], ['.speaker-rail', 'Next speakers']]) {
   await page.locator(region).scrollIntoViewIfNeeded();
   const track = page.locator(region + ' .rail-track');
   await page.getByRole('button', {name: next, exact: true}).click();
   await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeGreaterThan(30);
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  if (width === 1440 || width === 375) {
   await captureSection(page.locator('.event-experience'), `research/qa/homepage/${width}-experience.png`);
   await captureSection(page.locator('.council-section'), `research/qa/homepage/${width}-council.png`);
   await captureSection(page.locator('.speaker-section'), `research/qa/homepage/${width}-speakers.png`);
  }
  if (width === 1440) {
   const a11y = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa']).analyze();
   await fs.writeFile('research/qa/homepage/accessibility.json', JSON.stringify(a11y.violations, null, 2));
   assert.deepEqual(a11y.violations, [], 'Homepage accessibility');
  }
  await page.emulateMedia({reducedMotion: 'reduce', colorScheme: 'dark'});
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await expect(page.locator('.event-carousel canvas')).toHaveCount(0);
  await expect(page.locator('h1')).toHaveCSS('color', 'rgb(255, 248, 241)');
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(255, 255, 255)');
  passed.push(`Black Outfit type, compact logo/navbar, four wave ribbons, grouped partner artwork, keyboard tabs, company/council/global rails and no overflow at ${width}px`);
  await context.close();
 }
 const noJs = await browser.newPage({javaScriptEnabled: false, viewport: {width: 375, height: 1000}});
 await noJs.goto(origin);
 await expect(noJs.locator('.government-section,.organiser-section')).toHaveCount(0);
 await expect(noJs.locator('.government-banner')).toBeVisible();
 await expect(noJs.locator('.company-card')).toHaveCount(99);
 await expect(noJs.locator('.speaker-rail .person-card')).toHaveCount(72);
 await expect(noJs.locator('.partner-role').first()).toBeVisible();
 await expect(noJs.locator('h1')).toBeVisible();
 assert(await noJs.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
 passed.push('Visible server-rendered top government banner, partner and event content without JavaScript');
 assert.deepEqual(errors, [], 'Browser runtime/console errors');
 console.log(JSON.stringify({passed, errors}, null, 2));
} finally {await browser.close();}
