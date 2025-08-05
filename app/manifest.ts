import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nomad Spots',
    short_name: 'NomadSpots',
    description: 'Find the next rest spot',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/yurt-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/yurt-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
