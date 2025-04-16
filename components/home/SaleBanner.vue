<template>
  <section class="container mx-auto px-4 py-8">
    <div
      class="flex items-center justify-end pe-24 bg-[url(/images/banner.jpg)] bg-no-repeat bg-center bg-cover rounded-lg overflow-hidden relative h-96">
      <div class="p-8">
        <div class="flex flex-col items-center max-w-md text-white">
          <div class="bg-secondary hover:border-secondary text-white px-6 py-2 rounded-xl inline-block mb-8">
            New laptop
          </div>
          <h2 class="text-3xl font-extrabold text-primary-system mb-4">Sale up to 50% off</h2>
          <p class="mb-6 text-gray-300">12 inch hd display</p>
          <NuxtLink to="/promocoes"
            class="bg-secondary hover:border-secondary text-white px-6 py-2 rounded-xl inline-block">
            Shop now
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>