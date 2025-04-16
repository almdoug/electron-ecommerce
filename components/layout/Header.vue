<template>
  <header class="bg-primary">
    <div class="bg-gray-100 py-6 text-sm">
      <div class="container mx-auto flex justify-between items-center px-4">
        <div>
          <span>Need help? Call us:</span>
          <a href="tel:+12023456789" class="ml-2">+1 202 2345 6789</a>
        </div>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-secondary">
            <span class="inline-flex items-center">
              <icon name="ph:map-pin" class="mr-1" /> Our store
            </span>
          </a>
          <a href="#" class="hover:text-secondary">
            <span class="inline-flex items-center">
              <icon name="ph:truck" class="mr-1" /> Track your order
            </span>
          </a>
        </div>
      </div>
    </div>

    <div class="container mx-auto py-4 px-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-between">

          <div>
            <NuxtLink to="/">
              <NuxtImg src="/images/logo.png" alt="Logo Electron" sizes="200px" />
            </NuxtLink>
          </div>

          <div class="flex-1 max-w-xl ml-20">
            <div class="relative grid grid-cols-4">
              <input type="text" placeholder="Search any things"
                class="col-span-3 bg-white w-full px-4 py-2 border border-gray-300 rounded-l-xl focus:outline-none placeholder:text-zinc-800" />
              <button class="absolute right-0 top-0 h-full bg-secondary text-white px-4 rounded-xl">
                Search
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-6 text-white">
          <NuxtLink to="/login" class="flex items-center hover:text-secondary">
            <icon name="ph:user" class="mr-1" size="24" />
            <span>Sign in</span>
          </NuxtLink>

          <NuxtLink to="/registro" class="flex items-center hover:text-secondary">
            <icon name="ph:heart" class="mr-1" size="24" />
            <span>Sign in</span>
          </NuxtLink>

          <NuxtLink to="/carrinho" class="flex items-center hover:text-secondary relative">
            <icon name="ph:shopping-cart" size="24" />
            <span v-if="cartItemCount > 0"
              class="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{{
                cartItemCount }}</span>
            <span>Cart</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <nav class="bg-zinc-100 text-zinc-800">
      <div class="flex justify-between items-center container mx-auto px-4">
        <ul class="flex">
          <li class="py-4 mr-20 px-4 bg-secondary text-white cursor-pointer">
            <NuxtLink to="/categorias" class="flex items-center gap-2">Browse categories
              <icon name="lucide:chevron-down" class="mr-2" />
            </NuxtLink>
          </li>
          <li class="py-4 px-4 hover:bg-secondary hover:text-white cursor-pointer">
            <NuxtLink to="/" class="flex items-center gap-2">Home
              <icon name="lucide:chevron-down" class="mr-2" />
            </NuxtLink>
          </li>
          <li class="py-4 px-4 hover:bg-secondary hover:text-white cursor-pointer">
            <NuxtLink to="/catalogo" class="flex items-center gap-2">Catalog
              <icon name="lucide:chevron-down" class="mr-2" />
            </NuxtLink>
          </li>
          <li class="py-4 px-4 hover:bg-secondary hover:text-white cursor-pointer">
            <NuxtLink to="/blog">Blog</NuxtLink>
          </li>
          <li class="py-4 px-4 hover:bg-secondary hover:text-white cursor-pointer">
            <NuxtLink to="/paginas" class="flex items-center gap-2">Pages
              <icon name="lucide:chevron-down" class="mr-2" />
            </NuxtLink>
          </li>
          <li class="py-4 px-4 hover:bg-secondary hover:text-white cursor-pointer">
            <NuxtLink to="/sobre-nos">About us</NuxtLink>
          </li>
        </ul>
        <span class="font-bold text-primary">30 Days Free Return</span>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useCart } from '~/composables/useCart';

const { cartItemCount } = useCart();
</script>