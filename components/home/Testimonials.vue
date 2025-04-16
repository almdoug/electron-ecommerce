<template>
  <section class="container mx-auto px-4 py-12">
    <UCarousel v-slot="{ item }" dots :items="testimonials" :ui="{ container: 'items-center', item: 'basis-1/3' }">
      <div class="rounded-xl border border-zinc-300 p-6">
        <div class="flex items-center mb-4">
          <div class="w-18 h-18 rounded-full overflow-hidden mr-3 border border-dashed border-secondary p-1">
            <NuxtImg :src="item.image" :alt="item.author" class="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h4 class="font-semibold text-blue-900">{{ item.author }}</h4>
          </div>
        </div>
        <p class="text-gray-600 text-sm bg-primary-system/30 rounded-xl p-4">
          {{ item.descrition }}
        </p>
      </div>
    </UCarousel>
  </section>
</template>

<script setup>
import { testimonials } from '~/mock/testimonials';
</script>