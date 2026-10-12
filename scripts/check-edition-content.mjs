import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {load} from 'cheerio';

const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const output='research/qa/editions';
await fs.mkdir(output,{recursive:true});
const council=JSON.parse(await fs.readFile('src/content/council-2024.json','utf8'));
const participants=JSON.parse(await fs.readFile('src/content/participants-2025.json','utf8'));
const inauguration=JSON.parse(await fs.readFile('src/content/inaugurations.json','utf8'));
assert.equal(council.members.length,27);assert.equal(new Set(council.members.map(member=>member.name)).size,27);
assert(council.members.every(member=>member.edition===2024&&member.photo));
assert.equal(participants.records.length,99);assert(participants.records.every(record=>record.edition===2025));
assert.equal(participants.sourceTitle,'Participants 2025');
assert(participants.records.every(record=>record.stand===null),'Unverified historical stand numbers must be withheld');
assert(inauguration.photos.some(photo=>photo.edition===2024&&photo.person==='Shri Pralhad Joshi'));
assert(inauguration.photos.every(photo=>photo.verifiedAlbumTitle.includes(String(photo.edition))));
assert(!inauguration.photos.some(photo=>photo.edition===2026),'Unverified 2026 images must not be relabelled');
const document=load(await fs.readFile('public/downloads/governing-council-2024.html','utf8'));
assert.equal(document('main article').length,27);
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],violations=[],verified=[];
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();
 page.on('pageerror',error=>errors.push(error.message));
 const visit=async route=>{await page.goto(origin+route,{waitUntil:'networkidle'});await expect(page.locator('main h1')).toHaveCount(1);};
 await visit('/');
 await expect(page.locator('.video-hero-event-info')).toContainText('2027');
 await expect(page.locator('.home-edition-navigation')).toHaveCount(0);
 await expect(page.locator('#companies-heading')).toHaveText('Participants 2026');
 await expect(page.locator('#speakers-heading')).toHaveText('Speakers 2025');
 await expect(page.locator('.home-partner-logo-loop')).toHaveCount(1);
 await page.screenshot({path:output+'/home-desktop.png'});
 verified.push('Homepage latest edition, participants and historical speakers are labelled consistently');
 for(const year of [2026,2025,2024]) {
  await visit('/editions/'+year+'/');
  await expect(page.locator('.edition-context a[aria-current]')).toContainText(String(year));
  await expect(page.getByRole('heading',{name:'Inauguration '+year,exact:true})).toBeVisible();
  if(year===2026)await expect(page.getByText('Inauguration photographs for 2026 will be added here when available.',{exact:true})).toBeVisible();
  else assert.equal(await page.locator('.inauguration-section .photo-tile').count(),2);
 }
 verified.push('All edition hubs and correctly dated inauguration photographs; 2026 availability is explicit');
 await visit('/meet-our-confirm-advisory-committee/');
 await expect(page.locator('.council-archive-member')).toHaveCount(27);
 await page.getByRole('searchbox',{name:'Search council members'}).fill('Soonee');
 await expect(page.locator('.council-archive-member')).toHaveCount(1);
 await expect(page.locator('.council-archive-member')).toContainText('Power System Operation Corporation Ltd.');
 await expect(page.locator('.council-archive-member')).not.toContainText('Electricity Private Limited');
 await page.getByRole('searchbox',{name:'Search council members'}).fill('');
 await page.locator('.council-archive-photo img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
 await expect.poll(()=>page.locator('.council-archive-photo img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
 await page.screenshot({path:output+'/council-2024-desktop.png',fullPage:true});
 await page.goto(origin+'/downloads/governing-council-2024.html',{waitUntil:'networkidle'});
 await expect(page.locator('h1')).toHaveCount(1);
 await expect(page.locator('main article')).toHaveCount(27);
 verified.push('Complete readable 2024 council, matching portraits, search and standalone record');
 for(const route of ['/participants-2025/','/exhibitor-list/']) {
  await visit(route);await expect(page.locator('h1')).toHaveText('Participants 2025');
  await page.getByRole('searchbox',{name:'Search Participants 2025'}).fill('BSES');
  await expect(page.locator('.company-card')).toHaveCount(2);
  await expect(page.locator('.company-card').first()).toContainText('2025 / Participant');
  await page.getByRole('button',{name:'Reset search'}).click();
  await expect(page.locator('.company-card')).toHaveCount(12);
 }
 await visit('/exhibitors/');await expect(page.locator('h1')).toHaveText('Participants 2026');
 await expect(page.locator('.company-card').first()).toContainText('2026 edition');
 verified.push('Separate 2025 and 2026 participant pages; old 2025 URL retains the correct archive');
 await visit('/media-hub/gallery/?year=2024');
 await expect(page.getByRole('tab',{name:'2024 · Archive',exact:true})).toHaveAttribute('aria-selected','true');
 await expect(page.getByRole('button',{name:'Open photo: Shri Pralhad Joshi and dignitaries at the 2024 inauguration ceremony',exact:true})).toBeVisible();
 await page.locator('.photo-tile').first().click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.locator('.lightbox-controls p')).toContainText('2024');
 await page.keyboard.press('Escape');
 await page.getByRole('tab',{name:'2025 · Archive',exact:true}).click();
 assert((await page.locator('.photo-tile').allTextContents()).every(text=>text.includes('2025')));
 await page.getByRole('tab',{name:'2026 · Latest',exact:true}).click();
 assert((await page.locator('.photo-tile').allTextContents()).every(text=>text.includes('2026')));
 assert((await page.locator('.photo-tile').allTextContents()).every(text=>!text.includes('Inauguration')));
 verified.push('Year-filtered photos, correct category captions, lightbox and archive query links');
 for(const width of [375,768,1440]) {
  await page.setViewportSize({width,height:1000});
  for(const route of ['/editions/2024/','/participants-2025/','/meet-our-confirm-advisory-committee/','/media-hub/gallery/?year=2025','/2026-speakers/']) {
   await visit(route);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow at '+width+' '+route);
   const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   violations.push(...scan.violations.map(violation=>({width,route,id:violation.id,nodes:violation.nodes.map(node=>node.target)})));
   if(width===375&&route==='/editions/2024/')await page.screenshot({path:output+'/edition-2024-mobile.png',fullPage:true});
  }
 }
 verified.push('Responsive edition archives and WCAG A/AA checks at mobile, tablet and desktop widths');
 await fs.writeFile(output+'/results.json',JSON.stringify({verified,errors,violations},null,2));
 assert.deepEqual(errors,[]);assert.deepEqual(violations,[]);
 console.log(JSON.stringify({verified,errors,violations}));
} finally {await browser.close();}
