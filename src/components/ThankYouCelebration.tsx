'use client';

import {useEffect,useRef} from 'react';
import './ThankYouCelebration.css';

const colours=['#08752c','#f56a16','#ffbe39','#54a85b','#123e2a'];

export function ThankYouCelebration(){
 const canvas=useRef<HTMLCanvasElement>(null);
 const check=useRef<SVGSVGElement>(null);

 useEffect(()=>{
  const layer=canvas.current;
  if(!layer)return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const context=layer.getContext('2d');
  if(motion.matches||!context){layer.hidden=true;return;}

  let width=innerWidth,height=innerHeight,frame=0;
  const resize=()=>{
   width=innerWidth;height=innerHeight;
   const scale=Math.min(devicePixelRatio||1,2);
   layer.width=Math.round(width*scale);layer.height=Math.round(height*scale);
   context.setTransform(scale,0,0,scale,0,0);
  };
  resize();
  layer.hidden=false;
  // Restart the check when this page is entered again through client navigation.
  check.current?.getAnimations({subtree:true}).forEach(animation=>{animation.currentTime=0;animation.play();});

  const count=width<600?100:160;
  const launchY=Math.min(height-32,Math.max(height*.72,(check.current?.getBoundingClientRect().bottom||0)+100));
  const spread=width/95;
  const pieces=Array.from({length:count},(_,index)=>{
   const left=index%2===0;
   return {
    x:left?-12:width+12,y:launchY+Math.random()*36,
    vx:(left?1:-1)*spread*(.55+Math.random()),vy:-(7+Math.random()*8),
    size:5+Math.random()*5,rotation:Math.random()*Math.PI*2,
    spin:(Math.random()-.5)*.24,colour:colours[index%colours.length],
    round:index%5===0,delay:Math.random()*180
   };
  });
  const start=performance.now();
  let previous=start;
  const stop=()=>{
   cancelAnimationFrame(frame);
   context.clearRect(0,0,width,height);
   layer.hidden=true;
  };
  const draw=(now:number)=>{
   const elapsed=now-start,step=Math.min((now-previous)/16.667,2);
   previous=now;
   context.clearRect(0,0,width,height);
   if(elapsed>3800){stop();return;}
   for(const piece of pieces){
    const age=elapsed-piece.delay;
    if(age<0)continue;
    piece.vx*=Math.pow(.992,step);piece.vy+=.17*step;
    piece.x+=piece.vx*step;piece.y+=piece.vy*step;piece.rotation+=piece.spin*step;
    context.save();
    context.globalAlpha=Math.max(0,Math.min(1,(3500-age)/900));
    context.translate(piece.x,piece.y);context.rotate(piece.rotation);
    context.fillStyle=piece.colour;
    if(piece.round){context.beginPath();context.arc(0,0,piece.size*.4,0,Math.PI*2);context.fill();}
    else context.fillRect(-piece.size/2,-piece.size/3,piece.size,piece.size*.65*Math.cos(age/160));
    context.restore();
   }
   frame=requestAnimationFrame(draw);
  };
  frame=requestAnimationFrame(draw);
  const onVisibility=()=>{if(document.hidden)stop();};
  window.addEventListener('resize',resize);
  document.addEventListener('visibilitychange',onVisibility);
  motion.addEventListener('change',stop);
  return ()=>{
   stop();
   window.removeEventListener('resize',resize);
   document.removeEventListener('visibilitychange',onVisibility);
   motion.removeEventListener('change',stop);
  };
 },[]);

 return <>
  <canvas ref={canvas} className="thankyou-confetti" aria-hidden="true"/>
  <svg ref={check} className="thankyou-check" width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
   <circle className="thankyou-check-ring" cx="32" cy="32" r="27" pathLength="1"/>
   <path className="thankyou-check-tick" d="M19 32 28 41 45 24" pathLength="1"/>
  </svg>
 </>;
}
