<script setup lang="ts">
import "vue-sonner/style.css";
</script>

<template>
  <div class="min-h-screen bg-background">
    <Toaster />
    <LayoutsAppNavbar />
    <div>
      <slot />
    </div>
    <LayoutsAppFooter />
  </div>
</template>
