// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-11',
  devtools: { enabled: true },
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
  ],
  hub: {
    cache: true
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
