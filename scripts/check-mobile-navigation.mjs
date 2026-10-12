import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const directory='research/qa/mobile-navigation';
await fs.mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[],errors=[];
try {
 for(const [width,height] of [[320,812],[375,844],[390,844],[768,1024],[844,390]]) {
  const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,reducedMotion:width===375?'no-preference':'reduce'});
  const page=await context.newPage();
  const tap=async locator=>{
   await expect(locator).toBeVisible();
   const box=await locator.boundingBox();
   // Locator.click auto-scrolls a sticky element's document position before
   // dispatching the event. Tap its visible coordinates like a phone user.
   await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);
  };
  const tapToggle=()=>tap(page.locator('.menu-toggle'));
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const menu=page.locator('.mobile-nav');
  // Cover both the masthead in view and the sticky header after scrolling.
  for(const top of [0,40]) {
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),top);
   await tapToggle();
   await expect(menu).toBeVisible();
   await page.waitForTimeout(250);
   const initialBox=await menu.boundingBox();
   assert(initialBox.y>=0&&initialBox.y+initialBox.height<=height,`Menu fits when the government banner is in view: ${JSON.stringify({width,height,top,box:initialBox})}`);
   await tapToggle();
   await expect(menu).toHaveCount(0);
  }
  await page.evaluate(()=>scrollTo({top:4500,behavior:'instant'}));
  await page.waitForTimeout(250);
  const geometry=()=>page.evaluate(()=>({scrollY,height:document.documentElement.scrollHeight,headerHeight:document.querySelector('.site-header').getBoundingClientRect().height}));
  const before=await geometry();
  await tapToggle();
  await expect(menu).toBeVisible();
  await expect(page.getByRole('button',{name:'Close navigation',exact:true})).toHaveAttribute('aria-expanded','true');
  await page.waitForTimeout(250);
  const after=await geometry();
  assert.equal(after.height,before.height,'Opening the overlay does not change the page height');
  assert.equal(after.headerHeight,before.headerHeight,'Opening the overlay does not expand the sticky header');
  assert(Math.abs(after.scrollY-before.scrollY)<=1,'Opening the overlay preserves the scroll position');
  const box=await menu.boundingBox();
  assert(box.y>=0&&box.y+box.height<=height&&box.x>=0&&box.width<=width,'Menu fits the visible viewport');
  const touch=await context.newCDPSession(page);
  await touch.send('Input.synthesizeScrollGesture',{x:width-2,y:height-2,yDistance:-180,gestureSourceType:'touch'});
  assert(Math.abs((await geometry()).scrollY-before.scrollY)<=1,'Backdrop touch gestures cannot scroll the locked page');
  await touch.detach();
  await tap(menu.getByRole('button',{name:'About',exact:true}));
  await tap(menu.locator('.nav-council-toggle').first());
  await expect(menu.getByRole('link',{name:'Governing Council 2026',exact:true})).toBeVisible();
  await menu.evaluate(el=>{el.scrollTop=el.scrollHeight;});
  assert(await menu.evaluate(el=>el.scrollTop>0),'Long menus scroll independently');
  assert(Math.abs((await geometry()).scrollY-before.scrollY)<=1,'Menu scrolling leaves the page in place');
  await menu.locator('.button').last().evaluate(el=>el.focus({preventScroll:true}));
  await page.keyboard.press('Tab');
  assert(await page.evaluate(()=>!!document.activeElement.closest('.site-header')),'Keyboard focus stays inside the open menu');
  await menu.evaluate(el=>{el.scrollTop=0;});
  await tap(menu.getByRole('button',{name:'About',exact:true}));
  await page.locator('.mobile-nav-backdrop').click({position:{x:Math.floor(width/2),y:Math.floor(height-(await page.locator('.mobile-nav-backdrop').boundingBox()).y-2)}});
  await expect(menu).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Open navigation',exact:true})).toBeFocused();
  assert(Math.abs((await geometry()).scrollY-before.scrollY)<=1,'Dismissing the overlay preserves the page position');
  assert(await page.evaluate(()=>!['hidden','clip'].includes(document.body.style.overflow)),'Dismissal restores page scrolling');
  await tapToggle();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await tapToggle();
  if(width===375||width===844) {
   await page.waitForTimeout(250);
   await page.screenshot({path:`${directory}/menu-${width}.png`});
   const axe=await new AxeBuilder({page}).include('.site-header').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
   assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],'Open menu accessibility');
  }
  await menu.getByRole('link',{name:'Register',exact:true}).click();
  await expect(page.locator('main h1')).toHaveText('Register');
  await expect(menu).toHaveCount(0);
  assert(await page.evaluate(()=>!['hidden','clip'].includes(document.body.style.overflow)),'Navigation restores page scrolling');
  await tapToggle();
  await page.setViewportSize({width:1440,height:900});
  await expect(menu).toHaveCount(0);
  assert(await page.evaluate(()=>!['hidden','clip'].includes(document.body.style.overflow)),'Desktop resize releases the scroll lock');
  results.push({width,height,overlay:'fits; no page shift',submenu:'scrolls',dismissal:'toggle, backdrop, Escape, navigation and desktop resize'});
  await context.close();
 }
 assert.deepEqual(errors,[],'No browser exceptions');
 await fs.writeFile(`${directory}/results.json`,JSON.stringify({results,errors},null,2));
 console.log(JSON.stringify({results,errors}));
} finally {await browser.close();}
