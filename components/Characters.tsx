// Retrats dels personatges. ECO i NEXO fan servir les il·lustracions oficials (amb expressions);
// els secundaris, un retrat SVG provisional.
import { characterById } from '@/lib/universo';

export function Avatar({ id, gesto = 'neutral', className = 'h-16 w-16' }: { id: string; gesto?: string; className?: string }) {
  const c = characterById(id);
  const src = c?.faces?.[gesto] || c?.faces?.neutral;
  if (src) return <img src={src} alt={c!.name} className={`${className} shrink-0 rounded-full object-cover ring-2 ring-white`} loading="lazy" />;
  const common = { viewBox: '0 0 80 80', className: `${className} shrink-0`, 'aria-hidden': true } as const;
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
