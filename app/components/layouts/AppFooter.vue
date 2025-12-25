<script setup lang="ts"></script>
<template>
  <!-- Improved footer -->
  <footer class="bg-card text-muted-foreground py-12">
    <div class="container mx-auto px-6">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span class="text-lg font-semibold text-foreground"
              >WorkForce Pro</span
            >
          </div>
          <p class="text-sm">
            Modern workforce management for the digital age.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-foreground mb-3">Product</h4>
          <div class="space-y-2 text-sm">
            <NuxtLink to="/features" class="block hover:text-white"
              >Features</NuxtLink
            >
            <NuxtLink to="/pricing" class="block hover:text-white"
              >Pricing</NuxtLink
            >
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-foreground mb-3">Company</h4>
          <div class="space-y-2 text-sm">
            <NuxtLink to="/about" class="block hover:text-white"
              >About</NuxtLink
            >
            <NuxtLink to="/contact" class="block hover:text-white"
              >Contact</NuxtLink
            >
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-foreground mb-3">Legal</h4>
          <div class="space-y-2 text-sm">
            <a href="#" class="block hover:text-white">Privacy</a>
            <a href="#" class="block hover:text-white">Terms</a>
          </div>
        </div>
      </div>
      <div class="border-t border-border pt-8 text-center text-sm">
        © {{ new Date().getFullYear() }} WorkForce Pro. All rights reserved.
      </div>
    </div>
  </footer>
</template>
