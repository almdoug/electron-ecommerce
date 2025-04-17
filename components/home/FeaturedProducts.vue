<template>
    <section class="container mx-auto px-4 py-8">
        <div class="flex gap-6">
            <div class="flex items-center w-2/3 border border-zinc-300 rounded-xl">
                <UCarousel v-slot="{ item }" loop autoplay dots :items="featuredProducts.slice(0, 2)"
                    :ui="{ container: 'items-center' }">
                    <div class="flex items-center justify-center gap-24">
                        <NuxtImg :src="item.images[0]" :alt="item.title" sizes="300px" />
                        <div class="max-w-md">
                            <h1 class="text-3xl font-bold text-blue-900 mb-4">{{ item.title }}</h1>
                            <div class="flex gap-4 mb-6">
                                ${{ item.price.toFixed(2) }}
                            </div>
                            <div class="flex text-zinc-300">
                                <template v-for="i in 5" :key="i">
                                    <icon :name="i <= item.rating ? 'ph:star-fill' : 'ph:star'" />
                                </template>
                            </div>
                            <div class="flex gap-4 mt-4">
                                <div
                                    class="flex items-center justify-center w-18 h-18 font-extrabold p-4 rounded-full bg-primary-system/30 text-secondary">
                                    57</div>
                                <div
                                    class="flex items-center justify-center w-18 h-18 font-extrabold p-4 rounded-full bg-primary-system/30 text-secondary">
                                    11</div>
                                <div
                                    class="flex items-center justify-center w-18 h-18 font-extrabold p-4 rounded-full bg-primary-system/30 text-secondary">
                                    33</div>
                                <div
                                    class="flex items-center justify-center w-18 h-18 font-extrabold p-4 rounded-full bg-primary-system/30 text-secondary">
                                    59</div>
                            </div>
                            <div class="flex items-center justify-center gap-2 mt-5">
                                <button
                                    class="bg-primary-system hover:border-secondary text-zinc-800 py-2 rounded-xl flex-grow flex items-center justify-center">
                                    Add to cart
                                    <div
                                        class="flex items-center justify-center p-2 rounded-full bg-secondary ml-3 text-white">
                                        <icon name="ph:shopping-cart" />
                                    </div>
                                </button>
                                <NuxtLink :to="`/products/${item.id}`"
                                    class="flex items-center bg-primary-system p-4 rounded-xl hover:border-primary hover:text-primary">
                                    <icon name="ph:eye" />
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </UCarousel>
            </div>

            <div class="w-1/3 flex flex-col gap-6">
                <NuxtLink v-for="product in featuredProducts.slice(2, 4)" :key="product.id"
                    :to="`/products/${product.id}`"
                    class="border border-zinc-300 rounded-xl p-6 flex items-center gap-8 hover:shadow-md transition-shadow duration-300">
                    <NuxtImg :src="product.images[0]" :alt="product.title" class="h-48 object-contain mb-4" />
                    <div class="flex flex-col">
                        <h3 class="text-xl font-bold text-blue-900 mb-2">{{ product.title }}</h3>
                        <div class="flex gap-2 mb-2">
                            <span class="font-semibold">${{ product.price.toFixed(2) }}</span>
                            <span v-if="product.discountedPrice" class="text-gray-500 line-through">${{
                                product.discountedPrice.toFixed(2) }}</span>
                        </div>
                        <div class="flex text-zinc-300 mb-4">
                            <template v-for="i in 5" :key="i">
                                <icon :name="i <= product.rating ? 'ph:star-fill' : 'ph:star'" />
                            </template>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { products } from '~/mock/products';

const featuredProducts = products.filter(product => product.featured);
</script>