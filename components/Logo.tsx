// Marca: les cares d'ECO i NEXO juntes + el nom. «ECO» en corall, «y» petita i «NEXO» en turquesa.
export function LogoMark({ className = 'h-11' }: { className?: string }) {
  return (
    <span className={`flex shrink-0 items-center ${className}`} aria-hidden="true">
      <img src="/media/personajes/cara-eco-contento.webp" alt="" className="h-full w-auto rounded-full bg-white object-cover ring-[2.5px] ring-black" />
      <img src="/media/personajes/cara-nexo-satisfecha.webp" alt="" className="-ml-3 h-full w-auto rounded-full bg-white object-cover ring-[2.5px] ring-black" />
    </span>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="leading-none">
        <span className="block font-display text-2xl font-extrabold tracking-tight"><span className="text-uni">ECO</span><span className={`mx-0.5 text-base font-bold ${dark ? 'text-white/70' : 'text-muted'}`}>y</span><span className={dark ? 'text-teal' : 'text-teal-dark'}>NEXO</span></span>
        <span className={`hidden text-[10px] font-semibold tracking-[0.16em] sm:block ${dark ? 'text-white/70' : 'text-muted'}`}>APRENDE CON NEXO · NO HAGAS EL ECO</span>
      </span>
    </span>
  );
}
