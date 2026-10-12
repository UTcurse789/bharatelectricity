import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';

const baseline=process.argv.includes('--baseline');
const origin=process.env.CHECK_ORIGIN||'http://localhost:4173';
const directory='research/qa/ribbon-scroll';
await fs.mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],measurements=[];
try {
 for(const width of baseline?[1440]:[1440,768,375,320]) {
  const page=await browser.newPage({viewport:{width,height:1000}});
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin,{waitUntil:'networkidle'});
  await expect(page.locator('.section-ribbon')).toHaveCount(4);
  await page.getByRole('button',{name:'Pause slideshow',exact:true}).click();
  const videoPause=page.getByRole('button',{name:'Pause background video',exact:true});
  if(await videoPause.isVisible())await videoPause.click();
  for(const selector of ['.homepage-partners','.participating-section','.council-section','.speaker-section']) {
   const section=page.locator(selector),ribbon=section.locator(':scope>.section-ribbon');
   const top=await section.evaluate(el=>el.getBoundingClientRect().top+scrollY-180);
   await page.evaluate(top=>scrollTo({top,behavior:'instant'}),top);
   await page.waitForTimeout(800);
   await ribbon.evaluate(el=>{
    window.__ribbonWrites=0;
    window.__ribbonObserver?.disconnect();
    window.__ribbonObserver=new MutationObserver(records=>{window.__ribbonWrites+=records.length;});
    window.__ribbonObserver.observe(el,{attributes:true,subtree:true,childList:true});
   });
   const geometry=await section.evaluate(el=>({height:el.offsetHeight,top:el.getBoundingClientRect().top+scrollY}));
   await page.mouse.move(width-35,800);
   await page.mouse.wheel(0,350);
   const frames=await page.evaluate(()=>new Promise(resolve=>{
    const frames=[];
    const tick=()=>{frames.push({y:scrollY,x:scrollX,width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight});if(frames.length<36)requestAnimationFrame(tick);else resolve(frames);};
    requestAnimationFrame(tick);
   }));
   if(!baseline)await expect.poll(()=>page.locator('html').getAttribute('class'),{timeout:10000}).not.toMatch(/lenis-scrolling/);
   await page.waitForTimeout(250);
   const mutations=await page.evaluate(()=>window.__ribbonWrites);
   const after=await section.evaluate(el=>({height:el.offsetHeight,top:el.getBoundingClientRect().top+scrollY}));
   const settled=await page.evaluate(()=>({x:scrollX,y:scrollY}));
   await page.waitForTimeout(250);
   if(!baseline) {
    assert.equal(mutations,0,'No per-frame SVG mutations: '+selector);
    await expect(ribbon).toHaveAttribute('data-motion','static');
    assert(frames.every(frame=>frame.x===0&&frame.width<=width),'No horizontal page movement: '+JSON.stringify({width,selector,frames:frames.filter(frame=>frame.x!==0||frame.width>width).slice(0,3),containers:await page.locator('main,.home-page,.home-page>.section,.site-header,.site-footer').evaluateAll(elements=>elements.map(el=>({class:el.className,width:el.getBoundingClientRect().width,right:el.getBoundingClientRect().right,scrollWidth:el.scrollWidth})).filter(el=>el.right>innerWidth+1||el.width>innerWidth+1))}));
    assert(frames.every((frame,index)=>!index||frame.y>=frames[index-1].y-1),'No backwards scroll jitter');
    assert.equal(new Set(frames.map(frame=>frame.height)).size,1,'Stable document height');
    assert.equal(geometry.height,after.height,'Stable section height');
    assert(Math.abs(geometry.top-after.top)<1,'Stable section position');
    assert(Math.abs(await page.evaluate(()=>scrollY)-settled.y)<2,'Scroll settles');
    await expect(ribbon).toHaveAttribute('aria-hidden','true');
    await expect(ribbon).toHaveCSS('pointer-events','none');
   }
   measurements.push({width,section:selector,ribbonMutations:mutations,scrollStart:frames[0].y,scrollEnd:frames.at(-1).y,stableDocumentHeight:new Set(frames.map(frame=>frame.height)).size===1,scrollClasses:await page.locator('html').getAttribute('class')});
  }
  if(!baseline) {
   const search=page.getByRole('searchbox',{name:'Search speakers',exact:true});
   await search.fill('Bhalla');await expect(page.locator('.speaker-rail .person-card')).toHaveCount(1);
   await search.fill('');await expect(page.locator('.speaker-rail .person-card')).toHaveCount(72);
   await page.getByRole('button',{name:'Next speakers',exact:true}).click();
   await expect.poll(()=>page.locator('.speaker-rail .rail-track').evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
   if(width===1440||width===375){await page.locator('.speaker-section').scrollIntoViewIfNeeded();await page.screenshot({path:directory+'/speakers-'+width+'.png'});}
   await page.emulateMedia({reducedMotion:'reduce'});
   await expect(page.locator('html')).not.toHaveClass(/lenis/);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.close();
 }
 assert.deepEqual(errors,[],'Browser errors');
 await fs.writeFile(directory+'/'+(baseline?'baseline':'results')+'.json',JSON.stringify({measurements,errors},null,2));
 console.log(JSON.stringify({measurements,errors}));
} finally {await browser.close();}
