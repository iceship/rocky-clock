// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
  ],
  devtools: { enabled: true },
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
})
