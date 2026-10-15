import type {Metadata} from 'next';
import {metadata as homeMetadata} from '../page';
export {default} from '../page';
export const metadata:Metadata={...homeMetadata,robots:{index:false,follow:true,googleBot:{index:false,follow:true}}};
