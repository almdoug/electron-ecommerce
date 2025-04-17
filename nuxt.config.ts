import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Electon - Electronics Store',
      meta: [
        { name: 'description', content: 'Electon - The best electronics store with unbeatable prices. Buy smartphones, laptops, cameras and more!' },
        { name: 'theme-color', content: '#EEA40B' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' }
      ]
    }
  },
  ssr: true, // SSR p melhor SEO
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxt/ui', '@nuxtjs/color-mode'],
  css: ['~/public/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode'
  },
  // Configurações SEO
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/categories',
        '/products',
        '/blog'
      ]
    }
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://electon.com.br',
      siteName: 'Electon - Electronics Store',
      siteDescription: 'Electon - The best electronics store with unbeatable prices. Buy smartphones, laptops, cameras and more!',
      language: 'en-US',
    }
  }
})