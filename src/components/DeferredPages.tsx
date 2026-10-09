'use client';
import dynamic from 'next/dynamic';
const Archive=dynamic(()=>import('./LegacyPage').then(module=>module.LegacyPage));
export function DeferredLegacyPage(){return <Archive/>;}
