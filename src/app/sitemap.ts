import type {MetadataRoute} from 'next';
import {pages} from '@/content/pages';
import {companies,people,articles} from '@/lib/content';
import {canonicalUrl} from '@/lib/seo';

export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap {
 const paths=['/',...pages.map(page=>page.path),...companies.map(company=>'/exhibitors/'+company.id),...people.map(person=>'/speakers/'+person.id),...articles.map(article=>'/industry-news/'+article.id)];
 return [...new Set(paths.map(canonicalUrl))].map(url=>({url}));
}
