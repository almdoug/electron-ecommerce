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
  title: 'Electon - Electronics Store',
  meta: [
    { name: 'description', content: 'Electon - The best electronics store with unbeatable prices. Buy smartphones, laptops, cameras and more!' },
    { name: 'keywords', content: 'electronics, store, e-commerce, smartphones, laptops, cameras, headphones' },
    { property: 'og:title', content: 'Electon - Electronics Store' },
    { property: 'og:description', content: 'Electon - The best electronics store with unbeatable prices. Buy smartphones, laptops, cameras and more!' },
    { property: 'og:image', content: '/images/og-image.jpg' },
    { property: 'og:url', content: 'https://electon.com' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Electon - Electronics Store' },
    { name: 'twitter:description', content: 'Electon - The best electronics store with unbeatable prices. Buy smartphones, laptops, cameras and more!' },
    { name: 'twitter:image', content: '/images/og-image.jpg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://electon.com' }
  ]
});
</script>