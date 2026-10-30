'use client';
// Data del dia al navegador del lector (la web és estàtica: si es calculés en compilar, quedaria desfasada)
import { useEffect, useState } from 'react';

export function Today() {
  const [d, setD] = useState('');
  useEffect(() => {
    const s = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    setD(s.charAt(0).toUpperCase() + s.slice(1));
  }, []);
  return <span suppressHydrationWarning>{d}</span>;
}
