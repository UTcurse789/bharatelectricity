'use client';

import Lenis from 'lenis';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

export function SmoothScroll() {
 const path = usePathname();
 useEffect(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let scroll: Lenis | undefined;
  const destroyScroll = () => {
   // Reset native-scroll state first: a queued Lenis velocity timer can otherwise
   // restore its classes after destroy when motion preferences change mid-scroll.
   scroll?.stop();
   scroll?.destroy();
   scroll = undefined;
  };
  const update = () => {
   destroyScroll();
   scroll = preference.matches ? undefined : new Lenis({
    autoRaf: true,
    lerp: .12,
    smoothWheel: true,
    syncTouch: false,
    stopInertiaOnNavigate: true,
    prevent: node => node.matches('.mobile-nav, dialog, textarea, select, [data-native-scroll]'),
   });
   if (document.hidden || ['hidden', 'clip'].includes(document.body.style.overflow)) scroll?.stop();
  };
  update();
  preference.addEventListener('change', update);

  const header = document.querySelector('.header-main');
  const utility = document.querySelector('.utility-bar');
  const measureHeader = () => {
   const height = (header?.getBoundingClientRect().height || 0) + (utility?.getBoundingClientRect().height || 0);
   document.documentElement.style.setProperty('--scroll-header-offset', `${Math.ceil(height) + 16}px`);
  };
  const resize = new ResizeObserver(measureHeader);
  if (header) resize.observe(header);
  if (utility) resize.observe(utility);
  measureHeader();

  const onAnchor = (event: MouseEvent) => {
   if (!scroll || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
   const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
   if (!link || link.download || (link.target && link.target !== '_self')) return;
   const url = new URL(link.href, location.href);
   if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
   let id: string;
   try {id = decodeURIComponent(url.hash.slice(1));} catch {return;}
   const target = document.getElementById(id);
   if (!target) return;
   event.preventDefault();
   if (location.hash !== url.hash) history.pushState(null, '', url.hash);
   scroll.scrollTo(target, {onComplete: () => {
    // Preserve keyboard focus and the browser history for skip/section links.
    const needsTabIndex = !target.hasAttribute('tabindex') && !target.matches('a[href], button, input, select, textarea');
    if (needsTabIndex) target.setAttribute('tabindex', '-1');
    target.focus({preventScroll: true});
    if (needsTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once: true});
   }});
  };
  // Native keyboard scrolling and touch gestures can interrupt wheel inertia.
  const interrupt = () => scroll?.scrollTo(window.scrollY, {immediate: true});
  const onKey = (event: KeyboardEvent) => {
   if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) interrupt();
  };
  document.addEventListener('click', onAnchor);
  document.addEventListener('keydown', onKey);
  document.addEventListener('touchstart', interrupt, {passive: true});
  const onVisibility = () => {
   const locked = ['hidden', 'clip'].includes(document.body.style.overflow);
   if (document.hidden || locked) {interrupt(); scroll?.stop();}
   else {scroll?.start(); scroll?.resize();}
  };
  // Header menus and the gallery already lock body scrolling.
  const bodyLock = new MutationObserver(onVisibility);
  bodyLock.observe(document.body, {attributes: true, attributeFilter: ['style']});
  onVisibility();
  document.addEventListener('visibilitychange', onVisibility);
  return () => {
   destroyScroll();
   resize.disconnect();
   bodyLock.disconnect();
   preference.removeEventListener('change', update);
   document.removeEventListener('click', onAnchor);
   document.removeEventListener('keydown', onKey);
   document.removeEventListener('touchstart', interrupt);
   document.removeEventListener('visibilitychange', onVisibility);
  };
 }, [path]);
 return null;
}
