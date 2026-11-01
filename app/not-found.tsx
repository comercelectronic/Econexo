import Link from 'next/link';
import { Mascotas } from '@/components/Mascotas';
export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <Mascotas eco="confuso" nexo="esceptica" size="h-44" dice={{ quien: 'eco', texto: '¿Dónde ha ido la página? ¡Yo no he sido!' }} className="mb-6" />
      <p className="text-sm font-bold tracking-widest text-teal">ERROR 404</p>
      <h1 className="mt-2 text-4xl font-extrabold text-navy">No encontramos esta página</h1>
      <p className="mt-3 text-muted">Puede que se haya movido o que la dirección no sea correcta.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-teal px-5 py-3 font-semibold text-white">Volver a la portada</Link>
    </div>
  );
}
