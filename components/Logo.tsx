// Símbol: tres nodes connectats que formen una fletxa ascendent (connexió, informació i creixement)
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#10243D" />
      <path d="M10 28 L20 18 L26 23 L31 12" fill="none" stroke="#12A6A0" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="28" r="3.4" fill="#fff" />
      <circle cx="20" cy="18" r="3.4" fill="#3478C5" stroke="#fff" strokeWidth="1.5" />
      <circle cx="26" cy="23" r="2.6" fill="#fff" />
      <circle cx="31" cy="12" r="3.6" fill="#12A6A0" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-none">
        <span className={`block font-display text-xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-navy'}`}>ECO<span className="text-teal">NEXO</span></span>
        <span className={`hidden text-[10px] font-semibold tracking-[0.18em] sm:block ${dark ? 'text-white/70' : 'text-muted'}`}>COMERCIO Y MARKETING · FP</span>
      </span>
    </span>
  );
}
