'use client';
// Idioma actiu per als components de client (calculadores, tests, cercador…)
import { createContext, useContext } from 'react';
import { tr, type Lang, type TFn } from '@/lib/i18n';

const Ctx = createContext<Lang>('ca');
export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) { return <Ctx.Provider value={lang}>{children}</Ctx.Provider>; }
export const useLang = () => useContext(Ctx);
export const useT = (): TFn => tr(useContext(Ctx));
