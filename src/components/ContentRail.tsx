'use client';

import {useRef, type ReactNode} from 'react';
import {ArrowLeft, ArrowRight} from '@phosphor-icons/react';

export function ContentRail({label, children, className = ''}: {label: string; children: ReactNode; className?: string}) {
 const ref = useRef<HTMLDivElement>(null);
 const move = (direction: number) => {
  const rail = ref.current;
  if (!rail) return;
  rail.scrollBy({left: direction * rail.clientWidth * .85, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
 };
 return <div className={'content-rail ' + className}>
  <div className="rail-tools"><span>Use the arrows or swipe</span><div>
   <button type="button" aria-label={'Previous ' + label} onClick={() => move(-1)}><ArrowLeft size={22}/></button>
   <button type="button" aria-label={'Next ' + label} onClick={() => move(1)}><ArrowRight size={22}/></button>
  </div></div>
  <div ref={ref} className="rail-track" data-lenis-prevent-horizontal tabIndex={0} role="region" aria-label={label}>{children}</div>
 </div>;
}
