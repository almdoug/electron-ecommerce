<template>
  <section class="container mx-auto px-4 py-8">
    <UCarousel v-slot="{ item }" arrows :items="categories" :ui="{ item: 'basis-1/3' }">
      <NuxtLink :to="`/categoria/${item.slug}`"
        class="bg-white rounded-lg border border-zinc-300 p-6 flex items-center justify-around hover:shadow-md transition-shadow">
        <NuxtImg :src="item.image" :alt="item.name" class="w-24 h-24 object-contain" />
        <div>
          <h3 class="text-xl font-semibold text-primary mb-1">{{ item.name }}</h3>
          <p class="text-primary">({{ item.itemCount }} items)</p>
        </div>
      </NuxtLink>
    </UCarousel>
  </section>
</template>

<script setup lang="ts">
import { categories } from '~/mock/categories';
</script>