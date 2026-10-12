import Image from 'next/image';
import type {CSSProperties} from 'react';
import metrics from '@/content/logo-metrics.json';
import './LogoImage.css';

type Bounds={width:number;height:number;x:number;y:number;contentWidth:number;contentHeight:number};
type Props={src:string;alt:string;width?:number;height?:number;sizes?:string;loading?:'lazy'|'eager';onError?:()=>void;maxWidth?:number;maxHeight?:number};
export function LogoImage({src,alt,width=260,height=140,sizes='220px',loading='lazy',onError,maxWidth=220,maxHeight=88}:Props){
 const bounds=(metrics as Record<string,Bounds>)[src];
 if(!bounds)return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} loading={loading} unoptimized onError={onError} style={{width:`min(100%, ${maxWidth}px, ${maxHeight*width/height}px)`,height:'auto',maxHeight}}/>;
 const {contentWidth: cw,contentHeight: ch}=bounds;
 const style:CSSProperties={aspectRatio:`${cw} / ${ch}`,width:`min(100%, ${maxWidth}px, ${maxHeight*cw/ch}px)`};
 return <span className="logo-viewport" style={style} data-logo-width={cw} data-logo-height={ch}>
  <Image src={src} alt={alt} width={bounds.width} height={bounds.height} sizes={sizes} loading={loading} unoptimized onError={onError} style={{position:'absolute',width:`${100*bounds.width/cw}%`,height:`${100*bounds.height/ch}%`,maxWidth:'none',maxHeight:'none',left:`${-100*bounds.x/cw}%`,top:`${-100*bounds.y/ch}%`}}/>
 </span>;
}
