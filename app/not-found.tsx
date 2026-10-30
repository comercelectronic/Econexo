import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-sm font-bold tracking-widest text-teal">ERROR 404</p>
      <h1 className="mt-2 text-4xl font-extrabold text-navy">No encontramos esta página</h1>
      <p className="mt-3 text-muted">Puede que se haya movido o que la dirección no sea correcta.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-teal px-5 py-3 font-semibold text-white">Volver a la portada</Link>
    </div>
  );
}
