<template>
  <footer class="bg-primary-system/30 pt-12 pb-6">
    <div class="container mx-auto px-4 mb-12">
      <div class="bg-white p-8 rounded-2xl flex items-center justify-between">
        <div>
          <h3 class="text-xl font-extrabold text-primary">Subscribe newsletter</h3>
        </div>
        <div class="flex-1 max-w-md mx-8">
          <div class="relative">
            <input type="email" placeholder="Email address"
              class="w-full px-4 py-3 text-white rounded-2xl focus:outline-none bg-secondary placeholder:text-white" />
            <button
              class="cursor-pointer absolute right-0 top-0 h-full bg-secondary hover:bg-orange-400 text-white px-6 rounded-r-2xl">
              <Icon name="lucide:send" />
            </button>
          </div>
        </div>
        <div class="flex items-center">
          <div class="mr-3">
            <icon name="ph:headset" size="40" class="text-secondary" />
          </div>
          <div>
            <p class="text-sm text-zinc-800">Call us 24/7 :</p>
            <p class="font-semibold text-zinc-800">(+62) 0123 567 789</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 mb-8">
      <div class="grid grid-cols-4 gap-8">
        <div>
          <div class="text-xl font-bold text-secondary mb-6">
            <NuxtImg src="/images/logo-footer.png" alt="Logo Electron" />
          </div>
          <p class="text-gray-600 mb-4">
            64 st james boulevard<br>
            hoswick , ze2 7zj
          </p>
          <div class="flex gap-2">
            <a href="#"
              class="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-secondary hover:text-white">
              <icon name="ph:facebook-logo" />
            </a>
            <a href="#"
              class="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-secondary hover:text-white">
              <icon name="ph:twitter-logo" />
            </a>
            <a href="#"
              class="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-secondary hover:text-white">
              <icon name="ph:instagram-logo" />
            </a>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mb-6">Find product</h3>
          <ul class="space-y-3 text-gray-600">
            <li><a href="#" class="hover:text-secondary">Brownze arnold</a></li>
            <li><a href="#" class="hover:text-secondary">Chronograph blue</a></li>
            <li><a href="#" class="hover:text-secondary">Smart phones</a></li>
            <li><a href="#" class="hover:text-secondary">Automatic watch</a></li>
            <li><a href="#" class="hover:text-secondary">Hair straighteners</a></li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold mb-6">Get help</h3>
          <ul class="space-y-3 text-gray-600">
            <li><a href="#" class="hover:text-secondary">About us</a></li>
            <li><a href="#" class="hover:text-secondary">Contact us</a></li>
            <li><a href="#" class="hover:text-secondary">Return policy</a></li>
            <li><a href="#" class="hover:text-secondary">Privacy policy</a></li>
            <li><a href="#" class="hover:text-secondary">Payment policy</a></li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold mb-6">About us</h3>
          <ul class="space-y-3 text-gray-600">
            <li><a href="#" class="hover:text-secondary">News</a></li>
            <li><a href="#" class="hover:text-secondary">Service</a></li>
            <li><a href="#" class="hover:text-secondary">Our policy</a></li>
            <li><a href="#" class="hover:text-secondary">Custmer care</a></li>
            <li><a href="#" class="hover:text-secondary">FAQ's</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>