import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin = process.env.CHECK_ORIGIN || 'http://localhost:3000';
const directory = 'research/qa/partner-reference';
await fs.mkdir(directory, {recursive: true});
const browser = await chromium.launch({executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true});
const errors = [], results = [];
const readX = locator => locator.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
const screenshotStyle = '.site-header, .skip-link, nextjs-portal { visibility: hidden !important; }';

try {
 for (const width of [1440, 850, 375, 320]) {
  const context = await browser.newContext({viewport: {width, height: 1000}, reducedMotion: 'no-preference'});
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin, {waitUntil: 'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  const region = page.locator('.homepage-partners');
  const primaryImages = region.locator('.home-partner-logo-list:not([aria-hidden]) img');
  await region.scrollIntoViewIfNeeded();
  await primaryImages.evaluateAll(images => images.forEach(image => image.loading = 'eager'));
  await expect.poll(() => primaryImages.evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), {timeout: 15000}).toBe(true);
  const count = await primaryImages.count();
  assert(count > 80, 'Every published partner role and additional focus-state logo is included');
  assert(await primaryImages.evaluateAll(images => images.every(image => image.alt && !/published artwork|published partner/i.test(image.alt))), 'Logos have real partner names');
  assert(await region.locator('.home-partner-logo-list:not([aria-hidden]) .logo-viewport').evaluateAll(logos => logos.every(logo => {
   const box = logo.getBoundingClientRect();
   const ratio = Number(logo.dataset.logoWidth) / Number(logo.dataset.logoHeight);
   return Math.abs(box.width / box.height - ratio) / ratio < .015;
  })), 'Cropped artwork preserves its proportions in compact cards');
  await expect(region.getByRole('heading', {name: 'Our valued partners', exact: true})).toHaveCount(1);
  await expect(region.locator('button,input[type=range]')).toHaveCount(0);
  assert(await region.locator('.home-partner-category').evaluateAll(cards => cards.every(card => {
   const sources = [...card.querySelectorAll('.home-partner-logo-list:not([aria-hidden]) img')].map(image => image.src);
   return new Set(sources).size === sources.length;
  })), 'No duplicate source images within a role');
  assert(await region.evaluate(el => [...el.querySelectorAll('.home-partner-logos')].every(row => getComputedStyle(row).overflowX === 'hidden')), 'Logo rows have no horizontal scrollbar');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px page fits the viewport`);

  if (width >= 768) {
   for (const roles of [
    ['Energy Security Partner', 'Cybersecurity Partner', 'Technology Partner'],
    ['Host Utilities', 'Co-Host Utility', 'Partner Utility', 'Solar Ecosystem Partner'],
    ['Renewable Energy Partner', 'Lanyard & Badge Partner', 'Integrated Energy Security Partner', 'Industry Partner'],
    ['Decarbonisation Partner', 'VIP Elite Lounge Partner', 'National Skilling Partner', 'Investment Facilitation Partner'],
   ]) {
    const tops = await Promise.all(roles.map(role => region.locator(`[data-partner-role="${role}"]`).evaluate(el => el.offsetTop)));
    assert.equal(new Set(tops).size, 1, `Reference row: ${roles.join(', ')}`);
   }
  }
  const policy = region.locator('[data-partner-role="Policy & Governance Partners"]');
  const knowledge = region.locator('[data-partner-role="Knowledge Partners"]');
  assert(await knowledge.evaluate(el => el.previousElementSibling?.getAttribute('data-partner-role') === 'Policy & Governance Partners'), 'Knowledge immediately follows Policy & Governance');
  const policyBox = await policy.boundingBox(), knowledgeBox = await knowledge.boundingBox();
  assert(knowledgeBox.y >= policyBox.y + policyBox.height, 'Knowledge occupies the row below Policy & Governance');
  assert(Math.abs(policyBox.x - knowledgeBox.x) < 1 && Math.abs(policyBox.width - knowledgeBox.width) < 1, 'Both partner categories align across the full width');
  assert(await region.locator('.home-partner-logo-list:not([aria-hidden]) .home-partner-box').evaluateAll(boxes => {
   const first = boxes[0].getBoundingClientRect();
   return boxes.every(box => {
    const rect = box.getBoundingClientRect();
    return Math.abs(rect.width - first.width) < 1 && Math.abs(rect.height - first.height) < 1;
   });
  }), 'Every partner uses the same logo frame dimensions');

  const media = region.locator('[data-partner-role="Media Partners"] .home-partner-logos');
  const track = media.locator('.home-partner-track');
  await media.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(media).toHaveAttribute('data-playing', 'true');
  await expect(media.locator('[aria-hidden=true]')).toHaveCount(1);
  const first = await readX(track);
  await page.waitForTimeout(250);
  assert(await readX(track) < first - 2, 'Overflowing logos advance continuously');
  assert(await track.evaluate(el => {
   const [first, second] = el.children;
   const a = first.getBoundingClientRect(), b = second.getBoundingClientRect();
   const animation = getComputedStyle(el);
   return Math.abs(a.width - b.width) < 1 && Math.abs(a.right - b.left) < 1
    && Math.abs(el.getBoundingClientRect().width - a.width * 2) < 1
    && animation.animationTimingFunction === 'linear' && animation.animationIterationCount === 'infinite';
  }), 'Repeated logo sequences join without a gap or a jump');
  await media.hover();
  await page.waitForTimeout(50);
  const hovered = await readX(track);
  await page.waitForTimeout(180);
  assert.equal(await readX(track), hovered, 'Hover pauses logos for inspection');
  await page.mouse.move(0, 0);
  await media.focus();
  const focused = await readX(track);
  await page.waitForTimeout(180);
  assert.equal(await readX(track), focused, 'Keyboard focus pauses logos');
  await media.evaluate(el => el.blur());
  await region.locator('.home-partner-focus').scrollIntoViewIfNeeded();
  await expect.poll(() => media.getAttribute('data-playing')).toBe('false');

  if (width === 1440 || width === 375) {
   const axe = await new AxeBuilder({page}).include('.homepage-partners').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
   assert.deepEqual(axe.violations.map(item => ({id: item.id, nodes: item.nodes.map(node => node.target)})), [], 'Partner section accessibility');
  }

  await page.emulateMedia({reducedMotion: 'reduce'});
  await expect(region.locator('.home-partner-logo-copy')).toHaveCount(0);
  await expect.poll(() => region.evaluate(el => el.getAnimations({subtree: true}).length)).toBe(0);
  assert(await region.evaluate(el => [...el.querySelectorAll('.home-partner-box')].every(box => {
   const row = box.closest('.home-partner-logos').getBoundingClientRect();
   const rect = box.getBoundingClientRect();
   return rect.left >= row.left - 1 && rect.right <= row.right + 1 && rect.top >= row.top - 1 && rect.bottom <= row.bottom + 1;
  })), 'Reduced motion wraps every logo into view');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Static layout also fits the viewport');
  if (width === 1440) await region.screenshot({path: `${directory}/partners-reduced-motion.png`, style: screenshotStyle});
  // Screenshot animation suppression can retain animation handles in Chromium.
  // Check live motion preferences first, then capture the normal layout last.
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await expect(media.locator('[aria-hidden=true]')).toHaveCount(1);
  await region.screenshot({path: `${directory}/partners-${width}.png`, animations: 'disabled', style: screenshotStyle});
  results.push({width, logos: count, continuousLoop: 'passes', reducedMotion: 'all logos visible', controls: 'none'});
  await context.close();
 }
 assert.deepEqual(errors, [], 'Browser errors');
 await fs.writeFile(`${directory}/results.json`, JSON.stringify({results, errors}, null, 2));
 console.log(JSON.stringify({results, errors}));
} finally {
 await browser.close();
}
