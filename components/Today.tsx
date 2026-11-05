'use client';
// Data del dia al navegador del lector (la web és estàtica: si es calculés en compilar, quedaria desfasada)
import { useEffect, useState } from 'react';
import { LOCALES, type Lang } from '@/lib/i18n';

export function Today({ lang }: { lang: Lang }) {
  const [d, setD] = useState('');
  useEffect(() => {
    const s = new Intl.DateTimeFormat(LOCALES[lang], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    setD(s.charAt(0).toUpperCase() + s.slice(1));
  }, [lang]);
  return <span suppressHydrationWarning>{d}</span>;
}
