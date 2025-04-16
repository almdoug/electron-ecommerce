<template>
  <HomeHeroBanner />
  <HomeCategories />
  <HomePopularProducts />
  <HomeSaleBanner />
  <HomeFeaturedProducts />
  <HomeBenefits />
  <HomeTestimonials />
  <HomeBrandPartners />
  <HomeLatestNews />
</template>

<script setup>
useHead({
  title: 'Electon - Loja de Eletrônicos',
  meta: [
    { name: 'description', content: 'Electon - A melhor loja de eletrônicos com preços imbatíveis. Compre smartphones, laptops, câmeras e mais!' },
    { name: 'keywords', content: 'eletrônicos, loja, e-commerce, smartphones, laptops, câmeras, fones de ouvido' },
    { property: 'og:title', content: 'Electon - Loja de Eletrônicos' },
    { property: 'og:description', content: 'Electon - A melhor loja de eletrônicos com preços imbatíveis. Compre smartphones, laptops, câmeras e mais!' },
    { property: 'og:image', content: '/images/og-image.jpg' },
    { property: 'og:url', content: 'https://electon.com.br' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Electon - Loja de Eletrônicos' },
    { name: 'twitter:description', content: 'Electon - A melhor loja de eletrônicos com preços imbatíveis. Compre smartphones, laptops, câmeras e mais!' },
    { name: 'twitter:image', content: '/images/og-image.jpg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://electon.com.br' }
  ]
});
</script>