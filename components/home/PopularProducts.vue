<template>
  <section class="container mx-auto px-4 py-8">
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-2xl font-bold text-blue-900">Popular products</h2>
      <div class="flex gap-2">
        <button @click="filterByCategory('all')"
          class="border border-gray-300 rounded-full px-4 py-1 text-sm hover:border-primary hover:text-primary"
          :class="{ 'border-primary text-primary': activeCategory === 'all' }">
          All
        </button>
        <button v-for="category in topCategories" :key="category.slug" @click="filterByCategory(category.slug)"
          class="border border-gray-300 rounded-full px-4 py-1 text-sm hover:border-primary hover:text-primary"
          :class="{ 'border-primary text-primary': activeCategory === category.slug }">
          {{ category.name }}
        </button>
      </div>
    </div>

    <UCarousel :items="productSlides" wrap v-slot="{ item: slide }" :ui="{ container: 'mb-8' }" dots>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard v-for="product in slide" :key="product.id" :product="product" />
      </div>
    </UCarousel>
  </section>
</template>

<script setup>
import { products } from '~/mock/products';
import { categories } from '~/mock/categories';
import ProductCard from '~/components/ui/ProductCard.vue';

const topCategories = computed(() => categories.slice(0, 4));

const activeCategory = ref('all');

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') {
    return products.slice(0, 16);
  }

  return products
    .filter(product => product.category === activeCategory.value)
    .slice(0, 16);
});

const productSlides = computed(() => {
  const slides = [];
  const productsArray = filteredProducts.value;

  for (let i = 0; i < productsArray.length; i += 8) {
    slides.push(productsArray.slice(i, i + 8));
  }

  return slides;
});

const filterByCategory = (category) => {
  activeCategory.value = category;
};
</script>