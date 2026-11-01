// ads.txt: declara Google AdSense com a venedor autoritzat. Només té contingut si hi ha NEXT_PUBLIC_ADSENSE_CLIENT.
export const dynamic = 'force-static';
export function GET() {
  const pub = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '').replace(/^ca-/, '');
  return new Response(pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : '', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
