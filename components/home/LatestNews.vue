<template>
  <section class="container mx-auto px-4 py-12">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-primary">Latest news</h2>
      <NuxtLink to="/blog" class="text-primary hover:text-secondary">
        View all
      </NuxtLink>
    </div>

    <UCarousel v-slot="{ item }" dots :items="blogPosts" :ui="{ container: 'items-center', item: 'basis-1/2' }">
      <div class="flex items-center rounded-xl shadow-sm overflow-hidden border border-zinc-300 p-6">
        <NuxtImg :src="item.image" :alt="item.title" class="w-full h-56 object-cover rounded-2xl" />
        <div class="p-6">
          <div class="text-primary text-sm mb-2 border border-gray-300 px-4 py-2 rounded-2xl w-fit">{{
            formatDate(item.publishedAt) }}</div>
          <h3 class="font-semibold text-primary mb-4">
            <NuxtLink :to="`/blog/${item.slug}`" class="hover:text-secondary">
              {{ item.title }}
            </NuxtLink>
          </h3>
          <p class="text-gray-600 text-sm mb-4">
            {{ item.excerpt }}
          </p>
          <p class="text-primary">by {{ item.author.name }}</p>
        </div>
      </div>
    </UCarousel>
  </section>
</template>

<script setup>
import { blogPosts } from '~/mock/blog';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.getMonth() + 1;
  const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const year = date.getFullYear();

  return `${day} ${monthNames[month - 1]} ${year}`;
};
</script>