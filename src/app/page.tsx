import type {Metadata} from 'next';
import {Home} from '@/components/Home';
import {JsonLd} from '@/components/JsonLd';
import {pageMetadata,seoTitle,seoDescription} from '@/lib/seo';
import {homeStructuredData} from '@/lib/structured-data';

export const metadata:Metadata={...pageMetadata({path:'/',title:seoTitle,description:seoDescription}),title:{absolute:seoTitle}};
export default function Page(){return <><JsonLd id="page-structured-data" data={homeStructuredData()}/><Home/></>;}
