import type { MetadataRoute } from 'next';

/** Lets the teacher install the app (an icon on the desktop or phone) and open it offline. */
const manifest = (): MetadataRoute.Manifest => ({
  name: 'Professor Utils',
  short_name: 'Professor Utils',
  description: 'Listas de chamada, listas de notas e relatórios da turma em poucos minutos.',
  lang: 'pt-BR',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#171717',
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    {
      src: '/icons/icon-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
});

export default manifest;
