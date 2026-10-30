import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { isPreview } from '@/lib/content';

export const dynamic = 'force-static';

// Les previsualitzacions (articles en revisió) no s'han d'indexar
export default function robots(): MetadataRoute.Robots {
  return isPreview ? { rules: { userAgent: '*', disallow: '/' } } : { rules: { userAgent: '*', allow: '/', disallow: ['/admin/'] }, sitemap: `${SITE.url}/sitemap.xml` };
}
