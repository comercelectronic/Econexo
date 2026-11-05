import Link from 'next/link';
import { Mascotas } from '@/components/Mascotas';
export default function NotFound() {
  // Sin acceso al idioma en esta página: se muestra en los dos idiomas
  return (
    <div className="py-16 text-center">
      <Mascotas eco="confuso" nexo="esceptica" size="h-44" dice={{ quien: 'eco', texto: 'On ha anat la pàgina? / ¿Dónde ha ido la página?' }} className="mb-6" />
      <p className="text-sm font-bold tracking-widest text-teal">ERROR 404</p>
      <h1 className="mt-2 text-4xl font-extrabold text-navy">No encontramos esta página · No trobem aquesta pàgina</h1>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/ca/" className="rounded-lg bg-teal px-5 py-3 font-semibold text-white">Tornar a la portada</Link>
        <Link href="/es/" className="rounded-lg border border-navy px-5 py-3 font-semibold text-navy">Volver a la portada</Link>
      </div>
    </div>
  );
}
