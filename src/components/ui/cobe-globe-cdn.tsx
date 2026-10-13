'use client';

import {useEffect,useMemo,useRef,useState,type PointerEvent} from 'react';
import type {Globe,Marker,Arc} from 'cobe';

export interface CdnMarker {id:string;location:[number,number];region:string;flag?:string;}
export interface CdnArc {id:string;from:[number,number];to:[number,number];}
interface GlobeCdnProps {markers:CdnMarker[];arcs:CdnArc[];speed?:number;}
const green:[number,number,number]=[0.03,0.38,0.19];
const orange:[number,number,number]=[0.96,0.42,0.09];

export function GlobeCdn({markers,arcs,speed=0.002}:GlobeCdnProps){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const globeRef=useRef<Globe|null>(null);
 const labels=useRef(new Map<string,HTMLSpanElement>());
 const camera=useRef({phi:3.36,theta:0.1});
 const pointer=useRef<{x:number;y:number;phi:number;theta:number}|null>(null);
 const wake=useRef<()=>void>(()=>{});
 const speedRef=useRef(speed);
 const [status,setStatus]=useState<'loading'|'ready'|'unavailable'>('loading');
 const data=useMemo(()=>({
  markers:markers.map(marker=>({location:marker.location,size:marker.id==='delhi'?0.03:0.009,color:marker.id==='delhi'?green:orange})) as Marker[],
  arcs:arcs.map(arc=>({from:arc.from,to:arc.to,color:orange})) as Arc[],
 }),[markers,arcs]);
 const mapData=useRef(data);
 const points=useMemo(()=>markers.map(marker=>{
  const lat=marker.location[0]*Math.PI/180,lon=marker.location[1]*Math.PI/180;
  return {id:marker.id,x:Math.cos(lat)*Math.cos(lon)*0.825,y:Math.sin(lat)*0.825,z:-Math.cos(lat)*Math.sin(lon)*0.825};
 }),[markers]);
 const pointsRef=useRef(points);
 useEffect(()=>{speedRef.current=speed;mapData.current=data;pointsRef.current=points;globeRef.current?.update(data);wake.current();},[speed,data,points]);

 useEffect(()=>{
  const canvas=canvasRef.current;
  if(!canvas)return;
  let disposed=false,visible=false,loading=false,frame=0,lastTime=0;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const stop=()=>{cancelAnimationFrame(frame);frame=0;lastTime=0;};
  // Project flags with COBE's world-to-view rotation, without CSS anchor support.
  // Separate neighboring badges so every country's flag remains visible.
  const positionFlags=()=>{
   const {phi,theta}=camera.current;
   const cy=Math.cos(phi),sy=Math.sin(phi),cx=Math.cos(theta),sx=Math.sin(theta);
   const width=canvas.clientWidth;
   const gap=width<768?38:44,height=width<768?32:36;
   const scale=width<768?1:1.15;
   const canvasBox=canvas.getBoundingClientRect();
   const stageBox=canvas.closest('.global-visitors-stage')!.getBoundingClientRect();
   const minX=stageBox.left-canvasBox.left,maxX=stageBox.right-canvasBox.left;
   const minY=stageBox.top-canvasBox.top,maxY=stageBox.bottom-canvasBox.top;
   const placed:{x:number;y:number;width:number;height:number}[]=[];
   const projected=pointsRef.current.map(point=>{
    const rx=cy*point.x+sy*point.z,ry=sy*sx*point.x+cx*point.y-cy*sx*point.z;
    const depth=-sy*cx*point.x+sx*point.y+cy*cx*point.z;
    return {id:point.id,x:(rx*scale+1)*width/2,y:(1-ry*scale)*width/2,depth};
   }).sort((a,b)=>a.id==='delhi'?-1:b.id==='delhi'?1:a.y-b.y);
   for(const point of projected){
    const label=labels.current.get(point.id);
    if(!label)continue;
    if(point.depth<=0){label.style.opacity='0';label.style.visibility='hidden';continue;}
    let x=point.x,y=point.y-(point.id==='delhi'?28:18);
    const boxWidth=point.id==='delhi'?100:gap;
    outer:for(let ring=0;ring<6;ring++){
     for(let row=-ring;row<=ring;row++)for(let column=-ring;column<=ring;column++){
      if(ring&&Math.max(Math.abs(row),Math.abs(column))!==ring)continue;
      const candidateX=Math.max(minX+boxWidth/2,Math.min(maxX-boxWidth/2,point.x+column*gap));
      const candidateY=Math.max(minY+height/2,Math.min(maxY-height/2,point.y-18+row*height));
      if(placed.every(box=>Math.abs(candidateX-box.x)>=(boxWidth+box.width)/2||Math.abs(candidateY-box.y)>=(height+box.height)/2)){
       x=candidateX;y=candidateY;break outer;
      }
     }
    }
    placed.push({x,y,width:boxWidth,height});
    label.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;
    label.style.opacity=String(Math.min(point.depth*10,1));label.style.visibility='visible';
   }
  };
  const paint=(time:number)=>{
   frame=0;if(!globeRef.current||!visible||document.hidden)return;
   const rotating=!motion.matches&&!pointer.current;
   if(rotating)camera.current.phi+=speedRef.current*Math.min(lastTime?(time-lastTime)/16.67:1,3);
   globeRef.current.update(camera.current);positionFlags();lastTime=time;
   if(rotating)frame=requestAnimationFrame(paint);
  };
  const requestPaint=()=>{if(!disposed&&visible&&!document.hidden&&!frame)frame=requestAnimationFrame(paint);};
  wake.current=requestPaint;
  const initialize=async()=>{
   if(loading||globeRef.current||disposed)return;loading=true;
   try{
    const {default:createGlobe}=await import('cobe');if(disposed)return;
    const contextOptions={alpha:true,stencil:false,antialias:true,depth:false,preserveDrawingBuffer:false};
    if(!(canvas.getContext('webgl2',contextOptions)||canvas.getContext('webgl',contextOptions)))throw new Error('WebGL unavailable');
    const width=canvas.clientWidth;
    globeRef.current=createGlobe(canvas,{devicePixelRatio:Math.min(devicePixelRatio||1,2),width,height:width,scale:width<768?1:1.15,context:contextOptions,...camera.current,dark:0,diffuse:1.3,mapSamples:28000,mapBrightness:5,baseColor:[0.89,0.95,0.91],markerColor:orange,glowColor:[1,1,1],mapBaseBrightness:0.04,markerElevation:0.025,arcColor:orange,arcWidth:0.45,arcHeight:0.18,opacity:1,...mapData.current});
    setStatus('ready');requestPaint();
   }catch{if(!disposed)setStatus('unavailable');}
  };
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){void initialize();requestPaint();}else stop();},{rootMargin:'100px'});
  intersection.observe(canvas);
  const resize=new ResizeObserver(()=>{if(globeRef.current){const width=canvas.clientWidth;globeRef.current.update({width,height:width,scale:width<768?1:1.15});requestPaint();}});
  resize.observe(canvas);
  const visibility=()=>{if(document.hidden)stop();else requestPaint();};
  const motionChange=()=>{stop();requestPaint();};
  document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',motionChange);
  return()=>{disposed=true;stop();intersection.disconnect();resize.disconnect();document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',motionChange);globeRef.current?.destroy();globeRef.current=null;wake.current=()=>{};};
 },[]);

 const pointerDown=(event:PointerEvent<HTMLCanvasElement>)=>{
  if(event.pointerType==='mouse'&&event.button!==0)return;
  pointer.current={x:event.clientX,y:event.clientY,...camera.current};event.currentTarget.setPointerCapture(event.pointerId);
 };
 const pointerMove=(event:PointerEvent<HTMLCanvasElement>)=>{
  if(!pointer.current)return;
  camera.current.phi=pointer.current.phi+(event.clientX-pointer.current.x)/250;
  camera.current.theta=Math.max(-1.2,Math.min(1.2,pointer.current.theta+(event.clientY-pointer.current.y)/450));wake.current();
 };
 const pointerUp=()=>{pointer.current=null;wake.current();};
 return <div className="visitor-globe" data-status={status}>
  <canvas ref={canvasRef} role="img" aria-label={`Automatically rotating globe showing visitors from ${markers.filter(marker=>marker.flag).length} countries and territories connected to Bharat Electricity in New Delhi`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onLostPointerCapture={pointerUp}/>
  {markers.map(marker=><span ref={node=>{if(node)labels.current.set(marker.id,node);else labels.current.delete(marker.id);}} className={marker.flag?'visitor-flag-badge':'visitor-globe-hub'} key={marker.id} title={marker.region}>{marker.flag?<img src={marker.flag} alt={`${marker.region} flag`} width={28} height={21}/>:marker.region}</span>)}
  {status!=='ready'&&<p className="visitor-globe-fallback">{status==='loading'?'Connecting our global community…':'Visitors from across the world connected at Bharat Electricity in New Delhi.'}</p>}
 </div>;
}
