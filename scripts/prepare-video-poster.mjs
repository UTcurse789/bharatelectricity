import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';

const origin=process.env.CHECK_ORIGIN||'http://localhost:3000';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const page=await browser.newPage();
 await page.goto(origin);
 const result=await page.evaluate(async origin=>{
  const video=document.createElement('video');
  video.muted=true;
  video.src=origin+'/assets/bharat-electricity-2027.mp4';
  await new Promise((resolve,reject)=>{video.onloadeddata=resolve;video.onerror=()=>reject(new Error('Video failed to decode'));});
  video.currentTime=Math.min(1,video.duration/2);
  await new Promise(resolve=>{video.onseeked=resolve;});
  const canvas=document.createElement('canvas');
  canvas.width=Math.min(1600,video.videoWidth);
  canvas.height=Math.round(canvas.width*video.videoHeight/video.videoWidth);
  canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
  return {width:video.videoWidth,height:video.videoHeight,duration:video.duration,poster:canvas.toDataURL('image/jpeg',.85).split(',')[1]};
 },origin);
 await fs.writeFile('public/assets/bharat-electricity-2027-poster.jpg',Buffer.from(result.poster,'base64'));
 console.log(JSON.stringify({width:result.width,height:result.height,duration:result.duration}));
} finally {await browser.close();}
