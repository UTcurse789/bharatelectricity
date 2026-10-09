'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

const cards = '.company-card, .person-card, .partner-logo, .news-card, .album-link';
const sections = '.section, .energy-band, .enquiry-cta, .editorial-content > section';
const selector = `${cards}, ${sections}`;

export function ScrollEffects() {
 const path = usePathname();
 useEffect(() => {
  const main = document.querySelector('main');
  if (!main || !('IntersectionObserver' in window)) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let seen = new WeakSet<Element>();
  const animations = new Set<Animation>();
  const observer = new IntersectionObserver(entries => {
   for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const target = entry.target as HTMLElement;
    observer.unobserve(target);
    if (preference.matches) continue;
    const isCard = target.matches(cards);
    // Move a section's heading instead of moving its cards a second time.
    const heading = target.querySelector<HTMLElement>('.section-heading, h2, h3');
    const subject = !isCard && target.querySelector(cards) ? heading : target;
    if (!subject) continue;
    const siblings = Array.from(target.parentElement?.children || []);
    const delay = isCard ? (siblings.indexOf(target) % 4) * 45 : 0;
    const animation = subject.animate([
     {opacity: .92, transform: 'translate3d(0, 18px, 0)'},
     {opacity: 1, transform: 'translate3d(0, 0, 0)'}
    ], {duration: 560, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'});
    animations.add(animation);
    const release = () => animations.delete(animation);
    animation.onfinish = release;
    animation.oncancel = release;
   }
  }, {threshold: 0, rootMargin: '0px 0px -40px 0px'});
  const observe = (node: Element) => {
   const targets = node.matches(selector) ? [node, ...node.querySelectorAll(selector)] : node.querySelectorAll(selector);
   for (const target of targets) {
    if (seen.has(target)) continue;
    seen.add(target);
    if (!preference.matches) observer.observe(target);
   }
  };
  observe(main);
  // Include cards inserted by directory filters and "load more".
  const mutations = new MutationObserver(records => {
   for (const record of records) for (const node of record.addedNodes) {
    if (node instanceof Element) observe(node);
   }
  });
  mutations.observe(main, {childList: true, subtree: true});
  const reduce = () => {
   if (!preference.matches) {seen = new WeakSet<Element>(); observe(main); return;}
   observer.disconnect();
   animations.forEach(animation => animation.cancel());
   animations.clear();
  };
  preference.addEventListener('change', reduce);
  return () => {
   observer.disconnect();
   mutations.disconnect();
   preference.removeEventListener('change', reduce);
   animations.forEach(animation => animation.cancel());
  };
 }, [path]);
 return null;
}
