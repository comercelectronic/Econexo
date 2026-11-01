import { SITE } from '@/lib/site';
// ads.txt: declara Google AdSense com a venedor autoritzat. Usa l'identificador d'editor de lib/site.ts.
export const dynamic = 'force-static';
export function GET() {
  const pub = SITE.adsenseAccount.replace(/^ca-/, '');
  return new Response(pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : '', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
