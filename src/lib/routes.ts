import {consolidatedRoutes} from '@/content/initiatives';
import {paths} from '@/content/site';

export const routeAliases: Record<string,string> = {
 ...consolidatedRoutes,
 '/space-application-form-secondary':'/space-application-form',
 '/space-application-form-startups':paths.startups,
 '/exhibitor-list':'/participants-2025',
 '/participants-2026':paths.exhibitors,
 '/governing-council-2024':'/meet-our-confirm-advisory-committee',
 '/event':paths.about,'/about-the-events':paths.about,'/about':paths.about,'/about-the-event':paths.about,
 '/legacy':paths.legacy,'/speakers':paths.speakers,'/agenda':paths.agenda,'/gallery':paths.gallery,
 '/partners':paths.partners,'/news':paths.news,'/terms':paths.terms,'/visit':paths.visit,
 '/exhibit-at-powergen-india':paths.exhibit,'/exhibit-at-powergen-india/stand-options':paths.stands,
 '/why-exhibit':paths.exhibit,'/stand-options':paths.stands,'/contact':paths.contact
};

export function resolveCanonicalPath(path: string) {
 const clean=path.split(/[?#]/)[0].replace(/\/+$/,'')||'/';
 return routeAliases[clean]||clean;
}

export function canonicalPath(path: string) {
 const resolved=resolveCanonicalPath(path);
 return resolved==='/'?'/':resolved+'/';
}
