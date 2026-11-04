import {consolidatedRoutes} from '@/content/initiatives';
import {paths} from '@/content/site';
import urlMigrations from '@/content/url-migrations.json';

export const routeAliases: Record<string,string> = {
 ...urlMigrations,
 ...consolidatedRoutes,
 '/space-application-form-secondary':'/space-application-form',
 '/space-application-form-startups':paths.startups,
 '/exhibitor-list':paths.exhibitors,
 '/exhibitors':paths.exhibitors,
 '/participants-2025':paths.exhibitors,
 '/2024-exhibitors':paths.exhibitors,
 '/participants-2026':paths.exhibitors,
 '/governing-council-2024':'/meet-our-confirm-advisory-committee',
 '/event':paths.about,'/about-the-events':paths.about,'/about':paths.about,'/about-the-event':paths.about,
 '/legacy':paths.legacy,'/speakers':paths.speakers,'/agenda':paths.agenda,'/gallery':paths.gallery,
 '/partners':paths.partners,'/news':paths.news,'/terms':paths.terms,'/visit':paths.visit,
 '/exhibit-at-bharat-electricity':paths.exhibit,'/exhibit-at-bharat-electricity/stand-options':paths.stands,
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
