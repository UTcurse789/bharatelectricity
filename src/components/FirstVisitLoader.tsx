'use client';
import {useCallback,useEffect,useRef} from 'react';
import type {AnimationItem} from 'lottie-web';
import {Brand} from './Brand';
const storageKey='bharat-introduction-v1';
export function FirstVisitLoader(){
 const dialog=useRef<HTMLDialogElement>(null);const canvas=useRef<HTMLDivElement>(null);const player=useRef<AnimationItem|null>(null);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const dismissed=useRef(false);
 const finish=useCallback(()=>{if(dismissed.current)return;dismissed.current=true;if(timer.current)clearTimeout(timer.current);player.current?.destroy();player.current=null;dialog.current?.close();delete document.documentElement.dataset.intro;document.body.style.overflow='';try{localStorage.setItem(storageKey,'seen')}catch{}},[]);
 useEffect(()=>{
  let cancelled=false;if(document.documentElement.dataset.intro!=='pending')return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return}
  dialog.current?.showModal();document.body.style.overflow='hidden';dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();
  timer.current=setTimeout(finish,5500);
  import('lottie-web/build/player/lottie_light').then(({default:lottie})=>{if(cancelled||dismissed.current||!canvas.current)return;const instance=lottie.loadAnimation({container:canvas.current,renderer:'svg',loop:false,autoplay:true,path:'/animations/opening.json',rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});player.current=instance;instance.addEventListener('complete',finish);instance.addEventListener('data_failed',finish);}).catch(finish);
  return()=>{cancelled=true;if(timer.current)clearTimeout(timer.current);player.current?.destroy();dialog.current?.close();document.body.style.overflow='';delete document.documentElement.dataset.intro;};
 },[finish]);
 return <dialog ref={dialog} className="intro-dialog" aria-labelledby="intro-title" onCancel={e=>{e.preventDefault();finish()}}><div className="intro-content"><Brand/><div ref={canvas} className="intro-animation" aria-hidden="true"/><p className="eyebrow" id="intro-title">Welcome to BHARAT ELECTRICITY</p><p>Energy. Connections. Possibilities.</p><button className="text-button" onClick={finish}>Skip introduction</button></div></dialog>;
}
