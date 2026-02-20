// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@vite-pwa/nuxt', '@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
      ],
    },
  },
  compatibilityDate: '2025-12-11',
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  pwa: {
    manifest: {
      name: 'Eridian Clock',
      short_name: 'RockyClock',
      description: 'Project Hail Mary Eridian Time Tracker',
      theme_color: '#0891b2',
      background_color: '#0a0a0a',
      display: 'standalone',
      icons: [
        {
          src: 'web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
    },
  },
})
