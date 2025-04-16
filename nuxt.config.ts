import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Electon - Loja de Eletrônicos',
      meta: [
        { name: 'description', content: 'Electon - A melhor loja de eletrônicos com preços imbatíveis. Compre smartphones, laptops, câmeras e mais!' },
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
        '/categorias',
        '/produtos',
        '/blog'
      ]
    }
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://electon.com.br',
      siteName: 'Electon - Loja de Eletrônicos',
      siteDescription: 'Electon - A melhor loja de eletrônicos com preços imbatíveis. Compre smartphones, laptops, câmeras e mais!',
      language: 'pt-BR',
    }
  }
})