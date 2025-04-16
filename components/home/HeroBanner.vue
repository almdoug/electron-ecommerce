<template>
  <section class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg p-8">
      <UCarousel v-slot="{ item }" fade loop autoplay dots :items="featuredProducts"
        :ui="{ container: 'items-center' }">
        <div class="flex items-center justify-around">
          <div class="max-w-md">
            <h1 class="text-3xl font-bold text-blue-900 mb-4">{{ item.title }}</h1>
            <div class="flex gap-4 mb-6">
              <NuxtLink :to="`/produtos/${item.id}`"
                class="bg-secondary hover:bg-orange-400 text-white px-6 py-2 rounded-xl">
                Shop now
              </NuxtLink>
              <NuxtLink :to="`/produtos/${item.id}`"
                class="border border-primary text-primary hover:border-secondary hover:text-secondary px-6 py-2 rounded-xl">
                View more
              </NuxtLink>
            </div>
          </div>
          <div class="relative">
            <NuxtImg :src="item.images[0]" :alt="item.title" sizes="300px" />
            <div class="absolute bottom-0 right-0 bg-secondary text-white p-3 rounded-full flex flex-col items-center">
              <div class="text-sm">only</div>
              <div class="text-2xl font-bold">${{ item.discountedPrice ? item.discountedPrice :
                item.price }}</div>
            </div>
          </div>
        </div>
      </UCarousel>
    </div>
  </section>
</template>

<script setup lang="ts">
import { products } from '~/mock/products';

const featuredProducts = products.filter(product => product.featured);
</script>