import type {ImageLoaderProps} from 'next/image';
export default function imageLoader({src, width}: ImageLoaderProps) {
 if (/^\/assets\/site-refresh\/(raw-space|shell-scheme)\.webp$/.test(src)) return src.replace('.webp', '-' + width + '.webp');
 if (src === '/assets/bharat-electricity-2027-poster.webp') return src.replace('.webp','-'+width+'.webp');
 if (src === '/assets/energy-introduction/energy-landscape.webp') return src.replace('.webp', '-' + width + '.webp');
 if (/^\/assets\/exhibition-2025-\d+\.webp$/.test(src) || /^\/assets\/carousel\/[a-z0-9-]+\.webp$/.test(src)) return src.replace('.webp', '-' + width + '.webp');
 return src;
}
