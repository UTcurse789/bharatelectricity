import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin = process.env.CHECK_ORIGIN || 'http://localhost:4173';
const directory = 'research/qa/homepage-cleanup';
await fs.mkdir(directory, {recursive: true});
const browser = await chromium.launch({executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true});
const errors = [], results = [];
try {
 const widthOption = process.argv.find(value => value.startsWith('--widths='));
 const widths = widthOption ? widthOption.split('=')[1].split(',').map(Number) : [1920, 1440, 1024, 768, 375, 320];
 for (const width of widths) {
  const context = await browser.newContext({viewport: {width, height: 1000}, reducedMotion: width === 1440 ? 'no-preference' : 'reduce'});
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin, {waitUntil: 'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('.video-hero h1')).toHaveText('BHARAT ELECTRICITY');
  await expect(page.locator('.video-hero-event-info')).toContainText('1–3 SEPTEMBER 2027');
  await expect(page.locator('.video-hero').getByRole('link',{name:'Register Now',exact:true})).toHaveCount(0);
  await expect(page.locator('.video-hero').getByRole('link',{name:'Explore event highlights',exact:true})).toHaveCount(0);
  await expect(page.locator('.video-hero').getByRole('link',{name:'Book your delegate pass',exact:true})).toHaveAttribute('href',/^\/summit-overview\/register\/?$/);
  await expect(page.locator('.video-hero').getByRole('link',{name:'Register as a visitor',exact:true})).toHaveAttribute('href',/^\/visitor-registration\/?$/);
  await expect(page.locator('.site-header').getByRole('link',{name:'Enquire',exact:true})).toHaveCount(0);
  await expect(page.locator('.header-cta')).toHaveText('Register');
  await expect(page.locator('.header-cta')).toHaveAttribute('href',/^\/registration-options\/?$/);
  await expect(page.locator('#colocated-heading,#initiatives-heading,.home-team,.partner-logo-loop')).toHaveCount(0);
  await expect(page.getByRole('heading', {name: 'Government Support', exact: true})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Our valued partners', exact: true})).toBeVisible();
  const header = page.locator('.government-desktop-art');
  await expect.poll(() => header.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await expect(header).toBeVisible();
  const artwork=await header.boundingBox();
  assert(Math.abs(artwork.height-artwork.width*2657/14314)<1,'Full government artwork preserves its proportions at every width, allowing resized image pixel rounding');
  await expect(page.locator('.government-banner details,.government-mobile-art')).toHaveCount(0);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Government artwork fits the viewport');
  if(width>=1280) {
   const bannerBox=await header.boundingBox(),navigationBox=await page.locator('.header-main').boundingBox();
   assert(Math.abs(bannerBox.x-navigationBox.x)<1&&Math.abs(bannerBox.width-navigationBox.width)<1,'Government artwork aligns with the navigation content margins');
  }
  await page.screenshot({path: `${directory}/opening-${width}.png`});

  const hero = page.locator('.video-hero'), video = hero.locator('video');
  await hero.scrollIntoViewIfNeeded();
  await expect(hero.locator('button,.video-hero-media-controls,.video-hero-open-film')).toHaveCount(0);
  if (width !== 1440) {
   assert(await video.evaluate(v => v.paused && !v.currentSrc), 'Reduced motion avoids automatic video download');
  } else {
   await expect.poll(() => video.evaluate(v => !v.paused && v.currentTime > .1 && v.videoWidth === 1280), {timeout: 15000}).toBe(true);
   const time = await video.evaluate(v => v.currentTime);
   await page.waitForTimeout(350);
   assert(await video.evaluate(v => v.currentTime) > time, 'Video decodes and plays');
  }
  const range = await page.request.get(origin + '/assets/bharat-electricity-2027.mp4', {headers: {Range: 'bytes=0-1023'}});
  assert.equal(range.status(), 206);
  assert.equal((await range.body()).length, 1024);
  await hero.screenshot({path: `${directory}/hero-${width}.png`});

  const introduction=page.locator('.energy-introduction-copy');
  await expect(introduction).toContainText("India's energy story has entered a new phase.");
  await expect(introduction.locator('strong')).toHaveText('capacity alone will no longer define progress.');
  const heroFits=await hero.evaluate(el=>{
   const region=el.getBoundingClientRect(),copy=el.querySelector('.video-hero-copy').getBoundingClientRect();
   return copy.top>=region.top&&copy.bottom<=region.bottom;
  });
  assert(heroFits,'2027 cover copy fits inside the hero');
  await introduction.scrollIntoViewIfNeeded();
  const geometry=()=>introduction.evaluate(el=>({height:el.offsetHeight,pageHeight:document.documentElement.scrollHeight}));
  const beforeReveal=await geometry();
  if(width===1440)await expect.poll(()=>introduction.evaluate(el=>el.getAnimations({subtree:true}).length)).toBeGreaterThan(0);
  else assert(await introduction.evaluate(el=>el.getAnimations({subtree:true}).length===0),'Reduced motion keeps introduction static');
  await page.waitForTimeout(1000);
  assert.deepEqual(await geometry(),beforeReveal,'Text animation does not shift layout');
  assert(await introduction.evaluate(el=>el.getAnimations({subtree:true}).length===0),'Text reveal finishes without a loop');
  if(width===1440||width===375)await page.locator('.energy-introduction').screenshot({path:`${directory}/introduction-${width}.png`});

  const carousel = page.locator('.event-carousel');
  await carousel.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate(v => v.paused)).toBe(true);
  const heights = [];
  for (let slide = 1; slide <= 5; slide++) {
   await carousel.getByRole('button', {name: new RegExp(`^Show slide ${slide}:`)}).click();
   await page.waitForTimeout(100);
   const fits = await carousel.evaluate(el => {
    const stage = el.querySelector('.carousel-stage').getBoundingClientRect();
    const controls = el.querySelector('.carousel-controls').getBoundingClientRect();
    return [...el.querySelectorAll('.carousel-copy,.carousel-report-art,.carousel-feature-photo')].every(node => {
     const box = node.getBoundingClientRect();
     return box.top >= stage.top - 1 && box.bottom <= controls.top + 1;
    });
   });
   assert(fits, `${width}px slide ${slide} stays above its controls`);
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px slide ${slide} has no horizontal page overflow`);
   heights.push(await page.evaluate(() => document.documentElement.scrollHeight));
  }
  assert.equal(new Set(heights).size, 1, 'Slide changes keep the page height stable');
  await carousel.getByRole('button', {name: /^Show slide 1:/}).click();
  await expect(carousel.getByRole('link', {name: 'Request the report'})).toHaveAttribute('href', /postshowreport/);
  await carousel.screenshot({path: `${directory}/report-${width}.png`});

  const partners = page.locator('.homepage-partners');
  const logos = partners.locator('.home-partner-logo-list:not([aria-hidden]) .home-partner-box img');
  assert(await logos.count() > 75, 'All partner groups are rendered once with their roles');
  await partners.getByRole('heading', {name: 'Focus States', exact: true}).first().scrollIntoViewIfNeeded();
  const logo = logos.first();
  await logo.scrollIntoViewIfNeeded();
  await expect.poll(() => logo.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await logo.hover();
  await page.waitForTimeout(50);
  const before = await logo.boundingBox();
  await page.waitForTimeout(350);
  assert.deepEqual(await logo.boundingBox(), before, 'Partner hover pauses the artwork without scaling');
  if (width !== 1440) assert(await partners.evaluate(el => el.getAnimations({subtree: true}).length === 0), 'Reduced-motion partner display is static');
  await expect(partners.locator('button,input[type=range]')).toHaveCount(0);
  if (width === 1440) {
   await page.mouse.move(10, 600);
   await page.mouse.wheel(0, 600);
   const samples = await page.evaluate(() => new Promise(resolve => {
    const readings = [];
    const sample = () => {
     readings.push({y: scrollY, height: document.documentElement.scrollHeight, width: document.documentElement.scrollWidth});
     if (readings.length < 50) requestAnimationFrame(sample); else resolve(readings);
    };
    requestAnimationFrame(sample);
   }));
   assert(samples.every((sample, index) => index === 0 || sample.y >= samples[index - 1].y), 'Wheel scrolling moves consistently forward');
   assert.equal(new Set(samples.map(sample => sample.height)).size, 1, 'Scrolling does not jiggle page height');
   assert.equal(new Set(samples.map(sample => sample.width)).size, 1, 'Scrolling does not jiggle page width');
  }
  if (width === 1440 || width === 375) await partners.screenshot({path: `${directory}/partners-${width}.png`});

  const companies = page.locator('.company-rail');
  await companies.scrollIntoViewIfNeeded();
  await expect.poll(() => companies.locator('.company-card').count()).toBeGreaterThan(8);
  const search = page.getByRole('searchbox', {name: 'Search companies'});
  await search.fill('WOG');
  await expect(companies.locator('.company-card')).toHaveCount(1);
  await search.fill('company-that-does-not-exist');
  await expect(page.locator('.home-directory-empty')).toBeVisible();
  await page.getByRole('button', {name: 'Clear search'}).click();
  await expect(page.locator('.home-directory-empty')).toHaveCount(0);
  await page.locator('.company-rail').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.company-rail .company-card').count()).toBeGreaterThan(8);
  await page.getByRole('button', {name: 'Next participating companies'}).click();
  await expect.poll(() => page.locator('.company-rail .infinite-card-window').evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  if (width === 1440 || width === 375) {
   const axe = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
   assert.deepEqual(axe.violations.map(v => ({id: v.id, nodes: v.nodes.map(n => n.target)})), [], `${width}px accessibility`);
  }
  results.push({width, partners: await logos.count(), video: 'plays; pause/resume; pauses offscreen', layout: 'no overflow or report overlap'});
  await context.close();
 }
 assert.deepEqual(errors, [], 'Browser errors');
 await fs.writeFile(`${directory}/results.json`, JSON.stringify({results, errors}, null, 2));
 console.log(JSON.stringify({results, errors}));
} finally {await browser.close();}
