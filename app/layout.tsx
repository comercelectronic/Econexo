import type { Metadata } from 'next';
import { Comic_Neue, Inter, Manrope } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const comic = Comic_Neue({ subsets: ['latin'], variable: '--font-comic-neue', weight: ['400', '700'], display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', weight: ['600', '700', '800'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} · ${SITE.claim}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, locale: 'es_ES', type: 'website' },
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.png' },
  // Verificació del web a AdSense (només si hi ha el client configurat a Netlify)
  other: { 'google-adsense-account': SITE.adsenseAccount }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable} ${comic.variable}`}>
      <body>
        <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:p-2">Saltar al contenido</a>
        <Header />
        <main id="contenido" className="mx-auto max-w-6xl px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
