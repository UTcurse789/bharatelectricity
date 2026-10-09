'use client';

import TextLoop from './TextLoop';

export function SectionRibbon({text, tone = 'orange'}: {text: string; tone?: 'orange' | 'green'}) {
 return <div className="section-ribbon" aria-hidden="true">
  <TextLoop text={text} shape="wave" curviness={90} speed={90} direction="forward" separator="✦" fontSize={46} fontWeight={800} letterSpacing={2} uppercase color={tone === 'orange' ? '#181818' : '#ffffff'} ribbon ribbonColor={tone === 'orange' ? '#f56a16' : '#08752c'} ribbonWidth={86} pauseOnHover={false}/>
 </div>;
}
