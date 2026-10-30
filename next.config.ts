import type { NextConfig } from 'next';

// Exportació estàtica: tota la web es genera en HTML i es publica a Netlify sense servidor
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
};

export default config;
