// 404 global (adreces que no existeixen): bilingüe, perquè no sabem l'idioma del visitant
import './globals.css';
export const metadata = { title: '404 · ECOyNEXO' };
export default function GlobalNotFound() {
  return (
    <html lang="ca">
      <body>
        <main style={{ maxWidth: 640, margin: '0 auto', padding: '6rem 1rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <p style={{ color: '#12A6A0', fontWeight: 700, letterSpacing: '.1em' }}>ERROR 404</p>
          <h1 style={{ fontSize: '2rem', color: '#10243D', margin: '.5rem 0' }}>No trobem aquesta pàgina · No encontramos esta página</h1>
          <p><a href="/ca/" style={{ color: '#3478C5' }}>Tornar a la portada</a> · <a href="/es/" style={{ color: '#3478C5' }}>Volver a la portada</a></p>
        </main>
      </body>
    </html>
  );
}
