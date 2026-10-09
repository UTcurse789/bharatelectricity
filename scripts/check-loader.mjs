import assert from 'node:assert/strict';
import {chromium, expect} from '@playwright/test';

const origin = process.env.CHECK_ORIGIN || 'http://localhost:4173';
const storageKey = 'bharat-introduction-v1';
const browser = await chromium.launch({
 executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
 headless: true,
});
const results = [];
try {
 for (const scenario of [
  {name: 'first visit'},
  {name: 'previous visitor', seen: true},
  {name: 'mobile', viewport: {width: 375, height: 812}},
  {name: 'reduced motion', reducedMotion: 'reduce'},
  {name: 'extension body attribute', extension: true},
 ]) {
  const context = await browser.newContext({
   viewport: scenario.viewport || {width: 1440, height: 1000},
   reducedMotion: scenario.reducedMotion || 'no-preference',
  });
  try {
   if (scenario.extension) await context.grantPermissions(['local-network-access'], {origin});
   if (scenario.seen) await context.addInitScript(key => localStorage.setItem(key, 'seen'), storageKey);
   const page = await context.newPage();
   const errors = [], animationRequests = [];
   page.on('pageerror', error => errors.push(error.message));
   page.on('console', message => {
    if (message.type() === 'error' || /hydrat/i.test(message.text())) errors.push(message.text());
   });
   page.on('request', request => {
    if (request.url().includes('/animations/opening.')) animationRequests.push(request.url());
   });
   if (scenario.extension) {
    await page.route(origin + '/', async route => {
     if (!route.request().isNavigationRequest()) return route.continue();
     const response = await route.fetch();
     const html = await response.text();
     assert(html.includes('<body'), 'Expected server-rendered body');
     await route.fulfill({response, body: html.replace('<body', '<body cz-shortcut-listen="true"')});
    });
   }
   for (const visit of ['initial load', 'reload']) {
    if (visit === 'initial load') await page.goto(origin + '/', {waitUntil: 'domcontentloaded'});
    else await page.reload({waitUntil: 'domcontentloaded'});
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('.intro-dialog')).toHaveCount(0);
    assert.equal(await page.locator('html').getAttribute('data-intro'), null);
    assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).overflow), 'visible');
    await page.waitForLoadState('networkidle');
    if (scenario.reducedMotion === 'reduce') await expect(page.locator('.energy-art').first()).toHaveCSS('transform', 'none');
    assert.equal(await page.evaluate(key => localStorage.getItem(key), storageKey), scenario.seen ? 'seen' : null);
    if (scenario.extension) await expect(page.locator('body')).toHaveAttribute('cz-shortcut-listen', 'true');
   }
   if (scenario.name === 'first visit') {
    await page.getByRole('button', {name: 'About', exact: true}).click();
    await expect(page.getByRole('link', {name: 'About the Event', exact: true}).first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('link', {name: 'Previous Editions', exact: true})).toBeHidden();
   }
   assert.deepEqual(animationRequests, [], 'Intro animation should never be requested');
   assert.deepEqual(errors, [], scenario.name + ': browser errors');
   results.push(scenario.name);
  } finally {
   await context.close();
  }
 }
 console.log(JSON.stringify({origin, passed: results, introRemoved: true, hydrationErrors: 0}));
} finally {
 await browser.close();
}
