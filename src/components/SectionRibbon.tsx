// Decorative SVG text stays static so scrolling does not trigger glyph layout and paint.
export function SectionRibbon({text,tone='orange'}:{text:string;tone?:'orange'|'green'}) {
 const pathId='section-ribbon-'+text.toLowerCase().replace(/[^a-z0-9]+/g,'-');
 const unit=text.toUpperCase()+' \u00a0✦\u00a0 ';
 return <div className="section-ribbon" aria-hidden="true" data-motion="static">
  <svg className="text-loop-svg" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid meet" focusable="false">
   <path id={pathId} d="M -320 260 Q -160 62 0 260 T 320 260 T 640 260 T 960 260 T 1280 260 T 1520 260" fill="none" stroke={tone==='orange'?'#f56a16':'#08752c'} strokeWidth={86} strokeLinecap="round" strokeLinejoin="round"/>
   <text fontSize={46} fontWeight={700} letterSpacing={2} fill={tone==='orange'?'#181818':'#ffffff'} dominantBaseline="central">
    <textPath href={'#'+pathId}>{unit.repeat(10)}</textPath>
   </text>
  </svg>
 </div>;
}
