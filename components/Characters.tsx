// Retrats provisionals dels personatges (SVG pla). Se substituiran pels dissenys definitius del canal.
export function Avatar({ id, className = 'h-16 w-16' }: { id: string; className?: string }) {
  const common = { viewBox: '0 0 80 80', className, 'aria-hidden': true } as const;
  if (id === 'cromo')
    return (
      <svg {...common}>
        <circle cx="40" cy="40" r="40" fill="#e7f7ee" />
        <path d="M58 58 q14 0 12 -12 q-2 -8 -9 -5 q-5 3 -1 7" fill="none" stroke="#2fb36a" strokeWidth="5" strokeLinecap="round" />
        <path d="M14 46 Q14 22 38 20 Q60 20 62 40 Q63 58 40 60 Q20 60 14 46 Z" fill="#2fb36a" stroke="#10243D" strokeWidth="2.5" />
        <path d="M24 22 l4 -7 l4 6 l4 -7 l4 7 l4 -6 l3 8" fill="#f2b134" stroke="#10243D" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="45" cy="36" r="10" fill="#fff" stroke="#10243D" strokeWidth="2.5" />
        <circle cx="48" cy="37" r="4.5" fill="#10243D" />
        <path d="M22 48 Q34 56 50 49" fill="none" stroke="#10243D" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="26" cy="38" r="2.2" fill="#10243D" />
      </svg>
    );
  if (id === 'profe')
    return (
      <svg {...common}>
        <circle cx="40" cy="40" r="40" fill="#e6eff9" />
        <path d="M18 44 Q16 16 40 15 Q64 16 62 44 L62 60 L18 60 Z" fill="#5a3b2a" />
        <circle cx="40" cy="42" r="19" fill="#f3d0b4" stroke="#10243D" strokeWidth="2" />
        <path d="M22 36 Q30 20 46 24 Q56 26 59 36 Q46 30 22 36 Z" fill="#5a3b2a" />
        <g fill="none" stroke="#3478C5" strokeWidth="2.5"><circle cx="33" cy="42" r="5.5" /><circle cx="47" cy="42" r="5.5" /><path d="M38.5 42 h3" /></g>
        <path d="M34 52 Q40 55 46 52" fill="none" stroke="#10243D" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 74 Q24 62 40 62 Q56 62 58 74" fill="#3478C5" />
      </svg>
    );
  if (id === 'presu')
    return (
      <svg {...common}>
        <circle cx="40" cy="40" r="40" fill="#fbf1dc" />
        <circle cx="40" cy="44" r="19" fill="#eec7a6" stroke="#10243D" strokeWidth="2" />
        <rect x="26" y="12" width="28" height="16" rx="2" fill="#10243D" /><rect x="20" y="26" width="40" height="5" rx="2" fill="#10243D" />
        <circle cx="33" cy="43" r="2.5" fill="#10243D" /><circle cx="47" cy="43" r="2.5" fill="#10243D" />
        <path d="M30 51 Q35 47 40 51 Q45 47 50 51 Q45 55 40 52 Q35 55 30 51 Z" fill="#8a8a8a" stroke="#10243D" strokeWidth="1.5" />
        <circle cx="62" cy="62" r="10" fill="#c8932a" stroke="#10243D" strokeWidth="2" />
        <text x="62" y="67" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="sans-serif">€</text>
      </svg>
    );
  return (
    <svg {...common}>
      <circle cx="40" cy="40" r="40" fill="#efe9fb" />
      <path d="M40 12 V20" stroke="#10243D" strokeWidth="2.5" /><circle cx="40" cy="11" r="3.5" fill="#e45a7a" />
      <rect x="20" y="20" width="40" height="34" rx="8" fill="#b9c3d0" stroke="#10243D" strokeWidth="2.5" />
      <rect x="27" y="31" width="9" height="8" rx="2" fill="#7a5ac8" /><rect x="44" y="31" width="9" height="8" rx="2" fill="#7a5ac8" />
      <path d="M30 46 h20" stroke="#10243D" strokeWidth="2.5" strokeDasharray="3 2" />
      <rect x="26" y="56" width="28" height="14" rx="4" fill="#7a5ac8" stroke="#10243D" strokeWidth="2" />
    </svg>
  );
}
