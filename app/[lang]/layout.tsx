import type { Metadata } from 'next';
import { Comic_Neue, Inter, Manrope } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LangProvider } from '@/components/LangProvider';
import { LANGS, isLang, tr, type Lang } from '@/lib/i18n';
import { SITE } from '@/lib/site';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const comic = Comic_Neue({ subsets: ['latin'], variable: '--font-comic-neue', weight: ['400', '700'], display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', weight: ['600', '700', '800'], display: 'swap' });

export const dynamicParams = false;
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));
type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tr(lang);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: `${SITE.name} · ${t(SITE.claim)}`, template: `%s · ${SITE.name}` },
    description: t(SITE.description),
    openGraph: { siteName: SITE.name, locale: lang === 'ca' ? 'ca_ES' : 'es_ES', type: 'website' },
    icons: { icon: '/favicon.png' },
    // Verificación del sitio en AdSense
    other: { 'google-adsense-account': SITE.adsenseAccount }
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang as Lang);
  return (
    <html lang={lang} className={`${inter.variable} ${manrope.variable} ${comic.variable}`}>
      <body>
        <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:p-2">{t('Saltar al contenido')}</a>
        <LangProvider lang={lang as Lang}>
          <Header lang={lang as Lang} />
          <main id="contenido" className="mx-auto max-w-6xl px-4">{children}</main>
          <Footer lang={lang as Lang} />
        </LangProvider>
      </body>
    </html>
  );
}
