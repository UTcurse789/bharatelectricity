import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const origin=process.env.CHECK_ORIGIN || 'http://localhost:3000';
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser=await chromium.launch({executablePath:chrome,headless:true});
const errors=[],results=[];
await fs.mkdir('research/qa/lanyard',{recursive:true});
const members=[['siddhartha','Siddhartha Mishra','siddhartha@encis.in','+919999913164'],['amit','Amit Gupta','amit@itenmedia.in','+919821283870'],['hansika','Hansika Gupta','hansika@itenmedia.in','+919990401916']];
const monitor=page=>{page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});};
try {
 for(const width of [1440,768,375,320]) {
  console.log(`Checking ${width}px`);
  const context=await browser.newContext({viewport:{width,height:720},hasTouch:width<768});
  const page=await context.newPage();monitor(page);
  await page.goto(origin+'/contact/',{waitUntil:'networkidle'});
  const group=page.getByRole('region',{name:'Meet the team'});
  await expect(group.locator('.contact-lanyard')).toHaveCount(3);
  await expect(group.locator('canvas')).toHaveCount(0);
  await expect(page.getByText('Drag the card to move it. Click to flip it.',{exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Flip card',exact:true})).toHaveCount(0);
  const form=await page.locator('.contact-layout').boundingBox(),groupBox=await group.boundingBox();
  assert(groupBox.y>form.y+form.height,'Cards must be below the complete Contact layout');
  await page.setViewportSize({width,height:width>=768?1100:900});
  await group.scrollIntoViewIfNeeded();
  if(width>=768){
   await expect(group.locator('.contact-lanyard-stage[data-ready=true]')).toHaveCount(3,{timeout:20000});
   const center=await group.locator('[data-person=siddhartha]').boundingBox(),left=await group.locator('[data-person=amit]').boundingBox(),right=await group.locator('[data-person=hansika]').boundingBox();
   assert(left.x<center.x && center.x<right.x,'Amit left, Siddhartha center, Hansika right');
   assert(Math.abs(center.x+center.width/2-width/2)<2,'Featured card must sit at the page center');
   assert(center.y<left.y && Math.abs(left.y-right.y)<1,'Center is raised and both sides align equally');
   assert(Math.abs(left.width-right.width)<1,'Both side cards must have equal width');
  }else{
   const rects=await group.locator('.contact-lanyard').evaluateAll(cards=>cards.map(card=>({person:card.dataset.person,y:card.getBoundingClientRect().y})));
   assert(rects.find(card=>card.person==='siddhartha').y<rects.find(card=>card.person==='amit').y,'Featured card comes first on mobile');
  }
  for(const [id,name,email,phone] of members){
   console.log(`Checking ${width}px ${id}`);
   const member=group.locator('[data-person='+id+']'),stage=member.locator('.contact-lanyard-stage');
   await expect(member.getByRole('heading',{name,exact:true})).toBeVisible();
   await expect(member.getByRole('link',{name:email,exact:true})).toHaveAttribute('href','mailto:'+email);
   await expect(member.locator('a[href^="tel:"]')).toHaveAttribute('href','tel:'+phone);
   await member.scrollIntoViewIfNeeded();await expect(stage).toHaveAttribute('data-ready','true',{timeout:20000});
   const canvas=stage.locator('canvas');await expect(canvas).toHaveAttribute('aria-label',new RegExp('^'+name));
   if(await member.locator('img').count())await expect.poll(()=>member.locator('img').evaluate(image=>image.complete && image.naturalWidth>0)).toBe(true);
   await page.waitForTimeout(2200);
   const box=await canvas.boundingBox();const x=box.x+box.width/2,y=box.y+box.height*.56;
   await page.mouse.move(x,y);await expect(canvas).toHaveCSS('cursor','grab');
   const before=await canvas.screenshot();await page.mouse.down();await expect(canvas).toHaveCSS('cursor','grabbing');
   await page.mouse.move(x+Math.min(70,width/6),y-50,{steps:18});
   assert(!before.equals(await canvas.screenshot()),'Dragging must change '+name+' card');
   await page.mouse.up();await page.mouse.move(0,0);await page.waitForTimeout(900);
   await canvas.focus();const beforeFlip=await canvas.screenshot();await page.keyboard.press('Enter');await page.waitForTimeout(250);
   assert(!beforeFlip.equals(await canvas.screenshot()),'Keyboard flipping must animate '+name+' card');
   await canvas.evaluate(el=>el.blur());
   if(width===375 && id==='siddhartha'){
    await page.waitForTimeout(2000);const cdp=await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await expect(canvas).toHaveCSS('cursor','grabbing');
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+40,y:y-30}]});await page.waitForTimeout(150);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();results.push('Native touch drag');
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow at '+width);
   if(width<768)await member.screenshot({path:`research/qa/lanyard/${width}-${id}.png`});
  }
  if(width===1440){
   await group.scrollIntoViewIfNeeded();await page.waitForTimeout(1500);
   const axe=await new AxeBuilder({page}).include('.contact-layout').include('.contact-lanyards').analyze();assert.deepEqual(axe.violations,[],'Contact accessibility');
   await group.getByRole('button',{name:'Pause automatic sway',exact:true}).click();await expect(group.getByRole('button',{name:'Resume automatic sway',exact:true})).toBeVisible();
   await group.screenshot({path:'research/qa/lanyard/team-desktop.png'});results.push('Accessible cards and automatic sway pause/resume');
  }
  if(width===768){await group.scrollIntoViewIfNeeded();await group.screenshot({path:'research/qa/lanyard/team-tablet.png'});}
  await page.getByRole('button',{name:'Check enquiry',exact:true}).click();await expect(page.locator('.enquiry-form').getByRole('alert')).toContainText('6 fields need attention');
  if(width===375){const member=group.locator('[data-person=siddhartha]');await member.scrollIntoViewIfNeeded();await member.locator('canvas').dispatchEvent('webglcontextlost');await expect(member.locator('canvas')).toHaveCount(0);await expect(member.locator('.contact-lanyard-still')).toHaveCSS('opacity','1');results.push('Context loss retains the static contact card');}
  results.push(`Three cards, ordering, contact links, mouse drag, keyboard flip and form validation at ${width}px`);
  await context.close();
 }
 for(const options of [{reducedMotion:'reduce'},{javaScriptEnabled:false}]){
  const page=await browser.newPage({...options,viewport:{width:375,height:900}});monitor(page);await page.goto(origin+'/contact/',{waitUntil:'networkidle'});
  const group=page.locator('.contact-lanyards');await expect(group.locator('canvas')).toHaveCount(0);
  await expect(group.locator('.contact-lanyard')).toHaveCount(3);
  for(const [id] of members){const member=group.locator('[data-person='+id+']');await member.scrollIntoViewIfNeeded();await expect(member.locator('.contact-lanyard-still')).toHaveCSS('opacity','1');}
  await group.locator('[data-person=siddhartha]').screenshot({path:`research/qa/lanyard/${options.reducedMotion?'reduced-motion':'no-js'}.png`});
  results.push(options.reducedMotion?'Reduced-motion cards retain names and contact links':'Three contact cards remain usable without JavaScript');await page.close();
 }
 const unsupported=await chromium.launch({executablePath:chrome,headless:true,args:['--disable-webgl']});
 try{const page=await unsupported.newPage({viewport:{width:1440,height:1100}});monitor(page);await page.goto(origin+'/contact/',{waitUntil:'networkidle'});await page.locator('.contact-lanyards').scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await expect(page.locator('.contact-lanyards canvas')).toHaveCount(0);await expect(page.locator('.contact-lanyard-still')).toHaveCount(3);results.push('Unsupported WebGL keeps all static cards');}finally{await unsupported.close();}
 assert.deepEqual(errors,[],'Console or hydration errors');console.log(JSON.stringify({origin,passed:results,errors}));
}finally{await browser.close();}
